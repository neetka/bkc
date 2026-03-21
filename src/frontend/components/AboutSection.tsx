// "use client";

// import { useState, useEffect, useRef } from "react";

// interface CounterItem {
//     label: string;
//     value: number;
//     suffix: string;
//     icon: string;
// }

// const counters: CounterItem[] = [
//     { label: "Years of Service", value: 14, suffix: "+", icon: "fas fa-calendar-check" },
//     { label: "Forms Processed", value: 5000, suffix: "+", icon: "fas fa-file-alt" },
//     { label: "Students Trained", value: 1200, suffix: "+", icon: "fas fa-user-graduate" },
//     { label: "Services Provided", value: 50, suffix: "+", icon: "fas fa-building" },
// ];

// function AnimatedNumber({ target, isVisible }: { target: number; isVisible: boolean }) {
//     const [count, setCount] = useState(0);

//     useEffect(() => {
//         if (!isVisible) return;
//         let start = 0;
//         const duration = 2000;
//         const increment = target / (duration / 16);
//         const timer = setInterval(() => {
//             start += increment;
//             if (start >= target) {
//                 setCount(target);
//                 clearInterval(timer);
//             } else {
//                 setCount(Math.floor(start));
//             }
//         }, 16);
//         return () => clearInterval(timer);
//     }, [isVisible, target]);

//     return <span>{count.toLocaleString()}</span>;
// }

// export default function AboutSection() {
//     const [isVisible, setIsVisible] = useState(false);
//     const ref = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             ([entry]) => {
//                 if (entry.isIntersecting) {
//                     setIsVisible(true);
//                     observer.disconnect();
//                 }
//             },
//             { threshold: 0.2 }
//         );
//         if (ref.current) observer.observe(ref.current);
//         return () => observer.disconnect();
//     }, []);

//     return (
//         <section id="about" className="about-section" ref={ref}>
//             <div className="container mx-auto px-4">
//                 {/* Section Header */}
//                 <div className="about-header scroll-reveal">
//                     <span className="about-badge">Since 2011</span>
//                     <h2 className="about-title">About CSC Baghpur</h2>
//                     <div className="about-title-bar"></div>
//                 </div>

//                 {/* Split Layout */}
//                 <div className="about-layout">
//                     {/* Text Side */}
//                     <div className="about-text scroll-reveal">
//                         <p className="about-desc">
//                             Common Services Centre (CSC) Baghpur has been a pillar of the community since <strong>2011</strong>,
//                             providing essential government services and computer education to the people of Baghpur and surrounding rural areas.
//                         </p>
//                         <p className="about-desc">
//                             Our centre bridges the digital divide by helping rural citizens access digital services,
//                             fill government forms, and develop computer skills. From Aadhaar enrollment to PAN card applications,
//                             passport services to online exam forms — we make government services accessible to everyone.
//                         </p>
//                         <p className="about-desc">
//                             We also offer comprehensive computer training courses that empower individuals with the digital literacy
//                             they need in today&apos;s world, opening new doors of opportunity for our community.
//                         </p>

//                         {/* Highlights */}
//                         <div className="about-highlights">
//                             <div className="about-highlight-item">
//                                 <i className="fas fa-check-circle"></i>
//                                 <span>Government-authorised service centre</span>
//                             </div>
//                             <div className="about-highlight-item">
//                                 <i className="fas fa-check-circle"></i>
//                                 <span>Affordable digital services</span>
//                             </div>
//                             <div className="about-highlight-item">
//                                 <i className="fas fa-check-circle"></i>
//                                 <span>Expert assistance for rural citizens</span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Image Side */}
//                     <div className="about-image-wrapper scroll-reveal">
//                         <div className="about-image-container">
//                             <img
//                                 src="/images/about-centre.png"
//                                 alt="CSC Baghpur Computer Lab"
//                                 className="about-image"
//                             />
//                             <div className="about-image-accent"></div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Animated Counters */}
//                 <div className="about-counters">
//                     {counters.map((item, i) => (
//                         <div
//                             key={item.label}
//                             className={`about-counter-card ${isVisible ? "about-counter-card--visible" : ""}`}
//                             style={{ transitionDelay: `${i * 0.15}s` }}
//                         >
//                             <div className="about-counter-icon">
//                                 <i className={item.icon}></i>
//                             </div>
//                             <div className="about-counter-number">
//                                 <AnimatedNumber target={item.value} isVisible={isVisible} />
//                                 {item.suffix}
//                             </div>
//                             <div className="about-counter-label">{item.label}</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }

"use client";

import { useRef } from "react";

export default function AboutSection() {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <section id="about" className="about-section" ref={ref}>
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="about-header scroll-reveal">
                    <span className="about-badge">Since 2011</span>
                    <h2 className="about-title">About CSC Baghpur</h2>
                    <div className="about-title-bar"></div>
                </div>

                {/* Split Layout */}
                <div className="about-layout">
                    {/* Text Side */}
                    <div className="about-text scroll-reveal">
                        <p className="about-desc">
                            Common Services Centre (CSC) Baghpur has been a pillar of the community since <strong>2011</strong>,
                            providing essential government services and computer education to the people of Baghpur and surrounding rural areas.
                        </p>
                        <p className="about-desc">
                            Our centre bridges the digital divide by helping rural citizens access digital services,
                            fill government forms, and develop computer skills. From Aadhaar enrollment to PAN card applications,
                            passport services to online exam forms — we make government services accessible to everyone.
                        </p>
                        <p className="about-desc">
                            We also offer comprehensive computer training courses that empower individuals with the digital literacy
                            they need in today&apos;s world, opening new doors of opportunity for our community.
                        </p>

                        {/* Highlights */}
                        <div className="about-highlights">
                            <div className="about-highlight-item">
                                <i className="fas fa-check-circle"></i>
                                <span>Government-authorised service centre</span>
                            </div>
                            <div className="about-highlight-item">
                                <i className="fas fa-check-circle"></i>
                                <span>Affordable digital services</span>
                            </div>
                            <div className="about-highlight-item">
                                <i className="fas fa-check-circle"></i>
                                <span>Expert assistance for rural citizens</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="about-image-wrapper scroll-reveal">
                        <div className="about-image-container">
                            <img
                                src="/images/about-centre.png"
                                alt="CSC Baghpur Computer Lab"
                                className="about-image"
                            />
                            <div className="about-image-accent"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}