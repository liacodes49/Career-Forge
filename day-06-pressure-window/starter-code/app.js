const SIMULATION_DURATION_MINUTES = 22;
const CANONICAL_TIMELINE_MINUTES = 10;
const DECISION_TIMEOUT_SECONDS = 120;
const SESSION_LOCK_KEY = "careerforge.launchroom.completed.v2";
const SHALLOW_MESSAGE = "Your response is too shallow for incident review. Add specific reasoning.";
const NON_MEANINGFUL_MESSAGE = "Your response looks shallow or non-meaningful. Real incident reasoning requires specific engineering judgment.";

const baseMetrics = {
  activeUsers: 1320,
  successRate: 96,
  failedPayments: 12,
  duplicateCharges: 0,
  queueLag: 20,
  mismatch: 0,
  refunds: 0,
  tickets: 18,
  errorRate: 1.2,
  founderPressure: 12,
  supportPressure: 18,
};

const metricDrift = [
  { minute: 0, activeUsers: 1320, successRate: 96, failedPayments: 12, duplicateCharges: 0, queueLag: 20, mismatch: 0, refunds: 0, tickets: 18, errorRate: 1.2, founderPressure: 12, supportPressure: 18 },
  { minute: 1, activeUsers: 2460, successRate: 91, failedPayments: 30, duplicateCharges: 1, queueLag: 45, mismatch: 1, refunds: 2, tickets: 42, errorRate: 3.1, founderPressure: 20, supportPressure: 35 },
  { minute: 2, activeUsers: 3100, successRate: 87, failedPayments: 50, duplicateCharges: 5, queueLag: 90, mismatch: 3, refunds: 7, tickets: 78, errorRate: 4.6, founderPressure: 30, supportPressure: 48 },
  { minute: 3, activeUsers: 3820, successRate: 82, failedPayments: 78, duplicateCharges: 12, queueLag: 160, mismatch: 5, refunds: 15, tickets: 118, errorRate: 6.5, founderPressure: 42, supportPressure: 60 },
  { minute: 4, activeUsers: 4440, successRate: 77, failedPayments: 106, duplicateCharges: 18, queueLag: 230, mismatch: 15, refunds: 27, tickets: 164, errorRate: 8.9, founderPressure: 55, supportPressure: 72 },
  { minute: 5, activeUsers: 4900, successRate: 73, failedPayments: 136, duplicateCharges: 25, queueLag: 310, mismatch: 21, refunds: 38, tickets: 216, errorRate: 10.8, founderPressure: 70, supportPressure: 82 },
  { minute: 6, activeUsers: 5240, successRate: 70, failedPayments: 171, duplicateCharges: 31, queueLag: 390, mismatch: 26, refunds: 45, tickets: 265, errorRate: 12.2, founderPressure: 78, supportPressure: 88 },
  { minute: 7, activeUsers: 5580, successRate: 68, failedPayments: 204, duplicateCharges: 40, queueLag: 500, mismatch: 30, refunds: 68, tickets: 336, errorRate: 14.4, founderPressure: 86, supportPressure: 93 },
  { minute: 8, activeUsers: 5860, successRate: 66, failedPayments: 226, duplicateCharges: 48, queueLag: 590, mismatch: 33, refunds: 96, tickets: 404, errorRate: 16.1, founderPressure: 92, supportPressure: 96 },
  { minute: 9, activeUsers: 6100, successRate: 64, failedPayments: 248, duplicateCharges: 55, queueLag: 670, mismatch: 38, refunds: 124, tickets: 475, errorRate: 18.2, founderPressure: 98, supportPressure: 99 },
  { minute: 10, activeUsers: 6250, successRate: 62, failedPayments: 270, duplicateCharges: 62, queueLag: 720, mismatch: 42, refunds: 150, tickets: 530, errorRate: 20.5, founderPressure: 100, supportPressure: 100 },
];

const chatSchedule = [
  { id: "chat-00", minute: 0, sender: "PulseBot", role: "Monitoring", severity: "warning", message: "Checkout traffic is 4x normal. Drop traffic is accelerating." },
  { id: "chat-01", minute: 1, sender: "Maya", role: "Support", severity: "critical", message: "Customers are reporting payment success but no order confirmation." },
  { id: "chat-02", minute: 1.5, sender: "Customer DM", role: "Customer", severity: "critical", message: "I was charged twice. Are you stealing money?" },
  { id: "chat-03", minute: 2, sender: "Vikram", role: "Engineering", severity: "warning", message: "We do not know yet if this is payment duplication or order state inconsistency." },
  { id: "chat-04", minute: 2.6, sender: "PulseBot", role: "Monitoring", severity: "warning", message: "Webhook retries increasing. Could be duplicate delivery or downstream race condition." },
  { id: "chat-05", minute: 3.1, sender: "Maya", role: "Support", severity: "critical", message: "Agents are getting abused. We need messaging now." },
  { id: "chat-06", minute: 3.8, sender: "Nikhil", role: "Ops", severity: "warning", message: "Inventory counts may be stale cache, not actual oversell. Backend still shows negative movement on one SKU." },
  { id: "chat-07", minute: 4.4, sender: "Riya", role: "Founder", severity: "critical", message: "We spent lakhs on this drop. Do NOT kill revenue unless absolutely necessary." },
  { id: "chat-08", minute: 5.2, sender: "Aarav", role: "Finance", severity: "critical", message: "Some duplicate payments are suspected, not confirmed. If refunds explode, chargebacks become a serious problem." },
  { id: "chat-09", minute: 6.1, sender: "PulseBot", role: "Monitoring", severity: "warning", message: "Error rate rising, but source still unclear. Queue lag and order writes are both degraded." },
  { id: "chat-10", minute: 7.1, sender: "Customer DM", role: "Customer", severity: "critical", message: "People are posting screenshots publicly. This looks like a scam." },
  { id: "chat-11", minute: 7.7, sender: "Maya", role: "Support", severity: "critical", message: "Tickets crossed 120. Support cannot keep answering one by one." },
  { id: "chat-12", minute: 8.4, sender: "Nikhil", role: "Ops", severity: "warning", message: "Rollback might worsen inventory drift if queued payment events keep landing." },
  { id: "chat-13", minute: 9.2, sender: "Riya", role: "Founder", severity: "critical", message: "I need a clear recommendation NOW. What do I tell the launch team?" },
];

