---
name: Biztech AI Security Training
description: A training pass and a departure board of items, in workplace-safety-sign colours at restrained scale.
colors:
  stone-100: "#ededeb"
  stone-050: "#f8f8f6"
  stone-300: "#d3d3cf"
  stone-400: "#b4b4ae"
  stone-500: "#7c7c76"
  stone-600: "#686863"
  stone-700: "#54544f"
  stone-950: "#141414"
  navy-500: "#164679"
  navy-700: "#0f3560"
  navy-200: "#8fb8e4"
  sign-red: "#c8102e"
  sign-yellow: "#f2b705"
  sign-green: "#00843d"
  red-700: "#b0102a"
  green-700: "#0b6a33"
  field-white: "#ffffff"
typography:
  display:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.02em"
  headline:
    fontFamily: "Barlow, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Barlow, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  figure:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.04em"
  body:
    fontFamily: "Barlow, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "100%"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
  body-lead:
    fontFamily: "Barlow, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.12em"
  row:
    fontFamily: "Barlow Semi Condensed, Barlow, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.05em"
rounded:
  tag: "2px"
  check: "3px"
  control: "4px"
  panel-compact: "8px"
  panel: "10px"
  certificate: "14px"
spacing:
  hair: "4px"
  xs: "6px"
  sm: "10px"
  md: "12px"
  lg: "16px"
  xl: "22px"
  gutter: "24px"
  section: "28px"
  board: "32px"
components:
  button-primary:
    backgroundColor: "{colors.navy-500}"
    textColor: "{colors.field-white}"
    typography: "{typography.row}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.navy-700}"
    textColor: "{colors.field-white}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.stone-950}"
    typography: "{typography.row}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
    height: "46px"
  button-small:
    backgroundColor: "{colors.navy-500}"
    textColor: "{colors.field-white}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
    height: "44px"
  tag-navy:
    backgroundColor: "{colors.navy-500}"
    textColor: "{colors.field-white}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "3px 8px"
  tag-red:
    backgroundColor: "{colors.sign-red}"
    textColor: "{colors.field-white}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "3px 8px"
  tag-yellow:
    backgroundColor: "{colors.sign-yellow}"
    textColor: "{colors.stone-950}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "3px 8px"
  tag-green:
    backgroundColor: "{colors.sign-green}"
    textColor: "{colors.field-white}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "3px 8px"
  tag-line:
    backgroundColor: "transparent"
    textColor: "{colors.stone-950}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "3px 9px"
  panel:
    backgroundColor: "{colors.stone-050}"
    textColor: "{colors.stone-950}"
    rounded: "{rounded.panel}"
    padding: "24px 28px 26px"
  pass-band:
    backgroundColor: "{colors.navy-500}"
    textColor: "{colors.field-white}"
    typography: "{typography.label}"
    padding: "12px 22px"
  field-input:
    backgroundColor: "{colors.field-white}"
    textColor: "{colors.stone-950}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
    height: "44px"
    width: "100%"
  module-select:
    backgroundColor: "{colors.stone-050}"
    textColor: "{colors.stone-950}"
    typography: "{typography.row}"
    rounded: "{rounded.control}"
    padding: "8px 40px 8px 12px"
    height: "44px"
  board-head:
    backgroundColor: "transparent"
    textColor: "{colors.stone-700}"
    typography: "{typography.label}"
    padding: "6px 12px"
  option-row:
    backgroundColor: "transparent"
    textColor: "{colors.stone-950}"
    rounded: "0"
    padding: "11px 12px"
    height: "56px"
  option-row-selected:
    backgroundColor: "{colors.stone-950}"
    textColor: "{colors.field-white}"
  option-row-muted:
    backgroundColor: "transparent"
    textColor: "{colors.stone-600}"
  gate-row:
    backgroundColor: "transparent"
    textColor: "{colors.stone-950}"
    typography: "{typography.row}"
    padding: "4px 4px"
    height: "38px"
---

# Design System: Biztech AI Security Training

## Overview

**Creative North Star: "The Training Pass and the Gate Board"**

