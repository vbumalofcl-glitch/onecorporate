// General Construction Guidelines 2024 - Interactive App Logic

// Parent Tab Navigation Helper (when embedded in dashboard iframe)
function parentNav(tabName) {
  if (window.parent && window.parent.switchTab && window.parent !== window) {
    window.parent.switchTab(tabName);
  } else {
    if (tabName === 'dashboard') window.location.href = '../index.html';
    else if (tabName === 'procedures') window.location.href = '../maintenance_procedure/procedure.html';
    else if (tabName === 'emergency') window.location.href = '../index.html#emergency';
  }
}

// Document Knowledge Base for Instant Search & Filtering
const GUIDELINES_KNOWLEDGE_BASE = [
  {
    id: 1,
    title: "Plans Review Fee & Payment Location",
    category: "penalties",
    tags: ["fee", "payment", "20000", "pmo", "accounting"],
    content: "₱20,000.00 per unit non-refundable fee payable at PMO Accounting Office (2nd Floor, Mon-Fri 9am-3pm) prior to plan evaluation."
  },
  {
    id: 2,
    title: "Monitoring & Supervision Fee",
    category: "penalties",
    tags: ["fee", "monitoring", "5000", "monthly"],
    content: "₱5,000.00 per month payable to One Corporate. Fee applies for every 30 days of fit-out work duration."
  },
  {
    id: 3,
    title: "Construction Cash Bond Formula & Refund",
    category: "penalties",
    tags: ["bond", "cash bond", "50000", "20%", "refund"],
    content: "Monetary cash bond of ₱50,000.00 per unit or 20% of project total scope cost (whichever is higher). Refundable 2 months after completion upon submittal of 4 sets A3 as-built plans."
  },
  {
    id: 4,
    title: "Plan Review SLAs & Cut-off Time",
    category: "fitout",
    tags: ["sla", "review", "10 days", "15 days", "3pm"],
    content: "10 working days for small work; 15 working days for complicated work. Plans submitted after 3:00 PM count as received the following day."
  },
  {
    id: 5,
    title: "Structural Chipping & Coring Restrictions",
    category: "structural",
    tags: ["chipping", "coring", "columns", "welding", "shear wall"],
    content: "Structural chipping requires BM approval. No welding on vertical structural reinforcement (columns & shear walls). Floor slab coring prohibited without structural engineer authorization."
  },
  {
    id: 6,
    title: "1-Hour Fire Resistance Rating Requirement",
    category: "structural",
    tags: ["fire rating", "1 hour", "materials", "certificate"],
    content: "All interior construction materials must possess at least 1-hour fire resistive rating in accordance with Bureau of Fire Standards. Certificate must be submitted to PMO."
  },
  {
    id: 7,
    title: "Mezzanine Structure Strict Prohibition",
    category: "structural",
    tags: ["mezzanine", "prohibited", "storage"],
    content: "Installation of any mezzanine structure within units is strictly prohibited for both sold and leased units, including file storage or functional space."
  },
  {
    id: 8,
    title: "Drywall & Partition Material Limits",
    category: "fitout",
    tags: ["drywall", "partition", "plywood", "wood nailers"],
    content: "Partitions must be non-combustible terminating at finished ceiling. Plywood with wood nailers is strictly prohibited. Concrete nails on walls are forbidden."
  },
  {
    id: 9,
    title: "Ceiling & Drop Ceiling Guidelines",
    category: "fitout",
    tags: ["ceiling", "drop ceiling", "non combustible", "sprinkler hanger"],
    content: "Ceiling materials must be lightweight, non-combustible, non-asbestos, and sound absorbent (e.g. gypsum on metal frame). Ceiling wires must NEVER attach to sprinkler pipes."
  },
  {
    id: 10,
    title: "Electrical Wire & Conduit Specifications",
    category: "electrical",
    tags: ["wire", "3.5mm", "thhn", "phelps dodge", "emt", "pvc"],
    content: "Minimum wire size 3.5 mm² THHN (Phelps Dodge/eq, 600V). EMT conduit for exposed works; PVC Series 1000 for embedded works. Flexible metallic conduit for ceiling fixtures."
  },
  {
    id: 11,
    title: "Electrical Breakers & Load Limits",
    category: "electrical",
    tags: ["breaker", "abb", "ge", "pee", "water heater", "30a"],
    content: "Circuit breakers must be bolt-on type (ABB, GE). Maximum allowable water heater load is 30 Amperes. Plans must be signed & sealed by a Professional Electrical Engineer (PEE)."
  },
  {
    id: 12,
    title: "Sprinkler Orifice & Temperature Rating",
    category: "fire",
    tags: ["sprinkler", "155f", "68c", "130 sqft", "clearance"],
    content: "Sprinklers are 1/2\" orifice chrome recessed heads rated at 155°F (68°C). Max coverage 130 sq ft per head. Minimum 1.0 ft (12 in) radius clearance from lights/A-C diffusers."
  },
  {
    id: 13,
    title: "Fire Extinguisher & Firewatch Rules",
    category: "fire",
    tags: ["extinguisher", "hcfc 236", "green tank", "10 lbs", "firewatch"],
    content: "Provide 1 unit 10 lbs HCFC 236 FA portable fire extinguisher (green tank) per 11.4 ft (4m) radius. Dedicated firewatch person required during hot works."
  },
  {
    id: 14,
    title: "Plumbing Pipe Specifications & CR Location",
    category: "plumbing",
    tags: ["ppr", "pn20", "unitec", "belden", "pvc series 1000", "cr location"],
    content: "Cold/Hot water: PPR PN-20 (Unitec/Belden white). Waste/Vents: PVC Series 1000 (Atlanta). Comfort room locations are fixed and cannot be relocated."
  },
  {
    id: 15,
    title: "Material Delivery & Debris Pull-Out Window",
    category: "fitout",
    tags: ["delivery", "pullout", "debris", "6pm 12mn", "gate pass"],
    content: "Deliveries and debris pull-out allowed ONLY Mon-Sat, 6:00 PM to 12:00 MN (No Sun/Holidays). Gate pass required 3 days prior. Aggregates must be in sacks."
  },
  {
    id: 16,
    title: "Noisy Works Hours & Control Plan",
    category: "fitout",
    tags: ["noisy works", "5pm 6am", "chipping", "noise barrier"],
    content: "Noisy works restricted to 5:00 PM to 6:00 AM. Daytime noisy works require pre-approved Engineering Noise Control Plan submitted to PMO/BM."
  },
  {
    id: 17,
    title: "Unscheduled Delivery & Overnight Debris Fine",
    category: "penalties",
    tags: ["fine", "debris", "unscheduled", "3000"],
    content: "₱3,000.00 / day penalty deducted from cash bond for unscheduled deliveries or leaving construction materials/debris in corridors overnight."
  },
  {
    id: 18,
    title: "Unauthorized Personnel Fine",
    category: "penalties",
    tags: ["fine", "unauthorized", "access pass", "15000"],
    content: "₱15,000.00 penalty per violation for unlisted personnel or workers found without valid access pass or proper ID. Immediate site ejection."
  },
  {
    id: 19,
    title: "Fire Protection Impairment Penalty",
    category: "penalties",
    tags: ["fine", "impairment", "fire protection", "20000"],
    content: "₱20,000.00 / day charged if fire protection system is impaired beyond the 1-day allowable window without PMO extension clearance."
  },
  {
    id: 20,
    title: "Liquidated Damages for Work Delay",
    category: "penalties",
    tags: ["fine", "delay", "5000", "liquidated damages"],
    content: "₱5,000.00 / day delay penalty charged to contractor for unapproved completion delays beyond agreed schedule."
  }
];

// Interactive Flowchart Wizard Steps Data
const WIZARD_STEPS = [
  {
    step: 1,
    title: "Step 1: Submission of Letter of Intent",
    sla: "Immediate / Day 1",
    role: "Applicant → PMO",
    desc: "Applicant (Unit Owner or Authorized Tenant) submits a formal Letter of Intent to PMO outlining the proposed scope of fit-out/renovation works.",
    checklist: [
      "Letter addressed to Property Management Office (PMO)",
      "Clearly states scope, target start date, and unit details",
      "Signed by unit owner or authorized lessee"
    ]
  },
  {
    step: 2,
    title: "Step 2: Submission of Documentary Requirements",
    sla: "Day 1 - 2",
    role: "Applicant → PMO / BMO",
    desc: "Submission of complete architectural, engineering, and administrative documents. Incomplete submissions are not processed.",
    checklist: [
      "4 complete sets A3 signed & sealed construction drawings",
      "Soft copy of plans submitted via email",
      "Bill of Materials (BOM) & Gantt schedule chart",
      "Appointed Contractor Appointment Letter & Specimen Signatures",
      "Approved Lease Contract (for tenants)"
    ]
  },
  {
    step: 3,
    title: "Step 3: Initial Review by Building Maintenance",
    sla: "3 Working Days",
    role: "Building Maintenance Team",
    desc: "BMO verifies documentary completeness, checks compliance against house rules, conducts preliminary risk assessment, and accomplishes Work Permit Approval Form.",
    checklist: [
      "Completeness check on all 4 plan sets",
      "Building restriction & height limit check",
      "Preliminary risk & safety assessment",
      "Sign-off on Work Permit Approval Form (4 copies)"
    ]
  },
  {
    step: 4,
    title: "Step 4: Technical Engineering Review",
    sla: "4 Working Days",
    role: "Technical Engineering Services (FCLDC)",
    desc: "Detailed QA/QC review by Structural, Electrical, Mechanical, and Safety Engineers. Evaluation of design feasibility and base building impact.",
    checklist: [
      "PEE review of electrical load & circuit schedule",
      "PME review of A/C & exhaust system specs",
      "Structural engineer review for chipping/coring impact",
      "Fire safety & sprinkler coverage verification",
      "Forward approved plans to QS Team for fee assessment"
    ]
  },
  {
    step: 5,
    title: "Step 5: Fee Assessment & Order of Payment",
    sla: "3 Working Days",
    role: "PMO & QS Team",
    desc: "PMO computes applicable Plans Review Fee (₱20k), Monthly Monitoring Fee (₱5k), and required Construction Cash Bond (₱50k or 20%), then issues Order of Payment.",
    checklist: [
      "Plans Review Fee computation (₱20,000/unit)",
      "Monitoring Fee calculation (₱5,000/month)",
      "Construction Cash Bond evaluation (Max of ₱50k or 20%)",
      "Issuance of official Order of Payment"
    ]
  },
  {
    step: 6,
    title: "Step 6: Fee Payment & Release of Documents",
    sla: "1 Working Day",
    role: "PMO Finance → Applicant",
    desc: "Applicant settles all fees at PMO Accounting Office (2nd Floor, Mon-Fri 9am-3pm). PMO releases stamped approved plans and signed Approval Form.",
    checklist: [
      "Payment settlement at PMO Accounting",
      "Official Receipt issuance",
      "Release of stamped 'For Work Permit' A3 plan sets"
    ]
  },
  {
    step: 7,
    title: "Step 7: Safety Orientation & Permit Issuance",
    sla: "4 Working Days",
    role: "Building Maintenance → Site",
    desc: "Contractor completes Safety & Building Rules Orientation conducted by BMO. Official Fit-Out Work Permit is issued for door display.",
    checklist: [
      "Contractor safety briefing & rule orientation completed",
      "Worker access passes and ID badges issued",
      "Official Work Permit signed & issued for main door posting",
      "Gate Pass for delivery authorized"
    ]
  }
];

// Compliance Checklist Data
const COMPLIANCE_ITEMS = [
  { id: 'c1', title: 'Four (4) Sets A3 Signed & Sealed Plans', desc: 'PEE, PME, Licensed Structural & Architect stamped', cat: 'Pre-Construction' },
  { id: 'c2', title: 'Plans Review Fee Paid (₱20,000)', desc: 'Settled at PMO Accounting 2nd Floor', cat: 'Pre-Construction' },
  { id: 'c3', title: 'Construction Cash Bond Deposited', desc: '₱50,000 or 20% total cost deposited with PMO', cat: 'Pre-Construction' },
  { id: 'c4', title: 'Heavy-Duty Yellow-Brown Manila Enclosure', desc: 'Perimeter edges sealed with masking tape at frontage', cat: 'Active Fit-Out' },
  { id: 'c5', title: 'Work Permit Posted on Main Unit Door', desc: 'Official permit displayed at all times', cat: 'Active Fit-Out' },
  { id: 'c6', title: '10 lbs HCFC 236 Extinguisher (Green Tank)', desc: '1 extinguisher per 11.4 ft (4m) radius on site', cat: 'Active Fit-Out' },
  { id: 'c7', title: 'Noisy Works Scheduled After 5:00 PM', desc: 'Chipping/drilling strictly between 5PM - 6AM', cat: 'Active Fit-Out' },
  { id: 'c8', title: 'Deliveries Mon-Sat 6:00 PM - 12:00 MN Only', desc: 'Gate pass secured 3 days prior; sand/gravel in sacks', cat: 'Active Fit-Out' },
  { id: 'c9', title: 'Daily Debris Removal Protocol', desc: 'No garbage or construction materials left in corridors overnight', cat: 'Active Fit-Out' },
  { id: 'c10', title: 'Worker Dress Code & Access Badge Pin', desc: 'Company uniform, safety shoes, access pass pinned to upper shirt', cat: 'Active Fit-Out' },
  { id: 'c11', title: 'Four (4) Sets A3 Signed As-Built Plans', desc: 'Submitted within 30 days of completion for bond refund', cat: 'Turnover' },
  { id: 'c12', title: 'Written Final Inspection Sign-off', desc: 'PMO final inspection clear of common area damages', cat: 'Turnover' }
];

// App State
let currentTab = 'overview';
let wizardCurrentStep = 1;
let currentCategoryFilter = 'all';
let checkedChecklistIds = new Set();

// Theme Management System (Light / Dark Mode)
window.initTheme = function() {
  const savedTheme = localStorage.getItem('onecorp_app_theme') || 'dark';
  applyTheme(savedTheme);
};

window.toggleTheme = function() {
  const isLight = document.body.classList.contains('light-theme');
  const newTheme = isLight ? 'dark' : 'light';
  applyTheme(newTheme);
};

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  }
  try {
    localStorage.setItem('onecorp_app_theme', theme);
  } catch (e) {}

  const icon = document.getElementById('theme-toggle-icon');
  const label = document.getElementById('theme-toggle-label');
  if (icon) icon.innerText = theme === 'light' ? '🌙' : '☀️';
  if (label) label.innerText = theme === 'light' ? 'Dark Mode' : 'Light Mode';
}

// Immediate theme execution on script load to prevent flicker
(function() {
  try {
    const savedTheme = localStorage.getItem('onecorp_app_theme');
    if (savedTheme === 'light' && document.body) {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  } catch (e) {}
})();

// Initialize App on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadChecklistState();
  renderWizardStep(1);
  calculateConstructionFees();
  renderGuidelinesSearchResults();
  renderComplianceChecklist();
  renderActiveA4Form();
});

