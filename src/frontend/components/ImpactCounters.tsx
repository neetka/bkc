// "use client";

// import { useState, useEffect, useRef } from "react";

// interface CounterItem {
//     label: string;
//     value: number;
//     suffix: string;
//     icon: string;
// }

// const counters: CounterItem[] = [
//     { label: "Forms Filled", value: 5000, suffix: "+", icon: "fas fa-file-alt" },
//     { label: "Students Trained", value: 1200, suffix: "+", icon: "fas fa-user-graduate" },
//     { label: "Govt Services", value: 50, suffix: "+", icon: "fas fa-building" },
//     { label: "Years of Service", value: 8, suffix: "+", icon: "fas fa-calendar-check" },
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

// export default function ImpactCounters() {
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
//             { threshold: 0.3 }
//         );
//         if (ref.current) observer.observe(ref.current);
//         return () => observer.disconnect();
//     }, []);

//     return (
//         <section className="impact-counters" ref={ref}>
//             <div className="container mx-auto px-4">
//                 <div className="impact-grid">
//                     {counters.map((item, i) => (
//                         <div
//                             key={item.label}
//                             className={`impact-card ${isVisible ? "impact-card--visible" : ""}`}
//                             style={{ transitionDelay: `${i * 0.15}s` }}
//                         >
//                             <div className="impact-icon">
//                                 <i className={item.icon}></i>
//                             </div>
//                             <div className="impact-number">
//                                 <AnimatedNumber target={item.value} isVisible={isVisible} />
//                                 {item.suffix}
//                             </div>
//                             <div className="impact-label">{item.label}</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }


"use client";

import { useState, useEffect, useRef } from "react";

interface CounterItem {
    label: string;
    value: number;
    suffix: string;
    icon: string;
}

const counters: CounterItem[] = [
    { label: "Years of Service", value: 14, suffix: "+", icon: "fas fa-calendar-check" },
    // { label: "Forms Processed", value: 5000, suffix: "+", icon: "fas fa-file-alt" },
    { label: "Students Trained", value: 1200, suffix: "+", icon: "fas fa-user-graduate" },
    { label: "Services Provided", value: 50, suffix: "+", icon: "fas fa-building" },
];

function AnimatedNumber({ target, isVisible }: { target: number; isVisible: boolean }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const duration = 2000;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [isVisible, target]);

    return <span>{count.toLocaleString()}</span>;
}

export default function ImpactCounters() {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return (
        <section className="impact-counters" ref={ref}>
            <div className="container mx-auto px-4">
                <div className="impact-grid">
                    {counters.map((item, i) => (
                        <div
                            key={item.label}
                            className={`impact-card ${isVisible ? "impact-card--visible" : ""}`}
                            style={{ transitionDelay: `${i * 0.15}s` }}
                        >
                            <div className="impact-icon">
                                <i className={item.icon}></i>
                            </div>
                            <div className="impact-number">
                                <AnimatedNumber target={item.value} isVisible={isVisible} />
                                {item.suffix}
                            </div>
                            <div className="impact-label">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}