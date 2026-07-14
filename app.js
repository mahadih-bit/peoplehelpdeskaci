const profiles = {
  "1001": { name: "Mahadi Hasan", division: "Corporate", grade: "Management", status: "Confirmed", role: "employee" },
  "2001": { name: "Nusrat Karim", division: "Pharmaceuticals", grade: "Pharma Grade", status: "Confirmed", role: "employee" },
  "3001": { name: "Rafiq Ahmed", division: "Manufacturing", grade: "Trade Union", status: "Confirmed", role: "employee" },
  "4001": { name: "Tanvir Rahman", division: "Field Force", grade: "Sales / Field", status: "Probationary", role: "employee" },
  "9999": { name: "People Team Admin", division: "ACI People Team", grade: "Administrator", status: "Admin", role: "admin" }
};

const policyCards = [
  ["Leave", "Privilege Leave, Sick Leave, Maternity Leave, leave procedure, carry-forward, and leave adjustment guidance.", "People Operations"],
  ["Attendance", "Office timing, late attendance, missing punch, attendance discipline, and supervisor responsibility.", "People Partner / Admin"],
  ["Payroll", "Salary payment guidance, payslip, salary account, tax certificate, deductions, and payroll contact route.", "Payroll"],
  ["Benefits", "Festival bonus, medical, insurance, Leave Fare Assistance, WPPF, and related benefit guidance.", "People Rewards"],
  ["PF", "Contribution eligibility, employee contribution, company matching, and PF guidance.", "People Rewards"],
  ["Gratuity", "Eligibility and gratuity calculation guidance based on completed service years.", "People Rewards"],
  ["TA/DA", "Business travel in Bangladesh, overseas travel, accommodation, meals, daily allowance, and approval route.", "Admin / Finance"],
  ["Confirmation", "Probation, confirmation, benefit eligibility, and related People Team follow-up.", "People Partner"],
  ["Resignation & Clearance", "Notice period, clearance, final settlement, release letter, and resignation acceptance process.", "People Operations"]
];

const currentRules = [
  ["Company identity", "The employee-facing policy guidance will refer to the organization as ACI PLC.", "Current guidance"],
  ["Grade structure", "Salary structure is presented by grade only. Separate grade logic may apply for Pharmaceuticals and Trade Union-based employees.", "Grade-specific"],
  ["Performance bonus", "Employees are eligible for performance bonus consideration if they are confirmed on or before 01 April during the relevant financial year.", "People Rewards validation"],
  ["Gratuity", "Gratuity is calculated from date of joining. After completing one year, an additional 6 months or more is counted as a full year. Up to 10 counted years: 30 days or 1 month basic per counted year. More than 10 counted years: 45 days or 1.5 months basic per counted year.", "Guidance tool available"],
  ["Provident Fund", "Employees may contribute after completing one year of continuous service. Equal company contribution applies after one year from the contribution start date.", "Eligibility check available"],
  ["Retirement", "Retirement age is 60 years.", "Current guidance"],
  ["Attendance conduct", "Habitual late attendance or willful non-compliance with attendance recording may be treated as misconduct.", "People Partner / Admin"],
  ["Resignation", "Resignation, clearance, notice period, and final settlement should follow People Team process and applicable service terms.", "People Operations"],
  ["Confidentiality", "Salary, benefits, and company information must be treated as confidential and used only for authorized purposes.", "Conduct"]
];

const serviceOwners = {
  "Leave": "People Operations · SLA 2 working days",
  "Attendance": "People Partner/Admin · SLA 2 working days",
  "Payroll": "Payroll · SLA 3 working days",
  "Benefits": "People Rewards · SLA 5 working days",
  "PF": "People Rewards · SLA 5 working days",
  "Gratuity": "People Rewards · SLA 5 working days",
  "TA/DA": "Admin/Finance · SLA 5 working days",
  "Confirmation": "People Partner · SLA 3 working days",
  "Clearance": "People Operations · SLA 5 working days",
  "Resignation": "People Partner/People Operations · SLA 5 working days",
  "Transfer": "People Partner · SLA case-based",
  "Joining": "People Operations/Admin/IT · SLA before joining",
  "General": "People Team · SLA 3 working days"
};

