/* ------------------------------------------------------------------
   AI Data Handling Quiz - question bank

   Every question is grounded in the documents in ./policies:
     - employee_ai_security_policy.pdf   ("Employee policy" below)
     - plain_language_vendor_terms.pdf   ("Vendor terms" below)
   Two questions draw the inheritance and reclassification rules from
   leader_ai_governance_policy.pdf, noted in their `source` field.

   Question shapes
   ---------------
   type: "color"   -> learner picks RED / YELLOW / GREEN
     { id, type, tag, prompt, answer: "RED"|"YELLOW"|"GREEN", why, action, source }

   type: "choice"  -> learner picks one lettered option
     { id, type, tag, prompt, options: [{ id, text }], answer: "b", why, action, source }

   why    = the explanation shown after answering
   action = the practical "do this instead / do this next" line (optional)
   source = the policy section the answer comes from, shown with the explanation
   ------------------------------------------------------------------ */

const COLORS = {
  RED: {
    label: "RED",
    rule: "Do not share",
    blurb:
      "Sensitive, private, regulated, financial, personnel, or security information. Do not enter it into an AI tool unless the company has specifically approved the tool, the use case, and the access.",
  },
  YELLOW: {
    label: "YELLOW",
    rule: "Needs approval",
    blurb:
      "Internal work where accuracy, timing, sequence, exceptions, or authority matter. AI may help prepare it, but a responsible person must review and authorize it before it is used, shared, or executed.",
  },
  GREEN: {
    label: "GREEN",
    rule: "Can be shared",
    blurb:
      "Public or low-risk information. Use an approved AI tool and apply ordinary professional and factual review - a draft is still a draft.",
  },
};

