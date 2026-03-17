"use client";

import { useState, useEffect } from "react";

interface GalleryImageData {
    _id?: string;
    src: string;
    alt: string;
    caption: string;
}

const staticGalleryImages: GalleryImageData[] = [
    { src: "/images/gallery-1.png", alt: "Computer Training Lab", caption: "Our Computer Training Lab" },
    { src: "/images/gallery-2.png", alt: "Service Desk", caption: "Service Desk" },
    { src: "/images/gallery-3.png", alt: "Digital Services Center", caption: "Digital Services" },
    { src: "/images/gallery-4.png", alt: "Form Filling Assistance", caption: "Form Filling Assistance" },
];

export default function Gallery() {
    const [galleryImages, setGalleryImages] = useState<GalleryImageData[]>(staticGalleryImages);
    const [lightbox, setLightbox] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/gallery")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setGalleryImages(data);
                }
                // If API fails or returns empty, keep static images
            })
            .catch(() => {
                // Keep static data on API failure
            });
    }, []);

    const openLightbox = (index: number) => setLightbox(index);
    const closeLightbox = () => setLightbox(null);
    const goNext = () =>
        setLightbox((prev) => (prev !== null ? (prev + 1) % galleryImages.length : null));
    const goPrev = () =>
        setLightbox((prev) =>
            prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null
        );

    return (
        <section id="gallery" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                    Our Centre Gallery
                </h2>
                <div className="gallery-grid">
                    {galleryImages.map((img, i) => (
                        <div
                            key={img._id || i}
                            className="gallery-item scroll-reveal"
                            onClick={() => openLightbox(i)}
                        >
                            <img src={img.src} alt={img.alt} loading="lazy" />
                            <div className="gallery-item__overlay">
                                <span className="gallery-item__caption">{img.caption}</span>
                                <i className="fas fa-search-plus gallery-item__icon"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox !== null && (
                <div className="lightbox" onClick={closeLightbox}>
                    <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox__close" onClick={closeLightbox} aria-label="Close">
                            <i className="fas fa-times"></i>
                        </button>
                        <button className="lightbox__nav lightbox__nav--prev" onClick={goPrev} aria-label="Previous">
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <img
                            src={galleryImages[lightbox].src}
                            alt={galleryImages[lightbox].alt}
                            className="lightbox__image"
                        />
                        <p className="lightbox__caption">{galleryImages[lightbox].caption}</p>
                        <button className="lightbox__nav lightbox__nav--next" onClick={goNext} aria-label="Next">
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
