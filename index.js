/* ══════════════════════════════════════════════════════
   index.js — complete script for Philemon's portfolio
   Includes: cursor, nav, reveal, strip/cap toggles,
   filter, project data, overlay open/close,
   per-panel image carousels, read-more/less, CV modal.
══════════════════════════════════════════════════════ */

/* ── CURSOR ── */
const cur = document.getElementById('cur'), ring = document.getElementById('cur-r');
let mx = -100, my = -100, rx = -100, ry = -100;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
(function loop() {
  rx += (mx - rx) * .1; ry += (my - ry) * .1;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button,.proj-card,.pstrip-header,.cap-trigger,.vd,.domain-chip').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('big'));
  el.addEventListener('mouseleave', () => ring.classList.remove('big'));
});

/* ── NAV BLEND ── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').style.mixBlendMode = scrollY > window.innerHeight * .9 ? 'normal' : 'difference';
});

/* ── REVEAL ── */
const obs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('vis');
}), { threshold: .07 });
document.querySelectorAll('.rev').forEach(el => obs.observe(el));

/* ── STRIP TOGGLE ── */
function toggleStrip(id) {
  const el = document.getElementById(id), was = el.classList.contains('open');
  document.querySelectorAll('.pstrip-col').forEach(c => c.classList.remove('open'));
  if (!was) el.classList.add('open');
}

/* ── CAP TOGGLE ── */
function toggleCap(id) { document.getElementById(id).classList.toggle('open'); }

/* ── FILTER ── */
function filt(btn, cat) {
  document.querySelectorAll('.fb').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.proj-card').forEach(c => {
    c.classList.toggle('hid', cat !== 'all' && !c.dataset.c.includes(cat));
  });
}

/* ══════════════════════════════════════════════════════
   PROJECT DATA
══════════════════════════════════════════════════════ */

const THEMES = {
  argus: { bg: 'linear-gradient(135deg,#080e12,#0e2030)', badge: 'bp-proto',   badgeTxt: 'Prototype' },
  pikk:  { bg: 'linear-gradient(135deg,#0c0615,#1a0e28)', badge: 'bp-proto',   badgeTxt: 'Prototype' },
  vtol:  { bg: 'linear-gradient(135deg,#090c14,#101528)', badge: 'bp-concept', badgeTxt: 'Concept'   },
};

/* Per-project, per-panel image arrays.
   Add more paths to any array — carousel arrows appear automatically. */
const GALLERIES = {
  argus: {
    hero:  ['resources/argus.png'],
    feat1: ['resources/t.png', 'resources/1.jpg', 'resources/0.png'],
    feat2: ['resources/arguspcb.png', 'resources/22.png', 'resources/2.png', 'resources/5.png'],
  },
  pikk: {
    hero:  ['resources/arm.png'],
    feat1: ['resources/robot.jpg'],
    feat2: ['resources/3d.png'],
  },
  vtol: {
    hero:  ['resources/vtol.png'],
    feat1: ['resources/drone.jpg'],
    feat2: ['resources/vtolsk.png', 'resources/vtola.png', 'resources/vtoll.png'],
  },
};

