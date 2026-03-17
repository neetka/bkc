"use client";

import { useState, useEffect, useCallback, useRef, TouchEvent } from "react";
import { services } from "@/data/services";

export default function ServicesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState(0); // -1 left, 1 right, 0 initial
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const total = services.length;

  // Intersection Observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1, -1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1, 1), [activeIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goPrev, goNext]);

  // Touch events
  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
  };

  // Compute card style based on offset from active
  const getCardStyle = (index: number) => {
    let offset = index - activeIndex;
    // Wrap for circular
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const absOffset = Math.abs(offset);
    const sign = offset < 0 ? -1 : offset > 0 ? 1 : 0;

    if (absOffset > 3) {
      return {
        transform: `translateX(${sign * 140}%) scale(0.5)`,
        opacity: 0,
        filter: "blur(6px)",
        zIndex: 0,
        pointerEvents: "none" as const,
      };
    }

    const configs: Record<
      number,
      { tx: number; scale: number; opacity: number; blur: number; z: number }
    > = {
      0: { tx: 0, scale: 1, opacity: 1, blur: 0, z: 50 },
      1: { tx: 62, scale: 0.88, opacity: 0.7, blur: 1, z: 40 },
      2: { tx: 110, scale: 0.76, opacity: 0.45, blur: 2.5, z: 30 },
      3: { tx: 140, scale: 0.65, opacity: 0.2, blur: 4, z: 20 },
    };

    const cfg = configs[absOffset];

    // Parallax: icon shifts slightly opposite on transition
    const parallaxShift = direction * absOffset * 6;

    return {
      transform: `translateX(${sign * cfg.tx}%) scale(${cfg.scale})`,
      opacity: cfg.opacity,
      filter: `blur(${cfg.blur}px)`,
      zIndex: cfg.z,
      pointerEvents: (absOffset === 0 ? "auto" : "none") as "auto" | "none",
      "--parallax-x": `${parallaxShift}px`,
    } as React.CSSProperties;
  };

  const service = services[activeIndex];

  return (
    <div ref={containerRef} className="services-carousel-wrapper">
      {/* Carousel viewport */}
      <div
        className="carousel-viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="carousel-track">
          {services.map((svc, i) => {
            const offset = i - activeIndex;
            let normalizedOffset = offset;
            if (normalizedOffset > total / 2) normalizedOffset -= total;
            if (normalizedOffset < -total / 2) normalizedOffset += total;
            const isActive = i === activeIndex;

            return (
              <div
                key={svc.id}
                className={`carousel-card ${isVisible ? "carousel-card--visible" : ""} ${isActive ? "carousel-card--active" : ""}`}
                style={{
                  ...getCardStyle(i),
                  transitionDelay: !isVisible ? `${i * 0.08}s` : "0s",
                }}
                onClick={() => {
                  if (!isActive) {
                    goTo(i, normalizedOffset > 0 ? 1 : -1);
                  }
                }}
              >
                <div
                  className="carousel-card__icon"
                  style={{
                    transform: `translateX(var(--parallax-x, 0px))`,
                  }}
                >
                  <i className={svc.icon}></i>
                </div>
                <h3 className="carousel-card__title">{svc.title}</h3>
                <p className="carousel-card__desc">{svc.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        className="carousel-nav carousel-nav--prev"
        onClick={goPrev}
        aria-label="Previous service"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className="carousel-nav carousel-nav--next"
        onClick={goNext}
        aria-label="Next service"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="carousel-dots">
        {services.map((svc, i) => (
          <button
            key={svc.id}
            className={`carousel-dot ${i === activeIndex ? "carousel-dot--active" : ""}`}
            onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
            aria-label={`Go to ${svc.title}`}
          />
        ))}
      </div>
    </div>
  );
}