const promptList = [
  "Good morning, what leave do I get?",
  "When can I start PF contribution?",
  "How is gratuity calculated after 10 years?",
  "Am I eligible for performance bonus?",
  "What if I miss attendance punch?",
  "How do I submit resignation?"
];

const loginView = document.getElementById("loginView");
const appView = document.getElementById("appView");
const loginForm = document.getElementById("loginForm");
const employeeId = document.getElementById("employeeId");
const password = document.getElementById("password");
const loginError = document.getElementById("loginError");
const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
let currentUser = null;

function getGreeting(){
  const hour = new Date().getHours();
  if(hour < 12) return "Good morning";
  if(hour < 17) return "Good afternoon";
  return "Good evening";
}

function signIn(id){
  const profile = profiles[id];
  currentUser = { id, ...profile };
  loginView.classList.add("hidden");
  appView.classList.remove("hidden");
  document.getElementById("roleLabel").textContent = profile.role === "admin" ? "Administrator portal" : "Employee portal";
  document.getElementById("profileName").textContent = profile.name;
  document.getElementById("profileMeta").textContent = `${profile.grade} · ${profile.division}`;
  document.getElementById("avatar").textContent = profile.name.slice(0,1);
  document.getElementById("employeeIdText").textContent = id;
  document.getElementById("divisionText").textContent = profile.division;
  document.getElementById("gradeText").textContent = profile.grade;
  document.getElementById("statusText").textContent = profile.status;
  document.getElementById("timeGreeting").textContent = getGreeting();
  document.getElementById("welcomeTitle").textContent = `${getGreeting()}, ${profile.name.split(" ")[0]}. How can PeopleBot help?`;
  document.querySelectorAll(".admin-only").forEach(el => el.classList.toggle("hidden", profile.role !== "admin"));
  resetChat();
  refreshAdminDashboard();
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = employeeId.value.trim();
  const pw = password.value.trim();
  if(!profiles[id] || id !== pw){
    loginError.textContent = "For this demo, use a listed Employee ID and the same ID as password.";
    return;
  }
  loginError.textContent = "";
  signIn(id);
});

document.querySelectorAll("[data-login]").forEach(btn => btn.addEventListener("click", () => {
  employeeId.value = btn.dataset.login;
  password.value = btn.dataset.login;
}));

document.getElementById("logoutBtn").addEventListener("click", () => {
  appView.classList.add("hidden");
  loginView.classList.remove("hidden");
  currentUser = null;
});

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.target).classList.add("active");
    if(btn.dataset.target === "adminSection") refreshAdminDashboard();
  });
});

function renderStaticContent(){
  const policyGrid = document.getElementById("policyGrid");
  policyGrid.innerHTML = policyCards.map(([title, desc, owner]) => `<article class="policy-card"><h3>${title}</h3><p>${desc}</p><small>${owner}</small></article>`).join("");
  const rulesGrid = document.getElementById("rulesGrid");
  rulesGrid.innerHTML = currentRules.map(([title, desc, tag]) => `<article class="rule-card"><h3>${title}</h3><p>${desc}</p><small>${tag}</small></article>`).join("");
  const prompts = document.getElementById("quickPrompts");
  prompts.innerHTML = promptList.map(p => `<button type="button">${p}</button>`).join("");
  prompts.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => askBot(btn.textContent)));
  const ownerMatrix = document.getElementById("ownerMatrix");
  ownerMatrix.innerHTML = Object.entries(serviceOwners).slice(0,10).map(([k,v]) => `<div class="owner-row"><strong>${k}</strong><span>${v}</span></div>`).join("");
}
renderStaticContent();