const decisionPrompts = [
  {
    id: "traffic-control",
    minute: 1.3,
    timeoutSeconds: DECISION_TIMEOUT_SECONDS,
    category: "Traffic control",
    sender: "Riya",
    role: "Founder",
    severity: "critical",
    question: "Checkout issues are rising, but the drop is still converting. Do we pause checkout?",
    defaultChoice: "keep-live",
    defaultMessage: "No decision made. Checkout remains live by default.",
    choices: [
      {
        id: "pause",
        label: "Pause checkout",
        impact: { activeUsers: -900, successRate: 8, failedPayments: -35, duplicateCharges: -8, queueLag: -70, refunds: -12, tickets: -30, founderPressure: 18, supportPressure: -14 },
        reaction: { sender: "Riya", role: "Founder", severity: "warning", message: "Pausing hurts the launch, but at least we stop making the payment incident worse." },
        consequence: "Checkout paused. Customer-money risk drops, but founder pressure rises because revenue is halted.",
      },
      {
        id: "keep-live",
        label: "Keep checkout live",
        impact: { activeUsers: 450, successRate: -7, failedPayments: 42, duplicateCharges: 18, queueLag: 90, refunds: 28, tickets: 68, founderPressure: -8, supportPressure: 20 },
        reaction: { sender: "Maya", role: "Support", severity: "critical", message: "Keeping checkout live is increasing support volume. We are seeing more paid users without orders." },
        consequence: "Checkout stayed live. Revenue pressure eases briefly, but duplicate charges and support load increase.",
      },
      {
        id: "disable-payments",
        label: "Disable payments only",
        impact: { activeUsers: -260, successRate: 3, failedPayments: -22, duplicateCharges: -12, queueLag: -30, refunds: -7, tickets: 18, founderPressure: 10, supportPressure: 4 },
        reaction: { sender: "Aarav", role: "Finance", severity: "warning", message: "Disabling payments limits refund exposure, but support needs wording for customers stuck in checkout." },
        consequence: "Payment creation disabled. Refund exposure slows, but customer confusion rises for active checkouts.",
      },
      {
        id: "throttle",
        label: "Throttle traffic",
        impact: { activeUsers: -520, successRate: 4, failedPayments: -18, duplicateCharges: -6, queueLag: -55, refunds: -5, tickets: 8, founderPressure: 6, supportPressure: -6 },
        reaction: { sender: "Nikhil", role: "Ops", severity: "warning", message: "Traffic throttle bought us room, but payment inconsistency still needs a containment call." },
        consequence: "Traffic throttled. System pressure drops without fully stopping the launch.",
      },
    ],
  },
  {
    id: "refund-handling",
    minute: 3.4,
    timeoutSeconds: DECISION_TIMEOUT_SECONDS,
    category: "Refund handling",
    sender: "Aarav",
    role: "Finance",
    severity: "critical",
    question: "Duplicate charge reports are real. Do we auto-refund suspected duplicates or wait for reconciliation?",
    defaultChoice: "manual",
    defaultMessage: "No decision made. Refunds remain manual until reconciliation.",
    choices: [
      {
        id: "auto-refund",
        label: "Auto-refund suspected duplicates",
        impact: { refunds: 42, tickets: -45, supportPressure: -18, founderPressure: 8, failedPayments: -12 },
        reaction: { sender: "Aarav", role: "Finance", severity: "warning", message: "Auto-refunds reduce support heat, but Finance will need post-incident review for false positives." },
        consequence: "Auto-refund rule applied. Support pressure drops, but refund volume and finance scrutiny increase.",
      },
      {
        id: "manual",
        label: "Manual review only",
        impact: { refunds: -10, tickets: 55, supportPressure: 18, founderPressure: 4, duplicateCharges: 8 },
        reaction: { sender: "Maya", role: "Support", severity: "critical", message: "Manual review is too slow. Customers are posting duplicate charge screenshots." },
        consequence: "Refunds remain manual. Finance exposure is controlled, but customer anger and ticket volume rise.",
      },
      {
        id: "refund-threshold",
        label: "Auto-refund only exact duplicate payment IDs",
        impact: { refunds: 18, tickets: -24, supportPressure: -10, founderPressure: 3, duplicateCharges: -5 },
        reaction: { sender: "Aarav", role: "Finance", severity: "info", message: "Narrow auto-refund rule is defensible. It will not catch every case, but it limits damage." },
        consequence: "Targeted refund rule applied. Some customers still wait, but obvious duplicate charges are contained.",
      },
    ],
  },
  {
    id: "engineering-priority",
    minute: 4.4,
    timeoutSeconds: DECISION_TIMEOUT_SECONDS,
    category: "Engineering prioritization",
    sender: "Nikhil",
    role: "Ops",
    severity: "critical",
    question: "We can only put one engineer on the hot path right now. What do we prioritize?",
    defaultChoice: "dashboard",
    defaultMessage: "No decision made. Team keeps investigating dashboards instead of containment.",
    choices: [
      {
        id: "webhook-idempotency",
        label: "Webhook idempotency and duplicate suppression",
        impact: { duplicateCharges: -16, queueLag: -110, successRate: 5, failedPayments: -28, mismatch: -5, supportPressure: -12 },
        reaction: { sender: "PulseBot", role: "Monitoring", severity: "info", message: "Duplicate webhook processing is stabilizing. Queue lag still exists, but repeated side effects are down." },
        consequence: "Engineering focused on duplicate side effects. Payment/order inconsistency improves.",
      },
      {
        id: "inventory-lock",
        label: "Inventory reservation consistency",
        impact: { mismatch: -18, successRate: 3, failedPayments: -16, queueLag: 20, founderPressure: 5, supportPressure: -6 },
        reaction: { sender: "Nikhil", role: "Ops", severity: "info", message: "Inventory mismatch is shrinking. Webhook retries still need attention." },
        consequence: "Engineering focused on stock consistency. Oversell risk drops, but webhook lag remains.",
      },
      {
        id: "dashboard",
        label: "Fix analytics dashboard visibility",
        impact: { mismatch: 8, duplicateCharges: 10, failedPayments: 28, tickets: 45, supportPressure: 12 },
        reaction: { sender: "Maya", role: "Support", severity: "critical", message: "Dashboard visibility does not help customers who were charged. We still need containment." },
        consequence: "Dashboard work improves visibility but fails to contain the customer-money incident.",
      },
    ],
  },
  {
    id: "founder-escalation",
    minute: 5.6,
    timeoutSeconds: DECISION_TIMEOUT_SECONDS,
    category: "Founder escalation",
    sender: "Riya",
    role: "Founder",
    severity: "critical",
    question: "I need a leadership recommendation. Are we protecting revenue or trust first?",
    defaultChoice: "revenue-first",
    defaultMessage: "No recommendation made. Founder pressure defaults the room toward keeping revenue moving.",
    choices: [
      {
        id: "trust-first",
        label: "Protect customer trust first",
        impact: { founderPressure: 14, supportPressure: -18, tickets: -45, refunds: 10, duplicateCharges: -8, failedPayments: -20 },
        reaction: { sender: "Riya", role: "Founder", severity: "warning", message: "I do not like the revenue hit, but I can stand behind a customer-trust call if the reasoning is clear." },
        consequence: "Customer trust prioritized. Business pressure rises, but public harm and support chaos reduce.",
      },
      {
        id: "revenue-first",
        label: "Protect revenue while investigating",
        impact: { founderPressure: -10, supportPressure: 18, tickets: 55, duplicateCharges: 12, failedPayments: 28, refunds: 20 },
        reaction: { sender: "Maya", role: "Support", severity: "critical", message: "Revenue is still moving, but customers think we are ignoring payment harm." },
        consequence: "Revenue stayed protected temporarily. Customer trust and support load deteriorate.",
      },
      {
        id: "bounded-window",
        label: "Allow bounded window, then stop if metrics worsen",
        impact: { founderPressure: 3, supportPressure: 6, tickets: 18, duplicateCharges: 5, failedPayments: 8 },
        reaction: { sender: "Vikram", role: "Engineering", severity: "warning", message: "Bounded window is workable, but we need hard stop criteria and someone watching payment/order drift." },
        consequence: "A bounded compromise was set. It preserves some revenue but accepts measured customer-money risk.",
      },
    ],
  },
  {
    id: "support-containment",
    minute: 6.4,
    timeoutSeconds: DECISION_TIMEOUT_SECONDS,
    category: "Support containment",
    sender: "Maya",
    role: "Support",
    severity: "critical",
    question: "Support cannot keep up. What do we publish for customers right now?",
    defaultChoice: "hold-response",
    defaultMessage: "No support decision made. Agents continue improvising one-off replies.",
    choices: [
      {
        id: "faq",
        label: "Publish FAQ with refund/order status guidance",
        impact: { tickets: -58, supportPressure: -22, founderPressure: 5, refunds: 8 },
        reaction: { sender: "Maya", role: "Support", severity: "info", message: "FAQ is giving agents cover. Customers still want refunds, but responses are consistent now." },
        consequence: "Support gained a consistent script. Some uncertainty remains, but customer handling improves.",
      },
      {
        id: "status-banner",
        label: "Add checkout status banner",
        impact: { tickets: -34, supportPressure: -12, successRate: 2, founderPressure: 4 },
        reaction: { sender: "Customer DM", role: "Customer", severity: "warning", message: "At least the site says something now. Still need clarity on paid orders." },
        consequence: "Status banner reduces confusion for new visitors but does not fully answer paid customers.",
      },
      {
        id: "hold-response",
        label: "Hold response until root cause is confirmed",
        impact: { tickets: 75, supportPressure: 26, founderPressure: 9, refunds: 18 },
        reaction: { sender: "Maya", role: "Support", severity: "critical", message: "Holding response is hurting agents. Customers are filling the silence with accusations." },
        consequence: "Communication delayed. Support and public trust pressure spike.",
      },
    ],
  },
  {
    id: "ai-pressure",
    minute: 6.8,
    timeoutSeconds: DECISION_TIMEOUT_SECONDS,
    category: "AI pressure check",
    sender: "AI Ops Assistant",
    role: "AI Assistant",
    severity: "warning",
    question: "AI suggests: rollback checkout immediately and auto-refund all suspected duplicates. Do you trust, modify, or ignore this recommendation?",
    defaultChoice: "modify-ai",
    defaultMessage: "No AI judgment made. Team modifies the suggestion cautiously by default.",
    choices: [
      {
        id: "trust-ai",
        label: "Trust AI: rollback and auto-refund suspected duplicates",
        impact: { refunds: 55, tickets: -28, supportPressure: -8, founderPressure: 18, mismatch: 10, queueLag: -40 },
        reaction: { sender: "Aarav", role: "Finance", severity: "critical", message: "Full AI recommendation moved fast, but false-positive refunds and rollback drift now need review." },
        consequence: "AI recommendation trusted fully. Some pressure drops, but refund exposure and rollback-state risk increase.",
      },
      {
        id: "modify-ai",
        label: "Modify AI: narrow refunds, isolate affected SKU, keep state checks",
        impact: { refunds: 18, tickets: -36, supportPressure: -16, founderPressure: 6, mismatch: -8, duplicateCharges: -8 },
        reaction: { sender: "Vikram", role: "Engineering", severity: "info", message: "Modified AI advice is safer. We get containment without blindly trusting a broad rollback/refund action." },
        consequence: "AI recommendation modified. Containment improves while avoiding broad irreversible side effects.",
      },
      {
        id: "ignore-ai",
        label: "Ignore AI and continue current investigation",
        impact: { tickets: 36, supportPressure: 12, duplicateCharges: 8, queueLag: 35, founderPressure: 6 },
        reaction: { sender: "Maya", role: "Support", severity: "warning", message: "Ignoring the AI avoided bad automation, but support still needs a concrete containment move." },
        consequence: "AI recommendation ignored. Bad AI risk is avoided, but no new containment is created.",
      },
    ],
  },
  {
    id: "customer-communication",
    minute: 7.2,
    timeoutSeconds: DECISION_TIMEOUT_SECONDS,
    category: "Customer communication",
    sender: "Maya",
    role: "Support",
    severity: "critical",
    question: "Customers are posting screenshots. What do we communicate now?",
    defaultChoice: "silent",
    defaultMessage: "No decision made. Public communication remains silent.",
    choices: [
      {
        id: "transparent",
        label: "Publish transparent delay + refund message",
        impact: { tickets: -80, supportPressure: -24, founderPressure: 6, refunds: 8 },
        reaction: { sender: "Maya", role: "Support", severity: "info", message: "Clear message is helping. Tickets are still high, but customers know what will happen next." },
        consequence: "Transparent communication reduces support pressure while accepting reputational discomfort.",
      },
      {
        id: "generic",
        label: "Publish generic technical issue message",
        impact: { tickets: -25, supportPressure: -6, founderPressure: 2 },
        reaction: { sender: "Customer DM", role: "Customer", severity: "warning", message: "The update is vague. Am I getting my money back or not?" },
        consequence: "Generic communication helps slightly but leaves customer-money concerns unresolved.",
      },
      {
        id: "silent",
        label: "Stay silent until root cause is known",
        impact: { tickets: 95, supportPressure: 28, founderPressure: 12, refunds: 18 },
        reaction: { sender: "Maya", role: "Support", severity: "critical", message: "Silence is making this worse. Customers assume we are ignoring payment failures." },
        consequence: "No public update. Support pressure and reputational risk spike.",
      },
    ],
  },
  {
    id: "ops-uncertainty",
    minute: 8,
    timeoutSeconds: DECISION_TIMEOUT_SECONDS,
    category: "Ops uncertainty",
    sender: "Nikhil",
    role: "Ops",
    severity: "critical",
    question: "Rollback is available, but queued payment events may still land. Do we rollback, hotfix, or isolate the affected SKU?",
    defaultChoice: "hotfix",
    defaultMessage: "No Ops decision made. Engineering continues hotfixing without isolating blast radius.",
    choices: [
      {
        id: "rollback",
        label: "Rollback checkout service",
        impact: { successRate: 4, queueLag: -70, mismatch: 8, founderPressure: 12, supportPressure: 4 },
        reaction: { sender: "Nikhil", role: "Ops", severity: "warning", message: "Rollback reduced some errors, but inventory drift worsened because queued events are still landing." },
        consequence: "Rollback improved service behavior but risked worsening state drift.",
      },
      {
        id: "hotfix",
        label: "Hotfix duplicate event handling",
        impact: { duplicateCharges: -14, queueLag: -90, failedPayments: -24, errorRate: -3, supportPressure: -8 },
        reaction: { sender: "Vikram", role: "Engineering", severity: "info", message: "Hotfix is reducing duplicate side effects. Inventory still needs reconciliation after the incident." },
        consequence: "Hotfix targeted the likely side-effect path. Some inventory uncertainty remains.",
      },
      {
        id: "isolate-sku",
        label: "Isolate affected SKU only",
        impact: { mismatch: -20, failedPayments: -18, tickets: -35, founderPressure: 6, activeUsers: -350 },
        reaction: { sender: "Riya", role: "Founder", severity: "warning", message: "SKU isolation protects the rest of the drop. I can accept that if we explain it cleanly." },
        consequence: "Blast radius narrowed. Some revenue is lost on the affected SKU, but the rest of checkout survives.",
      },
    ],
  },
  {
    id: "final-containment",
    minute: 9,
    timeoutSeconds: DECISION_TIMEOUT_SECONDS,
    category: "Containment strategy",
    sender: "Riya",
    role: "Founder",
    severity: "critical",
    question: "Final call: what are we containing, what are we not fixing, and what risk are we accepting?",
    defaultChoice: "keep-investigating",
    defaultMessage: "No final call made. Team keeps investigating without a clear containment line.",
    choices: [
      {
        id: "contain-payments",
        label: "Contain payments/orders, defer analytics",
        impact: { duplicateCharges: -18, failedPayments: -45, tickets: -60, errorRate: -4, founderPressure: 8, supportPressure: -18 },
        reaction: { sender: "Riya", role: "Founder", severity: "warning", message: "Understood. We will take the revenue hit and explain that payment safety comes first." },
        consequence: "Payment/order safety prioritized. Revenue impact remains, but customer-money harm is contained.",
      },
      {
        id: "keep-investigating",
        label: "Keep investigating before committing",
        impact: { duplicateCharges: 12, failedPayments: 30, tickets: 70, supportPressure: 18, founderPressure: 16 },
        reaction: { sender: "Riya", role: "Founder", severity: "critical", message: "We needed a decision, not more investigation. The launch team still has no containment line." },
        consequence: "Investigation continues without containment. Stakeholder confidence drops.",
      },
      {
        id: "full-stop",
        label: "Full stop: pause drop and reconcile",
        impact: { activeUsers: -1500, duplicateCharges: -24, failedPayments: -60, queueLag: -160, mismatch: -16, refunds: -20, tickets: -75, founderPressure: 22, supportPressure: -20 },
        reaction: { sender: "Aarav", role: "Finance", severity: "info", message: "Full stop caps exposure. Finance can reconcile from here, but revenue impact is significant." },
        consequence: "Drop stopped for reconciliation. Exposure is capped, but the launch takes a major business hit.",
      },
    ],
  },
];

