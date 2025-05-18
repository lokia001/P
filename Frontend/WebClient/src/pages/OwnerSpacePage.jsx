// pages/OwnerSpacePage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../store/selectors/authSelectors';
import { Navigate } from 'react-router-dom';

const OwnerSpacePage = () => {
    const userRole = useSelector(selectUserRole);

    if (userRole !== 'owner') {
        return <Navigate to="/dashboard" replace />; // Hoặc trang không có quyền
    }

    return (
        <div>
            <h1>Trang Quản Lý Không Gian</h1>
            {/* Các component và chức năng dành cho chủ không gian */}
        </div>
    );
};

export default OwnerSpacePage;