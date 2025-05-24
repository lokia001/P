// src/pages/BookingManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap'; // Assuming Modal and Button are used
import './BookingManagementPage.css'; // Ensure CSS file is imported
// ... other imports like Link, useNavigate, icons ...
import { Link } from 'react-router-dom'; // If you link to customer/space details
import CustomerDetailModal from "../components/CustomerDetailModal";
import { getMockCustomerById, findMockCustomerByName } from '../services/mockApi';

// Status configuration (English)
const statusConfig = {
    'Confirmed': { label: 'Confirmed', badgeClass: 'status-confirmed', dotStyle: { backgroundColor: '#d1e7dd', borderColor: '#a3cfbb' } },
    'Pending Confirmation': { label: 'Pending Confirmation', badgeClass: 'status-pending-confirmation', dotStyle: { backgroundColor: '#fff3cd', borderColor: '#ffe69c' } },
    'Checked-In': { label: 'Checked-In', badgeClass: 'status-checked-in', dotStyle: { backgroundColor: '#cff4fc', borderColor: '#9eeaf9' } },
    'Checked-Out': { label: 'Checked-Out', badgeClass: 'status-checked-out', dotStyle: { backgroundColor: '#e2e3e5', borderColor: '#c6c8ca' } },
    'Cancelled': { label: 'Cancelled', badgeClass: 'status-cancelled', dotStyle: { backgroundColor: '#f8d7da', borderColor: '#f1aeb5' } },
    'Pending Payment': { label: 'Pending Payment', badgeClass: 'status-pending-payment', dotStyle: { backgroundColor: '#f0e6ff', borderColor: '#d3bcf2' } }
};

// Utility function to get status badge class
const getStatusBadgeClass = (status) => statusConfig[status]?.badgeClass || 'bg-secondary text-white';

// Mock booking data (English, aligned with mock spaces)
const initialBookings = [
    {
        id: 'BK001',
        customerName: 'Anthony Nguyen',
        customerLink: '/app/customers/1', // Example link
        customerPhone: '0901234567',
        notes: 'Requests a seat near the window.',
        spaceId: 's001',
        spaceName: 'Alpha Meeting Room',
        spaceLink: '/space-management/view/s001',
        spaceType: 'Meeting Room',
        startTime: '2024-03-15 09:00', // Keep date format consistent or parse as needed
        endTime: '2024-03-15 11:00',
        status: 'Confirmed',
        totalAmount: '500,000 VND',
    },
    {
        id: 'BK002',
        customerName: 'Bella Tran',
        customerLink: '/app/customers/2',
        customerPhone: '0912345678',
        notes: '',
        spaceId: 's002',
        spaceName: 'Creative Corner Desk B01',
        spaceLink: '/space-management/view/s002',
        spaceType: 'Individual Desk',
        startTime: '2024-03-16 14:00',
        endTime: '2024-03-16 18:00',
        status: 'Pending Confirmation',
        totalAmount: '200,000 VND',
    },
    {
        id: 'BK003',
        customerName: 'Chris Le',
        customerLink: '/app/customers/3',
        customerPhone: '0987654321',
        notes: 'VIP client, prioritize support.',
        spaceId: 's003',
        spaceName: 'Gamma Private Office',
        spaceLink: '/space-management/view/s003',
        spaceType: 'Private Office',
        startTime: '2024-03-17 10:00',
        endTime: '2024-03-17 12:00',
        status: 'Checked-In',
        totalAmount: '150,000 VND',
    },
    {
        id: 'BK004',
        customerName: 'Diana Pham',
        customerLink: '/app/customers/4',
        customerPhone: '0900000001',
        notes: '',
        spaceId: 's004',
        spaceName: 'Beta Quiet Room',
        spaceLink: '/space-management/view/s004',
        spaceType: 'Meeting Room',
        startTime: '2024-03-18 13:00',
        endTime: '2024-03-18 17:00',
        status: 'Cancelled',
        totalAmount: '700,000 VND',
    },
    {
        id: 'BK005',
        customerName: 'Ethan Hoang',
        customerLink: '/app/customers/5',
        customerPhone: '0900000002',
        notes: 'Needs projector and whiteboard support.',
        spaceId: 's005',
        spaceName: 'Window Desk C01',
        spaceLink: '/space-management/view/s005',
        spaceType: 'Individual Desk',
        startTime: '2024-03-19 08:00',
        endTime: '2024-03-19 17:00',
        status: 'Pending Payment',
        totalAmount: '300,000 VND',
    },
    {
        id: 'BK006',
        customerName: 'Fiona Vu',
        customerLink: '/app/customers/6',
        customerPhone: '0900000003',
        notes: '',
        spaceId: 's007',
        spaceName: 'Kappa Small Meeting',
        spaceLink: '/space-management/view/s007',
        spaceType: 'Meeting Room',
        startTime: '2024-03-20 09:30',
        endTime: '2024-03-20 11:30',
        status: 'Checked-Out',
        totalAmount: '450,000 VND',
    },
    {
        id: 'BK007',
        customerName: 'George Dang',
        customerLink: '/app/customers/7',
        customerPhone: '0900000004',
        notes: 'Requires absolute silence.',
        spaceId: 's006',
        spaceName: 'Theta Streaming Pod',
        spaceLink: '/space-management/view/s006',
        spaceType: 'Specialized Room',
        startTime: '2024-03-21 13:00',
        endTime: '2024-03-21 16:00',
        status: 'Confirmed',
        totalAmount: '210,000 VND',
    },
];