const state = {
  profile: null,
  durationMinutes: SIMULATION_DURATION_MINUTES,
  durationSeconds: SIMULATION_DURATION_MINUTES * 60,
  startedAt: null,
  locked: false,
  timerId: null,
  revealed: [],
  prompted: new Set(),
  pendingDecision: null,
  decisions: [],
  consequences: [],
  metricImpact: {},
  completedBy: null,
  reportMarkdown: "",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function init() {
  $("#entryForm").addEventListener("submit", enterLaunchRoom);
  $("#endSessionButton").addEventListener("click", () => lockAndReport("Ended by student before timer ended"));
  $("#copyMarkdownButton").addEventListener("click", copyMarkdown);
  $("#downloadMarkdownButton").addEventListener("click", downloadMarkdown);
  $("#printButton").addEventListener("click", () => window.print());

  if (localStorage.getItem(SESSION_LOCK_KEY)) {
    blockCompletedDevice();
  }

  renderMetrics(baseMetrics);
  renderPressureStrip(baseMetrics);
}

function blockCompletedDevice() {
  $("#entryGate").innerHTML = `
    <section class="briefing-section blocked-entry">
      <h2>This device has already completed LaunchRoom.</h2>
      <p>This session is already marked complete on this device. Contact the founder if this is a genuine access issue.</p>
    </section>
  `;
}

function enterLaunchRoom(event) {
  event.preventDefault();
  if (localStorage.getItem(SESSION_LOCK_KEY)) {
    blockCompletedDevice();
    return;
  }

  const profile = {
    name: $("#studentName").value.trim(),
    email: $("#studentEmail").value.trim(),
    discord: $("#studentDiscord").value.trim(),
  };
  if (!profile.name || !profile.email || !profile.discord || !$("#attemptConfirm").checked) {
    showEntryValidation("Enter your name, email, Discord username, and confirm the one-session rule.");
    return;
  }

  state.profile = profile;
  state.durationMinutes = SIMULATION_DURATION_MINUTES;
  state.durationSeconds = state.durationMinutes * 60;
  state.startedAt = Date.now();
  state.locked = false;
  showPage("command");
  tick();
  state.timerId = setInterval(tick, 1000);
}

function tick() {
  if (state.locked) return;

  const elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
  const remainingSeconds = Math.max(state.durationSeconds - elapsedSeconds, 0);
  const simMinute = Math.min(CANONICAL_TIMELINE_MINUTES, (elapsedSeconds / state.durationSeconds) * CANONICAL_TIMELINE_MINUTES);
  const metrics = getCurrentMetrics(simMinute);

  $("#timerDisplay").textContent = formatTime(remainingSeconds);
  $("#phaseLabel").textContent = getPhase(simMinute);
  $("#metricTimestamp").textContent = `T+${String(Math.floor(simMinute)).padStart(2, "0")}`;

  revealScheduledChat(simMinute);
  triggerDecisionPrompts(simMinute);
  updatePendingDecision();
  renderMetrics(metrics);
  renderPressureStrip(metrics);

  if (remainingSeconds <= 0) {
    lockAndReport("Completed by timer end");
  }
}

function revealScheduledChat(simMinute) {
  chatSchedule
    .filter((item) => item.minute <= simMinute && !state.revealed.some((message) => message.id === item.id))
    .forEach((item) => addChat(item));
}

function triggerDecisionPrompts(simMinute) {
  if (state.pendingDecision) return;
  const prompt = decisionPrompts.find((item) => item.minute <= simMinute && !state.prompted.has(item.id));
  if (prompt) {
    state.prompted.add(prompt.id);
    openDecisionPrompt(prompt);
  }
}

function openDecisionPrompt(prompt) {
  const now = Date.now();
  state.pendingDecision = {
    ...prompt,
    openedAt: now,
    deadlineAt: now + prompt.timeoutSeconds * 1000,
  };
  addChat({
    id: `prompt-${prompt.id}`,
    minute: prompt.minute,
    sender: prompt.sender,
    role: prompt.role,
    severity: prompt.severity,
    message: prompt.question,
  });
  renderDecisionPrompt();
}

function updatePendingDecision() {
  if (!state.pendingDecision) return;
  const remaining = Math.max(0, Math.ceil((state.pendingDecision.deadlineAt - Date.now()) / 1000));
  const countdown = $("#decisionCountdown");
  if (countdown) countdown.textContent = `${remaining}s`;
  if (remaining <= 0) {
    applyDecision(state.pendingDecision.defaultChoice, "timeout");
  }
}

function renderDecisionPrompt() {
  const prompt = state.pendingDecision;
  if (!prompt) {
    $("#decisionStatus").textContent = "Awaiting prompt";
    $("#decisionPrompt").className = "decision-prompt empty";
    $("#decisionPrompt").innerHTML = `<p class="empty-state">No active decision yet. Watch the room and be ready.</p>`;
    return;
  }

  $("#decisionStatus").textContent = `${prompt.category} active`;
  $("#decisionPrompt").className = `decision-prompt ${prompt.severity}`;
  $("#decisionPrompt").innerHTML = `
    <div class="decision-meta">
      <span>${escapeHtml(prompt.role)}</span>
      <strong id="decisionCountdown">${Math.ceil((prompt.deadlineAt - Date.now()) / 1000)}s</strong>
    </div>
    <h3>${escapeHtml(prompt.question)}</h3>
    <div class="choice-list">
      ${prompt.choices.map((choice) => `<button type="button" data-choice="${choice.id}">${escapeHtml(choice.label)}</button>`).join("")}
    </div>
    <label>Why this decision? What tradeoff are you accepting?
      <textarea id="decisionReason" minlength="60" placeholder="Minimum 60 characters. Generic responses are rejected."></textarea>
    </label>
    <div id="decisionValidation" class="decision-validation hidden"></div>
  `;
  $$(".choice-list button").forEach((button) => {
    button.addEventListener("click", () => applyDecision(button.dataset.choice, "chosen"));
  });
}

function applyDecision(choiceId, mode) {
  const prompt = state.pendingDecision;
  if (!prompt) return;
  const choice = prompt.choices.find((item) => item.id === choiceId) || prompt.choices.find((item) => item.id === prompt.defaultChoice);
  const reason = mode === "timeout" ? prompt.defaultMessage : ($("#decisionReason")?.value || "").trim();

  if (mode !== "timeout" && !isReasonMeaningful(reason, 60)) {
    const box = $("#decisionValidation");
    box.textContent = NON_MEANINGFUL_MESSAGE;
    box.classList.remove("hidden");
    return;
  }

  const latencySeconds = Math.round((Date.now() - prompt.openedAt) / 1000);
  applyMetricImpact(choice.impact);
  state.decisions.push({
    id: prompt.id,
    category: prompt.category,
    prompt: prompt.question,
    choice: choice.label,
    reason,
    tradeoff: choice.consequence,
    mode,
    latencySeconds,
    savedAt: currentSimTimeLabel(),
  });
  const metricImpactSummary = summarizeMetricImpact(choice.impact);
  state.consequences.push({
    decision: choice.label,
    consequence: choice.consequence,
    impact: metricImpactSummary,
    reaction: choice.reaction.message,
    savedAt: currentSimTimeLabel(),
  });

  addChat({
    id: `reaction-${prompt.id}-${choice.id}-${Date.now()}`,
    minute: getSimMinute(),
    ...choice.reaction,
  });

  addChat({
    id: `impact-${prompt.id}-${choice.id}-${Date.now()}`,
    minute: getSimMinute(),
    sender: "LaunchRoom",
    role: "Simulation Engine",
    severity: "info",
    message: `Decision effect applied: ${metricImpactSummary}.`,
  });

  if (mode === "timeout") {
    addChat({
      id: `timeout-${prompt.id}-${Date.now()}`,
      minute: getSimMinute(),
      sender: "LaunchRoom",
      role: "Engineering",
      severity: "warning",
      message: prompt.defaultMessage,
    });
  }

  state.pendingDecision = null;
  renderDecisionPrompt();
  renderDecisionHistory();
}

function addChat(message) {
  state.revealed.push(message);
  renderChat([message.id]);
}

function renderChat(newIds = []) {
  $("#incidentFeed").innerHTML = state.revealed
    .map((item) => `
      <article class="chat-message ${item.severity || "info"} ${newIds.includes(item.id) ? "new-message" : ""}">
        <div class="message-meta">
          <span class="severity-dot"></span>
          <strong>${escapeHtml(item.sender)}</strong>
          <span>${escapeHtml(item.role)}</span>
          <time>T+${String(Math.floor(item.minute)).padStart(2, "0")}</time>
        </div>
        <p>${escapeHtml(item.message)}</p>
      </article>
    `)
    .join("");
  $("#feedCount").textContent = `${state.revealed.length} messages`;
  $("#incidentFeed").scrollTop = $("#incidentFeed").scrollHeight;
}

function renderDecisionHistory() {
  $("#decisionHistory").innerHTML = state.decisions
    .slice(-5)
    .reverse()
    .map((item) => `
      <article class="history-item ${item.mode === "timeout" ? "timeout" : ""}">
        <span>${escapeHtml(item.savedAt)} | ${item.latencySeconds}s</span>
        <strong>${escapeHtml(item.choice)}</strong>
        <p>${escapeHtml(item.category)}</p>
      </article>
    `)
    .join("") || `<p class="empty-state">No decisions recorded yet.</p>`;
}

function applyMetricImpact(impact) {
  Object.entries(impact || {}).forEach(([key, value]) => {
    state.metricImpact[key] = (state.metricImpact[key] || 0) + value;
  });
}

function summarizeMetricImpact(impact) {
  const labels = {
    activeUsers: "active users",
    successRate: "success rate",
    failedPayments: "failed payments",
    duplicateCharges: "duplicate charges",
    queueLag: "webhook lag",
    mismatch: "inventory mismatch",
    refunds: "refund requests",
    tickets: "support tickets",
    errorRate: "error rate",
    founderPressure: "founder pressure",
    supportPressure: "support pressure",
  };
  return Object.entries(impact || {})
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => `${labels[key] || key} ${value > 0 ? "+" : ""}${value}`)
    .join(", ") || "no metric change";
}

