/**
 * One Corporate Maintenance Pro - Cloud Firestore Real-Time Synchronization Engine
 * Supports offline-first operation, real-time snapshot broadcasting across all clients,
 * automatic delta synchronization, and image compression to preserve free-tier limits.
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_CONFIG = 'onecorporate_firebase_config';
  const COLLECTION_TASKS = 'onecorporate_tasks';
  const COLLECTION_COMPLAINTS = 'onecorporate_complaints';
  const COLLECTION_JOB_ORDERS = 'onecorporate_job_orders';
  const COLLECTION_REGISTRY = 'onecorporate_registry';
  const COLLECTION_INVENTORY = 'onecorporate_inventory';
  const COLLECTION_CRITICAL_LEAKS = 'onecorporate_critical_leaks';
  const COLLECTION_META = 'onecorporate_meta';

  // Default embedded Firebase configuration (Enables automatic sync across all computers and Android builds)
  const EMBEDDED_FIREBASE_CONFIG = {
    apiKey: "AIzaSyBWEAHmfZS6BKCzv7x0qaPYqGHw7VpYkDo",
    authDomain: "one-corporate-maintenanc-f5c75.firebaseapp.com",
    projectId: "one-corporate-maintenanc-f5c75",
    storageBucket: "one-corporate-maintenanc-f5c75.firebasestorage.app",
    messagingSenderId: "1012650746230",
    appId: "1:1012650746230:web:af7acf24c87689f7f2da57",
    measurementId: "G-DKF93MC207"
  };

  const CloudSync = {
    db: null,
    isInitialized: false,
    isRemoteUpdating: false,
    isOnline: navigator.onLine,
    unsubscribers: [],
    status: 'unconfigured', // 'unconfigured' | 'connecting' | 'online' | 'offline' | 'error'
    statusMessage: '',

    // Change-tracking cache for delta sync
    lastSyncedTasks: {},
    lastSyncedComplaints: {},
    lastSyncedJobOrders: {},
    lastSyncedRegistry: {},
    lastSyncedOperationalStr: '',
    lastSyncedInventory: {},
    lastSyncedCriticalLeaks: {},
    lastSyncedEmergencyStr: '',
    syncDebounceTimer: null,
    initialLoadComplete: false,

    // -------------------------------------------------------------
    // INITIALIZATION & CONNECTION
    // -------------------------------------------------------------
    init: function() {
      window.addEventListener('online', () => CloudSync.handleNetworkChange(true));
      window.addEventListener('offline', () => CloudSync.handleNetworkChange(false));

      CloudSync.initializeCacheFromLocal();

      const config = CloudSync.getConfig();
      if (!config || !config.apiKey || !config.projectId) {
        CloudSync.setStatus('unconfigured', 'Cloud Sync is not configured. Click to connect Firebase.');
        return false;
      }

      return CloudSync.connect(config);
    },

    getState: function() {
      // 1. Try window.appState if it has tasks
      if (window.appState && Array.isArray(window.appState.tasks) && window.appState.tasks.length > 0) {
        return window.appState;
      }
      // 2. Try global appState if defined in scope
      if (typeof appState !== 'undefined' && appState && Array.isArray(appState.tasks) && appState.tasks.length > 0) {
        window.appState = appState;
        return appState;
      }
      // 3. Fallback: read directly from localStorage (always up to date)
      try {
        const raw = localStorage.getItem('onecorporate_maintenance_state');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            window.appState = parsed;
            return parsed;
          }
        }
      } catch (e) {
        console.warn('getState localStorage error:', e);
      }
      return window.appState || (typeof appState !== 'undefined' ? appState : {});
    },

    getInventoryItems: function() {
      try {
        const raw = localStorage.getItem('onecorporate_inventory_data');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            window.inventoryItems = parsed;
            return parsed;
          }
        }
      } catch (e) {
        console.warn('getInventoryItems error:', e);
      }
      if (window.inventoryItems && Array.isArray(window.inventoryItems)) {
        return window.inventoryItems;
      }
      return [];
    },

    getEmergencyState: function() {
      const state = CloudSync.getState() || {};
      let pastSafetyEvaluations = Array.isArray(state.pastSafetyEvaluations) ? state.pastSafetyEvaluations : [];
      let currentSafetyEvaluation = state.currentSafetyEvaluation || null;
      let criticalSignatories = [];
      let emergencyOrgStructure = [];

      try {
        const rawSig = localStorage.getItem('onecorp_critical_signatories');
        if (rawSig) criticalSignatories = JSON.parse(rawSig);
      } catch (e) {}

      try {
        const rawOrg = localStorage.getItem('onecorp_emergency_org_structure');
        if (rawOrg) {
          const parsed = JSON.parse(rawOrg);
          if (Array.isArray(parsed) && parsed.length > 0) emergencyOrgStructure = parsed;
        }
        if (emergencyOrgStructure.length === 0) {
          if (typeof window.getMainActiveOrgStructure === 'function') {
            emergencyOrgStructure = window.getMainActiveOrgStructure();
          } else if (typeof window.getActiveOrgStructure === 'function') {
            emergencyOrgStructure = window.getActiveOrgStructure();
          } else if (window.MAIN_DEFAULT_ORG_STRUCTURE) {
            emergencyOrgStructure = window.MAIN_DEFAULT_ORG_STRUCTURE;
          } else if (window.DEFAULT_ORG_STRUCTURE) {
            emergencyOrgStructure = window.DEFAULT_ORG_STRUCTURE;
          }
        }
      } catch (e) {}

      return {
        pastSafetyEvaluations: pastSafetyEvaluations,
        currentSafetyEvaluation: currentSafetyEvaluation,
        criticalSignatories: criticalSignatories,
        emergencyOrgStructure: emergencyOrgStructure
      };
    },

    getCriticalLeaks: function() {
      if (window.criticalState && Array.isArray(window.criticalState.items) && window.criticalState.items.length > 0) {
        return window.criticalState.items;
      }
      try {
        const raw = localStorage.getItem('onecorp_critical_evaluation_state');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
      if (window.DEFAULT_CRITICAL_LEAKS && Array.isArray(window.DEFAULT_CRITICAL_LEAKS)) {
        return window.DEFAULT_CRITICAL_LEAKS;
      }
      return [];
    },

    initializeCacheFromLocal: function() {
      try {
        const state = CloudSync.getState();
        if (state) {
          if (Array.isArray(state.tasks)) {
            state.tasks.forEach(t => {
              if (t && t.id) CloudSync.lastSyncedTasks[String(t.id)] = JSON.stringify(t);
            });
          }
          if (Array.isArray(state.complaints)) {
            state.complaints.forEach(c => {
              if (c && c.id) CloudSync.lastSyncedComplaints[String(c.id)] = JSON.stringify(c);
            });
          }
          if (Array.isArray(state.jobOrders)) {
            state.jobOrders.forEach(j => {
              if (j && j.id) CloudSync.lastSyncedJobOrders[String(j.id)] = JSON.stringify(j);
            });
          }
          if (Array.isArray(state.registry)) {
            state.registry.forEach(r => {
              if (r && r.id) CloudSync.lastSyncedRegistry[String(r.id)] = JSON.stringify(r);
            });
          }
          CloudSync.lastSyncedOperationalStr = JSON.stringify({
            managerCheckedActivities: state.managerCheckedActivities || {},
            isManagerAbsent: state.isManagerAbsent || false,
            employeeSchedules: state.employeeSchedules || []
          });
        }

        const inv = CloudSync.getInventoryItems();
        if (Array.isArray(inv)) {
          inv.forEach(i => {
            if (i && i.id) CloudSync.lastSyncedInventory[String(i.id)] = JSON.stringify(i);
          });
        }

        const leaks = CloudSync.getCriticalLeaks();
        if (Array.isArray(leaks)) {
          leaks.forEach(l => {
            if (l && l.id) CloudSync.lastSyncedCriticalLeaks[String(l.id)] = JSON.stringify(l);
          });
        }

        const emState = CloudSync.getEmergencyState();
        CloudSync.lastSyncedEmergencyStr = JSON.stringify(emState);
      } catch (e) {
        console.warn('Cache init error:', e);
      }
    },

    getConfig: function() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse stored Firebase config:', e);
      }

      // Fallback to embedded configuration if configured
      if (EMBEDDED_FIREBASE_CONFIG && EMBEDDED_FIREBASE_CONFIG.apiKey && EMBEDDED_FIREBASE_CONFIG.projectId) {
        return EMBEDDED_FIREBASE_CONFIG;
      }

      return null;
    },

    saveConfig: function(config) {
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
        return CloudSync.connect(config);
      } catch (e) {
        console.error('Failed to save Firebase config:', e);
        return false;
      }
    },

    clearConfig: function() {
      CloudSync.disconnect();
      localStorage.removeItem(STORAGE_KEY_CONFIG);
      CloudSync.setStatus('unconfigured', 'Cloud Sync disconnected.');
    },

    disconnect: function() {
      CloudSync.unsubscribers.forEach(unsub => {
        try { if (typeof unsub === 'function') unsub(); } catch(e) {}
      });
      CloudSync.unsubscribers = [];
      CloudSync.db = null;
      CloudSync.isInitialized = false;
      CloudSync.initialLoadComplete = false;
    },

    connect: function(config) {
      if (typeof firebase === 'undefined') {
        console.warn('Firebase SDK not loaded in DOM.');
        CloudSync.setStatus('error', 'Firebase SDK library not loaded.');
        return false;
      }

      CloudSync.disconnect();
      CloudSync.setStatus('connecting', 'Connecting to Cloud Firestore...');

      try {
        let app;
        if (!firebase.apps || !firebase.apps.length) {
          app = firebase.initializeApp(config);
        } else {
          app = firebase.app();
        }

        const db = firebase.firestore(app);
        CloudSync.db = db;

        // Enable IndexedDB offline persistence for multi-tab and offline field use
        db.enablePersistence({ synchronizeTabs: true }).catch(err => {
          if (err.code === 'failed-precondition') {
            console.warn('Firestore persistence warning: Multiple tabs open.');
          } else if (err.code === 'unimplemented') {
            console.warn('Firestore persistence warning: Browser lacks IndexedDB support.');
          } else {
            console.warn('Firestore persistence warning:', err);
          }
        });

        CloudSync.isInitialized = true;
        CloudSync.setStatus(navigator.onLine ? 'online' : 'offline', 'Connected to Cloud Firestore');

        // Start listening to real-time streams
        CloudSync.startListeners();

        // Update system meta heartbeat
        CloudSync.updateDeviceMeta();

        return true;
      } catch (err) {
        console.error('Cloud Firestore connection error:', err);
        CloudSync.setStatus('error', 'Connection failed: ' + (err.message || err));
        return false;
      }
    },

    handleNetworkChange: function(isOnline) {
      CloudSync.isOnline = isOnline;
      if (!CloudSync.isInitialized) return;
      if (isOnline) {
        CloudSync.setStatus('online', 'Connected to Cloud Firestore (Real-time sync active)');
        CloudSync.performDeltaSync();
      } else {
        CloudSync.setStatus('offline', 'Offline Mode: Local changes will sync when reconnected');
      }
    },

    setStatus: function(status, message) {
      CloudSync.status = status;
      CloudSync.statusMessage = message || '';
      CloudSync.updateStatusUI();
    },

    updateStatusUI: function() {
      const badgeDot = document.getElementById('cloud-sync-dot');
      const badgeText = document.getElementById('cloud-sync-text');
      const badgeBtn = document.getElementById('cloud-sync-btn');
      if (!badgeDot || !badgeText) return;

      switch (CloudSync.status) {
        case 'online':
          badgeDot.style.background = '#22c55e'; // Green
          badgeDot.style.boxShadow = '0 0 8px #22c55e';
          badgeText.textContent = 'Cloud Sync: Live';
          if (badgeBtn) badgeBtn.title = 'Real-time Cloud Sync is ACTIVE. Click for settings.';
          break;
        case 'offline':
          badgeDot.style.background = '#f59e0b'; // Amber
          badgeDot.style.boxShadow = '0 0 8px #f59e0b';
          badgeText.textContent = 'Cloud: Offline (Cached)';
          if (badgeBtn) badgeBtn.title = 'Operating offline. Local changes will auto-sync upon reconnecting.';
          break;
        case 'connecting':
          badgeDot.style.background = '#38bdf8'; // Sky blue
          badgeDot.style.boxShadow = '0 0 8px #38bdf8';
          badgeText.textContent = 'Cloud: Connecting...';
          if (badgeBtn) badgeBtn.title = 'Connecting to Google Cloud Firestore...';
          break;
        case 'error':
          badgeDot.style.background = '#ef4444'; // Red
          badgeDot.style.boxShadow = '0 0 8px #ef4444';
          badgeText.textContent = 'Cloud: Error';
          if (badgeBtn) badgeBtn.title = 'Sync Error: ' + CloudSync.statusMessage;
          break;
        case 'unconfigured':
        default:
          badgeDot.style.background = '#94a3b8'; // Slate Gray
          badgeDot.style.boxShadow = 'none';
          badgeText.textContent = 'Cloud: Setup';
          if (badgeBtn) badgeBtn.title = 'Cloud sync is not configured. Click to connect your free Firebase project.';
          break;
      }

      const statusLabel = document.getElementById('cloud-modal-status-text');
      if (statusLabel) {
        statusLabel.textContent = CloudSync.status.toUpperCase() + ' - ' + CloudSync.statusMessage;
      }
    },

    // -------------------------------------------------------------
    // REAL-TIME LISTENERS (onSnapshot)
    // -------------------------------------------------------------
    startListeners: function() {
      if (!CloudSync.db) return;

      // 1. Tasks Listener
      try {
        const unsubTasks = CloudSync.db.collection(COLLECTION_TASKS).onSnapshot(
          snapshot => CloudSync.handleTasksSnapshot(snapshot),
          err => {
            console.error('Tasks listener error:', err);
            CloudSync.setStatus('error', err.message || 'Firestore error');
          }
        );
        CloudSync.unsubscribers.push(unsubTasks);
      } catch (e) {
        console.error('Failed to attach tasks listener:', e);
      }

      // 2. Complaints Listener
      try {
        const unsubComplaints = CloudSync.db.collection(COLLECTION_COMPLAINTS).onSnapshot(
          snapshot => CloudSync.handleComplaintsSnapshot(snapshot),
          err => {
            console.error('Complaints listener error:', err);
            CloudSync.setStatus('error', err.message || 'Firestore error');
          }
        );
        CloudSync.unsubscribers.push(unsubComplaints);
      } catch (e) {
        console.error('Failed to attach complaints listener:', e);
      }

      // 3. Job Orders Listener
      try {
        const unsubJobOrders = CloudSync.db.collection(COLLECTION_JOB_ORDERS).onSnapshot(
          snapshot => CloudSync.handleJobOrdersSnapshot(snapshot),
          err => {
            console.error('Job Orders listener error:', err);
            CloudSync.setStatus('error', err.message || 'Firestore error');
          }
        );
        CloudSync.unsubscribers.push(unsubJobOrders);
      } catch (e) {
        console.error('Failed to attach job orders listener:', e);
      }

      // 4. Registry Listener
      try {
        const unsubRegistry = CloudSync.db.collection(COLLECTION_REGISTRY).onSnapshot(
          snapshot => CloudSync.handleRegistrySnapshot(snapshot),
          err => {
            console.error('Registry listener error:', err);
            CloudSync.setStatus('error', err.message || 'Firestore error');
          }
        );
        CloudSync.unsubscribers.push(unsubRegistry);
      } catch (e) {
        console.error('Failed to attach registry listener:', e);
      }

      // 5. Operational State Listener (Manager Oversight Schedule Checklists, Absence, Schedules)
      try {
        const unsubOperational = CloudSync.db.collection(COLLECTION_META).doc('operational_state').onSnapshot(
          doc => CloudSync.handleOperationalSnapshot(doc),
          err => {
            console.error('Operational state listener error:', err);
            CloudSync.setStatus('error', err.message || 'Firestore error');
          }
        );
        CloudSync.unsubscribers.push(unsubOperational);
      } catch (e) {
        console.error('Failed to attach operational state listener:', e);
      }

      // 6. Inventory Listener (Asset & Materials Catalog)
      try {
        const unsubInventory = CloudSync.db.collection(COLLECTION_INVENTORY).onSnapshot(
          snapshot => CloudSync.handleInventorySnapshot(snapshot),
          err => {
            console.error('Inventory listener error:', err);
            CloudSync.setStatus('error', err.message || 'Firestore error');
          }
        );
        CloudSync.unsubscribers.push(unsubInventory);
      } catch (e) {
        console.error('Failed to attach inventory listener:', e);
      }

      // 7. Emergency State Listener (Inspection Logs, Placards, Signatories, BERT Org Structure)
      try {
        const unsubEmergency = CloudSync.db.collection(COLLECTION_META).doc('emergency_state').onSnapshot(
          doc => CloudSync.handleEmergencySnapshot(doc),
          err => {
            console.error('Emergency state listener error:', err);
            CloudSync.setStatus('error', err.message || 'Firestore error');
          }
        );
        CloudSync.unsubscribers.push(unsubEmergency);
      } catch (e) {
        console.error('Failed to attach emergency state listener:', e);
      }

      // 8. Critical Leaks Listener (Leak & Crack Tracing Logs)
      try {
        const unsubCriticalLeaks = CloudSync.db.collection(COLLECTION_CRITICAL_LEAKS).onSnapshot(
          snapshot => CloudSync.handleCriticalLeaksSnapshot(snapshot),
          err => {
            console.error('Critical leaks listener error:', err);
            CloudSync.setStatus('error', err.message || 'Firestore error');
          }
        );
        CloudSync.unsubscribers.push(unsubCriticalLeaks);
      } catch (e) {
        console.error('Failed to attach critical leaks listener:', e);
      }
    },

    handleTasksSnapshot: function(snapshot) {
      if (snapshot.empty && (!window.appState || !window.appState.tasks || window.appState.tasks.length === 0)) return;

      let changed = false;
      CloudSync.isRemoteUpdating = true;

      try {
        if (!window.appState) window.appState = {};
        if (!Array.isArray(window.appState.tasks)) window.appState.tasks = [];

        const remoteTaskIds = new Set();
        snapshot.docs.forEach(doc => remoteTaskIds.add(String(doc.id)));

        snapshot.docChanges().forEach(change => {
          const docData = change.doc.data();
          const docId = change.doc.id;
          const item = { ...docData, id: docId };
          const serialized = JSON.stringify(item);

          const index = window.appState.tasks.findIndex(t => String(t.id) === String(docId));

          if (change.type === 'added' || change.type === 'modified') {
            CloudSync.lastSyncedTasks[docId] = serialized;
            if (index >= 0) {
              if (JSON.stringify(window.appState.tasks[index]) !== serialized) {
                window.appState.tasks[index] = item;
                changed = true;
              }
            } else {
              window.appState.tasks.push(item);
              changed = true;
            }
          } else if (change.type === 'removed') {
            delete CloudSync.lastSyncedTasks[docId];
            if (index >= 0) {
              window.appState.tasks.splice(index, 1);
              changed = true;
            }
          }
        });

        // Reconcile remote deletions against local tasks
        if (!snapshot.empty) {
          const beforeLen = window.appState.tasks.length;
          window.appState.tasks = window.appState.tasks.filter(t => {
            const tid = String(t.id);
            if (!remoteTaskIds.has(tid)) {
              delete CloudSync.lastSyncedTasks[tid];
              return false;
            }
            return true;
          });
          if (window.appState.tasks.length !== beforeLen) {
            changed = true;
          }
        }

        if (changed) {
          CloudSync.persistLocalBackup();
          CloudSync.safeRefreshUI('tasks');
        }
      } catch (e) {
        console.error('Error handling tasks snapshot:', e);
      } finally {
        setTimeout(() => { CloudSync.isRemoteUpdating = false; }, 100);
      }
    },

    handleComplaintsSnapshot: function(snapshot) {
      let changed = false;
      CloudSync.isRemoteUpdating = true;

      try {
        if (!window.appState) window.appState = {};
        if (!Array.isArray(window.appState.complaints)) window.appState.complaints = [];

        const remoteCompIds = new Set();
        snapshot.docs.forEach(doc => remoteCompIds.add(String(doc.id)));

        snapshot.docChanges().forEach(change => {
          const docData = change.doc.data();
          const docId = change.doc.id;
          const item = { ...docData, id: docId };
          const serialized = JSON.stringify(item);

          const index = window.appState.complaints.findIndex(c => String(c.id) === String(docId));

          if (change.type === 'added' || change.type === 'modified') {
            CloudSync.lastSyncedComplaints[docId] = serialized;
            if (index >= 0) {
              if (JSON.stringify(window.appState.complaints[index]) !== serialized) {
                window.appState.complaints[index] = item;
                changed = true;
              }
            } else {
              window.appState.complaints.push(item);
              changed = true;
            }
          } else if (change.type === 'removed') {
            delete CloudSync.lastSyncedComplaints[docId];
            if (index >= 0) {
              window.appState.complaints.splice(index, 1);
              changed = true;
            }
          }
        });

        // Reconcile remote deletions against local complaints
        if (!snapshot.empty) {
          const beforeLen = window.appState.complaints.length;
          window.appState.complaints = window.appState.complaints.filter(c => {
            const cid = String(c.id);
            if (!remoteCompIds.has(cid)) {
              delete CloudSync.lastSyncedComplaints[cid];
              return false;
            }
            return true;
          });
          if (window.appState.complaints.length !== beforeLen) {
            changed = true;
          }
        }

        if (changed) {
          CloudSync.persistLocalBackup();
          CloudSync.safeRefreshUI('complaints');
        }
      } catch (e) {
        console.error('Error handling complaints snapshot:', e);
      } finally {
        setTimeout(() => { CloudSync.isRemoteUpdating = false; }, 100);
      }
    },

    handleJobOrdersSnapshot: function(snapshot) {
      let changed = false;
      CloudSync.isRemoteUpdating = true;

      try {
        if (!window.appState) window.appState = {};
        if (!Array.isArray(window.appState.jobOrders)) window.appState.jobOrders = [];

        const remoteJoIds = new Set();
        snapshot.docs.forEach(doc => remoteJoIds.add(String(doc.id)));

        snapshot.docChanges().forEach(change => {
          const docData = change.doc.data();
          const docId = change.doc.id;
          const item = { ...docData, id: docId };
          const serialized = JSON.stringify(item);

          const index = window.appState.jobOrders.findIndex(jo => String(jo.id) === String(docId));

          if (change.type === 'added' || change.type === 'modified') {
            CloudSync.lastSyncedJobOrders[docId] = serialized;
            if (index >= 0) {
              if (JSON.stringify(window.appState.jobOrders[index]) !== serialized) {
                window.appState.jobOrders[index] = item;
                changed = true;
              }
            } else {
              window.appState.jobOrders.push(item);
              changed = true;
            }
          } else if (change.type === 'removed') {
            delete CloudSync.lastSyncedJobOrders[docId];
            if (index >= 0) {
              window.appState.jobOrders.splice(index, 1);
              changed = true;
            }
          }
        });

        // Reconcile remote deletions against local job orders
        if (!snapshot.empty) {
          const beforeLen = window.appState.jobOrders.length;
          window.appState.jobOrders = window.appState.jobOrders.filter(j => {
            const jid = String(j.id);
            if (!remoteJoIds.has(jid)) {
              delete CloudSync.lastSyncedJobOrders[jid];
              return false;
            }
            return true;
          });
          if (window.appState.jobOrders.length !== beforeLen) {
            changed = true;
          }
        }

        if (changed) {
          CloudSync.persistLocalBackup();
          CloudSync.safeRefreshUI('jobOrders');
        }
      } catch (e) {
        console.error('Error handling job orders snapshot:', e);
      } finally {
        setTimeout(() => { CloudSync.isRemoteUpdating = false; }, 100);
      }
    },

    handleRegistrySnapshot: function(snapshot) {
      if (snapshot.empty && (!window.appState || !window.appState.registry || window.appState.registry.length === 0)) return;

      let changed = false;
      CloudSync.isRemoteUpdating = true;

      try {
        if (!window.appState) window.appState = {};
        if (!Array.isArray(window.appState.registry)) window.appState.registry = [];

        const remoteRegIds = new Set();
        snapshot.docs.forEach(doc => remoteRegIds.add(String(doc.id)));

        snapshot.docChanges().forEach(change => {
          const docData = change.doc.data();
          const docId = change.doc.id;
          const item = { ...docData, id: docId };
          const serialized = JSON.stringify(item);

          const index = window.appState.registry.findIndex(r => String(r.id) === String(docId));

          if (change.type === 'added' || change.type === 'modified') {
            CloudSync.lastSyncedRegistry[docId] = serialized;
            if (index >= 0) {
              if (JSON.stringify(window.appState.registry[index]) !== serialized) {
                window.appState.registry[index] = item;
                changed = true;
              }
            } else {
              window.appState.registry.push(item);
              changed = true;
            }
          } else if (change.type === 'removed') {
            delete CloudSync.lastSyncedRegistry[docId];
            if (index >= 0) {
              window.appState.registry.splice(index, 1);
              changed = true;
            }
          }
        });

        // Reconcile remote deletions against local registry
        if (!snapshot.empty) {
          const beforeLen = window.appState.registry.length;
          window.appState.registry = window.appState.registry.filter(r => {
            const rid = String(r.id);
            if (!remoteRegIds.has(rid)) {
              delete CloudSync.lastSyncedRegistry[rid];
              return false;
            }
            return true;
          });
          if (window.appState.registry.length !== beforeLen) {
            changed = true;
          }
        }

        if (changed) {
          CloudSync.persistLocalBackup();
          CloudSync.safeRefreshUI('registry');
        }
      } catch (e) {
        console.error('Error handling registry snapshot:', e);
      } finally {
        setTimeout(() => { CloudSync.isRemoteUpdating = false; }, 100);
      }
    },

    handleOperationalSnapshot: function(doc) {
      if (!doc || !doc.exists) return;
      const data = doc.data();
      if (!data) return;

      let changed = false;
      CloudSync.isRemoteUpdating = true;

      try {
        if (!window.appState) window.appState = {};

        // 1. Manager Oversight Checked Activities
        if (data.managerCheckedActivities && typeof data.managerCheckedActivities === 'object') {
          const serialized = JSON.stringify(data.managerCheckedActivities);
          if (JSON.stringify(window.appState.managerCheckedActivities || {}) !== serialized) {
            window.appState.managerCheckedActivities = { ...data.managerCheckedActivities };
            changed = true;
          }
        }

        // 2. Manager Absence Status
        if (typeof data.isManagerAbsent === 'boolean' && window.appState.isManagerAbsent !== data.isManagerAbsent) {
          window.appState.isManagerAbsent = data.isManagerAbsent;
          const toggleCheckbox = document.getElementById('manager-absence-toggle');
          if (toggleCheckbox) toggleCheckbox.checked = data.isManagerAbsent;
          if (typeof window.updateManagerAbsenceBanner === 'function') window.updateManagerAbsenceBanner();
          changed = true;
        }

        // 3. Employee Schedules
        if (Array.isArray(data.employeeSchedules)) {
          const serialized = JSON.stringify(data.employeeSchedules);
          if (JSON.stringify(window.appState.employeeSchedules || []) !== serialized) {
            window.appState.employeeSchedules = [...data.employeeSchedules];
            changed = true;
          }
        }

        if (changed) {
          CloudSync.lastSyncedOperationalStr = JSON.stringify({
            managerCheckedActivities: window.appState.managerCheckedActivities || {},
            isManagerAbsent: window.appState.isManagerAbsent || false,
            employeeSchedules: window.appState.employeeSchedules || []
          });
          CloudSync.persistLocalBackup();
          if (typeof window.renderTimeline === 'function') window.renderTimeline();
          if (typeof window.renderEmployeeSchedule === 'function') window.renderEmployeeSchedule();
        }
      } catch (e) {
        console.error('Error handling operational snapshot:', e);
      } finally {
        setTimeout(() => { CloudSync.isRemoteUpdating = false; }, 100);
      }
    },

    handleInventorySnapshot: function(snapshot) {
      if (snapshot.empty && (!window.inventoryItems || window.inventoryItems.length === 0)) {
        const localRaw = localStorage.getItem('onecorporate_inventory_data');
        if (!localRaw) return;
      }

      let changed = false;
      CloudSync.isRemoteUpdating = true;

      try {
        let items = CloudSync.getInventoryItems();
        if (!Array.isArray(items)) items = [];

        const remoteInvIds = new Set();
        snapshot.docs.forEach(doc => remoteInvIds.add(String(doc.id)));

        snapshot.docChanges().forEach(change => {
          const docData = change.doc.data();
          const docId = change.doc.id;
          const item = { ...docData, id: docId };
          const serialized = JSON.stringify(item);

          const index = items.findIndex(i => String(i.id) === String(docId));

          if (change.type === 'added' || change.type === 'modified') {
            CloudSync.lastSyncedInventory[docId] = serialized;
            if (index >= 0) {
              if (JSON.stringify(items[index]) !== serialized) {
                items[index] = item;
                changed = true;
              }
            } else {
              items.unshift(item);
              changed = true;
            }
          } else if (change.type === 'removed') {
            delete CloudSync.lastSyncedInventory[docId];
            if (index >= 0) {
              items.splice(index, 1);
              changed = true;
            }
          }
        });

        // Reconcile remote deletions against local inventory items
        if (!snapshot.empty) {
          const beforeLen = items.length;
          items = items.filter(localItem => {
            const iid = String(localItem.id);
            if (!remoteInvIds.has(iid)) {
              delete CloudSync.lastSyncedInventory[iid];
              return false;
            }
            return true;
          });
          if (items.length !== beforeLen) {
            changed = true;
          }
        }

        if (changed) {
          window.inventoryItems = items;
          try {
            localStorage.setItem('onecorporate_inventory_data', JSON.stringify(items));
          } catch (e) {}

          // Refresh if running on the inventory page directly
          if (typeof window.setInventoryItems === 'function') {
            window.setInventoryItems(items);
          } else if (typeof window.loadInventoryData === 'function') {
            window.loadInventoryData();
          }
          if (typeof window.populateLocationFilterOptions === 'function') {
            window.populateLocationFilterOptions();
          }
          if (typeof window.renderApp === 'function') {
            window.renderApp();
          }

          // If in parent window, notify embedded inventory iframe
          const iframe = document.querySelector('iframe[src*="inventory"]');
          if (iframe && iframe.contentWindow) {
            try {
              if (typeof iframe.contentWindow.setInventoryItems === 'function') {
                iframe.contentWindow.setInventoryItems(items);
              } else if (typeof iframe.contentWindow.loadInventoryData === 'function') {
                iframe.contentWindow.loadInventoryData();
              }
              if (typeof iframe.contentWindow.populateLocationFilterOptions === 'function') {
                iframe.contentWindow.populateLocationFilterOptions();
              }
              if (typeof iframe.contentWindow.renderApp === 'function') {
                iframe.contentWindow.renderApp();
              }
            } catch (err) {}
          }

          // If running inside iframe, notify parent window
          if (window.parent && window.parent !== window) {
            window.parent.inventoryItems = items;
          }
        }
      } catch (e) {
        console.error('Error handling inventory snapshot:', e);
      } finally {
        setTimeout(() => { CloudSync.isRemoteUpdating = false; }, 100);
      }
    },

    handleEmergencySnapshot: function(doc) {
      if (!doc || !doc.exists) return;
      const data = doc.data();
      if (!data) return;

      let changed = false;
      CloudSync.isRemoteUpdating = true;

      try {
        if (!window.appState) window.appState = {};
        if (!window.parentState) window.parentState = window.appState;

        // 1. Past Safety Evaluations
        if (Array.isArray(data.pastSafetyEvaluations)) {
          const serialized = JSON.stringify(data.pastSafetyEvaluations);
          const currentLocal = JSON.stringify(window.parentState.pastSafetyEvaluations || window.appState.pastSafetyEvaluations || []);
          if (currentLocal !== serialized) {
            window.appState.pastSafetyEvaluations = [...data.pastSafetyEvaluations];
            window.parentState.pastSafetyEvaluations = [...data.pastSafetyEvaluations];
            changed = true;
          }
        }

        // 2. Current Safety Evaluation (active wizard evaluation)
        if (data.currentSafetyEvaluation !== undefined) {
          const serializedCurr = JSON.stringify(data.currentSafetyEvaluation);
          const localCurr = JSON.stringify(window.parentState.currentSafetyEvaluation || window.appState.currentSafetyEvaluation || null);
          if (localCurr !== serializedCurr) {
            window.appState.currentSafetyEvaluation = data.currentSafetyEvaluation;
            window.parentState.currentSafetyEvaluation = data.currentSafetyEvaluation;
            changed = true;
          }
        }

        // 3. Critical Signatories
        if (Array.isArray(data.criticalSignatories)) {
          const serializedSig = JSON.stringify(data.criticalSignatories);
          const rawSig = localStorage.getItem('onecorp_critical_signatories');
          if (rawSig !== serializedSig) {
            localStorage.setItem('onecorp_critical_signatories', serializedSig);
            if (window.criticalState) {
              window.criticalState.signatories = [...data.criticalSignatories];
            }
            changed = true;
          }
        }

        // 4. BERT Emergency Org Structure
        if (Array.isArray(data.emergencyOrgStructure) && data.emergencyOrgStructure.length > 0) {
          const serializedOrg = JSON.stringify(data.emergencyOrgStructure);
          const rawOrg = localStorage.getItem('onecorp_emergency_org_structure');
          if (rawOrg !== serializedOrg) {
            localStorage.setItem('onecorp_emergency_org_structure', serializedOrg);
            changed = true;
          }
        }

        if (changed) {
          CloudSync.lastSyncedEmergencyStr = JSON.stringify({
            pastSafetyEvaluations: window.parentState.pastSafetyEvaluations || [],
            currentSafetyEvaluation: window.parentState.currentSafetyEvaluation || null,
            criticalSignatories: (window.criticalState && window.criticalState.signatories) || [],
            emergencyOrgStructure: data.emergencyOrgStructure || []
          });

          CloudSync.persistLocalBackup();

          // Refresh emergency UI functions across dashboard and standalone module
          if (typeof window.renderMainEmergencyOrgStructure === 'function') window.renderMainEmergencyOrgStructure();
          if (typeof window.renderMainHierarchicalOrgChart === 'function') window.renderMainHierarchicalOrgChart();
          if (typeof window.renderMainOrgCardsView === 'function') window.renderMainOrgCardsView();
          if (typeof window.renderEmergencyOrgStructure === 'function') window.renderEmergencyOrgStructure();
          if (typeof window.renderActiveOrgStructure === 'function') window.renderActiveOrgStructure();
          if (typeof window.renderHierarchicalOrgChart === 'function') window.renderHierarchicalOrgChart();
          if (typeof window.renderOrgCardsView === 'function') window.renderOrgCardsView();
          if (typeof window.renderInspectionLogsTable === 'function') window.renderInspectionLogsTable();
          if (typeof window.renderLogsTable === 'function') window.renderLogsTable();
          if (typeof window.populateReassuranceLogsDropdown === 'function') window.populateReassuranceLogsDropdown();
          if (typeof window.populateReassuranceSelect === 'function') window.populateReassuranceSelect();
          if (typeof window.generateComprehensiveReport === 'function') window.generateComprehensiveReport();
          if (typeof window.renderReassuranceReport === 'function') window.renderReassuranceReport();

          // Notify iframe if present in parent window
          const emergencyIframe = document.querySelector('iframe[src*="emergency"]');
          if (emergencyIframe && emergencyIframe.contentWindow) {
            try {
              if (typeof emergencyIframe.contentWindow.renderEmergencyOrgStructure === 'function') {
                emergencyIframe.contentWindow.renderEmergencyOrgStructure();
              }
            } catch (e) {}
          }

          // If in iframe/popup, notify parent or opener
          if (window.parent && window.parent !== window) {
            try {
              if (typeof window.parent.renderMainEmergencyOrgStructure === 'function') {
                window.parent.renderMainEmergencyOrgStructure();
              }
            } catch (e) {}
          }
          if (window.opener && !window.opener.closed) {
            try {
              if (typeof window.opener.renderMainEmergencyOrgStructure === 'function') {
                window.opener.renderMainEmergencyOrgStructure();
              }
            } catch (e) {}
          }
        }
      } catch (e) {
        console.error('Error handling emergency state snapshot:', e);
      } finally {
        setTimeout(() => { CloudSync.isRemoteUpdating = false; }, 100);
      }
    },

    handleCriticalLeaksSnapshot: function(snapshot) {
      if (snapshot.empty && (!window.criticalState || !window.criticalState.items || window.criticalState.items.length === 0)) return;

      let changed = false;
      CloudSync.isRemoteUpdating = true;

      try {
        let items = CloudSync.getCriticalLeaks();
        if (!Array.isArray(items)) items = [];

        const remoteLeakIds = new Set();
        snapshot.docs.forEach(doc => remoteLeakIds.add(String(doc.id)));

        snapshot.docChanges().forEach(change => {
          const docData = change.doc.data();
          const docId = change.doc.id;
          const item = { ...docData, id: docId };
          const serialized = JSON.stringify(item);

          const index = items.findIndex(l => String(l.id) === String(docId));

          if (change.type === 'added' || change.type === 'modified') {
            CloudSync.lastSyncedCriticalLeaks[docId] = serialized;
            if (index >= 0) {
              if (JSON.stringify(items[index]) !== serialized) {
                items[index] = item;
                changed = true;
              }
            } else {
              items.push(item);
              changed = true;
            }
          } else if (change.type === 'removed') {
            delete CloudSync.lastSyncedCriticalLeaks[docId];
            if (index >= 0) {
              items.splice(index, 1);
              changed = true;
            }
          }
        });

        // Reconcile remote deletions against local critical leaks
        if (!snapshot.empty) {
          const beforeLen = items.length;
          items = items.filter(l => {
            const lid = String(l.id);
            if (!remoteLeakIds.has(lid)) {
              delete CloudSync.lastSyncedCriticalLeaks[lid];
              return false;
            }
            return true;
          });
          if (items.length !== beforeLen) {
            changed = true;
          }
        }

        if (changed) {
          if (window.criticalState) window.criticalState.items = items;
          try {
            localStorage.setItem('onecorp_critical_evaluation_state', JSON.stringify(items));
            if (window.parentState) window.parentState.criticalEvaluation = items;
          } catch (e) {}

          if (typeof window.renderCriticalEvaluationTable === 'function') {
            window.renderCriticalEvaluationTable();
          }
          if (typeof window.renderCriticalEvaluationKPIs === 'function') {
            window.renderCriticalEvaluationKPIs();
          }
        }
      } catch (e) {
        console.error('Error handling critical leaks snapshot:', e);
      } finally {
        setTimeout(() => { CloudSync.isRemoteUpdating = false; }, 100);
      }
    },

    safeRefreshUI: function(area) {
      try {
        if (typeof window.renderApp === 'function') {
          window.renderApp();
          return;
        }
        if (area === 'tasks' && typeof window.renderTimeline === 'function') {
          window.renderTimeline();
        }
        if (area === 'complaints' && typeof window.renderTenantDesk === 'function') {
          window.renderTenantDesk();
        }
        if (area === 'jobOrders' && typeof window.renderJobOrders === 'function') {
          window.renderJobOrders();
        }
        if (area === 'registry' && typeof window.renderRegistryTable === 'function') {
          window.renderRegistryTable();
        }
      } catch (err) {
        console.warn('UI refresh after sync encountered an error:', err);
      }
    },

    persistLocalBackup: function() {
      try {
        if (window.appState) {
          localStorage.setItem('onecorporate_maintenance_state', JSON.stringify(window.appState));
        }
      } catch (e) {
        console.warn('Failed local backup during sync:', e);
      }
    },

    // -------------------------------------------------------------
    // AUTOMATIC DELTA SYNC (Called by saveState)
    // -------------------------------------------------------------
    queueSync: function() {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return;

      clearTimeout(CloudSync.syncDebounceTimer);
      CloudSync.syncDebounceTimer = setTimeout(() => {
        CloudSync.performDeltaSync();
      }, 350);
    },

    performDeltaSync: function() {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return;
      const state = CloudSync.getState();
      if (!state) return;

      // 1. Tasks Delta
      if (Array.isArray(state.tasks)) {
        const currentTaskIds = new Set();
        state.tasks.forEach(t => {
          if (!t || !t.id) return;
          const id = String(t.id);
          currentTaskIds.add(id);
          const serialized = JSON.stringify(t);
          if (CloudSync.lastSyncedTasks[id] !== serialized) {
            CloudSync.syncTask(t);
            CloudSync.lastSyncedTasks[id] = serialized;
          }
        });

        // Detect deleted tasks
        Object.keys(CloudSync.lastSyncedTasks).forEach(id => {
          if (!currentTaskIds.has(id)) {
            CloudSync.deleteTask(id);
            delete CloudSync.lastSyncedTasks[id];
          }
        });
      }

      // 2. Complaints Delta
      if (Array.isArray(state.complaints)) {
        const currentComplaintIds = new Set();
        state.complaints.forEach(c => {
          if (!c || !c.id) return;
          const id = String(c.id);
          currentComplaintIds.add(id);
          const serialized = JSON.stringify(c);
          if (CloudSync.lastSyncedComplaints[id] !== serialized) {
            CloudSync.syncComplaint(c);
            CloudSync.lastSyncedComplaints[id] = serialized;
          }
        });

        Object.keys(CloudSync.lastSyncedComplaints).forEach(id => {
          if (!currentComplaintIds.has(id)) {
            CloudSync.deleteComplaint(id);
            delete CloudSync.lastSyncedComplaints[id];
          }
        });
      }

      // 3. Job Orders Delta
      if (Array.isArray(state.jobOrders)) {
        const currentJoIds = new Set();
        state.jobOrders.forEach(jo => {
          if (!jo || !jo.id) return;
          const id = String(jo.id);
          currentJoIds.add(id);
          const serialized = JSON.stringify(jo);
          if (CloudSync.lastSyncedJobOrders[id] !== serialized) {
            CloudSync.syncJobOrder(jo);
            CloudSync.lastSyncedJobOrders[id] = serialized;
          }
        });

        Object.keys(CloudSync.lastSyncedJobOrders).forEach(id => {
          if (!currentJoIds.has(id)) {
            CloudSync.deleteJobOrder(id);
            delete CloudSync.lastSyncedJobOrders[id];
          }
        });
      }

      // 4. Registry Delta
      if (Array.isArray(state.registry)) {
        const currentRegIds = new Set();
        state.registry.forEach(r => {
          if (!r || !r.id) return;
          const id = String(r.id);
          currentRegIds.add(id);
          const serialized = JSON.stringify(r);
          if (CloudSync.lastSyncedRegistry[id] !== serialized) {
            CloudSync.syncRegistryItem(r);
            CloudSync.lastSyncedRegistry[id] = serialized;
          }
        });

        Object.keys(CloudSync.lastSyncedRegistry).forEach(id => {
          if (!currentRegIds.has(id)) {
            CloudSync.deleteRegistryItem(id);
            delete CloudSync.lastSyncedRegistry[id];
          }
        });
      }

      // 5. Operational State Delta (Manager Oversight Schedule Checklists, Absence, Schedules)
      const currentOps = {
        managerCheckedActivities: state.managerCheckedActivities || {},
        isManagerAbsent: state.isManagerAbsent || false,
        employeeSchedules: state.employeeSchedules || []
      };
      const serializedOps = JSON.stringify(currentOps);
      if (CloudSync.lastSyncedOperationalStr !== serializedOps) {
        CloudSync.syncOperationalState(currentOps);
        CloudSync.lastSyncedOperationalStr = serializedOps;
      }

      // 6. Inventory Items Delta
      const inventory = CloudSync.getInventoryItems();
      if (Array.isArray(inventory) && inventory.length > 0) {
        const currentInvIds = new Set();
        inventory.forEach(item => {
          if (!item || !item.id) return;
          const id = String(item.id);
          currentInvIds.add(id);
          const serialized = JSON.stringify(item);
          if (CloudSync.lastSyncedInventory[id] !== serialized) {
            CloudSync.syncInventoryItem(item);
            CloudSync.lastSyncedInventory[id] = serialized;
          }
        });

        // Detect deleted inventory items
        Object.keys(CloudSync.lastSyncedInventory).forEach(id => {
          if (!currentInvIds.has(id)) {
            CloudSync.deleteInventoryItem(id);
            delete CloudSync.lastSyncedInventory[id];
          }
        });
      }

      // 7. Emergency State Delta (Past Evaluations, Current In-Progress Wizard, Signatories, BERT Org Structure)
      const currentEm = CloudSync.getEmergencyState();
      const serializedEm = JSON.stringify(currentEm);
      if (CloudSync.lastSyncedEmergencyStr !== serializedEm) {
        CloudSync.syncEmergencyState(currentEm);
        CloudSync.lastSyncedEmergencyStr = serializedEm;
      }

      // 8. Critical Leaks Delta (Leak & Crack Tracing Logs)
      const leaks = CloudSync.getCriticalLeaks();
      if (Array.isArray(leaks) && leaks.length > 0) {
        const currentLeakIds = new Set();
        leaks.forEach(leak => {
          if (!leak || !leak.id) return;
          const id = String(leak.id);
          currentLeakIds.add(id);
          const serialized = JSON.stringify(leak);
          if (CloudSync.lastSyncedCriticalLeaks[id] !== serialized) {
            CloudSync.syncCriticalLeak(leak);
            CloudSync.lastSyncedCriticalLeaks[id] = serialized;
          }
        });

        // Detect deleted critical leak records
        Object.keys(CloudSync.lastSyncedCriticalLeaks).forEach(id => {
          if (!currentLeakIds.has(id)) {
            CloudSync.deleteCriticalLeak(id);
            delete CloudSync.lastSyncedCriticalLeaks[id];
          }
        });
      }
    },

    // -------------------------------------------------------------
    // OUTBOUND SYNC METHODS
    // -------------------------------------------------------------
    syncOperationalState: function(ops) {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return Promise.resolve();
      return CloudSync.db.collection(COLLECTION_META).doc('operational_state').set(ops, { merge: true })
        .catch(err => console.error('CloudSync.syncOperationalState error:', err));
    },

    syncTask: function(task) {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return Promise.resolve();
      if (!task || !task.id) return Promise.reject(new Error('Invalid task: missing ID'));

      const cleanDoc = { ...task };
      const docId = String(cleanDoc.id);
      delete cleanDoc.id;

      return CloudSync.db.collection(COLLECTION_TASKS).doc(docId).set(cleanDoc, { merge: true })
        .catch(err => console.error('CloudSync.syncTask error:', err));
    },

    deleteTask: function(taskId) {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return Promise.resolve();
      return CloudSync.db.collection(COLLECTION_TASKS).doc(String(taskId)).delete()
        .catch(err => console.error('CloudSync.deleteTask error:', err));
    },

    syncComplaint: function(complaint) {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return Promise.resolve();
      if (!complaint || !complaint.id) return Promise.reject(new Error('Invalid complaint: missing ID'));

      const cleanDoc = { ...complaint };
      const docId = String(cleanDoc.id);
      delete cleanDoc.id;

      return CloudSync.db.collection(COLLECTION_COMPLAINTS).doc(docId).set(cleanDoc, { merge: true })
        .catch(err => console.error('CloudSync.syncComplaint error:', err));
    },

    deleteComplaint: function(complaintId) {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return Promise.resolve();
      return CloudSync.db.collection(COLLECTION_COMPLAINTS).doc(String(complaintId)).delete()
        .catch(err => console.error('CloudSync.deleteComplaint error:', err));
    },

    syncJobOrder: function(jobOrder) {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return Promise.resolve();
      if (!jobOrder || !jobOrder.id) return Promise.reject(new Error('Invalid job order: missing ID'));

      const cleanDoc = { ...jobOrder };
      const docId = String(cleanDoc.id);
      delete cleanDoc.id;

      return CloudSync.db.collection(COLLECTION_JOB_ORDERS).doc(docId).set(cleanDoc, { merge: true })
        .catch(err => console.error('CloudSync.syncJobOrder error:', err));
    },

    deleteJobOrder: function(jobOrderId) {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return Promise.resolve();
      return CloudSync.db.collection(COLLECTION_JOB_ORDERS).doc(String(jobOrderId)).delete()
        .catch(err => console.error('CloudSync.deleteJobOrder error:', err));
    },

    syncRegistryItem: function(item) {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return Promise.resolve();
      if (!item || !item.id) return Promise.reject(new Error('Invalid registry item: missing ID'));

      const cleanDoc = { ...item };
      const docId = String(cleanDoc.id);
      delete cleanDoc.id;

      return CloudSync.db.collection(COLLECTION_REGISTRY).doc(docId).set(cleanDoc, { merge: true })
        .catch(err => console.error('CloudSync.syncRegistryItem error:', err));
    },

    deleteRegistryItem: function(itemId) {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return Promise.resolve();
      return CloudSync.db.collection(COLLECTION_REGISTRY).doc(String(itemId)).delete()
        .catch(err => console.error('CloudSync.deleteRegistryItem error:', err));
    },

    syncInventoryItem: function(item) {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return Promise.resolve();
      if (!item || !item.id) return Promise.reject(new Error('Invalid inventory item: missing ID'));

      const cleanDoc = { ...item };
      const docId = String(cleanDoc.id);
      delete cleanDoc.id;

      return CloudSync.db.collection(COLLECTION_INVENTORY).doc(docId).set(cleanDoc, { merge: true })
        .catch(err => console.error('CloudSync.syncInventoryItem error:', err));
    },

    deleteInventoryItem: function(itemId) {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return Promise.resolve();
      return CloudSync.db.collection(COLLECTION_INVENTORY).doc(String(itemId)).delete()
        .catch(err => console.error('CloudSync.deleteInventoryItem error:', err));
    },

    syncEmergencyState: function(emergencyData) {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return Promise.resolve();
      const payload = {
        pastSafetyEvaluations: emergencyData.pastSafetyEvaluations || [],
        currentSafetyEvaluation: emergencyData.currentSafetyEvaluation || null,
        criticalSignatories: emergencyData.criticalSignatories || [],
        emergencyOrgStructure: emergencyData.emergencyOrgStructure || [],
        updatedAt: new Date().toISOString()
      };
      return CloudSync.db.collection(COLLECTION_META).doc('emergency_state').set(payload, { merge: true })
        .catch(err => console.error('CloudSync.syncEmergencyState error:', err));
    },

    syncCriticalLeak: function(leak) {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return Promise.resolve();
      if (!leak || !leak.id) return Promise.reject(new Error('Invalid critical leak: missing ID'));

      const cleanDoc = { ...leak };
      const docId = String(cleanDoc.id);
      delete cleanDoc.id;

      return CloudSync.db.collection(COLLECTION_CRITICAL_LEAKS).doc(docId).set(cleanDoc, { merge: true })
        .catch(err => console.error('CloudSync.syncCriticalLeak error:', err));
    },

    deleteCriticalLeak: function(leakId) {
      if (!CloudSync.isInitialized || !CloudSync.db || CloudSync.isRemoteUpdating) return Promise.resolve();
      return CloudSync.db.collection(COLLECTION_CRITICAL_LEAKS).doc(String(leakId)).delete()
        .catch(err => console.error('CloudSync.deleteCriticalLeak error:', err));
    },

    updateDeviceMeta: function() {
      if (!CloudSync.isInitialized || !CloudSync.db) return;
      const deviceId = localStorage.getItem('onecorporate_device_id') || ('dev_' + Math.random().toString(36).substring(2, 9));
      localStorage.setItem('onecorporate_device_id', deviceId);

      const meta = {
        lastSeen: new Date().toISOString(),
        role: (window.appState && window.appState.currentUserRole) || 'Unknown',
        userAgent: navigator.userAgent
      };

      CloudSync.db.collection(COLLECTION_META).doc(deviceId).set(meta, { merge: true }).catch(() => {});
    },

    // -------------------------------------------------------------
    // FULL UPLOAD / INITIAL SEED TO CLOUD (Batch Write)
    // -------------------------------------------------------------
    uploadAllCurrentData: async function() {
      if (!CloudSync.isInitialized || !CloudSync.db) {
        alert('Please connect to Firebase Cloud Firestore first.');
        return Promise.reject(new Error('Not connected'));
      }

      const state = CloudSync.getState();
      if (!state) {
        alert('No local state data available to upload.');
        return Promise.resolve();
      }

      const tasks = Array.isArray(state.tasks) ? state.tasks : [];
      const complaints = Array.isArray(state.complaints) ? state.complaints : [];
      const jobOrders = Array.isArray(state.jobOrders) ? state.jobOrders : [];
      const registry = Array.isArray(state.registry) ? state.registry : [];
      const inventory = CloudSync.getInventoryItems() || [];
      const emergency = CloudSync.getEmergencyState() || {};
      const criticalLeaks = CloudSync.getCriticalLeaks() || [];

      const pastEvals = Array.isArray(emergency.pastSafetyEvaluations) ? emergency.pastSafetyEvaluations : [];
      const totalItems = tasks.length + complaints.length + jobOrders.length + registry.length + inventory.length + criticalLeaks.length + pastEvals.length;
      if (totalItems === 0) {
        alert('No local tasks, inventory items, or emergency records found to upload. If you just opened the app, please add or refresh your data.');
        return Promise.resolve();
      }

      if (!confirm(`Upload all current local data (${totalItems} items: ${tasks.length} tasks, ${complaints.length} complaints, ${jobOrders.length} job orders, ${registry.length} equipment, ${inventory.length} inventory assets, ${criticalLeaks.length} leak tracing records, ${pastEvals.length} safety evaluations) to Cloud Firestore? Any documents previously in the cloud that you have deleted locally will also be removed.`)) {
        return Promise.resolve();
      }

      CloudSync.setStatus('connecting', 'Uploading and synchronizing with Cloud Firestore...');

      // Query existing documents from Firestore to identify and clean up orphaned / locally deleted documents
      let remoteTaskDocs = [];
      let remoteComplaintDocs = [];
      let remoteJobOrderDocs = [];
      let remoteRegistryDocs = [];
      let remoteInventoryDocs = [];
      let remoteLeakDocs = [];

      try {
        const [taskSnap, compSnap, joSnap, regSnap, invSnap, leakSnap] = await Promise.all([
          CloudSync.db.collection(COLLECTION_TASKS).get(),
          CloudSync.db.collection(COLLECTION_COMPLAINTS).get(),
          CloudSync.db.collection(COLLECTION_JOB_ORDERS).get(),
          CloudSync.db.collection(COLLECTION_REGISTRY).get(),
          CloudSync.db.collection(COLLECTION_INVENTORY).get(),
          CloudSync.db.collection(COLLECTION_CRITICAL_LEAKS).get()
        ]);
        remoteTaskDocs = taskSnap.docs || [];
        remoteComplaintDocs = compSnap.docs || [];
        remoteJobOrderDocs = joSnap.docs || [];
        remoteRegistryDocs = regSnap.docs || [];
        remoteInventoryDocs = invSnap.docs || [];
        remoteLeakDocs = leakSnap.docs || [];
      } catch (e) {
        console.warn('Could not query existing documents for orphan cleanup:', e);
      }

      const batches = [];
      let currentBatch = CloudSync.db.batch();
      let count = 0;

      function addToBatch(ref, data) {
        currentBatch.set(ref, data, { merge: true });
        count++;
        if (count >= 400) {
          batches.push(currentBatch.commit());
          currentBatch = CloudSync.db.batch();
          count = 0;
        }
      }

      function addToBatchDelete(ref) {
        currentBatch.delete(ref);
        count++;
        if (count >= 400) {
          batches.push(currentBatch.commit());
          currentBatch = CloudSync.db.batch();
          count = 0;
        }
      }

      // 1. Tasks: Clean up deleted + upload current
      const localTaskIds = new Set(tasks.map(t => String(t.id)));
      remoteTaskDocs.forEach(doc => {
        if (!localTaskIds.has(doc.id)) {
          addToBatchDelete(doc.ref);
          delete CloudSync.lastSyncedTasks[doc.id];
        }
      });
      tasks.forEach(t => {
        if (!t.id) return;
        const copy = { ...t };
        delete copy.id;
        addToBatch(CloudSync.db.collection(COLLECTION_TASKS).doc(String(t.id)), copy);
        CloudSync.lastSyncedTasks[String(t.id)] = JSON.stringify(t);
      });

      // 2. Complaints: Clean up deleted + upload current
      const localComplaintIds = new Set(complaints.map(c => String(c.id)));
      remoteComplaintDocs.forEach(doc => {
        if (!localComplaintIds.has(doc.id)) {
          addToBatchDelete(doc.ref);
          delete CloudSync.lastSyncedComplaints[doc.id];
        }
      });
      complaints.forEach(c => {
        if (!c.id) return;
        const copy = { ...c };
        delete copy.id;
        addToBatch(CloudSync.db.collection(COLLECTION_COMPLAINTS).doc(String(c.id)), copy);
        CloudSync.lastSyncedComplaints[String(c.id)] = JSON.stringify(c);
      });

      // 3. Job Orders: Clean up deleted + upload current
      const localJobOrderIds = new Set(jobOrders.map(j => String(j.id)));
      remoteJobOrderDocs.forEach(doc => {
        if (!localJobOrderIds.has(doc.id)) {
          addToBatchDelete(doc.ref);
          delete CloudSync.lastSyncedJobOrders[doc.id];
        }
      });
      jobOrders.forEach(j => {
        if (!j.id) return;
        const copy = { ...j };
        delete copy.id;
        addToBatch(CloudSync.db.collection(COLLECTION_JOB_ORDERS).doc(String(j.id)), copy);
        CloudSync.lastSyncedJobOrders[String(j.id)] = JSON.stringify(j);
      });

      // 4. Registry: Clean up deleted + upload current
      const localRegistryIds = new Set(registry.map(r => String(r.id)));
      remoteRegistryDocs.forEach(doc => {
        if (!localRegistryIds.has(doc.id)) {
          addToBatchDelete(doc.ref);
          delete CloudSync.lastSyncedRegistry[doc.id];
        }
      });
      registry.forEach(r => {
        if (!r.id) return;
        const copy = { ...r };
        delete copy.id;
        addToBatch(CloudSync.db.collection(COLLECTION_REGISTRY).doc(String(r.id)), copy);
        CloudSync.lastSyncedRegistry[String(r.id)] = JSON.stringify(r);
      });

      // 5. Inventory: Clean up deleted + upload current
      const localInvIds = new Set(inventory.map(inv => String(inv.id)));
      remoteInventoryDocs.forEach(doc => {
        if (!localInvIds.has(doc.id)) {
          addToBatchDelete(doc.ref);
          delete CloudSync.lastSyncedInventory[doc.id];
        }
      });
      inventory.forEach(inv => {
        if (!inv || !inv.id) return;
        const copy = { ...inv };
        delete copy.id;
        addToBatch(CloudSync.db.collection(COLLECTION_INVENTORY).doc(String(inv.id)), copy);
        CloudSync.lastSyncedInventory[String(inv.id)] = JSON.stringify(inv);
      });

      // 6. Operational State (Manager Oversight Schedule Checklists, Absence, Schedules)
      addToBatch(CloudSync.db.collection(COLLECTION_META).doc('operational_state'), {
        managerCheckedActivities: state.managerCheckedActivities || {},
        isManagerAbsent: state.isManagerAbsent || false,
        employeeSchedules: state.employeeSchedules || []
      });
      CloudSync.lastSyncedOperationalStr = JSON.stringify({
        managerCheckedActivities: state.managerCheckedActivities || {},
        isManagerAbsent: state.isManagerAbsent || false,
        employeeSchedules: state.employeeSchedules || []
      });

      // 7. Emergency State (Past Safety Evaluations, Current Wizard, Signatories, BERT Org Structure)
      addToBatch(CloudSync.db.collection(COLLECTION_META).doc('emergency_state'), {
        pastSafetyEvaluations: emergency.pastSafetyEvaluations || [],
        currentSafetyEvaluation: emergency.currentSafetyEvaluation || null,
        criticalSignatories: emergency.criticalSignatories || [],
        emergencyOrgStructure: emergency.emergencyOrgStructure || [],
        updatedAt: new Date().toISOString()
      });
      CloudSync.lastSyncedEmergencyStr = JSON.stringify(emergency);

      // 8. Critical Leak & Crack Tracing Logs: Clean up deleted + upload current
      const localLeakIds = new Set(criticalLeaks.map(leak => String(leak.id)));
      remoteLeakDocs.forEach(doc => {
        if (!localLeakIds.has(doc.id)) {
          addToBatchDelete(doc.ref);
          delete CloudSync.lastSyncedCriticalLeaks[doc.id];
        }
      });
      criticalLeaks.forEach(leak => {
        if (!leak || !leak.id) return;
        const copy = { ...leak };
        delete copy.id;
        addToBatch(CloudSync.db.collection(COLLECTION_CRITICAL_LEAKS).doc(String(leak.id)), copy);
        CloudSync.lastSyncedCriticalLeaks[String(leak.id)] = JSON.stringify(leak);
      });

      if (count > 0) {
        batches.push(currentBatch.commit());
      }

      try {
        await Promise.all(batches);
        CloudSync.setStatus('online', 'Connected to Cloud Firestore (Real-time sync active)');
        alert(`Successfully synchronized ${totalItems} items to Google Cloud Firestore! All connected devices will now see this updated data.`);
      } catch (err) {
        console.error('Batch upload error:', err);
        CloudSync.setStatus('error', 'Batch upload failed');
        alert('Failed to upload data to cloud: ' + (err.message || err));
      }
    },

    // -------------------------------------------------------------
    // IMAGE OPTIMIZER (Guarantees document < 1 MB limit)
    // -------------------------------------------------------------
    compressImage: function(fileOrBase64, maxWidth, maxHeight, quality) {
      maxWidth = maxWidth || 1024;
      maxHeight = maxHeight || 1024;
      quality = quality || 0.72;

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };
        img.onerror = err => reject(err);

        if (typeof fileOrBase64 === 'string') {
          img.src = fileOrBase64;
        } else if (fileOrBase64 instanceof Blob || fileOrBase64 instanceof File) {
          const reader = new FileReader();
          reader.onload = e => { img.src = e.target.result; };
          reader.onerror = err => reject(err);
          reader.readAsDataURL(fileOrBase64);
        } else {
          reject(new Error('Unsupported image format for compression'));
        }
      });
    },

    // -------------------------------------------------------------
    // UI MODAL CONTROLS
    // -------------------------------------------------------------
    openSettingsModal: function() {
      const modal = document.getElementById('modal-cloud-sync-settings');
      if (!modal) return;
      modal.style.display = 'flex';

      const config = CloudSync.getConfig() || {};
      const textarea = document.getElementById('cloud-config-json-input');
      if (textarea) {
        textarea.value = Object.keys(config).length > 0 ? JSON.stringify(config, null, 2) : '';
      }

      const activeProjectEl = document.getElementById('cloud-modal-active-project');
      if (activeProjectEl) {
        activeProjectEl.textContent = config.projectId || 'None (Not Connected)';
      }

      CloudSync.updateStatusUI();
    },

    closeSettingsModal: function() {
      const modal = document.getElementById('modal-cloud-sync-settings');
      if (modal) modal.style.display = 'none';
    },

    saveFromModal: function() {
      const textarea = document.getElementById('cloud-config-json-input');
      if (!textarea) return;

      let val = textarea.value.trim();
      if (!val) {
        alert('Please paste your Firebase configuration object.');
        return;
      }

      if (val.includes('{') && val.includes('}')) {
        const start = val.indexOf('{');
        const end = val.lastIndexOf('}');
        val = val.substring(start, end + 1);
      }

      let parsed;
      try {
        parsed = (new Function('return ' + val))();
      } catch (e) {
        try {
          parsed = JSON.parse(val);
        } catch (innerErr) {
          alert('Invalid configuration format. Please paste a valid Firebase configuration JSON or JS object.');
          return;
        }
      }

      if (!parsed.apiKey || !parsed.projectId) {
        alert("The configuration appears to be missing 'apiKey' or 'projectId'. Please check your Firebase Console settings.");
        return;
      }

      const success = CloudSync.saveConfig(parsed);
      if (success) {
        alert('Firebase configuration saved successfully! Connecting to Cloud Firestore...');
        CloudSync.closeSettingsModal();
      }
    },

    testConnection: function() {
      if (!CloudSync.isInitialized || !CloudSync.db) {
        alert('Cloud Firestore is not initialized. Please save a valid configuration first.');
        return;
      }

      const statusEl = document.getElementById('cloud-test-status');
      if (statusEl) statusEl.textContent = 'Testing connection to Cloud Firestore...';

      CloudSync.db.collection(COLLECTION_META).doc('connection_test').set({
        testedAt: new Date().toISOString(),
        testedBy: (window.appState && window.appState.currentUserRole) || 'Tester'
      })
      .then(() => {
        if (statusEl) statusEl.innerHTML = '<span style="color: #22c55e;">✓ Connection Successful! Cloud Firestore is active.</span>';
        alert('Connection test successful! Cloud Firestore is working and real-time sync is active.');
      })
      .catch(err => {
        console.error('Connection test failed:', err);
        if (statusEl) statusEl.innerHTML = `<span style="color: #ef4444;">✗ Test Failed: ${err.message}</span>`;
        alert('Connection test failed: ' + err.message + '\n\nTip: In Firebase Console -> Firestore Database -> Rules, ensure your security rules allow read and write.');
      });
    },

    clearAndReset: function() {
      if (confirm('Disconnect from Cloud Firestore and remove saved cloud configuration?')) {
        CloudSync.clearConfig();
        const textarea = document.getElementById('cloud-config-json-input');
        if (textarea) textarea.value = '';
        const activeProjectEl = document.getElementById('cloud-modal-active-project');
        if (activeProjectEl) activeProjectEl.textContent = 'None (Not Connected)';
        alert('Cloud configuration cleared.');
      }
    }
  };

  // Expose to window
  window.CloudSync = CloudSync;

  // Auto-init after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CloudSync.init());
  } else {
    CloudSync.init();
  }

})(window);