function resetChat(){
  chatWindow.innerHTML = "";
  if (typeof chatHistory !== "undefined") chatHistory = [];
  addMessage("bot", `<strong>${getGreeting()}, ${currentUser.name.split(" ")[0]}.</strong><br>I am PeopleBot, your AI People assistant powered by ACI Service Rules. Ask me about leave, attendance, PF, gratuity, performance bonus, TA/DA, confirmation, clearance, transfer, joining, resignation, payroll guidance, or People rules.`, {category:"Greeting", confidence: 100, status:"Ready"});
}
document.getElementById("resetChat").addEventListener("click", resetChat);

function escapeHtml(str){
  return str.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));
}
function addMessage(role, html, meta){
  const wrap = document.createElement("div");
  wrap.className = `message ${role}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = html;

  // Employee-facing chat is intentionally clean: no source chips,
  // category tags, confidence labels, or technical classification details.
  // Meta data is still used in the Administrator analytics dashboard.
  wrap.appendChild(bubble);
  chatWindow.appendChild(wrap);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function normalizeQuery(text){
  return String(text || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\+/g, " plus ")
    .replace(/ta\s*\/\s*da|\bt\/a\b|\btada\b/g, " ta da ")
    .replace(/p\/f/g, " pf ")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function termMatches(normalized, term){
  const t = normalizeQuery(term);
  if(!t) return false;
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\s)${escaped}(\\s|$)`).test(normalized);
}

function scoreIntent(normalized, config){
  let score = 0;
  (config.must || []).forEach(term => { if(termMatches(normalized, term)) score += 22; });
  (config.strong || []).forEach(term => { if(termMatches(normalized, term)) score += 16; });
  (config.normal || []).forEach(term => { if(termMatches(normalized, term)) score += 8; });
  (config.weak || []).forEach(term => { if(termMatches(normalized, term)) score += 2; });
  return score;
}

