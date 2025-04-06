import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

function GlobWithChart() {
    const globeCanvasRef = useRef();
    const chartCanvasRef = useRef();

    useEffect(() => {
        let phi = 0;

        const globe = createGlobe(globeCanvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.125, 0.078, 0.18],
            markerColor: [0.725, 0.502, 1],
            glowColor: [0.773, 0.588, 1],
            markers: [
                { location: [37.7595, -122.4367], size: 0.03 },
                { location: [40.7128, -74.006], size: 0.1 },
            ],
            onRender: (state) => {
                state.phi = phi;
                phi += 0.005;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    useEffect(() => {
        const chartCanvas = chartCanvasRef.current;
        const ctx = chartCanvas.getContext("2d");

        // Chart Dimensions
        const width = 600;
        const height = 600;

        chartCanvas.width = width;
        chartCanvas.height = height;

        // Add padding for the gap between the globe and the chart axes
        const padding = 50; // Padding for chart axes

        // Draw Grid (Background like a chart sheet with rows and columns)
        const gridColor = "#333333"; // Grid line color
        const gridSpacing = 100; // Increase the grid spacing for a bigger sheet

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.5;

        // Draw Vertical Grid Lines (Columns)
        for (let x = -gridSpacing; x < width + gridSpacing; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }

        // Draw Horizontal Grid Lines (Rows)
        for (let y = -gridSpacing; y < height + gridSpacing; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw Axes
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;

        // Y-Axis with Arrow (Top)
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(padding, padding); // Vertical line
        ctx.lineTo(padding - 5, padding + 10); // Left arrowhead (top)
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding + 5, padding + 10); // Right arrowhead (top)
        ctx.stroke();

        // X-Axis with Arrow (Right)
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding); // Horizontal line
        ctx.lineTo(width - padding - 10, height - padding - 5); // Top arrowhead
        ctx.moveTo(width - padding, height - padding);
        ctx.lineTo(width - padding - 10, height - padding + 5); // Bottom arrowhead
        ctx.stroke();

        // Draw Y-Axis Values (100, 200, ...)
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        const yMax = 700; // Maximum value for Y-axis
        const yStep = 100; // Step for values
        const yScale = (height - 2 * padding) / yMax; // Scale for Y-axis

        for (let i = 0; i <= yMax; i += yStep) {
            const y = height - padding - i * yScale;
            ctx.fillText(i, padding - 30, y + 5); // Offset for positioning the text
        }

        // Draw X-Axis Labels (1 year, 2 year, ...)
        const years = ["1 year", "2 year", "3 year", "4 year", "5 year"];
        const xStep = (width - 2 * padding) / (years.length - 1);

        years.forEach((year, index) => {
            const x = padding + index * xStep;
            ctx.fillText(year, x - 20, height - padding + 20);
        });

        // Multiple Stock Data
        const stockDataSets = [
            {
                data: [500, 300, 500, 150, 600, 700], // Example stock data 1
                color: "#ffcc00",
                label: "Company A",
            },
            {
                data: [300, 400, 350, 550, 500], // Example stock data 2
                color: "#00ccff",
                label: "Company B",
            },
            {
                data: [0, 250, 300, 450, 550], // Example stock data 3
                color: "#ff33cc",
                label: "Company C",
            },
        ];

        // Draw Stock Data Lines
        stockDataSets.forEach((set) => {
            ctx.strokeStyle = set.color;
            ctx.lineWidth = 2;

            ctx.beginPath();
            set.data.forEach((value, index) => {
                const x = padding + index * xStep;
                const y = height - padding - value * yScale;
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();

            // Draw Points
            ctx.fillStyle = set.color;
            set.data.forEach((value, index) => {
                const x = padding + index * xStep;
                const y = height - padding - value * yScale;
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fill();
            });
        });

        // Draw Legend
        const legendX = width - 150; // Legend position
        const legendY = padding;
        const legendSpacing = 20;

        ctx.font = "12px Arial";
        stockDataSets.forEach((set, index) => {
            const y = legendY + index * legendSpacing;
            ctx.fillStyle = set.color;
            ctx.fillRect(legendX, y, 10, 10); // Legend color box
            ctx.fillStyle = "#ffffff";
            ctx.fillText(set.label, legendX + 15, y + 10); // Legend text
        });
    }, []);

    return (
        <div className="globe-chart-container" style={{ position: "relative", width: 600, height: 600, bottom: 15 }}>
            <canvas
                ref={globeCanvasRef}
                style={{
                    position: "absolute",
                    width: 600,
                    height: 600,
                    maxWidth: "100%",
                    aspectRatio: 1,
                    left: 10, // Create 10px space from the Y-axis
                    bottom: 10, // Create 10px space from the X-axis
                }}
            />
            <canvas
                ref={chartCanvasRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 600,
                    height: 600,
                    pointerEvents: "none", // Ensures globe remains interactive
                }}
            />
        </div>
    );
}

export default GlobWithChart;
