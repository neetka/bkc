"use client";

import { useState, useEffect } from "react";
import { getAuthHeaders } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Stats {
  services: number;
  bulletins: number;
  gallery: number;
  submissions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ services: 0, bulletins: 0, gallery: 0, submissions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const headers = getAuthHeaders();
        const [servicesRes, bulletinsRes, galleryRes, submissionsRes] = await Promise.all([
          fetch(`${API_URL}/api/services`),
          fetch(`${API_URL}/api/bulletins`),
          fetch(`${API_URL}/api/gallery`),
          fetch(`${API_URL}/api/submissions`, { headers }),
        ]);
        const [services, bulletins, gallery, submissions] = await Promise.all([
          servicesRes.json(),
          bulletinsRes.json(),
          galleryRes.json(),
          submissionsRes.json(),
        ]);
        setStats({
          services: Array.isArray(services) ? services.length : 0,
          bulletins: Array.isArray(bulletins) ? bulletins.length : 0,
          gallery: Array.isArray(gallery) ? gallery.length : 0,
          submissions: Array.isArray(submissions) ? submissions.length : 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="admin-spinner" />;

  return (
    <div>
      <div className="admin-topbar">
        <h1>Dashboard</h1>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon admin-stat-card__icon--blue">
            <i className="fas fa-concierge-bell" />
          </div>
          <div className="admin-stat-card__info">
            <h3>Services</h3>
            <p>{stats.services}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon admin-stat-card__icon--green">
            <i className="fas fa-bullhorn" />
          </div>
          <div className="admin-stat-card__info">
            <h3>Updates</h3>
            <p>{stats.bulletins}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon admin-stat-card__icon--purple">
            <i className="fas fa-images" />
          </div>
          <div className="admin-stat-card__info">
            <h3>Gallery Images</h3>
            <p>{stats.gallery}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon admin-stat-card__icon--orange">
            <i className="fas fa-inbox" />
          </div>
          <div className="admin-stat-card__info">
            <h3>Submissions</h3>
            <p>{stats.submissions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
