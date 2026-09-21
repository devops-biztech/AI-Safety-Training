# AI Data Handling Quiz (prototype)

A 20-question training quiz that teaches a three-color system for deciding what
data may be shared with AI tools.

All content is derived from the documents in [`policies/`](policies/).

| Color | Rule | Covers |
|-------|------|--------|
| **RED** | Do not share | Sensitive, private, regulated, financial, personnel or security information. Goes into an AI tool only when the company has approved the tool, the use case **and** the access |
| **YELLOW** | Needs approval | Internal work where accuracy, timing, sequence, exceptions or authority matter. AI may prepare it; a responsible person reviews and authorizes before it is used, shared or executed |
| **GREEN** | Can be shared | Public or low-risk information. Use an approved tool and apply ordinary professional and factual review |

The quiz stays neutral on whether to use AI at work. It teaches **what you put in**,
not whether to use the tools.

## Running it

Open `index.html` in any browser. No build step, no server, no dependencies.

```
xdg-open index.html
```

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page shell: start screen, quiz screen, results screen |
| `styles.css` | All styling. Colors and spacing are CSS variables in `:root` |
| `questions.js` | **The question bank** — edit this to change content |
| `app.js` | Quiz logic: rendering, scoring, feedback, review |

## Design decisions

- **12 classification questions** (pick RED/YELLOW/GREEN) + **8 process questions**
  (approved tools, vendor contract terms, the Yellow authorization checklist, escalation,
  what AI must never decide, the final test, and reporting).
- **Immediate feedback** after each answer. The end-of-quiz review lists **only the
  questions you missed** — your answer, the correct one, and why — so the part worth
  reading is not buried in 20 entries. A clean run gets a short confirmation instead.
- **Three tool tiers**, in plain language rather than the policy's Tier 1/2/3 numbering:
  *company-approved*, *department-approved*, and *personal or free*. The last is never
  permitted for company information — general learning only.
- **Every question cites its policy section** in a `source` field, shown under the
  explanation and in the review, so the answer key can be audited against the PDFs.
- **Light and dark themes**, each composed rather than mechanically inverted. Every
  foreground/background pair clears WCAG AA in both.
- **Colour is never the only signal.** Each colour is paired with its text label, every
  answered option is marked in words, and the classification survives Windows
  high-contrast mode on borders.
- **Generic corporate setting** — HR, finance, operations, security, marketing.
- **Escalation stays generic** ("your manager or IT/Security"), since the policies leave
  the contact blank. The employee policy also names an AI Stewardship Council if you
  decide to use it.
- Color is never the only signal. Every color is paired with its text label, so the
  quiz works for colorblind users.

## Editing the questions

Everything lives in `questions.js`. Two shapes:

```js
// classification: learner picks a color
{
  id: 1,
  type: "color",
  tag: "Human Resources",          // chip above the question
  prompt: "...",
  answer: "RED",                   // "RED" | "YELLOW" | "GREEN"
  why: "...",                      // explanation shown after answering
  action: "...",                   // optional "In practice" line
  source: "Employee policy - ...", // policy section the answer comes from
}

// multiple choice
{
  id: 15,
  type: "choice",
  tag: "Destination",
  prompt: "...",
  options: [{ id: "a", text: "..." }, ...],   // keep to 4; keyboard uses 1-4
  answer: "c",
  why: "...",
  action: "...",
  source: "Vendor terms - ...",
}
```

Other knobs:

- Pass mark: `PASS_MARK` at the top of `app.js` (currently 16 of 20).
- Color names and descriptions: the `COLORS` object at the top of `questions.js`.
  These drive the start-screen legend, the answer buttons, and the in-quiz reminder.

## Answer key