function classify(text){
  const normalized = normalizeQuery(text);

  // Whole-word + weighted matching. This prevents false matches such as:
  // "calculated" -> "late", "gratuity" -> "TA", or "confirmation" -> generic "confirmed".
  const intentConfigs = [
    { category:"Gratuity", priority:1, must:["gratuity"], strong:["gratuity calculation", "gratuity calculated"], normal:["completed year", "completed years", "service year", "service years", "6 months", "six months", "30 days", "45 days", "one month basic", "1 month basic", "1.5 months", "10 years", "ten years", "more than 10 years", "after 10 years", "final settlement benefit"], weak:["service benefit", "separation benefit"] },
    { category:"PF", priority:2, must:["pf", "provident fund"], strong:["provident", "pf contribution", "contribution start", "company contribution"], normal:["employee contribution", "equal contribution", "fund contribution", "one year service"], weak:["fund"] },
    { category:"Performance Bonus", priority:3, must:["performance bonus", "annual performance award"], strong:["pb", "bonus eligibility", "confirmed by april", "01 april", "1 april", "april 1"], normal:["appraisal bonus", "bonus payout", "annual bonus", "performance award"], weak:["bonus"] },
    { category:"Leave", priority:4, must:["privilege leave", "sick leave", "maternity leave"], strong:["leave", "leaves", "pl", "sl", "sick", "sick leaves", "privilege leaves", "leave balance", "leave application", "leave encashment"], normal:["carry forward", "holiday", "absence", "absent", "leave procedure", "leave entitlement"], weak:["maternity"] },
    { category:"Attendance", priority:5, must:["attendance", "attendance punch", "missing punch", "late punch", "attendance machine"], strong:["punch", "late attendance", "biometric", "finger", "office timing", "office time", "timekeeping"], normal:["miss punch", "forgot punch", "office hour", "work hour"], weak:["late", "machine"] },
    { category:"Payroll", priority:6, must:["payroll", "payslip", "salary payment", "salary account", "tax certificate"], strong:["deduction", "tax", "bank account", "payment date", "monthly salary"], normal:["salary", "income tax", "salary certificate", "payment"], weak:["bank"] },
    { category:"Benefits", priority:7, must:["benefit", "benefits", "festival bonus", "medical benefit", "group life insurance", "leave fare assistance"], strong:["medical", "insurance", "lfa", "wppf", "festival", "hospitalization", "hospitalisation"], normal:["medical allowance", "life insurance", "workers participation fund"], weak:["allowance"] },
    { category:"TA/DA", priority:8, must:["ta da", "travel allowance", "daily allowance", "business travel", "outstation tour"], strong:["travel", "tour", "outstation", "hotel", "accommodation", "meal allowance", "expense claim", "reimbursement", "claim"], normal:["travel bill", "tour bill", "local travel", "foreign travel"], weak:["ta", "da"] },
    { category:"Confirmation", priority:9, must:["confirmation", "probation", "probationary"], strong:["confirmed employee", "confirmation letter", "confirm employee"], normal:["permanent employee", "probation period", "confirmation status"], weak:["confirm", "confirmed"] },
    { category:"Clearance", priority:10, must:["clearance", "clearance form", "clearance process"], strong:["asset clearance", "final clearance", "department clearance", "release clearance"], normal:["clearance status", "exit clearance"], weak:["clear"] },
    { category:"Resignation", priority:11, must:["resignation", "resign", "notice period", "final settlement", "release letter", "separation"], strong:["submit resignation", "resignation letter", "resignation process", "leaving company"], normal:["notice", "quit", "last working day", "resignation acceptance"], weak:["release"] },
    { category:"Transfer", priority:12, must:["transfer", "posting", "relocation", "temporary posting"], strong:["transferred", "location change", "transfer allowance", "transfer letter"], normal:["new place", "new location", "relocate"], weak:["posting"] },
    { category:"Joining", priority:13, must:["joining", "onboarding", "joining formalities", "id card", "employee id"], strong:["new joiner", "joining document", "documents needed", "documents required", "bank account"], normal:["orientation", "system access", "joining checklist", "joining process"], weak:["document", "documents"] },
    { category:"Conduct", priority:14, must:["misconduct", "confidentiality", "confidential", "discipline", "disciplinary", "conduct", "conflict of interest"], strong:["behavior", "behaviour", "shout", "shouting", "gift", "supplier", "fraud", "theft", "private business"], normal:["professionalism", "ethics", "code of conduct", "disciplinary action", "private teaching", "teaching", "weekend work", "outside work"], weak:["rule", "people rule"] }
  ];

  const scores = intentConfigs
    .map(cfg => ({ ...cfg, score: scoreIntent(normalized, cfg) }))
    .filter(item => item.score > 0)
    .sort((a,b) => (b.score - a.score) || (a.priority - b.priority));

  if(scores.length){
    const top = scores[0];
    const confidence = Math.min(98, Math.max(72, 55 + top.score * 2));
    return { category: top.category, confidence };
  }

  const greetingOnly = ["hi", "hello", "assalamu", "salam", "good morning", "good afternoon", "good evening"]
    .some(term => termMatches(normalized, term));
  if(greetingOnly) return { category:"Greeting", confidence:95 };

  return { category:"General", confidence:48, escalate:true };
}