// Tab Switcher
function switchTab(tabId) {
  currentTab = tabId;
  
  // Hide all panels
  const panels = document.querySelectorAll('.tab-panel');
  panels.forEach(panel => panel.classList.remove('active'));
  
  // Deactivate all buttons
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // Show selected panel
  const targetPanel = document.getElementById(`panel-${tabId}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }
  
  // Activate selected button
  const targetBtn = document.getElementById(`tab-btn-${tabId}`);
  if (targetBtn) {
    targetBtn.classList.add('active');
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Construction Fee & Bond Calculator Logic
function calculateConstructionFees() {
  const scopeCost = parseFloat(document.getElementById('calc-scope-cost').value) || 0;
  const durationMonths = parseInt(document.getElementById('calc-duration-months').value) || 1;
  const unitsCount = parseInt(document.getElementById('calc-units-count').value) || 1;
  const impairmentDays = parseInt(document.getElementById('calc-impairment-days').value) || 0;
  
  // Fees calculation
  const reviewFee = 20000 * unitsCount;
  const monitoringFee = 5000 * durationMonths;
  const impairmentFee = 3000 * impairmentDays;
  
  // Bond calculation: ₱50,000 per unit OR 20% of total scope cost, whichever is HIGHER
  const baseBondPerUnit = 50000 * unitsCount;
  const percentBond = scopeCost * 0.20;
  const bondFee = Math.max(baseBondPerUnit, percentBond);
  
  const totalPayment = reviewFee + monitoringFee + impairmentFee + bondFee;
  
  // Update UI
  document.getElementById('res-review-fee').textContent = `₱${reviewFee.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  document.getElementById('res-monitoring-fee').textContent = `₱${monitoringFee.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  document.getElementById('res-impairment-fee').textContent = `₱${impairmentFee.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  document.getElementById('res-bond-fee').textContent = `₱${bondFee.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  document.getElementById('res-total-payment').textContent = `₱${totalPayment.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  document.getElementById('res-refundable-amount').textContent = `₱${bondFee.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
}

// Work Permit Flowchart Wizard Logic
function renderWizardStep(stepNum) {
  wizardCurrentStep = stepNum;
  const stepData = WIZARD_STEPS.find(s => s.step === stepNum);
  if (!stepData) return;
  
  // Update Step Nodes UI
  for (let i = 1; i <= 7; i++) {
    const node = document.getElementById(`step-node-${i}`);
    if (node) {
      node.classList.remove('active', 'completed');
      if (i === stepNum) {
        node.classList.add('active');
      } else if (i < stepNum) {
        node.classList.add('completed');
      }
    }
  }
  
  // Update Progress Bar width
  const progressPercent = ((stepNum - 1) / 6) * 100;
  const progressBar = document.getElementById('wizard-progress-bar');
  if (progressBar) {
    progressBar.style.width = `${progressPercent}%`;
  }
  
  // Update Step Body
  const bodyContainer = document.getElementById('wizard-step-body');
  if (bodyContainer) {
    let checklistHTML = stepData.checklist.map(item => `
      <li style="font-size: 0.875rem; color: var(--text-muted); padding-left: 20px; position: relative; margin-bottom: 6px;">
        <span style="position: absolute; left: 0; color: var(--accent-emerald);">✓</span> ${item}
      </li>
    `).join('');
    
    bodyContainer.innerHTML = `
      <div class="step-detail-title">
        <span>${stepData.title}</span>
        <span class="step-sla-badge">SLA: ${stepData.sla}</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--accent-amber); margin-bottom: 10px; font-weight: 600;">
        Responsible Party: ${stepData.role}
      </p>
      <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">
        ${stepData.desc}
      </p>
      <div style="background-color: rgba(0,0,0,0.3); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px; font-weight: 700;">Required Actions & Deliverables</h4>
        <ul style="list-style: none;">
          ${checklistHTML}
        </ul>
      </div>
    `;
  }
  
  // Update Nav Buttons
  const prevBtn = document.getElementById('wizard-prev-btn');
  const nextBtn = document.getElementById('wizard-next-btn');
  if (prevBtn) prevBtn.disabled = (stepNum === 1);
  if (nextBtn) {
    if (stepNum === 7) {
      nextBtn.textContent = 'Wizard Completed ✓';
      nextBtn.disabled = true;
    } else {
      nextBtn.textContent = 'Next Step';
      nextBtn.disabled = false;
    }
  }
}

function moveWizardStep(direction) {
  const newStep = wizardCurrentStep + direction;
  if (newStep >= 1 && newStep <= 7) {
    renderWizardStep(newStep);
  }
}

function jumpToWizardStep(stepNum) {
  renderWizardStep(stepNum);
}

// Guidelines Search & Filter Logic
function setCategoryFilter(category, btnElement) {
  currentCategoryFilter = category;
  
  const buttons = document.querySelectorAll('.pill-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  
  renderGuidelinesSearchResults();
}

function filterGuidelinesSearch() {
  renderGuidelinesSearchResults();
}

function renderGuidelinesSearchResults() {
  const query = (document.getElementById('guidelines-search-input')?.value || '').toLowerCase().trim();
  const listContainer = document.getElementById('search-results-list');
  const matchCountElem = document.getElementById('search-match-count');
  
  if (!listContainer) return;
  
  let matches = GUIDELINES_KNOWLEDGE_BASE.filter(item => {
    const matchesCategory = (currentCategoryFilter === 'all' || item.category === currentCategoryFilter);
    const matchesQuery = !query || 
      item.title.toLowerCase().includes(query) || 
      item.content.toLowerCase().includes(query) || 
      item.tags.some(tag => tag.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });
  
  if (matchCountElem) {
    matchCountElem.textContent = `Showing ${matches.length} of ${GUIDELINES_KNOWLEDGE_BASE.length} Rules`;
  }
  
  if (matches.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text-dim); font-size: 0.875rem;">
        No guidelines found matching "${query}". Try searching for terms like "PPR", "wire", "noise", or "bond".
      </div>
    `;
    return;
  }
  
  listContainer.innerHTML = matches.map(item => `
    <div style="background-color: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px 16px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
        <strong style="font-size: 0.9rem; color: var(--accent-cyan);">${item.title}</strong>
        <span style="font-size: 0.7rem; text-transform: uppercase; background-color: var(--primary-soft); color: var(--primary); padding: 2px 8px; border-radius: var(--radius-full); font-weight: 600;">${item.category}</span>
      </div>
      <p style="font-size: 0.825rem; color: var(--text-muted); margin: 0; line-height: 1.4;">
        ${item.content}
      </p>
    </div>
  `).join('');
}

// Compliance Checklist Logic & LocalStorage Persistence
function loadChecklistState() {
  try {
    const saved = localStorage.getItem('vkb_construction_checklist');
    if (saved) {
      checkedChecklistIds = new Set(JSON.parse(saved));
    }
  } catch (e) {
    console.error('Error loading checklist state', e);
  }
}

function saveChecklistState() {
  try {
    localStorage.setItem('vkb_construction_checklist', JSON.stringify(Array.from(checkedChecklistIds)));
  } catch (e) {
    console.error('Error saving checklist state', e);
  }
}

function toggleChecklistItem(id) {
  if (checkedChecklistIds.has(id)) {
    checkedChecklistIds.delete(id);
  } else {
    checkedChecklistIds.add(id);
  }
  saveChecklistState();
  renderComplianceChecklist();
}

function resetComplianceChecklist() {
  checkedChecklistIds.clear();
  saveChecklistState();
  renderComplianceChecklist();
}

function renderComplianceChecklist() {
  const container = document.getElementById('checklist-items-wrapper');
  const progressText = document.getElementById('checklist-progress-text');
  const progressBar = document.getElementById('checklist-progress-bar');
  
  if (!container) return;
  
  const total = COMPLIANCE_ITEMS.length;
  const completedCount = checkedChecklistIds.size;
  const percent = Math.round((completedCount / total) * 100);
  
  if (progressText) progressText.textContent = `${completedCount} / ${total} (${percent}%)`;
  if (progressBar) progressBar.style.width = `${percent}%`;
  
  container.innerHTML = COMPLIANCE_ITEMS.map(item => {
    const isChecked = checkedChecklistIds.has(item.id);
    return `
      <div class="check-item ${isChecked ? 'completed' : ''}" onclick="toggleChecklistItem('${item.id}')">
        <input type="checkbox" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); toggleChecklistItem('${item.id}')">
        <div class="check-text-content">
          <div class="check-title">${item.title}</div>
          <div class="check-desc">${item.desc}</div>
        </div>
        <span style="font-size: 0.7rem; background-color: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: var(--radius-sm); color: var(--text-dim); font-weight: 600;">${item.cat}</span>
      </div>
    `;
  }).join('');
}

// Modal Handlers
function openWorkPermitModal() {
  const modal = document.getElementById('work-permit-modal');
  if (modal) modal.classList.add('active');
}

function closeWorkPermitModal() {
  const modal = document.getElementById('work-permit-modal');
  if (modal) modal.classList.remove('active');
}

function generatePermitPrintView() {
  const unit = document.getElementById('permit-unit-no').value;
  const owner = document.getElementById('permit-owner-name').value;
  const contractor = document.getElementById('permit-contractor-name').value;
  const scope = document.getElementById('permit-scope').value;
  const dates = document.getElementById('permit-dates').value;
  
  closeWorkPermitModal();
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>FIT-OUT WORK PERMIT DRAFT - ${unit}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #000; line-height: 1.5; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
        .header p { margin: 4px 0; font-size: 13px; }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .field-box { border: 1px solid #999; padding: 10px; }
        .field-label { font-size: 11px; text-transform: uppercase; color: #555; font-weight: bold; }
        .field-val { font-size: 14px; font-weight: bold; margin-top: 4px; }
        .rules-list { font-size: 12px; margin-bottom: 30px; }
        .sig-section { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 40px; }
        .sig-box { text-align: center; border-top: 1px solid #000; padding-top: 5px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>ONE CORPORATE CONDOMINIUM CORPORATION</h1>
        <p>45 North Drive, Engineers Hill, Baguio City | Property Management Office</p>
        <h2>OFFICIAL FIT-OUT WORK PERMIT (DRAFT)</h2>
      </div>

      <div class="field-grid">
        <div class="field-box"><div class="field-label">Unit Location</div><div class="field-val">${unit}</div></div>
        <div class="field-box"><div class="field-label">Fit-Out Schedule</div><div class="field-val">${dates}</div></div>
        <div class="field-box"><div class="field-label">Unit Owner / Lessee</div><div class="field-val">${owner}</div></div>
        <div class="field-box"><div class="field-label">Appointed Contractor</div><div class="field-val">${contractor}</div></div>
      </div>

      <div class="field-box" style="margin-bottom: 20px;">
        <div class="field-label">Authorized Scope of Works</div>
        <div class="field-val">${scope}</div>
      </div>

      <div class="rules-list">
        <strong>MANDATORY WORK CONDITIONS & BUILDING RULES:</strong>
        <ul>
          <li>This permit MUST be posted on the main door of the unit at all times during construction.</li>
          <li>Deliveries & Debris pull-out: Mon-Sat, 6:00 PM to 12:00 MN ONLY. No Sunday/Holiday deliveries.</li>
          <li>Noisy works restricted to 5:00 PM to 6:00 AM unless an approved Noise Control Plan is in place.</li>
          <li>At least 1 unit 10 lbs HCFC 236 FA portable fire extinguisher (green tank) per 11.4ft radius required on site.</li>
        </ul>
      </div>

      <div class="sig-section">
        <div class="sig-box">Unit Owner Signature</div>
        <div class="sig-box">Contractor Representative</div>
        <div class="sig-box">Property Manager Approval</div>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}


// ==================== BM CONSTRUCTION FORMS (A4 SIZE 15MM MARGIN) ====================
let currentA4FormKey = 'f1_renovation';

function selectA4Form(formKey) {
  currentA4FormKey = formKey;
  renderActiveA4Form();
}

function renderActiveA4Form() {
  const container = document.getElementById('active-a4-form-container');
  if (!container) return;

  switch (currentA4FormKey) {
    case 'f1_renovation':
      container.innerHTML = get_f1_renovation_HTML();
      break;
    case 'f2_appointment':
      container.innerHTML = get_f2_appointment_HTML();
      break;
    case 'f3_specimen':
      container.innerHTML = get_f3_specimen_HTML();
      break;
    case 'f4_workpermit_major':
      container.innerHTML = get_f4_workpermit_major_HTML();
      break;
    case 'f5_workpermit_minor':
      container.innerHTML = get_f5_workpermit_minor_HTML();
      break;
    case 'f6_gatepass':
      container.innerHTML = get_f6_gatepass_HTML();
      break;
    case 'f7_punchlist':
      container.innerHTML = get_f7_punchlist_HTML();
      break;
    case 'f8_concern':
      container.innerHTML = get_f8_concern_HTML();
      break;
    case 'f9_clearance':
      container.innerHTML = get_f9_clearance_HTML();
      break;
    default:
      container.innerHTML = get_f1_renovation_HTML();
  }
}

function printActiveA4Form() {
  window.print();
}

function autofillSampleFormData() {
  const inputs = document.querySelectorAll('#active-a4-form-container input[type="text"]');
  const sampleValues = [
    'Unit 402', 'August 01, 2026', 'John Doe', 'Apex Fit-Out Corp',
    '₱250,000.00', '0917-555-0199', 'john.doe@example.com', 'Engr. Mike Smith'
  ];
  inputs.forEach((input, idx) => {
    if (!input.value) {
      input.value = sampleValues[idx % sampleValues.length];
    }
  });
  
  const checkboxes = document.querySelectorAll('#active-a4-form-container input[type="checkbox"]');
  checkboxes.forEach((cb, idx) => {
    if (idx % 2 === 0) cb.checked = true;
  });
}

function getFormHeaderHTML(docCode, revNo, effDate, titleText) {
  return `
    <table class="form-hdr-table">
      <tr>
        <td style="width: 32%;">
          <div class="form-hdr-logo-box">
            <img src="forms/images/LOGO.jpg" alt="Logo" class="main-logo" style="height:44px;">
            <img src="forms/images/iso.png" alt="ISO" class="badge-logo" style="height:36px;">
            <img src="forms/images/dqs.png" alt="DQS" class="badge-logo" style="height:36px;">
          </div>
        </td>
        <td style="width: 43%; text-align: center;">
          <div class="form-hdr-title-box">
            <h3>ONE CORPORATE CONDOMINIUM</h3>
            <p>45 North Drive, Engineers Hill, Baguio City | Property Management Office</p>
          </div>
        </td>
        <td style="width: 25%; padding: 0;">
          <table class="form-meta-subtable">
            <tr><td><strong>Doc code:</strong></td><td>${docCode}</td></tr>
            <tr><td><strong>Rev. no.:</strong></td><td>${revNo}</td></tr>
            <tr><td><strong>Eff. Date:</strong></td><td>${effDate}</td></tr>
            <tr><td><strong>Page:</strong></td><td>1 of 1</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <div class="form-title-banner">${titleText}</div>
  `;
}

// Form 1: Fit-Out Application (FM-OCT-PMO-09)
function get_f1_renovation_HTML() {
  return getFormHeaderHTML('FM-OCT-PMO-09', '0', '9-Jun-25', 'APPLICATION FOR CONSTRUCTION, RENOVATION, AND REPAIR WORKS OF INDIVIDUAL UNITS') + `
    <div style="margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span><strong>Date:</strong> <input type="text" class="a4-input" style="width: 140px;" value="${new Date().toLocaleDateString()}"></span>
        <span><strong>Tower / Unit No.:</strong> <input type="text" class="a4-input" style="width: 140px;" value="Unit 402"></span>
      </div>
      <p style="margin-bottom: 8px;">
        This is to inform the Property Management Office that I, 
        <input type="text" class="a4-input" style="width: 200px;" placeholder="Unit Owner / Tenant Name"> 
        of Building <strong>One Corporate</strong>, Unit <input type="text" class="a4-input" style="width: 80px;" value="402"> 
        will be performing fit-out, renovation, and repair work/s inside my unit.
      </p>
    </div>

    <div style="border: 1px solid #000; padding: 8px; margin-bottom: 12px; background-color: #fafafa;">
      <strong style="display: block; margin-bottom: 6px;">Submittal of Construction Drawings (Four 4 Sets A3 Signed & Sealed):</strong>
      <div class="a4-check-group">
        <label class="a4-check-item"><input type="checkbox" checked> Architectural Plans</label>
        <label class="a4-check-item"><input type="checkbox" checked> Electrical Plans & Load Computations (PEE)</label>
        <label class="a4-check-item"><input type="checkbox" checked> Mechanical & A/C Plans (PME)</label>
        <label class="a4-check-item"><input type="checkbox" checked> Sanitary & Plumbing Plans</label>
        <label class="a4-check-item"><input type="checkbox" checked> Fire Protection Equipment Plan</label>
        <label class="a4-check-item"><input type="checkbox"> Communication Plan / Telephone Layout</label>
        <label class="a4-check-item"><input type="checkbox"> Structural Design Analysis</label>
      </div>
    </div>

    <div style="border: 1px solid #000; padding: 8px; margin-bottom: 14px; font-size: 9.5px;">
      <strong>UNDERTAKING & BOND AGREEMENT:</strong>
      <p style="margin-top: 4px;">
        I agree to submit a monetary Construction Cash Bond of ₱50,000.00 (or 20% of total scope cost) and pay the ₱20,000.00 Plans Review Fee prior to commencement of work. 
        I hereby accept full responsibility for all acts, omissions, damages, or violations committed by my appointed contractor, workers, and agents during the fit-out period in accordance with the 2024 General Construction Guidelines.
      </p>
    </div>

    <div class="a4-sig-grid" style="margin-top: 30px;">
      <div class="a4-sig-box">
        <input type="text" class="a4-input" style="text-align: center;" placeholder="Unit Owner / Tenant">
        <div class="a4-sig-line">Unit Owner / Tenant</div>
        <div class="a4-sig-sub">Signature over Printed Name / Date</div>
      </div>
      <div class="a4-sig-box">
        <input type="text" class="a4-input" style="text-align: center;" placeholder="Appointed Contractor">
        <div class="a4-sig-line">Authorized Contractor</div>
        <div class="a4-sig-sub">Signature over Printed Name / Date</div>
      </div>
      <div class="a4-sig-box">
        <div class="a4-sig-line" style="margin-top: 38px;">Building Maintenance</div>
        <div class="a4-sig-sub">BMO Review & Endorsement</div>
      </div>
      <div class="a4-sig-box">
        <div class="a4-sig-line" style="margin-top: 38px;">Technical Engineering (FCLDC)</div>
        <div class="a4-sig-sub">Technical Services Approval</div>
      </div>
    </div>
  `;
}

// Form 2: Appointment Letter of Contractor
function get_f2_appointment_HTML() {
  return getFormHeaderHTML('FM-OCT-PMO-10', '0', '9-Jun-25', 'APPOINTMENT LETTER OF CONTRACTOR') + `
    <div style="margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span><strong>Date:</strong> <input type="text" class="a4-input" style="width: 140px;" value="${new Date().toLocaleDateString()}"></span>
        <span><strong>Unit No.:</strong> <input type="text" class="a4-input" style="width: 120px;" value="Unit 402"></span>
      </div>
      <p style="margin-bottom: 10px;"><strong>TO:</strong> Property Management Office, One Corporate Condominium</p>
      <p style="margin-bottom: 12px;">
        This is to formally notify the PMO that I, <input type="text" class="a4-input" style="width: 220px;" placeholder="Unit Owner / Lessee Name">, 
        owner/tenant of Unit <input type="text" class="a4-input" style="width: 80px;" value="402">, have officially appointed the following contractor to perform fit-out / renovation works:
      </p>
    </div>

    <table class="a4-grid-table" style="margin-bottom: 14px;">
      <tr>
        <th style="width: 30%; text-align: left;">Contractor Firm Name:</th>
        <td><input type="text" class="a4-input" placeholder="e.g. Apex Fit-Out & Builders Corp"></td>
      </tr>
      <tr>
        <th style="text-align: left;">Business Office Address:</th>
        <td><input type="text" class="a4-input" placeholder="e.g. Session Road, Baguio City"></td>
      </tr>
      <tr>
        <th style="text-align: left;">Contact Person / Telephone:</th>
        <td><input type="text" class="a4-input" placeholder="e.g. Engr. Mike Smith / 0917-555-0199"></td>
      </tr>
      <tr>
        <th style="text-align: left;">Project Manager / Engineer:</th>
        <td><input type="text" class="a4-input" placeholder="e.g. Arch. Sarah Jenkins"></td>
      </tr>
      <tr>
        <th style="text-align: left;">Detailed Scope of Work:</th>
        <td><input type="text" class="a4-input" placeholder="Drywall partitioning, electrical wiring, plumbing fixtures, A/C installation"></td>
      </tr>
    </table>

    <p style="font-size: 9.5px; margin-bottom: 20px;">
      The appointed contractor has been fully briefed on the <strong>One Corporate General Construction Guidelines (2024)</strong> 
      and agrees to adhere to all work schedules (Deliveries 6PM-12MN, Noisy works 5PM-6AM), safety precautions, and debris cleanup requirements.
    </p>

    <div class="a4-sig-grid" style="margin-top: 36px;">
      <div class="a4-sig-box">
        <div class="a4-sig-line">Unit Owner / Tenant</div>
        <div class="a4-sig-sub">Signature over Printed Name</div>
      </div>
      <div class="a4-sig-box">
        <div class="a4-sig-line">Appointed Contractor Representative</div>
        <div class="a4-sig-sub">Signature over Printed Name & Stamp</div>
      </div>
      <div class="a4-sig-box">
        <div class="a4-sig-line">Building Maintenance Manager</div>
        <div class="a4-sig-sub">Recommendation & Acceptance</div>
      </div>
    </div>
  `;
}

// Form 3: Specimen Signature Sheet (FM-OCT-PMO)
function get_f3_specimen_HTML() {
  return getFormHeaderHTML('FM-OCT-PMO', '0', '29-Jan-26', 'SPECIMEN SIGNATURE SHEET') + `
    <div style="margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span><strong>Unit Owner/Tenant Name:</strong> <input type="text" class="a4-input" style="width: 200px;"></span>
        <span><strong>Unit No.:</strong> <input type="text" class="a4-input" style="width: 100px;" value="Unit 402"></span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span><strong>Building Level:</strong> <input type="text" class="a4-input" style="width: 120px;" value="4th Floor"></span>
        <span><strong>Date:</strong> <input type="text" class="a4-input" style="width: 120px;" value="${new Date().toLocaleDateString()}"></span>
      </div>
      <p style="font-size: 9.5px; margin-bottom: 8px;">
        This is to authorize the following persons to sign on my behalf for Work Permits, Gate Passes, Delivery & Pull-out of equipment/materials for our unit.
      </p>
    </div>

    <table class="a4-grid-table" style="margin-bottom: 12px;">
      <thead>
        <tr>
          <th style="width: 6%;">#</th>
          <th style="width: 28%;">Printed Name</th>
          <th style="width: 20%;">Position</th>
          <th style="width: 22%;">Contact Number</th>
          <th style="width: 24%;">Specimen Signature</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="text-align:center;">1</td><td><input type="text" class="a4-input"></td><td><input type="text" class="a4-input" value="Project Manager"></td><td><input type="text" class="a4-input"></td><td></td></tr>
        <tr><td style="text-align:center;">2</td><td><input type="text" class="a4-input"></td><td><input type="text" class="a4-input" value="Site Engineer"></td><td><input type="text" class="a4-input"></td><td></td></tr>
        <tr><td style="text-align:center;">3</td><td><input type="text" class="a4-input"></td><td><input type="text" class="a4-input" value="Contractor Supervisor"></td><td><input type="text" class="a4-input"></td><td></td></tr>
        <tr><td style="text-align:center;">4</td><td><input type="text" class="a4-input"></td><td><input type="text" class="a4-input" value="Safety Officer"></td><td><input type="text" class="a4-input"></td><td></td></tr>
      </tbody>
    </table>

    <p style="font-size: 8.5px; color: #444; margin-bottom: 16px;">
      * Note: It is the responsibility of the unit owner/tenant to inform the Property Management Office in writing regarding any changes in authorized signatories.
    </p>

    <div class="a4-sig-grid" style="margin-top: 30px;">
      <div class="a4-sig-box">
        <div class="a4-sig-line">Unit Owner / Tenant</div>
        <div class="a4-sig-sub">Signature over Printed Name / Date</div>
      </div>
      <div class="a4-sig-box">
        <div class="a4-sig-line">Building Maintenance Office</div>
        <div class="a4-sig-sub">Verification & Signature</div>
      </div>
      <div class="a4-sig-box">
        <div class="a4-sig-line">Property Management Office</div>
        <div class="a4-sig-sub">Approval & Recording</div>
      </div>
    </div>
  `;
}

// Form 4: Fit-Out Work Permit Major (FM-OCT-CON-05)
function get_f4_workpermit_major_HTML() {
  return getFormHeaderHTML('FM-OCT-CON-05', '0', '9-Jun-25', 'FIT-OUT WORK PERMIT (MAJOR FIT-OUT & ALTERATION WORKS)') + `
    <table class="a4-grid-table" style="margin-bottom: 8px;">
      <tr>
        <th style="width: 15%; text-align: left;">Applicant:</th>
        <td style="width: 35%;"><input type="text" class="a4-input"></td>
        <th style="width: 15%; text-align: left;">Unit No.:</th>
        <td style="width: 35%;"><input type="text" class="a4-input" value="Unit 402"></td>
      </tr>
      <tr>
        <th style="text-align: left;">Contractor:</th>
        <td><input type="text" class="a4-input"></td>
        <th style="text-align: left;">Work Order No.:</th>
        <td><input type="text" class="a4-input" value="WO-2026-088"></td>
      </tr>
      <tr>
        <th style="text-align: left;">Person-in-charge:</th>
        <td><input type="text" class="a4-input"></td>
        <th style="text-align: left;">Telephone No.:</th>
        <td><input type="text" class="a4-input"></td>
      </tr>
    </table>

    <div style="border: 1px solid #000; padding: 6px; margin-bottom: 8px; font-size: 9.5px;">
      <strong>Nature of Work (Check all applicable):</strong>
      <div class="a4-check-group" style="margin-top: 4px;">
        <label class="a4-check-item"><input type="checkbox" checked> Electrical</label>
        <label class="a4-check-item"><input type="checkbox" checked> Mechanical / HVAC</label>
        <label class="a4-check-item"><input type="checkbox" checked> Plumbing</label>
        <label class="a4-check-item"><input type="checkbox" checked> Carpentry / Drywall</label>
        <label class="a4-check-item"><input type="checkbox"> Painting</label>
        <label class="a4-check-item"><input type="checkbox"> Civil Works</label>
      </div>
    </div>

    <table class="a4-grid-table" style="margin-bottom: 8px;">
      <thead>
        <tr><th colspan="4">Authorized Personnel List</th></tr>
        <tr><th style="width: 35%;">Worker Name</th><th style="width: 35%;">Work Description</th><th style="width: 15%;">Start</th><th style="width: 15%;">End</th></tr>
      </thead>
      <tbody>
        <tr><td><input type="text" class="a4-input"></td><td><input type="text" class="a4-input"></td><td>8:00 AM</td><td>5:00 PM</td></tr>
        <tr><td><input type="text" class="a4-input"></td><td><input type="text" class="a4-input"></td><td>8:00 AM</td><td>5:00 PM</td></tr>
        <tr><td><input type="text" class="a4-input"></td><td><input type="text" class="a4-input"></td><td>8:00 AM</td><td>5:00 PM</td></tr>
      </tbody>
    </table>

    <div style="font-size: 8.5px; border: 1px solid #000; padding: 6px; margin-bottom: 10px;">
      <strong>TERMS & CONDITIONS:</strong> 1. Permit must be posted on unit door. 2. Deliveries/Debris pull-out: Mon-Sat 6PM-12MN ONLY. 3. Noisy works restricted to 5PM-6AM. 4. Must provide 1 unit 10 lbs HCFC 236 extinguisher per 11.4ft radius. 5. Workers must wear ID access passes and proper attire (no slippers/shorts).
    </div>

    <div class="a4-sig-grid" style="margin-top: 16px;">
      <div class="a4-sig-box"><div class="a4-sig-line">Prepared By</div><div class="a4-sig-sub">Applicant / Contractor</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Endorsed By</div><div class="a4-sig-sub">Building Maintenance</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Reviewed By</div><div class="a4-sig-sub">Technical Engineering</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Approved By</div><div class="a4-sig-sub">PMO / Engr. Roan Paul Gallegos</div></div>
    </div>
  `;
}

// Form 5: Work Permit Minor Works
function get_f5_workpermit_minor_HTML() {
  return getFormHeaderHTML('FM-OCT-CON-06', '0', '9-Jun-25', 'WORK PERMIT (MINOR MAINTENANCE & REPAIR WORKS)') + `
    <table class="a4-grid-table" style="margin-bottom: 10px;">
      <tr>
        <th style="width: 18%; text-align: left;">Applicant Name:</th>
        <td><input type="text" class="a4-input"></td>
        <th style="width: 15%; text-align: left;">Unit No.:</th>
        <td><input type="text" class="a4-input" value="Unit 402"></td>
      </tr>
      <tr>
        <th style="text-align: left;">Date of Work:</th>
        <td><input type="text" class="a4-input" value="${new Date().toLocaleDateString()}"></td>
        <th style="text-align: left;">Time Window:</th>
        <td><input type="text" class="a4-input" value="09:00 AM - 04:00 PM"></td>
      </tr>
    </table>

    <div style="border: 1px solid #000; padding: 8px; margin-bottom: 12px;">
      <strong>Work Category (Check all applicable):</strong>
      <div class="a4-check-group" style="margin-top: 4px;">
        <label class="a4-check-item"><input type="checkbox" checked> Electrical Light Fix</label>
        <label class="a4-check-item"><input type="checkbox"> Plumbing Faucet Check</label>
        <label class="a4-check-item"><input type="checkbox"> A/C Filter Service</label>
        <label class="a4-check-item"><input type="checkbox"> Minor Painting Touchup</label>
        <label class="a4-check-item"><input type="checkbox"> Door Lock Repair</label>
      </div>
    </div>

    <div style="border: 1px solid #000; padding: 8px; margin-bottom: 14px; background-color: #fafafa;">
      <strong>TO BE FILLED-UP BY INSPECTOR:</strong>
      <p style="margin: 4px 0;">Inspection Date: <input type="text" class="a4-input" style="width: 120px;"> | Comments: <input type="text" class="a4-input" style="width: 300px;"></p>
    </div>

    <div class="a4-sig-grid" style="margin-top: 30px;">
      <div class="a4-sig-box"><div class="a4-sig-line">Prepared By</div><div class="a4-sig-sub">Applicant Signature</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Endorsed By</div><div class="a4-sig-sub">Building Inspector</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Issued By</div><div class="a4-sig-sub">Building Maintenance</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Approved By</div><div class="a4-sig-sub">Property Manager</div></div>
    </div>
  `;
}

// Form 6: Gate Pass Form (FM-OCT-PMO-05)
function get_f6_gatepass_HTML() {
  return getFormHeaderHTML('FM-OCT-PMO-05', '0', '9-Jun-25', 'GATE PASS FORM (MATERIALS DELIVERY / PULL-OUT)') + `
    <table class="a4-grid-table" style="margin-bottom: 10px;">
      <tr>
        <th style="width: 15%; text-align: left;">Control No.:</th>
        <td><input type="text" class="a4-input" value="GP-2026-042"></td>
        <th style="width: 18%; text-align: left;">Application Date:</th>
        <td><input type="text" class="a4-input" value="${new Date().toLocaleDateString()}"></td>
      </tr>
      <tr>
        <th style="text-align: left;">Tower & Unit:</th>
        <td><input type="text" class="a4-input" value="Unit 402"></td>
        <th style="text-align: left;">Applicant Type:</th>
        <td>
          <label class="a4-check-item"><input type="checkbox" checked> Delivery</label> 
          <label class="a4-check-item"><input type="checkbox"> Pull Out</label>
        </td>
      </tr>
      <tr>
        <th style="text-align: left;">Carrier Name:</th>
        <td><input type="text" class="a4-input" placeholder="Driver / Trucking Name"></td>
        <th style="text-align: left;">Delivery Schedule:</th>
        <td>Mon-Sat: 6:00 PM - 12:00 MN</td>
      </tr>
    </table>

    <table class="a4-grid-table" style="margin-bottom: 12px;">
      <thead>
        <tr><th style="width: 6%;">NO.</th><th style="width: 10%;">QNTY</th><th style="width: 32%;">DELIVERY ITEM/S</th><th style="width: 32%;">PULL OUT ITEM/S</th><th style="width: 20%;">REMARKS</th></tr>
      </thead>
      <tbody>
        <tr><td style="text-align:center;">1</td><td><input type="text" class="a4-input" value="10 sacks"></td><td>Cement & Sand (Sacked)</td><td>-</td><td>Good condition</td></tr>
        <tr><td style="text-align:center;">2</td><td><input type="text" class="a4-input" value="20 pcs"></td><td>Gypsum Boards 12mm</td><td>-</td><td>Fire resistive</td></tr>
        <tr><td style="text-align:center;">3</td><td><input type="text" class="a4-input" value="5 rolls"></td><td>PPR Pipes PN-20</td><td>-</td><td>White color</td></tr>
        <tr><td style="text-align:center;">4</td><td><input type="text" class="a4-input" value="1 box"></td><td>3.5mm² THHN Wire</td><td>-</td><td>Phelps Dodge</td></tr>
      </tbody>
    </table>

    <div style="font-size: 8.5px; border: 1px solid #000; padding: 6px; margin-bottom: 14px;">
      * Gate Pass must be signed and secured 3 days prior to delivery. Delivery schedule strictly 6:00 PM to 12:00 MN. Sacked aggregates required.
    </div>

    <div class="a4-sig-grid" style="margin-top: 24px;">
      <div class="a4-sig-box"><div class="a4-sig-line">Requested By</div><div class="a4-sig-sub">Applicant Signature</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Authorized By</div><div class="a4-sig-sub">Unit Owner / Tenant</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Issued By</div><div class="a4-sig-sub">Building Maintenance</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Approved By</div><div class="a4-sig-sub">PMO Office</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Verified By</div><div class="a4-sig-sub">Guard on Duty</div></div>
    </div>
  `;
}

// Form 7: Punch List Form (FM-OCT-PMO-13)
function get_f7_punchlist_HTML() {
  return getFormHeaderHTML('FM-OCT-PMO-13', '0', 'August 15, 2025', 'PUNCH LIST FORM') + `
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
      <span><strong>Unit Owner Name:</strong> <input type="text" class="a4-input" style="width: 180px;"></span>
      <span><strong>Unit Number:</strong> <input type="text" class="a4-input" style="width: 100px;" value="Unit 402"></span>
      <span><strong>Date:</strong> <input type="text" class="a4-input" style="width: 100px;" value="${new Date().toLocaleDateString()}"></span>
    </div>

    <table class="a4-grid-table" style="margin-bottom: 12px;">
      <thead>
        <tr><th style="width: 6%;">#</th><th style="width: 54%;">Items for Rectification</th><th style="width: 40%;">Remarks / Action Status</th></tr>
      </thead>
      <tbody>
        <tr><td style="text-align:center;">1</td><td><input type="text" class="a4-input" value="Paint touchup on east drywall joint"></td><td><input type="text" class="a4-input" value="Contractor to fix by Aug 05"></td></tr>
        <tr><td style="text-align:center;">2</td><td><input type="text" class="a4-input" value="Re-align ceiling LED fixture cover"></td><td><input type="text" class="a4-input" value="Pending re-alignment"></td></tr>
        <tr><td style="text-align:center;">3</td><td><input type="text" class="a4-input" value="Clean paint drops on hallway tile threshold"></td><td><input type="text" class="a4-input" value="Scheduled for cleaning"></td></tr>
      </tbody>
    </table>

    <div class="a4-sig-grid" style="margin-top: 36px;">
      <div class="a4-sig-box"><div class="a4-sig-line">Contractor Rep</div><div class="a4-sig-sub">Inspected / Rectified</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Building Maintenance</div><div class="a4-sig-sub">Technical Verification</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Unit Owner Acceptance</div><div class="a4-sig-sub">Final Acceptance Sign-off</div></div>
    </div>
  `;
}

// Form 8: Concern Close-Out Form (FM-OCT-CON-02)
function get_f8_concern_HTML() {
  return getFormHeaderHTML('FM-OCT-CON-02', '0', '9-Jun-25', 'CONCERN ASSESSMENT, RESOLUTION & CLOSE-OUT FORM') + `
    <table class="a4-grid-table" style="margin-bottom: 10px;">
      <tr>
        <th style="width: 18%; text-align: left;">Unit Owner / Tenant:</th>
        <td><input type="text" class="a4-input"></td>
        <th style="width: 15%; text-align: left;">Unit No.:</th>
        <td><input type="text" class="a4-input" value="Unit 402"></td>
      </tr>
      <tr>
        <th style="text-align: left;">Contact No.:</th>
        <td><input type="text" class="a4-input"></td>
        <th style="text-align: left;">Date Reported:</th>
        <td><input type="text" class="a4-input" value="${new Date().toLocaleDateString()}"></td>
      </tr>
    </table>

    <div style="border: 1px solid #000; padding: 8px; margin-bottom: 10px;">
      <strong>Details of Concern / Issue Reported:</strong>
      <input type="text" class="a4-input" style="margin-top: 4px;" placeholder="e.g. Minor water seepage at sink PPR elbow joint">
    </div>

    <div style="border: 1px solid #000; padding: 8px; margin-bottom: 12px; background-color: #fafafa;">
      <strong>ACTION TAKEN & RESOLUTION (BMO):</strong>
      <p style="margin: 4px 0;">Findings: <input type="text" class="a4-input" style="width: 80%;"></p>
      <p style="margin: 4px 0;">Action Taken: <input type="text" class="a4-input" style="width: 78%;"></p>
      <p style="margin: 4px 0;">Date Completed: <input type="text" class="a4-input" style="width: 140px;"> | Person Assigned: <input type="text" class="a4-input" style="width: 180px;"></p>
    </div>

    <div style="border: 1px solid #000; padding: 8px; margin-bottom: 14px;">
      <strong>CUSTOMER SERVICE RATING:</strong>
      <div class="a4-check-group" style="margin-top: 4px;">
        <span>1) Job Knowledge: <label class="a4-check-item"><input type="checkbox" checked> Satisfied</label> <label class="a4-check-item"><input type="checkbox"> Fair</label></span>
        <span>2) Grooming: <label class="a4-check-item"><input type="checkbox" checked> Satisfied</label> <label class="a4-check-item"><input type="checkbox"> Fair</label></span>
        <span>3) Courteousness: <label class="a4-check-item"><input type="checkbox" checked> Satisfied</label> <label class="a4-check-item"><input type="checkbox"> Fair</label></span>
      </div>
    </div>

    <div class="a4-sig-grid" style="margin-top: 24px;">
      <div class="a4-sig-box"><div class="a4-sig-line">Unit Owner / Tenant</div><div class="a4-sig-sub">Signature & Close-Out Sign-off</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Inspected By</div><div class="a4-sig-sub">BMO Representative</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Noted By</div><div class="a4-sig-sub">Property Manager</div></div>
    </div>
  `;
}

// Form 9: Clearance Certificate (FM-OCT-BM-08)
function get_f9_clearance_HTML() {
  return getFormHeaderHTML('FM-OCT-BM-08', '0', '13-May-26', 'CLEARANCE CERTIFICATE') + `
    <table class="a4-grid-table" style="margin-bottom: 10px;">
      <tr>
        <th style="width: 15%; text-align: left;">Permit #:</th>
        <td><input type="text" class="a4-input" value="WP-2026-088"></td>
        <th style="width: 15%; text-align: left;">Level:</th>
        <td><input type="text" class="a4-input" value="4th Floor"></td>
        <th style="width: 15%; text-align: left;">Date:</th>
        <td><input type="text" class="a4-input" value="${new Date().toLocaleDateString()}"></td>
      </tr>
      <tr>
        <th style="text-align: left;">Unit Owner:</th>
        <td colspan="3"><input type="text" class="a4-input"></td>
        <th style="text-align: left;">Unit No.:</th>
        <td><input type="text" class="a4-input" value="Unit 402"></td>
      </tr>
      <tr>
        <th style="text-align: left;">Contractor:</th>
        <td colspan="5"><input type="text" class="a4-input"></td>
      </tr>
    </table>

    <div style="border: 1px solid #000; padding: 8px; margin-bottom: 12px; background-color: #fafafa;">
      <strong>TECHNICAL CLEARANCE CHECKLIST:</strong>
      <div class="a4-check-group" style="margin-top: 4px;">
        <label class="a4-check-item"><input type="checkbox" checked> Architectural Layout Cleared</label>
        <label class="a4-check-item"><input type="checkbox" checked> Electrical Load Schedule Cleared</label>
        <label class="a4-check-item"><input type="checkbox" checked> Mechanical & A/C Specs Cleared</label>
        <label class="a4-check-item"><input type="checkbox" checked> Plumbing & Sanitary Cleared</label>
        <label class="a4-check-item"><input type="checkbox" checked> Structural Integrity Cleared</label>
      </div>
    </div>

    <div style="border: 1px solid #000; padding: 8px; margin-bottom: 16px; font-size: 9.5px;">
      <strong>OFFICIAL CERTIFICATION:</strong>
      <p style="margin-top: 4px;">
        This is to certify that the above unit owner/tenant has fully complied with all General Construction Guidelines of One Corporate for their fit-out plans. Clearance is hereby granted for fit-out implementation.
      </p>
    </div>

    <div class="a4-sig-grid" style="margin-top: 36px;">
      <div class="a4-sig-box"><div class="a4-sig-line">Property Management Office</div><div class="a4-sig-sub">Reviewed By</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">FCLDC Building Maintenance</div><div class="a4-sig-sub">Approved By</div></div>
      <div class="a4-sig-box"><div class="a4-sig-line">Lorraine Ashley L. Josue</div><div class="a4-sig-sub">OIC / Corporate Secretary</div></div>
    </div>
  `;
}


// ===== ADAPTED FORM HTML FUNCTIONS =====
function get_f10_nov_HTML() {
  return `
    
    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td style="width: 60%; vertical-align: top;">
                <img src="forms/images/LOGO.jpg" alt="ONE CORPORATE Logo" class="logo-img" />
            </td>
            <td style="width: 40%; vertical-align: top;" class="doc-control">
                <table class="doc-control-table">
                    <tr><td><strong>Doc code:</strong></td><td>FM-OCT-PMO-14</td></tr>
                    <tr><td><strong>Rev. no.:</strong></td><td>0</td></tr>
                    <tr><td><strong>Eff. Date:</strong></td><td>9-Jun-25</td></tr>
                    <tr><td><strong>Page:</strong></td><td>1 of 1</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <h1>NOTICE OF VIOLATION (NOV)</h1>

    <!-- Basic Form Info -->
    <div class="form-grid">
        <div class="form-group">
            <label>Work Permit Number:</label>
            <input type="text" class="fillable-line" placeholder="Enter Work Permit No." />
        </div>
        <div class="form-group">
            <label>Reference Number:</label>
            <input type="text" class="fillable-line" placeholder="Enter NOV Ref No." />
        </div>
        <div class="form-group">
            <label>Date Issuance:</label>
            <input type="text" class="fillable-line" placeholder="e.g. DD-MMM-YYYY" />
        </div>
        <div class="form-group">
            <label>Authorized Contractor:</label>
            <input type="text" class="fillable-line" placeholder="Enter Contractor Name" />
        </div>
        <div class="form-group">
            <label>Building / Unit Number:</label>
            <input type="text" class="fillable-line" placeholder="Enter Unit No." />
        </div>
        <div class="form-group">
            <label>Unit Owner / Tenant Name:</label>
            <input type="text" class="fillable-line" placeholder="Enter Owner/Tenant Name" />
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
            <label>Address / Location:</label>
            <input type="text" class="fillable-line" placeholder="Enter Address" />
        </div>
    </div>

    <!-- Nature of Violation -->
    <div class="section-header">NATURE OF VIOLATION (Check all that apply)</div>
    <div class="nature-grid">
        <div>
            <label><input type="checkbox" class="checkbox" /> <strong>• Fire & Life Safety</strong></label>
            <div style="margin-left: 20px; display: flex; flex-direction: column; gap: 6px; margin-top: 5px;">
                <label><input type="checkbox" class="checkbox" /> * Structural</label>
                <label><input type="checkbox" class="checkbox" /> * Architectural</label>
                <label><input type="checkbox" class="checkbox" /> * Sanitary & Plumbing</label>
                <label><input type="checkbox" class="checkbox" /> * Electrical</label>
                <label><input type="checkbox" class="checkbox" /> * Mechanical & Air Conditioning</label>
            </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <label><input type="checkbox" class="checkbox" /> <strong>• Plan Deviation</strong></label>
            <label><input type="checkbox" class="checkbox" /> <strong>• Operational / Conduct Rules</strong></label>
            <label><input type="checkbox" class="checkbox" /> <strong>• Security & ID Access Pass</strong></label>
            <label><input type="checkbox" class="checkbox" /> <strong>• Environmental & Waste Management</strong></label>
            <label style="margin-top: 5px;">
                <input type="checkbox" class="checkbox" /> <strong>• Others:</strong>
                <input type="text" class="fillable-line" style="margin-left: 5px;" placeholder="Specify violation" />
            </label>
        </div>
    </div>

    <!-- Specific Violations Table -->
    <div class="section-header">SPECIFIC VIOLATIONS & REMEDIAL ACTION</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 40%;">Description of Specific Violation(s)</th>
                <th style="width: 30%;">Remedial Action Required</th>
                <th style="width: 15%;">Penalty Amount (PHP)</th>
                <th style="width: 10%;">Due Date</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align: center;">1</td>
                <td><input type="text" class="table-input" placeholder="Enter violation details" /></td>
                <td><input type="text" class="table-input" placeholder="Enter required action" /></td>
                <td><input type="text" class="table-input" style="text-align: right;" placeholder="0.00" /></td>
                <td><input type="text" class="table-input" placeholder="Date" /></td>
            </tr>
            <tr>
                <td style="text-align: center;">2</td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" style="text-align: right;" /></td>
                <td><input type="text" class="table-input" /></td>
            </tr>
            <tr>
                <td style="text-align: center;">3</td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" style="text-align: right;" /></td>
                <td><input type="text" class="table-input" /></td>
            </tr>
        </tbody>
    </table>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; font-size: 13px;">
        <div style="display: flex; align-items: center; gap: 15px;">
            <strong>Fine/Penalty deduction from Construction Cash Bond:</strong>
            <label><input type="checkbox" class="checkbox" /> Yes</label>
            <label><input type="checkbox" class="checkbox" /> No</label>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
            <strong>TOTAL AMOUNT DUE: PHP</strong>
            <input type="text" class="fillable-line" style="width: 140px; font-weight: bold; font-size: 14px; color: #c0392b; text-align: right;" placeholder="0.00" />
        </div>
    </div>

    <!-- Required Action Box -->
    <div class="action-box">
        <label>
            <input type="checkbox" class="checkbox" />
            IMMEDIATE WORK STOPPAGE UNTIL RECTIFIED
        </label>
        <label style="color: #2c3e50; font-weight: normal;">
            <input type="checkbox" class="checkbox" />
            Corrective Action Required by (Date & Time):
            <input type="text" class="fillable-line" style="width: 250px; font-weight: bold;" placeholder="e.g. 25-Jul-2026, 5:00 PM" />
        </label>
    </div>

    <!-- Signatures -->
    <div class="signatures">
        <div class="sign-block">
            <div class="sign-title">Issued / Inspected By:</div>
            <div class="sign-line"></div>
            <div class="sign-name">Building Maintenance Office / PMO</div>
            <div class="sign-label">Signature over Printed name / Date</div>
        </div>
        <div class="sign-block">
            <div class="sign-title">Received / Acknowledged By:</div>
            <div class="sign-line"></div>
            <div class="sign-name">Unit Owner / Tenant / Appointed Contractor</div>
            <div class="sign-label">Signature over Printed name / Date</div>
        </div>
    </div>

    <!-- Copies Section -->
    <div class="copies-section">
        <strong>Copies:</strong>
        <label><input type="checkbox" class="checkbox" /> Property Management Office</label>
        <label><input type="checkbox" class="checkbox" /> Building Maintenance</label>
        <label><input type="checkbox" class="checkbox" /> Unit Owner / Tenant</label>
        <label><input type="checkbox" class="checkbox" /> Appointed Contractor</label>
    </div>

`;
}

function get_f1_renovation_HTML() {
  return `
    
    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td style="width: 60%; vertical-align: top;">
                <img src="forms/images/LOGO.jpg" alt="ONE CORPORATE Logo" class="logo-img" />
            </td>
            <td style="width: 40%; vertical-align: top;" class="doc-control">
                <table class="doc-control-table">
                    <tr><td><strong>Doc code:</strong></td><td>FM-OCT-PMO-09</td></tr>
                    <tr><td><strong>Rev. no.:</strong></td><td>0</td></tr>
                    <tr><td><strong>Eff. Date:</strong></td><td>9-Jun-25</td></tr>
                    <tr><td><strong>Page:</strong></td><td>1 of 1</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <h1>APPLICATION FOR FIT OUT / RENOVATION</h1>

    <!-- Applicant Classification -->
    <div class="checkbox-group">
        <span>Applicant Classification:</span>
        <label><input type="checkbox" class="checkbox" /> Unit Owner</label>
        <label><input type="checkbox" class="checkbox" /> Tenant / Lessee</label>
    </div>

    <!-- Basic Information -->
    <div class="form-grid">
        <div class="form-group" style="grid-column: 1 / -1;">
            <label>Name of Applicant:</label>
            <input type="text" class="fillable-line" placeholder="Enter Full Name" />
        </div>
        <div class="form-group">
            <label>Unit No.:</label>
            <input type="text" class="fillable-line" placeholder="Enter Unit No." />
        </div>
        <div class="form-group">
            <label>Level / Floor:</label>
            <input type="text" class="fillable-line" placeholder="Enter Level" />
        </div>
        <div class="form-group">
            <label>Contact No.:</label>
            <input type="text" class="fillable-line" placeholder="Enter Contact No." />
        </div>
        <div class="form-group">
            <label>Email Address:</label>
            <input type="text" class="fillable-line" placeholder="Enter Email" />
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
            <label>Appointed Contractor:</label>
            <input type="text" class="fillable-line" placeholder="Enter Contractor Name / Company" />
        </div>
        <div class="form-group">
            <label>Target Start Date:</label>
            <input type="text" class="fillable-line" placeholder="DD-MMM-YYYY" />
        </div>
        <div class="form-group">
            <label>Target End Date:</label>
            <input type="text" class="fillable-line" placeholder="DD-MMM-YYYY" />
        </div>
    </div>

    <!-- Nature of Proposed Works -->
    <div class="section-header">Nature of Proposed Fit-Out / Renovation Works</div>
    <div class="checklist-grid">
        <label><input type="checkbox" class="checkbox" /> Civil / Architectural Finishing</label>
        <label><input type="checkbox" class="checkbox" /> Electrical System Alteration</label>
        <label><input type="checkbox" class="checkbox" /> Plumbing & Sanitary Installation</label>
        <label><input type="checkbox" class="checkbox" /> Mechanical & HVAC Ventilation</label>
        <label><input type="checkbox" class="checkbox" /> Fire Protection / Sprinkler Works</label>
        <label><input type="checkbox" class="checkbox" /> Signage & Facade Modification</label>
    </div>

    <!-- Detailed Scope of Work -->
    <div class="section-header">Detailed Scope of Work Description</div>
    <div class="scope-container">
        <textarea class="fillable-textarea" placeholder="Describe specific construction, demolition, partition, electrical, or plumbing works to be performed..."></textarea>
    </div>

    <!-- Signatures -->
    <div class="signatures">
        <div class="sign-block">
            <div class="sign-title">Submitted By (Applicant):</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Unit Owner / Authorized Tenant</div>
        </div>
        <div class="sign-block">
            <div class="sign-title">Endorsed By (Contractor):</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Appointed Contractor / Engineer</div>
        </div>
    </div>

`;
}

function get_f2_appointment_HTML() {
  return `
    
    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td style="width: 60%; vertical-align: top;">
                <img src="forms/images/LOGO.jpg" alt="ONE CORPORATE Logo" class="logo-img" />
                <div style="margin-top: 0.5in; font-size: 13px; line-height: 1.8;">
                    <div style="display:flex; align-items:center;"><label style="font-weight:bold; margin-right:5px;">Name:</label> <input type="text" class="fillable-line" placeholder="Enter Name" /></div>
                    <div style="display:flex; align-items:center;"><label style="font-weight:bold; margin-right:5px;">Position:</label> <input type="text" class="fillable-line" placeholder="Enter Position" /></div>
                    <div style="display:flex; align-items:center;"><label style="font-weight:bold; margin-right:5px;">Address:</label> <input type="text" class="fillable-line" value="# 47 North Drive, Engineer's Hill, Baguio City" /></div>
                </div>
            </td>
            <td style="width: 40%; vertical-align: top;" class="doc-control">
                <table class="doc-control-table">
                    <tr><td><strong>Doc code:</strong></td><td>FM-OCT-PMC</td></tr>
                    <tr><td><strong>Rev. no.:</strong></td><td>0</td></tr>
                    <tr><td><strong>Eff. Date:</strong></td><td>6-Feb-26</td></tr>
                    <tr><td><strong>Page:</strong></td><td>1 of 1</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <h1>Appointment Letter of Contractor</h1>

    <!-- Form Info Section -->
    <div class="form-grid">
        <div class="form-group full-width" style="grid-column: 1 / -1;">
            <label>Unit Owner/Tenant Name:</label>
            <input type="text" class="fillable-line" placeholder="Enter Owner/Tenant Name" />
        </div>
        <div class="form-group">
            <label>Unit Number:</label>
            <input type="text" class="fillable-line" placeholder="Enter Unit No." />
        </div>
        <div class="form-group">
            <label>Level:</label>
            <input type="text" class="fillable-line" placeholder="Enter Level" />
        </div>
        <div class="form-group">
            <label>Date:</label>
            <input type="text" class="fillable-line" placeholder="e.g. DD-MMM-YYYY" />
        </div>
    </div>

    <!-- Body Paragraph -->
    <div class="paragraph">
        In connection with the proposed Construction/Renovation of our Commercial Unit Located at #45 North Drive, Engineer's Hill, Baguio City, 2600 we hereby appoint 
        <input type="text" class="fillable-line inline-input" placeholder="Contractor Company" /> of 
        <input type="text" class="fillable-line inline-input" placeholder="Contractor Address" /> to Mr./Mrs./Ms. 
        <input type="text" class="fillable-line inline-input" placeholder="Authorized Representative" /> undertake the proposed construction and to represent and act in my behalf for all related transactions, negotiations and other related activities.
    </div>
    
    <div class="paragraph" style="margin-bottom: 10px;">
        Thank you.
    </div>

    <!-- Signatures -->
    <div class="signatures">
        <div class="sign-block">
            <div style="text-align: left; font-size: 13px; margin-bottom: 20px;">Received by:</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Printed Name & Signature of Unit Owner/Tenant</div>
            <div class="sign-date">Date <input type="text" class="fillable-line" style="width: 120px; margin-left: 10px;" placeholder="DD-MMM-YYYY" /></div>
        </div>
        <div class="sign-block">
            <div style="text-align: left; font-size: 13px; margin-bottom: 20px; visibility: hidden;">Received by:</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Building Maintenance Office Printed Name & Signature</div>
            <div class="sign-date">Date <input type="text" class="fillable-line" style="width: 120px; margin-left: 10px;" placeholder="DD-MMM-YYYY" /></div>
        </div>
    </div>

    <!-- Contractor Details -->
    <div class="section-title">CONTRACTOR'S DETAILS</div>
    <div class="contractor-grid">
        <div class="form-group">
            <label>Last Name:</label>
            <input type="text" class="fillable-line" placeholder="Last Name" />
        </div>
        <div class="form-group">
            <label>First Name:</label>
            <input type="text" class="fillable-line" placeholder="First Name" />
        </div>
        <div class="form-group full-width">
            <label>Company:</label>
            <input type="text" class="fillable-line" placeholder="Company Name" />
        </div>
        <div class="form-group full-width">
            <label>Address:</label>
            <input type="text" class="fillable-line" placeholder="Address" />
        </div>
        <div class="form-group full-width">
            <label>Title:</label>
            <input type="text" class="fillable-line" placeholder="Title/Position" />
        </div>
        <div class="form-group">
            <label>Contact No.:</label>
            <input type="text" class="fillable-line" placeholder="Contact No." />
        </div>
        <div class="form-group">
            <label>Email:</label>
            <input type="text" class="fillable-line" placeholder="Email Address" />
        </div>
    </div>

    <!-- Job Hazard Analysis -->
    <div class="section-title">Job Hazard Analysis (if Any)</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 30%;">Activity</th>
                <th style="width: 30%;">Potential Hazard</th>
                <th style="width: 35%;">Control Measure</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align:center;">1</td>
                <td><input type="text" class="table-input" placeholder="Activity 1" /></td>
                <td><input type="text" class="table-input" placeholder="Hazard 1" /></td>
                <td><input type="text" class="table-input" placeholder="Control Measure 1" /></td>
            </tr>
            <tr>
                <td style="text-align:center;">2</td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
            </tr>
            <tr>
                <td style="text-align:center;">3</td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
            </tr>
        </tbody>
    </table>

    <!-- Provisions & Notes -->
    <div class="note-box">
        <strong>Construction Bond Provision</strong>
        The owner, tenant, or contractor is required to submit four (4) sets of signed and sealed, A3-sized as-built plans for fit-out or renovation works. This must be done within 30 days of the completion and acceptance of the work as a condition for the refund of the construction bond.<br><br>
        <em>* Full amount will be refunded provided however, that no violation or damage to property have been committed/realized by the contractor or its workers during the renovation/fit-out period. Net amount of deduction shall thereby be given after all violation penalties had been applied therefrom.</em>
    </div>

    <div class="note-box blue">
        <strong>Note:</strong>
        It is the responsibility of the owner/tenant to inform or update the Property Management office, in written form, regarding the above mentioned authorization, or any change in authorized signatories.
    </div>

    <!-- Metering Section -->
    <div class="section-title">Metering</div>
    <div class="metering-text">
        ***Electric & Water consumption will be metered to the Unit Owner/tenant/ Contractor upon the commencement of the Construction Work until the duration of the project***
    </div>
    
    <table class="data-table">
        <thead>
            <tr>
                <th>Meter</th>
                <th>Serial Number</th>
                <th>Beg. Reading</th>
                <th>Date Taken</th>
                <th>End Reading</th>
                <th>Date Taken</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Electric</strong></td>
                <td><input type="text" class="table-input" placeholder="Serial No." /></td>
                <td><input type="text" class="table-input" placeholder="Beg. Reading" /></td>
                <td><input type="text" class="table-input" placeholder="Date" /></td>
                <td><input type="text" class="table-input" placeholder="End Reading" /></td>
                <td><input type="text" class="table-input" placeholder="Date" /></td>
            </tr>
            <tr>
                <td><strong>Water</strong></td>
                <td><input type="text" class="table-input" placeholder="Serial No." /></td>
                <td><input type="text" class="table-input" placeholder="Beg. Reading" /></td>
                <td><input type="text" class="table-input" placeholder="Date" /></td>
                <td><input type="text" class="table-input" placeholder="End Reading" /></td>
                <td><input type="text" class="table-input" placeholder="Date" /></td>
            </tr>
        </tbody>
    </table>

    <!-- Final Approval -->
    <div class="signatures">
        <div class="sign-block">
            <div style="text-align: left; font-size: 13px; margin-bottom: 20px;">Prepared By:</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Printed Name & Signature of Unit Owner/Tenant</div>
            <div class="sign-date">Date <input type="text" class="fillable-line" style="width: 120px; margin-left: 10px;" placeholder="DD-MMM-YYYY" /></div>
        </div>
        <div class="sign-block">
            <div style="text-align: left; font-size: 13px; margin-bottom: 20px;">Approved By:</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Project In Charge Signature over Printed name</div>
            <div class="sign-date">Date <input type="text" class="fillable-line" style="width: 120px; margin-left: 10px;" placeholder="DD-MMM-YYYY" /></div>
        </div>
    </div>

    <!-- Copies Section -->
    <div style="margin-top: 30px; border-top: 1px solid #bdc3c7; padding-top: 15px;">
        <strong>Copies:</strong>
        <div class="checkbox-group">
            <label><input type="checkbox" class="checkbox" /> Property Management office</label>
            <label><input type="checkbox" class="checkbox" /> Unit Owner</label>
            <label><input type="checkbox" class="checkbox" /> Building Maintenance</label>
        </div>
    </div>

`;
}

function get_f3_specimen_HTML() {
  return `
    
    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td style="width: 60%; vertical-align: top;">
                <img src="forms/images/LOGO.jpg" alt="ONE CORPORATE Logo" class="logo-img" />
                <div class="header-info">
                    <div style="display:flex; align-items:center;"><label style="font-weight:bold; margin-right:5px;">Name:</label> <input type="text" class="fillable-line" placeholder="Enter Name" /></div>
                    <div style="display:flex; align-items:center;"><label style="font-weight:bold; margin-right:5px;">Position:</label> <input type="text" class="fillable-line" placeholder="Enter Position" /></div>
                    <div style="display:flex; align-items:center;"><label style="font-weight:bold; margin-right:5px;">Address:</label> <input type="text" class="fillable-line" placeholder="Enter Address" /></div>
                </div>
            </td>
            <td style="width: 40%; vertical-align: top;" class="doc-control">
                <table class="doc-control-table">
                    <tr><td><strong>Doc code:</strong></td><td>FM-OCT-PMO-01</td></tr>
                    <tr><td><strong>Rev. no.:</strong></td><td>0</td></tr>
                    <tr><td><strong>Eff. Date:</strong></td><td>29-Jan-26</td></tr>
                    <tr><td><strong>Page:</strong></td><td>1 of 1</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <h1>SPECIMEN SIGNATURE SHEET</h1>

    <!-- Form Info -->
    <div class="form-grid">
        <div class="form-group" style="grid-column: 1 / -1;">
            <label>Unit Owner / Tenant Name:</label>
            <input type="text" class="fillable-line" placeholder="Enter Owner / Tenant Name" />
        </div>
        <div class="form-group">
            <label>Unit Number:</label>
            <input type="text" class="fillable-line" placeholder="Enter Unit No." />
        </div>
        <div class="form-group">
            <label>Level / Floor:</label>
            <input type="text" class="fillable-line" placeholder="Enter Level" />
        </div>
        <div class="form-group">
            <label>Date:</label>
            <input type="text" class="fillable-line" placeholder="DD-MMM-YYYY" />
        </div>
    </div>

    <!-- Authorization Text -->
    <div class="paragraph">
        This is to authorize the following persons, whose names appear below, to sign in my behalf for the work permit, gate pass, and other related documents needed for our fit-out, transfer, delivery, and pull-out of furniture, fixtures, equipment, and materials in the above unit/s.
    </div>

    <!-- Signatures Data Table -->
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 30%;">Name of Authorized Person</th>
                <th style="width: 25%;">Designation / Position</th>
                <th style="width: 20%;">Specimen Signature 1</th>
                <th style="width: 20%;">Specimen Signature 2</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align:center;">1</td>
                <td><input type="text" class="table-input" placeholder="Authorized Name 1" /></td>
                <td><input type="text" class="table-input" placeholder="Project Manager" /></td>
                <td><input type="text" class="table-input" style="text-align:center;" placeholder="Sign 1" /></td>
                <td><input type="text" class="table-input" style="text-align:center;" placeholder="Sign 2" /></td>
            </tr>
            <tr>
                <td style="text-align:center;">2</td>
                <td><input type="text" class="table-input" placeholder="Authorized Name 2" /></td>
                <td><input type="text" class="table-input" placeholder="Site Engineer" /></td>
                <td><input type="text" class="table-input" style="text-align:center;" placeholder="Sign 1" /></td>
                <td><input type="text" class="table-input" style="text-align:center;" placeholder="Sign 2" /></td>
            </tr>
            <tr>
                <td style="text-align:center;">3</td>
                <td><input type="text" class="table-input" placeholder="Authorized Name 3" /></td>
                <td><input type="text" class="table-input" placeholder="Contractor Rep" /></td>
                <td><input type="text" class="table-input" style="text-align:center;" placeholder="Sign 1" /></td>
                <td><input type="text" class="table-input" style="text-align:center;" placeholder="Sign 2" /></td>
            </tr>
        </tbody>
    </table>

    <!-- Authorizer Signature -->
    <div class="signatures">
        <div class="sign-block">
            <div class="sign-title">Authorized By:</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Unit Owner / Authorized Tenant Signature</div>
        </div>
        <div class="sign-block">
            <div class="sign-title">Noted By (PMO):</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Property Management Representative</div>
        </div>
    </div>

`;
}

function get_f4_workpermit_major_HTML() {
  return `
    
    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td style="width: 60%; vertical-align: top;">
                <img src="forms/images/LOGO.jpg" alt="ONE CORPORATE Logo" class="logo-img" />
            </td>
            <td style="width: 40%; vertical-align: top;" class="doc-control">
                <table class="doc-control-table">
                    <tr><td><strong>Doc code:</strong></td><td>FM-OCT-CON-01</td></tr>
                    <tr><td><strong>Rev. no.:</strong></td><td>0</td></tr>
                    <tr><td><strong>Eff. Date:</strong></td><td>9-Jun-25</td></tr>
                    <tr><td><strong>Page:</strong></td><td>1 of 1</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <h1>FIT-OUT WORK PERMIT</h1>

    <!-- Top Fields -->
    <div class="form-grid">
        <div class="form-group">
            <label>Name of Applicant :</label>
            <input type="text" class="fillable-line" placeholder="Enter Applicant Name" />
        </div>
        <div class="form-group">
            <label>Date of Application:</label>
            <input type="text" class="fillable-line" placeholder="DD-MMM-YYYY" />
        </div>
    </div>
    <div class="form-grid" style="margin-bottom: 10px;">
        <div class="checkbox-inline">
            <label><input type="checkbox" class="checkbox" /> Unit Owner</label>
            <label><input type="checkbox" class="checkbox" /> Tenant</label>
        </div>
        <div class="checkbox-inline">
            <label><input type="checkbox" class="checkbox" /> CONSTRUCTION</label>
            <label><input type="checkbox" class="checkbox" /> RENOVATION</label>
        </div>
    </div>

    <!-- Details & Disciplines Grid -->
    <div class="top-details-grid">
        <div>
            <div class="form-group">
                <label>Unit No. :</label>
                <input type="text" class="fillable-line" placeholder="Unit No." />
            </div>
            <div class="form-group">
                <label>Name of Contractor :</label>
                <input type="text" class="fillable-line" placeholder="Contractor" />
            </div>
            <div class="form-group">
                <label>Person-in-charge :</label>
                <input type="text" class="fillable-line" placeholder="PIC Name" />
            </div>
            <div class="form-group">
                <label>Contact No. :</label>
                <input type="text" class="fillable-line" placeholder="Contact No." />
            </div>
            <div style="font-weight:bold; font-size:10px; margin-top:5px; background:#ecf0f1; padding:2px;">Target Schedule:</div>
            <div class="form-group">
                <label>Start: Date</label><input type="text" class="fillable-line" placeholder="Date" />
                <label style="margin-left:4px;">Time</label><input type="text" class="fillable-line" placeholder="Time" />
            </div>
            <div class="form-group">
                <label>End: Date</label><input type="text" class="fillable-line" placeholder="Date" />
                <label style="margin-left:4px;">Time</label><input type="text" class="fillable-line" placeholder="Time" />
            </div>
        </div>
        <div>
            <div style="font-weight:bold; font-size:10px; margin-bottom:6px;">Check all that apply. Approved plans MUST be attached</div>
            <div class="discipline-grid">
                <label><input type="checkbox" class="checkbox" /> Civil/Structural</label>
                <label><input type="checkbox" class="checkbox" /> Hot works</label>
                <label><input type="checkbox" class="checkbox" /> Electrical</label>
                <label><input type="checkbox" class="checkbox" /> Other's (Major Repairs)</label>
                <label><input type="checkbox" class="checkbox" /> Mechanical/HVAC</label>
                <span style="font-size:9px; color:#555;">Please specify:</span>
                <label><input type="checkbox" class="checkbox" /> Plumbing/Sanitary</label>
                <input type="text" class="fillable-line" style="height:12px;" />
                <label><input type="checkbox" class="checkbox" /> Fire Protection</label>
                <div></div>
                <label><input type="checkbox" class="checkbox" /> Finishing</label>
                <div></div>
            </div>
        </div>
        <div style="border-left:1px solid #bdc3c7; padding-left:10px;">
            <div style="font-weight:bold; font-size:11px; margin-bottom:8px; text-align:center;">Remarks</div>
            <label style="display:block; margin-bottom:6px; font-size:10px;"><input type="checkbox" class="checkbox" /> <i>Approved</i></label>
            <label style="display:block; margin-bottom:12px; font-size:10px;"><input type="checkbox" class="checkbox" /> <i>Disapproved</i></label>
            <div class="form-group">
                <label style="font-size:9px;">Work Permit No.</label>
                <input type="text" class="fillable-line" placeholder="WP No." />
            </div>
        </div>
    </div>

    <!-- Scope of Work & JHA Container -->
    <div class="scope-jha-container">
        <div class="scope-box">
            <div class="scope-title">Scope of Work ( Brief Description )</div>
            <textarea class="fillable-textarea" placeholder="Enter brief description of work scope..."></textarea>
        </div>
        <div>
            <table class="jha-table">
                <thead>
                    <tr>
                        <th rowspan="2" style="width: 5%;">#</th>
                        <th rowspan="2" style="width: 25%;">JOB TITLE:</th>
                        <th colspan="3" style="text-align: center;">JOB HAZARD ANALYSIS</th>
                    </tr>
                    <tr>
                        <th style="width: 25%;">Sequence of Basic Job Steps</th>
                        <th style="width: 25%;">Potential Hazards</th>
                        <th style="width: 20%;">Recommended Action/Procedure</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style="text-align:center;">1</td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td></tr>
                    <tr><td style="text-align:center;">2</td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td></tr>
                    <tr><td style="text-align:center;">3</td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td></tr>
                    <tr><td style="text-align:center;">4</td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td></tr>
                    <tr><td style="text-align:center;">5</td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td><td><input type="text" class="table-input" /></td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Prepared / Applicant Signatures -->
    <div class="sig-header">PLEASE AFFIX YOUR SIGNATURE OVER PRINTED NAME ON THE CORRESPONDING SPACE PROVIDED BELOW:</div>
    <div style="display:grid; grid-template-columns:1fr 1fr; border:1px solid #bdc3c7; padding:10px; margin-bottom:15px;">
        <div style="text-align:center; padding-right:15px; border-right:1px solid #bdc3c7;">
            <div style="text-align:left; font-size:10px; font-weight:bold;">Prepared by:</div>
            <div style="border-bottom:1px solid #333; height:25px; margin-bottom:4px;"><input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Signature / Contractor Name" /></div>
            <div style="font-size:10px; font-weight:bold;">Appointed Contractor</div>
            <div style="font-size:9px; color:#555;">Signature Over Printed Name/Date</div>
        </div>
        <div style="text-align:center; padding-left:15px;">
            <div style="text-align:left; font-size:10px; font-weight:bold;">Applicant:</div>
            <div style="border-bottom:1px solid #333; height:25px; margin-bottom:4px;"><input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Signature / Applicant Name" /></div>
            <div style="font-size:10px; font-weight:bold;">Unit Owner/Tenant/ SPA</div>
            <div style="font-size:9px; color:#555;">Signature Over Printed Name/Date</div>
        </div>
    </div>

    <!-- TO BE CHECKED BY BM OFFICE -->
    <div class="section-header">TO BE CHECK BY THE BUILDING MAINTENANCE OFFICE</div>
    <div class="bm-check-container">
        <div class="bm-col">
            <div class="bm-title">Documentary Requirements</div>
            <div class="doc-req-item">
                <span>A. Letter of Intent</span>
                <input type="checkbox" class="checkbox" />
            </div>
            <div class="doc-req-item">
                <span>B. Authorization Letter from Owner / Approved Lease Contract</span>
                <input type="checkbox" class="checkbox" />
            </div>
            <div class="doc-req-item">
                <span>C. Four (4) sets of A3 Construction Drawings</span>
                <input type="checkbox" class="checkbox" />
            </div>
            <div class="doc-req-item">
                <span>D. Electronic Copy of Plans (email submitted)</span>
                <input type="checkbox" class="checkbox" />
            </div>
            <div class="doc-req-item">
                <span>E. Contractor IDs / List of Workers , tools and equipment</span>
                <input type="checkbox" class="checkbox" />
            </div>
            <div class="doc-req-item">
                <span>F. Other requirements (if applicable)</span>
                <input type="checkbox" class="checkbox" />
            </div>
        </div>
        <div class="bm-col">
            <div class="bm-title">SAFETY & COMPLIANCE CHECKLIST - Failure to comply will result in immediate work stoppage</div>
            <div class="safety-item">
                <div>
                    <strong>1. Hot Works: <label><input type="checkbox" class="checkbox" /> Yes</label> / <label><input type="checkbox" class="checkbox" /> No</label></strong><br>
                    (If "Yes," the same Work Permit covers the requirement for a Fire Extinguisher.)
                </div>
                <input type="checkbox" class="checkbox" style="margin-left:8px;" />
            </div>
            <div class="safety-item">
                <div>
                    <strong>2. Risk Assessment:</strong> Job Safety Analysis must be attached on this Work Permit and briefed to workers.
                </div>
                <input type="checkbox" class="checkbox" style="margin-left:8px;" />
            </div>
            <div class="safety-item">
                <div>
                    <strong>3. Required Isolations:</strong> Power, Water Sprinklers, and Fire Alarm (if applicable).
                </div>
                <input type="checkbox" class="checkbox" style="margin-left:8px;" />
            </div>
            <div class="safety-item">
                <div>
                    <strong>4. Waste Management:</strong> Daily hauling; no debris in common area bins
                </div>
                <input type="checkbox" class="checkbox" style="margin-left:8px;" />
            </div>
            <div class="safety-item">
                <div>
                    <strong>5. Personal Protective Equipment (PPE)</strong> is required: a hard hat, safety shoes, a high-visibility vest, and a mask.
                </div>
                <input type="checkbox" class="checkbox" style="margin-left:8px;" />
            </div>
        </div>
    </div>

    <!-- Department Comments -->
    <table class="comments-table">
        <thead>
            <tr>
                <th style="width: 40%;">Department</th>
                <th style="width: 60%;">Comments ( if Applicable )</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Property Management Office</td><td><input type="text" class="table-input" placeholder="Comments" /></td></tr>
            <tr><td>Building Maintenance Office</td><td><input type="text" class="table-input" placeholder="Comments" /></td></tr>
            <tr><td>Technical Engineering Services (FCLDC)</td><td><input type="text" class="table-input" placeholder="Comments" /></td></tr>
            <tr><td>QA / QC (FLDC)</td><td><input type="text" class="table-input" placeholder="Comments" /></td></tr>
            <tr><td>CEO / PRESIDENT</td><td><input type="text" class="table-input" placeholder="Comments" /></td></tr>
        </tbody>
    </table>

    <!-- Terms & Conditions -->
    <div class="section-header">TERMS AND CONDITIONS</div>
    <ol class="terms-list">
        <li>This permit is valid only on the dates and time specified above.</li>
        <li>Approval of Work Permit at least (15) days BEFORE actual work schedule and from 09:00 AM to 4:00 PM, Monday to Saturday only.</li>
        <li>A strict 'No Approved Work Permit, No Work' policy is in effect.</li>
        <li>Work permit must be presented to the Guard-on-Duty for access on any area.</li>
        <li>A copy of this work permit inserted in a plastic sleeve must be posted on the door of the unit during the whole duration of work.</li>
        <li>All workers must use the <u>specified access of workers to Commercial Units</u>.</li>
        <li>Workers must present their Company ID (Contractor ID) will be surrendered to the security upon entry to the building. In exchange, a Temporary Workers Access Pass will be worn by the workers and site engineers whenever they are within the building premises.</li>
        <li>Construction debris and other garbage such as crates and Styrofoam, which are not accepted by garbage collector for hauling, shall be disposed of by the unit owner/tenant every day after the work hour is finished, and will not be disposed in the garbage bins , expenses and penalties of which shall be for the account of the unit owner/lessee if receptacles of construction are seen inside the bins.</li>
        <li>For hot works the Unit Owner / Contractor shall provide fire Extinguisher at the job site and to observed the safety Guidelines all the times.</li>
        <li>Loitering in the common areas is prohibited.</li>
        <li>All workers are bound by the Rules and Regulations of One Corporate.</li>
        <li>Workers wearing sleeveless shirts, shorts, sandals or slippers and the like shall not be allowed to enter the premises.</li>
        <li>For any additional Construction rules and regulation's, Please refer to the sent General Constructions Guidelines.</li>
        <li>Failure to comply with the terms and conditions shall result in an immediate work stoppage and computed penalties.</li>
    </ol>

    <!-- Signatures -->
    <div class="sig-header">PLEASE AFFIX YOUR SIGNATURE OVER PRINTED NAME ON THE CORRESPONDING SPACE PROVIDED BELOW:</div>
    <table class="signature-table">
        <tr>
            <td>
                <div class="sig-title">Reviewed by:</div>
                <input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Signature / Name" />
                <div class="sig-name">FCLaranang Development Corporation</div>
                <div class="sig-sub">Technical Engineering Services</div>
            </td>
            <td>
                <div class="sig-title">Issued by:</div>
                <input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Signature / Name" />
                <div class="sig-name">Engr. Roan Paul Gallegos</div>
                <div class="sig-sub">Building Maintenance Manager</div>
            </td>
            <td>
                <div class="sig-title">Noted by:</div>
                <input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Signature / Name" />
                <div class="sig-name">Engr. Virtron Bumal-O</div>
                <div class="sig-sub">QA/QC Manager</div>
            </td>
            <td>
                <div class="sig-title">Approved by:</div>
                <input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Signature / Name" />
                <div class="sig-name">Ms. Lorraine Ashley Laranang-Josue</div>
                <div class="sig-sub">Property Management Office</div>
            </td>
        </tr>
    </table>

    <!-- Copies Section -->
    <div class="copies-section">
        <strong>Copies to :</strong>
        <label><input type="checkbox" class="checkbox" /> Property Management Office</label>
        <label><input type="checkbox" class="checkbox" /> Building Maintenance</label>
        <label><input type="checkbox" class="checkbox" /> Unit Owner</label>
        <label><input type="checkbox" class="checkbox" /> FCLaranang Development Corporation</label>
    </div>

`;
}

function get_f5_workpermit_minor_HTML() {
  return `
    
    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td style="width: 60%; vertical-align: top;">
                <img src="forms/images/LOGO.jpg" alt="ONE CORPORATE Logo" class="logo-img" />
            </td>
            <td style="width: 40%; vertical-align: top;" class="doc-control">
                <table class="doc-control-table">
                    <tr><td><strong>Doc code:</strong></td><td>FM-OCT-CON-05</td></tr>
                    <tr><td><strong>Rev. no.:</strong></td><td>0</td></tr>
                    <tr><td><strong>Eff. Date:</strong></td><td>9-Jun-25</td></tr>
                    <tr><td><strong>Page:</strong></td><td>1 of 1</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <h1>WORK PERMIT (SMALL WORKS / REPAIRS)</h1>

    <!-- Basic Form Info -->
    <div class="form-grid">
        <div class="form-group">
            <label>Work Permit No.:</label>
            <input type="text" class="fillable-line" placeholder="Enter Permit No." />
        </div>
        <div class="form-group">
            <label>Date of Application:</label>
            <input type="text" class="fillable-line" placeholder="DD-MMM-YYYY" />
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
            <label>Unit Owner / Tenant Name:</label>
            <input type="text" class="fillable-line" placeholder="Enter Owner/Tenant Name" />
        </div>
        <div class="form-group">
            <label>Unit No.:</label>
            <input type="text" class="fillable-line" placeholder="Enter Unit No." />
        </div>
        <div class="form-group">
            <label>Level / Floor:</label>
            <input type="text" class="fillable-line" placeholder="Enter Level" />
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
            <label>Contractor / Technician Name:</label>
            <input type="text" class="fillable-line" placeholder="Enter Contractor / Service Provider Name" />
        </div>
        <div class="form-group">
            <label>Work Schedule Start:</label>
            <input type="text" class="fillable-line" placeholder="Date & Time" />
        </div>
        <div class="form-group">
            <label>Work Schedule End:</label>
            <input type="text" class="fillable-line" placeholder="Date & Time" />
        </div>
    </div>

    <!-- Description of Small Works -->
    <div class="section-header">Description of Minor Repair / Works</div>
    <textarea class="fillable-textarea" placeholder="Describe minor repairs (e.g. touch-up painting, minor electrical repair, furniture assembly)..."></textarea>

    <!-- Authorized Workers Table -->
    <div class="section-header">List of Workers & Entry Pass</div>
    <table class="workers-table">
        <thead>
            <tr>
                <th style="width: 8%;">#</th>
                <th style="width: 42%;">Name of Worker / Personnel</th>
                <th style="width: 30%;">ID / Access Pass No.</th>
                <th style="width: 20%;">Contact No.</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align:center;">1</td>
                <td><input type="text" class="table-input" placeholder="Worker Name 1" /></td>
                <td><input type="text" class="table-input" placeholder="ID No." /></td>
                <td><input type="text" class="table-input" placeholder="Contact No." /></td>
            </tr>
            <tr>
                <td style="text-align:center;">2</td>
                <td><input type="text" class="table-input" placeholder="Worker Name 2" /></td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
            </tr>
            <tr>
                <td style="text-align:center;">3</td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
            </tr>
        </tbody>
    </table>

    <!-- Safety Verification -->
    <div style="display: flex; gap: 30px; font-size: 12px; border: 1px solid #bdc3c7; padding: 12px; background-color: #fafafa; margin-bottom: 25px;">
        <label><input type="checkbox" class="checkbox" /> PPE Used (Hardhat / Shoes)</label>
        <label><input type="checkbox" class="checkbox" /> Fire Extinguisher On-Site</label>
        <label><input type="checkbox" class="checkbox" /> Daily Debris Hauling Agreed</label>
    </div>

    <!-- Signatures -->
    <div class="signatures">
        <div class="sign-block">
            <div class="sign-title">Applicant / Contractor:</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Applicant / Representative</div>
        </div>
        <div class="sign-block">
            <div class="sign-title">Approved By:</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Building Maintenance Office</div>
        </div>
    </div>

`;
}

function get_f6_gatepass_HTML() {
  return `
    
    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td style="width: 60%; vertical-align: top;">
                <img src="forms/images/LOGO.jpg" alt="ONE CORPORATE Logo" class="logo-img" />
            </td>
            <td style="width: 40%; vertical-align: top;" class="doc-control">
                <table class="doc-control-table">
                    <tr><td><strong>Doc code:</strong></td><td>FM-OCT-PMO-05</td></tr>
                    <tr><td><strong>Rev. no.:</strong></td><td>0</td></tr>
                    <tr><td><strong>Eff. Date:</strong></td><td>9-Jun-25</td></tr>
                    <tr><td><strong>Page:</strong></td><td>1 of 1</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <h1>GATE PASS</h1>

    <!-- Pass Type Selection -->
    <div class="pass-type-container">
        <label><input type="checkbox" class="checkbox" /> ENTRY / DELIVERY</label>
        <label><input type="checkbox" class="checkbox" /> EXIT / PULL-OUT</label>
    </div>

    <!-- Basic Form Info -->
    <div class="form-grid">
        <div class="form-group">
            <label>Gate Pass No.:</label>
            <input type="text" class="fillable-line" placeholder="Enter Gate Pass No." />
        </div>
        <div class="form-group">
            <label>Date:</label>
            <input type="text" class="fillable-line" placeholder="DD-MMM-YYYY" />
        </div>
        <div class="form-group">
            <label>Unit No.:</label>
            <input type="text" class="fillable-line" placeholder="Enter Unit No." />
        </div>
        <div class="form-group">
            <label>Level / Floor:</label>
            <input type="text" class="fillable-line" placeholder="Enter Level" />
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
            <label>Name of Unit Owner / Tenant:</label>
            <input type="text" class="fillable-line" placeholder="Enter Owner/Tenant Name" />
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
            <label>Carrier / Contractor / Hauler Name:</label>
            <input type="text" class="fillable-line" placeholder="Enter Hauler / Contractor Name" />
        </div>
        <div class="form-group">
            <label>Vehicle Model & Plate No.:</label>
            <input type="text" class="fillable-line" placeholder="e.g. Isuzu ABC-1234" />
        </div>
        <div class="form-group">
            <label>Driver Name & Contact:</label>
            <input type="text" class="fillable-line" placeholder="Driver Name / Contact No." />
        </div>
    </div>

    <!-- Items List Table -->
    <div class="section-header">LIST OF MATERIALS / EQUIPMENT / FURNITURE</div>
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 8%;">Qty</th>
                <th style="width: 12%;">Unit</th>
                <th style="width: 50%;">Item Description</th>
                <th style="width: 30%;">Serial No. / Remarks</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><input type="text" class="table-input" style="text-align:center;" placeholder="1" /></td>
                <td><input type="text" class="table-input" style="text-align:center;" placeholder="pc/box" /></td>
                <td><input type="text" class="table-input" placeholder="Item description" /></td>
                <td><input type="text" class="table-input" placeholder="Remarks" /></td>
            </tr>
            <tr>
                <td><input type="text" class="table-input" style="text-align:center;" /></td>
                <td><input type="text" class="table-input" style="text-align:center;" /></td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
            </tr>
            <tr>
                <td><input type="text" class="table-input" style="text-align:center;" /></td>
                <td><input type="text" class="table-input" style="text-align:center;" /></td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
            </tr>
            <tr>
                <td><input type="text" class="table-input" style="text-align:center;" /></td>
                <td><input type="text" class="table-input" style="text-align:center;" /></td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
            </tr>
            <tr>
                <td><input type="text" class="table-input" style="text-align:center;" /></td>
                <td><input type="text" class="table-input" style="text-align:center;" /></td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
            </tr>
        </tbody>
    </table>

    <!-- Signatures -->
    <div class="signatures">
        <div class="sign-block">
            <div class="sign-title">Requested By:</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Unit Owner / Authorized Tenant</div>
        </div>
        <div class="sign-block">
            <div class="sign-title">Verified / Checked By:</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Building Maintenance Office</div>
        </div>
        <div class="sign-block">
            <div class="sign-title">Approved By:</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Property Management Office</div>
        </div>
    </div>

    <!-- Security Guard Inspection Verification -->
    <div class="guard-verification">
        <div style="font-weight: bold; margin-bottom: 8px;">SECURITY GUARD ON DUTY VERIFICATION:</div>
        <div style="display: flex; gap: 30px; align-items: center;">
            <div style="flex-grow: 1; display: flex; align-items: center;">
                <label style="font-weight: bold; margin-right: 5px;">Inspected By (Guard Name):</label>
                <input type="text" class="fillable-line" placeholder="Guard Name" />
            </div>
            <div style="display: flex; align-items: center;">
                <label style="font-weight: bold; margin-right: 5px;">Time Out/In:</label>
                <input type="text" class="fillable-line" style="width: 120px;" placeholder="HH:MM AM/PM" />
            </div>
        </div>
    </div>

`;
}

function get_f7_punchlist_HTML() {
  return `
    
    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td style="width: 60%; vertical-align: top;">
                <img src="forms/images/LOGO.jpg" alt="ONE CORPORATE Logo" class="logo-img" />
            </td>
            <td style="width: 40%; vertical-align: top;" class="doc-control">
                <table class="doc-control-table">
                    <tr><td><strong>Doc code:</strong></td><td>FM-OCT-PMO-13</td></tr>
                    <tr><td><strong>Rev. no.:</strong></td><td>0</td></tr>
                    <tr><td><strong>Eff. Date:</strong></td><td>August 15, 2025</td></tr>
                    <tr><td><strong>Page:</strong></td><td>1 of 1</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <h1>PUNCH LIST FORM</h1>

    <!-- Form Details -->
    <div class="form-grid">
        <div class="form-group" style="grid-column: 1 / -1;">
            <label>Project / Unit Owner Name:</label>
            <input type="text" class="fillable-line" placeholder="Enter Owner / Tenant Name" />
        </div>
        <div class="form-group">
            <label>Unit Number:</label>
            <input type="text" class="fillable-line" placeholder="Enter Unit No." />
        </div>
        <div class="form-group">
            <label>Level / Floor:</label>
            <input type="text" class="fillable-line" placeholder="Enter Level" />
        </div>
        <div class="form-group">
            <label>Appointed Contractor:</label>
            <input type="text" class="fillable-line" placeholder="Enter Contractor Name" />
        </div>
        <div class="form-group">
            <label>Inspection Date:</label>
            <input type="text" class="fillable-line" placeholder="DD-MMM-YYYY" />
        </div>
    </div>

    <!-- Punch List Table -->
    <div class="section-header">ITEMS FOR RECTIFICATION / DEFECT LIST</div>
    <table class="punch-table">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 25%;">Area / Location</th>
                <th style="width: 35%;">Defect / Item Description</th>
                <th style="width: 15%;">Target Date</th>
                <th style="width: 20%;">Status / Verification</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align:center;">1</td>
                <td><input type="text" class="table-input" placeholder="Location 1" /></td>
                <td><input type="text" class="table-input" placeholder="Defect description 1" /></td>
                <td><input type="text" class="table-input" placeholder="DD-MMM-YYYY" /></td>
                <td style="text-align:center;"><label><input type="checkbox" class="checkbox" /> Done</label> <label><input type="checkbox" class="checkbox" /> Pending</label></td>
            </tr>
            <tr>
                <td style="text-align:center;">2</td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
                <td style="text-align:center;"><label><input type="checkbox" class="checkbox" /> Done</label> <label><input type="checkbox" class="checkbox" /> Pending</label></td>
            </tr>
            <tr>
                <td style="text-align:center;">3</td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
                <td style="text-align:center;"><label><input type="checkbox" class="checkbox" /> Done</label> <label><input type="checkbox" class="checkbox" /> Pending</label></td>
            </tr>
            <tr>
                <td style="text-align:center;">4</td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
                <td style="text-align:center;"><label><input type="checkbox" class="checkbox" /> Done</label> <label><input type="checkbox" class="checkbox" /> Pending</label></td>
            </tr>
            <tr>
                <td style="text-align:center;">5</td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
                <td><input type="text" class="table-input" /></td>
                <td style="text-align:center;"><label><input type="checkbox" class="checkbox" /> Done</label> <label><input type="checkbox" class="checkbox" /> Pending</label></td>
            </tr>
        </tbody>
    </table>

    <!-- Signatures -->
    <div class="signatures">
        <div class="sign-block">
            <div class="sign-title">Inspected By (PMO / BM):</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Building Maintenance Engineer</div>
        </div>
        <div class="sign-block">
            <div class="sign-title">Acknowledged By (Contractor):</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Contractor Representative</div>
        </div>
        <div class="sign-block">
            <div class="sign-title">Conformed By (Owner/Tenant):</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center;" placeholder="Signature / Name" /></div>
            <div class="sign-label">Unit Owner / Tenant Signature</div>
        </div>
    </div>

`;
}

function get_f8_concern_HTML() {
  return `
    
    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td style="width: 60%; vertical-align: top;">
                <img src="forms/images/LOGO.jpg" alt="ONE CORPORATE Logo" class="logo-img" />
            </td>
            <td style="width: 40%; vertical-align: top;" class="doc-control">
                <table class="doc-control-table">
                    <tr><td><strong>Doc code:</strong></td><td>FM-OCT-CON-02</td></tr>
                    <tr><td><strong>Rev. no.:</strong></td><td>0</td></tr>
                    <tr><td><strong>Eff. Date:</strong></td><td>9-Jun-25</td></tr>
                    <tr><td><strong>Page:</strong></td><td>1 of 1</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <h1>CONCERNS SLIP</h1>

    <!-- Basic Form Info -->
    <div class="form-grid">
        <div class="form-group" style="grid-column: 1 / -1;">
            <label>Name of Owner / Tenant:</label>
            <input type="text" class="fillable-line" placeholder="Enter Owner / Tenant Name" />
        </div>
        <div class="form-group">
            <label>Unit No.:</label>
            <input type="text" class="fillable-line" placeholder="Enter Unit No." />
        </div>
        <div class="form-group">
            <label>Contact No.:</label>
            <input type="text" class="fillable-line" placeholder="Enter Contact No." />
        </div>
        <div class="form-group">
            <label>Date Reported:</label>
            <input type="text" class="fillable-line" placeholder="DD-MMM-YYYY" />
        </div>
        <div class="form-group">
            <label>Time Reported:</label>
            <input type="text" class="fillable-line" placeholder="HH:MM AM/PM" />
        </div>
    </div>

    <!-- Details of Concern -->
    <div class="section-header">DETAILS OF CONCERN / REQUEST</div>
    <textarea class="fillable-textarea" placeholder="Please describe the concern, issue, or maintenance request in detail..."></textarea>

    <!-- Action Taken -->
    <div class="section-header">ACTION TAKEN BY BUILDING MAINTENANCE OFFICE</div>
    <textarea class="fillable-textarea" placeholder="Enter action taken, investigation results, or status..."></textarea>

    <!-- Customer Satisfaction Rating -->
    <div class="section-header">CUSTOMER SATISFACTION SURVEY</div>
    <div class="rating-section">
        <div class="rating-title">For us to be able to serve you better, please rate our service:</div>
        <div class="rating-grid">
            <div class="rating-box">
                <div class="rating-label">1. Quality of Job Done</div>
                <div class="rating-options">
                    <label><input type="checkbox" class="checkbox" /> Excellent</label>
                    <label><input type="checkbox" class="checkbox" /> Good</label>
                    <label><input type="checkbox" class="checkbox" /> Fair</label>
                    <label><input type="checkbox" class="checkbox" /> Poor</label>
                </div>
            </div>
            <div class="rating-box">
                <div class="rating-label">2. Courteousness & Job Knowledge</div>
                <div class="rating-options">
                    <label><input type="checkbox" class="checkbox" /> Excellent</label>
                    <label><input type="checkbox" class="checkbox" /> Good</label>
                    <label><input type="checkbox" class="checkbox" /> Fair</label>
                    <label><input type="checkbox" class="checkbox" /> Poor</label>
                </div>
            </div>
        </div>
    </div>

    <!-- Signatures -->
    <div class="signatures">
        <div class="sign-block">
            <div class="sign-title">Attended By:</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Maintenance Personnel Signature" /></div>
            <div class="sign-label">Building Maintenance Staff / Date</div>
        </div>
        <div class="sign-block">
            <div class="sign-title">Acknowledged & Conformed By:</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Unit Owner / Representative Signature" /></div>
            <div class="sign-label">Unit Owner / Tenant Signature / Date</div>
        </div>
    </div>

`;
}

function get_f9_clearance_HTML() {
  return `
    
    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td style="width: 60%; vertical-align: top;">
                <img src="forms/images/LOGO.jpg" alt="ONE CORPORATE Logo" class="logo-img" />
            </td>
            <td style="width: 40%; vertical-align: top;" class="doc-control">
                <table class="doc-control-table">
                    <tr><td><strong>Doc code:</strong></td><td>FM-OCT-BM-08</td></tr>
                    <tr><td><strong>Rev. no.:</strong></td><td>0</td></tr>
                    <tr><td><strong>Eff. Date:</strong></td><td>13-May-26</td></tr>
                    <tr><td><strong>Page:</strong></td><td>1 of 1</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <h1>CLEARANCE CERTIFICATE</h1>

    <!-- Form Details -->
    <div class="form-grid">
        <div class="form-group" style="grid-column: 1 / -1;">
            <label>Unit Owner/Tenant Name:</label>
            <input type="text" class="fillable-line" placeholder="Enter Owner/Tenant Name" />
        </div>
        <div class="form-group">
            <label>Permit #:</label>
            <input type="text" class="fillable-line" placeholder="Enter Work Permit No." />
        </div>
        <div class="form-group">
            <label>Unit Number:</label>
            <input type="text" class="fillable-line" placeholder="Enter Unit No." />
        </div>
        <div class="form-group">
            <label>Level:</label>
            <input type="text" class="fillable-line" placeholder="Enter Level" />
        </div>
        <div class="form-group">
            <label>Authorized Contractor:</label>
            <input type="text" class="fillable-line" placeholder="Enter Contractor Name" />
        </div>
        <div class="form-group">
            <label>Date Issuance:</label>
            <input type="text" class="fillable-line" placeholder="e.g. DD-MMM-YYYY" />
        </div>
    </div>

    <!-- Nature of Works Table -->
    <div class="section-header">Nature of Works (Check all that apply)</div>
    <table class="clearance-table">
        <thead>
            <tr>
                <th style="width: 35%;">Category</th>
                <th style="width: 15%;">Status</th>
                <th style="width: 50%;">Remarks / Inspected By</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Architectural & Fit-Out Finishing</td>
                <td class="checkbox-cell"><label><input type="checkbox" class="checkbox" /> Cleared</label></td>
                <td><input type="text" class="table-input" placeholder="Remarks" /></td>
            </tr>
            <tr>
                <td>Electrical Works & Metering</td>
                <td class="checkbox-cell"><label><input type="checkbox" class="checkbox" /> Cleared</label></td>
                <td><input type="text" class="table-input" placeholder="Remarks" /></td>
            </tr>
            <tr>
                <td>Plumbing & Sanitary Lines</td>
                <td class="checkbox-cell"><label><input type="checkbox" class="checkbox" /> Cleared</label></td>
                <td><input type="text" class="table-input" placeholder="Remarks" /></td>
            </tr>
            <tr>
                <td>HVAC & Mechanical Systems</td>
                <td class="checkbox-cell"><label><input type="checkbox" class="checkbox" /> Cleared</label></td>
                <td><input type="text" class="table-input" placeholder="Remarks" /></td>
            </tr>
            <tr>
                <td>Fire Protection & Sprinklers</td>
                <td class="checkbox-cell"><label><input type="checkbox" class="checkbox" /> Cleared</label></td>
                <td><input type="text" class="table-input" placeholder="Remarks" /></td>
            </tr>
            <tr>
                <td>Waste Hauling & Site Debris Clearance</td>
                <td class="checkbox-cell"><label><input type="checkbox" class="checkbox" /> Cleared</label></td>
                <td><input type="text" class="table-input" placeholder="Remarks" /></td>
            </tr>
        </tbody>
    </table>

    <!-- Additional Findings / Recommendations -->
    <div class="section-header">Findings / Comments / Recommendations</div>
    <textarea class="fillable-textarea" placeholder="Enter findings, recommendations, or clearance notes..."></textarea>

    <!-- Signatures -->
    <div class="signatures">
        <div class="sign-block">
            <div style="text-align: left; font-weight: bold; font-size: 12px; margin-bottom: 30px;">Inspected / Verified By:</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Engr. Roan Paul Gallegos" /></div>
            <div class="sign-label">Building Maintenance Manager</div>
        </div>
        <div class="sign-block">
            <div style="text-align: left; font-weight: bold; font-size: 12px; margin-bottom: 30px;">Approved By:</div>
            <div class="sign-line"><input type="text" class="table-input" style="text-align:center; font-weight:bold;" placeholder="Ms. Lorraine Ashley Laranang-Josue" /></div>
            <div class="sign-label">Property Management Office</div>
        </div>
    </div>

    <!-- Copies Section -->
    <div class="copies-section">
        <strong>Copies:</strong>
        <label><input type="checkbox" class="checkbox" /> Property Management Office</label>
        <label><input type="checkbox" class="checkbox" /> Building Maintenance Office</label>
        <label><input type="checkbox" class="checkbox" /> Unit Owner / Tenant</label>
    </div>

`;
}

// ==================== DIRECT FORM IFRAME HANDLERS & PRINT ENGINE ====================

function autofillFormIframeData() {
  const iframe = document.getElementById('active-a4-form-iframe');
  if (!iframe) return;
  
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (!doc) return;
    
    const inputs = doc.querySelectorAll('input[type="text"], input:not([type])');
    const sampleValues = [
      'Unit 402', 'August 01, 2026', 'John Doe', 'Apex Fit-Out & Construction Corp',
      '₱250,000.00', '0917-555-0199', 'john.doe@example.com', 'Engr. Mike Smith',
      'Session Road, Baguio City', 'WO-2026-088', '4th Floor'
    ];
    
    inputs.forEach((input, idx) => {
      if (!input.value) {
        input.value = sampleValues[idx % sampleValues.length];
        input.setAttribute('value', input.value);
      }
    });

    const textareas = doc.querySelectorAll('textarea');
    textareas.forEach(ta => {
      if (!ta.value) {
        ta.value = 'Fit-out works including interior drywall partitions, PPR plumbing lines, and LED lighting.';
      }
    });

    const checkboxes = doc.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb, idx) => {
      if (idx % 2 === 0) {
        cb.checked = true;
        cb.setAttribute('checked', 'checked');
      }
    });
    
    resizeFormIframe();
  } catch(err) {
    console.log('Autofill error:', err);
  }
}

// Add load event listener to auto-resize preview iframe
document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('active-a4-form-iframe');
  if (iframe) {
    iframe.addEventListener('load', resizeFormIframe);
  }
});

