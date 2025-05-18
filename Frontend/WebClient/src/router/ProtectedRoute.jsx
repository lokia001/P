import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectUserRole } from '../store/selectors/authSelectors';

const ProtectedRoute = ({ allowedRoles, children, redirectTo = '/login' }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userRole = useSelector(selectUserRole); // LẤY userRole TỪ REDUX
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;