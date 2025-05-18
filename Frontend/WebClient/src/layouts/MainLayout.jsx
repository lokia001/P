import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Footer/Footer';

function MainLayout() {
    return (
        <div>
            <Navbar />
            <div className="content">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default MainLayout;