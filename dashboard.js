// ── Dashboard Data ──────────────────────────────────────────────────────
const SKUS = [
  { name: 'Running Shoes S10',   sku: 'RS-010', stock: 142, reorder: 60,  forecast: 180, trend: [12,15,18,14,16,18,20], status: 'ok' },
  { name: 'Yoga Mat Premium',    sku: 'YM-PRE', stock: 23,  reorder: 40,  forecast: 85,  trend: [8,9,7,10,11,9,12],  status: 'low' },
  { name: 'Water Bottle 1L',     sku: 'WB-001', stock: 7,   reorder: 50,  forecast: 120, trend: [20,22,19,25,30,45,82], status: 'order' },
  { name: 'Resistance Bands',    sku: 'RB-STD', stock: 310, reorder: 80,  forecast: 95,  trend: [25,28,30,26,28,30,32], status: 'ok' },
  { name: 'Foam Roller 60cm',    sku: 'FR-060', stock: 45,  reorder: 30,  forecast: 60,  trend: [10,12,11,13,12,11,14], status: 'ok' },
  { name: 'Protein Shaker',      sku: 'PS-700', stock: 18,  reorder: 35,  forecast: 70,  trend: [6,7,8,7,9,10,11],  status: 'low' },
  { name: 'Jump Rope Speed',     sku: 'JR-SPD', stock: 92,  reorder: 40,  forecast: 55,  trend: [15,14,16,15,13,14,15], status: 'ok' },
  { name: 'Dumbbell Set 20kg',   sku: 'DB-020', stock: 4,   reorder: 10,  forecast: 22,  trend: [3,4,3,4,4,5,6],   status: 'order' },
  { name: 'Exercise Mat 10mm',   sku: 'EM-010', stock: 67,  reorder: 30,  forecast: 45,  trend: [8,9,10,9,11,10,12], status: 'ok' },
  { name: 'Pull-up Bar Pro',     sku: 'PB-PRO', stock: 380, reorder: 50,  forecast: 30,  trend: [5,4,6,5,4,5,4],   status: 'overstock' },
  { name: 'Kettlebell 16kg',     sku: 'KB-016', stock: 12,  reorder: 20,  forecast: 40,  trend: [6,7,6,8,9,10,11],  status: 'low' },
  { name: 'Gym Gloves M',        sku: 'GG-MED', stock: 55,  reorder: 25,  forecast: 35,  trend: [8,9,10,8,9,10,9],  status: 'ok' },
  { name: 'Ab Wheel',            sku: 'AW-STD', stock: 3,   reorder: 15,  forecast: 28,  trend: [4,5,4,6,7,8,9],   status: 'order' },
  { name: 'Ankle Weights 2kg',   sku: 'AW-002', stock: 28,  reorder: 20,  forecast: 32,  trend: [5,6,5,7,6,7,8],   status: 'ok' },
  { name: 'Yoga Blocks Set',     sku: 'YB-SET', stock: 190, reorder: 35,  forecast: 20,  trend: [3,4,3,4,3,4,3],   status: 'overstock' },
];

