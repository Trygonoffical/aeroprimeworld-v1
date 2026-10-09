const app = document.querySelector('#app');
const toast = document.querySelector('#toast');
const existingToken = localStorage.getItem('apw-token') || sessionStorage.getItem('apw-token');
if (existingToken && !localStorage.getItem('apw-token')) localStorage.setItem('apw-token', existingToken);
let adminAuthenticated = Boolean(existingToken);
const menuToggle = document.querySelector('.menu-toggle');
const primaryNavigation = document.querySelector('.primary-nav');

function closeMobileMenu() {
  primaryNavigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
  menuToggle.innerHTML = '<i data-lucide="menu"></i>';
  iconMarkup();
}

menuToggle.addEventListener('click', (event) => {
  event.stopPropagation();
  const isOpen = primaryNavigation.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  menuToggle.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}"></i>`;
  iconMarkup();
});
primaryNavigation.addEventListener('click', closeMobileMenu);
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMobileMenu();
});

const statusClass = (status) => status === 'Exception' ? 'exception' : status === 'Delivered' ? 'delivered' : '';
const iconMarkup = () => { if (window.lucide) lucide.createIcons(); };
const showToast = (message) => { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2800); };
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));

function layout() {
  const path = window.location.pathname;
  if (path === '/tracking') return trackingPage();
  if (path === '/admin') return adminPage();
  return homePage();
}

