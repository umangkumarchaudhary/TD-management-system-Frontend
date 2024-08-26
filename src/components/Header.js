import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../img/logo.jpg'; 

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo-img" />
                <div className="logo-text">Mercedes Benz Silver Star</div>
            </div>
            <nav className={`nav ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/complete-list">Complete List</Link></li>
                </ul>
            </nav>
            <div className="hamburger" onClick={toggleMenu}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
        </header>
    );
};

export default Header;
