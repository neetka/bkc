"use client";

import { useEffect } from "react";
import { requiredDocuments } from "@/data/documents";
import { services } from "@/data/services";

export default function RequiredDocuments() {
  useEffect(() => {
    // Load AOS CSS
    if (!document.querySelector('link[href*="aos"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/aos@2.3.1/dist/aos.css";
      document.head.appendChild(link);
    }

    // Load AOS JS via CDN script tag and init
    const initAOS = () => {
      if ((window as any).AOS) {
        (window as any).AOS.init({
          duration: 700,
          once: true,
          easing: "ease-out-cubic",
        });
      }
    };

    if (!document.querySelector('script[src*="aos"]')) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/aos@2.3.1/dist/aos.js";
      script.onload = initAOS;
      document.body.appendChild(script);
    } else {
      // Script already loaded, just reinitialize
      initAOS();
    }
  }, []);

  const getServiceInfo = (serviceId: string) => {
    return services.find((s) => s.id === serviceId);
  };

  return (
    <section id="documents" className="docs-section">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="docs-header" data-aos="fade-up">
          <div className="docs-badge">
            <i className="fas fa-folder-open" style={{ marginRight: "0.4rem" }}></i>
            Documents
          </div>
          <h2 className="docs-title">Required Documents</h2>
          <div className="docs-title-bar"></div>
          <p className="docs-subtitle">
            Please bring the following documents for the selected service.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="docs-grid">
          {requiredDocuments.map((doc, i) => {
            const serviceInfo = getServiceInfo(doc.serviceId);
            return (
              <div
                key={doc.serviceId}
                className="docs-card"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                {/* Card Header */}
                <div className="docs-card__header">
                  <div className="docs-card__icon-wrap">
                    <i className={serviceInfo?.icon || "fas fa-file-alt"}></i>
                  </div>
                  <h3 className="docs-card__title">
                    {serviceInfo?.title || doc.serviceId}
                  </h3>
                </div>

                {/* Document List */}
                <div className="docs-card__list">
                  {doc.documents.map((item, index) => (
                    <div key={index} className="docs-card__item">
                      <span className="docs-card__item-icon">
                        <i className={item.icon}></i>
                      </span>
                      <span className="docs-card__item-label">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom accent */}
                <div className="docs-card__accent"></div>
              </div>
            );
          })}
        </div>

        {/* Notice Box */}
        <div className="docs-notice" data-aos="fade-up" data-aos-delay={450}>
          <div className="docs-notice__icon">
            <i className="fas fa-info-circle"></i>
          </div>
          <p className="docs-notice__text">
            <strong>Important:</strong> Please carry original documents along with
            photocopies for verification.
          </p>
        </div>
      </div>
    </section>
  );
}
