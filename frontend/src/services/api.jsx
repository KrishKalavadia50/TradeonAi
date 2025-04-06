import axios from "axios";

const API_URL = "http://localhost:8081/api/companies"; // Update with your backend URL

export const registerCompany = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Registration Error:", error.response?.data || error.message);
        throw error;
    }
};

export const sendOtp = async (loginId) => {
    try {
        const response = await axios.post(`${API_URL}/auth/send-otp`, { loginId });
        return response.data;
    } catch (error) {
        console.error("OTP Sending Error:", error.response?.data || error.message);
        throw error;
    }
};

export const verifyOtp = async (loginId, otp) => {
    try {
        const response = await axios.post(`${API_URL}/auth/verify-otp`, { loginId, otp });
        return response.data;
    } catch (error) {
        console.error("OTP Verification Error:", error.response?.data || error.message);
        throw error;
    }
};
