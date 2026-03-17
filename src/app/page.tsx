"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Loading from '@/components/Loading';
import HeroSlideshow from '@/components/HeroSlideshow';
import AboutSection from '@/components/AboutSection';
import ServicesGrid from '@/components/ServicesGrid';
import WhyChooseUs from '@/components/WhyChooseUs';
import Gallery from '@/components/Gallery';
import ImpactCounters from '@/components/ImpactCounters';
import StaffSection from '@/components/StaffSection';
import TestimonialsSlider from '@/components/TestimonialsSlider';
import ScrollReveal from '@/components/ScrollReveal';
import EnquiryForm from '@/components/EnquiryForm';
import JoinSection from '@/components/JoinSection';
import BulletinCard from '@/components/BulletinCard';
import RequiredDocuments from '@/components/RequiredDocuments';
import { bulletins as staticBulletins } from '@/data/bulletins';

interface Bulletin {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  date: string;
  isNew: boolean;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [bulletins, setBulletins] = useState<Bulletin[]>(staticBulletins);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    // Fetch bulletins from API — fall back to static data if unavailable
    fetch('/api/bulletins')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBulletins(data);
        }
      })
      .catch(() => {
        // Keep static bulletins on API failure
      });

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <ScrollReveal />

      {/* Hero Section - Slideshow */}
      <HeroSlideshow />

      {/* About Us */}
      <AboutSection />

      {/* Services */}
      <ServicesGrid />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Impact Counters */}
      <ImpactCounters />

      {/* Gallery */}
      <Gallery />

      {/* Bulletin */}
      <section id="bulletin" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 scroll-reveal">Latest Updates</h2>
          <div className="max-w-4xl mx-auto bulletin-grid">
            {bulletins.map((bulletin, i) => (
              <div key={bulletin._id || bulletin.id || i} className="scroll-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <BulletinCard bulletin={bulletin} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Centre */}
      <JoinSection />

      {/* Required Documents */}
      <RequiredDocuments />

      {/* Staff / Team */}
      <StaffSection />

      {/* Testimonials */}
      <TestimonialsSlider />

      {/* Contact */}
      <section id="contact" className="contact-section">
        {/* Decorative shapes */}
        <div className="join-shapes" aria-hidden="true">
          <div className="join-shape join-shape--1" />
          <div className="join-shape join-shape--2" />
          <div className="join-shape join-shape--3" />
        </div>

        <div className="container mx-auto px-4 scroll-reveal" style={{ position: "relative", zIndex: 2 }}>
          {/* Section header */}
          <div className="join-header">
            <span className="join-badge">✦ Get In Touch</span>
            <h2 className="join-title">Contact Us</h2>
            <div className="join-title-bar" />
            <p className="join-subtitle">
              Have questions? We&apos;d love to hear from you. Reach out and we&apos;ll respond as soon as we can.
            </p>
          </div>

          <div className="join-layout">
            {/* Left — contact info */}
            <div className="join-left">
              <h3 className="join-left-heading">We&apos;re Here to Help</h3>
              <p className="join-left-desc">
                Visit us at our centre or get in touch through any of the channels below. We&apos;re available Monday through Saturday.
              </p>

              <ul className="join-bullets" style={{ gap: "1rem", marginTop: "0.75rem" }}>
                <li className="join-bullet-item">
                  <span className="join-bullet-icon">
                    <i className="fas fa-map-marker-alt" />
                  </span>
                  <span><strong>Address:</strong> Baghpur, Rural Area</span>
                </li>
                <li className="join-bullet-item">
                  <span className="join-bullet-icon">
                    <i className="fas fa-phone" />
                  </span>
                  <span><strong>Phone:</strong> +91 9417784809</span>
                </li>
                <li className="join-bullet-item">
                  <span className="join-bullet-icon">
                    <i className="fas fa-clock" />
                  </span>
                  <span><strong>Office Hours:</strong> Mon-Sat 9AM-5PM</span>
                </li>
                <li className="join-bullet-item">
                  <span className="join-bullet-icon">
                    <i className="fab fa-whatsapp" />
                  </span>
                  <span><strong>WhatsApp:</strong> <a href="https://wa.me/919417784809" className="text-blue-600 hover:underline">+91 9417784809</a></span>
                </li>
              </ul>

              {/* Map */}
              <div style={{ borderRadius: "1rem", overflow: "hidden", marginTop: "0.5rem", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d144.9630576153168!3d-37.81410771958742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d1f9c2e0b!2sMelbourne%20CBD%2C%20Victoria%2C%20Australia!5e0!3m2!1sen!2s!4v1643123456789!5m2!1sen!2s"
                  width="100%"
                  height="200"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* Right — form */}
            <div className="join-right">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul>
                <li><a href="#" className="hover:underline">Home</a></li>
                <li><a href="#" className="hover:underline">Services</a></li>
                <li><a href="#" className="hover:underline">Courses</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul>
                <li>Government Services</li>
                <li>Computer Training</li>
                <li>Document Assistance</li>
                <li>Online Applications</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <p>Baghpur</p>
              <p>+91 9417784809</p>
              <p>cscbaghpur@gmail.com</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <p>Social media links</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <p>&copy; 2024 Common Services Centre Baghpur. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sticky WhatsApp Button */}
      <a
        href="https://wa.me/919417784809"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
      >
        <i className="fab fa-whatsapp text-2xl"></i>
      </a>
    </div>
  );
}