"use client";

import { useState, useEffect } from "react";
import { services as staticServices } from "@/data/services";

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

    useEffect(() => {
        fetch("/api/services")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setServices(data);
                }
                // If API returns empty or error, keep static data
            })
            .catch(() => {
                // Keep static data on API failure
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
                        We offer a wide range of government and digital services to help you with all your documentation needs.
                    </p>
                </div>

                <div className="services-grid">
                    {services.map((service, i) => (
                        <div
                            key={service._id || service.id || i}
                            className="service-card scroll-reveal"
                            style={{ transitionDelay: `${i * 0.08}s` }}
                        >
                            <div className="service-card__icon-wrap">
                                <i className={service.icon}></i>
                            </div>
                            <h3 className="service-card__title">{service.title}</h3>
                            <p className="service-card__desc">{service.description}</p>
                            <div className="service-card__accent"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