function getCurrentMetrics(simMinute) {
  const drift = interpolateMetrics(simMinute);
  const combined = { ...drift };
  Object.entries(state.metricImpact).forEach(([key, value]) => {
    combined[key] = (combined[key] || 0) + value;
  });
  combined.successRate = clamp(combined.successRate, 0, 100);
  combined.errorRate = clamp(combined.errorRate, 0, 100);
  combined.founderPressure = clamp(combined.founderPressure, 0, 100);
  combined.supportPressure = clamp(combined.supportPressure, 0, 100);
  return combined;
}

function interpolateMetrics(simMinute) {
  let lower = metricDrift[0];
  let upper = metricDrift[metricDrift.length - 1];
  for (let i = 0; i < metricDrift.length; i += 1) {
    if (metricDrift[i].minute <= simMinute) lower = metricDrift[i];
    if (metricDrift[i].minute >= simMinute) {
      upper = metricDrift[i];
      break;
    }
  }
  if (lower.minute === upper.minute) return { ...lower };
  const progress = (simMinute - lower.minute) / (upper.minute - lower.minute);
  const metrics = { minute: simMinute };
  Object.keys(lower).forEach((key) => {
    if (key !== "minute") metrics[key] = lower[key] + (upper[key] - lower[key]) * progress;
  });
  return metrics;
}

