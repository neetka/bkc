"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface GalleryImage {
  _id: string;
  src: string;
  alt: string;
  caption: string;
  publicId: string;
  order: number;
}

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [form, setForm] = useState({ alt: "", caption: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setImages(data);
    } catch {
      showToast("Failed to fetch images", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("alt", file.name.replace(/\.[^/.]+$/, ""));
    formData.append("caption", file.name.replace(/\.[^/.]+$/, ""));

    try {
      const res = await fetch("/api/gallery", { method: "POST", body: formData });
      if (res.ok) {
        showToast("Image uploaded!");
        fetchImages();
      } else {
        showToast("Upload failed", "error");
      }
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const openEdit = (image: GalleryImage) => {
    setEditing(image);
    setForm({ alt: image.alt, caption: image.caption });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      await fetch(`/api/gallery/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      showToast("Image updated!");
      setShowModal(false);
      fetchImages();
    } catch {
      showToast("Failed to update", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      showToast("Image deleted!");
      fetchImages();
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const moveImage = async (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newImages.length) return;
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    setImages(newImages);

    try {
      await fetch("/api/gallery/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newImages.map((img) => img._id) }),
      });
    } catch {
      showToast("Failed to reorder", "error");
      fetchImages();
    }
  };

  if (loading) return <div className="admin-spinner" />;

  return (
    <div>
      <div className="admin-topbar">
        <h1>Gallery Manager</h1>
      </div>

      {/* Upload Area */}
      <div
        className="admin-upload-area"
        onClick={() => fileRef.current?.click()}
        style={{ marginBottom: "1.5rem" }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleUpload}
        />
        <i className={uploading ? "fas fa-spinner fa-spin" : "fas fa-cloud-upload-alt"} />
        <p>{uploading ? "Uploading..." : "Click to upload a new image"}</p>
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="admin-empty-state">
          <i className="fas fa-images" />
          <p>No gallery images yet. Upload your first image!</p>
        </div>
      ) : (
        <div className="admin-gallery-grid">
          {images.map((image, index) => (
            <div key={image._id} className="admin-gallery-card">
              <img src={image.src} alt={image.alt} />
              <div className="admin-gallery-card__info">
                <p className="admin-gallery-card__caption">{image.caption}</p>
                <div className="admin-gallery-card__actions">
                  <button
                    className="admin-btn admin-btn--ghost admin-btn--sm"
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <i className="fas fa-arrow-left" />
                  </button>
                  <button
                    className="admin-btn admin-btn--ghost admin-btn--sm"
                    onClick={() => moveImage(index, "down")}
                    disabled={index === images.length - 1}
                    title="Move down"
                  >
                    <i className="fas fa-arrow-right" />
                  </button>
                  <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => openEdit(image)} title="Edit">
                    <i className="fas fa-edit" />
                  </button>
                  <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDelete(image._id)} title="Delete">
                    <i className="fas fa-trash" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>Edit Image</h3>
              <button className="admin-modal__close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="admin-modal__body">
              {editing && (
                <img
                  src={editing.src}
                  alt={editing.alt}
                  style={{ width: "100%", borderRadius: "0.5rem", marginBottom: "1rem" }}
                />
              )}
              <div className="admin-form-group">
                <label>Alt Text</label>
                <input
                  className="admin-input"
                  value={form.alt}
                  onChange={(e) => setForm({ ...form, alt: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label>Caption</label>
                <input
                  className="admin-input"
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                />
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave}>
                Save
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
