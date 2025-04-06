import React from "react";
import './App.css';
import Login from "./Components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationForm from "./Components/RegistrationForm";

import Navbar from "./Components/Navbar";
import PrivateRoute from "./Components/PrivateRoute";
import Dashboard from "./Components/Dashboard";
import Home from "./Components/Home"
import PageNotFound from "./Components/PageNotFound";

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Registration" element={<RegistrationForm />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Navbar" element={<Navbar />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/Dashboard" element={ <Dashboard />} />
                    </Route>
                    <Route path="/PageNotFound" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