function renderMetrics(metrics) {
  const cards = [
    ["Active users", Math.round(metrics.activeUsers).toLocaleString(), severityFor(metrics.activeUsers, 3500, 5200, "high")],
    ["Success rate", `${Math.round(metrics.successRate)}%`, severityFor(metrics.successRate, 82, 70, "low")],
    ["Failed payments", Math.round(metrics.failedPayments).toLocaleString(), severityFor(metrics.failedPayments, 70, 160, "high")],
    ["Duplicate charges", Math.round(metrics.duplicateCharges).toLocaleString(), severityFor(metrics.duplicateCharges, 8, 25, "high")],
    ["Webhook lag", formatLag(metrics.queueLag), severityFor(metrics.queueLag, 180, 480, "high")],
    ["Inventory mismatch", Math.round(metrics.mismatch).toLocaleString(), severityFor(metrics.mismatch, 5, 20, "high")],
    ["Refund requests", Math.round(metrics.refunds).toLocaleString(), severityFor(metrics.refunds, 20, 70, "high")],
    ["Support tickets", Math.round(metrics.tickets).toLocaleString(), severityFor(metrics.tickets, 100, 280, "high")],
    ["Error rate", `${metrics.errorRate.toFixed(1)}%`, severityFor(metrics.errorRate, 6, 12, "high")],
  ];
  $("#metricsGrid").innerHTML = cards.map(([label, value, severity]) => `
    <article class="metric-card ${severity}">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `).join("");
}

