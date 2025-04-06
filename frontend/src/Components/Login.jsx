import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [loginId, setLoginId] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all registered companies from backend
        axios.get("http://localhost:8081/api/companies")
            .then(response => setCompanies(response.data))
            .catch(error => console.error("Error fetching companies:", error));
    }, []);

    const handleSendOtp = () => {
        axios.post("http://localhost:8081/api/auth/send-otp", { companyName: selectedCompany, loginId })
            .then(response => {
                alert("OTP sent successfully!");
                setStep(2);
            })
            .catch(error => alert("Error sending OTP!"));
    };

    const handleVerifyOtp = () => {
        axios.post("http://localhost:8081/api/auth/verify-otp", { companyName: selectedCompany, loginId, otp })
            .then(response => {
                alert("Login successful!");
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("companyName", response.data.companyName)
                localStorage.setItem("logo", response.data.logo)
                navigate("/Dashboard");
            })
            .catch(error => alert("Invalid OTP!"));
    };

    return (
        <div className="login-container">
            <h2>Login to TradeonAi</h2>
            {step === 1 ? (
                <div className="login-form">
                    <label>Select Company:</label>
                    <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} style={{padding:"10px",marginBottom:"10px"}}>
                        <option value="">-- Select Company --</option>
                        {companies.map((company) => (
                            <option key={company.id} value={company.name}>{company.name}</option>
                        ))}
                    </select>

                    <label>Enter Login ID:</label>
                    <input type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="Enter Login ID" style={{padding:"10px",marginBottom:"10px"}}/>

                    <button onClick={handleSendOtp} style={{padding:"10px",marginBottom:"10px"}}>Send OTP</button>
                    <Link to="/Registration">Register here...</Link>
                </div>
            ) : (
                <div>
                    <label>Enter OTP:</label>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />

                    <button onClick={handleVerifyOtp}>Verify OTP & Login</button>
                </div>
            )}
        </div>
    );
};

export default Login;
