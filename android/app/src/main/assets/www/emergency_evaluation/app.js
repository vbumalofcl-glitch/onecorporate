// One Corporate Post-Earthquake & Emergency Safety Evaluation - Core JS Module

// Seed steps matching ATC-20 Guidelines & Severe Weather Protocols
const TYPHOON_ASSESSMENT_STEPS = {
  exterior: [
    { id: 'typ_ext_1', item: 'Roofing membrane, metal flashing & coping — no torn, lifted, or missing sections' },
    { id: 'typ_ext_2', item: 'Roof drain scuppers & rainwater downspouts — 100% clear of debris or blockages' },
    { id: 'typ_ext_3', item: 'Window sealants & curtain wall glazing — no water penetration or glass stress cracks' },
    { id: 'typ_ext_4', item: 'Parapet walls & rooftop equipment — anchor bolts and guy wires tight and secure' },
    { id: 'typ_ext_5', item: 'Canopies, awnings & outdoor signage — structural welds and bolts intact' },
    { id: 'typ_ext_6', item: 'Exterior louvers & facade panels — no loose cladding or wind dislodgement' },
    { id: 'typ_ext_7', item: 'Perimeter trees & landscaping — no fallen branches, roots, or power line contact' },
    { id: 'typ_ext_8', item: 'Basement flood barriers & flood gates — deployed and sealed properly' }
  ],
  structural: [
    { id: 'typ_str_1', item: 'Roof trusses & structural steel framing — no wind uplift deformation or distortion' },
    { id: 'typ_str_2', item: 'Concrete parapets & shear wall interfaces — no wind-load stress cracks' },
    { id: 'typ_str_3', item: 'Expansion joints & roof movement joints — water tight seal maintained' },
    { id: 'typ_str_4', item: 'Basement retaining walls & foundation — no water seepage, hydrostatic pressure boils' }
  ],
  nonstructural: [
    { id: 'typ_non_1', item: 'Perimeter office windows & glass facade — no wind driven rain leakage at sills' },
    { id: 'typ_non_2', item: 'Drop ceilings near exterior walls / windows — no water staining or water accumulation' },
    { id: 'typ_non_3', item: 'Exterior doors & emergency exit doors — latches and weather seals holding firm' },
    { id: 'typ_non_4', item: 'Rooftop solar arrays & antenna masts — mounting brackets and tie-downs undamaged' }
  ],
  utilities: [
    { id: 'typ_ut_1', item: 'Basement sump pumps — primary and backup pumps tested and fully operational' },
    { id: 'typ_ut_2', item: 'Emergency diesel generator — fuel tank filled, automatic transfer switch (ATS) ready' },
    { id: 'typ_ut_3', item: 'Domestic water pumps & rainwater harvesting tank — backflow valves functioning' },
    { id: 'typ_ut_4', item: 'Outdoor electrical transformers & switchgear — dry, elevated, no water immersion' }
  ],
  firesafety: [
    { id: 'typ_fs_1', item: 'Fire alarm control panel — no water damage or short circuit trouble signals' },
    { id: 'typ_fs_2', item: 'Emergency exit stairwells — dry, well lit, emergency batteries charged' },
    { id: 'typ_fs_3', item: 'Fire pump room — basement drainage clear, no flooding around fire pumps' }
  ],
  elevators: [
    { id: 'typ_el_1', item: 'Elevator pits — dry, no water accumulation; sump pumps clear' },
    { id: 'typ_el_2', item: 'Elevator machine room / penthouse roof — no roof leaks onto traction motors or drives' },
    { id: 'typ_el_3', item: 'Park high-zone cabs at upper floors if basement flooding risk is high' }
  ]
};

const FLOOD_ASSESSMENT_STEPS = {
  exterior: [
    { id: 'fld_ext_1', item: 'Basement 1, 2, 3 flood barrier gates — deployed, sealed, and no perimeter water seepage' },
    { id: 'fld_ext_2', item: 'Ground level storm drain grates & gutters — 100% clear of leaves, trash, or silt' },
    { id: 'fld_ext_3', item: 'Rooftop rainwater scuppers & downspouts — unobstructed flow, no roof ponding' },
    { id: 'fld_ext_4', item: 'Street curb intake & driveway trench drains — free-flowing discharge to municipal storm sewer' },
    { id: 'fld_ext_5', item: 'Exterior wall expansion joints & basement perimeter waterproofing — no water ingress' },
    { id: 'fld_ext_6', item: 'Ground level entrance doors & glass curtain wall sills — weather stripping intact, no water leaks' }
  ],
  structural: [
    { id: 'fld_str_1', item: 'Basement 3 foundation slab & retaining walls — no hydrostatic pressure boils or water seepage' },
    { id: 'fld_str_2', item: 'Cistern & water storage tank structures — no cracks, water intrusion, or contamination' },
    { id: 'fld_str_3', item: 'Sub-grade elevator shaft pits & buffer channels — dry, no water accumulation' },
    { id: 'fld_str_4', item: 'Concrete ramp driveways & drainage swales — no erosion, structural settlement, or cracks' }
  ],
  nonstructural: [
    { id: 'fld_non_1', item: 'Ground lobby & basement 1 drywall/ceilings — no water stains, moisture, or sagging' },
    { id: 'fld_non_2', item: 'Basement tenant storage lockers & parking slots — dry, elevated off slab floor' },
    { id: 'fld_non_3', item: 'Exterior window sills & louvers — sealed against wind-driven rain penetration' },
    { id: 'fld_non_4', item: 'Ground floor perimeter doors & emergency exits — flood threshold seals holding firm' }
  ],
  utilities: [
    { id: 'fld_ut_1', item: 'Basement 3 & 2 submersible sump pumps — automatic float switches verified & operational' },
    { id: 'fld_ut_2', item: 'Main electrical distribution panel (MDP) & transformer vault — dry, elevated above flood level' },
    { id: 'fld_ut_3', item: 'Emergency generator day tank & fuel lines — protected against floodwater contamination' },
    { id: 'fld_ut_4', item: 'Domestic water transfer pumps & chlorination system — clear of flood water immersion' },
    { id: 'fld_ut_5', item: 'Sewage Treatment Plant (STP) aeration blowers & effluent pumps — operating normally' }
  ],
  firesafety: [
    { id: 'fld_fs_1', item: 'Main fire pump room & jockey pumps — basement drainage clear, zero water around pump bases' },
    { id: 'fld_fs_2', item: 'Fire alarm control panel & emergency batteries — dry, no short-circuit fault alarms' },
    { id: 'fld_fs_3', item: 'Emergency stairwells & egress corridors — dry underfoot, emergency lighting active' }
  ],
  elevators: [
    { id: 'fld_el_1', item: 'Elevator pits (B3) — dry, sump pump float switches tested & verified active' },
    { id: 'fld_el_2', item: 'Park elevator cabs at 2nd floor or above if severe basement flood alert is active' },
    { id: 'fld_el_3', item: 'Inspect elevator pit travelling cables and buffer springs for water contact' }
  ]
};

const EQ_ASSESSMENT_STEPS = {
  exterior: [
    { id: 'eq_ext_1', item: 'Overall building alignment — no visible leaning, tilting, or racking' },
    { id: 'eq_ext_2', item: 'Foundation — visible cracking, heaving, or settlement' },
    { id: 'eq_ext_3', item: 'Exterior walls / cladding — cracking, spalling, or detachment' },
    { id: 'eq_ext_4', item: 'Parapets, cornices, and rooftop equipment — displacement or falling hazard' },
    { id: 'eq_ext_5', item: 'Windows and glazing — cracked, shattered, or dislodged panes' },
    { id: 'eq_ext_6', item: 'Canopies, awnings, and signage — secure attachment' },
    { id: 'eq_ext_7', item: 'Adjacent structures — risk of collapse onto this building or its exits' },
    { id: 'eq_ext_8', item: 'Ground / pavement — new cracks, settlement, or liquefaction signs (sand boils)' },
    { id: 'eq_ext_9', item: 'Overhead utility lines — downed, sagging, or sparking' },
    { id: 'eq_ext_10', item: 'Gas odor detected near the exterior of the building' }
  ],
  structural: [
    { id: 'eq_str_1', item: 'Columns and beams — cracking, spalling, or exposed reinforcement' },
    { id: 'eq_str_2', item: 'Load-bearing / shear walls — diagonal or X-pattern cracking' },
    { id: 'eq_str_3', item: 'Beam-column connections — visible distress or separation' },
    { id: 'eq_str_4', item: 'Floor slabs — sagging, new cracking, or unevenness underfoot' },
    { id: 'eq_str_5', item: 'Staircases and stairwells — cracking, separation from walls, distortion' },
    { id: 'eq_str_6', item: 'Basement / foundation walls — cracking or new water intrusion' },
    { id: 'eq_str_7', item: 'Expansion / seismic joints — excessive movement or separation' }
  ],
  nonstructural: [
    { id: 'eq_non_1', item: 'Suspended ceilings and tiles — dislodged or fallen sections' },
    { id: 'eq_non_2', item: 'Light fixtures — securely fastened, none hanging loose' },
    { id: 'eq_non_3', item: 'Interior partition walls — cracking or separation from ceiling/floor' },
    { id: 'eq_non_4', item: 'Built-in cabinetry, shelving, and storage racks — toppled or unstable' },
    { id: 'eq_non_5', item: 'Curtain wall / interior glazing — cracked panels or loose framing' },
    { id: 'eq_non_6', item: 'Interior finishes — cracked plaster or drywall' }
  ],
  utilities: [
    { id: 'eq_ut_1', item: 'Electrical panels — doors closed, no exposed wiring, no burning smell' },
    { id: 'eq_ut_2', item: 'Gas system — no odor detected; shut-off valve accessible and functioning' },
    { id: 'eq_ut_3', item: 'Water / plumbing — no burst pipes, active leaks, or flooding' },
    { id: 'eq_ut_4', item: 'HVAC equipment — anchoring intact, no displacement, ductwork secure' },
    { id: 'eq_ut_5', item: 'Emergency generator — no fuel/oil leaks; starts and runs correctly' },
    { id: 'eq_ut_6', item: 'Rooftop / domestic water tanks — anchoring and support structure intact' }
  ],
  firesafety: [
    { id: 'eq_fs_1', item: 'Fire sprinkler system — no visible pipe damage or leaks; normal pressure' },
    { id: 'eq_fs_2', item: 'Fire pump — operational, undamaged' },
    { id: 'eq_fs_3', item: 'Standpipes and hose cabinets — accessible and undamaged' },
    { id: 'eq_fs_4', item: 'Fire alarm control panel — no trouble or fault indications' },
    { id: 'eq_fs_5', item: 'Smoke detectors — powered and functioning' },
    { id: 'eq_fs_6', item: 'Emergency / exit lighting — functional' },
    { id: 'eq_fs_7', item: 'Exit signage — illuminated and clearly visible' },
    { id: 'eq_fs_8', item: 'Fire extinguishers — in place, charged, and accessible' },
    { id: 'eq_fs_9', item: 'Egress paths (corridors, stairwells, exits) — clear and unobstructed' }
  ],
  elevators: [
    { id: 'eq_el_1', item: 'Take all elevators out of service and lock out controls pending check' },
    { id: 'eq_el_2', item: 'Inspect elevator machine room — equipment secure, no visible damage' },
    { id: 'eq_el_3', item: 'Inspect escalators, if present, before returning to service' },
    { id: 'eq_el_4', item: 'Post out-of-service notices at every elevator lobby bank' }
  ]
};

const UTILITY_FAILURE_ASSESSMENT_STEPS = {
  exterior: [
    { id: 'utf_ext_1', item: 'Initial triage & utility identification — confirm which utility failed (Power, Gas, Water, or combination) & scope (whole building, wing/floor, or single unit)' },
    { id: 'utf_ext_2', item: 'Utility provider outage status — check electric/gas/water provider outage map and hotline for grid outage verification' },
    { id: 'utf_ext_3', item: 'Outage classification — verify planned/scheduled outage (utility maintenance) vs unplanned sudden failure' },
    { id: 'utf_ext_4', item: 'Building service entrance equipment — inspect main breakers, meters, and main shut-off valves before assuming grid fault' },
    { id: 'utf_ext_5', item: 'Utility notification log — log outage start time, origin report, utility ticket/reference #, and estimated restoration time (ETA)' },
    { id: 'utf_ext_6', item: 'Service line physical inspection — inspect overhead lines, transformer pad, water meter vaults, and gas service risers for external damage or sparking' }
  ],
  structural: [
    { id: 'utf_str_1', item: 'HVAC & indoor climate control — monitor heating, cooling, and ventilation loss; assess tenant thermal comfort and health risks' },
    { id: 'utf_str_2', item: 'Standing water & flooding risk — check for burst pipes upon water restoration, failed sump pumps, or cistern overflows' },
    { id: 'utf_str_3', item: 'Freeze / thermal stress risk — in cold conditions, monitor exposed plumbing and riser pipes for freezing, bursting, or pressure surge' },
    { id: 'utf_str_4', item: 'Foundation sumps & drainage basins — check perimeter sumps, gravity drains, and basement retention pits for backflow or water accumulation' }
  ],
  nonstructural: [
    { id: 'utf_non_1', item: 'Vulnerable occupants welfare check — perform direct in-person welfare checks on tenants dependent on electricity for medical equipment or refrigerated medication' },
    { id: 'utf_non_2', item: 'Perishable inventory & cold-chain protection — alert commercial tenants, food services, cafeterias, and labs regarding refrigeration loss and spoilage timelines' },
    { id: 'utf_non_3', item: 'IT server rooms, data centers & telecom hubs — check UPS battery runtimes, climate control, and initiate orderly shutdowns if needed to prevent data loss' },
    { id: 'utf_non_4', item: 'Electronic access control & security doors — verify all card readers, maglocks, and turnstiles fail-secure / fail-safe properly without trapping occupants' },
    { id: 'utf_non_5', item: 'Restrooms & domestic water fixtures — post out-of-service signage if water is lost; deploy supplementary hand sanitizer stations on affected floors' },
    { id: 'utf_non_6', item: 'Building communications & intercom — verify building intercom, mass notification system, emergency phone landlines, and two-way radios are operational' }
  ],
  utilities: [
    { id: 'utf_ut_1', item: 'Main electrical distribution panel (MDP) & sub-meters — check tripped main breakers, transformer vault status, and utility grid feeder' },
    { id: 'utf_ut_2', item: 'Emergency standby diesel generator & ATS — auto-start verified, voltage/frequency stable, adequate diesel fuel and engine oil, exhaust routed safely outdoors' },
    { id: 'utf_ut_3', item: 'Basement submersible sump pumps — verified operational on emergency power where basement or pit flooding risk exists' },
    { id: 'utf_ut_4', item: 'Gas odor & leak detection — zero mercaptan smell; if gas odor detected, immediately evacuate, avoid electrical switches, and call 911/gas utility' },
    { id: 'utf_ut_5', item: 'Gas meter, main shut-off valve & boiler controls — accessible and undamaged; boilers and gas water heaters confirmed in safe shutdown' },
    { id: 'utf_ut_6', item: 'Carbon monoxide (CO) detectors — present, powered, and functioning properly near fuel-burning equipment and generator exhaust routes' },
    { id: 'utf_ut_7', item: 'Domestic water pressure & rooftop storage tanks — verify supply level, booster pump operation, and extent of pressure loss (partial vs total)' },
    { id: 'utf_ut_8', item: 'Water quality & boil-water advisories — check utility advisories, backflow preventers, and verify water supply is uncontaminated' },
    { id: 'utf_ut_9', item: 'Domestic hot water and boiler controls — safely shut down or running on emergency circuit as designed' }
  ],
  firesafety: [
    { id: 'utf_fs_1', item: 'Fire alarm control panel (FACP) — operating reliably on battery backup with no unaddressed trouble/fault signals' },
    { id: 'utf_fs_2', item: 'Fire sprinkler system water supply & riser pressure — verified intact; notify BFP / Local Fire Dept immediately if sprinkler water is compromised' },
    { id: 'utf_fs_3', item: 'Emergency & exit lighting units — battery backup engaged and functional with adequate illumination along all egress paths and stairwells' },
    { id: 'utf_fs_4', item: 'Fire pump room & jockey pumps — standby generator circuit verified ready; suction tank full' }
  ],
  elevators: [
    { id: 'utf_el_1', item: 'Elevator passenger entrapment check — inspect all elevator banks immediately to confirm no occupants are trapped in cabs' },
    { id: 'utf_el_2', item: 'Park and lock out elevators — take all elevators out of service pending utility stabilization; post out-of-service notices at all lobby banks' },
    { id: 'utf_el_3', item: 'Elevator machine room & Automatic Rescue Device (ARD) — verify ARD safely brought cabs to nearest landing; traction machines de-energized safely' }
  ]
};

// Module State (Synchronized with parent app via shared localStorage)
let parentState = {
  tasks: [],
  registry: [],
  complaints: [],
  notifications: [],
  currentUserRole: 'Admin',
  activeTab: 'dashboard',
  currentSafetyEvaluation: null,
  pastSafetyEvaluations: [],
  isManagerAbsent: false
};

let currentEventType = 'Earthquake';
let activeSection = 'wizard'; // wizard, logs, reassurance
let activeWizardStep = 1;
let editingLogId = null; // Tracks if we are editing an existing saved inspection log

function getActiveSteps(eventType = currentEventType) {
  if (eventType === 'Typhoon') return TYPHOON_ASSESSMENT_STEPS;
  if (eventType === 'Flood') return FLOOD_ASSESSMENT_STEPS;
  if (eventType === 'UtilityFailure') return UTILITY_FAILURE_ASSESSMENT_STEPS;
  return EQ_ASSESSMENT_STEPS;
}

function updateEmergencyHeaderDate() {
  const headerDateEl = document.getElementById('header-date');
  if (headerDateEl) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    headerDateEl.innerText = new Date().toLocaleDateString('en-US', options);
  }
  const eqDateEl = document.getElementById('eq-date-time');
  if (eqDateEl && (!eqDateEl.value || eqDateEl.value.startsWith('2026-07-20'))) {
    const now = new Date();
    const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    eqDateEl.value = localIso;
  }
}

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

// Sidebar Hide / Unhide Toggle
window.toggleSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const toggleText = document.getElementById('sidebar-toggle-text');
  if (!sidebar) return;

  const isCollapsed = sidebar.classList.toggle('collapsed');
  
  if (toggleText) {
    toggleText.innerHTML = isCollapsed ? '&raquo;' : '&laquo;';
  }
  if (toggleBtn) {
    toggleBtn.title = isCollapsed ? 'Unhide Sidebar (>>)' : 'Hide Sidebar (<<)';
    toggleBtn.setAttribute('aria-label', isCollapsed ? 'Unhide Sidebar' : 'Hide Sidebar');
  }

  try {
    localStorage.setItem('onecorp_emergency_sidebar_collapsed', isCollapsed ? 'true' : 'false');
  } catch (e) {}
};

function initSidebarState() {
  try {
    const savedState = localStorage.getItem('onecorp_emergency_sidebar_collapsed');
    if (savedState === 'true') {
      const sidebar = document.getElementById('sidebar');
      const toggleBtn = document.getElementById('sidebar-toggle-btn');
      const toggleText = document.getElementById('sidebar-toggle-text');
      if (sidebar) sidebar.classList.add('collapsed');
      if (toggleText) toggleText.innerHTML = '&raquo;';
      if (toggleBtn) {
        toggleBtn.title = 'Unhide Sidebar (>>)';
        toggleBtn.setAttribute('aria-label', 'Unhide Sidebar');
      }
    }
  } catch (e) {}
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebarState();
  loadSharedState();
  renderEmergencyApp();
  updateEmergencyHeaderDate();
});

function loadSharedState() {
  const saved = localStorage.getItem('onecorporate_maintenance_state');
  if (saved) {
    try {
      parentState = JSON.parse(saved);
      if (!parentState.pastSafetyEvaluations) parentState.pastSafetyEvaluations = [];
      if (parentState.isManagerAbsent === undefined) parentState.isManagerAbsent = false;
    } catch (e) {
      console.error("Error reading shared state:", e);
    }
  }

  // Update profile
  const roleText = parentState.currentUserRole.includes('Manager') ? parentState.currentUserRole : parentState.currentUserRole + " User";
  const avatarEl = document.getElementById('current-user-avatar');
  const nameEl = document.getElementById('current-user-name');
  const roleEl = document.getElementById('current-user-role');
  if (avatarEl) avatarEl.innerText = (parentState.currentUserRole || 'AD').substring(0, 2).toUpperCase();
  if (nameEl) nameEl.innerText = (parentState.currentUserRole || 'Admin') + " User";
  if (roleEl) roleEl.innerText = roleText;

  // Restore presence checkbox
  const toggleCheckbox = document.getElementById('manager-absence-toggle');
  if (toggleCheckbox) {
    toggleCheckbox.checked = parentState.isManagerAbsent;
  }
  updateManagerAbsenceBanner();
}

function saveSharedState() {
  localStorage.setItem('onecorporate_maintenance_state', JSON.stringify(parentState));
}

function renderEmergencyApp() {
  switchSection(activeSection);
}