const ALERTS = [
  { type: 'critical', icon: '🚨', title: 'Water Bottle 1L — 7 units left', desc: 'Marathon Sunday will drive +180% demand. Order 48 units by Thursday.', action: 'Order now' },
  { type: 'critical', icon: '🚨', title: 'Ab Wheel — 3 units left', desc: 'Estimated stockout in 2 days based on current sell-through rate.', action: 'Order now' },
  { type: 'critical', icon: '🚨', title: 'Dumbbell Set 20kg — 4 units left', desc: 'Reorder point is 10. Lead time is 5 days. Order immediately.', action: 'Order now' },
  { type: 'warning', icon: '⚠️', title: 'Yoga Mat Premium — running low', desc: '23 units. At current pace stocks out in 8 days. Reorder point: 40 units.', action: 'Schedule order' },
  { type: 'warning', icon: '⚠️', title: 'Protein Shaker — running low', desc: '18 units. Approaching reorder point of 35 units.', action: 'Schedule order' },
  { type: 'warning', icon: '⚠️', title: 'Kettlebell 16kg — running low', desc: '12 units. Growing demand trend detected.', action: 'Schedule order' },
  { type: 'info', icon: '💡', title: 'Pull-up Bar Pro — overstock alert', desc: '380 units vs 30 forecasted demand. Consider promotions or returns.', action: 'View options' },
  { type: 'info', icon: '💡', title: 'Yoga Blocks Set — overstock alert', desc: '190 units vs 20 forecasted. Capital tied up: ~$1,900.', action: 'View options' },
  { type: 'info', icon: '🌦️', title: 'Weather signal: Heatwave next week', desc: 'Water bottles, electrolyte drinks expected +60% demand from Wed.', action: 'View forecast' },
];

const REPORTS = [
  { date: 'Mon 3 Mar 2025', title: 'Weekly Order Report', preview: '3 items need ordering this week. Total spend: ~$2,400. 2 overstock items flagged.', status: 'New' },
  { date: 'Mon 24 Feb 2025', title: 'Weekly Order Report', preview: '5 items ordered, all delivered on time. Forecast accuracy: 96.4%.', status: 'Delivered' },
  { date: 'Mon 17 Feb 2025', title: 'Weekly Order Report', preview: 'Marathon prep: Water Bottle +180%, Sports Drinks +95%. Pre-ordered successfully.', status: 'Delivered' },
  { date: 'Mon 10 Feb 2025', title: 'Weekly Order Report', preview: 'Quiet week. 1 routine reorder. Savings vs stockout cost: $840.', status: 'Delivered' },
];

// ── Tab navigation ──────────────────────────────────────────────────────
function showTab(name, link) {
  document.querySelectorAll('[id^="tab-"]').forEach(t => t.style.display = 'none');
  document.getElementById('tab-' + name).style.display = '';
  document.querySelectorAll('.db-nav a').forEach(a => a.classList.remove('active'));
  if (link) link.classList.add('active');
  if (name === 'inventory') renderInventory();
  if (name === 'forecasts') renderForecasts();
  if (name === 'alerts')    renderAlerts();
  if (name === 'reports')   renderReports();
  return false;
}

