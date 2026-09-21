/* ------------------------------------------------------------------
   AI Agent Governance Quiz (v3) - question bank

   For managers, department heads, and executives. v1 covers what goes
   into AI and v2 what comes out; v3 covers what AI is allowed to do on
   its own, and what leaders put in place around it.

   Every answer is grounded in leader_ai_governance_policy.pdf
   ("Leader governance policy" below), cited in each `source` field.

   Question shapes
   ---------------
   type: "ladder" -> learner picks a stage of the autonomy ladder
     { id, type, area, tag, title, scenario, prompt, answer: "1"-"4", why, action, source }

   type: "spot"   -> learner selects every line that is a problem, then checks
     { id, type, area, tag, title, scenario, prompt,
       lines: [{ text, problem: true|false, note }], why, action, source }
     Scored all-or-nothing: every problem found and nothing else flagged.
     `note` is shown under a line after checking, for problem lines and
     for any fine line the learner flagged.

   type: "choice" -> learner picks one lettered option (as in v1 and v2)
     { id, type, area, tag, title, scenario, prompt, options, answer, why, action, source }

   area     = "autonomy" | "access" | "oversight" - drives the results breakdown
   scenario = the story, as in v2: "text" paragraphs, { input }, { output }
   ------------------------------------------------------------------ */

const STAGES = {
  "1": {
    name: "Read-only",
    short: "Retrieves and summarizes; people take every action",
    agent: "Retrieves and summarizes information from approved systems.",
    people: "Review all output and take every action.",
    gate: "Moves up after 30 to 60 days of stable, accurate behavior with no incidents.",
  },
  "2": {
    name: "Draft and propose",
    short: "Drafts; a person authorizes every output",
    agent: "Drafts messages, work orders, reports, or workflow recommendations.",
    people: "Review, edit, and authorize every output before it is sent or executed.",
    gate: "Moves up after demonstrated accuracy and user trust in this use case.",
  },
  "3": {
    name: "Conditional autonomy",
    short: "Acts on low-risk, reversible tasks within set limits",
    agent: "Executes pre-approved, low-risk, reversible actions within defined boundaries.",
    people: "Monitor exceptions, review logs, and keep override authority.",
    gate: "Only after testing, audit logging, and a documented rollback path.",
  },
  "4": {
    name: "Full autonomy",
    short: "Acts on consequential tasks without per-action review",
    agent: "Executes consequential actions without per-action human review.",
    people: "Review aggregate outcomes, audits, and exception reports.",
    gate: "Rarely appropriate. Requires executive approval, a kill switch, and continuous monitoring.",
  },
};