function homePage() {
  app.innerHTML = `
    <section class="hero">
      <div>
        <div class="eyebrow">The logistics operating layer</div>
        <h1>Move more.<br /><strong>Worry less.</strong></h1>
        <div class="hero-copy">
          <p>One connected system for domestic shipping, cross-border commerce, fulfilment, last-mile and every moment after purchase.</p>
          <div class="hero-actions"><a class="button button-dark" href="/tracking">Track a package <i data-lucide="arrow-right"></i></a><a class="button button-outline" href="#platform">Explore the platform</a></div>
        </div>
      </div>
      <div class="hero-art"><div class="art-label"><span>APW / GLOBAL NETWORK</span><span>01—06</span></div><div class="art-route">LAX <span>↗</span> YYZ</div><div class="art-stamp">ALWAYS<br />MOVING</div></div>
    </section>
    <section class="section" id="platform">
      <div class="section-heading"><div><div class="eyebrow">One layer. Every handoff.</div><h2>The work behind<br />the delivery.</h2></div><p>From the first label to the final doorstep, APW keeps every team, carrier and customer in sync.</p></div>
      <div class="capability-grid">
        <article class="capability"><div class="capability-number">01 / 04</div><h3>Domestic shipping</h3><p>Multi-carrier routing that adapts to cost, speed and capacity in real time.</p></article>
        <article class="capability"><div class="capability-number">02 / 04</div><h3>Cross-border</h3><p>Clear customs workflows and visibility that make international feel local.</p></article>
        <article class="capability"><div class="capability-number">03 / 04</div><h3>Fulfilment</h3><p>Inventory, pick-pack and dispatch orchestration across every node.</p></article>
        <article class="capability"><div class="capability-number">04 / 04</div><h3>Post-purchase</h3><p>Proactive updates and simple returns that keep customers coming back.</p></article>
      </div>
    </section>
    <section class="section channels-section">
      <div class="section-heading"><div><div class="eyebrow">Plug in. Start moving.</div><h2>Your stack,<br />already connected.</h2></div><p>Bring orders in from the channels you already run. APW becomes the operating layer between commerce and delivery.</p></div>
      <div class="channel-row"><span>SHOPIFY</span><span>AMAZON</span><span>WOOCOMMERCE</span><span>MAGENTO</span><span>ETSY</span><span>CUSTOM API</span></div>
    </section>
    <section class="section workflow-section">
      <div class="section-heading"><div><div class="eyebrow">A calmer control room</div><h2>Every exception<br />has a next step.</h2></div><p>Stop stitching together carrier portals, spreadsheets and support tickets. Give every handoff a place to land.</p></div>
      <div class="workflow-grid"><article class="workflow-card workflow-card-lime"><span class="workflow-index">01 / OPERATIONS</span><h3>One queue for every shipment</h3><p>See what is moving, what is delayed and what needs a human decision before it becomes a customer problem.</p><a href="/admin">Open the control room <i data-lucide="arrow-up-right"></i></a></article><article class="workflow-card workflow-card-dark"><span class="workflow-index">02 / CUSTOMER EXPERIENCE</span><h3>Tracking that feels like you</h3><p>Give customers a clear, branded timeline instead of sending them into a carrier maze.</p><a href="/tracking">Preview tracking <i data-lucide="arrow-up-right"></i></a></article><article class="workflow-card workflow-card-coral"><span class="workflow-index">03 / GROWTH</span><h3>More lanes, less lift</h3><p>Open domestic, cross-border and fulfilment lanes without rebuilding your operations each time.</p><a href="#network">Explore the network <i data-lucide="arrow-up-right"></i></a></article></div>
    </section>
    <section class="section solutions-section">
      <div class="section-heading"><div><div class="eyebrow">Built for the next mile</div><h2>One platform.<br />Many ways to grow.</h2></div></div>
      <div class="solution-list"><a href="#network"><span class="solution-number">01</span><strong>Modern ecommerce</strong><span>Orders to doorstep, without the manual chase.</span><i data-lucide="arrow-up-right"></i></a><a href="#network"><span class="solution-number">02</span><strong>Cross-border commerce</strong><span>Customs clarity for every international handoff.</span><i data-lucide="arrow-up-right"></i></a><a href="#network"><span class="solution-number">03</span><strong>Returns & recovery</strong><span>Turn the reverse journey into a retention moment.</span><i data-lucide="arrow-up-right"></i></a></div>
    </section>
    <section class="network-section" id="network">
      <div class="section-heading"><div><div class="eyebrow">Signal across the network</div><h2>See the whole<br />picture.</h2></div><p>One source of truth for operations teams, brands and the people waiting at home.</p></div>
      <div class="network-grid"><div class="network-map"><div class="map-label"><span>LIVE NETWORK VIEW</span><span>09 OCT 2026</span></div><div class="map-line"></div><span class="map-node node-one">SINGAPORE</span><span class="map-node node-two">SYDNEY</span></div><div class="network-stats"><div class="stat"><span class="stat-value">99.2%</span><span class="stat-label">Scan event<br />coverage</span></div><div class="stat"><span class="stat-value">46</span><span class="stat-label">Markets<br />connected</span></div><div class="stat"><span class="stat-value">24/7</span><span class="stat-label">Exception<br />monitoring</span></div><div class="stat"><span class="stat-value">1</span><span class="stat-label">Operating<br />layer</span></div></div></div>
    </section>
    <section class="closing-cta"><div class="eyebrow">Ready when you are</div><h2>Make every delivery<br /><strong>feel effortless.</strong></h2><div class="hero-actions"><a class="button button-dark" href="/tracking">Track a package <i data-lucide="arrow-right"></i></a><a class="button button-outline" href="/admin">Open admin portal <i data-lucide="arrow-up-right"></i></a></div></section>
    <section class="trust-strip"><span>DOMESTIC</span><span>INTERNATIONAL</span><span>FULFILMENT</span><span>LAST-MILE</span><span>POST-PURCHASE</span></section>
    `;
  iconMarkup();
}