// ── Date ────────────────────────────────────────────────────────────────
const dateEl = document.getElementById('dbDate');
if (dateEl) {
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

// ── Savings counter ─────────────────────────────────────────────────────
(function() {
  const el = document.getElementById('savingsCounter');
  if (!el) return;
  let v = 0; const target = 8420;
  const iv = setInterval(() => {
    v += 280; if (v >= target) { v = target; clearInterval(iv); }
    el.textContent = v.toLocaleString();
  }, 30);
})();

// ── Action table ────────────────────────────────────────────────────────
function renderActionTable() {
  const tbody = document.getElementById('actionTable');
  if (!tbody) return;
  const items = SKUS.filter(s => s.status === 'order' || s.status === 'low').slice(0,6);
  tbody.innerHTML = items.map(s => `
    <tr>
      <td>${s.name}</td>
      <td><span class="order-chip ${s.status === 'order' ? 'chip-danger' : 'chip-warn'}">${s.stock}</span></td>
      <td><span class="order-chip ${s.status === 'order' ? 'chip-danger' : 'chip-warn'}">${s.status === 'order' ? 'Order now' : 'Low'}</span></td>
      <td><button class="order-btn" onclick="placeOrder('${s.name}')">Order</button></td>
    </tr>
  `).join('');
}
renderActionTable();

// ── Top sellers ─────────────────────────────────────────────────────────
function renderTopSellers() {
  const el = document.getElementById('topSellers');
  if (!el) return;
  const top = [...SKUS].sort((a,b) => b.trend[6] - a.trend[6]).slice(0,5);
  const max = top[0].trend[6];
  el.innerHTML = top.map(s => `
    <div style="margin-bottom:0.9rem;">
      <div style="display:flex;justify-content:space-between;font-family:var(--mono);font-size:0.72rem;margin-bottom:0.3rem;">
        <span>${s.name}</span><span style="color:var(--muted)">${s.trend[6]} units</span>
      </div>
      <div class="db-bar-track"><div class="db-bar-fill" style="width:${s.trend[6]/max*100}%"></div></div>
    </div>
  `).join('');
}
renderTopSellers();

// ── Forecast canvas chart ────────────────────────────────────────────────
function drawForecastChart(canvasId, labels, actual, forecast, height) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  canvas.height = height || 200;
  const ctx = canvas.getContext('2d');
  const w = canvas.offsetWidth || 600;
  canvas.width = w;
  const pad = { top: 20, right: 20, bottom: 30, left: 40 };
  const iw = w - pad.left - pad.right;
  const ih = canvas.height - pad.top - pad.bottom;
  const allVals = [...actual.filter(v => v !== null), ...forecast.filter(v => v !== null)];
  const maxV = Math.max(...allVals) * 1.15;
  const n = labels.length;
  const xStep = iw / (n - 1);
  ctx.clearRect(0, 0, w, canvas.height);

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + ih - (i / 4) * ih;
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + iw, y); ctx.stroke();
    ctx.fillStyle = 'rgba(139,143,168,0.7)';
    ctx.font = '10px DM Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round((i/4)*maxV), pad.left - 6, y + 4);
  }

  // X labels
  ctx.fillStyle = 'rgba(139,143,168,0.7)';
  ctx.font = '10px DM Mono, monospace';
  ctx.textAlign = 'center';
  labels.forEach((l, i) => {
    ctx.fillText(l, pad.left + i * xStep, canvas.height - 6);
  });

  // Forecast fill area
  const fcstPoints = forecast.map((v, i) => v !== null ? { x: pad.left + i * xStep, y: pad.top + ih - (v / maxV) * ih } : null).filter(Boolean);
  if (fcstPoints.length > 1) {
    ctx.beginPath();
    ctx.moveTo(fcstPoints[0].x, pad.top + ih);
    fcstPoints.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(fcstPoints[fcstPoints.length-1].x, pad.top + ih);
    ctx.closePath();
    ctx.fillStyle = 'rgba(232,252,74,0.06)';
    ctx.fill();
  }

  // Actual line
  const actPoints = actual.map((v, i) => v !== null ? { x: pad.left + i * xStep, y: pad.top + ih - (v / maxV) * ih } : null).filter(Boolean);
  if (actPoints.length > 1) {
    ctx.beginPath();
    ctx.moveTo(actPoints[0].x, actPoints[0].y);
    actPoints.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = 'rgba(102,153,255,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    actPoints.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(102,153,255,0.9)'; ctx.fill();
    });
  }

  // Forecast line
  if (fcstPoints.length > 1) {
    ctx.beginPath();
    ctx.moveTo(fcstPoints[0].x, fcstPoints[0].y);
    fcstPoints.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = 'rgba(232,252,74,0.85)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5,3]);
    ctx.stroke();
    ctx.setLineDash([]);
    fcstPoints.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(232,252,74,0.9)'; ctx.fill();
    });
  }
}

