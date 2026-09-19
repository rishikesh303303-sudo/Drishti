/**
 * File: src/lib/api.js
 * Every page imports from here — never call fetch() directly inside a
 * page component. If a backend URL or response shape changes, fix it here
 * once, not in every page that uses it.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed with status ${res.status}`);
  }
  return res.json();
}

// ---------- Zones (Command Centre, Hotspot Detail) ----------

export async function getZones({ state, crime_category, min_risk } = {}) {
  const params = new URLSearchParams();
  if (state) params.append("state", state);
  if (crime_category) params.append("crime_category", crime_category);
  if (min_risk != null) params.append("min_risk", min_risk);
  const res = await fetch(`${BASE_URL}/api/zones?${params}`);
  return handleResponse(res);
}

export async function getTopZones(limit = 5) {
  const res = await fetch(`${BASE_URL}/api/zones/top?limit=${limit}`);
  return handleResponse(res);
}

export async function getZone(id) {
  const res = await fetch(`${BASE_URL}/api/zones/${id}`);
  return handleResponse(res);
}

export async function getZoneBreakdown(id) {
  const res = await fetch(`${BASE_URL}/api/zones/${id}/breakdown`);
  return handleResponse(res);
}

// ---------- Complaints (Home, Case List, Case Detail) ----------

export async function getComplaintsOverview() {
  const res = await fetch(`${BASE_URL}/api/complaints/overview`);
  return handleResponse(res);
}

export async function getComplaintsByCategory() {
  const res = await fetch(`${BASE_URL}/api/complaints/by-category`);
  return handleResponse(res);
}

export async function getComplaints({ zone_id, status, crime_category } = {}) {
  const params = new URLSearchParams();
  if (zone_id) params.append("zone_id", zone_id);
  if (status) params.append("status", status);
  if (crime_category) params.append("crime_category", crime_category);
  const res = await fetch(`${BASE_URL}/api/complaints?${params}`);
  return handleResponse(res);
}

export async function getComplaint(id) {
  const res = await fetch(`${BASE_URL}/api/complaints/${id}`);
  return handleResponse(res);
}

export async function getEvidence(complaintId) {
  const res = await fetch(`${BASE_URL}/api/complaints/${complaintId}/evidence`);
  return handleResponse(res);
}

export async function uploadEvidence(complaintId, file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/api/complaints/${complaintId}/evidence`, {
    method: "POST",
    body: formData, // no Content-Type header — browser sets the multipart boundary itself
  });
  return handleResponse(res);
}

export async function getNotes(complaintId) {
  const res = await fetch(`${BASE_URL}/api/complaints/${complaintId}/notes`);
  return handleResponse(res);
}

export async function addNote(complaintId, { author, body }) {
  const res = await fetch(`${BASE_URL}/api/complaints/${complaintId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, body }),
  });
  return handleResponse(res);
}

// ---------- Alerts (Hotspot Detail, Alerts & Workflow) ----------

export async function getAlerts(status) {
  const params = status ? `?status=${status}` : "";
  const res = await fetch(`${BASE_URL}/api/alerts${params}`);
  return handleResponse(res);
}

export async function getAlert(id) {
  const res = await fetch(`${BASE_URL}/api/alerts/${id}`);
  return handleResponse(res);
}

export async function createAlert(payload) {
  const res = await fetch(`${BASE_URL}/api/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function approveAlert(id) {
  const res = await fetch(`${BASE_URL}/api/alerts/${id}/approve`, { method: "POST" });
  return handleResponse(res);
}

export async function rejectAlert(id) {
  const res = await fetch(`${BASE_URL}/api/alerts/${id}/reject`, { method: "POST" });
  return handleResponse(res);
}

export async function dispatchAlert(id) {
  const res = await fetch(`${BASE_URL}/api/alerts/${id}/dispatch`, { method: "POST" });
  return handleResponse(res);
}

export async function markAlertActioned(id) {
  const res = await fetch(`${BASE_URL}/api/alerts/${id}/actioned`, { method: "POST" });
  return handleResponse(res);
}

export async function addRecipient(id, { name, type }) {
  const res = await fetch(`${BASE_URL}/api/alerts/${id}/recipients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, type }),
  });
  return handleResponse(res);
}

// ---------- Outcomes ----------

export async function getOutcomeStats() {
  const res = await fetch(`${BASE_URL}/api/outcomes/stats`);
  return handleResponse(res);
}

export async function getOutcomeTrend() {
  const res = await fetch(`${BASE_URL}/api/outcomes/trend`);
  return handleResponse(res);
}

export async function getRecentWins() {
  const res = await fetch(`${BASE_URL}/api/outcomes/recent-wins`);
  return handleResponse(res);
}

// ---------- Audit ----------

export async function getAuditRecords(recordType) {
  const params = recordType ? `?record_type=${recordType}` : "";
  const res = await fetch(`${BASE_URL}/api/audit${params}`);
  return handleResponse(res);
}

export async function verifyAuditRecord(id) {
  const res = await fetch(`${BASE_URL}/api/audit/${id}/verify`, { method: "POST" });
  return handleResponse(res);
}
export async function createComplaint({ zone_id, crime_category }) {
  const res = await fetch(`${BASE_URL}/api/complaints`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ zone_id, crime_category }),
  });
  return handleResponse(res);
}