import React, { useState, useEffect } from 'react';
import './BookingManagementPage.css'; // Đảm bảo file CSS được import

// Cấu hình trạng thái (màu sắc, nhãn)
const statusConfig = {
    'Đã xác nhận': { label: 'Đã xác nhận', badgeClass: 'status-confirmed', dotStyle: { backgroundColor: '#d1e7dd', borderColor: '#a3cfbb' } },
    'Chờ xác nhận': { label: 'Chờ xác nhận', badgeClass: 'status-pending-confirmation', dotStyle: { backgroundColor: '#fff3cd', borderColor: '#ffe69c' } },
    'Đã check-in': { label: 'Đã check-in', badgeClass: 'status-checked-in', dotStyle: { backgroundColor: '#cff4fc', borderColor: '#9eeaf9' } },
    'Đã check-out': { label: 'Đã check-out', badgeClass: 'status-checked-out', dotStyle: { backgroundColor: '#e2e3e5', borderColor: '#c6c8ca' } },
    'Đã hủy': { label: 'Đã hủy', badgeClass: 'status-cancelled', dotStyle: { backgroundColor: '#f8d7da', borderColor: '#f1aeb5' } },
    'Chờ thanh toán': { label: 'Chờ thanh toán', badgeClass: 'status-pending-payment', dotStyle: { backgroundColor: '#f0e6ff', borderColor: '#d3bcf2' } }
};

// Hàm tiện ích để lấy class cho badge trạng thái
const getStatusBadgeClass = (status) => statusConfig[status]?.badgeClass || 'bg-secondary text-white';


// Giả lập dữ liệu đặt chỗ (bổ sung customerPhone và notes)
const initialBookings = [
    {
        id: 'BK001',
        customerName: 'Nguyễn Văn An',
        customerLink: '/customers/1',
        customerPhone: '0901234567',
        notes: 'Yêu cầu ghế gần cửa sổ.',
        spaceName: 'Phòng Họp Alpha',
        spaceLink: '/spaces/alpha',
        spaceType: 'Phòng họp',
        startTime: '2024-03-15 09:00',
        endTime: '2024-03-15 11:00',
        status: 'Đã xác nhận',
        totalAmount: '500,000 VND',
    },
    {
        id: 'BK002',
        customerName: 'Trần Thị Bình',
        customerLink: '/customers/2',
        customerPhone: '0912345678',
        notes: '',
        spaceName: 'Bàn làm việc B01',
        spaceLink: '/spaces/b01',
        spaceType: 'Bàn đơn',
        startTime: '2024-03-16 14:00',
        endTime: '2024-03-16 18:00',
        status: 'Chờ xác nhận',
        totalAmount: '200,000 VND',
    },
    {
        id: 'BK003',
        customerName: 'Lê Văn Cường',
        customerLink: '/customers/3',
        customerPhone: '0987654321',
        notes: 'Khách VIP, ưu tiên hỗ trợ.',
        spaceName: 'Khu vực chung Zone A',
        spaceLink: '/spaces/zone-a',
        spaceType: 'Khu vực chung',
        startTime: '2024-03-17 10:00',
        endTime: '2024-03-17 12:00',
        status: 'Đã check-in',
        totalAmount: '150,000 VND',
    },
    {
        id: 'BK004',
        customerName: 'Phạm Thị Dung',
        customerLink: '/customers/4',
        customerPhone: '0900000001',
        notes: '',
        spaceName: 'Phòng Họp Beta',
        spaceLink: '/spaces/beta',
        spaceType: 'Phòng họp',
        startTime: '2024-03-18 13:00',
        endTime: '2024-03-18 17:00',
        status: 'Đã hủy',
        totalAmount: '700,000 VND',
    },
    {
        id: 'BK005',
        customerName: 'Hoàng Văn Em',
        customerLink: '/customers/5',
        customerPhone: '0900000002',
        notes: 'Cần hỗ trợ máy chiếu và bảng trắng.',
        spaceName: 'Bàn làm việc C05',
        spaceLink: '/spaces/c05',
        spaceType: 'Bàn đơn',
        startTime: '2024-03-19 08:00',
        endTime: '2024-03-19 17:00',
        status: 'Chờ thanh toán',
        totalAmount: '300,000 VND',
    },
    {
        id: 'BK006',
        customerName: 'Vũ Thị Giang',
        customerLink: '/customers/6',
        customerPhone: '0900000003',
        notes: '',
        spaceName: 'Phòng Họp Gamma',
        spaceLink: '/spaces/gamma',
        spaceType: 'Phòng họp',
        startTime: '2024-03-20 09:30',
        endTime: '2024-03-20 11:30',
        status: 'Đã check-out',
        totalAmount: '450,000 VND',
    },
];


