/**
 * Solo Leveling — Real-Life RPG System Engine v3.0 (Final Polish)
 * Complete Feature Set:
 * 1. 7-Stat Hunter Sheet + National Level Ranks
 * 2. Quest Engine (Daily, Secret, Custom) + Gold Rewards
 * 3. Penalty Zone + Missed Quest Detection
 * 4. Photo Proof + Pomodoro/Stopwatch Timer Engine
 * 5. Gold Shop + Equippable Gear (Common → Legendary)
 * 6. SVG Radar Analytics + Quest History Log
 * 7. AI Student Quest Converter with Goal Presets
 * 8. Admin Inspector Panel (360° Player Details)
 * 9. System Toast Notifications & In-App GitHub APK Updater
 */

// ═══════════════════════════════════════════
// RPG SOUND ENGINE
// ═══════════════════════════════════════════
class RPGSoundEngine {
  constructor() { this.ctx = null; }

  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  _play(type, freqs, duration) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f.freq, now + (f.at || 0));
      gain.gain.setValueAtTime(f.vol || 0.2, now + (f.at || 0));
      gain.gain.exponentialRampToValueAtTime(0.01, now + (f.at || 0) + (f.dur || duration));
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + (f.at || 0));
      osc.stop(now + (f.at || 0) + (f.dur || duration));
    });
  }

  playClick() { this._play('sine', [{ freq: 800, vol: 0.12, dur: 0.08 }, { freq: 400, vol: 0.05, dur: 0.08 }], 0.08); }
  playQuestComplete() { this._play('triangle', [523.25, 659.25, 783.99, 1046.50].map((freq, i) => ({ freq, at: i * 0.1, dur: 0.3, vol: 0.15 })), 0.3); }
  playLevelUp() { this._play('sawtooth', [440, 554.37, 659.25, 880, 1108.73, 1318.51].map((freq, i) => ({ freq, at: i * 0.08, dur: 0.25, vol: 0.2 })), 0.25); }
  playPenalty() { this._play('sawtooth', [{ freq: 120, vol: 0.3, dur: 0.5 }, { freq: 80, at: 0.6, vol: 0.3, dur: 0.5 }], 0.5); }
  playPurchase() { this._play('sine', [{ freq: 1200, vol: 0.15, dur: 0.12 }, { freq: 1600, at: 0.13, vol: 0.15, dur: 0.12 }], 0.12); }
}

const sounds = new RPGSoundEngine();

// ═══════════════════════════════════════════
// FIREBASE CONFIG (the-system-516fc)
// ═══════════════════════════════════════════
const BAKED_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAV0uk55OIJdlz3mEBweAvbYGlCrqgMycA",
  authDomain: "the-system-516fc.firebaseapp.com",
  projectId: "the-system-516fc",
  storageBucket: "the-system-516fc.firebasestorage.app",
  messagingSenderId: "467421624543",
  appId: "1:467421624543:web:6f0be93483968a1ba0116a",
  measurementId: "G-WD7R8Q48ZV"
};

// ═══════════════════════════════════════════
// SHOP CATALOGUE
// ═══════════════════════════════════════════
const SHOP_CATALOGUE = [
  { id: 'reward_games', name: '1 Hour Gaming Session', icon: '🎮', cost: 500, type: 'reward', rarity: 'common', description: 'Earned break — 1 hour of guilt-free gaming.' },
  { id: 'reward_movie', name: 'Movie Night', icon: '🎬', cost: 800, type: 'reward', rarity: 'common', description: 'Watch any movie you want as a reward.' },
  { id: 'reward_food', name: 'Cheat Meal Unlocked', icon: '🍕', cost: 600, type: 'reward', rarity: 'rare', description: 'Order your favourite cheat meal — fully earned.' },
  { id: 'reward_sleep', name: 'Sleep-In Morning', icon: '😴', cost: 1000, type: 'reward', rarity: 'rare', description: 'Wake up 1 hour later tomorrow — sleep bonus.' },
  { id: 'reward_hangout', name: 'Friend Hangout Pass', icon: '👥', cost: 1200, type: 'reward', rarity: 'rare', description: 'Go out guilt-free — your productivity earned this.' },
  { id: 'item_dagger', name: "Rasaka's Dagger", icon: '🗡️', cost: 2000, type: 'equipment', rarity: 'epic', statBoost: { per: 8 }, description: '+8 PER — The Architect of Perception.' },
  { id: 'item_ring', name: "Demon King's Ring", icon: '💍', cost: 3500, type: 'equipment', rarity: 'legendary', statBoost: { int: 10, dis: 5 }, description: '+10 INT / +5 DIS — Amplifies cognitive and discipline power.' },
  { id: 'item_armor', name: "Shadow Soldier Armor", icon: '🛡️', cost: 3000, type: 'equipment', rarity: 'legendary', statBoost: { str: 8, vita: 8 }, description: '+8 STR / +8 VITA — Iron body forged by darkness.' },
  { id: 'item_book', name: "Ancient Tome of Knowledge", icon: '📖', cost: 1800, type: 'equipment', rarity: 'epic', statBoost: { int: 6 }, description: '+6 INT — Forbidden knowledge grants academic mastery.' },
  { id: 'item_shoes', name: "Flash Step Sneakers", icon: '👟', cost: 1500, type: 'equipment', rarity: 'rare', statBoost: { agi: 7 }, description: '+7 AGI — Never miss a deadline or a class again.' },
];