function answerFor(text, intent){
  const name = currentUser.name.split(" ")[0];
  const hello = `${getGreeting()}, ${name}. `;
  const actionLine = (owner) => `<br><br><strong>Suggested action:</strong> For employee-specific confirmation, contact ${owner}.`;
  switch(intent.category){
    case "Greeting": return {html:`${hello}Nice to hear from you. I can help with People policy guidance, eligibility checks, service request routes, and common People Team questions.`, owner:"People Team", escalate:false};
    case "Leave": return {html:`${hello}For leave guidance, employees can ask about Privilege Leave, Sick Leave, Maternity Leave, leave application process, leave balance, carry-forward, and leave adjustment. Leave applications should follow the approval route and proper documentation where required.${actionLine("People Operations or your People Partner")}`, owner:"People Operations", escalate:false};
    case "Attendance": return {html:`${hello}Attendance should be recorded properly as per applicable office or field process. Habitual late attendance, missing punch, or willful non-compliance may require supervisor and People Partner attention.${actionLine("your People Partner or Admin attendance focal")}`, owner:"People Partner/Admin", escalate:false};
    case "Payroll": return {html:`${hello}For payroll guidance, employees may ask about salary payment, payslip, salary account, tax certificate, deductions, or payroll timeline. PeopleBot can guide the route, but actual payroll records should be checked by Payroll.${actionLine("Payroll")}`, owner:"Payroll", escalate:false};
    case "PF": return {html:`${hello}Current PF guidance: employees may start PF contribution after completing one year of continuous service. Company equal contribution applies after one year from the employee's PF contribution start date.${actionLine("People Rewards / PF desk")}`, owner:"People Rewards", escalate:false};
    case "Gratuity": return {html:`${hello}Current gratuity guidance: gratuity is counted from the date of joining. After completing one year, if an employee completes an additional 6 months of service, that period will be treated as a full year for gratuity. Up to 10 counted years, the rate is 30 days or 1 month basic salary per counted year. For more than 10 counted years, the rate is 45 days or 1.5 months basic salary per counted year. You can use the Gratuity Estimator in Guidance Tools for a demo calculation.${actionLine("People Rewards for final settlement validation")}`, owner:"People Rewards", escalate:false};
    case "Performance Bonus": return {html:`${hello}For performance bonus eligibility, the employee needs to be confirmed on or before 01 April during the relevant financial year. Actual payout depends on applicable performance and company process.${actionLine("People Rewards / People Partner")}`, owner:"People Rewards", escalate:false};
    case "TA/DA": return {html:`${hello}TA/DA guidance covers business travel, outstation visits, accommodation, meals, daily allowance, supporting bills, and approval route. Entitlement can vary by grade, location, and travel type.${actionLine("Admin / Finance / your supervisor")}`, owner:"Admin/Finance", escalate:false};
    case "Confirmation": return {html:`${hello}Confirmation-related queries should be routed through the supervisor and People Partner. Confirmation status can affect certain benefits and performance bonus eligibility timelines.${actionLine("your People Partner")}`, owner:"People Partner", escalate:false};
    case "Clearance": return {html:`${hello}Clearance is required before final release or settlement. It usually involves relevant departments such as People Operations, Admin, Finance, IT, business function, and asset owners, depending on the employee's role.${actionLine("People Operations")}`, owner:"People Operations", escalate:false};
    case "Resignation": return {html:`${hello}For resignation, submit the resignation through the proper reporting and People Team route. Notice period, clearance, final settlement, and release documentation should follow applicable service terms.${actionLine("your People Partner and People Operations")}`, owner:"People Partner/People Operations", escalate:false};
    case "Transfer": return {html:`${hello}Transfer or posting decisions are guided by business need, role requirement, location, notice, and applicable transfer support. Employee-specific cases should be handled through People Partner and business approval.${actionLine("your People Partner")}`, owner:"People Partner", escalate:false};
    case "Joining": return {html:`${hello}Joining formalities may include document submission, employee ID creation, bank account, ID card, onboarding, system access, logistics, and orientation. New joiners should follow the joining checklist provided by the People Team.${actionLine("People Operations / Admin / IT")}`, owner:"People Operations", escalate:false};
    case "Conduct": return {html:`${hello}Conduct-related guidance includes professionalism, confidentiality, respectful workplace behavior, attendance discipline, conflict of interest, and misconduct handling. Sensitive conduct matters should not be resolved through chatbot only.${actionLine("People Partner or Employee Relations")}`, owner:"People Partner/Employee Relations", escalate:true};
    default: return {html:`${hello}I may need a little more context to answer this accurately. I have saved this as a possible FAQ gap for the People Team. Please mention the policy area, employee category, and what outcome you need.${actionLine("People Team")}`, owner:"People Team", escalate:true};
  }
}

