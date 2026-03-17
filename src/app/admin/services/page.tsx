"use client";

import { useState, useEffect, useCallback } from "react";

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  order: number;
}

const iconOptions = [
  { value: "fas fa-file-alt", label: "📄 Document" },
  { value: "fas fa-id-card", label: "🪪 ID Card" },
  { value: "fas fa-address-card", label: "📇 Address Card" },
  { value: "fas fa-edit", label: "✏️ Edit" },
  { value: "fas fa-passport", label: "🛂 Passport" },
  { value: "fas fa-car", label: "🚗 Car" },
  { value: "fas fa-building", label: "🏛️ Building" },
  { value: "fas fa-globe", label: "🌐 Globe" },
  { value: "fas fa-laptop", label: "💻 Laptop" },
  { value: "fas fa-graduation-cap", label: "🎓 Education" },
  { value: "fas fa-heartbeat", label: "❤️ Health" },
  { value: "fas fa-money-bill", label: "💰 Finance" },
  { value: "fas fa-shield-alt", label: "🛡️ Shield" },
  { value: "fas fa-users", label: "👥 Users" },
  { value: "fas fa-hospital", label: "🏥 Hospital" },
  { value: "fas fa-home", label: "🏠 Home" },
];

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "fas fa-file-alt",
    category: "government",
  });

  const showToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    } catch {
      showToast("Failed to fetch services", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", description: "", icon: "fas fa-file-alt", category: "government" });
    setShowModal(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setForm({
      title: service.title,
      description: service.description,
      icon: service.icon,
      category: service.category,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      showToast("Please fill all fields", "error");
      return;
    }

    try {
      if (editing) {
        await fetch(`/api/services/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        showToast("Service updated!");
      } else {
        await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        showToast("Service created!");
      }
      setShowModal(false);
      fetchServices();
    } catch {
      showToast("Failed to save service", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      showToast("Service deleted!");
      fetchServices();
    } catch {
      showToast("Failed to delete service", "error");
    }
  };

  const moveService = async (index: number, direction: "up" | "down") => {
    const newServices = [...services];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newServices.length) return;
    [newServices[index], newServices[swapIndex]] = [newServices[swapIndex], newServices[index]];
    setServices(newServices);

    try {
      await fetch("/api/services/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newServices.map((s) => s._id) }),
      });
    } catch {
      showToast("Failed to reorder", "error");
      fetchServices();
    }
  };

  if (loading) return <div className="admin-spinner" />;

  return (
    <div>
      <div className="admin-topbar">
        <h1>Services Manager</h1>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>
          <i className="fas fa-plus" /> Add Service
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Icon</th>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="admin-empty-state">
                    <i className="fas fa-concierge-bell" />
                    <p>No services yet. Add your first service!</p>
                  </div>
                </td>
              </tr>
            ) : (
              services.map((service, index) => (
                <tr key={service._id}>
                  <td>
                    <button
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => moveService(index, "up")}
                      disabled={index === 0}
                    >
                      <i className="fas fa-chevron-up" />
                    </button>
                    <button
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => moveService(index, "down")}
                      disabled={index === services.length - 1}
                    >
                      <i className="fas fa-chevron-down" />
                    </button>
                  </td>
                  <td>
                    <i className={service.icon} style={{ fontSize: "1.25rem", color: "#3b82f6" }} />
                  </td>
                  <td style={{ fontWeight: 600 }}>{service.title}</td>
                  <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {service.description}
                  </td>
                  <td>
                    <span className="admin-badge admin-badge--new">{service.category}</span>
                  </td>
                  <td>
                    <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => openEdit(service)}>
                      <i className="fas fa-edit" />
                    </button>
                    <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDelete(service._id)}>
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
              <h3>{editing ? "Edit Service" : "Add Service"}</h3>
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
                  placeholder="e.g. PAN Card Application"
                />
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  className="admin-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the service"
                />
              </div>
              <div className="admin-form-group">
                <label>Icon</label>
                <select
                  className="admin-select"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label>Category</label>
                <select
                  className="admin-select"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="government">Government</option>
                  <option value="other">Other</option>
                </select>
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

      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}
