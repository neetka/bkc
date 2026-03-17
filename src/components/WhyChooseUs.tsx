"use client";

interface Feature {
    icon: string;
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        icon: "fas fa-shield-alt",
        title: "Trusted Government Service Centre",
        description: "Officially authorised CSC providing reliable and verified government services to citizens.",
    },
    {
        icon: "fas fa-users",
        title: "Experienced Staff Assistance",
        description: "Our trained and experienced team ensures smooth processing of all your applications.",
    },
    {
        icon: "fas fa-bolt",
        title: "Fast & Reliable Document Services",
        description: "Quick turnaround on all document processing with accurate, hassle-free service.",
    },
    {
        icon: "fas fa-graduation-cap",
        title: "Affordable Computer Training",
        description: "Quality computer education courses at affordable rates for students and professionals.",
    },
    {
        icon: "fas fa-handshake",
        title: "Friendly Support for Rural Citizens",
        description: "Patient, step-by-step guidance for citizens unfamiliar with digital processes.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="why-choose-section">
            <div className="container mx-auto px-4">
                <div className="why-choose-header scroll-reveal">
                    <h2 className="why-choose-title">Why Choose CSC Baghpur</h2>
                    <div className="why-choose-title-bar"></div>
                    <p className="why-choose-subtitle">
                        Trusted by thousands of citizens for reliable government services and computer education.
                    </p>
                </div>

                <div className="why-choose-grid">
                    {features.map((feature, i) => (
                        <div
                            key={feature.title}
                            className="why-choose-card scroll-reveal"
                            style={{ transitionDelay: `${i * 0.1}s` }}
                        >
                            <div className="why-choose-card__icon">
                                <i className={feature.icon}></i>
                            </div>
                            <h3 className="why-choose-card__title">{feature.title}</h3>
                            <p className="why-choose-card__desc">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
