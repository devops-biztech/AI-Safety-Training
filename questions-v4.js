/* ------------------------------------------------------------------
   Other AI tools (v4) - question bank

   For everyone. v1 covers what goes into AI, v2 what comes out, v3
   what it may do on its own. v4 covers which AI tool you may use at
   all: the company has approved some, other tools are better at some
   jobs, and the question is what it takes to use them.

   The setting: the company runs on Google Workspace, and Gemini used
   through the company's Workspace account is company-approved. Other
   tools are approved only where a scenario says so. The quiz makes no
   claims about any vendor's real terms; each scenario states them.

   Answers come from employee_ai_security_policy.pdf ("Employee
   policy"), leader_ai_governance_policy.pdf ("Leader governance
   policy") and plain_language_vendor_terms.pdf ("Vendor terms"),
   cited in each `source` field.

   Question shapes
   ---------------
   type: "tier"   -> learner picks which kind of tool it is
     { id, type, area, tag, title, scenario, prompt, answer, why, action, source }
     answer = a key of TIERS: "company" | "department" | "personal"

   type: "spot"   -> learner selects every line that is a problem (as in v3)
     { id, type, area, tag, title, scenario, prompt,
       lines: [{ text, problem: true|false, note }], why, action, source }

   type: "choice" -> learner picks one lettered option (as in v1-v3)
     { id, type, area, tag, title, scenario, prompt, options, answer, why, action, source }

   area     = "tool" | "use" | "request" - drives the results breakdown
   scenario = the story, as in v2: "text" paragraphs, { input }, { output }
   ------------------------------------------------------------------ */

// the three kinds of AI tool, from the leader policy's vendor tiering.
// Drives the start screen, the answer buttons and the in-quiz reminder
const TIERS = {
  company: {
    name: "Company-approved",
    short: "Contracted for the whole company, with its protections in place",
    detail: "Contracted, with a data processing agreement, a no-training clause, SSO and MFA, and audit logs. Approved by IT/Security and a business sponsor. Used through your company account.",
  },
  department: {
    name: "Department-approved",
    short: "Contracted for one use, with a limited data scope",
    detail: "Contracted for one use with a limited data scope, after a department head and IT/Security review it. Use it only for what it was approved for.",
  },
  personal: {
    name: "Personal or free",
    short: "Personal accounts, free tools, extensions: no company information",
    detail: "Consumer AI tools, free and personal accounts, browser extensions. General learning only, never company information, whoever pays for it.",
  },
};