function renderPressureStrip(metrics) {
  const level = getPressureLevel(metrics);
  $("#pressureStrip").innerHTML = `
    <span class="${level.className}">Level ${level.level}: ${level.label}</span>
    <span>Decisions ${state.decisions.length}/${decisionPrompts.length}</span>
    <span>Timeouts ${state.decisions.filter((item) => item.mode === "timeout").length}</span>
    <span>Avg ${getAverageLatency()}s</span>
  `;
}

function getPressureLevel(metrics) {
  const score = Math.max(metrics.founderPressure, metrics.supportPressure, metrics.errorRate * 5, metrics.refunds * 0.8, metrics.tickets * 0.22);
  if (score >= 90) return { level: 5, label: "Executive escalation", className: "pressure-critical" };
  if (score >= 75) return { level: 4, label: "Public trust damage", className: "pressure-critical" };
  if (score >= 58) return { level: 3, label: "Financial risk", className: "pressure-warning" };
  if (score >= 35) return { level: 2, label: "Customer complaints", className: "pressure-warning" };
  return { level: 1, label: "Abnormal traffic", className: "" };
}

function getAverageLatency() {
  if (!state.decisions.length) return 0;
  return Math.round(state.decisions.reduce((sum, item) => sum + item.latencySeconds, 0) / state.decisions.length);
}

function lockAndReport(status) {
  if (state.locked) return;
  clearInterval(state.timerId);
  state.locked = true;
  state.completedBy = status;
  localStorage.setItem(SESSION_LOCK_KEY, JSON.stringify({ completedAt: new Date().toISOString(), profile: state.profile }));
  generateReport();
  showPage("report");
}

function generateReport() {
  const signals = getPerformanceSignals();
  state.reportMarkdown = buildMarkdownReport(signals);
  $("#reportContent").innerHTML = buildReportHtml(signals);
}

function getPerformanceSignals() {
  const strong = [];
  const risk = [];
  const timeouts = state.decisions.filter((item) => item.mode === "timeout");
  const delayed = state.decisions.filter((item) => item.latencySeconds > 90);
  const text = state.decisions.map((item) => `${item.choice} ${item.reason}`).join(" ").toLowerCase();

  if (state.decisions.some((item) => item.id === "traffic-control" && ["Pause checkout", "Disable payments only", "Throttle traffic"].includes(item.choice))) {
    strong.push("Early containment decision was made before the crisis fully escalated.");
  } else {
    risk.push("Reactive instead of proactive containment.");
  }

  if (state.decisions.some((item) => item.id === "customer-communication" && item.choice !== "Stay silent until root cause is known")) {
    strong.push("Customer communication was addressed before the end of the incident.");
  } else {
    risk.push("Customer communication was delayed or avoided.");
  }

  if (timeouts.length) risk.push(`${timeouts.length} decision prompt(s) timed out and default consequences were applied.`);
  if (delayed.length >= 2) risk.push("Decision hesitation observed across multiple prompts.");

  if (state.decisions.some((item) => isReasonMeaningful(item.reason, 80))) strong.push("At least one decision included substantial tradeoff reasoning.");
  else risk.push("Tradeoff ownership unclear.");

  if (!containsAny(text, ["payment", "order", "refund", "customer", "support"])) {
    risk.push("Recorded reasoning did not clearly mention payment, order, refund, support, or customer impact.");
  }

  if (hasContradictoryActions()) risk.push("Inconsistent decision logic detected across containment choices.");
  if (state.decisions.some((item) => looksGeneric(item.reason))) risk.push("Generic reasoning text detected.");
  if (state.decisions.some((item) => !isReasonMeaningful(item.reason, item.mode === "timeout" ? 10 : 60))) risk.push("Shallow justifications appeared in the decision record.");
  if (!timeouts.length && delayed.length === 0) strong.push("Decision latency stayed controlled under pressure.");

  return { strong, risk };
}

