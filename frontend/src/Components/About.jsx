import React, { useEffect, useRef } from "react";

const LaptopParallax = ({setVisible}) => {
    const containerRef = useRef(null);
    const laptopRef = useRef(null);
    const imageref = useRef(null);
    const textref = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;
            const laptop = laptopRef.current;

            if (container && laptop) {
                const scrollTop =
                    window.pageYOffset || document.documentElement.scrollTop;
                const start = container.offsetTop - 0.9;
                const end = start + container.offsetHeight - window.innerHeight;
                const progress = Math.min(
                    Math.max((scrollTop - start) / (end - start), 0),
                    1
                );

                console.log(progress);

                if (progress >= 1) {
                    // Move the image to the left and keep it centered vertically
                    laptop.style.transform = `
            translate(-70%, -27%)
            scale(0.4)
          `;
                    imageref.current.style.objectFit = "contain";
                    textref.current.style.transform = `translate(0 , 0)`;
                    setTimeout(() => {
                        setVisible(true)
                    }, 500);
                } else {
                    // Animation: Reveal the image and shrink the laptop
                    laptop.style.transform = `
            translate(-50%, -${progress * 30}%)
            scale(${1.1 - progress * .8})
          `;
                    const newHeight = Math.min(60 + progress * 40, 100); // Increase height from 60% to 100%
                    imageref.current.style.height = `${newHeight}%`;
                    imageref.current.style.objectFit = "cover";
                    textref.current.style.transform = `translate(140% , 0)`;
                    setVisible(false)
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position:"relative",
                height: "200vh",
            }}
        >
            <div className="about">
                <p className="small-about reveal">About</p>
                <h1 className="reveal"> Unleash the power of AI in trading </h1>
            </div>
            {/* Sticky Laptop Image */}
            <div
                className="laptop"
                style={{
                    position: "sticky",
                    top: "0",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    ref={laptopRef}
                    style={{
                        position: "absolute",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        top: "0%", // Center vertically
                        left: "50%", // Center horizontally
                        transform: "translate(-50%, 6%) scale(1)", // Start centered
                        transformOrigin: "center center",
                        width: "200%",
                        height: "230%",
                        transition: "transform 0.5s ease-out", // Smooth transition for the movement
                        overflow: "hidden", // Ensures only part of the image is shown initially
                    }}
                >
                    <img
                        className="laptop-modell"
                        ref={imageref}
                        src="/images/m.png" // Path to your laptop image
                        alt="Laptop"
                        style={{
                            position: "absolute",
                            top: "0%",
                            right: "0%",
                            width: "100%",
                            objectFit: "contain",
                            transition: "opacity 0.3s ease-in-out",
                        }}
                    />
                </div>
                <div className="about-text" ref={textref}>
                    <h1 className="about-title" style={{ color: "white" }}>
                        Experience the Future of Stock Market Analysis!
                    </h1>
                    <div className="about-subtitle">
                        <p>
                            <b>Speed That Sets You Apart</b>
                            <p>
                                When every second counts, TradeOn.Ai delivers. Our platform
                                processes and analyzes data at an unprecedented pace, ensuring
                                you're always a step ahead.
                            </p>
                        </p>
                        <p>
                            <b>Comprehensive Coverage Like No Other</b>
                            <p>
                                We go beyond traditional sources, incorporating global data from
                                diverse channels to provide you with a holistic view of the
                                market.
                            </p>
                        </p>
                        <p>
                            <b>Unbiased, Data-Driven Decisions</b>
                            <p>
                                Eliminate guesswork and human bias from your investment strategy
                                with insights that are purely based on data, patterns, and
                                trends.
                            </p>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaptopParallax;
