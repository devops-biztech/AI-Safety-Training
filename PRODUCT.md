# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Employees at **Biztech** and at **Biztech's client companies**. Biztech creates the
training and assigns it; learners take it because it was assigned, not by choice. They
use AI tools in ordinary office, operations, finance, HR, sales, and field-service
work, and are not security or AI specialists.

- **Everyone** takes module v1 (data handling) and v2 (prompt and verify).
- **Managers, department heads, and executives** also take v3 (agent governance).
- **Biztech** (and, through Biztech, the client) is the audience for the completion
  record: it needs to know who completed which module, when, and with what result.

## Product Purpose

AI security awareness training: three scenario-based modules of 20 questions each,
grounded in the company AI policies. Together they cover what goes into AI (v1), what
comes out of it (v2), and what it may do on its own (v3).

Success means the learner passes (80%, currently 16 of 20), understands why each answer
lands where it does, and leaves a completion record Biztech can rely on.

## Positioning

Every answer traces to a named section of the three policy documents, and the source is
shown with the explanation, so the answer key can be audited against the policies.
Where a module teaches something the policies do not state (prompting technique in v2),
the source says **Good practice** instead of a policy section.

The feedback teaches the fix, not just the score: why the answer is right, what the
person actually does in practice, and, in v2, a better prompt.

The training stays neutral on whether to use AI. It teaches what you put in, what you
check, and what AI may do without a person. It does not teach whether to use the tools.

## Operating Context

- Biztech is the training provider and the learners' IT/security support. When a
  learner is unsure or needs to report something, the training directs them to
  **Biztech support**: email **support@trustbiztech.com** or phone **(707) 442-8393**.
- Runs as a static web page: open `index.html` in a browser, with no build step, server,
  or dependencies.
- Source documents live in `policies/`: `employee_ai_security_policy.pdf`,
  `leader_ai_governance_policy.pdf`, `plain_language_vendor_terms.pdf`. They are
  gitignored (`*.pdf`), so they exist only on local checkouts.
- **Prototype stage.** The version dropdown stays for now so reviewers can reach the
  full suite. How learners are assigned modules in production is deferred.

## Capabilities and Constraints

Built:

- Three modules, each with its own question bank: `questions.js` (v1),
  `questions-v2.js` (v2), `questions-v3.js` (v3 plus the autonomy ladder `STAGES`).
- Question types: color classification (Red/Yellow/Green), A–D choice, ladder (pick a
  stage 1–4), and spot-the-problems (select every problem line; all-or-nothing).
- Immediate feedback after each answer; a results screen with a per-area breakdown, a
  review of only the missed questions, and "retry missed".
- Pass mark is a share of the bank (`PASS_RATE` 0.8 in `app.js`).
- Plain HTML, CSS, and vanilla JavaScript. It must keep working when opened as a local
  file.

Required, not yet built (the **completion record**):

- Always holds: module, score, pass/fail, and completion date.
- Also holds the learner's **name, email, and company**, entered before the first
  question, like signing in to a course.
- **Every finished attempt** produces a record, pass or fail, so Biztech can see who
  needs follow-up. Only a pass earns a certificate.
- Delivered two ways: a **certificate** the learner can save or print, **and** an
  **automatic submission** to a collection point.

Open decisions (do not fill in with invented values):

- **Collection point** for automatic submission: not chosen. Build against a
  configurable endpoint.
- **Module assignment** in production (per-module links, course menu, or sequence):
  deferred past the prototype.
- **Policy-owner sign-off** on the answer mappings listed under "Before real use" in
  `README.md`.

Terminology to keep:

- Data classification: **RED** (Do not share), **YELLOW** (Needs approval), **GREEN**
  (Can be shared). An AI output inherits the highest classification of any input.
- Tool tiers, in plain language: **company-approved**, **department-approved**,
  **personal or free**.
- Autonomy ladder: **Stage 1 Read-only**, **Stage 2 Draft and propose**, **Stage 3
  Conditional autonomy**, **Stage 4 Full autonomy**.
- v2 skills: prompt, verify, own. v3 areas: autonomy, access, oversight.

## Brand Commitments

- The name is always written **Biztech**: capital B, lowercase t. Never "BizTech".
- **Biztech only**, for every learner, including client employees. No client
  co-branding.
- Logo: `biztech.png` (600×300, transparent PNG). "biz" is set in blue `#164679`;
  "Tech" is in a green script, `#1a4321` (colors sampled from the file).
- White logo for dark surfaces: `biztech-white.png` (600×260, transparent PNG, all
  `#ffffff`).
- Voice in the shipped copy: plain language, direct, second person to the learner.
  Scenario characters have names and no pronouns, so every scenario reads the same
  whoever takes it.

## Evidence on Hand

- 60 authored questions with explanations, practice notes, and policy citations, plus
  answer keys and known gaps in `README.md`.
- The three policy PDFs in `policies/` (local only).
- The Biztech logo, `biztech.png`, and its white version, `biztech-white.png`.
- The support contact: support@trustbiztech.com, (707) 442-8393.

Absent, and must not be fabricated: the collection endpoint, any
client names or logos, completion data or statistics, and any accreditation or
compliance certification of the training.

## Product Principles

1. **Every answer traces to policy.** If the policy does not say it, it is labelled
   good practice, never passed off as policy.
2. **Teach the fix, not just the score.** Every answer, right or wrong, ends with the
   reasoning and what to do in practice.
3. **The completion record is evidence.** It has to be complete and trustworthy enough
   for Biztech to rely on, not a decorative certificate.
4. **One provider voice.** Biztech speaks to its own staff and to client employees the
   same way.
5. **Neutral on adoption.** The subject is handling, checking, and oversight, not
   whether to use AI.

## Accessibility & Inclusion

- WCAG 2.1 AA is the floor, and the current build meets it: contrast in light and dark
  themes, keyboard operation, screen-reader focus management, and Windows high-contrast
  mode.
- Color is never the only signal. Red/Yellow/Green always carries its text label, and
  every answered option is marked in words.
- Assigned training reaches every employee, so no one should need a particular device,
  ability, or familiarity with AI tools to complete it.
