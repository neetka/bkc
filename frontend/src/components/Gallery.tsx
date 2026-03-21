"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lightbox, setLightbox] = useState<number | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/api/gallery`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setGalleryImages(data);
                    console.log(`✅ Loaded ${data.length} gallery images from API`);
                } else {
                    console.warn('⚠️ API returned empty gallery array, using static images');
                    setError('No gallery images available from server');
                }
            })
            .catch((error) => {
                console.error('❌ Failed to fetch gallery images:', error);
                setError('Unable to load gallery images. Showing cached images.');
            })
            .finally(() => setLoading(false));
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
                {error && (
                    <p className="text-center text-amber-600 mb-4 text-sm">
                        ⚠️ {error}
                    </p>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading gallery...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {galleryImages.map((image, index) => (
                            <div
                                key={image._id || index}
                                className="gallery-item cursor-pointer transform hover:scale-105 transition-transform duration-300"
                                onClick={() => openLightbox(index)}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-48 object-cover rounded-lg shadow-md"
                                    loading="lazy"
                                />
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 text-center">{image.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Lightbox */}
                {lightbox !== null && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeLightbox}>
                        <div className="relative max-w-4xl max-h-full p-4">
                            <img
                                src={galleryImages[lightbox].src}
                                alt={galleryImages[lightbox].alt}
                                className="max-w-full max-h-full object-contain"
                            />
                            <button
                                className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
                                onClick={closeLightbox}
                            >
                                ×
                            </button>
                            {galleryImages.length > 1 && (
                                <>
                                    <button
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
                                        onClick={goPrev}
                                    >
                                        ‹
                                    </button>
                                    <button
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
                                        onClick={goNext}
                                    >
                                        ›
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
