import React, { useState, useEffect } from "react";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
    const [activeMenu, setActiveMenu] = useState("Dashboard");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [companyLogo, setCompanyLogo] = useState(null);

   const handlesignout = () =>{
       localStorage.clear()
       window.location.reload('/');
   }

    useEffect(() => {
        // Fetch company details after login
        const fetchCompanyData = async () => {
            try {
                const response = await fetch("http://localhost:8081/api/companies", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch company data");
                }

                const data = await response.json();
                setCompanyLogo(data.companyLogo);
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        };

        fetchCompanyData();
    }, []);

    const logo = localStorage.getItem("logo")

    return (
        <div className="flex items-center justify-between px-6 py-2 border-b border-gray-300 bg-white">
            <div className="navbar">
                <div className="nfty">
                    <h3 className="font-semibold">
                        NIFTY 50 <span className="font-semibold-rad">18181.75</span>
                        <span className="nfty-small"> -104.75 (-0.57%)</span>
                    </h3>
                    <h3 className="font-semibold">
                        SENSEX <span className="font-semibold-rad">61560.64</span>
                        <span className="nfty-small"> -371.83 (-0.60%)</span>
                    </h3>
                </div>
                <div style={{border: "0.5px solid #dddddd", height: "68px", position: "absolute", left: "29.73%", zIndex: "1"}}></div>
                <img src="https://app.tradeon.ai/assets/3-r0IQVvMm.svg" style={{width: "8%", position: "relative", right:"12%"}} alt="TradeOn Logo"/>

                {/* Navigation Menu */}
                <div className="menu">
                    <span className={activeMenu === "Dashboard" ? "active" : ""} onClick={() => setActiveMenu("Dashboard")}>Dashboard</span>
                    <span className={activeMenu === "TechInd" ? "active" : ""} onClick={() => setActiveMenu("TechInd")}>TechInd</span>
                    <span className={activeMenu === "Forex" ? "active" : ""} onClick={() => setActiveMenu("Forex")}>Forex</span>
                    <span className={activeMenu === "Crypto" ? "active" : ""} onClick={() => setActiveMenu("Crypto")}>Crypto</span>
                    <span className={activeMenu === "EconInd" ? "active" : ""} onClick={() => setActiveMenu("EconInd")}>EconInd</span>

                    {/* Profile Dropdown */}
                    <div className="profile-dropdown">
                        <img
                            src={logo ? logo : "default-logo.png"}
                            className="profile-icon"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            alt="Company Logo"
                        />
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                {/*<div className="dropdown-item">*/}
                                {/*    <FaUserEdit className="dropdown-icon"/>*/}
                                {/*    Update Profile*/}
                                {/*</div>*/}
                                <div className="dropdown-item" onClick={handlesignout}>
                                    <FaSignOutAlt className="dropdown-icon"/>
                                    Sign Out
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