// ---- AI (Gemini) integration ----
// The browser only calls our own /api/chat endpoint on Vercel.
// The Gemini API key never appears in this file or anywhere client-side.
const AI_ENDPOINT = "/api/chat";
let chatHistory = [];

async function askAI(text){
  const res = await fetch(AI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: text,
      profile: { name: currentUser.name, division: currentUser.division, grade: currentUser.grade, status: currentUser.status },
      history: chatHistory.slice(-6)
    })
  });
  if(!res.ok) throw new Error("AI endpoint error " + res.status);
  return res.json();
}

async function askBot(text){
  if(!text.trim()) return;
  addMessage("user", escapeHtml(text));
  chatInput.value = "";
  const typing = document.createElement("div");
  typing.className = "message bot typing";
  typing.innerHTML = `<div class="bubble">PeopleBot is preparing a helpful response...</div>`;
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  chatHistory.push({ role: "user", text });

  try {
    // AI-first: Gemini answers using the full FAQ knowledge base
    const ai = await askAI(text);
    typing.remove();
    const actionSuffix = ai.escalate
      ? `<br><br><strong>Suggested action:</strong> This has been noted for People Team follow-up.`
      : "";
    const html = escapeHtml(ai.answer).replace(/\n/g, "<br>") + actionSuffix;
    addMessage("bot", html, ai);
    chatHistory.push({ role: "model", text: ai.answer });
    const intentLike = { category: ai.category, confidence: ai.confidence, escalate: ai.escalate };
    logQuery(text, intentLike, ai.owner, ai.escalate);
    refreshAdminDashboard();
  } catch (err) {
    // Offline / server-error fallback: original rule-based engine
    console.warn("AI unavailable, using offline engine:", err.message);
    const intent = classify(text);
    const ans = answerFor(text, intent);
    const meta = { category:intent.category, confidence:intent.confidence, escalate: ans.escalate || intent.escalate };
    typing.remove();
    addMessage("bot", ans.html + `<br><span class="muted" style="font-size:11px">Offline guidance mode</span>`, meta);
    chatHistory.push({ role: "model", text: "(offline rule-based answer)" });
    logQuery(text, intent, ans.owner, meta.escalate);
    refreshAdminDashboard();
  }
}

chatForm.addEventListener("submit", e => {
  e.preventDefault();
  askBot(chatInput.value);
});

function getAnalytics(){
  const raw = localStorage.getItem("aciPeopleAnalytics");
  return raw ? JSON.parse(raw) : [];
}
function setAnalytics(data){ localStorage.setItem("aciPeopleAnalytics", JSON.stringify(data)); }
function logQuery(query, intent, owner, escalate){
  const data = getAnalytics();
  data.push({
    ts: new Date().toISOString(),
    employeeId: currentUser.id,
    employeeName: currentUser.name,
    division: currentUser.division,
    segment: currentUser.grade,
    query,
    category: intent.category,
    confidence: intent.confidence,
    owner,
    status: escalate || intent.confidence < 60 ? "Escalate" : "Resolved"
  });
  setAnalytics(data.slice(-500));
}