const PD = {
  argus: {
    t: 'Argus Bot', label: 'INDUSTRIAL INSPECTION · PROTOTYPE', bgw: 'ARGUS',
    tags: ['ROS', 'Thermal Vision', 'Gas Detection', 'SLAM', 'C++'],
    meta: [{ l: 'Type', v: 'Ground-Mobile Robot' }, { l: 'Stack', v: 'ROS · OpenCV · C++' }, { l: 'Status', v: 'Active Prototype' }],
    prob:  'Industrial environments — power plants, refineries, chemical facilities — require continuous inspection for gas leaks and thermal anomalies. Manual inspection in hazardous zones is operationally expensive and presents serious safety risks to personnel.',
    prob2: 'Existing solutions rely on periodic human walkthroughs with handheld detectors — a model that creates inspection blind-spots between rounds and exposes workers to short-duration high-concentration events. A continuously deployed mobile platform eliminates both risks while providing a persistent, geo-tagged inspection record.',
    arch:  'Ground-mobile ROS-based platform with differential drive. Sensor array includes MQ-series gas detectors and a FLIR thermal camera module. Full autonomous navigation via SLAM mapping and Navigation Stack path planning. Wireless telemetry enables remote supervision from a safe distance.',
    arch2: 'The navigation layer uses GMapping for incremental map building and move_base for obstacle-aware path planning. The thermal camera feeds a custom OpenCV pipeline that isolates hotspot regions by deviation from ambient baseline, then correlates spatial coordinates with the live occupancy grid to produce annotated anomaly reports. All sensor events are timestamped and streamed over LoRa to a remote operator dashboard with configurable alert thresholds.',
    hw: ['Differential drive chassis', 'MQ-series gas sensor array', 'FLIR thermal camera module', 'RPLiDAR A1 (mapping + obstacle avoidance)', 'Onboard compute unit (Raspberry Pi)', 'Custom motor driver PCB', 'Wireless telemetry module (LoRa)'],
    sw: ['ROS Noetic (navigation + sensor fusion)', 'SLAM (GMapping / Cartographer)', 'OpenCV (thermal frame analysis)', 'Python (sensor data processing)', 'C++ (low-level hardware control)'],
    ch: 'Gas sensor calibration across variable thermal environments introduced significant signal drift that required per-sensor polynomial correction models. Integrating thermal imaging data with spatial SLAM maps for contextual anomaly reporting required custom ROS node development. Real-time wireless streaming to the remote station targets sub-100ms latency, which demands careful QoS tuning on the communication stack.',
    st: 'Physical prototype in active development. Navigation stack fully validated in Gazebo simulation. Gas detection subsystem assembled and under calibration.',
    gh: 'https://github.com/Phil-obed/Argus-bot.git',
  },

  pikk: {
    t: 'Pikk A1', label: 'SIX-AXIS ROBOTIC ARM · PROTOTYPE', bgw: 'PIKK',
    tags: ['Fusion 360', 'RoboDK', 'NEMA 17', 'PCB Design', 'Embedded C'],
    meta: [{ l: 'Type', v: '6-DOF Serial Manipulator' }, { l: 'Stack', v: 'Fusion 360 · RoboDK · Embedded C' }, { l: 'Status', v: 'In Development' }],
    prob:  'Industrial robotic arms are cost-prohibitive for small-scale automation research and education. This project validates a full 6-DOF arm designed from first principles — testing mechanical choices, workspace analysis, and embedded control through a physical build rather than simulation alone.',
    prob2: 'The project also serves as a hardware test-bed for the ePikk venture — validating mechanical and control decisions before committing to a production design. Building from scratch forces every tolerance, motor selection, and link length to be explicitly justified rather than inherited from a reference design.',
    arch:  'Six-axis serial manipulator with NEMA 17 stepper motors for positional accuracy. Full mechanical CAD in Fusion 360 with joint stress analysis at each link. Workspace and reachability validated in RoboDK before any fabrication began. Custom multi-axis motor driver PCB currently under layout to consolidate control electronics.',
    arch2: 'The kinematic chain follows a standard 6R configuration optimised for a desktop-scale reachable workspace. Joint angles are commanded via a custom serial protocol that abstracts stepper steps into degree targets, keeping higher-level trajectory scripts hardware-agnostic. The custom PCB consolidates 6 stepper drivers, onboard 3.3 V / 5 V regulation, and logic-level shifting into a single board to minimise wiring harness complexity.',
    hw: ['6× NEMA 17 stepper motors', 'Custom multi-axis control PCB (in layout)', '3D-printed PLA structural links and joints', 'A4988/TMC2209 stepper driver array', 'Hall effect joint feedback sensors (planned)', '24V power distribution board'],
    sw: ['Fusion 360 (mechanical CAD + FEA)', 'RoboDK (workspace simulation + kinematics)', 'Embedded C (microstepping + motion control)', 'Python (trajectory planning interface)', 'Custom serial command interpreter (G-code subset)'],
    ch: 'Achieving acceptable joint stiffness with 3D-printed PLA components under sustained torque load required iterative wall thickness and infill optimization. Coordinating smooth microstepping across 6 simultaneous axes without step loss demanded careful acceleration profiling. PCB layout must handle 6-channel motor drive current within a thermally constrained form factor.',
    st: 'Multiple structural links and joint assemblies fabricated and fitted. Custom PCB layout in progress. Firmware base for single-axis control operational.',
    gh: null,
  },

  vtol: {
    t: 'VTOL UAV System', label: 'HYBRID UAV · CONCEPT DESIGN', bgw: 'VTOL',
    tags: ['UAV', 'VTOL', 'PX4', 'Fusion 360', 'MATLAB'],
    meta: [{ l: 'Type', v: 'Hybrid Fixed-Wing VTOL' }, { l: 'Stack', v: 'PX4 · Fusion 360 · MATLAB' }, { l: 'Status', v: 'Concept Phase' }],
    prob:  'Standard multirotors are limited in range and endurance due to high hover power consumption. Fixed-wing platforms require runways or catapult launches. A VTOL hybrid architecture enables vertical takeoff and landing with efficient fixed-wing cruise — extending autonomous mission range from confined deployment zones.',
    prob2: 'Applications include extended-range infrastructure inspection, delivery to GPS-tagged coordinates in terrains with no landing strips, and search-and-rescue deployment where a confined-space launch is required but long endurance is mission-critical. The hybrid architecture resolves the range / convenience trade-off inherent in either pure configuration.',
    arch:  'Hybrid airframe combining a quadrotor lift system with a pusher fixed-wing propulsion assembly. Transition logic between hover and forward-flight modes handled in PX4 flight controller firmware. Designed for autonomous waypoint missions with manual override. Airframe geometry modeled in Fusion 360; longitudinal and lateral flight dynamics analyzed in MATLAB.',
    arch2: 'Transition is managed by a dedicated VTOL state machine in PX4 that blends throttle and control-surface authority as airspeed crosses a defined threshold. The airframe uses a quad-plane layout — four dedicated lift rotors on booms plus a separate pusher propeller for forward thrust — keeping hover and cruise propulsion thermally and electrically independent to reduce failure-mode coupling.',
    hw: ['Custom composite / 3D-printed hybrid airframe', '4× quadrotor lift motors + ESCs', 'Pusher motor + propeller assembly', 'PX4 / ArduPlane flight controller', 'u-blox GPS + digital compass', 'Pitot tube (airspeed)', '4S LiPo battery + power distribution'],
    sw: ['PX4 Autopilot (flight stack + VTOL transition)', 'QGroundControl / Mission Planner (GCS)', 'Fusion 360 (airframe CAD)', 'MATLAB / Simulink (flight dynamics analysis)', 'Python (telemetry logging)'],
    ch: 'Achieving stable transition between hover and forward-flight modes without attitude divergence is the primary control challenge. CG management across different flight configurations affects handling qualities. Motor mount structural loading during high-pitch-rate attitude changes requires careful FEA validation.',
    st: 'Architecture and system design complete. CAD modeling in progress. Awaiting component procurement for prototype build.',
    gh: null,
  },
};

