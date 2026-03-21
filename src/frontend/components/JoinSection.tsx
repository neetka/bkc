"use client";

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

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
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await emailjs.send(
        "service_6bwkkqq",
        "template_8uh2qea",
        {
          join_type: joinType,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          preferred_role: showJobDropdown ? formData.preferredRole : "N/A",
          message: formData.message || "No message provided",
        },
        "H-Fq1Md9KGccWpwwT"
      );

      console.log("Email sent:", response);

      // Also save to database
      try {
        await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "join",
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message || "No message provided",
            joinType,
            preferredRole: showJobDropdown ? formData.preferredRole : "N/A",
          }),
        });
      } catch (dbError) {
        console.error("DB save error:", dbError);
      }

      setSubmitted(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        preferredRole: "",
      });

      setJoinType("course");
    } catch (error) {
      console.error("EmailJS error:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      preferredRole: "",
    });
    setJoinType("course");
  };

  return (
    <section id="join" className="join-section">
      {/* Decorative blurred shapes */}
      <div className="join-shapes" aria-hidden="true">
        <div className="join-shape join-shape--1" />
        <div className="join-shape join-shape--2" />
        <div className="join-shape join-shape--3" />
      </div>

      <div className="container mx-auto px-4" style={{ position: "relative", zIndex: 2 }}>
        {/* Section header */}
        <div className="join-header scroll-reveal">
          <span className="join-badge">✦ Join Us</span>
          <h2 className="join-title">Join CSC Today</h2>
          <div className="join-title-bar" />
          <p className="join-subtitle">
            Start your journey in computer skills and government services
          </p>
        </div>

        {/* 2-column layout */}
        <div className="join-layout">
          {/* Left column — info */}
          <div className="join-left scroll-reveal">
            <h3 className="join-left-heading">
              Start Your Journey with CSC&nbsp;Baghpur
            </h3>
            <p className="join-left-desc">
              Whether you want to learn computer skills or explore job
              opportunities, CSC Baghpur is your gateway to a brighter future.
              Join hundreds of students and professionals who started here.
            </p>

            <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginTop: "0.5rem" }}>
              Why Join Us?
            </h4>
            <ul className="join-bullets">
              {bullets.map((bullet, index) => (
                <li key={index} className="join-bullet-item">
                  <span className="join-bullet-icon">
                    <i className="fas fa-check" />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column — form */}
          <div className="join-right scroll-reveal" style={{ transitionDelay: "0.15s" }}>
            {submitted ? (
              <div className="join-form-card join-success">
                {/* Animated checkmark SVG */}
                <div className="join-success-check">
                  <svg className="join-success-svg" viewBox="0 0 52 52" fill="none">
                    <circle
                      className="join-success-circle"
                      cx="26" cy="26" r="25"
                      fill="none"
                    />
                    <path
                      className="join-success-path"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>
                </div>
                <h3 className="join-success-title">Thank You!</h3>
                <p className="join-success-msg">
                  Your application has been submitted successfully. We&apos;ll get back to you soon.
                </p>
                <button onClick={handleReset} className="join-reset-btn">
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="join-form-card">
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e293b", marginBottom: "1.25rem" }}>
                  Join the Centre
                </h3>

                {/* Role toggle cards */}
                <p className="join-role-label">I want to join for:</p>
                <div className="join-role-toggle">
                  {/* Course */}
                  <label
                    className={`join-role-option${joinType === "course" ? " join-role-option--active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="joinType"
                      value="course"
                      checked={joinType === "course"}
                      onChange={(e) => setJoinType(e.target.value as JoinType)}
                      className="sr-only"
                    />
                    <i className="fas fa-laptop" />
                    <span>Course</span>
                  </label>

                  {/* Job */}
                  <label
                    className={`join-role-option${joinType === "job" ? " join-role-option--active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="joinType"
                      value="job"
                      checked={joinType === "job"}
                      onChange={(e) => setJoinType(e.target.value as JoinType)}
                      className="sr-only"
                    />
                    <i className="fas fa-briefcase" />
                    <span>Job</span>
                  </label>

                  {/* Both */}
                  <label
                    className={`join-role-option${joinType === "both" ? " join-role-option--active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="joinType"
                      value="both"
                      checked={joinType === "both"}
                      onChange={(e) => setJoinType(e.target.value as JoinType)}
                      className="sr-only"
                    />
                    <i className="fas fa-layer-group" />
                    <span>Both</span>
                  </label>
                </div>

                {/* Name */}
                <div className="join-floating-group">
                  <i className="fas fa-user join-input-icon" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder=" "
                    className="join-input"
                    required
                  />
                  <label className="join-floating-label">Name</label>
                </div>

                {/* Email */}
                <div className="join-floating-group">
                  <i className="fas fa-envelope join-input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=" "
                    className="join-input"
                    required
                  />
                  <label className="join-floating-label">Email</label>
                </div>

                {/* Phone */}
                <div className="join-floating-group">
                  <i className="fas fa-phone join-input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder=" "
                    className="join-input"
                    required
                  />
                  <label className="join-floating-label">Phone</label>
                </div>

                {/* Preferred Role — conditional */}
                {showJobDropdown && (
                  <div className="join-floating-group join-dropdown-group">
                    <i className="fas fa-id-badge join-input-icon" />
                    <select
                      name="preferredRole"
                      value={formData.preferredRole}
                      onChange={handleChange}
                      className="join-input join-select"
                      required
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <label className="join-floating-label join-floating-label--select">
                      Preferred Role
                    </label>
                  </div>
                )}

                {/* Message */}
                <div className="join-floating-group">
                  <i className="fas fa-comment join-input-icon join-input-icon--textarea" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder=" "
                    className="join-input join-textarea"
                  />
                  <label className="join-floating-label">Message (Optional)</label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="join-submit-btn"
                >
                  <span>{loading ? "Submitting..." : "Submit Application"}</span>
                  <i className={`fas ${loading ? "fa-spinner fa-spin" : "fa-paper-plane"} join-submit-icon`} />
                </button>

                {/* Trust indicators */}
                <div className="join-trust">
                  <span className="join-trust-item">
                    <i className="fas fa-shield-alt" /> Your data is secure &amp; private
                  </span>
                  <span className="join-trust-item">
                    <i className="fas fa-clock" /> We respond within 24 hours
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