async function trackingPage() {
  app.innerHTML = `<section class="tracking-hero"><div class="eyebrow">Shipment visibility</div><h1>Where is it now?</h1><p>Enter your AeroPrime tracking number to see the latest movement, handoffs and estimated arrival.</p><form class="tracking-form" id="tracking-form"><input id="tracking-input" value="APX-2048-771" aria-label="Tracking number" placeholder="e.g. APX-2048-771" /><button class="button button-dark" type="submit">Find shipment <i data-lucide="search"></i></button></form></section><section class="tracking-result" id="tracking-result"></section>`;
  iconMarkup();
  document.querySelector('#tracking-form').addEventListener('submit', async (event) => { event.preventDefault(); await lookupPackage(document.querySelector('#tracking-input').value); });
  await lookupPackage('APX-2048-771');
}

async function lookupPackage(id) {
  const result = document.querySelector('#tracking-result');
  result.innerHTML = '<div class="empty-state">Looking up your shipment...</div>';
  try {
    const response = await fetch(`/api/packages/${encodeURIComponent(id.trim())}`);
    if (!response.ok) throw new Error('not found');
    renderTrackingResult(await response.json());
  } catch { result.innerHTML = '<div class="empty-state">We could not find that package. Check the number and try again.</div>'; }
}

function renderTrackingResult(item) {
  document.querySelector('#tracking-result').innerHTML = `<div class="result-card"><div class="result-top"><div><div class="result-id">${escapeHtml(item.id)}</div><h2>${escapeHtml(item.route)}</h2></div><span class="status-pill ${statusClass(item.status)}">${escapeHtml(item.status)}</span></div><div class="shipment-meta"><div><span class="meta-label">Service</span><span class="meta-value">${escapeHtml(item.service)}</span></div><div><span class="meta-label">Estimated arrival</span><span class="meta-value">${escapeHtml(item.eta)}</span></div><div><span class="meta-label">Last update</span><span class="meta-value">${escapeHtml(item.updated)}</span></div></div><div class="timeline">${item.events.map((event) => `<div class="timeline-item"><span class="timeline-dot"></span><div><div class="timeline-status">${escapeHtml(event.status)}</div><div class="timeline-location">${escapeHtml(event.location)}</div></div><span class="timeline-time">${escapeHtml(event.time)}</span></div>`).join('')}</div></div>`;
}

function adminPage() {
  if (!adminAuthenticated) return loginPage();
  app.innerHTML = `<section class="admin-page"><div class="admin-head"><div><div class="eyebrow">Operations control room</div><h1>Good morning, team.</h1></div><button class="button button-outline button-small" id="logout-button">Log out</button></div><div class="admin-grid"><div class="panel"><div class="panel-heading"><div><h2>Shipment queue</h2><p class="panel-subtitle">Create, edit, delete, or update shipment movement.</p></div><button class="button button-lime button-small" id="new-shipment-button"><i data-lucide="plus"></i> New shipment</button></div><div class="table-wrap"><table class="admin-table"><thead><tr><th>Package</th><th>Route</th><th>Current status</th><th>Update</th><th></th></tr></thead><tbody id="admin-rows"><tr><td colspan="5">Loading...</td></tr></tbody></table></div></div><div class="panel"><h2>Today at a glance</h2><p class="panel-subtitle">A live view of active package movement.</p><div id="admin-stats" class="network-stats"></div></div></div><div class="panel shipment-form-panel" id="shipment-form-panel" hidden><div class="panel-heading"><div><h2 id="shipment-form-title">New shipment</h2><p class="panel-subtitle">Shipment details are stored in Supabase.</p></div><button class="icon-button" id="close-shipment-form" title="Close"><i data-lucide="x"></i></button></div><form id="shipment-form" class="shipment-form"><input id="shipment-original-id" type="hidden" /><div class="form-grid"><div class="field"><label for="shipment-tracking">Tracking number</label><input id="shipment-tracking" required placeholder="APX-2048-800" /></div><div class="field"><label for="shipment-customer">Customer</label><input id="shipment-customer" required placeholder="Customer name" /></div><div class="field"><label for="shipment-origin">Origin</label><input id="shipment-origin" required placeholder="Singapore" /></div><div class="field"><label for="shipment-destination">Destination</label><input id="shipment-destination" required placeholder="Sydney" /></div><div class="field"><label for="shipment-service">Service</label><input id="shipment-service" required placeholder="Cross-border express" /></div><div class="field"><label for="shipment-eta">Estimated arrival</label><input id="shipment-eta" required placeholder="Oct 15, 2026" /></div><div class="field"><label for="shipment-status">Status</label><select id="shipment-status">${['Label created', 'In transit', 'Arrived at destination hub', 'Out for delivery', 'Delivered', 'Exception'].map((status) => `<option>${status}</option>`).join('')}</select></div></div><div class="form-actions"><button class="button button-dark" type="submit">Save shipment <i data-lucide="check"></i></button><button class="button button-outline" type="button" id="cancel-shipment-form">Cancel</button></div></form></div></section>`;
  iconMarkup();
  document.querySelector('#logout-button').addEventListener('click', () => { adminAuthenticated = false; localStorage.removeItem('apw-token'); sessionStorage.removeItem('apw-token'); navigate('/admin'); });
  document.querySelector('#new-shipment-button').addEventListener('click', () => openShipmentForm());
  document.querySelector('#close-shipment-form').addEventListener('click', closeShipmentForm);
  document.querySelector('#cancel-shipment-form').addEventListener('click', closeShipmentForm);
  document.querySelector('#shipment-form').addEventListener('submit', saveShipment);
  validateAdminSession();
}

