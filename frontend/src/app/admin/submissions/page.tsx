"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthHeaders } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Submission {
  _id: string;
  type: "enquiry" | "join";
  name: string;
  email: string;
  phone: string;
  message: string;
  joinType: string;
  preferredRole: string;
  createdAt: string;
}

export default function SubmissionsViewer() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "enquiry" | "join">("all");
  const [selected, setSelected] = useState<Submission | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/submissions`, { headers: getAuthHeaders() });
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.type === filter);

  if (loading) return <div className="admin-spinner" />;

  return (
    <div>
      <div className="admin-topbar">
        <h1>Form Submissions</h1>
        <span style={{ color: "#64748b", fontSize: "0.9rem" }}>{submissions.length} total submissions</span>
      </div>
      <div className="admin-tabs">
        <button className={`admin-tab${filter === "all" ? " admin-tab--active" : ""}`} onClick={() => setFilter("all")}>All ({submissions.length})</button>
        <button className={`admin-tab${filter === "enquiry" ? " admin-tab--active" : ""}`} onClick={() => setFilter("enquiry")}>Enquiries ({submissions.filter((s) => s.type === "enquiry").length})</button>
        <button className={`admin-tab${filter === "join" ? " admin-tab--active" : ""}`} onClick={() => setFilter("join")}>Join Applications ({submissions.filter((s) => s.type === "join").length})</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Type</th><th>Name</th><th>Email</th><th>Phone</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6}><div className="admin-empty-state"><i className="fas fa-inbox" /><p>No submissions yet.</p></div></td></tr>
            ) : (
              filtered.map((sub) => (
                <tr key={sub._id}>
                  <td><span className={`admin-badge admin-badge--${sub.type}`}>{sub.type}</span></td>
                  <td style={{ fontWeight: 600 }}>{sub.name}</td>
                  <td>{sub.email}</td>
                  <td>{sub.phone}</td>
                  <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td><button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setSelected(sub)}><i className="fas fa-eye" /> View</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header"><h3>Submission Details</h3><button className="admin-modal__close" onClick={() => setSelected(null)}><i className="fas fa-times" /></button></div>
            <div className="admin-modal__body">
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <div><strong>Type:</strong> <span className={`admin-badge admin-badge--${selected.type}`}>{selected.type}</span></div>
                <div><strong>Name:</strong> {selected.name}</div>
                <div><strong>Email:</strong> {selected.email}</div>
                <div><strong>Phone:</strong> {selected.phone}</div>
                {selected.type === "join" && (<><div><strong>Join Type:</strong> {selected.joinType || "N/A"}</div><div><strong>Preferred Role:</strong> {selected.preferredRole || "N/A"}</div></>)}
                <div><strong>Message:</strong><p style={{ marginTop: "0.25rem", color: "#475569" }}>{selected.message || "No message provided"}</p></div>
                <div><strong>Submitted:</strong> {new Date(selected.createdAt).toLocaleString()}</div>
              </div>
            </div>
            <div className="admin-modal__footer"><button className="admin-btn admin-btn--ghost" onClick={() => setSelected(null)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
