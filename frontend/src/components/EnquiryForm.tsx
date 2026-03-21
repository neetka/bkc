"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message || "No message provided",
        },
        "H-Fq1Md9KGccWpwwT"
      );

      console.log("Email sent:", response);

      // Also save to database
      try {
        await fetch(`${API_URL}/api/submissions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "enquiry",
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message || "No message provided",
          }),
        });
      } catch (dbError) {
        console.error("DB save error:", dbError);
      }

      alert("Your enquiry has been sent!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS error:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="join-form-card">
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#1e293b",
          marginBottom: "1.25rem",
        }}
      >
        Send Us a Message
      </h3>

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
        <label className="join-floating-label">Message</label>
      </div>

      <button type="submit" className="join-submit-btn" disabled={loading}>
        <span>{loading ? "Sending..." : "Submit Enquiry"}</span>
        {!loading && <i className="fas fa-paper-plane join-submit-icon" />}
      </button>
    </form>
  );
}