/* ══════════════════════════════════════════════════════
   CAROUSEL ENGINE
   Injects a full-bleed img + ‹/› arrows + dot strip
   directly into each visual container panel.
══════════════════════════════════════════════════════ */

const galState = {
  hero:  { idx: 0, imgs: [] },
  feat1: { idx: 0, imgs: [] },
  feat2: { idx: 0, imgs: [] },
};

function buildCarousel(container, key) {
  if (!container || container.dataset.carouselKey) return;
  container.dataset.carouselKey = key;

  /* Ensure the container is positioned so absolute children work */
  if (getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
  }

  /* Full-bleed wrapper */
  const wrap = document.createElement('div');
  wrap.id = `car-wrap-${key}`;
  wrap.style.cssText = 'position:absolute;inset:0;z-index:5;display:none;flex-direction:column;align-items:stretch;justify-content:stretch;overflow:hidden;';

  /* Image */
  const img = document.createElement('img');
  img.id = `car-img-${key}`;
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;transition:opacity .28s ease;display:block;';
  wrap.appendChild(img);

  /* Arrow base styles */
  const arrowBase = [
    'position:absolute', 'top:50%', 'transform:translateY(-50%)',
    'background:rgba(0,0,0,.6)', 'border:1px solid rgba(255,255,255,.25)',
    'color:#fff', 'width:38px', 'height:38px', 'border-radius:50%',
    'display:flex', 'align-items:center', 'justify-content:center',
    'font-size:1.15rem', 'z-index:7', 'cursor:pointer',
    'transition:background .18s', 'user-select:none',
  ].join(';');

  const bL = document.createElement('button');
  bL.id = `car-prev-${key}`;
  bL.innerHTML = '&#8249;';
  bL.setAttribute('style', arrowBase + ';left:.9rem;');
  bL.addEventListener('click', e => { e.stopPropagation(); carShift(key, -1); });

  const bR = document.createElement('button');
  bR.id = `car-next-${key}`;
  bR.innerHTML = '&#8250;';
  bR.setAttribute('style', arrowBase + ';right:.9rem;');
  bR.addEventListener('click', e => { e.stopPropagation(); carShift(key, 1); });

  wrap.appendChild(bL);
  wrap.appendChild(bR);

  /* Dot strip */
  const dots = document.createElement('div');
  dots.id = `car-dots-${key}`;
  dots.style.cssText = 'position:absolute;bottom:.75rem;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:7;';
  wrap.appendChild(dots);

  container.appendChild(wrap);
}