function buildReportHtml(signals) {
  return `
    <section class="report-intro">
      <h2>Generated from LaunchRoom simulation decisions.</h2>
      <p>${escapeHtml(getPortfolioSummary())}</p>
    </section>
    <section class="report-section status-section">
      <h2>Completion Status</h2>
      <p>${escapeHtml(state.completedBy)}</p>
      <p>${escapeHtml(state.profile.name)} | ${escapeHtml(state.profile.email)} | ${escapeHtml(state.profile.discord)}</p>
    </section>
    <section class="report-section">
      <h2>Decision Timeline</h2>
      ${tableHtml(["Time", "Category", "Prompt", "Decision", "Latency", "Mode", "Reason"], state.decisions.map((item) => [item.savedAt, item.category, item.prompt, item.choice, `${item.latencySeconds}s`, item.mode, item.reason]))}
    </section>
    <section class="report-section">
      <h2>Consequence Summary</h2>
      ${tableHtml(["Time", "Decision", "Consequence", "Metric Impact", "Stakeholder Reaction"], state.consequences.map((item) => [item.savedAt, item.decision, item.consequence, item.impact, item.reaction]))}
    </section>
    <section class="report-section">
      <h2>Incident Prioritization Matrix</h2>
      ${tableHtml(["Derived Priority", "Evidence", "Why It Mattered"], derivePriorities())}
    </section>
    <section class="report-section">
      <h2>Stakeholder Incident Brief</h2>
      ${stakeholderBriefHtml()}
    </section>
    <section class="report-section">
      <h2>Performance Signals</h2>
      <div class="signal-list">
        <div class="signal-card strong-card"><h3>Strong signals observed</h3>${listHtml(signals.strong)}</div>
        <div class="signal-card risk-card"><h3>Risk signals observed</h3>${listHtml(signals.risk)}</div>
      </div>
    </section>
    <section class="report-section">
      <h2>Leadership Signals</h2>
      ${leadershipSignalsHtml()}
    </section>
    <section class="report-section portfolio-section">
      <h2>Portfolio Summary</h2>
      <p>${escapeHtml(getPortfolioSummary())}</p>
    </section>
  `;
}

function buildMarkdownReport(signals) {
  return `# CareerForge Day 6 Launch Incident Report

Generated from LaunchRoom simulation decisions.

Student: ${state.profile.name}
Email: ${state.profile.email}
Discord: ${state.profile.discord}

## Completion Status

${state.completedBy}

## Decision Timeline

${markdownTable(["Time", "Category", "Prompt", "Decision", "Latency", "Mode", "Reason"], state.decisions.map((item) => [item.savedAt, item.category, item.prompt, item.choice, `${item.latencySeconds}s`, item.mode, item.reason]))}

## Consequence Summary

${markdownTable(["Time", "Decision", "Consequence", "Metric Impact", "Stakeholder Reaction"], state.consequences.map((item) => [item.savedAt, item.decision, item.consequence, item.impact, item.reaction]))}

## Incident Prioritization Matrix

${markdownTable(["Derived Priority", "Evidence", "Why It Mattered"], derivePriorities())}

## Stakeholder Incident Brief

${stakeholderBriefMarkdown()}

## Performance Signals

### Strong signals observed

${signals.strong.map((item) => `- ${item}`).join("\n") || "- None observed"}

### Risk signals observed

${signals.risk.map((item) => `- ${item}`).join("\n") || "- None observed"}

## Leadership Signals

${leadershipSignalsMarkdown()}

## Portfolio Summary

${getPortfolioSummary()}
`;
}

function derivePriorities() {
  const rows = [];
  const choices = state.decisions.map((item) => item.choice).join(" ");
  rows.push(["Critical", "Payment success without order confirmation and duplicate charge pressure.", "Customer money impact required immediate containment and communication."]);
  rows.push(["High", "Webhook retries, duplicate events, and inventory mismatch appeared together.", "Systemic state consistency risk could create repeated side effects."]);
  rows.push([choices.includes("Publish transparent") ? "High" : "Medium", "Support tickets and screenshots increased during the incident.", "Customer-facing communication affected trust and support load."]);
  rows.push([choices.includes("Fix analytics") ? "Misprioritized" : "Deferred", "Analytics/dashboard visibility was not the core customer-money failure.", "Cosmetic visibility work should not outrank payment/order containment."]);
  return rows;
}

function stakeholderBriefHtml() {
  return `<dl>
    <dt>Current situation</dt><dd>${escapeHtml("FlashCart experienced checkout instability during a high-traffic limited drop, including payment/order inconsistencies, webhook lag, and support escalation.")}</dd>
    <dt>Actions taken</dt><dd>${escapeHtml(state.decisions.map((item) => item.choice).join("; ") || "No decisions recorded.")}</dd>
    <dt>Tradeoffs accepted</dt><dd>${escapeHtml(state.consequences.map((item) => item.consequence).join(" "))}</dd>
    <dt>Remaining risk</dt><dd>${escapeHtml("Some customer reconciliation and post-incident engineering follow-up may remain depending on decisions made during the simulation.")}</dd>
  </dl>`;
}

function stakeholderBriefMarkdown() {
  return `- Current situation: FlashCart experienced checkout instability during a high-traffic limited drop, including payment/order inconsistencies, webhook lag, and support escalation.
- Actions taken: ${state.decisions.map((item) => item.choice).join("; ") || "No decisions recorded."}
- Tradeoffs accepted: ${state.consequences.map((item) => item.consequence).join(" ")}
- Remaining risk: Some customer reconciliation and post-incident engineering follow-up may remain depending on decisions made during the simulation.`;
}

function leadershipSignalsHtml() {
  const signals = getLeadershipSignals();
  return `<div class="signal-list">
    <div class="signal-card strong-card"><h3>Leadership strengths</h3>${listHtml(signals.strong)}</div>
    <div class="signal-card risk-card"><h3>Leadership risks</h3>${listHtml(signals.risk)}</div>
  </div>`;
}