// Manager Absence Handlers
window.toggleManagerAbsence = function(checked) {
  parentState.isManagerAbsent = checked;
  saveSharedState();
  updateManagerAbsenceBanner();
  
  if (!parentState.notifications) parentState.notifications = [];
  parentState.notifications.unshift({
    id: `eq_manager_presence_${Date.now()}`,
    type: checked ? 'major' : 'normal',
    message: checked 
      ? 'EMERGENCY ALARM: Manager marked absent. Assistant manager assumes acting charge of safety audits.'
      : 'EMERGENCY ALARM: Building Manager is present to approve emergency evaluations.',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  if (activeSection === 'wizard' && activeWizardStep === 8) {
    renderTenantSafetyNoticePreviews();
  }
  if (activeSection === 'reassurance') {
    generateComprehensiveReport();
  }
};

function updateManagerAbsenceBanner() {
  const banner = document.getElementById('manager-absence-banner');
  if (banner) {
    banner.style.display = parentState.isManagerAbsent ? 'flex' : 'none';
  }
  
  const signLabel = document.getElementById('notice-manager-title-label');
  if (signLabel) {
    signLabel.innerText = parentState.isManagerAbsent 
      ? 'Acting Approved: Assistant Building Maintenance' 
      : 'Reviewed By: Building Maintenance Manager';
  }
}

// Event Type change handler
window.onEventTypeChange = function(val) {
  currentEventType = val;
  if (parentState.currentSafetyEvaluation) {
    parentState.currentSafetyEvaluation.eventType = val;
    // If not editing an existing custom log, refresh default checklist items
    if (!editingLogId) {
      parentState.currentSafetyEvaluation.checklistItems = JSON.parse(JSON.stringify(getActiveSteps(val)));
      parentState.currentSafetyEvaluation.checklist = {};
      Object.keys(parentState.currentSafetyEvaluation.checklistItems).forEach(stepKey => {
        parentState.currentSafetyEvaluation.checklistItems[stepKey].forEach(item => {
          parentState.currentSafetyEvaluation.checklist[item.id] = { status: 'OK', notes: '', image: null, imageName: '', timestamp: '' };
        });
      });
    }
  }

  const intensityLabel = document.querySelector('label[for="eq-intensity"]');
  const dateLabel = document.querySelector('label[for="eq-date-time"]');
  const pageTitle = document.getElementById('page-title-text');
  
  if (val === 'Typhoon') {
    if (intensityLabel) intensityLabel.innerText = 'Typhoon Name / Signal Category (e.g. Super Typhoon Carina / Signal No. 4)';
    if (dateLabel) dateLabel.innerText = 'Typhoon Landfall / Passage Date & Time';
    if (pageTitle) pageTitle.innerText = 'Post-Typhoon Building Safety & Wind Hazard Evaluation';
  } else if (val === 'Flood') {
    if (intensityLabel) intensityLabel.innerText = 'Rainfall Intensity / Warning Level (e.g. Red Rainfall Warning / 180mm/24h)';
    if (dateLabel) dateLabel.innerText = 'Severe Rain / Flood Event Date & Time';
    if (pageTitle) pageTitle.innerText = 'Severe Rain & Basement Flood Risk Evaluation';
  } else if (val === 'UtilityFailure') {
    if (intensityLabel) intensityLabel.innerText = 'Utility Affected & Scope (e.g. Power / Gas / Water — Building-Wide / Ticket #)';
    if (dateLabel) dateLabel.innerText = 'Outage Start Date & Time';
    if (pageTitle) pageTitle.innerText = 'Post-Utility Failure Building Safety & Service Restoration Assessment';
  } else {
    if (intensityLabel) intensityLabel.innerText = 'Magnitude / Reported Intensity (e.g. Magnitude 6.2 / Intensity VI)';
    if (dateLabel) dateLabel.innerText = 'Earthquake Date & Time';
    if (pageTitle) pageTitle.innerText = 'Post-Earthquake Building Safety Inspection Wizard';
  }

  // Re-render active step tables
  if (activeWizardStep >= 2 && activeWizardStep <= 7) {
    switchWizardStep(activeWizardStep);
  }
};

// Sidebar switcher
window.switchSection = function(sectionId) {
  activeSection = sectionId;
  
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });
  const navItem = document.getElementById(`nav-${sectionId}`);
  if (navItem) navItem.classList.add('active');

  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  const activePanel = document.getElementById(`panel-${sectionId}`);
  if (activePanel) activePanel.classList.add('active');

  let title = 'Post-Earthquake Safety Evaluation (ATC-20)';
  if (sectionId === 'logs') title = 'Inspection History & Audit Logs';
  if (sectionId === 'reassurance') title = 'Comprehensive Reassurance reports';
  if (sectionId === 'guidelines') title = 'Emergency Preparedness & Response Plan (ERP/BERT) Manual';
  document.getElementById('page-title-text').innerText = title;

  if (sectionId === 'wizard') {
    if (!parentState.currentSafetyEvaluation) {
      startNewSafetyEvaluation();
    } else {
      switchWizardStep(activeWizardStep);
    }
  } else if (sectionId === 'logs') {
    renderInspectionLogsTable();
  } else if (sectionId === 'reassurance') {
    populateReassuranceLogsDropdown();
    generateComprehensiveReport();
  } else if (sectionId === 'guidelines') {
    renderEmergencyGuidelines();
    renderEmergencyOrgStructure();
  }
};

// Wizard Flow
window.startNewSafetyEvaluation = function() {
  editingLogId = null;
  const initialSteps = JSON.parse(JSON.stringify(getActiveSteps(currentEventType)));
  
  parentState.currentSafetyEvaluation = {
    id: 'eq_eval_' + Date.now(),
    dateCreated: new Date().toISOString().split('T')[0],
    timeCreated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    eventType: currentEventType,
    buildingName: 'One Corporate Building',
    address: '101 Financial District, Metro Manila',
    eqDate: new Date().toISOString().split('T')[0] + 'T13:00',
    intensity: currentEventType === 'Typhoon' 
      ? 'Super Typhoon Carina (Signal No. 3)' 
      : (currentEventType === 'Flood' 
          ? 'Red Rainfall Warning (180mm/24h)' 
          : (currentEventType === 'UtilityFailure' 
              ? 'Power & Water Outage (Building-wide / Grid Failure)' 
              : 'Magnitude 6.2 / Intensity VI')),
    team: 'Engr. John Doe, Engr. Jane Smith',
    checklistItems: initialSteps,
    checklist: {},
    officialPlacard: 'GREEN',
    signInspector: 'John Doe, Lead Engineer',
    signManager: parentState.isManagerAbsent ? 'Jane Watson, Assistant Building Maintenance' : 'Robert Smith, Building Maintenance Manager',
    signStructural: 'Engr. Mark Cruz, PE'
  };

  // Seed default items in checklist object
  Object.keys(initialSteps).forEach(stepKey => {
    initialSteps[stepKey].forEach(item => {
      parentState.currentSafetyEvaluation.checklist[item.id] = {
        status: 'OK',
        notes: '',
        image: null,
        imageName: '',
        timestamp: ''
      };
    });
  });

  // Reset edit UI states
  updateEditModeBanner();

  activeWizardStep = 1;
  saveSharedState();
  switchWizardStep(1);
};

function updateEditModeBanner() {
  const banner = document.getElementById('editing-log-banner');
  const cancelBtn = document.getElementById('btn-cancel-edit-eval');
  const submitBtn = document.getElementById('btn-submit-eq');
  const badgeText = document.getElementById('editing-log-badge-text');

  if (editingLogId) {
    if (banner) banner.style.display = 'flex';
    if (cancelBtn) cancelBtn.style.display = 'inline-flex';
    if (badgeText) badgeText.innerText = `Editing Saved Inspection Record (Log ID: ${editingLogId})`;
    if (submitBtn) submitBtn.innerText = 'Update & Save Changes to Log';
  } else {
    if (banner) banner.style.display = 'none';
    if (cancelBtn) cancelBtn.style.display = 'none';
    if (submitBtn) submitBtn.innerText = 'Save Inspection & Generate Report';
  }
}

window.switchWizardStep = function(stepNum) {
  activeWizardStep = stepNum;
  
  document.querySelectorAll('#wizard-nav-list button').forEach((btn, idx) => {
    btn.classList.remove('active');
    if (idx + 1 === stepNum) btn.classList.add('active');
  });

  document.querySelectorAll('.wizard-pane').forEach((pane, idx) => {
    pane.classList.remove('active');
    if (idx + 1 === stepNum) pane.classList.add('active');
  });

  syncWizardInputsToState();

  // Populate tables for visual checklist steps
  if (stepNum === 2) drawChecklistTable('exterior', 'eq-table-exterior');
  if (stepNum === 3) drawChecklistTable('structural', 'eq-table-structural');
  if (stepNum === 4) drawChecklistTable('nonstructural', 'eq-table-nonstructural');
  if (stepNum === 5) drawChecklistTable('utilities', 'eq-table-utilities');
  if (stepNum === 6) drawChecklistTable('firesafety', 'eq-table-firesafety');
  if (stepNum === 7) drawChecklistTable('elevators', 'eq-table-elevators');
  if (stepNum === 8) {
    updateEditModeBanner();
    calculateSuggestedPlacard();
    renderTenantSafetyNoticePreviews();
  }
};

function syncWizardInputsToState() {
  if (!parentState.currentSafetyEvaluation) return;
  const evalObj = parentState.currentSafetyEvaluation;
  
  const eventTypeEl = document.getElementById('eq-event-type');
  if (eventTypeEl) evalObj.eventType = eventTypeEl.value;

  const bName = document.getElementById('eq-building-name');
  if (bName) evalObj.buildingName = bName.value;
  
  const bAddr = document.getElementById('eq-building-address');
  if (bAddr) evalObj.address = bAddr.value;
  
  const eqDate = document.getElementById('eq-date-time');
  if (eqDate) evalObj.eqDate = eqDate.value;
  
  const eqInt = document.getElementById('eq-intensity');
  if (eqInt) evalObj.intensity = eqInt.value;
  
  const team = document.getElementById('eq-inspection-team');
  if (team) evalObj.team = team.value;

  const overridePlacard = document.getElementById('eq-override-placard');
  if (overridePlacard) evalObj.officialPlacard = overridePlacard.value;

  const signInspector = document.getElementById('eq-sign-inspector');
  if (signInspector) evalObj.signInspector = signInspector.value;

  const signManager = document.getElementById('eq-sign-manager');
  if (signManager) evalObj.signManager = signManager.value;

  const signStructural = document.getElementById('eq-sign-structural');
  if (signStructural) evalObj.signStructural = signStructural.value;
}

// ==================== EDITABLE CHECKLIST ITEMS & PER-ITEM PHOTOS ====================

function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function drawChecklistTable(stepKey, tableId) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;
  tbody.innerHTML = '';

  const evalObj = parentState.currentSafetyEvaluation;
  if (!evalObj) return;

  if (!evalObj.checklistItems || !evalObj.checklistItems[stepKey]) {
    if (!evalObj.checklistItems) evalObj.checklistItems = {};
    evalObj.checklistItems[stepKey] = JSON.parse(JSON.stringify(getActiveSteps(evalObj.eventType)[stepKey] || []));
  }

  const items = evalObj.checklistItems[stepKey] || [];

  items.forEach((item, idx) => {
    const tr = document.createElement('tr');
    
    if (!evalObj.checklist[item.id]) {
      evalObj.checklist[item.id] = { status: 'OK', notes: '', image: null, imageName: '', timestamp: '' };
    }
    const statusVal = evalObj.checklist[item.id].status || 'OK';
    const noteVal = evalObj.checklist[item.id].notes || '';
    const itemImg = evalObj.checklist[item.id].image || null;

    let photoCellHtml = '';
    if (itemImg) {
      photoCellHtml = `
        <div class="item-photo-preview-wrap" onclick="openEmergencyLightbox('${itemImg}', '${escapeHtml(item.item)}')">
          <img src="${itemImg}" alt="Assessment photo">
          <button type="button" class="item-photo-remove-btn" title="Remove photo" onclick="event.stopPropagation(); removeItemPhoto('${item.id}', '${stepKey}', '${tableId}')">&times;</button>
        </div>
      `;
    } else {
      photoCellHtml = `
        <input type="file" id="photo-input-${item.id}" accept="image/*" style="display:none;" onchange="handleItemPhotoUpload('${item.id}', '${stepKey}', '${tableId}', event)">
        <button type="button" class="item-photo-upload-btn" onclick="document.getElementById('photo-input-${item.id}').click()">
          📷 Add Photo
        </button>
      `;
    }

    tr.innerHTML = `
      <td style="text-align: center; font-weight: 700; color: var(--text-muted); font-size: 11px;">${idx + 1}</td>
      <td>
        <input type="text" class="checklist-item-input" value="${escapeHtml(item.item)}" placeholder="Inspection item description..." oninput="updateChecklistItemText('${stepKey}', '${item.id}', this.value)">
      </td>
      <td>
        <select style="width: 100%;" onchange="updateChecklistItemStatus('${item.id}', this.value)">
          <option value="OK" ${statusVal === 'OK' ? 'selected' : ''}>OK / Functional</option>
          <option value="Issue" ${statusVal === 'Issue' ? 'selected' : ''}>Issue / Damage</option>
          <option value="N/A" ${statusVal === 'N/A' ? 'selected' : ''}>N/A</option>
        </select>
      </td>
      <td>
        <input type="text" value="${escapeHtml(noteVal)}" placeholder="Location & finding details..." oninput="updateChecklistItemNotes('${item.id}', this.value)">
      </td>
      <td style="text-align: center;">
        ${photoCellHtml}
      </td>
      <td style="text-align: center;">
        <button type="button" class="btn-delete-row" title="Delete this check item" onclick="removeChecklistItem('${stepKey}', '${item.id}', '${tableId}')">&times;</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.updateChecklistItemText = function(stepKey, itemId, newText) {
  if (!parentState.currentSafetyEvaluation) return;
  const items = parentState.currentSafetyEvaluation.checklistItems[stepKey] || [];
  const target = items.find(i => i.id === itemId);
  if (target) {
    target.item = newText;
    saveSharedState();
  }
};

window.addCustomChecklistItem = function(stepKey) {
  if (!parentState.currentSafetyEvaluation) return;
  if (!parentState.currentSafetyEvaluation.checklistItems) {
    parentState.currentSafetyEvaluation.checklistItems = JSON.parse(JSON.stringify(getActiveSteps(currentEventType)));
  }

  const newId = `${stepKey}_custom_${Date.now()}`;
  const newItem = {
    id: newId,
    item: 'Custom Inspection Check — specify specific area or condition'
  };

  parentState.currentSafetyEvaluation.checklistItems[stepKey].push(newItem);
  parentState.currentSafetyEvaluation.checklist[newId] = {
    status: 'OK',
    notes: '',
    image: null,
    imageName: '',
    timestamp: ''
  };

  saveSharedState();
  
  // Re-draw table
  const tableMap = {
    exterior: 'eq-table-exterior',
    structural: 'eq-table-structural',
    nonstructural: 'eq-table-nonstructural',
    utilities: 'eq-table-utilities',
    firesafety: 'eq-table-firesafety',
    elevators: 'eq-table-elevators'
  };
  if (tableMap[stepKey]) {
    drawChecklistTable(stepKey, tableMap[stepKey]);
  }
};

window.removeChecklistItem = function(stepKey, itemId, tableId) {
  if (!parentState.currentSafetyEvaluation) return;
  if (confirm("Remove this visual inspection item from the checklist?")) {
    const items = parentState.currentSafetyEvaluation.checklistItems[stepKey] || [];
    parentState.currentSafetyEvaluation.checklistItems[stepKey] = items.filter(i => i.id !== itemId);
    if (parentState.currentSafetyEvaluation.checklist[itemId]) {
      delete parentState.currentSafetyEvaluation.checklist[itemId];
    }
    saveSharedState();
    drawChecklistTable(stepKey, tableId);
  }
};

// Photo Compression & Upload Handler
function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Not an image file'));
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', 0.82);
        resolve(compressed);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

window.handleItemPhotoUpload = async function(itemId, stepKey, tableId, event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  try {
    const compressedUrl = await compressImageFile(file);
    if (parentState.currentSafetyEvaluation) {
      if (!parentState.currentSafetyEvaluation.checklist[itemId]) {
        parentState.currentSafetyEvaluation.checklist[itemId] = { status: 'OK', notes: '' };
      }
      parentState.currentSafetyEvaluation.checklist[itemId].image = compressedUrl;
      parentState.currentSafetyEvaluation.checklist[itemId].imageName = file.name;
      parentState.currentSafetyEvaluation.checklist[itemId].timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      saveSharedState();
      drawChecklistTable(stepKey, tableId);
    }
  } catch(err) {
    console.error("Failed to upload assessment photo:", err);
    alert("Could not process image file. Please try a different photo.");
  }
};

window.removeItemPhoto = function(itemId, stepKey, tableId) {
  if (parentState.currentSafetyEvaluation && parentState.currentSafetyEvaluation.checklist[itemId]) {
    parentState.currentSafetyEvaluation.checklist[itemId].image = null;
    parentState.currentSafetyEvaluation.checklist[itemId].imageName = '';
    parentState.currentSafetyEvaluation.checklist[itemId].timestamp = '';
    saveSharedState();
    drawChecklistTable(stepKey, tableId);
  }
};

window.openEmergencyLightbox = function(src, caption) {
  const modal = document.getElementById('emergency-image-lightbox');
  const img = document.getElementById('emergency-lightbox-img');
  const cap = document.getElementById('emergency-lightbox-caption');
  if (!modal || !img) return;

  img.src = src;
  if (cap) {
    cap.innerText = caption || 'Inspection Photographic Evidence';
    cap.style.display = caption ? 'block' : 'none';
  }
  modal.style.display = 'flex';
};

window.closeEmergencyLightbox = function(event) {
  if (event && event.target && event.target.id !== 'emergency-image-lightbox' && !event.target.classList.contains('lightbox-close')) {
    return;
  }
  const modal = document.getElementById('emergency-image-lightbox');
  if (modal) modal.style.display = 'none';
};

window.updateChecklistItemStatus = function(itemId, statusVal) {
  if (parentState.currentSafetyEvaluation) {
    if (!parentState.currentSafetyEvaluation.checklist[itemId]) {
      parentState.currentSafetyEvaluation.checklist[itemId] = { status: 'OK', notes: '' };
    }
    parentState.currentSafetyEvaluation.checklist[itemId].status = statusVal;
    saveSharedState();
  }
};

window.updateChecklistItemNotes = function(itemId, noteVal) {
  if (parentState.currentSafetyEvaluation) {
    if (!parentState.currentSafetyEvaluation.checklist[itemId]) {
      parentState.currentSafetyEvaluation.checklist[itemId] = { status: 'OK', notes: '' };
    }
    parentState.currentSafetyEvaluation.checklist[itemId].notes = noteVal;
    saveSharedState();
  }
};

function calculateSuggestedPlacard() {
  const evalObj = parentState.currentSafetyEvaluation;
  if (!evalObj) return;

  const eventType = evalObj.eventType || currentEventType || 'Earthquake';
  let suggested = 'GREEN';
  let desc = 'No apparent hazards. Safe to occupy.';

  if (eventType === 'UtilityFailure') {
    const fireItems = (evalObj.checklistItems && evalObj.checklistItems['firesafety'] ? evalObj.checklistItems['firesafety'] : UTILITY_FAILURE_ASSESSMENT_STEPS['firesafety']).map(i => i.id);
    const utilityItems = (evalObj.checklistItems && evalObj.checklistItems['utilities'] ? evalObj.checklistItems['utilities'] : UTILITY_FAILURE_ASSESSMENT_STEPS['utilities']).map(i => i.id);
    
    let lifeSafetyOrGasIssues = 0;
    let utilityIssuesCount = 0;
    let generalIssuesCount = 0;

    Object.keys(evalObj.checklist).forEach(key => {
      if (evalObj.checklist[key].status === 'Issue') {
        if (key === 'utf_ut_4' || fireItems.includes(key) || key === 'utf_el_1') {
          lifeSafetyOrGasIssues++;
        } else if (utilityItems.includes(key)) {
          utilityIssuesCount++;
        } else {
          generalIssuesCount++;
        }
      }
    });

    if (lifeSafetyOrGasIssues > 0 || utilityIssuesCount >= 3) {
      suggested = 'RED';
      desc = 'Critical / Extended Outage or Life-Safety Compromised. Evacuate if unsafe.';
    } else if (utilityIssuesCount > 0 || generalIssuesCount > 0) {
      suggested = 'YELLOW';
      desc = 'Partial / Localized Impact. Restrictions in place. Monitor backup systems.';
    } else {
      suggested = 'GREEN';
      desc = 'Service Restored / Minimal Impact. Normal operations.';
    }
  } else {
    const structuralItems = (evalObj.checklistItems && evalObj.checklistItems['structural'] ? evalObj.checklistItems['structural'] : EQ_ASSESSMENT_STEPS['structural']).map(i => i.id);
    const utilityItems = (evalObj.checklistItems && evalObj.checklistItems['utilities'] ? evalObj.checklistItems['utilities'] : EQ_ASSESSMENT_STEPS['utilities']).map(i => i.id);
    
    let structuralIssuesCount = 0;
    let utilityIssuesCount = 0;
    let generalIssuesCount = 0;

    Object.keys(evalObj.checklist).forEach(key => {
      if (evalObj.checklist[key].status === 'Issue') {
        if (structuralItems.includes(key)) structuralIssuesCount++;
        else if (utilityItems.includes(key)) utilityIssuesCount++;
        else generalIssuesCount++;
      }
    });

    if (structuralIssuesCount >= 2 || (utilityIssuesCount >= 2 && structuralIssuesCount >= 1)) {
      suggested = 'RED';
      desc = 'Serious Structural/Utility damage. Collapse hazard. DO NOT OCCUPY.';
    } else if (structuralIssuesCount > 0 || utilityIssuesCount > 0 || generalIssuesCount >= 3) {
      suggested = 'YELLOW';
      desc = 'Restricted occupancy. Barricade local damaged areas.';
    }
  }

  const box = document.getElementById('suggested-placard-box');
  const title = document.getElementById('suggested-placard-title');
  const dText = document.getElementById('suggested-placard-desc');
  
  if (box && title && dText) {
    box.className = 'suggested-placard-glow';
    box.classList.add(`placard-${suggested.toLowerCase()}`);
    title.innerText = suggested;
    dText.innerText = desc;
  }

  const overrideDropdown = document.getElementById('eq-override-placard');
  if (overrideDropdown && !overrideDropdown.dataset.userModified) {
    overrideDropdown.value = suggested;
    evalObj.officialPlacard = suggested;
    updateOfficialPlacardDisplay(suggested);
  }
}

window.updateOfficialPlacardDisplay = function(val) {
  const overrideDropdown = document.getElementById('eq-override-placard');
  if (overrideDropdown) overrideDropdown.dataset.userModified = 'true';
  if (parentState.currentSafetyEvaluation) {
    parentState.currentSafetyEvaluation.officialPlacard = val;
    saveSharedState();
    renderTenantSafetyNoticePreviews();
  }
};

function renderTenantSafetyNoticePreviews() {
  const evalObj = parentState.currentSafetyEvaluation;
  if (!evalObj) return;

  const placard = evalObj.officialPlacard;
  const dDate = evalObj.eqDate ? evalObj.eqDate.split('T')[0] : '';
  const dTime = evalObj.eqDate && evalObj.eqDate.split('T')[1] ? evalObj.eqDate.split('T')[1] : '13:00';
  const eventType = evalObj.eventType || currentEventType || 'Earthquake';

  const formattedDate = dDate ? new Date(dDate).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Today';

  const headerBldg = document.getElementById('notice-building-header');
  if (headerBldg) headerBldg.innerText = (evalObj.buildingName || 'One Corporate Building').toUpperCase();
  
  const noticeDate = document.getElementById('notice-eq-date');
  if (noticeDate) noticeDate.innerText = formattedDate;
  
  const noticeTime = document.getElementById('notice-eq-time');
  if (noticeTime) noticeTime.innerText = dTime;
  
  const noticeInt = document.getElementById('notice-eq-intensity');
  if (noticeInt) noticeInt.innerText = evalObj.intensity || '';

  const summaryP = document.querySelector('.printable-notice-box .notice-p');
  if (summaryP) {
    if (eventType === 'UtilityFailure') {
      summaryP.innerHTML = `On <strong>${formattedDate}</strong> at approximately <strong>${dTime}</strong>, the building experienced a loss of utility service (<strong>${evalObj.intensity || 'Power / Gas / Water'}</strong>). Our Building Maintenance team is actively working with the utility provider to restore service and has assessed the building's fire/life-safety systems, elevators, emergency power, and other critical equipment.`;
    } else if (eventType === 'Typhoon') {
      summaryP.innerHTML = `Following the passage of <strong>${evalObj.intensity || 'the typhoon'}</strong> on <strong>${formattedDate}</strong> at approximately <strong>${dTime}</strong>, our Building Maintenance team carried out a complete post-typhoon safety audit of the building envelope, roofing, glazing, drainage, utilities, and life-safety systems.`;
    } else if (eventType === 'Flood') {
      summaryP.innerHTML = `Following the severe rainfall and flooding risk (<strong>${evalObj.intensity || 'Heavy Rain'}</strong>) on <strong>${formattedDate}</strong> at approximately <strong>${dTime}</strong>, our Building Maintenance team conducted a thorough flood risk and drainage audit of all basement levels, sump pumps, electrical panels, and life-safety systems.`;
    } else {
      summaryP.innerHTML = `Following the earthquake that occurred on <strong>${formattedDate}</strong> at approximately <strong>${dTime}</strong> (Reported Intensity: <strong>${evalObj.intensity || ''}</strong>), our Building Maintenance team carried out a full safety inspection of this property, covering the structural frame, non-structural elements, elevators, utilities, and fire/life-safety systems.`;
    }
  }
  
  const band = document.getElementById('notice-placard-color-band');
  const badge = document.getElementById('notice-placard-badge');
  const details = document.getElementById('notice-placard-details-text');
  
  if (band && badge && details) {
    band.className = 'notice-placard-banner';
    
    let issues = [];
    const allSteps = evalObj.checklistItems || getActiveSteps(eventType);
    Object.keys(evalObj.checklist).forEach(key => {
      if (evalObj.checklist[key].status === 'Issue') {
        let text = '';
        Object.keys(allSteps).forEach(k => {
          const found = allSteps[k].find(i => i.id === key);
          if (found) text = found.item.split(' — ')[0];
        });
        const note = evalObj.checklist[key].notes ? ` (${evalObj.checklist[key].notes})` : '';
        issues.push(`${text || 'Item'}${note}`);
      }
    });

    let eventTypeName = 'Earthquake';
    if (eventType === 'Typhoon') eventTypeName = 'Typhoon & Severe Wind Hazard';
    else if (eventType === 'Flood') eventTypeName = 'Severe Rain & Basement Flood Risk';
    else if (eventType === 'UtilityFailure') eventTypeName = 'Utility Failure Response';

    if (placard === 'GREEN') {
      band.classList.add('green-band');
      badge.innerText = eventType === 'UtilityFailure' ? 'GREEN — SERVICE RESTORED / NORMAL OPERATIONS' : 'GREEN — SAFE TO OCCUPY';
      details.innerHTML = eventType === 'UtilityFailure'
        ? 'Service has been restored, or the outage is brief and limited with no impact on life-safety systems or building operations. All fire alarms, elevators, emergency power, and domestic water systems are operating normally.'
        : `All ${eventTypeName} visual safety checks passed. Building systems and structural elements are functioning normally.`;
    } else if (placard === 'YELLOW') {
      band.classList.add('yellow-band');
      badge.innerText = eventType === 'UtilityFailure' ? 'YELLOW — PARTIAL SERVICE / RESTRICTED AREAS' : 'YELLOW — RESTRICTED ENTRY';
      details.innerHTML = eventType === 'UtilityFailure'
        ? `<strong>Attention:</strong> Partial utility service outage active. Restricted areas or affected systems:<br><ul><li>${issues.join('</li><li>') || 'Backup systems operational. Follow posted guidance.'}</li></ul>`
        : `<strong>Attention:</strong> ${eventTypeName} hazards identified in:<br><ul><li>${issues.join('</li><li>') || 'Restricted zones active.'}</li></ul>`;
    } else {
      band.classList.add('red-band');
      badge.innerText = eventType === 'UtilityFailure' ? 'RED — SERVICE UNAVAILABLE / AREA CLOSED' : 'RED — UNSAFE / TEMPORARILY CLOSED';
      details.innerHTML = eventType === 'UtilityFailure'
        ? `<strong>DANGER / CRITICAL:</strong> Service unavailable or life-safety systems offline:<br><ul><li>${issues.join('</li><li>') || 'Area closed pending utility provider or contractor restoration.'}</li></ul>`
        : `<strong>DANGER:</strong> Closed pending ${eventTypeName} damage restoration:<br><ul><li>${issues.join('</li><li>') || 'High risk condition.'}</li></ul>`;
    }
  }

  const signLabel = document.getElementById('notice-manager-title-label');
  if (signLabel) {
    signLabel.innerText = parentState.isManagerAbsent 
      ? 'Acting Approved: Assistant Building Maintenance' 
      : 'Reviewed By: Building Maintenance Manager';
  }

  const signInsp = document.getElementById('notice-sign-inspector');
  const signMgr = document.getElementById('notice-sign-manager');
  const signStruct = document.getElementById('notice-sign-structural');
  if (signInsp) signInsp.innerText = evalObj.signInspector || 'Not Signed';
  if (signMgr) signMgr.innerText = evalObj.signManager || 'Not Signed';
  if (signStruct) signStruct.innerText = evalObj.signStructural || '—';
}

