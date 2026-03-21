"use client";

import { useState, useEffect, useCallback } from "react";

interface Bulletin {
  _id: string;
  title: string;
  description: string;
  date: string;
  isNew: boolean;
}

export default function UpdatesManager() {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Bulletin | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    isNew: true,
  });

  const showToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBulletins = useCallback(async () => {
    try {
      const res = await fetch("/api/bulletins");
      console.log("[FRONTEND] GET /api/bulletins — status:", res.status);
      const data = await res.json();
      console.log("[FRONTEND] Bulletins data:", data);
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch updates");
      }
      setBulletins(data);
    } catch (error) {
      console.error("[FRONTEND] ❌ Error fetching bulletins:", error);
      showToast(error instanceof Error ? error.message : "Failed to fetch updates", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBulletins();
  }, [fetchBulletins]);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", description: "", date: new Date().toISOString().split("T")[0], isNew: true });
    setShowModal(true);
  };

  const openEdit = (bulletin: Bulletin) => {
    setEditing(bulletin);
    setForm({
      title: bulletin.title,
      description: bulletin.description,
      date: bulletin.date,
      isNew: bulletin.isNew,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      showToast("Please fill all fields", "error");
      return;
    }

    try {
      console.log("[FRONTEND] Saving bulletin — editing:", !!editing, "form:", form);
      const res = editing
        ? await fetch(`/api/bulletins/${editing._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          })
        : await fetch("/api/bulletins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });

      console.log("[FRONTEND] Save bulletin response status:", res.status);
      const responseData = await res.json();
      console.log("[FRONTEND] Save bulletin response body:", responseData);

      if (!res.ok) {
        throw new Error(responseData.message || responseData.error || "Failed to save update");
      }

      showToast(editing ? "Update modified!" : "Update created!");
      setShowModal(false);
      fetchBulletins();
    } catch (error) {
      console.error("[FRONTEND] ❌ Error saving bulletin:", error);
      showToast(error instanceof Error ? error.message : "Failed to save update", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this update?")) return;
    try {
      console.log("[FRONTEND] Deleting bulletin ID:", id);
      const res = await fetch(`/api/bulletins/${id}`, { method: "DELETE" });
      console.log("[FRONTEND] Delete bulletin response status:", res.status);
      const responseData = await res.json();
      console.log("[FRONTEND] Delete bulletin response body:", responseData);

      if (!res.ok) {
        throw new Error(responseData.message || responseData.error || "Failed to delete update");
      }
      showToast("Update deleted!");
      fetchBulletins();
    } catch (error) {
      console.error("[FRONTEND] ❌ Error deleting bulletin:", error);
      showToast(error instanceof Error ? error.message : "Failed to delete update", "error");
    }
  };

  const toggleNew = async (bulletin: Bulletin) => {
    try {
      console.log("[FRONTEND] Toggling NEW badge for bulletin:", bulletin._id);
      const res = await fetch(`/api/bulletins/${bulletin._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bulletin, isNew: !bulletin.isNew }),
      });
      console.log("[FRONTEND] Toggle NEW response status:", res.status);
      const responseData = await res.json();
      console.log("[FRONTEND] Toggle NEW response body:", responseData);

      if (!res.ok) {
        throw new Error(responseData.message || responseData.error || "Failed to toggle badge");
      }
      fetchBulletins();
    } catch (error) {
      console.error("[FRONTEND] ❌ Error toggling badge:", error);
      showToast(error instanceof Error ? error.message : "Failed to toggle badge", "error");
    }
  };

  if (loading) return <div className="admin-spinner" />;

  return (
    <div>
      <div className="admin-topbar">
        <h1>Updates Manager</h1>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>
          <i className="fas fa-plus" /> Add Update
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Badge</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bulletins.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="admin-empty-state">
                    <i className="fas fa-bullhorn" />
                    <p>No updates yet. Add your first update!</p>
                  </div>
                </td>
              </tr>
            ) : (
              bulletins.map((bulletin) => (
                <tr key={bulletin._id}>
                  <td style={{ fontWeight: 600 }}>{bulletin.title}</td>
                  <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {bulletin.description}
                  </td>
                  <td>{new Date(bulletin.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={`admin-btn admin-btn--sm ${bulletin.isNew ? "admin-btn--primary" : "admin-btn--ghost"}`}
                      onClick={() => toggleNew(bulletin)}
                      title={bulletin.isNew ? "Click to remove NEW badge" : "Click to mark as NEW"}
                    >
                      {bulletin.isNew ? "NEW ✓" : "Mark NEW"}
                    </button>
                  </td>
                  <td>
                    <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => openEdit(bulletin)}>
                      <i className="fas fa-edit" />
                    </button>
                    <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDelete(bulletin._id)}>
                      <i className="fas fa-trash" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{editing ? "Edit Update" : "Add Update"}</h3>
              <button className="admin-modal__close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-form-group">
                <label>Title</label>
                <input
                  className="admin-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Update title"
                />
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  className="admin-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description"
                />
              </div>
              <div className="admin-form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="admin-input"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                  />
                  Show &quot;NEW&quot; badge
                </label>
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave}>
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}
