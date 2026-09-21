/* ------------------------------------------------------------------
   AI Prompting and Verification Quiz (v2) - question bank

   v1 asks what you may put into an AI tool. v2 asks how to ask it well
   and what to check before relying on what comes back.

   Answers cite ./policies where the policy supports them:
     - employee_ai_security_policy.pdf   ("Employee policy" below)
     - leader_ai_governance_policy.pdf   ("Leader governance policy")
   Prompt-writing advice the policies do not cover is cited as
   "Good practice" - see the README for the list to confirm.

   Question shape (always multiple choice)
   ---------------------------------------
     { id, type: "choice", skill, tag, title, scenario, prompt,
       options: [{ id, text }], answer, why, betterPrompt, action, lesson, source }

   skill        = "prompt" | "verify" | "own" - drives the results breakdown
   title        = short scenario name, shown above the story
   scenario     = the story, as an array of blocks:
                    "text"            -> a paragraph
                    { input: "..." }  -> what someone typed into the AI tool
                    { output: "..." } -> what the AI tool said back
   prompt       = the question the learner answers (same field as v1)
   why          = the explanation shown after answering
   betterPrompt = a rewritten prompt, shown after answering (optional)
   action       = the practical "In practice" line (optional)
   lesson       = the one-line takeaway (optional)
   source       = policy section, or "Good practice"
   ------------------------------------------------------------------ */