| # | Answer | Topic | Policy source |
|---|--------|-------|---------------|
| 1 | RED | Salary spreadsheet | Employee — Red |
| 2 | GREEN | Published press release | Employee — Green |
| 3 | YELLOW | Service ticket / dispatch plan | Employee — Yellow |
| 4 | RED | Unreleased results and forecast | Employee — Red |
| 5 | GREEN | Publicly posted job description | Employee — Green |
| 6 | YELLOW | Production runbook | Employee — Yellow |
| 7 | RED | Candidate resume + interview notes | Employee — Red |
| 8 | GREEN | Public social accounts | Employee — Green |
| 9 | RED | Log with API key and MFA seed | Employee — Red |
| 10 | GREEN | Competitor's public annual report | Employee — Green |
| 11 | RED | Green draft + unannounced pricing | Leader — inheritance rule |
| 12 | YELLOW | Project schedule with approvals | Employee — Yellow |
| 13 | C | Where company information may go | Employee — Promise 1 |
| 14 | D | What makes a tool approved | Vendor terms — whole picture |
| 15 | A | Risk with no no-training clause | Vendor terms — no-training |
| 16 | B | Authorizing AI-drafted Yellow work | Employee — Yellow |
| 17 | D | What to do when unsure | Employee — Red |
| 18 | C | What AI must never decide | Employee — Promise 3 |
| 19 | A | The two-question final test | Employee — A final test |
| 20 | B | Reporting suspicious AI behavior | Employee — Promise 6 |

Colors: 5 Red, 3 Yellow, 4 Green. Multiple-choice answers are spread evenly across
A/B/C/D so the position gives nothing away.

Questions 5 and 10 are deliberate teaching moments: HR-owned material that is Green
because it is already published, and a competitor's data that is Green for the same
reason. The color follows the information, not the department or the owner.

Question 11 is the inheritance rule — a Green task becomes Red the moment Red
information is pasted into it.

## Known gaps

Twenty questions cannot cover three policy documents. Not currently tested:

- The truthfulness promise (no impersonation, fabricated testimonials, or deceptive
  media). Currently carried in question 2's explanation rather than its own question.
- Six of the eight vendor contract terms — subprocessor disclosure, data residency,
  MFA, audit logging, breach notification, and exit/deletion. Questions 14 and 15
  cover the DPA and the no-training clause, and name the others in passing.
- Everything in the leader governance policy except the inheritance rule: agentic AI,
  the autonomy ladder, integrations, agent permissions, testing, and audits. That doc
  is written for managers and the C-suite and would suit a separate leader quiz.

## Design system

Colour lives in three layers in `styles.css`: primitives (`--red-500`), semantic roles
(`--red-ink`, `--red-tint`, `--red-line`), and components that only ever reference a
role. Switching theme remaps the semantic layer; no component holds a literal.

Two rules are load-bearing and worth keeping if you extend this:

- **Dimming uses a colour token, never `opacity`.** Compositing text at 55% opacity
  put it at 2.25:1 against white. `--ink-muted` is a real value that clears 4.5:1.
- **`--control-line` is for interactive boundaries, `--line` for separators.** An
  option button on a white card is identified by its border alone, so that border
  needs 3:1 (WCAG 1.4.11). A decorative rule does not.

The focus ring is two-tone (`box-shadow: 0 0 0 2px surface, 0 0 0 5px focus`). The
inner band separates the indicator from whatever it lands on, so it holds 3:1 over
white cards, colour tints and the primary button alike.

## Not built yet

This is a prototype. There is no persistence, no user accounts, no LMS/SCORM
export, and no record of who completed it — results live in memory and reset on
reload.

## Before real use

Every answer traces to a policy section, listed in the answer key above and shown in
the quiz itself. Have the policy owner confirm those mappings, particularly where the
quiz makes a judgment the PDFs do not state outright:

- **Question 11** applies the inheritance rule from the leader governance policy, which
  is the only content drawn from a document aimed at managers. It is included because
  it governs a choice employees make constantly.
- **Question 3** treats a customer service ticket as Yellow operational work. The
  reclassification triggers say to move data up a color when internal data is combined
  with customer information, so a ticket carrying customer financial details would
  be Red.
- The policies leave the escalation contact blank. The quiz says "your manager or
  IT/Security" throughout; replace it with the real contact before rollout.
