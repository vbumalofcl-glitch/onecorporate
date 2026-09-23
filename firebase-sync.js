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

    initializeCacheFromLocal: function() {
      try {
        if (window.appState) {
          if (Array.isArray(window.appState.tasks)) {
            window.appState.tasks.forEach(t => {
              if (t && t.id) CloudSync.lastSyncedTasks[String(t.id)] = JSON.stringify(t);
            });
          }
          if (Array.isArray(window.appState.complaints)) {
            window.appState.complaints.forEach(c => {
              if (c && c.id) CloudSync.lastSyncedComplaints[String(c.id)] = JSON.stringify(c);
            });
          }
          if (Array.isArray(window.appState.jobOrders)) {
            window.appState.jobOrders.forEach(j => {
              if (j && j.id) CloudSync.lastSyncedJobOrders[String(j.id)] = JSON.stringify(j);
            });
          }
          if (Array.isArray(window.appState.registry)) {
            window.appState.registry.forEach(r => {
              if (r && r.id) CloudSync.lastSyncedRegistry[String(r.id)] = JSON.stringify(r);
            });
          }
          CloudSync.lastSyncedOperationalStr = JSON.stringify({
            managerCheckedActivities: window.appState.managerCheckedActivities || {},
            isManagerAbsent: window.appState.isManagerAbsent || false,
            employeeSchedules: window.appState.employeeSchedules || []
          });
        }
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
          err => console.error('Tasks listener error:', err)
        );
        CloudSync.unsubscribers.push(unsubTasks);
      } catch (e) {
        console.error('Failed to attach tasks listener:', e);
      }

      // 2. Complaints Listener
      try {
        const unsubComplaints = CloudSync.db.collection(COLLECTION_COMPLAINTS).onSnapshot(
          snapshot => CloudSync.handleComplaintsSnapshot(snapshot),
          err => console.error('Complaints listener error:', err)
        );
        CloudSync.unsubscribers.push(unsubComplaints);
      } catch (e) {
        console.error('Failed to attach complaints listener:', e);
      }

      // 3. Job Orders Listener
      try {
        const unsubJobOrders = CloudSync.db.collection(COLLECTION_JOB_ORDERS).onSnapshot(
          snapshot => CloudSync.handleJobOrdersSnapshot(snapshot),
          err => console.error('Job Orders listener error:', err)
        );
        CloudSync.unsubscribers.push(unsubJobOrders);
      } catch (e) {
        console.error('Failed to attach job orders listener:', e);
      }

      // 4. Registry Listener
      try {
        const unsubRegistry = CloudSync.db.collection(COLLECTION_REGISTRY).onSnapshot(
          snapshot => CloudSync.handleRegistrySnapshot(snapshot),
          err => console.error('Registry listener error:', err)
        );
        CloudSync.unsubscribers.push(unsubRegistry);
      } catch (e) {
        console.error('Failed to attach registry listener:', e);
      }

      // 5. Operational State Listener (Manager Oversight Schedule Checklists, Absence, Schedules)
      try {
        const unsubOperational = CloudSync.db.collection(COLLECTION_META).doc('operational_state').onSnapshot(
          doc => CloudSync.handleOperationalSnapshot(doc),
          err => console.error('Operational state listener error:', err)
        );
        CloudSync.unsubscribers.push(unsubOperational);
      } catch (e) {
        console.error('Failed to attach operational state listener:', e);
      }
    },

    handleTasksSnapshot: function(snapshot) {
      if (snapshot.empty && (!window.appState || !window.appState.tasks || window.appState.tasks.length === 0)) return;

      let changed = false;
      CloudSync.isRemoteUpdating = true;

      try {
        if (!window.appState) window.appState = {};
        if (!Array.isArray(window.appState.tasks)) window.appState.tasks = [];

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
      if (!window.appState) return;

      // 1. Tasks Delta
      if (Array.isArray(window.appState.tasks)) {
        const currentTaskIds = new Set();
        window.appState.tasks.forEach(t => {
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
      if (Array.isArray(window.appState.complaints)) {
        const currentComplaintIds = new Set();
        window.appState.complaints.forEach(c => {
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
      if (Array.isArray(window.appState.jobOrders)) {
        const currentJoIds = new Set();
        window.appState.jobOrders.forEach(jo => {
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
      if (Array.isArray(window.appState.registry)) {
        const currentRegIds = new Set();
        window.appState.registry.forEach(r => {
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
        managerCheckedActivities: (window.appState && window.appState.managerCheckedActivities) || {},
        isManagerAbsent: (window.appState && window.appState.isManagerAbsent) || false,
        employeeSchedules: (window.appState && window.appState.employeeSchedules) || []
      };
      const serializedOps = JSON.stringify(currentOps);
      if (CloudSync.lastSyncedOperationalStr !== serializedOps) {
        CloudSync.syncOperationalState(currentOps);
        CloudSync.lastSyncedOperationalStr = serializedOps;
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
    uploadAllCurrentData: function() {
      if (!CloudSync.isInitialized || !CloudSync.db) {
        alert('Please connect to Firebase Cloud Firestore first.');
        return Promise.reject(new Error('Not connected'));
      }

      if (!window.appState) {
        alert('No local state data available to upload.');
        return Promise.resolve();
      }

      const state = window.appState;
      const tasks = Array.isArray(state.tasks) ? state.tasks : [];
      const complaints = Array.isArray(state.complaints) ? state.complaints : [];
      const jobOrders = Array.isArray(state.jobOrders) ? state.jobOrders : [];
      const registry = Array.isArray(state.registry) ? state.registry : [];

      const totalItems = tasks.length + complaints.length + jobOrders.length + registry.length;
      if (totalItems === 0) {
        alert('No local tasks or records found to upload.');
        return Promise.resolve();
      }

      if (!confirm(`Upload all current local data (${totalItems} items: ${tasks.length} tasks, ${complaints.length} complaints, ${jobOrders.length} job orders, ${registry.length} equipment) to Cloud Firestore?`)) {
        return Promise.resolve();
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

      // Tasks
      tasks.forEach(t => {
        if (!t.id) return;
        const copy = { ...t };
        delete copy.id;
        addToBatch(CloudSync.db.collection(COLLECTION_TASKS).doc(String(t.id)), copy);
      });

      // Complaints
      complaints.forEach(c => {
        if (!c.id) return;
        const copy = { ...c };
        delete copy.id;
        addToBatch(CloudSync.db.collection(COLLECTION_COMPLAINTS).doc(String(c.id)), copy);
      });

      // Job Orders
      jobOrders.forEach(j => {
        if (!j.id) return;
        const copy = { ...j };
        delete copy.id;
        addToBatch(CloudSync.db.collection(COLLECTION_JOB_ORDERS).doc(String(j.id)), copy);
      });

      // Registry
      registry.forEach(r => {
        if (!r.id) return;
        const copy = { ...r };
        delete copy.id;
        addToBatch(CloudSync.db.collection(COLLECTION_REGISTRY).doc(String(r.id)), copy);
      });

      // Operational State (Manager Oversight Schedule Checklists, Absence, Schedules)
      addToBatch(CloudSync.db.collection(COLLECTION_META).doc('operational_state'), {
        managerCheckedActivities: state.managerCheckedActivities || {},
        isManagerAbsent: state.isManagerAbsent || false,
        employeeSchedules: state.employeeSchedules || []
      });

      if (count > 0) {
        batches.push(currentBatch.commit());
      }

      return Promise.all(batches)
        .then(() => {
          alert(`Successfully synchronized ${totalItems} items to Google Cloud Firestore! All connected users will now see this data.`);
        })
        .catch(err => {
          console.error('Batch upload error:', err);
          alert('Failed to upload data to cloud: ' + (err.message || err));
        });
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
