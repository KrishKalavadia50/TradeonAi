import React, { useState } from "react";
import { registerCompany } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        gstNumber: "",
        logo: null,
        sqlFile: null,
    });
    const [isLoading, setLoading] = useState(false);

    const [message, setMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();

    // Handle text input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file uploads
    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handlefileupload = async (e) => {
        const file = e.target.files[0];

        console.log(file);

        if (!file) return;

        const ImageData = new FormData();
        ImageData.append("file", file);
        ImageData.append("upload_preset", "Tradeon");
        ImageData.append("cloud_name", "ddqvmepzz");

        try {
            setLoading(true);
            const response = await fetch("https://api.cloudinary.com/v1_1/ddqvmepzz/image/upload", {
                method: "POST",
                body: ImageData,
            });

            const data = await response.json();

            if (data.secure_url) {
                console.log("Image uploaded to Cloudinary:", data.secure_url);

                setFormData({
                    ...formData,
                    logo: data.secure_url
                });
            } else {
                console.error("Cloudinary upload failed", data);
            }

        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("phone", formData.phone);
        data.append("gstNumber", formData.gstNumber);
        data.append("logo", formData.logo);
        data.append("sqlFile", formData.sqlFile);

        try {
            await registerCompany(data);
            setMessage({ text: "Registration successful! Redirecting...", type: "success" });

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setMessage({ text: "Error during registration. Please try again.", type: "error" });
        }

        // Remove message after 3 seconds
        setTimeout(() => {
            setMessage({ text: "", type: "" });
        }, 3000);
    };

    return (
        <div className="registration-container">
            <div className="form-box">
                <h2>Company Registration</h2>
                <form onSubmit={handleSubmit} className="registrationform" encType="multipart/form-data">
                    <div className="input-group">
                        <label>Company Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Password:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Phone Number:</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>GST Number:</label>
                        <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Company Logo:</label>
                        <input type="file" name="logo" accept="image/*" onChange={handlefileupload} required />
                    </div>

                    <div className="input-group">
                        <label>SQL File:</label>
                        <input type="file" name="sqlFile" accept=".sql" onChange={handleFileChange} required />
                    </div>

                    <button type="submit" className="btn" disabled={isLoading}>Register</button>
                    <Link to="/login" className="login-link">Login</Link>
                </form>
            </div>

            {message.text && (
                <div className={`popup-message ${message.type}`}>
                    {message.type === "success" ? "✔️" : "❌"} {message.text}
                </div>
            )}
        </div>
    );
};

export default RegistrationForm;