function carLoad(key, imgs) {
  galState[key].imgs = (imgs && imgs.length) ? imgs : [];
  galState[key].idx  = 0;
  carRender(key);
}

function carShift(key, dir) {
  const s = galState[key];
  if (!s.imgs.length) return;
  s.idx = (s.idx + dir + s.imgs.length) % s.imgs.length;
  carRender(key);
}

function carRender(key) {
  const s    = galState[key];
  const wrap = document.getElementById(`car-wrap-${key}`);
  const img  = document.getElementById(`car-img-${key}`);
  const bL   = document.getElementById(`car-prev-${key}`);
  const bR   = document.getElementById(`car-next-${key}`);
  const dots = document.getElementById(`car-dots-${key}`);
  if (!wrap || !img) return;

  if (!s.imgs.length) { wrap.style.display = 'none'; return; }

  wrap.style.display = 'flex';
  img.style.opacity  = '0';
  setTimeout(() => { img.src = s.imgs[s.idx]; img.style.opacity = '1'; }, 140);

  const multi = s.imgs.length > 1;
  if (bL) bL.style.display = multi ? 'flex' : 'none';
  if (bR) bR.style.display = multi ? 'flex' : 'none';

  if (dots) {
    dots.innerHTML = '';
    if (multi) {
      s.imgs.forEach((_, i) => {
        const d = document.createElement('span');
        d.style.cssText = `width:7px;height:7px;border-radius:50%;cursor:pointer;display:inline-block;transition:background .2s;background:${i === s.idx ? '#fff' : 'rgba(255,255,255,.35)'};`;
        d.addEventListener('click', e => { e.stopPropagation(); galState[key].idx = i; carRender(key); });
        dots.appendChild(d);
      });
    }
  }
}

/* ══════════════════════════════════════════════════════
   READ MORE / READ LESS ENGINE
══════════════════════════════════════════════════════ */

