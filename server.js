require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;
const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabase = hasSupabase ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY) : null;
const adminSupabase = hasSupabase ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } }) : null;
const validStatuses = ['Label created', 'In transit', 'Arrived at destination hub', 'Out for delivery', 'Delivered', 'Exception'];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const formatShipment = (shipment, events = []) => ({
  id: shipment.tracking_number,
  customer: shipment.customer_name,
  route: `${shipment.origin} → ${shipment.destination}`,
  service: shipment.service,
  status: shipment.status,
  eta: shipment.eta,
  updated: new Date(shipment.updated_at).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' }),
  origin: shipment.origin,
  destination: shipment.destination,
  events: events.map((event) => ({ status: event.status, location: event.location, note: event.note, time: new Date(event.created_at).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }) }))
});

async function getShipments() {
  if (!hasSupabase) return { packages: [], counts: {} };
  const { data, error } = await adminSupabase.from('shipments').select('*').order('updated_at', { ascending: false });
  if (error) throw error;
  const packages = data.map((shipment) => formatShipment(shipment));
  const counts = packages.reduce((result, item) => { result[item.status] = (result[item.status] || 0) + 1; return result; }, {});
  return { packages, counts };
}

async function getShipment(trackingNumber) {
  if (!hasSupabase) return null;
  const { data: shipment, error } = await adminSupabase.from('shipments').select('*').ilike('tracking_number', trackingNumber).maybeSingle();
  if (error || !shipment) return null;
  const { data: events } = await adminSupabase.from('shipment_events').select('*').eq('shipment_id', shipment.id).order('created_at', { ascending: false });
  return formatShipment(shipment, events || []);
}

app.get('/api/config', (req, res) => res.json({ database: hasSupabase ? 'supabase' : 'not-configured' }));

app.get('/api/overview', async (req, res) => {
  try { res.json(await getShipments()); } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/packages/:id', async (req, res) => {
  try {
    const packageItem = await getShipment(req.params.id);
    if (!packageItem) return res.status(404).json({ error: 'Package not found or Supabase is not configured' });
    res.json(packageItem);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/admin/login', async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'Supabase is not configured. Add the environment variables first.' });
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true, access_token: data.session.access_token, name: data.user.email });
});

async function requireAdmin(req, res, next) {
  if (!supabase) return res.status(503).json({ error: 'Supabase is not configured.' });
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Session expired' });
  req.user = user;
  next();
}

function shipmentPayload(body) {
  return {
    tracking_number: body.tracking_number?.trim(),
    customer_name: body.customer_name?.trim(),
    origin: body.origin?.trim(),
    destination: body.destination?.trim(),
    service: body.service?.trim(),
    status: body.status || 'Label created',
    eta: body.eta?.trim() || 'To be confirmed'
  };
}

function validateShipment(payload) {
  return payload.tracking_number && payload.customer_name && payload.origin && payload.destination && payload.service && validStatuses.includes(payload.status);
}

app.post('/api/packages', requireAdmin, async (req, res) => {
  const payload = shipmentPayload(req.body);
  if (!validateShipment(payload)) return res.status(400).json({ error: 'Tracking number, customer, origin, destination, service, and valid status are required.' });
  try {
    const { data: shipment, error } = await adminSupabase.from('shipments').insert(payload).select().single();
    if (error) throw error;
    const { error: eventError } = await adminSupabase.from('shipment_events').insert({ shipment_id: shipment.id, status: payload.status, location: payload.origin, note: 'Shipment created' });
    if (eventError) throw eventError;
    res.status(201).json(await getShipment(payload.tracking_number));
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.put('/api/packages/:id', requireAdmin, async (req, res) => {
  const payload = shipmentPayload(req.body);
  if (!validateShipment(payload)) return res.status(400).json({ error: 'Tracking number, customer, origin, destination, service, and valid status are required.' });
  try {
    const { data: shipment, error } = await adminSupabase.from('shipments').update({ ...payload, updated_at: new Date().toISOString() }).ilike('tracking_number', req.params.id).select().single();
    if (error || !shipment) return res.status(404).json({ error: 'Package not found' });
    res.json(await getShipment(shipment.tracking_number));
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/api/packages/:id', requireAdmin, async (req, res) => {
  try {
    const { error } = await adminSupabase.from('shipments').delete().ilike('tracking_number', req.params.id);
    if (error) throw error;
    res.status(204).end();
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.patch('/api/packages/:id/status', requireAdmin, async (req, res) => {
  const { status, location, note } = req.body;
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Unsupported status' });
  try {
    const { data: shipment, error } = await adminSupabase.from('shipments').select('*').ilike('tracking_number', req.params.id).maybeSingle();
    if (error || !shipment) return res.status(404).json({ error: 'Package not found' });
    const eta = status === 'Delivered' ? 'Delivered just now' : status === 'Exception' ? 'Action needed' : shipment.eta;
    const { error: updateError } = await adminSupabase.from('shipments').update({ status, eta, updated_at: new Date().toISOString() }).eq('id', shipment.id);
    if (updateError) throw updateError;
    const { error: eventError } = await adminSupabase.from('shipment_events').insert({ shipment_id: shipment.id, status, location: location || shipment.destination, note: note || '' });
    if (eventError) throw eventError;
    res.json(await getShipment(req.params.id));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(port, () => console.log(`AeroPrime Worldwide running at http://localhost:${port}${hasSupabase ? '' : ' (Supabase not configured)'}`));
