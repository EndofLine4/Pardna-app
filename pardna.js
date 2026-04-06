/* ============================================================
   PARDNA — Community Lending Circle
   JavaScript · pardna.js
   ============================================================ */

/* ── Page Navigation ── */

/**
 * showPage — switches between the landing page and the app shell.
 * @param {string} id  'landing' or 'app'
 */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  window.scrollTo(0, 0);
}

/* ── Auth: Login ── */

function openLogin() {
  document.getElementById('login-modal').classList.add('show');
}

function closeLogin() {
  document.getElementById('login-modal').classList.remove('show');
}

/**
 * doLogin — simulates a successful login/signup.
 * Hides the logged-out header buttons, shows the user dropdown,
 * switches to the app shell, activates the dashboard tab,
 * and starts the countdown timer.
 */
function doLogin() {
  closeLogin();
  closeSignup();
  document.getElementById('hdr-out').style.display = 'none';
  document.getElementById('hdr-in').style.display  = 'flex';
  showPage('app');
  appTab('dashboard');
  startTimer();
}

/* ── Demo / Mock Google Sign-In Handlers ── */

const DEMO_EMAIL = 'me@email.com';
const DEMO_PASS  = 'smallbiz';

function handleLogin() {
  const elE = document.getElementById('login-email');
  const elP = document.getElementById('login-pass');
  const out = document.getElementById('login-error');
  const email = elE ? elE.value.trim() : '';
  const pass  = elP ? elP.value : '';

  if (email === DEMO_EMAIL && pass === DEMO_PASS) {
    out.style.display = 'none';
    doLogin();
    return;
  }

  // Allow empty fields to proceed as a demo shortcut
  if (!email && !pass) {
    // autofill and sign in as demo for convenience
    autofillDemo();
    setTimeout(doLogin, 250);
    return;
  }

  // Otherwise show a gentle error explaining the demo account
  if (out) {
    out.textContent = 'Invalid credentials. For testing use me@email.com / smallbiz or click "Use demo account".';
    out.style.display = 'block';
  } else {
    alert('Invalid credentials. For testing use demo: me@email.com / smallbiz');
  }
}

function mockGoogleSignIn() {
  // Simulate an OAuth popup and then sign in as the demo account.
  autofillDemo();
  // small delay to mimic external auth
  setTimeout(() => {
    doLogin();
  }, 350);
}

function autofillDemo() {
  const elE = document.getElementById('login-email');
  const elP = document.getElementById('login-pass');
  if (elE) elE.value = DEMO_EMAIL;
  if (elP) elP.value = DEMO_PASS;
  const out = document.getElementById('login-error');
  if (out) out.style.display = 'none';
}

/* ── Auth: Signup ── */

function openSignup() {
  document.getElementById('signup-modal').classList.add('show');
  suNext(1); // Always start on step 1
}

function closeSignup() {
  document.getElementById('signup-modal').classList.remove('show');
}

/**
 * suNext — advances (or retreats) to a signup step.
 * Updates the step dots, heading text, and step label.
 * @param {number} n  1 | 2 | 3
 */
function suNext(n) {
  const titles = [
    'Tell us about your business',
    'Verify your identity',
    'Welcome to the circle'
  ];
  const labels = ['Step 1 of 3', 'Step 2 of 3', "You're approved!"];

  [1, 2, 3].forEach(i => {
    document.getElementById('su-s' + i).style.display = (i === n) ? 'block' : 'none';
    document.getElementById('sd' + i).className = 'step-dot' + (i <= n ? ' done' : '');
  });

  document.getElementById('su-title').textContent = titles[n - 1];
  document.getElementById('su-lbl').textContent   = labels[n - 1];
}

/* ── Sign Out ── */

function signOut() {
  document.getElementById('hdr-out').style.display = 'flex';
  document.getElementById('hdr-in').style.display  = 'none';
  showPage('landing');
  closeUserMenu();
}

/* ── User Dropdown Menu ── */

function toggleUserMenu() {
  document.getElementById('userMenu').classList.toggle('open');
}

function closeUserMenu() {
  document.getElementById('userMenu').classList.remove('open');
}

// Close the dropdown when clicking anywhere outside it
document.addEventListener('click', function (e) {
  const menu = document.getElementById('userMenu');
  if (menu && !menu.contains(e.target)) {
    closeUserMenu();
  }
});

/* ── App Tab Navigation ── */

/**
 * appTab — switches between the five app sections.
 * @param {string} name  'dashboard' | 'pool' | 'apply' | 'score' | 'howit'
 */
function appTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('tb-' + name).classList.add('active');
  document.getElementById('tc-' + name).classList.add('active');
  window.scrollTo(0, 0);
}

/* ── Countdown Timer ── */

/**
 * startTimer — starts a live countdown to the 1st of next month
 * (i.e. the next contribution auto-process date).
 * Updates every second.
 */
function startTimer() {
  function tick() {
    const now  = new Date();
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
    const diff = next - now;

    if (diff <= 0) { tick(); return; }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000)  / 60000);
    const seconds = Math.floor((diff % 60000)    / 1000);

    const pad = n => String(n).padStart(2, '0');

    document.getElementById('t-d').textContent = pad(days);
    document.getElementById('t-h').textContent = pad(hours);
    document.getElementById('t-m').textContent = pad(minutes);
    document.getElementById('t-s').textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
}

/* ── Revenue / Contribution Slider ── */

const revSlider = document.getElementById('rev-slider');
if (revSlider) {
  revSlider.addEventListener('input', function () {
    const revenue      = parseInt(this.value);
    const contribution = Math.round(revenue * 0.03);
    const annualTotal  = contribution * 12;

    document.getElementById('rev-display').textContent   = '$' + revenue.toLocaleString();
    document.getElementById('contrib-out').textContent   = '$' + contribution.toLocaleString();
    document.getElementById('yr-total').textContent      = '$' + annualTotal.toLocaleString();
    document.getElementById('max-draw-disp').textContent = '$' + revenue.toLocaleString();
  });
}

/* ── Apply for Funds Slider ── */

const drawSlider = document.getElementById('draw-slider');
if (drawSlider) {
  drawSlider.addEventListener('input', function () {
    const amount         = parseInt(this.value);
    const monthlyContrib = 252; // Keisha's current monthly contribution
    const offsetMonths   = Math.ceil(amount / monthlyContrib);

    document.getElementById('draw-display').textContent = '$' + amount.toLocaleString();
    document.getElementById('sum-amt').textContent      = '$' + amount.toLocaleString();
    document.getElementById('sum-months').textContent   = '~' + offsetMonths + ' months';
  });
}

/* ── Apply for Funds: Submit ── */

function submitApply() {
  const amount = parseInt(document.getElementById('draw-slider').value);
  const msg = 'Your application for $' + amount.toLocaleString() +
    ' has been submitted to the Food & Hospitality Circle. ' +
    'Funds are typically available within 24 hours. ' +
    'Your contributions continue as normal — that is your repayment. ' +
    'No bill. No schedule. Just your circle.';

  document.getElementById('suc-body').textContent = msg;
  document.getElementById('suc-overlay').classList.add('show');
}

function closeSuc() {
  document.getElementById('suc-overlay').classList.remove('show');
  appTab('dashboard');
}

/* ── Pool Industry Selector ── */

function pickPool(el) {
  document.querySelectorAll('.pool-opt').forEach(p => p.classList.remove('sel'));
  el.classList.add('sel');
}

/* ── Tradition Tooltip Interactions ── */
const _tradInfo = {
  susu: {
    title: 'Susu — West Africa & Caribbean',
    emoji: '🪙',
    body: 'A rotating savings system where members contribute fixed amounts and take turns receiving the pooled funds. It builds trust and mutual credit without banks.'
  },
  pardna: {
    title: 'Pardna — Jamaica',
    emoji: '🇯🇲',
    body: 'Local groups pool regular contributions; members access the pot on a rotating basis to fund businesses, household needs, or celebrations.'
  },
  tanda: {
    title: 'Tanda — Mexico & Latin America',
    emoji: '🔁',
    body: 'Known as tanda, it lets community members borrow from a shared pot in turn — providing predictable access to cash without formal credit.'
  },
  hui: {
    title: 'Hui — China',
    emoji: '🏮',
    body: 'A community-based savings and lending group where pooled funds help members make larger purchases or smooth income cycles.'
  },
  chit: {
    title: 'Chit Fund — India',
    emoji: '📿',
    body: 'Organized savings where contributors bid or draw the pooled amount; used widely for business capital and major household expenses.'
  },
  stokvel: {
    title: 'Stokvel — South Africa',
    emoji: '🌍',
    body: 'Rotating and savings clubs that support members with lump sums for business, events, or emergencies; deeply social and trust-based.'
  },
  paluwagan: {
    title: 'Paluwagan — Philippines',
    emoji: '🌴',
    body: 'An informal rotating savings system where community members contribute and receive pooled funds on a schedule to meet needs.'
  },
  hagbad: {
    title: 'Hagbad — Somalia',
    emoji: '🤝',
    body: 'Community lending circles that provide liquidity and mutual support, often in places with limited formal banking access.'
  }
};

