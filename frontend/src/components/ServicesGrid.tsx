"use client";

import { useState, useEffect } from "react";
import { services as staticServices } from "@/data/services";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Service {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  order?: number;
}

export default function ServicesGrid() {
  const [services, setServices] = useState<Service[]>(staticServices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/services`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        } else {
          setError("No services data available from server");
        }
      })
      .catch((error) => {
        console.error("❌ Failed to fetch services:", error);
        setError("Unable to load services. Showing cached data.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="services" className="services-section">
      <div className="container mx-auto px-4">
        <div className="services-header scroll-reveal">
          <h2 className="services-title">Our Services</h2>
          <div className="services-title-bar"></div>
          <p className="services-subtitle">
            We offer a wide range of government and digital services to help you
            with all your documentation needs.
          </p>
          {error && (
            <p className="text-center text-amber-600 mt-2 text-sm">
              ⚠️ {error}
            </p>
          )}
        </div>

        <div className="services-grid">
          {services && services.length > 0 ? (
            services.map((service, i) => {
              return (
                <div
                  key={service._id || service.id || i}
                  className="service-card"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className="service-card__icon-wrap">
                    <i className={service.icon}></i>
                  </div>
                  <h3 className="service-card__title">{service.title}</h3>
                  <p className="service-card__desc">{service.description}</p>
                  <div className="service-card__accent"></div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full py-8">
              {loading ? "Loading services..." : "No services available"}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
