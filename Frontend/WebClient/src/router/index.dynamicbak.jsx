import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routesConfig from './routes';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

// Sử dụng Vite's import.meta.glob để tự động import các component trang
const pageModules = import.meta.glob('../pages/**/*.jsx');

const componentMap = {};

// Tạo componentMap từ các module đã import
for (const path in pageModules) {
    const componentName = path.split('/').pop().replace('.jsx', '');
    componentMap[componentName] = lazy(pageModules[path]);
}

const generateRoutes = (routes) => {

    return routes.map((route, index) => {
        const Layout = route.layout === 'auth' ? AuthLayout : MainLayout;
        const Component = componentMap[route.component];

        // Thêm log để kiểm tra route.component và Component
        console.log(`Route path: ${route.path}, Component name: ${route.component}, Component:`, Component);

        if (!Component) {
            console.error(`Component not found: ${route.component}`);
            return null;
        }

        return (

            <Route
                key={index}
                path={route.path}
                element={
                    <Layout>
                        {route.roles ? (
                            <ProtectedRoute allowedRoles={route.roles} redirectTo={route.redirectTo}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <Component />
                                </Suspense>
                            </ProtectedRoute>
                        ) : (
                            <Suspense fallback={<div>Loading...</div>}>
                                <Component />
                            </Suspense>
                        )}
                    </Layout>
                }
            />
        );
    });
};

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {generateRoutes(routesConfig)}
                <Route path="/test" element={<div>Test Page Content</div>} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;