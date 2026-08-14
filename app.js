/**
 * Solo Leveling Gamified College Student RPG & Habit System
 * Baked Firebase Public Config, Firestore Live Persistence, & Server-Side Admin Role Verification
 */

// Web Audio API Synthesizer for RPG Sound Effects
class RPGSoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playClick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playQuestComplete() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.1);
    osc.frequency.setValueAtTime(783.99, now + 0.2);
    osc.frequency.setValueAtTime(1046.50, now + 0.3);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  playLevelUp() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.25, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.25);
    });

    // Sub-bass layer under the arpeggio for extra weight
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(110, now);
    subGain.gain.setValueAtTime(0.2, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(now);
    sub.stop(now + 0.55);
  }

  // Short descending buzz for invalid input / failed actions
  playError() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [220, 174.61].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.12, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.15);
    });
  }

  // A small sparkling arpeggio for allocating a stat point
  playStatUp() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [659.25, 830.61, 987.77];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.18, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.18);
    });
  }

  // Firm "stamp of approval" double-note for admin actions (award XP/points, save edits)
  playAdminAction() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [392, 587.33].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.2, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.09 + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.22);
    });
  }

  // Gentle two-tone bell chime, used for in-app reminder/notification pings
  playNotification() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [987.77, 1318.51].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);
      gain.gain.setValueAtTime(0.18, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.4);
    });
  }
}

const sounds = new RPGSoundEngine();

// Baked Public-Safe Firebase Credentials
const BAKED_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAV0uk55OIJdlz3mEBweAvbYGlCrqgMycA",
  authDomain: "the-system-516fc.firebaseapp.com",
  projectId: "the-system-516fc",
  storageBucket: "the-system-516fc.firebasestorage.app",
  messagingSenderId: "467421624543",
  appId: "1:467421624543:web:6f0be93483968a1ba0116a",
  measurementId: "G-WD7R8Q48ZV"
};

// Blank template used for a brand-new Google-authenticated user before they
// complete onboarding. No fake demo data — everything starts empty/neutral
// and the player fills it in via the onboarding form.
function buildNewPlayerTemplate(user) {
  return {
    id: user.uid,
    name: user.displayName || 'New Player',
    email: user.email || '',
    role: 'player',
    isAdmin: false,
    onboarded: false,
    major: '',
    year: '',
    targetGpa: '',
    focusAreas: [],
    dailyFreeHours: '2h',
    bio: '',
    level: 1,
    xp: 0,
    xpToNextLevel: 300,
    unassignedPoints: 5,
    avatar: user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(user.uid || Date.now()),
    stats: { int: 10, agi: 10, str: 10, vita: 10, per: 10 },
    deadlines: [],
    timetable: {},
    quests: []
  };
}

class SoloLevelingApp {
  constructor() {
    this.currentPlayer = JSON.parse(localStorage.getItem('sl_current_player')) || null;
    this.allPlayers = JSON.parse(localStorage.getItem('sl_all_players')) || [];
    
    this.firebaseApp = null;
    this.firebaseAuth = null;
    this.db = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.initFirebase();

    if (this.currentPlayer) {
      this.updateUI();
      this.switchView('status-view');
    } else {
      this.switchView('auth-view');
    }
  }

  initFirebase() {
    if (window.FirebaseModules) {
      try {
        const { initializeApp, getAuth, getFirestore, GoogleAuthProvider, onAuthStateChanged } = window.FirebaseModules;
        this.firebaseApp = initializeApp(BAKED_FIREBASE_CONFIG);
        this.firebaseAuth = getAuth(this.firebaseApp);
        this.db = getFirestore(this.firebaseApp);
        this.googleProvider = new GoogleAuthProvider();

        onAuthStateChanged(this.firebaseAuth, (user) => {
          if (user) {
            this.handleFirebaseUserLogin(user);
          }
        });
      } catch (err) {
        console.warn('Firebase Live Init Warning:', err);
      }
    }
  }

