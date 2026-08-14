/**
 * Solo Leveling Gamified College Student RPG & Habit System
 * Direct Firestore Gemini API Key Integration (reads from config/gemini doc in DB)
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
  }
}

const sounds = new RPGSoundEngine();

// Live Firebase Configuration (the-system-516fc)
const BAKED_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAV0uk55OIJdlz3mEBweAvbYGlCrqgMycA",
  authDomain: "the-system-516fc.firebaseapp.com",
  projectId: "the-system-516fc",
  storageBucket: "the-system-516fc.firebasestorage.app",
  messagingSenderId: "467421624543",
  appId: "1:467421624543:web:6f0be93483968a1ba0116a",
  measurementId: "G-WD7R8Q48ZV"
};

// Initial Default State
const DEFAULT_PLAYER = {
  id: 'player_001',
  name: 'Sung Jin-Woo',
  email: 'jinwoo@college.edu',
  role: 'player',
  isAdmin: false,
  major: 'Computer Science & Engineering',
  year: '3rd Year (Sem 6)',
  targetGpa: '3.9 / 4.0',
  level: 14,
  xp: 650,
  xpToNextLevel: 1000,
  unassignedPoints: 3,
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=JinWoo',
  stats: {
    int: 42,
    agi: 35,
    str: 28,
    vita: 38,
    per: 45
  },
  deadlines: [
    {
      id: 'd1',
      title: 'Database Management System Project Submission',
      subject: 'CS304 - DBMS',
      hoursLeft: 18,
      urgency: 'critical',
      xpReward: 350,
      statReward: 'INT +5'
    },
    {
      id: 'd2',
      title: 'Operating Systems Midterm Quiz',
      subject: 'CS302 - OS',
      hoursLeft: 42,
      urgency: 'warning',
      xpReward: 250,
      statReward: 'PER +4'
    },
    {
      id: 'd3',
      title: 'Machine Learning Mini-Lab Report',
      subject: 'CS308 - ML',
      hoursLeft: 96,
      urgency: 'normal',
      xpReward: 200,
      statReward: 'INT +3'
    }
  ],
  timetable: {
    Mon: [
      { time: '09:00 - 10:30', title: 'Data Structures & Algorithms', room: 'Hall 102' },
      { time: '11:00 - 12:30', title: 'Operating Systems Lab', room: 'Lab 4B' }
    ],
    Tue: [
      { time: '10:00 - 11:30', title: 'Database Systems Lecture', room: 'Hall 201' },
      { time: '14:00 - 15:30', title: 'Computer Networks', room: 'Hall 105' }
    ],
    Wed: [
      { time: '09:00 - 10:30', title: 'Software Engineering Project', room: 'Lab 2A' },
      { time: '13:00 - 14:30', title: 'Web Development Workshop', room: 'Lab 1C' }
    ],
    Thu: [
      { time: '11:00 - 12:30', title: 'Machine Learning Fundamentals', room: 'Hall 303' },
      { time: '15:00 - 16:30', title: 'Algorithm Optimization', room: 'Hall 102' }
    ],
    Fri: [
      { time: '09:30 - 11:00', title: 'Ethics in AI & Computing', room: 'Auditorium' },
      { time: '14:00 - 16:00', title: 'Weekly Hackathon & Review', room: 'Incubation Hub' }
    ]
  },
  quests: [
    {
      id: 'q1',
      title: 'Review Data Structures Lecture Notes',
      category: 'academics',
      statReward: 'INT +2',
      statKey: 'int',
      xpReward: 150,
      stackTrigger: 'After [10 AM CS Lecture], summarize [2 Key Algorithms]',
      completed: false
    },
    {
      id: 'q2',
      title: 'Push 1 Feature Commit to GitHub Repo',
      category: 'coding',
      statReward: 'PER +3',
      statKey: 'per',
      xpReward: 200,
      stackTrigger: 'After [Lunch Break], open [VS Code & Commit Work]',
      completed: true
    },
    {
      id: 'q3',
      title: 'Dorm Fitness Circuit (30 Push-ups & Planks)',
      category: 'fitness',
      statReward: 'STR +2',
      statKey: 'str',
      xpReward: 120,
      stackTrigger: 'After [Closing Laptop for Evening], perform [Fitness Reps]',
      completed: false
    },
    {
      id: 'q4',
      title: 'Sleep Optimization (Off Screens by 11 PM)',
      category: 'lifestyle',
      statReward: 'VITA +3',
      statKey: 'vita',
      xpReward: 180,
      stackTrigger: 'After [Dinner], set [Phone to Do Not Disturb]',
      completed: false
    }
  ]
};

// Default Multi-Player List for Admin View
const ALL_PLAYERS_DB = [
  DEFAULT_PLAYER,
  {
    id: 'player_002',
    name: 'Cha Hae-In',
    email: 'haein@college.edu',
    role: 'player',
    isAdmin: false,
    major: 'Electrical & Electronics',
    year: '4th Year (Sem 7)',
    targetGpa: '4.0 / 4.0',
    level: 22,
    xp: 850,
    xpToNextLevel: 1500,
    unassignedPoints: 0,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=HaeIn',
    stats: { int: 55, agi: 60, str: 48, vita: 50, per: 58 },
    quests: [
      { id: 'hq1', title: 'Signals & Systems Exam Prep', category: 'academics', completed: true },
      { id: 'hq2', title: 'Circuit Design Simulation', category: 'coding', completed: true },
      { id: 'hq3', title: '5km Campus Run', category: 'fitness', completed: false }
    ]
  },
  {
    id: 'player_003',
    name: 'Yoo Jinho',
    email: 'jinho@college.edu',
    role: 'player',
    isAdmin: false,
    major: 'Business Administration',
    year: '2nd Year (Sem 3)',
    targetGpa: '3.6 / 4.0',
    level: 9,
    xp: 320,
    xpToNextLevel: 700,
    unassignedPoints: 2,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Jinho',
    stats: { int: 28, agi: 30, str: 22, vita: 35, per: 26 },
    quests: [
      { id: 'jq1', title: 'Financial Accounting Case Study', category: 'academics', completed: false },
      { id: 'jq2', title: 'Group Presentation Slides', category: 'academics', completed: true }
    ]
  }
];

class SoloLevelingApp {
  constructor() {
    this.currentPlayer = JSON.parse(localStorage.getItem('sl_current_player')) || null;
    this.allPlayers = JSON.parse(localStorage.getItem('sl_all_players')) || ALL_PLAYERS_DB;
    
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

    // Onboarding Form Submission
    document.getElementById('onboarding-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      sounds.playClick();
      this.completeOnboarding();
    });

    // Demo Player Button
    document.querySelectorAll('.demo-login-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.playClick();
        this.loginDemoPlayer();
      });
    });

    // Logout Button
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      sounds.playClick();
      this.logout();
    });

    // Stat Point Allocation
    document.querySelectorAll('.btn-add-stat').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.playClick();
        const statKey = e.currentTarget.getAttribute('data-stat');
        this.addStatPoint(statKey);
      });
    });

    // AI Form Submission
    document.getElementById('ai-task-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      sounds.playClick();
      this.generateAIQuests();
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
  }

  async fetchGeminiApiKeyFromDB() {
    if (this.db && window.FirebaseModules) {
      try {
        const { doc, getDoc } = window.FirebaseModules;
        
        // Check document IDs: "gemini", "Gemini", "GEMINI"
        const docNames = ['gemini', 'Gemini', 'GEMINI'];
        for (const name of docNames) {
          try {
            const configSnap = await getDoc(doc(this.db, 'config', name));
            if (configSnap.exists()) {
              const data = configSnap.data();
              const key = data.apiKey || data.key || data.api_key;
              if (key) {
                localStorage.setItem('sl_cached_gemini_key', key);
                return key;
              }
            }
          } catch (e) {
            // Next doc name
          }
        }
      } catch (e) {
        console.warn('Firestore config read notice:', e);
      }
    }
    
    return localStorage.getItem('sl_cached_gemini_key') || null;
  }

  async loginWithGoogleOAuth() {
    if (this.firebaseAuth && this.googleProvider && window.FirebaseModules) {
      try {
        const { signInWithPopup } = window.FirebaseModules;
        const result = await signInWithPopup(this.firebaseAuth, this.googleProvider);
        await this.handleFirebaseUserLogin(result.user);
      } catch (error) {
        console.error('Google OAuth Error:', error);
        alert(`Google OAuth Sign-In: ${error.message}`);
      }
    } else {
      const demoUser = {
        uid: `g_${Date.now()}`,
        displayName: 'Google Student Player',
        email: 'student@college.edu',
        photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=GoogleUser'
      };
      await this.handleFirebaseUserLogin(demoUser);
    }
  }

  async handleFirebaseUserLogin(user) {
    let playerRole = 'player';
    let isAdmin = false;
    let existingProfile = null;

    if (this.db && window.FirebaseModules) {
      try {
        const { doc, getDoc, setDoc } = window.FirebaseModules;
        const userDocRef = doc(this.db, 'users', user.uid);
        
        const userSnap = await getDoc(userDocRef).catch(() => null);

        if (userSnap && userSnap.exists && userSnap.exists()) {
          existingProfile = userSnap.data();
          isAdmin = existingProfile.isAdmin === true;
          playerRole = isAdmin ? 'admin' : 'player';
        } else {
          const newUserData = {
            ...DEFAULT_PLAYER,
            id: user.uid,
            name: user.displayName || 'Google Student',
            email: user.email,
            avatar: user.photoURL || DEFAULT_PLAYER.avatar,
            role: 'player',
            isAdmin: false,
            onboarded: false
          };
          existingProfile = newUserData;
          setDoc(userDocRef, newUserData, { merge: true }).catch(e => console.warn('Firestore User Write Warning:', e));
        }
      } catch (e) {
        console.warn('Firestore User Fetch Error:', e);
      }
    }

    this.currentPlayer = {
      ...DEFAULT_PLAYER,
      ...(existingProfile || {}),
      id: user.uid || `g_${Date.now()}`,
      name: user.displayName || existingProfile?.name || 'Google Student',
      email: user.email,
      avatar: user.photoURL || existingProfile?.avatar || DEFAULT_PLAYER.avatar,
      role: playerRole,
      isAdmin: isAdmin
    };

    this.saveState();
    this.updateUI();

    if (isAdmin) {
      sounds.playLevelUp();
      this.switchView('admin-view');
    } else if (!this.currentPlayer.onboarded) {
      this.switchView('onboarding-view');
    } else {
      this.switchView('status-view');
    }
  }

  completeOnboarding() {
    const name = document.getElementById('onboard-name').value.trim();
    const major = document.getElementById('onboard-major').value.trim();
    const year = document.getElementById('onboard-year').value.trim();
    const gpa = document.getElementById('onboard-gpa').value.trim();

    if (name) this.currentPlayer.name = name;
    if (major) this.currentPlayer.major = major;
    if (year) this.currentPlayer.year = year;
    if (gpa) this.currentPlayer.targetGpa = gpa;
    this.currentPlayer.onboarded = true;

    this.saveState();
    this.updateUI();
    this.switchView('status-view');
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

  loginDemoPlayer() {
    this.currentPlayer = { ...DEFAULT_PLAYER, role: 'player', isAdmin: false };
    this.saveState();
    this.updateUI();
    this.switchView('status-view');
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
      this.saveState();
      this.updateUI();
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

  async generateAIQuests() {
    const branch = document.getElementById('ai-branch').value || 'Computer Science';
    const focus = document.getElementById('ai-focus').value || 'balanced';
    const time = document.getElementById('ai-time').value || '4h';

    // Fetch API Key from Firestore config/gemini document
    const dbApiKey = await this.fetchGeminiApiKeyFromDB();

    if (dbApiKey) {
      try {
        const promptText = `You are the Solo Leveling RPG System AI. Generate 3 tailored daily quests for a college student majoring in ${branch} with primary focus: ${focus} and available time: ${time}.
Format strictly as JSON array of objects with keys: "title", "category" (one of: "academics", "coding", "fitness", "lifestyle"), "statReward" (e.g. "INT +3"), "statKey" (one of: "int", "agi", "str", "vita", "per"), "xpReward" (number e.g. 200), "stackTrigger" (e.g. "After [Class], perform [Task]"). Output ONLY raw JSON array.`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${dbApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedQuests = JSON.parse(cleanedJson);
            if (Array.isArray(parsedQuests)) {
              const formatted = parsedQuests.map((q, idx) => ({
                ...q,
                id: `ai_gemini_${Date.now()}_${idx}`,
                completed: false
              }));
              this.currentPlayer.quests = [...formatted, ...this.currentPlayer.quests];
              this.saveState();
              this.updateUI();
              this.switchView('quests-view');
              sounds.playLevelUp();
              alert('✨ Gemini AI (Live from Firestore config/gemini): Generated 3 new dynamic college quests!');
              return;
            }
          }
        } else {
          console.warn(`Gemini API returned status ${res.status}`);
        }
      } catch (err) {
        console.warn('Gemini API Fetch Error:', err);
      }
    }

    // Default Fallback Quests if key in config/gemini is not set yet or offline
    const generatedQuests = [
      {
        id: `ai_${Date.now()}_1`,
        title: `AI Quest: Study 2 Hours for ${branch} Midterm`,
        category: 'academics',
        statReward: 'INT +3',
        statKey: 'int',
        xpReward: 250,
        stackTrigger: 'After [Breakfast], set [Timer for 120m Deep Focus]',
        completed: false
      },
      {
        id: `ai_${Date.now()}_2`,
        title: `AI Quest: Solve 2 LeetCode / Coding Tasks`,
        category: 'coding',
        statReward: 'PER +3',
        statKey: 'per',
        xpReward: 220,
        stackTrigger: 'After [Closing Class Lecture], open [Compiler & Code]',
        completed: false
      },
      {
        id: `ai_${Date.now()}_3`,
        title: `AI Quest: 45 Min Gym / Cardio Workout`,
        category: 'fitness',
        statReward: 'STR +3',
        statKey: 'str',
        xpReward: 200,
        stackTrigger: 'After [5 PM Classes], change into [Workout Clothes]',
        completed: false
      }
    ];

    this.currentPlayer.quests = [...generatedQuests, ...this.currentPlayer.quests];
    this.saveState();
    this.updateUI();
    this.switchView('quests-view');
    alert('⚡ AI Quests generated! Note: Ensure document config/gemini exists in your Firestore database with field apiKey = "YOUR_GEMINI_API_KEY".');
  }

  async renderAdminDashboard() {
    const container = document.getElementById('admin-players-container');
    if (!container) return;

    container.innerHTML = '<div style="color: var(--color-cyan);">Connecting to Live Firestore Database...</div>';

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

    this.allPlayers.forEach(player => {
      const box = document.createElement('div');
      box.className = 'player-admin-box';

      const completed = (player.quests || []).filter(q => q.completed).length;
      const total = (player.quests || []).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      let tasksHTML = (player.quests || []).map(q => `
        <div class="admin-task-item">
          <span>${q.title}</span>
          <strong style="color: ${q.completed ? 'var(--color-emerald)' : 'var(--color-pink)'}">
            ${q.completed ? '✓ DONE' : '⏳ PENDING'}
          </strong>
        </div>
      `).join('');

      box.innerHTML = `
        <div class="player-admin-top">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <img src="${player.avatar}" style="width: 32px; height: 32px; border-radius: 50%;">
            <div>
              <strong>${player.name}</strong>
              <div style="font-size: 0.75rem; color: var(--color-cyan);">${player.major} (LVL ${player.level})</div>
            </div>
          </div>
          <button class="btn-primary btn-award-xp" data-id="${player.id}" style="font-size: 0.7rem; padding: 0.3rem 0.6rem; background: var(--color-violet);">
            +500 XP
          </button>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
          Daily Quests Progress: <strong>${completed} / ${total} (${percent}%)</strong>
        </div>
        <div>${tasksHTML}</div>
      `;

      box.querySelector('.btn-award-xp').addEventListener('click', (e) => {
        sounds.playLevelUp();
        const id = e.currentTarget.getAttribute('data-id');
        this.awardBonusXPToPlayer(id, 500);
      });

      container.appendChild(box);
    });
  }

  async awardBonusXPToPlayer(playerId, xpAmount) {
    if (this.db && window.FirebaseModules) {
      try {
        const { doc, setDoc } = window.FirebaseModules;
        const target = this.allPlayers.find(p => p.id === playerId);
        if (target) {
          target.xp = (target.xp || 0) + xpAmount;
          await setDoc(doc(this.db, 'users', playerId), { xp: target.xp }, { merge: true });
          alert(`👑 Real-time Firestore: Awarded +${xpAmount} Bonus XP to ${target.name}!`);
          this.renderAdminDashboard();
        }
      } catch (e) {
        console.warn('Award XP Error:', e);
      }
    } else {
      alert(`👑 Admin awarded +${xpAmount} Bonus XP to Player ID: ${playerId}`);
    }
  }

  async saveState() {
    if (this.currentPlayer) {
      localStorage.setItem('sl_current_player', JSON.stringify(this.currentPlayer));

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
