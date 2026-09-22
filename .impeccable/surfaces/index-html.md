---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: the quiz app (index.html)

## Scope and mode

Operate. One page, four states: start (issue the training pass), quiz, results (completed pass, review, retry), and the printed certificate. Covers all three modules (AI-1 Data handling, AI-2 Prompt and verify, AI-3 Agents (managers)) and every question type: color, A–D choice, ladder, spot-the-problems, plus v2 prompt/response exchanges.

## Audience, task, constraints

Assigned learners (Biztech staff and client employees; managers for AI-3) at a work desk, sometimes on a phone. They enter name, work email, and company before the first item, answer 20 items with immediate feedback, and every finished attempt produces a record: submitted to a configurable endpoint (none set yet; the stub says so) and, on a pass only, a printable certificate. Honor-system identity is accepted for the prototype. Module dropdown stays. Static files only, works opened from disk; fonts are bundled. WCAG AA in light and dark; hardening behaviors (scoped answer keys, verdict focus, 100% body size, bank load errors, double-click guard, pass rate) must survive.

## Chosen direction

Boarding pass and gate board (catalog challenger, chosen by the user over the roll), carrying the safety-sign palette at restrained scale: signal colors live only in small solid tags and 4px rules. Memorable moment: answering flips that item's board status in place like a split-flap, lights the next row, and ticks the pass counters.

Approved reference: the user approved two code-rendered mockups of this fusion on 2026-09-22, `.impeccable/mocks/fusion-start.png` and `.impeccable/mocks/fusion-question.png`, together with the written brief. Code-led build, so they are the critique reference, not a pixel contract. Deliberate departures from them, required by the craft floor: no tag row above the question heading (the item number lives on the pass and the board, the topic moved into the source line under the verdict), the module code sits inline in the module heading, and the results heading carries no tag above it.

## Direction contract

THESIS: The learner holds a Biztech training pass and works a departure board of items; the category's course-player shell (sidebar lessons, progress ring, badge) is refused.

OWN-WORLD: Neutral ground #ededeb, raised panels #f8f8f6, ink #141414, hairline rules #d3d3cf; Biztech navy #164679 for the pass band and primary actions; safety red #c8102e, yellow #f2b705, green #00843d only as small solid tags and 4px rules. Barlow for reading, Barlow Semi Condensed caps for labels, tags and board rows; tabular figures; ruled rows, 2px tag corners, 10px panel corners, a dashed perforation above the stub.

STORY: The learner issues their own pass, sees the module's reference card, runs 20 board rows with the verdict printed under each, and ends with a completed pass whose stub says whether Biztech received the record; a pass also prints a certificate.

FIRST VIEWPORT: Left column, the training pass (navy band with white logo, name, email, company fields, items/minutes/to-pass figures, "Issue pass & start", stub below the perforation). Right, the module panel: code tag, module title, lede, the reference as a ruled board table.

FORM: Boarding pass and gate board (vernacular-ephemera-boarding-pass-and-gate-board), a dealt challenger ranked competitive, taken by the user with the safety-sign palette from the pick card; seed key 555ac1f7.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Collection endpoint (config.js `submitUrl`) not chosen.
- Module assignment in production deferred.
