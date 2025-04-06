import React from 'react';
import Lottie from 'react-lottie';
import Error from '../Animation - 1743938106676.json'

export default function PageNotFound() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: Error,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    return (
        <div className="not-found-container">
            <div className="left">
                <div className="right">
                    <Lottie options={defaultOptions}
                            height={400}
                            width={400} />
                </div>
                <h2 className="pagenotfound">PAGE NOT FOUND</h2>
                <p className="error-message">This page is not available for phone.<br/>Please use laptop or desktop.</p>
                <a href="/" className="home-button">Go to Home</a>
            </div>
        </div>
    );
}