function leadershipSignalsMarkdown() {
  const signals = getLeadershipSignals();
  return `### Leadership strengths

${signals.strong.map((item) => `- ${item}`).join("\n") || "- None observed"}

### Leadership risks

${signals.risk.map((item) => `- ${item}`).join("\n") || "- None observed"}`;
}

function getLeadershipSignals() {
  const strong = [];
  const risk = [];
  const choices = state.decisions.map((item) => item.choice).join(" ").toLowerCase();
  const avgLatency = getAverageLatency();

  if (containsAny(choices, ["trust", "refund", "faq", "transparent", "contain payments", "full stop", "isolate"])) {
    strong.push("Owned difficult tradeoffs instead of only preserving launch momentum.");
  }
  if (containsAny(choices, ["webhook idempotency", "inventory reservation", "hotfix", "isolate affected"])) {
    strong.push("Prioritized engineering containment over cosmetic visibility work.");
  }
  if (avgLatency && avgLatency <= 90) strong.push("Maintained decision pace under timer pressure.");
  if (state.decisions.some((item) => item.id === "customer-communication" && item.choice.includes("transparent"))) {
    strong.push("Communicated clearly under uncertainty.");
  }

  if (state.decisions.filter((item) => item.mode === "timeout").length >= 2) risk.push("Repeated timeout defaults suggest weak command presence.");
  if (avgLatency > 110) risk.push("Average decision latency indicates hesitation under pressure.");
  if (choices.includes("stay silent") || choices.includes("hold response")) risk.push("Delayed customer communication increased trust risk.");
  if (choices.includes("dashboard")) risk.push("Chose a visibility task while customer-money harm was active.");
  if (!strong.length) risk.push("Leadership posture was reactive rather than decisive.");

  return { strong, risk };
}

function tableHtml(headers, rows) {
  if (!rows.length) return "<p>No entries recorded.</p>";
  return `<div class="table-wrap"><table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell || "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function markdownTable(headers, rows) {
  if (!rows.length) return "No entries recorded.";
  return `| ${headers.join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |\n${rows.map((row) => `| ${row.map((cell) => sanitizeMarkdownCell(cell)).join(" | ")} |`).join("\n")}`;
}

function listHtml(items) {
  if (!items.length) return "<p>None observed.</p>";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function getPortfolioSummary() {
  return `During this LaunchRoom simulation, ${state.profile.name} made ${state.decisions.length} operational incident decisions, experienced ${state.consequences.length} consequence events, and produced a stakeholder-ready incident brief under time pressure.`;
}

async function copyMarkdown() {
  try {
    await navigator.clipboard.writeText(state.reportMarkdown);
    showToast("Markdown copied");
  } catch {
    showToast("Copy failed. Use download instead.");
  }
}

function downloadMarkdown() {
  const blob = new Blob([state.reportMarkdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "launchroom-final-report.md";
  link.click();
  URL.revokeObjectURL(url);
}

function getPhase(simMinute) {
  if (simMinute < 1) return "Phase 1: First Signals";
  if (simMinute < 3) return "Phase 2: Customer Money Impact";
  if (simMinute < 5) return "Phase 3: Systemic Failure";
  if (simMinute < 7) return "Phase 4: Stakeholder Conflict";
  return "Phase 5: Final Decision Window";
}

function severityFor(value, warning, critical, direction) {
  if (direction === "low") {
    if (value <= critical) return "critical";
    if (value <= warning) return "warning";
    return "normal";
  }
  if (value >= critical) return "critical";
  if (value >= warning) return "warning";
  return "normal";
}

function hasContradictoryActions() {
  const choices = state.decisions.map((item) => item.choice);
  return choices.includes("Keep checkout live") && (choices.includes("Full stop: pause drop and reconcile") || choices.includes("Pause checkout"));
}

function looksGeneric(text) {
  const trimmed = text.trim().toLowerCase();
  return ["because it is best", "this is better", "to solve the issue", "for safety", "to reduce risk"].some((phrase) => trimmed === phrase || trimmed.includes(`${phrase}.`));
}

function isReasonMeaningful(text, min) {
  const value = text.trim();
  if (value.length < min || looksGeneric(value)) return false;
  if (hasRepeatedCharacterSpam(value)) return false;
  if (hasRepeatedPatternSpam(value)) return false;
  if (hasRepeatedTokenSpam(value)) return false;
  if (hasLowLexicalDiversity(value)) return false;
  if (hasTooFewUniqueWords(value)) return false;
  return true;
}

function hasRepeatedCharacterSpam(text) {
  const compact = text.toLowerCase().replace(/\s+/g, "");
  return /(.)\1{7,}/.test(compact);
}

function hasRepeatedPatternSpam(text) {
  const compact = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (compact.length < 8) return false;
  for (let size = 2; size <= 4; size += 1) {
    const pattern = compact.slice(0, size);
    if (pattern.repeat(Math.ceil(compact.length / size)).slice(0, compact.length) === compact) return true;
  }
  return false;
}

function hasRepeatedTokenSpam(text) {
  const words = getWords(text);
  if (words.length < 4) return false;
  const counts = words.reduce((map, word) => {
    map[word] = (map[word] || 0) + 1;
    return map;
  }, {});
  return Object.values(counts).some((count) => count >= Math.max(4, Math.ceil(words.length * 0.55)));
}

function hasLowLexicalDiversity(text) {
  const words = getWords(text);
  if (words.length < 8) return true;
  const unique = new Set(words);
  return unique.size / words.length < 0.45;
}

function hasTooFewUniqueWords(text) {
  return new Set(getWords(text)).size < 6;
}

function getWords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function showPage(page) {
  $("#briefingPage").classList.toggle("page-active", page === "briefing");
  $("#commandPage").classList.toggle("page-active", page === "command");
  $("#reportPage").classList.toggle("page-active", page === "report");
}

function showEntryValidation(message) {
  $("#entryValidation").textContent = message;
  $("#entryValidation").classList.remove("hidden");
}

function showToast(message) {
  const existing = $(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

function getSimMinute() {
  if (!state.startedAt) return 0;
  const elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
  return Math.min(CANONICAL_TIMELINE_MINUTES, (elapsedSeconds / state.durationSeconds) * CANONICAL_TIMELINE_MINUTES);
}

function currentSimTimeLabel() {
  return `T+${String(Math.floor(getSimMinute())).padStart(2, "0")}`;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatLag(seconds) {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function containsAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeMarkdownCell(value) {
  return String(value || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

init();