const QUESTIONS_V2 = [
  {
    id: 1,
    type: "choice",
    skill: "prompt",
    tag: "Field Service",
    title: "The confident parts quote",
    scenario: [
      "A customer needs a replacement part. Sam asks AI:",
      { input: "Find a replacement part for this device." },
      "The answer sounds confident, but it recommends an older part, quotes a price from months ago, and says it is available when it is not.",
    ],
    prompt: "What should Sam do before quoting the customer?",
    options: [
      { id: "a", text: "Ask the same question a few more times, in new chats, and quote whichever part number comes up most often" },
      { id: "b", text: "Quote the part the AI suggested, and tell the customer that price and availability may change before it ships" },
      { id: "c", text: "Rewrite the prompt with the exact model, version, and job the part must do, then confirm with the manufacturer and distributor" },
      { id: "d", text: "Ask the AI to double-check its own answer for the part, price, and stock, and go ahead with the quote once it confirms all three" },
    ],
    answer: "c",
    why:
      "The first prompt gave AI almost nothing to work with - no model, no version, no job the part has to do - so it filled the gaps with guesses and delivered them in the same confident tone it uses for facts. Asking again, or asking it to check itself, only produces more confident text. A disclaimer hands the risk to the customer instead of removing it.",
    betterPrompt:
      "Help me research a compatible replacement part for a 2023 [manufacturer] [model], [specific version/configuration], for the job of [what the part must do]. List current manufacturer part numbers and compatibility requirements. Do not assume stock or pricing. Mark any uncertain information clearly. Provide official manufacturer and distributor sources so I can verify current availability and price.",
    action:
      "Sam writes the better prompt without including customer-confidential information. Then Sam checks the manufacturer's compatibility information and the distributor's current stock and pricing before quoting the customer. AI helped narrow the search; it was not the inventory system or the final authority. This verification step matters because AI can present incorrect information confidently.",
    lesson:
      "A good prompt provides the goal, exact specifications, constraints, and desired output. Then verify time-sensitive facts - especially compatibility, stock, price, and dates.",
    source: "Employee policy - The promises we make (2); A final test",
  },
  {
    id: 2,
    type: "choice",
    skill: "verify",
    tag: "Compliance",
    title: "The link that goes nowhere",
    scenario: [
      "Priya asks AI which published safety regulations apply to a new warehouse process. The answer is a tidy list: five regulations, each with a section number, a one-line summary, and a link.",
      "Priya clicks the third link. The page does not exist, and a search of the regulator's site turns up no such section number either.",
    ],
    prompt: "What does the broken reference tell Priya about the rest of the list?",
    options: [
      { id: "a", text: "Not much - regulators reorganize their websites all the time, so the other four references are probably still accurate" },
      { id: "b", text: "Every reference in the answer is unconfirmed until Priya opens the official source and checks what it says" },
      { id: "c", text: "The list is usable once the AI replaces the broken link with a working one from the same regulator" },
      { id: "d", text: "Four out of five is a good result, so the list can be used as it is once the third item is dropped" },
    ],
    answer: "b",
    why:
      "AI can produce references with the exact shape of a real citation - a plausible title, a section number, a link - with no real document behind them. One invented reference shows the tool was generating what a citation looks like, not retrieving one, and nothing in the answer shows which of the other four were produced the same way. Asking for a replacement link invites another invention.",
    action:
      "Priya goes to the regulator's own site, finds each regulation there, and reads the section that is supposed to apply. Anything that cannot be found stays out of the process document, and the compliance owner confirms the final list.",
    lesson:
      "A citation is a claim, not proof. Open the source and confirm it says what the answer says it does.",
    source: "Employee policy - A final test; Leader governance policy - Common failure modes (Hallucination)",
  },
  {
    id: 3,
    type: "choice",
    skill: "prompt",
    tag: "Customer Service",
    title: "The late delivery reply",
    scenario: [
      "A customer's order is going to arrive four days late because of a supplier delay. Dana wants AI to help draft the reply.",
    ],
    prompt: "Which prompt gives AI the best chance of producing something Dana can use?",
    options: [
      { id: "a", text: "\"Write a reply to a customer about their late order. Make it really good and professional.\"" },
      { id: "b", text: "\"Write a detailed, thorough email about a late delivery. Cover every possible reason for a delay and every option the customer might have.\"" },
      { id: "c", text: "\"Write a warm apology to a customer whose order is four days late because of a supplier issue, and offer 20% off their next order so they stay with us.\"" },
      { id: "d", text: "\"Draft a reply to a customer whose order will arrive four days late due to a supplier delay. Apologize, give the new date, and say what we're doing about it. Warm, plain tone, under 120 words. Don't offer refunds or credits - leave [OFFER] where I'll add anything approved.\"" },
    ],
    answer: "d",
    why:
      "Option D has all four parts of a good prompt: the goal (apologize, give the new date, explain what we're doing), the specifics (four days, supplier delay), the constraints (tone, length, no offers), and the output (a short reply with a placeholder). The placeholder matters: an offer is a customer commitment, and AI does not make those. Option C is specific too, but it commits to a discount nobody approved.",
    action:
      "Before sending, Dana confirms the new delivery date in the order system, and fills [OFFER] only with something that has actually been approved - or deletes it.",
    lesson:
      "Goal, specifics, constraints, output. Constraints are where you keep commitments with the people who can authorize them.",
    source: "Good practice; Employee policy - The promises we make (3)",
  },
  {
    id: 4,
    type: "choice",
    skill: "verify",
    tag: "Facilities",
    title: "The inspection interval",
    scenario: [
      "Marcus asks AI how often the building's fire extinguishers must be inspected. It answers in one confident sentence with a specific interval, and Marcus is about to put that interval into the maintenance schedule.",
    ],
    prompt: "What should Marcus do with this answer?",
    options: [
      { id: "a", text: "Treat it as a lead, and confirm the current requirement with the official source for that location or the safety owner" },
      { id: "b", text: "Use it as given - safety requirements like this rarely change, so the answer is reliable enough for a schedule" },
      { id: "c", text: "Ask the same question in two other AI tools, and put the interval in the schedule if all three tools give the same answer" },
      { id: "d", text: "Use it for now, and add a reminder in the schedule to double-check the requirement sometime next year" },
    ],
    answer: "a",
    why:
      "Requirements like this are time-sensitive and location-specific. An AI tool's knowledge stops at a point in time, and it can blend old and new versions of a rule, or rules from different places, into one confident sentence. Three tools agreeing only shows they learned from similar material - it is not a check against the current source.",
    action:
      "Marcus looks up the requirement from the authority that applies to the building, or asks whoever is responsible for fire safety. The schedule is a system of record, so what goes into it should come from a source someone can point to.",
    lesson:
      "Anything with a date or a jurisdiction on it - regulations, standards, prices, versions, deadlines - gets checked against a current, authoritative source.",
    source: "Employee policy - A final test; Yellow: Review and authorization needed",
  },
  {
    id: 5,
    type: "choice",
    skill: "verify",
    tag: "Sales Operations",
    title: "Double-checked, it says",
    scenario: [
      "Kenji asks AI to total 40 line items from the published price list and apply a 12% volume discount. Then Kenji follows up:",
      { input: "Are you sure these numbers are correct?" },
      { output: "Yes. I have double-checked every calculation, and the totals are accurate." },
    ],
    prompt: "Have the numbers been verified?",
    options: [
      { id: "a", text: "Yes - Kenji asked for a check, and the AI reviewed every calculation and confirmed the totals" },
      { id: "b", text: "Yes, as long as the totals look about right next to similar quotes Kenji has sent before" },
      { id: "c", text: "No - the AI saying it checked is not a check; the totals need recalculating in a spreadsheet" },
      { id: "d", text: "No, but the discount is small, so any error would be too small to matter to the customer" },
    ],
    answer: "c",
    why:
      "An AI tool's statement that it double-checked is more generated text, not evidence that a check happened. Language models can slip on arithmetic, especially across many line items, and then confirm the wrong result just as fluently. \"Looks about right\" catches big errors, not a wrong discount on line 27.",
    action:
      "Kenji puts the line items in a spreadsheet and recomputes. It takes a few minutes and turns a claim into a fact.",
    lesson:
      "Verification has to happen outside the thing being verified. Use a tool built for math to check math.",
    source: "Employee policy - A final test",
  },
  {
    id: 6,
    type: "choice",
    skill: "prompt",
    tag: "Operations",
    title: "The summary nobody needed",
    scenario: [
      "Aisha has five minutes at tomorrow's operations meeting to brief the team on a new public industry report. Aisha asks AI:",
      { input: "Summarize this report." },
      "The result is two pages of general overview. None of it says what the report means for the team's scheduling - the only thing the meeting cares about.",
    ],
    prompt: "What was missing from Aisha's prompt?",
    options: [
      { id: "a", text: "Nothing - AI summaries are always generic, so Aisha should skip AI and read the whole report" },
      { id: "b", text: "Who the summary is for, what they need from it, and the shape it should take, like five bullets" },
      { id: "c", text: "A request for more detail, so the summary covers every section of the report instead of only the highlights" },
      { id: "d", text: "An instruction to be concise, so the same overview comes back in half a page instead of two" },
    ],
    answer: "b",
    why:
      "AI can only aim at the target you give it. \"Summarize this report\" has no audience, no purpose, and no format, so it produced the average summary. Making it longer or shorter does not change what it is aimed at.",
    betterPrompt:
      "Summarize this report for our operations team in five bullet points, focused only on what could affect how we schedule field work. Name the page each point comes from. If the report is unclear on something, say so rather than filling it in.",
    action:
      "Aisha still reads the pages the bullets point to before the meeting, so questions about them have real answers.",
    lesson:
      "Desired output is part of the prompt. Say who it's for, what they need, and what shape it should take.",
    source: "Good practice",
  },
  {
    id: 7,
    type: "choice",
    skill: "prompt",
    tag: "Procurement",
    title: "The warranty nobody offered",
    scenario: [
      "Jordan gives AI the published spec sheets for three vendors' equipment and asks:",
      { input: "Put these into a comparison table. Be as complete as possible and fill in every cell." },
      "The table shows a five-year warranty for Vendor C. Vendor C's spec sheet says nothing about a warranty.",
    ],
    prompt: "Which instruction would have prevented the invented warranty?",
    options: [
      { id: "a", text: "\"Only use information from the documents I gave you. If a value isn't stated, write 'Not stated', and cite the page for each value you include.\"" },
      { id: "b", text: "\"Be accurate and professional, double-check your work carefully, and make sure the table is correct before you give it back to me.\"" },
      { id: "c", text: "\"Fill in every cell with the most likely value, based on what vendors in this industry typically offer for similar equipment.\"" },
      { id: "d", text: "\"Use your best judgment to complete the table, and keep it short enough to fit on one page for the purchasing committee.\"" },
    ],
    answer: "a",
    why:
      "\"Fill in every cell\" told the AI that a blank was a failure, so it supplied a plausible value instead. Saying what to do when information is missing, and asking where each value came from, makes the gaps visible. \"Be accurate\" sounds helpful but gives the tool nothing concrete to do differently.",
    action:
      "Jordan still spot-checks the cited pages, especially for anything that decides the purchase: warranty, price, and lead time.",
    lesson:
      "Tell AI what to do when it doesn't know. \"Not stated\" is a useful answer; a confident guess is not.",
    source: "Good practice; Leader governance policy - Common failure modes (Hallucination)",
  },
  {
    id: 8,
    type: "choice",
    skill: "verify",
    tag: "Administration",
    title: "The checklist that looked complete",
    scenario: [
      "Omar asks AI to turn a 30-page public grant program guide into a one-page application checklist for the team. The checklist is clear, well organized, and looks complete.",
    ],
    prompt: "Before the team works from the checklist, what matters most?",
    options: [
      { id: "a", text: "Checking that every item is formatted and numbered consistently, so nothing on the list gets overlooked by the team" },
      { id: "b", text: "Asking the AI to shorten it further, since a shorter list is easier for the team to follow" },
      { id: "c", text: "Nothing more - condensing long documents into lists is one of the things AI does most reliably" },
      { id: "d", text: "Comparing it with the original for deadlines, eligibility conditions, and \"unless\" clauses it may have dropped" },
    ],
    answer: "d",
    why:
      "Summaries work by leaving things out, and the details they tend to lose are exactly the ones that sink an application: a deadline, an eligibility condition, an \"except when.\" The employee policy warns that AI can make a process sound complete while missing the exception or the order that makes it work. Looking complete is not evidence of being complete.",
    action:
      "Treat the checklist as a guide to the original, not a replacement for it. Link each item to the page it came from, so anyone can check the full wording.",
    lesson:
      "A summary is a map, not the territory. Check the fine print against the original before anyone acts on it.",
    source: "Employee policy - Yellow: Review and authorization needed",
  },
  {
    id: 9,
    type: "choice",
    skill: "own",
    tag: "Customer Service",
    title: "Two answers, one policy",
    scenario: [
      "A customer asks Nate how long they have to return a product. An AI assistant tells Nate 30 days. The company's official returns policy page says 14 days for that product line, and was updated last month.",
    ],
    prompt: "Which answer should Nate give the customer?",
    options: [
      { id: "a", text: "30 days - the AI may have picked up a newer change that the policy page has not caught up with yet" },
      { id: "b", text: "30 days - it is the more generous answer, and the customer is less likely to complain about it later" },
      { id: "c", text: "14 days - the official policy is the source of truth, and the AI answer was only a lead to check" },
      { id: "d", text: "Something in between, like 21 days, and let a supervisor sort it out if the customer pushes back" },
    ],
    answer: "c",
    why:
      "The official policy page is the system of record; the AI answer is a paraphrase of something, possibly out of date. When they disagree, the source of truth wins - that is what the phrase means. Giving the more generous answer makes a customer commitment the company never authorized.",
    action:
      "Nate gives the customer the policy's answer, then tells whoever maintains the AI assistant that it is giving outdated return terms, so the next person is not misled.",
    lesson:
      "AI can point you toward an answer. The system of record decides it.",
    source: "Employee policy - Yellow: Review and authorization needed; The promises we make (3)",
  },
  {
    id: 10,
    type: "choice",
    skill: "prompt",
    tag: "Workplace",
    title: "Plan everything",
    scenario: [
      "Ben's team is moving offices in three months. Ben asks AI:",
      { input: "Plan our entire office move, including budget, timeline, vendors, and communications." },
      "The result is a long, polished plan. It names moving companies Ben has never heard of, gives cost estimates with no basis, and sets a timeline that ignores the building's rules about when moves can happen.",
    ],
    prompt: "What approach would work better?",
    options: [
      { id: "a", text: "Break it into steps: a checklist first, then each part with its real constraints, with costs and vendors from real quotes" },
      { id: "b", text: "Keep the same prompt but add \"be realistic and accurate\" at the end, so the vendors and costs come back better" },
      { id: "c", text: "Ask for the same plan formatted as a table, which makes it easier to spot which estimates and dates are wrong" },
      { id: "d", text: "Try the same prompt in several different AI tools, and keep going until one returns vendors and costs that sound realistic" },
    ],
    answer: "a",
    why:
      "One huge, vague prompt asks AI to invent everything it wasn't told - vendors, costs, dates - and it will, confidently. Smaller steps let Ben supply the real constraints (headcount, move date, building rules) and check each piece before building on it. Costs and vendors come from actual quotes, not from a model's guess.",
    action:
      "AI helps with the parts it is good at: a checklist of what office moves usually involve, a draft communication plan, questions to ask vendors. The plan's owner checks the schedule against the building's rules and approves it.",
    lesson:
      "Big task, small steps. Give each step its real constraints, and get facts like costs and vendors from the source.",
    source: "Good practice; Employee policy - Yellow: Review and authorization needed",
  },
  {
    id: 11,
    type: "choice",
    skill: "own",
    tag: "IT Operations",
    title: "Same tool, different stakes",
    scenario: [
      "In the same afternoon, Elena uses AI for two things: brainstorming themes for a team lunch, and drafting the steps to update the firmware on 200 field devices overnight.",
    ],
    prompt: "How should Elena's review of the two outputs differ?",
    options: [
      { id: "a", text: "It shouldn't - every AI output deserves exactly the same level of review, whatever it is for" },
      { id: "b", text: "The lunch themes need more, because more people will see them than will read the firmware steps" },
      { id: "c", text: "Neither needs much if the tool is company-approved, since approval vouches for the quality of its output" },
      { id: "d", text: "The firmware steps need far more: a mistake is hard to undo, so a qualified person verifies them first" },
    ],
    answer: "d",
    why:
      "The final test asks two things: can we verify it, and can we recover if it's wrong? A bad lunch theme costs nothing. A bad firmware step on 200 devices could take them all offline at once, with no quick way back. Review should scale with the consequences. Tool approval is about protecting data - it does not mean the output is right.",
    action:
      "For the firmware plan, a qualified person checks the steps against the vendor's official instructions, the update is tried on one device first, and a rollback plan is in place before the overnight run is authorized.",
    lesson:
      "Match the checking to the stakes. The harder a mistake is to undo, the more verification and authorization it needs first.",
    source: "Employee policy - A final test",
  },
  {
    id: 12,
    type: "choice",
    skill: "verify",
    tag: "Logistics",
    title: "It sounded certain",
    scenario: [
      "Leila asks AI about a trade regulation change that could affect a customer's shipment. The answer is detailed, uses exact figures and dates, and ends:",
      { output: "I am certain this information is accurate." },
    ],
    prompt: "Which of these is actually evidence that the answer is correct?",
    options: [
      { id: "a", text: "It is detailed and uses exact figures and dates, which a made-up answer would usually avoid" },
      { id: "b", text: "It matches what a current, official source says when Leila goes and checks that source directly" },
      { id: "c", text: "It says it is certain, and AI tools are built to avoid claiming a level of confidence they do not have" },
      { id: "d", text: "It came back quickly and without hedging, which suggests the answer is widely established" },
    ],
    answer: "b",
    why:
      "Detail, precise numbers, certainty, and speed are features of the writing, not of the truth, and AI tools produce all of them just as readily when they are wrong. The leader policy puts it directly: AI systems do not crash, they produce plausible-but-wrong outputs - so assume the system is confidently wrong until you have verified otherwise.",
    action:
      "Before telling the customer anything, Leila checks the regulator's official announcement for the rule and its effective date.",
    lesson:
      "Confidence is a writing style. Only a check against the source tells you whether it's right.",
    source: "Leader governance policy - Troubleshooting principle",
  },
  {
    id: 13,
    type: "choice",
    skill: "prompt",
    tag: "Marketing",
    title: "Sounds like us",
    scenario: [
      "Mei needs 20 short product descriptions for items already listed on the company website. The first batch comes back generic and off-brand, and two of the descriptions mention features the products do not have.",
    ],
    prompt: "What will most improve the results?",
    options: [
      { id: "a", text: "Give it two approved descriptions as examples plus each product's spec sheet, and allow only features in the specs" },
      { id: "b", text: "Ask it to \"sound more like our brand\" and \"be more accurate,\" then regenerate until the tone feels closer" },
      { id: "c", text: "Generate a hundred descriptions and pick the best twenty, since more options improve the odds of good ones" },
      { id: "d", text: "Ask it to be more creative and persuasive, so the descriptions stand out against the competition" },
    ],
    answer: "a",
    why:
      "Examples communicate a house style better than adjectives, and the spec sheets give AI real facts to work from instead of plausible ones. \"Only features in the specs\" is a constraint aimed squarely at the invented features. Generating more does not fix a missing input - it multiplies the problem.",
    action:
      "Every description still gets checked against its spec sheet before publishing. Green work is a draft until someone verifies it.",
    lesson:
      "Show, don't describe: an approved example does more than any adjective. And every product claim gets checked before it goes live.",
    source: "Employee policy - Green: AI may help; The promises we make (5)",
  },
  {
    id: 14,
    type: "choice",
    skill: "verify",
    tag: "Inventory",
    title: "It worked on three rows",
    scenario: [
      "Hannah asks AI for a spreadsheet formula that flags items below their reorder level. It works on the three rows Hannah tests, so the formula gets copied down all 2,000 rows of the inventory export.",
    ],
    prompt: "What should Hannah check before the team relies on it?",
    options: [
      { id: "a", text: "Nothing more - a formula either works or shows an error, and it worked on every row that was tested" },
      { id: "b", text: "Ask the AI to review its own formula for bugs, and accept it if the review comes back clean" },
      { id: "c", text: "Rows with known answers, including edge cases like blanks, zero stock, and items exactly at the reorder level" },
      { id: "d", text: "Sort the sheet by the new column and make sure some items are flagged and some are not" },
    ],
    answer: "c",
    why:
      "A formula that runs without errors can still be wrong. Three easy rows rarely hit the cases that break formulas: an empty cell, a zero, a value exactly on the boundary. The leader policy calls this silent failure - the output appears to succeed but is incorrect - and the response is to compare against the source of truth rather than trust the tool's confidence.",
    action:
      "Hannah builds a small test sheet with known answers, edge cases included, and compares a handful of flagged items against the inventory system before anyone reorders from it.",
    lesson:
      "\"It runs\" is not \"it's right.\" Test with cases you already know the answer to, especially the edges.",
    source: "Leader governance policy - Common failure modes (Silent failure)",
  },
  {
    id: 15,
    type: "choice",
    skill: "own",
    tag: "Account Management",
    title: "We guarantee delivery",
    scenario: [
      "Rosa asks AI to draft an update for a key customer about their order. The draft reads well and includes this line:",
      { output: "We guarantee your delivery will arrive by Friday." },
      "Nobody has checked the schedule yet.",
    ],
    prompt: "What should happen before this goes out?",
    options: [
      { id: "a", text: "Send it - the draft is clear, the tone is right, and Friday is probably close to the real date anyway" },
      { id: "b", text: "Change \"guarantee\" to \"expect\" and send it, since that takes the promise out of the message" },
      { id: "c", text: "Ask the AI to double-check Friday against typical shipping times for this kind of order, then send" },
      { id: "d", text: "Confirm the date in the scheduling system, and have someone with authority to commit to it approve the message" },
    ],
    answer: "d",
    why:
      "A delivery guarantee is a customer commitment, and AI does not send customer commitments. The date came from the AI, not from the schedule, so it has to be checked against the source of truth. Softening the word does not fix a date nobody has confirmed - the customer will still plan around Friday.",
    action:
      "Once the date is confirmed and approved, Rosa sends the final message and it is saved in the normal system for customer communications.",
    lesson:
      "AI can draft the words. A person with the authority confirms the facts and makes the commitment.",
    source: "Employee policy - The promises we make (3); Yellow: Review and authorization needed",
  },
  {
    id: 16,
    type: "choice",
    skill: "prompt",
    tag: "IT Projects",
    title: "About 40 hours",
    scenario: [
      "Chris asks AI how long it will take to migrate the team's shared files to a new system, and needs a number for the project plan. The answer:",
      { output: "This migration should take about 40 hours." },
    ],
    prompt: "Which follow-up prompt is most useful?",
    options: [
      { id: "a", text: "\"Are you sure about that? Please double-check your estimate very carefully and confirm that 40 hours is correct.\"" },
      { id: "b", text: "\"List the assumptions behind this estimate, mark the ones you're unsure of, and tell me what would change it.\"" },
      { id: "c", text: "\"Can you get that down to 30 hours? That's the number my manager is expecting for this kind of project.\"" },
      { id: "d", text: "\"Give me the same estimate broken down by day, so I can drop it straight into the project schedule.\"" },
    ],
    answer: "b",
    why:
      "An estimate is only as good as its assumptions: how much data, how many people, what the new system requires. Asking for them turns one unverifiable number into a list a qualified person can actually check. \"Are you sure?\" invites reassurance, and asking for a lower number gets a lower number - not a more accurate one.",
    action:
      "Chris checks each assumption with the people who know - the system owner and the team - and the estimate goes into the plan with its assumptions attached.",
    lesson:
      "Ask AI to show its work: the assumptions, the uncertainties, and what would change the answer. Then people can check the parts.",
    source: "Good practice; Employee policy - A final test",
  },
  {
    id: 17,
    type: "choice",
    skill: "verify",
    tag: "Marketing",
    title: "The quote from nobody",
    scenario: [
      "Fatima uses AI to draft a blog post about industry trends. The draft includes a quote attributed to a well-known industry analyst, and the line \"73% of companies plan to increase spending next year.\" Neither comes with a source.",
    ],
    prompt: "What should Fatima do with the quote and the statistic?",
    options: [
      { id: "a", text: "Keep both - they make the post more credible, and readers rarely check quotes in a blog post" },
      { id: "b", text: "Keep the statistic but drop the analyst's name, so the quote can no longer be traced back to a real person" },
      { id: "c", text: "Find the original source for each, and cut anything that can't be confirmed as real and current" },
      { id: "d", text: "Keep both, and add \"according to AI research\" so readers know where they came from" },
    ],
    answer: "c",
    why:
      "AI can invent quotes and statistics that sound exactly like real ones. Publishing a made-up quote under a real person's name puts words in their mouth, and an unsourced statistic is a claim the company cannot support. \"According to AI research\" is not a source - it admits there isn't one.",
    action:
      "If the real source exists, Fatima cites it and links to it. If it doesn't, the post makes its point without it.",
    lesson:
      "Every quote needs a real speaker and every number needs a real source. If you can't find it, it doesn't ship.",
    source: "Employee policy - The promises we make (5); Green: AI may help",
  },
  {
    id: 18,
    type: "choice",
    skill: "own",
    tag: "IT Support",
    title: "Caught it just in time",
    scenario: [
      "Part of the team's internal how-to guide was drafted with AI. Following it, Tom notices that one configuration step is wrong - it would have locked Tom out of the system. Tom catches it before running it.",
    ],
    prompt: "What should Tom do next?",
    options: [
      { id: "a", text: "Correct the guide where everyone reads it, tell its owner, and flag it so anyone who already followed it can check" },
      { id: "b", text: "Fix the step in personal notes and move on, since the mistake was caught in time and nobody else was actually affected" },
      { id: "c", text: "Leave the guide alone, since whoever wrote that section is responsible for checking their own work" },
      { id: "d", text: "Stop using the guide, and quietly warn a few trusted teammates not to follow that section" },
    ],
    answer: "a",
    why:
      "The error is still in the guide, waiting for the next person. The leader policy's response to wrong AI output is to not act on it, and to flag and correct the source; the employee policy asks everyone to speak up early when AI produces an unsafe result. Fixing it privately protects one person.",
    action:
      "Reporting a good-faith concern is always the right move. If AI-drafted guides keep going wrong in the same way, report the pattern too.",
    lesson:
      "When you catch an AI mistake, fix it where others will find it - not just for yourself.",
    source: "Employee policy - The promises we make (6); Leader governance policy - Common failure modes (Hallucination)",
  },
  {
    id: 19,
    type: "choice",
    skill: "prompt",
    tag: "Training",
    title: "Two versions behind",
    scenario: [
      "Grace needs to brief the team on what changed in the latest release of a software tool they use every day. Grace asks AI:",
      { input: "What changed in the latest version of [software]?" },
      "The answer describes features that came out two versions ago.",
    ],
    prompt: "What's the better approach?",
    options: [
      { id: "a", text: "Ask again with \"the LATEST version\" in capitals, so the AI knows the newest one is wanted" },
      { id: "b", text: "Use the answer anyway, since most of the features it lists are probably still in the current version" },
      { id: "c", text: "Ask the AI for today's date first, then repeat the same question about the latest version" },
      { id: "d", text: "Give the AI the vendor's current release notes, and have it summarize only from that document" },
    ],
    answer: "d",
    why:
      "An AI tool's built-in knowledge stops at a point in time, and it may not know what \"latest\" means today. Emphasis and dates do not give it information it does not have. Giving it the current source, and telling it to stick to that source, does.",
    action:
      "Grace checks the summary against the release notes before the briefing, especially anything that changes how the team works.",
    lesson:
      "For anything recent, bring the source to the prompt. Don't rely on what the model remembers.",
    source: "Good practice; Leader governance policy - Common failure modes (Hallucination)",
  },
  {
    id: 20,
    type: "choice",
    skill: "own",
    tag: "Reporting",
    title: "The AI gave it to me",
    scenario: [
      "Diego's monthly report includes a market growth figure. When the manager asks where the number came from, Diego says, \"The AI gave it to me.\"",
    ],
    prompt: "What is the problem with that answer?",
    options: [
      { id: "a", text: "Nothing - the AI produced the number, so the AI is responsible if it turns out to be wrong" },
      { id: "b", text: "Diego owns what goes in the report, and should be able to name the source the number was checked against" },
      { id: "c", text: "Diego should have used a more advanced AI tool, which would have produced a more reliable figure" },
      { id: "d", text: "Only that Diego said it out loud - leaving the source off the report entirely would have avoided the question" },
    ],
    answer: "b",
    why:
      "The employee policy is direct about this: AI is not a colleague, not a boss, and not someone to blame. You own the work you submit, send, approve, or act on. \"The AI gave it to me\" is not a source - it describes where the checking didn't happen.",
    action:
      "Before a number goes in a report, find where it really comes from and cite that. If it can't be traced, it doesn't go in.",
    lesson:
      "If you put your name on it, you should be able to show where it came from.",
    source: "Employee policy - The point",
  },
];
