import React from "react";
import {Link} from "react-router-dom";

export default function Header() {
    return (
        <header class="header">
            <div class="container">
                <div class="gradient-background"></div>
                <div class="logo-container">
                    <img src="/images/logo.svg" alt="Company Logo" class="logo" />
                </div>
                <Link to="/Login" class="login">Login</Link>
            </div>
        </header>
    );
}