The learner is issued a pass and then works a board. Everything on screen belongs to one of those two objects: a navy-banded pass down the left with the learner's name set large in condensed caps, figures in ruled cells, a barcode, and a dashed perforation above the stub; and, to the right, boards of ruled rows — the module's reference table, the answer options, the item board, the results breakdown. Nothing is a card, nothing floats, nothing is decorated. The page reads like printed ephemera that happens to be interactive.

The palette is workplace safety signage held at a deliberately small scale. Red, yellow and green are the subject matter of this training, so they carry real meaning and are spent carefully: they appear as small solid tags and as 4px rules over a block of text, never as a panel fill or a page wash. Navy is the only colour allowed to fill anything larger, and only on the pass band, the certificate band and primary buttons. The result is a near-monochrome ground (#ededeb) with panels one step lighter (#f8f8f6), black ink, and colour arriving only where it is load-bearing.

Three token layers do the work: primitives, semantic roles, components. Dark mode remaps only the semantic layer — it is composed as a board at night (ground #111315, panel #1a1d20), not a mechanical inversion. Dimming is a colour decision, never an opacity one. State is carried by inversion (a chosen row turns solid) always paired with a word, so nothing depends on colour or fill alone. The accessibility floor is part of the visual system, not a retrofit: AA contrast in both themes, a forced-colors block, 44px minimum controls, and a 3px focus ring.

**Key Characteristics:**
- Ruled rows, not cards: hairlines between rows, a strong rule under head rows.
- Two faces only: Barlow reads, Barlow Semi Condensed caps label.
- Signal colours confined to small solid tags and 4px top rules.
- State by inversion plus a word, never colour alone.
- Tabular figures everywhere; body type at 100% of the reader's setting.
- One shadow, one motion moment, no decoration beyond the perforation and barcode.

## Colors

A near-monochrome stone ground carrying one institutional navy and three safety-sign signals at small scale.

### Primary
- **Biztech Navy** (`{colors.navy-500}`): the pass band, the certificate band, primary buttons, the progress fill, the lit rungs on the autonomy ladder, the focus ring in light mode, and the module code tag. Sampled from the Biztech logo. It is the only colour permitted to fill an area larger than a tag.
- **Navy Deep** (`{colors.navy-700}`): the hover state of primary buttons, nothing else.
- **Navy Light** (`{colors.navy-200}`): the focus ring in dark mode only, where the 500 lacks contrast against the night ground.

### Secondary
The three safety signals. Each is a classification the training teaches, so its use is semantic, never decorative.
- **Signal Red** (`{colors.sign-red}`): the RED tag, the 4px rule over the never-list, the load-error rule and the noscript rule, and the incorrect-verdict rule.
- **Signal Yellow** (`{colors.sign-yellow}`): the YELLOW tag and the 4px rule over an inheritance note. Always takes ink, never white.
- **Signal Green** (`{colors.sign-green}`): the GREEN tag and the 4px rule over a correct verdict.
- **Red Ink** (`{colors.red-700}`) and **Green Ink** (`{colors.green-700}`): the text-safe darkenings used for verdict headings, a failed or sent stub, a wrong answer in review, and a pass/fail result figure. Dark mode remaps these to #ff9a93 and #74d39c.

### Neutral
- **Stone Ground** (`{colors.stone-100}`): the page behind every panel.
- **Stone Panel** (`{colors.stone-050}`): every raised panel, the pass body, the module select.
- **Field White** (`{colors.field-white}`): text inputs only, so an editable surface is visibly the lightest thing on the page.
- **Rule** (`{colors.stone-300}`): hairlines between board rows, panel borders, field dividers, the empty progress track.
- **Perforation** (`{colors.stone-400}`): the 2px dashed tear line above the stub and above the certificate foot, and the scrollbar thumb.
- **Control Line** (`{colors.stone-500}`): input edges at rest (4.2:1 on white).
- **Ink Muted** (`{colors.stone-600}`): dimmed board rows, waiting statuses, placeholder text, unflagged review lines.
- **Ink Soft** (`{colors.stone-700}`): labels, column heads, sub-text, source lines (7.2:1 on panel).
- **Ink** (`{colors.stone-950}`): body copy, the strong rule under head rows, and the inverted fill of a chosen row.

### Named Rules
**The Signal-Not-Surface Rule.** Red, yellow and green may only appear as a small solid tag or as a 4px rule above a block of text. They never fill a panel, a button, a row, or a page region. Navy is the single exception to filled colour, and only on the pass band, the certificate band, and primary buttons.

**The Word-With-The-Colour Rule.** Every signal colour ships with its word — Red / Do not share, Correct, Your answer, Caught, Missed, Not a problem. If the colour were removed, the meaning must survive intact.

**The Colour-Not-Opacity Rule.** Dimming is done with `--ink-muted`, never with `opacity` or an alpha text colour. The only alpha values in the system are the panel shadow and the hover wash.

**The Semantic-Only Remap Rule.** Dark mode rewrites the semantic layer and nothing else. Components never reference a primitive or a raw literal, so a theme change is a one-layer edit. (The print certificate is the single documented exception; see Components.)

## Typography

**Display Font:** Barlow Semi Condensed (bundled 500/600/700, SIL OFL)
**Body Font:** Barlow (bundled 400/500/600/700, SIL OFL)
**Certificate Fonts:** Cinzel (bundled variable 400–700, SIL OFL), EB Garamond (bundled variable 400–600, SIL OFL), Pinyon Script (bundled 400, SIL OFL). These three are used **only** inside `.certificate`, the print-only award document; they never appear on screen.

**Character:** One family, two widths. Barlow is a grotesque with slightly rounded terminals — plain, legible, unfussy at long paragraph lengths. Its semi-condensed cut, always in caps with open letter-spacing, is the voice of the pass and the board: ticket labels, gate rows, tags, status words, big figures. The width change alone tells the reader whether they are reading prose or reading a board.

### Hierarchy
- **Display** (Semi Condensed 700, 2rem, 1.05, +0.02em, caps): the learner's name on the pass.
- **Headline** (Barlow 700, 2.125rem / 1.75rem below 640px, 1.15): the module title and the result title. Single-line display type; its tight leading is intentional.
- **Title** (Barlow 500, 1.375rem, 1.4): the question prompt. When a scenario precedes the question, the prompt switches to Semi Condensed 700 caps at 1.25rem and the question after the story (Barlow 600, 1.25rem) carries the weight instead.
- **Figure** (Semi Condensed 700, 1.3125rem, 1.15, +0.04em, caps): the pass's item / to-pass / correct cells and the result value. 1.125rem for the breakdown count.
- **Body Lead** (Barlow 400, 1.0625rem, 1.55, max 66–68ch): ledes, scenario text, answer text, verdict explanations.
- **Body** (Barlow 400, 100%, 1.5, tabular figures, max 64–72ch): board rows and everything else. The base size is `100%`, not a pixel value, so body copy follows the reader's browser text size.
- **Small** (Barlow 400/500/600, 0.9375rem): sub-text, notes, support line, field errors.
- **Label** (Semi Condensed 500, 0.75rem, +0.12em, caps): field labels, column heads, the masthead title, gate titles.
- **Row** (Semi Condensed 600, 0.875rem, +0.05em, caps): gate board rows, the module select.
- **Tag / Status** (Semi Condensed 700, 0.75–0.8125rem, +0.1em, caps): tags, buttons, verdict source lines, status marks.

### Named Rules
**The Two-Voice Rule.** Barlow reads; Barlow Semi Condensed labels. Prose, explanations and scenarios are never set in the condensed face; tags, board rows, buttons, figures and field labels are never set in the reading face. No third family enters the screen system.

**The Certificate Exception.** The printed certificate is the one documented departure, and it is total: Cinzel sets `CERTIFICATE`, `OF COMPLETION` and the seal; EB Garamond sets its prose and ruled-line values; Pinyon Script sets the learner's name. Barlow Semi Condensed survives there only in the last record line. These faces stay inside `.certificate`; bringing any of them onto a screen surface, or bringing Barlow into the body of the certificate, breaks the rule.

**The Reader's-Size Rule.** Body is `font-size: 100%`. Never pin the base to a pixel value; every other size is expressed in rem against it.

**The Tabular Rule.** `font-variant-numeric: tabular-nums` is set on `body` and inherited everywhere. Scores, item counters and record codes must align down a column.

## Layout

A two-column grid, max width 1360px, gutter 24px, page padding 24px 32px 56px: a fixed pass column (`--pass-width`, 360px, 320px below 1080px) beside a fluid work column. The pass becomes sticky at 16px from the top when the viewport is at least 901px wide and 700px tall, so it stays in view while a long explanation scrolls. Screens inside the work column stack on a 16px grid.

Breakpoints are three. At **1080px** the pass narrows, panel padding drops to 22px, board label columns shrink (13rem → 10rem), and the item board collapses from two columns to one. At **900px** the grid becomes a single column with the pass on top — issuing the pass is the first step, so it leads on every screen — and during the quiz and results the pass compresses to a slim strip: name, the current figures, and the progress rule, with the company, module, barcode, meta and email rows hidden. The stub survives on results because it is what says whether Biztech has the record. At **640px** the masthead title and module label go screen-reader-only, the select goes full width, panels drop to 8px corners and 18px 16px padding, headings step down, every board row collapses to one column, an answer's status mark drops beneath its text rather than squeezing it, and the footer button goes full width.

Spacing rhythm runs 4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 22 / 24 / 28 / 32px. Board rows are 12px 10px with a 38px minimum on the gate board and 56px on answer rows. Sections separate by 28px plus a rule, not by whitespace alone.

**The Measure Rule.** Every reading column is capped: ledes and notes at 66–70ch, answer text and explanations at 68ch, the reading column of any board at 72ch. A breakdown row and a head row are exempt because they carry no prose.

## Elevation & Depth

Almost flat. The system separates things with rules and tonal steps, not with stacking. There is exactly one shadow token, and it belongs to raised containers only: the panel and the pass. Everything else — boards, rows, tags, buttons, inputs, the stub — sits directly on its surface and is bounded by a 1px hairline, a 1.5px control line, a 2px dashed perforation, or a 4px signal rule. Depth reads as paper on a table, not as an interface stack.

### Shadow Vocabulary
- **Panel** (`box-shadow: 0 1px 2px rgba(20,20,20,.06), 0 8px 22px rgba(20,20,20,.06)`): the only shadow. A tight contact layer plus a wide, very light ambient. In dark mode it deepens to `0 1px 2px rgba(0,0,0,.5), 0 8px 22px rgba(0,0,0,.3)`. Removed entirely in print.

### Named Rules
**The One-Shadow Rule.** A surface either is a panel (one shadow, 10px corners, 1px border) or it is not (no shadow at all). There is no hover shadow, no focus shadow, no elevated variant. Hover is a 4.5% ink wash; focus is a 3px outline.

**The Rule-Over-Weight Rule.** Hierarchy between rows is expressed in rule strength, not in fills: a strong ink rule under head rows, a stone hairline between rows, a 4px signal rule above a block that carries a verdict or a warning.

## Shapes

Rectilinear and ticket-like. Corners are quiet and graded by size: 2px on tags and checks, 3px on the spot-the-problem box, 4px on controls (buttons, inputs, the select), 10px on panels and the pass (8px on small screens), 14px on the printed certificate. Board rows and answer rows have no radius at all — they are ruled bands, and an inverted row runs full-bleed to the edges of its board.

The recurring silhouette is the ticket: a filled navy band across the top, a body of ruled cells with the figures divided by 1px verticals, and a 2px dashed perforation separating the stub. The barcode under the figures is a drawn SVG in current ink, not an image. The autonomy ladder's four rising bars (22×18px, 2px gaps) are the only other drawn mark, and they are decorative — the stage name carries the meaning. Icons are inline SVG (the check mark) or drawn from CSS borders (the select and disclosure chevrons); there are no icon fonts or glyph characters.

## Components

### Buttons
- **Shape:** Slightly softened rectangle (4px), 1.5px transparent border reserved so forced-colors mode can paint it.
- **Primary:** Navy fill, white text, condensed caps at 0.9375rem +0.1em, 12px 22px padding, 46px minimum height. `btn-wide` takes the full pass width; `btn-small` drops to 44px and 0.8125rem.
- **Quiet:** Transparent with a 1.5px ink border and ink text, same metrics. Used for "Start over" and other non-committal actions.
- **Hover / Focus:** Hover only under `(hover: hover)` — primary deepens to navy-700, quiet takes the 4.5% ink wash. Focus is the global 3px outline at 2px offset. Colour transitions run 140ms on `--ease-out` (`cubic-bezier(.2,.7,.2,1)`) and are removed under reduced motion.

### Tags
- **Style:** Solid fill, 2px corners, 3px 8px padding, condensed caps 0.75rem +0.1em, with a 1px transparent border that forced-colors mode paints as CanvasText. Four fills: navy, red, yellow (ink text), green.
- **Line variant:** transparent with a `currentColor` border, used for check lists on the reference card.
- **Rule:** A tag is a small solid mark next to a word, never a standalone colour chip and never larger than its label.

### Cards / Containers
- **Corner Style:** 10px (8px below 640px).
- **Background:** Panel over ground.
- **Shadow Strategy:** the single panel shadow; see Elevation & Depth.
- **Border:** 1px hairline in addition to the shadow, so the edge survives when the shadow is suppressed (print, forced colors).
- **Internal Padding:** 24px 28px 26px, tightening to 22px then 18px 16px 20px.

### Inputs / Fields
- **Style:** White fill on the panel, 1.5px control-line border, 4px corners, 8px 12px padding, 44px minimum height, label above in condensed caps. Fields are separated by a 1px bottom rule, so the pass reads as a form printed in cells.
- **Focus:** Border shifts to navy and the global outline draws at 1px offset.
- **Error:** Border shifts to red-ink and a 0.9375rem red message appears beneath. Marked with `aria-invalid`, never by colour alone.

### Navigation
The masthead is a single rule-bottomed bar: logo (30px, swapping to the white mark under `prefers-color-scheme: dark`), a 1px vertical divider, the page title in condensed caps, and the module select pushed right. The select is a 44px control with an appearance-reset and a CSS-drawn chevron. Below 640px the title and label become screen-reader-only and the select takes the full width.

### The Training Pass (signature)
Navy band with the white wordmark and "TRAINING PASS"; then ruled segments — learner name in 2rem condensed caps with the email beneath, company, module — then three figures in ruled cells (item / to pass / correct, becoming score / to pass / result when finished, with the result in green or red ink); then a 4px progress track whose navy fill animates by `transform: scaleX()` over 350ms; then the drawn barcode and the record meta. A 2px dashed perforation closes the body and the stub below states whether Biztech has the record: plain weight when no endpoint is configured (a setup gap is not the learner's error), green and 600 when sent, red and 600 when it failed.

### The Gate Board (signature)
A two-column list of item rows (collapsing to one below 1080px), topped by a strong ink rule, with hairlines between rows. Each row is number / topic / status in condensed caps at 0.875rem, 38px minimum height, the waiting rows in muted ink and the current row in full ink. Answering flips that item's status in place: `.flip` rotates the status through `perspective(240px) rotateX(-90deg → 12deg → 0)` over 360ms, like a split-flap. **This is the system's only animation.** It is disabled under `prefers-reduced-motion`, where the status simply arrives.

### Answer Rows
Each option is a full-width button laid on a grid keyed to its question type (color / choice / ladder / spot), 56px minimum height, transparent, bounded by a hairline, with an optional head row above it carrying column names under a strong rule. Hover is the ink wash. **A chosen answer, or a flagged line in spot-the-problems, inverts**: `--invert-bg` fill, `--invert-ink` text, sub-text at `--invert-soft`, and the bottom rule recoloured so the band is unbroken. The correct answer carries the word "Correct answer" with an inline SVG check in green ink; the learner's own carries "Your answer" as a tag. Unselected rows after an answer go to `--ink-muted`. In forced-colors mode, where the fill is stripped, the inverted row gains a 3px Highlight outline.

### The Verdict
Printed under the answers behind a 4px rule: green when right, red when wrong, ink when neutral. Heading in red or green ink at 1.1875rem/700, explanation at 1.0625rem/68ch, an "In practice" action paragraph, and a source line in condensed caps 0.8125rem noting the policy section. Focus moves here when it appears, so a screen reader lands on the result rather than hunting for it.

### The Certificate (print only)
`display: none` on screen; the print block hides everything else on the page and shows it alone. It prints letter landscape on a single sheet: `app.js` adds `@page { size: letter landscape; margin: 12mm }` to the head while the certificate exists and removes it again afterwards, because a named `@page` is ignored by some browsers, which then printed it portrait and spilled onto a second sheet. Its height is pinned (`height: 186mm`) so content can never push it to a second page.

**It is the one place that leaves the screen system.** It is a formal award document, not a pass stub: a navy frame with a green hairline inside it, the Biztech logo centred, `CERTIFICATE` in Cinzel 40pt tracked caps over `OF COMPLETION` in green, a ruled divider with a drawn diamond, the learner's name in Pinyon Script 46pt over a hairline, the company beneath, then a sentence of EB Garamond prose carrying the module and the score as a percentage. The foot holds the date awarded and the issuer over ruled lines, with a drawn seal between them (navy disc, white rings, green ribbon, the module code and `Passed` inside), and a last line in Barlow Semi Condensed with the record number, the learner's email and the support contact. **It hardcodes literal colours** (#141414, #164679, #1a4321, #54544f, #b4b4ae) instead of semantic tokens, deliberately: a printed record must not follow the screen theme. Treat that as a scoped print exception, not as licence to use literals elsewhere.

## Do's and Don'ts

### Do:
- **Do** declare new colour in the semantic layer and let components read only semantic tokens; primitives and raw hex stay out of component rules (print certificate excepted).
- **Do** spend the signal colours only as a small solid tag or a 4px rule above text, and always next to the word that names the state.
- **Do** dim with `--ink-muted`. A dimmed row is a colour change, not an opacity change.
- **Do** build any new tabular surface as ruled rows: strong ink rule under the head row, 1px stone hairlines between rows.
- **Do** keep two faces — Barlow for anything read as prose, Barlow Semi Condensed caps for anything read as a label, tag, figure or board row.
- **Do** keep body at `font-size: 100%` and size everything else in rem against it.
- **Do** pair every state change with a word, and give every interactive target at least 44px (46px for the standard button).
- **Do** cap reading columns at 64–72ch and keep tabular figures on.
- **Do** carry state inversion with `--invert-bg` / `--invert-ink`, and add a forced-colors fallback whenever a fill is doing work.

### Don't:
- **Don't** fill a panel, row, button or page region with red, yellow or green. Navy is the only colour that fills, and only on the pass band, the certificate band and primary buttons.
- **Don't** use `opacity` to express a de-emphasised or disabled state.
- **Don't** turn a board into cards: no per-row background, no per-row border box, no radius on rows.
- **Don't** add a second shadow, a hover lift, or a focus glow. One panel shadow; hover is a wash, focus is a 3px outline.
- **Don't** add a second animation. The split-flap status is the system's one motion moment, and it must stay behind `prefers-reduced-motion`.
- **Don't** set prose in the condensed face, or a tag, figure or board row in the reading face, and don't introduce a third family.
- **Don't** pin the base font size in pixels, and don't set a fixed pixel line-height on multi-line copy.
- **Don't** express a classification, a verdict, or a selection by colour alone, and don't ship a fill-dependent state without a forced-colors rule.
- **Don't** hardcode a hex outside the print certificate block.