function setupReadMore(btn, baseId, extraId) {
  if (!btn || btn._rmWired) return;
  btn._rmWired  = true;
  btn._expanded = false;
  btn.style.cursor = 'pointer';

  /* Create the hidden extra paragraph and insert after base */
  let extra = document.getElementById(extraId);
  if (!extra) {
    extra = document.createElement('p');
    extra.id = extraId;
    extra.className = 'po-feature-body';
    extra.style.cssText = 'max-height:0;overflow:hidden;opacity:0;transition:max-height .45s ease,opacity .32s ease;margin-top:0;';
    const base = document.getElementById(baseId);
    if (base) base.insertAdjacentElement('afterend', extra);
  }

  btn.addEventListener('click', e => {
    e.stopPropagation();
    btn._expanded = !btn._expanded;
    if (btn._expanded) {
      extra.style.maxHeight = extra.scrollHeight + 300 + 'px';
      extra.style.opacity   = '1';
      btn.textContent       = 'Read less';
    } else {
      extra.style.maxHeight = '0';
      extra.style.opacity   = '0';
      btn.textContent       = 'Read more';
    }
  });
}

function loadReadMore(extraId, btnEl, text) {
  const extra = document.getElementById(extraId);
  if (extra) {
    extra.textContent       = text || '';
    extra.style.maxHeight   = '0';
    extra.style.opacity     = '0';
  }
  if (btnEl) {
    btnEl._expanded     = false;
    btnEl.textContent   = 'Read more';
    btnEl.style.display = text ? 'inline-flex' : 'none';
  }
}

/* ══════════════════════════════════════════════════════
   OPEN / CLOSE PROJECT OVERLAY
══════════════════════════════════════════════════════ */

const PROJ_ORDER = ['argus', 'pikk', 'vtol'];
let currentProjId = 'argus';

/* Cache read-more button references once DOM is ready */
let rmBtn1 = null, rmBtn2 = null;

function openP(id) {
  const p = PD[id]; if (!p) return;
  const th = THEMES[id];
  currentProjId = id;

  /* Nav breadcrumb */
  document.getElementById('po-breadcrumb').textContent = p.t;

  /* Hero left */
  const cat = p.cat || (p.label ? p.label.split('·')[0].trim() : '');
  document.getElementById('po-eyebrow').textContent  = cat + ' — ' + th.badgeTxt;
  document.getElementById('po-title').textContent    = p.t;
  document.getElementById('po-tagline').textContent  = p.prob.substring(0, 160) + '…';
  document.getElementById('po-meta').innerHTML = (p.meta || []).map(m => `
    <div class="po-hero-meta-item">
      <div class="po-hero-meta-label">${m.l}</div>
      <div class="po-hero-meta-val">${m.v}</div>
    </div>`).join('');

  /* GitHub CTA */
  const ghcta = document.getElementById('po-ghcta');
  const ghbtn = document.getElementById('po-ghbtn');
  if (p.gh) {
    ghcta.href = p.gh; ghcta.style.display = 'inline-flex';
    if (ghbtn) { ghbtn.href = p.gh; ghbtn.style.display = 'inline-flex'; }
  } else {
    ghcta.style.display = 'none';
    if (ghbtn) ghbtn.style.display = 'none';
  }

  /* Hero right: gradient bg + bgword + status badge + tags */
  document.getElementById('po-hero-bg').style.background  = th.bg;
  document.getElementById('po-hero-bgword').textContent    = p.bgw;
  document.getElementById('po-hero-icon').innerHTML        = ''; /* cleared — carousel handles image */
  const sb = document.getElementById('po-status-badge');
  sb.className   = 'po-status-badge sbb-' + th.badge.replace('bp-', '');
  sb.textContent = th.badgeTxt;
  document.getElementById('po-hero-tags').innerHTML = (p.tags || []).map(t => `<span class="po-hero-r-tag">${t}</span>`).join('');

  /* Overview strip */
  document.getElementById('po-overview').innerHTML = (p.meta || []).map(m => `
    <div class="po-overview-item">
      <div class="po-overview-label">${m.l}</div>
      <div class="po-overview-val">${m.v}</div>
    </div>`).join('');

  /* Feature 1: Problem */
  document.getElementById('po-prob').textContent      = p.prob;
  document.getElementById('po-feat1-name').textContent = p.t;
  document.getElementById('po-feat1-bg').style.background = th.bg;
  document.getElementById('po-feat1-icon').innerHTML  = ''; /* cleared — carousel handles image */
  document.getElementById('po-feat1-word').textContent = p.bgw;

  /* Feature 2: Architecture */
  document.getElementById('po-arch').textContent      = p.arch;
  document.getElementById('po-feat2-name').textContent = p.t;
  document.getElementById('po-feat2-bg').style.background = th.bg;
  document.getElementById('po-feat2-icon').innerHTML  = ''; /* cleared — carousel handles image */
  document.getElementById('po-feat2-word').textContent = p.bgw;

  /* Specs */
  document.getElementById('po-hw').innerHTML = p.hw.map((h, i) => `
    <div class="po-specs-item"><span class="po-specs-n">0${i + 1}</span>${h}</div>`).join('');
  document.getElementById('po-sw').innerHTML = p.sw.map((s, i) => `
    <div class="po-specs-item"><span class="po-specs-n">0${i + 1}</span>${s}</div>`).join('');

  /* Dark band */
  document.getElementById('po-ch').textContent = p.ch;
  document.getElementById('po-st').textContent = p.st;

  /* Related projects */
  const others = PROJ_ORDER.filter(pid => pid !== id);
  document.getElementById('po-related-grid').innerHTML = others.map(pid => {
    const pr = PD[pid];
    return `<div class="po-rc" onclick="openP('${pid}')">
      <div class="po-rc-cat">${pr.cat || (pr.label ? pr.label.split('·')[0].trim() : '')}</div>
      <div class="po-rc-name">${pr.t}</div>
      <p class="po-rc-desc">${pr.prob.substring(0, 75)}…</p>
    </div>`;
  }).join('');

  /* ── Load carousels ── */
  const g = GALLERIES[id] || {};
  carLoad('hero',  g.hero);
  carLoad('feat1', g.feat1);
  carLoad('feat2', g.feat2);

  /* ── Load read-more text ── */
  loadReadMore('po-prob-extra', rmBtn1, p.prob2 || '');
  loadReadMore('po-arch-extra', rmBtn2, p.arch2 || '');

  /* Open overlay */
  document.getElementById('po').scrollTop = 0;
  document.getElementById('po').classList.add('open');
  document.body.classList.add('po-open');
}

