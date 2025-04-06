import React from "react";
import Glob from "./Glob";
import {Link} from "react-router-dom";

function Banner() {
    return (
        <div style={{width:"100vw", position: "relative", overflowX:"clip" }}>
            <div class="banner-container">
                <div class="gradient-two"></div>
                <div class="banner-text">
                    <h1>Transforming Stock Market Analysis with AI Precision!</h1>
                    <p>
                        Unlock market intelligence like never before with our powerful
                        combination of Artificial Intelligence and Big Data.
                    </p>
                    <Link to="/Registration" class="cta-button">Contact Today!</Link>
                </div>
                <div class="lottie-container">
                    <Glob />
                </div>
            </div>
        </div>
    );
}

export default Banner;