function initTradTooltips() {
  const tooltip = document.getElementById('trad-tooltip');
  if (!tooltip) return;
  const pills = document.querySelectorAll('.trad-pill[data-key]');

  pills.forEach(p => {
    p.addEventListener('click', (e) => showTradTooltip(p.dataset.key, p));
    p.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showTradTooltip(p.dataset.key, p); }
    });
  });

  tooltip.querySelector('.trad-tooltip__close')?.addEventListener('click', closeTradTooltip);

  // Close when clicking outside or pressing Escape
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.trad-tooltip') && !e.target.closest('.trad-pill')) {
      closeTradTooltip();
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTradTooltip(); });
}

function showTradTooltip(key, anchorEl) {
  const info = _tradInfo[key];
  const tooltip = document.getElementById('trad-tooltip');
  if (!info || !tooltip) return;

  tooltip.querySelector('.trad-tooltip__img').textContent = info.emoji;
  tooltip.querySelector('.trad-tooltip__title').textContent = info.title;
  tooltip.querySelector('.trad-tooltip__body').textContent = info.body;

  tooltip.setAttribute('aria-hidden', 'false');
  tooltip.classList.add('open');

  // Position tooltip above the anchor when possible, otherwise below
  const rect = anchorEl.getBoundingClientRect();
  const ttW = tooltip.offsetWidth;
  const ttH = tooltip.offsetHeight;

  const pad = 10;
  let left = rect.left + rect.width / 2 - ttW / 2 + window.scrollX;
  left = Math.max(pad + window.scrollX, Math.min(left, window.innerWidth - ttW - pad + window.scrollX));

  let top = rect.top - ttH - 12 + window.scrollY;
  if (top < 8 + window.scrollY) {
    top = rect.bottom + 12 + window.scrollY;
  }

  tooltip.style.left = left + 'px';
  tooltip.style.top  = top + 'px';

  // Make tooltip focusable for accessibility and move focus to it
  tooltip.setAttribute('tabindex', '-1');
  tooltip.focus();
}

function closeTradTooltip() {
  const tooltip = document.getElementById('trad-tooltip');
  if (!tooltip) return;
  tooltip.classList.remove('open');
  tooltip.setAttribute('aria-hidden', 'true');
  tooltip.style.left = '';
  tooltip.style.top  = '';
}

// Initialize after DOM ready
document.addEventListener('DOMContentLoaded', initTradTooltips);

/* ── Tips page interactions ── */
function initTipsPage() {
  // Quick actions checklist progress
  const checks = Array.from(document.querySelectorAll('.quick-list input[type=checkbox]'));
  const prog = document.getElementById('qa-progress');
  if (checks.length && prog) {
    const update = () => {
      const done = checks.filter(c => c.checked).length;
      const pct = Math.round((done / checks.length) * 100);
      prog.style.width = pct + '%';
    };
    checks.forEach(c => c.addEventListener('change', update));
    update();
  }

  // Buffer select (dropdown)
  const select = document.getElementById('buffer-select');
  const months = document.getElementById('buffer-months');
  const sugg = document.getElementById('buffer-suggestion');
  if (select && months && sugg) {
    const updateBuffer = () => {
      const m = Number(select.value);
      months.textContent = m;
      sugg.textContent = `If your monthly expenses are $2,000, ${m} month${m===1? '':'s'} = $${(2000*m).toLocaleString()}. Automate a small transfer each payday.`;
    };
    select.addEventListener('change', updateBuffer);
    updateBuffer();
  }

  // Accordion
  const heads = Array.from(document.querySelectorAll('.accordion .acc-head'));
  heads.forEach(h => {
    h.addEventListener('click', () => {
      const open = h.classList.toggle('open');
      // close siblings
      heads.forEach(s => { if (s !== h) s.classList.remove('open'); });
    });
  });
}

// Initialize tips interactions if tips page is present
document.addEventListener('DOMContentLoaded', function () {
  // small delay to ensure elements from static pages are parsed
  setTimeout(initTipsPage, 12);
  setTimeout(initDailyFinanceVideo, 16);
});

