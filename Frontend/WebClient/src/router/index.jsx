import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { AuthLayout, MainLayout } from '../layouts';
import { Navigate } from 'react-router-dom';
// import HomePage from '../pages/HomePage';
import {
    HomePage, LoginPage, NotFoundPage, BookSpace, AboutUs, SpaceDetailPage, Community

} from '../pages';
import SpaceList from '../features/manageSpace/components/SpaceList';
import AdminRegistration from '../components/Auth/AdminRegistration';
import UserLogin from '../components/Auth/UserLogin';
import SpaceForm from '../features/manageSpace/components/SpaceForm';
import AmenityForm from '../components/AmenityForm';
import SpaceDetails from '../features/manageSpace/components/SpaceDetails';
import AmenityList from '../components/AmenityList';
import EditSpacePage from '../features/manageSpace/components/EditSpacePage';
import GroupPage from '../pages/GroupPage';
import RegistrationForm from '../components/Auth/UserRegister/RegistrationForm';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';
import CreateGroupPage from '../pages/CreateGroupPage';
import OwnerDashboard from '../pages/OwnerDashboard';
import BookingManagementPage from '../pages/BookingManagementPage';
import CustomerManagement from '../pages/CustomerManagement';
import StaffManagementPage from '../pages/StaffManagementPage';
import ManageFacilitiesServices from '../pages/ManageFacilitiesServices';
import SpacePolicyManagement from '../pages/SpacePolicyManagement';
import ProfilePage from '../pages/ProfilePage';
import PricingAndOffersPage from '../pages/PricingAndOffersPage';
import SettingsPage from '../pages/SettingsPage';
import ReportPage from '../pages/ReportPage';
import UserReportsPage from '../pages/UserReportsPage';
import SystemUserManagementPage from '../pages/SystemUserManagementPage';
import SystemDashboard from '../pages/SystemDashboard';
import AlertManagementPage from '../pages/AlertManagementPage';
import SystemLogs from '../pages/SystemLogs';
import SupportTicketsPage from '../pages/SupportTicketsPage';
import ResetPasswordForm from '../components/Auth/ResetPasswordForm';
import SpaceManagementPage from '../pages/SpaceManagementPage';
import AddSpacePage from '../pages/AddSpacePage';
import CustomerSpaceSearchPage from '../pages/CustomerSpaceSearchPage';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />}> {/* MainLayout là layout */}

                    {/* mock */}
                    <Route path="/spaces/:spaceId" element={<SpaceDetailPage />} /> {/* << ROUTE MỚI */}
                    <Route path="/customer-management" element={<CustomerManagement />} />
                    <Route path="/spaces" element={<CustomerSpaceSearchPage />} /> {/* Trang tìm kiếm của Customer */}
                    {/* end mock */}

                    {/* home */}
                    <Route index element={<HomePage />} /> {/* TestComponent sẽ render vào Outlet của MainLayout khi path là "/" */}
                    {/* Các routes con khác của MainLayout */}
                    <Route path="book-space" element={<BookSpace />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/community/create" element={<CreateGroupPage />} />

                    {/* guest */}
                    <Route path="about-us" element={<AboutUs />} />


                    {/* ---mangage space*/}
                    <Route path="manage-space" element={<SpaceList />} />
                    {/* <Route path="/space/:Id" element={<SpaceDetailPage />} /> */}
                    <Route path="/manage-space/:id" element={<SpaceDetails />} />
                    <Route path="/space/new" element={<SpaceForm />} /> {/* Thêm Route này */}
                    <Route path="/space/edit/:id" element={<EditSpacePage />} />
                    <Route path="/amenity/new" element={<AmenityForm />} /> {/* Thêm Route này */}
                    <Route path="amenities" element={<AmenityList />} />


                    {/* new manage space--------- */}
                    <Route path="/space-management" element={<SpaceManagementPage />} />
                    <Route path="/space-management/add" element={<AddSpacePage />} />

                    <Route path="/OwnerDashboard" element={<OwnerDashboard />} />
                    <Route path="/BookingManagement" element={<BookingManagementPage />} />
                    <Route path="/CustomerManagement" element={<CustomerManagement />} />
                    <Route path="/StaffManagement" element={<StaffManagementPage />} />
                    <Route path="/facilities-services-management" element={<ManageFacilitiesServices />} />
                    <Route path="/SpacePolicyManagement" element={<SpacePolicyManagement />} />
                    <Route path="/ProfilePage" element={<ProfilePage />} />
                    <Route path="/PricingAndOffersPage" element={<PricingAndOffersPage />} />
                    <Route path="/SettingsPage" element={<SettingsPage />} />
                    <Route path="/ReportPage" element={<ReportPage />} />
                    <Route path="/UserReportsPage" element={<UserReportsPage />} />
                    <Route path="/forget-password" element={<UserReportsPage />} />

                    {/* admin*/}
                    <Route path="/system-user-management" element={<SystemUserManagementPage />} />
                    <Route path="/system-dashboard" element={<SystemDashboard />} />
                    <Route path="/AlertManagementPage" element={<AlertManagementPage />} />
                    <Route path="/SystemLogs" element={<SystemLogs />} />
                    <Route path="/SupportTicketsPage" element={<SupportTicketsPage />} />


                    {/* error */}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>

                <Route path="/" element={<AuthLayout />}>
                    {/* admin register old */}
                    <Route path="/register" element={<AdminRegistration />} />

                    <Route path="/login" element={<UserLogin />} />
                    <Route path="/user/register" element={<RegistrationForm />} />
                    <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                    <Route path="/reset-password" element={<ResetPasswordForm />} />

                    {/* <Route path="login" index element={<LoginPage />} /> */}
                </Route>

                {/* Các routes không sử dụng MainLayout (ví dụ: AuthLayout) */}
            </Routes>
        </Router>
    );
};

export default AppRouter;