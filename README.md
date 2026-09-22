# Biztech AI security training (prototype)

Three 20-question training modules in one app, delivered by Biztech to its own staff and
to client employees. A **Module** dropdown in the header switches between them, and the
browser remembers the last one used (first visit opens AI-2).

The learner fills in a **training pass** (name, work email, company) before the first
item, works the module with feedback after every answer, and every finished attempt
produces a **record**: sent to Biztech (see [Sending records](#sending-records)) and, on
a pass, a printable certificate.

| Module | Code | Audience | Teaches | Bank |
|--------|------|----------|---------|------|
| **Data handling** | AI-1 (`v1`) | Everyone | A three-color system for deciding what data may be shared with AI tools | `questions.js` |
| **Prompt and verify** | AI-2 (`v2`) | Everyone | How to write a prompt that gets a usable answer, and what to check before relying on it | `questions-v2.js` |
| **Agents (managers)** | AI-3 (`v3`) | Managers, department heads, executives | What AI agents may do on their own, and the permissions, vendor terms, testing, and incident response around them | `questions-v3.js` |

Together the three cover what goes into AI (v1), what comes out (v2), and what it does
on its own (v3).

Sections marked (v1) describe the data-handling quiz; [v2](#v2-prompt-and-verify) and
[v3](#v3-agents-for-managers) have their own sections.

## v1: Data handling

All v1 content is derived from the documents in [`policies/`](policies/).

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
| `index.html` | Page shell: header with module picker, the training pass, start screen, quiz screen, results screen, and the print-only certificate. Version-specific markup carries `data-version="v1"`, `"v2"` or `"v3"` |
| `styles.css` | All styling. Colors, type and radii are CSS variables in `:root`; see [Design system](#design-system) |
| `config.js` | Deployment settings: where records are sent. Edit this, not `app.js` |
| `fonts/` | Barlow and Barlow Semi Condensed for the app, plus Cinzel, EB Garamond and Pinyon Script for the certificate. All SIL Open Font License (`fonts/OFL*.txt`), bundled so the page and the certificate work offline |
| `img/` | Trimmed copies of the Biztech logos used by the page. The originals are `biztech.png` and `biztech-white.png` |
| `PRODUCT.md` | Who the training is for, what it must do, and brand commitments |
| `questions.js` | **The v1 question bank** — edit this to change v1 content |
| `questions-v2.js` | **The v2 question bank** — edit this to change v2 content |
| `questions-v3.js` | **The v3 question bank** and the autonomy ladder (`STAGES`) — edit this to change v3 content |
| `app.js` | Quiz logic: the pass, versions, rendering, scoring, feedback, review, the item board, sending the record, the certificate. Per-module code, name and results breakdown live in `VERSIONS` at the top |

## Design decisions (v1)

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
- **Escalation goes to Biztech support** (support@trustbiztech.com, (707) 442-8393) in
  the interface: the question footer, the start screen's source line, the certificate.
  Some `action` lines inside the question banks still say "ask your manager or
  IT/Security"; those are question content and were left as written.
- Color is never the only signal. Every color is paired with its text label, so the
  quiz works for colorblind users.

## Editing v1 questions

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
  options: [{ id: "a", text: "..." }, ...],   // keep to 4; keyboard uses A-D or 1-4
  answer: "c",
  why: "...",
  action: "...",
  source: "Vendor terms - ...",
}
```

Other knobs:

- Pass mark: `PASS_RATE` at the top of `app.js` (0.8, so 16 of 20). It is a share of
  the bank, so adding or removing questions keeps the pass mark in proportion.
- Color names and descriptions: the `COLORS` object at the top of `questions.js`.
  These drive the start-screen legend, the answer buttons, and the in-quiz reminder.

## Answer key (v1)

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

## Known gaps (v1)

Twenty questions cannot cover three policy documents. Not currently tested:

- The truthfulness promise (no impersonation, fabricated testimonials, or deceptive
  media). Currently carried in question 2's explanation rather than its own question.
- Six of the eight vendor contract terms — subprocessor disclosure, data residency,
  MFA, audit logging, breach notification, and exit/deletion. Questions 14 and 15
  cover the DPA and the no-training clause, and name the others in passing.
- Everything in the leader governance policy except the inheritance rule: agentic AI,
  the autonomy ladder, integrations, agent permissions, testing, and audits. That doc
  is written for managers and the C-suite and would suit a separate leader quiz.

## v2: Prompt and verify

v1 covers what you may put into an AI tool. v2 covers how to ask it well and what to
check before you rely on the answer. It leaves data classification to v1.

Question 1 is the replacement-part scenario: Sam's vague prompt, the confident but
wrong answer, the better prompt, and the check against the manufacturer and
distributor. The other 19 scenarios apply the same idea in other settings.

### Design decisions

- **Every item is a short story followed by one A–D question**, and the question
  changes from item to item: what went wrong, which prompt is best, what to check,
  what to do next. The story shows what someone typed to the AI (**Prompt**) and what it
  said back (**AI response**) as separate labelled blocks.
- **The feedback teaches the fix**, not just the answer: the explanation, then a
  **better prompt** where one fits, **In practice** (what the person actually does), and
  a one-line **Lesson**.
- **Three skills instead of three colors.** Each question has a `skill`: `prompt`
  (asking well, 8 questions), `verify` (checking the output, 7), or `own` (who decides
  and who is accountable, 5). The results breakdown counts misses per skill.
- **The start screen sets out the method** the questions test: the four parts of a good
  prompt (goal, exact specifications, constraints, desired output), then which facts to
  verify and what to check them against.
- **Length gives nothing away.** Answers are spread 5/5/5/5 across A–D, and the correct
  option is the longest in only 5 of 20 questions.
- **Characters have no pronouns**, only names, so every scenario reads the same
  regardless of who is taking it.

### Editing v2 questions

```js
{
  id: 1,
  type: "choice",
  skill: "prompt",                  // "prompt" | "verify" | "own"
  tag: "Field Service",             // shown with the source in the review
  title: "The confident parts quote",
  scenario: [                       // the story, in order
    "A customer needs a replacement part. Sam asks AI:",   // paragraph
    { input: "Find a replacement part for this device." }, // what was typed
    { output: "..." },                                     // what the AI said
  ],
  prompt: "What should Sam do before quoting the customer?", // the question
  options: [{ id: "a", text: "..." }, ...],                  // keep to 4
  answer: "c",
  why: "...",
  betterPrompt: "...",              // optional
  action: "...",                    // optional "In practice" line
  lesson: "...",                    // optional takeaway
  source: "Employee policy - ...",  // or "Good practice"
}
```

### Answer key

| # | Answer | Skill | Topic | Source |
|---|--------|-------|-------|--------|
| 1 | C | prompt | Replacement part: vague prompt, stale price and stock | Employee — Promise 2; Final test |
| 2 | B | verify | A citation that does not exist | Employee — Final test; Leader — Hallucination |
| 3 | D | prompt | Late-delivery reply: the four-part prompt | Good practice; Employee — Promise 3 |
| 4 | A | verify | Safety requirement: time- and place-sensitive | Employee — Final test; Yellow |
| 5 | C | verify | AI "double-checking" its own math | Employee — Final test |
| 6 | B | prompt | Summary with no audience or format | Good practice |
| 7 | A | prompt | "Fill every cell" invents a warranty | Good practice; Leader — Hallucination |
| 8 | D | verify | Summary drops the exceptions | Employee — Yellow |
| 9 | C | own | AI answer vs. official policy page | Employee — Yellow; Promise 3 |
| 10 | A | prompt | One giant prompt vs. small steps | Good practice; Employee — Yellow |
| 11 | D | own | Review scaled to the stakes | Employee — Final test |
| 12 | B | verify | Confident tone is not evidence | Leader — Troubleshooting principle |
| 13 | A | prompt | Examples and specs over adjectives | Employee — Green; Promise 5 |
| 14 | C | verify | Formula that runs but may be wrong | Leader — Silent failure |
| 15 | D | own | AI draft "guarantees" a delivery date | Employee — Promise 3; Yellow |
| 16 | B | prompt | Ask for the assumptions behind an estimate | Good practice; Employee — Final test |
| 17 | C | verify | Invented quote and statistic | Employee — Promise 5; Green |
| 18 | A | own | Correct the source, not just your copy | Employee — Promise 6; Leader — Hallucination |
| 19 | D | prompt | Outdated answer: bring the current source | Good practice; Leader — Hallucination |
| 20 | B | own | "The AI gave it to me" | Employee — The point |

### Before real use (v2)

The policies say to verify AI output and keep people accountable. They do not say how
to write a prompt. Where v2 teaches prompting technique, the source line says
**Good practice**, not a policy section. Have the policy owner confirm or adopt:

- **Questions 3, 6, 7, 10, 16 and 19**, whose answers rest partly or wholly on good
  practice.
- **The four-part prompt method** on the start screen (goal, exact specifications,
  constraints, desired output). It comes from the replacement-part example, not the
  PDFs.
- **Questions 2, 7, 12, 14, 18 and 19 cite the leader governance policy** (its
  troubleshooting principle and failure-mode table), which is written for managers.
  The principles apply to everyone, but the employee policy does not state them.

## v3: Agents, for managers

v3 is written for managers, department heads, and executives, and every answer comes
from the leader governance policy. This covers most of what the README's v1 "Known gaps"
listed as untested: agentic AI, the autonomy ladder, integrations, agent permissions,
testing, audits, and the remaining vendor contract terms.

### Design decisions

- **Three kinds of question**, so v3 doesn't feel like v2 again:
  - **Ladder (6):** four buttons, one per stage of the autonomy ladder. Most ask which
    stage an agent is at; two ask the highest stage an agent should reach, or where a new
    one should start. The correct answers cover all four stages.
  - **Spot the problems (6):** a plan, access request, integration request, vendor
    questionnaire, test plan, or log design, six lines each. The learner selects every
    line that is a problem, then presses **Check answer**. Each has 2–3 problems.
  - **Choice (8):** A–D decisions, mostly incident response. Answers are spread 2/2/2/2
    across A–D.
- **Spot-the-problem is scored all-or-nothing**: a question counts as correct only when
  every problem is found and nothing else is flagged. That keeps the 16/20 pass mark
  meaningful. The feedback labels every line in words — *Caught*, *Missed*, or *Not a
  problem* — with a note on why, so a near miss still teaches.
- **Three areas in the results breakdown:** *autonomy* (the ladder and what agents must
  never do, 8 questions), *access* (permissions, integrations, vendors, classification, 6),
  and *oversight* (testing, audit logs, incident response, 6).
- **The start screen shows the ladder, the "never without a person" list, and how each
  question type works.** The ladder is built from `STAGES`, so the start screen, the
  answer buttons, and the in-quiz reminder always match.
- **Keyboard:** with focus on the answers, 1–4 pick a stage and A–D (or 1–4) pick an
  option; on spot-the-problem, 1–6 toggle lines. The keys do nothing while focus is
  elsewhere, so a stray keystroke never answers. Once answered, Enter moves on.

### Editing v3 questions

```js
// ladder: pick a stage
{ id: 1, type: "ladder", area: "autonomy", tag: "Operations", title: "...",
  scenario: ["..."], prompt: "Which stage of the autonomy ladder is this agent at?",
  answer: "1",            // "1" | "2" | "3" | "4" - keys of STAGES
  why: "...", action: "...", source: "Leader governance policy - ..." }

// spot the problems: select every line that is a problem
{ id: 2, type: "spot", area: "autonomy", tag: "Finance", title: "...",
  scenario: ["..."], prompt: "Select every step ...",
  lines: [
    { text: "...", problem: false },
    { text: "...", problem: true, note: "Why it is a problem" },  // note shown after checking
    { text: "...", problem: false, note: "Why it is fine" },      // shown only if flagged
  ],
  why: "...", action: "...", source: "..." }

// choice: same shape as v2 (scenario + options + answer)
```

### Answer key

| # | Type | Answer | Area | Topic | Source (leader governance policy) |
|---|------|--------|------|-------|-----------------------------------|
| 1 | ladder | Stage 1 | autonomy | Morning ticket summary | Autonomy ladder |
| 2 | spot | 3, 5 | autonomy | Accounts payable agent: bank details, payments | Never without authorization; Finance |
| 3 | choice | C | oversight | Prompt injection: immediate response | Failure modes — Prompt injection |
| 4 | ladder | Stage 2 | autonomy | Drafts reviewed and sent by a person | Autonomy ladder |
| 5 | spot | 1, 4 | access | Access request: inherited permissions, shared key | Permission model |
| 6 | choice | D | access | Marketing's tool for HR data | Vendor tiering; HR; Integration risk matrix |
| 7 | ladder | Stage 1 | autonomy | First day in production | Autonomy ladder |
| 8 | spot | 2, 3, 6 | access | Finance system integration request | Integration checklist; Risk matrix; Sandbox-first |
| 9 | choice | A | access | Agents left by a departed employee | Permission review cycle |
| 10 | ladder | Stage 3 | autonomy | Categorize and acknowledge tickets | Autonomy ladder |
| 11 | spot | 1, 4, 5 | access | Vendor questionnaire | What every vendor must provide |
| 12 | choice | B | autonomy | What Stage 3 requires | Autonomy ladder |
| 13 | ladder | Stage 2 | autonomy | Emails in a rep's name | Never without authorization |
| 14 | spot | 2, 3, 5 | oversight | Pre-launch test plan | Testing requirements; Sandbox-first |
| 15 | choice | B | oversight | Salary data in a company-wide channel | Failure modes — Data leakage |
| 16 | choice | C | access | Summaries become legal evidence | Reclassification triggers |
| 17 | spot | 3, 6 | oversight | What to keep out of audit logs | Audit trail; What to redact |
| 18 | ladder | Stage 4 | autonomy | Phishing quarantine run without per-action review | Autonomy ladder |
| 19 | choice | D | oversight | "Probably a glitch" | Troubleshooting principle; Silent failure |
| 20 | choice | A | oversight | An analyst reports an agent's mistake | Leader's commitment (6); Tabletop |

### Before real use (v3)

- **The ladder's "When to advance" column is ambiguous.** For stage 1 it reads as the
  bar for *leaving* the stage (30–60 days, then on to stage 2). For stage 4 it can only
  be the bar for *being at* the stage. The quiz reads stages 3 and 4 as requirements for
  being at that stage: stage 3 "only after testing, audit logging, and a documented
  rollback path." Questions 10, 12, and 18 depend on that reading, so have the policy
  owner confirm it.
- **Question 7 says every agent starts at stage 1.** The policy says "do not grant full
  autonomy on day one" and lists the stages in order, but it never says outright that
  stage 1 is mandatory.
- **Question 18 treats quarantining phishing email as consequential** (stage 4) rather
  than low-risk (stage 3), because holding a real business email affects the business.
  The line between the two stages is a judgment the policy leaves to leaders.
- The policy leaves the approver for new AI tools and agents blank ("Submit questions to
  ____"). The footer says "submit ... for review"; name the real contact before rollout.

## Design system

The learner holds a **training pass** and works a **board of items**: a boarding-pass
and departure-board grammar, carrying the colors of workplace safety signs at a
restrained scale. `DESIGN.md` records the system in full; the rules worth keeping if you
extend this:

- **Signal colors are signals, not surfaces.** Safety red, yellow and green (and
  Biztech navy) appear only as small solid tags and 4px rules, never as filled panels.
- **Boards are ruled rows, never cards.** A strong rule under the head row, hairlines
  between rows.
- **State by inversion.** Your answer, and a flagged spot-the-problem line, turn solid
  ink. Status is always also said in words (Correct, Your answer, Caught, Missed).
- **States print themselves.** The verdict, the send status and errors are written into
  the page; nothing pops up.
- **Two faces.** Barlow for reading; Barlow Semi Condensed caps for labels, tags and
  board rows. Body text is `100%`, so it follows the reader's browser text size.
- **Tokens in layers.** Primitives, then semantic roles, then components; dark mode
  remaps the semantic layer only. Dimming uses a color token, never `opacity`.

The one piece of motion: when you answer, that item's status on the board flips in
place like a split-flap display, and the next row lights up as Now. With reduced motion
the status simply changes.

## Sending records

Every finished attempt, pass or fail, is sent as a JSON `POST` to
`QUIZ_CONFIG.submitUrl` in `config.js`. A "Retry missed" run sends the same record again
with the next `attempt` number.

```json
{
  "recordId": "AI1-7AX78S", "attempt": 1,
  "module": "AI-1", "moduleName": "Data handling",
  "name": "…", "email": "…", "company": "…",
  "score": 18, "total": 20, "passMark": 16, "passed": true,
  "issuedAt": "2026-09-22T17:51:00.000Z", "completedAt": "2026-09-22T18:03:00.000Z"
}
```

- `submitUrl` is empty until a collection point exists. The training still runs, and
  the stub on the pass tells the learner their record was not sent.
- The page can be opened from disk (origin `null`), so the endpoint has to allow CORS
  for a JSON `POST`.
- A failed send says so on the stub and offers **Try sending again**.
- Identity is on the honor system: the learner types their own name, email and company,
  and the certificate says "Details as entered by the learner". Proving identity needs a
  company sign-in later.
- The learner's details are kept for the session only, never stored in the browser, so
  the next person on a shared computer does not find someone else's name on their pass.

## Not built yet

- **A collection point.** Records are sent only once `submitUrl` is set.
- **Module assignment.** Learners pick a module from the dropdown; per-module links or a
  course sequence are deferred past the prototype.
- **Sign-in.** Identity is self-entered (see above).
- **LMS/SCORM export.**

## Before real use (v1)

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
