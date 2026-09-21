/* ==================================================================
   AI Data Handling Quiz - prototype logic
   Depends on questions.js (COLORS, QUESTIONS). No libraries.
   ================================================================== */

(function () {
  "use strict";

  var PASS_MARK = 16; // out of 20

  /* ---------- state ---------- */
  var deck = [];       // questions in play this run
  var index = 0;       // position in deck
  var answered = false;// has the current question been answered
  var results = {};    // { [questionId]: { given, correct } }

  /* ---------- element lookup ---------- */
  var el = {
    screens: {
      start: document.getElementById("screen-start"),
      quiz: document.getElementById("screen-quiz"),
      results: document.getElementById("screen-results"),
    },
    legend: document.getElementById("legend"),
    startHeading: document.getElementById("start-heading"),
    resultHeading: document.getElementById("result-heading"),
    miniLegend: document.getElementById("mini-legend-body"),
    counter: document.getElementById("counter"),
    scoreLive: document.getElementById("score-live"),
    progress: document.getElementById("progress-fill"),
    progressTrack: document.getElementById("progress-track"),
    prompt: document.getElementById("q-prompt"),
    options: document.getElementById("options"),
    feedback: document.getElementById("feedback"),
    next: document.getElementById("btn-next"),
    verdict: document.getElementById("result-verdict"),
    number: document.getElementById("result-number"),
    line: document.getElementById("result-line"),
    breakdown: document.getElementById("breakdown"),
    review: document.getElementById("review"),
    reviewTitle: document.getElementById("review-title"),
    reviewLede: document.getElementById("review-lede"),
    retryMissed: document.getElementById("btn-retry-missed"),
  };

  /* ---------- small helpers ---------- */
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

  function show(name, focusTarget) {
    Object.keys(el.screens).forEach(function (key) {
      el.screens[key].hidden = key !== name;
    });
    window.scrollTo({ top: 0, behavior: REDUCED && REDUCED.matches ? "auto" : "smooth" });
    // the control that was just clicked is now hidden, so focus would fall to
    // <body> and a keyboard or screen-reader user would lose their place
    if (focusTarget) focusTarget.focus();
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function scoreSoFar() {
    return Object.keys(results).filter(function (id) {
      return results[id].correct;
    }).length;
  }

  /* ---------- static content: legends ---------- */
  function buildLegend() {
    ["RED", "YELLOW", "GREEN"].forEach(function (key) {
      var c = COLORS[key];
      var item = make("div", "legend-item is-" + key);
      item.appendChild(make("span", "legend-chip", c.label));
      var body = make("div");
      body.appendChild(make("p", "legend-rule", c.rule));
      body.appendChild(make("p", "legend-blurb", c.blurb));
      item.appendChild(body);
      el.legend.appendChild(item);
    });

    var list = make("ul");
    ["RED", "YELLOW", "GREEN"].forEach(function (key) {
      var li = make("li", "ml-" + key);
      var b = make("b", null, COLORS[key].label);
      li.appendChild(b);
      li.appendChild(document.createTextNode(" - " + COLORS[key].rule));
      list.appendChild(li);
    });
    el.miniLegend.appendChild(list);
  }

  /* ---------- rendering a question ---------- */
  function renderQuestion() {
    var q = deck[index];
    answered = false;

    el.counter.textContent = "Question " + (index + 1) + " of " + deck.length;
    el.scoreLive.textContent = scoreSoFar() + " correct";
    setProgress(index, deck.length);

    el.prompt.textContent = q.prompt;

    el.feedback.hidden = true;
    el.feedback.className = "feedback";
    clear(el.feedback);
    el.next.hidden = true;

    clear(el.options);
    if (q.type === "color") {
      ["RED", "YELLOW", "GREEN"].forEach(function (key, i) {
        el.options.appendChild(colorOption(q, key, i + 1));
      });
    } else {
      q.options.forEach(function (opt, i) {
        el.options.appendChild(choiceOption(q, opt, i));
      });
    }
  }

  function setProgress(done, total) {
    el.progress.style.transform = "scaleX(" + (total ? done / total : 0) + ")";
    el.progressTrack.setAttribute("aria-valuenow", String(done));
    el.progressTrack.setAttribute("aria-valuemax", String(total));
    el.progressTrack.setAttribute("aria-valuetext",
      "Question " + Math.min(done + 1, total) + " of " + total);
  }

  function colorOption(q, key, num) {
    var btn = make("button", "opt opt-color opt-" + key);
    btn.type = "button";
    btn.dataset.value = key;

    btn.appendChild(make("span", "opt-key", String(num)));
    btn.appendChild(make("span", "opt-swatch"));

    var text = make("span", "opt-text", COLORS[key].label);
    text.appendChild(make("span", "opt-sub", COLORS[key].rule));
    btn.appendChild(text);

    btn.addEventListener("click", function () { answer(q, key); });
    return btn;
  }

  function choiceOption(q, opt, i) {
    var btn = make("button", "opt");
    btn.type = "button";
    btn.dataset.value = opt.id;
    btn.appendChild(make("span", "opt-key", String.fromCharCode(65 + i)));
    btn.appendChild(make("span", "opt-text", opt.text));
    btn.addEventListener("click", function () { answer(q, opt.id); });
    return btn;
  }

  /* ---------- answering ---------- */
  function answer(q, given) {
    if (answered) return;
    answered = true;

    var correct = given === q.answer;
    results[q.id] = { given: given, correct: correct };

    // mark every option
    Array.prototype.forEach.call(el.options.children, function (btn) {
      // aria-disabled, not disabled: a disabled button leaves the tab order,
      // which hides the answer a screen-reader user just gave
      btn.setAttribute("aria-disabled", "true");
      var value = btn.dataset.value;
      if (value === q.answer) {
        btn.classList.add("is-correct");
        btn.appendChild(make("span", "opt-mark", "Correct"));
      } else if (value === given) {
        btn.classList.add("is-wrong");
        btn.appendChild(make("span", "opt-mark", "Your answer"));
      } else {
        btn.classList.add("is-muted");
      }
    });

    showFeedback(q, correct);

    el.scoreLive.textContent = scoreSoFar() + " correct";
    el.next.hidden = false;
    el.next.textContent = index === deck.length - 1 ? "See results" : "Next question";
    el.next.focus();
  }

  function showFeedback(q, correct) {
    clear(el.feedback);
    el.feedback.className = "feedback " + (correct ? "good" : "bad");

    var headText;
    if (q.type === "color") {
      headText = (correct ? "Correct - " : "Not quite - ") + "this is " + q.answer + ".";
    } else {
      headText = correct ? "Correct." : "Not quite.";
    }
    el.feedback.appendChild(make("p", "fb-head", headText));
    el.feedback.appendChild(make("p", "fb-why", q.why));

    if (q.action) {
      var action = make("p", "fb-action");
      action.appendChild(make("strong", null, "In practice"));
      action.appendChild(document.createTextNode(q.action));
      el.feedback.appendChild(action);
    }
    if (q.source) {
      el.feedback.appendChild(make("p", "fb-source", q.source));
    }
    el.feedback.hidden = false;
  }

  function next() {
    if (index < deck.length - 1) {
      index++;
      renderQuestion();
    } else {
      renderResults();
    }
  }

  /* ---------- results ---------- */
  function renderResults() {
    var total = QUESTIONS.length;
    var answeredIds = Object.keys(results);
    var score = scoreSoFar();
    var passed = score >= PASS_MARK;
    var partial = answeredIds.length < total; // a "retry missed" run

    setProgress(deck.length, deck.length);

    el.verdict.className = "result-verdict " + (passed ? "pass" : "fail");
    el.verdict.textContent = passed ? "Passed" : "Keep reviewing";
    el.number.textContent = String(score);

    if (partial) {
      el.line.textContent =
        "That includes the questions you answered correctly the first time through. " +
        (passed
          ? "You are now above the " + PASS_MARK + " of " + total + " pass mark."
          : "You need " + PASS_MARK + " of " + total + " to pass.");
    } else if (passed) {
      el.line.textContent =
        "You have a solid handle on the color system. The habit that matters most day to day: classify the data first, then check where it is going.";
    } else {
      el.line.textContent =
        "You need " + PASS_MARK + " of " + total + " to pass. Read through the review below, then retry the ones you missed.";
    }

    buildBreakdown(score, total);
    buildReview();

    el.retryMissed.hidden = score === total;
    show("results", el.resultHeading);
  }

  function buildBreakdown(score, total) {
    clear(el.breakdown);

    var cells = [
      { label: "Score", num: score + "/" + total, cls: "" },
      { label: "RED missed", num: missedIn("RED"), cls: "is-RED" },
      { label: "YELLOW missed", num: missedIn("YELLOW"), cls: "is-YELLOW" },
      { label: "GREEN missed", num: missedIn("GREEN"), cls: "is-GREEN" },
    ];

    cells.forEach(function (cell) {
      var node = make("div", "bd-cell " + cell.cls);
      node.appendChild(make("span", "bd-num", String(cell.num)));
      node.appendChild(make("span", "bd-label", cell.label));
      el.breakdown.appendChild(node);
    });
  }

  function missedIn(color) {
    return QUESTIONS.filter(function (q) {
      return q.type === "color" && q.answer === color && results[q.id] && !results[q.id].correct;
    }).length;
  }

  function labelFor(q, value) {
    if (value == null) return "Not answered";
    if (q.type === "color") return value;
    var match = q.options.filter(function (o) { return o.id === value; })[0];
    return match ? match.text : value;
  }

  function buildReview() {
    clear(el.review);

    // only the misses - a full 20-item list buries the part worth reading
    var missed = [];
    QUESTIONS.forEach(function (q, i) {
      var res = results[q.id];
      if (res && !res.correct) missed.push({ q: q, res: res, number: i + 1 });
    });

    if (!missed.length) {
      el.reviewTitle.textContent = "Nothing to review";
      el.reviewLede.textContent =
        "You answered every question correctly. The habit worth keeping: classify the data first, then check where it is going.";
      el.review.hidden = true;
      return;
    }

    el.review.hidden = false;
    el.reviewTitle.textContent = missed.length === 1 ? "The one you missed" : "What you missed";
    el.reviewLede.textContent =
      missed.length === 1
        ? "The single question you got wrong, and why the answer lands where it does."
        : "The " + missed.length + " questions you got wrong, and why each answer lands where it does.";

    missed.forEach(function (entry) {
      var q = entry.q;
      var item = make("li", "review-item");

      var top = make("div", "rv-top");
      top.appendChild(make("span", "rv-num", String(entry.number)));

      var body = make("div");
      body.style.flex = "1";
      body.appendChild(make("p", "rv-q", q.prompt));
      top.appendChild(body);
      item.appendChild(top);

      var answers = make("p", "rv-answers");
      answers.appendChild(make("span", "rv-yours wrong", "You chose: " + labelFor(q, entry.res.given)));
      answers.appendChild(make("br"));
      answers.appendChild(document.createTextNode("Correct answer: "));
      if (q.type === "color") {
        answers.appendChild(make("span", "pill pill-" + q.answer, q.answer));
      } else {
        answers.appendChild(make("span", "rv-right", labelFor(q, q.answer)));
      }
      item.appendChild(answers);

      item.appendChild(make("p", "rv-why", q.why));
      if (q.action) {
        var action = make("p", "rv-why rv-action");
        action.appendChild(make("strong", null, "In practice: "));
        action.appendChild(document.createTextNode(q.action));
        item.appendChild(action);
      }
      if (q.source) {
        item.appendChild(make("p", "rv-source", q.tag + " \u00b7 " + q.source));
      }

      el.review.appendChild(item);
    });
  }

  /* ---------- run control ---------- */
  function startFull() {
    deck = QUESTIONS.slice();
    index = 0;
    results = {};
    renderQuestion();
    show("quiz", el.prompt);
  }

  function retryMissed() {
    var missed = QUESTIONS.filter(function (q) {
      return results[q.id] && !results[q.id].correct;
    });
    if (!missed.length) return;

    // keep correct answers, drop the missed ones so they are re-scored
    missed.forEach(function (q) { delete results[q.id]; });

    deck = missed;
    index = 0;
    renderQuestion();
    show("quiz", el.prompt);
  }

  /* ---------- wiring ---------- */
  document.getElementById("btn-start").addEventListener("click", startFull);
  document.getElementById("btn-restart").addEventListener("click", startFull);
  el.retryMissed.addEventListener("click", retryMissed);
  el.next.addEventListener("click", next);

  // keyboard: 1-4 pick an answer, Enter advances
  document.addEventListener("keydown", function (e) {
    if (el.screens.quiz.hidden) return;

    if (!answered && e.key >= "1" && e.key <= "4") {
      var btn = el.options.children[Number(e.key) - 1];
      if (btn) { btn.click(); e.preventDefault(); }
      return;
    }
    if (answered && e.key === "Enter" && document.activeElement !== el.next &&
        !el.options.contains(document.activeElement)) {
      next();
      e.preventDefault();
    }
  });

  buildLegend();
})();
