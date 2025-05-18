import React, { useState } from 'react';
import './SettingsPage.css'; // Import file CSS

// Giả sử bạn đã import Bootstrap Icons CSS trong file index.html hoặc App.jsx
// Ví dụ: <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('chung'); // 'chung' là tab mặc định

    const sidebarItems = [
        { id: 'chung', label: 'Chung', icon: 'bi-gear-fill' },
        { id: 'thanh-toan', label: 'Thanh Toán', icon: 'bi-credit-card-2-front-fill' },
        { id: 'dat-cho', label: 'Đặt Chỗ', icon: 'bi-calendar-event-fill' },
        { id: 'thong-bao', label: 'Thông Báo', icon: 'bi-bell-fill' },
        { id: 'nhan-vien', label: 'Nhân Viên', icon: 'bi-people-fill' },
        { id: 'tich-hop', label: 'Tích Hợp', icon: 'bi-puzzle-fill' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'chung':
                return <GeneralSettings />;
            case 'thanh-toan':
                return <PaymentSettings />;
            case 'dat-cho':
                return <BookingSettings />;
            case 'thong-bao':
                return <NotificationSettings />;
            case 'nhan-vien':
                return <StaffSettings />;
            case 'tich-hop':
                return <IntegrationSettings />;
            default:
                return <GeneralSettings />;
        }
    };

    const getActiveTabLabel = () => {
        const currentItem = sidebarItems.find(item => item.id === activeTab);
        return currentItem ? currentItem.label : 'Cài Đặt';
    };

    return (
        <div className="settings-page-container container-fluid p-0">
            <div className="d-flex">
                {/* Sidebar */}
                <nav className="settings-sidebar vh-100">
                    <h3 className="sidebar-title p-3 mb-0">Cài Đặt</h3>
                    <ul className="nav flex-column">
                        {sidebarItems.map((item) => (
                            <li className="nav-item" key={item.id}>
                                <a
                                    className={`nav-link d-flex align-items-center ${activeTab === item.id ? 'active' : ''}`}
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab(item.id);
                                    }}
                                >
                                    <i className={`bi ${item.icon} me-2`}></i>
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Content Area */}
                <main className="settings-content-area flex-grow-1 p-4">
                    <h2 className="content-title mb-4">Cài Đặt {getActiveTabLabel()}</h2>
                    {renderContent()}
                    <div className="save-button-container">
                        <button type="button" className="btn btn-primary btn-lg">
                            Lưu Thay Đổi
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

// --- Các component cho từng section ---

const GeneralSettings = () => (
    <div className="settings-section">
        <div className="row g-3">
            <div className="col-md-6">
                <label htmlFor="workspaceName" className="form-label">Tên Working Space</label>
                <input type="text" className="form-control" id="workspaceName" placeholder="Nhập tên working space" />
            </div>
            <div className="col-md-6">
                <label htmlFor="address" className="form-label">Địa chỉ</label>
                <input type="text" className="form-control" id="address" placeholder="Nhập địa chỉ" />
            </div>
            <div className="col-md-6">
                <label htmlFor="phone" className="form-label">Số điện thoại liên hệ</label>
                <input type="tel" className="form-control" id="phone" placeholder="Nhập số điện thoại" />
            </div>
            <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email liên hệ</label>
                <input type="email" className="form-control" id="email" placeholder="Nhập email" />
            </div>
            <div className="col-md-4">
                <label htmlFor="currency" className="form-label">Tiền tệ mặc định</label>
                <select className="form-select" id="currency">
                    <option selected>Chọn tiền tệ...</option>
                    <option value="VND">VND - Việt Nam Đồng</option>
                    <option value="USD">USD - US Dollar</option>
                    {/* Thêm các tùy chọn tiền tệ khác */}
                </select>
            </div>
            <div className="col-md-4">
                <label htmlFor="language" className="form-label">Ngôn ngữ mặc định</label>
                <select className="form-select" id="language">
                    <option selected>Chọn ngôn ngữ...</option>
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                    {/* Thêm các tùy chọn ngôn ngữ khác */}
                </select>
            </div>
            <div className="col-md-4">
                <label htmlFor="timezone" className="form-label">Múi giờ</label>
                <select className="form-select" id="timezone">
                    <option selected>Chọn múi giờ...</option>
                    <option value="Asia/Ho_Chi_Minh">(GMT+07:00) Ho Chi Minh City</option>
                    {/* Thêm các tùy chọn múi giờ khác */}
                </select>
            </div>
        </div>
    </div>
);

const PaymentSettings = () => (
    <div className="settings-section">
        <h4 className="section-subtitle">Phương thức thanh toán</h4>
        <button className="btn btn-success btn-sm mb-3">
            <i className="bi bi-plus-circle me-1"></i> Thêm mới phương thức
        </button>
        <div className="table-responsive">
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Tên phương thức</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Thanh toán khi nhận phòng (COD)</td>
                        <td><span className="badge bg-success">Hoạt động</span></td>
                        <td>
                            <button className="btn btn-sm btn-outline-primary me-1"><i className="bi bi-pencil-square"></i> Sửa</button>
                            <button className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i> Xóa</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Chuyển khoản ngân hàng</td>
                        <td><span className="badge bg-secondary">Không hoạt động</span></td>
                        <td>
                            <button className="btn btn-sm btn-outline-primary me-1"><i className="bi bi-pencil-square"></i> Sửa</button>
                            <button className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i> Xóa</button>
                        </td>
                    </tr>
                    {/* Thêm các dòng dữ liệu phương thức thanh toán */}
                </tbody>
            </table>
        </div>

        <h4 className="section-subtitle mt-4">Thông tin tài khoản ngân hàng</h4>
        <div className="row g-3">
            <div className="col-md-6">
                <label htmlFor="bankAccountName" className="form-label">Tên tài khoản</label>
                <input type="text" className="form-control" id="bankAccountName" placeholder="Chủ tài khoản" />
            </div>
            <div className="col-md-6">
                <label htmlFor="bankAccountNumber" className="form-label">Số tài khoản</label>
                <input type="text" className="form-control" id="bankAccountNumber" placeholder="Số tài khoản ngân hàng" />
            </div>
            <div className="col-md-6">
                <label htmlFor="bankName" className="form-label">Tên ngân hàng</label>
                <input type="text" className="form-control" id="bankName" placeholder="VD: Vietcombank" />
            </div>
            <div className="col-md-6">
                <label htmlFor="bankBranch" className="form-label">Chi nhánh</label>
                <input type="text" className="form-control" id="bankBranch" placeholder="VD: Sở Giao Dịch" />
            </div>
        </div>

        <h4 className="section-subtitle mt-4">Cài đặt cổng thanh toán (Ví dụ: Stripe)</h4>
        <div className="row g-3">
            <div className="col-md-6">
                <label htmlFor="stripeApiKey" className="form-label">Stripe API Key</label>
                <input type="password" class="form-control" id="stripeApiKey" placeholder="sk_live_... hoặc pk_test_..." />
            </div>
            <div className="col-md-6">
                <label htmlFor="stripeSecretKey" className="form-label">Stripe Secret Key</label>
                <input type="password" class="form-control" id="stripeSecretKey" placeholder="whsec_..." />
            </div>
        </div>
    </div>
);

const BookingSettings = () => (
    <div className="settings-section">
        <div className="mb-3">
            <label htmlFor="cancellationPolicy" className="form-label">Chính sách hủy đặt chỗ</label>
            <textarea className="form-control" id="cancellationPolicy" rows="4" placeholder="Nhập chi tiết chính sách hủy..."></textarea>
        </div>
        <div className="row g-3">
            <div className="col-md-4">
                <label htmlFor="minBookingTime" className="form-label">Thời gian đặt tối thiểu (phút)</label>
                <input type="number" className="form-control" id="minBookingTime" defaultValue="30" />
            </div>
            <div className="col-md-4">
                <label htmlFor="maxBookingTime" className="form-label">Thời gian đặt tối đa (phút)</label>
                <input type="number" className="form-control" id="maxBookingTime" defaultValue="240" />
            </div>
            <div className="col-md-4">
                <label htmlFor="bookingTimeStep" className="form-label">Bước thời gian đặt (phút)</label>
                <select className="form-select" id="bookingTimeStep">
                    <option value="15">15 phút</option>
                    <option value="30" selected>30 phút</option>
                    <option value="60">60 phút</option>
                </select>
            </div>
        </div>
        <div className="form-check form-switch mt-3">
            <input className="form-check-input" type="checkbox" role="switch" id="bookingReminder" defaultChecked />
            <label className="form-check-label" htmlFor="bookingReminder">Gửi thông báo nhắc nhở đặt chỗ</label>
        </div>
    </div>
);

const NotificationSettings = () => (
    <div className="settings-section">
        <h4 className="section-subtitle">Thông báo Email</h4>
        <div className="form-check form-switch mb-2">
            <input className="form-check-input" type="checkbox" role="switch" id="emailNewBooking" defaultChecked />
            <label className="form-check-label" htmlFor="emailNewBooking">Khi có đặt chỗ mới</label>
        </div>
        <div className="form-check form-switch mb-2">
            <input className="form-check-input" type="checkbox" role="switch" id="emailCancelBooking" defaultChecked />
            <label className="form-check-label" htmlFor="emailCancelBooking">Khi hủy đặt chỗ</label>
        </div>
        <div className="form-check form-switch mb-2">
            <input className="form-check-input" type="checkbox" role="switch" id="emailPaymentSuccess" defaultChecked />
            <label className="form-check-label" htmlFor="emailPaymentSuccess">Khi thanh toán thành công</label>
        </div>
        {/* Thêm các checkbox khác cho email */}

        <h4 className="section-subtitle mt-4">Thông báo SMS (nếu có)</h4>
        <p className="text-muted small">Tính năng này yêu cầu tích hợp với nhà cung cấp SMS Gateway.</p>
        <div className="form-check form-switch mb-2">
            <input className="form-check-input" type="checkbox" role="switch" id="smsNewBooking" />
            <label className="form-check-label" htmlFor="smsNewBooking">Khi có đặt chỗ mới</label>
        </div>
        <div className="form-check form-switch mb-2">
            <input className="form-check-input" type="checkbox" role="switch" id="smsCancelBooking" />
            <label className="form-check-label" htmlFor="smsCancelBooking">Khi hủy đặt chỗ</label>
        </div>
    </div>
);

const StaffSettings = () => (
    <div className="settings-section">
        <h4 className="section-subtitle">Quản lý vai trò</h4>
        <button className="btn btn-success btn-sm mb-3">
            <i className="bi bi-plus-circle me-1"></i> Thêm mới vai trò
        </button>
        <div className="table-responsive">
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Tên vai trò</th>
                        <th>Quyền hạn (Mô tả)</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Quản trị viên</td>
                        <td>Toàn quyền quản lý hệ thống</td>
                        <td>
                            <button className="btn btn-sm btn-outline-primary me-1" disabled><i className="bi bi-pencil-square"></i> Sửa</button>
                            <button className="btn btn-sm btn-outline-danger" disabled><i className="bi bi-trash"></i> Xóa</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Nhân viên Lễ tân</td>
                        <td>Quản lý đặt chỗ, check-in/out khách</td>
                        <td>
                            <button className="btn btn-sm btn-outline-primary me-1"><i className="bi bi-pencil-square"></i> Sửa</button>
                            <button className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i> Xóa</button>
                        </td>
                    </tr>
                    {/* Thêm các vai trò khác */}
                </tbody>
            </table>
        </div>
        <p className="mt-3 text-muted small">
            Lưu ý: Quản lý chi tiết quyền hạn cho từng vai trò có thể cần một giao diện phức tạp hơn hoặc trang riêng.
        </p>
    </div>
);

const IntegrationSettings = () => (
    <div className="settings-section">
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">Google Calendar</h5>
                <p className="card-text">Đồng bộ hóa lịch đặt chỗ với Google Calendar của bạn.</p>
                <button className="btn btn-primary"><i className="bi bi-google me-2"></i>Kết nối với Google Calendar</button>
                {/* <p className="text-success mt-2"><i className="bi bi-check-circle-fill me-1"></i> Đã kết nối với example@gmail.com</p> */}
            </div>
        </div>
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">Facebook Messenger</h5>
                <p className="card-text">Tích hợp chatbot hoặc nhận thông báo qua Messenger.</p>
                <button className="btn btn-primary" disabled><i className="bi bi-messenger me-2"></i>Kết nối với Facebook (Sắp có)</button>
            </div>
        </div>
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">Zalo OA</h5>
                <p className="card-text">Gửi thông báo và chăm sóc khách hàng qua Zalo Official Account.</p>
                <button className="btn btn-primary" disabled><i className="bi bi-chat-dots-fill me-2"></i>Kết nối với Zalo (Sắp có)</button>
            </div>
        </div>
        {/* Thêm các khối tích hợp khác */}
    </div>
);


export default SettingsPage;