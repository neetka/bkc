"use client";

import { services } from "@/data/services";

export default function ServicesGrid() {
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
                            key={service.id}
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