/* Daily finance video feature */
const DAILY_FINANCE_VIDEOS = [
  {
    id: '6x1maK6MbNQ',
    title: 'Financial Planning for Small Business Owners',
    copy: 'This featured video is now the default lesson, focused on building a stronger plan for cash flow, growth, and financial stability.',
    keyword: 'financial planning for small business',
    tags: ['financial planning', 'small business', 'cash flow', 'strategy']
  },
  {
    id: '7bWxX1tr2mc',
    title: 'Cash Flow Basics for Small Business Owners',
    copy: 'Learn how to track what is coming in, what is going out, and how to avoid shortfalls before they become emergencies.',
    keyword: 'cash flow tips for small business',
    tags: ['cash flow', 'planning', 'money management']
  },
  {
    id: 'BLrEcUEcsow',
    title: 'Beginner Bookkeeping Tips',
    copy: 'A practical intro to organizing expenses, separating accounts, and making your records easier to manage every month.',
    keyword: 'bookkeeping for beginners small business',
    tags: ['bookkeeping', 'records', 'expenses']
  },
  {
    id: 'HQzoZfc3GwQ',
    title: 'Pricing Your Products Profitably',
    copy: 'Helpful reminders on pricing with your time, materials, margin, and future growth in mind.',
    keyword: 'pricing strategy for small business',
    tags: ['pricing', 'profit', 'sales']
  },
  {
    id: 'MKSjS9U2r_8',
    title: 'Budgeting Habits That Actually Stick',
    copy: 'Simple habits to build a real business budget without turning it into a full-time job.',
    keyword: 'small business budgeting tips',
    tags: ['budgeting', 'planning', 'habits']
  },
  {
    id: 'mR9m8H0f2N4',
    title: 'How to Build a Business Emergency Fund',
    copy: 'Start small, stay consistent, and create a reserve that helps you breathe during slow weeks or surprise expenses.',
    keyword: 'small business emergency fund tips',
    tags: ['emergency fund', 'savings', 'resilience']
  },
  {
    id: '5MgBikgcWnY',
    title: 'Smart Small Business Budgeting',
    copy: 'A clean overview of how to map out monthly spending and keep more of what your business earns.',
    keyword: 'small business monthly budget help',
    tags: ['budgeting', 'monthly', 'spending']
  },
  {
    id: 'TQMbvJNRpLE',
    title: 'Understanding Profit vs Cash',
    copy: 'A helpful reminder that being profitable and having cash on hand are not always the same thing.',
    keyword: 'profit vs cash flow small business',
    tags: ['profit', 'cash flow', 'founder basics']
  }
];

const VIDEO_SEARCH_GROUPS = {
  'cash': ['6x1maK6MbNQ', '7bWxX1tr2mc', 'TQMbvJNRpLE'],
  'flow': ['7bWxX1tr2mc', 'TQMbvJNRpLE', '6x1maK6MbNQ'],
  'budget': ['MKSjS9U2r_8', '5MgBikgcWnY', '6x1maK6MbNQ'],
  'planning': ['6x1maK6MbNQ', 'MKSjS9U2r_8', '5MgBikgcWnY'],
  'bookkeeping': ['BLrEcUEcsow', '6x1maK6MbNQ', '5MgBikgcWnY'],
  'pricing': ['HQzoZfc3GwQ', 'TQMbvJNRpLE', '6x1maK6MbNQ'],
  'profit': ['TQMbvJNRpLE', 'HQzoZfc3GwQ', '7bWxX1tr2mc'],
  'invoice': ['6x1maK6MbNQ', '7bWxX1tr2mc', 'BLrEcUEcsow'],
  'emergency': ['mR9m8H0f2N4', '6x1maK6MbNQ', 'MKSjS9U2r_8'],
  'savings': ['mR9m8H0f2N4', '5MgBikgcWnY', '6x1maK6MbNQ']
};

let currentFinanceVideo = null;

function loadFinanceVideo(video, autoplay = false) {
  const iframe = document.getElementById('tips-video');
  const title = document.getElementById('daily-video-title');
  const copy = document.getElementById('daily-video-copy');
  const placeholder = document.getElementById('video-placeholder');
  const thumb = document.getElementById('video-placeholder-thumb');
  const placeholderTitle = document.querySelector('.video-placeholder__title');
  const placeholderText = document.querySelector('.video-placeholder__text');
  if (!iframe || !title || !copy || !video) return;

  currentFinanceVideo = video;
  title.textContent = video.title;
  copy.textContent = video.copy;

  if (thumb) {
    thumb.src = 'https://img.youtube.com/vi/' + video.id + '/hqdefault.jpg';
    thumb.alt = video.title + ' thumbnail';
  }
  if (placeholderTitle) placeholderTitle.textContent = video.title;
  if (placeholderText) placeholderText.textContent = 'Click to play this video right here on the page.';

  if (autoplay) {
    playFeaturedVideo();
  } else {
    iframe.src = '';
    iframe.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
  }
}

