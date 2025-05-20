import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Footer/Footer';
import "./MainLayout.css";

function MainLayout() {
    return (
        <div className="site-wrapper" >
            <Navbar />
            <div className="content"  >
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default MainLayout;