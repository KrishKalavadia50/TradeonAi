import React from "react";

function Features_two() {
    return (
        <div>
            <div class="features-container">
                <div
                    style={{
                        mixBlendMode: "lighten",
                        filter: "opacity(0.05)",
                        overflowX: "hidden",
                        height: "100vh",
                        overflowY: "hidden",
                    }}
                >
                    <img
                        src="/images/grid.png"
                        alt="Chart Sheet Grid"
                        style={{ width: "100%", clipPath: "inset(40px)" }}
                    />
                </div>
                <h1 className="features-title reveal">
                    Unlock Market Intelligence Like Never Before!
                </h1>
                <div class="grid-container">
                    <div class="card cart-one card-reveal">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <img
                                src="/images/realtime.svg"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    justifyContent: "left",
                                    display: "flex",
                                    margin: "15px",
                                }}
                            />
                            <p
                                style={{
                                    margin: "20px",
                                    width: "20px",
                                    height: "20px",
                                    padding: "5px",
                                    border: "0.1px solid rgba(151, 85, 233, 0.82)",
                                    borderRadius: "50%",
                                    color: "#f5f5f58f",
                                }}
                            >
                                1
                            </p>
                        </div>
                        <div>
                            <h2 className="card-tital">Real-Time, Actionable Insights</h2>
                            <p className="card-subtitle">
                                Our AI algorithms continuously analyze data from various sources
                                to provide instant, actionable insights.
                            </p>
                        </div>
                    </div>
                    <div class="card cart-two card-reveal">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <img
                                src="/images/humanscope.svg"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    justifyContent: "left",
                                    display: "flex",
                                    margin: "15px",
                                }}
                            />
                            <p
                                style={{
                                    margin: "20px",
                                    width: "20px",
                                    height: "20px",
                                    padding: "5px",
                                    border: "0.1px solid rgba(151, 85, 233, 0.82)",
                                    borderRadius: "50%",
                                    color: "#f5f5f58f",
                                }}
                            >
                                2
                            </p>
                        </div>
                        <div>
                            <h2 className="card-tital">Humanized Market Analysis</h2>
                            <p className="card-subtitle">
                                Our platform is designed to make complex market analysis easy to
                                understand for everyone.
                            </p>
                        </div>
                    </div>
                    <div class="card cart-three card-reveal">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <img
                                src="/images/market.svg"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    justifyContent: "left",
                                    display: "flex",
                                    margin: "15px",
                                }}
                            />
                            <p
                                style={{
                                    margin: "20px",
                                    width: "20px",
                                    height: "20px",
                                    padding: "5px",
                                    border: "0.1px solid rgba(151, 85, 233, 0.82)",
                                    borderRadius: "50%",
                                    color: "#f5f5f58f",
                                }}
                            >
                                3
                            </p>
                        </div>
                        <div>
                            <h2 className="card-tital">Market Intelligence Reports</h2>
                            <p className="card-subtitle">
                                Get detailed market intelligence reports that help you make
                                informed decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="gradient-fifth"></div>
        </div>
    );
}

export default Features_two;
