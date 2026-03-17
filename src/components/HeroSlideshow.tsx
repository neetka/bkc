"use client";

import { useState, useEffect } from "react";

const slides = [
    {
        image: "/images/hero-1.png",
        alt: "Computer Training Lab",
    },
    {
        image: "/images/hero-2.png",
        alt: "Government Services",
    },
    {
        image: "/images/hero-3.png",
        alt: "Digital Services",
    },
];

export default function HeroSlideshow() {
    const [current, setCurrent] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="home" className="hero-slideshow">
            {/* Background slides */}
            {slides.map((slide, i) => (
                <div
                    key={i}
                    className={`hero-slide ${i === current ? "hero-slide--active" : ""}`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                    aria-hidden={i !== current}
                />
            ))}

            {/* Gradient overlay */}
            <div className="hero-overlay" />

            {/* Floating decorative shapes */}
            <div className="hero-shapes" aria-hidden="true">
                <div className="hero-shape hero-shape--1" />
                <div className="hero-shape hero-shape--2" />
                <div className="hero-shape hero-shape--3" />
                <div className="hero-shape hero-shape--4" />
            </div>

            {/* Content */}
            <div className={`hero-content ${isLoaded ? "hero-content--visible" : ""}`}>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    Common Services Centre Baghpur
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                    Your trusted partner for government services and computer training in
                    rural areas
                </p>
                <div className="space-x-4">
                    <a
                        href="#services"
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 inline-block hover:shadow-lg hover:-translate-y-0.5"
                    >
                        Explore Services
                    </a>
                    <a
                        href="#join"
                        className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 inline-block"
                    >
                        Join Now
                    </a>
                </div>

                {/* Slide indicators */}
                <div className="hero-indicators">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            className={`hero-indicator ${i === current ? "hero-indicator--active" : ""}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