function closeP() {
  document.getElementById('po').classList.remove('open');
  document.body.classList.remove('po-open');
}

function prevProj() {
  const idx = PROJ_ORDER.indexOf(currentProjId);
  openP(PROJ_ORDER[(idx - 1 + PROJ_ORDER.length) % PROJ_ORDER.length]);
}

function nextProj() {
  const idx = PROJ_ORDER.indexOf(currentProjId);
  openP(PROJ_ORDER[(idx + 1) % PROJ_ORDER.length]);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeP();
  if (document.getElementById('po').classList.contains('open')) {
    if (e.key === 'ArrowRight') nextProj();
    if (e.key === 'ArrowLeft')  prevProj();
  }
});

/* ── CV MODAL ── */
function openCV() { document.getElementById('cv-ov').classList.add('open'); }
function closeCV(e) {
  if (!e || e.target === document.getElementById('cv-ov')) {
    document.getElementById('cv-ov').classList.remove('open');
  }
}

/* ══════════════════════════════════════════════════════
   INIT — build carousels + wire read-more once DOM ready
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* Build carousel overlays into the three visual panels */
  buildCarousel(document.querySelector('.po-hero-r'),                         'hero');
  buildCarousel(document.querySelector('.po-feature:not(.flip) .po-feature-visual'), 'feat1');
  buildCarousel(document.querySelector('.po-feature.flip .po-feature-visual'),       'feat2');

  /* Cache and wire read-more buttons */
  rmBtn1 = document.querySelector('.po-feature:not(.flip) .po-read-more');
  rmBtn2 = document.querySelector('.po-feature.flip .po-read-more');
  setupReadMore(rmBtn1, 'po-prob', 'po-prob-extra');
  setupReadMore(rmBtn2, 'po-arch', 'po-arch-extra');
});
