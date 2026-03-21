"use client";

interface StaffMember {
    name: string;
    role: string;
    icon: string;
    color: string;
}

const staff: StaffMember[] = [
    {
        name: "Pawan Kumar",
        role: "Centre Manager",
        icon: "fas fa-user-tie",
        color: "#2563eb",
    },
    {
        name: "Suman",
        role: "Center Manager",
        icon: "fas fa-chalkboard-teacher",
        color: "#16a34a",
    },
    {
        name: "Baljeet Kaur",
        role: "Assistant",
        icon: "fas fa-headset",
        color: "#0891b2",
    },
];

export default function StaffSection() {
    return (
        <section className="staff-section">
            <div className="container mx-auto px-4">
                <div className="staff-header scroll-reveal">
                    <h2 className="staff-title">Meet Our Team</h2>
                    <div className="staff-title-bar"></div>
                    <p className="staff-subtitle">
                        Dedicated professionals committed to serving the community with excellence.
                    </p>
                </div>

                <div className="staff-grid">
                    {staff.map((member, i) => (
                        <div
                            key={member.name}
                            className="staff-card scroll-reveal"
                            style={{ transitionDelay: `${i * 0.15}s` }}
                        >
                            <div className="staff-card__avatar" style={{ background: `linear-gradient(135deg, ${member.color}22, ${member.color}11)` }}>
                                <div className="staff-card__icon-circle" style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}cc)` }}>
                                    <i className={member.icon}></i>
                                </div>
                            </div>
                            <div className="staff-card__info">
                                <h3 className="staff-card__name">{member.name}</h3>
                                <p className="staff-card__role">{member.role}</p>
                            </div>
                            <div className="staff-card__accent" style={{ background: `linear-gradient(90deg, ${member.color}, transparent)` }}></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