async function validateAdminSession() {
  const response = await fetch('/api/admin/session', { headers: { Authorization: `Bearer ${localStorage.getItem('apw-token')}` } });
  if (!response.ok) {
    adminAuthenticated = false;
    localStorage.removeItem('apw-token');
    sessionStorage.removeItem('apw-token');
    return loginPage();
  }
  loadAdminData();
}

function loginPage() {
  app.innerHTML = `<section class="admin-page"><div class="eyebrow">Restricted access</div><div class="login-panel panel"><h2>Welcome back.</h2><p class="panel-subtitle">Sign in with your Supabase Auth account to update package movement across the network.</p><form id="login-form"><div class="field"><label for="email">Work email</label><input id="email" type="email" placeholder="ops@yourcompany.com" required /></div><div class="field"><label for="password">Password</label><input id="password" type="password" required /></div><button class="button button-dark full-width" type="submit">Enter operations <i data-lucide="arrow-right"></i></button></form></div></section>`;
  iconMarkup();
  document.querySelector('#login-form').addEventListener('submit', async (event) => { event.preventDefault(); const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: document.querySelector('#email').value, password: document.querySelector('#password').value }) }); const result = await response.json(); if (!response.ok) return showToast(result.error || 'Those credentials did not work.'); adminAuthenticated = true; localStorage.setItem('apw-token', result.access_token); navigate('/admin'); });
}

