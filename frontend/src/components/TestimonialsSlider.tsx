"use client";

import { useState, useEffect } from "react";
import { testimonials, Testimonial } from "@/data/testimonials";

export default function TestimonialsSlider() {
    const [current, setCurrent] = useState(0);
    const total = testimonials.length;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % total);
        }, 5000);
        return () => clearInterval(timer);
    }, [total]);

    return (
        <section id="testimonials" className="py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                    What Our Customers Say
                </h2>
                <div className="testimonials-slider">
                    <div className="testimonials-track">
                        {testimonials.map((t, i) => {
                            let offset = i - current;
                            if (offset > total / 2) offset -= total;
                            if (offset < -total / 2) offset += total;
                            const isActive = i === current;

                            return (
                                <div
                                    key={t.id}
                                    className={`testimonial-slide ${isActive ? "testimonial-slide--active" : ""}`}
                                    style={{
                                        transform: `translateX(${offset * 110}%) scale(${isActive ? 1 : 0.85})`,
                                        opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.5,
                                        zIndex: isActive ? 10 : 5 - Math.abs(offset),
                                        filter: isActive ? "none" : "blur(1px)",
                                    }}
                                >
                                    <div className="testimonial-stars">
                                        {[...Array(5)].map((_, si) => (
                                            <span
                                                key={si}
                                                className={si < t.rating ? "star--filled" : "star--empty"}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <p className="testimonial-message">&ldquo;{t.message}&rdquo;</p>
                                    <p className="testimonial-name">— {t.name}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="testimonial-dots">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                className={`testimonial-dot ${i === current ? "testimonial-dot--active" : ""}`}
                                onClick={() => setCurrent(i)}
                                aria-label={`Go to testimonial ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
