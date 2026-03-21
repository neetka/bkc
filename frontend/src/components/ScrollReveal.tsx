"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("scroll-reveal--visible");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        );

        const elements = document.querySelectorAll(".scroll-reveal");
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return null; // This is a utility component, renders nothing
}