window.submitSafetyEvaluation = function() {
  syncWizardInputsToState();
  const evalObj = parentState.currentSafetyEvaluation;
  if (!evalObj) return;

  if (editingLogId) {
    const idx = parentState.pastSafetyEvaluations.findIndex(e => e.id === editingLogId);
    if (idx !== -1) {
      parentState.pastSafetyEvaluations[idx] = JSON.parse(JSON.stringify(evalObj));
    } else {
      parentState.pastSafetyEvaluations.unshift(JSON.parse(JSON.stringify(evalObj)));
    }
    alert("Inspection record updated and saved successfully!");
  } else {
    const idx = parentState.pastSafetyEvaluations.findIndex(e => e.id === evalObj.id);
    if (idx !== -1) {
      parentState.pastSafetyEvaluations[idx] = JSON.parse(JSON.stringify(evalObj));
    } else {
      parentState.pastSafetyEvaluations.unshift(JSON.parse(JSON.stringify(evalObj)));
    }
    alert("Safety inspection saved successfully! Redirecting to reports...");
  }

  // Log notification
  if (!parentState.notifications) parentState.notifications = [];
  parentState.notifications.unshift({
    id: `eq_report_${evalObj.id}`,
    type: evalObj.officialPlacard === 'GREEN' ? 'normal' : 'critical',
    message: `COMPREHENSIVE SAFETY AUDIT: Placard [${evalObj.officialPlacard}] filed for One Corporate Building.`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  const savedLogId = evalObj.id;
  editingLogId = null;
  parentState.currentSafetyEvaluation = null;
  saveSharedState();
  
  // Switch to reports tab and load the saved evaluation
  switchSection('reassurance');
  setTimeout(() => {
    const select = document.getElementById('reassurance-select-log');
    if (select) {
      select.value = savedLogId;
      generateComprehensiveReport();
    }
  }, 100);
};

// ==================== EDIT SAVED INSPECTION LOGS ====================

window.editSafetyInspectionLog = function(logId) {
  const found = parentState.pastSafetyEvaluations.find(e => e.id === logId);
  if (!found) {
    alert("Inspection log record not found.");
    return;
  }

  editingLogId = logId;
  parentState.currentSafetyEvaluation = JSON.parse(JSON.stringify(found));
  currentEventType = found.eventType || 'Earthquake';

  // Ensure checklistItems exists (for legacy records)
  if (!parentState.currentSafetyEvaluation.checklistItems) {
    parentState.currentSafetyEvaluation.checklistItems = JSON.parse(JSON.stringify(getActiveSteps(currentEventType)));
  }

  saveSharedState();

  // Populate metadata fields
  switchSection('wizard');
  
  const eventSelect = document.getElementById('eq-event-type');
  if (eventSelect) eventSelect.value = currentEventType;

  const bName = document.getElementById('eq-building-name');
  if (bName) bName.value = found.buildingName || 'One Corporate Building';

  const bAddr = document.getElementById('eq-building-address');
  if (bAddr) bAddr.value = found.address || '101 Financial District, Metro Manila';

  const eqDate = document.getElementById('eq-date-time');
  if (eqDate) eqDate.value = found.eqDate || '';

  const eqInt = document.getElementById('eq-intensity');
  if (eqInt) eqInt.value = found.intensity || '';

  const team = document.getElementById('eq-inspection-team');
  if (team) team.value = found.team || '';

  const signInspector = document.getElementById('eq-sign-inspector');
  if (signInspector) signInspector.value = found.signInspector || '';

  const signManager = document.getElementById('eq-sign-manager');
  if (signManager) signManager.value = found.signManager || '';

  const signStructural = document.getElementById('eq-sign-structural');
  if (signStructural) signStructural.value = found.signStructural || '';

  const overridePlacard = document.getElementById('eq-override-placard');
  if (overridePlacard) overridePlacard.value = found.officialPlacard || 'GREEN';

  updateEditModeBanner();
  switchWizardStep(1);
};

window.cancelEditSafetyEvaluation = function() {
  if (confirm("Are you sure you want to cancel editing this inspection log? Any unsaved edits will be discarded.")) {
    editingLogId = null;
    startNewSafetyEvaluation();
    switchSection('logs');
  }
};

window.editCurrentSelectedReportLog = function() {
  const select = document.getElementById('reassurance-select-log');
  if (select && select.value) {
    editSafetyInspectionLog(select.value);
  } else {
    alert("Please select a valid inspection log to edit.");
  }
};

// ==================== INSPECTION HISTORY LOGS ====================
function renderInspectionLogsTable() {
  const tbody = document.getElementById('eq-history-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const logs = parentState.pastSafetyEvaluations || [];
  
  if (logs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 24px; color: var(--text-muted);">No post-emergency safety inspections recorded in database.</td></tr>';
    return;
  }

  logs.forEach(log => {
    const tr = document.createElement('tr');
    
    const statusText = log.officialPlacard || 'GREEN';
    const dateOfQuake = log.eqDate ? log.eqDate.split('T')[0] : log.dateCreated;
    const timeOfQuake = log.eqDate && log.eqDate.split('T')[1] ? log.eqDate.split('T')[1] : '13:00';
    const eventCategory = log.eventType || 'Earthquake';
    
    let tagStyle = 'background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);';
    let tagLabel = '🌐 Earthquake';
    if (eventCategory === 'Typhoon') {
      tagStyle = 'background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);';
      tagLabel = '🌀 Typhoon';
    } else if (eventCategory === 'Flood') {
      tagStyle = 'background: rgba(6, 182, 212, 0.15); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.3);';
      tagLabel = '🌊 Flood Risk';
    } else if (eventCategory === 'UtilityFailure') {
      tagStyle = 'background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3);';
      tagLabel = '⚡ Utility Outage';
    }

    tr.innerHTML = `
      <td><strong>${log.dateCreated}</strong></td>
      <td>${log.timeCreated || ''}</td>
      <td><span style="font-size:11px; font-weight:700; padding:2px 8px; border-radius:4px; ${tagStyle}">${tagLabel}</span></td>
      <td>${dateOfQuake} (${timeOfQuake})</td>
      <td>${log.intensity || 'Standard Audit'}</td>
      <td><span class="suggested-placard-glow placard-${statusText.toLowerCase()}" style="padding: 2px 8px; font-size:10px; font-weight:800; display:inline-block; border-radius:4px; margin:0;">${statusText}</span></td>
      <td>${log.signInspector || 'Technician'}</td>
      <td>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" style="font-size:11px; padding:3px 8px;" onclick="editSafetyInspectionLog('${log.id}')">✏️ Edit Log</button>
          <button class="btn btn-secondary btn-sm" style="font-size:11px; padding:3px 8px;" onclick="viewLogReassuranceReport('${log.id}')">📄 View Report</button>
          <button class="btn btn-secondary btn-sm" style="border: 1px solid #ff4d4d; color: #ff4d4d; background: none; font-size:11px; padding:3px 8px;" onclick="deleteSafetyInspectionLog('${log.id}')">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.viewLogReassuranceReport = function(id) {
  switchSection('reassurance');
  setTimeout(() => {
    const select = document.getElementById('reassurance-select-log');
    if (select) {
      select.value = id;
      generateComprehensiveReport();
    }
  }, 50);
};

window.deleteSafetyInspectionLog = function(logId) {
  if (confirm("Are you sure you want to permanently delete this safety inspection record? This action cannot be undone.")) {
    parentState.pastSafetyEvaluations = parentState.pastSafetyEvaluations.filter(e => e.id !== logId);
    saveSharedState();
    renderInspectionLogsTable();
    alert("Inspection log deleted successfully.");
  }
};

// ==================== ALIGNED COMPREHENSIVE REASSURANCE REPORT ====================

function populateReassuranceLogsDropdown() {
  const select = document.getElementById('reassurance-select-log');
  if (!select) return;
  select.innerHTML = '';

  const logs = parentState.pastSafetyEvaluations || [];
  
  if (logs.length === 0) {
    select.innerHTML = '<option value="">-- No Inspection Records Found --</option>';
    return;
  }

  logs.forEach(log => {
    const option = document.createElement('option');
    option.value = log.id;
    const catName = log.eventType === 'UtilityFailure' ? 'Post-Utility Failure' : (log.eventType || 'Earthquake');
    option.innerText = `Report dated ${log.dateCreated} - ${log.officialPlacard} Status (${catName} - ${log.intensity})`;
    select.appendChild(option);
  });
}

window.loadReportPreviewForSelection = function(logId) {
  if (logId) {
    generateComprehensiveReport();
  }
};

window.generateComprehensiveReport = function() {
  const select = document.getElementById('reassurance-select-log');
  if (!select) return;
  const logId = select.value;
  
  const previewSection = document.getElementById('reassurance-preview-section');
  const canvas = document.getElementById('reassurance-printable-area');

  if (!logId) {
    if (previewSection) previewSection.style.display = 'none';
    if (canvas) canvas.innerHTML = '';
    return;
  }

  const log = parentState.pastSafetyEvaluations.find(e => e.id === logId);
  if (!log) return;

  const eventType = log.eventType || 'Earthquake';
  const categoryOrder = [
    { key: 'exterior', name: 'Exterior Assessment' },
    { key: 'structural', name: 'Structural Interior' },
    { key: 'nonstructural', name: 'Non-Structural Elements' },
    { key: 'utilities', name: 'Utilities & Building Systems' },
    { key: 'firesafety', name: 'Fire & Life Safety' },
    { key: 'elevators', name: 'Elevators & Vertical Transit' }
  ];

  const sourceChecklistItems = log.checklistItems || getActiveSteps(eventType);
  let fullChecklistList = [];

  categoryOrder.forEach(cat => {
    const items = sourceChecklistItems[cat.key] || [];
    items.forEach((item, idx) => {
      const checkData = (log.checklist && log.checklist[item.id]) ? log.checklist[item.id] : { status: 'OK', notes: '', image: null };
      const status = checkData.status || 'OK';
      const notes = checkData.notes && checkData.notes.trim() ? checkData.notes.trim() : '—';
      const image = checkData.image || null;

      const record = {
        category: cat.name,
        stepKey: cat.key,
        indexNum: idx + 1,
        id: item.id,
        description: item.item,
        status: status,
        notes: notes,
        image: image,
        imageName: checkData.imageName || '',
        timestamp: checkData.timestamp || log.dateCreated
      };

      fullChecklistList.push(record);
    });
  });

  // Filter issues for the letter summary
  let issuesList = fullChecklistList.filter(i => i.status === 'Issue');

  // Format date human readable
  const dDate = log.eqDate ? log.eqDate.split('T')[0] : log.dateCreated;
  const dTime = log.eqDate && log.eqDate.split('T')[1] ? log.eqDate.split('T')[1] : '13:00';
  const humanDate = dDate ? new Date(dDate).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent Event';

  // Compile strictly aligned checklist rows
  let checklistRows = fullChecklistList.map((i, rIdx) => {
    let statusClass = 'status-ok';
    if (i.status === 'Issue') statusClass = 'status-issue';
    if (i.status === 'N/A') statusClass = 'status-na';
    
    let photoThumbHtml = '—';
    if (i.image) {
      photoThumbHtml = `
        <img src="${i.image}" alt="Photo evidence" class="report-photo-thumb" onclick="openEmergencyLightbox('${i.image}', '${escapeHtml(i.description)} — ${escapeHtml(i.notes)}')" title="Click to enlarge photo">
      `;
    }

    return `
      <tr>
        <td style="font-weight: 700; color: #1e3a8a; font-size: 11.5px; vertical-align: top;">${i.category}</td>
        <td style="font-weight: 500; color: #1e293b; vertical-align: top;">${i.description}</td>
        <td style="text-align: center; vertical-align: top;">
          <span class="status-indicator ${statusClass}">${i.status}</span>
        </td>
        <td style="color: ${i.notes !== '—' ? '#0f172a' : '#64748b'}; font-size: 11.5px; vertical-align: top;">
          ${i.notes}
        </td>
        <td style="text-align: center; vertical-align: middle;">
          ${photoThumbHtml}
        </td>
      </tr>
    `;
  }).join('');

  // Tenant Letter Text & Header based on Event Type & Placard status
  let reportTitle = 'POST-EARTHQUAKE SAFETY & INTEGRITY INSPECTION REPORT';
  let letterSubject = 'Official Notice of Post-Earthquake Building Safety & Integrity Verification';
  let letterIntro = `We are writing to provide you with an official update regarding the safety and structural integrity of One Corporate Building following the recent earthquake that occurred on ${humanDate} at ${dTime}. The safety of our occupants, staff, and visitors is our absolute highest priority.`;
  let metaDateLabel = 'Earthquake Date / Time:';
  let metaIntLabel = 'Reported Intensity:';
  let reassuranceText = '';

  const issuesListFormatted = issuesList.map(i => {
    return `<strong>${i.category} (${i.description.split(' — ')[0]}):</strong> ${i.notes !== '—' ? i.notes : 'Condition identified for maintenance remediation'}`;
  }).join('; ');

  if (eventType === 'UtilityFailure') {
    reportTitle = 'POST-UTILITY FAILURE BUILDING SAFETY & RESTORATION REPORT';
    letterSubject = 'Official Notice of Post-Utility Failure Building Safety & Service Restoration Update';
    metaDateLabel = 'Outage Start Date / Time:';
    metaIntLabel = 'Utility Affected & Scope:';
    letterIntro = `We are writing to update you following a loss of utility service (Power / Gas / Water) at One Corporate Building beginning on ${humanDate} at approximately ${dTime}. Our Building Maintenance team is in direct coordination with the utility providers and is actively monitoring the building's fire/life-safety systems, emergency power, elevators, and essential equipment.`;

    if (log.officialPlacard === 'GREEN') {
      reassuranceText = `<p>Our engineering team has verified that utility service has been fully restored and all building systems are operating under normal, stable conditions. All emergency diesel generators have transitioned back to standby, automatic transfer switches (ATS) are verified normal, domestic water pressure and fire sprinkler supply are verified, elevator banks have completed full diagnostic scans, and the fire alarm and life-safety systems are fully operational.</p>
      <p>Building operations have resumed standard schedules. Occupants may continue normal business activities with complete confidence in building utility reliability and life safety.</p>`;
    } else if (log.officialPlacard === 'YELLOW') {
      reassuranceText = `<p>Our inspection confirms that partial utility service is active while utility provider repairs or internal line work continues. Specific affected areas or restricted services include: <strong>${issuesListFormatted || 'localized power feed / domestic water pump zone'}</strong>.</p>
      <p>Emergency generators and backup battery banks are actively powering all essential life-safety systems, exit lighting, and priority circuits. Workaround notices have been posted in affected zones. The unaffected portions of the building remain open and safe for occupancy. We expect service to be restored per the utility provider schedule.</p>`;
    } else {
      reassuranceText = `<p>Our safety audit has identified critical building-wide utility disruptions or safety-sensitive conditions requiring temporary restriction of occupancy: <strong>${issuesListFormatted || 'extended main power grid failure / domestic water loss'}</strong>.</p>
      <p>Building facilities management is in direct contact with the utility provider and emergency service technicians to expedite complete restoration. Access to affected zones is temporarily restricted for life-safety protection. Periodic updates will be issued as restoration milestones are confirmed.</p>`;
    }
  } else if (eventType === 'Typhoon') {
    reportTitle = 'POST-TYPHOON & SEVERE WEATHER HAZARD EVALUATION REPORT';
    letterSubject = 'Official Notice of Post-Typhoon & Severe Weather Building Safety Inspection';
    metaDateLabel = 'Typhoon Passage / Landfall Date:';
    metaIntLabel = 'Typhoon Name / Signal Category:';
    letterIntro = `We are writing to provide you with an official safety update regarding One Corporate Building following the passage of ${log.intensity || 'the typhoon'} on ${humanDate} at ${dTime}. The safety of all building occupants and visitors remains our highest priority.`;
    
    if (log.officialPlacard === 'GREEN') {
      reassuranceText = `<p>Our building maintenance team completed a comprehensive perimeter and interior inspection covering the roof membrane, parapet copings, curtain wall glazing, window sealants, outdoor canopies, rooftop solar/HVAC fixtures, and electrical supply. We are pleased to report that the building envelope remains 100% weather-tight and structurally intact with zero storm damage.</p>
      <p>All building utilities, emergency diesel generators, domestic water supply, and elevator systems are fully operational. Occupants may resume normal business operations with full confidence in the safety and security of the property.</p>`;
    } else if (log.officialPlacard === 'YELLOW') {
      reassuranceText = `<p>Our post-typhoon inspection identified minor localized wind or rain impact items, specifically: <strong>${issuesListFormatted || 'window sill seepage / loose fascia trim'}</strong>.</p>
      <p>Safety barricades have been installed around affected areas as precautionary measures. The main building areas are safe and open for occupancy. Our maintenance team is actively carrying out prompt repairs.</p>`;
    } else {
      reassuranceText = `<p>Our inspection identified significant typhoon wind/water damage compromising building safety, specifically: <strong>${issuesListFormatted || 'severe roof cladding damage / glass breakage'}</strong>.</p>
      <p>The building has been temporarily classified as UNSAFE pending urgent repair works. Access is restricted for your protection. We will notify all occupants as restoration progresses.</p>`;
    }
  } else if (eventType === 'Flood') {
    reportTitle = 'SEVERE RAIN & BASEMENT FLOOD RISK EVALUATION REPORT';
    letterSubject = 'Official Notice of Severe Rain & Basement Flood Risk Verification';
    metaDateLabel = 'Severe Rain / Flood Event Date:';
    metaIntLabel = 'Rainfall Intensity / Warning Level:';
    letterIntro = `We are writing to provide you with an official update regarding building safety following the severe rainfall and storm event (${log.intensity || 'Heavy Rain'}) on ${humanDate} at ${dTime}.`;

    if (log.officialPlacard === 'GREEN') {
      reassuranceText = `<p>Our engineering staff conducted a thorough flood risk and drainage audit across all basement levels (Basements 1, 2, and 3), elevator pits, storm drains, and mechanical pump rooms. All basement flood barrier gates successfully prevented water entry, and all automatic submersible sump pumps cycled normally.</p>
      <p>Main electrical transformers, switchgear panels, and domestic water pumps remained completely dry and operational. The building is fully safe and open for normal operations.</p>`;
    } else if (log.officialPlacard === 'YELLOW') {
      reassuranceText = `<p>Our flood inspection noted localized water accumulation or minor drainage slowing, specifically in: <strong>${issuesListFormatted || 'basement parking perimeter seepage'}</strong>.</p>
      <p>Affected basement zones have been isolated while de-watering and sanitation proceed. Upper floors and main office spaces remain open and operational.</p>`;
    } else {
      reassuranceText = `<p>Our assessment revealed significant water intrusion or basement flood hazard affecting critical equipment: <strong>${issuesListFormatted || 'basement pit water rise'}</strong>.</p>
      <p>Occupancy is temporarily suspended while high-capacity de-watering and electrical drying take place. Further updates will be issued promptly.</p>`;
    }
  } else {
    if (log.officialPlacard === 'GREEN') {
      reassuranceText = `<p>We are pleased to report that the structural frame of One Corporate Building (including exposed beams, primary concrete columns, and shear walls) is entirely sound and has suffered no cracking or deflection. All mechanical plant operations, elevator vertical transports, domestic water supplies, and fire suppression jockey pumps have been tested and verified to be fully functional.</p>
      <p>Accordingly, the building has been certified as safe for occupancy. Tenants may resume normal day-to-day operations with full confidence in the structural integrity and fire protection systems of the property. Routine daily maintenance operations will continue on schedule.</p>`;
    } else if (log.officialPlacard === 'YELLOW') {
      reassuranceText = `<p>Our visual inspection identified localized non-structural or minor utility concerns requiring corrective repair. Specifically, structural defects were limited, but the following issues were logged: <strong>${issuesListFormatted || 'minor leaks/plaster cracks'}</strong>.</p>
      <p>Out of an abundance of caution, we have barricaded and restricted entry to these specific zones. The remainder of the building is cleared and certified for limited entry and occupancy. Our engineering team is currently executing remedial repairs to restore these areas to full code compliance. Please do not bypass any safety markers or barriers.</p>`;
    } else {
      reassuranceText = `<p>Our visual assessment has identified serious structural risks or major utility outages that compromise safe entry. Notable structural distress was observed, including: <strong>${issuesListFormatted || 'cracking and connection distress'}</strong>.</p>
      <p>Consequently, the building is classified as UNSAFE, and all normal business operations are suspended. Under safety protocols, access is strictly prohibited. We are coordinating with licensed structural engineers and municipal inspectors to perform a formal diagnostic. We will keep you updated as structural reinforcements and system restorations progress.</p>`;
    }
  }

  const approverName = log.signManager || (parentState.isManagerAbsent ? 'Jane Watson' : 'Robert Smith');
  const approverTitle = parentState.isManagerAbsent 
    ? 'Assistant Building Maintenance Manager (Acting Overseer)' 
    : 'Building Maintenance Manager';

  let eventDescription = 'an earthquake';
  if (eventType === 'Typhoon') eventDescription = 'a severe typhoon and high-wind hazard';
  else if (eventType === 'Flood') eventDescription = 'heavy rainfall and basement flood risk';
  else if (eventType === 'UtilityFailure') eventDescription = 'a major utility outage (Power / Gas / Water)';

  let faqBlockHtml = '';
  if (eventType === 'UtilityFailure') {
    faqBlockHtml = `
      <!-- UTILITY FAILURE TENANT FAQ BLOCK (From Maintenance Response Protocol) -->
      <div style="margin-top: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; page-break-inside: avoid;">
        <h4 style="font-size: 12px; font-weight: 800; color: #1e293b; text-transform: uppercase; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          <span>📋</span> Tenant Outage FAQ & Guidance
        </h4>
        <div style="font-size: 11px; color: #334155; line-height: 1.6;">
          <p style="margin-bottom: 8px;"><strong>Q: Is it safe to stay in the building during the outage?</strong><br>
          A: In most cases, yes — unless the notice specifically states an area is closed or evacuated. If you smell gas or notice any hazard, leave the area and notify Building Management immediately.</p>
          <p style="margin-bottom: 8px;"><strong>Q: What exactly is affected?</strong><br>
          A: The specific utility (power, gas, or water) and any dependent systems — such as elevators, HVAC, restrooms, or fire sprinkler coverage — as described in the posted notice.</p>
          <p style="margin-bottom: 8px;"><strong>Q: What should I do if I notice a gas smell, water leak, or other issue?</strong><br>
          A: Report it immediately to Building Management. If you smell gas, leave the area right away, avoid switches or open flames, and call the gas utility's emergency line / 911.</p>
          <p><strong>Q: Will there be updates as restoration progresses?</strong><br>
          A: Yes. Building Management will post updated notices and send follow-up communications as the utility provider gives new information, and once service is fully restored.</p>
        </div>
      </div>
    `;
  }

  const bldgName = (log.buildingName || 'One Corporate Building').trim();
  const isOneCorporate = bldgName.toLowerCase().includes('one corporate');
  const headerLogoSrc = isOneCorporate ? 'one corporate logo.png' : 'management services logo.JPG';
  const headerLogoAlt = isOneCorporate ? 'One Corporate Building' : 'Management Services';
  const logoClass = isOneCorporate ? 'report-header-logo logo-onecorp' : 'report-header-logo logo-mgmt';
  const leftColClass = isOneCorporate ? 'eq-report-header-left' : 'eq-report-header-left has-mgmt-logo';
  const facilityOfficeName = `${bldgName.toUpperCase()} FACILITIES OFFICE`;

  // Build Comprehensive HTML Document
  canvas.innerHTML = `
    <div class="report-doc">
      
      <!-- PAGE 1: BUILDING CONDITION REPORT -->
      <div class="eq-report-header">
        <div class="${leftColClass}">
          <img src="${headerLogoSrc}" alt="${headerLogoAlt}" class="${logoClass}">
        </div>
        <div class="eq-report-header-center">
          <h1>${reportTitle}</h1>
          <h2>${facilityOfficeName}</h2>
        </div>
        <div class="eq-report-header-right">
          <span class="suggested-placard-glow placard-${log.officialPlacard.toLowerCase()}" style="padding: 6px 14px; font-size:12px; font-weight:800; border-radius:4px; display:inline-block; text-align:center;">
            ${log.officialPlacard} STATUS
          </span>
        </div>
      </div>

      <div class="eq-meta-grid">
        <p><strong>${metaDateLabel}</strong> ${humanDate} at ${dTime}</p>
        <p><strong>${metaIntLabel}</strong> ${log.intensity || 'Standard'}</p>
        <p><strong>Date Audited:</strong> ${log.dateCreated} (${log.timeCreated || ''})</p>
        <p><strong>Lead Inspector:</strong> ${log.signInspector || 'Lead Engineer'}</p>
        <p><strong>Oversight Verification:</strong> ${approverName} (${approverTitle})</p>
        <p><strong>Inspection Team:</strong> ${log.team || 'Maintenance Team'}</p>
      </div>

      <h3 class="eq-report-section-title">Executive Summary</h3>
      <p style="font-size: 13px; margin-bottom: 20px;">
        An immediate post-event visual safety audit was executed at ${bldgName} to inspect structural integrity, weather-tightness, and building utilities following ${eventDescription}. Inspection protocols followed standard safety evaluation guidelines. Based on detailed physical assessments, the property has been placarded as <strong>${log.officialPlacard}</strong>.
      </p>

      <h3 class="eq-report-section-title">Full Visual Inspection Checklist Log</h3>
      <p style="font-size: 11px; color:#4b5563; margin-bottom: 8px;">The table below details all checklist points evaluated during the visual inspection and their current condition status:</p>
      <table class="eq-finding-table">
        <thead>
          <tr>
            <th style="width: 140px;">System Category</th>
            <th>Inspection Checklist Item</th>
            <th style="width: 85px; text-align: center;">Status</th>
            <th style="width: 200px;">Field Finding Notes / Observations</th>
            <th style="width: 130px; text-align: center;">Attached Photo</th>
          </tr>
        </thead>
        <tbody>
          ${checklistRows}
        </tbody>
      </table>

      <h3 class="eq-report-section-title">Operations & Remedial Actions</h3>
      <p style="font-size: 13px; margin-bottom: 20px;">
        ${log.officialPlacard === 'GREEN' 
          ? 'No remedial structural or waterproofing actions are required. Normal building maintenance operations and preventive maintenance for mechanical, plumbing, and electrical plants will continue.' 
          : 'Safety markers/barricades have been deployed around affected zones. Correction tickets have been logged in the maintenance backlog.'}
      </p>

      <!-- Signature Line -->
      ${(function() {
        const sigs = (window.appState && window.appState.reportSignatures) ? window.appState.reportSignatures : {};
        const inspSig = sigs.reportedBy ? `<img src="${sigs.reportedBy.url}" alt="Inspector Signature" class="report-signature-image">` : `<button type="button" class="preview-sign-btn hide-on-print" onclick="openSignatureModal('reportedBy')">✍️ Sign</button>`;
        const verifSig = sigs.approvedBy ? `<img src="${sigs.approvedBy.url}" alt="Verifier Signature" class="report-signature-image">` : `<button type="button" class="preview-sign-btn hide-on-print" onclick="openSignatureModal('approvedBy')">✍️ Sign</button>`;

        return `
          <div style="margin-top: 40px; border-top: 1px solid #d1d5db; padding-top: 20px; display:flex; justify-content: space-between; align-items: flex-end; page-break-inside: avoid;">
            <div style="text-align:center; width:180px;">
              <div style="height: 44px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 2px;">${inspSig}</div>
              <div style="border-bottom: 1px solid #000; margin-bottom: 4px;"></div>
              <span style="font-size: 10px; font-weight:bold; color:#4b5563;">Inspected By: ${log.signInspector || 'Lead Inspector'}</span>
            </div>
            <div style="text-align:center; width:220px;">
              <div style="height: 44px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 2px;">${verifSig}</div>
              <div style="border-bottom: 1px solid #000; margin-bottom: 4px;"></div>
              <span style="font-size: 10px; font-weight:bold; color:#4b5563;">Verified By: ${approverName}</span>
            </div>
            <div style="text-align:center; width:180px;">
              <div style="height: 44px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 2px;"></div>
              <div style="border-bottom: 1px solid #000; margin-bottom: 4px;"></div>
              <span style="font-size: 10px; font-weight:bold; color:#4b5563;">Structural Engineer: ${log.signStructural || '—'}</span>
            </div>
          </div>
        `;
      })()}

      <!-- PAGE 2: TENANT REASSURANCE LETTER -->
      <div class="letter-box">
        <div class="letter-corp-header">
          <h2>PROPERTY MANAGEMENT OFFICE</h2>
          <p>One Corporate Building, Financial District, Metro Manila</p>
        </div>

        <div class="letter-meta">
          <p><strong>Date:</strong> ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>To:</strong> All Building Tenants, Business Occupants, and Staff</p>
          <p><strong>From:</strong> Building Facilities & Maintenance Management Office</p>
          <p><strong>Subject:</strong> ${letterSubject}</p>
        </div>

        <div class="letter-salutation">Dear Valued Tenants and Occupants,</div>

        <div class="letter-body">
          ${letterIntro}
          
          <p>Immediately following the event, our building engineering team initiated a comprehensive visual safety audit of all critical building infrastructures. Our inspection covered electrical switchgear, standby diesel generators, domestic water storage, fire alarm networks, automatic sprinkler supplies, and vertical transportation systems.</p>
          
          ${reassuranceText}

          <p>If you or your staff notice any minor cosmetic issues, water dripping, or have any safety concerns in your suite, please report them immediately to the facilities desk so a maintenance ticket can be assigned.</p>
          
          <p>We appreciate your patience, trust, and cooperation as we ensure the continuous safety and operational excellence of One Corporate Building.</p>
        </div>

        <div class="letter-closing">
          <div class="letter-sig-block">
            <p>Sincerely,</p>
            <div class="letter-sig-line"></div>
            <p class="letter-sig-name">${approverName}</p>
            <p class="letter-sig-title">${approverTitle}</p>
            <p style="color:#6b7280; font-size:10px; margin-top:2px;">One Corporate Building Management</p>
          </div>
          <div class="letter-corp-seal">
            Corporate Seal
          </div>
        </div>

        ${faqBlockHtml}
      </div>

    </div>
  `;

  if (previewSection) previewSection.style.display = 'block';
};

window.printElement = function(elementId) {
  window.print();
};

window.copyReassuranceLetter = function() {
  const letterEl = document.querySelector('.letter-box');
  if (letterEl) {
    const text = letterEl.innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert("Tenant Reassurance Letter copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy reassurance letter:", err);
    });
  }
};

// =========================================================================================
// ==================== EMERGENCY PREPAREDNESS PLAN & GUIDELINES MODULE ====================
// =========================================================================================

const DEFAULT_ORG_STRUCTURE = [
  // Tier 1: Executive Leadership
  {
    id: 'org_ceo',
    name: 'Engr. Fernando C. Laranang',
    role: 'Chief Executive Officer (CEO)',
    tier: 'Executive Leadership',
    phone: '',
    photo: 'assets/team/lorraine_josue.jpg',
    duties: 'Overall corporate executive authority, emergency funding release, board liaison',
    order: 1
  },
  {
    id: 'org_pres',
    name: 'Marjorie L. Olivete',
    role: 'President',
    tier: 'Executive Leadership',
    phone: '',
    photo: 'assets/team/fernando_laranang.png',
    duties: 'Executive operational leadership, policy oversight, emergency declarations',
    order: 2
  },
  {
    id: 'org_fd',
    name: 'Lorraine Ashley Laranang-Josue',
    role: 'Finance Director',
    tier: 'Executive Leadership',
    phone: '',
    photo: 'assets/team/marjorie_olivete.png',
    duties: 'Emergency contingency budget allocation, insurance claim oversight',
    order: 3
  },
  {
    id: 'org_fm',
    name: 'Michael Rey Zordilla',
    role: 'Finance Manager',
    tier: 'Executive Leadership',
    phone: '',
    photo: '',
    duties: 'Emergency procurement, contractor payments, relief supplies funding',
    order: 4
  },

  // Tier 2: Incident Command
  {
    id: 'org_bec',
    name: 'Engr. Roan Paul Gallegos',
    role: 'Building Emergency Coordinator (BEC)',
    tier: 'Incident Command',
    phone: '09176598364',
    photo: 'assets/team/roan_paul_gallegos.jpeg',
    duties: 'Directs overall emergency response, primary Fire/Police/EMS liaison, authorizes evacuation/all-clear',
    order: 5
  },
  {
    id: 'org_asst_bec',
    name: 'Mr. Elmer Esteban',
    role: 'Assistant BEC / Facilities Lead',
    tier: 'Incident Command',
    phone: '09296233556',
    photo: 'assets/team/elmer_esteban.jpeg',
    duties: 'Assumes command if BEC unavailable; controls utility shutdowns, HVAC, and mechanical spaces',
    order: 6
  },
  {
    id: 'org_pmo',
    name: 'Donald Geron',
    role: 'Property Management Officer / Assembly Area Marshal',
    tier: 'Incident Command',
    phone: '09175379173',
    photo: 'assets/team/donald_geron.jpeg',
    duties: 'Manages roll call at Assembly Area, accounts for occupants, prevents premature building re-entry',
    order: 7
  },
  {
    id: 'org_sec_lead',
    name: 'Jojo Bennagen',
    role: 'Security Lead & Lockdown Officer',
    tier: 'Incident Command',
    phone: '09461817526',
    photo: 'assets/team/jojo_bennagen.png',
    duties: 'Controls building access & CCTV, guides arriving law enforcement, initiates perimeter lockdown',
    order: 8
  },
  {
    id: 'org_comms',
    name: 'Twinkle Domingo',
    role: 'Communications Officer / Admin',
    tier: 'Incident Command',
    phone: '09171599563',
    photo: 'assets/team/twinkle_domingo.jpeg',
    duties: 'Manages mass notification system, broadcasts tenant safety updates, sole authorized media spokesperson',
    order: 9
  },
  {
    id: 'org_first_aid',
    name: 'Martin Naimes',
    role: 'First Aid Coordinator / Medical Officer',
    tier: 'Incident Command',
    phone: '09071505202',
    photo: 'assets/team/martin_naimes.png',
    duties: 'Administers CPR/AED, manages first aid triage, maintains emergency medical kits until EMS arrives',
    order: 10
  },
  {
    id: 'org_fac_asst',
    name: 'George Ybanez',
    role: 'Facilities Asst. Lead / Mechanical Liaison',
    tier: 'Incident Command',
    phone: '09485381602',
    photo: 'assets/team/george_ybanez.png',
    duties: 'Operates generator ATS, shuts gas/water mains, supervises elevator lockout and electrical panels',
    order: 11
  },

  // Tier 3: Floor Operations
  {
    id: 'org_fw_ducusin',
    name: 'Virgilio Ducusin',
    role: 'Floor Warden (Primary)',
    tier: 'Floor Operations',
    phone: '',
    photo: 'assets/team/virgilio_ducusin.png',
    duties: 'Leads orderly floor evacuation, sweeps offices/restrooms, ensures all occupants leave via stairwells',
    order: 12
  },
  {
    id: 'org_fw_gonzales',
    name: 'Cheryl Gonzales',
    role: 'Floor Warden (Primary)',
    tier: 'Floor Operations',
    phone: '',
    photo: 'assets/team/cheryl_gonzales.png',
    duties: 'Directs floor evacuation, keeps updated floor roster, confirms clear status with BEC',
    order: 13
  },
  {
    id: 'org_fw_telles',
    name: 'Beverly Kate Telles',
    role: 'Floor Warden / Deputy',
    tier: 'Floor Operations',
    phone: '',
    photo: 'assets/team/beverly_kate_telles.png',
    duties: 'Assists with stairwell flow control, prevents panic, sweeps conference rooms',
    order: 14
  },
  {
    id: 'org_fw_penuliar',
    name: 'Annalyn Penuliar',
    role: 'Floor Warden / Deputy',
    tier: 'Floor Operations',
    phone: '',
    photo: 'assets/team/annalyn_penuliar.png',
    duties: 'Assists mobility-impaired occupants, guides visitors to primary stairwell egress',
    order: 15
  },
  {
    id: 'org_fw_mejia',
    name: 'Mandy Mejia',
    role: 'Floor Warden / Deputy',
    tier: 'Floor Operations',
    phone: '',
    photo: 'assets/team/mandy_mejia.png',
    duties: 'Performs secondary room sweeps, closes doors to retard smoke spread, reports floor headcount',
    order: 16
  },

  // Tier 4: Specialized Rescue
  {
    id: 'org_mob_pukchas',
    name: 'Berson Pukchas',
    role: 'Mobility Assistance Officer',
    tier: 'Specialized Rescue',
    phone: '',
    photo: 'assets/team/berson_pukchas.png',
    duties: 'Escorts mobility-impaired occupants to designated Areas of Refuge near stairwells',
    order: 17
  },
  {
    id: 'org_mob_banez',
    name: 'Ruben Banez',
    role: 'Mobility Assistance Officer',
    tier: 'Specialized Rescue',
    phone: '',
    photo: 'assets/team/ruben_banez.png',
    duties: 'Operates stairwell evacuation chairs, coordinates rescue priority with arriving BFP/EMS',
    order: 18
  },

  // Tier 5: Technical Support
  {
    id: 'org_eng_varona',
    name: 'Engr. Jevic Varona',
    role: 'Electrical Engineer',
    tier: 'Technical Support',
    phone: '0917 621 6152',
    photo: '',
    duties: 'Main transformer vault safety, MDP circuit breakers, generator synchronization',
    order: 19
  },
  {
    id: 'org_eng_onoten',
    name: 'Engr. Marie Onoten',
    role: 'Sanitary Engineer',
    tier: 'Technical Support',
    phone: '0930 186 0163',
    photo: '',
    duties: 'Sewage Treatment Plant (STP), sump pump stations, domestic water potable supplies',
    order: 20
  },
  {
    id: 'org_eng_guilao',
    name: 'Jemmer Guilao',
    role: 'QA/QC Superintendent',
    tier: 'Technical Support',
    phone: '0926 676 5293',
    photo: '',
    duties: 'Post-event structural inspection, quality verification of emergency repairs',
    order: 21
  },
  {
    id: 'org_fac_lomboy',
    name: 'Miguel Lomboy',
    role: 'Facilities & Motorpool Manager',
    tier: 'Technical Support',
    phone: '0917 583 2140',
    photo: '',
    duties: 'Emergency vehicle dispatch, transport of injured to hospital, heavy equipment tools',
    order: 22
  },
  {
    id: 'org_fac_mejos',
    name: 'Welito Mejos Jr.',
    role: 'Facilities & Motorpool Supervisor',
    tier: 'Technical Support',
    phone: '0917 583 2253',
    photo: '',
    duties: 'On-site mechanical troubleshooting, de-watering pumps, temporary power supply',
    order: 23
  },
  {
    id: 'org_qa_bumalo',
    name: 'Virtron K. Bumal-O',
    role: 'QA/QC Manager',
    tier: 'Technical Support',
    phone: '0917 583 2166',
    photo: '',
    duties: 'Building structural compliance checks, Incident Report documentation filing',
    order: 24
  }
];

const ORG_TIER_CONFIG = [
  { key: 'Executive Leadership', title: 'Executive Leadership & Corporate Governance', badge: 'Tier 1 • Top Management' },
  { key: 'Incident Command', title: 'Incident Command & Emergency Coordinators', badge: 'Tier 2 • On-Scene Command' },
  { key: 'Floor Operations', title: 'Floor Wardens & Evacuation Sweepers', badge: 'Tier 3 • Per-Floor Operations' },
  { key: 'Specialized Rescue', title: 'Mobility Assistance & Area of Refuge Officers', badge: 'Tier 4 • Dedicated Assistance' },
  { key: 'Technical Support', title: 'In-House Engineers & Support Team', badge: 'Tier 5 • Facilities & QA/QC' }
];

let draggedMemberId = null;

// Get Active Org Structure from Storage or Default with executive photo migration
function getActiveOrgStructure() {
  try {
    const stored = localStorage.getItem('onecorp_emergency_org_structure');
    if (stored) {
      const list = JSON.parse(stored);
      // Migrate executive photos
      const ceo = list.find(m => m.id === 'org_ceo');
      if (ceo && (!ceo.photo || ceo.photo.includes('fernando_laranang'))) {
        ceo.photo = 'assets/team/lorraine_josue.jpg';
      }
      const pres = list.find(m => m.id === 'org_pres');
      if (pres && (!pres.photo || pres.photo.includes('marjorie_olivete'))) {
        pres.photo = 'assets/team/fernando_laranang.png';
      }
      const fd = list.find(m => m.id === 'org_fd');
      if (fd && (!fd.photo || fd.photo.includes('lorraine_josue'))) {
        fd.photo = 'assets/team/marjorie_olivete.png';
      }
      return list;
    }
  } catch (e) {
    console.error('Error loading org structure from localStorage:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_ORG_STRUCTURE));
}

function saveActiveOrgStructure(list) {
  try {
    localStorage.setItem('onecorp_emergency_org_structure', JSON.stringify(list));
  } catch (e) {
    console.error('Error saving org structure to localStorage:', e);
  }
}

let currentOrgView = 'tree';

window.switchOrgView = function(viewType) {
  currentOrgView = viewType;

  const btnTree = document.getElementById('btn-view-tree');
  const btnCards = document.getElementById('btn-view-cards');
  const treeContainer = document.getElementById('org-tree-view-container');
  const cardsContainer = document.getElementById('org-cards-view-container');

  if (btnTree) btnTree.classList.toggle('active', viewType === 'tree');
  if (btnCards) btnCards.classList.toggle('active', viewType === 'cards');

  if (treeContainer) treeContainer.style.display = viewType === 'tree' ? 'block' : 'none';
  if (cardsContainer) cardsContainer.style.display = viewType === 'cards' ? 'flex' : 'none';

  if (viewType === 'tree') {
    renderHierarchicalOrgChart();
  } else {
    renderOrgCardsView();
  }
};

function createTreeNodeHtml(m, nodeClass = '', tierKey = '') {
  if (!m) return '';
  const tKey = tierKey || m.tier || 'Incident Command';
  let avatarHtml = '';
  if (m.photo) {
    avatarHtml = `<img src="${m.photo}" alt="${escapeHtml(m.name)}" onerror="this.parentElement.innerHTML='<span class=\\'avatar-initials\\'>${escapeHtml(m.name.charAt(0))}</span>'">`;
  } else {
    const initials = m.name.split(' ').map(n => n.charAt(0)).filter((_, idx, arr) => idx === 0 || idx === arr.length - 1).join('');
    avatarHtml = `<span class="avatar-initials">${escapeHtml(initials || 'EC')}</span>`;
  }

  const phoneText = m.phone ? `<span>📞 ${m.phone}</span>` : '';

  return `
    <div class="tree-node-box ${nodeClass}" 
         id="tree-node-${m.id}"
         draggable="true"
         ondragstart="handleOrgDragStart(event, '${m.id}')"
         ondragover="handleTreeDragOver(event)"
         ondragleave="handleTreeDragLeave(event)"
         ondrop="handleTreeDropOnNode(event, '${m.id}', '${tKey}')"
         ondragend="handleOrgDragEnd(event)"
         onclick="openEditOrgMemberModal('${m.id}')" 
         title="Drag up/down/left/right to reorder or change tier. Click to edit (${escapeHtml(m.name)})">
      <div class="tree-node-avatar">
        ${avatarHtml}
      </div>
      <div class="tree-node-info">
        <div class="tree-node-name">${escapeHtml(m.name)}</div>
        <div class="tree-node-role">${escapeHtml(m.role)}</div>
        ${phoneText ? `<div class="tree-node-phone">${phoneText}</div>` : ''}
      </div>
    </div>
  `;
}

// Tree Level Drag and Drop
window.handleTreeLevelDragOver = function(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = 'move';
  const target = event.currentTarget;
  if (target) target.classList.add('drag-over-tree-level');
};

window.handleTreeLevelDragLeave = function(event) {
  event.preventDefault();
  const target = event.currentTarget;
  if (target) target.classList.remove('drag-over-tree-level');
};

window.handleTreeLevelDrop = function(event, targetTier) {
  event.preventDefault();
  event.stopPropagation();
  document.querySelectorAll('.drag-over-tree-level').forEach(el => el.classList.remove('drag-over-tree-level'));
  document.querySelectorAll('.drag-over-card').forEach(el => el.classList.remove('drag-over-card'));

  if (!draggedMemberId) return;

  const orgList = getActiveOrgStructure();
  const member = orgList.find(m => m.id === draggedMemberId);
  if (member) {
    member.tier = targetTier;
    saveActiveOrgStructure(orgList);
    renderEmergencyOrgStructure();
  }
};

window.handleTreeDragOver = function(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = 'move';
  const targetNode = event.target.closest('.tree-node-box');
  if (targetNode && !targetNode.classList.contains('dragging')) {
    targetNode.classList.add('drag-over-card');
  }
};

window.handleTreeDragLeave = function(event) {
  event.preventDefault();
  const targetNode = event.target.closest('.tree-node-box');
  if (targetNode) targetNode.classList.remove('drag-over-card');
};

window.handleTreeDropOnNode = function(event, targetMemberId, targetTier) {
  event.preventDefault();
  event.stopPropagation();
  document.querySelectorAll('.drag-over-card').forEach(el => el.classList.remove('drag-over-card'));
  document.querySelectorAll('.drag-over-tree-level').forEach(el => el.classList.remove('drag-over-tree-level'));

  if (!draggedMemberId || draggedMemberId === targetMemberId) return;

  const orgList = getActiveOrgStructure();
  const sourceIndex = orgList.findIndex(m => m.id === draggedMemberId);
  const targetIndex = orgList.findIndex(m => m.id === targetMemberId);

  if (sourceIndex > -1 && targetIndex > -1) {
    const draggedItem = orgList.splice(sourceIndex, 1)[0];
    draggedItem.tier = targetTier;

    const newTargetIndex = orgList.findIndex(m => m.id === targetMemberId);
    orgList.splice(newTargetIndex, 0, draggedItem);

    orgList.forEach((m, idx) => { m.order = idx + 1; });

    saveActiveOrgStructure(orgList);
    renderEmergencyOrgStructure();
  }
};

// Render Hierarchical Flowchart Tree View
window.renderHierarchicalOrgChart = function() {
  const container = document.getElementById('org-tree-view-container');
  if (!container) return;

  const orgList = getActiveOrgStructure();

  const executives = orgList.filter(m => m.tier === 'Executive Leadership');
  const bec = orgList.find(m => m.id === 'org_bec' || (m.role && m.role.toLowerCase().includes('coordinator'))) || orgList.find(m => m.tier === 'Incident Command');
  const asstBec = orgList.find(m => m.id === 'org_asst_bec' || (m.role && m.role.toLowerCase().includes('assistant bec')));
  
  const officers = orgList.filter(m => m.tier === 'Incident Command' && m !== bec && m !== asstBec);
  const wardens = orgList.filter(m => m.tier === 'Floor Operations');
  const mobility = orgList.filter(m => m.tier === 'Specialized Rescue');
  const engineers = orgList.filter(m => m.tier === 'Technical Support');

  let html = `
    <div class="org-tree">
      
      <!-- LEVEL 1: Executive Leadership -->
      <div style="font-size: 11px; font-weight: 800; color: #f59e0b; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">
        Level 1 • Executive Leadership & Corporate Governance
      </div>
      <div class="tree-level" 
           ondragover="handleTreeLevelDragOver(event)" 
           ondragleave="handleTreeLevelDragLeave(event)" 
           ondrop="handleTreeLevelDrop(event, 'Executive Leadership')">
        <div class="tree-node-group">
          ${executives.map(m => createTreeNodeHtml(m, 'node-executive', 'Executive Leadership')).join('')}
        </div>
      </div>

      <div class="tree-stem-down"></div>

      <!-- LEVEL 2: Incident Command Leadership -->
      <div style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">
        Level 2 • Incident Command Leadership (BERT Core)
      </div>
      <div class="tree-level" 
           ondragover="handleTreeLevelDragOver(event)" 
           ondragleave="handleTreeLevelDragLeave(event)" 
           ondrop="handleTreeLevelDrop(event, 'Incident Command')">
        <div class="tree-node-group">
          ${bec ? createTreeNodeHtml(bec, 'node-command', 'Incident Command') : ''}
          ${asstBec ? createTreeNodeHtml(asstBec, 'node-command', 'Incident Command') : ''}
        </div>
      </div>

      <div class="tree-stem-down"></div>
      <div class="tree-branch-bar" style="width: 88%;"></div>

      <!-- LEVEL 3: Functional Emergency Officers & Operational Leads -->
      <div style="width: 100%; text-align: center; margin-top: 10px;">
        <span style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">
          Level 3 • Functional Coordinators & Operational Leads
        </span>
      </div>
      <div class="tree-branch-grid"
           ondragover="handleTreeLevelDragOver(event)" 
           ondragleave="handleTreeLevelDragLeave(event)" 
           ondrop="handleTreeLevelDrop(event, 'Incident Command')">
        ${officers.map(m => `
          <div class="tree-branch-col">
            <span class="tree-category-tag">${escapeHtml(m.role.split('/')[0].replace('(Primary)', '').trim())}</span>
            ${createTreeNodeHtml(m, 'node-officer', 'Incident Command')}
          </div>
        `).join('')}
      </div>

      <div class="tree-stem-down" style="margin-top: 20px;"></div>
      <div class="tree-branch-bar" style="width: 85%;"></div>

      <!-- LEVEL 4: Floor Operations & Specialized Rescue -->
      <div class="tree-branch-grid" style="margin-top: 0;">
        <!-- Col 1: Floor Wardens -->
        <div class="tree-branch-col" style="flex: 2;"
             ondragover="handleTreeLevelDragOver(event)" 
             ondragleave="handleTreeLevelDragLeave(event)" 
             ondrop="handleTreeLevelDrop(event, 'Floor Operations')">
          <span class="tree-category-tag" style="background: rgba(16,185,129,0.15); color: #10b981; border-color: rgba(16,185,129,0.3);">
            Level 4A • Floor Wardens & Evacuation Sweepers (${wardens.length})
          </span>
          <div class="tree-node-group" style="justify-content: center;">
            ${wardens.map(m => createTreeNodeHtml(m, 'node-warden', 'Floor Operations')).join('')}
          </div>
        </div>

        <!-- Col 2: Mobility Assistance -->
        <div class="tree-branch-col" style="flex: 1;"
             ondragover="handleTreeLevelDragOver(event)" 
             ondragleave="handleTreeLevelDragLeave(event)" 
             ondrop="handleTreeLevelDrop(event, 'Specialized Rescue')">
          <span class="tree-category-tag" style="background: rgba(168,85,247,0.15); color: #c084fc; border-color: rgba(168,85,247,0.3);">
            Level 4B • Mobility & Area of Refuge (${mobility.length})
          </span>
          <div class="tree-sub-list">
            ${mobility.map(m => createTreeNodeHtml(m, 'node-rescue', 'Specialized Rescue')).join('')}
          </div>
        </div>
      </div>

      <div class="tree-stem-down" style="margin-top: 24px;"></div>
      <div class="tree-branch-bar" style="width: 90%;"></div>

      <!-- LEVEL 5: In-House Technical Support & Engineering Response -->
      <div class="tree-branch-grid" style="margin-top: 0;">
        <div class="tree-branch-col" style="width: 100%;"
             ondragover="handleTreeLevelDragOver(event)" 
             ondragleave="handleTreeLevelDragLeave(event)" 
             ondrop="handleTreeLevelDrop(event, 'Technical Support')">
          <span class="tree-category-tag" style="background: rgba(99,102,241,0.15); color: #818cf8; border-color: rgba(99,102,241,0.3);">
            Level 5 • In-House Engineering & Technical Support Response Team (${engineers.length})
          </span>
          <div class="tree-node-group" style="justify-content: center;">
            ${engineers.map(m => createTreeNodeHtml(m, 'node-engineer', 'Technical Support')).join('')}
          </div>
        </div>
      </div>

    </div>
  `;

  container.innerHTML = html;
  initOrgTreePanning();
};

function initOrgTreePanning() {
  const wrappers = document.querySelectorAll('.org-tree-scroll-wrapper');
  wrappers.forEach(slider => {
    if (slider.dataset.panInitialized) return;
    slider.dataset.panInitialized = 'true';

    let isDown = false;
    let startX, startY, scrollLeft, scrollTop;

    slider.addEventListener('mousedown', (e) => {
      if (e.target.closest('.tree-node-box') || e.target.closest('button') || e.target.closest('input')) return;
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      startY = e.pageY - slider.offsetTop;
      scrollLeft = slider.scrollLeft;
      scrollTop = slider.scrollTop;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const y = e.pageY - slider.offsetTop;
      const walkX = (x - startX) * 1.3;
      const walkY = (y - startY) * 1.3;
      slider.scrollLeft = scrollLeft - walkX;
      slider.scrollTop = scrollTop - walkY;
    });
  });
}

// Render Draggable Tier Cards View
window.renderOrgCardsView = function() {
  const container = document.getElementById('org-cards-view-container');
  if (!container) return;

  const orgList = getActiveOrgStructure();

  let html = '';

  ORG_TIER_CONFIG.forEach(tier => {
    const tierMembers = orgList.filter(m => m.tier === tier.key);
    tierMembers.sort((a, b) => (a.order || 99) - (b.order || 99));

    const memberCards = tierMembers.map(m => {
      let photoContent = '';
      if (m.photo) {
        photoContent = `<img src="${m.photo}" alt="${escapeHtml(m.name)}" onerror="this.parentElement.innerHTML='<div class=\\'org-card-photo-placeholder\\'>${escapeHtml(m.name.charAt(0))}</div>'">`;
      } else {
        const initials = m.name.split(' ').map(n => n.charAt(0)).filter((_, idx, arr) => idx === 0 || idx === arr.length - 1).join('');
        photoContent = `<div class="org-card-photo-placeholder">${escapeHtml(initials || 'EC')}</div>`;
      }

      const phoneLink = m.phone ? `<a href="tel:${m.phone}" title="Click to call">${m.phone}</a>` : '<span style="color:#64748b;">No direct phone</span>';

      return `
        <div class="org-member-card" 
             id="card-${m.id}" 
             draggable="true" 
             ondragstart="handleOrgDragStart(event, '${m.id}')"
             ondragover="handleOrgDragOver(event)"
             ondragleave="handleOrgDragLeave(event)"
             ondrop="handleOrgDrop(event, '${m.id}', '${tier.key}')"
             ondragend="handleOrgDragEnd(event)">
          
          <div class="org-card-photo-wrap" title="Drag card to move position. Click Edit to change photo.">
            ${photoContent}
          </div>

          <div class="org-card-body">
            <div class="org-card-name" title="${escapeHtml(m.name)}">${m.name}</div>
            <div class="org-card-role">${m.role}</div>
            <div class="org-card-phone">
              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              ${phoneLink}
            </div>
            ${m.duties ? `<div class="org-card-duties">${escapeHtml(m.duties)}</div>` : ''}

            <div class="org-card-actions print-no-show">
              <button type="button" class="org-card-btn" onclick="openEditOrgMemberModal('${m.id}')">✏️ Edit</button>
              <button type="button" class="org-card-btn" onclick="removeOrgMember('${m.id}')" style="color: #f87171;">🗑️</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    html += `
      <div class="org-tier-section" 
           id="tier-${tier.key.replace(/\s+/g, '-')}"
           ondragover="handleTierDragOver(event)"
           ondragleave="handleTierDragLeave(event)"
           ondrop="handleTierDrop(event, '${tier.key}')">
        
        <div class="org-tier-header">
          <div class="org-tier-title">
            <span>${tier.title}</span>
          </div>
          <span class="org-tier-badge">${tier.badge} (${tierMembers.length})</span>
        </div>

        <div class="org-tier-grid" id="grid-${tier.key.replace(/\s+/g, '-')}">
          ${memberCards || '<div style="color: var(--text-muted); font-size: 12px; font-style: italic; padding: 12px;">No personnel assigned to this tier. Drag a member here or click Add Member.</div>'}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
};

// Render Both Views to keep state synced
window.renderEmergencyOrgStructure = function() {
  renderHierarchicalOrgChart();
  renderOrgCardsView();
};

// Drag and Drop Handlers
window.handleOrgDragStart = function(event, memberId) {
  draggedMemberId = memberId;
  event.dataTransfer.setData('text/plain', memberId);
  event.dataTransfer.effectAllowed = 'move';
  const el = document.getElementById(`card-${memberId}`);
  if (el) {
    setTimeout(() => el.classList.add('dragging'), 0);
  }
};

window.handleOrgDragOver = function(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = 'move';
  const targetCard = event.target.closest('.org-member-card');
  if (targetCard && !targetCard.classList.contains('dragging')) {
    targetCard.classList.add('drag-over-card');
  }
};

window.handleOrgDragLeave = function(event) {
  event.preventDefault();
  const targetCard = event.target.closest('.org-member-card');
  if (targetCard) {
    targetCard.classList.remove('drag-over-card');
  }
};

window.handleTierDragOver = function(event) {
  event.preventDefault();
  const tierSection = event.target.closest('.org-tier-section');
  if (tierSection) {
    tierSection.classList.add('drag-over-tier');
  }
};

window.handleTierDragLeave = function(event) {
  event.preventDefault();
  const tierSection = event.target.closest('.org-tier-section');
  if (tierSection) {
    tierSection.classList.remove('drag-over-tier');
  }
};

window.handleOrgDrop = function(event, targetMemberId, tierKey) {
  event.preventDefault();
  event.stopPropagation();
  
  document.querySelectorAll('.drag-over-card').forEach(el => el.classList.remove('drag-over-card'));
  document.querySelectorAll('.drag-over-tier').forEach(el => el.classList.remove('drag-over-tier'));

  if (!draggedMemberId || draggedMemberId === targetMemberId) return;

  const orgList = getActiveOrgStructure();
  const sourceIndex = orgList.findIndex(m => m.id === draggedMemberId);
  const targetIndex = orgList.findIndex(m => m.id === targetMemberId);

  if (sourceIndex > -1 && targetIndex > -1) {
    const draggedItem = orgList.splice(sourceIndex, 1)[0];
    draggedItem.tier = tierKey; // update tier to target card's tier
    
    // Insert relative to target
    const newTargetIndex = orgList.findIndex(m => m.id === targetMemberId);
    orgList.splice(newTargetIndex, 0, draggedItem);

    // Re-index order
    orgList.forEach((m, idx) => { m.order = idx + 1; });

    saveActiveOrgStructure(orgList);
    renderEmergencyOrgStructure();
  }
};

window.handleTierDrop = function(event, tierKey) {
  event.preventDefault();
  document.querySelectorAll('.drag-over-tier').forEach(el => el.classList.remove('drag-over-tier'));

  if (!draggedMemberId) return;

  const orgList = getActiveOrgStructure();
  const member = orgList.find(m => m.id === draggedMemberId);
  if (member) {
    member.tier = tierKey;
    // Move to end of that tier
    saveActiveOrgStructure(orgList);
    renderEmergencyOrgStructure();
  }
};

window.handleOrgDragEnd = function(event) {
  draggedMemberId = null;
  document.querySelectorAll('.org-member-card').forEach(el => {
    el.classList.remove('dragging');
    el.classList.remove('drag-over-card');
  });
  document.querySelectorAll('.org-tier-section').forEach(el => el.classList.remove('drag-over-tier'));
};

// Org Member Modal Handlers
let modalTempPhotoData = null;

window.openAddOrgMemberModal = function() {
  modalTempPhotoData = null;
  const modal = document.getElementById('org-member-edit-modal');
  if (!modal) return;

  document.getElementById('org-modal-title').innerText = 'Add New Committee Member';
  document.getElementById('edit-member-id').value = '';
  document.getElementById('edit-member-name').value = '';
  document.getElementById('edit-member-role').value = '';
  document.getElementById('edit-member-tier').value = 'Floor Operations';
  document.getElementById('edit-member-phone').value = '';
  document.getElementById('edit-member-duties').value = '';
  
  const imgEl = document.getElementById('edit-member-photo-img');
  const placeholderEl = document.getElementById('edit-member-photo-placeholder');
  if (imgEl) {
    imgEl.src = '';
    imgEl.style.display = 'none';
  }
  if (placeholderEl) {
    placeholderEl.innerText = 'EC';
    placeholderEl.style.display = 'block';
  }

  modal.style.display = 'flex';
};

window.openEditOrgMemberModal = function(memberId) {
  modalTempPhotoData = null;
  const modal = document.getElementById('org-member-edit-modal');
  if (!modal) return;

  const orgList = getActiveOrgStructure();
  const member = orgList.find(m => m.id === memberId);
  if (!member) return;

  document.getElementById('org-modal-title').innerText = `Edit: ${member.name}`;
  document.getElementById('edit-member-id').value = member.id;
  document.getElementById('edit-member-name').value = member.name || '';
  document.getElementById('edit-member-role').value = member.role || '';
  document.getElementById('edit-member-tier').value = member.tier || 'Incident Command';
  document.getElementById('edit-member-phone').value = member.phone || '';
  document.getElementById('edit-member-duties').value = member.duties || '';

  const imgEl = document.getElementById('edit-member-photo-img');
  const placeholderEl = document.getElementById('edit-member-photo-placeholder');
  if (member.photo) {
    modalTempPhotoData = member.photo;
    if (imgEl) {
      imgEl.src = member.photo;
      imgEl.style.display = 'block';
    }
    if (placeholderEl) placeholderEl.style.display = 'none';
  } else {
    if (imgEl) {
      imgEl.src = '';
      imgEl.style.display = 'none';
    }
    if (placeholderEl) {
      const initials = member.name ? member.name.split(' ').map(n => n.charAt(0)).filter((_, idx, arr) => idx === 0 || idx === arr.length - 1).join('') : 'EC';
      placeholderEl.innerText = initials || 'EC';
      placeholderEl.style.display = 'block';
    }
  }

  modal.style.display = 'flex';
};

window.closeOrgMemberModal = function(event) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('org-member-edit-modal');
  if (modal) modal.style.display = 'none';
  modalTempPhotoData = null;
};

window.handleOrgModalPhotoUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const rawDataUrl = e.target.result;
    compressImageToDataUrl(rawDataUrl, 600, 0.85, (compressed) => {
      modalTempPhotoData = compressed;
      const imgEl = document.getElementById('edit-member-photo-img');
      const placeholderEl = document.getElementById('edit-member-photo-placeholder');
      if (imgEl) {
        imgEl.src = compressed;
        imgEl.style.display = 'block';
      }
      if (placeholderEl) placeholderEl.style.display = 'none';
    });
  };
  reader.readAsDataURL(file);
};

window.saveOrgMemberModal = function() {
  const memberId = document.getElementById('edit-member-id').value;
  const name = document.getElementById('edit-member-name').value.trim();
  const role = document.getElementById('edit-member-role').value.trim();
  const tier = document.getElementById('edit-member-tier').value;
  const phone = document.getElementById('edit-member-phone').value.trim();
  const duties = document.getElementById('edit-member-duties').value.trim();

  if (!name || !role) {
    alert('Please enter both Name and Role.');
    return;
  }

  const orgList = getActiveOrgStructure();

  if (memberId) {
    // Edit existing
    const member = orgList.find(m => m.id === memberId);
    if (member) {
      member.name = name;
      member.role = role;
      member.tier = tier;
      member.phone = phone;
      member.duties = duties;
      if (modalTempPhotoData !== null) {
        member.photo = modalTempPhotoData;
      }
    }
  } else {
    // Add new
    const newMember = {
      id: 'org_custom_' + Date.now(),
      name: name,
      role: role,
      tier: tier,
      phone: phone,
      photo: modalTempPhotoData || '',
      duties: duties,
      order: orgList.length + 1
    };
    orgList.push(newMember);
  }

  saveActiveOrgStructure(orgList);
  renderEmergencyOrgStructure();
  
  const modal = document.getElementById('org-member-edit-modal');
  if (modal) modal.style.display = 'none';
  modalTempPhotoData = null;
};

window.removeOrgMember = function(memberId) {
  if (!confirm('Are you sure you want to remove this member from the committee chart?')) return;
  let orgList = getActiveOrgStructure();
  orgList = orgList.filter(m => m.id !== memberId);
  saveActiveOrgStructure(orgList);
  renderEmergencyOrgStructure();
};

window.resetEmergencyOrgStructure = function() {
  if (!confirm('Reset organizational structure back to default committee roster? Any custom rearrangements will be reset.')) return;
  localStorage.removeItem('onecorp_emergency_org_structure');
  renderEmergencyOrgStructure();
};

// Render Guidelines Static / Dynamic Sections
window.renderEmergencyGuidelines = function() {
  renderHazardProtocols();
  renderEvacuationPlansModule();
  renderMachineryContingency();
  renderEvacuationGuidelines();
  renderDrillsAndHotlines();
};

// Sub-Tab Switcher for Guidelines Panel
window.switchGuidelineSubTab = function(subTab) {
  document.querySelectorAll('.guideline-pill').forEach(pill => pill.classList.remove('active'));
  document.querySelectorAll('.guideline-pane').forEach(pane => pane.classList.remove('active'));

  const activePill = document.getElementById(`pill-${subTab}`);
  const activePane = document.getElementById(`pane-${subTab}`);

  if (activePill) activePill.classList.add('active');
  if (activePane) activePane.classList.add('active');

  if (subTab === 'org-structure') renderEmergencyOrgStructure();
  if (subTab === 'hazard-protocols') renderHazardProtocols();
  if (subTab === 'evac-plans') renderEvacuationPlansModule();
  if (subTab === 'heavy-machinery') renderMachineryContingency();
  if (subTab === 'evac-comms') renderEvacuationGuidelines();
  if (subTab === 'drills-hotlines') renderDrillsAndHotlines();
};

// 1. Hazard Protocols Content (10 Comprehensive Protocols)
const ALL_HAZARD_PROTOCOLS = [
  {
    id: 'fire',
    category: 'fire',
    icon: '🔥',
    title: '1. Fire Emergencies & Alarms',
    badge: 'Immediate Life Safety',
    targetTime: 'Acknowledge: <1 min | Evacuate: <3 min',
    immediate: [
      'Activate the nearest manual fire alarm pull station immediately without waiting for verification.',
      'Call 911 (BFP Baguio: 074 442 2222 / 911) and state exact building, floor, room location, and fire size.',
      'Evacuate immediately via designated exit stairwells; feel doors with the back of your hand before opening.',
      'If smoke is present, crawl low under smoke where air is cooler and cleaner; cover nose/mouth with cloth.'
    ],
    erc: [
      'Floor Wardens conduct rapid complete floor sweep and confirm all rooms, offices, and bathrooms are cleared.',
      'Facilities Lead verifies elevators automatically recall to Ground/Safe floor and HVAC fire dampers close.',
      'Only attempt extinguisher use (PASS technique) on small incipient stage fires if exit path is guaranteed.'
    ],
    donts: [
      'DO NOT use elevators under any circumstances during a fire alarm.',
      'DO NOT re-enter the building for personal belongings once evacuated.',
      'DO NOT fight spreading fires or fires producing heavy black toxic smoke.'
    ]
  },
  {
    id: 'seismic',
    category: 'seismic',
    icon: '🌐',
    title: '2. Earthquakes & Seismic Events',
    badge: 'Drop, Cover & Hold On',
    targetTime: 'Shelter: Immediate | Post-Shake Sweep: 5 min',
    immediate: [
      'DROP to hands and knees immediately to prevent being thrown off balance.',
      'COVER your head, neck, and torso under a sturdy desk or against an interior shear wall.',
      'HOLD ON to your shelter until shaking ceases entirely. Protect head and neck with arms.',
      'Stay indoors during shaking — falling glass, facade panels, and masonry pose the highest mortality risk.'
    ],
    erc: [
      'After shaking ceases, Floor Wardens inspect floors for structural cracks, buckled columns, and gas odors.',
      'Evacuate via fire stairwells if alarms sound or structural distress is observed; prepare for aftershocks.',
      'Building Emergency Coordinator (BEC) coordinates with licensed Structural Engineer before authorizing re-entry.'
    ],
    donts: [
      'DO NOT run outside during active ground tremors.',
      'DO NOT use elevators after an earthquake, even if electrical power appears normal.',
      'DO NOT stand in doorways — modern doorways are not structurally safer than sturdy tables.'
    ]
  },
  {
    id: 'wind',
    category: 'wind',
    icon: '🌀',
    title: '3. Severe Weather, High Winds & Typhoons',
    badge: 'Building Envelope & Wind Load',
    targetTime: 'Shelter: Pre-Landfall | Monitoring: 3-hr Cycle',
    immediate: [
      'Move immediately to designated interior shelter areas (interior core hallways, lower floor lobbies away from glass).',
      'Keep all windows, balcony doors, louvers, and exterior blinds tightly latched and secured.',
      'Monitor official PAGASA weather bulletins and building mass alert broadcasts continuously.'
    ],
    erc: [
      'Floor Wardens verify all occupants are evacuated from perimeter glass offices to interior structural cores.',
      'Facilities Lead shuts down non-essential rooftop exhaust units and monitors parapets and roof membranes.',
      'Maintain sheltered status until BEC and PAGASA officially downgrade typhoon signal warnings.'
    ],
    donts: [
      'DO NOT remain in perimeter glass offices, skylight areas, or open atriums during high wind gusts.',
      'DO NOT inspect rooftop or outdoor terraces during active typhoon winds.'
    ]
  },
  {
    id: 'flood',
    category: 'flood',
    icon: '🌊',
    title: '4. Severe Rain, Flash Flooding & Basement Intrusion',
    badge: 'Waterproofing & Sump Pumps',
    targetTime: 'Deploy Barriers: <15 min | Sump Check: Continuous',
    immediate: [
      'Move vehicles and critical equipment to upper basement levels or ground parking upon heavy rain warnings.',
      'Report any basement wall water seepage, floor drain bubbling, or elevator pit moisture to Facilities immediately.',
      'Avoid contact with any standing water near electrical panels, transformer vaults, or wall outlets.'
    ],
    erc: [
      'Facilities Lead confirms deployment of basement ramp flood gates, slot barriers, and perimeter sandbags.',
      'Verify automatic float switches and duplex alternation on all B1, B2, and B3 submersible sump pumps.',
      'Park elevator cabs at 2nd floor or above to prevent traction motor and electrical pit submersion.'
    ],
    donts: [
      'DO NOT walk or drive through flowing basement water of unknown depth.',
      'DO NOT attempt electrical circuit breaker resets while standing on wet concrete floors.'
    ]
  },
  {
    id: 'medical',
    category: 'medical',
    icon: '🩺',
    title: '5. Medical Emergencies & First Aid / CPR',
    badge: 'CPR & AED Triage',
    targetTime: 'First Aider on Scene: <3 min | EMS Escort: <5 min',
    immediate: [
      'Call 911 / EMS immediately. Provide exact building location, floor level, suite number, and chief complaint.',
      'Send a designated guide to ground entrance to meet incoming paramedics and hold service elevator.',
      'Deploy nearest Automated External Defibrillator (AED) and First Aid Kit if patient is unresponsive.'
    ],
    erc: [
      'Certified First Aider takes charge of CPR/First Aid and stabilizes patient until EMS arrival.',
      'Security clears bystanders, maintains crowd control, and reserves service elevator for EMS.',
      'Document exact incident timeline, vital signs, symptoms, and care administered for EMS turnover.'
    ],
    donts: [
      'DO NOT move a seriously injured or fallen person unless there is immediate life hazard (fire/collapse).',
      'DO NOT administer oral fluids, food, or unprescribed medication to an unconscious casualty.'
    ]
  },
  {
    id: 'threat',
    category: 'threat',
    icon: '🛡️',
    title: '6. Active Threat & Workplace Violence',
    badge: 'Run • Hide • Fight Protocol',
    targetTime: 'Lockdown: <1 min | Police Dispatch: Immediate',
    immediate: [
      'RUN: If safe evacuation route exists, evacuate immediately leaving personal belongings behind.',
      'HIDE: If escape is blocked, lock and barricade doors, turn off lights, silence cell phones and vibrations.',
      'FIGHT: As absolute last resort and only when life is in imminent danger, act aggressively to incapacitate threat.',
      'Call 911 when safe and keep hands raised, open, and visible when encountering police officers.'
    ],
    erc: [
      'Security Lead initiates building-wide electronic perimeter access lockdown and feeds CCTV data to SWAT/Police.',
      'Communications Officer broadcasts clear, calm lockdown notifications without inducing panic.'
    ],
    donts: [
      'DO NOT pull fire alarm during an active shooting unless an active fire exists.',
      'DO NOT open barricaded doors for anyone until official law enforcement confirms all-clear.'
    ]
  },
  {
    id: 'bomb',
    category: 'bomb',
    icon: '📦',
    title: '7. Bomb Threats & Suspicious Packages',
    badge: 'Isolation & Radio Silence',
    targetTime: 'Isolate Area: <5 min | EOD Dispatch: Immediate',
    immediate: [
      'Phone Threat: Keep caller talking, note exact wording, caller ID, background sounds, accent, demands.',
      'Suspicious Package: DO NOT touch, move, shake, or open the item. Note shape, wires, grease stains, odors.',
      'Notify Security Desk and BEC immediately; discretely isolate room and evacuate adjacent suites.'
    ],
    erc: [
      'BEC liaises with PNP Explosive Ordnance Disposal (EOD) team to determine safe evacuation radius (min 100m).',
      'Security establishes perimeter barricade tape and directs occupants along routes away from suspect item.'
    ],
    donts: [
      'DO NOT use two-way radios or mobile phones within 50 meters of a suspected explosive device.',
      'DO NOT touch, immerse in water, or cover suspicious packages.'
    ]
  },
  {
    id: 'hazmat',
    category: 'hazmat',
    icon: '☣️',
    title: '8. Hazardous Materials (HAZMAT) Spill & Gas Leaks',
    badge: 'Upwind Evacuation & Isolation',
    targetTime: 'HVAC Cutoff: <2 min | Area Isolated: <5 min',
    immediate: [
      'Alert occupants in immediate zone and move immediately UPWIND and UPHILL from spill or odor source.',
      'Gas Leak: Smelling rotten eggs / mercaptan? Evacuate immediately without operating electrical switches.',
      'Call 911 and report substance name (from SDS), estimated volume, and hazard class.'
    ],
    erc: [
      'Facilities Lead shuts off main gas valve and closes HVAC fresh air intakes for affected zones.',
      'Designate isolation perimeter; assemble chemical Safety Data Sheets (SDS) for incoming HAZMAT responders.'
    ],
    donts: [
      'DO NOT operate light switches, elevators, or open flames in gas-concentrated spaces.',
      'DO NOT attempt HAZMAT chemical cleanup without certified training and Level A/B PPE.'
    ]
  },
  {
    id: 'elevator',
    category: 'elevator',
    icon: '🛗',
    title: '9. Elevator Entrapment & Hoistway Safety',
    badge: 'Passenger Calm & Contractor Dispatch',
    targetTime: 'Intercom Contact: <2 min | Tech On-Site: <30 min',
    immediate: [
      'Press in-cab emergency call button / intercom to communicate directly with Building Security.',
      'Remain calm and seated on floor; elevator cabs are well-ventilated and cannot free-fall due to safety brakes.',
      'Security dispatches in-house engineering and contacts elevator service company emergency hotline.'
    ],
    erc: [
      'Maintain continuous two-way communication with trapped occupants, reassuring them rescue is underway.',
      'Facilities Lead monitors cab position indicator and guides certified elevator mechanics on landing.',
      'If entrapment coincides with fire alarm, elevator rescue becomes immediate top priority.'
    ],
    donts: [
      'DO NOT attempt to pry hoistway doors open with crowbars from inside or outside.',
      'DO NOT allow untrained personnel or occupants to attempt rooftop shaft rescues.'
    ]
  },
  {
    id: 'assessment',
    category: 'assessment',
    icon: '🏢',
    title: '10. Post-Emergency Building Assessment & Tenant Communication',
    badge: 'ATC-20 Structural Clearance',
    targetTime: 'Initial Walkthrough: <30 min | Tenant Updates: Every 30-60 min',
    immediate: [
      'As soon as safe, BEC, Assistant BEC, and Facilities Lead conduct an initial walk-through of affected areas.',
      'Inspect structural integrity, egress stairwells, life-safety alarms, sprinklers, and utilities.',
      'For fire, earthquake, or visible damage, obtain clearance from BFP/AHJ and licensed structural engineer before re-entry.'
    ],
    erc: [
      'Document findings on Official Incident Report and Reassurance Audit Log.',
      'Communications Officer broadcasts status updates to tenants every 30-60 minutes so occupants are never left uninformed.',
      'Issue final formal All-Clear notice once full certification and life-safety systems are verified.'
    ],
    donts: [
      'DO NOT authorize tenant re-entry without formal structural and life-safety certification.',
      'DO NOT leave building occupants without periodic status communications during closures.'
    ]
  },
  {
    id: 'utility',
    category: 'utility',
    icon: '⚡',
    title: '11. Utility Failure (Power, Gas & Water Outage Response)',
    badge: 'Backup Systems & Tenant Safety',
    targetTime: 'Generator Online: <10 sec | Triage & Welfare Check: <15 min',
    immediate: [
      'Power Outage: Verify emergency diesel generator auto-starts and ATS transfers critical load within 10 seconds; confirm emergency egress lighting active.',
      'Gas Leak / Mercaptan Odor: If rotten-egg odor is detected, DO NOT operate any electrical switches, phones, or open flames; evacuate immediately and call 911 / Gas Utility emergency line.',
      'Water Outage: Verify fire sprinkler booster pump and standpipe pressure; notify Local Fire Dept immediately if sprinkler water supply is compromised.',
      'Elevators: Check all elevator banks immediately for trapped passengers; park cabs at landings and post out-of-service notices.'
    ],
    erc: [
      'Facilities Lead conducts system triage: check main breakers, transformer vault, backup generator fuel/oil, sump pumps, and domestic water booster tanks.',
      'Floor Wardens conduct direct in-person welfare checks for vulnerable occupants reliant on electricity for medical equipment or refrigerated medicine.',
      'Commercial & Cafeteria Liaison alerts tenants with perishable inventory regarding cold-chain timelines and spoilage risk.',
      'Communications Officer contacts utility providers, logs ticket/reference numbers, and broadcasts status notices to occupants every 30-60 minutes.'
    ],
    donts: [
      'DO NOT use candles, lighters, or open flames to check for gas leaks or to light spaces during power outages.',
      'DO NOT operate elevators during an electrical grid failure until power stability is officially confirmed by the utility and maintenance team.',
      'DO NOT attempt electrical resets while standing in wet areas, standing water, or basement sump zones.'
    ]
  }
];

let activeHazardFilter = 'all';

function renderHazardProtocols() {
  const container = document.getElementById('hazard-protocols-accordion');
  if (!container) return;

  const filtered = activeHazardFilter === 'all' 
    ? ALL_HAZARD_PROTOCOLS 
    : ALL_HAZARD_PROTOCOLS.filter(h => h.category === activeHazardFilter);

  container.innerHTML = filtered.map(h => `
    <div class="hazard-card" id="hazard-card-${h.id}">
      <div class="hazard-card-header">
        <span class="hazard-icon">${h.icon}</span>
        <div style="flex: 1;">
          <div class="hazard-title">${h.title}</div>
          <div style="display: flex; gap: 8px; align-items: center; margin-top: 2px; flex-wrap: wrap;">
            <span style="font-size: 10px; font-weight: 700; color: #38bdf8; text-transform: uppercase; background: rgba(56,189,248,0.1); padding: 1px 6px; border-radius: 4px;">${h.badge}</span>
            <span style="font-size: 10.5px; color: #fde047; font-weight: 600;">⏱️ ${h.targetTime}</span>
          </div>
        </div>
      </div>
      
      <div class="action-block">
        <div class="action-block-title">⚡ Immediate Life-Safety Actions</div>
        <ul>
          ${h.immediate.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>

      <div class="action-block">
        <div class="action-block-title">👔 Floor Warden / BERT Committee Actions</div>
        <ul>
          ${h.erc.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>

      <div class="dont-alert">
        <div class="dont-alert-title">🚫 Critical DO NOTs</div>
        <ul>
          ${h.donts.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

window.filterHazardProtocols = function(category, btnEl) {
  activeHazardFilter = category;
  const bar = btnEl ? btnEl.closest('.hazard-filter-bar') : document.querySelector('.hazard-filter-bar');
  if (bar) {
    bar.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  }
  renderHazardProtocols();
};

window.printHazardProtocolsReport = function() {
  window.print();
};

// ==================== EMERGENCY EVACUATION PLANS PER FLOOR ====================
const FCLGC_EVACUATION_DATA = {
  'one-corporate': {
    id: 'one-corporate',
    name: 'One Corporate Building',
    location: 'North Drive, Baguio City',
    status: 'available',
    badge: '12 Floor Plans Available',
    floors: [
      {
        id: 'b3',
        code: 'B3',
        name: 'Third Basement Layout',
        badge: 'Vehicular & Utility',
        image: 'assets/evac_plans/oc_b3_third_basement.png',
        desc: 'Third Basement vehicular parking & lower utility level egress path to Stairwell A and Stairwell B.'
      },
      {
        id: 'b2',
        code: 'B2',
        name: 'Second Basement Layout',
        badge: 'Parking & Pump Room',
        image: 'assets/evac_plans/oc_b2_second_basement.png',
        desc: 'Second Basement parking, mechanical pump room egress, and direct stairwell escape routes.'
      },
      {
        id: 'b1',
        code: 'B1',
        name: 'First Basement Layout',
        badge: 'Parking & Maintenance Hub',
        image: 'assets/evac_plans/oc_b1_first_basement.png',
        desc: 'First Basement parking & maintenance hub egress leading to ground discharge stairs.'
      },
      {
        id: 'gf',
        code: 'GF',
        name: 'Ground Floor Layout',
        badge: 'Main Lobby & Primary Exit',
        image: 'assets/evac_plans/oc_gf_ground_floor.png',
        desc: 'Ground Floor Main Lobby, entrance vestibule, commercial retail egress, and primary North Drive Assembly exit.'
      },
      {
        id: '2f',
        code: '2F',
        name: 'Second Floor Layout',
        badge: 'Commercial Suites',
        image: 'assets/evac_plans/oc_2f_second_floor.png',
        desc: 'Second Floor tenant commercial units egress to pressurized fire exit stairwells.'
      },
      {
        id: '3f',
        code: '3F',
        name: 'Third Floor Layout',
        badge: 'Offices & Area of Refuge',
        image: 'assets/evac_plans/oc_3f_third_floor.png',
        desc: 'Third Floor office suites, Area of Refuge at Stairwell A, and evacuation chair station.'
      },
      {
        id: '4f',
        code: '4F',
        name: 'Fourth Floor Layout',
        badge: 'Tenant Offices',
        image: 'assets/evac_plans/oc_4f_fourth_floor.png',
        desc: 'Fourth Floor tenant offices egress paths and emergency fire hose cabinet locations.'
      },
      {
        id: '5f',
        code: '5F',
        name: 'Fifth Floor Layout',
        badge: 'Offices & Area of Refuge',
        image: 'assets/evac_plans/oc_5f_fifth_floor.png',
        desc: 'Fifth Floor office suites, Area of Refuge at Stairwell A, and evacuation chair station.'
      },
      {
        id: '6f',
        code: '6F',
        name: 'Sixth Floor Layout',
        badge: 'Tenant Offices',
        image: 'assets/evac_plans/oc_6f_sixth_floor.png',
        desc: 'Sixth Floor tenant offices egress corridors to East and West fire exit stairs.'
      },
      {
        id: '7f',
        code: '7F',
        name: 'Seventh Floor Layout',
        badge: 'Corporate Suites & Area of Refuge',
        image: 'assets/evac_plans/oc_7f_seventh_floor.png',
        desc: 'Seventh Floor corporate suites, Area of Refuge at Stairwell A, and evacuation chair station.'
      },
      {
        id: '8f',
        code: '8F',
        name: 'Eighth Floor Layout',
        badge: 'Executive Offices',
        image: 'assets/evac_plans/oc_8f_eighth_floor.png',
        desc: 'Eighth Floor executive offices egress paths to protected fire escape stairs.'
      },
      {
        id: 'rd',
        code: 'RD',
        name: 'Roof Deck Floor Layout',
        badge: 'Penthouse & Water Tanks',
        image: 'assets/evac_plans/oc_rd_roof_deck.png',
        desc: 'Roof Deck mechanical penthouse, water tanks area, and downward egress stairwell access.'
      }
    ]
  },
  'one-center': {
    id: 'one-center',
    name: 'One Center',
    location: 'Baguio City',
    status: 'unavailable',
    remark: 'NO EVACUATION PLAN AVAILABLE',
    message: 'The architectural emergency egress plan for One Center is currently under preparation and engineering review. Floor layouts and life-safety evacuation paths will be uploaded once certified by the Bureau of Fire Protection (BFP).'
  },
  'lefern-hotel': {
    id: 'lefern-hotel',
    name: 'LeFern Hotel',
    location: 'Baguio City',
    status: 'unavailable',
    remark: 'NO EVACUATION PLAN AVAILABLE',
    message: 'The architectural emergency egress plan for LeFern Hotel is currently under preparation and hospitality safety audit. Guestroom floor layouts and emergency exit paths will be uploaded once certified by the Bureau of Fire Protection (BFP).'
  }
};

let activeEvacBuilding = 'one-corporate';
let activeEvacFloorFilter = 'all';

function renderEvacuationPlansModule() {
  const container = document.getElementById('evac-building-content-display');
  if (!container) return;

  const bldg = FCLGC_EVACUATION_DATA[activeEvacBuilding] || FCLGC_EVACUATION_DATA['one-corporate'];

  if (bldg.status === 'unavailable') {
    container.innerHTML = `
      <div class="no-plan-notice-card">
        <div class="no-plan-notice-icon">${bldg.id === 'lefern-hotel' ? '🏨' : '🏢'}</div>
        <h3 class="no-plan-notice-title">${bldg.name}</h3>
        <div class="no-plan-notice-remark">⚠️ ${bldg.remark}</div>
        <p class="no-plan-notice-msg">${bldg.message}</p>
        <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="alert('Safety Committee notified: Architectural floor layouts requested for ${bldg.name}.')">
            📨 Notify Safety Committee
          </button>
          <button type="button" class="btn btn-primary btn-sm" onclick="selectEvacBuilding('one-corporate')">
            View One Corporate Evacuation Plans &rarr;
          </button>
        </div>
      </div>
    `;
    return;
  }

  // Available building (One Corporate)
  const floorPills = [
    { id: 'all', label: 'All Floors (12)' },
    { id: 'b3', label: 'B3 (3rd Bsmt)' },
    { id: 'b2', label: 'B2 (2nd Bsmt)' },
    { id: 'b1', label: 'B1 (1st Bsmt)' },
    { id: 'gf', label: 'Ground Floor' },
    { id: '2f', label: '2nd Floor' },
    { id: '3f', label: '3rd Floor' },
    { id: '4f', label: '4th Floor' },
    { id: '5f', label: '5th Floor' },
    { id: '6f', label: '6th Floor' },
    { id: '7f', label: '7th Floor' },
    { id: '8f', label: '8th Floor' },
    { id: 'rd', label: 'Roof Deck' }
  ];

  const filteredFloors = activeEvacFloorFilter === 'all'
    ? bldg.floors
    : bldg.floors.filter(f => f.id === activeEvacFloorFilter);

  container.innerHTML = `
    <!-- Floor Filter Pills Bar -->
    <div class="evac-floor-filter-bar">
      <span style="font-size: 11.5px; font-weight: 800; color: #38bdf8; text-transform: uppercase; margin-right: 4px;">Filter Floor:</span>
      ${floorPills.map(p => `
        <button type="button" class="evac-floor-pill ${activeEvacFloorFilter === p.id ? 'active' : ''}" onclick="filterEvacFloor('${p.id}', this)">
          ${p.label}
        </button>
      `).join('')}
    </div>

    <!-- Cards Grid -->
    <div class="evac-plan-grid">
      ${filteredFloors.map(f => `
        <div class="evac-plan-card">
          <div class="evac-plan-img-wrap" onclick="openEmergencyLightbox('${f.image}', '${escapeHtml(f.name + ' — One Corporate Building')}')">
            <img src="${f.image}" alt="${escapeHtml(f.name)}" loading="lazy" onerror="if(!this.dataset.retried){this.dataset.retried='1';var fn=this.src.split('/').pop();this.src='assets/evac_plans/'+fn;}">
            <div class="evac-plan-overlay-hint">🔍 Click to Enlarge</div>
          </div>
          <div class="evac-plan-body">
            <div class="evac-plan-title-row">
              <h4 class="evac-plan-title">${f.name}</h4>
              <span class="evac-plan-badge">${f.code} • ${f.badge}</span>
            </div>
            <p class="evac-plan-desc">${f.desc}</p>
            <div class="evac-plan-actions">
              <button type="button" class="btn btn-secondary btn-sm" style="flex: 1; font-size: 11px;" onclick="openEmergencyLightbox('${f.image}', '${escapeHtml(f.name + ' — One Corporate Building')}')">
                🔍 Fullscreen
              </button>
              <button type="button" class="btn btn-primary btn-sm" style="flex: 1; font-size: 11px;" onclick="printSingleEvacPlan('${f.image}', '${escapeHtml(f.name)}')">
                🖨️ Print Layout
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.selectEvacBuilding = function(bldgId, btnEl) {
  activeEvacBuilding = bldgId;
  activeEvacFloorFilter = 'all';

  const bar = btnEl ? btnEl.closest('.evac-building-nav-bar') : document.querySelector('.evac-building-nav-bar');
  if (bar) {
    bar.querySelectorAll('.building-evac-tab').forEach(b => b.classList.remove('active'));
    const target = bar.querySelector(`[onclick*="('${bldgId}'"]`);
    if (target) target.classList.add('active');
    else if (btnEl) btnEl.classList.add('active');
  }

  renderEvacuationPlansModule();
};

window.filterEvacFloor = function(floorId, btnEl) {
  activeEvacFloorFilter = floorId;
  const bar = btnEl ? btnEl.closest('.evac-floor-filter-bar') : document.querySelector('.evac-floor-filter-bar');
  if (bar) {
    bar.querySelectorAll('.evac-floor-pill').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  }
  renderEvacuationPlansModule();
};

window.printSingleEvacPlan = function(imgSrc, title) {
  const printWin = window.open('', '_blank');
  if (!printWin) {
    alert('Please allow popups to print floor plans.');
    return;
  }
  printWin.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>\${title} - Emergency Evacuation Plan</title>
      <style>
        body { margin: 0; padding: 20px; font-family: sans-serif; text-align: center; background: #fff; color: #000; }
        h2 { margin: 0 0 10px 0; font-size: 20px; text-transform: uppercase; }
        p { margin: 0 0 15px 0; font-size: 12px; color: #555; }
        img { max-width: 100%; height: auto; max-height: 88vh; object-fit: contain; border: 1px solid #ddd; }
        @media print {
          body { padding: 0; }
          img { max-height: 94vh; width: auto; }
        }
      </style>
    </head>
    <body>
      <h2>\${title}</h2>
      <p>One Corporate Building | North Drive, Baguio City | Emergency Response Plan</p>
      <img src="\${imgSrc}" alt="\${title}">
      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 400);
        };
      <\/script>
    </body>
    </html>
  `);
  printWin.document.close();
};

window.printEvacPlansReport = function() {
  window.print();
};

// 2. Critical Building Machinery & Heavy Equipment Contingency
function renderMachineryContingency() {
  const container = document.getElementById('machinery-contingency-container');
  if (!container) return;

  const machines = [
    {
      name: 'Emergency Diesel Generator & Automatic Transfer Switch (ATS)',
      status: 'Primary Standby Power',
      icon: '⚡',
      specs: '500 kVA Standby Diesel Generator Set, 3-Phase 400/230V, Automatic Transfer Switch (ATS).',
      protocols: [
        'ATS automatically detects normal power grid failure and transfers critical life-safety loads in under 10 seconds.',
        'Weekly Saturday 8:00 AM test-run under load to verify starting voltage, frequency stability, and oil pressure.',
        'Main fuel storage and day tank must be maintained at 100% capacity before anticipated severe weather.',
        'Essential circuits priority: Fire pumps, jockey pump, egress lighting, CCTV, designated service elevator.'
      ],
      troubleshooting: [
        'Failure to Auto-Start: Check 24V DC starting battery voltage, verify emergency stop switch reset, check fuel line prime.',
        'ATS Failure to Transfer: Manually operate ATS bypass mechanical interlock handle located in Main Switchgear Room.',
        'Low Fuel Pressure / Airlock: Bleed fuel injection system and inspect secondary fuel water separator filter.'
      ],
      lead: 'Engr. Jevic Varona',
      role: 'Electrical Engineer',
      phone: '0917 621 6152'
    },
    {
      name: 'Sewage Treatment Plant (STP) & Effluent Sump Lines',
      status: 'Sanitary & Environmental',
      icon: '💧',
      specs: 'Biological Aeration Tank, Clarifier, Duplex Aeration Blowers, Dual Submersible Effluent Discharge Pumps.',
      protocols: [
        'Maintain continuous dissolved oxygen in biological aeration tank; monitor Mixed Liquor Suspended Solids (MLSS).',
        'Automatic cycling of duplex submersible discharge pumps; verify backflow prevention check valves are sealed.',
        'Chemical chlorine dosing pump calibration conducted weekly to ensure DENR / LLDA effluent compliance standards.',
        'Equipped with high-level overflow audio-visual alarm linked to Security Desk annunciator panel.'
      ],
      troubleshooting: [
        'Blower Overload Trip: Reset thermal overload relay in STP control panel; check blower belt tension and intake filter.',
        'High Sump Level Alarm: Immediately activate secondary manual override pump switch; inspect discharge check valve.',
        'Severe Storm Runoff Inflow: Divert excess rainwater away from equalization pit; activate auxiliary de-watering pump.'
      ],
      lead: 'Engr. Marie Onoten',
      role: 'Sanitary Engineer',
      phone: '0930 186 0163'
    },
    {
      name: 'Main Electrical Substation, Transformers & CCTV UPS',
      status: 'Power & Security Infrastructure',
      icon: '🔌',
      specs: 'Oil-Immersed Step-Down Substation Transformer, Main Distribution Panel (MDP), 64-Channel CCTV UPS Battery Bank.',
      protocols: [
        'Main transformer vault and MDP switchgear room must remain strictly clean, ventilated, and dry at all times.',
        'Strict Lockout / Tagout (LOTO) procedures must be enforced prior to any maintenance inspection or circuit breaker work.',
        '64-Channel IP CCTV monitoring and electronic access gates operate on dedicated industrial UPS batteries (min 4 hrs runtime).',
        'Weekly thermographic / temperature and oil level gauge inspections logged in the Electrical Maintenance Log.'
      ],
      troubleshooting: [
        'Main Breaker Trip: Do not re-close immediately. Inspect sub-feeders for short-circuit faults or water intrusion.',
        'Transformer High Temperature Alarm: Verify ventilation louvers are unobstructed; engage auxiliary cooling fans.',
        'Gate Barrier Malfunction: Use manual mechanical clutch release key kept at Security Guardhouse.'
      ],
      lead: 'Engr. Jevic Varona / Jojo Bennagen',
      role: 'Electrical Lead & Security',
      phone: '0917 621 6152 / 0946 181 7526'
    },
    {
      name: 'Fire Sprinkler Pumps, Jockey Pump & Water Cistern',
      status: 'Life Safety & Potable Supply',
      icon: '🚒',
      specs: 'UL/FM Certified Electric Main Fire Pump, Diesel Standby Fire Pump, Electric Jockey Pump, 50,000-Gal Water Cistern.',
      protocols: [
        'Main electric fire pump, diesel backup pump, and pressure jockey pump must maintain 120-140 PSI header pressure.',
        'All main suction and discharge Outside Screw & Yoke (OS&Y) gate valves must be padlocked and tamper-switched OPEN.',
        'Domestic potable water cistern and fire reserve water tank float switches monitored 24/7 to prevent dry-run cavitation.',
        'Quarterly flow testing and annual hydrostatic performance certifications conducted with BFP certified engineers.'
      ],
      troubleshooting: [
        'Jockey Pump Rapid Short-Cycling: Inspect underground sprinkler loop for minor flapper leaks or PRV weeping.',
        'Diesel Fire Pump Fails to Crank: Test dual starter battery bank A & B switch; check fuel shutoff solenoid.',
        'Low Water Cistern Alarm: Switch to auxiliary municipal supply bypass line; notify Baguio Water District (BWD).'
      ],
      lead: 'Mr. Elmer Esteban / George Ybanez',
      role: 'Facilities Lead & Mechanical Lead',
      phone: '0929 623 3556 / 0948 538 1602'
    },
    {
      name: 'Elevator Vertical Transportation & Hoistway Systems',
      status: 'Transit & Pit Safety',
      icon: '🛗',
      specs: 'Passenger Traction Elevators, Service Car, Microprocessor Controller, Seismic Sensor, Pit Float Sensors.',
      protocols: [
        'Seismic sensor automatically grounds and parks all cabs at the nearest floor and opens doors during tremors.',
        'During storm / flood warnings, elevator cabs are parked at the 2nd floor or above to protect traction motors and pit buffers.',
        'Monthly routine maintenance, governor safety cable testing, door interlock checks, and car ventilation inspections.',
        'Never return elevators to passenger service following an emergency trip until certified elevator technician sign-off is completed.'
      ],
      troubleshooting: [
        'Passenger Entrapment: Maintain continuous two-way voice communication; confirm cab landing position indicator.',
        'Pit Water Detection: Automatic pit float switch isolates power and parks cab at upper landing; activate pit sump pump.',
        'Door Sensor Interlock Fault: Clean optical infrared door curtains; verify mechanical door clutch alignment.'
      ],
      lead: 'George Ybanez / Contractor Hotline',
      role: 'Mechanical Lead / 24/7 Elevator Service',
      phone: '0948 538 1602 / (02) 8888-ELEV'
    },
    {
      name: 'Motorpool, Heavy Equipment & QA/QC Structural Support',
      status: 'Logistics, Transport & Structural QA',
      icon: '🚜',
      specs: 'Facility Transport Vehicles, Portable Submersible Trash Pumps, Portable Gensets, Heavy Scaffolding Bracing.',
      protocols: [
        'Emergency response vehicles kept on 100% fuel standby for medical evacuation and emergency parts transport.',
        'Portable de-watering submersible trash pumps, chainsaws, work lights, and hydraulic jacks tested and staged on B1.',
        'QA/QC Superintendent conducts rapid structural integrity screening of columns, shear walls, and bracing post-incident.',
        'Immediate coordination with Property Management for structural hardware procurement and emergency shoring.'
      ],
      troubleshooting: [
        'Structural Deflection / Wall Cracks: Immediately barricade area, erect temporary shoring props, and summon Structural Engineer.',
        'Portable Pump Clogged: Clear suction basket strainer; ensure heavy-duty grounded power extension cord is utilized.',
        'Auxiliary Transport Deployment: Motorpool lead authorizes priority vehicle dispatch for casualty or engineering support.'
      ],
      lead: 'Miguel Lomboy / Engr. Jemmer Guilao',
      role: 'Motorpool Lead / QA/QC Superintendent',
      phone: '0917 583 2140 / 0926 676 5293'
    }
  ];

  const machineCards = machines.map(m => `
    <div class="guideline-detail-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 8px;">
        <div>
          <h3 style="display: flex; align-items: center; gap: 8px; margin: 0; font-size: 14px;">
            <span>${m.icon}</span> ${m.name}
          </h3>
          <p style="font-size: 11px; color: #94a3b8; margin: 4px 0 0 0; font-style: italic;">${m.specs}</p>
        </div>
        <span style="font-size: 9.5px; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.1); padding: 3px 8px; border-radius: 4px; white-space: nowrap;">${m.status}</span>
      </div>

      <div style="margin-top: 10px;">
        <div style="font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 4px;">⚡ Operational & Preventive Protocols</div>
        <ul style="margin: 0 0 10px 0; padding-left: 18px; font-size: 11.5px; color: var(--text-muted);">
          ${m.protocols.map(p => `<li style="margin-bottom: 4px;">${p}</li>`).join('')}
        </ul>
      </div>

      <div style="background: rgba(245, 158, 11, 0.06); border: 1px dashed rgba(245, 158, 11, 0.3); border-radius: 6px; padding: 10px; margin-bottom: 10px;">
        <div style="font-size: 11px; font-weight: 700; color: #fde047; text-transform: uppercase; margin-bottom: 4px;">🔧 Emergency Troubleshooting & Failure Response</div>
        <ul style="margin: 0; padding-left: 18px; font-size: 11.5px; color: #e2e8f0;">
          ${m.troubleshooting.map(t => `<li style="margin-bottom: 3px;">${t}</li>`).join('')}
        </ul>
      </div>

      <div style="font-size: 11px; color: #94a3b8; border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div>Assigned Lead: <strong style="color: #fff;">${m.lead}</strong> <span style="color: #64748b;">(${m.role})</span></div>
        <a href="tel:${m.phone.replace(/[^0-9]/g, '')}" style="color: #38bdf8; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
          <span>📞</span> ${m.phone}
        </a>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <!-- Standard Machinery Emergency Flowchart (FCL-ERT-01 / Slide 20) -->
    <div style="grid-column: 1 / -1; background: rgba(0,0,0,0.25); border: 1px solid var(--border-color); border-radius: 8px; padding: 18px; margin-bottom: 16px;">
      <h3 style="font-family: var(--font-display); font-size: 15px; font-weight: 700; color: #f59e0b; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
        <span>🔄</span> Official 7-Step Emergency Flowchart for Heavy Machinery & Equipment (FCL-ERT-01)
      </h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 6px; padding: 10px;">
          <span style="font-size: 9.5px; font-weight: 800; background: #38bdf8; color: #000; padding: 2px 6px; border-radius: 4px;">STEP 1</span>
          <h4 style="font-size: 12px; font-weight: 700; color: #fff; margin: 6px 0 2px 0;">Discovery & Call</h4>
          <p style="font-size: 11px; color: var(--text-muted); margin: 0;">Personnel finding emergency immediately calls BM Manager / Supervisor.</p>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 6px; padding: 10px;">
          <span style="font-size: 9.5px; font-weight: 800; background: #38bdf8; color: #000; padding: 2px 6px; border-radius: 4px;">STEP 2</span>
          <h4 style="font-size: 12px; font-weight: 700; color: #fff; margin: 6px 0 2px 0;">Supervise & Assess</h4>
          <p style="font-size: 11px; color: var(--text-muted); margin: 0;">BM Manager assesses situation & alerts Top Management immediately.</p>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 6px; padding: 10px;">
          <span style="font-size: 9.5px; font-weight: 800; background: #38bdf8; color: #000; padding: 2px 6px; border-radius: 4px;">STEP 3</span>
          <h4 style="font-size: 12px; font-weight: 700; color: #fff; margin: 6px 0 2px 0;">In-House Troubleshoot</h4>
          <p style="font-size: 11px; color: var(--text-muted); margin: 0;">Manager directs in-house skilled electricians / mechanics to contain.</p>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 6px; padding: 10px;">
          <span style="font-size: 9.5px; font-weight: 800; background: #38bdf8; color: #000; padding: 2px 6px; border-radius: 4px;">STEP 4</span>
          <h4 style="font-size: 12px; font-weight: 700; color: #fff; margin: 6px 0 2px 0;">Contractor Escalation</h4>
          <p style="font-size: 11px; color: var(--text-muted); margin: 0;">If specialized, immediately contact 3rd-party supplier / service hotline.</p>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 6px; padding: 10px;">
          <span style="font-size: 9.5px; font-weight: 800; background: #38bdf8; color: #000; padding: 2px 6px; border-radius: 4px;">STEP 5</span>
          <h4 style="font-size: 12px; font-weight: 700; color: #fff; margin: 6px 0 2px 0;">Auxiliary Deployment</h4>
          <p style="font-size: 11px; color: var(--text-muted); margin: 0;">Deploy Motorpool vehicles & auxiliary portable pumps/power tools.</p>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 6px; padding: 10px;">
          <span style="font-size: 9.5px; font-weight: 800; background: #38bdf8; color: #000; padding: 2px 6px; border-radius: 4px;">STEP 6</span>
          <h4 style="font-size: 12px; font-weight: 700; color: #fff; margin: 6px 0 2px 0;">QA/QC Verification</h4>
          <p style="font-size: 11px; color: var(--text-muted); margin: 0;">QA/QC double-checks and certifies system is safe before restarting.</p>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 6px; padding: 10px;">
          <span style="font-size: 9.5px; font-weight: 800; background: #38bdf8; color: #000; padding: 2px 6px; border-radius: 4px;">STEP 7</span>
          <h4 style="font-size: 12px; font-weight: 700; color: #fff; margin: 6px 0 2px 0;">Filing IR & Debrief</h4>
          <p style="font-size: 11px; color: var(--text-muted); margin: 0;">File Incident Report (IR) to Upper Management; conduct team debriefing.</p>
        </div>
      </div>
    </div>

    <!-- Machinery Cards Grid -->
    <div style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px;">
      ${machineCards}
    </div>
  `;
}

// 3. Evacuation, Areas of Refuge & Emergency Communications
function renderEvacuationGuidelines() {
  const container = document.getElementById('evac-comms-container');
  if (!container) return;

  const blocks = [
    {
      icon: '📢',
      title: 'Internal & External Emergency Notification Chains',
      desc: 'Structured, multi-tier notification sequence to ensure zero misinformation and rapid agency response:',
      items: [
        '<strong>1. Hazard Discovery:</strong> Discoverer immediately calls Security / Front Desk or pulls manual fire alarm station.',
        '<strong>2. Security Escalation:</strong> Security notifies Building Emergency Coordinator (BEC: Engr. Roan Gallegos) and dials 911 immediately for life safety.',
        '<strong>3. Committee Activation:</strong> BEC activates Floor Wardens, First Aid Team, Facilities Lead, and Property Management.',
        '<strong>4. Floor Broadcast:</strong> Floor Wardens direct floor occupants via Public Address (PA), megaphones, and room sweeps.',
        '<strong>5. External Notifications:</strong> Property Management notifies Building Owner, Utility Companies (BENECO, BWD), and Insurance Carriers.'
      ]
    },
    {
      icon: '🎙️',
      title: 'Public Address (PA) Scripts & Mass Notification Broadcasts',
      desc: 'Standard pre-approved emergency announcement scripts to maintain order and prevent panic:',
      items: [
        '<strong>PA Fire Evacuation Script:</strong> <em>"Attention please. An emergency has been reported in the building. Please evacuate immediately using the nearest exit stairwells. Do not use elevators. Walk calmly to the North Drive Assembly Area." (Repeat 2x)</em>',
        '<strong>PA Earthquake / Shelter Script:</strong> <em>"Attention please. An earthquake is occurring. Drop, Cover, and Hold On. Move away from glass facade windows. Remain sheltered until tremors cease." (Repeat 2x)</em>',
        '<strong>Mass SMS / Email Broadcast:</strong> Instant digital emergency notification blast sent to all registered tenant emergency points-of-contact (POCs) with timestamped status updates.',
        '<strong>Two-Way Radio Channels:</strong> Channel 1: Incident Command / BEC; Channel 2: Floor Wardens & Sweepers; Channel 3: Facilities & In-House Engineers; Channel 4: Security Patrol.'
      ]
    },
    {
      icon: '♿',
      title: 'Areas of Refuge & Persons with Mobility Limitations',
      desc: 'Life-safety safeguards for individuals with temporary or permanent disabilities:',
      items: [
        '<strong>Pre-Identification Roster:</strong> Building Management maintains a confidential list of mobility-impaired occupants updated quarterly.',
        '<strong>Assigned Mobility Officers:</strong> Dedicated 1-to-1 assistance assigned to Berson Pukchas (0918 368 2598) and Ruben Banez (0930 401 2786).',
        '<strong>Pressurized Areas of Refuge:</strong> Designated fire stairwell landings on Floors 2 through 8 serve as smoke-pressurized Areas of Refuge.',
        '<strong>Evacuation Chairs:</strong> Specialized tracked evacuation chairs mounted at Stairwell A (Floors 3, 5, and 7) — operated strictly by trained staff.',
        '<strong>BFP First Responder Alert:</strong> Floor Wardens immediately notify arriving BFP rescue officers of the exact stairwell floor and count of sheltered occupants.'
      ]
    },
    {
      icon: '👥',
      title: 'Visitors, Contractors & Assembly Area Accountability',
      desc: 'Roster reconciliation and headcount verification at the official muster station:',
      items: [
        '<strong>Official Assembly Area:</strong> <em>North Drive Main Plaza & Open Parking Grounds</em> directly across the primary building lobby.',
        '<strong>Visitor / Contractor Logs:</strong> Security Desk brings daily sign-in and visitor logs directly to the Assembly Area.',
        '<strong>Floor Sweeps & Door Tagging:</strong> Wardens sweep all restrooms, storage rooms, and offices, placing fluorescent "CLEARED" magnetic tags on doors.',
        '<strong>Roll Call & Headcount:</strong> Floor Wardens collect tenant headcount rosters and submit roll calls to <strong>Donald Geron (Assembly Area Marshal: 0917 500 1234)</strong>.',
        '<strong>Strict No Re-Entry Policy:</strong> No occupant or employee may re-enter the facility until the BEC issues a formal written ALL-CLEAR.'
      ]
    },
    {
      icon: '🌙',
      title: 'After-Hours & Weekend Emergency Protocols',
      desc: 'Procedures when building management is off-duty during nights and weekends:',
      items: [
        '<strong>Security Guard-in-Charge:</strong> Head Security Guard acts as Initial Incident Commander until the BEC or Deputy BEC arrives on site.',
        '<strong>After-Hours Call Tree:</strong> Posted at the Security Desk with priority speed-dial contacts for all In-House Engineers and Executive Officers.',
        '<strong>Master Emergency Key Box:</strong> Dual-custody master key sets for mechanical vaults, pump rooms, and electrical rooms secured in guardhouse safe.'
      ]
    },
    {
      icon: '📺',
      title: 'Media Relations & Public Disclosures Policy',
      desc: 'Protecting tenant privacy, factual accuracy, and corporate reputation:',
      items: [
        '<strong>Sole Spokesperson:</strong> <strong>Twinkle Domingo (Communications Officer: 0917 800 5678)</strong> and the Executive Board are the ONLY authorized spokespersons.',
        '<strong>Staff Rule:</strong> All maintenance personnel, guards, and wardens must politely state: <em>"We are currently managing the situation safely; all official inquiries should be directed to our Communications Office."</em>',
        '<strong>Social Media Prohibition:</strong> Staff and contractors are strictly prohibited from posting unverified photos, casualty estimates, or speculation on social media.'
      ]
    }
  ];

  container.innerHTML = blocks.map(b => `
    <div class="guideline-detail-card" style="margin-bottom: 14px;">
      <h3 style="display: flex; align-items: center; gap: 8px; font-size: 14px; margin-top: 0; color: #fff;">
        <span>${b.icon}</span> ${b.title}
      </h3>
      <p style="font-size: 12px; color: #94a3b8; margin: 4px 0 10px 0;">${b.desc}</p>
      <ul style="margin: 0; padding-left: 18px; font-size: 11.5px; color: var(--text-muted); line-height: 1.5;">
        ${b.items.map(i => `<li style="margin-bottom: 6px;">${i}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// 4. Drills Schedule & Comprehensive Emergency Hotlines Directory
function renderDrillsAndHotlines() {
  const container = document.getElementById('drills-hotlines-container');
  if (!container) return;

  const drills = [
    {
      title: 'Full Building Evacuation Drills (Fire & Life Safety)',
      freq: 'Semi-Annual (At least 2x per year)',
      desc: 'Timed building-wide evacuation simulations with BFP observation, stairwell clearance monitoring, and Assembly Area headcount audits.',
      lead: 'BEC Engr. Roan Gallegos / Donald Geron'
    },
    {
      title: 'Nationwide Simultaneous Earthquake Drill (NSED)',
      freq: 'Quarterly (4x per year)',
      desc: 'Drop, Cover & Hold On practice, interior core sheltering, post-tremor structural sweep, and mock casualty triage.',
      lead: 'Floor Wardens & Safety Committee'
    },
    {
      title: 'Tabletop Emergency Scenario Exercises',
      freq: 'Annual (1x per year)',
      desc: 'Executive & Incident Command walkthrough of complex disaster scenarios (e.g. power blackout combined with active seismic event).',
      lead: 'Executive Leadership & In-House Engineers'
    },
    {
      title: 'First Aid, CPR & AED Recertification',
      freq: 'Annual / Bi-Annual',
      desc: 'All Medical & First Aid Officers maintain valid Philippine Red Cross / TESDA certifications for adult/child CPR, AED, and wound triage.',
      lead: 'Martin Naimes (First Aid Lead)'
    },
    {
      title: 'Active Threat & Hostage Survival Briefings',
      freq: 'Annual (1x per year)',
      desc: 'Run, Hide, Fight practical briefings, perimeter security lockdown drills, and direct coordination protocols with PNP Baguio.',
      lead: 'Jojo Bennagen (Security Lead)'
    },
    {
      title: 'After-Action Report (AAR) Reviews & Plan Audits',
      freq: 'Post-Incident / Post-Drill',
      desc: 'Mandatory documentation of lessons learned, corrective maintenance work orders, and emergency roster updates following any real activation.',
      lead: 'BEC & Property Management'
    }
  ];

  const contactCategories = [
    {
      category: '🚨 Government Emergency Responders & Dispatch',
      contacts: [
        { name: 'National Emergency Dispatch Hotline', desc: 'Police, Fire, Medical, Rescue Dispatch', phone: '911' },
        { name: 'Bureau of Fire Protection (BFP Baguio HQ)', desc: 'City Fire Station & Hazmat Response', phone: '(074) 442-2222' },
        { name: 'BFP Baguio Sub-Station / Emergency', desc: 'Direct Fire Operations Line', phone: '(074) 442-7090' },
        { name: 'Baguio City Police Office (BCPO Station 1)', desc: 'Law Enforcement, Active Threat & EOD', phone: '(074) 442-1211' },
        { name: 'BCPO Police Emergency Hotline', desc: 'Direct Police Patrol Dispatch', phone: '(074) 661-1221 / 117' },
        { name: 'Baguio City Disaster Office (CDRRMO)', desc: 'Disaster Command Center & Storm Alerts', phone: '(074) 442-1900' },
        { name: 'CDRRMO 24/7 Mobile Command', desc: 'City Emergency Operations', phone: '0927 123 4567' },
        { name: 'Philippine Red Cross - Baguio Chapter', desc: 'Ambulance, Blood Bank & Emergency Triage', phone: '(074) 442-4036' }
      ]
    },
    {
      category: '🏥 Hospitals & Level 3 Medical Trauma Centers',
      contacts: [
        { name: 'Baguio General Hospital & Medical Center (BGHMC)', desc: 'Level 3 Trauma, Emergency & Burn Unit', phone: '(074) 661-7910' },
        { name: 'BGHMC Emergency Department Direct', desc: 'Gov. Pack Road Emergency Room', phone: '(074) 442-4216' },
        { name: 'Saint Louis University Hospital (SLU Sacred Heart)', desc: 'Emergency Trauma & ICU Department', phone: '(074) 442-5701' },
        { name: 'Pines City Doctors\' Hospital', desc: 'Emergency Room & Surgical Facilities', phone: '(074) 445-3020' },
        { name: 'Notre Dame de Chartres Hospital', desc: 'Emergency Medical & Ambulance', phone: '(074) 619-8530' }
      ]
    },
    {
      category: '⚡ Essential Public Utilities & Infrastructure',
      contacts: [
        { name: 'BENECO Electric Power Emergency Hotline', desc: 'Power Outage, Transformer & Cable Hazards', phone: '(074) 442-2295' },
        { name: 'BENECO 24/7 Mobile Trouble Desk', desc: 'Grid Failure Escalation', phone: '0908 865 7202' },
        { name: 'Baguio Water District (BWD Main Hotline)', desc: 'Water Supply, Main Line Leaks & Tankers', phone: '(074) 442-4929' },
        { name: 'BWD Emergency Operations Center', desc: '24/7 Water Maintenance Desk', phone: '(074) 442-3218' },
        { name: 'PLDT Commercial Telecom Trouble Hotline', desc: 'Landline & Fiber Egress Support', phone: '171 / (074) 442-2000' }
      ]
    },
    {
      category: '🏢 One Corporate In-House Leadership & BERT Leads',
      contacts: [
        { name: 'Engr. Roan Paul Gallegos', desc: 'Building Emergency Coordinator (BEC)', phone: '0917 659 8364' },
        { name: 'Mr. Elmer Esteban', desc: 'Deputy BEC / Facilities Lead', phone: '0929 623 3556' },
        { name: 'Engr. Jevic Varona', desc: 'Electrical Engineer (Power, ATS, Genset)', phone: '0917 621 6152' },
        { name: 'Engr. Marie Onoten', desc: 'Sanitary Engineer (STP, Plumbing, Pumps)', phone: '0930 186 0163' },
        { name: 'Engr. Jemmer Guilao', desc: 'QA/QC Superintendent (Structural Audit)', phone: '0926 676 5293' },
        { name: 'George Ybanez', desc: 'Mechanical & Elevator Lead', phone: '0948 538 1602' },
        { name: 'Miguel Lomboy', desc: 'Motorpool & Auxiliary Tools Lead', phone: '0917 583 2140' },
        { name: 'Jojo Bennagen', desc: 'Security & Access Control Lead', phone: '0946 181 7526' },
        { name: 'Martin Naimes', desc: 'Medical & First Aid Lead', phone: '0907 150 5202' },
        { name: 'Donald Geron', desc: 'Assembly Area Marshal / Property Officer', phone: '0917 500 1234' },
        { name: 'Twinkle Domingo', desc: 'Communications Lead & Spokesperson', phone: '0917 800 5678' }
      ]
    },
    {
      category: '🛠️ Contracted 24/7 Machinery & Specialty Hotlines',
      contacts: [
        { name: 'Elevator 24/7 Emergency Entrapment Hotline', desc: 'Contracted Vertical Transportation Team', phone: '(02) 8888-ELEV' },
        { name: 'Fire Protection & Sprinkler System Contractor', desc: 'Pump Overhaul & System Maintenance', phone: '(074) 442-FIRE' },
        { name: 'Emergency Diesel Generator Service Support', desc: 'Fuel Solenoid, ATS & Alternator Repairs', phone: '(074) 443-GENS' }
      ]
    }
  ];

  const drillCards = drills.map(d => `
    <div class="guideline-detail-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
        <h4 style="font-size: 13px; font-weight: 700; color: #fff; margin: 0;">${d.title}</h4>
        <span style="font-size: 10px; font-weight: 700; color: #fde047; background: rgba(245,158,11,0.15); padding: 2px 8px; border-radius: 4px;">${d.freq}</span>
      </div>
      <p style="font-size: 11.5px; color: var(--text-muted); margin: 0 0 6px 0; line-height: 1.4;">${d.desc}</p>
      <div style="font-size: 10.5px; color: #38bdf8; font-weight: 600;">Responsible: ${d.lead}</div>
    </div>
  `).join('');

  const categoryBlocks = contactCategories.map(cat => `
    <div style="margin-bottom: 18px;">
      <h4 style="font-size: 13px; font-weight: 700; color: #38bdf8; margin: 0 0 10px 0; border-bottom: 1px solid rgba(56,189,248,0.2); padding-bottom: 4px;">
        ${cat.category}
      </h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px;">
        ${cat.contacts.map(c => `
          <div class="hotline-card" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 6px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
            <div class="hotline-info">
              <h5 style="margin: 0; font-size: 12px; font-weight: 700; color: #fff;">${c.name}</h5>
              <p style="margin: 2px 0 0 0; font-size: 10.5px; color: var(--text-muted);">${c.desc}</p>
            </div>
            <a href="tel:${c.phone.replace(/[^0-9]/g, '')}" class="hotline-number" style="background: rgba(56,189,248,0.1); color: #38bdf8; font-weight: 700; font-size: 11.5px; padding: 4px 10px; border-radius: 4px; text-decoration: none; white-space: nowrap;">${c.phone}</a>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div style="grid-column: 1 / -1; margin-bottom: 8px;">
      <h3 style="font-family: var(--font-display); font-size: 15px; color: #fff; margin-bottom: 12px;">Mandatory Training & Drill Schedule Matrix</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px;">
        ${drillCards}
      </div>
    </div>

    <div style="grid-column: 1 / -1; margin-top: 16px;">
      <h3 style="font-family: var(--font-display); font-size: 15px; color: #fff; margin-bottom: 14px;">Official Emergency Hotlines & Key Contacts Directory</h3>
      ${categoryBlocks}
    </div>
  `;
}

// Navigation Exit Control to Prevent Nested Iframe Dashboards
window.exitToMainDashboard = function(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // 1. If embedded within the parent One Corporate app iframe
  try {
    if (window.parent && window.parent !== window && typeof window.parent.switchTab === 'function') {
      window.parent.switchTab('dashboard');
      return false;
    }
  } catch (err) {
    console.warn("Parent switchTab communication error:", err);
  }

  // 2. If top window has switchTab
  try {
    if (window.top && window.top !== window && typeof window.top.switchTab === 'function') {
      window.top.switchTab('dashboard');
      return false;
    }
  } catch (err) {}

  // 3. Fallback for standalone tab/browser window (replace entire top window)
  window.top.location.href = '../index.html';
  return false;
};