function BookingManagementPage() {
    const [bookings, setBookings] = useState(initialBookings);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tất cả');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [spaceTypeFilter, setSpaceTypeFilter] = useState('Tất cả');
    const [selectedBookings, setSelectedBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleSearchChange = (event) => setSearchTerm(event.target.value);
    const handleStatusFilterChange = (event) => setStatusFilter(event.target.value);
    const handleDateRangeChange = (type, value) => setDateRange(prev => ({ ...prev, [type]: value }));
    const handleSpaceTypeFilterChange = (event) => setSpaceTypeFilter(event.target.value);

    const handleSelectBooking = (bookingId) => {
        setSelectedBookings(prevSelected =>
            prevSelected.includes(bookingId)
                ? prevSelected.filter(id => id !== bookingId)
                : [...prevSelected, bookingId]
        );
    };

    const handleSelectAllBookings = (event) => {
        if (event.target.checked) {
            setSelectedBookings(paginatedBookings.map(b => b.id));
        } else {
            setSelectedBookings([]);
        }
    };

    const handleChangeBookingStatus = (bookingId, newStatus) => {
        // Đây là nơi bạn sẽ gọi API để cập nhật trạng thái
        console.log(`Thay đổi trạng thái của đặt chỗ ${bookingId} thành ${newStatus}`);
        // Cập nhật UI (ví dụ)
        setBookings(prevBookings =>
            prevBookings.map(b =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            )
        );
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = searchTerm === '' ||
            booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.spaceName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'Tất cả' || booking.status === statusFilter;
        const matchesSpaceType = spaceTypeFilter === 'Tất cả' || booking.spaceType === spaceTypeFilter;

        let matchesDate = true;
        if (dateRange.start && dateRange.end) {
            const bookingStartTime = new Date(booking.startTime).getTime();
            const filterStartTime = new Date(dateRange.start).getTime();
            // Để so sánh ngày kết thúc, ta cần đặt giờ của ngày kết thúc của bộ lọc thành cuối ngày
            const filterEndTime = new Date(dateRange.end);
            filterEndTime.setHours(23, 59, 59, 999);
            matchesDate = bookingStartTime >= filterStartTime && bookingStartTime <= filterEndTime.getTime();
        } else if (dateRange.start) {
            matchesDate = new Date(booking.startTime).getTime() >= new Date(dateRange.start).getTime();
        } else if (dateRange.end) {
            const filterEndTime = new Date(dateRange.end);
            filterEndTime.setHours(23, 59, 59, 999);
            matchesDate = new Date(booking.startTime).getTime() <= filterEndTime.getTime();
        }

        return matchesSearch && matchesStatus && matchesSpaceType && matchesDate;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        setSelectedBookings([]); // Reset lựa chọn khi chuyển trang
    };

    // Tạo tooltip cho hàng
    const generateRowTooltip = (booking) => {
        let tooltipParts = [];
        tooltipParts.push(`Khách hàng: ${booking.customerName}`);
        if (booking.customerPhone) tooltipParts.push(`SĐT: ${booking.customerPhone}`);
        if (booking.notes) tooltipParts.push(`Ghi chú: ${booking.notes}`);
        return tooltipParts.join(' | ');
    };

    return (
        <div className="container-fluid booking-management-page p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Quản Lý Đặt Chỗ</h1>
                <button className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>Thêm Đặt Chỗ Mới
                </button>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-lg-4 col-md-6">
                            <label htmlFor="searchInput" className="form-label">Tìm kiếm</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchInput"
                                    placeholder="Tên khách, mã, không gian..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <button className="btn btn-outline-secondary" type="button">
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-6">
                            <label htmlFor="statusFilter" className="form-label">Trạng thái</label>
                            <select
                                id="statusFilter"
                                className="form-select"
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                            >
                                <option value="Tất cả">Tất cả</option>
                                {Object.keys(statusConfig).map(statusKey => (
                                    <option key={statusKey} value={statusKey}>{statusConfig[statusKey].label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <label htmlFor="dateRangeStart" className="form-label">Khoảng thời gian</label>
                            <div className="input-group">
                                <input type="date" id="dateRangeStart" className="form-control" value={dateRange.start} onChange={(e) => handleDateRangeChange('start', e.target.value)} title="Ngày bắt đầu" />
                                <span className="input-group-text">-</span>
                                <input type="date" id="dateRangeEnd" className="form-control" value={dateRange.end} onChange={(e) => handleDateRangeChange('end', e.target.value)} title="Ngày kết thúc" />
                            </div>
                            {/* <div className="mt-1">
                <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => console.log('Filter Today')}>Hôm nay</button>
                <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => console.log('Filter This Week')}>Tuần này</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => console.log('Filter This Month')}>Tháng này</button>
              </div> */}
                        </div>

                        <div className="col-lg-2 col-md-4">
                            <label htmlFor="spaceTypeFilter" className="form-label">Loại không gian</label>
                            <select
                                id="spaceTypeFilter"
                                className="form-select"
                                value={spaceTypeFilter}
                                onChange={handleSpaceTypeFilterChange}
                            >
                                <option value="Tất cả">Tất cả</option>
                                <option value="Bàn đơn">Bàn đơn</option>
                                <option value="Phòng họp">Phòng họp</option>
                                <option value="Khu vực chung">Khu vực chung</option>
                            </select>
                        </div>

                        <div className="col-lg-1 col-md-2">
                            <button className="btn btn-outline-info w-100" title="Lọc nâng cao">
                                <i className="bi bi-filter-circle-fill"></i> {/* Changed to filled icon */}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-light py-3 d-flex flex-wrap justify-content-between align-items-center">
                    <h5 className="mb-0">Danh sách đặt chỗ</h5>
                    <div className="dropdown">
                        <button
                            className="btn btn-secondary dropdown-toggle btn-sm"
                            type="button"
                            id="bulkActionsDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            disabled={selectedBookings.length === 0}
                        >
                            {selectedBookings.length > 0 ? `Thao tác (${selectedBookings.length})` : 'Hành động hàng loạt'}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="bulkActionsDropdown">
                            <li><a className="dropdown-item" href="#">Xác nhận các mục đã chọn</a></li>
                            <li><a className="dropdown-item" href="#">Hủy các mục đã chọn</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item text-danger" href="#">Xóa các mục đã chọn</a></li>
                        </ul>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-striped mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" className="text-center" style={{ width: "5%" }}>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            onChange={handleSelectAllBookings}
                                            checked={paginatedBookings.length > 0 && selectedBookings.length === paginatedBookings.length}
                                            disabled={paginatedBookings.length === 0}
                                            title={paginatedBookings.length > 0 ? "Chọn/Bỏ chọn tất cả trên trang này" : "Không có mục nào để chọn"}
                                        />
                                    </th>
                                    <th scope="col">Mã Đặt Chỗ <i className="bi bi-arrow-down-up small text-muted"></i></th>
                                    <th scope="col">Khách Hàng <i className="bi bi-arrow-down-up small text-muted"></i></th>
                                    <th scope="col">Không Gian</th>
                                    <th scope="col">Loại Không Gian</th>
                                    <th scope="col">Bắt Đầu <i className="bi bi-arrow-down-up small text-muted"></i></th>
                                    <th scope="col">Kết Thúc</th>
                                    <th scope="col" className="text-center">Trạng Thái <i className="bi bi-arrow-down-up small text-muted"></i></th>
                                    <th scope="col" className="text-end">Tổng Tiền</th>
                                    <th scope="col" className="text-center" style={{ minWidth: "130px" }}>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedBookings.length > 0 ? (
                                    paginatedBookings.map((booking) => (
                                        <tr key={booking.id} title={generateRowTooltip(booking)}>
                                            <td className="text-center">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={selectedBookings.includes(booking.id)}
                                                    onChange={() => handleSelectBooking(booking.id)}
                                                />
                                            </td>
                                            <td>{booking.id}</td>
                                            <td><a href={booking.customerLink} onClick={(e) => e.preventDefault()}>{booking.customerName}</a></td>
                                            <td><a href={booking.spaceLink} onClick={(e) => e.preventDefault()}>{booking.spaceName}</a></td>
                                            <td>{booking.spaceType}</td>
                                            <td>{new Date(booking.startTime).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                                            <td>{new Date(booking.endTime).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                                            <td className="text-center">
                                                <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                                                    {statusConfig[booking.status]?.label || booking.status}
                                                </span>
                                            </td>
                                            <td className="text-end">{booking.totalAmount}</td>
                                            <td className="text-center">
                                                <button className="btn btn-sm btn-outline-primary me-1" title="Xem chi tiết">
                                                    <i className="bi bi-eye-fill"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-warning me-1" title="Sửa đặt chỗ">
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <div className="dropdown d-inline-block">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                                        type="button"
                                                        id={`actions-${booking.id}`}
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                        title="Thêm hành động"
                                                    >
                                                        <i className="bi bi-three-dots-vertical"></i>
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`actions-${booking.id}`}>
                                                        <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}><i className="bi bi-receipt me-2"></i>Xem hóa đơn</a></li>
                                                        <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}><i className="bi bi-envelope me-2"></i>Gửi thông báo</a></li>
                                                        <li><hr className="dropdown-divider" /></li>
                                                        <li className="dropdown-header">Thay đổi trạng thái</li>
                                                        {Object.keys(statusConfig).map(statusKey => (
                                                            <li key={statusKey}>
                                                                <a
                                                                    className={`dropdown-item d-flex align-items-center ${booking.status === statusKey ? 'active' : ''}`}
                                                                    href="#"
                                                                    onClick={(e) => { e.preventDefault(); handleChangeBookingStatus(booking.id, statusKey); }}
                                                                >
                                                                    <span className="status-dot" style={{ ...statusConfig[statusKey].dotStyle }}></span>
                                                                    {statusConfig[statusKey].label}
                                                                </a>
                                                            </li>
                                                        ))}
                                                        <li><hr className="dropdown-divider" /></li>
                                                        <li><a className="dropdown-item text-danger" href="#" onClick={(e) => e.preventDefault()}><i className="bi bi-trash me-2"></i>Hủy đặt chỗ này</a></li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center p-5">
                                            <i className="bi bi-inbox fs-1 text-muted mb-2 d-block"></i>
                                            <h5 className="mb-1">Không tìm thấy đặt chỗ nào.</h5>
                                            <p className="text-muted mb-0">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {filteredBookings.length > 0 && (
                    <div className="card-footer bg-light py-3 d-flex flex-wrap justify-content-between align-items-center">
                        <small className="text-muted mb-2 mb-md-0">
                            Hiển thị {paginatedBookings.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredBookings.length)} trên tổng số {filteredBookings.length} đặt chỗ
                        </small>
                        {totalPages > 1 && (
                            <nav aria-label="Page navigation">
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Trước</button>
                                    </li>
                                    {[...Array(totalPages).keys()].map(number => (
                                        <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageChange(number + 1)}>{number + 1}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Sau</button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookingManagementPage;