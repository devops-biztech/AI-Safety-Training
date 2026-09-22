/* ==================================================================
   Biztech AI security training - quiz logic
   Depends on config.js (QUIZ_CONFIG), questions.js (v1: COLORS,
   QUESTIONS), questions-v2.js (v2: QUESTIONS_V2) and questions-v3.js
   (v3: STAGES, QUESTIONS_V3). No libraries.

   The learner issues a training pass (name, email, company), works the
   module's items, and every finished attempt produces a record: sent to
   QUIZ_CONFIG.submitUrl, and on a pass, a printable certificate.
   ================================================================== */

(function () {
  "use strict";

  var PASS_RATE = 0.8; // 16 of 20; follows the bank if a bank grows or shrinks
  var DEFAULT_VERSION = "v2";
  var STORE_KEY = "ai-quiz-version";

  var CONFIG = typeof QUIZ_CONFIG !== "undefined" && QUIZ_CONFIG ? QUIZ_CONFIG : {};

  /* ---------- question banks ----------
     Each bank is a separate script. If one is blocked or fails to load, its
     global is missing: typeof keeps that from throwing, so the other versions
     still run and the missing one is marked unavailable. */
  var BANKS = {
    COLORS: typeof COLORS !== "undefined" ? COLORS : null,
    QUESTIONS: typeof QUESTIONS !== "undefined" ? QUESTIONS : null,
    QUESTIONS_V2: typeof QUESTIONS_V2 !== "undefined" ? QUESTIONS_V2 : null,
    STAGES: typeof STAGES !== "undefined" ? STAGES : null,
    QUESTIONS_V3: typeof QUESTIONS_V3 !== "undefined" ? QUESTIONS_V3 : null,
  };

  /* ---------- versions (shown to learners as modules) ----------
     Each version brings its own question bank, module code and name, and
     results breakdown. Version-specific markup in index.html carries a
     data-version attribute and is shown only while that version is active.
     `needs` lists the banks a version cannot run without. */
  var VERSIONS = {
    v1: {
      code: "AI-1",
      name: "Data handling",
      questions: BANKS.QUESTIONS,
      needs: ["QUESTIONS", "COLORS"],
      minutes: 8,
      // which breakdown row a question counts toward
      groupOf: function (q) { return q.type === "color" ? q.answer : "process"; },
      groups: [
        { key: "RED", label: "Red items", tag: "tag-red" },
        { key: "YELLOW", label: "Yellow items", tag: "tag-yellow" },
        { key: "GREEN", label: "Green items", tag: "tag-green" },
        { key: "process", label: "Process questions" },
      ],
      subject: "the color system",
      habit: "classify the data first, then check where it is going.",
    },
    v2: {
      code: "AI-2",
      name: "Prompt and verify",
      questions: BANKS.QUESTIONS_V2,
      needs: ["QUESTIONS_V2"],
      minutes: 12,
      groupOf: function (q) { return q.skill; },
      groups: [
        { key: "prompt", label: "Prompting" },
        { key: "verify", label: "Verifying" },
        { key: "own", label: "Ownership" },
      ],
      subject: "prompting and verification",
      habit: "ask for exactly what you need, then check what comes back against the source of truth.",
    },
    v3: {
      code: "AI-3",
      name: "Agents (managers)",
      questions: BANKS.QUESTIONS_V3,
      needs: ["QUESTIONS_V3", "STAGES"],
      minutes: 15,
      groupOf: function (q) { return q.area; },
      groups: [
        { key: "autonomy", label: "Autonomy" },
        { key: "access", label: "Access" },
        { key: "oversight", label: "Oversight" },
      ],
      subject: "agent governance",
      habit: "start every agent low on the ladder, give it only the access it needs, and make sure you can see and stop what it does.",
    },
  };

  var COLOR_TAG = { RED: "tag-red", YELLOW: "tag-yellow", GREEN: "tag-green" };

  /* ---------- state ---------- */
  var versionId;       // key into VERSIONS
  var ver;             // VERSIONS[versionId]
  var deck = [];       // questions in play this run
  var index = 0;       // position in deck
  var answered = false;// has the current question been answered
  var results = {};    // { [questionId]: { given, correct } }
  var settleUntil = 0; // clicks before this time belong to the previous screen
  // who is taking it. Held for this session only, never stored: on a shared
  // computer the next person must not find someone else's name on their pass
  var learner = null;  // { name, email, company }
  var record = null;   // { id, issuedAt, completedAt, attempt }

  /* ---------- element lookup ---------- */
  function $(id) { return document.getElementById(id); }

  var el = {
    layout: $("layout"),
    screens: {
      start: $("screen-start"),
      quiz: $("screen-quiz"),
      results: $("screen-results"),
    },
    versionSelect: $("version-select"),
    moduleCode: $("module-code"),
    startTitle: $("start-title"),
    legend: $("legend"),
    ladder: $("ladder"),
    miniLegend: $("mini-legend-body"),
    miniLadder: $("mini-ladder-body"),

    // the pass
    pass: $("pass"),
    form: $("pass-form"),
    fName: $("f-name"),
    fEmail: $("f-email"),
    fCompany: $("f-company"),
    metaCount: $("meta-count"),
    metaMinutes: $("meta-minutes"),
    metaPass: $("meta-pass"),
    start: $("btn-start"),
    loadError: $("load-error"),
    issued: $("pass-issued"),
    pName: $("p-name"),
    pEmail: $("p-email"),
    pCompany: $("p-company"),
    pModule: $("p-module"),
    pItemLabel: $("p-item-label"),
    pItem: $("p-item"),
    pToPass: $("p-to-pass"),
    scoreLive: $("score-live"),
    progress: $("progress-fill"),
    progressTrack: $("progress-track"),
    code: $("pass-code"),
    pRecord: $("p-record"),
    pTime: $("p-time"),
    stub: $("stub"),
    stubText: $("stub-text"),
    resend: $("btn-resend"),

    // the quiz
    prompt: $("q-prompt"),
    promptPos: $("q-pos"),
    promptText: $("q-text"),
    scenario: $("q-scenario"),
    ask: $("q-ask"),
    optionsHead: $("options-head"),
    options: $("options"),
    feedback: $("feedback"),
    check: $("btn-check"),
    next: $("btn-next"),
    gate: $("gate-board"),

    // results
    resultHeading: $("result-heading"),
    line: $("result-line"),
    breakdown: $("breakdown"),
    print: $("btn-print"),
    retryMissed: $("btn-retry-missed"),
    gateFinal: $("gate-board-final"),
    reviewPanel: $("review-panel"),
    review: $("review"),
    reviewTitle: $("review-title"),
    reviewLede: $("review-lede"),
  };

  /* ---------- small helpers ---------- */
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  var SVG_NS = "http://www.w3.org/2000/svg";

  // a double-click on Start, Next or See results lands its second click on
  // whatever the new question or results put under the pointer - often an
  // answer, or Start over. Swallow pointer clicks for a moment after those
  // changes so that one never counts
  function settle() {
    settleUntil = Date.now() + 350;
  }

  function show(name, focusTarget) {
    Object.keys(el.screens).forEach(function (key) {
      el.screens[key].hidden = key !== name;
    });
    el.layout.setAttribute("data-screen", name);
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

  // a drawn mark, at the stroke weight the rest of the page uses
  function checkIcon() {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "icon-check");
    svg.setAttribute("viewBox", "0 0 14 14");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M2 7.4 L5.4 10.8 L12 3.2");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2.2");
    svg.appendChild(path);
    return svg;
  }

  function marked(className, text) {
    var node = make("span", className);
    node.appendChild(checkIcon());
    node.appendChild(document.createTextNode(text));
    return node;
  }

  function two(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function titleCase(word) {
    return word.charAt(0) + word.slice(1).toLowerCase();
  }

  var TIME_FMT = null, DATE_FMT = null;
  try {
    TIME_FMT = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
    DATE_FMT = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" });
  } catch (e) { /* falls back to ISO below */ }

  function fmtTime(d) { return TIME_FMT ? TIME_FMT.format(d) : d.toISOString(); }
  function fmtDate(d) { return DATE_FMT ? DATE_FMT.format(d) : d.toISOString().slice(0, 10); }

  // the certificate prints landscape on one sheet. A named @page is ignored by
  // some browsers, which then print it portrait and spill onto a second page,
  // so the page rule is added and removed with the certificate itself
  var certPageRule = null;
  function setCertificatePage(on) {
    if (on && !certPageRule) {
      certPageRule = document.createElement("style");
      certPageRule.textContent = "@page { size: letter landscape; margin: 12mm; }";
      document.head.appendChild(certPageRule);
    } else if (!on && certPageRule) {
      certPageRule.parentNode.removeChild(certPageRule);
      certPageRule = null;
    }
  }

  function scoreSoFar() {
    return Object.keys(results).filter(function (id) {
      return results[id].correct;
    }).length;
  }

  function passMark() {
    return Math.ceil(ver.questions.length * PASS_RATE);
  }

  // the certificate states the score and the pass mark as percentages
  function percent(n) {
    return Math.round((n / ver.questions.length) * 100) + "%";
  }

  function itemNumber(q) {
    return ver.questions.indexOf(q) + 1;
  }

  function topicOf(q) {
    return q.title || q.tag || "Item " + itemNumber(q);
  }

  /* ---------- choosing a version ---------- */
  function isAvailable(id) {
    var v = VERSIONS[id];
    return !!v && v.needs.every(function (name) { return BANKS[name]; }) &&
      Array.isArray(v.questions) && v.questions.length > 0;
  }

  // results are keyed by question id, so a repeated id would score one
  // question twice; warn whoever is editing the bank
  function checkBank(id) {
    var seen = {};
    VERSIONS[id].questions.forEach(function (q) {
      if (seen[q.id]) console.error("Quiz " + id + ": question id " + q.id + " is used more than once.");
      seen[q.id] = true;
    });
  }

  // storage can throw (private windows, blocked site data); the training
  // still works without it, it just forgets the module on reload
  function storedVersion() {
    try {
      var id = window.localStorage.getItem(STORE_KEY);
      return isAvailable(id) ? id : null;
    } catch (e) {
      return null;
    }
  }

  function storeVersion(id) {
    try { window.localStorage.setItem(STORE_KEY, id); } catch (e) { /* not remembered */ }
  }

  function firstAvailable() {
    if (isAvailable(DEFAULT_VERSION)) return DEFAULT_VERSION;
    return Object.keys(VERSIONS).filter(isAvailable)[0] || null;
  }

  // a module whose bank did not load stays in the list, marked, so people
  // can see it exists and report it rather than wonder where it went
  function markUnavailable() {
    Array.prototype.forEach.call(el.versionSelect.options, function (opt) {
      if (isAvailable(opt.value)) return;
      opt.disabled = true;
      opt.textContent += " (not loaded)";
    });
  }

  // nothing loaded: say so where the Start button would be, and say what to do
  function showLoadError() {
    el.start.hidden = true;
    // the fields, count, time and pass mark are placeholders until a bank loads
    Array.prototype.forEach.call(el.form.querySelectorAll(".field, .pass-figures"), function (node) {
      node.hidden = true;
    });
    el.loadError.hidden = false;
  }

  function applyVersion(id) {
    versionId = id;
    ver = VERSIONS[id];

    el.versionSelect.value = id;
    el.moduleCode.textContent = ver.code;
    el.startTitle.textContent = ver.name;
    document.title = ver.code + " " + ver.name + " · Biztech AI security training";

    Array.prototype.forEach.call(document.querySelectorAll("[data-version]"), function (node) {
      node.hidden = node.getAttribute("data-version") !== id;
    });

    checkBank(id);
    el.metaCount.textContent = String(ver.questions.length);
    el.metaMinutes.textContent = ver.minutes + " min";
    el.metaPass.textContent = String(passMark());

    deck = [];
    index = 0;
    results = {};
    record = null;
    renderPass("issue");
  }

  function changeVersion() {
    var id = el.versionSelect.value;
    if (id === versionId) return;

    var inProgress = !el.screens.quiz.hidden && Object.keys(results).length > 0;
    if (inProgress && !window.confirm("Switch modules? Your answers in this module will be lost.")) {
      el.versionSelect.value = versionId;
      return;
    }

    storeVersion(id);
    applyVersion(id);
    document.body.classList.remove("has-certificate");
    setCertificatePage(false);
    // focus stays on the select the person is still operating
    show("start");
  }

  /* ---------- static content: the reference boards ---------- */
  function buildLegend() {
    if (!BANKS.COLORS) return;
    var head = make("div", "board-row board-head");
    head.setAttribute("role", "row");
    ["Class", "Rule", "Covers"].forEach(function (h) {
      var cell = make("span", null, h);
      cell.setAttribute("role", "columnheader");
      head.appendChild(cell);
    });
    el.legend.appendChild(head);

    ["RED", "YELLOW", "GREEN"].forEach(function (key) {
      var c = COLORS[key];
      var row = make("div", "board-row");
      row.setAttribute("role", "row");
      var cls = make("span");
      cls.setAttribute("role", "cell");
      cls.appendChild(make("span", "tag " + COLOR_TAG[key], titleCase(c.label)));
      row.appendChild(cls);
      var rule = make("span", "row-label", c.rule);
      rule.setAttribute("role", "cell");
      row.appendChild(rule);
      var blurb = make("span", null, c.blurb);
      blurb.setAttribute("role", "cell");
      row.appendChild(blurb);
      el.legend.appendChild(row);
    });

    var list = make("ul");
    ["RED", "YELLOW", "GREEN"].forEach(function (key) {
      var li = make("li", "ml-" + key);
      li.appendChild(make("b", null, titleCase(COLORS[key].label) + ":"));
      li.appendChild(document.createTextNode(" " + COLORS[key].rule));
      list.appendChild(li);
    });
    el.miniLegend.appendChild(list);
  }

  // v3: the autonomy ladder on the start screen and in the in-quiz reminder
  function buildLadder() {
    if (!BANKS.STAGES) return;
    Object.keys(STAGES).forEach(function (n) {
      var s = STAGES[n];
      var rung = make("li", "board-row");

      var head = make("div", "rung-head");
      head.appendChild(rungs(n));
      var name = make("div");
      name.appendChild(make("span", "k rung-stage", "Stage " + n));
      name.appendChild(make("span", "row-label rung-name", s.name));
      head.appendChild(name);
      rung.appendChild(head);

      var body = make("div");
      [["Agent", s.agent], ["People", s.people]].forEach(function (pair) {
        var line = make("p", "rung-line");
        line.appendChild(make("b", null, pair[0] + ": "));
        line.appendChild(document.createTextNode(pair[1]));
        body.appendChild(line);
      });
      body.appendChild(make("p", "rung-gate", s.gate));
      rung.appendChild(body);
      el.ladder.appendChild(rung);
    });

    var list = make("ul");
    Object.keys(STAGES).forEach(function (n) {
      var li = make("li");
      li.appendChild(make("b", null, stageLabel(n) + ":"));
      li.appendChild(document.createTextNode(" " + STAGES[n].short));
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

  /* ---------- the training pass ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // every field says what is wrong and how to fix it, next to the field
  function validate() {
    var checks = [
      [el.fName, el.fName.value.trim() ? "" : "Enter your full name."],
      [el.fEmail, !el.fEmail.value.trim() ? "Enter your work email."
        : EMAIL_RE.test(el.fEmail.value.trim()) ? "" : "Enter a full email address, like name@company.com."],
      [el.fCompany, el.fCompany.value.trim() ? "" : "Enter the company you work for."],
    ];
    var firstBad = null;
    checks.forEach(function (pair) {
      var input = pair[0], message = pair[1];
      var err = $(input.id + "-err");
      err.textContent = message;
      err.hidden = !message;
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
      if (message && !firstBad) firstBad = input;
    });
    return firstBad;
  }

  var ID_CHARS = "23456789ABCDEFGHJKMNPQRSTVWXYZ"; // no 0/O, 1/I/L, U

  function issueRecord() {
    var bytes = null, id = "";
    try { bytes = window.crypto.getRandomValues(new Uint8Array(6)); } catch (e) { /* Math.random below */ }
    for (var i = 0; i < 6; i++) {
      var n = bytes ? bytes[i] : Math.floor(Math.random() * 256);
      id += ID_CHARS.charAt(n % ID_CHARS.length);
    }
    record = {
      id: ver.code.replace("-", "") + "-" + id,
      issuedAt: new Date(),
      completedAt: null,
      attempt: 0, // counts finished attempts; a retry-missed run adds one
    };
  }

  // the code block on the pass is drawn from the record number, so each
  // record carries its own mark; the number itself is printed beneath
  function drawCode(id, svg) {
    clear(svg);
    var x = 0, bars = [[0, 2]];
    x = 4;
    for (var i = 0; i < id.length; i++) {
      var c = id.charCodeAt(i);
      for (var b = 0; b < 3; b++) {
        var w = 1 + ((c >> (b * 2)) & 3) % 3;
        bars.push([x, w]);
        x += w + 1 + ((c >> (b + 1)) & 1);
      }
    }
    bars.push([x + 2, 2]);
    x += 4;
    svg.setAttribute("viewBox", "0 0 " + x + " 10");
    bars.forEach(function (bar) {
      var r = document.createElementNS(SVG_NS, "rect");
      r.setAttribute("x", bar[0]);
      r.setAttribute("y", 0);
      r.setAttribute("width", bar[1]);
      r.setAttribute("height", 10);
      r.setAttribute("fill", "currentColor");
      svg.appendChild(r);
    });
  }

  function setStub(kind, text) {
    el.stub.className = "stub" + (kind ? " is-" + kind : "");
    el.stubText.textContent = text;
    el.resend.hidden = kind !== "failed";
  }

  // "issue": the learner fills it in. "active": the run is on.
  // "complete": the record, with its result and whether Biztech has it
  function renderPass(state) {
    el.pass.setAttribute("data-state", state);
    el.form.hidden = state !== "issue";
    el.issued.hidden = state === "issue";

    if (state === "issue") {
      if (learner) {
        el.fName.value = learner.name;
        el.fEmail.value = learner.email;
        el.fCompany.value = learner.company;
      }
      setStub("", "Your result goes to Biztech when you finish, pass or not. Pass, and you also get a certificate to print.");
      return;
    }

    el.pName.textContent = learner.name;
    el.pEmail.textContent = learner.email;
    el.pCompany.textContent = learner.company;
    el.pModule.textContent = ver.code + " · " + ver.name;
    el.pToPass.textContent = String(passMark());
    el.pRecord.textContent = "Record " + record.id + (record.attempt > 1 ? " · attempt " + record.attempt : "");
    drawCode(record.id, el.code);

    var correctLabel = el.scoreLive.previousElementSibling;
    el.scoreLive.className = "v";
    if (state === "active") {
      el.pItemLabel.textContent = "Item";
      correctLabel.textContent = "Correct";
      el.pTime.textContent = "Issued " + fmtTime(record.issuedAt);
      setStub("", "Sent to Biztech when you finish, pass or not.");
    } else {
      var score = scoreSoFar(), passed = score >= passMark();
      el.pItemLabel.textContent = "Score";
      el.pItem.textContent = score + "/" + ver.questions.length;
      correctLabel.textContent = "Result";
      el.scoreLive.textContent = passed ? "Passed" : "Not passed";
      el.scoreLive.className = "v " + (passed ? "is-pass" : "is-fail");
      el.pTime.textContent = "Completed " + fmtTime(record.completedAt);
    }
  }

  /* ---------- the record: sent to Biztech ---------- */
  function recordPayload() {
    var score = scoreSoFar();
    return {
      recordId: record.id,
      attempt: record.attempt,
      module: ver.code,
      moduleName: ver.name,
      name: learner.name,
      email: learner.email,
      company: learner.company,
      score: score,
      total: ver.questions.length,
      passMark: passMark(),
      passed: score >= passMark(),
      issuedAt: record.issuedAt.toISOString(),
      completedAt: record.completedAt.toISOString(),
    };
  }

  // every finished attempt is sent, pass or fail. The outcome is printed on
  // the stub in words; nothing pops up
  function submitRecord() {
    var url = typeof CONFIG.submitUrl === "string" ? CONFIG.submitUrl.trim() : "";
    if (!url) {
      setStub("unset", "Not sent. This copy of the training has no Biztech collection point set up yet.");
      return;
    }
    if (typeof window.fetch !== "function") {
      setStub("failed", "Not sent. This browser cannot send the record. Try a current browser, or contact Biztech support.");
      return;
    }

    var sentId = record.id, sentAttempt = record.attempt;
    // a reply for an earlier attempt must not overwrite the current one's status
    function stale() { return !record || record.id !== sentId || record.attempt !== sentAttempt; }

    setStub("pending", "Sending your record to Biztech…");
    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, Number(CONFIG.timeoutMs) || 10000);

    window.fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recordPayload()),
      mode: "cors",
      credentials: "omit",
      signal: ctrl ? ctrl.signal : undefined,
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      if (!stale()) setStub("sent", "Record sent to Biztech, " + fmtTime(new Date()) + ".");
    }).catch(function () {
      if (!stale()) setStub("failed", "Not sent. Could not reach Biztech. Check your connection, then try again.");
    }).then(function () {
      clearTimeout(timer);
    });
  }

  /* ---------- the item board ---------- */
  function buildGate(list, final) {
    clear(list);
    list.style.setProperty("--rows", String(Math.ceil(ver.questions.length / 2)));
    ver.questions.forEach(function (q, i) {
      var li = make("li", "gate-row");
      li.dataset.id = String(q.id);
      li.appendChild(make("span", "gate-num", two(i + 1)));
      var topic = make("span", "gate-topic");
      var res = results[q.id];
      if (final && res && !res.correct) {
        // a missed item on the final board jumps to its explanation
        var link = make("a", null, topicOf(q));
        link.href = "#review-" + q.id;
        topic.appendChild(link);
      } else {
        topic.textContent = topicOf(q);
      }
      li.appendChild(topic);
      li.appendChild(make("span", "gate-status"));
      list.appendChild(li);
    });
    updateGate(list, false);
  }

  // a changed status flips in place; nothing else on the board moves
  function updateGate(list, animate) {
    // only the live board has a current item, and only until it is answered
    var current = list === el.gate && !answered ? deck[index] : null;
    var currentId = current ? String(current.id) : null;

    Array.prototype.forEach.call(list.children, function (li) {
      var id = li.dataset.id;
      var res = results[id];
      var state = res ? (res.correct ? "correct" : "missed") : id === currentId ? "now" : "waiting";
      li.classList.toggle("is-now", state === "now");
      if (li.dataset.state === state) return;
      li.dataset.state = state;

      var slot = li.querySelector(".gate-status");
      clear(slot);
      var mark = state === "correct" ? make("span", "tag tag-green", "Correct")
        : state === "missed" ? make("span", "tag tag-red", "Missed")
        : state === "now" ? make("span", "tag tag-yellow", "Now")
        : make("span", "gate-wait", "Waiting");
      if (animate && state !== "waiting") mark.classList.add("flip");
      slot.appendChild(mark);
    });
  }

  /* ---------- scenarios (v2, v3) ---------- */
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
    fig.appendChild(make("figcaption", "k exchange-label", label));
    fig.appendChild(make("blockquote", "exchange-text", text));
    return fig;
  }

  /* ---------- rendering a question ---------- */
  var HEADS = {
    color: ["Key", "Class", "Rule", ""],
    choice: ["Key", "Answer", ""],
    ladder: ["Key", "", "Stage", ""],
    spot: ["Line", "Select every line that is a problem", "", "Flag"],
  };

  function kindOf(q) {
    return HEADS[q.type] ? q.type : "choice";
  }

  function renderQuestion() {
    var q = deck[index];
    var hasScenario = !!q.scenario;
    answered = false;
    settle();

    el.promptPos.textContent = "Item " + (index + 1) + " of " + deck.length + ". ";
    el.pItem.textContent = two(index + 1) + "/" + two(deck.length);
    el.scoreLive.textContent = String(scoreSoFar());
    setProgress(index, deck.length);

    // with a scenario, the heading names it and the question follows the story
    el.screens.quiz.classList.toggle("has-scenario", hasScenario);
    el.promptText.textContent = hasScenario ? q.title : q.prompt;
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

    var kind = kindOf(q);
    clear(el.optionsHead);
    el.optionsHead.className = "options-head grid-" + kind;
    HEADS[kind].forEach(function (h) { el.optionsHead.appendChild(make("span", null, h)); });

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

    updateGate(el.gate, true);
  }

  function setProgress(done, total) {
    el.progress.style.transform = "scaleX(" + (total ? done / total : 0) + ")";
    el.progressTrack.setAttribute("aria-valuenow", String(done));
    el.progressTrack.setAttribute("aria-valuemax", String(total));
    el.progressTrack.setAttribute("aria-valuetext",
      "Item " + Math.min(done + 1, total) + " of " + total);
  }

  function colorOption(q, key, num) {
    var btn = make("button", "opt grid-color");
    btn.type = "button";
    btn.dataset.value = key;
    btn.dataset.key = String(num);

    btn.appendChild(make("span", "opt-key", String(num)));
    var cls = make("span", "opt-class");
    cls.appendChild(make("span", "tag " + COLOR_TAG[key], titleCase(COLORS[key].label)));
    btn.appendChild(cls);
    btn.appendChild(make("span", "opt-rule", COLORS[key].rule));
    btn.appendChild(make("span", "opt-mark"));

    btn.addEventListener("click", function () { answer(q, key); });
    return btn;
  }

  function ladderOption(q, n) {
    var btn = make("button", "opt grid-ladder");
    btn.type = "button";
    btn.dataset.value = n;
    btn.dataset.key = n;

    btn.appendChild(make("span", "opt-key", n));
    btn.appendChild(rungs(n));
    var text = make("span", "opt-text");
    text.appendChild(make("span", "opt-stage", stageLabel(n)));
    text.appendChild(make("span", "opt-sub", STAGES[n].short));
    btn.appendChild(text);
    btn.appendChild(make("span", "opt-mark"));

    btn.addEventListener("click", function () { answer(q, n); });
    return btn;
  }

  // spot-the-problem lines are toggles; nothing is scored until Check answer
  function spotLine(line, i) {
    var btn = make("button", "opt grid-spot");
    btn.type = "button";
    btn.dataset.value = String(i + 1);
    btn.dataset.key = String(i + 1);
    btn.setAttribute("aria-pressed", "false");

    btn.appendChild(make("span", "opt-key", String(i + 1)));
    btn.appendChild(make("span", "opt-text", line.text));
    btn.appendChild(make("span", "opt-mark"));
    var box = make("span", "spot-box");
    box.setAttribute("aria-hidden", "true");
    btn.appendChild(box);

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
    var letter = String.fromCharCode(65 + i);
    var btn = make("button", "opt grid-choice");
    btn.type = "button";
    btn.dataset.value = opt.id;
    // the key column shows a letter, so the letter is the key (1-4 still work too)
    btn.dataset.key = letter.toLowerCase();
    btn.appendChild(make("span", "opt-key", letter));
    btn.appendChild(make("span", "opt-text", opt.text));
    btn.appendChild(make("span", "opt-mark"));
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
        var mark = btn.querySelector(".opt-mark");
        var mine = value === given, right = value === q.answer;
        if (mine) btn.classList.add("is-mine");
        if (mine && right) mark.appendChild(marked("tag tag-green", "Correct"));
        else if (mine) mark.appendChild(make("span", "tag tag-yellow", "Your answer"));
        else if (right) mark.appendChild(marked("mark-answer", "Correct answer"));
        else btn.classList.add("is-muted");
      });
    }

    showFeedback(q, correct, given);

    el.scoreLive.textContent = String(scoreSoFar());
    el.check.hidden = true;
    el.next.hidden = false;
    el.next.textContent = index === deck.length - 1 ? "See results" : "Next item";
    updateGate(el.gate, true);
    // land on the verdict, not the Next button: a screen reader reads the
    // result, then the explanation in order, then reaches Next. A live region
    // was unreliable here - it was filled while hidden, and moving focus to
    // Next talked over it. Enter on the verdict still advances (see keydown)
    el.feedback.querySelector(".fb-head").focus();
  }

  // every line gets a verdict in words: caught, missed, or flagged but fine
  function markSpotLines(q, given) {
    Array.prototype.forEach.call(el.options.children, function (btn, i) {
      btn.setAttribute("aria-disabled", "true");
      var line = q.lines[i];
      var flagged = given.indexOf(btn.dataset.value) !== -1;
      var mark = btn.querySelector(".opt-mark");

      if (line.problem) {
        mark.appendChild(flagged ? make("span", "tag tag-green", "Caught") : make("span", "tag tag-red", "Missed"));
      } else if (flagged) {
        mark.appendChild(make("span", "tag tag-yellow", "Not a problem"));
      } else {
        btn.classList.add("is-muted");
      }

      if (line.note && (line.problem || flagged)) {
        btn.querySelector(".opt-text").appendChild(make("span", "opt-note", line.note));
      }
    });
  }

  function spotHead(q, given, correct) {
    var problems = problemLines(q);
    if (correct) {
      return "Correct. You found " + (problems.length === 2 ? "both" : "all " + problems.length) + " problems.";
    }
    var found = given.filter(function (id) { return problems.indexOf(id) !== -1; }).length;
    var extra = given.length - found;
    return "Not correct. You found " + found + " of " + problems.length + " problems" +
      (extra ? ", and flagged " + extra + (extra === 1 ? " line that was" : " lines that were") + " fine." : ".");
  }

  function showFeedback(q, correct, given) {
    clear(el.feedback);
    el.feedback.className = "feedback " + (correct ? "good" : "bad");

    var verdict = correct ? "Correct. " : "Not correct. ";
    var headText;
    if (q.type === "color") {
      headText = verdict + "This is " + titleCase(COLORS[q.answer].label) + ".";
    } else if (q.type === "ladder") {
      headText = verdict + "This is Stage " + q.answer + ": " + STAGES[q.answer].name + ".";
    } else if (q.type === "spot") {
      headText = spotHead(q, given, correct);
    } else {
      headText = correct ? "Correct." : "Not correct.";
    }
    var head = make("p", "fb-head", headText);
    head.tabIndex = -1;
    el.feedback.appendChild(head);
    el.feedback.appendChild(make("p", "fb-why", q.why));

    if (q.betterPrompt) {
      el.feedback.appendChild(exchange("input", "A better prompt", q.betterPrompt));
    }
    if (q.action) {
      var action = make("p", "fb-action");
      action.appendChild(make("strong", null, "In practice: "));
      action.appendChild(document.createTextNode(q.action));
      el.feedback.appendChild(action);
    }
    if (q.lesson) {
      var lesson = make("p", "fb-action fb-lesson");
      lesson.appendChild(make("strong", null, "Lesson: "));
      lesson.appendChild(document.createTextNode(q.lesson));
      el.feedback.appendChild(lesson);
    }
    if (q.source) {
      el.feedback.appendChild(make("p", "fb-source", (q.tag ? q.tag + " · " : "") + q.source));
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
    var mark = passMark();
    var answeredIds = Object.keys(results);
    var score = scoreSoFar();
    var passed = score >= mark;
    var partial = answeredIds.length < total; // a "retry missed" run

    settle();
    record.completedAt = new Date();
    record.attempt += 1;
    setProgress(deck.length, deck.length);

    el.resultHeading.textContent = passed ? "You passed " + ver.name : "Not passed yet";

    var tally = score + " of " + total + " correct. ";
    if (partial) {
      el.line.textContent = tally + "That includes the items you answered correctly the first time through. " +
        (passed ? "You are now at or above the " + mark + " of " + total + " pass mark."
          : "You need " + mark + " of " + total + " to pass.");
    } else if (passed) {
      el.line.textContent = tally + "You have a solid handle on " + ver.subject +
        ". The habit that matters most day to day: " + ver.habit;
    } else {
      el.line.textContent = tally + "You need " + mark + " of " + total +
        " to pass. Read through what you missed, then retry those items.";
    }

    buildBreakdown();
    buildGate(el.gateFinal, true);
    buildReview();
    fillCertificate(passed);

    el.print.hidden = !passed;
    el.retryMissed.hidden = score === total;
    renderPass("complete");
    submitRecord();
    show("results", el.resultHeading);
  }

  function buildBreakdown() {
    clear(el.breakdown);
    var head = make("div", "board-row board-head");
    head.setAttribute("role", "row");
    ["Area", "Missed"].forEach(function (h) {
      var cell = make("span", null, h);
      cell.setAttribute("role", "columnheader");
      head.appendChild(cell);
    });
    el.breakdown.appendChild(head);

    ver.groups.forEach(function (g) {
      var row = make("div", "board-row");
      row.setAttribute("role", "row");
      var label = make("span", "row-label");
      label.setAttribute("role", "cell");
      if (g.tag) label.appendChild(make("span", "tag " + g.tag, g.label));
      else label.textContent = g.label;
      row.appendChild(label);
      var num = make("span", "bd-num", String(missedIn(g.key)));
      num.setAttribute("role", "cell");
      row.appendChild(num);
      el.breakdown.appendChild(row);
    });
  }

  function missedIn(group) {
    return ver.questions.filter(function (q) {
      return ver.groupOf(q) === group && results[q.id] && !results[q.id].correct;
    }).length;
  }

  function labelFor(q, value) {
    if (value == null) return "Not answered";
    if (q.type === "color") return titleCase(value);
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
        "You answered every item correctly. The habit worth keeping: " + ver.habit;
      el.review.hidden = true;
      return;
    }

    el.review.hidden = false;
    el.reviewTitle.textContent = missed.length === 1 ? "The one you missed" : "What you missed";
    el.reviewLede.textContent =
      missed.length === 1
        ? "The single item you got wrong, and why the answer lands where it does."
        : "The " + missed.length + " items you got wrong, and why each answer lands where it does.";

    missed.forEach(function (entry) {
      var q = entry.q;
      var item = make("li", "review-item");
      item.id = "review-" + q.id;
      item.tabIndex = -1; // the board's links move focus here, not just the view

      var head = make("h3", "rv-head");
      head.appendChild(make("span", "rv-num", "Item " + two(entry.number)));
      head.appendChild(document.createTextNode(" · " + topicOf(q)));
      item.appendChild(head);
      item.appendChild(make("p", "rv-q", q.prompt));

      var rest = make("div");
      if (q.scenario) {
        var story = make("details", "rv-scenario");
        story.appendChild(make("summary", null, "Show the scenario"));
        renderScenario(story, q.scenario);
        rest.appendChild(story);
      }

      var answers = make("p", "rv-answers");
      var spot = q.type === "spot";
      answers.appendChild(make("span", "rv-yours",
        (spot ? "You flagged: " : "You chose: ") + labelFor(q, entry.res.given)));
      answers.appendChild(make("br"));
      answers.appendChild(document.createTextNode(spot ? "Problems: " : "Correct answer: "));
      if (q.type === "color") {
        answers.appendChild(make("span", "tag " + COLOR_TAG[q.answer], titleCase(q.answer)));
      } else {
        answers.appendChild(make("span", "rv-right", labelFor(q, spot ? problemLines(q) : q.answer)));
      }
      rest.appendChild(answers);
      if (spot) rest.appendChild(reviewLines(q, entry.res.given));

      rest.appendChild(make("p", "rv-why", q.why));
      if (q.betterPrompt) {
        rest.appendChild(exchange("input", "A better prompt", q.betterPrompt));
      }
      if (q.action) {
        var action = make("p", "rv-why rv-action");
        action.appendChild(make("strong", null, "In practice: "));
        action.appendChild(document.createTextNode(q.action));
        rest.appendChild(action);
      }
      if (q.lesson) {
        var lesson = make("p", "rv-why rv-action rv-lesson");
        lesson.appendChild(make("strong", null, "Lesson: "));
        lesson.appendChild(document.createTextNode(q.lesson));
        rest.appendChild(lesson);
      }
      if (q.source) {
        rest.appendChild(make("p", "rv-source", (q.tag ? q.tag + " · " : "") + q.source));
      }
      item.appendChild(rest);
      el.review.appendChild(item);
    });
  }

  // the spot-the-problem lines again, each with its verdict in words
  function reviewLines(q, given) {
    var list = make("ol", "rv-lines");
    q.lines.forEach(function (line, i) {
      var flagged = given.indexOf(String(i + 1)) !== -1;
      var verdict = line.problem
        ? (flagged ? ["caught", "Caught", "tag-green"] : ["missed", "Missed", "tag-red"])
        : (flagged ? ["flagged", "Not a problem", "tag-yellow"] : null);
      var li = make("li", "rv-line" + (verdict ? " is-" + verdict[0] : ""));
      if (verdict) li.appendChild(make("span", "tag " + verdict[2], verdict[1]));
      li.appendChild(document.createTextNode(line.text));
      if (line.note && (line.problem || flagged)) li.appendChild(make("span", "rv-line-note", line.note));
      list.appendChild(li);
    });
    return list;
  }

  /* ---------- the certificate: printed on a pass only ---------- */
  function fillCertificate(passed) {
    document.body.classList.toggle("has-certificate", passed);
    setCertificatePage(passed);
    if (!passed) return;
    $("c-name").textContent = learner.name;
    $("c-module").textContent = ver.code + " · " + ver.name;
    $("c-company").textContent = learner.company;
    $("c-email").textContent = learner.email;
    $("c-score").textContent = percent(scoreSoFar());
    $("c-date").textContent = fmtDate(record.completedAt);
    $("c-record").textContent = record.id + (record.attempt > 1 ? " · attempt " + record.attempt : "");
    $("c-seal-code").textContent = ver.code;
  }

  /* ---------- run control ---------- */
  function beginRun(list) {
    deck = list;
    index = 0;
    document.body.classList.remove("has-certificate");
    setCertificatePage(false);
    renderPass("active");
    buildGate(el.gate, false);
    renderQuestion();
    show("quiz", el.prompt);
  }

  function startFull() {
    issueRecord();
    results = {};
    beginRun(ver.questions.slice());
  }

  function retryMissed() {
    var missed = ver.questions.filter(function (q) {
      return results[q.id] && !results[q.id].correct;
    });
    if (!missed.length) return;

    // keep correct answers, drop the missed ones so they are re-scored; the
    // record stays the same and its next finish counts as another attempt
    missed.forEach(function (q) { delete results[q.id]; });
    beginRun(missed);
  }

  /* ---------- wiring ---------- */
  el.form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!ver) return;
    var bad = validate();
    if (bad) { bad.focus(); return; }
    learner = {
      name: el.fName.value.trim(),
      email: el.fEmail.value.trim(),
      company: el.fCompany.value.trim(),
    };
    startFull();
  });
  // once a field has been flagged, its message clears as soon as it is fixed
  [el.fName, el.fEmail, el.fCompany].forEach(function (input) {
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") validate();
    });
  });

  $("btn-restart").addEventListener("click", startFull);
  el.retryMissed.addEventListener("click", retryMissed);
  el.print.addEventListener("click", function () { window.print(); });
  el.resend.addEventListener("click", submitRecord);
  el.next.addEventListener("click", next);
  el.check.addEventListener("click", function () { answer(deck[index], flaggedLines()); });
  el.versionSelect.addEventListener("change", changeVersion);

  // capture phase, so the swallowed click never reaches an answer's handler.
  // detail is 0 for keyboard activation and the answer keys, so only a
  // pointer click is ever swallowed
  $("app").addEventListener("click", function (e) {
    if (e.detail > 0 && Date.now() < settleUntil) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);

  // anything that already does its own thing with Enter
  function isControl(node) {
    return !!(node && node.closest &&
      node.closest("button, a[href], select, summary, input, textarea, [contenteditable]"));
  }

  // keyboard: an answer's key picks it (or toggles the line). The keys work
  // only while focus is on the answers, so a stray keystroke or a dictated
  // number elsewhere on the page never answers a question (WCAG 2.1.4).
  // Once answered, Enter anywhere that is not a control moves on
  document.addEventListener("keydown", function (e) {
    if (el.screens.quiz.hidden || e.repeat || e.isComposing) return;
    // leave browser and system shortcuts (Ctrl+1 switches tabs) alone
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (!answered && el.options.contains(document.activeElement)) {
      var key = String(e.key).toLowerCase();
      var btns = el.options.children;
      for (var i = 0; i < btns.length; i++) {
        if (btns[i].dataset.key === key || String(i + 1) === key) {
          btns[i].click();
          e.preventDefault();
          break;
        }
      }
      return;
    }
    if (answered && e.key === "Enter" && !isControl(e.target)) {
      next();
      e.preventDefault();
    }
  });

  buildLegend();
  buildLadder();
  markUnavailable();
  var startVersion = storedVersion() || firstAvailable();
  if (startVersion) {
    applyVersion(startVersion);
  } else {
    showLoadError();
  }
})();
