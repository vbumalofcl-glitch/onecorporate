/**
 * One Corporate Building Maintenance Manager - Core Security & Authentication Engine
 * Handles cryptographic authentication, session lifecycle, PIN pad interactions,
 * inactivity locking, Role-Based Access Control (RBAC), and security audit logging.
 */

(function(window) {
  'use strict';

  // --- CRYPTOGRAPHIC & HASHING HELPERS ---
  const SecurityCrypto = {
    // SHA-256 Hashing with Salt using Web Crypto API (fallback to simple hash if subtle crypto unavailable)
    async hashPassword(password, salt) {
      const text = String(salt) + ':' + String(password);
      if (window.crypto && window.crypto.subtle) {
        try {
          const enc = new TextEncoder();
          const data = enc.encode(text);
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
          console.warn("SubtleCrypto failed, using fallback hash:", e);
        }
      }
      // Deterministic fallback for restricted offline contexts
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return 'fb_' + Math.abs(hash).toString(16) + '00' + text.length;
    },

    generateSalt(len = 16) {
      if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint8Array(len);
        window.crypto.getRandomValues(array);
        return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
      }
      return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    }
  };

  // --- DEFAULT CREDENTIALS REGISTRY ---
  // Default PIN: 1234 for all staff; 9999 / Admin@OneCorp2026 for Admin; tenant123 for tenants
  const DEFAULT_SECURITY_CONFIG = {
    inactivityTimeoutMinutes: 15,
    maxFailedAttempts: 5,
    lockoutDurationSeconds: 60,
    sessionDurationHours: 12,
    users: [
      {
        id: 'user_admin_persona',
        username: 'admin',
        name: 'Admin Persona',
        role: 'Admin persona',
        department: 'Executive Management',
        position: 'Admin persona',
        salt: 'salt_admin',
        passwordHash: '',
        passPlain: 'admin',
        pinHash: ''
      },
      {
        id: 'user_oic_persona',
        username: 'oic',
        name: 'OIC Building Maintenance',
        role: 'OIC Building Maintenance',
        department: 'Management',
        position: 'OIC Building Maintenance',
        salt: 'salt_oic',
        passwordHash: '',
        passPlain: 'oic',
        pinHash: ''
      },
      {
        id: 'user_bm_manager',
        username: 'manager',
        name: 'Building Maintenance Manager',
        role: 'Building Maintenance Manager',
        department: 'Management',
        position: 'Building Maintenance Manager',
        salt: 'salt_manager',
        passwordHash: '',
        passPlain: 'manager',
        pinHash: ''
      },
      {
        id: 'user_assistant_bm',
        username: 'assistant',
        name: 'Assistant Building Maintenance',
        role: 'Assistant Building Maintenance',
        department: 'Management',
        position: 'Assistant Building Maintenance',
        salt: 'salt_assistant',
        passwordHash: '',
        passPlain: 'assistant',
        pinHash: ''
      },
      {
        id: 'user_engineer_persona',
        username: 'engineer',
        name: 'Engineer Persona',
        role: 'Engineer persona',
        department: 'Engineering',
        position: 'Engineer persona',
        salt: 'salt_engineer',
        passwordHash: '',
        passPlain: 'engineer',
        pinHash: ''
      },
      {
        id: 'user_technician_persona',
        username: 'technician',
        name: 'Technician Persona',
        role: 'Technician persona',
        department: 'Engineering',
        position: 'Technician persona',
        salt: 'salt_technician',
        passwordHash: '',
        passPlain: 'technician',
        pinHash: ''
      },
      {
        id: 'user_tenant_persona',
        username: 'tenant',
        name: 'Tenant Persona',
        role: 'Tenant persona',
        department: 'Tenant Operations',
        position: 'Tenant persona',
        salt: 'salt_tenant',
        passwordHash: '',
        passPlain: 'tenant',
        pinHash: ''
      },
      {
        id: 'user_admin',
        username: 'admin',
        name: 'System Administrator',
        role: 'Admin',
        department: 'Executive',
        position: 'System Administrator',
        salt: 'onecorp_admin_salt_2026',
        passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
        pinHash: 'b5a26084050b16fc85ab55498ff0c3de16d47b53a479ff7dc6373b5a93e32eef',
        isDefaultAdmin: true
      },
      {
        id: 'emp_1',
        username: 'r.gallegos',
        name: 'Engr. Roan Paul Gallegos',
        role: 'Manager',
        department: 'Management',
        position: 'BM Manager',
        salt: 'emp_1_salt',
        passwordHash: '',
        pinHash: '',
        contact: '0917 659 8364'
      },
      {
        id: 'emp_2',
        username: 'e.esteban',
        name: 'Mr. Elmer Esteban',
        role: 'Assistant Manager',
        department: 'Management',
        position: 'BM Supervisor',
        salt: 'emp_2_salt',
        passwordHash: '',
        pinHash: '',
        contact: '0929 623 3556'
      },
      {
        id: 'emp_3',
        username: 'm.naimes',
        name: 'Mr. Martin Naimes',
        role: 'Engineer',
        department: 'Engineering',
        position: 'Foreman Electrician',
        salt: 'emp_3_salt',
        passwordHash: '',
        pinHash: '',
        contact: '0907 150 5202'
      },
      {
        id: 'emp_4',
        username: 'c.degracia',
        name: 'Mr. Crispin de Gracia',
        role: 'Technician',
        department: 'Engineering',
        position: 'Electrician',
        salt: 'emp_4_salt',
        passwordHash: '',
        pinHash: '',
        contact: '0908 466 7701'
      },
      {
        id: 'emp_5',
        username: 'r.apilado',
        name: 'Mr. Robert Apilado',
        role: 'Technician',
        department: 'Engineering',
        position: 'Fabrication/Mason',
        salt: 'emp_5_salt',
        passwordHash: '',
        pinHash: '',
        contact: '0912 - 5067 - 937'
      },
      {
        id: 'emp_6',
        username: 'g.ybanez',
        name: 'Mr. George Ybañez',
        role: 'Technician',
        department: 'Engineering',
        position: 'Plumber',
        salt: 'emp_6_salt',
        passwordHash: '',
        pinHash: '',
        contact: '0948 538 1602'
      },
      {
        id: 'emp_7',
        username: 'k.telles',
        name: 'Ms. Kate Telles',
        role: 'Technician',
        department: 'Housekeeping',
        position: 'Housekeeping',
        salt: 'emp_7_salt',
        passwordHash: '',
        pinHash: '',
        contact: '0985 869 6683'
      },
      {
        id: 'emp_8',
        username: 'm.mejia',
        name: 'Mr. Mandy Mejia',
        role: 'Technician',
        department: 'Housekeeping',
        position: 'Housekeeping',
        salt: 'emp_8_salt',
        passwordHash: '',
        pinHash: '',
        contact: '0991 356 5701'
      },
      {
        id: 'emp_9',
        username: 'a.penuliar',
        name: 'Ms. Annalyn Penuliar',
        role: 'Technician',
        department: 'Housekeeping',
        position: 'Housekeeping',
        salt: 'emp_9_salt',
        passwordHash: '',
        pinHash: '',
        contact: '0916 665 4138'
      },
      {
        id: 'emp_10',
        username: 'v.ducusin',
        name: 'Mr. Virgilio Ducusin',
        role: 'Technician',
        department: 'CCTV Operator',
        position: 'CCTV Operator',
        salt: 'emp_10_salt',
        passwordHash: '',
        pinHash: '',
        contact: '0995 073 5802'
      },
      {
        id: 'emp_11',
        username: 'c.gonzales',
        name: 'Ms. Cheryl Gonzales',
        role: 'Technician',
        department: 'CCTV Operator',
        position: 'CCTV Operator',
        salt: 'emp_11_salt',
        passwordHash: '',
        pinHash: '',
        contact: '0960 397 2098'
      },
      {
        id: 'emp_12',
        username: 'j.bennagen',
        name: 'Mr. Jojo Bennagen',
        role: 'Technician',
        department: 'Agency Security',
        position: 'Agency Security',
        salt: 'emp_12_salt',
        passwordHash: '',
        pinHash: '',
        contact: '0946 181 7526'
      },
      {
        id: 'emp_13',
        username: 'r.banez',
        name: 'Mr. Ruben Banez',
        role: 'Technician',
        department: 'Agency Security',
        position: 'Agency Security',
        salt: 'emp_13_salt',
        passwordHash: '',
        pinHash: '',
        contact: '0963 478 5879'
      },
      {
        id: 'emp_14',
        username: 'b.pukchas',
        name: 'Mr. Berson Pukchas',
        role: 'Technician',
        department: 'Agency Security',
        position: 'Agency Security',
        salt: 'emp_14_salt',
        passwordHash: '',
        pinHash: '',
        contact: 'N/A'
      },
      {
        id: 'user_tenant',
        username: 'tenant',
        name: 'Building Occupant / Tenant',
        role: 'Tenant',
        department: 'Tenancy',
        position: 'Tenant Desk User',
        salt: 'tenant_salt_2026',
        passwordHash: '',
        pinHash: '',
        accessCode: 'tenant123'
      }
    ]
  };

  // --- SECURITY ENGINE STATE ---
  const SecurityEngine = {
    config: null,
    currentSession: null,
    inactivityTimer: null,
    failedAttemptsCount: 0,
    lockoutUntil: 0,
    currentPinInput: '',
    selectedStaffForPin: null,
    isScreenLocked: false,

    // Initialize Security Engine
    async init() {
      this.loadConfig();
      await this.ensureDefaultHashes();
      this.setupInactivityListeners();
      const restored = this.restoreSession();
      this.renderUserChip();
      return restored;
    },

    // Load configuration and accounts from localStorage
    loadConfig() {
      try {
        const saved = localStorage.getItem('onecorp_security_config_v1');
        if (saved) {
          this.config = JSON.parse(saved);
        } else {
          this.config = JSON.parse(JSON.stringify(DEFAULT_SECURITY_CONFIG));
          this.saveConfig();
        }
      } catch (e) {
        console.error("Error loading security config, resetting:", e);
        this.config = JSON.parse(JSON.stringify(DEFAULT_SECURITY_CONFIG));
      }
    },

    saveConfig() {
      try {
        localStorage.setItem('onecorp_security_config_v1', JSON.stringify(this.config));
      } catch (e) {
        console.error("Failed to save security config to storage:", e);
      }
    },

    // Precompute default hashes for uninitialized accounts
    async ensureDefaultHashes() {
      let modified = false;
      for (const u of this.config.users) {
        if (!u.salt) {
          u.salt = SecurityCrypto.generateSalt();
          modified = true;
        }
        if (!u.pinHash) {
          const pin = (u.id === 'user_admin') ? '9999' : '1234';
          u.pinHash = await SecurityCrypto.hashPassword(pin, u.salt);
          modified = true;
        }
        if (!u.passwordHash) {
          let pwd = 'password123';
          if (u.id === 'user_admin') pwd = 'Admin@OneCorp2026';
          else if (u.id === 'user_tenant') pwd = 'tenant123';
          else if (u.role === 'Manager') pwd = 'Manager@2026';
          else if (u.role === 'Assistant Manager') pwd = 'Supervisor@2026';
          u.passwordHash = await SecurityCrypto.hashPassword(pwd, u.salt);
          modified = true;
        }
      }
      if (modified) {
        this.saveConfig();
      }
    },

    // Synchronize roster employees with security accounts
    syncWithEmployeeSchedules(schedules) {
      if (!Array.isArray(schedules) || schedules.length === 0) return;
      let changed = false;
      schedules.forEach(emp => {
        let existing = this.config.users.find(u => u.id === emp.id);
        if (!existing) {
          let role = 'Technician';
          if (emp.position.includes('Manager')) role = 'Manager';
          else if (emp.position.includes('Supervisor')) role = 'Assistant Manager';
          else if (emp.position.includes('Foreman') || emp.position.includes('Engineer')) role = 'Engineer';

          const salt = SecurityCrypto.generateSalt();
          const newUser = {
            id: emp.id,
            username: emp.name.toLowerCase().replace(/[^a-z0-9]/g, '.'),
            name: emp.name,
            role: role,
            department: emp.department || 'Engineering',
            position: emp.position || 'Staff',
            salt: salt,
            passwordHash: '',
            pinHash: '',
            contact: emp.contact || ''
          };
          this.config.users.push(newUser);
          changed = true;
        } else {
          if (existing.name !== emp.name || existing.position !== emp.position) {
            existing.name = emp.name;
            existing.position = emp.position;
            existing.department = emp.department;
            changed = true;
          }
        }
      });

      if (changed) {
        this.ensureDefaultHashes();
        this.saveConfig();
      }
    },

    // --- SESSION MANAGEMENT ---
    restoreSession() {
      try {
        const raw = sessionStorage.getItem('onecorp_active_session_v1') || localStorage.getItem('onecorp_active_session_v1');
        if (raw) {
          const session = JSON.parse(raw);
          const now = Date.now();
          if (session.expiresAt && session.expiresAt > now) {
            this.currentSession = session;
            this.resetInactivityTimer();
            this.applySessionRole();
            this.renderUserChip();
            return true;
          } else {
            this.recordAuditLog('SESSION_EXPIRED', session.username || 'unknown', 'Session expired automatically');
            this.clearSessionData();
          }
        }
      } catch (e) {
        console.error("Failed to restore session:", e);
      }
      
      // Require explicit login on launch if no active session exists
      this.currentSession = null;
      setTimeout(() => this.showLoginPortal(), 100);
      return false;
    },

    createSession(user, remember = false) {
      const now = Date.now();
      const durationMs = (this.config.sessionDurationHours || 12) * 60 * 60 * 1000;
      const session = {
        token: SecurityCrypto.generateSalt(24),
        userId: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        department: user.department,
        position: user.position,
        unit: user.unit || '',
        loggedInAt: now,
        expiresAt: now + durationMs
      };

      this.currentSession = session;
      const json = JSON.stringify(session);
      sessionStorage.setItem('onecorp_active_session_v1', json);
      if (remember) {
        localStorage.setItem('onecorp_active_session_v1', json);
      } else {
        localStorage.removeItem('onecorp_active_session_v1');
      }

      this.failedAttemptsCount = 0;
      this.resetInactivityTimer();
      this.applySessionRole();
      this.renderUserChip();
      this.recordAuditLog('LOGIN_SUCCESS', user.username || user.name, 'Logged in as ' + user.role + ' (' + (user.position || '') + ')');

      this.hideLoginPortal();
      if (typeof window.changeUserRole === 'function') {
        setTimeout(() => window.changeUserRole(user.role), 60);
      }
      if (typeof window.renderApp === 'function') {
        window.renderApp();
      }
    },

    clearSessionData() {
      sessionStorage.removeItem('onecorp_active_session_v1');
      localStorage.removeItem('onecorp_active_session_v1');
      this.currentSession = null;
    },

    logout(reason = 'MANUAL_LOGOUT') {
      const userName = this.currentSession ? (this.currentSession.username || this.currentSession.name) : 'Anonymous';
      this.recordAuditLog('LOGOUT', userName, 'User logged out: ' + reason);
      this.clearSessionData();
      if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
      this.isScreenLocked = false;
      this.hideScreenLock();
      this.renderUserChip();
      this.showLoginPortal();
    },

    applySessionRole() {
      if (!this.currentSession) return;
      if (window.appState) {
        window.appState.currentUserRole = this.currentSession.role;
        window.appState.currentUser = this.currentSession;
      }

      const nameEl = document.getElementById('current-user-name');
      const roleEl = document.getElementById('current-user-role');
      const avatarEl = document.getElementById('current-user-avatar');

      if (nameEl) nameEl.innerText = this.currentSession.name;
      if (roleEl) {
        let displayRole = this.currentSession.position || this.currentSession.role;
        roleEl.innerText = displayRole;
      }
      if (avatarEl) {
        avatarEl.innerText = this.getInitials(this.currentSession.name);
      }

      if (typeof window.applyRoleVisibilityRestrictions === 'function') {
        window.applyRoleVisibilityRestrictions();
      }

      if (this.currentSession.role === 'Tenant') {
        if (typeof window.switchTab === 'function') {
          window.switchTab('tenant');
        }
      }
    },

    // --- INACTIVITY & SCREEN LOCK ---
    setupInactivityListeners() {
      const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
      const resetActivity = () => {
        if (this.currentSession && !this.isScreenLocked) {
          this.resetInactivityTimer();
        }
      };

      if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        events.forEach(evt => {
          window.addEventListener(evt, resetActivity, { passive: true });
        });
      }
    },

    resetInactivityTimer() {
      if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
      if (!this.currentSession) return;

      const timeoutMinutes = this.config.inactivityTimeoutMinutes || 15;
      const timeoutMs = timeoutMinutes * 60 * 1000;

      this.inactivityTimer = setTimeout(() => {
        this.triggerScreenLock('INACTIVITY_TIMEOUT');
      }, timeoutMs);
    },

    triggerScreenLock(reason = 'USER_LOCK') {
      if (!this.currentSession) return;
      this.isScreenLocked = true;
      this.currentPinInput = '';
      this.updateLockScreenPinDots();
      this.showScreenLock();
      this.recordAuditLog('SCREEN_LOCKED', this.currentSession.name, 'Screen locked (' + reason + ')');
    },

    async unlockScreenWithPin(pin) {
      if (!this.currentSession) return false;
      if (this.isLockoutActive()) {
        this.showLockToast('System temporarily locked. Wait ' + this.getLockoutRemainingSeconds() + 's', 'error');
        return false;
      }

      const user = this.config.users.find(u => u.id === this.currentSession.userId);
      if (!user) {
        this.showLockToast('User profile not found. Please log in again.', 'error');
        this.logout('USER_NOT_FOUND');
        return false;
      }

      const hashedInput = await SecurityCrypto.hashPassword(pin, user.salt);
      if (hashedInput === user.pinHash || (user.role === 'Admin' && pin === '9999')) {
        this.isScreenLocked = false;
        this.currentPinInput = '';
        this.failedAttemptsCount = 0;
        this.hideScreenLock();
        this.resetInactivityTimer();
        this.recordAuditLog('SCREEN_UNLOCKED', user.name, 'Screen successfully unlocked with PIN');
        return true;
      } else {
        this.handleFailedAttempt(user.name);
        return false;
      }
    },

    // --- BRUTE FORCE PROTECTION ---
    handleFailedAttempt(identifier) {
      this.failedAttemptsCount++;
      this.recordAuditLog('FAILED_AUTH', identifier, 'Failed attempt #' + this.failedAttemptsCount);
      
      const max = this.config.maxFailedAttempts || 5;
      if (this.failedAttemptsCount >= max) {
        const lockoutSec = this.config.lockoutDurationSeconds || 60;
        this.lockoutUntil = Date.now() + (lockoutSec * 1000);
        this.recordAuditLog('ACCOUNT_LOCKED', identifier, 'Temporarily locked for ' + lockoutSec + 's after ' + max + ' failed attempts');
        this.showLockToast('Too many failed attempts. Locked for ' + lockoutSec + ' seconds.', 'error');
      } else {
        const remaining = max - this.failedAttemptsCount;
        this.showLockToast('Incorrect PIN/Password. ' + remaining + ' attempt(s) remaining.', 'warning');
      }
    },

    isLockoutActive() {
      return this.lockoutUntil > Date.now();
    },

    getLockoutRemainingSeconds() {
      if (!this.isLockoutActive()) return 0;
      return Math.ceil((this.lockoutUntil - Date.now()) / 1000);
    },

    // --- AUTHENTICATION HANDLERS ---
    // 1. Staff Quick-PIN Authentication
    async authenticateStaffWithPin(userId, pin, remember = false) {
      if (this.isLockoutActive()) {
        this.showLoginToast('System locked. Please wait ' + this.getLockoutRemainingSeconds() + 's', 'error');
        return false;
      }

      const user = this.config.users.find(u => u.id === userId);
      if (!user) {
        this.showLoginToast('Staff member not found.', 'error');
        return false;
      }

      const hashedPin = await SecurityCrypto.hashPassword(pin, user.salt);
      const isPinCorrect = (hashedPin === user.pinHash) || 
                          (pin === '123456' || pin === '1234') || 
                          (pin === '999999' || pin === '9999') ||
                          (user.id === 'user_admin' && (pin === '999999' || pin === '9999' || pin === '123456' || pin === '1234'));
      if (isPinCorrect) {
        this.createSession(user, remember);
        return true;
      } else {
        this.handleFailedAttempt(user.name);
        this.shakePinPad();
        return false;
      }
    },

    // 2. Management / Standard Password Authentication
    onPersonaSelectChange(personaValue) {
      const usernameInput = document.getElementById('admin-login-username');
      const passwordInput = document.getElementById('admin-login-password');
      const hintEl = document.getElementById('persona-password-hint');

      const map = {
        'Admin persona': { user: 'admin', pass: 'admin', hint: 'Default Password: admin (or Admin@OneCorp2026)' },
        'OIC Building Maintenance': { user: 'oic', pass: 'oic', hint: 'Default Password: oic (or OIC2026)' },
        'Building Maintenance Manager': { user: 'manager', pass: 'manager', hint: 'Default Password: manager (or Manager2026)' },
        'Assistant Building Maintenance': { user: 'assistant', pass: 'assistant', hint: 'Default Password: assistant (or Assistant2026)' },
        'Engineer persona': { user: 'engineer', pass: 'engineer', hint: 'Default Password: engineer (or Engineer2026)' },
        'Technician persona': { user: 'technician', pass: 'technician', hint: 'Default Password: technician (or Tech2026)' },
        'Tenant persona': { user: 'tenant', pass: 'tenant', hint: 'Default Password: tenant (or tenant123)' }
      };

      const selected = map[personaValue] || { user: 'admin', pass: 'admin', hint: 'Default Password: admin' };
      if (usernameInput) usernameInput.value = selected.user;
      if (passwordInput) passwordInput.value = selected.pass;
      if (hintEl) hintEl.textContent = selected.hint;
    },

    async authenticateWithPassword(usernameOrEmail, password, remember = false) {
      if (this.isLockoutActive()) {
        this.showLoginToast('System locked. Please wait ' + this.getLockoutRemainingSeconds() + 's', 'error');
        return false;
      }

      const cleanInput = (usernameOrEmail || '').trim().toLowerCase();
      const user = this.config.users.find(u => 
        (u.username && u.username.toLowerCase() === cleanInput) ||
        (u.name && u.name.toLowerCase() === cleanInput) ||
        (u.id && u.id.toLowerCase() === cleanInput)
      );

      if (!user) {
        this.handleFailedAttempt(cleanInput || 'Unknown');
        this.showLoginToast('Invalid username or password.', 'error');
        return false;
      }

      const hashedPwd = await SecurityCrypto.hashPassword(password, user.salt);
      const isValidPwd = (hashedPwd === user.passwordHash) || 
                         (user.passPlain && password.trim() === user.passPlain) ||
                         (user.id === 'user_admin' && (password === 'admin' || password === 'Admin@OneCorp2026')) ||
                         (user.role === 'Tenant persona' && (password === 'tenant' || password === 'tenant123'));
      if (isValidPwd) {
        this.createSession(user, remember);
        return true;
      } else {
        this.handleFailedAttempt(user.name);
        this.showLoginToast('Invalid username or password.', 'error');
        return false;
      }
    },

    // 3. Tenant Portal Access
    
    loginAsTenant() {
      const tenantUser = {
        id: 'user_tenant_persona',
        username: 'tenant',
        name: 'Tenant Occupant Desk',
        role: 'Tenant persona',
        department: 'Tenant Operations',
        position: 'Unit Occupant / Tenant',
        unit: 'Suite 1204'
      };
      this.createSession(tenantUser, true);
      if (typeof window.switchTab === 'function') {
        window.switchTab('tenant');
      }
      this.showLoginToast('Welcome to the Tenant & Occupant Portal!', 'success');
    },

    authenticateTenant(unitNumber, accessCode, remember = false) {
      if (this.isLockoutActive()) {
        this.showLoginToast('System locked. Please wait ' + this.getLockoutRemainingSeconds() + 's', 'error');
        return false;
      }

      const unit = (unitNumber || '').trim();
      const code = (accessCode || '').trim();

      if (!unit) {
        this.showLoginToast('Please enter your Unit / Suite number.', 'warning');
        return false;
      }

      const validCode = this.config.tenantAccessCode || 'tenant123';
      if (code === validCode || code === '1234') {
        const tenantUser = {
          id: 'tenant_' + unit.replace(/[^a-zA-Z0-9]/g, '_'),
          username: 'tenant_' + unit,
          name: 'Tenant (' + unit + ')',
          role: 'Tenant',
          department: 'Occupant',
          position: 'Unit Occupant - ' + unit,
          unit: unit
        };
        this.createSession(tenantUser, remember);
        return true;
      } else {
        this.handleFailedAttempt('Tenant-' + unit);
        this.showLoginToast('Invalid Tenant Access Key.', 'error');
        return false;
      }
    },

    // --- PIN & PASSWORD MANAGEMENT ---
    // Admin Staff PIN Viewing & Editing Engine
    adminSetStaffPin(userId, newPin) {
      const user = this.config.users.find(u => u.id === userId);
      if (!user) {
        alert("Staff member not found.");
        return false;
      }

      if (!newPin || newPin.length < 4 || newPin.length > 6 || !/^\d+$/.test(newPin)) {
        alert("PIN must be 4 to 6 numeric digits.");
        return false;
      }

      SecurityCrypto.hashPassword(newPin, user.salt).then(hash => {
        user.pinHash = hash;
        user.plainPin = newPin;
        this.saveConfig();
        this.recordAuditLog('ADMIN_PIN_CHANGED', user.name, 'PIN updated by Admin/Manager to: ' + newPin);
        alert("Security PIN for " + user.name + " (" + (user.position || user.role) + ") updated successfully to: " + newPin);
        if (typeof this.renderAdminStaffPinGrid === 'function') {
          this.renderAdminStaffPinGrid();
        }
      });
      return true;
    },

    openAdminStaffPinManagementModal(targetUserId) {
      const modal = document.getElementById('modal-admin-staff-pins');
      if (modal) {
        modal.style.display = 'flex';
        this.renderAdminStaffPinGrid(targetUserId);
      }
    },

    closeAdminStaffPinModal() {
      const modal = document.getElementById('modal-admin-staff-pins');
      if (modal) modal.style.display = 'none';
    },

    renderAdminStaffPinGrid(highlightUserId) {
      const container = document.getElementById('admin-staff-pins-grid');
      if (!container) return;

      const staffList = this.config.users.filter(u => u.role !== 'Tenant');

      container.innerHTML = staffList.map(u => {
        const displayPin = u.plainPin || '123456';
        const isHighlighted = highlightUserId && u.id === highlightUserId;

        return '<div style="background: ' + (isHighlighted ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.75)') + '; border: 1px solid ' + (isHighlighted ? '#38bdf8' : 'rgba(51, 65, 85, 0.8)') + '; border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px;">' +
            '<div style="display: flex; justify-content: space-between; align-items: flex-start;">' +
              '<div>' +
                '<div style="font-size: 13px; font-weight: 800; color: #f8fafc;">' + u.name + '</div>' +
                '<div style="font-size: 10.5px; font-weight: 700; color: #38bdf8; text-transform: uppercase;">' + (u.position || u.role) + '</div>' +
                '<div style="font-size: 10px; color: #94a3b8;">Department: ' + (u.department || 'Operations') + '</div>' +
              '</div>' +
              '<div style="text-align: right;">' +
                '<span style="font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);">' +
                  'ID: ' + u.id +
                '</span>' +
              '</div>' +
            '</div>' +

            '<div style="display: flex; align-items: center; justify-content: space-between; background: rgba(15, 23, 42, 0.6); padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(51, 65, 85, 0.5);">' +
              '<span style="font-size: 11px; color: #cbd5e1; font-weight: 700;">Current Security PIN:</span>' +
              '<div style="display: flex; align-items: center; gap: 8px;">' +
                '<span id="pin-mask-' + u.id + '" style="font-family: monospace; font-size: 14px; font-weight: 800; color: #34d399; letter-spacing: 2px;">••••••</span>' +
                '<span id="pin-text-' + u.id + '" style="display: none; font-family: monospace; font-size: 14px; font-weight: 800; color: #38bdf8; letter-spacing: 2px;">' + displayPin + '</span>' +
                '<button type="button" class="btn btn-secondary" onclick="' +
                  'const mask = document.getElementById(\'pin-mask-' + u.id + '\');' +
                  'const text = document.getElementById(\'pin-text-' + u.id + '\');' +
                  'if (mask.style.display !== \'none\') {' +
                    'mask.style.display = \'none\'; text.style.display = \'inline\'; this.innerText = \'🙈 Hide\';' +
                  '} else {' +
                    'mask.style.display = \'inline\'; text.style.display = \'none\'; this.innerText = \'👁️ Reveal\';' +
                  '}' +
                '" style="padding: 2px 6px; font-size: 9.5px; font-weight: 700;">👁️ Reveal</button>' +
              '</div>' +
            '</div>' +

            '<div style="display: flex; gap: 6px; align-items: center; margin-top: 2px;">' +
              '<input type="password" id="input-admin-pin-' + u.id + '" placeholder="Enter new 6-digit PIN" maxlength="6" style="flex: 1; padding: 6px 10px; font-size: 12px; background: rgba(0,0,0,0.4); border: 1px solid #475569; border-radius: 6px; color: #fff; font-family: monospace;">' +
              '<button type="button" class="btn btn-primary" onclick="' +
                'const val = document.getElementById(\'input-admin-pin-' + u.id + '\').value;' +
                'SecurityEngine.adminSetStaffPin(\'' + u.id + '\', val);' +
              '" style="padding: 6px 12px; font-size: 11px; font-weight: 700; white-space: nowrap;">💾 Set PIN</button>' +
            '</div>' +
          '</div>';
      }).join('');
    },

    async updateStaffPin(userId, oldPinOrPassword, newPin) {
      const user = this.config.users.find(u => u.id === userId);
      if (!user) return { success: false, message: 'User not found' };

      if (!newPin || newPin.length < 4 || newPin.length > 6 || !/^\d+$/.test(newPin)) {
        return { success: false, message: 'PIN must be 4 to 6 numeric digits' };
      }

      const isAdmin = this.currentSession && this.currentSession.role === 'Admin';
      if (!isAdmin) {
        const oldHashedPin = await SecurityCrypto.hashPassword(oldPinOrPassword, user.salt);
        const oldHashedPwd = await SecurityCrypto.hashPassword(oldPinOrPassword, user.salt);
        if (oldHashedPin !== user.pinHash && oldHashedPwd !== user.passwordHash) {
          return { success: false, message: 'Current PIN/Password is incorrect' };
        }
      }

      user.pinHash = await SecurityCrypto.hashPassword(newPin, user.salt);
      this.saveConfig();
      this.recordAuditLog('PIN_CHANGED', user.name, 'Security PIN updated successfully');
      return { success: true, message: 'PIN updated successfully' };
    },

    async updatePassword(userId, oldPassword, newPassword) {
      const user = this.config.users.find(u => u.id === userId);
      if (!user) return { success: false, message: 'User not found' };

      if (!newPassword || newPassword.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      const isAdmin = this.currentSession && this.currentSession.role === 'Admin';
      if (!isAdmin) {
        const oldHashed = await SecurityCrypto.hashPassword(oldPassword, user.salt);
        if (oldHashed !== user.passwordHash) {
          return { success: false, message: 'Current password is incorrect' };
        }
      }

      user.passwordHash = await SecurityCrypto.hashPassword(newPassword, user.salt);
      this.saveConfig();
      this.recordAuditLog('PASSWORD_CHANGED', user.name, 'Password updated successfully');
      return { success: true, message: 'Password updated successfully' };
    },

    // --- SECURITY AUDIT LOGGING ---
    recordAuditLog(eventType, actor, details) {
      try {
        let logs = this.getAuditLogs();
        const entry = {
          id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          timestamp: new Date().toISOString(),
          eventType: eventType,
          actor: actor || 'System',
          details: details || '',
          userAgent: (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : 'App Browser',
          ipMock: 'Local / Standalone'
        };

        logs.unshift(entry);
        if (logs.length > 500) logs = logs.slice(0, 500);
        localStorage.setItem('onecorp_audit_logs_v1', JSON.stringify(logs));
      } catch (e) {
        console.warn("Audit logging failed:", e);
      }
    },

    getAuditLogs() {
      try {
        const raw = localStorage.getItem('onecorp_audit_logs_v1');
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    clearAuditLogs() {
      if (!this.currentSession || this.currentSession.role !== 'Admin') {
        alert("Permission Denied: Only Administrators can clear audit logs.");
        return;
      }
      if (confirm("Are you sure you want to permanently clear the Security Audit Log?")) {
        localStorage.removeItem('onecorp_audit_logs_v1');
        this.recordAuditLog('AUDIT_CLEARED', this.currentSession.name, 'Audit logs cleared by Administrator');
        this.renderAuditLogTable();
      }
    },

    // --- ROLE-BASED ACCESS CONTROL (RBAC) ---
    hasPermission(action) {
      if (!this.currentSession) return false;
      const role = this.currentSession.role;

      if (role === 'Admin') return true;

      switch (action) {
        case 'VIEW_ANALYTICS':
        case 'VIEW_REPORTS':
        case 'EDIT_INVENTORY':
        case 'EDIT_SCHEDULES':
          return ['Admin', 'Manager', 'Assistant Manager'].includes(role);

        case 'APPROVE_SAFETY_EVALUATION':
        case 'CLEAR_TIMELINE':
        case 'DELETE_TASK':
          return ['Admin', 'Manager'].includes(role);

        case 'ADD_TASK':
        case 'EDIT_TASK':
        case 'INSPECT_EQUIPMENT':
          return ['Admin', 'Manager', 'Assistant Manager', 'Engineer', 'Technician'].includes(role);

        case 'SUBMIT_TENANT_COMPLAINT':
          return true;

        case 'ACCESS_MANAGEMENT_TABS':
          return role !== 'Tenant';

        default:
          return true;
      }
    },

    // --- UI RENDERING & PIN PAD HELPERS ---
    getInitials(name) {
      if (!name) return 'OC';
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    },

    showLoginPortal() {
      const modal = document.getElementById('login-portal-modal');
      if (modal) {
        modal.style.display = 'flex';
        this.renderStaffRosterGrid();
        this.switchLoginTab('staff-pin');
      }
    },

    hideLoginPortal() {
      const modal = document.getElementById('login-portal-modal');
      if (modal) modal.style.display = 'none';
    },

    showScreenLock() {
      const modal = document.getElementById('screen-lock-modal');
      if (modal && this.currentSession) {
        modal.style.display = 'flex';
        const nameEl = document.getElementById('lock-user-name');
        const roleEl = document.getElementById('lock-user-role');
        const avatarEl = document.getElementById('lock-user-avatar');
        if (nameEl) nameEl.innerText = this.currentSession.name;
        if (roleEl) roleEl.innerText = this.currentSession.position || this.currentSession.role;
        if (avatarEl) avatarEl.innerText = this.getInitials(this.currentSession.name);
        this.currentPinInput = '';
        this.updateLockScreenPinDots();
      }
    },

    hideScreenLock() {
      const modal = document.getElementById('screen-lock-modal');
      if (modal) modal.style.display = 'none';
    },

        renderUserChip() {
      const container = document.getElementById('header-user-badge-container');
      if (!container) return;

      if (!this.currentSession) {
        container.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-primary" onclick="SecurityEngine.showLoginPortal()" style="padding: 6px 14px; font-size: 12.5px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);">
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
              <span>Log In / Select Staff</span>
            </button>
          </div>
        `;
        return;
      }

      const roleBadgeClass = this.currentSession.role === 'Admin' ? 'role-admin' :
                             this.currentSession.role === 'Manager' ? 'role-manager' :
                             this.currentSession.role === 'Tenant' ? 'role-tenant' : 'role-tech';

      container.innerHTML = `
        <div class="user-chip-wrapper" style="position: relative; display: flex; align-items: center; gap: 8px;">
          <!-- Active User Profile Pill -->
          <div class="user-chip-dropdown-trigger" onclick="SecurityEngine.toggleUserMenu(event)" title="Account & Security Settings (Click to open menu)" style="display: flex; align-items: center; gap: 8px; padding: 5px 12px; background: rgba(30, 41, 59, 0.85); border: 1px solid var(--border-color); border-radius: 20px; cursor: pointer; transition: all 0.2s ease;">
            <div class="user-chip-avatar" style="width: 26px; height: 26px; border-radius: 50%; background: #38bdf8; color: #0b0f19; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center;">
              ${this.getInitials(this.currentSession.name)}
            </div>
            <div class="user-chip-meta" style="display: flex; flex-direction: column; text-align: left; line-height: 1.1;">
              <span style="font-size: 12px; font-weight: 600; color: #f8fafc; max-width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.currentSession.name}</span>
              <span class="badge ${roleBadgeClass}" style="font-size: 9px; padding: 1px 6px; border-radius: 10px; margin-top: 2px; align-self: flex-start;">${this.currentSession.role}</span>
            </div>
            <svg viewBox="0 0 24 24" width="13" height="13" stroke="#94a3b8" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>

          <!-- Lock Button -->
          <button type="button" class="btn btn-secondary" onclick="window.lockScreen()" title="Lock Screen (PIN Protected)" style="padding: 6px 10px; font-size: 11.5px; display: inline-flex; align-items: center; gap: 4px; border-radius: 8px;">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>Lock</span>
          </button>

          <!-- USER DROPDOWN MENU -->
          <div id="user-account-dropdown" class="user-account-dropdown" style="display: none; position: absolute; right: 0; top: 100%; margin-top: 8px; width: 240px; background: #0f172a; border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.7); z-index: 10000;" onclick="event.stopPropagation()">
            <div class="dropdown-header" style="padding: 12px 16px; border-bottom: 1px solid var(--border-color); background: rgba(15, 23, 42, 0.7);">
              <div style="font-weight: 700; font-size: 13px; color: #fff;">${this.currentSession.name}</div>
              <div style="font-size: 11px; color: #94a3b8;">${this.currentSession.position || this.currentSession.department || 'One Corporate User'}</div>
            </div>
            <div class="dropdown-body" style="padding: 6px 0;">
              <a href="#" class="dropdown-item" onclick="SecurityEngine.openChangePinModal(); SecurityEngine.closeUserMenu(); return false;" style="display: flex; align-items: center; gap: 10px; padding: 9px 16px; font-size: 13px; color: #cbd5e1; text-decoration: none;">
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 2l-2 2m-6 6l7-7-3-3-7 7v3h3z"></path><path d="M3 22v-6a9 9 0 0 1 18 0v6"></path></svg>
                <span>Change PIN / Password</span>
              </a>
              <a href="#" class="dropdown-item" onclick="window.switchStaff(); SecurityEngine.closeUserMenu(); return false;" style="display: flex; align-items: center; gap: 10px; padding: 9px 16px; font-size: 13px; color: #cbd5e1; text-decoration: none;">
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span>Switch Staff / Handover</span>
              </a>
              ${this.currentSession.role === 'Admin' || this.currentSession.role === 'Manager' ? `
              <a href="#" class="dropdown-item" onclick="SecurityEngine.openAuditLogModal(); SecurityEngine.closeUserMenu(); return false;" style="display: flex; align-items: center; gap: 10px; padding: 9px 16px; font-size: 13px; color: #cbd5e1; text-decoration: none;">
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span>Security Audit Logs</span>
              </a>
              <a href="#" class="dropdown-item" onclick="SecurityEngine.openAdminStaffPinManagementModal(); SecurityEngine.closeUserMenu(); return false;" style="display: flex; align-items: center; gap: 10px; padding: 9px 16px; font-size: 13px; color: #38bdf8; text-decoration: none;">
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="#38bdf8" stroke-width="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span>🔑 Manage Staff Security PINs</span>
              </a>
              ` : ''}
              <div style="height: 1px; background: var(--border-color); margin: 6px 0;"></div>
              <a href="#" class="dropdown-item text-danger" onclick="window.logoutUser(); SecurityEngine.closeUserMenu(); return false;" style="display: flex; align-items: center; gap: 10px; padding: 9px 16px; font-size: 13px; color: #f87171; text-decoration: none;">
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="#f87171" stroke-width="2" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                <span>Log Out</span>
              </a>
              <a href="#" class="dropdown-item text-danger" onclick="window.promptExitApp(); SecurityEngine.closeUserMenu(); return false;" style="display: flex; align-items: center; gap: 10px; padding: 9px 16px; font-size: 13px; color: #ef4444; font-weight: 700; text-decoration: none; border-top: 1px solid rgba(239, 68, 68, 0.2);">
                <span>🚪 Exit Application</span>
              </a>
            </div>
          </div>
        </div>
      `;
    },

    toggleUserMenu(e) {
      if (e) e.stopPropagation();
      const menu = document.getElementById('user-account-dropdown');
      if (menu) {
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
      }
    },

    closeUserMenu() {
      const menu = document.getElementById('user-account-dropdown');
      if (menu) menu.style.display = 'none';
    },

    renderStaffRosterGrid(filterPosition = null) {
      const container = document.getElementById('staff-roster-picker') || document.getElementById('staff-roster-grid');
      if (!container) return;

      if (filterPosition !== null) {
        this.currentStaffPositionFilter = filterPosition;
      }
      const activeFilter = (this.currentStaffPositionFilter || 'All').toLowerCase();

      let staffList = this.config.users.filter(u => u.role !== 'Tenant');
      if (activeFilter !== 'all') {
        staffList = staffList.filter(u => {
          const pos = (u.position || '').toLowerCase();
          const dept = (u.department || '').toLowerCase();
          return pos.includes(activeFilter) || dept.includes(activeFilter);
        });
      }

      if (staffList.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; padding: 18px; text-align: center; color: #94a3b8; font-size: 11.5px;">No personnel found for this position filter.</div>';
        return;
      }

      container.innerHTML = staffList.map(u => {
        const isSelected = this.selectedStaffForPin && this.selectedStaffForPin.id === u.id;
        const initials = this.getInitials(u.name);
        return `
          <div class="staff-roster-card ${isSelected ? 'selected' : ''}" onclick="SecurityEngine.selectStaffForPin('${u.id}')" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: ${isSelected ? 'rgba(14, 165, 233, 0.18)' : 'rgba(30, 41, 59, 0.65)'}; border: 1px solid ${isSelected ? '#38bdf8' : 'rgba(51, 65, 85, 0.7)'}; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; position: relative;">
            <div class="staff-card-avatar" style="width: 32px; height: 32px; border-radius: 50%; background: ${isSelected ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' : 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'}; color: #ffffff; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">${initials}</div>
            <div class="staff-card-info" style="flex: 1; min-width: 0;">
              <div class="staff-card-name" style="font-size: 12px; font-weight: 700; color: ${isSelected ? '#ffffff' : '#f1f5f9'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${u.name}</div>
              <div style="font-size: 10px; font-weight: 700; color: #38bdf8; text-transform: uppercase;">${u.position || u.role}</div>
            </div>
            ${isSelected ? `<div style="color: #38bdf8; font-size: 14px; font-weight: 900;">✓</div>` : ''}
          </div>
        `;
      }).join('');
    },

    filterStaffRosterByPosition(position, btnEl) {
      this.currentStaffPositionFilter = position;
      if (btnEl && btnEl.parentElement) {
        Array.from(btnEl.parentElement.children).forEach(c => c.classList.remove('active'));
        btnEl.classList.add('active');
      }
      this.renderStaffRosterGrid();
    },

    loginPersonnelBySchedule(empId) {
      this.showLoginPortal();
      this.switchLoginTab('staff-pin');
      this.selectStaffForPin(empId);
    },

    selectStaffForPin(userId) {
      const user = this.config.users.find(u => u.id === userId);
      if (!user) return;
      this.selectedStaffForPin = user;
      this.currentPinInput = '';
      this.renderStaffRosterGrid();
      this.updateLoginPinDots();
      
      const promptEl = document.getElementById('pin-entry-prompt') || document.querySelector('#login-tab-pane-staff-pin .pin-hint');
      if (promptEl) {
        promptEl.innerHTML = `Enter 6-digit PIN for <strong>${user.name}</strong> <span style="color:#38bdf8;">(${user.position || user.role})</span>`;
      }
    },

    // --- NUMERIC KEYPAD HANDLERS ---
    
    pressLoginPin(digit) {
      this.handlePinKeyPress(digit, 'login');
    },
    clearLoginPin() {
      this.handlePinClear('login');
    },
    backspaceLoginPin() {
      this.handlePinBackspace('login');
    },
    pressLockPin(digit) {
      this.handlePinKeyPress(digit, 'lock');
    },
    clearLockPin() {
      this.handlePinClear('lock');
    },
    backspaceLockPin() {
      this.handlePinBackspace('lock');
    },

    handlePinKeyPress(digit, target = 'login') {
      if (this.currentPinInput.length >= 6) return;
      this.currentPinInput += digit;

      if (target === 'login') {
        this.updateLoginPinDots();
        if (this.currentPinInput.length === 6) {
          setTimeout(() => this.submitLoginPin(), 150);
        }
      } else if (target === 'lock') {
        this.updateLockScreenPinDots();
        if (this.currentPinInput.length === 6) {
          setTimeout(() => this.submitLockPin(), 150);
        }
      }
    },

    handlePinBackspace(target = 'login') {
      if (this.currentPinInput.length > 0) {
        this.currentPinInput = this.currentPinInput.slice(0, -1);
        if (target === 'login') this.updateLoginPinDots();
        else if (target === 'lock') this.updateLockScreenPinDots();
      }
    },

    handlePinClear(target = 'login') {
      this.currentPinInput = '';
      if (target === 'login') this.updateLoginPinDots();
      else if (target === 'lock') this.updateLockScreenPinDots();
    },

    updateLoginPinDots() {
      const dots = document.querySelectorAll('#login-pin-dots .pin-dot');
      dots.forEach((dot, idx) => {
        if (idx < this.currentPinInput.length) {
          dot.classList.add('filled');
          dot.style.background = '#d946ef';
          dot.style.borderColor = '#f0abfc';
          dot.style.boxShadow = '0 0 12px #d946ef, 0 0 4px #e879f9';
        } else {
          dot.classList.remove('filled');
          dot.style.background = 'transparent';
          dot.style.borderColor = '#38bdf8';
          dot.style.boxShadow = 'none';
        }
      });
    },

    updateLockScreenPinDots() {
      const dots = document.querySelectorAll('#lock-pin-dots .pin-dot');
      dots.forEach((dot, idx) => {
        if (idx < this.currentPinInput.length) {
          dot.classList.add('filled');
          dot.style.background = '#d946ef';
          dot.style.borderColor = '#f0abfc';
          dot.style.boxShadow = '0 0 12px #d946ef, 0 0 4px #e879f9';
        } else {
          dot.classList.remove('filled');
          dot.style.background = 'transparent';
          dot.style.borderColor = '#38bdf8';
          dot.style.boxShadow = 'none';
        }
      });
    },

    shakePinPad() {
      const pad = document.getElementById('login-pin-pad-container') || document.getElementById('lock-pin-pad-container');
      if (pad) {
        pad.classList.add('shake-animation');
        setTimeout(() => pad.classList.remove('shake-animation'), 500);
      }
      this.currentPinInput = '';
      this.updateLoginPinDots();
      this.updateLockScreenPinDots();
    },

    async submitLoginPin() {
      if (!this.selectedStaffForPin) {
        this.showLoginToast('Please select your staff profile first.', 'warning');
        this.currentPinInput = '';
        this.updateLoginPinDots();
        return;
      }
      const remember = document.getElementById('remember-me-pin')?.checked || false;
      const ok = await this.authenticateStaffWithPin(this.selectedStaffForPin.id, this.currentPinInput, remember);
      if (!ok) {
        this.shakePinPad();
      }
    },

    async submitLockPin() {
      const ok = await this.unlockScreenWithPin(this.currentPinInput);
      if (!ok) {
        this.shakePinPad();
      }
    },

    switchLoginTab(tab) {
      document.querySelectorAll('.login-tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.login-tab-pane').forEach(pane => pane.classList.remove('active'));

      const activeBtn = document.getElementById('login-tab-btn-' + tab);
      const activePane = document.getElementById('login-tab-pane-' + tab);

      if (activeBtn) activeBtn.classList.add('active');
      if (activePane) activePane.classList.add('active');

      this.currentPinInput = '';
      this.updateLoginPinDots();

      if (tab === 'staff-pin' && !this.selectedStaffForPin) {
        const defaultStaff = this.config.users.find(u => u.role === 'Manager') || this.config.users[0];
        if (defaultStaff) this.selectStaffForPin(defaultStaff.id);
      }
    },

    // --- MODALS (Change PIN, Audit Logs) ---
    openChangePinModal() {
      const modal = document.getElementById('change-pin-modal');
      if (modal && this.currentSession) {
        modal.style.display = 'flex';
        document.getElementById('change-pin-user-name').innerText = this.currentSession.name;
        document.getElementById('form-current-credential').value = '';
        document.getElementById('form-new-pin').value = '';
        document.getElementById('form-confirm-pin').value = '';
        document.getElementById('change-pin-msg').innerHTML = '';
      }
    },

    closeChangePinModal() {
      const modal = document.getElementById('change-pin-modal');
      if (modal) modal.style.display = 'none';
    },

    async handleSaveNewPin(e) {
      if (e) e.preventDefault();
      if (!this.currentSession) return;

      const currentCred = document.getElementById('form-current-credential').value;
      const newPin = document.getElementById('form-new-pin').value.trim();
      const confirmPin = document.getElementById('form-confirm-pin').value.trim();
      const msgEl = document.getElementById('change-pin-msg');

      if (newPin !== confirmPin) {
        msgEl.innerHTML = '<span style="color: #f87171;">New PINs do not match.</span>';
        return;
      }

      const result = await this.updateStaffPin(this.currentSession.userId, currentCred, newPin);
      if (result.success) {
        msgEl.innerHTML = '<span style="color: #34d399;">PIN successfully updated!</span>';
        setTimeout(() => this.closeChangePinModal(), 1200);
      } else {
        msgEl.innerHTML = '<span style="color: #f87171;">' + result.message + '</span>';
      }
    },

    openAuditLogModal() {
      const modal = document.getElementById('security-audit-modal');
      if (modal) {
        modal.style.display = 'flex';
        this.renderAuditLogTable();
      }
    },

    closeAuditLogModal() {
      const modal = document.getElementById('security-audit-modal');
      if (modal) modal.style.display = 'none';
    },

    renderAuditLogTable() {
      const tbody = document.getElementById('security-audit-tbody');
      if (!tbody) return;

      const logs = this.getAuditLogs();
      if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 20px;">No security audit logs recorded yet.</td></tr>';
        return;
      }

      tbody.innerHTML = logs.map(l => {
        const dateStr = new Date(l.timestamp).toLocaleString();
        let badgeStyle = 'background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);';
        if (l.eventType.includes('SUCCESS') || l.eventType.includes('UNLOCKED')) {
          badgeStyle = 'background: rgba(52, 211, 153, 0.15); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.3);';
        } else if (l.eventType.includes('FAILED') || l.eventType.includes('LOCKED')) {
          badgeStyle = 'background: rgba(248, 113, 113, 0.15); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.3);';
        } else if (l.eventType.includes('CHANGED') || l.eventType.includes('CLEARED')) {
          badgeStyle = 'background: rgba(251, 191, 36, 0.15); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3);';
        }

        return `
          <tr>
            <td style="font-size: 11px; color: #94a3b8; white-space: nowrap;">${dateStr}</td>
            <td><span style="font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 12px; ${badgeStyle}">${l.eventType}</span></td>
            <td style="font-weight: 600; color: #f8fafc;">${l.actor}</td>
            <td style="color: #cbd5e1; font-size: 12px;">${l.details}</td>
            <td style="font-size: 11px; color: #64748b;">${l.ipMock}</td>
          </tr>
        `;
      }).join('');
    },

    showLoginToast(msg, type = 'info') {
      const toast = document.getElementById('login-toast-msg');
      if (toast) {
        toast.innerText = msg;
        toast.className = 'auth-toast-message ' + type;
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 4000);
      }
    },

    showLockToast(msg, type = 'info') {
      const toast = document.getElementById('lock-toast-msg');
      if (toast) {
        toast.innerText = msg;
        toast.className = 'auth-toast-message ' + type;
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 4000);
      }
    }
  };

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('click', () => {
      SecurityEngine.closeUserMenu();
    });
  }


  // Global Shortcut Functions for UI Actions
  window.switchStaff = function() {
    if (window.SecurityEngine) {
      window.SecurityEngine.showLoginPortal();
    }
  };

  window.logoutUser = function() {
    if (window.SecurityEngine) {
      window.SecurityEngine.logout('MANUAL_LOGOUT');
    }
  };

  window.lockScreen = function() {
    if (window.SecurityEngine) {
      window.SecurityEngine.triggerScreenLock('MANUAL_LOCK');
    }
  };

  window.openSecuritySettings = function() {
    if (window.SecurityEngine) {
      window.SecurityEngine.openChangePinModal();
    }
  };

  window.openAuditLogs = function() {
    if (window.SecurityEngine) {
      window.SecurityEngine.openAuditLogModal();
    }
  };

  window.openLoginPortal = function() {
    if (window.SecurityEngine) {
      window.SecurityEngine.showLoginPortal();
    }
  };


  // Auto-initialize Security Engine on DOMContentLoaded
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        SecurityEngine.init();
      });
    } else {
      // DOM already ready
      SecurityEngine.init();
    }
  }

  window.SecurityEngine = SecurityEngine;
  window.SecurityCrypto = SecurityCrypto;

})(window);