const QUESTIONS = [
  /* ---------- Classification scenarios (12) ---------- */
  {
    id: 1,
    type: "color",
    tag: "Human Resources",
    prompt:
      "A manager sends you a spreadsheet of employee names, job titles, and exact salaries, and asks you to use AI to compare this year's pay bands. How is this information classified?",
    answer: "RED",
    why:
      "HR information is Red: personnel files, compensation, benefits, payroll, applicant data, performance and disciplinary records, and medical information. A reasonable request does not change the color of the data.",
    action:
      "Red information goes into an AI tool only when the company has specifically approved the tool, the use case, and the access - all three. Ask your manager or IT/Security before proceeding.",
    source: "Employee policy - Red: Stop and protect trust",
  },
  {
    id: 2,
    type: "color",
    tag: "Marketing",
    prompt:
      "Your company published a press release on its website last week. You want help rewriting it as three shorter social posts. How is the press release classified?",
    answer: "GREEN",
    why:
      "Approved public marketing material and published website copy are Green. Sharing it could not meaningfully harm a customer, a colleague, or the company, because it is already public.",
    action:
      "Green still means ordinary professional and factual review. A draft is still a draft - do not publish a claim, image, testimonial, or promise you have not verified and approved.",
    source: "Employee policy - Green: AI may help",
  },
  {
    id: 3,
    type: "color",
    tag: "Operations",
    prompt:
      "A customer's service ticket needs a dispatch plan. You ask AI to lay out the steps, the parts required, and the order to do them in. How is this work classified?",
    answer: "YELLOW",
    why:
      "Service tickets, work orders, schedules, and operating procedures are Yellow. AI can make a workflow sound complete while missing what makes it work: the right order, a required approval, a handoff, an exception, a customer commitment, or a location-specific detail.",
    action:
      "AI can propose the map. It cannot decide the route or release the work. The responsible owner reviews and authorizes before anything is dispatched.",
    source: "Employee policy - Yellow: Review and authorization needed",
  },
  {
    id: 4,
    type: "color",
    tag: "Finance",
    prompt:
      "You have the quarter's revenue figures and next year's forecast. Earnings are announced publicly in two weeks. How is this information classified?",
    answer: "RED",
    why:
      "Non-public financial statements, budgets, and forecasts are Red. Timing is what matters here: the same numbers become Green the moment the company officially publishes them.",
    action:
      "Build the structure with placeholder numbers if you need a draft, and keep the real figures in a company system until they are released.",
    source: "Employee policy - Red: Stop and protect trust",
  },
  {
    id: 5,
    type: "color",
    tag: "Human Resources",
    prompt:
      "You want to tighten the wording of a job description that is already posted on your public careers page. How is that job description classified?",
    answer: "GREEN",
    why:
      "The color follows the information, not the department. HR data is Red by default, but this particular text is already published for anyone to read, which makes it Green.",
    action:
      "Ask what the information is and whether it is already public - not which team happens to own it.",
    source: "Employee policy - Green: AI may help",
  },
  {
    id: 6,
    type: "color",
    tag: "Operations",
    prompt:
      "You ask AI to update the runbook for a production system change, including the steps, their order, and the rollback plan. How is this work classified?",
    answer: "YELLOW",
    why:
      "Technical runbooks are Yellow. Accuracy, sequence, and authority all matter, and a procedure that reads well but drops a verification step or a required approval can do real damage.",
    action:
      "Before acting, the owner confirms the source-of-truth system was checked, that dependencies, timing, approvals, and handoffs are still correct, that each task has a clear owner, and that the approved version is stored in the normal system of record.",
    source: "Employee policy - Yellow: Review and authorization needed",
  },
  {
    id: 7,
    type: "color",
    tag: "Human Resources",
    prompt:
      "A hiring manager shares a candidate's resume and written interview feedback, and asks you to summarize the candidate's strengths. How is this classified?",
    answer: "RED",
    why:
      "Applicant data and interview records are HR information, and HR information is Red. The candidate did not consent to having their file processed by an AI tool.",
    action:
      "This needs the tool, the use case, and the access to be specifically approved before it happens at all.",
    source: "Employee policy - Red: Stop and protect trust",
  },
  {
    id: 8,
    type: "color",
    tag: "Marketing",
    prompt:
      "You want engagement ideas based on your company's public social accounts and the posts already published from them. How is this classified?",
    answer: "GREEN",
    why:
      "Published posts and public accounts are Green. Anyone can already see them, so putting them into an approved AI tool creates no new exposure.",
    action:
      "Account credentials, unpublished campaigns, and non-public performance figures are a different color - keep them out of it.",
    source: "Employee policy - Green: AI may help",
  },
  {
    id: 9,
    type: "color",
    tag: "Security",
    prompt:
      "You copy an application error log to get help debugging. The log includes a database connection string, an API key, and an MFA seed. How is this classified?",
    answer: "RED",
    why:
      "Security information is Red: passwords, API keys, MFA codes, network diagrams, security configurations, vulnerability details, and incident information.",
    action:
      "Strip the secrets and share only the stack trace. If a live credential was already pasted anywhere, report it promptly so it can be rotated - reporting a good-faith concern is always the right move.",
    source: "Employee policy - Red: Stop and protect trust",
  },
  {
    id: 10,
    type: "color",
    tag: "Market Research",
    prompt:
      "You downloaded a competitor's annual report from their public investor relations page and want help pulling out the key themes. How is that report classified?",
    answer: "GREEN",
    why:
      "Public research is Green. What makes information sensitive is that it is non-public, not that it belongs to someone else.",
    action:
      "Your own conclusions about a competitor may be strategic, and strategic information is Red. Classify your commentary separately from the public source.",
    source: "Employee policy - Green: AI may help",
  },
  {
    id: 11,
    type: "color",
    tag: "Mixing Data",
    prompt:
      "You are drafting a Green social post with AI. To make it concrete, you paste in next quarter's discount pricing, which has not been announced yet. What is the draft now?",
    answer: "RED",
    why:
      "An AI output inherits the highest classification of any input that produced it. Pricing is Finance information and therefore Red, so the moment it goes into the draft, the whole draft is Red. This is what stops sensitive information from being laundered into a lower category through an AI summary.",
    action:
      "Marketing work moves up a color as soon as it references non-public pricing, an unreleased roadmap, or customer information. Check what you are about to paste in, not just what you started with.",
    source: "Leader governance policy - The inheritance rule; Reclassification triggers",
  },
  {
    id: 12,
    type: "color",
    tag: "Operations",
    prompt:
      "You ask AI to build a project schedule that includes team handoffs, internal approval gates, and dates you have committed to a customer. How is this work classified?",
    answer: "YELLOW",
    why:
      "Project plans and schedules are Yellow. Timing, sequence, approvals, and commitments are exactly the things AI is most likely to get plausibly wrong.",
    action:
      "Normal approvals must be in place before any purchase, system change, dispatch, external commitment, or customer communication that comes out of this plan.",
    source: "Employee policy - Yellow: Review and authorization needed",
  },

  /* ---------- Process and judgment (8) ---------- */
  {
    id: 13,
    type: "choice",
    tag: "Approved Tools",
    prompt:
      "You need AI help with internal company information. Where may that information go?",
    options: [
      { id: "a", text: "Any free AI tool, as long as you do not save the conversation" },
      { id: "b", text: "Your personal AI account, since you are the one doing the work" },
      { id: "c", text: "A company-approved AI tool, used for the purpose it was approved for" },
      { id: "d", text: "A browser extension that adds AI to whatever page you are looking at" },
    ],
    answer: "c",
    why:
      "Business work belongs in company-approved AI accounts and systems, not personal accounts or unapproved plug-ins. Free and consumer tools are not approved for company information at all - they are fine for general learning, never with company data.",
    action:
      "Some tools are approved company-wide and some only for one department's specific use. Approval covers a purpose, not just a product.",
    source: "Employee policy - The promises we make (1)",
  },
  {
    id: 14,
    type: "choice",
    tag: "Vendor Terms",
    prompt:
      "What makes an AI tool 'company-approved' rather than just widely used?",
    options: [
      { id: "a", text: "It is a paid product rather than a free one" },
      { id: "b", text: "Enough people at the company already use it without problems" },
      { id: "c", text: "The vendor's website describes it as enterprise-grade and secure" },
      { id: "d", text: "There is a contract behind it: a data processing agreement, a no-training clause, MFA and access controls, audit logging, and breach notification" },
    ],
    answer: "d",
    why:
      "Approval rests on enforceable terms, not popularity or marketing language. Trust should be earned through contract terms and technical controls, not enthusiasm.",
    action:
      "Those terms are not paperwork. They are what lets the company find out what happened, prove what was affected, notify the right people, and recover the data if something goes wrong.",
    source: "Vendor terms - The whole picture",
  },
  {
    id: 15,
    type: "choice",
    tag: "Vendor Terms",
    prompt:
      "An AI vendor's contract has no no-training clause. What is the practical risk?",
    options: [
      { id: "a", text: "The vendor may use your data to train their models, so your confidential information can surface in outputs served to other customers, including competitors" },
      { id: "b", text: "The tool will perform worse because it cannot learn from how your company uses it" },
      { id: "c", text: "Very little, as long as employees delete their conversations afterward" },
      { id: "d", text: "You will not be able to export your own data later" },
    ],
    answer: "a",
    why:
      "The no-training clause is the single most important sentence in an AI vendor contract. Without it, your pricing strategy could surface in a competitor's AI-generated report and your trade secrets become training data for a model you do not control.",
    action:
      "It is the difference between lending someone a book to read and lending them a book to publish.",
    source: "Vendor terms - No-Training Clause",
  },
  {
    id: 16,
    type: "choice",
    tag: "Authorization",
    prompt:
      "AI has drafted a work order for you and it reads well. What has to happen before it is executed?",
    options: [
      { id: "a", text: "Note in the file that AI drafted it, then execute it" },
      { id: "b", text: "The responsible owner confirms the source-of-truth system, the dependencies, approvals and handoffs, and that every task has an owner - then authorizes it" },
      { id: "c", text: "Send it, since it is clearly written and nothing looks missing" },
      { id: "d", text: "Have a second AI tool review it for errors first" },
    ],
    answer: "b",
    why:
      "Yellow work needs a responsible person to review and authorize it before it is used, shared, or executed. Reading well is not evidence of being right - AI can make a workflow sound complete while missing the approval or handoff that makes it work.",
    action:
      "The approved final version goes in the normal system of record, not left in a chat window.",
    source: "Employee policy - Yellow: Review and authorization needed",
  },
  {
    id: 17,
    type: "choice",
    tag: "When Unsure",
    prompt:
      "You genuinely cannot tell whether a document is Yellow or Red. What is the right move?",
    options: [
      { id: "a", text: "Treat it as Green, since nothing in it is obviously sensitive" },
      { id: "b", text: "Use a free AI tool for it, then delete the conversation" },
      { id: "c", text: "Paste it in and ask the AI tool whether the content is sensitive" },
      { id: "d", text: "Treat it as Red and ask your manager or IT/Security before you use it" },
    ],
    answer: "d",
    why:
      "If you are not sure whether something is Red, treat it as Red and ask. Asking an AI tool to classify the document requires sharing it first, which is the very thing in question.",
    action:
      "A short question to your manager, IT/Security, HR, or Finance costs far less than a disclosure you cannot take back.",
    source: "Employee policy - Red: Stop and protect trust",
  },
  {
    id: 18,
    type: "choice",
    tag: "Who Decides",
    prompt:
      "Which of these can an AI tool do on its own?",
    options: [
      { id: "a", text: "Set an employee's compensation, when the analysis behind it is sound" },
      { id: "b", text: "Approve a payment, when the invoice matches the purchase order" },
      { id: "c", text: "None of these - AI does not hire, fire, discipline, promote, set compensation, make payments, or send customer commitments" },
      { id: "d", text: "Send a customer commitment, when it is drafted from an approved template" },
    ],
    answer: "c",
    why:
      "AI does not hire, fire, discipline, promote, set compensation, make payments, change payroll, approve accounting entries, send customer commitments, or change systems on its own. We keep people responsible.",
    action:
      "You own the work you submit, send, approve, or act on. AI does not. Use AI to make the work better, never to hand away responsibility.",
    source: "Employee policy - The promises we make (3)",
  },
  {
    id: 19,
    type: "choice",
    tag: "The Final Test",
    prompt:
      "Before relying on AI for something consequential, the policy gives you two questions to ask. What are they?",
    options: [
      { id: "a", text: "Can we verify this, and can we recover from this?" },
      { id: "b", text: "Is it well written, and does it sound confident?" },
      { id: "c", text: "Is it faster, and is it cheaper than doing it by hand?" },
      { id: "d", text: "Did the tool cite a source, and is that source recent?" },
    ],
    answer: "a",
    why:
      "Can a qualified person check the facts, sources, calculations, and conclusions? And if it is wrong, can we undo the result without serious harm to a customer, a colleague, our finances, our systems, or our reputation?",
    action:
      "If the answer to either question is no, slow down and get the right review and authorization before you act.",
    source: "Employee policy - A final test",
  },
  {
    id: 20,
    type: "choice",
    tag: "Speak Up Early",
    prompt:
      "An AI assistant starts following instructions buried inside a document you asked it to summarize, and tries to pull data you never asked for. What do you do?",
    options: [
      { id: "a", text: "Delete the document and move on" },
      { id: "b", text: "Stop using it and report it promptly" },
      { id: "c", text: "Rephrase your prompt and try the task again" },
      { id: "d", text: "Finish the task, and mention it if it happens a second time" },
    ],
    answer: "b",
    why:
      "If an AI tool exposes information, gives a suspicious instruction, seems manipulated by content it read, or produces an unsafe result, stop using it and report it promptly.",
    action:
      "Reporting a good-faith concern is always the right move. It is treated as the professional response, not as a mistake to be judged for.",
    source: "Employee policy - The promises we make (6)",
  },
];