  bindEvents() {
    // Navigation Tabs & Mobile Nav
    document.querySelectorAll('.tab-btn, .mobile-nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.playClick();
        const viewId = e.currentTarget.getAttribute('data-view');
        if (viewId) this.switchView(viewId);
      });
    });

    // Real Google OAuth Login Button
    document.getElementById('google-login-btn')?.addEventListener('click', () => {
      sounds.playClick();
      this.loginWithGoogleOAuth();
    });

    // Logout Button
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      sounds.playClick();
      this.logout();
    });

    // Stat Point Allocation
    document.querySelectorAll('.btn-add-stat').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const statKey = e.currentTarget.getAttribute('data-stat');
        this.addStatPoint(statKey);
      });
    });

    // AI Form Submission
    document.getElementById('ai-task-form')?.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' && e.target.type === 'submit') {
        e.preventDefault();
        sounds.playClick();
        this.generateAIQuests();
      }
    });

    // Trigger AI Modal shortcut
    document.getElementById('trigger-ai-modal-btn')?.addEventListener('click', () => {
      sounds.playClick();
      this.switchView('ai-generator-view');
    });

    // Admin Refresh
    document.getElementById('admin-refresh-btn')?.addEventListener('click', () => {
      sounds.playClick();
      this.renderAdminDashboard();
    });

    // Onboarding Form Submission (new players only)
    document.getElementById('onboarding-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitOnboarding();
    });

    // Admin: Save shared Gemini API key
    document.getElementById('admin-save-gemini-key-btn')?.addEventListener('click', () => {
      sounds.playClick();
      this.saveGeminiKey();
    });

    // Enable/refresh native reminder notifications
    document.getElementById('notif-toggle-btn')?.addEventListener('click', () => {
      sounds.playClick();
      this.initNotifications(true);
    });
  }

  async loginWithGoogleOAuth() {
    if (this.firebaseAuth && this.googleProvider && window.FirebaseModules) {
      try {
        const { signInWithPopup } = window.FirebaseModules;
        const result = await signInWithPopup(this.firebaseAuth, this.googleProvider);
        await this.handleFirebaseUserLogin(result.user);
      } catch (error) {
        console.error('Google OAuth Error:', error);
        sounds.playError();
        alert(`Google Sign-In failed: ${error.message}`);
      }
    } else {
      sounds.playError();
      alert('Cannot connect to Google Sign-In right now — check your internet connection and try again.');
    }
  }

  async handleFirebaseUserLogin(user) {
    let playerRole = 'player';
    let isAdmin = false;
    let isNewPlayer = false;

    // Server-Side Firestore Role Check (doc(db, "users", user.uid))
    if (this.db && window.FirebaseModules) {
      try {
        const { doc, getDoc, setDoc } = window.FirebaseModules;
        const userDocRef = doc(this.db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          // Existing player: load their REAL saved profile/progress, never
          // overwrite it with template data.
          const data = userSnap.data();
          isAdmin = data.isAdmin === true;
          playerRole = isAdmin ? 'admin' : 'player';
          this.currentPlayer = { ...data, role: playerRole, isAdmin };
        } else {
          // Brand new player: create a blank profile and route them through
          // onboarding to capture their full info before they can play.
          isNewPlayer = true;
          const newUserData = buildNewPlayerTemplate(user);
          await setDoc(userDocRef, newUserData, { merge: true });
          this.currentPlayer = newUserData;
        }
      } catch (e) {
        console.warn('Firestore User Fetch Error:', e);
        this.currentPlayer = buildNewPlayerTemplate(user);
        isNewPlayer = true;
      }
    } else {
      // No Firestore connection available — fall back to a local blank profile.
      this.currentPlayer = buildNewPlayerTemplate(user);
      isNewPlayer = !JSON.parse(localStorage.getItem('sl_current_player') || 'null');
    }

    if (isAdmin) {
      sounds.playLevelUp();
      alert(`👑 Server Verified: Account (${user.email}) has Firestore isAdmin == true permissions!`);
    }

    this.saveState();
    this.updateUI();

    if (!isAdmin && (isNewPlayer || this.currentPlayer.onboarded !== true)) {
      this.switchView('onboarding-view');
    } else {
      this.switchView(isAdmin ? 'admin-view' : 'status-view');
      if (!isAdmin) this.initNotifications();
    }
  }

  submitOnboarding() {
    const name = document.getElementById('onboard-name')?.value.trim();
    const major = document.getElementById('onboard-major')?.value.trim();
    const year = document.getElementById('onboard-year')?.value.trim();
    const targetGpa = document.getElementById('onboard-gpa')?.value.trim();
    const dailyFreeHours = document.getElementById('onboard-hours')?.value;
    const bio = document.getElementById('onboard-bio')?.value.trim();
    const focusAreas = Array.from(document.querySelectorAll('.onboard-focus-check:checked')).map(el => el.value);

    if (!major || !year) {
      sounds.playError();
      alert('Please fill in at least your Major and Year — the AI Analyst uses these to tailor your quests.');
      return;
    }

    this.currentPlayer = {
      ...this.currentPlayer,
      name: name || this.currentPlayer.name,
      major,
      year,
      targetGpa: targetGpa || 'Not set',
      dailyFreeHours,
      bio,
      focusAreas,
      onboarded: true
    };

    sounds.playLevelUp();
    this.saveState();
    this.updateUI();
    this.switchView('status-view');
    this.initNotifications();
  }

  // --- Native Android Reminders (Capacitor Local Notifications) ---
  // Only does anything inside the Capacitor-wrapped Android app; harmless
  // no-op when this page is opened in a plain browser tab.
  isNativeApp() {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  }

  getLocalNotifications() {
    return window.Capacitor?.Plugins?.LocalNotifications || null;
  }

  async initNotifications(explicitRequest = false) {
    if (!this.isNativeApp()) {
      if (explicitRequest) alert('Native reminder notifications only work inside the installed Android app, not in a browser tab.');
      return;
    }
    const LocalNotifications = this.getLocalNotifications();
    if (!LocalNotifications) return;

    try {
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display !== 'granted') {
        if (explicitRequest) alert('Notification permission was denied — enable it in Android Settings to get task reminders.');
        return;
      }
      if (explicitRequest) {
        sounds.playNotification();
        alert('🔔 Reminders enabled! You\'ll get a daily nudge plus alerts before deadlines.');
      }
      await this.scheduleTaskReminders();
    } catch (e) {
      console.warn('Notification Init Error:', e);
    }
  }

  // (Re)schedules: a recurring daily check-in, plus one reminder per
  // upcoming deadline (fired ~2 hours before it's due). Re-scheduling
  // reuses fixed IDs so old reminders are simply overwritten, not duplicated.
  async scheduleTaskReminders() {
    if (!this.isNativeApp()) return;
    const LocalNotifications = this.getLocalNotifications();
    if (!LocalNotifications || !this.currentPlayer) return;

    try {
      const notifications = [];

      // Recurring daily reminder to check pending quests
      notifications.push({
        id: 1,
        title: '⚔️ Daily Quests Await',
        body: 'Check the System — you have quests to complete today.',
        schedule: { on: { hour: 19, minute: 0 }, allowWhileIdle: true },
        smallIcon: 'ic_stat_icon_config_sample'
      });

      // Per-deadline reminders (fires ~2 hours before due, only for
      // deadlines that are more than 2 hours away)
      (this.currentPlayer.deadlines || []).forEach((d, idx) => {
        const hoursLeft = Number(d.hoursLeft);
        if (!hoursLeft || hoursLeft <= 2) return;
        notifications.push({
          id: 1000 + idx,
          title: '⏳ Deadline Approaching',
          body: `${d.title} is due in about 2 hours.`,
          schedule: { at: new Date(Date.now() + (hoursLeft - 2) * 3600 * 1000) },
          smallIcon: 'ic_stat_icon_config_sample'
        });
      });

      await LocalNotifications.cancel({ notifications: notifications.map(n => ({ id: n.id })) }).catch(() => {});
      await LocalNotifications.schedule({ notifications });
    } catch (e) {
      console.warn('Notification Scheduling Error:', e);
    }
  }

  switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.tab-btn, .mobile-nav-item').forEach(btn => btn.classList.remove('active'));

    const targetSection = document.getElementById(viewId);
    if (targetSection) targetSection.classList.add('active');

    document.querySelectorAll(`[data-view="${viewId}"]`).forEach(btn => btn.classList.add('active'));

    if (viewId === 'admin-view') {
      this.renderAdminDashboard();
    } else if (viewId === 'timetable-view') {
      this.renderTimetable();
    } else if (viewId === 'deadlines-view') {
      this.renderDeadlines();
    }
  }

  logout() {
    if (this.firebaseAuth && window.FirebaseModules) {
      const { signOut } = window.FirebaseModules;
      signOut(this.firebaseAuth).catch(err => console.log('Signout Error:', err));
    }
    
    this.currentPlayer = null;
    localStorage.removeItem('sl_current_player');
    
    document.getElementById('user-hud-profile').style.display = 'none';
    document.getElementById('desktop-nav').style.display = 'none';
    document.getElementById('streak-shield-banner').style.display = 'none';
    
    this.switchView('auth-view');
  }

  calculateRank(level) {
    if (level >= 30) return { letter: 'S', label: 'SHADOW MONARCH' };
    if (level >= 25) return { letter: 'S', label: 'RANK S' };
    if (level >= 20) return { letter: 'A', label: 'RANK A' };
    if (level >= 15) return { letter: 'B', label: 'RANK B' };
    if (level >= 10) return { letter: 'C', label: 'RANK C' };
    if (level >= 5) return { letter: 'D', label: 'RANK D' };
    return { letter: 'E', label: 'RANK E' };
  }

  updateUI() {
    if (!this.currentPlayer) return;
    const player = this.currentPlayer;
    
    // Header HUD
    const hudProfile = document.getElementById('user-hud-profile');
    if (hudProfile) {
      hudProfile.style.display = 'flex';
      document.getElementById('hud-user-avatar').src = player.avatar;
      document.getElementById('hud-user-name').innerText = player.name;
      document.getElementById('hud-user-role').innerText = `[${player.role.toUpperCase()}]`;
    }

    // Top & Mobile Admin Tabs ONLY visible if role === 'admin'
    const adminTabBtn = document.getElementById('admin-tab-btn');
    const mobileAdminItem = document.getElementById('mobile-admin-item');
    if (player.role === 'admin') {
      if (adminTabBtn) adminTabBtn.style.display = 'flex';
      if (mobileAdminItem) mobileAdminItem.style.display = 'flex';
    } else {
      if (adminTabBtn) adminTabBtn.style.display = 'none';
      if (mobileAdminItem) mobileAdminItem.style.display = 'none';
    }

    // Desktop Nav
    const desktopNav = document.getElementById('desktop-nav');
    if (desktopNav) desktopNav.style.display = 'flex';

    // Banner
    const banner = document.getElementById('streak-shield-banner');
    if (banner) banner.style.display = 'flex';

    // Status View Updates
    const rankInfo = this.calculateRank(player.level);
    document.getElementById('player-rank-letter').innerText = rankInfo.letter;
    document.getElementById('player-rank-label').innerText = rankInfo.label;
    document.getElementById('player-display-name').innerText = player.name;
    document.getElementById('player-display-title').innerText = `✨ ${this.getIdentityTitle(player.stats)}`;
    document.getElementById('player-major').innerText = player.major;
    document.getElementById('player-year').innerText = player.year;
    document.getElementById('player-gpa').innerText = player.targetGpa;
    
    const completedCount = player.quests.filter(q => q.completed).length;
    document.getElementById('player-quests-count').innerText = `${completedCount} / ${player.quests.length} Done`;

    // Level & XP
    document.getElementById('player-level').innerText = `LVL ${player.level}`;
    const xpPercent = Math.min(100, Math.round((player.xp / player.xpToNextLevel) * 100));
    document.getElementById('player-xp-fill').style.width = `${xpPercent}%`;
    document.getElementById('player-xp-text').innerText = `${player.xp} / ${player.xpToNextLevel} XP`;

    // Unassigned Points
    document.getElementById('stat-points-available').innerText = `${player.unassignedPoints} Points Available`;

    // Stat Bars & Values
    const stats = player.stats;
    ['int', 'agi', 'str', 'vita', 'per'].forEach(key => {
      const valEl = document.getElementById(`stat-${key}-val`);
      const barEl = document.getElementById(`stat-${key}-bar`);
      if (valEl) valEl.innerText = stats[key];
      if (barEl) barEl.style.width = `${Math.min(100, stats[key] * 1.5)}%`;
    });

    // Render Components
    this.renderQuests();
    this.renderDeadlines();
    this.renderTimetable();
  }

  getIdentityTitle(stats) {
    const highestStat = Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b);
    switch (highestStat) {
      case 'int': return 'The Apex Scholar';
      case 'per': return 'The Code Monarch';
      case 'str': return 'The Iron Athlete';
      case 'vita': return 'The Undying Sentinel';
      case 'agi': return 'The Lightning Strategist';
      default: return 'The Disciplined Student';
    }
  }

  renderQuests() {
    const container = document.getElementById('quests-list-container');
    if (!container) return;

    container.innerHTML = '';

    this.currentPlayer.quests.forEach(quest => {
      const card = document.createElement('div');
      card.className = `glass-panel quest-card ${quest.completed ? 'completed' : ''}`;
      
      card.innerHTML = `
        <div class="quest-left">
          <div class="quest-checkbox ${quest.completed ? 'checked' : ''}" data-id="${quest.id}"></div>
          <div class="quest-details">
            <span class="quest-category-tag cat-${quest.category}">${quest.category}</span>
            <div class="quest-title">${quest.title}</div>
            <div class="quest-stack-trigger">${quest.stackTrigger}</div>
          </div>
        </div>
        <div class="quest-rewards">
          <div class="reward-xp">+${quest.xpReward} XP</div>
          <div class="reward-stat">${quest.statReward}</div>
        </div>
      `;

      card.querySelector('.quest-checkbox').addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.toggleQuestCompletion(id);
      });

      container.appendChild(card);
    });
  }

  renderDeadlines() {
    const container = document.getElementById('deadlines-list-container');
    if (!container) return;

    container.innerHTML = '';

    (this.currentPlayer.deadlines || []).forEach(d => {
      const card = document.createElement('div');
      card.className = 'glass-panel deadline-card';
      
      card.innerHTML = `
        <div>
          <span class="urgency-badge urgency-${d.urgency}">${d.hoursLeft} Hours Remaining</span>
          <div style="font-weight: 700; font-size: 1.05rem; margin: 0.35rem 0;">${d.title}</div>
          <div style="font-size: 0.8rem; color: var(--color-cyan);">${d.subject}</div>
        </div>
        <div style="text-align: right;">
          <div class="reward-xp">+${d.xpReward} XP</div>
          <div class="reward-stat">${d.statReward}</div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  renderTimetable() {
    const container = document.getElementById('timetable-grid-container');
    if (!container) return;

    container.innerHTML = '';

    const timetable = this.currentPlayer.timetable || {};
    Object.keys(timetable).forEach(day => {
      const col = document.createElement('div');
      col.className = 'day-column';

      let slotsHTML = timetable[day].map(s => `
        <div class="slot-card">
          <div class="slot-time">${s.time}</div>
          <div class="slot-title">${s.title}</div>
          <div style="font-size: 0.7rem; color: var(--text-dim);">${s.room}</div>
        </div>
      `).join('');

      col.innerHTML = `
        <div class="day-header">${day.toUpperCase()}</div>
        <div>${slotsHTML}</div>
      `;

      container.appendChild(col);
    });
  }

  toggleQuestCompletion(questId) {
    const quest = this.currentPlayer.quests.find(q => q.id === questId);
    if (!quest) return;

    quest.completed = !quest.completed;

    if (quest.completed) {
      sounds.playQuestComplete();
      this.currentPlayer.xp += quest.xpReward;
      if (quest.statKey && this.currentPlayer.stats[quest.statKey] !== undefined) {
        this.currentPlayer.stats[quest.statKey] += 2;
      }
      this.checkLevelUp();
    } else {
      sounds.playClick();
      this.currentPlayer.xp = Math.max(0, this.currentPlayer.xp - quest.xpReward);
    }

    this.saveState();
    this.updateUI();
  }

  addStatPoint(statKey) {
    if (this.currentPlayer.unassignedPoints > 0 && this.currentPlayer.stats[statKey] !== undefined) {
      this.currentPlayer.stats[statKey] += 1;
      this.currentPlayer.unassignedPoints -= 1;
      sounds.playStatUp();
      this.saveState();
      this.updateUI();
    } else {
      sounds.playError();
    }
  }

  checkLevelUp() {
    if (this.currentPlayer.xp >= this.currentPlayer.xpToNextLevel) {
      sounds.playLevelUp();
      this.currentPlayer.level += 1;
      this.currentPlayer.xp -= this.currentPlayer.xpToNextLevel;
      this.currentPlayer.xpToNextLevel = Math.round(this.currentPlayer.xpToNextLevel * 1.25);
      this.currentPlayer.unassignedPoints += 5;
      
      alert(`🎉 LEVEL UP! You reached LEVEL ${this.currentPlayer.level}!\n+5 Stat Points Granted.`);
    }
  }

  // Fetches the shared Gemini API key that the admin configured, from
  // Firestore config/app. Cached after first successful read.
  async getGeminiApiKey() {
    if (this._geminiKeyCache) return this._geminiKeyCache;
    if (!this.db || !window.FirebaseModules) return null;
    try {
      const { doc, getDoc } = window.FirebaseModules;
      const snap = await getDoc(doc(this.db, 'config', 'app'));
      const key = snap.exists() ? snap.data().geminiApiKey : null;
      if (key) this._geminiKeyCache = key;
      return key || null;
    } catch (e) {
      console.warn('Gemini Key Fetch Error:', e);
      return null;
    }
  }

  async saveGeminiKey() {
    const input = document.getElementById('admin-gemini-key-input');
    const key = input?.value.trim();
    if (!key) { alert('Enter a Gemini API key first.'); return; }
    if (!this.db || !window.FirebaseModules) {
      alert('Not connected to Firestore — cannot save the key.');
      return;
    }
    try {
      const { doc, setDoc } = window.FirebaseModules;
      await setDoc(doc(this.db, 'config', 'app'), { geminiApiKey: key }, { merge: true });
      this._geminiKeyCache = key;
      alert('✅ Gemini API key saved. Every player can now use the AI Analyst.');
    } catch (e) {
      console.error('Gemini Key Save Error:', e);
      alert(`Could not save the key: ${e.message}`);
    }
  }

  // Calls Gemini to analyze this player's real profile (major, year, GPA
  // goal, focus areas, upcoming deadlines) plus what they set in the AI
  // Analyst form, and returns an array of tailored quest objects.
  async callGeminiForQuests({ branch, focus, time }) {
    const apiKey = await this.getGeminiApiKey();
    if (!apiKey) return null;

    const player = this.currentPlayer;
    const deadlineSummary = (player.deadlines || [])
      .map(d => `- ${d.title} (${d.subject || ''}), due in ${d.hoursLeft}h`)
      .join('\n') || 'None on file.';

    const prompt = `You are an AI task analyst for a gamified college-student habit app (Solo Leveling themed).
Player profile:
- Major/Branch: ${branch}
- Year: ${player.year || 'unspecified'}
- Target GPA: ${player.targetGpa || 'unspecified'}
- Stated focus areas: ${(player.focusAreas || []).join(', ') || focus}
- Daily free time available: ${time}
- Upcoming deadlines:
${deadlineSummary}

Generate 4 to 6 concrete, achievable DAILY quests for this student for TODAY that cover a healthy mix of
academics, coding/deep-work, physical fitness, and lifestyle/wellbeing (sleep, hydration, breaks) — NOT
fitness-only. Use habit-stacking phrasing ("After [existing habit], do [new habit]").

Respond with ONLY a JSON array (no markdown, no commentary), where each item has exactly these fields:
- "title": string
- "category": one of "academics", "coding", "fitness", "lifestyle"
- "statKey": one of "int", "agi", "str", "vita", "per"
- "xpReward": integer between 80 and 300
- "stackTrigger": string, habit-stacking phrasing`;

    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        }
      );
      if (!resp.ok) throw new Error(`Gemini API returned ${resp.status}`);
      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty AI response');
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error('AI response was not a JSON array');

      return parsed.map((q, idx) => ({
        id: `ai_${Date.now()}_${idx}`,
        title: q.title,
        category: q.category,
        statKey: q.statKey,
        statReward: `${(q.statKey || '').toUpperCase()} +${Math.max(1, Math.round((q.xpReward || 150) / 70))}`,
        xpReward: q.xpReward || 150,
        stackTrigger: q.stackTrigger || '',
        completed: false
      }));
    } catch (e) {
      console.error('Gemini Quest Generation Error:', e);
      return null;
    }
  }

  // Local fallback used only when no Gemini key is configured yet, or the
  // AI call fails, so the AI Analyst button never dead-ends the player.
  fallbackQuests(branch) {
    return [
      {
        id: `ai_${Date.now()}_1`,
        title: `Study 2 Hours for ${branch} Coursework`,
        category: 'academics', statKey: 'int', statReward: 'INT +3', xpReward: 250,
        stackTrigger: 'After [Breakfast], set [Timer for 120m Deep Focus]', completed: false
      },
      {
        id: `ai_${Date.now()}_2`,
        title: 'Deep Work / Project Sprint',
        category: 'coding', statKey: 'per', statReward: 'PER +3', xpReward: 220,
        stackTrigger: 'After [Closing Last Class], open [Project & Focus]', completed: false
      },
      {
        id: `ai_${Date.now()}_3`,
        title: '30–45 Min Movement Break (Workout, Walk, or Sport)',
        category: 'fitness', statKey: 'str', statReward: 'STR +3', xpReward: 200,
        stackTrigger: 'After [5 PM Classes], change into [Workout Clothes]', completed: false
      },
      {
        id: `ai_${Date.now()}_4`,
        title: 'Sleep Optimization (Screens Off by 11 PM)',
        category: 'lifestyle', statKey: 'vita', statReward: 'VITA +2', xpReward: 150,
        stackTrigger: 'After [Dinner], set [Phone to Do Not Disturb]', completed: false
      }
    ];
  }

  async generateAIQuests() {
    const branch = document.getElementById('ai-branch').value || this.currentPlayer.major || 'Computer Science';
    const focus = document.getElementById('ai-focus')?.value || 'balanced';
    const time = document.getElementById('ai-time')?.value || '4h';

    const submitBtn = document.querySelector('#ai-task-form button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = '🤖 Analyzing your workload...'; }

    let generatedQuests = await this.callGeminiForQuests({ branch, focus, time });
    let usedFallback = false;

    if (!generatedQuests || generatedQuests.length === 0) {
      generatedQuests = this.fallbackQuests(branch);
      usedFallback = true;
    }

    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = '⚡ Run AI Analysis & Generate Quests'; }

    this.currentPlayer.quests = [...generatedQuests, ...this.currentPlayer.quests];
    this.saveState();
    this.updateUI();
    this.switchView('quests-view');
    this.scheduleTaskReminders();

    if (usedFallback) {
      alert('⚠️ No Gemini API key is configured yet (ask your admin to set one in the Admin panel), so a starter quest set was used instead of a live AI analysis.');
    }
  }

  async renderAdminDashboard() {
    const container = document.getElementById('admin-players-container');
    if (!container) return;

    container.innerHTML = '<div style="color: var(--color-cyan);">Connecting to Live Firestore Database...</div>';

    // Live Real-Time Firestore Subscription
    if (this.db && window.FirebaseModules) {
      try {
        const { collection, onSnapshot } = window.FirebaseModules;
        onSnapshot(collection(this.db, 'users'), (snapshot) => {
          const players = [];
          snapshot.forEach(doc => players.push(doc.data()));
          if (players.length > 0) {
            this.allPlayers = players;
          }
          this.displayAdminPlayerGrid();
        });
        return;
      } catch (e) {
        console.warn('Firestore Snapshot Error:', e);
      }
    }

    this.displayAdminPlayerGrid();
  }

  displayAdminPlayerGrid() {
    const container = document.getElementById('admin-players-container');
    if (!container) return;

    container.innerHTML = '';

    if (!this.allPlayers || this.allPlayers.length === 0) {
      container.innerHTML = '<div style="color: var(--text-muted); padding: 1rem 0;">No players have signed up yet. Once someone signs in with Google and completes registration, they\'ll show up here.</div>';
      return;
    }

    this.allPlayers.forEach(player => {
      const box = document.createElement('div');
      box.className = 'player-admin-box';

      const completed = (player.quests || []).filter(q => q.completed).length;
      const total = (player.quests || []).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      const pendingCount = total - completed;

      let tasksHTML = (player.quests || []).map(q => `
        <div class="admin-task-item">
          <span>${q.title}</span>
          <strong style="color: ${q.completed ? 'var(--color-emerald)' : 'var(--color-pink)'}">
            ${q.completed ? '✓ DONE' : '⏳ PENDING'}
          </strong>
        </div>
      `).join('') || '<div class="admin-task-item" style="color: var(--text-dim);">No quests yet</div>';

      box.innerHTML = `
        <div class="player-admin-top">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <img src="${player.avatar}" style="width: 32px; height: 32px; border-radius: 50%;">
            <div>
              <strong>${player.name}</strong>
              <div style="font-size: 0.75rem; color: var(--color-cyan);">${player.major || 'No major set'} (LVL ${player.level})</div>
              <div style="font-size: 0.7rem; color: var(--text-dim);">${player.email || ''} • ${pendingCount} pending task${pendingCount === 1 ? '' : 's'}</div>
            </div>
          </div>
          <button class="btn-primary btn-edit-player" style="font-size: 0.7rem; padding: 0.3rem 0.6rem; background: rgba(255,255,255,0.08);">✏️ Edit</button>
        </div>

        <div class="admin-actions-row" style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.6rem 0;">
          <input type="number" class="form-input admin-xp-input" value="100" style="width: 70px; padding: 0.35rem 0.5rem;">
          <button class="btn-primary btn-award-xp" style="font-size: 0.7rem; padding: 0.35rem 0.6rem; background: var(--color-violet);">+ Award XP</button>
          <input type="number" class="form-input admin-points-input" value="1" style="width: 55px; padding: 0.35rem 0.5rem;">
          <button class="btn-primary btn-award-points" style="font-size: 0.7rem; padding: 0.35rem 0.6rem; background: var(--color-emerald);">+ Stat Points</button>
        </div>

        <div class="admin-edit-form" style="display: none; flex-direction: column; gap: 0.4rem; margin-bottom: 0.6rem; padding: 0.6rem; background: rgba(0,0,0,0.2); border-radius: var(--radius-sm);">
          <input class="form-input admin-edit-name" placeholder="Name" value="${player.name || ''}">
          <input class="form-input admin-edit-major" placeholder="Major" value="${player.major || ''}">
          <input class="form-input admin-edit-year" placeholder="Year" value="${player.year || ''}">
          <input class="form-input admin-edit-gpa" placeholder="Target GPA" value="${player.targetGpa || ''}">
          <button class="btn-primary btn-save-edit" style="font-size: 0.75rem; padding: 0.4rem;">💾 Save Details</button>
        </div>

        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
          Daily Quests Progress: <strong>${completed} / ${total} (${percent}%)</strong>
        </div>
        <div>${tasksHTML}</div>
      `;

      box.querySelector('.btn-award-xp').addEventListener('click', () => {
        const amount = parseInt(box.querySelector('.admin-xp-input').value, 10) || 0;
        if (amount <= 0) { sounds.playError(); return; }
        sounds.playAdminAction();
        this.awardBonusXPToPlayer(player.id, amount);
      });

      box.querySelector('.btn-award-points').addEventListener('click', () => {
        const amount = parseInt(box.querySelector('.admin-points-input').value, 10) || 0;
        if (amount <= 0) { sounds.playError(); return; }
        sounds.playAdminAction();
        this.awardStatPointsToPlayer(player.id, amount);
      });

      box.querySelector('.btn-edit-player').addEventListener('click', () => {
        sounds.playClick();
        const form = box.querySelector('.admin-edit-form');
        form.style.display = form.style.display === 'none' ? 'flex' : 'none';
      });

      box.querySelector('.btn-save-edit').addEventListener('click', () => {
        sounds.playAdminAction();
        this.savePlayerDetails(player.id, {
          name: box.querySelector('.admin-edit-name').value.trim(),
          major: box.querySelector('.admin-edit-major').value.trim(),
          year: box.querySelector('.admin-edit-year').value.trim(),
          targetGpa: box.querySelector('.admin-edit-gpa').value.trim()
        });
      });

      container.appendChild(box);
    });
  }

  async awardBonusXPToPlayer(playerId, xpAmount) {
    if (!this.db || !window.FirebaseModules) {
      alert('Not connected to Firestore — cannot award XP.');
      return;
    }
    try {
      const { doc, setDoc } = window.FirebaseModules;
      const target = this.allPlayers.find(p => p.id === playerId);
      if (!target) return;
      target.xp = (target.xp || 0) + xpAmount;
      await setDoc(doc(this.db, 'users', playerId), { xp: target.xp }, { merge: true });
      alert(`👑 Awarded +${xpAmount} Bonus XP to ${target.name}!`);
    } catch (e) {
      console.warn('Award XP Error:', e);
      alert(`Could not award XP: ${e.message}`);
    }
  }

  async awardStatPointsToPlayer(playerId, pointAmount) {
    if (!this.db || !window.FirebaseModules) {
      alert('Not connected to Firestore — cannot award stat points.');
      return;
    }
    try {
      const { doc, setDoc } = window.FirebaseModules;
      const target = this.allPlayers.find(p => p.id === playerId);
      if (!target) return;
      target.unassignedPoints = (target.unassignedPoints || 0) + pointAmount;
      await setDoc(doc(this.db, 'users', playerId), { unassignedPoints: target.unassignedPoints }, { merge: true });
      alert(`👑 Awarded +${pointAmount} Stat Point(s) to ${target.name}!`);
    } catch (e) {
      console.warn('Award Stat Points Error:', e);
      alert(`Could not award stat points: ${e.message}`);
    }
  }

  async savePlayerDetails(playerId, updates) {
    if (!this.db || !window.FirebaseModules) {
      alert('Not connected to Firestore — cannot save changes.');
      return;
    }
    try {
      const { doc, setDoc } = window.FirebaseModules;
      const target = this.allPlayers.find(p => p.id === playerId);
      if (!target) return;
      Object.assign(target, updates);
      await setDoc(doc(this.db, 'users', playerId), updates, { merge: true });
      alert(`👑 Updated ${updates.name || target.name}'s profile.`);
    } catch (e) {
      console.warn('Save Player Details Error:', e);
      alert(`Could not save details: ${e.message}`);
    }
  }

  async saveState() {
    if (this.currentPlayer) {
      localStorage.setItem('sl_current_player', JSON.stringify(this.currentPlayer));

      // Real-time Firestore write if initialized
      if (this.db && window.FirebaseModules && this.currentPlayer.id) {
        try {
          const { doc, setDoc } = window.FirebaseModules;
          await setDoc(doc(this.db, 'users', this.currentPlayer.id), this.currentPlayer, { merge: true });
        } catch (e) {
          console.warn('Firestore Sync Error:', e);
        }
      }
    }
    localStorage.setItem('sl_all_players', JSON.stringify(this.allPlayers));
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  window.app = new SoloLevelingApp();
});