const demoQueries = [
  ["1001","Management","Corporate","When can I start PF contribution?","PF",95,"People Rewards","Resolved"],
  ["2001","Pharma Grade","Pharmaceuticals","Am I eligible for performance bonus if confirmed by April?","Performance Bonus",92,"People Rewards","Resolved"],
  ["3001","Trade Union","Manufacturing","What is my grade rule?","General",48,"People Team","Escalate"],
  ["4001","Sales / Field","Field Force","How to claim TA DA after market visit?","TA/DA",88,"Admin/Finance","Resolved"],
  ["1001","Management","Corporate","What happens if I miss attendance punch?","Attendance",90,"People Partner/Admin","Resolved"],
  ["2001","Pharma Grade","Pharmaceuticals","How is gratuity calculated after 10 years?","Gratuity",96,"People Rewards","Resolved"],
  ["4001","Sales / Field","Field Force","How do I submit resignation?","Resignation",89,"People Partner/People Operations","Resolved"],
  ["1001","Management","Corporate","What documents are needed for joining?","Joining",85,"People Operations","Resolved"],
  ["3001","Trade Union","Manufacturing","Who approves transfer?","Transfer",86,"People Partner","Resolved"],
  ["2001","Pharma Grade","Pharmaceuticals","Can I ask about tax certificate?","Payroll",86,"Payroll","Resolved"],
  ["1001","Management","Corporate","Can I do private teaching on weekends?","Conduct",82,"People Partner/Employee Relations","Escalate"],
  ["4001","Sales / Field","Field Force","How many sick leaves are allowed?","Leave",88,"People Operations","Resolved"]
];
function seedDemoAnalytics(){
  const now = Date.now();
  const records = demoQueries.map((r, i) => ({
    ts: new Date(now - (demoQueries.length-i)*3600*1000).toISOString(),
    employeeId:r[0], segment:r[1], division:r[2], query:r[3], category:r[4], confidence:r[5], owner:r[6], status:r[7], employeeName: profiles[r[0]]?.name || "Demo Employee"
  }));
  setAnalytics([...getAnalytics(), ...records].slice(-500));
  refreshAdminDashboard();
}
if(getAnalytics().length === 0) seedDemoAnalytics();

document.getElementById("seedAnalytics").addEventListener("click", seedDemoAnalytics);
document.getElementById("clearAnalytics").addEventListener("click", () => { setAnalytics([]); refreshAdminDashboard(); });

function countBy(data, key){
  return data.reduce((acc, r) => { acc[r[key] || "Unknown"] = (acc[r[key] || "Unknown"] || 0) + 1; return acc; }, {});
}
function renderBars(elId, counts){
  const entries = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,9);
  const max = Math.max(1, ...entries.map(e=>e[1]));
  document.getElementById(elId).innerHTML = entries.map(([label,val]) => `
    <div class="bar-row"><div class="bar-label">${label}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(6, val/max*100)}%"></div></div><div class="bar-value">${val}</div></div>
  `).join("") || `<p class="muted">No data yet.</p>`;
}
function refreshAdminDashboard(){
  const data = getAnalytics();
  const total = data.length;
  const resolved = data.filter(r => r.status === "Resolved").length;
  const escalated = data.filter(r => r.status !== "Resolved").length;
  const avg = total ? Math.round(data.reduce((s,r)=>s + (r.confidence || 0),0)/total) : 0;
  document.getElementById("kpiTotal").textContent = total;
  document.getElementById("kpiResolved").textContent = total ? `${Math.round(resolved/total*100)}%` : "0%";
  document.getElementById("kpiEscalated").textContent = escalated;
  document.getElementById("kpiConfidence").textContent = `${avg}%`;
  renderBars("categoryBars", countBy(data,"category"));
  renderBars("segmentBars", countBy(data,"segment"));
  const gaps = data.filter(r => r.status !== "Resolved" || r.confidence < 60).slice(-7).reverse();
  document.getElementById("gapList").innerHTML = gaps.length ? gaps.map(r => `<li>${escapeHtml(r.query)}<br><small>${r.category} · Confidence ${r.confidence}%</small></li>`).join("") : `<li>No major FAQ gap found in current demo data.</li>`;
  const recent = data.slice(-10).reverse();
  document.getElementById("recentQueries").innerHTML = recent.map(r => `
    <tr><td>${new Date(r.ts).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</td><td>${r.employeeId}</td><td>${r.category}</td><td>${escapeHtml(r.query)}</td><td><span class="status-pill ${r.status === 'Resolved' ? 'resolved':'escalate'}">${r.status}</span></td></tr>
  `).join("") || `<tr><td colspan="5">No queries logged yet.</td></tr>`;
}

