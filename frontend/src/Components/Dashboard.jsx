import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Bar, Line } from "react-chartjs-2";
import {MdOutlinePictureAsPdf } from "react-icons/md";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);


const headers = [
    { key: "total_qoq", label: "QoQ" },
    { key: "total_yoy", label: "YoY" },
    { key: "total_dec_2024", label: "Dec 2024" },
    { key: "total_sep_2024", label: "Sept 2024" },
    { key: "total_jun_2024", label: "Jun 2024" },
    { key: "total_mar_2024", label: "March 2024" },
    { key: "total_dec_2023", label: "Dec 2023" },
    { key: "total_sep_2023", label: "Sept 2023" },
    { key: "total_jun_2023", label: "Jun 2023" },
    { key: "total_mar_2023", label: "March 2023" },
    { key: "total_dec_2022", label: "Dec 2022" },
];

const chart = [
    {key:"position" , label:"position"},
    {key:"total_market_cap" , label:"market_cap"},
]

const Dashboard = () => {
    const [stocks, setStocks] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const companyName = localStorage.getItem("companyName");

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await fetch("http://localhost:8081/api/stocks/all");
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setStocks(data);
            } catch (error) {
                console.error("Error fetching stock data:", error);
            }
        };

        const fetchCompanyData = async () => {
            try {
                const response = await fetch(`http://localhost:8081/api/companies/${companyName}/aggregated-quarterly-results`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setCompanyData(data);
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        };

        fetchStockData();
        fetchCompanyData();
        const interval = setInterval(fetchStockData, 5000);
        return () => clearInterval(interval);
    }, [companyName]);

    const filteredStocks = stocks.filter(stock =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const marketCapData = {
        labels: Object.keys(companyData),
        datasets: [
            {
                label: "Market Cap (in millions)",
                data: Object.values(companyData)?.map(item => parseFloat(item.total_market_cap?.replace("M", "")) || 0),
                backgroundColor: "#4fc0e8",
            },
        ],
    };

    const positionData = {
        labels: Object.keys(companyData),
        datasets: [
            {
                label: "Position Trend",
                data: Object.values(companyData).map(item => parseInt(item.position) || 0),
                borderColor: "#ff6384",
                fill: false,
            },
        ],
    };


    const handleDownloadReport = (companyName, quarter) => {
        const validQuarters = {
            "total_dec_2024": "Dec_2024",
            "total_sep_2024": "Sept_2024",
            "total_jun_2024": "Jun_2024",
            "total_mar_2024": "March_2024",
            "total_dec_2023": "Dec_2023",
            "total_sep_2023": "Sept_2023",
            "total_jun_2023": "Jun_2023",
            "total_mar_2023": "March_2023",
            "total_dec_2022": "Dec_2022",
        };

        if (validQuarters[quarter]) {
            const formattedQuarter = validQuarters[quarter];
            const downloadUrl = `http://localhost:8081/api/companies/${companyName}/download-report/${formattedQuarter}`;

            window.open(downloadUrl);
        } else {
            console.error("Invalid quarter selected:", quarter);
        }
    };




    return (
        <div>
            <Navbar />
            <div className="containerr">
                <div className="sidebar">
                    <div className="search">
                        <input
                            type="text"
                            placeholder="Search stocks..."
                            className="search-bar"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="real-time-stocks">
                        {filteredStocks.length > 0 ? (
                            filteredStocks.map((stock, index) => (
                                <div key={index} className={`stock-item ${stock.priceChange >= 0 ? "positive" : "negative"}`}>
                                    <span>{stock.companyName}</span>
                                    <span>${stock.price.toFixed(2)}</span>
                                    <span className="price-change">
                                        {stock.priceChange >= 0 ? "▲" : "▼"} {stock.priceChange.toFixed(2)}
                                    </span>
                                    <span>({stock.percentChange.toFixed(2)}%)</span>
                                </div>
                            ))
                        ) : (
                            <p>No stocks found.</p>
                        )}
                    </div>
                </div>
                <div className="main">
                    <div className="dashboard">
                        <h2 className="companyname gradient-text">Hi, {companyName} 👋🏻</h2>
                        <div style={{border: "0.5px solid #ccc"}}></div>
                        <div className="balance-cards">
                            <div className="chartcards">
                                <h4>Total Revenue</h4>
                                <Bar
                                    data={{
                                        labels: headers
                                            .filter(h => h.key.startsWith("total_"))
                                            .map(h => h.label),
                                        datasets: [{
                                            label: "Revenue",
                                            backgroundColor: (context) => {
                                                const chart = context.chart;
                                                const {ctx, chartArea} = chart;
                                                if (!chartArea) return null;
                                                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                                                gradient.addColorStop(0, 'rgba(97,118,227,1)');
                                                gradient.addColorStop(1, 'rgba(2218,56,205,1)');
                                                return gradient;
                                            },
                                            borderRadius: 6,
                                            data: headers
                                                .filter(h => h.key.startsWith("total_"))
                                                .map(h => parseFloat(companyData["Revenue"]?.[h.key]?.replace(/[^\d.-]/g, "")) || 0)
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {display: false},
                                            tooltip: {
                                                callbacks: {
                                                    label: ctx => `${ctx.parsed.y}M`
                                                }
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    callback: value => `${value}M`
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>

                            <div className="chartcards">
                                <h4>Net Profit</h4>
                                <Line
                                    data={{
                                        labels: headers
                                            .filter(h => h.key.startsWith("total_"))
                                            .map(h => h.label),
                                        datasets: [{
                                            label: "Net Profit",
                                            data: headers
                                                .filter(h => h.key.startsWith("total_"))
                                                .map(h =>
                                                    parseFloat(companyData?.["Net Profit"]?.[h.key]?.replace(/[^\d.-]/g, "")) || 0
                                                ),
                                            borderColor: "rgb(119,142,234)",
                                            pointBackgroundColor: "#ff6384",
                                            backgroundColor: (context) => {
                                                const chart = context.chart;
                                                const {ctx, chartArea} = chart;
                                                if (!chartArea) return null;
                                                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                                gradient.addColorStop(0, 'rgba(97,118,227,0.4)');
                                                gradient.addColorStop(1, 'rgba(2218,56,205,0)');
                                                return gradient;
                                            },
                                            tension: 0.4,
                                            fill: true
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {display: false},
                                            tooltip: {
                                                callbacks: {
                                                    label: ctx => `${ctx.parsed.y}M`
                                                }
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    callback: (v) => `${v}M`
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="table-container">
                        <table className="company-table">
                            <thead>
                            <tr>
                                <th>Categories</th>
                                {headers.map(({label}) => (
                                    <th key={label}>{label}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(companyData).map(([category, values]) => (
                                <tr key={category}>
                                    <td className="category-name" style={{textAlign: "left"}}>{category}</td>
                                    {headers.map(({key}) => (
                                        <td key={key}
                                            style={{
                                                textAlign: "right",
                                                color: ["total_qoq", "total_yoy"].includes(key) && values[key] !== undefined
                                                    ? values[key].charAt(0) === "-" ? "red" : "green"
                                                    : "inherit"
                                            }}>
                                            {values[key] !== undefined ? values[key] : "-"}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            <tr>
                                <td className="category-name" style={{textAlign: "left", fontWeight: "500"}}>
                                </td>

                                {headers.map(({key}) => (
                                    <td key={key} style={{textAlign: "right"}}>
                                        {key.startsWith("total_dec") || key.startsWith("total_sep") || key.startsWith("total_jun") || key.startsWith("total_mar") ? (
                                            <MdOutlinePictureAsPdf
                                                style={{ fontSize: "25px", cursor: "pointer", color: "#4fc0e8" }}
                                                onClick={() => handleDownloadReport(companyName, key)}
                                            />

                                        ) : null}
                                    </td>
                                ))}
                            </tr>
                            </tbody>

                        </table>
                        {marketCapData.labels.length > 0 && (
                            <div className="chart-box">
                                <h3>Market Cap</h3>
                                <Bar data={marketCapData} />
                            </div>
                        )}

                        {positionData.labels.length > 0 && (
                            <div className="chart-box">
                                <h3>Position Trend</h3>
                                <Line data={positionData} />
                            </div>
                        )}


                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;