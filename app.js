/* ==================================================================
   AI Quiz - prototype logic
   Depends on questions.js (v1: COLORS, QUESTIONS),
   questions-v2.js (v2: QUESTIONS_V2) and
   questions-v3.js (v3: STAGES, QUESTIONS_V3). No libraries.
   ================================================================== */

(function () {
  "use strict";

  var PASS_MARK = 16; // out of 20
  var DEFAULT_VERSION = "v2";
  var STORE_KEY = "ai-quiz-version";

  /* ---------- versions ----------
     Each version brings its own question bank, header copy and results
     breakdown. Version-specific markup in index.html carries a
     data-version attribute and is shown only while that version is active. */
  var VERSIONS = {
    v1: {
      title: "AI Data Handling Quiz",
      tagline: "Knowing what you can share, and where",
      questions: QUESTIONS,
      minutes: 8,
      // which breakdown cell a question counts toward
      groupOf: function (q) { return q.type === "color" ? q.answer : null; },
      groups: [
        { key: "RED", label: "RED missed", cls: "is-RED" },
        { key: "YELLOW", label: "YELLOW missed", cls: "is-YELLOW" },
        { key: "GREEN", label: "GREEN missed", cls: "is-GREEN" },
      ],
      subject: "the color system",
      habit: "classify the data first, then check where it is going.",
    },
    v2: {
      title: "AI Prompting and Verification Quiz",
      tagline: "Asking well, and checking what comes back",
      questions: QUESTIONS_V2,
      minutes: 12,
      groupOf: function (q) { return q.skill; },
      groups: [
        { key: "prompt", label: "Prompting missed", cls: "" },
        { key: "verify", label: "Verifying missed", cls: "" },
        { key: "own", label: "Ownership missed", cls: "" },
      ],
      subject: "prompting and verification",
      habit: "ask for exactly what you need, then check what comes back against the source of truth.",
    },
    v3: {
      title: "AI Agent Governance Quiz",
      tagline: "What AI may do alone, and who answers for it",
      questions: QUESTIONS_V3,
      minutes: 15,
      groupOf: function (q) { return q.area; },
      groups: [
        { key: "autonomy", label: "Autonomy missed", cls: "" },
        { key: "access", label: "Access missed", cls: "" },
        { key: "oversight", label: "Oversight missed", cls: "" },
      ],
      subject: "agent governance",
      habit: "start every agent low on the ladder, give it only the access it needs, and make sure you can see and stop what it does.",
    },
  };

  /* ---------- state ---------- */
  var versionId;       // key into VERSIONS
  var ver;             // VERSIONS[versionId]
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
    versionSelect: document.getElementById("version-select"),
    siteTitle: document.getElementById("site-title"),
    siteTagline: document.getElementById("site-tagline"),
    metaCount: document.getElementById("meta-count"),
    metaMinutes: document.getElementById("meta-minutes"),
    metaPass: document.getElementById("meta-pass"),
    legend: document.getElementById("legend"),
    startHeading: document.getElementById("start-heading"),
    resultHeading: document.getElementById("result-heading"),
    miniLegend: document.getElementById("mini-legend-body"),
    ladder: document.getElementById("ladder"),
    miniLadder: document.getElementById("mini-ladder-body"),
    counter: document.getElementById("counter"),
    scoreLive: document.getElementById("score-live"),
    progress: document.getElementById("progress-fill"),
    progressTrack: document.getElementById("progress-track"),
    prompt: document.getElementById("q-prompt"),
    scenario: document.getElementById("q-scenario"),
    ask: document.getElementById("q-ask"),
    options: document.getElementById("options"),
    feedback: document.getElementById("feedback"),
    check: document.getElementById("btn-check"),
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

  /* ---------- choosing a version ---------- */
  // storage can throw (private windows, blocked site data); the quiz still
  // works without it, it just forgets the choice on reload
  function storedVersion() {
    try {
      var id = window.localStorage.getItem(STORE_KEY);
      return VERSIONS[id] ? id : null;
    } catch (e) {
      return null;
    }
  }

  function storeVersion(id) {
    try { window.localStorage.setItem(STORE_KEY, id); } catch (e) { /* not remembered */ }
  }

  function applyVersion(id) {
    versionId = id;
    ver = VERSIONS[id];

    el.versionSelect.value = id;
    el.siteTitle.textContent = ver.title;
    el.siteTagline.textContent = ver.tagline;
    document.title = ver.title;

    Array.prototype.forEach.call(document.querySelectorAll("[data-version]"), function (node) {
      node.hidden = node.getAttribute("data-version") !== id;
    });

    el.metaCount.textContent = ver.questions.length + " questions";
    el.metaMinutes.textContent = "About " + ver.minutes + " minutes";
    el.metaPass.textContent = PASS_MARK + " correct to pass";

    deck = [];
    index = 0;
    results = {};
  }

  function changeVersion() {
    var id = el.versionSelect.value;
    if (id === versionId) return;

    var inProgress = !el.screens.quiz.hidden && Object.keys(results).length > 0;
    if (inProgress && !window.confirm("Switch quiz versions? Your answers in this quiz will be lost.")) {
      el.versionSelect.value = versionId;
      return;
    }

    storeVersion(id);
    applyVersion(id);
    // focus stays on the select the person is still operating
    show("start");
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

  // v3: the autonomy ladder on the start screen and in the in-quiz reminder
  function buildLadder() {
    Object.keys(STAGES).forEach(function (n) {
      var s = STAGES[n];
      var rung = make("li", "rung");

      var head = make("div", "rung-head");
      head.appendChild(rungs(n));
      var name = make("div");
      name.appendChild(make("span", "rung-stage", "Stage " + n));
      name.appendChild(make("span", "rung-name", s.name));
      head.appendChild(name);
      rung.appendChild(head);

      [["Agent", s.agent], ["People", s.people]].forEach(function (pair) {
        var line = make("p", "rung-line");
        line.appendChild(make("b", null, pair[0] + " "));
        line.appendChild(document.createTextNode(pair[1]));
        rung.appendChild(line);
      });
      rung.appendChild(make("p", "rung-gate", s.gate));
      el.ladder.appendChild(rung);
    });

    var list = make("ul");
    Object.keys(STAGES).forEach(function (n) {
      var li = make("li");
      li.appendChild(make("b", null, "Stage " + n + " · " + STAGES[n].name));
      li.appendChild(document.createTextNode(" - " + STAGES[n].short));
      list.appendChild(li);
    });
    el.miniLadder.appendChild(list);
    el.miniLadder.appendChild(make("p", "mini-note",
      "Never without a person: payments and bank details, financial records, people decisions, " +
      "purchases and contracts, system and access changes, messages in someone's name, Red data."));
  }

  // four bars rising to the stage: a picture of the rung, not the only signal
  function rungs(stage) {
    var icon = make("span", "rungs");
    icon.setAttribute("aria-hidden", "true");
    for (var i = 1; i <= 4; i++) {
      icon.appendChild(make("span", i <= Number(stage) ? "is-on" : null));
    }
    return icon;
  }

  function stageLabel(n) {
    return "Stage " + n + " · " + STAGES[n].name;
  }

  /* ---------- scenarios (v2) ---------- */
  // blocks: "text" is a paragraph, { input } is what someone typed into the
  // AI tool, { output } is what the tool said back
  function renderScenario(node, blocks) {
    blocks.forEach(function (block) {
      if (typeof block === "string") {
        node.appendChild(make("p", "sc-text", block));
      } else if (block.input != null) {
        node.appendChild(exchange("input", "Prompt", block.input));
      } else if (block.output != null) {
        node.appendChild(exchange("output", "AI response", block.output));
      }
    });
  }

  function exchange(kind, label, text) {
    var fig = make("figure", "exchange exchange-" + kind);
    fig.appendChild(make("figcaption", "exchange-label", label));
    fig.appendChild(make("blockquote", "exchange-text", text));
    return fig;
  }

  /* ---------- rendering a question ---------- */
  function renderQuestion() {
    var q = deck[index];
    var hasScenario = !!q.scenario;
    answered = false;

    el.counter.textContent = "Question " + (index + 1) + " of " + deck.length;
    el.scoreLive.textContent = scoreSoFar() + " correct";
    setProgress(index, deck.length);

    // with a scenario, the heading names it and the question follows the story
    el.screens.quiz.classList.toggle("has-scenario", hasScenario);
    el.prompt.textContent = hasScenario ? q.title : q.prompt;
    clear(el.scenario);
    el.scenario.hidden = !hasScenario;
    el.ask.hidden = !hasScenario;
    if (hasScenario) {
      renderScenario(el.scenario, q.scenario);
      el.ask.textContent = q.prompt;
    }
    el.options.setAttribute("aria-labelledby", hasScenario ? "q-ask" : "q-prompt");

    el.feedback.hidden = true;
    el.feedback.className = "feedback";
    clear(el.feedback);
    el.next.hidden = true;
    el.check.hidden = q.type !== "spot";

    clear(el.options);
    if (q.type === "color") {
      ["RED", "YELLOW", "GREEN"].forEach(function (key, i) {
        el.options.appendChild(colorOption(q, key, i + 1));
      });
    } else if (q.type === "ladder") {
      Object.keys(STAGES).forEach(function (n) {
        el.options.appendChild(ladderOption(q, n));
      });
    } else if (q.type === "spot") {
      q.lines.forEach(function (line, i) {
        el.options.appendChild(spotLine(line, i));
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

  function ladderOption(q, n) {
    var btn = make("button", "opt opt-ladder");
    btn.type = "button";
    btn.dataset.value = n;

    btn.appendChild(make("span", "opt-key", n));
    btn.appendChild(rungs(n));

    var text = make("span", "opt-text", stageLabel(n));
    text.appendChild(make("span", "opt-sub", STAGES[n].short));
    btn.appendChild(text);

    btn.addEventListener("click", function () { answer(q, n); });
    return btn;
  }

  // spot-the-problem lines are toggles; nothing is scored until Check answer
  function spotLine(line, i) {
    var btn = make("button", "opt spot-line");
    btn.type = "button";
    btn.dataset.value = String(i + 1);
    btn.setAttribute("aria-pressed", "false");

    btn.appendChild(make("span", "opt-key", String(i + 1)));
    btn.appendChild(make("span", "opt-text", line.text));
    btn.appendChild(make("span", "spot-box"));

    btn.addEventListener("click", function () {
      if (answered) return;
      var on = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", String(on));
    });
    return btn;
  }

  function flaggedLines() {
    return Array.prototype.filter.call(el.options.children, function (btn) {
      return btn.getAttribute("aria-pressed") === "true";
    }).map(function (btn) { return btn.dataset.value; });
  }

  // line numbers (as strings) of the lines that are problems
  function problemLines(q) {
    var ids = [];
    q.lines.forEach(function (line, i) { if (line.problem) ids.push(String(i + 1)); });
    return ids;
  }

  function linesLabel(ids) {
    if (!ids.length) return "no lines";
    if (ids.length === 1) return "line " + ids[0];
    var last = ids[ids.length - 1];
    var rest = ids.slice(0, -1);
    return "lines " + rest.join(", ") + (rest.length > 1 ? "," : "") + " and " + last;
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

    var correct = q.type === "spot"
      ? given.join() === problemLines(q).join() // both in line order
      : given === q.answer;
    results[q.id] = { given: given, correct: correct };

    // aria-disabled, not disabled: a disabled button leaves the tab order,
    // which hides the answer a screen-reader user just gave
    if (q.type === "spot") {
      markSpotLines(q, given);
    } else {
      Array.prototype.forEach.call(el.options.children, function (btn) {
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
    }

    showFeedback(q, correct, given);

    el.scoreLive.textContent = scoreSoFar() + " correct";
    el.check.hidden = true;
    el.next.hidden = false;
    el.next.textContent = index === deck.length - 1 ? "See results" : "Next question";
    el.next.focus();
  }

  // every line gets a verdict in words: caught, missed, or flagged but fine
  function markSpotLines(q, given) {
    Array.prototype.forEach.call(el.options.children, function (btn, i) {
      btn.setAttribute("aria-disabled", "true");
      var line = q.lines[i];
      var flagged = given.indexOf(btn.dataset.value) !== -1;
      var mark = null;

      if (line.problem) {
        btn.classList.add(flagged ? "is-correct" : "is-wrong");
        mark = flagged ? "Caught" : "Missed";
      } else if (flagged) {
        btn.classList.add("is-wrong");
        mark = "Not a problem";
      } else {
        btn.classList.add("is-muted");
      }

      if (line.note && (line.problem || flagged)) {
        btn.querySelector(".opt-text").appendChild(make("span", "opt-note", line.note));
      }
      if (mark) btn.appendChild(make("span", "opt-mark", mark));
    });
  }

  function spotHead(q, given, correct) {
    var problems = problemLines(q);
    if (correct) {
      return "Correct - you found " + (problems.length === 2 ? "both" : "all " + problems.length) + " problems.";
    }
    var found = given.filter(function (id) { return problems.indexOf(id) !== -1; }).length;
    var extra = given.length - found;
    return "Not quite - you found " + found + " of " + problems.length + " problems" +
      (extra ? ", and flagged " + extra + (extra === 1 ? " line that was" : " lines that were") + " fine." : ".");
  }

  function showFeedback(q, correct, given) {
    clear(el.feedback);
    el.feedback.className = "feedback " + (correct ? "good" : "bad");

    var headText;
    if (q.type === "color") {
      headText = (correct ? "Correct - " : "Not quite - ") + "this is " + q.answer + ".";
    } else if (q.type === "ladder") {
      headText = (correct ? "Correct - " : "Not quite - this is ") + "Stage " + q.answer + ": " + STAGES[q.answer].name + ".";
    } else if (q.type === "spot") {
      headText = spotHead(q, given, correct);
    } else {
      headText = correct ? "Correct." : "Not quite.";
    }
    el.feedback.appendChild(make("p", "fb-head", headText));
    el.feedback.appendChild(make("p", "fb-why", q.why));

    if (q.betterPrompt) {
      el.feedback.appendChild(exchange("input", "A better prompt", q.betterPrompt));
    }
    if (q.action) {
      var action = make("p", "fb-action");
      action.appendChild(make("strong", null, "In practice"));
      action.appendChild(document.createTextNode(q.action));
      el.feedback.appendChild(action);
    }
    if (q.lesson) {
      var lesson = make("p", "fb-action fb-lesson");
      lesson.appendChild(make("strong", null, "Lesson"));
      lesson.appendChild(document.createTextNode(q.lesson));
      el.feedback.appendChild(lesson);
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
      // the Next button just hid itself; start the new question from the top
      el.prompt.focus();
    } else {
      renderResults();
    }
  }

  /* ---------- results ---------- */
  function renderResults() {
    var total = ver.questions.length;
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
        "You have a solid handle on " + ver.subject + ". The habit that matters most day to day: " + ver.habit;
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

    var cells = [{ label: "Score", num: score + "/" + total, cls: "" }].concat(
      ver.groups.map(function (g) {
        return { label: g.label, num: missedIn(g.key), cls: g.cls };
      })
    );

    cells.forEach(function (cell) {
      var node = make("div", "bd-cell " + cell.cls);
      node.appendChild(make("span", "bd-num", String(cell.num)));
      node.appendChild(make("span", "bd-label", cell.label));
      el.breakdown.appendChild(node);
    });
  }

  function missedIn(group) {
    return ver.questions.filter(function (q) {
      return ver.groupOf(q) === group && results[q.id] && !results[q.id].correct;
    }).length;
  }

  function labelFor(q, value) {
    if (value == null) return "Not answered";
    if (q.type === "color") return value;
    if (q.type === "ladder") return stageLabel(value);
    if (q.type === "spot") return linesLabel(value);
    var match = q.options.filter(function (o) { return o.id === value; })[0];
    return match ? match.text : value;
  }

  function buildReview() {
    clear(el.review);

    // only the misses - a full 20-item list buries the part worth reading
    var missed = [];
    ver.questions.forEach(function (q, i) {
      var res = results[q.id];
      if (res && !res.correct) missed.push({ q: q, res: res, number: i + 1 });
    });

    if (!missed.length) {
      el.reviewTitle.textContent = "Nothing to review";
      el.reviewLede.textContent =
        "You answered every question correctly. The habit worth keeping: " + ver.habit;
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
      if (q.title) body.appendChild(make("p", "rv-title", q.title));
      body.appendChild(make("p", "rv-q", q.prompt));
      top.appendChild(body);
      item.appendChild(top);

      if (q.scenario) {
        var story = make("details", "rv-scenario");
        story.appendChild(make("summary", null, "Show the scenario"));
        renderScenario(story, q.scenario);
        item.appendChild(story);
      }

      var answers = make("p", "rv-answers");
      var spot = q.type === "spot";
      answers.appendChild(make("span", "rv-yours wrong",
        (spot ? "You flagged: " : "You chose: ") + labelFor(q, entry.res.given)));
      answers.appendChild(make("br"));
      answers.appendChild(document.createTextNode(spot ? "Problems: " : "Correct answer: "));
      if (q.type === "color") {
        answers.appendChild(make("span", "pill pill-" + q.answer, q.answer));
      } else {
        answers.appendChild(make("span", "rv-right", labelFor(q, spot ? problemLines(q) : q.answer)));
      }
      item.appendChild(answers);
      if (spot) item.appendChild(reviewLines(q, entry.res.given));

      item.appendChild(make("p", "rv-why", q.why));
      if (q.betterPrompt) {
        var better = exchange("input", "A better prompt", q.betterPrompt);
        better.classList.add("rv-prompt");
        item.appendChild(better);
      }
      if (q.action) {
        var action = make("p", "rv-why rv-action");
        action.appendChild(make("strong", null, "In practice: "));
        action.appendChild(document.createTextNode(q.action));
        item.appendChild(action);
      }
      if (q.lesson) {
        var lesson = make("p", "rv-why rv-action rv-lesson");
        lesson.appendChild(make("strong", null, "Lesson: "));
        lesson.appendChild(document.createTextNode(q.lesson));
        item.appendChild(lesson);
      }
      if (q.source) {
        item.appendChild(make("p", "rv-source", q.tag + " · " + q.source));
      }

      el.review.appendChild(item);
    });
  }

  // the spot-the-problem lines again, each with its verdict in words
  function reviewLines(q, given) {
    var list = make("ol", "rv-lines");
    q.lines.forEach(function (line, i) {
      var flagged = given.indexOf(String(i + 1)) !== -1;
      var verdict = line.problem
        ? (flagged ? ["caught", "Problem - caught"] : ["missed", "Problem - missed"])
        : (flagged ? ["flagged", "Fine - you flagged it"] : null);
      var li = make("li", "rv-line" + (verdict ? " is-" + verdict[0] : ""));
      if (verdict) li.appendChild(make("span", "rv-line-status", verdict[1]));
      li.appendChild(make("span", "rv-line-text", line.text));
      if (line.note && (line.problem || flagged)) li.appendChild(make("span", "rv-line-note", line.note));
      list.appendChild(li);
    });
    return list;
  }

  /* ---------- run control ---------- */
  function startFull() {
    deck = ver.questions.slice();
    index = 0;
    results = {};
    renderQuestion();
    show("quiz", el.prompt);
  }

  function retryMissed() {
    var missed = ver.questions.filter(function (q) {
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
  el.check.addEventListener("click", function () { answer(deck[index], flaggedLines()); });
  el.versionSelect.addEventListener("change", changeVersion);

  // keyboard: number keys pick an answer (or toggle a line), Enter advances
  document.addEventListener("keydown", function (e) {
    if (el.screens.quiz.hidden) return;
    // typing into the version select must not answer the question
    if (e.target === el.versionSelect) return;

    if (!answered && e.key >= "1" && e.key <= "9") {
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
  buildLadder();
  applyVersion(storedVersion() || DEFAULT_VERSION);
})();
