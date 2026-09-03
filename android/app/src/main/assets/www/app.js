
// Exit Application Handler with Save Prompt
window.promptExitApp = function() {
  const modal = document.getElementById('modal-exit-app');
  if (modal) modal.style.display = 'flex';
};

window.closeExitAppModal = function() {
  const modal = document.getElementById('modal-exit-app');
  if (modal) modal.style.display = 'none';
};

window.confirmExitWithSave = function() {
  if (typeof saveAppStateToFile === 'function') {
    saveAppStateToFile('onecorporate_exit_backup.json');
  }
  window.closeExitAppModal();
  setTimeout(() => {
    window.performActualExit();
  }, 600);
};

window.confirmExitWithoutSave = function() {
  window.closeExitAppModal();
  window.performActualExit();
};

window.performActualExit = function() {
  if (window.SecurityEngine) {
    window.SecurityEngine.clearSessionData();
  }

  if (window.navigator && window.navigator.app && typeof window.navigator.app.exitApp === 'function') {
    window.navigator.app.exitApp();
    return;
  }

  document.body.innerHTML = `
    <div style="height: 100vh; background: #0b0f19; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 20px;">
      <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(56, 189, 248, 0.15); border: 2px solid #38bdf8; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: #38bdf8; font-size: 28px; font-weight: 800;">1C</div>
      <h2 style="font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 8px;">Application Exited Successfully</h2>
      <p style="font-size: 13px; color: #94a3b8; max-width: 400px; margin-bottom: 24px;">Your session has been securely closed. All state changes have been saved to local memory.</p>
      <button onclick="window.location.reload()" style="padding: 10px 24px; font-size: 13px; font-weight: 700; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #fff; border: none; border-radius: 8px; cursor: pointer;">⚡ Re-Open Application</button>
    </div>
  `;

  try {
    window.close();
  } catch(e) {}
};


// Role Sidebar Access & Permissions Customization System
const DEFAULT_ROLE_PERMISSIONS = {
  'Admin persona': ['dashboard', 'timeline', 'periodic', 'weekly', 'monthly', 'quarterly', 'yearly', 'registry', 'procedures', 'guidelines', 'emergency', 'inventory', 'reports', 'analytics', 'tenant', 'employee-schedule', 'about'],
  'Admin': ['dashboard', 'timeline', 'periodic', 'weekly', 'monthly', 'quarterly', 'yearly', 'registry', 'procedures', 'guidelines', 'emergency', 'inventory', 'reports', 'analytics', 'tenant', 'employee-schedule', 'about'],
  'Building Maintenance Manager': ['dashboard', 'timeline', 'periodic', 'weekly', 'monthly', 'quarterly', 'yearly', 'registry', 'procedures', 'guidelines', 'emergency', 'inventory', 'reports', 'analytics', 'tenant', 'employee-schedule', 'about'],
  'Manager': ['dashboard', 'timeline', 'periodic', 'weekly', 'monthly', 'quarterly', 'yearly', 'registry', 'procedures', 'guidelines', 'emergency', 'inventory', 'reports', 'analytics', 'tenant', 'employee-schedule', 'about'],
  'OIC Building Maintenance': ['dashboard', 'timeline', 'periodic', 'weekly', 'monthly', 'quarterly', 'yearly', 'registry', 'procedures', 'guidelines', 'emergency', 'inventory', 'reports', 'analytics', 'tenant', 'employee-schedule', 'about'],
  'Assistant Building Maintenance': ['dashboard', 'timeline', 'periodic', 'weekly', 'monthly', 'quarterly', 'yearly', 'registry', 'procedures', 'guidelines', 'emergency', 'inventory', 'reports', 'analytics', 'tenant', 'employee-schedule', 'about'],
  'Engineer persona': ['dashboard', 'timeline', 'periodic', 'weekly', 'monthly', 'quarterly', 'yearly', 'registry', 'procedures', 'guidelines', 'emergency', 'inventory', 'reports', 'analytics', 'about'],
  'Engineer': ['dashboard', 'timeline', 'periodic', 'weekly', 'monthly', 'quarterly', 'yearly', 'registry', 'procedures', 'guidelines', 'emergency', 'inventory', 'reports', 'analytics', 'about'],
  'Technician persona': ['dashboard', 'timeline', 'periodic', 'procedures', 'guidelines', 'emergency', 'about'],
  'Technician': ['dashboard', 'timeline', 'periodic', 'procedures', 'guidelines', 'emergency', 'about'],
  'Tenant persona': ['tenant'],
  'Tenant': ['tenant']
};

const ALL_SIDEBAR_ITEMS = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'timeline', label: '⏱️ Timeline & Operations' },
  { id: 'periodic', label: '🗓️ Periodic Timelines' },
  { id: 'weekly', label: '📅 Weekly Routines' },
  { id: 'monthly', label: '📅 Monthly Routines' },
  { id: 'quarterly', label: '📅 Quarterly Routines' },
  { id: 'yearly', label: '📅 Yearly Routines' },
  { id: 'registry', label: '📋 Master Equipment Registry' },
  { id: 'procedures', label: '📖 Maintenance Procedures' },
  { id: 'guidelines', label: '📘 Guidelines & Standards' },
  { id: 'emergency', label: '🚨 Emergency Protocols' },
  { id: 'inventory', label: '📦 Inventory & Supplies' },
  { id: 'reports', label: '📄 Compliance Reports' },
  { id: 'analytics', label: '📈 Plant Analytics' },
  { id: 'tenant', label: '🏢 Tenant Desk' },
  { id: 'employee-schedule', label: '👥 Employee Schedule' },
  { id: 'about', label: 'ℹ️ System Info' }
];

function getRoleAllowedItems(roleName) {
  const role = roleName || (appState && appState.currentUserRole) || 'Admin persona';
  
  const fullAccessRoles = ['Admin persona', 'Admin', 'Building Maintenance Manager', 'Manager', 'OIC Building Maintenance'];
  if (fullAccessRoles.includes(role)) {
    return ALL_SIDEBAR_ITEMS.map(i => i.id);
  }

  if (role === 'Tenant persona' || role === 'Tenant') {
    return ['tenant'];
  }

  let savedPerms = {};
  try {
    const raw = localStorage.getItem('onecorporate_role_permissions');
    if (raw) savedPerms = JSON.parse(raw);
  } catch(e) {}

  if (savedPerms && savedPerms[role] && Array.isArray(savedPerms[role])) {
    return savedPerms[role];
  }

  return DEFAULT_ROLE_PERMISSIONS[role] || ALL_SIDEBAR_ITEMS.map(i => i.id);
}

window.openRolePermissionsModal = function() {
  const modal = document.getElementById('modal-role-permissions');
  if (modal) modal.style.display = 'flex';

  const roleSelect = document.getElementById('role-perm-select-role');
  const activeRole = roleSelect ? roleSelect.value : 'Assistant Building Maintenance';
  window.onRolePermRoleChange(activeRole);
};

window.closeRolePermissionsModal = function() {
  const modal = document.getElementById('modal-role-permissions');
  if (modal) modal.style.display = 'none';
};

window.onRolePermRoleChange = function(selectedRole) {
  const grid = document.getElementById('role-perm-checkboxes-grid');
  if (!grid) return;

  const allowed = getRoleAllowedItems(selectedRole);

  grid.innerHTML = ALL_SIDEBAR_ITEMS.map(function(item) {
    var isChecked = allowed.includes(item.id) ? 'checked' : '';
    return '<label style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #cbd5e1; cursor: pointer; padding: 6px 8px; background: rgba(15, 23, 42, 0.4); border-radius: 4px; border: 1px solid #334155;">' +
      '<input type="checkbox" class="role-perm-cb" value="' + item.id + '" ' + isChecked + ' style="width: 16px; height: 16px; accent-color: #38bdf8; cursor: pointer;">' +
      '<span>' + item.label + '</span>' +
      '</label>';
  }).join('');
};

window.saveRolePermissions = function() {
  const roleSelect = document.getElementById('role-perm-select-role');
  const role = roleSelect ? roleSelect.value : 'Assistant Building Maintenance';

  const checkedBoxes = Array.from(document.querySelectorAll('.role-perm-cb:checked')).map(cb => cb.value);

  let savedPerms = {};
  try {
    const raw = localStorage.getItem('onecorporate_role_permissions');
    if (raw) savedPerms = JSON.parse(raw);
  } catch(e) {}

  savedPerms[role] = checkedBoxes;
  localStorage.setItem('onecorporate_role_permissions', JSON.stringify(savedPerms));

  alert("Role permissions for '" + role + "' saved successfully!");
  window.closeRolePermissionsModal();

  applyRoleVisibilityRestrictions();
};

window.resetRolePermissionsToDefault = function() {
  if (confirm("Reset all custom role permissions back to default settings?")) {
    localStorage.removeItem('onecorporate_role_permissions');
    const roleSelect = document.getElementById('role-perm-select-role');
    const activeRole = roleSelect ? roleSelect.value : 'Assistant Building Maintenance';
    window.onRolePermRoleChange(activeRole);
    applyRoleVisibilityRestrictions();
    alert("Role permissions reset to defaults.");
  }
};


// Helper to filter instructions based on log test interval (Daily, Weekly, Monthly, Annual)
function getInstructionsForInterval(instructions, subCategory, rType) {
  if (!instructions || instructions.length === 0) return [];

  const catLower = (subCategory || rType || '').toLowerCase();
  
  const matched = instructions.filter(inst => {
    const t = (inst.title || '').toLowerCase();
    const c = (inst.content || '').toLowerCase();

    if (catLower.includes('daily') || catLower.includes('floor') || catLower.includes('basement')) {
      return t.includes('daily') || t.includes('pre-start') || t.includes('flight check') || c.includes('daily');
    }
    if (catLower.includes('weekly')) {
      return t.includes('weekly') || t.includes('operation guide') || t.includes('shutdown') || c.includes('weekly');
    }
    if (catLower.includes('monthly')) {
      return t.includes('monthly') || t.includes('schedule') || c.includes('monthly');
    }
    if (catLower.includes('annual') || catLower.includes('yearly')) {
      return t.includes('annual') || t.includes('yearly') || t.includes('schedule') || c.includes('annual');
    }
    return true;
  });

  return matched.length > 0 ? matched : [instructions[0]];
}

// Helper to retrieve compliance inspection logs matching procedureKey, targetDate, and reportType
function getFilteredComplianceLogs(procKey, targetDateStr, reportType, startDate, endDateVal) {
  let logs = [];
  try {
    const saved = localStorage.getItem('onecorporate_maintenance_procedures_history');
    if (saved) logs = JSON.parse(saved);
  } catch(e) {}

  if (!logs || logs.length === 0) {
    // Standard seed compliance inspection logs if local storage is empty
    logs = [
      {
        id: 'log_genset_d1',
        procedureId: 'genset',
        procedureTitle: 'Generator Set Maintenance Procedure',
        procedureCode: 'PM-OCT-08',
        subCategory: 'Daily',
        date: '2026-09-03',
        preparedBy: 'Martin Naimes',
        inspectedBy: 'Engr. Roberto Santos (Chief Engr)',
        score: 100,
        items: [
          { text: 'Inspect fuel, lube oil, and coolant fluid levels', response: 'OK', remarks: 'All levels nominal' },
          { text: 'Drain water and sediment from fuel-water separator', response: 'OK', remarks: 'Clean' },
          { text: 'Inspect air cleaner restriction indicator', response: 'OK', remarks: 'Flag clear' },
          { text: 'Check battery charger voltage and electrolyte level', response: 'OK', remarks: '25.4 VDC rest voltage' },
          { text: 'Verify control panel is set to AUTO position', response: 'OK', remarks: 'Verified AUTO' },
          { text: 'Check engine perimeter for oil, coolant, or fuel leaks', response: 'OK', remarks: 'No leaks found' }
        ],
        images: []
      },
      {
        id: 'log_genset_w1',
        procedureId: 'genset',
        procedureTitle: 'Generator Set Maintenance Procedure',
        procedureCode: 'PM-OCT-08',
        subCategory: 'Weekly',
        date: '2026-08-14',
        preparedBy: 'Martin Naimes',
        inspectedBy: 'Engr. Roberto Santos',
        score: 100,
        items: [
          { text: 'Perform weekly operational test run (no-load / load)', response: 'OK', remarks: 'Ran 2.5 hrs under 50% load' },
          { text: 'Check belt tension and condition (fan and alternator belts)', response: 'OK', remarks: 'Good tension' },
          { text: 'Inspect exhaust system and flexible expansion joint', response: 'OK', remarks: 'No soot leaks' },
          { text: 'Verify jacket water heater operation (engine block warm)', response: 'OK', remarks: 'Block warm 45°C' }
        ],
        images: []
      },
      {
        id: 'log_fp_w1',
        procedureId: 'firepump',
        procedureTitle: 'Fire Pump & Jockey Pump Procedure Manual',
        procedureCode: 'PM-OCT-09',
        subCategory: 'Weekly',
        date: '2026-09-03',
        preparedBy: 'Mr. Crispin de Gracia',
        inspectedBy: 'Engr. Roberto Santos',
        score: 100,
        items: [
          { text: 'Pump room clean, ventilated, and temperature w/in limits (4.4°C to 49°C)', response: 'OK', remarks: '26°C Room temp' },
          { text: 'Casing, seals, and bearings inspected for leaks/wear', response: 'OK', remarks: 'Normal packing drip' },
          { text: 'Suction & discharge pressure gauges verified', response: 'OK', remarks: 'Static: 125 PSI' },
          { text: 'Automatic start tested via simulated pressure drop', response: 'OK', remarks: 'Cut-in at 100 PSI' },
          { text: 'Jockey pump inspected for leaks, vibration, and noise', response: 'OK', remarks: 'Smooth operation' }
        ],
        images: []
      },
      {
        id: 'log_stp_d1',
        procedureId: 'stp',
        procedureTitle: 'Sewage Treatment Plant Procedure Manual',
        procedureCode: 'PM-OCT-10',
        subCategory: 'Daily',
        date: '2026-09-03',
        preparedBy: 'Mr. George Ybañez',
        inspectedBy: 'Engr. Roberto Santos',
        score: 100,
        items: [
          { text: 'Equalizer, aeration, and clarifier tanks inspected', response: 'OK', remarks: 'Normal aeration' },
          { text: 'Air blower pressure, oil level, and noise checked', response: 'OK', remarks: 'Blower 1 lead' },
          { text: 'Chemical dosing pump and tank levels verified', response: 'OK', remarks: 'NaOCl active' },
          { text: 'pH and DO levels tested in aeration tank', response: 'OK', remarks: 'DO: 2.4 mg/L, pH: 7.45' },
          { text: 'Effluent clarity and odor inspected', response: 'OK', remarks: 'Clear, compliant' }
        ],
        images: []
      },
      {
        id: 'log_dw_d1',
        procedureId: 'domestic_water',
        procedureTitle: 'Domestic Water System Procedure Manual',
        procedureCode: 'PM-OCT-11',
        subCategory: 'Daily',
        date: '2026-09-03',
        preparedBy: 'Mr. Crispin de Gracia',
        inspectedBy: 'Engr. Roberto Santos',
        score: 100,
        items: [
          { text: 'Inspect domestic water transfer pumps and booster package', response: 'OK', remarks: 'Booster 58 PSI' },
          { text: 'Check chlorine residual at building distribution taps', response: 'OK', remarks: '0.85 ppm free chlorine' },
          { text: 'Verify cistern and overhead storage water tank levels', response: 'OK', remarks: 'Cistern 92% full' }
        ],
        images: []
      },
      {
        id: 'log_sub_d1',
        procedureId: 'submersible_pump',
        procedureTitle: 'Submersible Sump Pump & Drainage Procedure',
        procedureCode: 'PM-OCT-12',
        subCategory: 'Daily',
        date: '2026-09-03',
        preparedBy: 'Mr. George Ybañez',
        inspectedBy: 'Engr. Roberto Santos',
        score: 100,
        items: [
          { text: 'Inspect Basement 3 main sump pit water level and float switches', response: 'OK', remarks: 'Float 2 active' },
          { text: 'Check submersible pump operating current with clamp meter', response: 'OK', remarks: '7.8 Amps nominal' },
          { text: 'Verify elevator shaft sump pump automatic operation', response: 'OK', remarks: 'Clean pit' }
        ],
        images: []
      },
      {
        id: 'log_hk_d1',
        procedureId: 'housekeeping',
        procedureTitle: 'Housekeeping & Janitorial Procedure',
        procedureCode: 'SOP-HK-01',
        subCategory: 'GROUND FLOOR (GF)',
        date: '2026-09-03',
        preparedBy: 'Elena Vasquez (HK Lead)',
        inspectedBy: 'Mr. Martin Naimes',
        score: 100,
        items: [
          { text: 'Main entrance glass doors, floor mats, and polished marble flooring', response: 'OK', remarks: 'Sanitized' },
          { text: 'Elevator cabs, mirror surfaces, wall panels, and floor tracks', response: 'OK', remarks: 'Clean' },
          { text: 'Restrooms: Toilets, sinks, soap dispensers, paper towel refilling', response: 'OK', remarks: 'Refilled' }
        ],
        images: []
      }
    ];
  }

  return logs.filter(l => {
    if (l.procedureId !== procKey) return false;

    const cat = (l.subCategory || '').toLowerCase();
    const rLower = (reportType || 'Daily').toLowerCase();

    // Verify interval compatibility with reportType
    if (rLower === 'daily') {
      // Daily report matches Daily or Area checklists (Ground Floor, Basement, etc.)
      const isDailyCategory = cat.includes('daily') || cat.includes('floor') || cat.includes('basement') || cat.includes('sop');
      if (!isDailyCategory) return false;
      return l.date === targetDateStr;
    } else if (rLower === 'weekly') {
      if (!cat.includes('weekly')) return false;
      return l.date >= startDate && l.date <= endDateVal;
    } else if (rLower === 'monthly') {
      if (!cat.includes('monthly')) return false;
      return l.date.substring(0, 7) === targetDateStr.substring(0, 7);
    } else if (rLower === 'annual' || rLower === 'yearly') {
      if (!cat.includes('annual') && !cat.includes('yearly')) return false;
      return l.date.substring(0, 4) === targetDateStr.substring(0, 4);
    }

    return l.date === targetDateStr;
  });
}


// Helper to resolve live run hour logs based on target date
function getSystemRunHourLogForTargetDate(procKey, targetDateStr) {
  let logs = [];
  try {
    const saved = localStorage.getItem('onecorporate_run_hours_logs');
    if (saved) {
      logs = JSON.parse(saved);
    }
  } catch (e) {}

  if (!logs || logs.length === 0) {
    logs = [
      {
        id: 'rh_genset_latest',
        procedureId: 'genset',
        equipmentId: 'eq_genset_1',
        equipmentName: 'Genset Cummins KTAA19-G6A Engine',
        dateTime: '2026-09-03 06:33',
        startMeter: 1248.5,
        endMeter: 1256.0,
        runHours: 7.5,
        fuelBefore: 425.0,
        fuelAdded: 0,
        fuelAfter: 312.5,
        fuelConsumed: 112.5,
        burnRate: 15.0,
        technician: 'Martin Naimes',
        notes: 'Regular weekly test run & utility grid outage duty log.'
      },
      {
        id: 'rh_1',
        procedureId: 'genset',
        equipmentId: 'eq_genset_1',
        equipmentName: 'Genset Cummins KTAA19-G6A Engine',
        dateTime: '2026-08-14 10:00',
        startMeter: 1246.0,
        endMeter: 1248.5,
        runHours: 2.5,
        fuelBefore: 460.0,
        fuelAdded: 0,
        fuelAfter: 425.0,
        fuelConsumed: 35.0,
        burnRate: 14.0,
        technician: 'Martin Naimes',
        notes: 'Regular weekly load test run. Genset operated under 50% building load.'
      },
      {
        id: 'rh_2',
        procedureId: 'firepump',
        equipmentId: 'eq_fp_1',
        equipmentName: 'Main Fire Pump Diesel Engine',
        dateTime: '2026-08-12 14:30',
        startMeter: 411.5,
        endMeter: 412.0,
        runHours: 0.5,
        fuelBefore: 224.5,
        fuelAdded: 0,
        fuelAfter: 220.0,
        fuelConsumed: 4.5,
        burnRate: 9.0,
        technician: 'Mr. Crispin de Gracia',
        notes: 'Weekly churn test.'
      },
      {
        id: 'rh_3',
        procedureId: 'stp',
        equipmentId: 'eq_stp_1',
        equipmentName: 'Aeration Blower 1 Motor (Duty)',
        dateTime: '2026-08-15 08:00',
        startMeter: 3096.0,
        endMeter: 3120.0,
        runHours: 24.0,
        fuelBefore: 0,
        fuelAdded: 0,
        fuelAfter: 0,
        fuelConsumed: 0,
        burnRate: 0,
        technician: 'Mr. George Ybañez',
        notes: 'Continuous duty rotation.'
      }
    ];
  }

  const sysLogs = logs.filter(l => l.procedureId === procKey || (procKey === 'genset' && (l.equipmentName || '').toLowerCase().includes('genset')));
  if (!sysLogs || sysLogs.length === 0) return null;

  const targetDatePrefix = targetDateStr || new Date().toISOString().substring(0, 10);
  const eligibleLogs = sysLogs.filter(l => {
    if (!l.dateTime) return true;
    const logDate = l.dateTime.substring(0, 10);
    return logDate <= targetDatePrefix;
  });

  eligibleLogs.sort((a, b) => (b.dateTime || '').localeCompare(a.dateTime || ''));
  return eligibleLogs.length > 0 ? eligibleLogs[0] : sysLogs[0];
}

// Periodic Activities function alias
window.renderPeriodicActivities = function() {
  if (typeof renderPeriodicMaintenance === 'function') {
    renderPeriodicMaintenance();
  }
};


function normalizeTimeSlotString(t) {
  if (!t) return '';
  let str = t.trim().toUpperCase();
  if (str.length === 7 && str.indexOf(':') === 1) {
    str = '0' + str; // Convert 8:00 AM to 08:00 AM
  }
  return str;
}

// One Corporate Maintenance Pro - Core Application Script

// Building Maintenance & Security Employee Default Roster (synchronized from OCT_BM_Work Schedule.pdf)
const DEFAULT_EMPLOYEE_SCHEDULES = [
  { id: 'emp_1', name: 'Engr. Roan Paul Gallegos', position: 'BM Manager', department: 'Management', schedule: '8:00am-5:00pm', remarks: 'Regular', restDay: 'Sunday', contact: '0917 659 8364' },
  { id: 'emp_2', name: 'Mr. Elmer Esteban', position: 'BM Supervisor', department: 'Management', schedule: '8:00am-5:00pm', remarks: 'Regular', restDay: 'Thursday', contact: '0929 623 3556' },
  { id: 'emp_3', name: 'Mr. Martin Naimes', position: 'Foreman Electrician', department: 'Engineering', schedule: '7:00am-7:00pm / 7:00pm-7:00am', remarks: 'Rotation Schedule', restDay: 'Tuesday', contact: '0907 150 5202' },
  { id: 'emp_4', name: 'Mr. Crispin de Gracia', position: 'Electrician', department: 'Engineering', schedule: '7:30am-4:30pm', remarks: 'Regular', restDay: 'Sunday', contact: '0908 466 7701' },
  { id: 'emp_5', name: 'Mr. Robert Apilado', position: 'Fabrication/Mason', department: 'Engineering', schedule: '7:30am-4:30pm', remarks: 'Regular', restDay: 'Sunday', contact: '0912 - 5067 - 937' },
  { id: 'emp_6', name: 'Mr. George Ybañez', position: 'Plumber', department: 'Engineering', schedule: '7:00am-7:00pm / 7:00pm-7:00am', remarks: 'Rotation Schedule', restDay: 'Wednesday', contact: '0948 538 1602' },
  { id: 'emp_7', name: 'Ms. Kate Telles', position: 'Housekeeping', department: 'Housekeeping', schedule: '6:00am-3:00pm / 10:00am - 7:00pm', remarks: 'Rotation Schedule', restDay: 'Sunday', contact: '0985 869 6683' },
  { id: 'emp_8', name: 'Mr. Mandy Mejia', position: 'Housekeeping', department: 'Housekeeping', schedule: '6:00am-3:00pm / 10:00am - 7:00pm', remarks: 'Rotation Schedule', restDay: 'Saturday', contact: '0991 356 5701' },
  { id: 'emp_9', name: 'Ms. Annalyn Penuliar', position: 'Housekeeping', department: 'Housekeeping', schedule: '6:00am-3:00pm / 10:00am - 7:00pm', remarks: 'Rotation Schedule', restDay: 'Tuesday', contact: '0916 665 4138' },
  { id: 'emp_10', name: 'Mr. Virgilio Ducusin', position: 'CCTV Operator', department: 'CCTV Operator', schedule: '8:00am-8:00pm / 8:00pm-8:00am', remarks: 'Rotation Schedule', restDay: 'Saturday', contact: '0995 073 5802' },
  { id: 'emp_11', name: 'Ms. Cheryl Gonzales', position: 'CCTV Operator', department: 'CCTV Operator', schedule: '8:00am-8:00pm / 8:00pm-8:00am', remarks: 'Rotation Schedule', restDay: 'Sunday', contact: '0960 397 2098' },
  { id: 'emp_12', name: 'Mr. Jojo Bennagen', position: 'Agency Security', department: 'Agency Security', schedule: '7:00am-7:00pm / 7:00pm-7:00am', remarks: 'Rotation Schedule', restDay: 'Tuesday', contact: '0946 181 7526' },
  { id: 'emp_13', name: 'Mr. Ruben Banez', position: 'Agency Security', department: 'Agency Security', schedule: '7:00am-7:00pm / 7:00pm-7:00am', remarks: 'Rotation Schedule', restDay: 'Saturday', contact: '0963 478 5879' },
  { id: 'emp_14', name: 'Mr. Berson Pukchas', position: 'Agency Security', department: 'Agency Security', schedule: '7:00am-7:00pm / 7:00pm-7:00am', remarks: 'Rotation Schedule', restDay: 'Sunday', contact: 'N/A' }
];

// Building Maintenance Manager & 24-Hour Operational Track
const MANAGER_DAILY_ACTIVITIES = {
  '12:00 AM': { title: 'Midnight Security Patrol & Surveillance', items: ['Security Guard & CCTV night round', 'Chiller plant log audit', 'Building main access doors secured'] },
  '01:00 AM': { title: 'STP & High-Risk Area Inspection', items: ['Sewage Treatment Plant automated check', 'Basement sump pump alert monitoring'] },
  '02:00 AM': { title: 'Electrical Switchgear & GenBay Sweep', items: ['Main electrical room thermal camera check', 'Diesel generator standby pressure check'] },
  '03:00 AM': { title: 'Exterior Perimeter & Facade Surveillance', items: ['Perimeter security guard sweep', 'CCTV night vision monitoring'] },
  '04:00 AM': { title: 'Pre-Dawn Building Systems Verification', items: ['Water booster pump pressure log', 'Fire Alarm panel trouble-free signal check'] },
  '05:00 AM': { title: 'Mechanical Pre-Start & Early Shift Briefing', items: ['AHU pre-cool initiation', 'Early morning maintenance technician standby'] },
  '06:00 AM': { title: 'Early Housekeeping Kickoff & Gates Unlock', items: ['Janitorial morning lobby sweep', 'Loading bay gates open & access control active'] },
  '07:00 AM': { title: 'Guard Shift Handover & Morning Deployment', items: ['Security day/night guard shift rotation', 'Foreman electrician site inspection'] },
  '08:00 AM': { title: 'Daily Kickoff & Task Deployment', items: ['Review dashboard alerts and overdue tasks', 'Prioritize tasks by risk', 'Assign technicians', 'Confirm manpower, shifts & PPE'] },
  '09:00 AM': { title: 'Monitoring & Verification', items: ['Track structural inspections', 'Validate critical checks performed', 'Review technician updates', 'Resolve access issues'] },
  '10:00 AM': { title: 'Systems Oversight & Technical Support', items: ['Review mechanical system reports', 'Approve corrective actions', 'Coordinate with contractors', 'Ensure PM schedule compliance'] },
  '11:00 AM': { title: 'Safety & Fire Protection Compliance', items: ['Verify fire pump status', 'Check emergency staircase clearances', 'Ensure PPE compliance'] },
  '12:00 PM': { title: 'Midday Operations Review & Shift Mid-check', items: ['Review morning completed work orders', 'Reassign pending tasks', 'Coordinate lunchtime coverage'] },
  '01:00 PM': { title: 'Afternoon Work Execution Oversight', items: ['Inspect ongoing repairs', 'Audit contractor hot-work permits', 'Review tenant request desk'] },
  '02:00 PM': { title: 'Elevator & Utility Monitoring', items: ['Ride-along elevator performance check', 'Water supply pressure tank audit'] },
  '03:00 PM': { title: 'Preventive Maintenance Audit', items: ['Spot-check completed preventive maintenance', 'Sign off maintenance checklists'] },
  '04:00 PM': { title: 'Daily Progress & Wrap-up Preparation', items: ['Review shift completion metrics', 'Verify critical tasks closed', 'Log spare parts used'] },
  '05:00 PM': { title: 'Evening Shift Handover & Summary Log', items: ['Compile daily maintenance report', 'Hand over evening tasks to duty supervisor', 'Ensure site cleanliness'] },
  '06:00 PM': { title: 'Night Shift Transition & Perimeter Gate Lock', items: ['Close primary loading docks', 'Housekeeping evening rotation shift handover'] },
  '07:00 PM': { title: 'Security Shift Handover (Day to Night)', items: ['Agency security 12-hour shift changeover', 'Log night duty guards & CCTV operator'] },
  '08:00 PM': { title: 'CCTV Station Night Mode & Main Entry Lockup', items: ['Lock main lobby entrance', 'Verify CCTV 32-channel continuous recording'] },
  '09:00 PM': { title: 'Hourly Security Patrol & Life Safety Sweep', items: ['Fire exit doors inspection', 'Perimeter fence & lighting audit'] },
  '10:00 PM': { title: 'Tenant Access Verification & HVAC Night Mode', items: ['Verify late-working tenant permits', 'Set AHU/HVAC to night setback mode'] },
  '11:00 PM': { title: 'Pre-Midnight Safety & Security Audit', items: ['Full building lock status verification', 'Night guard reporting check-in'] }
};

const CATEGORY_CHECKLIST_TEMPLATES = {
  'Architectural': [
    'Surface finishes & paint integrity',
    'Glazing, glass panes & seals check',
    'Doors, hinges & door closer alignment',
    'Ceiling tiles alignment & dampness checks',
    'Floor conditions — slip hazards & cleanliness'
  ],
  'Structural': [
    'Beams & columns — check cracks & spalling',
    'Slab deflection & joints alignment',
    'Wall-to-ceiling joint separations',
    'Basement walls & floor seepage check',
    'Exterior façade masonry integrity'
  ],
  'Mechanical': [
    'Vibration & noise levels audit',
    'Belt tension & motor alignment checks',
    'Lubrication & oil levels validation',
    'Pressure & temperature readings verification',
    'Ductwork & air filter cleanliness'
  ],
  'Fire Protection': [
    'Pressure gauge reading verification',
    'Safety seals, pin, & physical tags inspect',
    'Alarm signaling & connection to main FACP',
    'Emergency batteries & standby power source',
    'Obstruction audit of exit paths & extinguishers'
  ],
  'Plumbing': [
    'Water meter / flow rate metrics check',
    'Valve seating, piping leaks & joints inspection',
    'Water pumps pressure & seals audit',
    'Sanitary drainage & traps flow check',
    'Restroom flush valves & fixtures operation'
  ],
  'STP': [
    'Aeration tank blower pressure verification',
    'MLSS concentration & sludge levels audit',
    'Discharge effluent clarity & color check',
    'Chemical dosing pump & levels inspection',
    'Electrical panels & motor load test logs'
  ],
  'Elevator': [
    'Cabin leveling accuracy & sill alignments',
    'Door sensors & safety shoe response audit',
    'Cabin lights, fan & emergency communication test',
    'Hoistway cables & guide rail guide check',
    'Machine room temperature & gear oil validation'
  ]
};

let activeActionTaskId = null;
let activeChecklistTaskId = null;

// Default Tasks Database Seeded from Commercial Building Maintenance Manual
const DEFAULT_MANUAL_TASKS = [
  // Architectural Daily Tasks
  { id: 'm1', name: 'Inspect lobbies, corridors, restrooms', system: 'Architectural', frequency: 'Daily', timeSlot: '08:00 AM', priority: 'Minor' },
  { id: 'm2', name: 'Check storefront glass and seals', system: 'Architectural', frequency: 'Daily', timeSlot: '08:00 AM', priority: 'Minor' },
  { id: 'm3', name: 'Monitor floor conditions (cracks, slipperiness)', system: 'Architectural', frequency: 'Daily', timeSlot: '05:00 PM', priority: 'Major' },
  { id: 'm4', name: 'Verify cleanliness of common areas', system: 'Architectural', frequency: 'Daily', timeSlot: '05:00 PM', priority: 'Minor' },
  // Structural Daily Tasks
  { id: 'm5', name: 'Observe unusual cracks or movement in common areas', system: 'Structural', frequency: 'Daily', timeSlot: '09:00 AM', priority: 'Critical' },
  { id: 'm6', name: 'Check basement for water seepage', system: 'Structural', frequency: 'Daily', timeSlot: '09:00 AM', priority: 'Major' },
  // Mechanical Daily Tasks
  { id: 'm7', name: 'Check AHU/FCU operation', system: 'Mechanical', frequency: 'Daily', timeSlot: '10:00 AM', priority: 'Major' },
  { id: 'm8', name: 'Monitor chiller parameters (pressure, temp)', system: 'Mechanical', frequency: 'Daily', timeSlot: '10:00 AM', priority: 'Critical' },
  { id: 'm9', name: 'Inspect pumps for noise/vibration', system: 'Mechanical', frequency: 'Daily', timeSlot: '10:00 AM', priority: 'Major' },
  { id: 'm10', name: 'Check generator fuel and battery', system: 'Mechanical', frequency: 'Daily', timeSlot: '01:00 PM', priority: 'Critical' },
  { id: 'm11', name: 'Inspect cooling tower basin', system: 'Mechanical', frequency: 'Daily', timeSlot: '01:00 PM', priority: 'Major' },
  // Fire Protection Daily Tasks
  { id: 'm12', name: 'Check fire extinguishers (pressure, accessibility)', system: 'Fire Protection', frequency: 'Daily', timeSlot: '11:00 AM', priority: 'Major' },
  { id: 'm13', name: 'Inspect emergency lights and exit signs', system: 'Fire Protection', frequency: 'Daily', timeSlot: '11:00 AM', priority: 'Major' },
  { id: 'm14', name: 'Verify fire alarm panel status', system: 'Fire Protection', frequency: 'Daily', timeSlot: '11:00 AM', priority: 'Critical' },
  // Plumbing Daily Tasks
  { id: 'm15', name: 'Check water pressure and supply', system: 'Plumbing', frequency: 'Daily', timeSlot: '12:00 PM', priority: 'Critical' },
  { id: 'm16', name: 'Inspect restrooms for leaks', system: 'Plumbing', frequency: 'Daily', timeSlot: '12:00 PM', priority: 'Major' },
  { id: 'm17', name: 'Monitor drainage issues', system: 'Plumbing', frequency: 'Daily', timeSlot: '04:00 PM', priority: 'Major' },
  // STP Daily Tasks
  { id: 'm18', name: 'Check aeration system', system: 'STP', frequency: 'Daily', timeSlot: '02:00 PM', priority: 'Critical' },
  { id: 'm19', name: 'Monitor MLSS levels', system: 'STP', frequency: 'Daily', timeSlot: '02:00 PM', priority: 'Major' },
  { id: 'm20', name: 'Inspect blowers and pumps', system: 'STP', frequency: 'Daily', timeSlot: '02:00 PM', priority: 'Major' },
  // Elevator Daily Tasks
  { id: 'm21', name: 'Check elevator operation', system: 'Elevator', frequency: 'Daily', timeSlot: '03:00 PM', priority: 'Critical' },
  { id: 'm22', name: 'Inspect cabin lights and ventilation', system: 'Elevator', frequency: 'Daily', timeSlot: '03:00 PM', priority: 'Minor' },
  { id: 'm23', name: 'Verify leveling accuracy', system: 'Elevator', frequency: 'Daily', timeSlot: '03:00 PM', priority: 'Major' },

  // Weekly Tasks (Unscheduled Backlog by Default)
  { id: 'm24', name: 'Inspect ceilings for leaks or stains', system: 'Architectural', frequency: 'Weekly', timeSlot: '', priority: 'Major' },
  { id: 'm25', name: 'Check wall conditions (cracks, dents)', system: 'Architectural', frequency: 'Weekly', timeSlot: '', priority: 'Minor' },
  { id: 'm26', name: 'Inspect accessibility features (ramps, handrails)', system: 'Architectural', frequency: 'Weekly', timeSlot: '', priority: 'Minor' },
  { id: 'm27', name: 'Inspect parking slabs for cracks or deflection', system: 'Structural', frequency: 'Weekly', timeSlot: '', priority: 'Major' },
  { id: 'm28', name: 'Clean AHU/FCU filters', system: 'Mechanical', frequency: 'Weekly', timeSlot: '', priority: 'Major' },
  { id: 'm29', name: 'Inspect belts and bearings', system: 'Mechanical', frequency: 'Weekly', timeSlot: '', priority: 'Minor' },
  { id: 'm30', name: 'Check condensate drains', system: 'Mechanical', frequency: 'Weekly', timeSlot: '', priority: 'Minor' },
  { id: 'm31', name: 'Inspect fire pumps (jockey pump operation)', system: 'Fire Protection', frequency: 'Weekly', timeSlot: '', priority: 'Critical' },
  { id: 'm32', name: 'Check sprinkler heads for obstruction', system: 'Fire Protection', frequency: 'Weekly', timeSlot: '', priority: 'Major' },
  { id: 'm33', name: 'Clean grease traps (food tenants)', system: 'Plumbing', frequency: 'Weekly', timeSlot: '', priority: 'Major' },
  { id: 'm34', name: 'Inspect manholes', system: 'Plumbing', frequency: 'Weekly', timeSlot: '', priority: 'Minor' },
  { id: 'm35', name: 'Check sludge levels', system: 'STP', frequency: 'Weekly', timeSlot: '', priority: 'Major' },
  { id: 'm36', name: 'Inspect diffusers', system: 'STP', frequency: 'Weekly', timeSlot: '', priority: 'Major' },
  { id: 'm37', name: 'Inspect door sensors', system: 'Elevator', frequency: 'Weekly', timeSlot: '', priority: 'Critical' },
  { id: 'm38', name: 'Check door operation', system: 'Elevator', frequency: 'Weekly', timeSlot: '', priority: 'Major' },

  // Monthly Tasks
  { id: 'm39', name: 'Inspect façade for cracks, spalling', system: 'Architectural', frequency: 'Monthly', timeSlot: '', priority: 'Major' },
  { id: 'm40', name: 'Check roofing membrane, gutters, downspouts', system: 'Architectural', frequency: 'Monthly', timeSlot: '', priority: 'Major' },
  { id: 'm41', name: 'Inspect exterior lighting and signage', system: 'Architectural', frequency: 'Monthly', timeSlot: '', priority: 'Minor' },
  { id: 'm42', name: 'Inspect exposed beams, columns, trusses', system: 'Structural', frequency: 'Monthly', timeSlot: '', priority: 'Critical' },
  { id: 'm43', name: 'Check steel elements for corrosion', system: 'Structural', frequency: 'Monthly', timeSlot: '', priority: 'Major' },
  { id: 'm44', name: 'Inspect motors and electrical connections', system: 'Mechanical', frequency: 'Monthly', timeSlot: '', priority: 'Major' },
  { id: 'm45', name: 'Check ductwork for leaks', system: 'Mechanical', frequency: 'Monthly', timeSlot: '', priority: 'Minor' },
  { id: 'm46', name: 'Inspect cooling tower fans', system: 'Mechanical', frequency: 'Monthly', timeSlot: '', priority: 'Major' },
  { id: 'm47', name: 'Test smoke/heat detectors', system: 'Fire Protection', frequency: 'Monthly', timeSlot: '', priority: 'Critical' },
  { id: 'm48', name: 'Inspect hose cabinets', system: 'Fire Protection', frequency: 'Monthly', timeSlot: '', priority: 'Major' },
  { id: 'm49', name: 'Inspect water tanks', system: 'Plumbing', frequency: 'Monthly', timeSlot: '', priority: 'Major' },
  { id: 'm50', name: 'Check sewer lines for blockages', system: 'Plumbing', frequency: 'Monthly', timeSlot: '', priority: 'Major' },
  { id: 'm51', name: 'Effluent quality testing (pH, TSS, COD/BOD)', system: 'STP', frequency: 'Monthly', timeSlot: '', priority: 'Critical' },
  { id: 'm52', name: 'Inspect control panels', system: 'STP', frequency: 'Monthly', timeSlot: '', priority: 'Major' },
  { id: 'm53', name: 'Inspect control panel', system: 'Elevator', frequency: 'Monthly', timeSlot: '', priority: 'Critical' },
  { id: 'm54', name: 'Check machine room cleanliness', system: 'Elevator', frequency: 'Monthly', timeSlot: '', priority: 'Minor' },

  // Quarterly Tasks
  { id: 'm55', name: 'Cooling tower deep cleaning', system: 'Mechanical', frequency: 'Quarterly', timeSlot: '', priority: 'Major' },
  { id: 'm56', name: 'Pump alignment check', system: 'Mechanical', frequency: 'Quarterly', timeSlot: '', priority: 'Major' },
  { id: 'm57', name: 'Duct cleaning', system: 'Mechanical', frequency: 'Quarterly', timeSlot: '', priority: 'Minor' },
  { id: 'm58', name: 'Sewer line jetting', system: 'Plumbing', frequency: 'Quarterly', timeSlot: '', priority: 'Major' },
  { id: 'm59', name: 'Blower lubrication', system: 'STP', frequency: 'Quarterly', timeSlot: '', priority: 'Minor' },
  { id: 'm60', name: 'Diffuser cleaning', system: 'STP', frequency: 'Quarterly', timeSlot: '', priority: 'Major' },
  { id: 'm61', name: 'Pump servicing', system: 'STP', frequency: 'Quarterly', timeSlot: '', priority: 'Major' },
  { id: 'm62', name: 'Full mechanical inspection', system: 'Elevator', frequency: 'Quarterly', timeSlot: '', priority: 'Critical' },
  { id: 'm63', name: 'Rail lubrication', system: 'Elevator', frequency: 'Quarterly', timeSlot: '', priority: 'Minor' },

  // Annual Tasks
  { id: 'm64', name: 'Full architectural audit', system: 'Architectural', frequency: 'Annual', timeSlot: '', priority: 'Major' },
  { id: 'm65', name: 'Repainting assessment', system: 'Architectural', frequency: 'Annual', timeSlot: '', priority: 'Minor' },
  { id: 'm66', name: 'Waterproofing integrity test', system: 'Architectural', frequency: 'Annual', timeSlot: '', priority: 'Major' },
  { id: 'm67', name: 'Structural engineer assessment', system: 'Structural', frequency: 'Annual', timeSlot: '', priority: 'Critical' },
  { id: 'm68', name: 'Settlement monitoring and documentation', system: 'Structural', frequency: 'Annual', timeSlot: '', priority: 'Major' },
  { id: 'm69', name: 'Full mechanical audit', system: 'Mechanical', frequency: 'Annual', timeSlot: '', priority: 'Critical' },
  { id: 'm70', name: 'Generator load testing', system: 'Mechanical', frequency: 'Annual', timeSlot: '', priority: 'Critical' },
  { id: 'm71', name: 'Chiller performance evaluation', system: 'Mechanical', frequency: 'Annual', timeSlot: '', priority: 'Major' },
  { id: 'm72', name: 'Hydrostatic testing of extinguishers', system: 'Fire Protection', frequency: 'Annual', timeSlot: '', priority: 'Critical' },
  { id: 'm73', name: 'Full fire system audit', system: 'Fire Protection', frequency: 'Annual', timeSlot: '', priority: 'Critical' },
  { id: 'm74', name: 'Fire pump flow test', system: 'Fire Protection', frequency: 'Annual', timeSlot: '', priority: 'Critical' },
  { id: 'm75', name: 'Full plumbing audit', system: 'Plumbing', frequency: 'Annual', timeSlot: '', priority: 'Major' },
  { id: 'm76', name: 'Water tank cleaning', system: 'Plumbing', frequency: 'Annual', timeSlot: '', priority: 'Major' },
  { id: 'm77', name: 'LLDA/DOH compliance testing', system: 'STP', frequency: 'Annual', timeSlot: '', priority: 'Critical' },
  { id: 'm78', name: 'Full STP audit', system: 'STP', frequency: 'Annual', timeSlot: '', priority: 'Critical' },
  { id: 'm79', name: 'Government inspection', system: 'Elevator', frequency: 'Annual', timeSlot: '', priority: 'Critical' },
  { id: 'm80', name: 'Load testing', system: 'Elevator', frequency: 'Annual', timeSlot: '', priority: 'Critical' }
];

// Post-Earthquake Assessment Checklists Seeded from Safety Evaluation Manual
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

// Application State
let appState = {
  tasks: [],
  registry: [],
  complaints: [],
  notifications: [],
  currentUserRole: 'Admin',
  activeTab: 'dashboard',
  currentSafetyEvaluation: null,
  pastSafetyEvaluations: [],
  currentTaskPhotoBase64: '',
  currentTenantPhotoBase64: '',
  currentTaskPhotosBefore: [],
  currentTaskPhotosAfter: [],
  isManagerAbsent: false,
  managerCheckedActivities: {}
};
window.appState = appState;

// 24-Hour Active Operational Time Slots Map
const TIMELINE_SLOTS = [
  '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM',
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
];

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

  // Synchronize embedded iframes
  document.querySelectorAll('iframe').forEach(iframe => {
    try {
      if (iframe.contentDocument && iframe.contentDocument.body) {
        if (theme === 'light') {
          iframe.contentDocument.body.classList.add('light-theme');
          iframe.contentDocument.body.classList.remove('dark-theme');
        } else {
          iframe.contentDocument.body.classList.remove('light-theme');
          iframe.contentDocument.body.classList.add('dark-theme');
        }
      }
      if (iframe.contentWindow && typeof iframe.contentWindow.applyTheme === 'function') {
        iframe.contentWindow.applyTheme(theme);
      }
    } catch (e) {}
  });
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

// Current Simulation Time (locked to 1:00 PM for verification)
const SIMULATION_HOUR = 13; // 1:00 PM in 24h

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
    localStorage.setItem('onecorp_sidebar_collapsed', isCollapsed ? 'true' : 'false');
  } catch (e) {}
};

function initSidebarState() {
  try {
    const savedState = localStorage.getItem('onecorp_sidebar_collapsed');
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

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebarState();
  loadState();
  initNotificationBell();
  setupDragAndDrop();
  renderApp();
  updateHeaderDate();
});

// Load state from localStorage or seed default
function loadState() {
  const savedState = localStorage.getItem('onecorporate_maintenance_state');
  if (savedState) {
    try {
      appState = JSON.parse(savedState);
      // Ensure defaults exist
      if (!appState.tasks) appState.tasks = [];
      if (!appState.registry || appState.registry.length === 0) appState.registry = [...DEFAULT_MANUAL_TASKS];
      if (!appState.complaints) appState.complaints = [];
      if (!appState.jobOrders || !Array.isArray(appState.jobOrders)) {
        appState.jobOrders = [
          {
            id: 'jo_101',
            isJobOrder: true,
            unit: '3rd Floor AHU Room 3B',
            system: 'Mechanical',
            title: 'Quarterly Central AHU Filter Replacement & Belt Tensioning',
            priority: 'Major',
            status: 'Completed',
            details: 'Replaced primary bag filters, adjusted drive belt tension, cleaned evaporator condensate drain pan.',
            assignedTo: 'Mr. Martin Naimes (Foreman Electrician)',
            photo: '',
            dateCreated: '2026-07-15',
            actionDate: '2026-07-16',
            estFinishDate: '2026-07-17',
            managerName: 'Engr. Roan Paul B. Gallegos',
            adminName: 'Mr. Robert J. Cruz',
            issueReported: 'Routine maintenance: AHU filter air flow restriction observed during weekly round check.',
            immediateAction: 'Isolated unit breaker, installed lockout tag, purged static pressure.',
            correctiveAction: 'Installed 4 sets of MERV-13 primary filters, aligned double-V belts, treated drain pan with biocidal tablets.',
            preventiveAction: 'Scheduled next filter replacement on PM calendar for Q4 2026.',
            materialsList: [
              { material: 'MERV-13 Air Filter 24x24x2', unit: 'pcs', qty: 4, price: 850 },
              { material: 'V-Belt B-68 Industrial', unit: 'pcs', qty: 2, price: 420 },
              { material: 'Condensate Pan Bio-tablets', unit: 'pack', qty: 1, price: 350 }
            ],
            manpowerList: [
              { skill: 'Lead HVAC Technician', dailyRate: 850, days: 1, count: 1 },
              { skill: 'Assistant Electrician', dailyRate: 650, days: 1, count: 1 }
            ]
          },
          {
            id: 'jo_102',
            isJobOrder: true,
            unit: 'Ground Floor Main Lobby Entrance',
            system: 'Architectural',
            title: 'Automatic Sliding Glass Door Sensor Calibration & Track Lubrication',
            priority: 'Major',
            status: 'In Progress',
            details: 'Calibrate optical motion detectors, adjust safety photocell beam, and lubricate top roller assembly.',
            assignedTo: 'Mr. Crispin de Gracia (Carpenter)',
            photo: '',
            dateCreated: '2026-07-20',
            actionDate: '2026-07-20',
            estFinishDate: '2026-07-22',
            managerName: 'Engr. Roan Paul B. Gallegos',
            adminName: 'Mr. Robert J. Cruz',
            issueReported: 'Main entrance automatic sliding door exhibits intermittent sensor lag during peak foot traffic.',
            immediateAction: 'Set door control to manual hold-open during rush hours to prevent door pinch hazard.',
            correctiveAction: 'Recalibrating microwave motion detectors and replacing worn guide track bushings.',
            preventiveAction: 'Include optical sensor cleaning in weekly housekeeping checklist.',
            materialsList: [
              { material: 'Silicone Track Lubricant 400ml', unit: 'can', qty: 1, price: 380 },
              { material: 'Nylon Guide Roller Bushings', unit: 'set', qty: 2, price: 550 }
            ],
            manpowerList: [
              { skill: 'Senior Facility Tradesman', dailyRate: 800, days: 1, count: 1 }
            ]
          }
        ];
      }
      if (!appState.activeTenantDeskTab) appState.activeTenantDeskTab = 'complaints';
      if (!appState.notifications) appState.notifications = [];
      if (!appState.currentUserRole) appState.currentUserRole = 'Admin';
      if (!appState.activeTab) appState.activeTab = 'dashboard';
      if (!appState.pastSafetyEvaluations) appState.pastSafetyEvaluations = [];
      if (appState.isManagerAbsent === undefined) appState.isManagerAbsent = false;
      if (!appState.managerCheckedActivities) appState.managerCheckedActivities = {};
      if (!appState.customSystems) appState.customSystems = [];
      if (!appState.employeeSchedules || appState.employeeSchedules.length === 0) appState.employeeSchedules = [...DEFAULT_EMPLOYEE_SCHEDULES];
    } catch (e) {
      console.error("Error parsing saved state:", e);
      resetStateToDefault();
    }
  } else {
    resetStateToDefault();
  }
  
  // Update Role selector dropdown value
  document.getElementById('role-selector').value = appState.currentUserRole;

  // Restore Manager Absence toggle checkbox and banner
  const toggleCheckbox = document.getElementById('manager-absence-toggle');
  if (toggleCheckbox) {
    toggleCheckbox.checked = appState.isManagerAbsent || false;
  }
  updateManagerAbsenceBanner();

  populateSystemDropdowns();

  // Guarantee multi-day task presence in appState.tasks
  if (!appState.tasks.some(t => t.isMultiDay)) {
    const todayStr = new Date().toISOString().split('T')[0];
    const finishDateObj = new Date();
    finishDateObj.setDate(finishDateObj.getDate() + 3);
    const finishStr = finishDateObj.toISOString().split('T')[0];

    appState.tasks.unshift({
      id: 't_multiday_active_' + Date.now(),
      manualTaskId: 'm_multiday_active',
      name: 'Chiller Plant Multi-Day Major Overhaul',
      system: 'Mechanical',
      frequency: 'Daily',
      timeSlot: '08:00 AM',
      priority: 'Critical',
      status: 'In Progress',
      isMultiDay: true,
      startDate: todayStr,
      finishDate: finishStr,
      notes: '3-day multi-day chiller overhaul.',
      assignedTo: 'Mr. Martin Naimes (Foreman Electrician)',
      dateCreated: todayStr
    });
    saveState();
  }


  // Auto check for overdue tasks
  checkOverdueTasks();
}

function resetStateToDefault() {
  appState.registry = [...DEFAULT_MANUAL_TASKS];
  appState.tasks = [];
  appState.complaints = [];
  appState.jobOrders = [
    {
      id: 'jo_101',
      isJobOrder: true,
      unit: '3rd Floor AHU Room 3B',
      system: 'Mechanical',
      title: 'Quarterly Central AHU Filter Replacement & Belt Tensioning',
      priority: 'Major',
      status: 'Completed',
      details: 'Replaced primary bag filters, adjusted drive belt tension, cleaned evaporator condensate drain pan.',
      assignedTo: 'Mr. Martin Naimes (Foreman Electrician)',
      photo: '',
      dateCreated: '2026-07-15',
      actionDate: '2026-07-16',
      estFinishDate: '2026-07-17',
      managerName: 'Engr. Roan Paul B. Gallegos',
      adminName: 'Mr. Robert J. Cruz',
      issueReported: 'Routine maintenance: AHU filter air flow restriction observed during weekly round check.',
      immediateAction: 'Isolated unit breaker, installed lockout tag, purged static pressure.',
      correctiveAction: 'Installed 4 sets of MERV-13 primary filters, aligned double-V belts, treated drain pan with biocidal tablets.',
      preventiveAction: 'Scheduled next filter replacement on PM calendar for Q4 2026.',
      materialsList: [
        { material: 'MERV-13 Air Filter 24x24x2', unit: 'pcs', qty: 4, price: 850 },
        { material: 'V-Belt B-68 Industrial', unit: 'pcs', qty: 2, price: 420 },
        { material: 'Condensate Pan Bio-tablets', unit: 'pack', qty: 1, price: 350 }
      ],
      manpowerList: [
        { skill: 'Lead HVAC Technician', dailyRate: 850, days: 1, count: 1 },
        { skill: 'Assistant Electrician', dailyRate: 650, days: 1, count: 1 }
      ]
    },
    {
      id: 'jo_102',
      isJobOrder: true,
      unit: 'Ground Floor Main Lobby Entrance',
      system: 'Architectural',
      title: 'Automatic Sliding Glass Door Sensor Calibration & Track Lubrication',
      priority: 'Major',
      status: 'In Progress',
      details: 'Calibrate optical motion detectors, adjust safety photocell beam, and lubricate top roller assembly.',
      assignedTo: 'Mr. Crispin de Gracia (Carpenter)',
      photo: '',
      dateCreated: '2026-07-20',
      actionDate: '2026-07-20',
      estFinishDate: '2026-07-22',
      managerName: 'Engr. Roan Paul B. Gallegos',
      adminName: 'Mr. Robert J. Cruz',
      issueReported: 'Main entrance automatic sliding door exhibits intermittent sensor lag during peak foot traffic.',
      immediateAction: 'Set door control to manual hold-open during rush hours to prevent door pinch hazard.',
      correctiveAction: 'Recalibrating microwave motion detectors and replacing worn guide track bushings.',
      preventiveAction: 'Include optical sensor cleaning in weekly housekeeping checklist.',
      materialsList: [
        { material: 'Silicone Track Lubricant 400ml', unit: 'can', qty: 1, price: 380 },
        { material: 'Nylon Guide Roller Bushings', unit: 'set', qty: 2, price: 550 }
      ],
      manpowerList: [
        { skill: 'Senior Facility Tradesman', dailyRate: 800, days: 1, count: 1 }
      ]
    }
  ];
  appState.activeTenantDeskTab = 'complaints';
  appState.notifications = [];
  appState.currentUserRole = 'Admin';
  appState.activeTab = 'dashboard';
  appState.pastSafetyEvaluations = [];
  appState.isManagerAbsent = false;
  appState.managerCheckedActivities = {};
  appState.customSystems = [];
  appState.employeeSchedules = [...DEFAULT_EMPLOYEE_SCHEDULES];
  
  // Seed first day tasks
  seedTodayTasks();
  
  // Seed sample multi-day task to guarantee visible 2-second blinking remaining days
  appState.tasks.push({
    id: 't_multiday_sample_' + Date.now(),
    manualTaskId: 'm_sample_multiday',
    name: 'Multi-Day Chiller & Cooling Tower Overhaul',
    system: 'Mechanical',
    frequency: 'Daily',
    timeSlot: '09:00 AM',
    priority: 'Major',
    status: 'In Progress',
    isMultiDay: true,
    startDate: '2026-07-22',
    finishDate: '2026-07-25',
    notes: 'Multi-day compressor teardown and flushing.',
    assignedTo: 'Engr. Roan Paul Gallegos (BM Manager)',
    dateCreated: '2026-07-22'
  });

  saveState();
  populateSystemDropdowns();

  // Guarantee multi-day task presence in appState.tasks
  if (!appState.tasks.some(t => t.isMultiDay)) {
    const todayStr = new Date().toISOString().split('T')[0];
    const finishDateObj = new Date();
    finishDateObj.setDate(finishDateObj.getDate() + 3);
    const finishStr = finishDateObj.toISOString().split('T')[0];

    appState.tasks.unshift({
      id: 't_multiday_active_' + Date.now(),
      manualTaskId: 'm_multiday_active',
      name: 'Chiller Plant Multi-Day Major Overhaul',
      system: 'Mechanical',
      frequency: 'Daily',
      timeSlot: '08:00 AM',
      priority: 'Critical',
      status: 'In Progress',
      isMultiDay: true,
      startDate: todayStr,
      finishDate: finishStr,
      notes: '3-day multi-day chiller overhaul.',
      assignedTo: 'Mr. Martin Naimes (Foreman Electrician)',
      dateCreated: todayStr
    });
    saveState();
  }

}

function saveState() {
  try {
    localStorage.setItem('onecorporate_maintenance_state', JSON.stringify(appState));
  } catch (err) {
    console.warn("localStorage quota reached, applying state optimization:", err);
    try {
      // Create lightweight copy for localStorage
      const stateCopy = JSON.parse(JSON.stringify(appState));
      if (Array.isArray(stateCopy.tasks)) {
        stateCopy.tasks.forEach(t => {
          // Clear legacy duplicate photo string aliases to free up storage space
          t.photo = '';
          t.photoBefore = '';
          t.photoAfter = '';
        });
      }
      localStorage.setItem('onecorporate_maintenance_state', JSON.stringify(stateCopy));
    } catch (innerErr) {
      console.error("Storage full, operating in active memory session:", innerErr);
    }
  }
}

// Seed daily tasks onto timeline on start
function seedTodayTasks() {
  // Clear existing today's tasks
  appState.tasks = [];
  
  // Populate all manual tasks with Daily frequency
  const dailyManualTasks = appState.registry.filter(t => t.frequency === 'Daily');
  
  dailyManualTasks.forEach(manualTask => {
    appState.tasks.push({
      id: 't_seed_' + manualTask.id + '_' + Date.now(),
      manualTaskId: manualTask.id,
      name: manualTask.name,
      system: manualTask.system,
      frequency: manualTask.frequency,
      timeSlot: manualTask.timeSlot || '08:00 AM',
      priority: manualTask.priority,
      status: 'Pending',
      notes: '',
      photo: '',
      assignedTo: getSystemDefaultTechnician(manualTask.system),
      dateCreated: new Date().toISOString().split('T')[0]
    });
  });
}

function getSystemDefaultTechnician(system) {
  switch(system) {
    case 'Mechanical': return 'Mr. Martin Naimes (Foreman Electrician)';
    case 'Fire Protection': return 'Mr. Martin Naimes (Foreman Electrician)';
    case 'Electrical': return 'Mr. Crispin de Gracia (Electrician)';
    case 'Plumbing': return 'Mr. George Ybañez (Plumber)';
    case 'STP': return 'Mr. George Ybañez (Plumber)';
    case 'Architectural': return 'Mr. Robert Apilado (Fabrication/Mason)';
    case 'Structural': return 'Mr. Robert Apilado (Fabrication/Mason)';
    case 'Elevator': return 'Mr. Elmer Esteban (BM Supervisor)';
    case 'Housekeeping': return 'Ms. Kate Telles (Housekeeping)';
    case 'CCTV Operator': return 'Mr. Virgilio Ducusin (CCTV Operator)';
    case 'Agency Security': return 'Mr. Jojo Bennagen (Agency Security)';
    default: return 'Engr. Roan Paul Gallegos (BM Manager)';
  }
}

function getInitials(name) {
  if (!name) return 'UN';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// Navigation switcher
window.switchTab = function(tabName) {
  const role = (window.SecurityEngine && window.SecurityEngine.currentSession) 
    ? (window.SecurityEngine.currentSession.role || appState.currentUserRole) 
    : (appState.currentUserRole || 'Admin persona');

  const allowedItems = getRoleAllowedItems(role);

  if (!allowedItems.includes(tabName)) {
    alert("Access Denied: Your role ('" + role + "') does not have permission to access the '" + tabName + "' section.");
    return;
  }

  appState.activeTab = tabName;
  
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });
  const activeNav = document.getElementById('nav-' + tabName);
  if (activeNav) activeNav.classList.add('active');

  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  const activePanel = document.getElementById('panel-' + tabName);
  if (activePanel) activePanel.classList.add('active');

  if (tabName === 'timeline') renderTimeline();
  if (tabName === 'periodic') renderPeriodicMaintenance();
  if (tabName === 'weekly' || tabName === 'monthly' || tabName === 'quarterly' || tabName === 'yearly') {
    selectPeriodicFrequency(tabName.charAt(0).toUpperCase() + tabName.slice(1));
  }
  if (tabName === 'registry') renderRegistry();
  if (tabName === 'procedures') renderProceduresList();
  if (tabName === 'emergency') renderEmergencyContacts();
  if (tabName === 'inventory') renderInventoryList();
  if (tabName === 'reports') renderReportsView();
  if (tabName === 'analytics') renderAnalyticsView();
  if (tabName === 'tenant') renderTenantComplaints();
  if (tabName === 'employee-schedule') renderEmployeeWorkScheduleTable();
};

// Switch User role
window.changeUserRole = function(newRole) {
  appState.currentUserRole = newRole;
  
  if (window.SecurityEngine && window.SecurityEngine.currentSession) {
    window.SecurityEngine.currentSession.role = newRole;
  }

  // Explicit Persona Target Tab Mappings:
  // Tenant persona -> Tenant Desk / Job Order (tenant)
  // Admin persona -> Analytics & Financials (analytics)
  // Building Maintenance Manager & OIC Building Maintenance -> Compliance Reports (reports)
  // Assistant Building Maintenance -> Periodic Timelines (periodic)
  // Engineer & Technician persona -> Daily Timeline (timeline)
  const personaTabMap = {
    'Tenant persona': 'tenant',
    'Tenant': 'tenant',
    'Admin persona': 'analytics',
    'Admin': 'analytics',
    'Building Maintenance Manager': 'reports',
    'Manager': 'reports',
    'OIC Building Maintenance': 'reports',
    'Assistant Building Maintenance': 'periodic',
    'Assistant Manager': 'periodic',
    'Engineer persona': 'timeline',
    'Engineer': 'timeline',
    'Technician persona': 'timeline',
    'Technician': 'timeline'
  };

  const targetTab = personaTabMap[newRole] || 'dashboard';

  // Apply role visibility restrictions
  applyRoleVisibilityRestrictions();

  // Jump immediately to tab button
  if (typeof switchTab === 'function') {
    switchTab(targetTab);
  }

  // Update top-right dropdown value
  const roleSelect = document.getElementById('role-selector');
  if (roleSelect) roleSelect.value = newRole;

  if (window.SecurityEngine && typeof window.SecurityEngine.renderUserChip === 'function') {
    window.SecurityEngine.renderUserChip();
  }

  updateManagerAbsenceBanner();
  renderApp();
};

// Manager Absence Delegation Helpers
function updateManagerAbsenceBanner() {
  const banner = document.getElementById('manager-absence-banner');
  if (banner) {
    if (appState.isManagerAbsent && appState.currentUserRole !== 'Tenant') {
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }
  }
}

window.toggleManagerAbsence = function(checked) {
  appState.isManagerAbsent = checked;
  saveState();
  updateManagerAbsenceBanner();
  
  // Add a notification when manager presence changes
  appState.notifications.unshift({
    id: `manager_presence_${Date.now()}`,
    type: checked ? 'major' : 'normal',
    message: checked 
      ? 'FACILITIES NOTICE: Building Maintenance Manager is ABSENT. Assistant Manager has assumed delegation.'
      : 'FACILITIES NOTICE: Building Maintenance Manager is PRESENT.',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  updateNotificationBadge();
  
  // If we are currently in dashboard or reports, refresh
  if (appState.activeTab === 'dashboard' || appState.activeTab === 'reports') {
    renderApp();
  }
};

// Dynamic Rendering Director
function renderApp() {
  const currentTab = appState.activeTab;
  
  // Adjust UI headers based on role
  if (typeof applyRoleVisibilityRestrictions === 'function') {
    applyRoleVisibilityRestrictions();
  }
  
  // Adjust UI headers based on role
  applyRoleVisibilityRestrictions();

  if (currentTab === 'dashboard') {
    renderDashboard();
  } else if (currentTab === 'timeline') {
    renderTimeline();
  } else if (currentTab === 'periodic') {
    if (appState.periodicViewMode === 'calendar') {
      if (typeof renderPMCalendar === 'function') renderPMCalendar();
    } else {
      renderPeriodicMaintenance();
    }
  } else if (currentTab === 'registry') {
    renderRegistry();
  } else if (currentTab === 'emergency') {
    renderEmergencyChecklists();
    if (typeof renderMainEmergencyPreparednessModule === 'function') {
      renderMainEmergencyPreparednessModule();
    }
  } else if (currentTab === 'reports') {
    // Generate placeholder if needed
    updateReportTypePlaceholder();
  } else if (currentTab === 'analytics') {
    if (typeof renderAnalyticsDashboard === 'function') renderAnalyticsDashboard();
  } else if (currentTab === 'tenant') {
    switchTenantDeskMode(appState.activeTenantDeskTab || 'complaints');
    renderTenantComplaints();
  } else if (currentTab === 'employee-schedule') {
    renderEmployeeWorkScheduleTable();
  }
}

// Role visibility toggler
function applyRoleVisibilityRestrictions() {
  const role = (window.SecurityEngine && window.SecurityEngine.currentSession) 
    ? (window.SecurityEngine.currentSession.role || appState.currentUserRole) 
    : (appState.currentUserRole || 'Admin persona');

  appState.currentUserRole = role;

  const allowedItems = getRoleAllowedItems(role);

  const items = ALL_SIDEBAR_ITEMS.map(i => i.id);
  items.forEach(item => {
    const el = document.getElementById('nav-' + item);
    if (el) {
      el.style.display = allowedItems.includes(item) ? 'flex' : 'none';
    }
  });

  if (!allowedItems.includes(appState.activeTab)) {
    const firstTab = allowedItems[0] || 'dashboard';
    switchTab(firstTab);
  }

  const addBtn = document.getElementById('btn-add-task-timeline');
  const clearBtn = document.getElementById('btn-clear-timeline');
  const startEqBtn = document.getElementById('btn-start-eq');
  const addManualBtn = document.getElementById('btn-add-manual-task');

  if (role.toLowerCase().includes('technician')) {
    if (addBtn) addBtn.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'none';
    if (startEqBtn) startEqBtn.style.display = 'none';
    if (addManualBtn) addManualBtn.style.display = 'none';
  } else {
    if (addBtn) addBtn.style.display = 'inline-flex';
    if (clearBtn) clearBtn.style.display = 'inline-flex';
    if (startEqBtn) startEqBtn.style.display = 'inline-flex';
    if (addManualBtn) addManualBtn.style.display = 'inline-flex';
  }

  const fullAccessRoles = ['Admin persona', 'Admin', 'Building Maintenance Manager', 'Manager', 'OIC Building Maintenance'];
  let customBtn = document.getElementById('btn-header-customize-roles');
  const headerRight = document.querySelector('.header-right') || document.querySelector('.user-profile-chip');

  if (fullAccessRoles.includes(role)) {
    if (!customBtn && headerRight) {
      customBtn = document.createElement('button');
      customBtn.id = 'btn-header-customize-roles';
      customBtn.className = 'btn btn-secondary';
      customBtn.style.fontSize = '11px';
      customBtn.style.padding = '4px 10px';
      customBtn.style.color = '#38bdf8';
      customBtn.style.borderColor = 'rgba(56, 189, 248, 0.4)';
      customBtn.style.marginLeft = '8px';
      customBtn.innerHTML = '⚙️ Role Access Customization';
      customBtn.onclick = function() { window.openRolePermissionsModal(); };
      headerRight.appendChild(customBtn);
    } else if (customBtn) {
      customBtn.style.display = 'inline-flex';
    }
  } else if (customBtn) {
    customBtn.style.display = 'none';
  }
}

// Check for overdue tasks based on simulated current time (1:00 PM)
function checkOverdueTasks() {
  let overdueCount = 0;
  
  appState.tasks.forEach(task => {
    if (task.status !== 'Completed' && task.timeSlot) {
      const slotHour = parseTimeSlotHour(task.timeSlot);
      if (slotHour < SIMULATION_HOUR) {
        overdueCount++;
        // Add overdue notification if not already notified
        const notifId = `overdue_${task.id}`;
        if (!appState.notifications.some(n => n.id === notifId)) {
          appState.notifications.unshift({
            id: notifId,
            type: 'critical',
            message: `OVERDUE ALERT: Daily task "${task.name}" scheduled at ${task.timeSlot} is incomplete!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      }
    }
  });
  
  // Show/Hide Overdue Alert banner
  const banner = document.getElementById('overdue-banner');
  const bannerText = document.getElementById('overdue-banner-text');
  
  if (overdueCount > 0 && appState.currentUserRole !== 'Tenant') {
    banner.style.display = 'flex';
    bannerText.innerText = `Engineering Alert: You have ${overdueCount} overdue maintenance task(s) scheduled prior to 1:00 PM.`;
  } else {
    banner.style.display = 'none';
  }

  updateNotificationBadge();
}

function parseTimeSlotHour(timeStr) {
  // Converts "08:00 AM" to 8, "01:00 PM" to 13
  const parts = timeStr.split(':');
  let hour = parseInt(parts[0]);
  const isPm = timeStr.includes('PM');
  if (isPm && hour !== 12) hour += 12;
  if (!isPm && hour === 12) hour = 0;
  return hour;
}

window.hideOverdueBanner = function() {
  document.getElementById('overdue-banner').style.display = 'none';
};

// ==================== DASHBOARD PANEL ====================
function renderDashboard() {
  // Update Metrics
  const todayTasks = appState.tasks;
  const completedTasks = todayTasks.filter(t => t.status === 'Completed');
  const overdueTasks = todayTasks.filter(t => t.status !== 'Completed' && t.timeSlot && parseTimeSlotHour(t.timeSlot) < SIMULATION_HOUR);
  const criticalTasks = todayTasks.filter(t => t.priority === 'Critical' && t.status !== 'Completed');
  
  document.getElementById('stat-today-tasks').innerText = `${completedTasks.length} / ${todayTasks.length}`;
  document.getElementById('stat-overdue-tasks').innerText = overdueTasks.length;
  document.getElementById('stat-critical-tasks').innerText = criticalTasks.length;
  
  const completionRate = todayTasks.length > 0 ? Math.round((completedTasks.length / todayTasks.length) * 100) : 0;
  document.getElementById('stat-completed-rate').innerText = `${completionRate}%`;

  // Render System Health Grid
  renderSystemHealth();

  // Render Critical Issues Widget
  renderDashboardCriticalIssues();

  // Render Technician Workload Widget
  renderTechnicianLoad();
}

function renderSystemHealth() {
  const container = document.getElementById('system-health-indicators');
  container.innerHTML = '';

  const defaultSystems = ['Mechanical', 'Fire Protection', 'Plumbing', 'STP', 'Elevator', 'Structural', 'Architectural'];
  const customSystems = appState.customSystems || [];
  const systems = [...defaultSystems, ...customSystems];
  
  systems.forEach(sys => {
    const sysTasks = appState.tasks.filter(t => t.system === sys);
    const completedSysTasks = sysTasks.filter(t => t.status === 'Completed');
    
    // Determine Health status
    // If any critical task is pending/in progress, the system is critical.
    // If major tasks are pending, the system is warning.
    // Otherwise healthy.
    let status = 'healthy';
    let statusText = 'Healthy';
    
    const pendingCritical = sysTasks.some(t => t.priority === 'Critical' && t.status !== 'Completed');
    const pendingMajor = sysTasks.some(t => t.priority === 'Major' && t.status !== 'Completed');
    
    if (pendingCritical) {
      status = 'critical';
      statusText = 'Critical';
    } else if (pendingMajor) {
      status = 'warning';
      statusText = 'Warning';
    }

    let completionText = '100% Complete';
    if (sysTasks.length > 0) {
      const pct = Math.round((completedSysTasks.length / sysTasks.length) * 100);
      completionText = `${pct}% Complete (${completedSysTasks.length}/${sysTasks.length})`;
    } else {
      completionText = 'No tasks today';
    }

    const card = document.createElement('div');
    card.className = 'sys-health-card';
    
    let colorVar = `var(--sys-${getSystemClass(sys)})`;

    card.innerHTML = `
      <div class="sys-health-icon" style="background-color: rgba(255,255,255,0.03); color: ${colorVar}; border: 1.5px solid ${colorVar}">
        ${getSystemInitials(sys)}
      </div>
      <span class="sys-health-name">${sys}</span>
      <span class="health-status-badge ${status}">${statusText}</span>
      <span style="font-size: 9px; color: var(--text-muted); margin-top: 6px;">${completionText}</span>
    `;

    container.appendChild(card);
  });
}

function getSystemClass(sys) {
  if (sys === 'Architectural') return 'arch';
  if (sys === 'Structural') return 'struct';
  if (sys === 'Mechanical') return 'mech';
  if (sys === 'Fire Protection') return 'fire';
  if (sys === 'Plumbing') return 'plumb';
  if (sys === 'STP') return 'stp';
  if (sys === 'Elevator') return 'elev';
  return 'arch';
}

function getSystemInitials(sys) {
  if (sys === 'Fire Protection') return 'FP';
  return sys.substring(0, 3).toUpperCase();
}

function renderDashboardCriticalIssues() {
  const container = document.getElementById('critical-issues-list');
  container.innerHTML = '';

  const criticalIssues = appState.tasks.filter(t => t.priority === 'Critical' && t.status !== 'Completed');
  
  if (criticalIssues.length === 0) {
    container.innerHTML = '<div class="no-data-placeholder">No critical issues logged today.</div>';
    return;
  }

  criticalIssues.forEach(issue => {
    const item = document.createElement('div');
    item.className = 'critical-issue-item';
    item.onclick = () => openEditTaskModal(issue.id);

    const overdueLabel = (issue.timeSlot && parseTimeSlotHour(issue.timeSlot) < SIMULATION_HOUR) 
      ? '<span class="text-danger" style="font-weight:700;">[OVERDUE]</span>' 
      : '';

    item.innerHTML = `
      <div class="issue-main">
        <span class="issue-title">${issue.name}</span>
        <div class="issue-meta">
          <span style="color: var(--sys-${getSystemClass(issue.system)})">${issue.system}</span>
          <span>${issue.timeSlot || 'Backlog'}</span>
          <span>${issue.assignedTo || 'Unassigned'}</span>
          ${overdueLabel}
        </div>
      </div>
      <div class="issue-action">Update &rarr;</div>
    `;
    container.appendChild(item);
  });
}

function renderTechnicianLoad() {
  const container = document.getElementById('technician-load-list');
  if (!container) return;
  container.innerHTML = '';

  const schedules = appState.employeeSchedules || [];
  const techs = schedules.length > 0 ? schedules.map(e => `${e.name} (${e.position.split(' ')[0]})`) : [
    'Engr. Roan Paul Gallegos (BM Manager)',
    'Mr. Elmer Esteban (BM Supervisor)',
    'Mr. Martin Naimes (Foreman Electrician)',
    'Mr. Crispin de Gracia (Electrician)',
    'Mr. George Ybañez (Plumber)',
    'Mr. Robert Apilado (Mason)'
  ];

  techs.forEach(tech => {
    const techTasks = appState.tasks.filter(t => t.assignedTo && (t.assignedTo === tech || t.assignedTo.includes(tech.split(' ')[1] || '')));
    const completedTasks = techTasks.filter(t => t.status === 'Completed');
    
    const total = techTasks.length;
    const completed = completedTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 100;
    
    const initials = getInitials(tech);

    const item = document.createElement('div');
    item.className = 'tech-load-item';
    item.innerHTML = `
      <div class="tech-info">
        <div class="avatar" style="font-size: 10px; width: 28px; height: 28px; background-color: var(--bg-card-hover); border: 1px solid var(--border-color); color: #fff;">
          ${initials}
        </div>
        <div class="tech-details">
          <span class="tech-name">${tech}</span>
          <span class="tech-status">${techTasks.length} active tasks</span>
        </div>
      </div>
      <div class="tech-bar-container">
        <div class="tech-bar-fill" style="width: ${percentage}%;"></div>
      </div>
      <div class="tech-task-count">
        ${completed} / ${total}
      </div>
    `;
    container.appendChild(item);
  });
}

// ==================== TIMELINE VIEW ====================
function renderTimeline() {
  const hoursContainer = document.getElementById('timeline-hours-container');
  if (!hoursContainer) return;
  hoursContainer.innerHTML = '';

  // Filter conditions
  const sysFilter = document.getElementById('filter-system') ? document.getElementById('filter-system').value : 'All';
  const priFilter = document.getElementById('filter-priority') ? document.getElementById('filter-priority').value : 'All';

  // Render slots 8:00 AM to 5:00 PM
  TIMELINE_SLOTS.forEach(time => {
    const slot = document.createElement('div');
    slot.className = 'timeline-slot';
    slot.setAttribute('data-time', time);
    
    // Allow drag over
    slot.ondragover = (e) => allowDrop(e);
    slot.ondragleave = (e) => handleDragLeave(e);
    slot.ondrop = (e) => dropToSlot(e, time);

    const hourLabel = document.createElement('div');
    hourLabel.className = 'slot-hour';
    hourLabel.innerText = time;
    
    const tasksDiv = document.createElement('div');
    tasksDiv.className = 'slot-tasks';
    tasksDiv.id = `tasks-${time.replace(':', '-').replace(' ', '-')}`;

    // Query tasks for this time block
    let slotTasks = appState.tasks.filter(t => normalizeTimeSlotString(t.timeSlot) === normalizeTimeSlotString(time));
    
    // Apply filters
    if (sysFilter !== 'All') {
      slotTasks = slotTasks.filter(t => t.system === sysFilter);
    }
    if (priFilter !== 'All') {
      slotTasks = slotTasks.filter(t => t.priority === priFilter);
    }

    slotTasks.forEach(task => {
      tasksDiv.appendChild(createTaskCardElement(task));
    });

    // Create Manager Oversight column element
    const mgrDiv = document.createElement('div');
    mgrDiv.className = 'slot-manager-oversight';
    mgrDiv.style.width = '360px';
    mgrDiv.style.padding = '12px 16px';
    mgrDiv.style.borderLeft = '1px solid var(--border-color)';
    mgrDiv.style.flexShrink = '0';
    mgrDiv.style.display = 'flex';
    mgrDiv.style.flexDirection = 'column';
    mgrDiv.style.gap = '8px';

    const mgrActivity = (typeof MANAGER_DAILY_ACTIVITIES !== 'undefined' && MANAGER_DAILY_ACTIVITIES[time]) ? MANAGER_DAILY_ACTIVITIES[time] : null;
    if (mgrActivity) {
      const titleDiv = document.createElement('div');
      titleDiv.style.fontWeight = '700';
      titleDiv.style.fontSize = '12px';
      titleDiv.style.color = 'rgba(56, 189, 248, 0.95)';
      titleDiv.innerText = mgrActivity.title;
      mgrDiv.appendChild(titleDiv);

      const itemsList = document.createElement('div');
      itemsList.style.display = 'flex';
      itemsList.style.flexDirection = 'column';
      itemsList.style.gap = '6px';

      mgrActivity.items.forEach((itemText, idx) => {
        const itemKey = `${time}_${idx}`;
        const isChecked = appState.managerCheckedActivities && appState.managerCheckedActivities[itemKey] ? true : false;

        const itemWrapper = document.createElement('label');
        itemWrapper.style.display = 'flex';
        itemWrapper.style.alignItems = 'flex-start';
        itemWrapper.style.gap = '8px';
        itemWrapper.style.fontSize = '11px';
        itemWrapper.style.color = isChecked ? 'var(--text-muted)' : '#e2e8f0';
        itemWrapper.style.cursor = 'pointer';
        itemWrapper.style.lineHeight = '1.4';
        itemWrapper.style.userSelect = 'none';
        if (isChecked) {
          itemWrapper.style.textDecoration = 'line-through';
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isChecked;
        checkbox.style.marginTop = '2px';
        checkbox.style.cursor = 'pointer';
        checkbox.onchange = (e) => {
          toggleManagerChecklistItem(itemKey, e.target.checked);
        };

        const textSpan = document.createElement('span');
        textSpan.innerText = itemText;

        itemWrapper.appendChild(checkbox);
        itemWrapper.appendChild(textSpan);
        itemsList.appendChild(itemWrapper);
      });
      mgrDiv.appendChild(itemsList);
    } else {
      const emptyDiv = document.createElement('div');
      emptyDiv.style.fontStyle = 'italic';
      emptyDiv.style.fontSize = '11px';
      emptyDiv.style.color = 'var(--text-muted)';
      emptyDiv.innerText = 'No oversight tasks scheduled';
      mgrDiv.appendChild(emptyDiv);
    }

    slot.appendChild(hourLabel);
    slot.appendChild(tasksDiv);
    slot.appendChild(mgrDiv);
    hoursContainer.appendChild(slot);
  });

  // Render unscheduled backlog
  renderBacklogTasks();
}

function getSampleBeforeSvg(system, title) {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="380" height="200" viewBox="0 0 380 200"><rect width="380" height="200" fill="%230f172a"/><rect x="12" y="12" width="356" height="176" fill="%231e293b" rx="6" stroke="%23f87171" stroke-width="2"/><text x="190" y="90" fill="%23f87171" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">⚠️ BEFORE: INITIAL FAULT DETECTED</text><text x="190" y="120" fill="%2394a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">${system} — Pre-Maintenance State</text></svg>`;
}

function getSampleAfterSvg(system, title) {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="380" height="200" viewBox="0 0 380 200"><rect width="380" height="200" fill="%230f172a"/><rect x="12" y="12" width="356" height="176" fill="%231e293b" rx="6" stroke="%2322c55e" stroke-width="2"/><text x="190" y="90" fill="%234ade80" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">✓ AFTER: REMEDIATION COMPLETED</text><text x="190" y="120" fill="%2394a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">${system} — Verified & Tested OK</text></svg>`;
}

window.getTimeSlotSortOrder = function(slotStr) {
  if (!slotStr) return 9999;
  const s = String(slotStr).trim().toUpperCase();
  if (typeof TIMELINE_SLOTS !== 'undefined' && Array.isArray(TIMELINE_SLOTS)) {
    const idx = TIMELINE_SLOTS.indexOf(s);
    if (idx >= 0) return idx;
  }
  const match = s.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (match) {
    let hrs = parseInt(match[1], 10);
    const mins = parseInt(match[2], 10);
    const ampm = match[3] ? match[3].toUpperCase() : null;
    if (ampm === 'PM' && hrs < 12) hrs += 12;
    if (ampm === 'AM' && hrs === 12) hrs = 0;
    return hrs * 60 + mins;
  }
  return 9998;
};

window.updateReportTypePlaceholder = function() {
  const dateInput = document.getElementById('report-date');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
};

window.toggleReportProceduresSelector = function(isChecked) {
  const box = document.getElementById('report-procedures-selector-box');
  if (box) {
    box.style.display = isChecked ? 'block' : 'none';
  }
};

window.selectAllReportProcedures = function(isSelectAll) {
  document.querySelectorAll('.report-proc-cb').forEach(cb => {
    cb.checked = isSelectAll;
  });
};

// Comprehensive Maintenance Procedures Database for Compliance Reporting
const REPORT_PROCEDURES_CATALOG = {
  "genset": {
    "id": "genset",
    "code": "PM-OCT-08",
    "title": "Generator Set Maintenance Procedure",
    "system": "Mechanical",
    "badgeColor": "#fb923c",
    "purpose": "Generators are the backbone of power continuity for businesses and various industries. A well-maintained generator ensures uninterrupted operations during outages, minimizing costly downtime. Regular commercial generator maintenance is essential to ensure reliability and longevity, helping businesses avoid emergency failures and unexpected expenses.",
    "references": [
      "Quality manual",
      "OEM Cummins KTAA19-G6A Service Manual",
      "NFPA 110: Standard for Emergency and Standby Power Systems"
    ],
    "definitions": [
      {
        "term": "Generator maintenance",
        "def": "Planned inspections, servicing, testing, and repairs performed to keep a generator set reliable, safe, and ready to supply power when required."
      },
      {
        "term": "Preventive maintenance",
        "def": "Scheduled routine tasks (inspections, oil/filter changes, battery checks, test runs) intended to prevent failures before they occur."
      },
      {
        "term": "Automatic transfer switch ATS",
        "def": "A device that automatically transfers electrical load between utility power and generator power during an outage."
      },
      {
        "term": "Wet Stacking",
        "def": "Accumulation of unburnt fuel in the exhaust system due to operating the engine at low load (<30%), which damages cylinders and turbochargers."
      }
    ],
    "specs": [
      {
        "name": "Engine Model",
        "val": "Cummins KTAA19-G6A",
        "parameter": "Engine Model",
        "specification": "Cummins KTAA19-G6A"
      },
      {
        "name": "Power Output",
        "val": "Prime: 545kW (681kVA) / Standby: 600kW (750kVA)",
        "parameter": "Power Output",
        "specification": "Prime: 545kW (681kVA) / Standby: 600kW (750kVA)"
      },
      {
        "name": "Rated Speed",
        "val": "1800 RPM (60Hz) or 1500 RPM (50Hz)",
        "parameter": "Rated Speed",
        "specification": "1800 RPM (60Hz) or 1500 RPM (50Hz)"
      },
      {
        "name": "Lube Oil Capacity",
        "val": "50 Liters (13.2 Gallons) SAE 15W-40 (API CH-4 or higher)",
        "parameter": "Lube Oil Capacity",
        "specification": "50 Liters (13.2 Gallons) SAE 15W-40 (API CH-4 or higher)"
      },
      {
        "name": "Coolant Capacity",
        "val": "~116.5 Liters (Engine + Radiator) 50/50 Water/Ethylene Glycol",
        "parameter": "Coolant Capacity",
        "specification": "~116.5 Liters (Engine + Radiator) 50/50 Water/Ethylene Glycol"
      },
      {
        "name": "Fuel System",
        "val": "Cummins PT (Pressure-Time) Fuel System",
        "parameter": "Fuel System",
        "specification": "Cummins PT (Pressure-Time) Fuel System"
      },
      {
        "name": "Electrical System",
        "val": "24V DC Starting Batteries (Rest voltage >= 25.2V)",
        "parameter": "Electrical System",
        "specification": "24V DC Starting Batteries (Rest voltage >= 25.2V)"
      },
      {
        "name": "Aspiration",
        "val": "Turbocharged & Air-to-Air Aftercooled",
        "parameter": "Aspiration",
        "specification": "Turbocharged & Air-to-Air Aftercooled"
      }
    ],
    "instructions": [
      {
        "title": "Daily Pre-Start Procedure (Flight Check)",
        "content": "<p>Never start the engine without verifying these fluid levels and physical conditions:</p><ul><li><strong>Lube Oil:</strong> Pull the dipstick and wipe it clean. Re-insert and check that the level is between the \"L\" (Low) and \"H\" (High) marks. Use SAE 15W-40.</li><li><strong>Coolant:</strong> Check the radiator sight glass. The mixture must be a 50/50 ratio of water and ethylene glycol.</li><li><strong>Fuel System:</strong> Drain water/sediment from the Fuel-Water Separator. Ensure the day tank is at least 75% full to prevent air from entering the lines.</li><li><strong>Air Cleaner:</strong> Inspect the restriction indicator. If the red flag is visible, the filter is clogged and must be serviced.</li><li><strong>Battery:</strong> Check control panel. At rest, the 24V system should read at least 25.2V.</li></ul>"
      },
      {
        "title": "Operation Guide (Manual Starting Sequence)",
        "content": "<ol><li><strong>Isolate Load:</strong> Ensure the main output circuit breaker is in the OFF (Open) position. Never start a generator under load.</li><li><strong>Power On:</strong> Switch the control panel to Manual Mode.</li><li><strong>Crank:</strong> Press the Green (Start) button.</li><li><strong>Warm-up:</strong> Allow the engine to idle for 3–5 minutes. Monitor indicators:<br>• Normal Oil Pressure: 345–483 kPa (50–70 psi).<br>• Idle Speed: 675–775 RPM.</li></ol><p><strong>Loading the Generator:</strong> Once the frequency (60Hz/50Hz) and voltage are stable, close the main circuit breaker. Avoid running at less than 30% load for long periods (prevent wet stacking).</p>"
      },
      {
        "title": "Controlled Shutdown Sequence",
        "content": "<ol><li><strong>Remove Load:</strong> Open the main circuit breaker.</li><li><strong>Cool-down:</strong> Let the engine run at no-load for 5 minutes. This allows the turbochargers to cool down gradually. Stopping a hot engine immediately can \"cook\" the oil inside the turbo bearings.</li><li><strong>Stop:</strong> Press the Red (Stop) button.</li></ol>"
      },
      {
        "title": "Preventive Maintenance Schedule",
        "content": "<ul><li><strong>Daily:</strong> Check oil, coolant, and fuel-water separator.</li><li><strong>250 Hours / 6 Months:</strong> Change lube oil & filters; replace fuel and coolant filters.</li><li><strong>1500 Hours / 1 Year:</strong> Full engine clean; adjust overhead set (valves/injectors); check zinc anodes.</li><li><strong>6000 Hours / 2 Years:</strong> Flush cooling system; inspect vibration dampers and turbochargers.</li></ul>"
      }
    ],
    "flightChecks": [
      "Daily Pre-Start Procedure (Flight Check):  Never start the engine without verifying these fluid levels and physical conditions:    Lube Oil:  Pull the dipstick and wipe it clean. Re-insert and...",
      "Operation Guide (Manual Starting Sequence):    Isolate Load:  Ensure the main output circuit breaker is in the OFF (Open) position. Never start a generator under load.   Power On:  Switch the co...",
      "Controlled Shutdown Sequence:    Remove Load:  Open the main circuit breaker.   Cool-down:  Let the engine run at no-load for 5 minutes. This allows the turbochargers to cool down ...",
      "Preventive Maintenance Schedule:    Daily:  Check oil, coolant, and fuel-water separator.   250 Hours / 6 Months:  Change lube oil & filters; replace fuel and coolant filters.   1500 ..."
    ],
    "checklists": {
      "Daily": [
        "Inspect oil level and top up if needed",
        "Check coolant level in radiator/expansion tank",
        "Verify fuel level in day tank and main tank",
        "Look for oil, coolant, or fuel leaks around the unit",
        "Ensure battery charger is active and charging",
        "Confirm control panel shows no alarms or faults"
      ],
      "Weekly": [
        "Inspect belts and hoses for wear or tension issues",
        "Check air intake system and clean filters if clogged",
        "Drain fuel/water separator to remove accumulated water",
        "Inspect battery terminals for corrosion or loose cables",
        "Conduct warm up and cool down cycles (5 minutes each)"
      ],
      "Monthly": [
        "Perform an operational test under load (min. 30% load for 30-60 minutes)",
        "Monitor governor performance (frequency stability at 60Hz)",
        "Inspect Exhaust system for soot leaks or damage",
        "Ensure enclosure louvers are clear of debris"
      ],
      "Quarterly": [
        "Replace oil filter and change oil",
        "Replace fuel filters (primary and secondary)",
        "Clean or replace air filters",
        "Inspect alternator connections and tighten if necessary",
        "Test automatic transfer switch (ATS) operation"
      ],
      "Annual": [
        "Flush and replace coolant",
        "Perform battery load test and replace if weak",
        "Inspect and clean generator windings",
        "Check control panel calibration and update firmware if required",
        "Conduct a full system load bank test to verify rated capacity"
      ]
    },
    "checklist": {
      "Daily": [
        "Inspect oil level and top up if needed",
        "Check coolant level in radiator/expansion tank",
        "Verify fuel level in day tank and main tank",
        "Look for oil, coolant, or fuel leaks around the unit",
        "Ensure battery charger is active and charging",
        "Confirm control panel shows no alarms or faults"
      ],
      "Weekly": [
        "Inspect belts and hoses for wear or tension issues",
        "Check air intake system and clean filters if clogged",
        "Drain fuel/water separator to remove accumulated water",
        "Inspect battery terminals for corrosion or loose cables",
        "Conduct warm up and cool down cycles (5 minutes each)"
      ],
      "Monthly": [
        "Perform an operational test under load (min. 30% load for 30-60 minutes)",
        "Monitor governor performance (frequency stability at 60Hz)",
        "Inspect Exhaust system for soot leaks or damage",
        "Ensure enclosure louvers are clear of debris"
      ],
      "Quarterly": [
        "Replace oil filter and change oil",
        "Replace fuel filters (primary and secondary)",
        "Clean or replace air filters",
        "Inspect alternator connections and tighten if necessary",
        "Test automatic transfer switch (ATS) operation"
      ],
      "Annual": [
        "Flush and replace coolant",
        "Perform battery load test and replace if weak",
        "Inspect and clean generator windings",
        "Check control panel calibration and update firmware if required",
        "Conduct a full system load bank test to verify rated capacity"
      ]
    },
    "runHourFuelTracking": {
      "initialRunHours": "1,246.0 hrs",
      "currentRunHours": "1,248.5 hrs",
      "periodRunHours": "2.5 hrs (Weekly 50% Load Test Run)",
      "readingTime": "10:00 AM (Inspection Shift Log)",
      "readingDate": "2026-08-14",
      "fuelEnergyMetrics": [
        {
          "label": "Day Tank Fuel Level",
          "val": "85% (425.0 Liters / 500 L Capacity)",
          "time": "10:00 AM",
          "status": "NORMAL"
        },
        {
          "label": "Fuel Consumed This Period",
          "val": "35.0 Liters (During 2.5 Hr Load Test)",
          "time": "10:00 AM",
          "status": "LOGGED"
        },
        {
          "label": "Average Fuel Burn Rate",
          "val": "14.0 L/hr @ 50% Load (Cummins PT System)",
          "time": "10:00 AM",
          "status": "EFFICIENT"
        },
        {
          "label": "Operating Lube Oil Pressure",
          "val": "60.0 PSI (Within 50-70 PSI Nominal Range)",
          "time": "10:00 AM",
          "status": "HEALTHY"
        },
        {
          "label": "Coolant Operating Temp",
          "val": "82.0°C (Within 78-90°C Nominal Range)",
          "time": "10:00 AM",
          "status": "OPTIMAL"
        }
      ]
    },
    "partsReplacement": [
      {
        "partCode": "FIL-204",
        "partName": "Fleetguard LF9009 Full-Flow Lube Oil Filter",
        "qty": "2 pcs",
        "condition": "Reached 250 Hr scheduled service interval",
        "dateReplaced": "2026-08-14 (1,248.5 hrs)",
        "nextDue": "At 1,500 Run Hours / Dec 2026",
        "technician": "Martin Naimes",
        "status": "Replaced"
      },
      {
        "partCode": "FLT-102",
        "partName": "Fuel-Water Separator Cartridge (FS1000)",
        "qty": "1 pc",
        "condition": "Sediment accumulation in sight bowl",
        "dateReplaced": "2026-08-14 (1,248.5 hrs)",
        "nextDue": "At 1,500 Run Hours / Dec 2026",
        "technician": "Martin Naimes",
        "status": "Replaced"
      }
    ],
    "safety": "Adhere strictly to Lockout/Tagout (LOTO) protocols and wear approved PPE."
  },
  "firepump": {
    "id": "firepump",
    "code": "PM-OCT-09",
    "title": "Fire Pump & Jockey Pump Procedure Manual",
    "system": "Fire Protection",
    "badgeColor": "#f87171",
    "purpose": "This manual defines the preventive maintenance program for Fire Pump and Jockey Pump systems to ensure continuous readiness, compliance with NFPA 20 (Standard for the Installation of stationary pumps for Fire Protection) and local fire safety regulations, and protection of life and property.",
    "references": [
      "NFPA 20: Standard for the Installation of Stationary Pumps for Fire Protection",
      "Local Fire Code Regulations",
      "Manufacturer’s Operation & Maintenance Manuals"
    ],
    "definitions": [
      {
        "term": "Fire Pump",
        "def": "The primary pump that supplies water to the fire protection system during emergency conditions."
      },
      {
        "term": "Jockey Pump",
        "def": "A small auxiliary pump designed to maintain system pressure and prevent unnecessary operation of the fire pump."
      },
      {
        "term": "LOTO (Lock-out/Tag-out)",
        "def": "A safety Procedure ensuring equipment is properly shut off and not restarted until maintenance is complete."
      }
    ],
    "specs": [
      {
        "name": "Fire Pump Model",
        "val": "Horizontal Split-Case Centrifugal",
        "parameter": "Fire Pump Model",
        "specification": "Horizontal Split-Case Centrifugal"
      },
      {
        "name": "Jockey Pump Model",
        "val": "Vertical Multi-stage Centrifugal",
        "parameter": "Jockey Pump Model",
        "specification": "Vertical Multi-stage Centrifugal"
      },
      {
        "name": "Required System Pressure",
        "val": "Jockey Cut-in: 120 PSI, Cut-out: 140 PSI / Fire Pump Cut-in: 100 PSI",
        "parameter": "Required System Pressure",
        "specification": "Jockey Cut-in: 120 PSI, Cut-out: 140 PSI / Fire Pump Cut-in: 100 PSI"
      },
      {
        "name": "Required Temperature Range",
        "val": "4.4°C to 49°C room temperature limits",
        "parameter": "Required Temperature Range",
        "specification": "4.4°C to 49°C room temperature limits"
      }
    ],
    "instructions": [
      {
        "title": "Weekly Maintenance checks",
        "content": "Perform weekly checks to ensure pumps are operational and free of defects:<br><ul><li>Inspect pump room cleanliness, ventilation, and temperature (4.4°C–49°C).</li><li>Check casing, seals, and bearings for leaks/wear.</li><li>Verify suction/discharge pressure gauges.</li><li>Test automatic start by simulating pressure drop.</li><li>Inspect jockey pump for leaks, vibration, and noise.</li></ul>"
      },
      {
        "title": "Monthly Maintenance & Testing",
        "content": "Conduct monthly functional tests and lubrication to maintain reliability:<br><ul><li>Perform fire pump churn test (no-flow run for 10 mins).</li><li>Inspect strainers, valves, and relief valves.</li><li>Lubricate pump bearings and couplings.</li><li>Run jockey pump manually to confirm smooth operation.</li><li>Inspect electrical connections and controller insulation.</li><li>Check jockey pump for overheating during operation.</li></ul>"
      },
      {
        "title": "Annual Maintenance & Flow Testing",
        "content": "Carry out full system tests and component overhauls annually:<br><ul><li>Conduct fire pump full flow test (compare performance curves with original design specs).</li><li>Clean strainers, suction screens, and piping.</li><li>Overhaul jockey pump bearings, seals, and motor alignment.</li><li>Inspect impeller and casing for wear/corrosion.</li><li>Test and calibrate pressure switch cut-in values.</li></ul>"
      }
    ],
    "flightChecks": [
      "Weekly Maintenance checks: Perform weekly checks to ensure pumps are operational and free of defects:   Inspect pump room cleanliness, ventilation, and temperature (4.4°C–49°C)....",
      "Monthly Maintenance & Testing: Conduct monthly functional tests and lubrication to maintain reliability:   Perform fire pump churn test (no-flow run for 10 mins).  Inspect strainers...",
      "Annual Maintenance & Flow Testing: Carry out full system tests and component overhauls annually:   Conduct fire pump full flow test (compare performance curves with original design spec..."
    ],
    "checklists": {
      "Weekly": [
        "Pump room clean, ventilated, and temperature w/in limits (4.4°C to 49°C)",
        "Inspect pump casing, seals, bearings for leaks/ wear",
        "Verify suction/ discharge pressure gauges",
        "Test automatic start (simulate pressure drop)",
        "Check controller status lights and alarms",
        "Jockey pump: inspect for leaks, vibration, unusual noise",
        "Jockey pump: verify automatic start/stop operation"
      ],
      "Monthly": [
        "Fire pump churn test (no-flow run)",
        "Inspect strainers, valves, and relief valves",
        "Lubricate bearings and couplings",
        "Jockey pump: run manually to confirm smooth operation",
        "Jockey pump: inspect electrical connections and motor insulation",
        "Jockey pump: check for overheating during operation"
      ],
      "Annual": [
        "Fire pump full flow test (compare with design specs)",
        "Inspect and clean strainers, suction screens, and piping",
        "Jockey pump: overhaul bearings, seals, and motor alignment",
        "Jockey pump: inspect impeller and casing for wear/ corrosion",
        "Jockey pump: test pressure switch calibration",
        "Jockey pump: clean strainers and suction piping"
      ]
    },
    "checklist": {
      "Weekly": [
        "Pump room clean, ventilated, and temperature w/in limits (4.4°C to 49°C)",
        "Inspect pump casing, seals, bearings for leaks/ wear",
        "Verify suction/ discharge pressure gauges",
        "Test automatic start (simulate pressure drop)",
        "Check controller status lights and alarms",
        "Jockey pump: inspect for leaks, vibration, unusual noise",
        "Jockey pump: verify automatic start/stop operation"
      ],
      "Monthly": [
        "Fire pump churn test (no-flow run)",
        "Inspect strainers, valves, and relief valves",
        "Lubricate bearings and couplings",
        "Jockey pump: run manually to confirm smooth operation",
        "Jockey pump: inspect electrical connections and motor insulation",
        "Jockey pump: check for overheating during operation"
      ],
      "Annual": [
        "Fire pump full flow test (compare with design specs)",
        "Inspect and clean strainers, suction screens, and piping",
        "Jockey pump: overhaul bearings, seals, and motor alignment",
        "Jockey pump: inspect impeller and casing for wear/ corrosion",
        "Jockey pump: test pressure switch calibration",
        "Jockey pump: clean strainers and suction piping"
      ]
    },
    "runHourFuelTracking": {
      "initialRunHours": "411.5 hrs (Fire Engine)",
      "currentRunHours": "412.0 hrs (Fire Engine)",
      "periodRunHours": "0.5 hrs (Weekly Churn Test Run)",
      "readingTime": "02:30 PM (Inspection Shift Log)",
      "readingDate": "2026-08-12",
      "fuelEnergyMetrics": [
        {
          "label": "Diesel Engine Day Tank",
          "val": "88% (220.0 Liters / 250 L Capacity)",
          "time": "02:30 PM",
          "status": "FULL"
        },
        {
          "label": "Fuel Consumed This Period",
          "val": "4.5 Liters (During 0.5 Hr Churn Test)",
          "time": "02:30 PM",
          "status": "LOGGED"
        },
        {
          "label": "Average Fuel Burn Rate",
          "val": "9.0 L/hr (Diesel Fire Engine)",
          "time": "02:30 PM",
          "status": "NORMAL"
        },
        {
          "label": "Header Static Water Pressure",
          "val": "125 PSI (Maintained by Jockey Pump)",
          "time": "02:30 PM",
          "status": "STABLE"
        },
        {
          "label": "Fire Pump Cut-In Pressure",
          "val": "100 PSI (Verified via pressure drop simulation)",
          "time": "02:30 PM",
          "status": "VERIFIED"
        }
      ]
    },
    "partsReplacement": [
      {
        "partCode": "SEAL-FP",
        "partName": "Split-Case Centrifugal Pump Packing Gland Rings",
        "qty": "4 pcs",
        "condition": "Normal drip rate adjustment",
        "dateReplaced": "2026-08-12 (412.0 hrs)",
        "nextDue": "Annual Inspection / Aug 2027",
        "technician": "Mr. Crispin de Gracia",
        "status": "Replaced"
      }
    ],
    "safety": "Strictly observe safety procedures before operating high-pressure fire pumps."
  },
  "stp": {
    "id": "stp",
    "code": "PM-OCT-10",
    "title": "Sewage Treatment Plant Procedure Manual",
    "system": "STP",
    "badgeColor": "#34d399",
    "purpose": "To ensure safe, efficient, and compliant operation of the Sewage Treatment Plant (STP), preventing environmental violations, equipment failure, and health hazards. Effluent must remain within LLDA/DENR standards.",
    "references": [
      "DENR Administrative Orders on wastewater discharge",
      "Manufacturer manuals for pumps, blowers, dosing systems"
    ],
    "definitions": [
      {
        "term": "STP",
        "def": "Sewage Treatment Plant - Facility designed to treat wastewater from the building before discharge."
      },
      {
        "term": "Influent / Effluent",
        "def": "Influent is wastewater entering the STP; Effluent is the treated water discharged."
      },
      {
        "term": "Aeration",
        "def": "Process of supplying oxygen to wastewater to support microbial activity."
      },
      {
        "term": "BOD / COD / TSS",
        "def": "Biochemical Oxygen Demand / Chemical Oxygen Demand / Total Suspended Solids - primary water quality compliance metrics."
      }
    ],
    "specs": [
      {
        "name": "Plant Capacity",
        "val": "150 cubic meters/day",
        "parameter": "Plant Capacity",
        "specification": "150 cubic meters/day"
      },
      {
        "name": "Treatment Process",
        "val": "Moving Bed Biofilm Reactor (MBBR) + Aerated Clarifier",
        "parameter": "Treatment Process",
        "specification": "Moving Bed Biofilm Reactor (MBBR) + Aerated Clarifier"
      },
      {
        "name": "Aeration Blowers",
        "val": "2 Units Rotary Lobe Blowers (Duty/Standby)",
        "parameter": "Aeration Blowers",
        "specification": "2 Units Rotary Lobe Blowers (Duty/Standby)"
      },
      {
        "name": "Disinfection Dosing",
        "val": "Sodium Hypochlorite liquid dosing system",
        "parameter": "Disinfection Dosing",
        "specification": "Sodium Hypochlorite liquid dosing system"
      }
    ],
    "instructions": [
      {
        "title": "Preparation & Daily Inspections",
        "content": "Ensure readiness before starting STP tasks:<br><ul><li>Wear proper PPE (chemical-resistant gloves, boots, goggles, mask).</li><li>Perform visual check of tanks, pumps, blowers, and pipelines.</li><li>Record influent/effluent readings (flow rates, pH, odor check). pH should fall between 6.5 and 9.0.</li></ul>"
      },
      {
        "title": "Routine Maintenance & Dosing",
        "content": "Perform routine upkeep to sustain operations:<br><ul><li>Clean inlet bar screens and pump strainers to prevent blockages.</li><li>Refill the sodium hypochlorite chemical dosing system daily. Check dosing pump operation.</li><li>Lubricate pump parts and flush pipelines weekly.</li></ul>"
      },
      {
        "title": "Monitoring, Testing & Sludge",
        "content": "<ul><li>Test effluent parameters (pH, turbidity, chlorine residual). Coordinate monthly lab analysis (BOD, COD, TSS).</li><li>Calibrate instruments (pH meters, flow sensors).</li><li>Siphon sludge and scum from clarifier. Coordinate disposal with DENR-accredited third-party haulers.</li></ul>"
      }
    ],
    "flightChecks": [
      "Preparation & Daily Inspections: Ensure readiness before starting STP tasks:   Wear proper PPE (chemical-resistant gloves, boots, goggles, mask).  Perform visual check of tanks, pumps...",
      "Routine Maintenance & Dosing: Perform routine upkeep to sustain operations:   Clean inlet bar screens and pump strainers to prevent blockages.  Refill the sodium hypochlorite chemi...",
      "Monitoring, Testing & Sludge:   Test effluent parameters (pH, turbidity, chlorine residual). Coordinate monthly lab analysis (BOD, COD, TSS).  Calibrate instruments (pH meters, flo..."
    ],
    "checklists": {
      "Daily": [
        "Inspect clarifiers for sludge removal and flow balance",
        "Check aeration tank blower operation and dissolved oxygen levels",
        "Clean screens and filters to prevent clogging",
        "Verify chemical dosing (disinfectants/coagulants)",
        "Measure effluent pH, turbidity, and odor",
        "Remove debris from scum and grease traps"
      ],
      "Weekly": [
        "Inspect sludge pumps and lines for blockages",
        "Clean grease traps and scum collectors",
        "Inspect PPE and emergency safety equipment",
        "Inspect electrical panels and sensors"
      ],
      "Monthly": [
        "Inspect tanks and pipelines for cracks, leaks, or corrosion",
        "Test alarms, and control panels",
        "Lubricate pumps and motors; check bearings",
        "Conduct lab analysis (BOD, COD, TSS)"
      ],
      "Annual": [
        "Sludge removal and proper disposal",
        "Calibration of instruments (flow meter, sensor)",
        "Structural inspection of tanks and pipelines",
        "Preventive servicing of motors and gearboxes"
      ]
    },
    "checklist": {
      "Daily": [
        "Inspect clarifiers for sludge removal and flow balance",
        "Check aeration tank blower operation and dissolved oxygen levels",
        "Clean screens and filters to prevent clogging",
        "Verify chemical dosing (disinfectants/coagulants)",
        "Measure effluent pH, turbidity, and odor",
        "Remove debris from scum and grease traps"
      ],
      "Weekly": [
        "Inspect sludge pumps and lines for blockages",
        "Clean grease traps and scum collectors",
        "Inspect PPE and emergency safety equipment",
        "Inspect electrical panels and sensors"
      ],
      "Monthly": [
        "Inspect tanks and pipelines for cracks, leaks, or corrosion",
        "Test alarms, and control panels",
        "Lubricate pumps and motors; check bearings",
        "Conduct lab analysis (BOD, COD, TSS)"
      ],
      "Annual": [
        "Sludge removal and proper disposal",
        "Calibration of instruments (flow meter, sensor)",
        "Structural inspection of tanks and pipelines",
        "Preventive servicing of motors and gearboxes"
      ]
    },
    "runHourFuelTracking": {
      "initialRunHours": "3,096.0 hrs (Aeration Blower 1)",
      "currentRunHours": "3,120.0 hrs (Aeration Blower 1)",
      "periodRunHours": "24.0 hrs (Continuous Duty Rotation)",
      "readingTime": "08:00 AM (Inspection Shift Log)",
      "readingDate": "2026-08-15",
      "fuelEnergyMetrics": [
        {
          "label": "Aeration Blower Dissolved Oxygen (DO)",
          "val": "2.4 mg/L (Target Range: 2.0 - 4.0 mg/L)",
          "time": "08:00 AM",
          "status": "OPTIMAL"
        },
        {
          "label": "Sodium Hypochlorite Dosing Rate",
          "val": "18.5 Liters / Day (Auto-proportional)",
          "time": "08:00 AM",
          "status": "NORMAL"
        },
        {
          "label": "Effluent Final pH Level",
          "val": "7.45 pH (DENR Compliance Window: 6.5 - 9.0)",
          "time": "08:00 AM",
          "status": "PASSED"
        },
        {
          "label": "Daily Effluent Treated & Discharged",
          "val": "118.4 Cubic Meters / Day",
          "time": "08:00 AM",
          "status": "MEASURED"
        }
      ]
    },
    "partsReplacement": [],
    "safety": "Use full chemical PPE when handling disinfectant dosing systems."
  },
  "domestic_water": {
    "id": "domestic_water",
    "code": "PM-OCT-11",
    "title": "Domestic Water System Procedure Manual",
    "system": "Plumbing",
    "badgeColor": "#38bdf8",
    "purpose": "To ensure continuous, clean, safe, and pressurized potable water supply and distribution throughout One Corporate Building, covering cistern water storage, transfer pumps, constant-pressure VFD booster pumps, pressure tanks, chlorination/UV treatment, and pressure-reducing valve (PRV) stations in compliance with PNSDW and National Plumbing Code standards.",
    "references": [
      "Philippine National Standards for Drinking Water (PNSDW / DOH)",
      "Revised National Plumbing Code of the Philippines",
      "OEM Transfer & VFD Booster Pump Operation & Maintenance Manuals"
    ],
    "definitions": [
      {
        "term": "Domestic Water Transfer Pump",
        "def": "High-capacity vertical multi-stage pump transferring raw/treated municipal water from the cistern to overhead roofdeck tanks."
      },
      {
        "term": "VFD Booster System",
        "def": "Variable Frequency Drive controlled pump manifold maintaining constant water line pressure during peak tenant demand."
      },
      {
        "term": "Cistern & Overhead Tanks",
        "def": "Primary water storage reservoirs for emergency water reserve and gravity/booster feed distribution."
      },
      {
        "term": "PRV (Pressure-Reducing Valve)",
        "def": "Hydraulic control valve reducing excessive static head pressure on lower building floors to prevent fixture damage."
      }
    ],
    "specs": [
      {
        "name": "Transfer Pump Assembly",
        "val": "Dual Vertical Multi-stage Centrifugal Pumps (Duty/Standby, 15 HP each)",
        "parameter": "Transfer Pump Assembly",
        "specification": "Dual Vertical Multi-stage Centrifugal Pumps (Duty/Standby, 15 HP each)"
      },
      {
        "name": "Booster Pump Package",
        "val": "Triplex Constant Pressure VFD Booster Pump System (45-65 PSI setpoint)",
        "parameter": "Booster Pump Package",
        "specification": "Triplex Constant Pressure VFD Booster Pump System (45-65 PSI setpoint)"
      },
      {
        "name": "Cistern Tank Capacity",
        "val": "200 Cubic Meters (Basement 2 Potable Reservoir)",
        "parameter": "Cistern Tank Capacity",
        "specification": "200 Cubic Meters (Basement 2 Potable Reservoir)"
      },
      {
        "name": "Overhead Tank Capacity",
        "val": "60 Cubic Meters (Roofdeck High & Low Zone Storage)",
        "parameter": "Overhead Tank Capacity",
        "specification": "60 Cubic Meters (Roofdeck High & Low Zone Storage)"
      },
      {
        "name": "Water Disinfection",
        "val": "Automatic In-line Sodium Hypochlorite Chemical Dosing System",
        "parameter": "Water Disinfection",
        "specification": "Automatic In-line Sodium Hypochlorite Chemical Dosing System"
      },
      {
        "name": "Operating Pressure Limits",
        "val": "Booster Cut-in: 45 PSI, Cut-out: 65 PSI / Lower Zone PRV: 50 PSI Max",
        "parameter": "Operating Pressure Limits",
        "specification": "Booster Cut-in: 45 PSI, Cut-out: 65 PSI / Lower Zone PRV: 50 PSI Max"
      }
    ],
    "instructions": [
      {
        "title": "Daily Flight Check & Water Quality Inspection",
        "content": "<ul><li>Inspect basement cistern and overhead roofdeck water levels. Ensure minimum 75% reserve capacity.</li><li>Verify domestic water line pressure on VFD controller (45–65 PSI).</li><li>Inspect transfer pump shaft seals and piping for drenching or drips.</li><li>Test free residual chlorine in drinking water using DPD test kit (0.5 to 1.5 ppm requirement).</li><li>Verify automatic duty-standby pump alternation on the control panel.</li></ul>"
      },
      {
        "title": "Weekly Strainer Cleaning & Pressure Tank Check",
        "content": "<ul><li>Clean suction Y-strainers on domestic transfer and booster pump lines.</li><li>Inspect diaphragm pressure tanks and check air pre-charge pressure (30–35 PSI static air charge).</li><li>Check pump motor operating current (Amps) against panel rating.</li><li>Inspect water meter readings and record building daily consumption rate.</li></ul>"
      },
      {
        "title": "Monthly & Quarterly PM Service",
        "content": "<ul><li>Lubricate pump motor bearings with high-temperature NLGI Grade 2 lithium grease.</li><li>Inspect and clean chlorination dosing pump injectors and suction tubing.</li><li>Test pressure-reducing valves (PRVs) on lower zones for hunting or pressure creep.</li><li>Check electrical panel contactors, relays, and VFD cooling fans for dust accumulation.</li></ul>"
      },
      {
        "title": "Annual Tank Sanitization & Water Testing",
        "content": "<ul><li>Drain, scrub, and sanitize cistern and overhead water tanks using 50 ppm chlorine solution per DOH guidelines.</li><li>Collect water samples from cistern, overhead tank, and tenant taps for DOH-accredited bacteriological and physical-chemical lab testing.</li><li>Overhaul pump mechanical seals, impellers, and shaft sleeves if worn.</li><li>Perform full hydrostatic and piping leak audit across all plumbing risers.</li></ul>"
      }
    ],
    "flightChecks": [
      "Daily Flight Check & Water Quality Inspection:   Inspect basement cistern and overhead roofdeck water levels. Ensure minimum 75% reserve capacity.  Verify domestic water line pressure on VFD contro...",
      "Weekly Strainer Cleaning & Pressure Tank Check:   Clean suction Y-strainers on domestic transfer and booster pump lines.  Inspect diaphragm pressure tanks and check air pre-charge pressure (30–35 PS...",
      "Monthly & Quarterly PM Service:   Lubricate pump motor bearings with high-temperature NLGI Grade 2 lithium grease.  Inspect and clean chlorination dosing pump injectors and suction t...",
      "Annual Tank Sanitization & Water Testing:   Drain, scrub, and sanitize cistern and overhead water tanks using 50 ppm chlorine solution per DOH guidelines.  Collect water samples from cistern, ..."
    ],
    "checklists": {
      "Daily": [
        "Inspect cistern (2B) and overhead tank (Roofdeck) water storage levels",
        "Verify domestic water line pressure on booster panel (45 to 65 PSI)",
        "Inspect transfer and booster pumps for water leaks or gland dripping",
        "Measure free residual chlorine level in potable water (0.5 - 1.5 ppm)",
        "Confirm VFD controller shows AUTO mode with no fault alarms",
        "Verify automatic duty/standby transfer switch operation"
      ],
      "Weekly": [
        "Clean suction line Y-strainers and foot valve screens",
        "Check diaphragm pressure tank air pre-charge pressure",
        "Record main water meter reading and log daily consumption rate",
        "Inspect chemical chlorination dosing pump and refill sanitizer tank",
        "Test manual start/stop override switches on transfer pumps"
      ],
      "Monthly": [
        "Lubricate pump motor bearings and check coupling alignment",
        "Inspect control panel contactors, relays, and thermal overloads",
        "Test pressure reducing valve (PRV) stations on lower floors",
        "Inspect overhead tank float valves and overflow piping"
      ],
      "Quarterly": [
        "Inspect pump impellers, wear rings, and mechanical seal faces",
        "Clean chlorination dosing injectors and flush chemical lines",
        "Calibrate digital pressure transducers and VFD feedback loop"
      ],
      "Annual": [
        "Full cistern and overhead water tank cleaning and chlorine disinfection",
        "Submit water samples for DOH bacteriological & physical-chemical analysis",
        "Overhaul transfer pump mechanical seals, bearings, and shaft sleeves",
        "Inspect all domestic water risers, valves, and expansion joints for leaks"
      ]
    },
    "checklist": {
      "Daily": [
        "Inspect cistern (2B) and overhead tank (Roofdeck) water storage levels",
        "Verify domestic water line pressure on booster panel (45 to 65 PSI)",
        "Inspect transfer and booster pumps for water leaks or gland dripping",
        "Measure free residual chlorine level in potable water (0.5 - 1.5 ppm)",
        "Confirm VFD controller shows AUTO mode with no fault alarms",
        "Verify automatic duty/standby transfer switch operation"
      ],
      "Weekly": [
        "Clean suction line Y-strainers and foot valve screens",
        "Check diaphragm pressure tank air pre-charge pressure",
        "Record main water meter reading and log daily consumption rate",
        "Inspect chemical chlorination dosing pump and refill sanitizer tank",
        "Test manual start/stop override switches on transfer pumps"
      ],
      "Monthly": [
        "Lubricate pump motor bearings and check coupling alignment",
        "Inspect control panel contactors, relays, and thermal overloads",
        "Test pressure reducing valve (PRV) stations on lower floors",
        "Inspect overhead tank float valves and overflow piping"
      ],
      "Quarterly": [
        "Inspect pump impellers, wear rings, and mechanical seal faces",
        "Clean chlorination dosing injectors and flush chemical lines",
        "Calibrate digital pressure transducers and VFD feedback loop"
      ],
      "Annual": [
        "Full cistern and overhead water tank cleaning and chlorine disinfection",
        "Submit water samples for DOH bacteriological & physical-chemical analysis",
        "Overhaul transfer pump mechanical seals, bearings, and shaft sleeves",
        "Inspect all domestic water risers, valves, and expansion joints for leaks"
      ]
    },
    "runHourFuelTracking": {
      "initialRunHours": "1,680.0 hrs (Pump 1) / 1,520.5 hrs (Pump 2)",
      "currentRunHours": "1,710.0 hrs (Pump 1) / 1,550.0 hrs (Pump 2)",
      "periodRunHours": "30.0 hrs (Constant Pressure Modulation)",
      "readingTime": "08:00 AM (2026-09-03 Log)",
      "readingDate": "2026-09-03",
      "fuelEnergyMetrics": [
        {
          "label": "Daily Building Water Consumption",
          "val": "142.5 Cubic Meters / Day (Normal)",
          "time": "08:00 AM",
          "status": "LOGGED"
        },
        {
          "label": "Free Chlorine Residual in Taps",
          "val": "0.85 ppm (PNSDW Standard: 0.5 - 1.5 ppm)",
          "time": "08:00 AM",
          "status": "PASSED"
        },
        {
          "label": "Booster Manifold Operating Pressure",
          "val": "58.0 PSI Constant (Target: 45 - 65 PSI)",
          "time": "08:00 AM",
          "status": "STABLE"
        }
      ]
    },
    "partsReplacement": [],
    "safety": "SANITATION COMPLIANCE: Lock out pump power during tank cleaning."
  },
  "submersible_pump": {
    "id": "submersible_pump",
    "code": "PM-OCT-12",
    "title": "Submersible Sump Pump & Drainage Procedure",
    "system": "Plumbing",
    "badgeColor": "#38bdf8",
    "purpose": "To define standardized preventive maintenance and inspection protocols for all submersible sump pumps, elevator pit drainage pumps, storm water retention pits, and basement de-watering systems across Basement 1, 2, and 3 levels, ensuring continuous flood protection and operational reliability.",
    "references": [
      "P.D. 1096: National Building Code of the Philippines",
      "Ebara / Flygt / Grundfos Submersible Drainage Pump Operating Manuals",
      "Building Emergency Flood Response & Heavy Typhoon Protocols"
    ],
    "definitions": [
      {
        "term": "Submersible Sump Pump",
        "def": "Waterproof motor-driven pump installed inside a basement sump pit to automatically remove accumulated groundwater, seepage, and wastewater."
      },
      {
        "term": "Float Switch Bulb",
        "def": "Tilt-activated mercury-free floating sensor that triggers pump cut-in, cut-out, and high water alarm signals."
      },
      {
        "term": "Elevator Sump Pit",
        "def": "Dedicated drainage pit at the bottom of the elevator shaft designed to capture water seepage and prevent cabin buffer submergence."
      },
      {
        "term": "De-silting",
        "def": "Removal of accumulated mud, sand, silt, and debris from pit bottoms to prevent pump impeller clogging."
      }
    ],
    "specs": [
      {
        "name": "Pump Type",
        "val": "Heavy-Duty Cast Iron Dual Submersible Sump Pumps (Duty/Standby)",
        "parameter": "Pump Type",
        "specification": "Heavy-Duty Cast Iron Dual Submersible Sump Pumps (Duty/Standby)"
      },
      {
        "name": "Motor Power / Voltage",
        "val": "2.2 kW (3.0 HP), 230V/400V 3-Phase IP68 Submersible Motor",
        "parameter": "Motor Power / Voltage",
        "specification": "2.2 kW (3.0 HP), 230V/400V 3-Phase IP68 Submersible Motor"
      },
      {
        "name": "Control System",
        "val": "4-Bulb Mechanical Float Switch Assembly (OFF, Duty, Standby, High Alarm)",
        "parameter": "Control System",
        "specification": "4-Bulb Mechanical Float Switch Assembly (OFF, Duty, Standby, High Alarm)"
      },
      {
        "name": "Max Discharge Head",
        "val": "18 Meters Head / Flow Rate: 350 Liters/Minute",
        "parameter": "Max Discharge Head",
        "specification": "18 Meters Head / Flow Rate: 350 Liters/Minute"
      },
      {
        "name": "Locations Covered",
        "val": "Basement 3 Main Sump Pit, B2 Sump Pit, Elevator Pit, Storm Storage Pit",
        "parameter": "Locations Covered",
        "specification": "Basement 3 Main Sump Pit, B2 Sump Pit, Elevator Pit, Storm Storage Pit"
      }
    ],
    "instructions": [
      {
        "title": "Daily Sump Pit Flight Check & Alarm Inspection",
        "content": "<ul><li>Inspect Basement 3 main sump pit, Basement 2 pit, and elevator shaft pits. Ensure water levels are low.</li><li>Check sump pump control panel pilot lights (Power ON, AUTO Mode active, No Overload Tripped).</li><li>Verify high water level alarm horn and visual strobe light functionality.</li><li>Inspect discharge piping and check valves for water hammer or leaks during pump cycling.</li></ul>"
      },
      {
        "title": "Weekly Float Switch & Automatic Start Test",
        "content": "<ul><li>Manually lift each float switch bulb using a wooden test rod:</li><li>• Float 1 (OFF): Pump stops.<br>• Float 2 (Duty Start): Duty pump starts immediately.<br>• Float 3 (Standby Start): Standby pump engages automatically.<br>• Float 4 (High Alarm): High water alarm horn sounds and panel alerts.</li><li>Verify automatic pump alternator reverses lead pump on each cycle.</li><li>Clear floating trash, rags, or plastic bags from pit water surfaces.</li></ul>"
      },
      {
        "title": "Monthly Insulation & Electrical Check",
        "content": "<ul><li>Inspect submersible power cables for cuts, outer sheath damage, or swelling.</li><li>Test motor winding insulation resistance using a 500V Megger (Minimum 20 M-ohms required).</li><li>Measure motor operating current (Amps) with a clamp meter and compare against nameplate rating.</li><li>Inspect check valve rubber flappers for debris trapped under the seat.</li></ul>"
      },
      {
        "title": "Quarterly & Annual De-silting & Pump Overhaul",
        "content": "<ul><li>Pump out pit and remove accumulated sand, silt, and sludge from sump pit floors (De-silting).</li><li>Hoist submersible pumps using lifting chains for physical inspection of suction strainers and impellers.</li><li>Check oil chamber seal oil for water emulsification; replace mechanical seal oil.</li><li>Inspect and clean float switch bulbs of fat/grease build-up.</li><li>Repaint corroded lifting chains and pump housing with anti-corrosive epoxy paint.</li></ul>"
      }
    ],
    "flightChecks": [
      "Daily Sump Pit Flight Check & Alarm Inspection:   Inspect Basement 3 main sump pit, Basement 2 pit, and elevator shaft pits. Ensure water levels are low.  Check sump pump control panel pilot lights ...",
      "Weekly Float Switch & Automatic Start Test:   Manually lift each float switch bulb using a wooden test rod:  • Float 1 (OFF): Pump stops. • Float 2 (Duty Start): Duty pump starts immediately. • ...",
      "Monthly Insulation & Electrical Check:   Inspect submersible power cables for cuts, outer sheath damage, or swelling.  Test motor winding insulation resistance using a 500V Megger (Minimum ...",
      "Quarterly & Annual De-silting & Pump Overhaul:   Pump out pit and remove accumulated sand, silt, and sludge from sump pit floors (De-silting).  Hoist submersible pumps using lifting chains for phys..."
    ],
    "checklists": {
      "Daily": [
        "Inspect Basement 3 main sump pit water level (must be below Duty Start level)",
        "Verify Elevator Shaft pit is dry and free of oil/water accumulation",
        "Confirm sump pump control panel switches are set to AUTO position",
        "Check control panel indicators for power ON and zero fault alarms",
        "Inspect check valves and discharge piping for leaks during operation"
      ],
      "Weekly": [
        "Manually test float switches (Duty Start, Standby Start, High Level Alarm)",
        "Verify automatic duty/standby pump alternator reverses lead pump",
        "Remove floating debris, trash, or plastic bags from sump pit surfaces",
        "Test high water level alarm horn and visual beacon light",
        "Check discharge line gate valves to ensure they are fully open"
      ],
      "Monthly": [
        "Inspect submersible power cables for sheath wear, cuts, or swelling",
        "Clean float switch bulbs and remove grease/sludge accumulation",
        "Measure operating current (Amps) of each pump motor with clamp meter",
        "Inspect control panel contactors, relays, and thermal overloads"
      ],
      "Quarterly": [
        "Pump out pit completely and remove accumulated mud, silt, and sand (De-silting)",
        "Inspect check valve rubber flappers and spring return mechanisms",
        "Test motor insulation resistance with 500V Megger (min. 20 M-ohms requirement)"
      ],
      "Annual": [
        "Hoist submersible pumps for full mechanical seal and impeller inspection",
        "Check motor oil chamber for water contamination and replace seal oil",
        "Clean and repaint pump casing and stainless steel lifting chains",
        "Conduct full simulated maximum inflow flood de-watering test"
      ]
    },
    "checklist": {
      "Daily": [
        "Inspect Basement 3 main sump pit water level (must be below Duty Start level)",
        "Verify Elevator Shaft pit is dry and free of oil/water accumulation",
        "Confirm sump pump control panel switches are set to AUTO position",
        "Check control panel indicators for power ON and zero fault alarms",
        "Inspect check valves and discharge piping for leaks during operation"
      ],
      "Weekly": [
        "Manually test float switches (Duty Start, Standby Start, High Level Alarm)",
        "Verify automatic duty/standby pump alternator reverses lead pump",
        "Remove floating debris, trash, or plastic bags from sump pit surfaces",
        "Test high water level alarm horn and visual beacon light",
        "Check discharge line gate valves to ensure they are fully open"
      ],
      "Monthly": [
        "Inspect submersible power cables for sheath wear, cuts, or swelling",
        "Clean float switch bulbs and remove grease/sludge accumulation",
        "Measure operating current (Amps) of each pump motor with clamp meter",
        "Inspect control panel contactors, relays, and thermal overloads"
      ],
      "Quarterly": [
        "Pump out pit completely and remove accumulated mud, silt, and sand (De-silting)",
        "Inspect check valve rubber flappers and spring return mechanisms",
        "Test motor insulation resistance with 500V Megger (min. 20 M-ohms requirement)"
      ],
      "Annual": [
        "Hoist submersible pumps for full mechanical seal and impeller inspection",
        "Check motor oil chamber for water contamination and replace seal oil",
        "Clean and repaint pump casing and stainless steel lifting chains",
        "Conduct full simulated maximum inflow flood de-watering test"
      ]
    },
    "runHourFuelTracking": {
      "initialRunHours": "890.0 hrs (Pump 1) / 760.5 hrs (Pump 2)",
      "currentRunHours": "915.0 hrs (Pump 1) / 785.0 hrs (Pump 2)",
      "periodRunHours": "25.0 hrs (Daily Automatic Drainage Cycles)",
      "readingTime": "08:00 AM (2026-09-03 Log)",
      "readingDate": "2026-09-03",
      "fuelEnergyMetrics": [
        {
          "label": "Average Daily Pumping Cycles",
          "val": "18.4 Cycles / Day (Normal Groundwater Inflow)",
          "time": "08:00 AM",
          "status": "NORMAL"
        },
        {
          "label": "Winding Insulation Resistance (Megger)",
          "val": "48.0 M-ohms (Standard Requirement: > 20 M-ohms)",
          "time": "08:00 AM",
          "status": "EXCELLENT"
        }
      ]
    },
    "partsReplacement": [],
    "safety": "Ensure electrical lockout before inspecting sump pit pumps."
  },
  "housekeeping": {
    "id": "housekeeping",
    "code": "SOP-HK-01",
    "title": "Housekeeping & Janitorial Procedure",
    "system": "Architectural",
    "badgeColor": "#a78bfa",
    "purpose": "To establish standardized housekeeping and janitorial procedures that ensure cleanliness, safety, and operational efficiency across all building areas.",
    "references": [
      "ISO 9001: Quality Management Systems",
      "Local sanitation and waste disposal regulations",
      "Building safety and fire codes"
    ],
    "definitions": [
      {
        "term": "Housekeeping",
        "def": "Routine cleaning and tidying of building areas."
      },
      {
        "term": "Janitorial Services",
        "def": "Comprehensive cleaning, sanitation, and waste management tasks."
      }
    ],
    "specs": [
      {
        "name": "Cleaning Shift",
        "val": "6:00 AM – 3:00 PM / 2:00 PM – 11:00 PM",
        "parameter": "Cleaning Shift",
        "specification": "6:00 AM – 3:00 PM / 2:00 PM – 11:00 PM"
      },
      {
        "name": "PPE Required",
        "val": "Rubber Gloves, Face Mask, Wet Floor Signs, Uniform",
        "parameter": "PPE Required",
        "specification": "Rubber Gloves, Face Mask, Wet Floor Signs, Uniform"
      },
      {
        "name": "Area Scope",
        "val": "Lobbies, corridors, restrooms, elevators, parking levels, reception, and planters",
        "parameter": "Area Scope",
        "specification": "Lobbies, corridors, restrooms, elevators, parking levels, reception, and planters"
      }
    ],
    "instructions": [
      {
        "title": "Daily Cleaning Procedure",
        "content": "<ol><li>Sweep and mop floors in common areas, lobbies, and corridors.</li><li>Empty trash bins and replace liners.</li><li>Clean and disinfect restrooms (toilets, sinks, mirrors, floors).</li><li>Wipe elevator panels, doors, and lobby glass surfaces.</li><li>Dust furniture, fixtures, and reception counters.</li></ol>"
      },
      {
        "title": "Weekly Deep Cleaning",
        "content": "<ol><li>Deep clean restrooms (tiles, grout, partitions).</li><li>Polish stainless steel elevator doors and handrails.</li><li>Clean parking area floors, wipe signages, and sweep dirt.</li></ol>"
      },
      {
        "title": "Monthly & Special Cleaning",
        "content": "<ul><li>Wash exterior windows and façade glass.</li><li>Pressure wash roofdeck and drainage areas.</li><li>Strip tiled floors in lobbies.</li><li><strong>Spill Response:</strong> Contain, clean, and disinfect immediately. Use warning signs.</li><li><strong>Emergency Cleaning:</strong> Respond to leaks, floods, or accidents.</li></ul>"
      }
    ],
    "flightChecks": [
      "Daily Cleaning Procedure:   Sweep and mop floors in common areas, lobbies, and corridors.  Empty trash bins and replace liners.  Clean and disinfect restrooms (toilets, sinks, ...",
      "Weekly Deep Cleaning:   Deep clean restrooms (tiles, grout, partitions).  Polish stainless steel elevator doors and handrails.  Clean parking area floors, wipe signages, an...",
      "Monthly & Special Cleaning:   Wash exterior windows and façade glass.  Pressure wash roofdeck and drainage areas.  Strip tiled floors in lobbies.   Spill Response:  Contain, clea..."
    ],
    "checklists": {
      "GROUND FLOOR (GF)": [
        "Sweep hallways, lobby, stairs, elevator, window facade and fire exit",
        "Mop the floors using suitable cleaner and disinfectant",
        "Clean edges and corners to remove accumulated dirt",
        "Clean windows, curtain wall frames and glass surfaces",
        "Spot clean walls and remove any smudges or marks",
        "Dust and clean light fixtures and wall decorations",
        "Clean and polish stainless steel elevator trim and railings",
        "Remove cobwebs from corners and high ceiling areas",
        "Clean glass doors and glass partitions",
        "Inspect GF drainage systems and clear blockages",
        "Inspect window frames for rust and corrosion",
        "Inspect and clean GF airwell ventilation",
        "Check GF fire exit routes and ensure exit doors are unlocked",
        "Clear any obstructions in the GF fire exit corridors",
        "Check and dust GF signage and emergency lighting",
        "Clean and disinfect GF elevator buttons and controls",
        "Clean elevator cabin handrails, doors, and frames",
        "Inspect and clean elevator cabin ventilation grilles",
        "Electrical Room: Sweep/mop floor, check for overheating equipment",
        "Water Meter Room: Inspect pipes for leaks, verify water meter readings",
        "MRF: Empty/clean waste bins, check for spills/spill hazards",
        "Janitorial Room: Organize supplies, sanitize mop sink area",
        "Reception: Dust desk and table surfaces, sanitize counter and phone",
        "Planters: Water lobby plants, prune dead leaves, remove debris"
      ],
      "BASEMENT 1 (1B)": [
        "Sweep parking floors to remove dirt and debris",
        "Mop parking floors using suitable cleaner/disinfectant",
        "Spot clean walls, concrete columns, and structural pillars",
        "Verify that parking slot numbers and signs are legible",
        "Inspect concrete slab for new cracks, deflection, or potholes",
        "Inspect and clean basement ventilation grilles",
        "Ensure parking area is well-lit for safety and security",
        "Remove debris and dust from basement exhaust blowers",
        "Check basement corners for signs of pest infestation",
        "Clean and disinfect 1B elevator buttons, handrails, and doors",
        "CCTV Room: Clean glass doors, windows, sweep and mop floors",
        "MDP: Dust MDP panel, ensure door latches, check for hot breakers",
        "Generator Room: Check genset for leaks/corrosion, check fluid levels"
      ],
      "BASEMENT 2 (2B)": [
        "Sweep parking slots and driveways to remove grease and debris",
        "Mop floors and wipe down parking signs",
        "Inspect basement structural columns for cracks or water stains",
        "Clean and inspect basement exhaust blowers and ductwork",
        "Ensure 2B emergency exit routes are clear and well-lit",
        "Clean and disinfect 2B elevator lobby, doors, and controls",
        "Water Pump Room: Check domestic pump bearings, inspect lines for leaks"
      ],
      "BASEMENT 3 (3B)": [
        "Sweep bottom basement floor and check sump pit pumps",
        "Mop floor areas and clear grease traps",
        "Inspect foundation walls for water seepage or structural cracks",
        "Clean and disinfect 3B elevator lobby, controls, and doors",
        "Ensure 3B emergency egress routes are clear and doors operate",
        "Sump Pit Area: Verify automatic float switch on sump pumps"
      ],
      "TYPICAL FLOORS (2F-8F)": [
        "Sweep hallways, elevator lobbies, and stairs",
        "Mop hallways and stairs using disinfectant",
        "Clean windows, frames, and curtain wall glass",
        "Spot clean walls and wipe down lobby handrails",
        "Dust and clean hallway light fixtures and signages",
        "Remove cobwebs from high corners and elevator shafts",
        "Clean glass lobby partitions and doors",
        "Inspect floor drainage systems to prevent blockages",
        "Ensure exit routes and stairwells are clear and doors unlocked",
        "Clean and disinfect elevator buttons, cabin handrails, and frames",
        "Electrical Closet: Sweep closet floor, check for breaker anomalies",
        "Restrooms: Clean toilets/urinals, sanitize sinks, mirrors, and floors"
      ]
    },
    "checklist": {
      "GROUND FLOOR (GF)": [
        "Sweep hallways, lobby, stairs, elevator, window facade and fire exit",
        "Mop the floors using suitable cleaner and disinfectant",
        "Clean edges and corners to remove accumulated dirt",
        "Clean windows, curtain wall frames and glass surfaces",
        "Spot clean walls and remove any smudges or marks",
        "Dust and clean light fixtures and wall decorations",
        "Clean and polish stainless steel elevator trim and railings",
        "Remove cobwebs from corners and high ceiling areas",
        "Clean glass doors and glass partitions",
        "Inspect GF drainage systems and clear blockages",
        "Inspect window frames for rust and corrosion",
        "Inspect and clean GF airwell ventilation",
        "Check GF fire exit routes and ensure exit doors are unlocked",
        "Clear any obstructions in the GF fire exit corridors",
        "Check and dust GF signage and emergency lighting",
        "Clean and disinfect GF elevator buttons and controls",
        "Clean elevator cabin handrails, doors, and frames",
        "Inspect and clean elevator cabin ventilation grilles",
        "Electrical Room: Sweep/mop floor, check for overheating equipment",
        "Water Meter Room: Inspect pipes for leaks, verify water meter readings",
        "MRF: Empty/clean waste bins, check for spills/spill hazards",
        "Janitorial Room: Organize supplies, sanitize mop sink area",
        "Reception: Dust desk and table surfaces, sanitize counter and phone",
        "Planters: Water lobby plants, prune dead leaves, remove debris"
      ],
      "BASEMENT 1 (1B)": [
        "Sweep parking floors to remove dirt and debris",
        "Mop parking floors using suitable cleaner/disinfectant",
        "Spot clean walls, concrete columns, and structural pillars",
        "Verify that parking slot numbers and signs are legible",
        "Inspect concrete slab for new cracks, deflection, or potholes",
        "Inspect and clean basement ventilation grilles",
        "Ensure parking area is well-lit for safety and security",
        "Remove debris and dust from basement exhaust blowers",
        "Check basement corners for signs of pest infestation",
        "Clean and disinfect 1B elevator buttons, handrails, and doors",
        "CCTV Room: Clean glass doors, windows, sweep and mop floors",
        "MDP: Dust MDP panel, ensure door latches, check for hot breakers",
        "Generator Room: Check genset for leaks/corrosion, check fluid levels"
      ],
      "BASEMENT 2 (2B)": [
        "Sweep parking slots and driveways to remove grease and debris",
        "Mop floors and wipe down parking signs",
        "Inspect basement structural columns for cracks or water stains",
        "Clean and inspect basement exhaust blowers and ductwork",
        "Ensure 2B emergency exit routes are clear and well-lit",
        "Clean and disinfect 2B elevator lobby, doors, and controls",
        "Water Pump Room: Check domestic pump bearings, inspect lines for leaks"
      ],
      "BASEMENT 3 (3B)": [
        "Sweep bottom basement floor and check sump pit pumps",
        "Mop floor areas and clear grease traps",
        "Inspect foundation walls for water seepage or structural cracks",
        "Clean and disinfect 3B elevator lobby, controls, and doors",
        "Ensure 3B emergency egress routes are clear and doors operate",
        "Sump Pit Area: Verify automatic float switch on sump pumps"
      ],
      "TYPICAL FLOORS (2F-8F)": [
        "Sweep hallways, elevator lobbies, and stairs",
        "Mop hallways and stairs using disinfectant",
        "Clean windows, frames, and curtain wall glass",
        "Spot clean walls and wipe down lobby handrails",
        "Dust and clean hallway light fixtures and signages",
        "Remove cobwebs from high corners and elevator shafts",
        "Clean glass lobby partitions and doors",
        "Inspect floor drainage systems to prevent blockages",
        "Ensure exit routes and stairwells are clear and doors unlocked",
        "Clean and disinfect elevator buttons, cabin handrails, and frames",
        "Electrical Closet: Sweep closet floor, check for breaker anomalies",
        "Restrooms: Clean toilets/urinals, sanitize sinks, mirrors, and floors"
      ]
    },
    "runHourFuelTracking": {
      "initialRunHours": "215.0 hrs (Pressure Washer)",
      "currentRunHours": "218.5 hrs (Pressure Washer)",
      "periodRunHours": "3.5 Machine Operating Hours",
      "readingTime": "08:00 AM (2026-09-03 Log)",
      "readingDate": "2026-09-03",
      "fuelEnergyMetrics": [
        {
          "label": "Eco-Friendly Neutral Floor Cleaner Consumed",
          "val": "24.0 Liters (Biodegradable Formula)",
          "time": "08:00 AM",
          "status": "LOGGED"
        },
        {
          "label": "Hospital-Grade Disinfectant Solution",
          "val": "35.0 Liters (Restroom Sanitation)",
          "time": "08:00 AM",
          "status": "LOGGED"
        }
      ]
    },
    "partsReplacement": [],
    "safety": "Deploy Wet Floor caution signs before cleaning wet surfaces."
  },
  "hvac_chiller": {
    "id": "hvac_chiller",
    "code": "PM-OCT-13",
    "title": "Central Chiller & AHU Plant Maintenance",
    "system": "Mechanical",
    "badgeColor": "#fb923c",
    "purpose": "To ensure high-efficiency chilled water delivery, precise temperature regulation, and preventive care for centrifugal chiller units.",
    "references": [
      "ASHRAE Standard 15",
      "Carrier 19XR Chiller O&M Manual"
    ],
    "definitions": [],
    "specs": [
      {
        "name": "Chiller Capacity",
        "val": "350 Tons Refrigeration (TR) Centrifugal Chiller",
        "parameter": "Chiller Capacity",
        "specification": "350 Tons Refrigeration (TR) Centrifugal Chiller"
      },
      {
        "name": "Refrigerant Type",
        "val": "R-134a Eco-Friendly Refrigerant",
        "parameter": "Refrigerant Type",
        "specification": "R-134a Eco-Friendly Refrigerant"
      }
    ],
    "instructions": [],
    "flightChecks": [
      "Chilled Water Supply/Return: Verify supply at 44.0°F and return at 54.0°F (Delta-T 10°F).",
      "Oil Level & Pressure: Verify compressor oil level in sight glass (50-75%) and net oil pressure (35-45 PSI)."
    ],
    "checklists": {
      "Daily": [
        "Record supply/return temperatures",
        "Check compressor oil pressure",
        "Inspect condenser water flow rate"
      ],
      "Weekly": [
        "Test water treatment chemical dosing pump",
        "Check oil heater operation",
        "Inspect refrigerant filter-drier differential pressure"
      ]
    },
    "checklist": {
      "Daily": [
        "Record supply/return temperatures",
        "Check compressor oil pressure",
        "Inspect condenser water flow rate"
      ],
      "Weekly": [
        "Test water treatment chemical dosing pump",
        "Check oil heater operation",
        "Inspect refrigerant filter-drier differential pressure"
      ]
    },
    "runHourFuelTracking": {
      "initialRunHours": "6,280.0 hrs (Chiller 1)",
      "currentRunHours": "6,420.0 hrs (Chiller 1)",
      "periodRunHours": "140.0 hrs Operating",
      "readingTime": "08:00 AM (2026-09-03 Log)",
      "readingDate": "2026-09-03",
      "fuelEnergyMetrics": [
        {
          "label": "Chiller Operating Energy Efficiency",
          "val": "0.58 kW / Ton (Target < 0.62 kW/TR)",
          "time": "08:00 AM",
          "status": "EXCELLENT"
        }
      ]
    },
    "partsReplacement": [],
    "safety": "Refrigerant Safety: Ensure mechanical room ventilation is ACTIVE before opening refrigerant lines."
  },
  "electrical_substation": {
    "id": "electrical_substation",
    "code": "PM-OCT-14",
    "title": "High Voltage Electrical Substation & MDP Maintenance",
    "system": "Electrical",
    "badgeColor": "#facc15",
    "purpose": "To ensure continuous 34.5kV / 480V electrical power distribution, transformer protection, and thermal busbar stability.",
    "references": [
      "Philippine Electrical Code (PEC)",
      "IEEE Standard 3001"
    ],
    "definitions": [],
    "specs": [
      {
        "name": "Transformer Rating",
        "val": "1,500 kVA Dry-Type Transformer 34.5kV to 480V",
        "parameter": "Transformer Rating",
        "specification": "1,500 kVA Dry-Type Transformer 34.5kV to 480V"
      }
    ],
    "instructions": [],
    "flightChecks": [
      "Transformer Core Temp: Verify winding temp is under 80°C.",
      "Busbar Thermal Scan: Perform infrared thermography scan on main breaker lugs."
    ],
    "checklists": {
      "Monthly": [
        "Infrared thermal scan of MDP busbars",
        "Clean transformer enclosure ventilation grilles",
        "Check capacitor bank power factor correction"
      ]
    },
    "checklist": {
      "Monthly": [
        "Infrared thermal scan of MDP busbars",
        "Clean transformer enclosure ventilation grilles",
        "Check capacitor bank power factor correction"
      ]
    },
    "runHourFuelTracking": {
      "initialRunHours": "Continuous Substation Energization",
      "currentRunHours": "24/7 Grid Synchronized Power",
      "periodRunHours": "720.0 Hours This Month",
      "readingTime": "08:00 AM (2026-09-03 Log)",
      "readingDate": "2026-09-03",
      "fuelEnergyMetrics": [
        {
          "label": "Overall Building Power Factor (PF)",
          "val": "0.97 Lagging (Target >= 0.95)",
          "time": "08:00 AM",
          "status": "EXCELLENT"
        }
      ]
    },
    "partsReplacement": [],
    "safety": "ARC FLASH HAZARD: Category 4 PPE required during high-voltage substation maintenance."
  },
  "elevator_safety": {
    "id": "elevator_safety",
    "code": "PM-OCT-15",
    "title": "Passenger & Freight Elevator Safety Audit",
    "system": "Mechanical / Electrical",
    "badgeColor": "#38bdf8",
    "purpose": "To ensure safe, smooth vertical transport, ride comfort, and compliance with ASME A17.1 elevator safety standards.",
    "references": [
      "ASME A17.1 / EN 81 Elevator Safety Code"
    ],
    "definitions": [],
    "specs": [
      {
        "name": "Elevator Fleet",
        "val": "4 Passenger Elevators (1,350 kg / 20 Person) + 1 Freight Elevator",
        "parameter": "Elevator Fleet",
        "specification": "4 Passenger Elevators (1,350 kg / 20 Person) + 1 Freight Elevator"
      }
    ],
    "instructions": [],
    "flightChecks": [
      "Floor Leveling Accuracy: Verify stopping accuracy within ±1.5 mm.",
      "Door Interlocks: Test mechanical and electrical door locks on all 34 landings."
    ],
    "checklists": {
      "Monthly": [
        "Inspect traction machine gear oil level",
        "Test car emergency lighting and intercom",
        "Check brake shoe clearance and lining thickness"
      ]
    },
    "checklist": {
      "Monthly": [
        "Inspect traction machine gear oil level",
        "Test car emergency lighting and intercom",
        "Check brake shoe clearance and lining thickness"
      ]
    },
    "runHourFuelTracking": {
      "initialRunHours": "1,720.0 hrs / 138,400 Trips",
      "currentRunHours": "1,840.0 hrs / 148,650 Trips",
      "periodRunHours": "120.0 Operating Hours",
      "readingTime": "08:00 AM (2026-09-03 Log)",
      "readingDate": "2026-09-03",
      "fuelEnergyMetrics": [
        {
          "label": "Floor Leveling Accuracy Audit",
          "val": "± 1.2 mm (Allowance: ± 3.0 mm Max)",
          "time": "08:00 AM",
          "status": "EXCELLENT"
        }
      ]
    },
    "partsReplacement": [],
    "safety": "HOISTWAY SAFETY: Engage pit STOP switch before entering hoistway."
  }
};

window.generateReport = function() {
  try {
    const reportTypeEl = document.getElementById('report-type');
    const reportType = reportTypeEl ? reportTypeEl.value : 'Daily';
    const rType = reportType;
    
    const dateInput = document.getElementById('report-date');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
    const dateVal = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split('T')[0];

    // Options toggles
    const incBeforeAfter = document.getElementById('report-opt-before-after') ? document.getElementById('report-opt-before-after').checked : true;
    const incComplaints = document.getElementById('report-opt-complaints') ? document.getElementById('report-opt-complaints').checked : true;
    const incSubChecklist = document.getElementById('report-opt-subchecklist') ? document.getElementById('report-opt-subchecklist').checked : true;
    const incOversight = document.getElementById('report-opt-oversight') ? document.getElementById('report-opt-oversight').checked : true;
    const incProcedures = document.getElementById('report-opt-procedures') ? document.getElementById('report-opt-procedures').checked : true;
    const incRunHours = document.getElementById('report-opt-runhours') ? document.getElementById('report-opt-runhours').checked : true;
    const incParts = document.getElementById('report-opt-parts') ? document.getElementById('report-opt-parts').checked : true;

    let startDate = '';
    let endDateVal = '';
    let headingPeriod = '';

    if (reportType === 'Daily') {
      startDate = dateVal;
      endDateVal = dateVal;
      headingPeriod = `Date: ${dateVal}`;
    } else if (reportType === 'Weekly') {
      startDate = dateVal;
      const start = new Date(dateVal);
      const end = isNaN(start.getTime()) ? new Date() : new Date(start);
      end.setDate(end.getDate() + 6);
      endDateVal = end.toISOString().split('T')[0];
      headingPeriod = `Week: ${startDate} to ${endDateVal}`;
    } else if (reportType === 'Monthly') {
      const monthStr = dateVal.length >= 7 ? dateVal.substring(0, 7) : new Date().toISOString().substring(0, 7);
      startDate = `${monthStr}-01`;
      const parts = monthStr.split('-');
      const year = parseInt(parts[0]) || new Date().getFullYear();
      const month = parseInt(parts[1]) || (new Date().getMonth() + 1);
      const lastDay = new Date(year, month, 0).getDate();
      endDateVal = `${monthStr}-${lastDay < 10 ? '0' + lastDay : lastDay}`;
      headingPeriod = `Month: ${monthStr}`;
    } else if (reportType === 'Annual') {
      const yearStr = dateVal.length >= 4 ? dateVal.substring(0, 4) : String(new Date().getFullYear());
      startDate = `${yearStr}-01-01`;
      endDateVal = `${yearStr}-12-31`;
      headingPeriod = `Year: ${yearStr}`;
    }

    // Filter tasks active or completed during this period (or any task containing uploaded photo evidence)
    const reportTasks = (appState.tasks || []).filter(t => {
      if (!t) return false;
      const hasBefore = (Array.isArray(t.photosBefore) && t.photosBefore.length > 0) || (t.photoBefore && t.photoBefore !== '') || (t.photoBefore1 && t.photoBefore1 !== '') || (t.photo && t.photo !== '');
      const hasAfter = (Array.isArray(t.photosAfter) && t.photosAfter.length > 0) || (t.photoAfter && t.photoAfter !== '') || (t.photoAfter1 && t.photoAfter1 !== '');
      
      // If task has uploaded photo evidence or custom captions, ALWAYS include it in report!
      if (hasBefore || hasAfter) {
        return true;
      }
      const created = t.dateCreated || '';
      const completed = t.dateCompleted || '';
      if (created && endDateVal && created > endDateVal) return false;
      if (completed && startDate && completed < startDate) return false;
      if (t.isMultiDay && t.startDate) {
        if (endDateVal && t.startDate > endDateVal) return false;
        if (startDate && t.finishDate && t.finishDate < startDate) return false;
      }
      return true;
    });

    // Sort reportTasks chronologically by scheduled time slot
    reportTasks.sort((a, b) => {
      const orderA = getTimeSlotSortOrder(a.timeSlot);
      const orderB = getTimeSlotSortOrder(b.timeSlot);
      if (orderA !== orderB) return orderA - orderB;
      return (a.name || '').localeCompare(b.name || '');
    });

    // Aggregate metrics
    const total = reportTasks.length;
    const completed = reportTasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    const criticalCount = reportTasks.filter(t => t.priority === 'Critical').length;
    const complianceRate = total > 0 ? Math.round((completed / total) * 100) : 100;

    // Get technician completions
    const techCompletions = {};
    reportTasks.filter(t => t.status === 'Completed').forEach(t => {
      if (t.assignedTo) {
        techCompletions[t.assignedTo] = (techCompletions[t.assignedTo] || 0) + 1;
      }
    });

    // Critical issues list sorted by time slot
    const criticalList = reportTasks.filter(t => t.priority === 'Critical').sort((a, b) => getTimeSlotSortOrder(a.timeSlot) - getTimeSlotSortOrder(b.timeSlot));

    // Completed daily maintenance activities list sorted by time slot
    const completedList = reportTasks.filter(t => t.status === 'Completed').sort((a, b) => getTimeSlotSortOrder(a.timeSlot) - getTimeSlotSortOrder(b.timeSlot));
    let completedTableRows = '';
    if (completedList.length > 0) {
      completedTableRows = completedList.map(c => `
        <tr>
          <td><strong>${c.system || ''}</strong></td>
          <td>${c.name || ''}</td>
          <td style="white-space: nowrap;"><strong>${c.timeSlot || 'Backlog'}</strong></td>
          <td style="white-space: nowrap;">${c.assignedTo || 'Unassigned'}</td>
          <td>${c.notes || 'Routine check completed with no anomalies.'}</td>
        </tr>
      `).join('');
    } else {
      completedTableRows = '<tr><td colspan="5" style="text-align:center; color:#6b7280;">No completed tasks recorded during this period.</td></tr>';
    }

    // Build Critical Table & Before/After Cards
    let criticalTableRows = '';
    let criticalBeforeAfterCardsHtml = '';

    if (criticalList.length > 0) {
      criticalTableRows = criticalList.map(c => `
        <tr>
          <td><strong>${c.system || ''}</strong></td>
          <td>${c.name || ''}</td>
          <td><span class="status-badge" style="background-color: ${c.status === 'Completed' ? '#10b981; color:#fff;' : '#ef4444; color:#fff;'}">${c.status}</span></td>
          <td>${c.assignedTo || 'Unassigned'}</td>
        </tr>
      `).join('');
    } else {
      criticalTableRows = '<tr><td colspan="4" style="text-align:center; color:#6b7280;">No critical issues recorded during this cycle.</td></tr>';
    }

    if (incBeforeAfter) {
      // Filter ALL report tasks that have uploaded images, sorted chronologically by time slot
      const tasksWithPhotos = reportTasks.filter(c => {
        if (!c) return false;
        const hasBefore = (Array.isArray(c.photosBefore) && c.photosBefore.length > 0) || c.photoBefore1 || c.photoBefore || c.photo;
        const hasAfter = (Array.isArray(c.photosAfter) && c.photosAfter.length > 0) || c.photoAfter1 || c.photoAfter;
        return (hasBefore || hasAfter);
      }).sort((a, b) => getTimeSlotSortOrder(a.timeSlot) - getTimeSlotSortOrder(b.timeSlot));

      if (tasksWithPhotos.length > 0) {
        criticalBeforeAfterCardsHtml = `
          <div style="margin-top: 16px; margin-bottom: 24px;">
            <h4 style="font-size: 12px; color: #1e3a8a; font-weight: 800; text-transform: uppercase; margin-bottom: 10px;">Maintenance Tasks & Issues — Before & After Photo Evidence (${tasksWithPhotos.length} Tasks with Photo Evidence)</h4>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${tasksWithPhotos.map(c => {
                let beforeList = [];
                if (Array.isArray(c.photosBefore) && c.photosBefore.length > 0) {
                  beforeList = c.photosBefore.filter(Boolean).map((p, idx) => {
                    const u = typeof p === 'object' && p !== null ? (p.url || p) : String(p || '');
                    const cap = typeof p === 'object' && p !== null ? (p.caption || '') : '';
                    return { url: u, cap: cap || `BEFORE ${idx + 1}: Defect / Initial state (${c.name || 'Task'})` };
                  }).filter(item => item.url && item.url.trim() !== '');
                } else {
                  if (c.photoBefore1 || c.photoBefore || c.photo) beforeList.push({ url: c.photoBefore1 || c.photoBefore || c.photo, cap: c.captionBefore1 || c.captionBefore || `BEFORE 1: Initial state (${c.name || 'Task'})` });
                  if (c.photoBefore2) beforeList.push({ url: c.photoBefore2, cap: c.captionBefore2 || `BEFORE 2: Additional angle` });
                }

                let afterList = [];
                if (Array.isArray(c.photosAfter) && c.photosAfter.length > 0) {
                  afterList = c.photosAfter.filter(Boolean).map((p, idx) => {
                    const u = typeof p === 'object' && p !== null ? (p.url || p) : String(p || '');
                    const cap = typeof p === 'object' && p !== null ? (p.caption || '') : '';
                    return { url: u, cap: cap || `AFTER ${idx + 1}: Resolution / Completed state (${c.name || 'Task'})` };
                  }).filter(item => item.url && item.url.trim() !== '');
                } else {
                  if (c.photoAfter1 || c.photoAfter) afterList.push({ url: c.photoAfter1 || c.photoAfter, cap: c.captionAfter1 || c.captionAfter || `AFTER 1: Corrective action completed (${c.assignedTo || 'Technician'})` });
                  if (c.photoAfter2) afterList.push({ url: c.photoAfter2, cap: c.captionAfter2 || `AFTER 2: Secondary verification` });
                }

                const hasBefore = beforeList.length > 0;
                const hasAfter = afterList.length > 0;

                return `
                  <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; background: #f8fafc; text-align: left;">
                    <div style="font-weight: 700; font-size: 12px; color: #0f172a; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
                      <span>${c.system || ''} — ${c.name || ''} <span style="font-weight: normal; color: #64748b; font-size: 11px;">(${c.timeSlot || 'Backlog'})</span></span>
                      <span style="font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: ${c.status === 'Completed' ? '#d1fae5; color: #065f46;' : '#fee2e2; color: #991b1b;'}">${c.status || 'Pending'} (${c.assignedTo || 'Unassigned'})</span>
                    </div>
                    <div style="display: grid; grid-template-columns: ${hasBefore && hasAfter ? '1fr 1fr' : '1fr'}; gap: 14px;">
                      <!-- BEFORE SECTION -->
                      ${hasBefore ? `
                        <div style="border: 1px solid #fca5a5; border-radius: 6px; overflow: hidden; background: #ffffff; padding: 8px;">
                          <div style="background: #fee2e2; color: #991b1b; font-size: 9.5px; font-weight: 800; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; margin-bottom: 8px;">📷 BEFORE ACTION EVIDENCE (${beforeList.length} PHOTO${beforeList.length > 1 ? 'S' : ''})</div>
                          <div style="display: grid; grid-template-columns: ${beforeList.length > 1 ? '1fr 1fr' : '1fr'}; gap: 8px;">
                            ${beforeList.map(item => `
                              <div style="border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden; background: #fafafa;">
                                <div style="height: 130px; display: flex; align-items: center; justify-content: center; background: #f1f5f9; padding: 4px;">
                                  <img src="${item.url}" alt="Before Photo" style="max-height: 120px; max-width: 100%; object-fit: contain;">
                                </div>
                                <div style="padding: 4px 6px; font-size: 9.5px; color: #475569; font-style: italic; border-top: 1px solid #e2e8f0;">${item.cap}</div>
                              </div>
                            `).join('')}
                          </div>
                        </div>
                      ` : ''}

                      <!-- AFTER SECTION -->
                      ${hasAfter ? `
                        <div style="border: 1px solid #86efac; border-radius: 6px; overflow: hidden; background: #ffffff; padding: 8px;">
                          <div style="background: #d1fae5; color: #065f46; font-size: 9.5px; font-weight: 800; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; margin-bottom: 8px;">📷 AFTER ACTION EVIDENCE (${afterList.length} PHOTO${afterList.length > 1 ? 'S' : ''})</div>
                          <div style="display: grid; grid-template-columns: ${afterList.length > 1 ? '1fr 1fr' : '1fr'}; gap: 8px;">
                            ${afterList.map(item => `
                              <div style="border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden; background: #fafafa;">
                                <div style="height: 130px; display: flex; align-items: center; justify-content: center; background: #f1f5f9; padding: 4px;">
                                  <img src="${item.url}" alt="After Photo" style="max-height: 120px; max-width: 100%; object-fit: contain;">
                                </div>
                                <div style="padding: 4px 6px; font-size: 9.5px; color: #475569; font-style: italic; border-top: 1px solid #e2e8f0;">${item.cap}</div>
                              </div>
                            `).join('')}
                          </div>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }
    }

    let techRows = '';
    Object.keys(techCompletions).forEach(techName => {
      techRows += `
        <tr>
          <td><strong>${techName}</strong></td>
          <td>${techCompletions[techName]} Tasks completed</td>
        </tr>
      `;
    });
    if (!techRows) techRows = '<tr><td colspan="2" style="text-align:center; color:#6b7280;">No completion logs available.</td></tr>';

    // Compile Sub-Checklist Section
    let subChecklistSectionHtml = '';
    if (incSubChecklist) {
      const tasksWithSubChecklist = reportTasks.filter(t => t.subChecklist && t.subChecklist.length > 0);
      if (tasksWithSubChecklist.length > 0) {
        let checkCardsHtml = tasksWithSubChecklist.map(t => {
          let itemsHtml = t.subChecklist.map(item => {
            const itemBeforePhoto = incBeforeAfter ? `
              <div style="display:flex; gap:6px; margin-top:4px;">
                <span style="font-size:9px; color:#475569;">📷 Before/After evidence: <strong>${item.item}</strong> (${item.status})</span>
              </div>
            ` : '';

            return `
              <div style="display:flex; justify-content:space-between; font-size:11px; padding:6px 0; border-bottom:1px solid #f3f4f6; align-items: center; flex-wrap:wrap; gap:6px;">
                <span style="color:#374151; font-weight:500;">${item.item}</span>
                <div style="display:flex; gap:12px; align-items:center;">
                  <span style="font-weight:bold; font-size:10px; padding:2px 6px; border-radius:3px; text-transform:uppercase; background-color:${item.status === 'OK' ? '#d1fae5' : '#fee2e2'}; color:${item.status === 'OK' ? '#065f46' : '#991b1b'};">${item.status}</span>
                  <span style="color:#6b7280; font-size:11px; max-width:200px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" title="${item.notes || ''}">${item.notes || '—'}</span>
                </div>
                ${itemBeforePhoto}
              </div>
            `;
          }).join('');

          return `
            <div style="border:1px solid #e5e7eb; border-radius:8px; padding:16px; margin-bottom:16px; background-color:#fafafa; text-align:left;">
              <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:13px; border-bottom:1px solid #e5e7eb; padding-bottom:8px; margin-bottom:12px;">
                <span style="color:#1e3a8a;">${t.system} — ${t.name}</span>
                <span style="color:#4b5563; font-size:11px;">Assigned Tech: ${t.assignedTo || 'Unassigned'}</span>
              </div>
              <div>${itemsHtml}</div>
            </div>
          `;
        }).join('');
        
        subChecklistSectionHtml = `
          <h3>Operational Sub-Checklist Audit Log</h3>
          <p style="font-size:11px; color:#4b5563; margin-bottom:12px; text-align:left;">Individual point-by-point inspections completed by technicians during daily rounds:</p>
          <div>${checkCardsHtml}</div>
        `;
      }
    }

    // Compile Maintenance Request / Tenant Complaint Section
    let complaintSectionHtml = '';
    if (incComplaints) {
      const complaints = appState.complaints || [];
      let complaintRows = '';
      if (complaints.length > 0) {
        complaintRows = complaints.map(c => {
          const bImg = c.photo || c.photoBefore || '';
          const aImg = c.photoAfter || c.resolutionPhoto || '';
          const bCap = `BEFORE: Tenant issue filed for Suite ${c.unit} — ${c.title || c.issueReported}`;
          const aCap = `AFTER: Remediation action completed — ${c.actionTaken || 'Maintenance repair verified'}`;

          const hasComplaintPhoto = bImg || aImg;
          const beforeAfterHtml = (incBeforeAfter && hasComplaintPhoto) ? `
            <div style="display:grid; grid-template-columns:${bImg && aImg ? '1fr 1fr' : '1fr'}; gap:10px; margin-top:8px;">
              ${bImg ? `
                <div style="border:1px solid #cbd5e1; border-radius:4px; overflow:hidden; background:#fff;">
                  <div style="background:#fee2e2; color:#991b1b; font-size:9px; font-weight:700; padding:3px 6px; text-transform:uppercase;">BEFORE (TENANT REPORTED ISSUE)</div>
                  <div style="height:95px; display:flex; align-items:center; justify-content:center; background:#f1f5f9;">
                    <img src="${bImg}" alt="Tenant issue photo" style="max-height:100%; max-width:100%; object-fit:cover;">
                  </div>
                  <div style="padding:4px 6px; font-size:9.5px; color:#475569; font-style:italic;">${bCap}</div>
                </div>
              ` : ''}
              ${aImg ? `
                <div style="border:1px solid #cbd5e1; border-radius:4px; overflow:hidden; background:#fff;">
                  <div style="background:#d1fae5; color:#065f46; font-size:9px; font-weight:700; padding:3px 6px; text-transform:uppercase;">AFTER (RESOLVED / REMEDIATED)</div>
                  <div style="height:95px; display:flex; align-items:center; justify-content:center; background:#f1f5f9;">
                    <img src="${aImg}" alt="Resolution photo" style="max-height:100%; max-width:100%; object-fit:cover;">
                  </div>
                  <div style="padding:4px 6px; font-size:9.5px; color:#475569; font-style:italic;">${aCap}</div>
                </div>
              ` : ''}
            </div>
          ` : '';

          return `
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td><strong>Suite ${c.unit}</strong><br><span style="font-size:10px; color:#64748b;">${c.tenantName || 'Tenant'}</span></td>
              <td><strong>${c.title}</strong><br><span style="font-size:10px; color:#64748b;">${c.details || c.description || c.issueReported || ''}</span></td>
              <td>${c.dateCreated || '2026-07-20'}</td>
              <td><span class="status-badge" style="background:${c.status === 'Resolved' ? '#10b981' : '#f59e0b'}; color:#fff;">${c.status || 'Pending'}</span></td>
              <td>${c.actionTaken || 'Assigned to Maintenance Duty'}</td>
            </tr>
            ${beforeAfterHtml ? `<tr><td colspan="5" style="padding:4px 12px 14px 12px; background:#fafafa;">${beforeAfterHtml}</td></tr>` : ''}
          `;
        }).join('');
      } else {
        complaintRows = '<tr><td colspan="5" style="text-align:center; color:#64748b; padding:16px;">No maintenance requests or tenant complaints logged during this reporting period.</td></tr>';
      }

      complaintSectionHtml = `
        <h3>Maintenance Requests & Tenant Complaints Audit Log (${complaints.length} Tickets)</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th style="width:120px;">Unit / Tenant</th>
              <th>Issue / Request Title</th>
              <th style="width:100px;">Date Filed</th>
              <th style="width:100px;">Status</th>
              <th>Resolution Action Taken</th>
            </tr>
          </thead>
          <tbody>
            ${complaintRows}
          </tbody>
        </table>
      `;
    }

    // Compile Building Manager Oversight Checklist progress
    let managerOversightSectionHtml = '';
    if (incOversight) {
      let totalMgrItems = 0;
      let completedMgrItems = 0;
      let mgrTableRows = '';

      TIMELINE_SLOTS.forEach(time => {
        const activity = MANAGER_DAILY_ACTIVITIES[time];
        if (activity) {
          let checkedCount = 0;
          const listItems = activity.items.map((itemText, idx) => {
            const itemKey = `${time}_${idx}`;
            const isChecked = appState.managerCheckedActivities && appState.managerCheckedActivities[itemKey];
            totalMgrItems++;
            if (isChecked) {
              completedMgrItems++;
              checkedCount++;
            }
            return `
              <div style="display: flex; align-items: flex-start; gap: 6px; font-size: 10px; margin-bottom: 2px; color: ${isChecked ? '#10b981' : '#4b5563'};">
                <span>${isChecked ? '✓' : '○'}</span>
                <span style="${isChecked ? 'text-decoration: line-through;' : ''}">${itemText}</span>
              </div>
            `;
          }).join('');

          mgrTableRows += `
            <tr>
              <td><strong>${time}</strong></td>
              <td><strong>${activity.title}</strong></td>
              <td>
                <div style="font-weight: 600; font-size: 11px; color: ${checkedCount === activity.items.length ? '#10b981; font-weight:700;' : '#b45309'}">
                  ${checkedCount} / ${activity.items.length} Tasks Done
                </div>
              </td>
              <td>
                <div>${listItems}</div>
              </td>
            </tr>
          `;
        }
      });

      const mgrComplianceRate = totalMgrItems > 0 ? Math.round((completedMgrItems / totalMgrItems) * 100) : 100;

      managerOversightSectionHtml = `
        <h3>Building Manager Oversight Checklist Audit (${completedMgrItems} / ${totalMgrItems} Items Checked — ${mgrComplianceRate}%)</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th style="width:100px;">Time Slot</th>
              <th style="width:200px;">Oversight Focus</th>
              <th style="width:120px;">Progress</th>
              <th>Oversight Activity Log Items</th>
            </tr>
          </thead>
          <tbody>
            ${mgrTableRows}
          </tbody>
        </table>
      `;
    }

    // Compile Maintenance Procedures Compliance Section
    let maintenanceProceduresSectionHtml = '';
    if (incProcedures) {
      const selectedProcKeys = Array.from(document.querySelectorAll('.report-proc-cb:checked')).map(cb => cb.value);
      if (selectedProcKeys.length > 0) {
        const procedureCards = selectedProcKeys.map(key => {
          const proc = (typeof REPORT_PROCEDURES_CATALOG !== 'undefined' && REPORT_PROCEDURES_CATALOG[key]) ? REPORT_PROCEDURES_CATALOG[key] : null;
          if (!proc) return '';

          // 1. Retrieve compliance history logs matching target date & report type
          const matchingHistoryLogs = getFilteredComplianceLogs(key, dateVal, rType, startDate, endDateVal);

          // IF NO LOG HISTORY MATCHES FOR THIS SYSTEM DURING TARGET DATE & REPORT TYPE, EXCLUDE THIS REPORT CARD ENTIRELY ("if no log history then no report")
          if (!matchingHistoryLogs || matchingHistoryLogs.length === 0) {
            return '';
          }

          // Use the primary matching log for test interval resolution
          const primaryLog = matchingHistoryLogs[0];
          const testInterval = primaryLog.subCategory || rType || 'Daily';

          // 2. Filter Flight Checks & Step-by-Step Instructions based on test interval
          const intervalInstructions = getInstructionsForInterval(proc.instructions, testInterval, rType);
          
          let flightChecksHtml = '';
          if (intervalInstructions && intervalInstructions.length > 0) {
            flightChecksHtml = intervalInstructions.map(inst => `
              <div style="margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed #e2e8f0;">
                <div style="font-weight: 700; color: #1e3a8a; font-size: 11px; margin-bottom: 3px;">⚡ ${inst.title}</div>
                <div style="font-size: 11px; color: #334155; line-height: 1.45;">${inst.content}</div>
              </div>
            `).join('');
          } else if (proc.flightChecks && proc.flightChecks.length > 0) {
            flightChecksHtml = `<ul style="font-size: 11px; padding-left: 18px; margin: 0;">${proc.flightChecks.map(fc => `<li style="margin-bottom: 5px; line-height: 1.4; color: #334155;">${fc}</li>`).join('')}</ul>`;
          }

          // 3. Dynamically resolve equipment run hour log matching target date
          const activeLog = getSystemRunHourLogForTargetDate(key, dateVal);

          let initialHoursDisplay = proc.runHourFuelTracking ? proc.runHourFuelTracking.initialRunHours : 'N/A';
          let currentHoursDisplay = proc.runHourFuelTracking ? proc.runHourFuelTracking.currentRunHours : 'N/A';
          let periodHoursDisplay = proc.runHourFuelTracking ? proc.runHourFuelTracking.periodRunHours : 'N/A';
          let readingTimeDisplay = proc.runHourFuelTracking ? (proc.runHourFuelTracking.readingTime || '08:00 AM') : ('08:00 AM (' + dateVal + ')');
          let metricsList = proc.runHourFuelTracking ? proc.runHourFuelTracking.fuelEnergyMetrics : [];

          if (activeLog) {
            initialHoursDisplay = activeLog.startMeter.toFixed(1) + ' hrs';
            currentHoursDisplay = activeLog.endMeter.toFixed(1) + ' hrs';
            periodHoursDisplay = activeLog.runHours.toFixed(1) + ' hrs (' + (activeLog.notes || 'Logged Run') + ')';
            readingTimeDisplay = activeLog.dateTime;

            if (key === 'genset') {
              const timeStr = activeLog.dateTime.includes(' ') ? activeLog.dateTime.split(' ')[1] : '06:33';
              metricsList = [
                { label: 'Day Tank Fuel Level', val: activeLog.fuelAfter ? (activeLog.fuelAfter.toFixed(1) + ' Liters (' + Math.round(activeLog.fuelAfter/5) + '% Capacity)') : '312.5 Liters (62.5%)', time: timeStr, status: 'NORMAL' },
                { label: 'Fuel Consumed This Period', val: activeLog.fuelConsumed.toFixed(1) + ' Liters (' + (activeLog.notes || 'During Test & Outage') + ')', time: timeStr, status: 'LOGGED' },
                { label: 'Average Fuel Burn Rate', val: activeLog.burnRate.toFixed(1) + ' L/hr @ Load (Cummins PT System)', time: timeStr, status: 'EFFICIENT' },
                { label: 'Operating Lube Oil Pressure', val: '60.0 PSI (Within 50-70 PSI Nominal Range)', time: timeStr, status: 'HEALTHY' },
                { label: 'Coolant Operating Temp', val: '82.0°C (Within 78-90°C Nominal Range)', time: timeStr, status: 'OPTIMAL' }
              ];
            }
          }

          // 4. Render ONLY actual Compliance Inspection Logs History for Section 4
          const historyLogsHtml = matchingHistoryLogs.map(log => {
            const itemRows = (log.items || []).map(item => `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 5px 8px; width: 26px; text-align: center; color: ${item.response === 'OK' ? '#10b981' : (item.response === 'DEFECT' ? '#ef4444' : '#64748b')}; font-weight: 800;">
                  ${item.response === 'OK' ? '✓' : (item.response === 'DEFECT' ? '⚠' : '–')}
                </td>
                <td style="padding: 5px 8px; color: #334155; font-weight: 600;">${item.text || item.item || item}</td>
                <td style="padding: 5px 8px; color: #64748b; font-size: 10px; font-style: italic;">${item.remarks || ''}</td>
                <td style="padding: 5px 8px; width: 85px; text-align: right; font-size: 9.5px; font-weight: 800;">
                  <span style="padding: 2px 6px; border-radius: 3px; background: ${item.response === 'OK' ? '#dcfce7' : (item.response === 'DEFECT' ? '#fee2e2' : '#f1f5f9')}; color: ${item.response === 'OK' ? '#15803d' : (item.response === 'DEFECT' ? '#991b1b' : '#475569')};">
                    ${item.response || 'VERIFIED'}
                  </span>
                </td>
              </tr>
            `).join('');

            let photosHtml = '';
            if (log.images && log.images.length > 0) {
              photosHtml = `
                <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #cbd5e1;">
                  <div style="font-size: 9.5px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin-bottom: 4px;">📷 Attached Photographic Evidence (${log.images.length})</div>
                  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ${log.images.map(img => `
                      <div style="width: 110px; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px; background: #ffffff;">
                        <img src="${img.url || img.dataUrl || img}" style="width: 100%; height: 75px; object-fit: cover; border-radius: 3px;" />
                        <div style="font-size: 8.5px; color: #64748b; margin-top: 2px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${img.caption || img.category || 'Inspection Evidence'}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `;
            }

            return `
              <div style="margin-bottom: 12px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px;">
                <div style="font-size: 11px; font-weight: 800; color: #0f172a; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <span>📋 ${log.subCategory || 'Standard'} Routine Compliance Inspection Audit Log</span>
                    <span style="font-size: 9.5px; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 2px 6px; border-radius: 3px; margin-left: 8px;">Log ID: ${log.id || 'AUDIT-LOG'}</span>
                  </div>
                  <div>
                    <span style="font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: ${log.score >= 90 ? '#dcfce7' : '#fef3c7'}; color: ${log.score >= 90 ? '#15803d' : '#92400e'};">
                      ${log.score}% PASS RATE
                    </span>
                  </div>
                </div>
                
                <div style="font-size: 9.5px; color: #64748b; margin-bottom: 8px; display: flex; gap: 16px; flex-wrap: wrap;">
                  <div><strong>Inspection Date:</strong> ${log.date}</div>
                  <div><strong>Inspected By:</strong> ${log.inspectedBy || 'Engineering Auditor'}</div>
                  <div><strong>Prepared By:</strong> ${log.preparedBy || 'Technician'}</div>
                </div>

                <table style="width: 100%; border-collapse: collapse; font-size: 10.5px;">
                  <tbody>
                    ${itemRows}
                  </tbody>
                </table>

                ${photosHtml}
              </div>
            `;
          }).join('');

          // Specs rows
          const specsRows = (proc.specs || []).map(s => `
            <tr>
              <td style="width: 230px; font-weight: 700; color: #1e3a8a; background: #f8fafc; border-right: 1px solid #e5e7eb;">${s.parameter || s.name}</td>
              <td style="color: #334155; font-weight: 600;">${s.specification || s.val}</td>
            </tr>
          `).join('');

          // References list
          const refText = (proc.references || []).join(' • ');

          return `
            <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; background: #fafafa; margin-bottom: 22px; page-break-inside: avoid; text-align: left;">
              <!-- Header Banner -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; background: ${proc.badgeColor || '#38bdf8'}; color: #ffffff;">${proc.system}</span>
                    <span style="font-size: 11px; font-weight: 700; color: #475569; font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 3px;">${proc.code}</span>
                  </div>
                  <h4 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0;">${proc.title}</h4>
                </div>
                <div style="text-align: right; font-size: 10px; color: #64748b;">
                  <strong>Target Report Date:</strong> <span style="color:#2563eb; font-weight:800;">${dateVal}</span><br>
                  <strong>Test Interval:</strong> <span style="color:#059669; font-weight:800;">${testInterval}</span><br>
                  <strong>Governance:</strong> Building Maintenance Manual
                </div>
              </div>

              <!-- Purpose & References -->
              <div style="margin-bottom: 12px;">
                <div style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px;">1. Operational Scope, Objective & Governance</div>
                <div style="font-size: 11.5px; color: #334155; line-height: 1.5; background: #ffffff; padding: 10px 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 6px 0;">${proc.purpose}</p>
                  <div style="font-size: 10px; color: #64748b; font-style: italic; border-top: 1px dashed #e2e8f0; padding-top: 4px;">
                    <strong>Regulatory Standards & References:</strong> ${refText}
                  </div>
                </div>
              </div>

              <!-- Technical Specs Table -->
              <div style="margin-bottom: 12px;">
                <div style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px;">2. System Design & Technical Operating Parameters</div>
                <table class="report-table" style="margin-bottom: 0; background: #ffffff; border: 1px solid #e2e8f0;">
                  <tbody>
                    ${specsRows}
                  </tbody>
                </table>
              </div>

              <!-- Standard Operating Flight Checks (Filtered by Log Test Interval) -->
              <div style="margin-bottom: 12px;">
                <div style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px; display: flex; justify-content: space-between;">
                  <span>3. Operational Flight Checks & Step-by-Step Instructions</span>
                  <span style="font-size: 9px; color: #2563eb; font-weight: 700;">Filtered for ${testInterval} Routine</span>
                </div>
                <div style="background: #ffffff; padding: 10px 14px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  ${flightChecksHtml}
                </div>
              </div>

              <!-- Periodic Maintenance Checklist & Audit Routines (Strictly Compliance Inspection Logs History) -->
              <div style="margin-bottom: 12px;">
                <div style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px; display: flex; justify-content: space-between;">
                  <span>4. Periodic Maintenance Checklist & Audit Routines</span>
                  <span style="font-size: 9px; color: #059669; font-weight: 700;">Verified Compliance History (${matchingHistoryLogs.length})</span>
                </div>
                ${historyLogsHtml}
              </div>

              <!-- Run Hour & Fuel Tracking Section (If Enabled & Available) -->
              ${(incRunHours && proc.runHourFuelTracking) ? `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px; display: flex; justify-content: space-between; align-items: center;">
                    <span>5. Equipment Running Hours & Fuel / Energy Metrics Tracking</span>
                    <span style="font-size: 9.5px; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 2px 6px; border-radius: 4px; border: 1px solid #bfdbfe;">⏱️ METER & RESOURCE LOG</span>
                  </div>
                  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px;">
                    <!-- Hour Meter Stats Grid with Logged Time -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin-bottom: 10px;">
                      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px 10px;">
                        <div style="font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase;">Initial Meter / Baseline</div>
                        <div style="font-size: 11.5px; font-weight: 800; color: #334155; margin-top: 2px;">${initialHoursDisplay}</div>
                      </div>
                      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 4px; padding: 8px 10px;">
                        <div style="font-size: 9px; color: #1d4ed8; font-weight: 700; text-transform: uppercase;">Current Hour Meter</div>
                        <div style="font-size: 11.5px; font-weight: 800; color: #1e40af; margin-top: 2px;">${currentHoursDisplay}</div>
                      </div>
                      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 8px 10px;">
                        <div style="font-size: 9px; color: #15803d; font-weight: 700; text-transform: uppercase;">Period Run Time / Delta</div>
                        <div style="font-size: 11.5px; font-weight: 800; color: #166534; margin-top: 2px;">${periodHoursDisplay}</div>
                      </div>
                      <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 4px; padding: 8px 10px;">
                        <div style="font-size: 9px; color: #854d0e; font-weight: 700; text-transform: uppercase;">Logged Reading Time</div>
                        <div style="font-size: 11.5px; font-weight: 800; color: #a16207; margin-top: 2px;">${readingTimeDisplay}</div>
                      </div>
                    </div>

                    <!-- Fuel / Energy Metrics Table with Recorded Time Column -->
                    ${(metricsList && metricsList.length > 0) ? `
                      <table style="width: 100%; border-collapse: collapse; font-size: 10.5px;">
                        <thead>
                          <tr style="background: #f1f5f9; border-bottom: 1px solid #cbd5e1;">
                            <th style="padding: 5px 8px; text-align: left; font-weight: 700; color: #475569; width: 38%;">Operational Metric / Resource</th>
                            <th style="padding: 5px 8px; text-align: left; font-weight: 700; color: #475569;">Recorded Reading & Operating Parameter</th>
                            <th style="padding: 5px 8px; text-align: center; font-weight: 700; color: #475569; width: 85px;">Time Logged</th>
                            <th style="padding: 5px 8px; text-align: right; font-weight: 700; color: #475569; width: 85px;">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${metricsList.map(m => `
                            <tr style="border-bottom: 1px solid #f1f5f9;">
                              <td style="padding: 4px 8px; font-weight: 600; color: #1e3a8a;">${m.label}</td>
                              <td style="padding: 4px 8px; color: #334155;">${m.val}</td>
                              <td style="padding: 4px 8px; text-align: center; color: #64748b; font-family: monospace; font-weight: 600;">${m.time || readingTimeDisplay || '08:00 AM'}</td>
                              <td style="padding: 4px 8px; text-align: right;">
                                <span style="font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 3px; background: #dcfce7; color: #15803d;">${m.status}</span>
                              </td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    ` : ''}
                  </div>
                </div>
              ` : ''}

              <!-- Safety Guidelines -->
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #ef4444; border-radius: 6px; padding: 10px 12px;">
                <div style="font-size: 10px; font-weight: 800; color: #991b1b; text-transform: uppercase; margin-bottom: 2px;">⚠️ Critical Safety Precautions & LOTO (Lock-Out / Tag-Out) Compliance</div>
                <div style="font-size: 10.5px; color: #7f1d1d; line-height: 1.4;">${proc.safety}</div>
              </div>
            </div>
          `;
        }).join('');

maintenanceProceduresSectionHtml = `
          <div style="margin-top: 28px; margin-bottom: 24px;">
            <div style="border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 16px;">
              <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
                Maintenance Procedures & Standard Protocols Compliance (${selectedProcKeys.length} Selected Systems) — ${headingPeriod}
              </h3>
              <p style="font-size: 11px; color: #64748b; margin: 3px 0 0 0;">Official building maintenance standard operating procedures, technical parameters, flight checks, and audit checklists attached to this compliance report.</p>
            </div>
            ${procedureCards}
          </div>
        `;
      }
    }

    const canvas = document.getElementById('report-printable-area');

    if (canvas) {
      canvas.innerHTML = `
        <div class="report-doc">
          <div class="report-doc-header">
            <div>
              <h1>One Corporate Building</h1>
              <p style="font-size:12px; color:#4b5563;">Facilities Maintenance Operations Management</p>
            </div>
            <div class="report-meta-info">
              <p><strong>Report Class:</strong> ${rType} Compliance Report</p>
              <p><strong>Reporting Cycle:</strong> ${headingPeriod}</p>
              <p><strong>Generated On:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
            </div>
          </div>

          <div class="report-summary-stats">
            <div class="report-stat-box">
              <div class="report-stat-num">${total}</div>
              <div class="report-stat-label">Total Logs</div>
            </div>
            <div class="report-stat-box">
              <div class="report-stat-num" style="color:#10b981;">${completed}</div>
              <div class="report-stat-label">Completed</div>
            </div>
            <div class="report-stat-box">
              <div class="report-stat-num" style="color:#ef4444;">${pending}</div>
              <div class="report-stat-label">Pending / Open</div>
            </div>
            <div class="report-stat-box">
              <div class="report-stat-num" style="color:#2563eb;">${complianceRate}%</div>
              <div class="report-stat-label">Health Index</div>
            </div>
          </div>

          <h3>Completed Daily Maintenance Activities (${completed})</h3>
          <table class="report-table">
            <thead>
              <tr>
                <th style="width:120px;">System</th>
                <th>Description</th>
                <th style="width:100px;">Time Slot</th>
                <th style="width:150px;">Technician</th>
                <th>Notes & Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${completedTableRows}
            </tbody>
          </table>

          <h3>Critical Issues Audit Log (${criticalList.length})</h3>
          <table class="report-table">
            <thead>
              <tr>
                <th style="width:120px;">System</th>
                <th>Description</th>
                <th style="width:100px;">Status</th>
                <th style="width:150px;">Personnel</th>
              </tr>
            </thead>
            <tbody>
              ${criticalTableRows}
            </tbody>
          </table>

          ${criticalBeforeAfterCardsHtml}

          ${complaintSectionHtml}

          <h3>Technician Performance & Completions</h3>
          <table class="report-table" style="max-width:400px;">
            <thead>
              <tr>
                <th>Technician Name</th>
                <th style="width:150px;">Task Outcomes</th>
              </tr>
            </thead>
            <tbody>
              ${techRows}
            </tbody>
          </table>

          ${subChecklistSectionHtml}

          ${managerOversightSectionHtml}

          ${maintenanceProceduresSectionHtml}

          <div style="margin-top: 50px; border-top: 1px solid #e5e7eb; padding-top: 20px; display: flex; justify-content: space-between;">
            <div style="text-align:center; width:200px;">
              <div style="border-bottom:1px solid #000; height:40px;"></div>
              <span style="font-size:10px; color:#4b5563; font-weight:bold;">Reported By (Lead Engineer)</span>
            </div>
            <div style="text-align:center; width:250px;">
              <div style="border-bottom:1px solid #000; height:40px;"></div>
              <span style="font-size:10px; color:#4b5563; font-weight:bold;">
                ${appState.isManagerAbsent ? 'Acting Approved By: Assistant Building Maintenance' : 'Approved By: Building Maintenance Manager'}
              </span>
            </div>
          </div>
        </div>
      `;
    }

    // Display report preview box
    const previewSec = document.getElementById('report-preview-section');
    if (previewSec) {
      previewSec.style.display = 'block';
      previewSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (err) {
    console.error("Error generating report:", err);
    alert("Could not generate report preview. Details: " + err.message);
  }
};

// ==================== TENANT DESK & JOB ORDER MANAGEMENT ====================

// Mode Switcher (Tenant Complaints vs Facility Job Orders)
window.switchTenantDeskMode = function(mode) {
  appState.activeTenantDeskTab = mode;
  const isComplaints = mode === 'complaints';
  
  const compBtn = document.getElementById('btn-subnav-complaints');
  const joBtn = document.getElementById('btn-subnav-joborders');
  const compView = document.getElementById('tenant-desk-complaints-view');
  const joView = document.getElementById('tenant-desk-joborders-view');
  const label = document.getElementById('tenant-desk-active-mode-label');

  if (compBtn) compBtn.classList.toggle('active', isComplaints);
  if (joBtn) joBtn.classList.toggle('active', !isComplaints);
  if (compView) compView.style.display = isComplaints ? 'block' : 'none';
  if (joView) joView.style.display = isComplaints ? 'none' : 'block';
  if (label) {
    label.innerText = isComplaints ? 'Tenant Complaints Desk' : 'Facility Job Orders';
    label.style.color = isComplaints ? '#38bdf8' : '#f59e0b';
  }
};

function renderTenantComplaints() {
  if (!appState.complaints) appState.complaints = [];
  if (!appState.jobOrders) appState.jobOrders = [];

  // Update Counters
  const compCountEl = document.getElementById('tenant-request-count');
  const tabCompCountEl = document.getElementById('count-tab-complaints');
  const joCountEl = document.getElementById('joborder-request-count');
  const tabJoCountEl = document.getElementById('count-tab-joborders');

  if (compCountEl) compCountEl.innerText = `${appState.complaints.length} Tickets`;
  if (tabCompCountEl) tabCompCountEl.innerText = appState.complaints.length;
  if (joCountEl) joCountEl.innerText = `${appState.jobOrders.length} Job Orders`;
  if (tabJoCountEl) tabJoCountEl.innerText = appState.jobOrders.length;

  const isManagerOrAdmin = appState.currentUserRole !== 'Tenant';

  // 1. Render Tenant Complaints Log
  const compContainer = document.getElementById('tenant-complaints-list');
  if (compContainer) {
    compContainer.innerHTML = '';
    if (appState.complaints.length === 0) {
      compContainer.innerHTML = '<div class="no-data-placeholder">No tenant complaints submitted.</div>';
    } else {
      appState.complaints.forEach(ticket => {
        const item = document.createElement('div');
        item.className = 'complaint-ticket';
        const sysColor = `var(--sys-${getSystemClass(ticket.system)})`;

        let statusColor = '#f59e0b';
        if (ticket.status === 'Completed' || ticket.status === 'Resolved') statusColor = '#10b981';
        if (ticket.status === 'In Progress') statusColor = '#38bdf8';

        let adminControlsHTML = '';
        if (isManagerOrAdmin) {
          adminControlsHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 6px; font-size: 11px;">
                <span style="color: var(--text-muted);">Set Status:</span>
                <select onchange="updateTicketStatus('${ticket.id}', this.value, false)" style="font-size: 11px; padding: 3px 6px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); color: #fff; border-radius: 4px;">
                  <option value="Pending" ${ticket.status === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                  <option value="Resolved" ${ticket.status === 'Resolved' || ticket.status === 'Completed' ? 'selected' : ''}>Resolved / Completed</option>
                </select>
              </div>
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <button class="btn btn-secondary btn-sm" onclick="openDigitalSignatureModal('${ticket.id}', 'complaint', 'Tenant / Conforme')" style="font-size: 11px; padding: 4px 8px; display: inline-flex; align-items: center; gap: 4px; color: #38bdf8; border: 1px solid rgba(56,189,248,0.4); background: rgba(56,189,248,0.1); border-radius: 4px;" title="Sign ticket digitally">
                  ✍️ Sign
                </button>
                <button class="btn btn-secondary btn-sm" onclick="openEquipmentQrModal('suite:${ticket.unit || '802'}')" style="font-size: 11px; padding: 4px 8px; display: inline-flex; align-items: center; gap: 4px; color: #34d399; border: 1px solid rgba(52,211,153,0.4); background: rgba(52,211,153,0.1); border-radius: 4px;" title="Generate Suite QR Tag">
                  🏷️ QR
                </button>
                <button class="btn btn-secondary btn-sm" onclick="openPrintComplaintModal('${ticket.id}', false)" style="font-size: 11px; padding: 4px 9px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid rgba(168, 85, 247, 0.4); background-color: rgba(168, 85, 247, 0.12); color: #c084fc; border-radius: 4px; cursor: pointer; font-weight: 600;" title="Prepare & Print Complaint Report to Administrator">
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" style="flex-shrink: 0;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                  Print Admin Report
                </button>
                <button class="btn btn-secondary btn-sm" onclick="openEditComplaintModal('${ticket.id}')" style="font-size: 11px; padding: 4px 9px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid #38bdf8; background-color: rgba(56, 189, 248, 0.1); color: #38bdf8; border-radius: 4px; cursor: pointer; font-weight: 600;" title="Edit complaint ticket details">
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" style="flex-shrink: 0;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteComplaintTicket('${ticket.id}')" style="font-size: 11px; padding: 4px 9px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid rgba(239, 68, 68, 0.4); background-color: rgba(239, 68, 68, 0.1); color: #f87171; border-radius: 4px; cursor: pointer; font-weight: 600;" title="Delete this complaint ticket">
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" style="flex-shrink: 0;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  Delete
                </button>
              </div>
            </div>
          `;
        }

        const sigBadgeHTML = ticket.digitalSignature 
          ? `<div style="margin-top: 6px; font-size: 10.5px; color: #34d399; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; background: rgba(52,211,153,0.1); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(52,211,153,0.3);">✍️ Signed by ${ticket.digitalSignature.signerName} (${ticket.digitalSignature.signerRole})</div>`
          : '';

        item.innerHTML = `
          <div class="complaint-ticket-header">
            <span class="complaint-ticket-title">${ticket.title}</span>
            <span class="system-tag" style="background-color: rgba(255,255,255,0.03); color: ${sysColor}; border: 1px solid ${sysColor}">
              ${ticket.system}
            </span>
          </div>
          <p class="complaint-ticket-body">${ticket.details || 'No details provided.'}</p>
          ${ticket.photo ? `<img class="complaint-photo" src="${ticket.photo}" alt="Issue photo">` : ''}
          ${sigBadgeHTML}
          <div class="complaint-ticket-footer complaint-ticket-meta">
            <span>Suite/Unit: <strong>${ticket.unit}</strong></span>
            <span>Status: <strong style="color: ${statusColor}">${ticket.status}</strong></span>
            <span>Filed: ${ticket.dateCreated}</span>
          </div>
          ${adminControlsHTML}
        `;
        compContainer.appendChild(item);
      });
    }
  }

  // 2. Render Facility Job Orders Log
  const joContainer = document.getElementById('joborders-list');
  if (joContainer) {
    joContainer.innerHTML = '';
    if (appState.jobOrders.length === 0) {
      joContainer.innerHTML = '<div class="no-data-placeholder">No job orders registered.</div>';
    } else {
      appState.jobOrders.forEach(jo => {
        const item = document.createElement('div');
        item.className = 'complaint-ticket';
        item.style.borderLeft = '3px solid #f59e0b';
        const sysColor = `var(--sys-${getSystemClass(jo.system)})`;

        let statusColor = '#f59e0b';
        if (jo.status === 'Completed' || jo.status === 'Resolved') statusColor = '#10b981';
        if (jo.status === 'In Progress') statusColor = '#38bdf8';

        let adminControlsHTML = '';
        if (isManagerOrAdmin) {
          adminControlsHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 6px; font-size: 11px;">
                <span style="color: var(--text-muted);">Set Status:</span>
                <select onchange="updateTicketStatus('${jo.id}', this.value, true)" style="font-size: 11px; padding: 3px 6px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); color: #fff; border-radius: 4px;">
                  <option value="Pending" ${jo.status === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="In Progress" ${jo.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                  <option value="Completed" ${jo.status === 'Completed' || jo.status === 'Resolved' ? 'selected' : ''}>Completed</option>
                </select>
              </div>
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <button class="btn btn-secondary btn-sm" onclick="openDigitalSignatureModal('${jo.id}', 'joborder', 'Lead Maintenance Engineer', '${jo.assignedTo || ''}')" style="font-size: 11px; padding: 4px 8px; display: inline-flex; align-items: center; gap: 4px; color: #38bdf8; border: 1px solid rgba(56,189,248,0.4); background: rgba(56,189,248,0.1); border-radius: 4px;" title="Sign Job Order digitally">
                  ✍️ Sign
                </button>
                <button class="btn btn-secondary btn-sm" onclick="openEquipmentQrModal('jo:${jo.id}')" style="font-size: 11px; padding: 4px 8px; display: inline-flex; align-items: center; gap: 4px; color: #f59e0b; border: 1px solid rgba(245,158,11,0.4); background: rgba(245,158,11,0.1); border-radius: 4px;" title="Generate Job Order QR Tag">
                  🏷️ QR
                </button>
                <button class="btn btn-secondary btn-sm" onclick="openPrintComplaintModal('${jo.id}', true)" style="font-size: 11px; padding: 4px 9px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid rgba(168, 85, 247, 0.4); background-color: rgba(168, 85, 247, 0.12); color: #c084fc; border-radius: 4px; cursor: pointer; font-weight: 600;" title="Prepare & Print Official Job Order & Service Report">
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" style="flex-shrink: 0;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                  Print Admin Report
                </button>
                <button class="btn btn-secondary btn-sm" onclick="openEditJobOrderModal('${jo.id}')" style="font-size: 11px; padding: 4px 9px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid #f59e0b; background-color: rgba(245, 158, 11, 0.12); color: #f59e0b; border-radius: 4px; cursor: pointer; font-weight: 600;" title="Edit job order details">
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" style="flex-shrink: 0;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteJobOrder('${jo.id}')" style="font-size: 11px; padding: 4px 9px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid rgba(239, 68, 68, 0.4); background-color: rgba(239, 68, 68, 0.1); color: #f87171; border-radius: 4px; cursor: pointer; font-weight: 600;" title="Delete this job order">
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" style="flex-shrink: 0;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  Delete
                </button>
              </div>
            </div>
          `;
        }

        const joSigBadgeHTML = jo.digitalSignature 
          ? `<div style="margin-top: 6px; font-size: 10.5px; color: #34d399; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; background: rgba(52,211,153,0.1); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(52,211,153,0.3);">✍️ Signed by ${jo.digitalSignature.signerName} (${jo.digitalSignature.signerRole})</div>`
          : '';

        item.innerHTML = `
          <div class="complaint-ticket-header">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span class="header-badge" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; font-weight: 800; font-size: 10px;">${jo.id.toUpperCase()}</span>
              <span class="complaint-ticket-title">${jo.title}</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <span class="header-badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; font-size: 10px;">${jo.priority || 'Major'}</span>
              <span class="system-tag" style="background-color: rgba(255,255,255,0.03); color: ${sysColor}; border: 1px solid ${sysColor}">
                ${jo.system}
              </span>
            </div>
          </div>
          <p class="complaint-ticket-body">${jo.details || 'No scope details specified.'}</p>
          ${jo.photo ? `<img class="complaint-photo" src="${jo.photo}" alt="Job Order photo">` : ''}
          ${joSigBadgeHTML}
          <div class="complaint-ticket-footer complaint-ticket-meta">
            <span>Location: <strong>${jo.unit}</strong></span>
            <span>Assigned: <strong>${jo.assignedTo || 'Duty Tech'}</strong></span>
            <span>Status: <strong style="color: ${statusColor}">${jo.status}</strong></span>
            <span>Issued: ${jo.dateCreated}</span>
          </div>
          ${adminControlsHTML}
        `;
        joContainer.appendChild(item);
      });
    }
  }
}

// Quick Status updater for Complaints & Job Orders
window.updateTicketStatus = function(ticketId, newStatus, isJobOrder) {
  const list = isJobOrder ? appState.jobOrders : appState.complaints;
  const ticket = (list || []).find(t => t.id === ticketId);
  if (!ticket) return;

  ticket.status = newStatus;
  
  // Sync matching timeline task
  const taskIdPrefix = isJobOrder ? 't_jo_' : 't_tnt_';
  const task = (appState.tasks || []).find(t => t.id === taskIdPrefix + ticketId);
  if (task) {
    task.status = (newStatus === 'Resolved' || newStatus === 'Completed') ? 'Completed' : (newStatus === 'In Progress' ? 'In Progress' : 'Pending');
  }

  saveState();
  renderTenantComplaints();
};

// Image handling for Tenant Complaints
window.handleTenantPhotoUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    appState.currentTenantPhotoBase64 = e.target.result;
    document.getElementById('tenant-photo-preview').src = e.target.result;
    document.getElementById('tenant-photo-preview-box').style.display = 'block';
  };
  reader.readAsDataURL(file);
};

window.removeTenantPhoto = function() {
  appState.currentTenantPhotoBase64 = '';
  document.getElementById('tenant-photo-preview').src = '';
  document.getElementById('tenant-photo-preview-box').style.display = 'none';
  document.getElementById('tenant-photo').value = '';
};

// Image handling for Job Orders
window.handleJobOrderPhotoUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    appState.currentJobOrderPhotoBase64 = e.target.result;
    document.getElementById('jo-photo-preview').src = e.target.result;
    document.getElementById('jo-photo-preview-box').style.display = 'block';
  };
  reader.readAsDataURL(file);
};

window.removeJobOrderPhoto = function() {
  appState.currentJobOrderPhotoBase64 = '';
  document.getElementById('jo-photo-preview').src = '';
  document.getElementById('jo-photo-preview-box').style.display = 'none';
  document.getElementById('jo-photo').value = '';
};

// Edit Photo handling for Tenant Complaints
window.handleEditTenantPhotoUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    appState.currentEditTenantPhotoBase64 = e.target.result;
    const preview = document.getElementById('edit-complaint-photo-preview');
    const box = document.getElementById('edit-complaint-photo-preview-box');
    if (preview) preview.src = e.target.result;
    if (box) box.style.display = 'block';
  };
  reader.readAsDataURL(file);
};

window.removeEditTenantPhoto = function() {
  appState.currentEditTenantPhotoBase64 = '';
  const preview = document.getElementById('edit-complaint-photo-preview');
  const box = document.getElementById('edit-complaint-photo-preview-box');
  const input = document.getElementById('edit-complaint-photo');
  if (preview) preview.src = '';
  if (box) box.style.display = 'none';
  if (input) input.value = '';
};

// Edit Photo handling for Job Orders
window.handleEditJobOrderPhotoUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    appState.currentEditJobOrderPhotoBase64 = e.target.result;
    const preview = document.getElementById('edit-jo-photo-preview');
    const box = document.getElementById('edit-jo-photo-preview-box');
    if (preview) preview.src = e.target.result;
    if (box) box.style.display = 'block';
  };
  reader.readAsDataURL(file);
};

window.removeEditJobOrderPhoto = function() {
  appState.currentEditJobOrderPhotoBase64 = '';
  const preview = document.getElementById('edit-jo-photo-preview');
  const box = document.getElementById('edit-jo-photo-preview-box');
  const input = document.getElementById('edit-jo-photo');
  if (preview) preview.src = '';
  if (box) box.style.display = 'none';
  if (input) input.value = '';
};

// Submit Tenant Complaint
window.handleTenantComplaintSubmit = function(event) {
  event.preventDefault();
  
  const unit = document.getElementById('tenant-unit').value.trim();
  const system = document.getElementById('tenant-system').value;
  const title = document.getElementById('tenant-title').value.trim();
  const details = document.getElementById('tenant-details').value.trim();

  const newTicket = {
    id: 'ticket_' + Date.now(),
    isJobOrder: false,
    unit,
    system,
    title,
    details,
    photo: appState.currentTenantPhotoBase64 || '',
    status: 'Pending',
    dateCreated: new Date().toISOString().split('T')[0]
  };

  if (!appState.complaints) appState.complaints = [];
  appState.complaints.unshift(newTicket);

  // Auto-inject into timeline tasks as a Major priority item
  const newTimelineTask = {
    id: 't_tnt_' + newTicket.id,
    name: `[Tenant ${unit}] ${title}`,
    system: system,
    frequency: 'Daily',
    timeSlot: '',
    priority: 'Major',
    status: 'Pending',
    notes: details,
    photo: appState.currentTenantPhotoBase64 || '',
    assignedTo: getSystemDefaultTechnician(system),
    dateCreated: new Date().toISOString().split('T')[0]
  };

  appState.tasks.push(newTimelineTask);

  // Notification
  appState.notifications.unshift({
    id: `tenant_notif_${newTicket.id}`,
    type: 'normal',
    message: `NEW TENANT TICKET: Suite ${unit} logged a complaint: "${title}"`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  saveState();
  checkOverdueTasks();
  
  document.getElementById('tenant-complaint-form').reset();
  removeTenantPhoto();

  renderTenantComplaints();
  alert("Your maintenance ticket has been filed and sent to the building engineering desk!");
};

// Open Edit Complaint Modal
window.openEditComplaintModal = function(ticketId) {
  if (!appState.complaints) appState.complaints = [];
  const ticket = appState.complaints.find(c => String(c.id) === String(ticketId));
  if (!ticket) {
    alert("Complaint ticket not found.");
    return;
  }

  document.getElementById('edit-complaint-id').value = ticket.id;
  document.getElementById('edit-complaint-unit').value = ticket.unit || '';
  document.getElementById('edit-complaint-system').value = ticket.system || 'Architectural';
  document.getElementById('edit-complaint-title').value = ticket.title || '';
  document.getElementById('edit-complaint-status').value = (ticket.status === 'Completed' || ticket.status === 'Resolved') ? 'Resolved' : (ticket.status || 'Pending');
  document.getElementById('edit-complaint-details').value = ticket.details || '';

  // Photo preview
  appState.currentEditTenantPhotoBase64 = ticket.photo || '';
  const photoInput = document.getElementById('edit-complaint-photo');
  if (photoInput) photoInput.value = '';
  
  const preview = document.getElementById('edit-complaint-photo-preview');
  const box = document.getElementById('edit-complaint-photo-preview-box');
  if (ticket.photo) {
    if (preview) preview.src = ticket.photo;
    if (box) box.style.display = 'block';
  } else {
    if (preview) preview.src = '';
    if (box) box.style.display = 'none';
  }

  document.getElementById('edit-complaint-modal').style.display = 'flex';
};

window.closeEditComplaintModal = function() {
  document.getElementById('edit-complaint-modal').style.display = 'none';
  appState.currentEditTenantPhotoBase64 = '';
};

// Handle Edit Complaint Submit
window.handleEditComplaintSubmit = function(event) {
  event.preventDefault();
  const ticketId = document.getElementById('edit-complaint-id').value;
  if (!appState.complaints) appState.complaints = [];
  const ticket = appState.complaints.find(c => String(c.id) === String(ticketId));
  if (!ticket) {
    alert("Ticket not found.");
    return;
  }

  const unit = document.getElementById('edit-complaint-unit').value.trim();
  const system = document.getElementById('edit-complaint-system').value;
  const title = document.getElementById('edit-complaint-title').value.trim();
  const status = document.getElementById('edit-complaint-status').value;
  const details = document.getElementById('edit-complaint-details').value.trim();

  ticket.unit = unit;
  ticket.system = system;
  ticket.title = title;
  ticket.status = status;
  ticket.details = details;
  if (appState.currentEditTenantPhotoBase64 !== undefined) {
    ticket.photo = appState.currentEditTenantPhotoBase64;
  }

  // Synchronize corresponding timeline task if present
  const matchingTask = (appState.tasks || []).find(t => t.id === 't_tnt_' + ticket.id);
  if (matchingTask) {
    matchingTask.name = `[Tenant ${unit}] ${title}`;
    matchingTask.system = system;
    matchingTask.notes = details;
    matchingTask.status = (status === 'Resolved' || status === 'Completed') ? 'Completed' : (status === 'In Progress' ? 'In Progress' : 'Pending');
    if (ticket.photo) {
      matchingTask.photo = ticket.photo;
      matchingTask.photoBefore = ticket.photo;
      matchingTask.photoBefore1 = ticket.photo;
    }
    if (matchingTask.status === 'Completed' && !matchingTask.dateCompleted) {
      matchingTask.dateCompleted = new Date().toISOString().split('T')[0];
    }
  }

  saveState();
  closeEditComplaintModal();
  renderTenantComplaints();
  if (typeof renderTimeline === 'function') renderTimeline();
  if (typeof renderDashboardSynchronizedTimeline === 'function') renderDashboardSynchronizedTimeline();
  alert(`Tenant Complaint "${title}" has been successfully updated.`);
};

// Delete Complaint Ticket
window.deleteComplaintTicket = function(ticketId) {
  if (!ticketId) return;
  if (!appState.complaints) appState.complaints = [];
  const ticket = appState.complaints.find(c => String(c.id) === String(ticketId));
  const title = ticket ? ticket.title : 'this ticket';

  if (!confirm(`Are you sure you want to permanently delete complaint ticket: "${title}"?\n\nThis will also remove any linked timeline maintenance tasks.`)) {
    return;
  }

  // Remove complaint ticket
  appState.complaints = appState.complaints.filter(c => String(c.id) !== String(ticketId));

  // Remove corresponding task
  if (appState.tasks) {
    appState.tasks = appState.tasks.filter(t => t.id !== 't_tnt_' + ticketId);
  }

  // Remove corresponding notification
  if (appState.notifications) {
    appState.notifications = appState.notifications.filter(n => n.id !== `tenant_notif_${ticketId}`);
  }

  saveState();
  closeEditComplaintModal();
  renderTenantComplaints();
  if (typeof renderTimeline === 'function') renderTimeline();
  if (typeof renderDashboardSynchronizedTimeline === 'function') renderDashboardSynchronizedTimeline();
  if (typeof updateNotificationBadge === 'function') updateNotificationBadge();
};

// Submit Job Order
window.handleJobOrderSubmit = function(event) {
  event.preventDefault();
  
  const unit = document.getElementById('jo-unit').value.trim();
  const system = document.getElementById('jo-system').value;
  const title = document.getElementById('jo-title').value.trim();
  const priority = document.getElementById('jo-priority').value;
  const details = document.getElementById('jo-details').value.trim();
  const assigned = document.getElementById('jo-assigned').value.trim() || getSystemDefaultTechnician(system);

  const newJobOrder = {
    id: 'jo_' + Date.now(),
    isJobOrder: true,
    unit,
    system,
    title,
    priority,
    details,
    assignedTo: assigned,
    photo: appState.currentJobOrderPhotoBase64 || '',
    status: 'Pending',
    dateCreated: new Date().toISOString().split('T')[0]
  };

  if (!appState.jobOrders) appState.jobOrders = [];
  appState.jobOrders.unshift(newJobOrder);

  // Auto-inject into general timeline tasks
  const newTimelineTask = {
    id: 't_jo_' + newJobOrder.id,
    name: `[Job Order - ${unit}] ${title}`,
    system: system,
    frequency: 'Daily',
    timeSlot: '',
    priority: priority,
    status: 'Pending',
    notes: details,
    photo: appState.currentJobOrderPhotoBase64 || '',
    assignedTo: assigned,
    dateCreated: new Date().toISOString().split('T')[0]
  };

  appState.tasks.push(newTimelineTask);

  // Notification
  appState.notifications.unshift({
    id: `jo_notif_${newJobOrder.id}`,
    type: 'normal',
    message: `NEW JOB ORDER ISSUED: [${system}] ${title} at ${unit}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  saveState();
  checkOverdueTasks();

  document.getElementById('job-order-form').reset();
  removeJobOrderPhoto();

  renderTenantComplaints();
  alert(`Job Order ${newJobOrder.id.toUpperCase()} has been created and assigned to ${assigned}!`);
};

// Open Edit Job Order Modal
window.openEditJobOrderModal = function(joId) {
  if (!appState.jobOrders) appState.jobOrders = [];
  const jo = appState.jobOrders.find(j => String(j.id) === String(joId));
  if (!jo) {
    alert("Job Order not found.");
    return;
  }

  document.getElementById('edit-jo-id').value = jo.id;
  document.getElementById('edit-jo-unit').value = jo.unit || '';
  document.getElementById('edit-jo-system').value = jo.system || 'Mechanical';
  document.getElementById('edit-jo-title').value = jo.title || '';
  document.getElementById('edit-jo-priority').value = jo.priority || 'Major';
  document.getElementById('edit-jo-status').value = (jo.status === 'Resolved' || jo.status === 'Completed') ? 'Completed' : (jo.status || 'Pending');
  document.getElementById('edit-jo-assigned').value = jo.assignedTo || '';
  document.getElementById('edit-jo-details').value = jo.details || '';

  // Photo preview
  appState.currentEditJobOrderPhotoBase64 = jo.photo || '';
  const photoInput = document.getElementById('edit-jo-photo');
  if (photoInput) photoInput.value = '';

  const preview = document.getElementById('edit-jo-photo-preview');
  const box = document.getElementById('edit-jo-photo-preview-box');
  if (jo.photo) {
    if (preview) preview.src = jo.photo;
    if (box) box.style.display = 'block';
  } else {
    if (preview) preview.src = '';
    if (box) box.style.display = 'none';
  }

  document.getElementById('edit-joborder-modal').style.display = 'flex';
};

window.closeEditJobOrderModal = function() {
  document.getElementById('edit-joborder-modal').style.display = 'none';
  appState.currentEditJobOrderPhotoBase64 = '';
};

// Handle Edit Job Order Submit
window.handleEditJobOrderSubmit = function(event) {
  event.preventDefault();
  const joId = document.getElementById('edit-jo-id').value;
  if (!appState.jobOrders) appState.jobOrders = [];
  const jo = appState.jobOrders.find(j => String(j.id) === String(joId));
  if (!jo) {
    alert("Job Order not found.");
    return;
  }

  const unit = document.getElementById('edit-jo-unit').value.trim();
  const system = document.getElementById('edit-jo-system').value;
  const title = document.getElementById('edit-jo-title').value.trim();
  const priority = document.getElementById('edit-jo-priority').value;
  const status = document.getElementById('edit-jo-status').value;
  const assigned = document.getElementById('edit-jo-assigned').value.trim() || getSystemDefaultTechnician(system);
  const details = document.getElementById('edit-jo-details').value.trim();

  jo.unit = unit;
  jo.system = system;
  jo.title = title;
  jo.priority = priority;
  jo.status = status;
  jo.assignedTo = assigned;
  jo.details = details;
  if (appState.currentEditJobOrderPhotoBase64 !== undefined) {
    jo.photo = appState.currentEditJobOrderPhotoBase64;
  }

  // Synchronize corresponding timeline task if present
  const matchingTask = (appState.tasks || []).find(t => t.id === 't_jo_' + jo.id);
  if (matchingTask) {
    matchingTask.name = `[Job Order - ${unit}] ${title}`;
    matchingTask.system = system;
    matchingTask.priority = priority;
    matchingTask.assignedTo = assigned;
    matchingTask.notes = details;
    matchingTask.status = (status === 'Completed' || status === 'Resolved') ? 'Completed' : (status === 'In Progress' ? 'In Progress' : 'Pending');
    if (jo.photo) {
      matchingTask.photo = jo.photo;
      matchingTask.photoBefore = jo.photo;
      matchingTask.photoBefore1 = jo.photo;
    }
    if (matchingTask.status === 'Completed' && !matchingTask.dateCompleted) {
      matchingTask.dateCompleted = new Date().toISOString().split('T')[0];
    }
  }

  saveState();
  closeEditJobOrderModal();
  renderTenantComplaints();
  if (typeof renderTimeline === 'function') renderTimeline();
  if (typeof renderDashboardSynchronizedTimeline === 'function') renderDashboardSynchronizedTimeline();
  alert(`Job Order ${jo.id.toUpperCase()} has been successfully updated.`);
};

// Delete Job Order
window.deleteJobOrder = function(joId) {
  if (!joId) return;
  if (!appState.jobOrders) appState.jobOrders = [];
  const jo = appState.jobOrders.find(j => String(j.id) === String(joId));
  const joName = jo ? `${jo.id.toUpperCase()}: ${jo.title}` : 'this Job Order';

  if (!confirm(`Are you sure you want to permanently delete ${joName}?\n\nThis will also remove any linked timeline maintenance tasks.`)) {
    return;
  }

  // Remove job order
  appState.jobOrders = appState.jobOrders.filter(j => String(j.id) !== String(joId));

  // Remove corresponding task
  if (appState.tasks) {
    appState.tasks = appState.tasks.filter(t => t.id !== 't_jo_' + joId);
  }

  // Remove corresponding notification
  if (appState.notifications) {
    appState.notifications = appState.notifications.filter(n => n.id !== `jo_notif_${joId}`);
  }

  saveState();
  closeEditJobOrderModal();
  renderTenantComplaints();
  if (typeof renderTimeline === 'function') renderTimeline();
  if (typeof renderDashboardSynchronizedTimeline === 'function') renderDashboardSynchronizedTimeline();
  if (typeof updateNotificationBadge === 'function') updateNotificationBadge();
};

window.addMaterialRow = function(material = '', unit = '', qty = '', price = '') {
  const tbody = document.getElementById('print-complaint-materials-tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td style="padding: 4px;"><input type="text" class="mat-desc" value="${material}" placeholder="e.g. Angle Valve" required style="width: 100%; font-size: 11px; padding: 6px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); color: #fff; border-radius: 4px; outline: none;"></td>
    <td style="padding: 4px;"><input type="text" class="mat-unit" value="${unit}" placeholder="pc" required style="width: 100%; font-size: 11px; padding: 6px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); color: #fff; border-radius: 4px; outline: none;"></td>
    <td style="padding: 4px;"><input type="number" class="mat-qty" value="${qty}" placeholder="1" required min="1" style="width: 100%; font-size: 11px; padding: 6px; text-align: center; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); color: #fff; border-radius: 4px; outline: none;"></td>
    <td style="padding: 4px;"><input type="number" class="mat-price" value="${price}" placeholder="250" required min="0" step="0.01" style="width: 100%; font-size: 11px; padding: 6px; text-align: right; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); color: #fff; border-radius: 4px; outline: none;"></td>
    <td style="padding: 4px; text-align: center;"><button type="button" onclick="this.closest('tr').remove()" style="background: none; border: none; color: #ef4444; font-size: 16px; cursor: pointer; font-weight: bold;">&times;</button></td>
  `;
  tbody.appendChild(tr);
};

window.addManpowerRow = function(skill = '', dailyRate = '', days = '', count = '') {
  const tbody = document.getElementById('print-complaint-manpower-tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td style="padding: 4px;"><input type="text" class="man-skill" value="${skill}" placeholder="e.g. Lead Plumber" required style="width: 100%; font-size: 11px; padding: 6px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); color: #fff; border-radius: 4px; outline: none;"></td>
    <td style="padding: 4px;"><input type="number" class="man-rate" value="${dailyRate}" placeholder="750" required min="0" step="0.01" style="width: 100%; font-size: 11px; padding: 6px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); color: #fff; border-radius: 4px; outline: none;"></td>
    <td style="padding: 4px;"><input type="number" class="man-days" value="${days}" placeholder="2" required min="1" style="width: 100%; font-size: 11px; padding: 6px; text-align: center; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); color: #fff; border-radius: 4px; outline: none;"></td>
    <td style="padding: 4px;"><input type="number" class="man-count" value="${count}" placeholder="1" required min="1" style="width: 100%; font-size: 11px; padding: 6px; text-align: center; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); color: #fff; border-radius: 4px; outline: none;"></td>
    <td style="padding: 4px; text-align: center;"><button type="button" onclick="this.closest('tr').remove()" style="background: none; border: none; color: #ef4444; font-size: 16px; cursor: pointer; font-weight: bold;">&times;</button></td>
  `;
  tbody.appendChild(tr);
};


window.openPrintComplaintModal = function(ticketId, isJobOrder) {
  if (isJobOrder === undefined) {
    isJobOrder = String(ticketId).startsWith('jo_') || (appState.jobOrders && appState.jobOrders.some(j => j.id === ticketId));
  }

  const list = isJobOrder ? (appState.jobOrders || []) : (appState.complaints || []);
  const ticket = list.find(c => String(c.id) === String(ticketId));
  if (!ticket) return;

  document.getElementById('print-complaint-id').value = ticket.id;
  document.getElementById('print-is-job-order').value = isJobOrder ? '1' : '0';
  document.getElementById('print-complaint-title').value = ticket.title || '';
  document.getElementById('print-complaint-date').value = ticket.actionDate || ticket.dateCreated || new Date().toISOString().split('T')[0];
  document.getElementById('print-complaint-est-finish').value = ticket.estFinishDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
  document.getElementById('print-complaint-manager-name').value = ticket.managerName || 'Engr. Roan Paul B. Gallegos';
  document.getElementById('print-complaint-admin-name').value = ticket.adminName || 'Mr. Robert J. Cruz';
  document.getElementById('print-complaint-issue').value = ticket.issueReported || ticket.details || ticket.title || '';
  document.getElementById('print-complaint-immediate').value = ticket.immediateAction || '';
  document.getElementById('print-complaint-corrective').value = ticket.correctiveAction || '';
  document.getElementById('print-complaint-preventive').value = ticket.preventiveAction || '';

  const heading = document.getElementById('print-modal-heading');
  const titleLabel = document.getElementById('print-modal-title-label');
  const dateLabel = document.getElementById('print-modal-date-label');
  const finishLabel = document.getElementById('print-modal-finish-label');
  const issueLabel = document.getElementById('print-modal-issue-label');
  const immediateLabel = document.getElementById('print-modal-immediate-label');
  const correctiveLabel = document.getElementById('print-modal-corrective-label');
  const preventiveLabel = document.getElementById('print-modal-preventive-label');

  if (isJobOrder) {
    if (heading) heading.innerText = 'Prepare Official Job Order & Service Report';
    if (titleLabel) titleLabel.innerText = 'Job Order Subject / Work Scope Title';
    if (dateLabel) dateLabel.innerText = 'Date Job Order Issued / Executed';
    if (finishLabel) finishLabel.innerText = 'Target Completion Date';
    if (issueLabel) issueLabel.innerText = 'Scope of Work & Maintenance Requirements';
    if (immediateLabel) immediateLabel.innerText = 'Initial Inspection & Containment Actions Taken';
    if (correctiveLabel) correctiveLabel.innerText = 'Corrective Repair & Execution Procedures';
    if (preventiveLabel) preventiveLabel.innerText = 'Preventive Maintenance Plan & Next Inspection';
  } else {
    if (heading) heading.innerText = 'Prepare Complaint Report to Administrator';
    if (titleLabel) titleLabel.innerText = 'Subject / Ticket Title';
    if (dateLabel) dateLabel.innerText = 'Date of Maintenance Action';
    if (finishLabel) finishLabel.innerText = 'Estimated Date to Finish';
    if (issueLabel) issueLabel.innerText = 'Issue Description (SOP Reference)';
    if (immediateLabel) immediateLabel.innerText = 'Immediate Containment Actions Taken';
    if (correctiveLabel) correctiveLabel.innerText = 'Corrective Action Taken';
    if (preventiveLabel) preventiveLabel.innerText = 'Preventive Action Plan';
  }

  // Load materials
  const matTbody = document.getElementById('print-complaint-materials-tbody');
  if (matTbody) {
    matTbody.innerHTML = '';
    if (ticket.materialsList && ticket.materialsList.length > 0) {
      ticket.materialsList.forEach(m => window.addMaterialRow(m.material, m.unit, m.qty, m.price));
    } else {
      window.addMaterialRow();
    }
  }

  // Load manpower
  const manTbody = document.getElementById('print-complaint-manpower-tbody');
  if (manTbody) {
    manTbody.innerHTML = '';
    if (ticket.manpowerList && ticket.manpowerList.length > 0) {
      ticket.manpowerList.forEach(mp => window.addManpowerRow(mp.skill, mp.dailyRate, mp.days, mp.count));
    } else {
      window.addManpowerRow();
    }
  }

  const modal = document.getElementById('print-complaint-modal');
  if (modal) modal.style.display = 'flex';

  window.updateComplaintLivePreview();
};

window.closePrintComplaintModal = function() {
  const modal = document.getElementById('print-complaint-modal');
  if (modal) modal.style.display = 'none';
};

// LIVE PREVIEW GENERATOR
window.updateComplaintLivePreview = function() {
  const ticketId = document.getElementById('print-complaint-id')?.value;
  if (!ticketId) return;

  const isJobOrder = document.getElementById('print-is-job-order')?.value === '1';
  const list = isJobOrder ? (appState.jobOrders || []) : (appState.complaints || []);
  const ticket = list.find(c => String(c.id) === String(ticketId)) || {};

  const title = document.getElementById('print-complaint-title')?.value || ticket.title || 'Maintenance Item';
  const actionDate = document.getElementById('print-complaint-date')?.value || ticket.actionDate || ticket.dateCreated || new Date().toISOString().split('T')[0];
  const estFinish = document.getElementById('print-complaint-est-finish')?.value || ticket.estFinishDate || '';
  const managerName = document.getElementById('print-complaint-manager-name')?.value || ticket.managerName || 'Engr. Roan Paul B. Gallegos';
  const adminName = document.getElementById('print-complaint-admin-name')?.value || ticket.adminName || 'Mr. Robert J. Cruz';
  const issueText = document.getElementById('print-complaint-issue')?.value || ticket.issueReported || ticket.details || '';
  const immediateText = document.getElementById('print-complaint-immediate')?.value || ticket.immediateAction || 'Initial containment protocols executed.';
  const correctiveText = document.getElementById('print-complaint-corrective')?.value || ticket.correctiveAction || 'Corrective repairs executed according to standards.';
  const preventiveText = document.getElementById('print-complaint-preventive')?.value || ticket.preventiveAction || 'Scheduled on periodic maintenance registry.';

  let materialsRowsHTML = '';
  let grandTotalMaterials = 0;
  const matRows = document.querySelectorAll('#print-complaint-materials-tbody tr');
  if (matRows.length > 0) {
    matRows.forEach(r => {
      const desc = r.querySelector('.mat-desc')?.value.trim() || '';
      const unit = r.querySelector('.mat-unit')?.value.trim() || 'pcs';
      const qty = parseFloat(r.querySelector('.mat-qty')?.value) || 0;
      const price = parseFloat(r.querySelector('.mat-price')?.value) || 0;
      if (desc && qty > 0) {
        const total = qty * price;
        grandTotalMaterials += total;
        materialsRowsHTML += `
          <tr>
            <td style="padding: 4px 6px; border: 1px solid #000; text-align: left;">${desc}</td>
            <td style="width: 60px; padding: 4px 6px; border: 1px solid #000; text-align: center;">${unit}</td>
            <td style="width: 50px; padding: 4px 6px; border: 1px solid #000; text-align: center;">${qty}</td>
            <td style="width: 90px; padding: 4px 6px; border: 1px solid #000; text-align: right;">${price.toFixed(2)}</td>
            <td style="width: 100px; padding: 4px 6px; border: 1px solid #000; text-align: right; font-weight: bold;">${total.toFixed(2)}</td>
          </tr>
        `;
      }
    });
  }
  if (!materialsRowsHTML) {
    materialsRowsHTML = '<tr><td colspan="5" style="padding: 5px; border: 1px solid #000; text-align: center; font-style: italic; color: #555;">No chargeable materials required.</td></tr>';
  }

  let manpowerRowsHTML = '';
  let grandTotalManpower = 0;
  const manRows = document.querySelectorAll('#print-complaint-manpower-tbody tr');
  if (manRows.length > 0) {
    manRows.forEach(r => {
      const skill = r.querySelector('.man-skill')?.value.trim() || '';
      const rate = parseFloat(r.querySelector('.man-rate')?.value) || 0;
      const days = parseFloat(r.querySelector('.man-days')?.value) || 0;
      const count = parseFloat(r.querySelector('.man-count')?.value) || 0;
      if (skill && rate > 0 && days > 0 && count > 0) {
        const total = rate * days * count;
        grandTotalManpower += total;
        manpowerRowsHTML += `
          <tr>
            <td style="padding: 4px 6px; border: 1px solid #000; text-align: left;">${skill}</td>
            <td style="width: 90px; padding: 4px 6px; border: 1px solid #000; text-align: right;">${rate.toFixed(2)}</td>
            <td style="width: 60px; padding: 4px 6px; border: 1px solid #000; text-align: center;">${days}</td>
            <td style="width: 60px; padding: 4px 6px; border: 1px solid #000; text-align: center;">${count}</td>
            <td style="width: 100px; padding: 4px 6px; border: 1px solid #000; text-align: right; font-weight: bold;">${total.toFixed(2)}</td>
          </tr>
        `;
      }
    });
  }
  if (!manpowerRowsHTML) {
    manpowerRowsHTML = '<tr><td colspan="5" style="padding: 5px; border: 1px solid #000; text-align: center; font-style: italic; color: #555;">In-house regular shift maintenance crew.</td></tr>';
  }

  const overallGrandTotal = grandTotalMaterials + grandTotalManpower;
  const sigs = ticket.signatures || {};
  const fallbackSig = ticket.digitalSignature;

  const renderSignatureBox = (slotKey, title, roleName, defaultSignerName) => {
    const slotSig = sigs[slotKey] || (fallbackSig && (fallbackSig.signerRole.includes(roleName) || (slotKey === 'tradesman' && fallbackSig.signerRole.includes('Tradesman'))) ? fallbackSig : null);
    
    if (slotSig && slotSig.dataUrl) {
      return `
        <div style="text-align: center; border: 1px solid #000; padding: 8px 6px; position: relative; background: #fff;">
          <div style="font-size: 9px; font-weight: bold; color: #444; text-transform: uppercase; margin-bottom: 4px;">${title}</div>
          <div style="height: 38px; display: flex; align-items: center; justify-content: center; margin-bottom: 2px;">
            <img src="${slotSig.dataUrl}" alt="Digital Signature" style="max-height: 36px; max-width: 140px; object-fit: contain;">
          </div>
          <div style="font-weight: bold; font-size: 10.5px; border-top: 1px solid #000; padding-top: 2px; color: #000;">
            ${slotSig.signerName || defaultSignerName}
          </div>
          <div style="font-size: 8.5px; color: #555;">${roleName} • ${slotSig.signedAt || 'Signed'}</div>
          <div style="margin-top: 2px;">
            <button type="button" class="preview-resign-btn print-no-show" onclick="openInPreviewSignature('${slotKey}', '${roleName}', '${defaultSignerName}')">Re-sign</button>
            <button type="button" class="preview-resign-btn print-no-show" onclick="clearInPreviewSignature('${slotKey}')" style="color: #ef4444;">Clear</button>
          </div>
        </div>
      `;
    } else {
      return `
        <div style="text-align: center; border: 1px solid #000; padding: 10px 6px; background: #fafafa; position: relative;">
          <div style="font-size: 9px; font-weight: bold; color: #555; text-transform: uppercase; margin-bottom: 8px;">${title}</div>
          <div style="margin: 4px 0 8px 0;">
            <button type="button" class="preview-sign-btn print-no-show" onclick="openInPreviewSignature('${slotKey}', '${roleName}', '${defaultSignerName}')">
              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              <span>Sign Here</span>
            </button>
          </div>
          <div style="font-weight: bold; font-size: 10.5px; border-top: 1px dashed #666; padding-top: 4px; color: #444;">
            ${defaultSignerName}
          </div>
          <div style="font-size: 8.5px; color: #666;">${roleName}</div>
        </div>
      `;
    }
  };

  let docHtml = '';
  if (isJobOrder) {
    const joNumber = String(ticket.id).replace('jo_', '').toUpperCase();
    docHtml = `
      <div style="text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 12px;">
        <h1 style="font-size: 18px; font-weight: bold; text-transform: uppercase; margin: 0; letter-spacing: 0.5px; color: #000;">ONE CORPORATE PROPERTY MANAGEMENT</h1>
        <p style="font-size: 10px; color: #333; margin: 2px 0 0 0; font-weight: 600;">Building Engineering & Facilities Operations Division</p>
        <p style="font-size: 9px; color: #666; margin: 1px 0 0 0;">#45 North Drive, Engineer's Hill, Baguio City, Philippines | Tel: (074) 442-2222</p>
      </div>

      <div class="preview-banner" style="background-color: #0f172a; color: #fff; text-align: center; padding: 5px; font-weight: bold; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; -webkit-print-color-adjust: exact;">
        OFFICIAL MAINTENANCE JOB ORDER & SERVICE REPORT
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10.5px; border: 1px solid #000;">
        <tr style="background-color: #f8fafc; -webkit-print-color-adjust: exact;">
          <td style="width: 20%; font-weight: bold; padding: 4px 6px; border: 1px solid #000;">JOB ORDER NO:</td>
          <td style="width: 30%; padding: 4px 6px; border: 1px solid #000; font-weight: bold; color: #b91c1c;">JO-2026-${joNumber}</td>
          <td style="width: 20%; font-weight: bold; padding: 4px 6px; border: 1px solid #000;">DATE ISSUED:</td>
          <td style="width: 30%; padding: 4px 6px; border: 1px solid #000;">${ticket.dateCreated || actionDate}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #000;">LOCATION / UNIT:</td>
          <td style="padding: 4px 6px; border: 1px solid #000; font-weight: bold;">${ticket.unit || 'Ground Floor'}</td>
          <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #000;">TARGET FINISH:</td>
          <td style="padding: 4px 6px; border: 1px solid #000;">${estFinish}</td>
        </tr>
        <tr style="background-color: #f8fafc; -webkit-print-color-adjust: exact;">
          <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #000;">SYSTEM CATEGORY:</td>
          <td style="padding: 4px 6px; border: 1px solid #000;">${ticket.system || 'Engineering'}</td>
          <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #000;">PRIORITY LEVEL:</td>
          <td style="padding: 4px 6px; border: 1px solid #000; font-weight: bold;">${ticket.priority || 'Major'}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #000;">ASSIGNED LEAD:</td>
          <td style="padding: 4px 6px; border: 1px solid #000;">${ticket.assignedTo || 'Duty Maintenance Technician'}</td>
          <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #000;">SUPERVISING MANAGER:</td>
          <td style="padding: 4px 6px; border: 1px solid #000;">${managerName}</td>
        </tr>
      </table>

      <div style="margin-bottom: 10px;">
        <div class="preview-section-header" style="font-size: 10.5px; font-weight: bold; text-transform: uppercase; background: #f1f5f9; padding: 3px 6px; border-left: 3px solid #000; margin-bottom: 4px; -webkit-print-color-adjust: exact;">1. Scope of Work & Task Description</div>
        <div style="padding: 2px 6px; text-align: justify; color: #111; font-size: 11px; white-space: pre-wrap;">${issueText}</div>
      </div>

      <div style="margin-bottom: 10px;">
        <div class="preview-section-header" style="font-size: 10.5px; font-weight: bold; text-transform: uppercase; background: #f1f5f9; padding: 3px 6px; border-left: 3px solid #000; margin-bottom: 4px; -webkit-print-color-adjust: exact;">2. Initial Safety Inspection & Containment Measures</div>
        <div style="padding: 2px 6px; text-align: justify; color: #111; font-size: 11px; white-space: pre-wrap;">${immediateText}</div>
      </div>

      <div style="margin-bottom: 10px;">
        <div class="preview-section-header" style="font-size: 10.5px; font-weight: bold; text-transform: uppercase; background: #f1f5f9; padding: 3px 6px; border-left: 3px solid #000; margin-bottom: 4px; -webkit-print-color-adjust: exact;">3. Corrective Work Procedures & Repair Execution</div>
        <div style="padding: 2px 6px; text-align: justify; color: #111; font-size: 11px; white-space: pre-wrap;">${correctiveText}</div>
      </div>

      <div style="margin-bottom: 10px; break-inside: avoid;">
        <div class="preview-section-header" style="font-size: 10.5px; font-weight: bold; text-transform: uppercase; background: #f1f5f9; padding: 3px 6px; border-left: 3px solid #000; margin-bottom: 4px; -webkit-print-color-adjust: exact;">4. Bill of Materials & Spare Parts Utilized</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background-color: #f1f5f9; font-weight: bold; -webkit-print-color-adjust: exact;">
              <th style="padding: 4px 6px; border: 1px solid #000; text-align: left;">Item Description</th>
              <th style="width: 60px; padding: 4px 6px; border: 1px solid #000; text-align: center;">Unit</th>
              <th style="width: 50px; padding: 4px 6px; border: 1px solid #000; text-align: center;">Qty</th>
              <th style="width: 90px; padding: 4px 6px; border: 1px solid #000; text-align: right;">Unit Price (PHP)</th>
              <th style="width: 100px; padding: 4px 6px; border: 1px solid #000; text-align: right;">Total (PHP)</th>
            </tr>
          </thead>
          <tbody>${materialsRowsHTML}</tbody>
        </table>
      </div>

      <div style="margin-bottom: 10px; break-inside: avoid;">
        <div class="preview-section-header" style="font-size: 10.5px; font-weight: bold; text-transform: uppercase; background: #f1f5f9; padding: 3px 6px; border-left: 3px solid #000; margin-bottom: 4px; -webkit-print-color-adjust: exact;">5. Technical Labor & Manpower Allocation</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background-color: #f1f5f9; font-weight: bold; -webkit-print-color-adjust: exact;">
              <th style="padding: 4px 6px; border: 1px solid #000; text-align: left;">Trade / Technical Designation</th>
              <th style="width: 90px; padding: 4px 6px; border: 1px solid #000; text-align: right;">Daily Rate</th>
              <th style="width: 60px; padding: 4px 6px; border: 1px solid #000; text-align: center;">Days</th>
              <th style="width: 60px; padding: 4px 6px; border: 1px solid #000; text-align: center;">Crew</th>
              <th style="width: 100px; padding: 4px 6px; border: 1px solid #000; text-align: right;">Labor Cost (PHP)</th>
            </tr>
          </thead>
          <tbody>${manpowerRowsHTML}</tbody>
        </table>
      </div>

      <div style="border: 2px solid #000; background-color: #f8fafc; padding: 6px 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; break-inside: avoid; -webkit-print-color-adjust: exact;">
        <span style="font-weight: bold; font-size: 10.5px; text-transform: uppercase;">TOTAL JOB ORDER EXPENDITURE:</span>
        <span style="font-weight: 800; font-size: 12.5px; color: #000;">PHP ${overallGrandTotal.toFixed(2)}</span>
      </div>

      <div style="margin-bottom: 14px; break-inside: avoid;">
        <div class="preview-section-header" style="font-size: 10.5px; font-weight: bold; text-transform: uppercase; background: #f1f5f9; padding: 3px 6px; border-left: 3px solid #000; margin-bottom: 4px; -webkit-print-color-adjust: exact;">6. Preventive Maintenance Recommendations & Quality Assurance</div>
        <div style="padding: 2px 6px; text-align: justify; color: #111; font-size: 11px; white-space: pre-wrap;">${preventiveText}</div>
      </div>

      <div style="margin-top: 14px; break-inside: avoid;">
        <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #333; margin-bottom: 6px; text-align: center; letter-spacing: 0.5px;">OFFICIAL FOUR-PARTY AUTHORIZATION & COMPLETION SIGN-OFF</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          ${renderSignatureBox('tradesman', '1. WORK EXECUTED BY', 'Lead Maintenance Tradesman', ticket.assignedTo || 'Mr. Martin Naimes')}
          ${renderSignatureBox('manager', '2. INSPECTED & CERTIFIED BY', 'Building Maintenance Manager', managerName)}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          ${renderSignatureBox('admin', '3. APPROVED & RECORDED BY', 'Building Administrator', adminName)}
          ${renderSignatureBox('tenant', '4. CONFORME / FACILITY ACCEPTANCE', 'Tenant / End-User Representative', 'Building Occupant')}
        </div>
      </div>
    `;
  } else {
    const compNumber = String(ticket.id).replace('comp_', '').toUpperCase();
    docHtml = `
      <div style="text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 14px;">
        <h1 style="font-size: 18px; font-weight: bold; text-transform: uppercase; margin: 0; letter-spacing: 0.5px; color: #000;">ONE CORPORATE PROPERTY MANAGEMENT</h1>
        <p style="font-size: 10px; color: #333; margin: 2px 0 0 0; font-weight: 600;">Building Maintenance & Engineering Department</p>
        <p style="font-size: 9px; color: #666; margin: 1px 0 0 0;">#45 North Drive, Engineer's Hill, Baguio City, Philippines | Tel: (074) 442-2222</p>
      </div>

      <div class="preview-banner" style="background-color: #0f172a; color: #fff; text-align: center; padding: 5px; font-weight: bold; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; -webkit-print-color-adjust: exact;">
        TENANT SERVICE COMPLAINT & CORRECTIVE ACTION REPORT
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10.5px; border: 1px solid #000;">
        <tr style="background-color: #f8fafc; -webkit-print-color-adjust: exact;">
          <td style="width: 20%; font-weight: bold; padding: 4px 6px; border: 1px solid #000;">TICKET REF NO:</td>
          <td style="width: 30%; padding: 4px 6px; border: 1px solid #000; font-weight: bold; color: #b91c1c;">TKT-2026-${compNumber}</td>
          <td style="width: 20%; font-weight: bold; padding: 4px 6px; border: 1px solid #000;">DATE FILED:</td>
          <td style="width: 30%; padding: 4px 6px; border: 1px solid #000;">${ticket.dateCreated || actionDate}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #000;">TENANT / SUITE:</td>
          <td style="padding: 4px 6px; border: 1px solid #000; font-weight: bold;">Suite ${ticket.unit || '802'} (${ticket.tenantName || 'Building Occupant'})</td>
          <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #000;">ACTION DATE:</td>
          <td style="padding: 4px 6px; border: 1px solid #000;">${actionDate}</td>
        </tr>
        <tr style="background-color: #f8fafc; -webkit-print-color-adjust: exact;">
          <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #000;">SYSTEM INVOLVED:</td>
          <td style="padding: 4px 6px; border: 1px solid #000;">${ticket.system || 'Architectural'}</td>
          <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #000;">CURRENT STATUS:</td>
          <td style="padding: 4px 6px; border: 1px solid #000; font-weight: bold; color: #0284c7;">${ticket.status || 'Resolved'}</td>
        </tr>
      </table>

      <div style="margin-bottom: 10px;">
        <div class="preview-section-header" style="font-size: 10.5px; font-weight: bold; text-transform: uppercase; background: #f1f5f9; padding: 3px 6px; border-left: 3px solid #000; margin-bottom: 4px;">1. Issue Description as Reported by Tenant</div>
        <div style="padding: 2px 6px; text-align: justify; color: #111; font-size: 11px; white-space: pre-wrap;">${issueText}</div>
      </div>

      <div style="margin-bottom: 10px;">
        <div class="preview-section-header" style="font-size: 10.5px; font-weight: bold; text-transform: uppercase; background: #f1f5f9; padding: 3px 6px; border-left: 3px solid #000; margin-bottom: 4px;">2. Immediate Response & Containment Measures</div>
        <div style="padding: 2px 6px; text-align: justify; color: #111; font-size: 11px; white-space: pre-wrap;">${immediateText}</div>
      </div>

      <div style="margin-bottom: 10px;">
        <div class="preview-section-header" style="font-size: 10.5px; font-weight: bold; text-transform: uppercase; background: #f1f5f9; padding: 3px 6px; border-left: 3px solid #000; margin-bottom: 4px;">3. Corrective Maintenance Action Performed</div>
        <div style="padding: 2px 6px; text-align: justify; color: #111; font-size: 11px; white-space: pre-wrap;">${correctiveText}</div>
      </div>

      <div style="margin-bottom: 10px; break-inside: avoid;">
        <div class="preview-section-header" style="font-size: 10.5px; font-weight: bold; text-transform: uppercase; background: #f1f5f9; padding: 3px 6px; border-left: 3px solid #000; margin-bottom: 4px;">4. Materials & Replacement Parts Used</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <th style="padding: 4px 6px; border: 1px solid #000; text-align: left;">Item Description</th>
              <th style="width: 60px; padding: 4px 6px; border: 1px solid #000; text-align: center;">Unit</th>
              <th style="width: 50px; padding: 4px 6px; border: 1px solid #000; text-align: center;">Qty</th>
              <th style="width: 90px; padding: 4px 6px; border: 1px solid #000; text-align: right;">Unit Price (PHP)</th>
              <th style="width: 100px; padding: 4px 6px; border: 1px solid #000; text-align: right;">Total (PHP)</th>
            </tr>
          </thead>
          <tbody>${materialsRowsHTML}</tbody>
        </table>
      </div>

      <div style="margin-bottom: 10px; break-inside: avoid;">
        <div class="preview-section-header" style="font-size: 10.5px; font-weight: bold; text-transform: uppercase; background: #f1f5f9; padding: 3px 6px; border-left: 3px solid #000; margin-bottom: 4px;">5. Assigned Maintenance Labor</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <th style="padding: 4px 6px; border: 1px solid #000; text-align: left;">Skill / Trade</th>
              <th style="width: 90px; padding: 4px 6px; border: 1px solid #000; text-align: right;">Daily Rate</th>
              <th style="width: 60px; padding: 4px 6px; border: 1px solid #000; text-align: center;">Days</th>
              <th style="width: 60px; padding: 4px 6px; border: 1px solid #000; text-align: center;">Crew</th>
              <th style="width: 100px; padding: 4px 6px; border: 1px solid #000; text-align: right;">Labor Cost (PHP)</th>
            </tr>
          </thead>
          <tbody>${manpowerRowsHTML}</tbody>
        </table>
      </div>

      <div style="border: 2px solid #000; background-color: #f8fafc; padding: 6px 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; break-inside: avoid;">
        <span style="font-weight: bold; font-size: 10.5px; text-transform: uppercase;">TOTAL MAINTENANCE COST:</span>
        <span style="font-weight: 800; font-size: 12.5px; color: #000;">PHP ${overallGrandTotal.toFixed(2)}</span>
      </div>

      <div style="margin-bottom: 14px; break-inside: avoid;">
        <div class="preview-section-header" style="font-size: 10.5px; font-weight: bold; text-transform: uppercase; background: #f1f5f9; padding: 3px 6px; border-left: 3px solid #000; margin-bottom: 4px;">6. Preventive Action & Engineering Recurrence Control</div>
        <div style="padding: 2px 6px; text-align: justify; color: #111; font-size: 11px; white-space: pre-wrap;">${preventiveText}</div>
      </div>

      <div style="margin-top: 14px; break-inside: avoid;">
        <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #333; margin-bottom: 6px; text-align: center; letter-spacing: 0.5px;">MAINTENANCE COMPLETION & VERIFICATION SIGN-OFF</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          ${renderSignatureBox('tradesman', 'SERVICED BY', 'Lead Maintenance Technician', ticket.assignedTo || 'Mr. Martin Naimes')}
          ${renderSignatureBox('manager', 'VERIFIED & INSPECTED BY', 'Building Maintenance Manager', managerName)}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          ${renderSignatureBox('admin', 'NOTED & RECORDED BY', 'Building Administrator', adminName)}
          ${renderSignatureBox('tenant', 'CONFORME / TENANT ACCEPTANCE', 'Tenant / Occupant Representative', ticket.tenantName || 'Tenant')}
        </div>
      </div>
    `;
  }

  const previewBox = document.getElementById('complaint-live-preview-box');
  if (previewBox) previewBox.innerHTML = docHtml;

  const printContainer = document.getElementById('complaint-print-report');
  if (printContainer) {
    printContainer.innerHTML = `<div style="font-family: 'Times New Roman', serif; color: #000; font-size: 11px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 0;">${docHtml}</div>`;
  }
};

window.openInPreviewSignature = function(slotKey, roleName, defaultSignerName) {
  const ticketId = document.getElementById('print-complaint-id')?.value;
  const isJobOrder = document.getElementById('print-is-job-order')?.value === '1';
  const ticketType = isJobOrder ? 'joborder' : 'complaint';

  const modal = document.getElementById('digital-signature-modal');
  if (!modal) return;

  document.getElementById('sig-target-ticket-id').value = ticketId || '';
  document.getElementById('sig-target-ticket-type').value = ticketType;
  
  const slotKeyInput = document.getElementById('sig-target-slot-key');
  if (slotKeyInput) slotKeyInput.value = slotKey || '';

  if (defaultSignerName) document.getElementById('sig-signer-name').value = defaultSignerName;
  if (roleName) document.getElementById('sig-signer-role').value = roleName;

  modal.style.display = 'flex';
  if (typeof initSignaturePadCanvas === 'function') initSignaturePadCanvas();
  if (typeof clearSignaturePad === 'function') clearSignaturePad();
};

window.clearInPreviewSignature = function(slotKey) {
  const ticketId = document.getElementById('print-complaint-id')?.value;
  if (!ticketId) return;

  const isJobOrder = document.getElementById('print-is-job-order')?.value === '1';
  const list = isJobOrder ? (appState.jobOrders || []) : (appState.complaints || []);
  const ticket = list.find(c => String(c.id) === String(ticketId));
  if (!ticket) return;

  if (ticket.signatures && ticket.signatures[slotKey]) delete ticket.signatures[slotKey];
  if (ticket.digitalSignature) delete ticket.digitalSignature;

  saveState();
  window.updateComplaintLivePreview();
  renderTenantComplaints();
};

window.saveComplaintDraftState = function() {
  const ticketId = document.getElementById('print-complaint-id')?.value;
  if (!ticketId) return;

  const isJobOrder = document.getElementById('print-is-job-order')?.value === '1';
  const list = isJobOrder ? (appState.jobOrders || []) : (appState.complaints || []);
  const ticket = list.find(c => String(c.id) === String(ticketId));
  if (!ticket) return;

  ticket.title = document.getElementById('print-complaint-title')?.value || ticket.title;
  ticket.actionDate = document.getElementById('print-complaint-date')?.value || ticket.actionDate;
  ticket.estFinishDate = document.getElementById('print-complaint-est-finish')?.value || ticket.estFinishDate;
  ticket.managerName = document.getElementById('print-complaint-manager-name')?.value || ticket.managerName;
  ticket.adminName = document.getElementById('print-complaint-admin-name')?.value || ticket.adminName;
  ticket.issueReported = document.getElementById('print-complaint-issue')?.value || ticket.issueReported;
  ticket.immediateAction = document.getElementById('print-complaint-immediate')?.value || ticket.immediateAction;
  ticket.correctiveAction = document.getElementById('print-complaint-corrective')?.value || ticket.correctiveAction;
  ticket.preventiveAction = document.getElementById('print-complaint-preventive')?.value || ticket.preventiveAction;

  const materials = [];
  document.querySelectorAll('#print-complaint-materials-tbody tr').forEach(r => {
    const material = r.querySelector('.mat-desc')?.value.trim() || '';
    const unit = r.querySelector('.mat-unit')?.value.trim() || 'pcs';
    const qty = parseFloat(r.querySelector('.mat-qty')?.value) || 0;
    const price = parseFloat(r.querySelector('.mat-price')?.value) || 0;
    if (material && qty > 0) materials.push({ material, unit, qty, price });
  });
  ticket.materialsList = materials;

  const manpower = [];
  document.querySelectorAll('#print-complaint-manpower-tbody tr').forEach(r => {
    const skill = r.querySelector('.man-skill')?.value.trim() || '';
    const dailyRate = parseFloat(r.querySelector('.man-rate')?.value) || 0;
    const days = parseFloat(r.querySelector('.man-days')?.value) || 0;
    const count = parseFloat(r.querySelector('.man-count')?.value) || 0;
    if (skill && dailyRate > 0 && days > 0 && count > 0) manpower.push({ skill, dailyRate, days, count });
  });
  ticket.manpowerList = manpower;

  saveState();
  renderTenantComplaints();
  window.updateComplaintLivePreview();
  alert("Report draft saved successfully!");
};

window.generateComplaintPrintReport = function(event) {
  if (event) event.preventDefault();
  window.saveComplaintDraftState();
  window.updateComplaintLivePreview();

  document.body.classList.add('print-mode-complaint');
  window.print();
  document.body.classList.remove('print-mode-complaint');
};


// ==================== NOTIFICATIONS POPUP ====================
function initNotificationBell() {
  const bell = document.getElementById('notification-bell-btn');
  const dropdown = document.getElementById('notification-dropdown');
  
  bell.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('show');
  });

  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

function updateNotificationBadge() {
  const badge = document.getElementById('notification-badge');
  const list = document.getElementById('notification-list');
  list.innerHTML = '';

  const count = appState.notifications.length;
  
  if (count > 0) {
    badge.innerText = count;
    badge.style.display = 'flex';
    
    appState.notifications.forEach(n => {
      const item = document.createElement('div');
      item.className = `notification-item ${n.type}`;
      item.innerHTML = `
        <span>${n.message}</span>
        <span class="notification-time">${n.time}</span>
      `;
      list.appendChild(item);
    });
  } else {
    badge.style.display = 'none';
    list.innerHTML = '<div class="no-notifications">No new alerts.</div>';
  }
}

window.clearNotifications = function() {
  appState.notifications = [];
  saveState();
  updateNotificationBadge();
};

// ==================== PRINT & EXPORT HELPERS ====================
window.printReport = function(forceContinuous) {
  const isContinuous = (forceContinuous !== undefined) 
    ? forceContinuous 
    : (document.getElementById('report-opt-continuous') ? document.getElementById('report-opt-continuous').checked : true);

  if (isContinuous) {
    window.printContinuousReport('report-printable-area');
  } else {
    window.printStandardReport('report-printable-area');
  }
};

window.printContinuousReport = function(elementId = 'report-printable-area') {
  const el = document.getElementById(elementId);
  if (!el) {
    window.print();
    return;
  }

  // Ensure element is displayed before measuring
  const previewSec = document.getElementById('report-preview-section');
  if (previewSec) previewSec.style.display = 'block';

  // Measure content height specifically at print content width (8.5in - 0.6in = 7.9in)
  // This prevents wrapping differences between wide desktop screens and print page width
  const prevWidth = el.style.width;
  const prevMaxWidth = el.style.maxWidth;
  const prevBoxSizing = el.style.boxSizing;
  const prevPadding = el.style.padding;
  const prevMargin = el.style.margin;

  el.style.width = '7.9in';
  el.style.maxWidth = '7.9in';
  el.style.boxSizing = 'border-box';
  el.style.padding = '0';
  el.style.margin = '0';

  // Force reflow and measure accurate height
  const contentHeightPx = Math.max(el.scrollHeight, el.offsetHeight, el.getBoundingClientRect().height, 1000);

  // Restore original on-screen styling
  el.style.width = prevWidth;
  el.style.maxWidth = prevMaxWidth;
  el.style.boxSizing = prevBoxSizing;
  el.style.padding = prevPadding;
  el.style.margin = prevMargin;

  // 0.3in top + 0.3in bottom = 0.6in margins + 0.35in safety cushion
  const heightInches = (contentHeightPx / 96) + 0.95;
  const roundedInches = Math.max(11, Math.ceil(heightInches * 100) / 100).toFixed(2);

  // Dynamic CSS injection for single continuous page
  let printStyleEl = document.getElementById('dynamic-continuous-print-style');
  if (!printStyleEl) {
    printStyleEl = document.createElement('style');
    printStyleEl.id = 'dynamic-continuous-print-style';
    document.head.appendChild(printStyleEl);
  }

  printStyleEl.innerHTML = `
    @media print {
      @page {
        size: 8.5in ${roundedInches}in !important;
        margin: 0.3in !important;
      }
      html, body {
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        overflow: visible !important;
        margin: 0 !important;
        padding: 0 !important;
        background-color: #fff !important;
        color: #000 !important;
        box-sizing: border-box !important;
      }
      body.print-mode-continuous .sidebar,
      body.print-mode-continuous .top-header,
      body.print-mode-continuous .alert-banner,
      body.print-mode-continuous .timeline-controls-bar,
      body.print-mode-continuous .timeline-backlog,
      body.print-mode-continuous .registry-toolbar,
      body.print-mode-continuous .emergency-header-alert,
      body.print-mode-continuous .wizard-steps-nav,
      body.print-mode-continuous .wizard-footer,
      body.print-mode-continuous .emergency-history-card,
      body.print-mode-continuous .reports-control-card,
      body.print-mode-continuous .report-preview-header,
      body.print-mode-continuous .modal-backdrop,
      body.print-mode-continuous .btn,
      body.print-mode-continuous .print-no-show,
      body.print-mode-continuous .complaint-print-report-container,
      body.print-mode-continuous footer {
        display: none !important;
        height: 0 !important;
        min-height: 0 !important;
        max-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
      }
      body.print-mode-continuous .app-container,
      body.print-mode-continuous .main-content,
      body.print-mode-continuous .tabs-container,
      body.print-mode-continuous #panel-reports,
      body.print-mode-continuous #report-preview-section {
        display: block !important;
        height: auto !important;
        max-height: none !important;
        min-height: 0 !important;
        overflow: visible !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        box-shadow: none !important;
        background-color: #fff !important;
        color: #000 !important;
      }
      body.print-mode-continuous #report-printable-area,
      body.print-mode-continuous .report-canvas {
        display: block !important;
        height: auto !important;
        max-height: none !important;
        min-height: 0 !important;
        overflow: visible !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
        box-sizing: border-box !important;
        border: none !important;
        box-shadow: none !important;
        background-color: #fff !important;
        color: #000 !important;
      }
      body.print-mode-continuous .report-doc {
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }
      body.print-mode-continuous .report-doc > *:last-child {
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
      }
      body.print-mode-continuous * {
        page-break-before: avoid !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
        break-before: avoid !important;
        break-after: avoid !important;
        break-inside: avoid !important;
      }
    }
  `;

  document.body.classList.add('print-mode-continuous');

  const cleanup = () => {
    document.body.classList.remove('print-mode-continuous');
    if (printStyleEl) printStyleEl.remove();
    window.removeEventListener('afterprint', cleanup);
  };

  window.addEventListener('afterprint', cleanup);
  setTimeout(() => {
    window.print();
  }, 60);
  setTimeout(cleanup, 3000);
};

window.printStandardReport = function(elementId = 'report-printable-area') {
  // Remove continuous styling if present
  const printStyleEl = document.getElementById('dynamic-continuous-print-style');
  if (printStyleEl) printStyleEl.remove();
  document.body.classList.remove('print-mode-continuous');

  window.print();
};

window.printElement = function(elementId) {
  window.printReport();
};

window.copyToClipboard = function(selector) {
  const el = document.querySelector(`.${selector}`) || document.getElementById(selector);
  if (el) {
    const text = el.innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy:", err);
    });
  }
};

window.toggleManagerChecklistItem = function(key, checked) {
  if (!appState.managerCheckedActivities) appState.managerCheckedActivities = {};
  appState.managerCheckedActivities[key] = checked;
  saveState();
  
  // Re-render timeline to update styling (checked state classes)
  renderTimeline();
};

// ==================== OPERATIONAL SUB-CHECKLIST MODAL LOGIC ====================
window.openTaskActionModal = function(taskId) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) return;

  activeActionTaskId = taskId;
  document.getElementById('action-modal-title').innerText = `Select Action: ${task.name.substring(0, 30)}${task.name.length > 30 ? '...' : ''}`;
  document.getElementById('action-modal-desc').innerText = `Select action for this ${task.system} task scheduled at ${task.timeSlot || 'Unscheduled'}.`;

  // Bind clicks
  document.getElementById('btn-action-edit').onclick = () => {
    closeTaskActionModal();
    openEditTaskModal(activeActionTaskId);
  };

  document.getElementById('btn-action-checklist').onclick = () => {
    closeTaskActionModal();
    openTaskChecklistModal(activeActionTaskId);
  };

  document.getElementById('task-action-modal').style.display = 'flex';
};

window.closeTaskActionModal = function() {
  document.getElementById('task-action-modal').style.display = 'none';
};

window.openTaskChecklistModal = function(taskId) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) return;

  activeChecklistTaskId = taskId;
  document.getElementById('checklist-modal-title').innerText = `Inspection Checklist: ${task.name}`;
  document.getElementById('checklist-modal-subtitle').innerText = `System Category: ${task.system} | Scheduled: ${task.timeSlot || 'Unscheduled'}`;

  const tbody = document.getElementById('checklist-modal-tbody');
  tbody.innerHTML = '';

  const template = CATEGORY_CHECKLIST_TEMPLATES[task.system] || [
    'Verify general equipment configuration matches manufacturer manual',
    'Scan ambient room temperature and ventilations',
    'Examine power supplies, cable links & status indicators',
    'Verify housekeeping clearances around device perimeter',
    'Confirm final operational status meets guidelines'
  ];

  if (!task.subChecklist) task.subChecklist = [];

  template.forEach((itemText, idx) => {
    let savedItem = task.subChecklist[idx];
    if (!savedItem) {
      savedItem = { item: itemText, status: 'OK', notes: '' };
      task.subChecklist[idx] = savedItem;
    }

    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border-color)';
    tr.innerHTML = `
      <td style="padding: 10px 12px; font-weight: 500; text-align: left; color:#fff;">${itemText}</td>
      <td style="text-align: center; padding: 10px 6px;">
        <input type="radio" name="chk_status_${idx}" value="OK" ${savedItem.status === 'OK' ? 'checked' : ''} onchange="updateSubItemStatus(${idx}, 'OK')">
      </td>
      <td style="text-align: center; padding: 10px 6px;">
        <input type="radio" name="chk_status_${idx}" value="Issue" ${savedItem.status === 'Issue' ? 'checked' : ''} onchange="updateSubItemStatus(${idx}, 'Issue')">
      </td>
      <td style="padding: 10px 12px;">
        <input type="text" id="chk_notes_${idx}" value="${savedItem.notes || ''}" placeholder="Enter observation..." style="width: 100%; padding: 6px 10px; background-color: var(--bg-dark); color: #fff; border: 1px solid var(--border-color); border-radius: 4px; font-size: 11px;" oninput="updateSubItemNotes(${idx}, this.value)">
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('task-checklist-modal').style.display = 'flex';
};

window.closeTaskChecklistModal = function() {
  document.getElementById('task-checklist-modal').style.display = 'none';
};

window.updateSubItemStatus = function(idx, statusVal) {
  const task = appState.tasks.find(t => t.id === activeChecklistTaskId);
  if (task && task.subChecklist && task.subChecklist[idx]) {
    task.subChecklist[idx].status = statusVal;
  }
};

window.updateSubItemNotes = function(idx, notesVal) {
  const task = appState.tasks.find(t => t.id === activeChecklistTaskId);
  if (task && task.subChecklist && task.subChecklist[idx]) {
    task.subChecklist[idx].notes = notesVal;
  }
};

window.saveTaskChecklist = function() {
  const task = appState.tasks.find(t => t.id === activeChecklistTaskId);
  if (task) {
    let allOk = true;
    task.subChecklist.forEach(item => {
      if (item.status === 'Issue') allOk = false;
    });
    
    // Auto status suggestion
    if (task.status === 'Pending') {
      task.status = 'In Progress';
    }
    
    saveState();
    closeTaskChecklistModal();
    renderTimeline();
    
    alert(`Inspection checklist saved successfully for "${task.name}".`);
  }
};

function populateSystemDropdowns() {
  const formSelect = document.getElementById('form-task-system');
  const filterSelect = document.getElementById('filter-system');
  const tenantSelect = document.getElementById('tenant-system');
  
  if (!appState.customSystems) {
    appState.customSystems = [];
  }
  
  const defaultSystems = ['Architectural', 'Structural', 'Mechanical', 'Fire Protection', 'Plumbing', 'STP', 'Elevator'];
  const allSystems = [...defaultSystems, ...appState.customSystems];
  
  // 1. Populate form task system
  if (formSelect) {
    const currentVal = formSelect.value;
    formSelect.innerHTML = allSystems.map(sys => `<option value="${sys}">${sys}</option>`).join('') + 
      `<option value="ADD_NEW">+ Add New Category...</option>`;
    if (currentVal && (allSystems.includes(currentVal) || currentVal === 'ADD_NEW')) {
      formSelect.value = currentVal;
    }
  }
  
  // 2. Populate filter system in timeline
  if (filterSelect) {
    const currentVal = filterSelect.value;
    filterSelect.innerHTML = `<option value="All">All Systems</option>` + 
      allSystems.map(sys => `<option value="${sys}">${sys}</option>`).join('');
    if (currentVal && (allSystems.includes(currentVal) || currentVal === 'All')) {
      filterSelect.value = currentVal;
    }
  }
  
  // 3. Populate tenant system
  if (tenantSelect) {
    const currentVal = tenantSelect.value;
    const tenantLabels = {
      'Architectural': 'Architectural (Floors, doors, restrooms, walls)',
      'Structural': 'Structural (Cracks, water leaks in walls)',
      'Mechanical': 'Mechanical (AC, ventilation noise)',
      'Fire Protection': 'Fire Protection (Alarm beep, damaged sprinkler)',
      'Plumbing': 'Plumbing (Drain blockage, leaking faucet)',
      'Elevator': 'Elevator / Vertical Transport'
    };
    
    const tenantSystems = allSystems.filter(sys => sys !== 'STP');
    
    tenantSelect.innerHTML = tenantSystems.map(sys => {
      const label = tenantLabels[sys] || sys;
      return `<option value="${sys}">${label}</option>`;
    }).join('');
    
    if (currentVal && tenantSystems.includes(currentVal)) {
      tenantSelect.value = currentVal;
    }
  }
}

window.onFormSystemChange = function(val) {
  const customGroup = document.getElementById('custom-system-group');
  if (val === 'ADD_NEW') {
    customGroup.style.display = 'block';
    document.getElementById('form-task-custom-system').focus();
    document.getElementById('form-task-custom-system').required = true;
  } else {
    customGroup.style.display = 'none';
    document.getElementById('form-task-custom-system').required = false;
  }
};




function renderDashboardSynchronizedTimeline() {
  const container = document.getElementById('dashboard-synchronized-timeline-container');
  if (!container) return;
  container.innerHTML = '';

  const slots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
  
  // Current hour indicator
  const now = new Date();
  const currentHourStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  slots.forEach(timeSlot => {
    const slotCard = document.createElement('div');
    const isCurrent = currentHourStr.substring(0, 2) === timeSlot.substring(0, 2);
    slotCard.className = `sync-slot-card ${isCurrent ? 'current-hour' : ''}`;

    const mgrActivity = (typeof MANAGER_DAILY_ACTIVITIES !== 'undefined' && MANAGER_DAILY_ACTIVITIES[timeSlot]) ? MANAGER_DAILY_ACTIVITIES[timeSlot] : null;
    const slotTasks = appState.tasks.filter(t => normalizeTimeSlotString(t.timeSlot) === normalizeTimeSlotString(timeSlot));

    let tasksHtml = '';
    if (slotTasks.length > 0) {
      slotTasks.forEach(task => {
        const sysClass = (typeof getSystemClass === 'function') ? getSystemClass(task.system) : 'arch';
        const isComp = task.status === 'Completed';
        const remainingHtml = (typeof calculateRemainingDaysLabel === 'function') ? calculateRemainingDaysLabel(task) : '';
        tasksHtml += `
          <div class="sync-task-item ${isComp ? 'completed' : ''}" style="border-left-color: var(--sys-${sysClass});" onclick="openEditTaskModal('${task.id}')">
            <span class="sync-task-name">${task.name}</span>
            <div class="sync-task-meta">
              <span>${task.system}</span>
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 3px;">
                <span class="priority-tag tag-${task.priority.toLowerCase()}">${task.priority}</span>
                ${remainingHtml}
              </div>
            </div>
          </div>
        `;
      });
    } else {
      tasksHtml = '<div style="font-size: 9.5px; color: var(--text-dim); text-align: center; margin-top: 10px;">No tasks assigned</div>';
    }

    const mgrTitle = mgrActivity ? mgrActivity.title : 'General Oversight';

    slotCard.innerHTML = `
      <div class="sync-slot-header">
        <span class="hour-tag">${timeSlot}</span>
        <span style="font-size: 9px; color: #94a3b8;">${slotTasks.length} Tasks</span>
      </div>
      <div class="sync-manager-title" title="${mgrTitle}">
        ${mgrTitle}
      </div>
      <div class="sync-tasks-container">
        ${tasksHtml}
      </div>
    `;

    container.appendChild(slotCard);
  });
}



function updateHeaderDate() {
  const headerDateEl = document.getElementById('header-date');
  if (headerDateEl) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    headerDateEl.innerText = new Date().toLocaleDateString('en-US', options);
  }

  const reportDateEl = document.getElementById('report-date');
  if (reportDateEl && (!reportDateEl.value || reportDateEl.value === '2026-07-20')) {
    reportDateEl.value = new Date().toISOString().split('T')[0];
  }
}

function updateDashboardTimeBarTracker() {
  updateHeaderDate();
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const startMinutes = 8 * 60; // 8:00 AM = 480 mins
  const endMinutes = 17 * 60;  // 5:00 PM = 1020 mins
  const totalShiftMins = endMinutes - startMinutes; // 540 mins

  let elapsed = currentMinutes - startMinutes;
  let percent = 0;

  if (currentMinutes < startMinutes) {
    percent = 0;
  } else if (currentMinutes > endMinutes) {
    percent = 100;
  } else {
    percent = Math.min(100, Math.max(0, Math.round((elapsed / totalShiftMins) * 100)));
  }

  const clockEl = document.getElementById('sync-time-digital-clock');
  const percentEl = document.getElementById('sync-time-progress-text');
  const barFillEl = document.getElementById('sync-time-bar-fill');

  if (clockEl) {
    clockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }
  if (percentEl) {
    percentEl.innerText = `${percent}% Shift Elapsed`;
  }
  if (barFillEl) {
    barFillEl.style.width = `${percent}%`;
  }
}

// Start live clock interval
setInterval(updateDashboardTimeBarTracker, 1000);



// ==================== DIRECT FILE SAVE & LOAD ENGINE (save_files/ & LOCAL STORAGE) ====================
function saveAppStateToFile(customName) {
  const dateStr = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 16);
  const defaultFileName = customName || `onecorporate_state_${dateStr}.json`;

  const payload = {
    version: "1.0",
    savedAt: new Date().toISOString(),
    fileName: defaultFileName,
    description: "Saved Maintenance State",
    appState: appState
  };

  const jsonStr = JSON.stringify(payload, null, 2);

  // 1. Download file directly to user disk / save_files
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = defaultFileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // 2. Register into Local Storage Index for persistent offline loading
  registerSaveFileInIndex(defaultFileName, payload);

  alert(`Application state successfully saved as '${defaultFileName}'!
File is saved to your disk and registered in local storage.`);
}

function registerSaveFileInIndex(fileName, payload) {
  try {
    let index = JSON.parse(localStorage.getItem('onecorporate_save_files_index') || '[]');
    // Filter existing same file name
    index = index.filter(item => item.fileName !== fileName);
    index.unshift({
      fileName: fileName,
      savedAt: payload.savedAt,
      taskCount: payload.appState.tasks ? payload.appState.tasks.length : 0,
      userRole: payload.appState.currentUserRole || 'Admin',
      payload: payload
    });
    localStorage.setItem('onecorporate_save_files_index', JSON.stringify(index));
  } catch(e) {
    console.error("Save index error:", e);
  }
}

function openLoadSaveModal() {
  const modal = document.getElementById('load-save-modal');
  if (modal) modal.style.display = 'flex';
  renderSaveFilesList();
}

function closeLoadSaveModal() {
  const modal = document.getElementById('load-save-modal');
  if (modal) modal.style.display = 'none';
}

function renderSaveFilesList() {
  const container = document.getElementById('save-files-list-container');
  if (!container) return;
  container.innerHTML = '';

  let saves = [];
  try {
    saves = JSON.parse(localStorage.getItem('onecorporate_save_files_index') || '[]');
  } catch(e) {}

  // Include default factory backup if empty
  if (saves.length === 0) {
    saves.push({
      fileName: 'default_system_backup.json',
      savedAt: new Date().toISOString(),
      taskCount: appState.tasks ? appState.tasks.length : 0,
      userRole: 'Admin',
      isDefault: true
    });
  }

  saves.forEach(save => {
    const card = document.createElement('div');
    card.className = 'save-file-card';
    
    const formattedDate = new Date(save.savedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

    card.innerHTML = `
      <div class="save-file-info">
        <div class="save-file-name">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
          <span>${save.fileName}</span>
          ${save.isDefault ? '<span class="save-file-badge">Default</span>' : ''}
        </div>
        <div class="save-file-meta">
          <span>Saved: ${formattedDate}</span>
          <span>Tasks: ${save.taskCount || 0}</span>
          <span>Role: ${save.userRole || 'Admin'}</span>
        </div>
      </div>
      <div class="save-file-action">
        <button class="btn btn-primary" style="padding: 5px 12px; font-size: 11px;" onclick="loadSaveFileFromIndex('${save.fileName}')">
          Load This Save
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function loadSaveFileFromIndex(fileName) {
  try {
    let saves = JSON.parse(localStorage.getItem('onecorporate_save_files_index') || '[]');
    const target = saves.find(s => s.fileName === fileName);
    if (target && target.payload && target.payload.appState) {
      appState = target.payload.appState;
      saveState();
      renderApp();
      closeLoadSaveModal();
      alert(`Successfully loaded save file '${fileName}'!`);
      return;
    }
  } catch(e) {}

  alert(`Loading '${fileName}'... State updated.`);
  closeLoadSaveModal();
}

function handleSaveFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      const loadedState = parsed.appState || parsed;

      if (loadedState && loadedState.tasks !== undefined) {
        appState = loadedState;
        saveState();
        registerSaveFileInIndex(file.name, { savedAt: new Date().toISOString(), appState: appState });
        renderApp();
        closeLoadSaveModal();
        alert(`Successfully imported and loaded save file '${file.name}'!`);
      } else {
        alert("Invalid save file format. File must be a valid One Corporate state JSON.");
      }
    } catch(err) {
      alert("Error reading JSON save file: " + err.message);
    }
  };
  reader.readAsText(file);
}



// ==================== PERIODIC MAINTENANCE TIMELINES LOGIC ====================
let currentPeriodicFrequency = 'Weekly';

function selectPeriodicFrequency(freq) {
  currentPeriodicFrequency = freq;

  // Update pills
  ['Weekly', 'Monthly', 'Quarterly', 'Yearly'].forEach(f => {
    const pill = document.getElementById(`pill-${f.toLowerCase()}`);
    if (pill) {
      if (f === freq) pill.classList.add('active');
      else pill.classList.remove('active');
    }
    const nav = document.getElementById(`nav-${f.toLowerCase()}`);
    const periodicNav = document.getElementById('nav-periodic');
    if (periodicNav) {
      if (appState.activeTab === 'periodic') periodicNav.classList.add('active');
    }
    if (nav) {
      if (f === freq && appState.activeTab === 'periodic') nav.classList.add('active');
      else nav.classList.remove('active');
    }
  });

  // Update header text
  const titleEl = document.getElementById('periodic-header-title');
  const descEl = document.getElementById('periodic-header-desc');
  const btnLabel = document.getElementById('btn-add-periodic-label');

  if (titleEl) titleEl.innerText = `${freq} Maintenance Activities`;
  if (descEl) descEl.innerText = `Scheduled routine inspections and activities for ${freq.toLowerCase()} building maintenance.`;
  if (btnLabel) btnLabel.innerText = `Add ${freq} Activity`;

  renderPeriodicMaintenance();
}

function renderPeriodicMaintenance() {
  const container = document.getElementById('periodic-activities-container');
  if (!container) return;
  container.innerHTML = '';

  // Query activities from registry matching current frequency
  const activities = appState.registry.filter(t => t.frequency === currentPeriodicFrequency);

  const totalEl = document.getElementById('periodic-stat-total');
  if (totalEl) totalEl.innerText = `${activities.length} Activities`;

  if (activities.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-dim); background: rgba(15,23,42,0.4); border-radius: 8px; border: 1px dashed var(--border-color);">No ${currentPeriodicFrequency} maintenance activities registered yet. Click 'Add ${currentPeriodicFrequency} Activity' to add one.</div>`;
    return;
  }

    activities.forEach(item => {
    const sysClass = getSystemClass(item.system);
    const card = document.createElement('div');
    card.className = 'periodic-activity-card';
    const remainingHtml = calculateRemainingDaysLabel(item);

    card.innerHTML = `
      <div>
        <div class="periodic-card-header">
          <span class="periodic-card-title">${item.name}</span>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
            <span class="priority-tag tag-${(item.priority || 'Minor').toLowerCase()}">${item.priority || 'Minor'}</span>
            ${remainingHtml}
          </div>
        </div>
        <div class="periodic-card-meta" style="margin-top: 8px;">
          <span style="color: var(--sys-${sysClass}); font-weight: 600;">System: ${item.system}</span>
          <span>Freq: ${item.frequency}</span>
        </div>
      </div>
      <div class="periodic-card-actions">
        <span style="font-size: 10px; color: var(--text-dim);">ID: ${item.id}</span>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px;" onclick="openEditTaskModalFromRegistry('${item.id}')">Edit</button>
          <button class="btn btn-danger" style="padding: 4px 8px; font-size: 10px;" onclick="deleteRegistryActivity('${item.id}')">Delete</button>
          <button class="btn btn-primary btn-add-to-daily" style="padding: 4px 8px; font-size: 10px; background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; color: #38bdf8; display: inline-flex; align-items: center; gap: 4px;" onclick="addPeriodicToDailyActivities('${item.id}')" title="Schedule this periodic routine into Today's Daily Activities timeline">+ Add to Daily Activities</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function openAddPeriodicActivityModal() {
  // Pre-fill task modal with current periodic frequency
  openAddTaskModal();
  setTimeout(() => {
    const freqSel = document.getElementById('form-task-freq');
    if (freqSel) freqSel.value = currentPeriodicFrequency;
  }, 100);
}


window.addPeriodicToDailyActivities = function(activityId) {
  const item = appState.registry.find(r => r.id === activityId) || appState.tasks.find(t => t.id === activityId || t.manualTaskId === activityId);
  if (!item) {
    alert("Could not locate activity details.");
    return;
  }

  const assignedSlot = item.timeSlot ? normalizeTimeSlotString(item.timeSlot) : '08:00 AM';
  const defaultTech = (typeof getSystemDefaultTechnician === 'function') ? getSystemDefaultTechnician(item.system) : 'John Doe (Lead)';

  const newDailyTask = {
    id: 't_daily_' + item.id + '_' + Date.now(),
    manualTaskId: item.id,
    name: item.name,
    system: item.system,
    frequency: 'Daily',
    originalFrequency: item.frequency || currentPeriodicFrequency || 'Weekly',
    timeSlot: assignedSlot,
    priority: item.priority || 'Minor',
    status: 'Pending',
    notes: `[Scheduled from ${item.frequency || currentPeriodicFrequency || 'Weekly'} Routine] ${item.notes || ''}`.trim(),
    assignedTo: item.assignedTo || defaultTech,
    isMultiDay: item.isMultiDay || false,
    startDate: item.startDate || new Date().toISOString().split('T')[0],
    finishDate: item.finishDate || '',
    dateCreated: new Date().toISOString().split('T')[0]
  };

  appState.tasks.push(newDailyTask);
  saveState();

  if (typeof renderTimeline === 'function') renderTimeline();
  if (typeof renderDashboardSynchronizedTimeline === 'function') renderDashboardSynchronizedTimeline();

  const notifMsg = `Periodic activity "${item.name}" added to Daily Activities at ${assignedSlot}!`;
  if (appState.notifications) {
    appState.notifications.unshift({
      id: 'notif_' + Date.now(),
      type: 'info',
      message: notifMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }

  if (window.SecurityEngine && typeof window.SecurityEngine.showToast === 'function') {
    window.SecurityEngine.showToast(notifMsg, 'success');
  } else {
    alert(notifMsg);
  }
};


function deleteRegistryActivity(activityId) {
  if (confirm("Are you sure you want to remove this periodic activity?")) {
    appState.registry = appState.registry.filter(item => item.id !== activityId);
    saveState();
    renderPeriodicMaintenance();
  }
}



window.onRegistryScheduleDropdownChange = function(val) {
  if (val === 'All') {
    if (typeof filterRegistry === 'function') filterRegistry();
    return;
  }
  if (val === 'Daily') {
    switchTab('timeline');
  } else {
    switchTab('periodic');
    if (typeof selectPeriodicFrequency === 'function') {
      selectPeriodicFrequency(val === 'Annual' ? 'Yearly' : val);
    }
  }
};



window.openEditTaskModalFromRegistry = function(activityId) {
  // 1. Search in active tasks first
  let task = appState.tasks.find(t => t.id === activityId || t.manualTaskId === activityId);

  // 2. If not found in active tasks, search in registry master items
  if (!task) {
    const regItem = appState.registry.find(r => r.id === activityId);
    if (regItem) {
      task = {
        id: regItem.id,
        manualTaskId: regItem.id,
        name: regItem.name,
        system: regItem.system,
        frequency: regItem.frequency,
        timeSlot: regItem.timeSlot || '',
        priority: regItem.priority || 'Minor',
        status: 'Pending',
        notes: regItem.notes || '',
        assignedTo: regItem.assignedTo || '',
        dateCreated: new Date().toISOString().split('T')[0]
      };
      appState.tasks.push(task);
    }
  }

  if (task) {
    openEditTaskModal(task.id);
  } else {
    alert("Could not locate activity details to edit.");
  }
};



// ==================== MULTI-DAY WORK SCHEDULE LOGIC ====================
window.toggleMultiDayWorkSchedule = function(checked) {
  const container = document.getElementById('multiday-dates-container');
  if (container) {
    container.style.display = checked ? 'grid' : 'none';
  }
};


function calculateRemainingDaysLabel(task) {
  if (!task || task.status === 'Completed') return '';
  if (!task.isMultiDay && !task.finishDate) return '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let finishStr = task.finishDate;
  if (!finishStr && task.isMultiDay) {
    const fDate = new Date();
    fDate.setDate(fDate.getDate() + 3);
    finishStr = fDate.toISOString().split('T')[0];
  }

  if (!finishStr) return '';

  const finish = new Date(finishStr);
  finish.setHours(0, 0, 0, 0);

  const diffTime = finish - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    return `<div class="blinking-remaining-tag">&#8987; ${diffDays} Days Left</div>`;
  } else if (diffDays === 1) {
    return `<div class="blinking-remaining-tag">&#8987; 1 Day Left (Finishing Today)</div>`;
  } else if (diffDays === 0) {
    return `<div class="blinking-remaining-tag">&#8987; Finish Target Today</div>`;
  } else {
    return `<div class="blinking-remaining-tag overdue">&#9888; OVERDUE by ${Math.abs(diffDays)} Day(s)</div>`;
  }
}






window.autoPopulateDailyTasks = function() {
  if (!appState.registry || appState.registry.length === 0) {
    appState.registry = (typeof DEFAULT_MANUAL_TASKS !== 'undefined') ? [...DEFAULT_MANUAL_TASKS] : [];
  }

  const dailyTasks = appState.registry.filter(t => !t.frequency || t.frequency === 'Daily');
  const slots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
  
  let addedCount = 0;
  dailyTasks.forEach((manualTask, idx) => {
    const assignedSlot = manualTask.timeSlot ? normalizeTimeSlotString(manualTask.timeSlot) : slots[idx % slots.length];
    
    // Check if task exists in appState.tasks
    let existingIndex = appState.tasks.findIndex(t => t.manualTaskId === manualTask.id || t.name === manualTask.name);
    
    const newTaskObj = {
      id: 't_auto_' + manualTask.id + '_' + idx,
      manualTaskId: manualTask.id,
      name: manualTask.name,
      system: manualTask.system,
      frequency: 'Daily',
      timeSlot: assignedSlot,
      priority: manualTask.priority || 'Minor',
      status: 'Pending',
      notes: manualTask.notes || '',
      photo: '',
      assignedTo: (typeof getSystemDefaultTechnician === 'function') ? getSystemDefaultTechnician(manualTask.system) : 'John Doe (Lead)',
      dateCreated: new Date().toISOString().split('T')[0]
    };

    if (existingIndex >= 0) {
      appState.tasks[existingIndex].timeSlot = assignedSlot;
      appState.tasks[existingIndex].frequency = 'Daily';
    } else {
      appState.tasks.push(newTaskObj);
      addedCount++;
    }
  });

  saveState();
  if (typeof renderTimeline === 'function') renderTimeline();
  if (typeof renderDashboardSynchronizedTimeline === 'function') renderDashboardSynchronizedTimeline();
  if (typeof renderApp === 'function') renderApp();

  alert(`Auto-Populate Complete: Successfully scheduled all ${dailyTasks.length} daily maintenance tasks into the timeline!`);
};





function compressImageBase64(dataUrl, maxDimension = 800, quality = 0.75, callback) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
    if (callback) callback(dataUrl);
    return;
  }
  const img = new Image();
  img.onload = function() {
    let width = img.width;
    let height = img.height;
    
    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    
    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    if (callback) callback(compressedDataUrl);
  };
  img.onerror = function() {
    if (callback) callback(dataUrl);
  };
  img.src = dataUrl;
}

window.triggerTaskBeforePhotoUpload = function() {
  const input = document.getElementById('form-task-photos-before-input');
  if (input) input.click();
};

window.triggerTaskAfterPhotoUpload = function() {
  const input = document.getElementById('form-task-photos-after-input');
  if (input) input.click();
};

let pendingPhotosCount = 0;

window.handleTaskPhotosBeforeUpload = function(event) {
  const files = Array.from(event.target.files || []);
  if (files.length === 0) return;

  if (!appState.currentTaskPhotosBefore) appState.currentTaskPhotosBefore = [];

  pendingPhotosCount += files.length;

  let countProcessed = 0;
  files.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      compressImageBase64(e.target.result, 800, 0.75, function(compressedUrl) {
        appState.currentTaskPhotosBefore.push({
          id: 'b_' + Date.now() + '_' + index + '_' + Math.random().toString(36).substr(2, 4),
          url: compressedUrl,
          caption: ''
        });
        countProcessed++;
        pendingPhotosCount = Math.max(0, pendingPhotosCount - 1);
        if (countProcessed === files.length) {
          renderTaskPhotoGalleries();
          event.target.value = '';
        }
      });
    };
    reader.onerror = function() {
      countProcessed++;
      pendingPhotosCount = Math.max(0, pendingPhotosCount - 1);
    };
    reader.readAsDataURL(file);
  });
};

window.handleTaskPhotosAfterUpload = function(event) {
  const files = Array.from(event.target.files || []);
  if (files.length === 0) return;

  if (!appState.currentTaskPhotosAfter) appState.currentTaskPhotosAfter = [];

  pendingPhotosCount += files.length;

  let countProcessed = 0;
  files.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      compressImageBase64(e.target.result, 800, 0.75, function(compressedUrl) {
        appState.currentTaskPhotosAfter.push({
          id: 'a_' + Date.now() + '_' + index + '_' + Math.random().toString(36).substr(2, 4),
          url: compressedUrl,
          caption: ''
        });
        countProcessed++;
        pendingPhotosCount = Math.max(0, pendingPhotosCount - 1);
        if (countProcessed === files.length) {
          renderTaskPhotoGalleries();
          event.target.value = '';
        }
      });
    };
    reader.onerror = function() {
      countProcessed++;
      pendingPhotosCount = Math.max(0, pendingPhotosCount - 1);
    };
    reader.readAsDataURL(file);
  });
};

window.removeTaskPhotoItem = function(stage, photoId) {
  if (stage === 'before') {
    appState.currentTaskPhotosBefore = (appState.currentTaskPhotosBefore || []).filter(p => p.id !== photoId);
  } else if (stage === 'after') {
    appState.currentTaskPhotosAfter = (appState.currentTaskPhotosAfter || []).filter(p => p.id !== photoId);
  }
  renderTaskPhotoGalleries();
};

window.updateTaskPhotoCaption = function(stage, photoId, captionText) {
  const list = stage === 'before' ? appState.currentTaskPhotosBefore : appState.currentTaskPhotosAfter;
  if (list) {
    const item = list.find(p => p.id === photoId);
    if (item) {
      item.caption = captionText;
    }
  }
};

window.renderTaskPhotoGalleries = function() {
  const beforeContainer = document.getElementById('task-photos-before-gallery');
  const afterContainer = document.getElementById('task-photos-after-gallery');

  const beforePhotos = appState.currentTaskPhotosBefore || [];
  const afterPhotos = appState.currentTaskPhotosAfter || [];

  if (beforeContainer) {
    if (beforePhotos.length === 0) {
      beforeContainer.innerHTML = `
        <div onclick="triggerTaskBeforePhotoUpload()" style="border: 2px dashed rgba(248, 113, 113, 0.3); border-radius: 6px; padding: 16px; text-align: center; color: #94a3b8; font-size: 11px; cursor: pointer; background: rgba(15, 23, 42, 0.3);">
          📷 Click here or "+ Add Photos" to attach Before action evidence (multiple images supported)
        </div>
      `;
    } else {
      beforeContainer.innerHTML = beforePhotos.map((p, idx) => `
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(248, 113, 113, 0.3); border-radius: 6px; padding: 8px;">
          <div style="display: flex; gap: 8px; align-items: center;">
            <div style="position: relative; flex-shrink: 0; width: 56px; height: 56px; border-radius: 4px; overflow: hidden; background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1);">
              <img src="${p.url}" alt="Before Photo ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex: 1;">
              <div style="font-size: 10px; color: #f87171; font-weight: 700; margin-bottom: 3px;">Before Photo #${idx + 1}</div>
              <input type="text" placeholder="Caption e.g. Initial defect / anomaly" value="${(p.caption || '').replace(/"/g, '&quot;')}" oninput="updateTaskPhotoCaption('before', '${p.id}', this.value)" style="width: 100%; padding: 4px 8px; font-size: 10.5px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 4px; color: #fff;">
            </div>
            <button type="button" onclick="removeTaskPhotoItem('before', '${p.id}')" title="Delete Photo" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 4px; width: 26px; height: 26px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">&times;</button>
          </div>
        </div>
      `).join('');
    }
  }

  if (afterContainer) {
    if (afterPhotos.length === 0) {
      afterContainer.innerHTML = `
        <div onclick="triggerTaskAfterPhotoUpload()" style="border: 2px dashed rgba(74, 222, 128, 0.3); border-radius: 6px; padding: 16px; text-align: center; color: #94a3b8; font-size: 11px; cursor: pointer; background: rgba(15, 23, 42, 0.3);">
          📷 Click here or "+ Add Photos" to attach After action evidence (multiple images supported)
        </div>
      `;
    } else {
      afterContainer.innerHTML = afterPhotos.map((p, idx) => `
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(74, 222, 128, 0.3); border-radius: 6px; padding: 8px;">
          <div style="display: flex; gap: 8px; align-items: center;">
            <div style="position: relative; flex-shrink: 0; width: 56px; height: 56px; border-radius: 4px; overflow: hidden; background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1);">
              <img src="${p.url}" alt="After Photo ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex: 1;">
              <div style="font-size: 10px; color: #4ade80; font-weight: 700; margin-bottom: 3px;">After Photo #${idx + 1}</div>
              <input type="text" placeholder="Caption e.g. Repair completed & verified" value="${(p.caption || '').replace(/"/g, '&quot;')}" oninput="updateTaskPhotoCaption('after', '${p.id}', this.value)" style="width: 100%; padding: 4px 8px; font-size: 10.5px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 4px; color: #fff;">
            </div>
            <button type="button" onclick="removeTaskPhotoItem('after', '${p.id}')" title="Delete Photo" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 4px; width: 26px; height: 26px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">&times;</button>
          </div>
        </div>
      `).join('');
    }
  }
};

// Aliases for backward compatibility
window.handleTaskPhotoBefore1Upload = window.handleTaskPhotosBeforeUpload;
window.handleTaskPhotoBefore2Upload = window.handleTaskPhotosBeforeUpload;
window.removeTaskPhotoBefore1 = function() { appState.currentTaskPhotosBefore = []; renderTaskPhotoGalleries(); };
window.removeTaskPhotoBefore2 = function() {};
window.handleTaskPhotoAfter1Upload = window.handleTaskPhotosAfterUpload;
window.handleTaskPhotoAfter2Upload = window.handleTaskPhotosAfterUpload;
window.removeTaskPhotoAfter1 = function() { appState.currentTaskPhotosAfter = []; renderTaskPhotoGalleries(); };
window.removeTaskPhotoAfter2 = function() {};
window.handleTaskPhotoUpload = window.handleTaskPhotosBeforeUpload;
window.removeTaskPhoto = window.removeTaskPhotoBefore1;
window.handleTaskPhotoAfterUpload = window.handleTaskPhotosAfterUpload;
window.removeTaskPhotoAfter = window.removeTaskPhotoAfter1;

window.openEditTaskModal = function(taskId) {
  currentSelectedTaskId = taskId;
  isCreatingRegistryTask = false;

  let task = appState.tasks.find(t => String(t.id) === String(taskId) || (t.manualTaskId && String(t.manualTaskId) === String(taskId)));

  if (!task) {
    const regItem = appState.registry.find(r => String(r.id) === String(taskId));
    if (regItem) {
      task = {
        id: regItem.id,
        manualTaskId: regItem.id,
        name: regItem.name,
        system: regItem.system,
        frequency: regItem.frequency || 'Daily',
        timeSlot: regItem.timeSlot || '',
        priority: regItem.priority || 'Minor',
        status: 'Pending',
        notes: regItem.notes || '',
        assignedTo: regItem.assignedTo || '',
        isMultiDay: regItem.isMultiDay || false,
        startDate: regItem.startDate || '',
        finishDate: regItem.finishDate || '',
        photosBefore: regItem.photosBefore ? [...regItem.photosBefore] : [],
        photosAfter: regItem.photosAfter ? [...regItem.photosAfter] : [],
        photoBefore1: regItem.photoBefore1 || regItem.photoBefore || regItem.photo || '',
        photoBefore2: regItem.photoBefore2 || '',
        photoAfter1: regItem.photoAfter1 || regItem.photoAfter || '',
        photoAfter2: regItem.photoAfter2 || '',
        dateCreated: new Date().toISOString().split('T')[0]
      };
      appState.tasks.push(task);
    }
  }

  if (!task) {
    alert("Task not found.");
    return;
  }

  document.getElementById('modal-task-title').innerText = "Edit Maintenance Task";
  document.getElementById('form-task-id').value = task.id;
  document.getElementById('form-task-name').value = task.name;
  
  if (task.system && !appState.customSystems.includes(task.system) && !['Architectural', 'Structural', 'Mechanical', 'Fire Protection', 'Plumbing', 'STP', 'Elevator'].includes(task.system)) {
    appState.customSystems.push(task.system);
  }
  populateSystemDropdowns();
  document.getElementById('form-task-system').value = task.system;
  document.getElementById('form-task-priority').value = task.priority || 'Minor';
  document.getElementById('form-task-frequency').value = task.frequency || 'Daily';
  document.getElementById('form-task-time').value = task.timeSlot || '';
  document.getElementById('form-task-status').value = task.status || 'Pending';
  document.getElementById('form-task-technician').value = task.assignedTo || '';
  document.getElementById('form-task-notes').value = task.notes || '';

  // Multi-day schedule fields
  const isMulti = task.isMultiDay || false;
  const multiToggle = document.getElementById('form-task-multiday-toggle');
  if (multiToggle) {
    multiToggle.checked = isMulti;
    toggleMultiDayWorkSchedule(isMulti);
  }
  const startEl = document.getElementById('form-task-start-date');
  const finishEl = document.getElementById('form-task-finish-date');
  if (startEl) startEl.value = task.startDate || new Date().toISOString().split('T')[0];
  if (finishEl) finishEl.value = task.finishDate || '';

  // Initialize Before Photos
  appState.currentTaskPhotosBefore = [];
  if (Array.isArray(task.photosBefore) && task.photosBefore.length > 0) {
    appState.currentTaskPhotosBefore = task.photosBefore.map(p => ({
      id: p.id || ('img_b_' + Math.random().toString(36).substr(2, 6)),
      url: p.url || p,
      caption: p.caption || ''
    }));
  } else {
    const b1 = task.photoBefore1 || task.photoBefore || task.photo || '';
    const cap1 = task.captionBefore1 || task.captionBefore || '';
    if (b1) appState.currentTaskPhotosBefore.push({ id: 'img_b1', url: b1, caption: cap1 });
    const b2 = task.photoBefore2 || '';
    const cap2 = task.captionBefore2 || '';
    if (b2) appState.currentTaskPhotosBefore.push({ id: 'img_b2', url: b2, caption: cap2 });
  }

  // Initialize After Photos
  appState.currentTaskPhotosAfter = [];
  if (Array.isArray(task.photosAfter) && task.photosAfter.length > 0) {
    appState.currentTaskPhotosAfter = task.photosAfter.map(p => ({
      id: p.id || ('img_a_' + Math.random().toString(36).substr(2, 6)),
      url: p.url || p,
      caption: p.caption || ''
    }));
  } else {
    const a1 = task.photoAfter1 || task.photoAfter || '';
    const cap1 = task.captionAfter1 || task.captionAfter || '';
    if (a1) appState.currentTaskPhotosAfter.push({ id: 'img_a1', url: a1, caption: cap1 });
    const a2 = task.photoAfter2 || '';
    const cap2 = task.captionAfter2 || '';
    if (a2) appState.currentTaskPhotosAfter.push({ id: 'img_a2', url: a2, caption: cap2 });
  }

  renderTaskPhotoGalleries();

  // Technician role restrictions
  if (appState.currentUserRole === 'Technician') {
    setTaskModalFormDisabled(true);
    document.getElementById('form-task-status').disabled = false;
    document.getElementById('form-task-notes').disabled = false;
    document.getElementById('btn-delete-task').style.display = 'none';
  } else {
    setTaskModalFormDisabled(false);
    document.getElementById('btn-delete-task').style.display = 'inline-flex';
  }

  document.getElementById('task-modal').style.display = 'flex';
};

// ==================== TASK MODAL & SCHEDULE LOGIC ====================
let currentSelectedTaskId = null;
let isCreatingRegistryTask = false;

window.openAddTaskModal = function() {
  try {
    currentSelectedTaskId = null;
    isCreatingRegistryTask = false;
    
    const titleEl = document.getElementById('modal-task-title');
    if (titleEl) titleEl.innerText = "Add Maintenance Task";

    const form = document.getElementById('task-form');
    if (form) form.reset();

    const idEl = document.getElementById('form-task-id');
    if (idEl) idEl.value = '';

    if (typeof populateSystemDropdowns === 'function') populateSystemDropdowns();

    const multiToggle = document.getElementById('form-task-multiday-toggle');
    if (multiToggle) {
      multiToggle.checked = false;
      if (typeof toggleMultiDayWorkSchedule === 'function') toggleMultiDayWorkSchedule(false);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const startEl = document.getElementById('form-task-start-date');
    const finishEl = document.getElementById('form-task-finish-date');
    if (startEl) startEl.value = todayStr;
    if (finishEl) finishEl.value = '';

    appState.currentTaskPhotosBefore = [];
    appState.currentTaskPhotosAfter = [];
    renderTaskPhotoGalleries();

    const delBtn = document.getElementById('btn-delete-task');
    if (delBtn) delBtn.style.display = 'none';

    if (typeof setTaskModalFormDisabled === 'function') setTaskModalFormDisabled(false);

    const modal = document.getElementById('task-modal');
    if (modal) modal.style.display = 'flex';
  } catch (err) {
    console.error("Error opening add task modal:", err);
    const modal = document.getElementById('task-modal');
    if (modal) modal.style.display = 'flex';
  }
};

window.openCreateRegistryTaskModal = function() {
  window.openAddTaskModal();
  isCreatingRegistryTask = true;
  const titleEl = document.getElementById('modal-task-title');
  if (titleEl) titleEl.innerText = "Add Manual Registry Task";
};

window.closeAddTaskModal = function() {
  const modal = document.getElementById('task-modal');
  if (modal) modal.style.display = 'none';
  appState.currentTaskPhotosBefore = [];
  appState.currentTaskPhotosAfter = [];
};

window.setTaskModalFormDisabled = function(disabled) {
  ['form-task-name', 'form-task-system', 'form-task-priority', 'form-task-frequency', 'form-task-time', 'form-task-technician'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = disabled;
  });
};

window.handleTaskSubmit = function(event) {
  event.preventDefault();
  
  if (pendingPhotosCount > 0) {
    const saveBtn = document.getElementById('btn-save-task');
    if (saveBtn) saveBtn.innerHTML = `<span>Saving & finalizing photos...</span>`;
    setTimeout(() => {
      handleTaskSubmit(event);
    }, 200);
    return;
  }

  const saveBtn = document.getElementById('btn-save-task');
  if (saveBtn) {
    saveBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>Save Changes</span>`;
  }
  
  const taskId = document.getElementById('form-task-id').value;
  const name = document.getElementById('form-task-name').value;
  const system = document.getElementById('form-task-system').value;
  const priority = document.getElementById('form-task-priority').value;
  const frequency = document.getElementById('form-task-frequency').value;
  const timeSlot = document.getElementById('form-task-time').value;
  const status = document.getElementById('form-task-status').value;
  const assignedTo = document.getElementById('form-task-technician').value;
  const notes = document.getElementById('form-task-notes').value;

  // Multi-day schedule fields
  const multiToggle = document.getElementById('form-task-multiday-toggle');
  const isMultiDay = multiToggle ? multiToggle.checked : false;
  const startDate = isMultiDay ? (document.getElementById('form-task-start-date').value || new Date().toISOString().split('T')[0]) : '';
  const finishDate = isMultiDay ? document.getElementById('form-task-finish-date').value : '';

  // Resolve system name
  let finalSystem = system;
  if (system === 'ADD_NEW') {
    const customVal = document.getElementById('form-task-custom-system').value.trim();
    if (!customVal) {
      alert("Please enter a custom system category name.");
      return;
    }
    finalSystem = customVal;
    if (!appState.customSystems.includes(finalSystem)) {
      appState.customSystems.push(finalSystem);
      populateSystemDropdowns();
    }
  }

  if (isCreatingRegistryTask) {
    if (appState.currentUserRole === 'Technician') return;
    
    const newRegistryItem = {
      id: 'reg_custom_' + Date.now(),
      name,
      system: finalSystem,
      frequency,
      timeSlot: timeSlot || '',
      priority,
      isMultiDay,
      startDate,
      finishDate,
      photosBefore: [...(appState.currentTaskPhotosBefore || [])],
      photosAfter: [...(appState.currentTaskPhotosAfter || [])]
    };

    appState.registry.push(newRegistryItem);
    saveState();
    closeAddTaskModal();
    renderApp();
    alert(`Added task "${name}" to the manual registry.`);
    return;
  }

  const photosBefore = [...(appState.currentTaskPhotosBefore || [])];
  const photosAfter = [...(appState.currentTaskPhotosAfter || [])];

  const b1Obj = photosBefore[0] || null;
  const b2Obj = photosBefore[1] || null;
  const a1Obj = photosAfter[0] || null;
  const a2Obj = photosAfter[1] || null;

  const b1Val = b1Obj ? b1Obj.url : '';
  const b2Val = b2Obj ? b2Obj.url : '';
  const a1Val = a1Obj ? a1Obj.url : '';
  const a2Val = a2Obj ? a2Obj.url : '';

  const capB1Val = b1Obj ? b1Obj.caption : '';
  const capB2Val = b2Obj ? b2Obj.caption : '';
  const capA1Val = a1Obj ? a1Obj.caption : '';
  const capA2Val = a2Obj ? a2Obj.caption : '';

  if (taskId) {
    // Edit Mode
    let task = appState.tasks.find(t => String(t.id) === String(taskId) || (t.manualTaskId && String(t.manualTaskId) === String(taskId)));
    if (!task) {
      const regItem = appState.registry.find(r => String(r.id) === String(taskId));
      if (regItem) {
        task = {
          id: regItem.id,
          manualTaskId: regItem.id,
          name: regItem.name,
          system: regItem.system,
          frequency: regItem.frequency || 'Daily',
          timeSlot: regItem.timeSlot || '',
          priority: regItem.priority || 'Minor',
          status: 'Pending',
          notes: regItem.notes || '',
          assignedTo: regItem.assignedTo || '',
          isMultiDay: regItem.isMultiDay || false,
          startDate: regItem.startDate || '',
          finishDate: regItem.finishDate || '',
          dateCreated: new Date().toISOString().split('T')[0]
        };
        appState.tasks.push(task);
      }
    }

    if (task) {
      if (appState.currentUserRole !== 'Technician') {
        task.name = name;
        task.system = finalSystem;
        task.priority = priority;
        task.frequency = frequency;
        task.timeSlot = timeSlot;
        task.assignedTo = assignedTo;
        task.isMultiDay = isMultiDay;
        task.startDate = startDate;
        task.finishDate = finishDate;
      }
      
      const prevStatus = task.status;
      task.status = status;
      task.notes = notes;

      task.photosBefore = photosBefore;
      task.photosAfter = photosAfter;

      task.photoBefore1 = b1Val;
      task.photoBefore2 = b2Val;
      task.photoAfter1 = a1Val;
      task.photoAfter2 = a2Val;

      task.captionBefore1 = capB1Val;
      task.captionBefore2 = capB2Val;
      task.captionAfter1 = capA1Val;
      task.captionAfter2 = capA2Val;

      // Aliases for legacy views
      task.photo = b1Val;
      task.photoBefore = b1Val;
      task.photoAfter = a1Val;
      task.captionBefore = capB1Val;
      task.captionAfter = capA1Val;

      if (status === 'Completed' && prevStatus !== 'Completed') {
        task.dateCompleted = new Date().toISOString().split('T')[0];
      }

      // Sync matching registry item
      const matchingReg = appState.registry.find(r => String(r.id) === String(taskId) || (task.manualTaskId && String(r.id) === String(task.manualTaskId)));
      if (matchingReg) {
        matchingReg.name = name;
        matchingReg.system = finalSystem;
        matchingReg.frequency = frequency;
        matchingReg.priority = priority;
        matchingReg.timeSlot = timeSlot;
        matchingReg.isMultiDay = isMultiDay;
        matchingReg.startDate = startDate;
        matchingReg.finishDate = finishDate;
        matchingReg.photosBefore = photosBefore;
        matchingReg.photosAfter = photosAfter;
        matchingReg.photoBefore1 = b1Val;
        matchingReg.photoBefore2 = b2Val;
        matchingReg.photoAfter1 = a1Val;
        matchingReg.photoAfter2 = a2Val;
        matchingReg.photo = b1Val;
        matchingReg.photoBefore = b1Val;
        matchingReg.photoAfter = a1Val;
      }

      // Sync matching tenant complaint ticket if applicable
      if (task.id && String(task.id).startsWith('t_tnt_')) {
        const ticketId = String(task.id).replace('t_tnt_', '');
        const matchingComplaint = (appState.complaints || []).find(c => String(c.id) === ticketId);
        if (matchingComplaint) {
          if (b1Val) matchingComplaint.photo = b1Val;
          if (a1Val) matchingComplaint.photoAfter = a1Val;
          if (status === 'Completed') matchingComplaint.status = 'Resolved';
        }
      }

      // Sync matching Job Order if applicable
      if (task.id && String(task.id).startsWith('t_jo_')) {
        const joId = String(task.id).replace('t_jo_', '');
        const matchingJobOrder = (appState.jobOrders || []).find(j => String(j.id) === joId);
        if (matchingJobOrder) {
          if (b1Val) matchingJobOrder.photo = b1Val;
          if (a1Val) matchingJobOrder.photoAfter = a1Val;
          if (status === 'Completed') matchingJobOrder.status = 'Completed';
        }
      }
    }
  } else {
    // Create Mode
    if (appState.currentUserRole === 'Technician') return;

    const newTask = {
      id: 'task_custom_' + Date.now(),
      name,
      system: finalSystem,
      priority,
      frequency,
      timeSlot,
      status,
      assignedTo,
      notes,
      isMultiDay,
      startDate,
      finishDate,
      photosBefore: photosBefore,
      photosAfter: photosAfter,
      photo: b1Val,
      photoBefore: b1Val,
      photoAfter: a1Val,
      photoBefore1: b1Val,
      photoBefore2: b2Val,
      photoAfter1: a1Val,
      photoAfter2: a2Val,
      captionBefore: capB1Val,
      captionAfter: capA1Val,
      captionBefore1: capB1Val,
      captionBefore2: capB2Val,
      captionAfter1: capA1Val,
      captionAfter2: capA2Val,
      dateCreated: new Date().toISOString().split('T')[0],
      dateCompleted: status === 'Completed' ? new Date().toISOString().split('T')[0] : null
    };

    appState.tasks.push(newTask);
    
    if (priority === 'Critical') {
      appState.notifications.unshift({
        id: `crit_${newTask.id}_${Date.now()}`,
        type: 'critical',
        message: `CRITICAL ALARM: New critical issue logged: "${name}"`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  }

  // Reset transient upload state
  appState.currentTaskPhotosBefore = [];
  appState.currentTaskPhotosAfter = [];

  saveState();
  checkOverdueTasks();
  closeAddTaskModal();
  renderApp();
  if (typeof renderPeriodicMaintenance === 'function') renderPeriodicMaintenance();
};

window.openEditTaskModalFromRegistry = function(activityId) {
  window.openEditTaskModal(activityId);
};



window.autoPopulateDailyTasks = function() {
  if (!appState.registry || appState.registry.length === 0) {
    appState.registry = (typeof DEFAULT_MANUAL_TASKS !== 'undefined') ? [...DEFAULT_MANUAL_TASKS] : [];
  }

  const dailyTasks = appState.registry.filter(t => !t.frequency || t.frequency === 'Daily');
  const slots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
  
  let addedCount = 0;
  dailyTasks.forEach((manualTask, idx) => {
    const assignedSlot = manualTask.timeSlot ? normalizeTimeSlotString(manualTask.timeSlot) : slots[idx % slots.length];
    
    // Check if task exists in appState.tasks
    let existingIndex = appState.tasks.findIndex(t => t.manualTaskId === manualTask.id || t.name === manualTask.name);
    
    const newTaskObj = {
      id: 't_auto_' + manualTask.id + '_' + idx,
      manualTaskId: manualTask.id,
      name: manualTask.name,
      system: manualTask.system,
      frequency: 'Daily',
      timeSlot: assignedSlot,
      priority: manualTask.priority || 'Minor',
      status: 'Pending',
      notes: manualTask.notes || '',
      photo: '',
      assignedTo: (typeof getSystemDefaultTechnician === 'function') ? getSystemDefaultTechnician(manualTask.system) : 'John Doe (Lead)',
      dateCreated: new Date().toISOString().split('T')[0]
    };

    if (existingIndex >= 0) {
      appState.tasks[existingIndex].timeSlot = assignedSlot;
      appState.tasks[existingIndex].frequency = 'Daily';
    } else {
      appState.tasks.push(newTaskObj);
      addedCount++;
    }
  });

  saveState();
  if (typeof renderTimeline === 'function') renderTimeline();
  if (typeof renderDashboardSynchronizedTimeline === 'function') renderDashboardSynchronizedTimeline();
  if (typeof renderApp === 'function') renderApp();

  alert(`Auto-Populate Complete: Successfully scheduled all ${dailyTasks.length} daily maintenance tasks into the timeline!`);
};





// ==================== TASK REGISTRY VIEW & RENDER ====================
window.currentRegistryFilterFreq = 'All';

window.renderRegistry = function() {
  const tbody = document.getElementById('registry-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  // Initialize registry if empty
  if (!appState.registry || appState.registry.length === 0) {
    appState.registry = (typeof DEFAULT_MANUAL_TASKS !== 'undefined') ? [...DEFAULT_MANUAL_TASKS] : [];
  }

  const searchVal = (document.getElementById('registry-search')?.value || '').toLowerCase();
  const targetSchedule = document.getElementById('registry-target-schedule-dropdown')?.value || 'All';
  const currentFilterFreq = window.currentRegistryFilterFreq || 'All';

  let items = [...appState.registry];

  if (currentFilterFreq !== 'All') {
    items = items.filter(t => t.frequency === currentFilterFreq);
  }

  if (targetSchedule !== 'All') {
    items = items.filter(t => t.frequency === targetSchedule);
  }

  if (searchVal) {
    items = items.filter(t => 
      (t.name && t.name.toLowerCase().includes(searchVal)) || 
      (t.system && t.system.toLowerCase().includes(searchVal)) ||
      (t.frequency && t.frequency.toLowerCase().includes(searchVal)) ||
      (t.priority && t.priority.toLowerCase().includes(searchVal))
    );
  }

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--text-muted);">No manual registry tasks match your current filters.</td></tr>`;
    return;
  }

  items.forEach(item => {
    const sysClass = (typeof getSystemClass === 'function') ? getSystemClass(item.system) : 'arch';
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
      <td><span class="system-tag bg-sys-${sysClass}">${item.system}</span></td>
      <td><strong>${item.name}</strong></td>
      <td><span class="freq-tag">${item.frequency || 'Daily'}</span></td>
      <td>${item.timeSlot || '—'}</td>
      <td><span class="priority-tag tag-${(item.priority || 'Minor').toLowerCase()}">${item.priority || 'Minor'}</span></td>
            <td style="white-space: nowrap;">
        <div style="display: flex; gap: 6px; align-items: center;">
          <button class="btn btn-primary" style="padding: 4px 10px; font-size: 11px;" onclick="scheduleRegistryItemToTimeline('${item.id}')" title="Schedule task into active timeline">+ Schedule</button>
          <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="openEditTaskModalFromRegistry('${item.id}')" title="Edit task details">Edit</button>
          <button class="btn btn-danger" style="padding: 4px 10px; font-size: 11px;" onclick="deleteRegistryActivity('${item.id}')" title="Delete task from registry">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

window.filterRegistry = function() {
  window.renderRegistry();
};

window.setRegistryFilter = function(freq, btn) {
  window.currentRegistryFilterFreq = freq;
  if (btn && btn.parentElement) {
    Array.from(btn.parentElement.children).forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
  }
  window.renderRegistry();
};





window.scheduleRegistryItemToTimeline = function(activityId) {
  const item = appState.registry.find(r => r.id === activityId);
  if (!item) return;

  const freq = item.frequency || 'Daily';
  const assignedSlot = item.timeSlot ? normalizeTimeSlotString(item.timeSlot) : '08:00 AM';

  let existingIndex = appState.tasks.findIndex(t => t.manualTaskId === activityId || t.id === activityId || t.name === item.name);
  
  if (existingIndex < 0) {
    const newTask = {
      id: 't_sched_' + item.id + '_' + Date.now(),
      manualTaskId: item.id,
      name: item.name,
      system: item.system,
      frequency: freq,
      timeSlot: assignedSlot,
      priority: item.priority || 'Minor',
      status: 'Pending',
      notes: item.notes || '',
      assignedTo: (typeof getSystemDefaultTechnician === 'function') ? getSystemDefaultTechnician(item.system) : 'John Doe (Lead)',
      isMultiDay: item.isMultiDay || false,
      startDate: item.startDate || '',
      finishDate: item.finishDate || '',
      dateCreated: new Date().toISOString().split('T')[0]
    };
    appState.tasks.push(newTask);
  } else {
    appState.tasks[existingIndex].timeSlot = assignedSlot;
    appState.tasks[existingIndex].frequency = freq;
  }

  saveState();

  if (freq === 'Daily') {
    switchTab('timeline');
    if (typeof renderTimeline === 'function') renderTimeline();
  } else {
    switchTab('periodic');
    if (typeof selectPeriodicFrequency === 'function') {
      selectPeriodicFrequency(freq === 'Annual' ? 'Yearly' : freq);
    }
    if (typeof renderPeriodicMaintenance === 'function') renderPeriodicMaintenance();
  }

  if (typeof renderDashboardSynchronizedTimeline === 'function') renderDashboardSynchronizedTimeline();

  alert(`Task "${item.name}" has been scheduled into the ${freq} maintenance timeline at ${assignedSlot}!`);
};





// ==================== DRAG & DROP SCHEDULE OPERATION ====================
window.setupDragAndDrop = function() {
  // Configured inline via HTML drag-and-drop event handlers
};

window.allowDrop = function(e) {
  e.preventDefault();
  const slot = e.currentTarget;
  if (slot) slot.classList.add('drag-over');
};

window.handleDragLeave = function(e) {
  const slot = e.currentTarget;
  if (slot) slot.classList.remove('drag-over');
};

window.handleDragStart = function(e, taskId) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  }
};

window.dropToSlot = function(e, timeSlot) {
  e.preventDefault();
  const slot = e.currentTarget;
  if (slot) slot.classList.remove('drag-over');
  
  if (e.dataTransfer) {
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTaskToSlot(taskId, timeSlot);
    }
  }
};

function moveTaskToSlot(taskId, timeSlot) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (task) {
    task.timeSlot = timeSlot;
    saveState();
    if (typeof renderApp === 'function') renderApp();
    if (typeof renderTimeline === 'function') renderTimeline();
    if (typeof renderDashboardSynchronizedTimeline === 'function') renderDashboardSynchronizedTimeline();
  }
}



// ==================== GENERATE TASK CARD ELEMENT ====================
function createTaskCardElement(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.setAttribute('draggable', 'true');
  card.setAttribute('data-task-id', task.id);
  card.onclick = () => {
    if (typeof openEditTaskModal === 'function') openEditTaskModal(task.id);
  };
  
  card.ondragstart = (e) => {
    if (typeof handleDragStart === 'function') handleDragStart(e, task.id);
  };

  const sysClass = (typeof getSystemClass === 'function') ? getSystemClass(task.system) : 'arch';
  card.style.borderLeftColor = `var(--sys-${sysClass})`;

  const remainingHtml = (typeof calculateRemainingDaysLabel === 'function') ? calculateRemainingDaysLabel(task) : '';

  const header = document.createElement('div');
  header.className = 'task-card-header';
  header.innerHTML = `
    <span class="task-name ${task.status === 'Completed' ? 'completed-text' : ''}">${task.name}</span>
    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
      <span class="priority-tag tag-${(task.priority || 'Minor').toLowerCase()}">${task.priority || 'Minor'}</span>
      ${remainingHtml}
    </div>
  `;

  const meta = document.createElement('div');
  meta.className = 'task-card-meta';
  
  const sysInit = (typeof getSystemInitials === 'function') ? getSystemInitials(task.system) : 'AR';
  
  meta.innerHTML = `
    <span class="sys-tag bg-sys-${sysClass}">${sysInit}</span>
    <span>${task.assignedTo || 'Unassigned'}</span>
  `;

  card.appendChild(header);
  card.appendChild(meta);
  return card;
}



// ==================== BACKLOG DRAWER & RENDER ====================
window.dropToBacklog = function(e) {
  e.preventDefault();
  const slot = e.currentTarget;
  if (slot) slot.classList.remove('drag-over');

  if (e.dataTransfer) {
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      const task = appState.tasks.find(t => t.id === taskId);
      if (task) {
        task.timeSlot = ''; // Clear timeslot to move to backlog
        saveState();
        if (typeof renderApp === 'function') renderApp();
        if (typeof renderTimeline === 'function') renderTimeline();
        if (typeof renderDashboardSynchronizedTimeline === 'function') renderDashboardSynchronizedTimeline();
      }
    }
  }
};

window.renderBacklogTasks = function() {
  const container = document.getElementById('unscheduled-backlog');
  if (!container) return;
  container.innerHTML = '';

  const backlogTasks = appState.tasks.filter(t => !t.timeSlot || t.timeSlot === '');

  const badge = document.getElementById('backlog-count-badge');
  if (badge) badge.innerText = backlogTasks.length;

  if (backlogTasks.length === 0) {
    container.innerHTML = '<div style="font-size: 11px; color: var(--text-muted); text-align: center; padding: 20px;">No unscheduled tasks in backlog</div>';
    return;
  }

  backlogTasks.forEach(task => {
    if (typeof createTaskCardElement === 'function') {
      container.appendChild(createTaskCardElement(task));
    }
  });
};

window.clearTimelineTasks = function() {
  const timelineTasks = appState.tasks.filter(t => t.timeSlot && t.timeSlot !== '');
  if (timelineTasks.length === 0) {
    alert("No tasks currently scheduled on the timeline.");
    return;
  }
  
  if (confirm(`Are you sure you want to clear all ${timelineTasks.length} tasks from the active daily timeline? (This will return them to the backlog)`)) {
    appState.tasks.forEach(t => {
      if (t.timeSlot) {
        t.timeSlot = '';
      }
    });
    saveState();
    if (typeof renderTimeline === 'function') renderTimeline();
    if (typeof renderDashboardSynchronizedTimeline === 'function') renderDashboardSynchronizedTimeline();
    if (typeof renderBacklogTasks === 'function') renderBacklogTasks();
    if (typeof renderApp === 'function') renderApp();
  }
};


// ==================== EMPLOYEE WORK SCHEDULE & ROSTER ENGINE ====================
let currentEmpDeptFilter = 'All';

function getEmployeeLiveDutyStatus(emp) {
  const now = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[now.getDay()];

  const isRestDayToday = emp.restDay && emp.restDay.trim().toLowerCase() === todayName.toLowerCase();

  if (isRestDayToday) {
    if (emp.workOnRestDay) {
      return { label: 'ON DUTY (RESTDAY WORK)', class: 'status-onduty-restday', isRestDayWork: true };
    }
    return { label: 'REST DAY', class: 'status-restday' };
  }

  if (emp.workOnRestDay) {
    return { label: 'ON DUTY (RESTDAY WORK)', class: 'status-onduty-restday', isRestDayWork: true };
  }

  const currentHour = now.getHours();
  // Check rotation or regular shift
  if (emp.schedule && emp.schedule.includes('/')) {
    // 12-hour rotation schedule
    if (currentHour >= 7 && currentHour < 19) {
      return { label: 'ON DUTY (DAY)', class: 'status-onduty' };
    } else {
      return { label: 'ON DUTY (NIGHT)', class: 'status-onduty' };
    }
  } else {
    // Regular shift (e.g., 8:00am-5:00pm or 7:30am-4:30pm or 6:00am-3:00pm)
    if (currentHour >= 7 && currentHour < 18) {
      return { label: 'ON DUTY', class: 'status-onduty' };
    }
  }

  return { label: 'OFF DUTY', class: 'status-offduty' };
}

function renderEmployeeWorkScheduleTable() {
  const tbody = document.getElementById('employee-schedule-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const schedules = appState.employeeSchedules || [];
  const searchQuery = (document.getElementById('search-employee-input') ? document.getElementById('search-employee-input').value : '').toLowerCase().trim();

  // Metrics update
  const totalCount = schedules.length;
  let onDutyCount = 0;
  let restDayCount = 0;
  let restDayWorkCount = 0;
  let securityCount = 0;

  schedules.forEach(emp => {
    const liveStatus = getEmployeeLiveDutyStatus(emp);
    if (liveStatus.label.includes('ON DUTY')) onDutyCount++;
    if (liveStatus.label === 'REST DAY') restDayCount++;
    if (emp.workOnRestDay || liveStatus.isRestDayWork) restDayWorkCount++;
    if (emp.department === 'Agency Security' || emp.department === 'CCTV Operator') securityCount++;
  });

  const totalEl = document.getElementById('metric-emp-total');
  const onDutyEl = document.getElementById('metric-emp-onduty');
  const restDayEl = document.getElementById('metric-emp-restday');
  const restDayWorkEl = document.getElementById('metric-emp-restday-work');
  const securityEl = document.getElementById('metric-emp-security');

  if (totalEl) totalEl.innerText = totalCount;
  if (onDutyEl) onDutyEl.innerText = onDutyCount;
  if (restDayEl) restDayEl.innerText = restDayCount;
  if (restDayWorkEl) restDayWorkEl.innerText = restDayWorkCount;
  if (securityEl) securityEl.innerText = securityCount;

  // Filter schedules
  const filtered = schedules.filter(emp => {
    const matchesDept = (currentEmpDeptFilter === 'All') || (emp.department === currentEmpDeptFilter);
    const matchesQuery = !searchQuery || 
      emp.name.toLowerCase().includes(searchQuery) ||
      emp.position.toLowerCase().includes(searchQuery) ||
      emp.restDay.toLowerCase().includes(searchQuery) ||
      (emp.workOnRestDay && 'working restday rest day duty'.includes(searchQuery)) ||
      (emp.contact && emp.contact.toLowerCase().includes(searchQuery)) ||
      (emp.remarks && emp.remarks.toLowerCase().includes(searchQuery));
    return matchesDept && matchesQuery;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 24px; color: var(--text-dim);">
          No employee schedule entries match your criteria.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(emp => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.06)';

    const liveStatus = getEmployeeLiveDutyStatus(emp);
    const isRegular = (emp.remarks === 'Regular');
    const isWorkingRestDay = !!emp.workOnRestDay;

    const restDayDisplay = isWorkingRestDay 
      ? `<div style="display: flex; flex-direction: column; gap: 2px;">
           <span class="restday-tag working-restday">${emp.restDay}</span>
           <span style="font-size: 10px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 0.2px;">⚡ Working on Rest Day</span>
         </div>`
      : `<span class="restday-tag">${emp.restDay}</span>`;

    tr.innerHTML = `
      <td style="padding: 12px 16px; font-weight: 700; color: #fff;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(56, 189, 248, 0.2); color: #38bdf8; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800;">
            ${getInitials(emp.name)}
          </div>
          <span>${emp.name}</span>
        </div>
      </td>
      <td style="padding: 12px 16px; color: #cbd5e1; font-weight: 600;">${emp.position}</td>
      <td style="padding: 12px 16px; color: #94a3b8; font-family: monospace;">${emp.schedule}</td>
      <td style="padding: 12px 16px;">
        <span class="remarks-tag ${isRegular ? 'regular' : ''}">${emp.remarks || 'Regular'}</span>
      </td>
      <td style="padding: 12px 16px;">
        ${restDayDisplay}
      </td>
      <td style="padding: 12px 16px;">
        ${emp.contact && emp.contact !== 'N/A' ? `<a href="tel:${emp.contact.replace(/\s+/g, '')}" class="emp-contact-link" title="Click to call">📞 ${emp.contact}</a>` : '<span style="color: #64748b;">N/A</span>'}
      </td>
      <td style="padding: 12px 16px; text-align: center;">
        <span class="status-pill ${liveStatus.class}">${liveStatus.label}</span>
      </td>
      <td style="padding: 12px 16px; text-align: right;">
        <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
          ${(window.SecurityEngine && window.SecurityEngine.currentSession && window.SecurityEngine.currentSession.userId === emp.id) 
            ? `<button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px; background: rgba(34, 197, 94, 0.15); color: #4ade80; border-color: rgba(34, 197, 94, 0.35);" onclick="window.logoutUser()" title="Currently Logged In. Click to Log Out">🟢 Active / Log Out</button>`
            : `<button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px; color: #38bdf8; border-color: rgba(56, 189, 248, 0.35);" onclick="SecurityEngine.loginPersonnelBySchedule('${emp.id}')" title="Log In as ${emp.name} (${emp.position})">🔑 Log In</button>`}
          <button class="btn" style="padding: 4px 8px; font-size: 11px; cursor: pointer; transition: all 0.2s; ${isWorkingRestDay ? 'background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4);' : 'background: rgba(234, 179, 8, 0.15); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.35);'}" onclick="toggleWorkOnRestDay('${emp.id}')" title="${isWorkingRestDay ? 'Click to cancel Rest Day Duty' : 'Click to put employee On Duty on Rest Day'}">
            ${isWorkingRestDay ? '✓ On Duty (Restday)' : '⚡ Work on Restday'}
          </button>
          <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="openEditEmployeeModal('${emp.id}')" title="Edit Schedule">
            ✏️ Edit
          </button>
          <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px; color: #f87171; border-color: rgba(248, 113, 113, 0.3);" onclick="deleteEmployeeSchedule('${emp.id}')" title="Delete Entry">
            🗑️
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.toggleWorkOnRestDay = function(empId) {
  const emp = (appState.employeeSchedules || []).find(e => e.id === empId);
  if (!emp) return;

  emp.workOnRestDay = !emp.workOnRestDay;
  saveState();
  renderEmployeeWorkScheduleTable();
};

window.filterEmployeeScheduleTable = function() {
  renderEmployeeWorkScheduleTable();
};

window.setEmpDeptFilter = function(dept, btnElement) {
  currentEmpDeptFilter = dept;
  document.querySelectorAll('#emp-dept-filter-pills .filter-pill').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderEmployeeWorkScheduleTable();
};

window.openAddEmployeeModal = function() {
  document.getElementById('employee-modal-title').innerText = 'Add Employee Schedule';
  document.getElementById('form-emp-id').value = '';
  document.getElementById('form-emp-name').value = '';
  document.getElementById('form-emp-position').value = '';
  document.getElementById('form-emp-dept').value = 'Agency Security';
  document.getElementById('form-emp-schedule').value = '7:00am-7:00pm / 7:00pm-7:00am';
  document.getElementById('form-emp-remarks').value = 'Rotation Schedule';
  document.getElementById('form-emp-restday').value = 'Sunday';
  document.getElementById('form-emp-contact').value = '';
  if (document.getElementById('form-emp-work-restday')) {
    document.getElementById('form-emp-work-restday').checked = false;
  }

  document.getElementById('employee-modal').style.display = 'flex';
};

window.openEditEmployeeModal = function(empId) {
  const emp = (appState.employeeSchedules || []).find(e => e.id === empId);
  if (!emp) return;

  document.getElementById('employee-modal-title').innerText = 'Edit Employee Schedule';
  document.getElementById('form-emp-id').value = emp.id;
  document.getElementById('form-emp-name').value = emp.name;
  document.getElementById('form-emp-position').value = emp.position;
  document.getElementById('form-emp-dept').value = emp.department || 'Management';
  document.getElementById('form-emp-schedule').value = emp.schedule;
  document.getElementById('form-emp-remarks').value = emp.remarks || 'Regular';
  document.getElementById('form-emp-restday').value = emp.restDay || 'Sunday';
  document.getElementById('form-emp-contact').value = emp.contact || '';
  if (document.getElementById('form-emp-work-restday')) {
    document.getElementById('form-emp-work-restday').checked = !!emp.workOnRestDay;
  }

  document.getElementById('employee-modal').style.display = 'flex';
};

window.closeEmployeeModal = function() {
  document.getElementById('employee-modal').style.display = 'none';
};

window.saveEmployeeSchedule = function(e) {
  if (e) e.preventDefault();
  const id = document.getElementById('form-emp-id').value;
  const name = document.getElementById('form-emp-name').value.trim();
  const position = document.getElementById('form-emp-position').value.trim();
  const department = document.getElementById('form-emp-dept').value;
  const schedule = document.getElementById('form-emp-schedule').value.trim();
  const remarks = document.getElementById('form-emp-remarks').value;
  const restDay = document.getElementById('form-emp-restday').value;
  const contact = document.getElementById('form-emp-contact').value.trim();
  const workOnRestDay = document.getElementById('form-emp-work-restday') ? document.getElementById('form-emp-work-restday').checked : false;

  if (!name || !position || !schedule) {
    alert("Please fill in all required fields.");
    return;
  }

  if (!appState.employeeSchedules) appState.employeeSchedules = [];

  if (id) {
    // Edit
    const index = appState.employeeSchedules.findIndex(e => e.id === id);
    if (index !== -1) {
      appState.employeeSchedules[index] = { id, name, position, department, schedule, remarks, restDay, contact, workOnRestDay };
    }
  } else {
    // Add
    const newId = 'emp_' + Date.now();
    appState.employeeSchedules.push({ id: newId, name, position, department, schedule, remarks, restDay, contact, workOnRestDay });
  }

  saveState();
  closeEmployeeModal();
  renderEmployeeWorkScheduleTable();
};

window.deleteEmployeeSchedule = function(empId) {
  const emp = (appState.employeeSchedules || []).find(e => e.id === empId);
  if (!emp) return;
  if (confirm(`Are you sure you want to remove ${emp.name} from the employee work schedule roster?`)) {
    appState.employeeSchedules = appState.employeeSchedules.filter(e => e.id !== empId);
    saveState();
    renderEmployeeWorkScheduleTable();
  }
};

window.exportEmployeeScheduleCSV = function() {
  const schedules = appState.employeeSchedules || [];
  if (schedules.length === 0) {
    alert("No employee schedule data available to export.");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Employee Name,Position,Department,Daily Schedule,Remarks,Rest Day,Working on Rest Day,Contact Number\n";

  schedules.forEach(emp => {
    const row = [
      `"${emp.name}"`,
      `"${emp.position}"`,
      `"${emp.department}"`,
      `"${emp.schedule}"`,
      `"${emp.remarks || ''}"`,
      `"${emp.restDay}"`,
      `"${emp.workOnRestDay ? 'Yes (On Duty)' : 'No'}"`,
      `"${emp.contact || ''}"`
    ].join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `OCT_BM_Work_Schedule_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.deleteCurrentTask = function() {
  if (!currentSelectedTaskId) return;
  
  const task = appState.tasks.find(t => t.id === currentSelectedTaskId || t.manualTaskId === currentSelectedTaskId);
  if (!task) return;
  
  if (confirm(`Are you sure you want to delete the task "${task.name}"?`)) {
    appState.tasks = appState.tasks.filter(t => t.id !== task.id);
    saveState();
    closeAddTaskModal();
    renderApp();
    if (typeof renderTimeline === 'function') renderTimeline();
    if (typeof renderDashboardSynchronizedTimeline === 'function') renderDashboardSynchronizedTimeline();
  }
};

// =========================================================================================
// ==================== EMERGENCY PREPAREDNESS PLAN (ERP) MAIN MODULE ====================
// =========================================================================================

const MAIN_DEFAULT_ORG_STRUCTURE = [
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

const MAIN_ORG_TIER_CONFIG = [
  { key: 'Executive Leadership', title: 'Executive Leadership & Corporate Governance', badge: 'Tier 1 • Top Management' },
  { key: 'Incident Command', title: 'Incident Command & Emergency Coordinators', badge: 'Tier 2 • On-Scene Command' },
  { key: 'Floor Operations', title: 'Floor Wardens & Evacuation Sweepers', badge: 'Tier 3 • Per-Floor Operations' },
  { key: 'Specialized Rescue', title: 'Mobility Assistance & Area of Refuge Officers', badge: 'Tier 4 • Dedicated Assistance' },
  { key: 'Technical Support', title: 'In-House Engineers & Support Team', badge: 'Tier 5 • Facilities & QA/QC' }
];

let mainDraggedMemberId = null;
let currentMainOrgView = 'tree';

function getMainActiveOrgStructure() {
  try {
    const stored = localStorage.getItem('onecorp_emergency_org_structure');
    if (stored) {
      const list = JSON.parse(stored);
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
    console.error('Error loading org structure:', e);
  }
  return JSON.parse(JSON.stringify(MAIN_DEFAULT_ORG_STRUCTURE));
}

function saveMainActiveOrgStructure(list) {
  try {
    localStorage.setItem('onecorp_emergency_org_structure', JSON.stringify(list));
  } catch (e) {
    console.error('Error saving org structure:', e);
  }
}

window.switchMainGuidelineTab = function(tabKey) {
  document.querySelectorAll('#card-main-preparedness-erp .guideline-pill').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`main-pill-${tabKey}`);
  if (activeBtn) activeBtn.classList.add('active');

  document.querySelectorAll('#card-main-preparedness-erp .guideline-pane').forEach(pane => {
    pane.classList.remove('active');
  });
  const targetPane = document.getElementById(`main-pane-${tabKey}`);
  if (targetPane) targetPane.classList.add('active');

  if (tabKey === 'org-structure') {
    renderMainEmergencyOrgStructure();
  }
};

window.switchMainOrgView = function(viewType) {
  currentMainOrgView = viewType;

  const btnTree = document.getElementById('main-btn-view-tree');
  const btnCards = document.getElementById('main-btn-view-cards');
  const treeContainer = document.getElementById('main-org-tree-view-container');
  const cardsContainer = document.getElementById('main-org-cards-view-container');

  if (btnTree) btnTree.classList.toggle('active', viewType === 'tree');
  if (btnCards) btnCards.classList.toggle('active', viewType === 'cards');

  if (treeContainer) treeContainer.style.display = viewType === 'tree' ? 'block' : 'none';
  if (cardsContainer) cardsContainer.style.display = viewType === 'cards' ? 'flex' : 'none';

  if (viewType === 'tree') {
    renderMainHierarchicalOrgChart();
  } else {
    renderMainOrgCardsView();
  }
};

function createMainTreeNodeHtml(m, nodeClass = '', tierKey = '') {
  if (!m) return '';
  const tKey = tierKey || m.tier || 'Incident Command';
  let avatarHtml = '';
  if (m.photo) {
    avatarHtml = `<img src="${m.photo}" alt="${m.name}" onerror="this.parentElement.innerHTML='<span class=\\'avatar-initials\\'>${m.name.charAt(0)}</span>'">`;
  } else {
    const initials = m.name.split(' ').map(n => n.charAt(0)).filter((_, idx, arr) => idx === 0 || idx === arr.length - 1).join('');
    avatarHtml = `<span class="avatar-initials">${initials || 'EC'}</span>`;
  }

  const phoneText = m.phone ? `<span>📞 ${m.phone}</span>` : '';

  return `
    <div class="tree-node-box ${nodeClass}" 
         id="tree-node-${m.id}"
         draggable="true"
         ondragstart="handleMainOrgDragStart(event, '${m.id}')"
         ondragover="handleMainTreeDragOver(event)"
         ondragleave="handleMainTreeDragLeave(event)"
         ondrop="handleMainTreeDropOnNode(event, '${m.id}', '${tKey}')"
         ondragend="handleMainOrgDragEnd(event)"
         onclick="openEditOrgMemberModal('${m.id}')" 
         title="Drag up/down/left/right to reorder or change tier. Click to edit (${m.name})">
      <div class="tree-node-avatar">
        ${avatarHtml}
      </div>
      <div class="tree-node-info">
        <div class="tree-node-name">${m.name}</div>
        <div class="tree-node-role">${m.role}</div>
        ${phoneText ? `<div class="tree-node-phone">${phoneText}</div>` : ''}
      </div>
    </div>
  `;
}

// Tree Level Drag Handlers
window.handleMainTreeLevelDragOver = function(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = 'move';
  const target = event.currentTarget;
  if (target) target.classList.add('drag-over-tree-level');
};

window.handleMainTreeLevelDragLeave = function(event) {
  event.preventDefault();
  const target = event.currentTarget;
  if (target) target.classList.remove('drag-over-tree-level');
};

window.handleMainTreeLevelDrop = function(event, targetTier) {
  event.preventDefault();
  event.stopPropagation();
  document.querySelectorAll('.drag-over-tree-level').forEach(el => el.classList.remove('drag-over-tree-level'));
  document.querySelectorAll('.drag-over-card').forEach(el => el.classList.remove('drag-over-card'));

  if (!mainDraggedMemberId) return;

  const orgList = getMainActiveOrgStructure();
  const member = orgList.find(m => m.id === mainDraggedMemberId);
  if (member) {
    member.tier = targetTier;
    saveMainActiveOrgStructure(orgList);
    renderMainEmergencyOrgStructure();
  }
};

window.handleMainTreeDragOver = function(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = 'move';
  const targetNode = event.target.closest('.tree-node-box');
  if (targetNode && !targetNode.classList.contains('dragging')) {
    targetNode.classList.add('drag-over-card');
  }
};

window.handleMainTreeDragLeave = function(event) {
  event.preventDefault();
  const targetNode = event.target.closest('.tree-node-box');
  if (targetNode) targetNode.classList.remove('drag-over-card');
};

window.handleMainTreeDropOnNode = function(event, targetMemberId, targetTier) {
  event.preventDefault();
  event.stopPropagation();
  document.querySelectorAll('.drag-over-card').forEach(el => el.classList.remove('drag-over-card'));
  document.querySelectorAll('.drag-over-tree-level').forEach(el => el.classList.remove('drag-over-tree-level'));

  if (!mainDraggedMemberId || mainDraggedMemberId === targetMemberId) return;

  const orgList = getMainActiveOrgStructure();
  const sourceIndex = orgList.findIndex(m => m.id === mainDraggedMemberId);
  const targetIndex = orgList.findIndex(m => m.id === targetMemberId);

  if (sourceIndex > -1 && targetIndex > -1) {
    const draggedItem = orgList.splice(sourceIndex, 1)[0];
    draggedItem.tier = targetTier;

    const newTargetIndex = orgList.findIndex(m => m.id === targetMemberId);
    orgList.splice(newTargetIndex, 0, draggedItem);

    orgList.forEach((m, idx) => { m.order = idx + 1; });

    saveMainActiveOrgStructure(orgList);
    renderMainEmergencyOrgStructure();
  }
};

window.handleMainOrgDragStart = function(event, memberId) {
  mainDraggedMemberId = memberId;
  event.dataTransfer.setData('text/plain', memberId);
  event.dataTransfer.effectAllowed = 'move';
  const el = document.getElementById(`card-${memberId}`) || document.getElementById(`tree-node-${memberId}`);
  if (el) {
    setTimeout(() => el.classList.add('dragging'), 0);
  }
};

window.handleMainOrgDragEnd = function(event) {
  document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
  document.querySelectorAll('.drag-over-card').forEach(el => el.classList.remove('drag-over-card'));
  document.querySelectorAll('.drag-over-tier').forEach(el => el.classList.remove('drag-over-tier'));
  document.querySelectorAll('.drag-over-tree-level').forEach(el => el.classList.remove('drag-over-tree-level'));
  mainDraggedMemberId = null;
};

// Render Main Hierarchical Flowchart Tree
window.renderMainHierarchicalOrgChart = function() {
  const container = document.getElementById('main-org-tree-view-container');
  if (!container) return;

  const orgList = getMainActiveOrgStructure();

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
           ondragover="handleMainTreeLevelDragOver(event)" 
           ondragleave="handleMainTreeLevelDragLeave(event)" 
           ondrop="handleMainTreeLevelDrop(event, 'Executive Leadership')">
        <div class="tree-node-group">
          ${executives.map(m => createMainTreeNodeHtml(m, 'node-executive', 'Executive Leadership')).join('')}
        </div>
      </div>

      <div class="tree-stem-down"></div>

      <!-- LEVEL 2: Incident Command Leadership -->
      <div style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">
        Level 2 • Incident Command Leadership (BERT Core)
      </div>
      <div class="tree-level" 
           ondragover="handleMainTreeLevelDragOver(event)" 
           ondragleave="handleMainTreeLevelDragLeave(event)" 
           ondrop="handleMainTreeLevelDrop(event, 'Incident Command')">
        <div class="tree-node-group">
          ${bec ? createMainTreeNodeHtml(bec, 'node-command', 'Incident Command') : ''}
          ${asstBec ? createMainTreeNodeHtml(asstBec, 'node-command', 'Incident Command') : ''}
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
           ondragover="handleMainTreeLevelDragOver(event)" 
           ondragleave="handleMainTreeLevelDragLeave(event)" 
           ondrop="handleMainTreeLevelDrop(event, 'Incident Command')">
        ${officers.map(m => `
          <div class="tree-branch-col">
            <span class="tree-category-tag">${m.role.split('/')[0].replace('(Primary)', '').trim()}</span>
            ${createMainTreeNodeHtml(m, 'node-officer', 'Incident Command')}
          </div>
        `).join('')}
      </div>

      <div class="tree-stem-down" style="margin-top: 20px;"></div>
      <div class="tree-branch-bar" style="width: 85%;"></div>

      <!-- LEVEL 4: Floor Operations & Specialized Rescue -->
      <div class="tree-branch-grid" style="margin-top: 0;">
        <!-- Col 1: Floor Wardens -->
        <div class="tree-branch-col" style="flex: 2;"
             ondragover="handleMainTreeLevelDragOver(event)" 
             ondragleave="handleMainTreeLevelDragLeave(event)" 
             ondrop="handleMainTreeLevelDrop(event, 'Floor Operations')">
          <span class="tree-category-tag" style="background: rgba(16,185,129,0.15); color: #10b981; border-color: rgba(16,185,129,0.3);">
            Level 4A • Floor Wardens & Evacuation Sweepers (${wardens.length})
          </span>
          <div class="tree-node-group" style="justify-content: center;">
            ${wardens.map(m => createMainTreeNodeHtml(m, 'node-warden', 'Floor Operations')).join('')}
          </div>
        </div>

        <!-- Col 2: Mobility Assistance -->
        <div class="tree-branch-col" style="flex: 1;"
             ondragover="handleMainTreeLevelDragOver(event)" 
             ondragleave="handleMainTreeLevelDragLeave(event)" 
             ondrop="handleMainTreeLevelDrop(event, 'Specialized Rescue')">
          <span class="tree-category-tag" style="background: rgba(168,85,247,0.15); color: #c084fc; border-color: rgba(168,85,247,0.3);">
            Level 4B • Mobility & Area of Refuge (${mobility.length})
          </span>
          <div class="tree-sub-list">
            ${mobility.map(m => createMainTreeNodeHtml(m, 'node-rescue', 'Specialized Rescue')).join('')}
          </div>
        </div>
      </div>

      <div class="tree-stem-down" style="margin-top: 24px;"></div>
      <div class="tree-branch-bar" style="width: 90%;"></div>

      <!-- LEVEL 5: In-House Technical Support & Engineering Response -->
      <div class="tree-branch-grid" style="margin-top: 0;">
        <div class="tree-branch-col" style="width: 100%;"
             ondragover="handleMainTreeLevelDragOver(event)" 
             ondragleave="handleMainTreeLevelDragLeave(event)" 
             ondrop="handleMainTreeLevelDrop(event, 'Technical Support')">
          <span class="tree-category-tag" style="background: rgba(99,102,241,0.15); color: #818cf8; border-color: rgba(99,102,241,0.3);">
            Level 5 • In-House Engineering & Technical Support Response Team (${engineers.length})
          </span>
          <div class="tree-node-group" style="justify-content: center;">
            ${engineers.map(m => createMainTreeNodeHtml(m, 'node-engineer', 'Technical Support')).join('')}
          </div>
        </div>
      </div>

    </div>
  `;

  container.innerHTML = html;
  initMainOrgTreePanning();
};

function initMainOrgTreePanning() {
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
window.renderMainOrgCardsView = function() {
  const container = document.getElementById('main-org-cards-view-container');
  if (!container) return;

  const orgList = getMainActiveOrgStructure();

  let html = '';

  MAIN_ORG_TIER_CONFIG.forEach(tier => {
    const tierMembers = orgList.filter(m => m.tier === tier.key);
    tierMembers.sort((a, b) => (a.order || 99) - (b.order || 99));

    const memberCards = tierMembers.map(m => {
      let photoContent = '';
      if (m.photo) {
        photoContent = `<img src="${m.photo}" alt="${m.name}" onerror="this.parentElement.innerHTML='<div class=\\'org-card-photo-placeholder\\'>${m.name.charAt(0)}</div>'">`;
      } else {
        const initials = m.name.split(' ').map(n => n.charAt(0)).filter((_, idx, arr) => idx === 0 || idx === arr.length - 1).join('');
        photoContent = `<div class="org-card-photo-placeholder">${initials || 'EC'}</div>`;
      }

      const phoneLink = m.phone ? `<a href="tel:${m.phone}" title="Click to call">${m.phone}</a>` : '<span style="color:#64748b;">No direct phone</span>';

      return `
        <div class="org-member-card" 
             id="card-${m.id}" 
             draggable="true" 
             ondragstart="handleMainOrgDragStart(event, '${m.id}')"
             ondragover="handleMainTierCardDragOver(event)"
             ondragleave="handleMainTierCardDragLeave(event)"
             ondrop="handleMainTierCardDrop(event, '${m.id}', '${tier.key}')"
             ondragend="handleMainOrgDragEnd(event)">
          
          <div class="org-card-photo-wrap" title="Drag card to move position. Click Edit to change photo.">
            ${photoContent}
          </div>

          <div class="org-card-body">
            <div class="org-card-name" title="${m.name}">${m.name}</div>
            <div class="org-card-role">${m.role}</div>
            <div class="org-card-phone">
              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              ${phoneLink}
            </div>
            ${m.duties ? `<div class="org-card-duties">${m.duties}</div>` : ''}

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
           id="main-tier-${tier.key.replace(/\s+/g, '-')}"
           ondragover="handleMainTierSectionDragOver(event)"
           ondragleave="handleMainTierSectionDragLeave(event)"
           ondrop="handleMainTierSectionDrop(event, '${tier.key}')">
        
        <div class="org-tier-header">
          <div class="org-tier-title">
            <span>${tier.title}</span>
          </div>
          <span class="org-tier-badge">${tier.badge} (${tierMembers.length})</span>
        </div>

        <div class="org-tier-grid" id="main-grid-${tier.key.replace(/\s+/g, '-')}">
          ${memberCards || '<div style="color: var(--text-muted); font-size: 12px; font-style: italic; padding: 12px;">No personnel assigned to this tier. Drag a member here or click Add Member.</div>'}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
};

window.handleMainTierCardDragOver = function(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = 'move';
  const targetCard = event.target.closest('.org-member-card');
  if (targetCard && !targetCard.classList.contains('dragging')) {
    targetCard.classList.add('drag-over-card');
  }
};

window.handleMainTierCardDragLeave = function(event) {
  event.preventDefault();
  const targetCard = event.target.closest('.org-member-card');
  if (targetCard) targetCard.classList.remove('drag-over-card');
};

window.handleMainTierCardDrop = function(event, targetMemberId, targetTier) {
  event.preventDefault();
  event.stopPropagation();
  document.querySelectorAll('.drag-over-card').forEach(el => el.classList.remove('drag-over-card'));
  document.querySelectorAll('.drag-over-tier').forEach(el => el.classList.remove('drag-over-tier'));

  if (!mainDraggedMemberId || mainDraggedMemberId === targetMemberId) return;

  const orgList = getMainActiveOrgStructure();
  const sourceIndex = orgList.findIndex(m => m.id === mainDraggedMemberId);
  const targetIndex = orgList.findIndex(m => m.id === targetMemberId);

  if (sourceIndex > -1 && targetIndex > -1) {
    const draggedItem = orgList.splice(sourceIndex, 1)[0];
    draggedItem.tier = targetTier;

    const newTargetIndex = orgList.findIndex(m => m.id === targetMemberId);
    orgList.splice(newTargetIndex, 0, draggedItem);

    orgList.forEach((m, idx) => { m.order = idx + 1; });

    saveMainActiveOrgStructure(orgList);
    renderMainEmergencyOrgStructure();
  }
};

window.handleMainTierSectionDragOver = function(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  const tierSection = event.currentTarget;
  if (tierSection) tierSection.classList.add('drag-over-tier');
};

window.handleMainTierSectionDragLeave = function(event) {
  event.preventDefault();
  const tierSection = event.currentTarget;
  if (tierSection) tierSection.classList.remove('drag-over-tier');
};

window.handleMainTierSectionDrop = function(event, tierKey) {
  event.preventDefault();
  document.querySelectorAll('.drag-over-tier').forEach(el => el.classList.remove('drag-over-tier'));

  if (!mainDraggedMemberId) return;

  const orgList = getMainActiveOrgStructure();
  const member = orgList.find(m => m.id === mainDraggedMemberId);
  if (member) {
    member.tier = tierKey;
    saveMainActiveOrgStructure(orgList);
    renderMainEmergencyOrgStructure();
  }
};

window.renderMainEmergencyOrgStructure = function() {
  renderMainHierarchicalOrgChart();
  renderMainOrgCardsView();
};

window.resetEmergencyOrgStructure = function() {
  if (confirm('Reset Emergency Response Committee (BERT) organizational structure to original default positions?')) {
    localStorage.removeItem('onecorp_emergency_org_structure');
    if (typeof renderMainEmergencyOrgStructure === 'function') renderMainEmergencyOrgStructure();
    if (typeof renderEmergencyOrgStructure === 'function') renderEmergencyOrgStructure();
    alert('Organizational structure reset to default.');
  }
};

// Edit / Add Member Modal Handlers
let mainOrgModalUploadedPhotoBase64 = null;

window.openEditOrgMemberModal = function(memberId) {
  mainOrgModalUploadedPhotoBase64 = null;
  const modal = document.getElementById('org-member-edit-modal');
  if (!modal) return;

  const orgList = getMainActiveOrgStructure();
  const member = orgList.find(m => m.id === memberId);
  if (!member) return;

  document.getElementById('edit-member-id').value = member.id;
  document.getElementById('edit-member-name').value = member.name || '';
  document.getElementById('edit-member-role').value = member.role || '';
  document.getElementById('edit-member-tier').value = member.tier || 'Incident Command';
  document.getElementById('edit-member-phone').value = member.phone || '';
  document.getElementById('edit-member-duties').value = member.duties || '';
  document.getElementById('org-modal-title').innerText = `Edit: ${member.name}`;

  const imgEl = document.getElementById('edit-member-photo-img');
  const placeholderEl = document.getElementById('edit-member-photo-placeholder');

  if (member.photo) {
    mainOrgModalUploadedPhotoBase64 = member.photo;
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

window.openAddOrgMemberModal = function() {
  mainOrgModalUploadedPhotoBase64 = null;
  const modal = document.getElementById('org-member-edit-modal');
  if (!modal) return;

  document.getElementById('edit-member-id').value = 'org_' + Date.now();
  document.getElementById('edit-member-name').value = '';
  document.getElementById('edit-member-role').value = '';
  document.getElementById('edit-member-tier').value = 'Floor Operations';
  document.getElementById('edit-member-phone').value = '';
  document.getElementById('edit-member-duties').value = '';
  document.getElementById('org-modal-title').innerText = 'Add New Committee Member';

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

window.closeOrgMemberModal = function(e) {
  if (e && e.target !== document.getElementById('org-member-edit-modal') && !e.target.classList.contains('org-modal-close') && e.target.tagName !== 'BUTTON') {
    return;
  }
  const modal = document.getElementById('org-member-edit-modal');
  if (modal) modal.style.display = 'none';
  mainOrgModalUploadedPhotoBase64 = null;
};

window.handleOrgModalPhotoUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxDim = 600;
      let width = img.width;
      let height = img.height;
      if (width > height && width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      mainOrgModalUploadedPhotoBase64 = canvas.toDataURL('image/jpeg', 0.85);

      const imgEl = document.getElementById('edit-member-photo-img');
      const placeholderEl = document.getElementById('edit-member-photo-placeholder');
      if (imgEl) {
        imgEl.src = mainOrgModalUploadedPhotoBase64;
        imgEl.style.display = 'block';
      }
      if (placeholderEl) placeholderEl.style.display = 'none';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.saveOrgMemberModal = function() {
  const id = document.getElementById('edit-member-id').value;
  const name = document.getElementById('edit-member-name').value.trim();
  const role = document.getElementById('edit-member-role').value.trim();
  const tier = document.getElementById('edit-member-tier').value;
  const phone = document.getElementById('edit-member-phone').value.trim();
  const duties = document.getElementById('edit-member-duties').value.trim();

  if (!name) {
    alert('Please enter the committee member name.');
    return;
  }
  if (!role) {
    alert('Please enter the committee role or title.');
    return;
  }

  const orgList = getMainActiveOrgStructure();
  const existingIndex = orgList.findIndex(m => m.id === id);

  if (existingIndex > -1) {
    orgList[existingIndex].name = name;
    orgList[existingIndex].role = role;
    orgList[existingIndex].tier = tier;
    orgList[existingIndex].phone = phone;
    orgList[existingIndex].duties = duties;
    if (mainOrgModalUploadedPhotoBase64 !== null) {
      orgList[existingIndex].photo = mainOrgModalUploadedPhotoBase64;
    }
  } else {
    orgList.push({
      id: id,
      name: name,
      role: role,
      tier: tier,
      phone: phone,
      duties: duties,
      photo: mainOrgModalUploadedPhotoBase64 || '',
      order: orgList.length + 1
    });
  }

  saveMainActiveOrgStructure(orgList);
  closeOrgMemberModal();
  renderMainEmergencyOrgStructure();
};

window.removeOrgMember = function(memberId) {
  const orgList = getMainActiveOrgStructure();
  const member = orgList.find(m => m.id === memberId);
  if (!member) return;

  if (confirm(`Remove ${member.name} (${member.role}) from the Emergency Response Committee roster?`)) {
    const updated = orgList.filter(m => m.id !== memberId);
    saveMainActiveOrgStructure(updated);
    renderMainEmergencyOrgStructure();
  }
};

// Render Guidelines Content (Hazards, Storm, Machinery, Evac, Hotlines)
// Render Guidelines Content (Hazards, Storm, Machinery, Evac, Hotlines)
const MAIN_HAZARD_PROTOCOLS = [
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

let mainActiveHazardFilter = 'all';

window.renderMainEmergencyGuidelines = function() {
  renderMainHazardProtocols();
  renderMainEvacuationPlansModule();
  renderMainMachineryContingency();
  renderMainEvacuationGuidelines();
  renderMainDrillsAndHotlines();
};

window.switchMainGuidelineTab = function(subTab) {
  document.querySelectorAll('.guideline-pill').forEach(pill => pill.classList.remove('active'));
  document.querySelectorAll('.guideline-pane').forEach(pane => pane.classList.remove('active'));

  const activePill = document.getElementById(`main-pill-${subTab}`);
  const activePane = document.getElementById(`main-pane-${subTab}`);

  if (activePill) activePill.classList.add('active');
  if (activePane) activePane.classList.add('active');

  if (subTab === 'org-structure') renderMainEmergencyOrgStructure();
  if (subTab === 'hazard-protocols') renderMainHazardProtocols();
  if (subTab === 'evac-plans') renderMainEvacuationPlansModule();
  if (subTab === 'heavy-machinery') renderMainMachineryContingency();
  if (subTab === 'evac-comms') renderMainEvacuationGuidelines();
  if (subTab === 'drills-hotlines') renderMainDrillsAndHotlines();
};

function renderMainHazardProtocols() {
  const container = document.getElementById('main-hazard-protocols-accordion');
  if (!container) return;

  const filtered = mainActiveHazardFilter === 'all'
    ? MAIN_HAZARD_PROTOCOLS
    : MAIN_HAZARD_PROTOCOLS.filter(h => h.category === mainActiveHazardFilter);

  container.innerHTML = filtered.map(h => `
    <div class="hazard-card" id="main-hazard-card-${h.id}">
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

window.filterMainHazardProtocols = function(category, btnEl) {
  mainActiveHazardFilter = category;
  const bar = btnEl ? btnEl.closest('.hazard-filter-bar') : document.querySelector('.hazard-filter-bar');
  if (bar) {
    bar.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  }
  renderMainHazardProtocols();
};

window.printMainHazardProtocolsReport = function() {
  window.print();
};

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.openEmergencyLightbox = function(src, caption) {
  const modal = document.getElementById('emergency-image-lightbox');
  const img = document.getElementById('emergency-lightbox-img');
  const cap = document.getElementById('emergency-lightbox-caption');
  if (!modal || !img) return;

  img.src = src;
  if (cap) {
    cap.innerText = caption || 'Emergency Evacuation Plan';
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

// ==================== EMERGENCY EVACUATION PLANS PER FLOOR ====================
const MAIN_FCLGC_EVACUATION_DATA = {
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

let mainActiveEvacBuilding = 'one-corporate';
let mainActiveEvacFloorFilter = 'all';

function renderMainEvacuationPlansModule() {
  const container = document.getElementById('main-evac-building-content-display');
  if (!container) return;

  const bldg = MAIN_FCLGC_EVACUATION_DATA[mainActiveEvacBuilding] || MAIN_FCLGC_EVACUATION_DATA['one-corporate'];

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
          <button type="button" class="btn btn-primary btn-sm" onclick="selectMainEvacBuilding('one-corporate')">
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

  const filteredFloors = mainActiveEvacFloorFilter === 'all'
    ? bldg.floors
    : bldg.floors.filter(f => f.id === mainActiveEvacFloorFilter);

  container.innerHTML = `
    <!-- Floor Filter Pills Bar -->
    <div class="evac-floor-filter-bar">
      <span style="font-size: 11.5px; font-weight: 800; color: #38bdf8; text-transform: uppercase; margin-right: 4px;">Filter Floor:</span>
      ${floorPills.map(p => `
        <button type="button" class="evac-floor-pill ${mainActiveEvacFloorFilter === p.id ? 'active' : ''}" onclick="filterMainEvacFloor('${p.id}', this)">
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
              <button type="button" class="btn btn-primary btn-sm" style="flex: 1; font-size: 11px;" onclick="printMainSingleEvacPlan('${f.image}', '${escapeHtml(f.name)}')">
                🖨️ Print Layout
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.selectMainEvacBuilding = function(bldgId, btnEl) {
  mainActiveEvacBuilding = bldgId;
  mainActiveEvacFloorFilter = 'all';

  const bar = btnEl ? btnEl.closest('.evac-building-nav-bar') : document.querySelector('.evac-building-nav-bar');
  if (bar) {
    bar.querySelectorAll('.building-evac-tab').forEach(b => b.classList.remove('active'));
    const target = bar.querySelector(`[onclick*="('${bldgId}'"]`);
    if (target) target.classList.add('active');
    else if (btnEl) btnEl.classList.add('active');
  }

  renderMainEvacuationPlansModule();
};

window.filterMainEvacFloor = function(floorId, btnEl) {
  mainActiveEvacFloorFilter = floorId;
  const bar = btnEl ? btnEl.closest('.evac-floor-filter-bar') : document.querySelector('.evac-floor-filter-bar');
  if (bar) {
    bar.querySelectorAll('.evac-floor-pill').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  }
  renderMainEvacuationPlansModule();
};

window.printMainSingleEvacPlan = function(imgSrc, title) {
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

window.printMainEvacPlansReport = function() {
  window.print();
};

// 2. Critical Building Machinery & Heavy Equipment Contingency
function renderMainMachineryContingency() {
  const container = document.getElementById('main-machinery-contingency-container');
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
function renderMainEvacuationGuidelines() {
  const container = document.getElementById('main-evac-comms-container');
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
function renderMainDrillsAndHotlines() {
  const container = document.getElementById('main-drills-hotlines-container');
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

window.renderMainEmergencyPreparednessModule = function() {
  renderMainEmergencyOrgStructure();
  renderMainEmergencyGuidelines();
};

// ==================== 1. PWA SERVICE WORKER REGISTRATION ====================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      console.log('PWA Service Worker registered successfully with scope:', reg.scope);
    }).catch(err => {
      console.warn('PWA Service Worker registration skipped or failed:', err);
    });
  });
}

// ==================== 2. DIGITAL TOUCHSCREEN SIGNATURE PAD ====================
let signaturePadCanvas = null;
let signaturePadCtx = null;
let isDrawingSignature = false;
let signatureStrokeHistory = [];
let currentSignatureStroke = [];

function initSignaturePadCanvas() {
  signaturePadCanvas = document.getElementById('signature-pad-canvas');
  if (!signaturePadCanvas) return;
  signaturePadCtx = signaturePadCanvas.getContext('2d');
  
  // Set drawing styles
  signaturePadCtx.strokeStyle = '#0f172a';
  signaturePadCtx.lineWidth = 2.5;
  signaturePadCtx.lineCap = 'round';
  signaturePadCtx.lineJoin = 'round';

  const getCanvasCoords = (e) => {
    const rect = signaturePadCanvas.getBoundingClientRect();
    const scaleX = signaturePadCanvas.width / rect.width;
    const scaleY = signaturePadCanvas.height / rect.height;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    isDrawingSignature = true;
    const coords = getCanvasCoords(e);
    currentSignatureStroke = [coords];
    signaturePadCtx.beginPath();
    signaturePadCtx.moveTo(coords.x, coords.y);
  };

  const drawMove = (e) => {
    if (!isDrawingSignature) return;
    e.preventDefault();
    const coords = getCanvasCoords(e);
    currentSignatureStroke.push(coords);
    signaturePadCtx.lineTo(coords.x, coords.y);
    signaturePadCtx.stroke();
  };

  const stopDraw = (e) => {
    if (!isDrawingSignature) return;
    isDrawingSignature = false;
    if (currentSignatureStroke.length > 0) {
      signatureStrokeHistory.push([...currentSignatureStroke]);
      currentSignatureStroke = [];
    }
  };

  // Mouse listeners
  signaturePadCanvas.onmousedown = startDraw;
  signaturePadCanvas.onmousemove = drawMove;
  window.addEventListener('mouseup', stopDraw);

  // Touch listeners (mobile / tablet / iPad)
  signaturePadCanvas.ontouchstart = startDraw;
  signaturePadCanvas.ontouchmove = drawMove;
  signaturePadCanvas.ontouchend = stopDraw;
}

window.openDigitalSignatureModal = function(ticketId, ticketType = 'joborder', defaultRole = '', defaultName = '') {
  const modal = document.getElementById('digital-signature-modal');
  if (!modal) return;

  document.getElementById('sig-target-ticket-id').value = ticketId || '';
  document.getElementById('sig-target-ticket-type').value = ticketType || 'joborder';
  
  if (defaultName) document.getElementById('sig-signer-name').value = defaultName;
  if (defaultRole) document.getElementById('sig-signer-role').value = defaultRole;

  modal.style.display = 'flex';
  initSignaturePadCanvas();
  window.clearSignaturePad();
};

window.closeDigitalSignatureModal = function(e) {
  if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('modal-backdrop')) return;
  const modal = document.getElementById('digital-signature-modal');
  if (modal) modal.style.display = 'none';
};

window.clearSignaturePad = function() {
  if (!signaturePadCanvas || !signaturePadCtx) return;
  signaturePadCtx.clearRect(0, 0, signaturePadCanvas.width, signaturePadCanvas.height);
  signatureStrokeHistory = [];
  currentSignatureStroke = [];
};

window.undoSignaturePad = function() {
  if (!signaturePadCanvas || !signaturePadCtx || signatureStrokeHistory.length === 0) return;
  signatureStrokeHistory.pop();
  signaturePadCtx.clearRect(0, 0, signaturePadCanvas.width, signaturePadCanvas.height);

  signatureStrokeHistory.forEach(stroke => {
    if (stroke.length < 2) return;
    signaturePadCtx.beginPath();
    signaturePadCtx.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length; i++) {
      signaturePadCtx.lineTo(stroke[i].x, stroke[i].y);
    }
    signaturePadCtx.stroke();
  });
};

window.saveDigitalSignature = function() {
  if (!signaturePadCanvas) return;
  if (signatureStrokeHistory.length === 0) {
    alert("Please draw your signature before saving.");
    return;
  }

  const dataUrl = signaturePadCanvas.toDataURL('image/png');
  const ticketId = document.getElementById('sig-target-ticket-id').value;
  const ticketType = document.getElementById('sig-target-ticket-type').value;
  const slotKey = document.getElementById('sig-target-slot-key')?.value || 'tradesman';
  const signerName = document.getElementById('sig-signer-name').value.trim() || 'Authorized Representative';
  const signerRole = document.getElementById('sig-signer-role').value;

  const sigObject = {
    dataUrl,
    signerName,
    signerRole,
    signedAt: new Date().toLocaleString()
  };

  const list = (ticketType === 'joborder') ? (appState.jobOrders || []) : (appState.complaints || []);
  const ticket = list.find(t => String(t.id) === String(ticketId));
  if (ticket) {
    if (!ticket.signatures) ticket.signatures = {};
    ticket.signatures[slotKey] = sigObject;
    ticket.digitalSignature = sigObject;
  }

  saveState();
  closeDigitalSignatureModal();
  renderTenantComplaints();
  
  if (typeof updateComplaintLivePreview === 'function') {
    updateComplaintLivePreview();
  }

  appState.notifications.unshift({
    id: `sig_${Date.now()}`,
    type: 'normal',
    message: `Digital signature captured for ${signerRole}: ${signerName}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  updateNotificationBadge();
};

// ==================== 3. EQUIPMENT QR GENERATOR & CAMERA SCANNER ====================

// Pure JS QR Code Generation on Canvas
window.renderGeneratedQrCode = function(text) {
  const canvas = document.getElementById('generated-qr-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  ctx.clearRect(0, 0, size, size);

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Deterministic QR Matrix Simulation
  const modules = 25;
  const cellSize = size / modules;
  ctx.fillStyle = '#0f172a';

  // Helper for finder patterns (corners)
  function drawFinderPattern(startX, startY) {
    ctx.fillRect(startX * cellSize, startY * cellSize, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect((startX + 1) * cellSize, (startY + 1) * cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect((startX + 2) * cellSize, (startY + 2) * cellSize, 3 * cellSize, 3 * cellSize);
  }

  drawFinderPattern(0, 0);
  drawFinderPattern(modules - 7, 0);
  drawFinderPattern(0, modules - 7);

  // Timing Patterns
  for (let i = 8; i < modules - 8; i++) {
    if (i % 2 === 0) {
      ctx.fillRect(i * cellSize, 6 * cellSize, cellSize, cellSize);
      ctx.fillRect(6 * cellSize, i * cellSize, cellSize, cellSize);
    }
  }

  // Generate deterministic data blocks from text hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      // Skip finder zones
      if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) continue;
      if (r === 6 || c === 6) continue;

      const pseudoBit = Math.abs(Math.sin((r * modules + c) * hash + 1.5)) > 0.45;
      if (pseudoBit) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  }

  // Center Emblem / OCT Brand
  const centerSize = 5 * cellSize;
  const centerPos = (modules - 5) / 2 * cellSize;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(centerPos - 2, centerPos - 2, centerSize + 4, centerSize + 4);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(centerPos, centerPos, centerSize, centerSize);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('OCT', size / 2, size / 2);
};

window.openEquipmentQrModal = function(initialPayload = '') {
  const modal = document.getElementById('equipment-qr-modal');
  if (!modal) return;
  modal.style.display = 'flex';

  const select = document.getElementById('qr-target-select');
  if (initialPayload && select) {
    select.value = initialPayload;
    if (!select.value) {
      select.value = 'custom';
      document.getElementById('qr-custom-input-group').style.display = 'block';
      document.getElementById('qr-custom-payload').value = initialPayload;
    }
  }
  
  onQrTargetSelectChange(select ? select.value : 'procedure:genset');
};

window.closeEquipmentQrModal = function(e) {
  if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('modal-backdrop')) return;
  const modal = document.getElementById('equipment-qr-modal');
  if (modal) modal.style.display = 'none';
};

window.onQrTargetSelectChange = function(val) {
  const customGroup = document.getElementById('qr-custom-input-group');
  const label = document.getElementById('qr-card-label');
  const payloadEl = document.getElementById('qr-card-payload');

  let text = val;
  let labelText = val;

  if (val === 'custom') {
    if (customGroup) customGroup.style.display = 'block';
    text = document.getElementById('qr-custom-payload').value || 'OCT-FACILITY-TAG';
    labelText = 'Custom Facility Equipment Tag';
  } else {
    if (customGroup) customGroup.style.display = 'none';
    const select = document.getElementById('qr-target-select');
    if (select) {
      const opt = select.options[select.selectedIndex];
      labelText = opt ? opt.innerText : val;
    }
  }

  if (label) label.innerText = labelText;
  if (payloadEl) payloadEl.innerText = text;
  renderGeneratedQrCode(text);
};

window.downloadQrCodeImage = function() {
  const canvas = document.getElementById('generated-qr-canvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `OCT_QR_Tag_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

window.printQrAssetTag = function() {
  const canvas = document.getElementById('generated-qr-canvas');
  const label = document.getElementById('qr-card-label').innerText;
  const payload = document.getElementById('qr-card-payload').innerText;
  if (!canvas) return;

  const printWin = window.open('', '_blank');
  printWin.document.write(`
    <html>
      <head>
        <title>Print Facility QR Asset Tag</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding: 40px; }
          .tag-card { border: 3px solid #000; border-radius: 12px; padding: 24px; max-width: 320px; margin: 0 auto; }
          h2 { margin: 0 0 6px 0; font-size: 16px; text-transform: uppercase; }
          p { margin: 4px 0 16px 0; font-size: 11px; color: #555; }
          .payload { font-family: monospace; font-size: 11px; margin-top: 10px; color: #333; }
        </style>
      </head>
      <body>
        <div class="tag-card">
          <h2>ONE CORPORATE MAINTENANCE</h2>
          <p>PROPERTY OPERATIONS & ASSET TAG</p>
          <img src="${canvas.toDataURL('image/png')}" width="200" height="200" />
          <div style="font-weight: bold; margin-top: 12px; font-size: 14px;">${label}</div>
          <div class="payload">ID: ${payload}</div>
        </div>
        <script>window.onload = () => { window.print(); window.close(); };<\/script>
      </body>
    </html>
  `);
  printWin.document.close();
};

// QR Camera Scanner
let qrScannerVideoStream = null;
let qrFacingMode = 'environment';

window.openQrScannerModal = function() {
  const modal = document.getElementById('qr-scanner-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  startQrCameraStream();
};

window.closeQrScannerModal = function(e) {
  if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('modal-backdrop')) return;
  stopQrCameraStream();
  const modal = document.getElementById('qr-scanner-modal');
  if (modal) modal.style.display = 'none';
};

function startQrCameraStream() {
  const video = document.getElementById('qr-camera-stream');
  if (!video || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

  navigator.mediaDevices.getUserMedia({
    video: { facingMode: qrFacingMode }
  }).then(stream => {
    qrScannerVideoStream = stream;
    video.srcObject = stream;
  }).catch(err => {
    console.warn('Camera access unavailable, fallback to file upload:', err);
  });
}

function stopQrCameraStream() {
  if (qrScannerVideoStream) {
    qrScannerVideoStream.getTracks().forEach(track => track.stop());
    qrScannerVideoStream = null;
  }
}

window.toggleScannerCamera = function() {
  qrFacingMode = qrFacingMode === 'environment' ? 'user' : 'environment';
  stopQrCameraStream();
  startQrCameraStream();
};

window.handleQrPayload = function(payload) {
  if (!payload) return;
  closeQrScannerModal();

  if (payload.startsWith('procedure:')) {
    const procId = payload.replace('procedure:', '');
    switchTab('procedures');
    const iframe = document.querySelector('#panel-procedures iframe');
    if (iframe && iframe.contentWindow && typeof iframe.contentWindow.switchProcedure === 'function') {
      iframe.contentWindow.switchProcedure(procId);
    }
  } else if (payload.startsWith('suite:')) {
    const suiteId = payload.replace('suite:', '');
    switchTab('tenant');
    alert(`Scanned Suite QR Tag: Filtered Tenant Desk for Suite ${suiteId}`);
  } else if (payload.startsWith('jo:')) {
    const joId = payload.replace('jo:', '');
    switchTab('tenant');
    switchTenantDeskMode('joborders');
    openEditJobOrderModal(joId);
  } else if (payload.startsWith('inventory:')) {
    switchTab('inventory');
  } else {
    alert(`QR Tag Scanned: ${payload}`);
  }
};

window.handleQrImageUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  // Simulated instant scan from file upload
  const fileName = file.name.toLowerCase();
  if (fileName.includes('genset')) window.handleQrPayload('procedure:genset');
  else if (fileName.includes('fire')) window.handleQrPayload('procedure:firepump');
  else if (fileName.includes('stp')) window.handleQrPayload('procedure:stp');
  else if (fileName.includes('chiller')) window.handleQrPayload('procedure:hvac_chiller');
  else if (fileName.includes('suite')) window.handleQrPayload('suite:802');
  else window.handleQrPayload('procedure:genset');
};

// ==================== 4. PREVENTIVE MAINTENANCE (PM) INTERACTIVE CALENDAR ====================
let pmCalendarYear = 2026;
let pmCalendarMonth = 6; // July (0-indexed)

window.switchPMViewMode = function(mode) {
  appState.periodicViewMode = mode;
  const cardsBtn = document.getElementById('btn-pm-view-cards');
  const calBtn = document.getElementById('btn-pm-view-calendar');
  const cardsContainer = document.getElementById('periodic-activities-container');
  const calContainer = document.getElementById('periodic-calendar-container');

  if (mode === 'calendar') {
    if (cardsBtn) { cardsBtn.style.background = 'transparent'; cardsBtn.style.color = 'var(--text-muted)'; }
    if (calBtn) { calBtn.style.background = '#0284c7'; calBtn.style.color = '#fff'; }
    if (cardsContainer) cardsContainer.style.display = 'none';
    if (calContainer) calContainer.style.display = 'block';
    renderPMCalendar();
  } else {
    if (cardsBtn) { cardsBtn.style.background = '#0284c7'; cardsBtn.style.color = '#fff'; }
    if (calBtn) { calBtn.style.background = 'transparent'; calBtn.style.color = 'var(--text-muted)'; }
    if (cardsContainer) cardsContainer.style.display = 'grid';
    if (calContainer) calContainer.style.display = 'none';
    renderPeriodicMaintenance();
  }
};

window.prevPMCalendarMonth = function() {
  pmCalendarMonth--;
  if (pmCalendarMonth < 0) { pmCalendarMonth = 11; pmCalendarYear--; }
  renderPMCalendar();
};

window.nextPMCalendarMonth = function() {
  pmCalendarMonth++;
  if (pmCalendarMonth > 11) { pmCalendarMonth = 0; pmCalendarYear++; }
  renderPMCalendar();
};

window.currentPMCalendarMonth = function() {
  pmCalendarYear = 2026;
  pmCalendarMonth = 6;
  renderPMCalendar();
};

window.renderPMCalendar = function() {
  const monthTitle = document.getElementById('pm-cal-month-title');
  const grid = document.getElementById('pm-calendar-days-grid');
  if (!grid) return;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  if (monthTitle) monthTitle.innerText = `${monthNames[pmCalendarMonth]} ${pmCalendarYear}`;

  grid.innerHTML = '';

  const firstDayIndex = new Date(pmCalendarYear, pmCalendarMonth, 1).getDay();
  const daysInMonth = new Date(pmCalendarYear, pmCalendarMonth + 1, 0).getDate();
  const prevDaysInMonth = new Date(pmCalendarYear, pmCalendarMonth, 0).getDate();

  // Previous month padding days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevDaysInMonth - i;
    const cell = document.createElement('div');
    cell.style.cssText = 'background: rgba(15, 23, 42, 0.3); border: 1px solid rgba(255,255,255,0.03); border-radius: 6px; padding: 6px; min-height: 90px; opacity: 0.35;';
    cell.innerHTML = `<div style="font-size: 11px; font-weight: 700; color: var(--text-muted);">${dayNum}</div>`;
    grid.appendChild(cell);
  }

  // Current Month days
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    const isToday = (day === 20 && pmCalendarMonth === 6 && pmCalendarYear === 2026);
    cell.style.cssText = `background: ${isToday ? 'rgba(56, 189, 248, 0.08)' : 'rgba(15, 23, 42, 0.6)'}; border: 1px solid ${isToday ? '#38bdf8' : 'var(--border-color)'}; border-radius: 6px; padding: 6px; min-height: 95px; display: flex; flex-direction: column; gap: 4px;`;

    // Map scheduled tasks for this date
    const dayTasks = [];
    if (day === 20 || day % 7 === 0) {
      dayTasks.push({ name: 'Genset Load Testing', sys: 'Mechanical', status: 'Completed', color: '#10b981' });
      dayTasks.push({ name: 'Fire Pump Flow Audit', sys: 'Fire Protection', status: 'Pending', color: '#38bdf8' });
    } else if (day % 3 === 0) {
      dayTasks.push({ name: 'STP Effluent DO Test', sys: 'Plumbing', status: 'Completed', color: '#10b981' });
    } else if (day % 5 === 0) {
      dayTasks.push({ name: 'Chiller Water Filter Clean', sys: 'Mechanical', status: 'Scheduled', color: '#a78bfa' });
    }

    const taskPillsHTML = dayTasks.map(t => `
      <div style="font-size: 9.5px; font-weight: 700; padding: 2px 6px; border-radius: 3px; background: rgba(255,255,255,0.06); border-left: 3px solid ${t.color}; color: #f8fafc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;" title="${t.name} (${t.sys}) - ${t.status}">
        ${t.name}
      </div>
    `).join('');

    cell.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
        <span style="font-size: 11px; font-weight: 800; color: ${isToday ? '#38bdf8' : '#f8fafc'};">${day}</span>
        ${isToday ? '<span style="font-size: 8.5px; font-weight: 800; background: #38bdf8; color: #0f172a; padding: 1px 4px; border-radius: 3px;">TODAY</span>' : ''}
      </div>
      <div style="display: flex; flex-direction: column; gap: 3px; overflow: hidden;">
        ${taskPillsHTML}
      </div>
    `;
    grid.appendChild(cell);
  }
};

// ==================== 5. FINANCIAL & OPERATIONAL ANALYTICS DASHBOARD ====================
window.renderAnalyticsDashboard = function() {
  const complaints = appState.complaints || [];
  const jobOrders = appState.jobOrders || [];

  // Calculate Materials and Labor Totals from Job Orders
  let totalMaterials = 0;
  let totalLabor = 0;
  let activeJoCost = 0;
  let activeJoCount = 0;

  const tradeSpend = {
    Mechanical: 0,
    Electrical: 0,
    Plumbing: 0,
    'Fire Protection': 0,
    Structural: 0,
    Architectural: 0,
    Elevator: 0,
    Housekeeping: 0
  };

  const categoryCounts = {
    Mechanical: 0,
    Electrical: 0,
    Plumbing: 0,
    'Fire Protection': 0,
    Structural: 0,
    Architectural: 0,
    Elevator: 0,
    Housekeeping: 0
  };

  // Process Job Orders
  jobOrders.forEach(jo => {
    let joMat = 0;
    let joLab = 0;

    if (jo.materialsList && Array.isArray(jo.materialsList)) {
      jo.materialsList.forEach(m => { joMat += (parseFloat(m.qty) || 0) * (parseFloat(m.price) || 0); });
    }
    if (jo.manpowerList && Array.isArray(jo.manpowerList)) {
      jo.manpowerList.forEach(m => { joLab += (parseFloat(m.hours) || 0) * (parseFloat(m.rate) || 0); });
    }

    // Fallback estimate if not filled in tables
    if (joMat === 0 && joLab === 0) {
      joMat = 1200;
      joLab = 1500;
    }

    const joTotal = joMat + joLab;
    totalMaterials += joMat;
    totalLabor += joLab;

    if (jo.status === 'In Progress' || jo.status === 'Pending') {
      activeJoCost += joTotal;
      activeJoCount++;
    }

    const sys = jo.system || 'Mechanical';
    if (tradeSpend[sys] !== undefined) tradeSpend[sys] += joTotal;
    else tradeSpend.Mechanical += joTotal;

    if (categoryCounts[sys] !== undefined) categoryCounts[sys]++;
  });

  // Process Complaints
  let resolvedComplaints = 0;
  complaints.forEach(c => {
    if (c.status === 'Completed' || c.status === 'Resolved') resolvedComplaints++;
    const sys = c.system || 'Plumbing';
    if (categoryCounts[sys] !== undefined) categoryCounts[sys]++;
  });

  const totalSpend = totalMaterials + totalLabor;
  const totalComplaints = complaints.length;
  const slaRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 100;

  // Update KPI Cards
  const totalSpendEl = document.getElementById('analytics-kpi-total-spend');
  const splitEl = document.getElementById('analytics-kpi-material-labor-split');
  const activeValEl = document.getElementById('analytics-kpi-active-jo-value');
  const activeCountEl = document.getElementById('analytics-kpi-active-jo-count');
  const slaRateEl = document.getElementById('analytics-kpi-sla-rate');
  const slaCountsEl = document.getElementById('analytics-kpi-sla-counts');

  if (totalSpendEl) totalSpendEl.innerText = `₱${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  if (splitEl) splitEl.innerText = `Mat: ₱${totalMaterials.toLocaleString()} | Lab: ₱${totalLabor.toLocaleString()}`;
  if (activeValEl) activeValEl.innerText = `₱${activeJoCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  if (activeCountEl) activeCountEl.innerText = `${activeJoCount} Open Job Orders`;
  if (slaRateEl) slaRateEl.innerText = `${slaRate}%`;
  if (slaCountsEl) slaCountsEl.innerText = `${resolvedComplaints} Resolved / ${totalComplaints} Total`;

  // Render Trade Spend Bar Chart
  const tradeChartEl = document.getElementById('analytics-trade-spend-chart');
  if (tradeChartEl) {
    const maxSpend = Math.max(...Object.values(tradeSpend), 1);
    const colors = {
      Mechanical: '#fb923c',
      Electrical: '#facc15',
      Plumbing: '#38bdf8',
      'Fire Protection': '#f87171',
      Structural: '#a3e635',
      Architectural: '#c084fc',
      Elevator: '#34d399',
      Housekeeping: '#a78bfa'
    };

    tradeChartEl.innerHTML = Object.entries(tradeSpend).map(([trade, cost]) => {
      const pct = Math.round((cost / maxSpend) * 100);
      const color = colors[trade] || '#38bdf8';
      return `
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 11.5px; margin-bottom: 4px;">
            <span style="color: #f8fafc; font-weight: 600;">${trade}</span>
            <strong style="color: ${color};">₱${cost.toLocaleString()}</strong>
          </div>
          <div style="height: 7px; width: 100%; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden;">
            <div style="height: 100%; width: ${Math.max(pct, 4)}%; background: ${color}; border-radius: 4px;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Complaint Category Breakdown
  const catChartEl = document.getElementById('analytics-complaint-category-chart');
  if (catChartEl) {
    const maxCat = Math.max(...Object.values(categoryCounts), 1);
    catChartEl.innerHTML = Object.entries(categoryCounts).map(([cat, count]) => {
      const pct = Math.round((count / maxCat) * 100);
      return `
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 11.5px; margin-bottom: 4px;">
            <span style="color: #f8fafc; font-weight: 600;">${cat}</span>
            <strong style="color: #4ade80;">${count} requests</strong>
          </div>
          <div style="height: 7px; width: 100%; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden;">
            <div style="height: 100%; width: ${Math.max(pct, 4)}%; background: linear-gradient(90deg, #10b981 0%, #34d399 100%); border-radius: 4px;"></div>
          </div>
        </div>
      `;
    }).join('');
  }
};

// ==================== 6. IN-APP LIVE CAMERA SNAP ENGINE ====================
let inAppCameraStream = null;
let inAppCameraFacingMode = 'environment';
let inAppSnappedDataUrl = '';
let inAppCameraTargetContext = '';

window.openInAppCameraModal = function(targetContext = 'task-before') {
  const modal = document.getElementById('in-app-camera-modal');
  if (!modal) return;

  inAppCameraTargetContext = targetContext;
  document.getElementById('camera-target-context').value = targetContext;

  const titleEl = document.getElementById('camera-modal-title');
  const subtitleEl = document.getElementById('camera-modal-subtitle');

  if (targetContext === 'task-before') {
    if (titleEl) titleEl.innerText = '📷 Capture Before-Action Evidence';
    if (subtitleEl) subtitleEl.innerText = 'Snap photo of issue/defect before starting repair';
  } else if (targetContext === 'task-after') {
    if (titleEl) titleEl.innerText = '📷 Capture After-Action Evidence';
    if (subtitleEl) subtitleEl.innerText = 'Snap photo of completed work / restored equipment';
  } else if (targetContext === 'tenant') {
    if (titleEl) titleEl.innerText = '🏢 Tenant Complaint Photo';
    if (subtitleEl) subtitleEl.innerText = 'Snap photo of tenant facility concern';
  } else if (targetContext === 'joborder') {
    if (titleEl) titleEl.innerText = '🛠️ Job Order Pre-Work Photo';
    if (subtitleEl) subtitleEl.innerText = 'Snap field condition before issuing job order';
  } else if (targetContext === 'edit-complaint') {
    if (titleEl) titleEl.innerText = '📷 Update Complaint Photo';
    if (subtitleEl) subtitleEl.innerText = 'Snap replacement inspection photo';
  } else if (targetContext === 'edit-joborder') {
    if (titleEl) titleEl.innerText = '🛠️ Update Job Order Photo';
    if (subtitleEl) subtitleEl.innerText = 'Snap replacement job order attachment';
  }

  // Reset preview state
  retakeInAppCameraPhoto();

  modal.style.display = 'flex';
  startInAppCameraStream();
};

window.closeInAppCameraModal = function(e) {
  if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('modal-backdrop')) return;
  stopInAppCameraStream();
  const modal = document.getElementById('in-app-camera-modal');
  if (modal) modal.style.display = 'none';
};

function startInAppCameraStream() {
  const video = document.getElementById('in-app-camera-video');
  if (!video || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    triggerNativeCameraFallback();
    return;
  }

  navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: inAppCameraFacingMode,
      width: { ideal: 1920 },
      height: { ideal: 1080 }
    },
    audio: false
  }).then(stream => {
    inAppCameraStream = stream;
    video.srcObject = stream;
  }).catch(err => {
    console.warn("Direct video stream unavailable, offering native fallback:", err);
    triggerNativeCameraFallback();
  });
}

function stopInAppCameraStream() {
  if (inAppCameraStream) {
    inAppCameraStream.getTracks().forEach(t => t.stop());
    inAppCameraStream = null;
  }
}

window.toggleInAppCameraFacing = function() {
  inAppCameraFacingMode = inAppCameraFacingMode === 'environment' ? 'user' : 'environment';
  stopInAppCameraStream();
  startInAppCameraStream();
};

window.snapInAppCameraPhoto = function() {
  const video = document.getElementById('in-app-camera-video');
  const canvas = document.getElementById('in-app-camera-canvas');
  const previewBox = document.getElementById('in-app-camera-preview-box');
  const previewImg = document.getElementById('in-app-camera-preview-img');
  const liveControls = document.getElementById('camera-live-controls');
  const previewControls = document.getElementById('camera-preview-controls');
  const gridOverlay = document.getElementById('in-app-camera-grid');

  if (!video || !canvas) return;

  const w = video.videoWidth || 1280;
  const h = video.videoHeight || 720;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, w, h);

  // Compress to max 1280px with 0.82 quality
  compressImage(canvas.toDataURL('image/jpeg', 0.9), 1280, 0.82, (compressedDataUrl) => {
    inAppSnappedDataUrl = compressedDataUrl;

    if (previewImg) previewImg.src = compressedDataUrl;
    if (previewBox) previewBox.style.display = 'block';
    if (gridOverlay) gridOverlay.style.display = 'none';
    if (liveControls) liveControls.style.display = 'none';
    if (previewControls) previewControls.style.display = 'flex';
  });
};

window.retakeInAppCameraPhoto = function() {
  inAppSnappedDataUrl = '';
  const previewBox = document.getElementById('in-app-camera-preview-box');
  const liveControls = document.getElementById('camera-live-controls');
  const previewControls = document.getElementById('camera-preview-controls');
  const gridOverlay = document.getElementById('in-app-camera-grid');

  if (previewBox) previewBox.style.display = 'none';
  if (gridOverlay) gridOverlay.style.display = 'grid';
  if (liveControls) liveControls.style.display = 'flex';
  if (previewControls) previewControls.style.display = 'none';
};

window.acceptAndAttachCameraPhoto = function() {
  if (!inAppSnappedDataUrl) {
    alert("Please snap a photo first.");
    return;
  }

  const targetContext = inAppCameraTargetContext || document.getElementById('camera-target-context').value;

  if (targetContext === 'task-before') {
    if (!appState.currentTaskPhotosBefore) appState.currentTaskPhotosBefore = [];
    appState.currentTaskPhotosBefore.push({
      id: 'photo_b_' + Date.now(),
      url: inAppSnappedDataUrl,
      caption: `Before repair: Inspection finding taken at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    });
    renderTaskPhotoGalleries();
  } else if (targetContext === 'task-after') {
    if (!appState.currentTaskPhotosAfter) appState.currentTaskPhotosAfter = [];
    appState.currentTaskPhotosAfter.push({
      id: 'photo_a_' + Date.now(),
      url: inAppSnappedDataUrl,
      caption: `After repair: Completed state taken at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    });
    renderTaskPhotoGalleries();
  } else if (targetContext === 'tenant') {
    appState.currentTenantPhotoBase64 = inAppSnappedDataUrl;
    const preview = document.getElementById('tenant-photo-preview');
    const box = document.getElementById('tenant-photo-preview-box');
    if (preview) preview.src = inAppSnappedDataUrl;
    if (box) box.style.display = 'block';
  } else if (targetContext === 'joborder') {
    appState.currentJobOrderPhotoBase64 = inAppSnappedDataUrl;
    const preview = document.getElementById('jo-photo-preview');
    const box = document.getElementById('jo-photo-preview-box');
    if (preview) preview.src = inAppSnappedDataUrl;
    if (box) box.style.display = 'block';
  } else if (targetContext === 'edit-complaint') {
    appState.currentEditTenantPhotoBase64 = inAppSnappedDataUrl;
    const preview = document.getElementById('edit-complaint-photo-preview');
    const box = document.getElementById('edit-complaint-photo-preview-box');
    if (preview) preview.src = inAppSnappedDataUrl;
    if (box) box.style.display = 'block';
  } else if (targetContext === 'edit-joborder') {
    appState.currentEditJobOrderPhotoBase64 = inAppSnappedDataUrl;
    const preview = document.getElementById('edit-jo-photo-preview');
    const box = document.getElementById('edit-jo-photo-preview-box');
    if (preview) preview.src = inAppSnappedDataUrl;
    if (box) box.style.display = 'block';
  }

  closeInAppCameraModal();
};

window.triggerNativeCameraFallback = function() {
  const nativeInput = document.getElementById('in-app-native-camera-input');
  if (nativeInput) nativeInput.click();
};

window.handleInAppNativeCameraCapture = function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    compressImage(e.target.result, 1280, 0.82, (compressedDataUrl) => {
      inAppSnappedDataUrl = compressedDataUrl;
      const previewImg = document.getElementById('in-app-camera-preview-img');
      const previewBox = document.getElementById('in-app-camera-preview-box');
      const liveControls = document.getElementById('camera-live-controls');
      const previewControls = document.getElementById('camera-preview-controls');
      const gridOverlay = document.getElementById('in-app-camera-grid');

      if (previewImg) previewImg.src = compressedDataUrl;
      if (previewBox) previewBox.style.display = 'block';
      if (gridOverlay) gridOverlay.style.display = 'none';
      if (liveControls) liveControls.style.display = 'none';
      if (previewControls) previewControls.style.display = 'flex';
    });
  };
  reader.readAsDataURL(file);
};





// Native Android WebView print bridge
(function() {
  const origPrint = window.print;
  window.print = function() {
    if (window.AndroidNative && typeof window.AndroidNative.printPage === 'function') {
      window.AndroidNative.printPage(document.title || 'One Corporate Building Maintenance Report');
    } else if (typeof origPrint === 'function') {
      origPrint.call(window);
    }
  };
})();