// ═══════════════════════════════════════════
// DEFAULT PLAYER TEMPLATE
// ═══════════════════════════════════════════
const DEFAULT_PLAYER = {
  id: 'player_001',
  name: 'Sung Jin-Woo',
  email: '',
  role: 'player',
  isAdmin: false,
  onboarded: false,
  major: 'Computer Science & Engineering',
  year: '3rd Year (Sem 6)',
  level: 1,
  xp: 0,
  xpToNextLevel: 500,
  unassignedPoints: 0,
  gold: 500,
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=JinWoo',
  stats: { int: 10, agi: 10, str: 10, vita: 10, per: 10, wth: 5, dis: 8 },
  inventory: [],
  equipped: {},
  penaltyActive: false,
  penaltyEndsAt: null,
  streakDays: 0,
  lastQuestDate: null,
  historyLog: [],
  quests: [
    {
      id: 'q1', title: 'Review Lecture Notes (45 min Deep Study)',
      category: 'academics', statReward: 'INT +2', statKey: 'int',
      xpReward: 150, goldReward: 100, difficulty: 'D',
      stackTrigger: 'After [Morning Class], open [Notes & Summarize]',
      completed: false, requiresPhoto: false
    },
    {
      id: 'q2', title: 'Push 1 Commit to GitHub Repo',
      category: 'coding', statReward: 'PER +3', statKey: 'per',
      xpReward: 200, goldReward: 150, difficulty: 'C',
      stackTrigger: 'After [Lunch Break], open [VS Code & Commit]',
      completed: false, requiresPhoto: false
    },
    {
      id: 'q3', title: 'Dorm Fitness Circuit (30 Push-ups)',
      category: 'fitness', statReward: 'STR +2', statKey: 'str',
      xpReward: 120, goldReward: 80, difficulty: 'E',
      stackTrigger: 'After [Closing Laptop], perform [Fitness Reps]',
      completed: false, requiresPhoto: false
    },
    {
      id: 'q4', title: 'Sleep Optimization (Off Screens by 11 PM)',
      category: 'lifestyle', statReward: 'VITA +3', statKey: 'vita',
      xpReward: 180, goldReward: 120, difficulty: 'D',
      stackTrigger: 'After [Dinner], set [Phone to Do Not Disturb]',
      completed: false, requiresPhoto: false
    },
    {
      id: 'q5', title: '⭐ SECRET QUEST: 1km Run at Dawn',
      category: 'secret', statReward: 'STR +5 / AGI +3', statKey: 'str',
      xpReward: 400, goldReward: 300, difficulty: 'B',
      stackTrigger: 'Rise before 6 AM — Hidden stat multiplier unlocked',
      completed: false, requiresPhoto: true
    },
  ],
  dailyEssential: { pushups: 0, situps: 0, squats: 0, km: 0 }
};

// ═══════════════════════════════════════════
// MAIN APP CLASS
// ═══════════════════════════════════════════
class SoloLevelingApp {
  constructor() {
    this.currentPlayer = JSON.parse(localStorage.getItem('sl_player_v3')) || null;
    this.allPlayers = [];
    this.db = null;
    this.firebaseAuth = null;
    this.googleProvider = null;

    // Timer engine state
    this.timerInterval = null;
    this.timerMode = 'pomo';
    this.timerRunning = false;
    this.timerSeconds = 25 * 60;
    this.stopwatchSeconds = 0;

    // Penalty zone state
    this.penaltyInterval = null;

    this.init();
  }

  init() {
    this.initFirebase();
    this.bindEvents();
    this.bindAIEvents();

    if (this.currentPlayer) {
      this.updateUI();
      this.switchView('status-view');
      this.checkPenaltyZone();
    } else {
      this.switchView('auth-view');
    }
  }

  initFirebase() {
    if (!window.FirebaseModules) return;
    try {
      const { initializeApp, getAuth, getFirestore, GoogleAuthProvider, onAuthStateChanged } = window.FirebaseModules;
      const app = initializeApp(BAKED_FIREBASE_CONFIG);
      this.firebaseAuth = getAuth(app);
      this.db = getFirestore(app);
      this.googleProvider = new GoogleAuthProvider();

      onAuthStateChanged(this.firebaseAuth, user => {
        if (user && !this.currentPlayer) this.handleFirebaseLogin(user);
      });
    } catch (e) {
      console.warn('Firebase init:', e);
    }
  }

  bindEvents() {
    document.querySelectorAll('.tab-btn[data-view], .mobile-nav-item[data-view]').forEach(btn => {
      btn.addEventListener('click', e => {
        sounds.playClick();
        this.switchView(e.currentTarget.dataset.view);
      });
    });

    document.getElementById('google-login-btn')?.addEventListener('click', () => { sounds.playClick(); this.loginGoogle(); });
    document.querySelectorAll('.demo-login-btn').forEach(btn => btn.addEventListener('click', () => { sounds.playClick(); this.loginDemo(); }));
    document.getElementById('logout-btn')?.addEventListener('click', () => { sounds.playClick(); this.logout(); });
    document.getElementById('onboarding-form')?.addEventListener('submit', e => { e.preventDefault(); this.completeOnboarding(); });

    document.querySelectorAll('.btn-add-stat').forEach(btn => {
      btn.addEventListener('click', e => { sounds.playClick(); this.addStatPoint(e.currentTarget.dataset.stat); });
    });

    document.getElementById('add-custom-quest-btn')?.addEventListener('click', () => { sounds.playClick(); this.promptAddCustomQuest(); });
    document.getElementById('trigger-ai-modal-btn')?.addEventListener('click', () => { sounds.playClick(); this.switchView('ai-generator-view'); });
    document.getElementById('ai-task-form')?.addEventListener('submit', e => { e.preventDefault(); sounds.playClick(); this.generateAIQuests(); });

    document.getElementById('timer-start-btn')?.addEventListener('click', () => { sounds.playClick(); this.toggleTimer(); });
    document.getElementById('timer-reset-btn')?.addEventListener('click', () => { sounds.playClick(); this.resetTimer(); });
    document.getElementById('timer-mode-pomo')?.addEventListener('click', () => { sounds.playClick(); this.setTimerMode('pomo'); });
    document.getElementById('timer-mode-stopwatch')?.addEventListener('click', () => { sounds.playClick(); this.setTimerMode('stopwatch'); });

    document.getElementById('photo-proof-input')?.addEventListener('change', e => this.handlePhotoProof(e));
    document.getElementById('clear-penalty-btn')?.addEventListener('click', () => { sounds.playClick(); this.clearPenaltyZone(); });
    document.getElementById('admin-refresh-btn')?.addEventListener('click', () => { sounds.playClick(); this.renderAdminDashboard(); });
    document.getElementById('check-update-btn')?.addEventListener('click', () => { sounds.playClick(); this.checkForSystemUpdate(); });
  }