async function loadAdminData() {
  const data = await fetch('/api/overview').then((response) => response.json());
  document.querySelector('#admin-rows').innerHTML = data.packages.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.route)}</td><td><span class="status-pill ${statusClass(item.status)}">${escapeHtml(item.status)}</span></td><td><div class="admin-actions"><select data-package="${escapeHtml(item.id)}"><option value="">Set status</option>${['Label created', 'In transit', 'Arrived at destination hub', 'Out for delivery', 'Delivered', 'Exception'].map((status) => `<option value="${status}">${status}</option>`).join('')}</select><button class="icon-button update-status" data-package="${escapeHtml(item.id)}" title="Update status"><i data-lucide="check"></i></button></div></td><td><div class="row-actions"><button class="icon-button edit-shipment" data-package="${escapeHtml(item.id)}" title="Edit shipment"><i data-lucide="pencil"></i></button><button class="icon-button delete-shipment" data-package="${escapeHtml(item.id)}" title="Delete shipment"><i data-lucide="trash-2"></i></button></div></td></tr>`).join('');
  document.querySelector('#admin-stats').innerHTML = [['In transit', data.counts['In transit'] || 0], ['Out for delivery', data.counts['Out for delivery'] || 0], ['Delivered', data.counts.Delivered || 0], ['Exception', data.counts.Exception || 0]].map(([label, value]) => `<div class="stat"><span class="stat-value">${value}</span><span class="stat-label">${label}</span></div>`).join('');
  iconMarkup();
  document.querySelectorAll('.update-status').forEach((button) => button.addEventListener('click', async () => { const select = document.querySelector(`select[data-package="${button.dataset.package}"]`); if (!select.value) return showToast('Choose a new status first.'); const response = await fetch(`/api/packages/${button.dataset.package}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('apw-token')}` }, body: JSON.stringify({ status: select.value, location: 'Operations control room' }) }); if (!response.ok) return showToast('Could not update shipment.'); showToast(`${button.dataset.package} updated.`); loadAdminData(); }));
  document.querySelectorAll('.edit-shipment').forEach((button) => button.addEventListener('click', async () => openShipmentForm(await fetch(`/api/packages/${button.dataset.package}`).then((response) => response.json()))));
  document.querySelectorAll('.delete-shipment').forEach((button) => button.addEventListener('click', async () => { if (!window.confirm(`Delete ${button.dataset.package}? This cannot be undone.`)) return; const response = await fetch(`/api/packages/${button.dataset.package}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('apw-token')}` } }); if (!response.ok) return showToast('Could not delete shipment.'); showToast(`${button.dataset.package} deleted.`); loadAdminData(); }));
}

function openShipmentForm(item = null) {
  document.querySelector('#shipment-form-panel').hidden = false;
  document.querySelector('#shipment-form-title').textContent = item ? 'Edit shipment' : 'New shipment';
  document.querySelector('#shipment-original-id').value = item?.id || '';
  document.querySelector('#shipment-tracking').value = item?.id || '';
  document.querySelector('#shipment-customer').value = item?.customer || '';
  document.querySelector('#shipment-origin').value = item?.origin || '';
  document.querySelector('#shipment-destination').value = item?.destination || '';
  document.querySelector('#shipment-service').value = item?.service || '';
  document.querySelector('#shipment-eta').value = item?.eta || '';
  document.querySelector('#shipment-status').value = item?.status || 'Label created';
  document.querySelector('#shipment-form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeShipmentForm() { document.querySelector('#shipment-form-panel').hidden = true; }

async function saveShipment(event) {
  event.preventDefault();
  const originalId = document.querySelector('#shipment-original-id').value;
  const payload = { tracking_number: document.querySelector('#shipment-tracking').value, customer_name: document.querySelector('#shipment-customer').value, origin: document.querySelector('#shipment-origin').value, destination: document.querySelector('#shipment-destination').value, service: document.querySelector('#shipment-service').value, eta: document.querySelector('#shipment-eta').value, status: document.querySelector('#shipment-status').value };
  const response = await fetch(originalId ? `/api/packages/${originalId}` : '/api/packages', { method: originalId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('apw-token')}` }, body: JSON.stringify(payload) });
  const result = await response.json();
  if (!response.ok) return showToast(result.error || 'Could not save shipment.');
  closeShipmentForm(); showToast(originalId ? 'Shipment updated.' : 'Shipment created.'); loadAdminData();
}

function navigate(path) { window.history.pushState({}, '', path); layout(); window.scrollTo(0, 0); }
document.addEventListener('click', (event) => { const link = event.target.closest('a[data-route], a[href^="/#"]'); if (!link) return; const href = link.getAttribute('href'); if (href.startsWith('/#')) { if (window.location.pathname === '/') return; event.preventDefault(); navigate('/' + href.slice(1)); } else if (href === '/tracking' || href === '/admin' || href === '/') { event.preventDefault(); navigate(href); } });
window.addEventListener('popstate', layout);
layout();