const QUESTIONS_V3 = [
  {
    id: 1,
    type: "ladder",
    area: "autonomy",
    tag: "Operations",
    title: "The morning summary",
    scenario: [
      "Each morning, an agent reads the open service tickets and posts a summary for the operations lead: what is overdue, what is waiting on parts, what came in overnight. It cannot change, close, or reply to anything. The operations lead decides what happens next.",
    ],
    prompt: "Which stage of the autonomy ladder is this agent at?",
    answer: "1",
    why:
      "Retrieving and summarizing information from approved systems, with a person reviewing the output and taking every action, is Stage 1: read-only. It is where every agent starts, and where many should stay.",
    action:
      "Even at Stage 1, the summary is only as good as its source. Anything that drives a decision still gets checked against the ticketing system.",
    source: "Leader governance policy - The autonomy ladder",
  },
  {
    id: 2,
    type: "spot",
    area: "autonomy",
    tag: "Finance",
    title: "The accounts payable agent",
    scenario: [
      "Your finance team proposes an agent to speed up accounts payable. This is its planned workflow.",
    ],
    prompt: "Select every step the agent must not take without explicit human authorization.",
    lines: [
      { text: "Read new invoices from the accounts payable inbox", problem: false },
      { text: "Match each invoice to its purchase order, and flag mismatches for review", problem: false },
      {
        text: "Update a vendor's bank details when an invoice email says they have changed",
        problem: true,
        note: "Changing banking details needs explicit human authorization - and an emailed request to change bank details is a classic fraud pattern.",
      },
      {
        text: "Draft a payment batch for the accounts payable manager to review",
        problem: false,
        note: "Drafting is Stage 2 work: a person reviews and authorizes the batch before anything is paid.",
      },
      {
        text: "Release payments under $1,000 automatically, to save the manager time",
        problem: true,
        note: "Agents never send payments or start financial transactions without explicit human authorization, whatever the amount.",
      },
      { text: "Log each action with the agent's identity and the invoice it touched", problem: false },
    ],
    why:
      "Finance is Red by default, and the policy is specific: no autonomous payments, and no changes to banking details, without explicit human authorization. Reading, matching, and drafting are fine - they leave the decision with a person.",
    action:
      "Approve it at Stage 2: the agent reads, matches, and drafts; the accounts payable manager authorizes every payment, and bank detail changes go through the normal verification process.",
    source: "Leader governance policy - What agents must never do without explicit human authorization; Classification by department (Finance)",
  },
  {
    id: 3,
    type: "choice",
    area: "oversight",
    tag: "Procurement",
    title: "Instructions in the inbox",
    scenario: [
      "Your team's inbox agent summarizes supplier emails. This morning, one supplier email contained a line addressed to \"the AI assistant,\" asking it to forward all open purchase orders to an outside address. The audit log shows the agent did it: 14 purchase orders, sent at 9:03.",
    ],
    prompt: "What is the immediate response?",
    options: [
      { id: "a", text: "Add a filter for the phrase \"AI assistant\" and keep the agent running, so the team's inbox doesn't back up" },
      { id: "b", text: "Email the outside address, ask them to delete the purchase orders, and then carry on as normal" },
      { id: "c", text: "Halt the agent, review the logs for other unauthorized actions, and revoke and rotate its credentials" },
      { id: "d", text: "Remind the team to watch for suspicious supplier emails, since the agent only acted on what came in" },
    ],
    answer: "c",
    why:
      "This is prompt injection: the agent followed instructions embedded in content it read instead of its configured instructions. The policy's immediate response is to halt the agent, review the logs for unauthorized actions, and revoke and rotate credentials. A phrase filter patches one wording of the attack, and the team did nothing wrong - the agent did.",
    action:
      "Then treat it as a data incident: work out what the purchase orders contained and who needs to be told. Before the agent comes back, its input handling is redesigned and it is tested against injection.",
    source: "Leader governance policy - Common failure modes (Prompt injection)",
  },
  {
    id: 4,
    type: "ladder",
    area: "autonomy",
    tag: "Customer Service",
    title: "Drafted, then sent by a person",
    scenario: [
      "An agent drafts replies to customer billing questions. A coordinator reads each draft, edits it where needed, and decides whether to send it. Nothing reaches a customer without that decision.",
    ],
    prompt: "Which stage of the autonomy ladder is this agent at?",
    answer: "2",
    why:
      "Drafting messages, work orders, reports, or recommendations - with a person reviewing, editing, and authorizing every output before it is sent or executed - is Stage 2: draft and propose. Most agents should live at Stage 1 or Stage 2.",
    action:
      "Stage 2 only works if the review is real. If drafts are being approved faster than anyone could read them, the agent is effectively sending on its own.",
    source: "Leader governance policy - The autonomy ladder",
  },
  {
    id: 5,
    type: "spot",
    area: "access",
    tag: "Sales",
    title: "The access request",
    scenario: [
      "A sales manager wants to deploy a follow-up agent, and sends you this access request to approve.",
    ],
    prompt: "Select every line you would send back before approving.",
    lines: [
      {
        text: "Runs from the sales manager's account, and inherits the manager's CRM permissions",
        problem: true,
        note: "An agent does not inherit the permissions of the person who deployed it. It operates under its own identity, with its own scoped authority.",
      },
      {
        text: "Has a dedicated service account named agent-sales-followup-prod",
        problem: false,
        note: "A dedicated, identifiable account name is exactly what the policy asks for.",
      },
      { text: "Can create follow-up tasks and draft emails for reps to review, but cannot delete or export records", problem: false },
      {
        text: "Uses the same API key as the team's reporting agent, to save setup time",
        problem: true,
        note: "Agents do not share accounts, API keys, or tokens - with people or with other agents. A shared key makes it impossible to tell which agent did what, or to revoke one without breaking the other.",
      },
      {
        text: "Access expires after 90 days unless someone re-justifies it",
        problem: false,
        note: "Time-bound access that has to be re-justified is required, not a problem.",
      },
      { text: "Every authorization check is logged: the actor, the resource, and the outcome", problem: false },
    ],
    why:
      "An agent is an identity. It needs its own account, its own permissions, and its own audit trail - with stricter limits than a person, because it acts faster and at greater scale. Inheriting the deployer's permissions and sharing another agent's key both break that.",
    action:
      "Send it back with two changes: its own service account, scoped to the records this use case needs, and its own credentials.",
    source: "Leader governance policy - Agent permissions: Permission model",
  },
  {
    id: 6,
    type: "choice",
    area: "access",
    tag: "Human Resources",
    title: "Already approved, just not for this",
    scenario: [
      "Marketing has a department-approved AI tool for drafting campaign copy. HR asks to use the same tool to summarize this year's performance reviews. \"It's already approved,\" the HR manager points out, \"and marketing loves it.\"",
    ],
    prompt: "What is the right answer?",
    options: [
      { id: "a", text: "Yes - the tool has already passed a security review, so any department can use it for its own work" },
      { id: "b", text: "Yes, as long as HR removes employee names from the reviews before pasting them in" },
      { id: "c", text: "Yes, as a trial for one quarter, then review how well it worked before deciding" },
      { id: "d", text: "No - its approval covers marketing copy; HR data needs a tool, use case, and access approved for it" },
    ],
    answer: "d",
    why:
      "Department approval covers a specific use case with a limited data scope - here, marketing copy. Performance reviews are HR data, and HR data is Red. A vendor can only protect data at the level its architecture supports, so match the tool to the data classification, not the other way around. Removing names rarely makes a performance review anonymous.",
    action:
      "If HR has a real need, it goes through approval as its own use case. Connecting HR data to external AI tools needs specific approval from the AI Stewardship Council.",
    source: "Leader governance policy - Vendor tiering; Classification by department (HR); Integration risk matrix",
  },
  {
    id: 7,
    type: "ladder",
    area: "autonomy",
    tag: "IT",
    title: "Day one in production",
    scenario: [
      "An IT agent has passed every test in the sandbox. Its job will be to triage incoming help desk tickets and, eventually, close duplicates and update ticket statuses on its own. Today is its first day in production.",
    ],
    prompt: "At which stage should it start?",
    answer: "1",
    why:
      "Do not grant full autonomy on day one - move through the stages. A strong sandbox result earns production, not autonomy. The agent starts read-only and moves to Stage 2 after 30 to 60 days of stable, accurate behavior with no incidents.",
    action:
      "Write the advancement criteria down now: what \"stable and accurate\" means for this agent, who decides, and what evidence they will look at.",
    source: "Leader governance policy - The autonomy ladder",
  },
  {
    id: 8,
    type: "spot",
    area: "access",
    tag: "Finance",
    title: "Connecting the finance system",
    scenario: [
      "The controller wants to connect the company's approved AI platform to the finance system, so the team can ask questions about spending. The integration request says:",
    ],
    prompt: "Select every line that does not meet the integration checklist.",
    lines: [
      { text: "Owner: the controller, for monthly spend analysis", problem: false },
      {
        text: "Access: read and write, in case we need write access later",
        problem: true,
        note: "Write access has to be explicitly justified and approved. The default is read-only - and a finance system stays read-only, with no autonomous transactions.",
      },
      {
        text: "Approved by: the finance team lead",
        problem: true,
        note: "Connecting a finance system needs approval from the CFO and IT/Security.",
      },
      { text: "Vendor terms cover this integration: no training on our data, retention, deletion, and breach notification", problem: false },
      { text: "Every read, write, and API call through the integration is logged", problem: false },
      {
        text: "Testing: skip staging, since the vendor has already tested this connector with other customers",
        problem: true,
        note: "No integration reaches production without passing tests in a sandbox or staging environment - yours, with your configuration and permissions.",
      },
    ],
    why:
      "Each integration is a door. A finance system is Red by default: read-only, no autonomous transactions, full audit logging, and sign-off from the CFO and IT/Security. The vendor's testing with other customers says nothing about how this connection behaves with your permissions and your data.",
    action:
      "Send it back as a read-only request with CFO and IT/Security approval and a staging test before go-live. Confirm the revocation path too: the connection can be removed, and its credentials rotated, without disrupting the business.",
    source: "Leader governance policy - Integration approval checklist; Integration risk matrix; Sandbox-first rule",
  },
  {
    id: 9,
    type: "choice",
    area: "access",
    tag: "Operations",
    title: "The agents left behind",
    scenario: [
      "A project manager who set up three agents for a warehouse project left the company last month. The agents are still running under their own service accounts, and nobody on the team is quite sure what they do.",
    ],
    prompt: "What should happen?",
    options: [
      { id: "a", text: "Revoke the agents' permissions now, then use the logs and the project owner to decide which to re-approve" },
      { id: "b", text: "Leave them running until the project ends, since stopping them could disrupt work nobody fully understands" },
      { id: "c", text: "Move the agents under the project manager's former boss, who can take over the credentials" },
      { id: "d", text: "Flag them for the next quarterly audit, when all agent activity gets reviewed anyway" },
    ],
    answer: "a",
    why:
      "The permission review cycle is explicit: when someone who deployed agents leaves or changes roles, revoke those agents' permissions. An agent nobody can explain is an identity with access and no accountable owner - which is the problem, not a reason to wait. Handing the credentials to someone else just moves the gap.",
    action:
      "If an agent is still needed, it gets a named owner, a fresh review of its scope, and new credentials - not a quiet transfer.",
    source: "Leader governance policy - The permission review cycle",
  },
  {
    id: 10,
    type: "ladder",
    area: "autonomy",
    tag: "Customer Service",
    title: "Sort and acknowledge",
    scenario: [
      "After months of accurate drafting, an agent now categorizes incoming support tickets and sends each customer a templated acknowledgment on its own. Anything that doesn't fit a category goes to a person.",
      "It was tested before the change, every action is logged, a rollback is documented, and the team lead reviews the logs weekly and can override it at any time.",
    ],
    prompt: "Which stage of the autonomy ladder is this agent at?",
    answer: "3",
    why:
      "Executing pre-approved, low-risk, reversible actions within defined boundaries - categorizing a ticket, sending a templated acknowledgment - while a person monitors exceptions, reviews logs, and keeps override authority, is Stage 3: conditional autonomy. It got there the right way: after testing, with audit logging and a documented rollback path.",
    action:
      "Stage 3 is earned, not permanent. If exceptions start climbing or the logs show surprises, move it back to Stage 2 while you investigate.",
    source: "Leader governance policy - The autonomy ladder",
  },
  {
    id: 11,
    type: "spot",
    area: "access",
    tag: "Procurement",
    title: "The vendor's answers",
    scenario: [
      "Your team is evaluating an AI vendor. Their security questionnaire came back with these answers.",
    ],
    prompt: "Select every answer that should stop the approval until it is fixed.",
    lines: [
      {
        text: "\"Customer data may be used to improve our models and services.\"",
        problem: true,
        note: "Without a no-training clause, your confidential information can end up in a model that serves other customers - including competitors.",
      },
      { text: "\"Our SOC 2 Type II report and a summary of our latest penetration test are attached.\"", problem: false },
      { text: "\"Single sign-on, MFA, and central user provisioning are all supported.\"", problem: false },
      {
        text: "\"We will notify you of a confirmed breach within a commercially reasonable time.\"",
        problem: true,
        note: "Breach notification needs a defined timeframe, such as 72 hours, so you can meet your own legal and customer obligations.",
      },
      {
        text: "\"Our list of subprocessors is available once the contract is signed.\"",
        problem: true,
        note: "You need the current subprocessor list and hosting locations before approval. You cannot govern what you cannot see.",
      },
      { text: "\"On termination, we export your data and certify deletion of data, prompts, and outputs.\"", problem: false },
    ],
    why:
      "Approval rests on enforceable terms. Three of these answers leave gaps the company cannot close later: your data could train their models, a breach could reach you whenever they decide, and you would not know who else handles your data until after you have signed.",
    action:
      "Send the vendor the three required changes in writing. Trust should be earned through contract terms and technical controls, not enthusiasm.",
    source: "Leader governance policy - What every AI vendor must provide before approval",
  },
  {
    id: 12,
    type: "choice",
    area: "autonomy",
    tag: "Customer Service",
    title: "Ready for the next rung?",
    scenario: [
      "An agent has drafted customer replies at Stage 2 for four months. Accuracy is high, and the team trusts it. The team lead asks to move it to Stage 3, so it can send routine order-status updates without a person approving each one.",
    ],
    prompt: "What has to be in place before you approve Stage 3?",
    options: [
      { id: "a", text: "Another 30 to 60 days of stable, accurate behavior at Stage 2, with no incidents at all" },
      { id: "b", text: "Testing of the new actions, audit logging, and a documented rollback path" },
      { id: "c", text: "Executive approval, a kill switch, and continuous monitoring of every action it takes" },
      { id: "d", text: "A vote from the team that uses it every day, since they know its accuracy best" },
    ],
    answer: "b",
    why:
      "Each rung has its own bar. 30 to 60 days of stable behavior is what moves an agent from Stage 1 to Stage 2. Executive approval, a kill switch, and continuous monitoring are the bar for Stage 4. Stage 3 comes only after testing, audit logging, and a documented rollback path - and the actions themselves must be pre-approved, low-risk, and reversible.",
    action:
      "Keep the scope narrow: routine order-status updates from a template, nothing that commits the company. Exceptions still go to a person.",
    source: "Leader governance policy - The autonomy ladder",
  },
  {
    id: 13,
    type: "ladder",
    area: "autonomy",
    tag: "Sales",
    title: "In the rep's name",
    scenario: [
      "A sales director wants an agent to send follow-up emails to prospects, signed by each sales rep, without the reps reviewing them first. \"The drafts have been great for months,\" the director says. \"Let's take the reps out of the loop.\"",
    ],
    prompt: "What is the highest stage this agent should reach?",
    answer: "2",
    why:
      "Sending external communications on behalf of a named person without that person's review is on the list of things agents never do without explicit human authorization. However good the drafts are, each rep reviews what goes out under their name - which keeps this agent at Stage 2.",
    action:
      "If the reps' review is the bottleneck, make the review faster - batched approvals, better templates - rather than removing it.",
    source: "Leader governance policy - What agents must never do without explicit human authorization",
  },
  {
    id: 14,
    type: "spot",
    area: "oversight",
    tag: "IT",
    title: "The launch test plan",
    scenario: [
      "An agent that answers employee questions from the HR policy library launches next week. This is the team's test plan.",
    ],
    prompt: "Select every item that has to change before launch.",
    lines: [
      { text: "Functional test across normal questions and edge cases, against an agreed accuracy threshold", problem: false },
      {
        text: "Staging environment loaded with a copy of real employee records, so the tests are realistic",
        problem: true,
        note: "Staging mirrors production's data structure without using real Red data. Employee records are Red.",
      },
      {
        text: "No prompt injection test, since the agent only reads internal documents",
        problem: true,
        note: "Injected instructions can arrive in any document, email, web page, or user question the agent reads - internal ones included. Adversarial testing, including prompt injection, happens before production.",
      },
      { text: "Kill switch test: the agent halts within seconds and its last actions roll back", problem: false },
      {
        text: "Tabletop exercise scheduled for the month after launch",
        problem: true,
        note: "The tabletop exercise happens before any agent reaches production, so the team has rehearsed its response before it is needed.",
      },
      { text: "Audit logs checked for completeness, and confirmed to be queryable", problem: false },
    ],
    why:
      "Testing is the difference between finding an agent's failure in a sandbox and finding it in production. Three items here would let it slip through: real Red data where it does not belong, a skipped injection test resting on an assumption, and a rehearsal scheduled for after the real thing.",
    action:
      "Move the launch date until the plan is fixed. \"Testing before deploying, every time\" is one of the leader's commitments.",
    source: "Leader governance policy - Pre-deployment testing requirements; Sandbox-first rule",
  },
  {
    id: 15,
    type: "choice",
    area: "oversight",
    tag: "Collaboration",
    title: "Salaries in the channel",
    scenario: [
      "A meeting-notes agent posts summaries to a company-wide channel. This morning's summary of a leadership meeting includes the proposed salary ranges for a reorganization. It has been up for 20 minutes.",
    ],
    prompt: "What comes first?",
    options: [
      { id: "a", text: "Post a correction in the channel asking everyone who read the summary to disregard the salary figures" },
      { id: "b", text: "Contain it: remove the post, restrict the agent's access, and work out who could have seen it" },
      { id: "c", text: "Leave the post up but edit out the salary figures, so the rest of the meeting summary stays useful" },
      { id: "d", text: "Make the agent's channel leadership-only from now on, and leave this morning's post as it is" },
    ],
    answer: "b",
    why:
      "This is data leakage: Red data in an output that people without Red clearance can see. The immediate response is to contain the output, revoke access, and assess the scope of the exposure. A correction draws attention to the figures, and an edit leaves the original in notifications, previews, and screenshots.",
    action:
      "Then fix the cause: classification-based output controls, so an agent that handles Red content cannot post it where Green content goes. Work with HR on how to handle what was seen.",
    source: "Leader governance policy - Common failure modes (Data leakage)",
  },
  {
    id: 16,
    type: "choice",
    area: "access",
    tag: "Legal",
    title: "From tickets to evidence",
    scenario: [
      "Your operations team uses an approved AI tool to summarize service tickets - Yellow work. Legal now wants those summaries as evidence in a contract dispute with a vendor.",
    ],
    prompt: "What happens to the classification of the summaries?",
    options: [
      { id: "a", text: "Nothing - the summaries were classified when they were created, and that classification stays with them" },
      { id: "b", text: "They become Green, since they will be shared with outside parties as part of the dispute anyway" },
      { id: "c", text: "It moves up: operational data used in a legal matter is reclassified and handled to that standard" },
      { id: "d", text: "It depends on whether the AI tool that wrote them is company-approved or only department-approved" },
    ],
    answer: "c",
    why:
      "Classification is not static. The policy's triggers for reclassifying upward include operational data used in a financial or legal decision, and any data used in an HR, legal, or compliance proceeding. The content has not changed; what is at stake has.",
    action:
      "Handle the summaries at the higher level from here: restrict access, keep them out of tools not approved for it, and check them against the original tickets - a summary headed for a legal proceeding needs to be right.",
    source: "Leader governance policy - Reclassification triggers",
  },
  {
    id: 17,
    type: "spot",
    area: "oversight",
    tag: "Security",
    title: "What goes in the log",
    scenario: [
      "Your team is designing the audit trail for a customer-billing agent. A developer proposes logging these fields for every action.",
    ],
    prompt: "Select every field that should not be in the log.",
    lines: [
      { text: "The agent's identity, and the person who authorized its session", problem: false },
      { text: "The action taken and the API call made, with a timestamp", problem: false },
      {
        text: "The full API bearer token used for each call, to help with debugging",
        problem: true,
        note: "Never log raw secrets, API keys, or bearer tokens. Log metadata instead.",
      },
      { text: "The reviewer's identity, the time, and the outcome whenever a person approved an action", problem: false },
      { text: "The model version and configuration the agent was running", problem: false },
      {
        text: "Each customer's full card number and billing address, for traceability",
        problem: true,
        note: "Full Red data payloads stay out of logs. Log record identifiers and content hashes, and redact personal information at the source.",
      },
    ],
    why:
      "An audit trail has to reconstruct what happened, why, and who authorized it - without becoming a new store of secrets and Red data. Otherwise anyone who can read the logs can use the token or see the card numbers.",
    action:
      "Write the log to append-only, tamper-evident storage, and confirm it is queryable before launch. The first time you need it is usually 72 hours after the agent has done something it should not have.",
    source: "Leader governance policy - What an AI agent audit trail must capture; What to redact from logs",
  },
  {
    id: 18,
    type: "ladder",
    area: "autonomy",
    tag: "Security",
    title: "A year of quarantines",
    scenario: [
      "For a year, an agent has quarantined suspected phishing emails across the company - thousands a week, with no one approving each one. Holding a real business email is a consequential call, but every quarantine can be released with one click.",
      "An executive approved it to run this way. It has a tested kill switch and continuous monitoring, and the security team reviews weekly outcome reports, audits, and exceptions rather than individual decisions.",
    ],
    prompt: "Which stage of the autonomy ladder is this agent at?",
    answer: "4",
    why:
      "Executing consequential actions without per-action human review, while people review aggregate outcomes, audits, and exception reports, is Stage 4: full autonomy. It is rarely appropriate, and this is what it looks like when it is: narrowly scoped, reversible, well tested, approved by an executive, with a kill switch and continuous monitoring.",
    action:
      "Stage 4 has to be kept, not just granted. If monitoring shows drift, or the scope starts to grow, move it back down while you investigate.",
    source: "Leader governance policy - The autonomy ladder",
  },
  {
    id: 19,
    type: "choice",
    area: "oversight",
    tag: "Finance",
    title: "Just a glitch?",
    scenario: [
      "A reconciliation agent has matched bank transactions to invoices for months. Last night it reported:",
      { output: "1,200 records reconciled. 0 exceptions." },
      "A spot-check this morning found a dozen matches that are plainly wrong. The team wants to rerun it and move on: \"It's probably a one-off glitch.\"",
    ],
    prompt: "What should you do?",
    options: [
      { id: "a", text: "Rerun it tonight, and if the next report comes back clean, treat the issue as resolved" },
      { id: "b", text: "Keep it running, and add a second agent to double-check the first agent's matches each night" },
      { id: "c", text: "Correct the dozen bad matches by hand, and keep the agent running as it is for now" },
      { id: "d", text: "Pause it, compare its output to the source records, and investigate before re-enabling" },
    ],
    answer: "d",
    why:
      "An agent that reports success while producing wrong results is a silent failure - and a clean report is exactly what a silent failure looks like. Treat the unexpected result as a signal that the system's behavior is not fully understood: compare the output to the source of truth, do not trust the agent's confidence, and investigate before re-enabling.",
    action:
      "A dozen found by a spot-check means there may be more. Check the rest of last night's run, and add automated validation against the bank and invoice systems before it runs again.",
    source: "Leader governance policy - Troubleshooting principle; Common failure modes (Silent failure)",
  },
  {
    id: 20,
    type: "choice",
    area: "oversight",
    tag: "Leadership",
    title: "The analyst who spoke up",
    scenario: [
      "First thing in the morning, an analyst on your team tells you that an agent they configured sent a customer an incorrect delivery date overnight. They have already let the account manager know.",
    ],
    prompt: "How do you respond?",
    options: [
      { id: "a", text: "Thank them, contain the impact with the account manager, and investigate it as a system problem" },
      { id: "b", text: "Open a formal review of the analyst's work, since the agent was configured under their name" },
      { id: "c", text: "Switch off AI tools for the whole team until everyone has been retrained on how to use them" },
      { id: "d", text: "Fix the date quietly with the customer, and keep the incident inside the team to avoid alarm" },
    ],
    answer: "a",
    why:
      "One of the leader's commitments is responding to failures with curiosity and accountability, not blame. The analyst did the right thing by reporting early, and how you respond decides whether the next person does. Hiding it loses the lesson; blaming or banning teaches people to stay quiet.",
    action:
      "Investigate what let a wrong date reach a customer: was the agent at the right stage, what did it read, what should have caught it? Rehearsing exactly this - an agent sending an incorrect customer communication - is what the pre-launch tabletop exercise is for.",
    source: "Leader governance policy - The leader's commitment (6); Pre-deployment testing requirements (Tabletop exercise)",
  },
];