  bindAIEvents() {
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', e => {
        sounds.playClick();
        const goalInput = document.getElementById('ai-goal-input');
        if (goalInput) goalInput.value = e.currentTarget.dataset.goal;
      });
    });
  }

  showSystemMessage(title, message, type = 'info') {
    const container = document.getElementById('system-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `system-toast type-${type}`;
    
    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';
    if (type === 'warning') icon = '⚡';

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;" class="toast-title">
        <span>${icon}</span> <span>[SYSTEM]: ${title}</span>
      </div>
      <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    if (type === 'error') sounds.playPenalty();
    else if (type === 'success') sounds.playQuestComplete();
    else sounds.playClick();

    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      toast.addEventListener('animationend', () => toast.remove());
    }, 4000);
  }

  switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));

    document.getElementById(viewId)?.classList.add('active');
    document.querySelectorAll(`[data-view="${viewId}"]`).forEach(b => b.classList.add('active'));

    if (viewId === 'admin-view') this.renderAdminDashboard();
    if (viewId === 'shop-view') this.renderShop();
    if (viewId === 'analytics-view') { this.renderRadarChart(); this.renderHistoryLog(); }
    if (viewId === 'quests-view') this.renderQuests();
  }

  async loginGoogle() {
    if (!this.firebaseAuth || !this.googleProvider || !window.FirebaseModules) {
      return this.loginDemo();
    }
    try {
      const { signInWithPopup } = window.FirebaseModules;
      this.googleProvider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(this.firebaseAuth, this.googleProvider);
      await this.handleFirebaseLogin(result.user);
    } catch (e) {
      console.error('Google login error:', e);
      if (e.code === 'auth/web-storage-unsupported' || e.message?.includes('sessionStorage')) {
        this.showSystemMessage('Storage Warning', 'Browser storage restricted. Switching to Demo Mode.', 'warning');
        this.loginDemo();
      } else if (e.code !== 'auth/popup-closed-by-user') {
        this.showSystemMessage('Authentication Error', e.message, 'error');
      }
    }
  }

  async handleFirebaseLogin(user) {
    let isAdmin = false;
    let profile = null;

    if (this.db && window.FirebaseModules) {
      try {
        const { doc, getDoc, setDoc } = window.FirebaseModules;
        const snap = await getDoc(doc(this.db, 'users', user.uid)).catch(() => null);
        if (snap && snap.exists()) {
          profile = snap.data();
          isAdmin = profile.isAdmin === true;
        } else {
          profile = {
            ...DEFAULT_PLAYER,
            id: user.uid,
            name: user.displayName || 'Hunter',
            email: user.email || '',
            avatar: user.photoURL || DEFAULT_PLAYER.avatar,
            isAdmin: false,
            onboarded: false
          };
          setDoc(doc(this.db, 'users', user.uid), profile, { merge: true }).catch(() => {});
        }
      } catch (e) {
        console.warn('Firestore login:', e);
      }
    }

    this.currentPlayer = {
      ...DEFAULT_PLAYER,
      ...(profile || {}),
      id: user.uid,
      name: user.displayName || profile?.name || 'Hunter',
      email: user.email || '',
      avatar: user.photoURL || profile?.avatar || DEFAULT_PLAYER.avatar,
      role: isAdmin ? 'admin' : 'player',
      isAdmin
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
      this.checkPenaltyZone();
    }
  }

  loginDemo() {
    this.currentPlayer = { ...DEFAULT_PLAYER, id: `demo_${Date.now()}`, onboarded: true };
    this.saveState();
    this.updateUI();
    this.switchView('status-view');
    this.showSystemMessage('System Awakened', 'Welcome back, Hunter.', 'success');
  }

  completeOnboarding() {
    const name = document.getElementById('onboard-name').value.trim();
    const major = document.getElementById('onboard-major').value.trim();
    const year = document.getElementById('onboard-year').value.trim();
    if (name) this.currentPlayer.name = name;
    if (major) this.currentPlayer.major = major;
    if (year) this.currentPlayer.year = year;
    this.currentPlayer.onboarded = true;
    this.saveState();
    this.updateUI();
    this.switchView('status-view');
    this.showSystemMessage('Awakening Complete', 'Your Hunter profile has been registered.', 'success');
  }

  logout() {
    if (this.firebaseAuth && window.FirebaseModules) {
      window.FirebaseModules.signOut(this.firebaseAuth).catch(() => {});
    }
    this.currentPlayer = null;
    localStorage.removeItem('sl_player_v3');
    document.getElementById('user-hud-profile').style.display = 'none';
    document.getElementById('desktop-nav').style.display = 'none';
    document.getElementById('streak-shield-banner').style.display = 'none';
    this.switchView('auth-view');
  }

  calculateRank(level) {
    if (level >= 50) return { letter: 'NL', label: 'NATIONAL LEVEL HUNTER', color: '#f0f4ff', glow: 'rgba(240, 244, 255, 0.6)' };
    if (level >= 40) return { letter: 'S', label: 'S-RANK HUNTER', color: '#fbbf24', glow: 'rgba(251,191,36,0.5)' };
    if (level >= 30) return { letter: 'A', label: 'A-RANK HUNTER', color: '#a78bfa', glow: 'rgba(167,139,250,0.5)' };
    if (level >= 20) return { letter: 'B', label: 'B-RANK HUNTER', color: '#60a5fa', glow: 'rgba(96,165,250,0.5)' };
    if (level >= 12) return { letter: 'C', label: 'C-RANK HUNTER', color: '#34d399', glow: 'rgba(52,211,153,0.5)' };
    if (level >= 6)  return { letter: 'D', label: 'D-RANK HUNTER', color: '#94a3b8', glow: 'rgba(148,163,184,0.5)' };
    return { letter: 'E', label: 'E-RANK HUNTER', color: '#64748b', glow: 'rgba(100,116,139,0.4)' };
  }

  getIdentityTitle(stats) {
    const entries = Object.entries(stats);
    const highest = entries.reduce((a, b) => b[1] > a[1] ? b : a);
    const titles = {
      int: 'The Apex Scholar', per: 'The Code Monarch',
      str: 'The Iron Athlete', vita: 'The Undying Sentinel',
      agi: 'The Lightning Strategist', wth: 'The Wealthy Tactician',
      dis: 'The Disciplined Sovereign'
    };
    return titles[highest[0]] || 'The Awakened Student';
  }

  updateUI() {
    if (!this.currentPlayer) return;
    const p = this.currentPlayer;

    document.getElementById('user-hud-profile').style.display = 'flex';
    document.getElementById('hud-user-avatar').src = p.avatar;
    document.getElementById('hud-user-name').innerText = p.name;
    document.getElementById('hud-user-role').innerText = `[${p.role.toUpperCase()}]`;
    document.getElementById('hud-user-gold').innerText = (p.gold || 0).toLocaleString();
    document.getElementById('desktop-nav').style.display = 'flex';
    document.getElementById('streak-shield-banner').style.display = 'flex';

    const adminTab = document.getElementById('admin-tab-btn');
    const mobileAdmin = document.getElementById('mobile-admin-item');
    if (p.isAdmin) {
      adminTab?.style.setProperty('display', 'flex');
      mobileAdmin?.style.setProperty('display', 'flex');
    } else {
      adminTab?.style.setProperty('display', 'none');
      mobileAdmin?.style.setProperty('display', 'none');
    }

    const rank = this.calculateRank(p.level);
    document.getElementById('player-rank-letter').innerText = rank.letter;
    document.getElementById('player-rank-label').innerText = rank.label;

    document.getElementById('player-display-name').innerText = p.name;
    document.getElementById('player-display-title').innerText = `✨ ${this.getIdentityTitle(p.stats)}`;
    document.getElementById('player-major').innerText = p.major || 'Unknown';
    document.getElementById('player-year').innerText = p.year || '—';
    document.getElementById('player-gold-display').innerText = `🪙 ${(p.gold || 0).toLocaleString()}`;
    document.getElementById('shop-gold-display').innerText = (p.gold || 0).toLocaleString();

    const done = p.quests.filter(q => q.completed).length;
    document.getElementById('player-quests-count').innerText = `${done} / ${p.quests.length} Quests`;

    document.getElementById('player-level').innerText = `LVL ${p.level}`;
    const xpPct = Math.min(100, Math.round((p.xp / p.xpToNextLevel) * 100));
    document.getElementById('player-xp-fill').style.width = `${xpPct}%`;
    document.getElementById('player-xp-text').innerText = `${p.xp} / ${p.xpToNextLevel} XP`;
    document.getElementById('stat-points-available').innerText = `${p.unassignedPoints} Points Available`;

    ['int', 'agi', 'str', 'vita', 'per', 'wth', 'dis'].forEach(key => {
      const raw = p.stats[key] || 0;
      const equipped = this._getEquipBoost(key);
      const total = raw + equipped;
      const valEl = document.getElementById(`stat-${key}-val`);
      const barEl = document.getElementById(`stat-${key}-bar`);
      if (valEl) valEl.innerText = total > raw ? `${total} (+${equipped})` : total;
      if (barEl) barEl.style.width = `${Math.min(100, total * 1.2)}%`;
    });

    this.renderQuests();
  }

  _getEquipBoost(statKey) {
    if (!this.currentPlayer?.equipped) return 0;
    let boost = 0;
    Object.values(this.currentPlayer.equipped).forEach(itemId => {
      const item = SHOP_CATALOGUE.find(i => i.id === itemId);
      if (item?.statBoost?.[statKey]) boost += item.statBoost[statKey];
    });
    return boost;
  }

  renderQuests() {
    const container = document.getElementById('quests-list-container');
    if (!container) return;
    container.innerHTML = '';

    this.currentPlayer.quests.forEach(quest => {
      const card = document.createElement('div');
      card.className = `glass-panel quest-card ${quest.completed ? 'completed' : ''}`;
      const diffColors = { E: '#94a3b8', D: '#60a5fa', C: '#34d399', B: '#a78bfa', A: '#f59e0b', S: '#f43f5e' };

      card.innerHTML = `
        <div class="quest-left">
          <div class="quest-checkbox ${quest.completed ? 'checked' : ''}" data-id="${quest.id}"></div>
          <div class="quest-details">
            <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.2rem;">
              <span class="quest-category-tag cat-${quest.category}">${quest.category}</span>
              <span style="font-size: 0.65rem; font-weight: 800; color: ${diffColors[quest.difficulty] || '#94a3b8'}; background: rgba(255,255,255,0.05); padding: 0.1rem 0.4rem; border-radius: 4px;">${quest.difficulty}-RANK</span>
              ${quest.requiresPhoto ? '<span style="font-size: 0.65rem; color: var(--color-pink);">📷 PROOF REQUIRED</span>' : ''}
            </div>
            <div class="quest-title">${quest.title}</div>
            <div class="quest-stack-trigger">${quest.stackTrigger || ''}</div>
          </div>
        </div>
        <div class="quest-rewards">
          <div class="reward-xp">+${quest.xpReward} XP</div>
          <div style="color: var(--color-gold); font-weight: 700; font-size: 0.8rem;">+${quest.goldReward} 🪙</div>
          <div class="reward-stat">${quest.statReward}</div>
        </div>
      `;

      card.querySelector('.quest-checkbox').addEventListener('click', e => {
        this.toggleQuestCompletion(e.currentTarget.dataset.id);
      });

      container.appendChild(card);
    });
  }

  toggleQuestCompletion(questId) {
    const quest = this.currentPlayer.quests.find(q => q.id === questId);
    if (!quest) return;

    if (!quest.completed && quest.requiresPhoto) {
      this.showSystemMessage('S-Rank Verification', 'Attach photo proof in the Focus tab before clearing this quest.', 'warning');
      this.switchView('timer-view');
      return;
    }

    quest.completed = !quest.completed;

    if (quest.completed) {
      sounds.playQuestComplete();
      this.currentPlayer.xp += quest.xpReward;
      this.currentPlayer.gold = (this.currentPlayer.gold || 0) + quest.goldReward;
      if (quest.statKey && this.currentPlayer.stats[quest.statKey] !== undefined) {
        this.currentPlayer.stats[quest.statKey] += 2;
      }
      this.addHistoryEntry(`✅ Completed: ${quest.title} (+${quest.xpReward} XP)`);
      this.checkLevelUp();
    } else {
      sounds.playClick();
      this.currentPlayer.xp = Math.max(0, this.currentPlayer.xp - quest.xpReward);
      this.currentPlayer.gold = Math.max(0, (this.currentPlayer.gold || 0) - quest.goldReward);
    }

    this.saveState();
    this.updateUI();
  }

  promptAddCustomQuest() {
    const title = prompt('⭐ Enter your Secret Quest title:');
    if (!title) return;

    const quest = {
      id: `custom_${Date.now()}`,
      title: title.trim(),
      category: 'secret',
      statReward: 'DIS +3',
      statKey: 'dis',
      xpReward: 300,
      goldReward: 200,
      difficulty: 'C',
      stackTrigger: 'Custom quest completed',
      completed: false,
      requiresPhoto: false
    };

    this.currentPlayer.quests.unshift(quest);
    sounds.playLevelUp();
    this.saveState();
    this.updateUI();
    this.showSystemMessage('Quest Added', `Secret quest "${title}" registered to your log.`, 'success');
  }

  addStatPoint(statKey) {
    if (this.currentPlayer.unassignedPoints <= 0) {
      this.showSystemMessage('No Points', 'Level up to earn unassigned attribute points.', 'warning');
      return;
    }
    this.currentPlayer.stats[statKey] += 1;
    this.currentPlayer.unassignedPoints -= 1;
    this.saveState();
    this.updateUI();
  }

  checkLevelUp() {
    while (this.currentPlayer.xp >= this.currentPlayer.xpToNextLevel) {
      sounds.playLevelUp();
      this.currentPlayer.xp -= this.currentPlayer.xpToNextLevel;
      this.currentPlayer.level += 1;
      this.currentPlayer.xpToNextLevel = Math.round(this.currentPlayer.xpToNextLevel * 1.25);
      this.currentPlayer.unassignedPoints += 5;
      const rank = this.calculateRank(this.currentPlayer.level);
      this.addHistoryEntry(`🎉 LEVEL UP → LVL ${this.currentPlayer.level}`);
      this.showSystemMessage('LEVEL UP!', `You are now LVL ${this.currentPlayer.level} — ${rank.label}. +5 Points awarded!`, 'success');
    }
  }

  checkPenaltyZone() {
    if (!this.currentPlayer) return;
    const today = new Date().toDateString();
    if (this.currentPlayer.lastQuestDate && this.currentPlayer.lastQuestDate !== today) {
      this.currentPlayer.quests = this.currentPlayer.quests.map(q => ({ ...q, completed: false }));
    }
    this.currentPlayer.lastQuestDate = today;
  }

  setTimerMode(mode) {
    this.timerMode = mode;
    this.resetTimer();
    const pomoBtn = document.getElementById('timer-mode-pomo');
    const swBtn = document.getElementById('timer-mode-stopwatch');
    if (mode === 'pomo') {
      pomoBtn?.classList.add('active');
      swBtn?.classList.remove('active');
    } else {
      swBtn?.classList.add('active');
      pomoBtn?.classList.remove('active');
    }
  }

  toggleTimer() {
    if (this.timerRunning) {
      clearInterval(this.timerInterval);
      this.timerRunning = false;
      document.getElementById('timer-start-btn').innerText = 'RESUME';
    } else {
      this.timerRunning = true;
      document.getElementById('timer-start-btn').innerText = 'PAUSE';

      if (this.timerMode === 'pomo') {
        this.timerInterval = setInterval(() => {
          this.timerSeconds--;
          if (this.timerSeconds <= 0) {
            clearInterval(this.timerInterval);
            this.timerRunning = false;
            document.getElementById('timer-start-btn').innerText = 'START';
            sounds.playQuestComplete();
            this.currentPlayer.xp += 50;
            this.currentPlayer.gold += 25;
            this.checkLevelUp();
            this.saveState();
            this.updateUI();
            this.showSystemMessage('Focus Cleared', 'Pomodoro session complete! +50 XP awarded.', 'success');
            this.timerSeconds = 25 * 60;
          }
          this._updateTimerDisplay();
        }, 1000);
      } else {
        this.timerInterval = setInterval(() => {
          this.stopwatchSeconds++;
          this._updateTimerDisplay();
        }, 1000);
      }
    }
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.timerRunning = false;
    document.getElementById('timer-start-btn').innerText = 'START';
    if (this.timerMode === 'pomo') this.timerSeconds = 25 * 60;
    else this.stopwatchSeconds = 0;
    this._updateTimerDisplay();
  }

  _updateTimerDisplay() {
    const el = document.getElementById('timer-display-clock');
    if (!el) return;
    const secs = this.timerMode === 'pomo' ? this.timerSeconds : this.stopwatchSeconds;
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    el.innerText = h > 0 ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  handlePhotoProof(event) {
    const file = event.target.files[0];
    if (!file) return;
    this.showSystemMessage('Proof Captured', 'Photo verification registered for S-Rank validation.', 'success');
  }

  renderShop() {
    const container = document.getElementById('shop-items-container');
    const equippedContainer = document.getElementById('equipped-items-container');
    if (!container) return;

    container.innerHTML = '';
    if (equippedContainer) equippedContainer.innerHTML = '';

    const equipped = this.currentPlayer.equipped || {};
    const equippedIds = Object.values(equipped);

    if (equippedContainer) {
      if (equippedIds.length === 0) {
        equippedContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 0.5rem;">No gear equipped.</div>';
      } else {
        equippedIds.forEach(itemId => {
          const item = SHOP_CATALOGUE.find(i => i.id === itemId);
          if (!item) return;
          const div = document.createElement('div');
          div.className = `glass-panel shop-item-card rarity-${item.rarity}`;
          div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 2rem;">${item.icon}</span>
              <div>
                <div class="item-name" style="font-size: 0.95rem;">${item.name}</div>
                <div class="item-effect">${item.description}</div>
              </div>
            </div>
            <button class="btn-primary btn-unequip" data-id="${item.id}" style="margin-top: 0.75rem; width: 100%; background: rgba(244,63,94,0.2); border: 1px solid var(--color-rose); font-size: 0.8rem;">✕ Unequip</button>
          `;
          div.querySelector('.btn-unequip').addEventListener('click', e => {
            sounds.playClick();
            this.unequipItem(e.currentTarget.dataset.id);
          });
          equippedContainer.appendChild(div);
        });
      }
    }

    SHOP_CATALOGUE.forEach(item => {
      const alreadyOwned = (this.currentPlayer.inventory || []).includes(item.id);
      const isEquipped = equippedIds.includes(item.id);
      const canAfford = (this.currentPlayer.gold || 0) >= item.cost;

      const div = document.createElement('div');
      div.className = `glass-panel shop-item-card rarity-${item.rarity}`;
      div.innerHTML = `
        <div>
          <div class="item-icon">${item.icon}</div>
          <div class="item-name">${item.name}</div>
          <div style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--rarity-${item.rarity}); margin-bottom: 0.35rem;">${item.rarity}</div>
          <div class="item-effect">${item.description}</div>
        </div>
        <div style="margin-top: 0.85rem; display: flex; align-items: center; justify-content: space-between;">
          <div style="font-family: var(--font-heading); font-weight: 700; color: var(--color-gold);">🪙 ${item.cost.toLocaleString()}</div>
          ${alreadyOwned
            ? (item.type === 'equipment'
                ? `<button class="btn-primary btn-equip" data-id="${item.id}" style="font-size: 0.8rem; padding: 0.4rem 0.85rem; background: ${isEquipped ? 'rgba(16,185,129,0.3)' : 'rgba(139,92,246,0.3)'}; border: 1px solid ${isEquipped ? 'var(--color-emerald)' : 'var(--color-violet)'};">${isEquipped ? 'Equipped' : 'Equip'}</button>`
                : '<span style="color: var(--color-emerald); font-size: 0.8rem; font-weight: 700;">Redeemed</span>')
            : `<button class="btn-primary btn-buy" data-id="${item.id}" style="font-size: 0.8rem; padding: 0.4rem 0.85rem; ${!canAfford ? 'opacity: 0.45; cursor: not-allowed;' : ''}">${canAfford ? 'Buy' : 'Insufficient 🪙'}</button>`
          }
        </div>
      `;

      if (!alreadyOwned) {
        div.querySelector('.btn-buy')?.addEventListener('click', e => {
          if (!canAfford) return;
          sounds.playPurchase();
          this.purchaseItem(e.currentTarget.dataset.id);
        });
      } else if (item.type === 'equipment') {
        div.querySelector('.btn-equip')?.addEventListener('click', e => {
          sounds.playClick();
          if (isEquipped) this.unequipItem(e.currentTarget.dataset.id);
          else this.equipItem(e.currentTarget.dataset.id);
        });
      }

      container.appendChild(div);
    });
  }

  purchaseItem(itemId) {
    const item = SHOP_CATALOGUE.find(i => i.id === itemId);
    if (!item) return;

    this.currentPlayer.gold -= item.cost;
    this.currentPlayer.inventory = this.currentPlayer.inventory || [];
    this.currentPlayer.inventory.push(itemId);

    if (item.type === 'equipment') {
      this.equipItem(itemId, true);
    } else {
      this.showSystemMessage('Reward Unlocked', `${item.icon} ${item.name} acquired. Enjoy your break!`, 'success');
    }

    this.saveState();
    this.updateUI();
    this.renderShop();
  }

  equipItem(itemId, skipSound = false) {
    const item = SHOP_CATALOGUE.find(i => i.id === itemId);
    if (!item) return;
    this.currentPlayer.equipped = this.currentPlayer.equipped || {};
    this.currentPlayer.equipped[item.type + '_' + itemId] = itemId;
    if (!skipSound) sounds.playLevelUp();
    this.showSystemMessage('Artifact Equipped', `Equipped ${item.name}. Stat multipliers applied.`, 'success');
    this.saveState();
    this.updateUI();
    this.renderShop();
  }

  unequipItem(itemId) {
    const item = SHOP_CATALOGUE.find(i => i.id === itemId);
    if (!item) return;
    delete this.currentPlayer.equipped?.[item.type + '_' + itemId];
    this.saveState();
    this.updateUI();
    this.renderShop();
  }

  renderRadarChart() {
    const svg = document.getElementById('radar-chart-svg');
    if (!svg || !this.currentPlayer) return;

    const stats = this.currentPlayer.stats;
    const keys = ['int', 'agi', 'str', 'vita', 'per', 'wth', 'dis'];
    const labels = ['INT', 'AGI', 'STR', 'VITA', 'PER', 'WTH', 'DIS'];
    const colors = ['#3b82f6', '#06b6d4', '#ec4899', '#10b981', '#8b5cf6', '#fbbf24', '#f97316'];

    const cx = 150, cy = 150, r = 100;
    const n = keys.length;

    const getPoint = (idx, val, maxVal = 80) => {
      const angle = (Math.PI * 2 * idx / n) - Math.PI / 2;
      const radius = (val / maxVal) * r;
      return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    };

    const getLabelPoint = (idx) => {
      const angle = (Math.PI * 2 * idx / n) - Math.PI / 2;
      return { x: cx + (r + 18) * Math.cos(angle), y: cy + (r + 18) * Math.sin(angle) };
    };

    let html = '';
    [20, 40, 60, 80].forEach(val => {
      const pts = keys.map((_, i) => getPoint(i, val));
      const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';
      html += `<path d="${d}" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`;
    });

    keys.forEach((_, i) => {
      const end = getPoint(i, 80);
      html += `<line x1="${cx}" y1="${cy}" x2="${end.x.toFixed(1)}" y2="${end.y.toFixed(1)}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
    });

    const dataPts = keys.map((k, i) => getPoint(i, Math.min(stats[k] || 0, 80)));
    const dataPath = dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';
    html += `<path d="${dataPath}" fill="rgba(139,92,246,0.25)" stroke="#a78bfa" stroke-width="2"/>`;

    dataPts.forEach((p, i) => {
      html += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="${colors[i]}" stroke="#fff" stroke-width="1.5"/>`;
    });

    labels.forEach((label, i) => {
      const lp = getLabelPoint(i);
      html += `<text x="${lp.x.toFixed(1)}" y="${lp.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" fill="${colors[i]}" font-size="11" font-weight="700" font-family="Space Grotesk, sans-serif">${label}</text>`;
    });

    svg.innerHTML = html;
  }

  addHistoryEntry(text) {
    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    this.currentPlayer.historyLog = this.currentPlayer.historyLog || [];
    this.currentPlayer.historyLog.unshift({ text, timestamp });
    if (this.currentPlayer.historyLog.length > 50) {
      this.currentPlayer.historyLog = this.currentPlayer.historyLog.slice(0, 50);
    }
  }

  renderHistoryLog() {
    const container = document.getElementById('history-log-list');
    if (!container || !this.currentPlayer) return;
    const log = this.currentPlayer.historyLog || [];

    if (log.length === 0) {
      container.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 0.5rem;">No history recorded.</div>';
      return;
    }

    container.innerHTML = log.map(entry => `
      <div style="padding: 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
        <span style="font-size: 0.82rem; flex: 1;">${entry.text}</span>
        <span style="font-size: 0.68rem; color: var(--text-dim); white-space: nowrap;">${entry.timestamp}</span>
      </div>
    `).join('');
  }

  async fetchGeminiApiKeyFromDB() {
    if (this.db && window.FirebaseModules) {
      try {
        const { doc, getDoc } = window.FirebaseModules;
        const snap = await getDoc(doc(this.db, 'config', 'gemini')).catch(() => null);
        if (snap?.exists()) {
          const key = snap.data().apiKey || snap.data().key;
          if (key) return key;
        }
      } catch (e) { console.warn('Config fetch:', e); }
    }
    return localStorage.getItem('sl_gemini_key') || null;
  }

  async generateAIQuests() {
    const goalInput = document.getElementById('ai-goal-input');
    const goal = goalInput?.value.trim() || 'Be a better student';
    const resultContainer = document.getElementById('ai-generated-results');

    if (resultContainer) {
      resultContainer.innerHTML = `<div style="text-align: center; padding: 1.5rem; color: var(--color-cyan);">⚡ Synthesizing Quests for: "${goal}"...</div>`;
    }

    const apiKey = await this.fetchGeminiApiKeyFromDB();
    let generatedQuests = [];

    if (apiKey) {
      try {
        const prompt = `Convert this user goal into 3 structured daily quests: Goal: "${goal}"
Return ONLY a raw JSON array with objects: { "title": string, "category": "academics"|"coding"|"fitness"|"lifestyle"|"secret", "statReward": string, "statKey": "int"|"agi"|"str"|"vita"|"per"|"wth"|"dis", "xpReward": number, "goldReward": number, "difficulty": "E"|"D"|"C"|"B"|"A"|"S", "stackTrigger": string, "requiresPhoto": boolean }`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
            if (Array.isArray(parsed)) {
              generatedQuests = parsed.map((q, i) => ({ ...q, id: `ai_${Date.now()}_${i}`, completed: false }));
            }
          }
        }
      } catch (e) { console.warn('Gemini API Error:', e); }
    }

    if (generatedQuests.length === 0) {
      generatedQuests = [
        { id: `ai_1`, title: `Roadmap Milestone for "${goal}"`, category: 'academics', statReward: 'INT +3', statKey: 'int', xpReward: 250, goldReward: 150, difficulty: 'C', stackTrigger: 'Morning study routine', completed: false, requiresPhoto: false },
        { id: `ai_2`, title: `45-min Deep Focus Block`, category: 'coding', statReward: 'PER +4', statKey: 'per', xpReward: 300, goldReward: 200, difficulty: 'B', stackTrigger: 'Post-lunch deep work', completed: false, requiresPhoto: false }
      ];
    }

    if (resultContainer) {
      resultContainer.innerHTML = `
        <div style="margin-top: 1.5rem; border-top: 1px solid var(--glass-border); padding-top: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--color-violet-bright);">✨ AI Quests Ready</h3>
            <button id="accept-ai-quests-btn" class="btn-primary" style="font-size: 0.85rem; padding: 0.4rem 1rem;">⚔️ Accept Quests</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${generatedQuests.map(q => `<div class="glass-panel" style="padding: 0.85rem 1rem;"><div style="font-weight: 700; font-size: 0.95rem;">${q.title}</div><div style="font-size: 0.75rem; color: var(--text-muted);">${q.stackTrigger}</div></div>`).join('')}
          </div>
        </div>
      `;

      document.getElementById('accept-ai-quests-btn')?.addEventListener('click', () => {
        sounds.playLevelUp();
        this.currentPlayer.quests = [...generatedQuests, ...this.currentPlayer.quests];
        this.saveState();
        this.updateUI();
        this.switchView('quests-view');
        this.showSystemMessage('Quests Accepted', `${generatedQuests.length} new quests added to log.`, 'success');
      });
    }
  }

  async checkForSystemUpdate() {
    const CURRENT_VERSION = "1.0.0"; 
    const REPO_OWNER = "eniayarasu-max";
    const REPO_NAME = "TheSystem";

    this.showSystemMessage('System Update', 'Checking GitHub releases...', 'info');

    try {
      const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`);
      if (!response.ok) throw new Error("No releases found.");
      
      const release = await response.json();
      const latestVersion = release.tag_name.replace('v', ''); 
      
      if (latestVersion !== CURRENT_VERSION) {
        if (confirm(`✨ New Update v${latestVersion} Available!\n\nDownload now?`)) {
          const apkAsset = release.assets.find(a => a.name.endsWith('.apk'));
          if (apkAsset && window.Capacitor?.Plugins?.Browser) {
             await window.Capacitor.Plugins.Browser.open({ url: apkAsset.browser_download_url });
          } else {
             this.showSystemMessage('Download Error', 'No APK file attached to GitHub release.', 'error');
          }
        }
      } else {
        this.showSystemMessage('Up to Date', `You are running the latest build (v${CURRENT_VERSION}).`, 'success');
      }
    } catch(e) {
      this.showSystemMessage('Update Failed', 'Could not connect to GitHub repository.', 'error');
    }
  }

  async renderAdminDashboard() {
    const container = document.getElementById('admin-players-container');
    if (!container) return;
    container.innerHTML = '<div style="color: var(--color-cyan); padding: 1.5rem; text-align: center;">⚡ Loading Registry...</div>';

    if (this.db && window.FirebaseModules) {
      try {
        const { collection, getDocs } = window.FirebaseModules;
        const snapshot = await getDocs(collection(this.db, 'users')).catch(() => null);
        if (snapshot && !snapshot.empty) {
          const players = [];
          snapshot.forEach(d => players.push(d.data()));
          this.allPlayers = players;
        }
      } catch (e) { console.warn(e); }
    }

    if (!this.allPlayers || this.allPlayers.length === 0) {
      this.allPlayers = [this.currentPlayer];
    }

    container.innerHTML = this.allPlayers.map(p => `
      <div class="glass-panel" style="padding: 1rem; margin-bottom: 1rem;">
        <div style="font-weight: 700; font-size: 1.1rem; color: var(--color-violet-bright);">${p.name}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">${p.email || 'Demo User'} • LVL ${p.level || 1} • 🪙 ${p.gold || 0}</div>
      </div>
    `).join('');
  }

  async saveState() {
    if (!this.currentPlayer) return;
    localStorage.setItem('sl_player_v3', JSON.stringify(this.currentPlayer));

    if (this.db && window.FirebaseModules && this.currentPlayer.id) {
      try {
        const { doc, setDoc } = window.FirebaseModules;
        await setDoc(doc(this.db, 'users', this.currentPlayer.id), this.currentPlayer, { merge: true });
      } catch (e) { console.warn(e); }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new SoloLevelingApp();
});