function BookingManagementPage() {
    const [bookings, setBookings] = useState(initialBookings);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All'); // Default to 'All'
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [spaceTypeFilter, setSpaceTypeFilter] = useState('All'); // Default to 'All'
    const [selectedBookings, setSelectedBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Modal state
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);

    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [loadingCustomerDetail, setLoadingCustomerDetail] = useState(false); // State loading cho customer detail

    const [currentCustomerForModal, setCurrentCustomerForModal] = useState(null);


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
        console.log(`Change status of booking ${bookingId} to ${newStatus}`);
        setBookings(prevBookings =>
            prevBookings.map(b =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            )
        );
    };


    const handleShowCustomerFromBooking = async (booking) => {
        setLoadingCustomerDetail(true); // Bắt đầu loading
        setCurrentCustomerForModal(null); // Reset trước khi fetch
        setShowCustomerModal(true); // Mở modal ngay để hiển thị spinner bên trong modal (tùy chọn)

        try {
            // Ưu tiên lấy customer theo ID nếu booking object có customerId
            // Giả sử booking object có trường customerId hoặc một định danh khách hàng
            let customerData = null;
            if (booking.customerId) { // GIẢ SỬ BOOKING OBJECT CÓ customerId
                customerData = await getMockCustomerById(booking.customerId);
            } else {
                // Nếu không có customerId, thử tìm theo tên (ít tin cậy hơn)
                customerData = await findMockCustomerByName(booking.customerName);
            }

            if (customerData) {
                setCurrentCustomerForModal(customerData);
            } else {
                console.warn("Customer details not found for: " + booking.customerName);
                // Có thể set một thông báo lỗi cho modal hoặc đóng modal
                // setShowCustomerModal(false);
                setCurrentCustomerForModal({ name: booking.customerName, error: "Details not found" }); // Hiển thị lỗi trong modal
            }
        } catch (error) {
            console.error("Error fetching customer details for modal:", error);
            setCurrentCustomerForModal({ name: booking.customerName, error: "Could not load details" });
        } finally {
            setLoadingCustomerDetail(false); // Kết thúc loading
        }
    };

    const handleCloseCustomerModal = () => {
        setShowCustomerModal(false);
        setCurrentCustomerForModal(null);
    };


    // Modal handlers
    const handleShowBookingDetail = (booking) => {
        setSelectedBookingDetail(booking);
        setShowDetailModal(true);
    };
    const handleCloseBookingDetail = () => {
        setShowDetailModal(false);
        setSelectedBookingDetail(null);
    };


    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = searchTerm === '' ||
            booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.spaceName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
        const matchesSpaceType = spaceTypeFilter === 'All' || booking.spaceType === spaceTypeFilter;

        let matchesDate = true;
        if (dateRange.start && dateRange.end) {
            const bookingStartTime = new Date(booking.startTime).getTime();
            const filterStartTime = new Date(dateRange.start).getTime();
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
        setSelectedBookings([]);
    };

    const generateRowTooltip = (booking) => {
        let tooltipParts = [];
        tooltipParts.push(`Customer: ${booking.customerName}`);
        if (booking.customerPhone) tooltipParts.push(`Phone: ${booking.customerPhone}`);
        if (booking.notes) tooltipParts.push(`Notes: ${booking.notes}`);
        return tooltipParts.join(' | ');
    };

    // Format date and time for display
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        return new Date(dateTimeString).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };


    return (
        <div className="container-fluid booking-management-page p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Booking Management</h1>
                <button className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>Add New Booking
                </button>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-lg-4 col-md-6">
                            <label htmlFor="searchInput" className="form-label">Search</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchInput"
                                    placeholder="Customer, ID, space..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <button className="btn btn-outline-secondary" type="button">
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-6">
                            <label htmlFor="statusFilter" className="form-label">Status</label>
                            <select
                                id="statusFilter"
                                className="form-select"
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                            >
                                <option value="All">All</option>
                                {Object.keys(statusConfig).map(statusKey => (
                                    <option key={statusKey} value={statusKey}>{statusConfig[statusKey].label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <label htmlFor="dateRangeStart" className="form-label">Date Range</label>
                            <div className="input-group">
                                <input type="date" id="dateRangeStart" className="form-control" value={dateRange.start} onChange={(e) => handleDateRangeChange('start', e.target.value)} title="Start Date" />
                                <span className="input-group-text">-</span>
                                <input type="date" id="dateRangeEnd" className="form-control" value={dateRange.end} onChange={(e) => handleDateRangeChange('end', e.target.value)} title="End Date" />
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-4">
                            <label htmlFor="spaceTypeFilter" className="form-label">Space Type</label>
                            <select
                                id="spaceTypeFilter"
                                className="form-select"
                                value={spaceTypeFilter}
                                onChange={handleSpaceTypeFilterChange}
                            >
                                <option value="All">All Types</option>
                                <option value="Individual Desk">Individual Desk</option>
                                <option value="Meeting Room">Meeting Room</option>
                                <option value="Private Office">Private Office</option>
                                <option value="Specialized Room">Specialized Room</option>
                                {/* Add other space types from your mock data if needed */}
                            </select>
                        </div>

                        <div className="col-lg-1 col-md-2">
                            <button className="btn btn-outline-info w-100" title="Advanced Filters">
                                <i className="bi bi-filter-circle-fill"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-light py-3 d-flex flex-wrap justify-content-between align-items-center">
                    <h5 className="mb-0">Booking List</h5>
                    <div className="dropdown">
                        <button
                            className="btn btn-secondary dropdown-toggle btn-sm"
                            type="button"
                            id="bulkActionsDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            disabled={selectedBookings.length === 0}
                        >
                            {selectedBookings.length > 0 ? `Actions (${selectedBookings.length})` : 'Bulk Actions'}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="bulkActionsDropdown">
                            <li><a className="dropdown-item" href="#">Confirm Selected</a></li>
                            <li><a className="dropdown-item" href="#">Cancel Selected</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item text-danger" href="#">Delete Selected</a></li>
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
                                            title={paginatedBookings.length > 0 ? "Select/Deselect all on this page" : "No items to select"}
                                        />
                                    </th>
                                    <th scope="col">Booking ID <i className="bi bi-arrow-down-up small text-muted"></i></th>
                                    <th scope="col">Customer <i className="bi bi-arrow-down-up small text-muted"></i></th>
                                    <th scope="col">Space</th>
                                    <th scope="col">Space Type</th>
                                    <th scope="col">Start Time <i className="bi bi-arrow-down-up small text-muted"></i></th>
                                    <th scope="col">End Time</th>
                                    <th scope="col" className="text-center">Status <i className="bi bi-arrow-down-up small text-muted"></i></th>
                                    <th scope="col" className="text-end">Total Amount</th>
                                    <th scope="col" className="text-center" style={{ minWidth: "130px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedBookings.length > 0 ? (
                                    paginatedBookings.map((booking) => (
                                        <tr key={booking.id} title={generateRowTooltip(booking)}>
                                            <td className="text-center" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={selectedBookings.includes(booking.id)}
                                                    onChange={() => handleSelectBooking(booking.id)}
                                                />
                                            </td>
                                            <td>{booking.id}</td>
                                            <td>
                                                <Button variant="link" size="sm" className="p-0" onClick={() => handleShowCustomerFromBooking(booking)}>
                                                    {booking.customerName}
                                                </Button>
                                            </td>
                                            <td>
                                                <Link to={booking.spaceLink} onClick={(e) => e.stopPropagation()}>
                                                    {booking.spaceName}
                                                </Link>
                                            </td>
                                            <td>{booking.spaceType}</td>
                                            <td>{formatDateTime(booking.startTime)}</td>
                                            <td>{formatDateTime(booking.endTime)}</td>
                                            <td className="text-center">
                                                <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                                                    {statusConfig[booking.status]?.label || booking.status}
                                                </span>
                                            </td>
                                            <td className="text-end">{booking.totalAmount}</td>
                                            <td className="text-center" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-1"
                                                    title="View Details"
                                                    onClick={() => handleShowBookingDetail(booking)}
                                                >
                                                    <i className="bi bi-eye-fill"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-warning me-1" title="Edit Booking">
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <div className="dropdown d-inline-block">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                                        type="button"
                                                        id={`actions-${booking.id}`}
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                        title="More Actions"
                                                    >
                                                        <i className="bi bi-three-dots-vertical"></i>
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`actions-${booking.id}`}>
                                                        <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}><i className="bi bi-receipt me-2"></i>View Invoice</a></li>
                                                        <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}><i className="bi bi-envelope me-2"></i>Send Notification</a></li>
                                                        <li><hr className="dropdown-divider" /></li>
                                                        <li className="dropdown-header">Change Status</li>
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
                                                        <li><a className="dropdown-item text-danger" href="#" onClick={(e) => e.preventDefault()}><i className="bi bi-trash me-2"></i>Cancel this Booking</a></li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center p-5">
                                            <i className="bi bi-inbox fs-1 text-muted mb-2 d-block"></i>
                                            <h5 className="mb-1">No bookings found.</h5>
                                            <p className="text-muted mb-0">Try adjusting your filters or search terms.</p>
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
                            Showing {paginatedBookings.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredBookings.length)} of {filteredBookings.length} bookings
                        </small>
                        {totalPages > 1 && (
                            <nav aria-label="Page navigation">
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                                    </li>
                                    {[...Array(totalPages).keys()].map(number => (
                                        <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageChange(number + 1)}>{number + 1}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>
                )}
            </div>

            {/* Booking Detail Modal */}
            {selectedBookingDetail && (
                <Modal show={showDetailModal} onHide={handleCloseBookingDetail} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i className="bi bi-card-list me-2"></i>Booking Details: {selectedBookingDetail.id}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <h5>Customer Information</h5>
                                <p><strong>Name:</strong> {selectedBookingDetail.customerName}</p>
                                <p><strong>Phone:</strong> {selectedBookingDetail.customerPhone || 'N/A'}</p>
                                {selectedBookingDetail.notes && (
                                    <>
                                        <p className="mb-1"><strong>Notes:</strong></p>
                                        <p className="bg-light p-2 rounded notes-display">{selectedBookingDetail.notes}</p>
                                    </>
                                )}
                            </div>
                            <div className="col-md-6 mb-3">
                                <h5>Space & Booking Details</h5>
                                <p>
                                    <strong>Space:</strong>
                                    <Link to={selectedBookingDetail.spaceLink} onClick={handleCloseBookingDetail}>
                                        {selectedBookingDetail.spaceName}
                                    </Link>
                                    {' '}({selectedBookingDetail.spaceType})
                                </p>
                                <p><strong>Time:</strong> {formatDateTime(selectedBookingDetail.startTime)} - {formatDateTime(selectedBookingDetail.endTime).split(', ')[1] /* Chỉ lấy phần giờ */}</p>
                                <p><strong>Status:</strong> <span className={`badge ${getStatusBadgeClass(selectedBookingDetail.status)}`}>{statusConfig[selectedBookingDetail.status]?.label || selectedBookingDetail.status}</span></p>
                                <p><strong>Total Amount:</strong> {selectedBookingDetail.totalAmount}</p>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => console.log("Edit booking: ", selectedBookingDetail.id)}>
                            <i className="bi bi-pencil-square me-1"></i> Edit Booking
                        </Button>
                        <Button variant="secondary" onClick={handleCloseBookingDetail}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            <CustomerDetailModal
                show={showCustomerModal}
                onHide={handleCloseCustomerModal}
                customer={currentCustomerForModal}
                isLoading={loadingCustomerDetail} // Truyền state loading vào modal
            />

        </div>
    );
}

export default BookingManagementPage;