const fLabels = ['W1 Mon','Tue','Wed','Thu','Fri','Sat','Sun','W2 Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const fActual = [42,38,51,48,55,70,82,75,null,null,null,null,null,null];
const fFcst   = [null,null,null,null,null,null,null,null,80,72,68,85,95,110];
setTimeout(() => drawForecastChart('forecastCanvas', fLabels, fActual, fFcst, 200), 100);

// ── Inventory tab ────────────────────────────────────────────────────────
let currentFilter = 'all';
let currentSort = { key: 'name', dir: 1 };
let currentPage = 1;
const PAGE_SIZE = 8;

function spark(trend, good) {
  const max = Math.max(...trend);
  return `<span class="trend-spark">${trend.map((v,i) => {
    const h = Math.max(3, Math.round(v/max*18));
    const color = i === trend.length-1 ? (good ? 'var(--ok)' : 'var(--danger)') : 'rgba(255,255,255,0.2)';
    return `<span style="height:${h}px;background:${color}"></span>`;
  }).join('')}</span>`;
}

function statusChip(s) {
  const map = { ok: ['chip-ok','OK'], low: ['chip-warn','Low'], order: ['chip-danger','Order!'], overstock: ['chip-overstock','Overstock'] };
  const [cls, label] = map[s] || ['chip-ok','OK'];
  return `<span class="order-chip ${cls}">${label}</span>`;
}

function filterSKUs() { currentPage = 1; renderInventory(); }
function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentPage = 1;
  renderInventory();
}
function sortTable(key) {
  if (currentSort.key === key) currentSort.dir *= -1;
  else { currentSort.key = key; currentSort.dir = 1; }
  renderInventory();
}

function renderInventory() {
  const search = (document.getElementById('skuSearch') || {}).value || '';
  let data = [...SKUS];
  if (currentFilter !== 'all') {
    const map = { low: ['low','order'], order: ['order'], over: ['overstock'] };
    data = data.filter(s => (map[currentFilter] || []).includes(s.status));
  }
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(s => s.name.toLowerCase().includes(q) || s.sku.toLowerCase().includes(q));
  }
  data.sort((a,b) => {
    let av = a[currentSort.key], bv = b[currentSort.key];
    if (typeof av === 'string') return av.localeCompare(bv) * currentSort.dir;
    return (av - bv) * currentSort.dir;
  });
  const total = data.length;
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = data.slice(start, start + PAGE_SIZE);
  const tbody = document.getElementById('skuTableBody');
  if (!tbody) return;
  tbody.innerHTML = page.map(s => `
    <tr>
      <td><strong>${s.name}</strong></td>
      <td style="color:var(--muted)">${s.sku}</td>
      <td>${s.stock}</td>
      <td>${spark(s.trend, s.stock > s.reorder)}</td>
      <td>${s.forecast}</td>
      <td>${statusChip(s.status)}</td>
      <td><button class="order-btn" ${s.status === 'overstock' || s.status === 'ok' ? 'disabled' : ''} onclick="placeOrder('${s.name}')">${s.status === 'order' ? 'Order now' : s.status === 'low' ? 'Schedule' : '—'}</button></td>
    </tr>
  `).join('') || `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:2rem;">No items match your filter.</td></tr>`;
  renderPagination(total);
}

function renderPagination(total) {
  const pages = Math.ceil(total / PAGE_SIZE);
  const el = document.getElementById('pagination');
  if (!el) return;
  el.innerHTML = '';
  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement('button');
    btn.className = 'pg-btn' + (i === currentPage ? ' active' : '');
    btn.textContent = i;
    btn.onclick = () => { currentPage = i; renderInventory(); };
    el.appendChild(btn);
  }
}

// ── Forecasts tab ────────────────────────────────────────────────────────
let drillChart = null;
function renderForecasts() {
  // Signal strength
  const signals = [
    { name: 'Weather signals',  strength: 92, desc: 'Heatwave next week' },
    { name: 'Local events',     strength: 85, desc: 'City Marathon Sunday' },
    { name: 'Seasonal pattern', strength: 78, desc: 'Spring uptick starting' },
    { name: 'Historical data',  strength: 96, desc: '18 months of clean data' },
  ];
  const ss = document.getElementById('signalStrength');
  if (ss) ss.innerHTML = signals.map(s => `
    <div style="margin-bottom:1rem;">
      <div style="display:flex;justify-content:space-between;font-family:var(--mono);font-size:0.72rem;margin-bottom:0.35rem;">
        <span>${s.name}</span>
        <span style="color:var(--accent)">${s.strength}%</span>
      </div>
      <div class="db-bar-track"><div class="db-bar-fill" style="width:${s.strength}%;background:${s.strength > 85 ? 'var(--ok)' : 'var(--accent)'}"></div></div>
      <div style="font-family:var(--mono);font-size:0.62rem;color:var(--muted);margin-top:0.2rem;">${s.desc}</div>
    </div>
  `).join('');

  const drivers = [
    { icon: '🏃', event: 'City Marathon', date: 'Sun 9 Mar', impact: '+180%', products: 'Water Bottles, Sports Drinks' },
    { icon: '☀️', event: 'Heatwave forecast', date: 'Wed–Fri', impact: '+60%', products: 'Water Bottles, Fans' },
    { icon: '🌸', event: 'Spring seasonality', date: 'Ongoing', impact: '+25%', products: 'Outdoor gear, Yoga mats' },
  ];
  const dd = document.getElementById('demandDrivers');
  if (dd) dd.innerHTML = drivers.map(d => `
    <div style="padding:0.9rem;border:1px solid rgba(255,255,255,0.06);margin-bottom:0.7rem;">
      <div style="display:flex;align-items:center;gap:0.7rem;margin-bottom:0.3rem;">
        <span style="font-size:1.2rem">${d.icon}</span>
        <strong style="font-size:0.85rem;">${d.event}</strong>
        <span style="font-family:var(--mono);font-size:0.65rem;color:var(--muted);margin-left:auto">${d.date}</span>
      </div>
      <div style="font-family:var(--mono);font-size:0.72rem;color:var(--accent);">Impact: ${d.impact} · ${d.products}</div>
    </div>
  `).join('');

  // SKU selector
  const sel = document.getElementById('forecastSku');
  if (sel && sel.options.length === 0) {
    SKUS.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.sku; opt.textContent = s.name;
      sel.appendChild(opt);
    });
  }
  updateForecastChart();
}

function updateForecastChart() {
  const sel = document.getElementById('forecastSku');
  if (!sel) return;
  const sku = SKUS.find(s => s.sku === sel.value) || SKUS[0];
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const actual = sku.trend.slice(0,4).concat([null,null,null]);
  const fcst   = [null,null,null,null].concat(sku.trend.slice(4));
  drawForecastChart('drillCanvas', days, actual, fcst, 200);
  const ins = document.getElementById('drillInsight');
  if (ins) {
    const note = sku.status === 'order' ? `🚨 Stockout risk: ${sku.stock} units left, ${sku.forecast} forecasted demand. Order ${Math.max(0,sku.forecast - sku.stock + sku.reorder)} units ASAP.` :
                 sku.status === 'low'   ? `⚠️ Running low: ${sku.stock} units. Forecast shows ${sku.forecast} units needed. Schedule a reorder soon.` :
                 sku.status === 'overstock' ? `💡 Overstock: ${sku.stock} units vs ${sku.forecast} forecasted demand. Consider a promotion.` :
                 `✅ Stock healthy: ${sku.stock} units on hand, ${sku.forecast} forecasted demand. No action needed.`;
    ins.innerHTML = `<span style="color:var(--accent);font-family:var(--mono);font-size:0.68rem;">⚡ AI INSIGHT</span><br><span style="color:#ccc">${note}</span>`;
  }
}

