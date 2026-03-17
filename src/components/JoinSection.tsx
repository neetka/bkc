"use client";

import { useState, useRef } from "react";

type JoinType = "course" | "job" | "both";

const roleOptions = [
  { value: "", label: "Select a role…" },
  { value: "instructor", label: "Computer Instructor" },
  { value: "assistant", label: "Service Assistant" },
  { value: "data-entry", label: "Data Entry Operator" },
];

const bullets = [
  "Learn computer skills",
  "Work on real government services",
  "Gain practical experience",
  "Build career opportunities",
];

export default function JoinSection() {
  const [joinType, setJoinType] = useState<JoinType>("course");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredRole: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  const showJobDropdown = joinType === "job" || joinType === "both";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: "", email: "", phone: "", message: "", preferredRole: "" });
    setJoinType("course");
  };

  return (
    <section id="join" className="join-section">
      {/* Decorative shapes */}
      <div className="join-shapes" aria-hidden="true">
        <div className="join-shape join-shape--1" />
        <div className="join-shape join-shape--2" />
        <div className="join-shape join-shape--3" />
      </div>

      <div className="container mx-auto px-4" style={{ position: "relative", zIndex: 2 }}>
        {/* Section header */}
        <div className="join-header scroll-reveal">
          <span className="join-badge">✦ Join Us</span>
          <h2 className="join-title">Join the Centre</h2>
          <div className="join-title-bar" />
          <p className="join-subtitle">
            Enrol in our courses or explore career opportunities at CSC Baghpur
          </p>
        </div>

        {/* Two-column layout */}
        <div className="join-layout">
          {/* ---- LEFT COLUMN ---- */}
          <div className="join-left scroll-reveal">
            <div className="join-image-container">
              <img
                src="/images/join-centre.png"
                alt="CSC Baghpur computer training lab"
                className="join-image"
                loading="lazy"
              />
            </div>

            <h3 className="join-left-heading">
              Start Your Journey with CSC Baghpur
            </h3>
            <p className="join-left-desc">
              Join our centre to learn computer skills or work with us in
              providing digital services.
            </p>

            <ul className="join-bullets">
              {bullets.map((b, i) => (
                <li
                  key={i}
                  className="join-bullet-item scroll-reveal"
                  style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
                >
                  <span className="join-bullet-icon">
                    <i className="fas fa-check" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* ---- RIGHT COLUMN ---- */}
          <div className="join-right scroll-reveal" style={{ transitionDelay: "0.15s" }}>
            <div className="join-form-card">
              {submitted ? (
                /* ---------- SUCCESS STATE ---------- */
                <div className="join-success">
                  <div className="join-success-check">
                    <svg viewBox="0 0 52 52" className="join-success-svg">
                      <circle
                        className="join-success-circle"
                        cx="26"
                        cy="26"
                        r="24"
                        fill="none"
                      />
                      <path
                        className="join-success-path"
                        d="M14 27l7 7 16-16"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <h3 className="join-success-title">Thank you!</h3>
                  <p className="join-success-msg">
                    We will contact you soon.
                  </p>
                  <button
                    type="button"
                    className="join-reset-btn"
                    onClick={handleReset}
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                /* ---------- FORM ---------- */
                <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
                  {/* Role selection */}
                  <p className="join-role-label">I want to join for:</p>
                  <div className="join-role-toggle">
                    {(
                      [
                        { key: "course", icon: "fas fa-laptop-code", label: "Computer Course" },
                        { key: "job", icon: "fas fa-briefcase", label: "Job Opportunity" },
                        { key: "both", icon: "fas fa-layer-group", label: "Both" },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        className={`join-role-option${joinType === opt.key ? " join-role-option--active" : ""}`}
                        onClick={() => setJoinType(opt.key)}
                      >
                        <i className={opt.icon} />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Name */}
                  <div className="join-floating-group scroll-reveal" style={{ transitionDelay: "0.2s" }}>
                    <span className="join-input-icon"><i className="fas fa-user" /></span>
                    <input
                      id="join-name"
                      type="text"
                      name="name"
                      className="join-input"
                      placeholder=" "
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="join-name" className="join-floating-label">Full Name</label>
                  </div>

                  {/* Email */}
                  <div className="join-floating-group scroll-reveal" style={{ transitionDelay: "0.25s" }}>
                    <span className="join-input-icon"><i className="fas fa-envelope" /></span>
                    <input
                      id="join-email"
                      type="email"
                      name="email"
                      className="join-input"
                      placeholder=" "
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="join-email" className="join-floating-label">Email Address</label>
                  </div>

                  {/* Phone */}
                  <div className="join-floating-group scroll-reveal" style={{ transitionDelay: "0.3s" }}>
                    <span className="join-input-icon"><i className="fas fa-phone" /></span>
                    <input
                      id="join-phone"
                      type="tel"
                      name="phone"
                      className="join-input"
                      placeholder=" "
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="join-phone" className="join-floating-label">Phone Number</label>
                  </div>

                  {/* Preferred Role (conditional) */}
                  {showJobDropdown && (
                    <div className="join-floating-group join-dropdown-group scroll-reveal" style={{ transitionDelay: "0.35s" }}>
                      <span className="join-input-icon"><i className="fas fa-id-badge" /></span>
                      <select
                        id="join-role"
                        name="preferredRole"
                        className="join-input join-select"
                        value={formData.preferredRole}
                        onChange={handleChange}
                        required
                      >
                        {roleOptions.map((r) => (
                          <option key={r.value} value={r.value} disabled={r.value === ""}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="join-role" className="join-floating-label join-floating-label--select">
                        Preferred Role
                      </label>
                    </div>
                  )}

                  {/* Message */}
                  <div className="join-floating-group scroll-reveal" style={{ transitionDelay: showJobDropdown ? "0.4s" : "0.35s" }}>
                    <span className="join-input-icon join-input-icon--textarea"><i className="fas fa-comment-dots" /></span>
                    <textarea
                      id="join-message"
                      name="message"
                      className="join-input join-textarea"
                      placeholder=" "
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                    />
                    <label htmlFor="join-message" className="join-floating-label">Message (optional)</label>
                  </div>

                  {/* Submit */}
                  <button type="submit" className="join-submit-btn scroll-reveal" style={{ transitionDelay: showJobDropdown ? "0.45s" : "0.4s" }}>
                    <span>Submit Enquiry</span>
                    <i className="fas fa-arrow-right join-submit-icon" />
                  </button>

                  {/* Trust indicators */}
                  <div className="join-trust scroll-reveal" style={{ transitionDelay: showJobDropdown ? "0.5s" : "0.45s" }}>
                    <p className="join-trust-item">
                      <i className="fas fa-shield-alt" /> Your information is सुरक्षित and confidential
                    </p>
                    <p className="join-trust-item">
                      <i className="fas fa-clock" /> We will contact you within 24 hours
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