function playFeaturedVideo() {
  const iframe = document.getElementById('tips-video');
  const placeholder = document.getElementById('video-placeholder');
  if (!iframe || !currentFinanceVideo) return;

  iframe.src = 'https://www.youtube-nocookie.com/embed/' + currentFinanceVideo.id + '?autoplay=1&rel=0&modestbranding=1';
  iframe.style.display = 'block';
  if (placeholder) placeholder.style.display = 'none';
}

function renderVideoResults(query = '') {
  const resultsEl = document.getElementById('video-results');
  const labelEl = document.getElementById('video-results-label');
  if (!resultsEl) return;

  const normalized = query.toLowerCase().trim();
  const matchedIds = Object.keys(VIDEO_SEARCH_GROUPS)
    .filter(key => normalized.includes(key))
    .flatMap(key => VIDEO_SEARCH_GROUPS[key]);

  let picks = [];
  if (matchedIds.length) {
    const uniqueIds = [...new Set(matchedIds)].slice(0, 3);
    picks = uniqueIds
      .map(id => DAILY_FINANCE_VIDEOS.find(video => video.id === id))
      .filter(Boolean);
  } else {
    const terms = normalized.split(/\s+/).filter(Boolean);
    const scored = DAILY_FINANCE_VIDEOS.map(video => {
      const haystack = `${video.title} ${video.copy} ${video.keyword} ${(video.tags || []).join(' ')}`.toLowerCase();
      const score = terms.length
        ? terms.reduce((sum, term) => sum + (haystack.includes(term) ? 2 : 0), 0)
        : 1;
      return { video, score };
    }).sort((a, b) => b.score - a.score);

    picks = scored.filter(item => item.score > 0).slice(0, 3).map(item => item.video);
  }

  if (!picks.length) picks = DAILY_FINANCE_VIDEOS.slice(0, 3);

  if (labelEl) {
    labelEl.textContent = normalized
      ? `Showing 3 curated results for “${query}”`
      : 'Showing 3 curated picks';
  }

  resultsEl.innerHTML = picks.map(video => `
    <div class="video-result-card">
      <img class="video-result-thumb" src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="${video.title} thumbnail" loading="lazy">
      <div class="video-result-kicker">Curated pick</div>
      <div class="video-result-title">${video.title}</div>
      <div class="video-result-desc">${video.copy}</div>
      <button class="video-result-btn" type="button" data-video-id="${video.id}">Watch here</button>
    </div>
  `).join('');

  resultsEl.querySelectorAll('.video-result-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = DAILY_FINANCE_VIDEOS.find(v => v.id === btn.dataset.videoId);
      loadFinanceVideo(selected, true);
    });
  });

  return picks;
}

function initDailyFinanceVideo() {
  const search = document.getElementById('yt-search');
  if (!document.getElementById('tips-video')) return;

  const featuredVideo = DAILY_FINANCE_VIDEOS[0];
  loadFinanceVideo(featuredVideo, false);
  if (search && !search.value) search.value = featuredVideo.keyword;
  renderVideoResults(search ? search.value : featuredVideo.keyword);

  if (search) {
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchYouTube();
      }
    });
  }
}

/* Video loader + YouTube search */
function loadVideoFromInput() {
  const url = document.getElementById('video-url')?.value.trim();
  const iframe = document.getElementById('tips-video');
  if (!iframe) return;
  if (!url) {
    initDailyFinanceVideo();
    return;
  }

  // Normalize common YouTube URL formats to embed URL
  let id = '';
  try {
    const u = new URL(url.startsWith('http') ? url : 'https://' + url);
    if (u.hostname.includes('youtube.com')) id = u.searchParams.get('v') || '';
    if (u.hostname.includes('youtu.be')) id = u.pathname.slice(1);
  } catch (e) {
    const m = url.match(/v=([\w-]{6,})/);
    if (m) id = m[1];
  }

  if (id) {
    const customVideo = {
      id,
      title: 'Selected YouTube Video',
      copy: 'Playing your selected finance video in the page.',
      keyword: 'custom video',
      tags: ['custom']
    };
    loadFinanceVideo(customVideo, true);
  } else {
    window.open(url, '_blank');
  }
}

function useVideoKeyword(keyword) {
  const input = document.getElementById('yt-search');
  if (!input) return;
  input.value = keyword;
  input.focus();
  renderVideoResults(keyword);
}

function searchYouTube() {
  const query = document.getElementById('yt-search')?.value || 'small business finance tips';
  const picks = renderVideoResults(query);
  if (picks && picks[0]) {
    loadFinanceVideo(picks[0]);
  }
}
