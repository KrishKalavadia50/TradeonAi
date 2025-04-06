import React from "react";

function Blockquote() {
    window.addEventListener("scroll", reveal);

    function reveal() {
        var reveals = document.querySelectorAll(".reveal");

        for (var i = 0; i < reveals.length; i++) {
            var windowheight = window.innerHeight;
            var revealtop = reveals[i].getBoundingClientRect().top;
            var revealpoint = 150;

            if (revealtop < windowheight - revealpoint) {
                reveals[i].classList.add("active");
            } else {
                reveals[i].classList.remove("active");
            }
        }
    }

    return (
        <div className="blockquote">
            <div class="blockquote-container">
                <div class="quote reveal" style={{ flexDirection: "row", mixBlendMode: "lighten" }}>
                    <div
                        style={{
                            background:
                                "linear-gradient(2deg, rgb(2 8 14) 8%, rgba(0, 0, 0, 0) 100%)",
                            zIndex: "1",
                            width: "400px",
                            height: "200px",
                            bottom: "33px",
                            left: "28px",
                            position: "absolute",
                        }}
                    ></div>
                    <img src="/images/elon musk.jpeg" alt="Elon Musk" />
                    <div style={{ textAlign: "left", padding: "0 60px" }}>
                        <p>
                            "AI doesn't just speed up the process; it changes the very nature
                            of analysis. It can detect subtle patterns across billions of data
                            points that human traders could never perceive."
                        </p>
                        <p class="author">— Elon Musk</p>
                    </div>
                </div>
                <div class="quote reveal" style={{ mixBlendMode: "lighten" }}>
                    <div
                        style={{
                            background:
                                "linear-gradient(2deg, rgb(2 8 14) 8%, rgba(0, 0, 0, 0) 100%)",
                            zIndex: "1",
                            width: "400px",
                            height: "200px",
                            bottom: "33px",
                            right: "0",
                            position: "absolute",
                        }}
                    ></div>
                    <div style={{ transform: "scaleX(-1)", mixBlendMode: "lighten" }}>
                        <img src="/images/bill gates.jpeg" alt="Bill Gates" />
                    </div>
                    <div style={{ textAlign: "right", padding: "0 60px" }}>
                        <p>
                            "AI will transform the investment world by making sense of massive
                            amounts of data, uncovering trends and opportunities that would
                            otherwise go unnoticed."
                        </p>
                        <p class="author">Bill Gates —</p>
                    </div>
                </div>
                <div class="gradient-three"></div>
            </div>
        </div>
    );
}

export default Blockquote;