// ── Alerts tab ───────────────────────────────────────────────────────────
let dismissedAlerts = new Set();
function renderAlerts() {
  const el = document.getElementById('alertsList');
  if (!el) return;
  const active = ALERTS.filter((_, i) => !dismissedAlerts.has(i));
  document.getElementById('alertCount').textContent = active.filter(a => a.type !== 'info').length;
  if (!active.length) { el.innerHTML = '<div style="padding:3rem;text-align:center;font-family:var(--mono);font-size:0.8rem;color:var(--muted);">✅ No active alerts. All good!</div>'; return; }
  el.innerHTML = active.map((a, i) => `
    <div class="alert-row ${a.type}" id="alert-${i}">
      <div class="alert-icon">${a.icon}</div>
      <div class="alert-body">
        <strong>${a.title}</strong>
        <span>${a.desc}</span>
      </div>
      <a class="alert-action" href="#" onclick="handleAlertAction(event,'${a.title}','${a.type}')">${a.action}</a>
      <button class="alert-dismiss" onclick="dismissAlert(${ALERTS.indexOf(a)})">✕</button>
    </div>
  `).join('');
}

function dismissAlert(i) {
  dismissedAlerts.add(i);
  renderAlerts();
}
function dismissAll() {
  ALERTS.forEach((_, i) => dismissedAlerts.add(i));
  renderAlerts();
  showToast('All alerts dismissed.', 'success');
}
function handleAlertAction(e, title, type) {
  e.preventDefault();
  if (type === 'critical' || type === 'warning') {
    const name = title.split(' — ')[0];
    placeOrder(name);
  } else {
    showToast('Opening forecast view…', 'success');
    showTab('forecasts', document.querySelector('[href="#forecasts"]'));
  }
}

// ── Reports tab ──────────────────────────────────────────────────────────
function renderReports() {
  const el = document.getElementById('reportsList');
  if (!el) return;
  el.innerHTML = REPORTS.map((r, i) => `
    <div style="background:var(--mid);border:1px solid rgba(255,255,255,0.07);padding:1.5rem;margin-bottom:1px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap;">
        <div>
          <div style="font-family:var(--mono);font-size:0.65rem;color:var(--muted);margin-bottom:0.3rem;">${r.date}</div>
          <div style="font-family:var(--display);font-size:1.1rem;font-weight:700;margin-bottom:0.5rem;">${r.title}</div>
          <div style="font-size:0.82rem;color:var(--muted)">${r.preview}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.5rem;align-items:flex-end;">
          <span class="order-chip ${r.status === 'New' ? 'chip-ok' : 'chip-warn'}">${r.status}</span>
          <button class="order-btn" onclick="downloadReport(${i})">Download PDF</button>
        </div>
      </div>
    </div>
  `).join('');
}

function downloadReport(i) {
  showToast(`Preparing report for ${REPORTS[i].date}…`, 'success');
  setTimeout(() => showToast('Report ready! (Demo — no actual file)', 'success'), 1500);
}

// ── Order placement ──────────────────────────────────────────────────────
function placeOrder(productName) {
  const sku = SKUS.find(s => s.name === productName);
  const qty = sku ? Math.max(sku.reorder, sku.forecast - sku.stock + sku.reorder) : 50;
  const t = document.getElementById('successTitle');
  const m = document.getElementById('successMsg');
  if (t) t.textContent = 'Order submitted!';
  if (m) m.textContent = `Purchase order for ${qty} units of "${productName}" has been sent to your supplier. Expected delivery in 3–5 days.`;
  openModal('successModal');
  // Update local data
  if (sku) {
    sku.stock += qty;
    sku.status = sku.stock >= sku.reorder ? 'ok' : 'low';
    renderActionTable();
    renderTopSellers();
    if (document.getElementById('tab-inventory').style.display !== 'none') renderInventory();
    if (document.getElementById('tab-alerts').style.display !== 'none') renderAlerts();
    showToast(`✅ Ordered ${qty} × ${productName}`, 'success');
  }
}

// ── Refresh ──────────────────────────────────────────────────────────────
function refreshData() {
  showToast('Refreshing data… (demo)', 'success');
  renderActionTable();
  renderTopSellers();
  setTimeout(() => drawForecastChart('forecastCanvas', fLabels, fActual, fFcst, 200), 200);
}
