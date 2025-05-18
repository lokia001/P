import React, { useState, useMemo } from 'react';
import './CustomerManagement.css'; // Giữ lại file CSS cho các tùy chỉnh khác nếu có
// Giả sử bạn sẽ dùng Bootstrap Icons, bạn có thể import chúng như sau:
// import 'bootstrap-icons/font/bootstrap-icons.css';

// Dữ liệu mẫu
const mockCustomersData = [
    {
        id: 'KH001',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
        bookings: 12,
        lastBookingDate: '2024-07-15',
        totalSpending: 5500000,
        customerType: 'Cá nhân',
        frequentSpace: 'Phòng họp nhỏ',
    },
    {
        id: 'KH002',
        name: 'Trần Thị B',
        email: 'tranthib@example.com',
        phone: '0912345678',
        bookings: 5,
        lastBookingDate: '2024-06-20',
        totalSpending: 2300000,
        customerType: 'Doanh nghiệp',
        frequentSpace: 'Chỗ ngồi cố định',
    },
    {
        id: 'KH003',
        name: 'Lê Văn C',
        email: 'levanc@example.com',
        phone: '0987654321',
        bookings: 8,
        lastBookingDate: '2024-07-01',
        totalSpending: 3100000,
        customerType: 'Cá nhân',
        frequentSpace: 'Phòng họp lớn',
    },
    {
        id: 'KH004',
        name: 'Phạm Thị D',
        email: 'phamthid@example.com',
        phone: '0978123456',
        bookings: 2,
        lastBookingDate: '2024-05-10',
        totalSpending: 900000,
        customerType: 'Cá nhân',
        frequentSpace: 'Chỗ ngồi linh hoạt',
    },
    {
        id: 'KH005',
        name: 'Công ty TNHH XYZ',
        email: 'contact@xyz.com',
        phone: '02834567890',
        bookings: 25, // Khách hàng này đạt ngưỡng visualization
        lastBookingDate: '2024-07-18',
        totalSpending: 15000000,
        customerType: 'Doanh nghiệp',
        frequentSpace: 'Văn phòng riêng',
    },
    {
        id: 'KH006',
        name: 'Hoàng Văn E',
        email: 'hoangvane@example.com',
        phone: '0933112233',
        bookings: 1,
        lastBookingDate: '2024-03-01',
        totalSpending: 450000,
        customerType: 'Cá nhân',
        frequentSpace: 'Chỗ ngồi linh hoạt',
    },
    {
        id: 'KH007',
        name: 'Đặng Thị F',
        email: 'dangthif@example.com',
        phone: '0944556677',
        bookings: 18,
        lastBookingDate: '2024-07-10',
        totalSpending: 2800000,
        customerType: 'Cá nhân',
        frequentSpace: 'Phòng họp nhỏ',
    },
];

const ITEMS_PER_PAGE = 5;
const MAX_BOOKINGS_FOR_VISUALIZATION = 25; // Ngưỡng cho trực quan hóa số lần đặt

function CustomerManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [filterBookings, setFilterBookings] = useState(''); // Giá trị sẽ là số lần đặt tối thiểu
    const [filterCustomerType, setFilterCustomerType] = useState('');
    const [filterFrequentSpace, setFilterFrequentSpace] = useState('');

    const [customers, setCustomers] = useState(mockCustomersData);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const filteredCustomers = useMemo(() => {
        let result = [...customers];

        if (searchTerm) {
            result = result.filter(customer =>
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone.includes(searchTerm)
            );
        }

        if (filterDateFrom) {
            result = result.filter(customer => new Date(customer.lastBookingDate) >= new Date(filterDateFrom));
        }
        if (filterDateTo) {
            result = result.filter(customer => new Date(customer.lastBookingDate) <= new Date(filterDateTo));
        }

        if (filterBookings) {
            const minBookings = parseInt(filterBookings, 10);
            if (!isNaN(minBookings)) {
                result = result.filter(customer => customer.bookings >= minBookings);
            }
        }

        if (filterCustomerType) {
            result = result.filter(customer => customer.customerType === filterCustomerType);
        }

        if (filterFrequentSpace) {
            result = result.filter(customer => customer.frequentSpace === filterFrequentSpace);
        }

        if (sortConfig.key) {
            result.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];

                // Xử lý cho trường hợp số
                if (typeof valA === 'number' && typeof valB === 'number') {
                    // Sắp xếp số
                } else { // Mặc định sắp xếp chuỗi
                    valA = String(valA).toLowerCase();
                    valB = String(valB).toLowerCase();
                }

                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [customers, searchTerm, filterDateFrom, filterDateTo, filterBookings, filterCustomerType, filterFrequentSpace, sortConfig]);

    const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
    const paginatedCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredCustomers, currentPage]);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1); // Reset về trang đầu khi sắp xếp
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '▲' : '▼';
        }
        return ''; // Hoặc '↕' nếu muốn
    };

    const handleQuickDateFilter = (period) => {
        const today = new Date();
        let fromDate = '';
        let toDate = today.toISOString().split('T')[0];

        switch (period) {
            case 'thisWeek':
                const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)));
                fromDate = firstDayOfWeek.toISOString().split('T')[0];
                break;
            case 'thisMonth':
                fromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                break;
            case 'thisYear':
                fromDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                break;
            default:
                fromDate = '';
                toDate = '';
        }
        setFilterDateFrom(fromDate);
        setFilterDateTo(toDate);
        setCurrentPage(1);
    };

    const getBookingProgress = (bookings) => {
        const percentage = Math.min((bookings / MAX_BOOKINGS_FOR_VISUALIZATION) * 100, 100);
        return percentage;
    };

    return (
        <div className="container-fluid customer-management-page py-3">
            <h2 className="my-4 page-title">Quản Lý Khách Hàng / Customer Management</h2>

            <div className="card shadow-sm mb-4 filter-card">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-4 col-lg-3">
                            <label htmlFor="searchTerm" className="form-label">Tìm kiếm từ khóa:</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                id="searchTerm"
                                placeholder="Tên, email, SĐT..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>

                        <div className="col-md-4 col-lg-3">
                            <label className="form-label">Lần đặt gần nhất:</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="date"
                                    className="form-control"
                                    value={filterDateFrom}
                                    onChange={(e) => { setFilterDateFrom(e.target.value); setCurrentPage(1); }}
                                    title="Từ ngày"
                                />
                                <span className="input-group-text">-</span>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={filterDateTo}
                                    onChange={(e) => { setFilterDateTo(e.target.value); setCurrentPage(1); }}
                                    title="Đến ngày"
                                />
                            </div>
                            <div className="mt-1 quick-filters">
                                <button className="btn btn-xs btn-outline-secondary me-1" onClick={() => handleQuickDateFilter('thisWeek')}>Tuần này</button>
                                <button className="btn btn-xs btn-outline-secondary me-1" onClick={() => handleQuickDateFilter('thisMonth')}>Tháng này</button>
                                <button className="btn btn-xs btn-outline-secondary" onClick={() => handleQuickDateFilter('thisYear')}>Năm nay</button>
                            </div>
                        </div>

                        <div className="col-md-4 col-lg-2">
                            {/* Cải tiến 1: Nhãn bộ lọc số lần đặt */}
                            <label htmlFor="filterBookings" className="form-label">Số lần đặt tối thiểu:</label>
                            <select
                                id="filterBookings"
                                className="form-select form-select-sm"
                                value={filterBookings}
                                onChange={(e) => { setFilterBookings(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="">Tất cả</option>
                                <option value="1">1+</option>
                                <option value="5">5+</option>
                                <option value="10">10+</option>
                                <option value="20">20+</option>
                            </select>
                        </div>

                        <div className="col-md-4 col-lg-2">
                            <label htmlFor="filterCustomerType" className="form-label">Loại khách hàng:</label>
                            <select
                                id="filterCustomerType"
                                className="form-select form-select-sm"
                                value={filterCustomerType}
                                onChange={(e) => { setFilterCustomerType(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="">Tất cả</option>
                                <option value="Cá nhân">Cá nhân</option>
                                <option value="Doanh nghiệp">Doanh nghiệp</option>
                            </select>
                        </div>

                        <div className="col-md-4 col-lg-2">
                            <label htmlFor="filterFrequentSpace" className="form-label">Không gian thường dùng:</label>
                            <select
                                id="filterFrequentSpace"
                                className="form-select form-select-sm"
                                value={filterFrequentSpace}
                                onChange={(e) => { setFilterFrequentSpace(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="">Tất cả</option>
                                <option value="Phòng họp nhỏ">Phòng họp nhỏ</option>
                                <option value="Phòng họp lớn">Phòng họp lớn</option>
                                <option value="Chỗ ngồi cố định">Chỗ ngồi cố định</option>
                                <option value="Chỗ ngồi linh hoạt">Chỗ ngồi linh hoạt</option>
                                <option value="Văn phòng riêng">Văn phòng riêng</option>
                            </select>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col text-end">
                            <button
                                className="btn btn-sm btn-success"
                                onClick={() => alert('Mở form thêm khách hàng mới!')}
                                title="Thêm khách hàng mới vào hệ thống"
                            >
                                {/* <i className="bi bi-plus-circle me-1"></i>  */}
                                Thêm Khách Hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm customer-list-card">
                <div className="card-header bg-light">
                    <h5 className="mb-0">Danh Sách Khách Hàng</h5>
                </div>
                <div className="card-body p-0"> {/* p-0 để table chiếm toàn bộ card-body */}
                    <div className="table-responsive">
                        {/* Cải tiến 3: Thêm phản hồi hover (table-hover của Bootstrap) */}
                        <table className="table table-hover table-striped align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th onClick={() => handleSort('id')} className="sortable text-nowrap">
                                        ID {getSortIndicator('id')}
                                    </th>
                                    <th onClick={() => handleSort('name')} className="sortable text-nowrap">
                                        Tên Khách Hàng {getSortIndicator('name')}
                                    </th>
                                    <th onClick={() => handleSort('email')} className="sortable text-nowrap">
                                        Email {getSortIndicator('email')}
                                    </th>
                                    <th className="text-nowrap">Số Điện Thoại</th>
                                    <th onClick={() => handleSort('bookings')} className="sortable text-center text-nowrap">
                                        Số Lần Đặt {getSortIndicator('bookings')}
                                    </th>
                                    <th onClick={() => handleSort('lastBookingDate')} className="sortable text-nowrap">
                                        Lần Đặt Gần Nhất {getSortIndicator('lastBookingDate')}
                                    </th>
                                    <th onClick={() => handleSort('totalSpending')} className="sortable text-end text-nowrap">
                                        Tổng Chi Tiêu (VNĐ) {getSortIndicator('totalSpending')}
                                    </th>
                                    <th className="text-center text-nowrap">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCustomers.length > 0 ? (
                                    paginatedCustomers.map((customer) => (
                                        <tr key={customer.id} className="customer-row">
                                            <td>{customer.id}</td>
                                            <td>
                                                <a href="#" onClick={(e) => { e.preventDefault(); alert(`Xem chi tiết KH: ${customer.name}`) }} title={`Xem chi tiết ${customer.name}`}>
                                                    {customer.name}
                                                </a>
                                            </td>
                                            <td>{customer.email}</td>
                                            <td>{customer.phone}</td>
                                            {/* Cải tiến 2: Trực quan hóa cột "Số Lần Đặt" */}
                                            <td className="text-center">
                                                <div>{customer.bookings}</div>
                                                <div
                                                    className="progress"
                                                    style={{ height: '6px', marginTop: '4px', backgroundColor: '#e9ecef' }}
                                                    title={`${customer.bookings} lần đặt`}
                                                >
                                                    <div
                                                        className="progress-bar bg-primary" // Sử dụng màu chủ đạo
                                                        role="progressbar"
                                                        style={{ width: `${getBookingProgress(customer.bookings)}%` }}
                                                        aria-valuenow={customer.bookings}
                                                        aria-valuemin="0"
                                                        aria-valuemax={MAX_BOOKINGS_FOR_VISUALIZATION}
                                                    ></div>
                                                </div>
                                            </td>
                                            <td>{new Date(customer.lastBookingDate).toLocaleDateString('vi-VN')}</td>
                                            <td className="text-end">{customer.totalSpending?.toLocaleString('vi-VN')}</td>
                                            <td className="text-center action-buttons">
                                                {/* Cải tiến 4: Nhất quán hóa kiểu nút (sử dụng btn-sm và các màu outline cơ bản của Bootstrap) */}
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-1 mb-1"
                                                    title="Xem chi tiết thông tin khách hàng"
                                                    onClick={() => alert(`Xem chi tiết KH: ${customer.name}`)}
                                                >
                                                    {/* <i className="bi bi-eye-fill"></i>  */}
                                                    Xem
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary me-1 mb-1"
                                                    title="Sửa thông tin khách hàng"
                                                    onClick={() => alert(`Sửa thông tin KH: ${customer.name}`)}
                                                >
                                                    {/* <i className="bi bi-pencil-fill"></i> */}
                                                    Sửa
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-info me-1 mb-1"
                                                    title="Gửi tin nhắn cho khách hàng"
                                                    onClick={() => alert(`Gửi tin nhắn cho KH: ${customer.name}`)}
                                                >
                                                    {/* <i className="bi bi-chat-dots-fill"></i> */}
                                                    Nhắn
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-success mb-1"
                                                    title="Thêm ghi chú cho khách hàng"
                                                    onClick={() => alert(`Thêm ghi chú cho KH: ${customer.name}`)}
                                                >
                                                    {/* <i className="bi bi-journal-plus"></i> */}
                                                    Note
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center p-4">Không tìm thấy khách hàng nào phù hợp.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {totalPages > 1 && (
                    <div className="card-footer bg-light border-top-0">
                        <nav aria-label="Page navigation">
                            <ul className="pagination justify-content-center mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Trước</button>
                                </li>
                                {[...Array(totalPages).keys()].map(page => (
                                    <li key={page + 1} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(page + 1)}>{page + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Sau</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CustomerManagement;