function resizeFormIframe() {
  const iframe = document.getElementById('active-a4-form-iframe');
  if (!iframe) return;
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (doc && doc.body) {
      doc.body.style.overflow = 'visible';
      const container = doc.querySelector('.document-container') || doc.body;
      const reqHeight = Math.max(
        container.scrollHeight,
        container.offsetHeight,
        doc.documentElement.scrollHeight,
        doc.documentElement.offsetHeight,
        doc.body.scrollHeight,
        1800
      );
      iframe.style.height = (reqHeight + 80) + 'px';
    }
  } catch(e) {
    console.log('Iframe resize notice:', e);
  }
}

function selectA4FormFile(fileName) {
  const iframe = document.getElementById('active-a4-form-iframe');
  if (iframe) {
    iframe.style.height = '2400px';
    iframe.src = 'forms/' + fileName;
    
    const runResize = () => {
      resizeFormIframe();
    };

    iframe.onload = function() {
      runResize();
      setTimeout(runResize, 100);
      setTimeout(runResize, 300);
      setTimeout(runResize, 800);
      setTimeout(runResize, 1500);
    };
  }
}

function printActiveA4FormIframe() {
  const activeIframe = document.getElementById('active-a4-form-iframe');
  const selector = document.getElementById('bm-form-selector');
  const fileName = selector ? selector.value : 'fit_out_forms.html';

  if (!activeIframe) return;

  try {
    const formDoc = activeIframe.contentDocument || activeIframe.contentWindow.document;
    if (formDoc) {
      // Sync active inputs into DOM attributes
      const inputs = formDoc.querySelectorAll('input, textarea, select');
      inputs.forEach(inp => {
        if (inp.type === 'checkbox' || inp.type === 'radio') {
          if (inp.checked) inp.setAttribute('checked', 'checked');
          else inp.removeAttribute('checked');
        } else {
          inp.setAttribute('value', inp.value);
        }
      });

      const htmlContent = formDoc.documentElement.outerHTML;

      // Open clean isolated print window (prevents dashboard elements from printing)
      const printWin = window.open('forms/' + fileName, '_blank', 'width=850,height=1100');
      if (printWin) {
        printWin.onload = function() {
          try {
            printWin.document.open();
            printWin.document.write(htmlContent);
            printWin.document.close();
          } catch(e) {}

          setTimeout(() => {
            printWin.focus();
            printWin.print();
            setTimeout(() => { printWin.close(); }, 500);
          }, 350);
        };
      }
    }
  } catch(err) {
    console.log('Print error:', err);
    window.print();
  }
}