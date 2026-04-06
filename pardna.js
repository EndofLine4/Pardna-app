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

document.getElementById('rev-slider').addEventListener('input', function () {
  const revenue     = parseInt(this.value);
  const contribution = Math.round(revenue * 0.03);
  const annualTotal  = contribution * 12;

  document.getElementById('rev-display').textContent  = '$' + revenue.toLocaleString();
  document.getElementById('contrib-out').textContent  = '$' + contribution.toLocaleString();
  document.getElementById('yr-total').textContent     = '$' + annualTotal.toLocaleString();
  document.getElementById('max-draw-disp').textContent = '$' + revenue.toLocaleString();
});

/* ── Apply for Funds Slider ── */

document.getElementById('draw-slider').addEventListener('input', function () {
  const amount        = parseInt(this.value);
  const monthlyContrib = 252; // Keisha's current monthly contribution
  const offsetMonths  = Math.ceil(amount / monthlyContrib);

  document.getElementById('draw-display').textContent = '$' + amount.toLocaleString();
  document.getElementById('sum-amt').textContent      = '$' + amount.toLocaleString();
  document.getElementById('sum-months').textContent   = '~' + offsetMonths + ' months';
});

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
