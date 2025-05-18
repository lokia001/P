import React from 'react';

import HeroSection from './style/HomePage/HeroSection';

import WhyBook from './style/HomePage/WhyBook';

import WorkplaceAnywhere from './style/HomePage/WorkplaceAnywhere';
import HelpedCompanies from './style/HomePage/HelpedCompanies';

import TopCities from './style/HomePage/TopCities';

import NewestOffices from './style/HomePage/NewestOffices';

import FindAnywhere from './style/HomePage/FindAnywhere';

import WhatIsCoworker from './style/HomePage/WhatIsCoworker';

import CoworkingDetails from './style/HomePage/CoworkingDetails';

function HomePage() {

    return (
        <> {/* Sử dụng Fragment để không tạo thêm div thừa */}
            <HeroSection />
            <div className="container"> {/* Bọc các phần nội dung chính bên trong container */}
                <WhyBook />
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '40px 20px' }}>
                    <WorkplaceAnywhere />
                    <HelpedCompanies />
                </div>
                <TopCities />
                <NewestOffices />
                <FindAnywhere />
                <WhatIsCoworker />
                <CoworkingDetails />
            </div>
        </>
    );
}

export default HomePage;