const QUESTIONS_V4 = [
  {
    id: 1,
    type: "tier",
    area: "tool",
    tag: "Operations",
    title: "Gemini, in the company account",
    scenario: [
      "Priya is writing a project update in Google Docs, signed in with the company Workspace account, and opens the Gemini side panel to tighten the wording.",
    ],
    prompt: "Which kind of tool is Priya using?",
    answer: "company",
    why:
      "Gemini, used through the company's Workspace account, is company-approved: the company contracted for it, with the protections the policy requires before approval. The company's contract and account make it approved, not the Gemini name.",
    action:
      "A project update is Yellow, internal work. Gemini may help prepare it, and Priya still reviews it before it goes out.",
    source: "Leader governance policy - Vendor tiering; Employee policy - Promise 1",
  },
  {
    id: 2,
    type: "tier",
    area: "tool",
    tag: "Sales",
    title: "Gemini, in a personal account",
    scenario: [
      "Marcus is finishing a sales report at home on the family laptop. The laptop is signed in to Marcus's personal Gmail account, so Marcus opens Gemini there and pastes in the report's figures.",
    ],
    prompt: "Which kind of tool is Marcus using?",
    answer: "personal",
    why:
      "Same product, different account. The company's approval covers its own Workspace account, where its contract, sign-in controls and audit logs apply. A personal Google account has none of them, so to the company it is a personal AI tool like any other.",
    action:
      "Sign in with the company account before using Gemini for work. Marcus tells Biztech support which figures went into the personal account, so they can decide whether anything needs doing.",
    source: "Employee policy - Promise 1; Red; Leader governance policy - Vendor tiering",
  },
  {
    id: 3,
    type: "choice",
    area: "use",
    tag: "Sales",
    title: "Better at proposals",
    scenario: [
      "Sam has tried both and thinks Claude writes stronger proposals than Gemini. Tomorrow's proposal includes the client's name, the scope of work, and the pricing Sam negotiated. The company has not approved Claude, but Sam has a personal Claude account.",
    ],
    prompt: "What should Sam do?",
    options: [
      { id: "a", text: "Use the personal Claude account, but replace the client's name with a placeholder before pasting anything in" },
      { id: "b", text: "Draft it in the company's Gemini, and ask for Claude to be reviewed for proposal work" },
      { id: "c", text: "Write the first draft in Claude, then rework it in Gemini so the version the client sees comes from the approved tool" },
      { id: "d", text: "Use Claude only for the scope-of-work section, which has no pricing in it, and Gemini for everything else in the proposal" },
    ],
    answer: "b",
    why:
      "A better tool is a good reason to ask, not a reason to go around the rule. Claude is not approved, and a personal account is a personal tool: no company information goes in, with or without the client's name. The pricing is Red whatever it is called, the scope is the client's business, and finishing in Gemini doesn't undo what went into Claude.",
    action:
      "Sam asks the manager to put Claude forward for review for proposal writing. If it is approved, Sam uses it through the company's account, for that use.",
    source: "Employee policy - Promise 1; Red; Leader governance policy - Vendor tiering",
  },
  {
    id: 4,
    type: "tier",
    area: "tool",
    tag: "Marketing",
    title: "Marketing's Claude",
    scenario: [
      "After a review by the head of marketing and IT/Security, the marketing team has a contracted Claude workspace for drafting campaign copy from public product material. Noor, in marketing, uses it to write three versions of a social post about a product that launched last month.",
    ],
    prompt: "Which kind of tool is Noor using?",
    answer: "department",
    why:
      "Contracted for one use with a limited data scope, and approved by a department head after an IT/Security review: that is department-approved. Noor's post is exactly the use it was approved for. A tool from outside the company's suite can be approved; the approval comes with limits.",
    action:
      "Before using it for anything else, check that the new use is covered. Department approval doesn't stretch to whatever the tool happens to be good at.",
    source: "Leader governance policy - Vendor tiering",
  },
  {
    id: 5,
    type: "spot",
    area: "use",
    tag: "Customer Service",
    title: "An afternoon with four tools",
    scenario: [
      "The company's Gemini is company-approved. Marketing has a department-approved Claude workspace for public marketing copy. No other AI tool is approved. This is Alex's afternoon.",
    ],
    prompt: "Select every step that breaks the policy.",
    lines: [
      {
        text: "Asked the company's Gemini to reorganize the internal checklist for handling returns",
        problem: false,
        note: "Fine. An internal procedure is Yellow; an approved tool may help prepare it, and Alex reviews it before anyone uses it.",
      },
      {
        text: "Pasted a customer's complaint, with the name and account number, into a free chatbot because its replies sound warmer",
        problem: true,
        note: "A free tool is never for company information, and a customer's account details are Red.",
      },
      {
        text: "Asked a personal ChatGPT account to explain the difference between VLOOKUP and XLOOKUP, with no company data",
        problem: false,
        note: "Fine. General learning with no company information is the one use a personal or free tool has.",
      },
      {
        text: "Asked a marketing colleague to run a customer's refund dispute through marketing's Claude workspace",
        problem: true,
        note: "Marketing's Claude is approved for public marketing copy. A refund dispute is customer and financial information.",
      },
      {
        text: "Copied Gemini's summary of a staff meeting about layoffs into a personal ChatGPT account to polish the wording",
        problem: true,
        note: "The summary inherits the classification of what it summarizes, and layoff plans are Red. Starting in an approved tool doesn't make the output safe to take elsewhere.",
      },
      {
        text: "Used the company's Gemini to draft a post announcing the new store hours already on the website",
        problem: false,
        note: "Fine. Published information is Green, in an approved tool.",
      },
    ],
    why:
      "Three questions sort every step: which account, approved for what use, and does the data fit. The free chatbot and the personal account fail the first. Marketing's workspace fails the second. And a summary of Red material is still Red, wherever it goes next.",
    action:
      "When the approved tool feels slower or flatter than another one, the answer is still the approved tool. Ask for the other one to be reviewed if it is worth having.",
    source: "Employee policy - Red; Promise 1; Leader governance policy - Vendor tiering; The inheritance rule",
  },
  {
    id: 6,
    type: "choice",
    area: "tool",
    tag: "Finance",
    title: "\"I pay for it myself\"",
    scenario: [
      "Jordan pays for a ChatGPT subscription on a personal card and uses it for work, because it handles spreadsheet formulas better than Gemini.",
      "\"It's my own account and my own money,\" Jordan says, \"so what I put in it is my business.\"",
    ],
    prompt: "What is wrong with Jordan's reasoning?",
    options: [
      { id: "a", text: "Nothing is wrong with it, as long as Jordan claims the subscription back from the company as a business expense" },
      { id: "b", text: "The subscription has to be paid for in the company's name; once it is, the rest of Jordan's reasoning holds" },
      { id: "c", text: "Paid plans are safer than free ones, so only Red information needs to stay out of it" },
      { id: "d", text: "Business work belongs in company-approved accounts, and paying for a personal one doesn't make it approved" },
    ],
    answer: "d",
    why:
      "Approval comes from the company's review and contract: a data processing agreement, a no-training clause, SSO and MFA, and audit logs the company can see. A personal subscription has none of them, whoever pays and whatever the plan costs. It is a personal tool, fine for general learning and never for company information.",
    action:
      "Jordan can use the personal account to learn formulas with made-up numbers, and ask for the tool to be reviewed for finance work if it is worth having.",
    source: "Employee policy - Promise 1; Leader governance policy - What every AI vendor must provide; Vendor tiering",
  },
  {
    id: 7,
    type: "tier",
    area: "tool",
    tag: "Administration",
    title: "An assistant inside Gmail",
    scenario: [
      "Riley installs a free Chrome extension that adds an AI assistant to Gmail. It shows up right inside the company inbox and drafts a reply to any email with one click.",
    ],
    prompt: "Which kind of tool is Riley using?",
    answer: "personal",
    why:
      "It runs inside the company's Gmail, but it isn't covered by the company's approval of Gmail or Gemini. A free browser extension is a personal or free tool, and to draft a reply it reads the email it is replying to. The policy names browser extensions and unapproved plug-ins specifically.",
    action:
      "Riley removes the extension and tells Biztech support it was installed on a work account, since it had access to company email.",
    source: "Employee policy - Promise 1; Red; Leader governance policy - Vendor tiering",
  },
  {
    id: 8,
    type: "spot",
    area: "request",
    tag: "Finance",
    title: "The tool request",
    scenario: [
      "Jordan decides to do it properly and writes up a request to use ChatGPT for finance work.",
    ],
    prompt: "Select every line of the request that is a problem.",
    lines: [
      {
        text: "Purpose: writing and checking spreadsheet formulas for the monthly close",
        problem: false,
        note: "Fine. A documented business purpose is where a request starts.",
      },
      {
        text: "Data: we'll paste in the real general ledger so it can see how the columns are laid out",
        problem: true,
        note: "Non-public financial records are Red. Formula work needs the layout, not the figures: a sample with made-up numbers does the job.",
      },
      {
        text: "Account: I'll keep using my personal subscription, since it's already set up",
        problem: true,
        note: "An approved tool is used through the company's contracted account, not a personal one.",
      },
      {
        text: "Owner: Jordan, finance analyst, for questions about this use",
        problem: false,
        note: "Fine. A named owner is part of a good request.",
      },
      {
        text: "Approval: my manager said yes in chat, so we're covered",
        problem: true,
        note: "Department approval needs the department head and an IT/Security review. A manager's yes in chat is neither.",
      },
      {
        text: "Before we start: IT/Security confirms the vendor's data processing agreement and no-training terms",
        problem: false,
        note: "Fine. That is part of the review every AI vendor goes through.",
      },
    ],
    why:
      "The request asks for the right thing and then undoes it: real Red figures, a personal account, and an approval that isn't one. A department-approved tool is contracted for one use with a limited data scope, and signed off by the department head after an IT/Security review.",
    action:
      "Jordan rewrites it: sample data only, the company's account, and the finance director and IT/Security as approvers.",
    source: "Leader governance policy - Vendor tiering; What every AI vendor must provide; Employee policy - Red",
  },
  {
    id: 9,
    type: "choice",
    area: "use",
    tag: "Procurement",
    title: "Names removed",
    scenario: [
      "Leah wants a second opinion on a supplier contract before it renews, and a free AI chatbot is quick. Leah replaces the supplier's name with \"Vendor X\" and the company's with \"Company Y\", then pastes in the payment terms, prices, and penalty clauses.",
    ],
    prompt: "Is that acceptable?",
    options: [
      { id: "a", text: "No. The terms and prices are the confidential part, and a free tool isn't for company information" },
      { id: "b", text: "Yes. With both names replaced, nothing left in the text identifies the supplier or the company" },
      { id: "c", text: "Yes, as long as Leah deletes the whole conversation from the chatbot's history as soon as it has answered" },
      { id: "d", text: "Only if Leah first turns off the setting that lets the chatbot learn from people's conversations" },
    ],
    answer: "a",
    why:
      "Contract and pricing information is Red, and the names were never what made it sensitive: anyone who knows the market could recognize the terms. A free tool is for general learning only, however the text is edited. Deleting the chat or switching off a setting doesn't give the company a contract with the vendor.",
    action:
      "Leah takes the question to whoever reviews contracts, and asks whether any approved tool is cleared for contract review before putting a contract into one.",
    source: "Employee policy - Red; Leader governance policy - Vendor tiering; Vendor terms - No-training clause",
  },
  {
    id: 10,
    type: "tier",
    area: "tool",
    tag: "Company-wide",
    title: "ChatGPT, under a company agreement",
    scenario: [
      "The company signs an enterprise agreement for ChatGPT alongside Gemini. IT/Security reviewed it with the COO as sponsor: a data processing agreement, a no-training clause, sign-in through the company's SSO with MFA, and audit logs. Every employee gets an account.",
    ],
    prompt: "Which kind of tool is ChatGPT, used through that company account?",
    answer: "company",
    why:
      "Contracted with a data processing agreement, a no-training clause, SSO and MFA, and audit logs, and approved by IT/Security with a business sponsor: that is company-approved. The approved list isn't limited to one suite. Any vendor can get there by passing the same review.",
    action:
      "Use it through the company account only. A personal ChatGPT account is still a personal tool.",
    source: "Leader governance policy - Vendor tiering; What every AI vendor must provide",
  },
  {
    id: 11,
    type: "choice",
    area: "use",
    tag: "Human Resources",
    title: "Borrowing marketing's workspace",
    scenario: [
      "Kim, in HR, has 40 exit-interview notes to summarize. Marketing's contracted Claude workspace is approved for public marketing copy, and Noor offers to add Kim as a user.",
    ],
    prompt: "What should Kim do?",
    options: [
      { id: "a", text: "Accept. The workspace is contracted, so it already has the protections a personal account lacks" },
      { id: "b", text: "Accept, and remove every employee's name from the notes before pasting any of them in" },
      { id: "c", text: "Decline. It is approved for public marketing copy, and exit interviews are Red HR data" },
      { id: "d", text: "Accept for a short trial, then ask HR leadership to approve it formally if the summaries turn out to be useful" },
    ],
    answer: "c",
    why:
      "Department approval covers one use and a limited data scope. The contract is a good start, but it was reviewed for public marketing material, not personnel records. HR data is Red: it goes into an AI tool only when the tool, the use case, and the access have been specifically approved.",
    action:
      "Kim asks HR leadership to put the use forward for review. The policy sets a high bar for HR data, and the answer may be that it stays out of AI tools.",
    source: "Leader governance policy - Vendor tiering; Classification by department; Employee policy - Red",
  },
  {
    id: 12,
    type: "spot",
    area: "request",
    tag: "IT/Security",
    title: "What the vendor offers",
    scenario: [
      "A team wants a new AI writing tool approved for the whole company. These are the vendor's answers to the security questionnaire.",
    ],
    prompt: "Select every answer that would stop the tool from being approved.",
    lines: [
      {
        text: "We don't sign data processing agreements on this plan",
        problem: true,
        note: "No DPA, no approval. It is the contract that says what the vendor may do with the data, and for how long.",
      },
      {
        text: "Conversations may be used to improve our models; each user can opt out in settings",
        problem: true,
        note: "The policy needs written confirmation that company data isn't used for training. A setting each person has to remember is not a contract.",
      },
      {
        text: "Sign-in through your SSO, with MFA required",
        problem: false,
        note: "Fine. This is what the policy asks for.",
      },
      {
        text: "We publish a current list of our subprocessors and hosting locations",
        problem: false,
        note: "Fine. This is the subprocessor disclosure the policy asks for.",
      },
      {
        text: "Admin audit logs are not available on this plan",
        problem: true,
        note: "Without logs, the company can't investigate an incident or show what happened.",
      },
      {
        text: "On request, we export and delete your data and certify the deletion in writing within 30 days",
        problem: false,
        note: "Fine. These are the exit and deletion terms the policy asks for.",
      },
    ],
    why:
      "Every AI vendor must provide a data processing agreement, a no-training clause, subprocessor disclosure, security documentation, data residency, SSO and MFA, audit logging, breach notification, and exit and deletion terms. Missing any one is a house with one lock missing: that is the door that gets opened.",
    action:
      "The answer goes back to the team: not approvable on this plan. A different plan, or a different vendor, may meet the requirements.",
    source: "Leader governance policy - What every AI vendor must provide; Vendor terms - The whole picture",
  },
  {
    id: 13,
    type: "tier",
    area: "tool",
    tag: "Finance",
    title: "Formulas, not figures",
    scenario: [
      "After a review by the finance director and IT/Security, finance has a contracted ChatGPT workspace, approved only for writing and checking spreadsheet formulas with sample data. Jordan uses it to build the formula for the month-end variance report, testing it on made-up numbers.",
    ],
    prompt: "Which kind of tool is Jordan using?",
    answer: "department",
    why:
      "Contracted for one use with a limited data scope, and approved by a department head after an IT/Security review: department-approved. The same product in a personal account would be a personal tool. The contract, the company account, and the approved use make the difference.",
    action:
      "The approval covers formulas with sample data. Real ledger figures stay out: that would be a new use, with Red data, needing its own approval.",
    source: "Leader governance policy - Vendor tiering",
  },
  {
    id: 14,
    type: "choice",
    area: "request",
    tag: "Operations",
    title: "Connect your Drive",
    scenario: [
      "Alex's personal Claude account offers to connect to Google Drive, so it can read files directly instead of Alex pasting them in. It asks Alex to sign in with Google, and the company Workspace account is the one already signed in.",
    ],
    prompt: "What should Alex do?",
    options: [
      { id: "a", text: "Connect it, but choose only the folders Alex already has permission to open, so it can't see anything Alex couldn't" },
      { id: "b", text: "Cancel. Connecting an AI tool to a company system needs its own approval, and this account is personal" },
      { id: "c", text: "Connect it. Drive is part of the company's approved suite, so anything that connects to it is covered too" },
      { id: "d", text: "Connect it for a week to see whether it helps, then disconnect it and delete the chats" },
    ],
    answer: "b",
    why:
      "A connection is a door: the tool can then reach what the account can, without anyone pasting anything. The policy requires every integration to be approved before it is connected, with a named owner, the data mapped, access kept narrow and read-only by default, and testing done first. Here the tool is personal, so it can't hold company data at all. Drive being approved doesn't approve what connects to it.",
    action:
      "If it is already connected, Alex removes its access in the Google account's connected apps and tells Biztech support.",
    source: "Leader governance policy - Integrations; Integration approval checklist; Employee policy - Promise 1",
  },
  {
    id: 15,
    type: "spot",
    area: "use",
    tag: "Company-wide",
    title: "Approved is not unlimited",
    scenario: [
      "The company has an enterprise agreement for ChatGPT, and ChatGPT through the company account is company-approved. No use involving Red data has been specifically approved for it. This is what people used it for this week.",
    ],
    prompt: "Select every use that breaks the policy.",
    lines: [
      {
        text: "Drafting a blog post from the published product pages",
        problem: false,
        note: "Fine. Public material, in an approved tool.",
      },
      {
        text: "Pasting in the staff salary spreadsheet to suggest next year's raises",
        problem: true,
        note: "Compensation is Red, and AI doesn't set pay. An approved tool is not approval for Red data.",
      },
      {
        text: "Summarizing the internal onboarding procedure for a new hire",
        problem: false,
        note: "Fine. Yellow, prepared with an approved tool, and reviewed before anyone relies on it.",
      },
      {
        text: "Pasting the firewall's admin password so it can help troubleshoot the setup",
        problem: true,
        note: "Passwords and other credentials never go into an AI tool, approved or not.",
      },
      {
        text: "Rewriting the public FAQ in plainer language",
        problem: false,
        note: "Fine. Green, in an approved tool.",
      },
      {
        text: "Uploading a client's signed contract to pull out the renewal dates",
        problem: true,
        note: "Contracts are Red. The tool, the use case, and the access all need specific approval first.",
      },
    ],
    why:
      "Company approval makes a tool the right place for ordinary work. It doesn't open it to Red data: that takes specific approval of the tool, the use case, and the access. Match the tool to the data, not the other way around.",
    action:
      "When Red data seems to be the only way to get the job done, stop and ask. The answer may be an approved use case, or a way to do it without the data.",
    source: "Employee policy - Red; Promise 3; Leader governance policy - What leaders should never share; Vendor tiering",
  },
  {
    id: 16,
    type: "choice",
    area: "request",
    tag: "Customer Service",
    title: "Already pasted",
    scenario: [
      "Yesterday, Taylor pasted a customer list with names, emails, and order histories into a free AI chatbot to sort it. Today Taylor realizes that was a mistake.",
    ],
    prompt: "What should Taylor do now?",
    options: [
      { id: "a", text: "Report it to Biztech support: what went in, which tool, and when" },
      { id: "b", text: "Delete the chat and close the chatbot account, since that removes the customer data from the vendor's side" },
      { id: "c", text: "Say nothing. It was a one-off mistake, it won't happen again, and reporting it would only cause trouble for Taylor" },
      { id: "d", text: "Ask the chatbot to forget the whole conversation, then do the sorting again in the company's Gemini" },
    ],
    answer: "a",
    why:
      "Speaking up early is the policy, and reporting a good-faith concern is always the right move. Deleting the chat proves nothing about what the vendor kept, and without a contract the company can't require deletion or proof of it. Whether the customers need to be told is for the people who handle incidents to decide, and they can only decide if they know.",
    action:
      "Report the same day you notice, with the details: the tool, the data, and the time. Then do the task in an approved tool.",
    source: "Employee policy - Promise 6; Red; Leader governance policy - Failure modes: Data leakage; Vendor terms - Exit and deletion",
  },
  {
    id: 17,
    type: "choice",
    area: "tool",
    tag: "Engineering",
    title: "Signed up with a work email",
    scenario: [
      "Morgan signs up for a free Claude account with a company email address, so it looks like a work account.",
    ],
    prompt: "Does that make it an approved tool?",
    options: [
      { id: "a", text: "Yes. The company's email domain puts the account under the company's control" },
      { id: "b", text: "Yes, for Green and Yellow work, but Red information still needs to stay out of it" },
      { id: "c", text: "Only once Morgan has told a manager the account exists and what it will be used for" },
      { id: "d", text: "No. It is still a free, personal account, with no company contract, sign-in control, or logs" },
    ],
    answer: "d",
    why:
      "An email address is only a sign-in name. Approval comes from the company's contract and controls: a data processing agreement, a no-training clause, SSO and MFA through the company, and audit logs. A free account opened with a work email has none of them, so it is a personal or free tool.",
    action:
      "Morgan keeps it to general learning with no company information, and asks for a review if the tool would help the work.",
    source: "Leader governance policy - Vendor tiering; What every AI vendor must provide",
  },
  {
    id: 18,
    type: "choice",
    area: "request",
    tag: "Customer Service",
    title: "The free trial",
    scenario: [
      "A vendor offers the support team a free 30-day trial of its AI ticket assistant, promising \"enterprise-grade security.\" Chris, the team lead, wants to try it on this week's real tickets to see if it is worth buying.",
    ],
    prompt: "What is the right way to try it?",
    options: [
      { id: "a", text: "Run the trial on real tickets, but leave out any ticket that contains payment details" },
      { id: "b", text: "Get the vendor's security promise in writing from the sales rep, then run the trial on real tickets" },
      { id: "c", text: "Try it on made-up or public sample tickets, and put it forward for review before real ones go in" },
      { id: "d", text: "Run it on real tickets for the 30 days only, and ask the vendor to delete everything when the trial ends" },
    ],
    answer: "c",
    why:
      "Until it is approved, a trial is a free tool: general learning only, never company information. \"Enterprise-grade\" is a sales phrase, not a contract. The review checks for the things a promise can't give: a data processing agreement, a no-training clause, audit logs, breach notification, and exit and deletion terms. And nothing is tested on real sensitive data before it goes live.",
    action:
      "Chris writes up what the tool would be used for and which data it would touch, and sends it for review with the vendor's security documentation.",
    source: "Leader governance policy - Vendor tiering; What every AI vendor must provide; Sandbox-first rule",
  },
  {
    id: 19,
    type: "choice",
    area: "use",
    tag: "Operations",
    title: "Two AIs agree",
    scenario: [
      "Mia asks the company's Gemini for the deadline to renew a state contractor license, then asks the company's approved ChatGPT the same question. Both give the same date.",
    ],
    prompt: "Can Mia rely on that date?",
    options: [
      { id: "a", text: "Not yet. Two AI answers agreeing is not a check; confirm it with the state licensing board" },
      { id: "b", text: "Yes. Two tools built by different companies agreeing on the date counts as independent confirmation" },
      { id: "c", text: "Yes, because both tools are company-approved, and approved tools have been reviewed by IT/Security" },
      { id: "d", text: "Only if a third AI tool, one from yet another company, comes back with the same date as well" },
    ],
    answer: "a",
    why:
      "Different tools can repeat the same outdated or wrong information, and approval says nothing about whether an answer is right: it is about where the data goes. Deadlines change over time and by place. Check against the source of truth, here the licensing board, not against another AI.",
    action:
      "Use more than one tool to draft or compare if it helps. Verify with the source that actually sets the answer.",
    source: "Employee policy - A final test; Leader governance policy - Troubleshooting: Hallucination",
  },
  {
    id: 20,
    type: "choice",
    area: "request",
    tag: "Administration",
    title: "A teammate's shortcut",
    scenario: [
      "Casey sees a teammate pasting client support tickets into a personal AI app on a personal phone. \"It's faster than Gemini,\" the teammate says.",
    ],
    prompt: "What is the best response?",
    options: [
      { id: "a", text: "Leave it. It is the teammate's phone and the teammate's call, and it is not Casey's job to police anyone" },
      { id: "b", text: "Point the teammate to the approved tool, and raise it with Biztech support so the exposure can be checked" },
      { id: "c", text: "Report the teammate to HR and ask for disciplinary action" },
      { id: "d", text: "Show the teammate how to delete the chats, so nothing is left on the phone or in the app" },
    ],
    answer: "b",
    why:
      "Client tickets went into an unapproved personal tool, and that is worth raising even when nobody meant harm. Reporting a good-faith concern is always the right move, and the point is to protect the clients, not to punish a colleague. If the approved tool is too slow for the job, that is a reason to ask for a better one.",
    action:
      "Casey talks to the teammate first, then lets Biztech support know what went where. If Gemini really is too slow for this work, the team can ask for another tool to be reviewed.",
    source: "Employee policy - Promise 1; Promise 6",
  },
];
