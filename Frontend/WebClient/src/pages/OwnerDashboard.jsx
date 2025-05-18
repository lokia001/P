import React, { useEffect } from 'react';
import * as bootstrap from 'bootstrap'; // Cho Tooltips
import './OwnerDashboard.css'; // Đảm bảo file CSS này tồn tại và đúng đường dẫn

// --- Helper Functions (Nhất quán hóa thời gian) ---
/**
 * Chuyển đổi đối tượng Date hoặc chuỗi ngày thành định dạng "X [đơn vị] trước" hoặc ngày cụ thể.
 * Ví dụ: "5 phút trước", "2 giờ trước", "Hôm qua", "2 ngày trước", "20/07/2024"
 */
const formatTimeAgo = (dateInput) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} giây trước`;
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days === 1) return 'Hôm qua';
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN'); // Ví dụ: 20/07/2024
};


// --- Dữ liệu giả (Mock Data) đã cập nhật ---
const mockTodayOverview = {
    bookingsToday: 25,
    bookingsComparison: '+5 vs hôm qua',
    estimatedRevenue: '15,500,000 VND',
    revenueComparison: '+10% vs mục tiêu',
    guestsCheckedIn: 42,
    availableSpaces: 8,
};

const mockUpcomingSchedule = {
    // Sử dụng Date object để dễ dàng format với formatTimeAgo
    days: [
        { date: new Date(new Date().setDate(new Date().getDate() - 2)), events: 3 },
        { date: new Date(new Date().setDate(new Date().getDate() - 1)), events: 0 },
        { date: new Date(), events: 5, isToday: true }, // Hôm nay
        { date: new Date(new Date().setDate(new Date().getDate() + 1)), events: 2 },
        { date: new Date(new Date().setDate(new Date().getDate() + 2)), events: 4 },
    ]
};

// CHỈNH SỬA QUAN TRỌNG 2: Cải thiện trạng thái đặt chỗ
const mockLatestBookings = [
    { id: 1, customer: 'Nguyễn Văn An', time: '10:00 - 12:00', spaceType: 'Phòng họp A', status: 'pending_confirmation', createdAt: new Date(Date.now() - 3 * 60 * 1000) }, // Chờ xác nhận
    { id: 2, customer: 'Trần Thị Bích', time: '14:00 - 17:00', spaceType: 'Bàn làm việc #3', status: 'confirmed', createdAt: new Date(Date.now() - 15 * 60 * 1000) }, // Đã xác nhận
    { id: 3, customer: 'Lê Gia Huy', time: '09:00 - 18:00', spaceType: 'Văn phòng riêng S', status: 'pending_payment', createdAt: new Date(Date.now() - 60 * 60 * 1000) }, // Chờ thanh toán
    { id: 4, customer: 'Phạm Thị Mai', time: '11:00 - 13:00', spaceType: 'Bàn làm việc #7', status: 'cancelled', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) }, // Đã hủy
];

// CHỈNH SỬA QUAN TRỌNG 3: Xem xét lại Tỷ Lệ Lấp Đầy
const mockQuickStats = {
    weeklyBookings: { value: 152, trendText: 'Tăng 12% so với tuần trước' },
    monthlyRevenue: { value: '68,200,000 VND', trendText: 'Giảm 5% so với tháng trước' },
    newCustomersThisMonth: { value: 37 },
    occupancyRateThisWeek: { currentValue: 78, comparison: '+5%' } // currentValue và comparison
};

const mockActiveSpaces = [
    { id: 'PH01', name: 'Phòng Họp Lớn', customer: 'Công ty ABC', endTime: '17:00' },
    { id: 'BN05', name: 'Bàn làm việc #05', customer: 'Anh Minh', endTime: '12:30' },
    { id: 'VP02', name: 'Văn phòng S2', customer: 'Chị Mai', endTime: '18:00' }
];

// CHỈNH SỬA QUAN TRỌNG 1: Nhất quán thời gian (sử dụng createdAt và formatTimeAgo)
const mockRecentNotifications = [
    { id: 'N001', message: 'Đặt chỗ mới từ Phan Anh cho Phòng Họp Nhỏ.', createdAt: new Date(Date.now() - 5 * 60 * 1000), type: 'success' },
    { id: 'N002', message: 'Khách hàng Trần Thị Bích đã check-in.', createdAt: new Date(Date.now() - 15 * 60 * 1000), type: 'info' },
    { id: 'N003', message: 'Yêu cầu hỗ trợ từ Bàn #12: "Không có mạng".', createdAt: new Date(Date.now() - 30 * 60 * 1000), type: 'warning' },
    { id: 'N004', message: 'Thanh toán cho đặt chỗ #XYZ123 đã quá hạn.', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), type: 'error' },
];

const mockRecentFeedback = [
    { id: 'F001', user: 'Chị Lan', rating: 5, comment: 'Không gian tuyệt vời, nhân viên nhiệt tình!', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    { id: 'F002', user: 'Anh Tuấn', rating: 4, comment: 'Wifi hơi yếu ở khu vực làm việc chung.', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { id: 'F003', user: 'Cô Hoa', rating: 3, comment: 'Giá hơi cao so với mặt bằng.', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Hôm qua
];


// --- Component chung cho các Widget ---
// CHỈNH SỬA QUAN TRỌNG 4: Đảm bảo nút "Xem tất cả" nhất quán (đã tốt từ trước)
const Widget = ({ title, children, className = "", actionLink, actionText }) => (
    <div className={`widget card shadow-sm ${className}`}>
        <div className="card-header widget-header">
            <h5 className="widget-title mb-0">{title}</h5>
        </div>
        <div className="card-body widget-body">
            {children}
        </div>
        {actionLink && actionText && (
            <div className="card-footer widget-footer text-end">
                <a href={actionLink} className="btn btn-sm btn-outline-primary">
                    {actionText} <i className="bi bi-arrow-right-short"></i>
                </a>
            </div>
        )}
    </div>
);

// --- Các Widget Cụ Thể với Cải Tiến UI/UX ---

// 1. Tổng Quan Nhanh
const QuickOverviewWidget = ({ data }) => {
    const getComparisonClass = (comparisonString) => {
        if (!comparisonString) return 'text-muted';
        if (comparisonString.startsWith('+')) return 'text-success';
        if (comparisonString.startsWith('-')) return 'text-danger';
        return 'text-muted';
    };

    return (
        <Widget title="Tổng Quan Hôm Nay" className="widget-quick-overview">
            <div className="row g-3 text-center">
                <div className="col-md-6 col-xl-3">
                    <div className="overview-item">
                        <i className="bi bi-calendar-check overview-icon text-primary"></i>
                        <h3 className={`overview-value ${getComparisonClass(data.bookingsComparison).replace('text-', 'text-emphasis-')}`}>
                            {data.bookingsToday}
                        </h3>
                        <p className="overview-label text-muted mb-0">Đặt chỗ hôm nay</p>
                        {data.bookingsComparison && (
                            <small className={`overview-comparison ${getComparisonClass(data.bookingsComparison)}`}>
                                {data.bookingsComparison}
                            </small>
                        )}
                    </div>
                </div>
                <div className="col-md-6 col-xl-3">
                    <div className="overview-item">
                        <i className="bi bi-cash-coin overview-icon text-success"></i>
                        <h3 className={`overview-value ${getComparisonClass(data.revenueComparison).replace('text-', 'text-emphasis-')}`}>
                            {data.estimatedRevenue}
                        </h3>
                        <p className="overview-label text-muted mb-0">Doanh thu ước tính</p>
                        {data.revenueComparison && (
                            <small className={`overview-comparison ${getComparisonClass(data.revenueComparison)}`}>
                                {data.revenueComparison}
                            </small>
                        )}
                    </div>
                </div>
                <div className="col-md-6 col-xl-3">
                    <div className="overview-item">
                        <i className="bi bi-people-fill overview-icon text-info"></i>
                        <h3 className="overview-value">{data.guestsCheckedIn}</h3>
                        <p className="overview-label text-muted mb-0">Khách đang sử dụng</p>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3">
                    <div className="overview-item">
                        <i className="bi bi-door-open-fill overview-icon text-warning"></i>
                        <h3 className="overview-value">{data.availableSpaces}</h3>
                        <p className="overview-label text-muted mb-0">Không gian còn trống</p>
                    </div>
                </div>
            </div>
        </Widget>
    );
};

// 2. Lịch Hoạt Động Tóm Tắt
// CHỈNH SỬA QUAN TRỌNG 1: Nhất quán tiêu đề widget
const ActivityCalendarWidget = ({ data }) => {
    const getDayInitial = (dateObj) => {
        return dateObj.toLocaleDateString('vi-VN', { weekday: 'short' }).charAt(0).toUpperCase();
    };
    const getDateNumber = (dateObj) => dateObj.getDate();

    return (
        // Tiêu đề nhất quán: "Lịch Sắp Tới"
        <Widget title="Lịch Sắp Tới" className="widget-activity-calendar" actionText="Xem Lịch Chi Tiết" actionLink="#/calendar">
            <div className="d-flex justify-content-around text-center">
                {data.days.slice(0, 5).map(dayInfo => (
                    <div
                        key={dayInfo.date.toISOString()} // Dùng ISOString cho key duy nhất
                        className={`calendar-day-item p-2 ${dayInfo.isToday ? 'today' : ''} ${dayInfo.events > 0 ? 'has-events' : ''}`}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={dayInfo.events > 0 ? `${dayInfo.events} đặt chỗ` : `Không có đặt chỗ (${dayInfo.date.toLocaleDateString('vi-VN')})`}
                    >
                        <div className="calendar-day-initial">{getDayInitial(dayInfo.date)}</div>
                        <div className="calendar-date-number">{getDateNumber(dayInfo.date)}</div>
                        {dayInfo.events > 0 && <div className="event-indicator"></div>}
                    </div>
                ))}
            </div>
        </Widget>
    );
};

// 3. Đặt Chỗ Mới Nhất/Cần Xử Lý
const LatestBookingsWidget = ({ bookings }) => {
    // CHỈNH SỬA QUAN TRỌNG 2: Cải thiện độ rõ ràng của trạng thái đặt chỗ
    const getBookingStatusDisplay = (status) => {
        switch (status) {
            case 'pending_confirmation':
                return { text: 'Chờ xác nhận', colorClass: 'warning', icon: 'bi-hourglass-split' };
            case 'confirmed':
                return { text: 'Đã xác nhận', colorClass: 'success', icon: 'bi-check-circle-fill' };
            case 'pending_payment':
                return { text: 'Chờ thanh toán', colorClass: 'info', icon: 'bi-credit-card' };
            case 'cancelled':
                return { text: 'Đã hủy', colorClass: 'danger', icon: 'bi-x-circle-fill' };
            default:
                return { text: status, colorClass: 'secondary', icon: 'bi-question-circle' };
        }
    };

    return (
        <Widget title="Đặt Chỗ Mới/Cần Xử Lý" className="widget-latest-bookings" actionText="Xem Tất Cả Đặt Chỗ" actionLink="#/bookings">
            {bookings.length > 0 ? (
                <ul className="list-group list-group-flush">
                    {bookings.slice(0, 3).map(booking => {
                        const statusDisplay = getBookingStatusDisplay(booking.status);
                        return (
                            <li key={booking.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-0 booking-customer">{booking.customer}</h6>
                                    <small className="text-muted d-block">{booking.spaceType}</small>
                                    <small className="text-muted d-block">
                                        <i className="bi bi-clock me-1"></i>{booking.time}
                                    </small>
                                    {/* CHỈNH SỬA QUAN TRỌNG 1: Nhất quán hiển thị thời gian */}
                                    <small className="text-muted d-block fst-italic">{formatTimeAgo(booking.createdAt)}</small>
                                    <span className={`badge booking-status-badge bg-${statusDisplay.colorClass}-subtle text-${statusDisplay.colorClass} border border-${statusDisplay.colorClass}-subtle mt-1`}>
                                        <i className={`bi ${statusDisplay.icon} me-1`}></i>
                                        {statusDisplay.text}
                                    </span>
                                </div>
                                <div className="booking-actions">
                                    {booking.status === 'pending_confirmation' &&
                                        <button className="btn btn-sm btn-outline-success me-1" title="Xác nhận" data-bs-toggle="tooltip" data-bs-placement="top"><i className="bi bi-check-lg"></i></button>
                                    }
                                    {(booking.status === 'pending_confirmation' || booking.status === 'pending_payment') &&
                                        <button className="btn btn-sm btn-outline-danger" title="Hủy" data-bs-toggle="tooltip" data-bs-placement="top"><i className="bi bi-x-lg"></i></button>
                                    }
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-muted text-center p-3">Không có đặt chỗ mới.</p>
            )}
        </Widget>
    );
};

// 4. Thống Kê Nhanh (chia thành các widget nhỏ)
const QuickStatCard = ({ title, value, icon, trendText, chartType, currentValue, comparison }) => {
    // CHỈNH SỬA QUAN TRỌNG 3: Làm rõ Tỷ Lệ Lấp Đầy
    let displayValue = value;
    let displayTrendText = trendText;
    if (typeof currentValue === 'number' && comparison) { // Dành riêng cho Tỷ Lệ Lấp Đầy
        displayValue = `${currentValue}%`;
        displayTrendText = `So với kỳ trước: ${comparison}`;
    }

    const trendIcon = displayTrendText && (displayTrendText.toLowerCase().includes('tăng') || displayTrendText.includes('+')) ? 'bi-arrow-up-right text-success' : (displayTrendText && (displayTrendText.toLowerCase().includes('giảm') || displayTrendText.includes('-')) ? 'bi-arrow-down-right text-danger' : '');
    return (
        <div className="col-md-6 col-lg-3 mb-4">
            <Widget title={title} className="widget-quick-stat h-100">
                <div className="d-flex align-items-center mb-2">
                    {icon && <i className={`bi ${icon} quick-stat-icon me-3`}></i>}
                    <h4 className="quick-stat-value mb-0">{displayValue}</h4>
                </div>
                {chartType === 'line-small' && (
                    <div className="mini-chart-line-placeholder my-2">
                        <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '30px' }}>
                            <polyline fill="none" stroke={trendIcon.includes('text-success') ? 'var(--bs-success)' : (trendIcon.includes('text-danger') ? 'var(--bs-danger)' : 'var(--bs-primary)')} strokeWidth="2" points="0,25 20,15 40,20 60,10 80,18 100,12" />
                        </svg>
                    </div>
                )}
                {chartType === 'bar-small' && (
                    <div className="mini-chart-bar-placeholder my-2">
                        <div style={{ display: 'flex', height: '30px', alignItems: 'flex-end', justifyContent: 'space-around' }}>
                            <div style={{ width: '15%', height: '60%', backgroundColor: trendIcon.includes('text-success') ? 'var(--bs-success-bg-subtle)' : (trendIcon.includes('text-danger') ? 'var(--bs-danger-bg-subtle)' : 'var(--bs-info-bg-subtle)'), borderRadius: '2px' }}></div>
                            <div style={{ width: '15%', height: '80%', backgroundColor: trendIcon.includes('text-success') ? 'var(--bs-success-bg-subtle)' : (trendIcon.includes('text-danger') ? 'var(--bs-danger-bg-subtle)' : 'var(--bs-info-bg-subtle)'), borderRadius: '2px' }}></div>
                            <div style={{ width: '15%', height: '50%', backgroundColor: trendIcon.includes('text-success') ? 'var(--bs-success-bg-subtle)' : (trendIcon.includes('text-danger') ? 'var(--bs-danger-bg-subtle)' : 'var(--bs-info-bg-subtle)'), borderRadius: '2px' }}></div>
                            <div style={{ width: '15%', height: '70%', backgroundColor: trendIcon.includes('text-success') ? 'var(--bs-success-bg-subtle)' : (trendIcon.includes('text-danger') ? 'var(--bs-danger-bg-subtle)' : 'var(--bs-info-bg-subtle)'), borderRadius: '2px' }}></div>
                        </div>
                    </div>
                )}
                {chartType === 'pie-small-text' && (
                    <div className="mini-chart-pie-placeholder d-flex align-items-center my-2">
                        {/* Icon đã có từ prop `icon` */}
                    </div>
                )}
                {displayTrendText && (
                    <p className="quick-stat-trend text-muted small mb-0">
                        {trendIcon && <i className={`bi ${trendIcon} me-1`}></i>}
                        {displayTrendText}
                    </p>
                )}
            </Widget>
        </div>
    );
};


// 5. Không Gian Hoạt Động
const ActiveSpacesWidget = ({ spaces }) => (
    <Widget title="Không Gian Đang Sử Dụng" className="widget-active-spaces" actionText="Xem Quản Lý Không Gian" actionLink="#/spaces">
        {spaces.length > 0 ? (
            <ul className="list-group list-group-flush">
                {spaces.slice(0, 3).map(space => (
                    <li key={space.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong className="d-block">{space.name} <span className="text-muted">({space.id})</span></strong>
                                <small className="text-muted">Khách: {space.customer}</small>
                            </div>
                            <small className="text-muted">
                                <i className="bi bi-clock-history me-1"></i>Kết thúc: {space.endTime}
                            </small>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-muted text-center p-3">Không có không gian nào đang được sử dụng.</p>
        )}
    </Widget>
);

// 6. Thông Báo Gần Đây
// Điểm tiềm năng: Làm nổi bật thông báo quan trọng (đã có qua type và icon/color)
const RecentNotificationsWidget = ({ notifications }) => {
    const getNotificationIconAndColor = (type) => {
        switch (type) {
            case 'success':
                return { icon: 'bi-check-circle-fill', colorClass: 'text-success' };
            case 'info':
                return { icon: 'bi-info-circle-fill', colorClass: 'text-info' };
            case 'warning':
                return { icon: 'bi-exclamation-triangle-fill', colorClass: 'text-warning' };
            case 'error':
                return { icon: 'bi-x-octagon-fill', colorClass: 'text-danger' };
            default:
                return { icon: 'bi-bell-fill', colorClass: 'text-secondary' };
        }
    };

    return (
        <Widget title="Thông Báo Mới" className="widget-recent-notifications" actionText="Xem Tất Cả Thông Báo" actionLink="#/notifications">
            {notifications.length > 0 ? (
                <ul className="list-group list-group-flush">
                    {notifications.slice(0, 4).map(notification => {
                        const { icon, colorClass } = getNotificationIconAndColor(notification.type);
                        return (
                            <li key={notification.id} className="list-group-item notification-item">
                                <div className="d-flex w-100">
                                    <i className={`bi ${icon} ${colorClass} notification-icon me-3 mt-1`}></i>
                                    <div className="flex-grow-1">
                                        <p className={`mb-0 notification-message message-${notification.type}`}>{notification.message}</p>
                                        {/* CHỈNH SỬA QUAN TRỌNG 1: Nhất quán hiển thị thời gian */}
                                        <small className="text-muted notification-time">{formatTimeAgo(notification.createdAt)}</small>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-muted text-center p-3">Không có thông báo mới.</p>
            )}
        </Widget>
    );
};

// 7. Phản Hồi Gần Đây Từ Người Dùng
// Điểm tiềm năng: Cung cấp thêm ngữ cảnh cho phản hồi (hiển thị sao - đã có)
const RecentFeedbackWidget = ({ feedbackItems }) => (
    <Widget title="Phản Hồi Mới" className="widget-recent-feedback" actionText="Xem Tất Cả Phản Hồi" actionLink="#/feedback">
        {feedbackItems.length > 0 ? (
            <ul className="list-group list-group-flush">
                {feedbackItems.slice(0, 3).map(item => (
                    <li key={item.id} className="list-group-item">
                        <div className="d-flex justify-content-between">
                            <h6 className="mb-1 feedback-user">{item.user}</h6>
                            {/* CHỈNH SỬA QUAN TRỌNG 1: Nhất quán hiển thị thời gian */}
                            <small className="text-muted">{formatTimeAgo(item.createdAt)}</small>
                        </div>
                        <div className="feedback-rating mb-1">
                            {Array(item.rating).fill(0).map((_, i) => <i key={`star-fill-${i}`} className="bi bi-star-fill text-warning me-1 feedback-star"></i>)}
                            {Array(5 - item.rating).fill(0).map((_, i) => <i key={`star-empty-${i}`} className="bi bi-star text-warning me-1 feedback-star"></i>)}
                        </div>
                        <p className="mb-0 feedback-comment fst-italic">"{item.comment}"</p>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-muted text-center p-3">Chưa có phản hồi nào.</p>
        )}
    </Widget>
);


// --- Component chính của Dashboard ---
function OwnerDashboard() {
    useEffect(() => {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

        return () => { // Cleanup tooltips khi component unmount
            tooltipList.forEach(tooltip => tooltip.dispose());
        };
    }, []);

    return (
        <div className="owner-dashboard-container container-fluid p-3 p-md-4">
            <h1 className="dashboard-main-title mb-4">Bảng Điều Khiển Chủ Sở Hữu</h1>

            <div className="row mb-4">
                <div className="col-12">
                    <QuickOverviewWidget data={mockTodayOverview} />
                </div>
            </div>

            <div className="row mb-4 gy-4">
                <div className="col-lg-7">
                    <ActivityCalendarWidget data={mockUpcomingSchedule} />
                </div>
                <div className="col-lg-5">
                    <LatestBookingsWidget bookings={mockLatestBookings} />
                </div>
            </div>

            <div className="row mb-4 gy-4">
                <QuickStatCard
                    title="Đặt Chỗ Tuần Này"
                    value={mockQuickStats.weeklyBookings.value}
                    icon="bi-graph-up-arrow"
                    trendText={mockQuickStats.weeklyBookings.trendText}
                    chartType="line-small"
                />
                <QuickStatCard
                    title="Doanh Thu Tháng Này"
                    value={mockQuickStats.monthlyRevenue.value}
                    icon="bi-cash-stack"
                    trendText={mockQuickStats.monthlyRevenue.trendText}
                    chartType="bar-small"
                />
                <QuickStatCard
                    title="Khách Hàng Mới (Tháng)"
                    value={mockQuickStats.newCustomersThisMonth.value}
                    icon="bi-person-plus-fill"
                    trendText={`${mockQuickStats.newCustomersThisMonth.value} khách mới trong tháng`}
                />
                {/* CHỈNH SỬA QUAN TRỌNG 3: Truyền props mới cho Tỷ Lệ Lấp Đầy */}
                <QuickStatCard
                    title="Tỷ Lệ Lấp Đầy (Tuần)"
                    icon="bi-pie-chart-fill"
                    currentValue={mockQuickStats.occupancyRateThisWeek.currentValue}
                    comparison={mockQuickStats.occupancyRateThisWeek.comparison}
                    chartType="pie-small-text" // Không cần biểu đồ phức tạp, chỉ text là đủ
                />
            </div>

            <div className="row mb-4 gy-4">
                <div className="col-lg-6">
                    <ActiveSpacesWidget spaces={mockActiveSpaces} />
                </div>
                <div className="col-lg-6">
                    <RecentNotificationsWidget notifications={mockRecentNotifications} />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-lg-8 col-md-12">
                    <RecentFeedbackWidget feedbackItems={mockRecentFeedback} />
                </div>
            </div>

        </div>
    );
}

export default OwnerDashboard;