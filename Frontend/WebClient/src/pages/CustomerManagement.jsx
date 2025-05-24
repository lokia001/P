import React, { useState, useMemo } from 'react';
import './CustomerManagement.css'; // Keep CSS for other customizations if any
import { Modal, Button, ListGroup, Badge, Row, Col, Image } from 'react-bootstrap';
// Assuming you'll use Bootstrap Icons, you can import them like this:
// import 'bootstrap-icons/font/bootstrap-icons.css';

// Updated Mock Customer Data (to align with BookingManagementPage's English data)
const mockCustomersData = [
    {
        id: 'CUST001', // Changed ID format for clarity
        name: 'Anthony Nguyen', // Matches booking BK001
        email: 'anthony.nguyen@example.com',
        phone: '0901234567',
        bookings: 3, // Example
        lastBookingDate: '2024-03-15', // Matches BK001 startTime
        totalSpending: 1250000, // Example
        customerType: 'Individual',
        frequentSpace: 'Alpha Meeting Room', // Matches BK001 spaceName
    },
    {
        id: 'CUST002',
        name: 'Bella Tran', // Matches booking BK002
        email: 'bella.tran@example.com',
        phone: '0912345678',
        bookings: 2,
        lastBookingDate: '2024-03-16', // Matches BK002 startTime
        totalSpending: 450000,
        customerType: 'Individual',
        frequentSpace: 'Creative Corner Desk B01',
    },
    {
        id: 'CUST003',
        name: 'Chris Le', // Matches booking BK003
        email: 'chris.le@example.com',
        phone: '0987654321',
        bookings: 5,
        lastBookingDate: '2024-03-17',
        totalSpending: 980000,
        customerType: 'Individual',
        frequentSpace: 'Gamma Private Office',
    },
    {
        id: 'CUST004',
        name: 'Diana Pham', // Matches booking BK004
        email: 'diana.pham@example.com',
        phone: '0900000001',
        bookings: 1,
        lastBookingDate: '2024-03-18', // Matches BK004 startTime (though it was cancelled)
        totalSpending: 700000, // Example, could be 0 if cancellation means no charge
        customerType: 'Individual',
        frequentSpace: 'Beta Quiet Room',
    },
    {
        id: 'CUST005',
        name: 'XYZ Corp', // A corporate client
        email: 'contact@xyzcorp.com',
        phone: '02834567890',
        bookings: 15, // Example
        lastBookingDate: '2024-07-18', // A more recent booking
        totalSpending: 25000000,
        customerType: 'Corporate',
        frequentSpace: 'Gamma Private Office',
    },
    {
        id: 'CUST006',
        name: 'Ethan Hoang', // Matches booking BK005
        email: 'ethan.hoang@example.com',
        phone: '0900000002',
        bookings: 4,
        lastBookingDate: '2024-03-19',
        totalSpending: 1200000,
        customerType: 'Individual',
        frequentSpace: 'Window Desk C01',
    },
    {
        id: 'CUST007',
        name: 'Fiona Vu', // Matches booking BK006
        email: 'fiona.vu@example.com',
        phone: '0900000003',
        bookings: 6,
        lastBookingDate: '2024-03-20',
        totalSpending: 1800000,
        customerType: 'Individual',
        frequentSpace: 'Kappa Small Meeting',
    },
    {
        id: 'CUST008',
        name: 'George Dang', // Matches booking BK007
        email: 'george.dang@example.com',
        phone: '0900000004',
        bookings: 2,
        lastBookingDate: '2024-03-21',
        totalSpending: 420000,
        customerType: 'Individual',
        frequentSpace: 'Theta Streaming Pod',
    }
];

const ITEMS_PER_PAGE = 5;
const MAX_BOOKINGS_FOR_VISUALIZATION = 20; // Adjusted for new booking counts

function CustomerManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [filterBookings, setFilterBookings] = useState('');
    const [filterCustomerType, setFilterCustomerType] = useState('');
    const [filterFrequentSpace, setFilterFrequentSpace] = useState('');

    const [customers, setCustomers] = useState(mockCustomersData);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);

    // Memoized unique values for select filters
    const customerTypes = useMemo(() => [...new Set(mockCustomersData.map(c => c.customerType))].sort(), []);
    const frequentSpaces = useMemo(() => [...new Set(mockCustomersData.map(c => c.frequentSpace))].filter(Boolean).sort(), []);


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
            // Adjust to include the whole end day
            const toDateEnd = new Date(filterDateTo);
            toDateEnd.setHours(23, 59, 59, 999);
            result = result.filter(customer => new Date(customer.lastBookingDate) <= toDateEnd);
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

                if (typeof valA === 'number' && typeof valB === 'number') {
                    // Numeric sort
                } else if (sortConfig.key === 'lastBookingDate') {
                    valA = new Date(valA).getTime();
                    valB = new Date(valB).getTime();
                }
                else { // Default to string sort
                    valA = String(valA ?? '').toLowerCase(); // Handle null/undefined
                    valB = String(valB ?? '').toLowerCase(); // Handle null/undefined
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
        setCurrentPage(1);
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '▲' : '▼';
        }
        return '';
    };

    const handleQuickDateFilter = (period) => {
        const today = new Date();
        let fromDateObj = new Date();
        let toDateObj = new Date();

        switch (period) {
            case 'thisWeek':
                const firstDay = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1); // Adjust for Sunday as first day
                fromDateObj.setDate(firstDay);
                // toDateObj already set to today
                break;
            case 'thisMonth':
                fromDateObj = new Date(today.getFullYear(), today.getMonth(), 1);
                // toDateObj already set to today
                break;
            case 'thisYear':
                fromDateObj = new Date(today.getFullYear(), 0, 1);
                // toDateObj already set to today
                break;
            default:
                setFilterDateFrom('');
                setFilterDateTo('');
                setCurrentPage(1);
                return;
        }
        setFilterDateFrom(fromDateObj.toISOString().split('T')[0]);
        setFilterDateTo(toDateObj.toISOString().split('T')[0]);
        setCurrentPage(1);
    };


    const getBookingProgress = (bookings) => {
        const percentage = Math.min((bookings / MAX_BOOKINGS_FOR_VISUALIZATION) * 100, 100);
        return percentage;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    // HANDLERS CHO MODAL
    const handleShowCustomerDetail = (customer) => {
        setSelectedCustomerDetail(customer);
        setShowDetailModal(true);
    };

    const handleCloseCustomerDetail = () => {
        setShowDetailModal(false);
        setSelectedCustomerDetail(null);
    };

    return (
        <div className="container-fluid customer-management-page py-3">
            <h2 className="my-4 page-title">Customer Management</h2>

            <div className="card shadow-sm mb-4 filter-card">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-4 col-lg-3">
                            <label htmlFor="searchTerm" className="form-label">Search:</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                id="searchTerm"
                                placeholder="Name, email, phone..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>

                        <div className="col-md-4 col-lg-3">
                            <label className="form-label">Last Booking Date:</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="date"
                                    className="form-control"
                                    value={filterDateFrom}
                                    onChange={(e) => { setFilterDateFrom(e.target.value); setCurrentPage(1); }}
                                    title="From Date"
                                />
                                <span className="input-group-text">-</span>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={filterDateTo}
                                    onChange={(e) => { setFilterDateTo(e.target.value); setCurrentPage(1); }}
                                    title="To Date"
                                />
                            </div>
                            <div className="mt-1 quick-filters">
                                <button className="btn btn-xs btn-outline-secondary me-1" onClick={() => handleQuickDateFilter('thisWeek')}>This Week</button>
                                <button className="btn btn-xs btn-outline-secondary me-1" onClick={() => handleQuickDateFilter('thisMonth')}>This Month</button>
                                <button className="btn btn-xs btn-outline-secondary" onClick={() => handleQuickDateFilter('thisYear')}>This Year</button>
                            </div>
                        </div>

                        <div className="col-md-4 col-lg-2">
                            <label htmlFor="filterBookings" className="form-label">Min. Bookings:</label>
                            <select
                                id="filterBookings"
                                className="form-select form-select-sm"
                                value={filterBookings}
                                onChange={(e) => { setFilterBookings(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="">All</option>
                                <option value="1">1+</option>
                                <option value="5">5+</option>
                                <option value="10">10+</option>
                                <option value="20">20+</option>
                            </select>
                        </div>

                        <div className="col-md-4 col-lg-2">
                            <label htmlFor="filterCustomerType" className="form-label">Customer Type:</label>
                            <select
                                id="filterCustomerType"
                                className="form-select form-select-sm"
                                value={filterCustomerType}
                                onChange={(e) => { setFilterCustomerType(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="">All</option>
                                {customerTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4 col-lg-2">
                            <label htmlFor="filterFrequentSpace" className="form-label">Frequent Space:</label>
                            <select
                                id="filterFrequentSpace"
                                className="form-select form-select-sm"
                                value={filterFrequentSpace}
                                onChange={(e) => { setFilterFrequentSpace(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="">All</option>
                                {frequentSpaces.map(space => (
                                    <option key={space} value={space}>{space}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col text-end">
                            <button
                                className="btn btn-sm btn-success"
                                onClick={() => alert('Open new customer form!')}
                                title="Add a new customer to the system"
                            >
                                {/* <i className="bi bi-plus-circle me-1"></i> */}
                                Add Customer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm customer-list-card">
                <div className="card-header bg-light">
                    <h5 className="mb-0">Customer List</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-striped align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th onClick={() => handleSort('id')} className="sortable text-nowrap">
                                        ID {getSortIndicator('id')}
                                    </th>
                                    <th onClick={() => handleSort('name')} className="sortable text-nowrap">
                                        Customer Name {getSortIndicator('name')}
                                    </th>
                                    <th onClick={() => handleSort('email')} className="sortable text-nowrap">
                                        Email {getSortIndicator('email')}
                                    </th>
                                    <th className="text-nowrap">Phone Number</th>
                                    <th onClick={() => handleSort('bookings')} className="sortable text-center text-nowrap">
                                        Bookings {getSortIndicator('bookings')}
                                    </th>
                                    <th onClick={() => handleSort('lastBookingDate')} className="sortable text-nowrap">
                                        Last Booking {getSortIndicator('lastBookingDate')}
                                    </th>
                                    <th onClick={() => handleSort('totalSpending')} className="sortable text-end text-nowrap">
                                        Total Spent (VND) {getSortIndicator('totalSpending')}
                                    </th>
                                    <th className="text-center text-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCustomers.length > 0 ? (
                                    paginatedCustomers.map((customer) => (
                                        <tr key={customer.id} className="customer-row">
                                            <td>{customer.id}</td>
                                            <td>
                                                {/* Có thể làm tên click để mở modal cũng được, hoặc chỉ giữ nút View */}
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleShowCustomerDetail(customer); }} title={`View details for ${customer.name}`}>
                                                    {customer.name}
                                                </a>
                                            </td>
                                            <td>{customer.email}</td>
                                            <td>{customer.phone}</td>
                                            <td className="text-center">
                                                <div>{customer.bookings}</div>
                                                <div
                                                    className="progress"
                                                    style={{ height: '6px', marginTop: '4px', backgroundColor: '#e9ecef' }}
                                                    title={`${customer.bookings} bookings`}
                                                >
                                                    <div
                                                        className="progress-bar bg-primary"
                                                        role="progressbar"
                                                        style={{ width: `${getBookingProgress(customer.bookings)}%` }}
                                                        aria-valuenow={customer.bookings}
                                                        aria-valuemin="0"
                                                        aria-valuemax={MAX_BOOKINGS_FOR_VISUALIZATION}
                                                    ></div>
                                                </div>
                                            </td>
                                            <td>{formatDate(customer.lastBookingDate)}</td>
                                            <td className="text-end">{customer.totalSpending?.toLocaleString('en-US')}</td>
                                            <td className="text-center action-buttons">
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-1 mb-1"
                                                    title="View customer details"
                                                    onClick={() => handleShowCustomerDetail(customer)} // << KÍCH HOẠT MODAL
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary me-1 mb-1"
                                                    title="Edit customer information"
                                                    onClick={() => alert(`Edit info for: ${customer.name}`)}
                                                >
                                                    {/* <i className="bi bi-pencil-fill"></i> */}
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-info me-1 mb-1"
                                                    title="Send message to customer"
                                                    onClick={() => alert(`Send message to: ${customer.name}`)}
                                                >
                                                    {/* <i className="bi bi-chat-dots-fill"></i> */}
                                                    Message
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-success mb-1"
                                                    title="Add note for customer"
                                                    onClick={() => alert(`Add note for: ${customer.name}`)}
                                                >
                                                    {/* <i className="bi bi-journal-plus"></i> */}
                                                    Note
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center p-4">No matching customers found.</td>
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
                                    <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                                </li>
                                {[...Array(totalPages).keys()].map(page => (
                                    <li key={page + 1} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(page + 1)}>{page + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>


            {/* CUSTOMER DETAIL MODAL */}
            {selectedCustomerDetail && (
                <Modal show={showDetailModal} onHide={handleCloseCustomerDetail} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {/* <i className="bi bi-person-lines-fill me-2"></i>  */}
                            Customer Details: {selectedCustomerDetail.name} ({selectedCustomerDetail.id})
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={4} className="text-center mb-3 mb-md-0">
                                {/* Giả sử có avatarUrl hoặc dùng placeholder */}
                                <Image
                                    src={selectedCustomerDetail.avatarUrl || `https://i.pravatar.cc/150?u=${selectedCustomerDetail.id}`}
                                    roundedCircle
                                    fluid
                                    style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid #dee2e6' }}
                                    alt={selectedCustomerDetail.name}
                                />
                                <h5 className="mt-3">{selectedCustomerDetail.name}</h5>
                                <Badge bg={selectedCustomerDetail.customerType === 'Corporate' ? 'info' : 'secondary'}>
                                    {selectedCustomerDetail.customerType}
                                </Badge>
                            </Col>
                            <Col md={8}>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <strong>Email:</strong> {selectedCustomerDetail.email || 'N/A'}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Phone:</strong> {selectedCustomerDetail.phone || 'N/A'}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Total Bookings:</strong> {selectedCustomerDetail.bookings}
                                        <div className="progress mt-1" style={{ height: '8px' }}>
                                            <div
                                                className="progress-bar bg-success"
                                                role="progressbar"
                                                style={{ width: `${getBookingProgress(selectedCustomerDetail.bookings)}%` }}
                                                aria-valuenow={selectedCustomerDetail.bookings}
                                                aria-valuemin="0"
                                                aria-valuemax={MAX_BOOKINGS_FOR_VISUALIZATION}
                                            ></div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Last Booking:</strong> {formatDate(selectedCustomerDetail.lastBookingDate)}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Total Spending:</strong> {selectedCustomerDetail.totalSpending?.toLocaleString('en-US')} VND
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Frequent Space:</strong> {selectedCustomerDetail.frequentSpace || 'N/A'}
                                    </ListGroup.Item>
                                    {/* Thêm các thông tin chi tiết khác nếu có */}
                                </ListGroup>
                            </Col>
                        </Row>
                        {/* Có thể thêm tab để xem lịch sử đặt chỗ của khách hàng này */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => alert(`Edit customer: ${selectedCustomerDetail.name}`)}>
                            {/* <i className="bi bi-pencil-square me-1"></i>  */}
                            Edit Customer
                        </Button>
                        <Button variant="secondary" onClick={handleCloseCustomerDetail}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default CustomerManagement;