document.getElementById("exportCsv").addEventListener("click", () => {
  const rows = getAnalytics();
  const header = ["timestamp","employeeId","employeeName","division","segment","category","confidence","owner","status","query"];
  const csv = [header.join(","), ...rows.map(r => header.map(k => `"${String(r[k] || "").replace(/"/g,'""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "aci_people_helpdesk_query_analytics.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// Calculators
const formatBDT = n => new Intl.NumberFormat("en-BD", {style:"currency", currency:"BDT", maximumFractionDigits:0}).format(n);
document.getElementById("calcGratuity").addEventListener("click", () => {
  const basic = Number(document.getElementById("basicSalary").value || 0);
  const completedYears = Math.floor(Number(document.getElementById("serviceYears").value || 0));
  const additionalMonths = Math.max(0, Math.min(11, Math.floor(Number(document.getElementById("serviceMonths").value || 0))));
  let countedYears = completedYears;
  if(completedYears >= 1 && additionalMonths >= 6) countedYears += 1;
  const factor = countedYears > 10 ? 1.5 : 1;
  const rateText = countedYears > 10 ? "45 days / 1.5 months basic" : "30 days / 1 month basic";
  const amount = basic * countedYears * factor;
  document.getElementById("gratuityResult").textContent = `Estimated gratuity: ${formatBDT(amount)}. Counted gratuity years: ${countedYears}. Rate: ${rateText} per counted year.`;
});
document.getElementById("calcPf").addEventListener("click", () => {
  const years = Number(document.getElementById("pfYears").value || 0);
  document.getElementById("pfResult").textContent = years >= 1 ? "Eligible to start PF contribution. Company equal contribution will apply after one year from contribution start date." : "Not yet eligible. PF contribution starts after one year of continuous service.";
});
document.getElementById("calcBonus").addEventListener("click", () => {
  const value = document.getElementById("confirmDate").value;
  if(!value){
    document.getElementById("bonusResult").textContent = "Please select a confirmation date.";
    return;
  }
  const d = new Date(`${value}T00:00:00`);
  const y = d.getFullYear();
  const m = d.getMonth();
  // ACI financial year is treated as July-June for this demo.
  // The applicable cut-off is 01 April within that financial year.
  const cutoffYear = m >= 6 ? y + 1 : y;
  const cutoff = new Date(`${cutoffYear}-04-01T00:00:00`);
  const fyLabel = m >= 6 ? `${y}-${String((y+1)%100).padStart(2,"0")}` : `${y-1}-${String(y%100).padStart(2,"0")}`;
  document.getElementById("bonusResult").textContent = d <= cutoff ? `Eligible for performance bonus consideration for FY ${fyLabel}, subject to applicable performance and company process.` : `Not eligible for FY ${fyLabel} performance bonus consideration because the confirmation date is after 01 April.`;
});

document.getElementById("requestForm").addEventListener("submit", e => {
  e.preventDefault();
  const draft = {
    employeeId: currentUser.id,
    employeeName: currentUser.name,
    type: document.getElementById("requestType").value,
    details: document.getElementById("requestText").value,
    savedAt: new Date().toLocaleString()
  };
  localStorage.setItem("aciPeopleDraft", JSON.stringify(draft, null, 2));
  document.getElementById("savedDraft").textContent = JSON.stringify(draft, null, 2);
});
const saved = localStorage.getItem("aciPeopleDraft");
if(saved) document.getElementById("savedDraft").textContent = saved;

if("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(()=>{}));
}
