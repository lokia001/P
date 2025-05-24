import React, { useState, useMemo, useEffect } from 'react';
import {
    Container, Row, Col, Button, ButtonGroup, Table, Card,
    Form, InputGroup, Pagination, Badge, OverlayTrigger, Tooltip, Spinner
} from 'react-bootstrap';
import {
    FaThList, FaThLarge, FaPlus, FaSearch, FaEdit, FaEye, FaTools, FaToggleOn, FaToggleOff,
    FaFilter, FaUserFriends, FaCalendarAlt,
    FaRegCheckCircle, FaRegClock, FaExclamationTriangle, FaBan, FaDollarSign, FaBuilding, FaUsers, FaClipboardList, FaTags
} from 'react-icons/fa';
import './SpaceManagementPage.css'; // Your CSS file
import { Link, useNavigate } from 'react-router-dom';
import { getAllMockSpaces } from '../services/mockApi.js'; // Điều chỉnh đường dẫn

// Sample data (kept in Vietnamese for easy replacement with your actual data)
const initialMockSpaces = [
    { id: 'S001', name: 'Phòng Họp Alpha', type: 'Phòng họp', capacity: 10, priceHour: 5, status: 'available', amenities: ['Máy chiếu', 'Bảng trắng'], floor: 1, imageUrl: 'https://shorturl.at/pkEzm' },
    { id: 'S002', name: 'Bàn làm việc B01', type: 'Bàn đơn', capacity: 1, priceHour: 15, status: 'booked', amenities: ['Ổ cắm', 'Wifi'], floor: 1, imageUrl: 'https://shorturl.at/rgStB' },
    { id: 'S003', name: 'Văn phòng riêng Gamma', type: 'Văn phòng riêng', capacity: 4, priceHour: 8, status: 'maintenance', amenities: ['Máy lạnh', 'Bàn ghế'], floor: 1, imageUrl: 'https://shorturl.at/02rCP' },
    { id: 'S005', name: 'Phòng Họp Beta (Yên tĩnh)', type: 'Phòng họp', capacity: 6, priceHour: 4, status: 'inactive', amenities: ['Máy chiếu', 'Cách âm'], floor: 2, imageUrl: 'https://shorturl.at/yTsVm' },
    { id: 'S009', name: 'Bàn làm việc C01 (Cửa sổ)', type: 'Bàn đơn', capacity: 1, priceHour: 2, status: 'maintenance', amenities: ['Ổ cắm', 'Wifi', 'View đẹp'], floor: 2, imageUrl: 'https://shorturl.at/rgStB' },
    { id: 'S010', name: 'Phòng stream Theta', type: 'Phòng chuyên dụng', capacity: 1, priceHour: 7, status: 'available', amenities: ['PC cấu hình cao', 'Green screen', 'Mic'], floor: 1, imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F3.bp.blogspot.com%2F-M36O_xULKNI%2FUqBjNUejMlI%2FAAAAAAAABQk%2FUAiSKJ91kHQ%2Fs1600%2FIMG_2147.JPG&f=1&nofb=1&ipt=d3f5a470d8e13e10a2fc16fdbbb96e343a97090190ff01626a1ba17fdea30ece' },
    { id: 'S011', name: 'Phòng họp nhỏ Kappa', type: 'Phòng họp', capacity: 4, priceHour: 3, status: 'available', amenities: ['Bảng trắng'], floor: 3, imageUrl: 'https://shorturl.at/pkEzm' }
];

const ITEMS_PER_PAGE_LIST = 5;
// Grid view will display all filtered items

const SpaceManagementPage = () => {
    const [mockSpaces, setMockSpaces] = useState(initialMockSpaces);
    const [viewMode, setViewMode] = useState('grid'); // 'list' or 'grid'
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterCapacity, setFilterCapacity] = useState('');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [filterPriceMin, setFilterPriceMin] = useState('');
    const [filterPriceMax, setFilterPriceMax] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [loadingSpaces, setLoadingSpaces] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const navigate = useNavigate();

    const spaceTypes = useMemo(() => [...new Set(initialMockSpaces.map(s => s.type))].sort(), [initialMockSpaces]);
    const stats = useMemo(() => {
        const total = initialMockSpaces.length;
        const available = initialMockSpaces.filter(s => s.status === 'available').length;
        const booked = initialMockSpaces.filter(s => s.status === 'booked').length;
        const maintenance = initialMockSpaces.filter(s => s.status === 'maintenance').length;
        const inactive = initialMockSpaces.filter(s => s.status === 'inactive').length;
        return { total, available, booked, maintenance, inactive };
    }, [initialMockSpaces]);

    const filteredSpaces = useMemo(() => {
        return mockSpaces
            .filter(space => space.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(space => filterStatus ? space.status === filterStatus : true)
            .filter(space => filterType ? space.type === filterType : true)
            .filter(space => filterCapacity ? space.capacity >= parseInt(filterCapacity, 10) : true)
            .filter(space => filterPriceMin ? space.priceHour >= parseFloat(filterPriceMin) : true)
            .filter(space => filterPriceMax ? space.priceHour <= parseFloat(filterPriceMax) : true);
    }, [mockSpaces, searchTerm, filterStatus, filterType, filterCapacity, filterPriceMin, filterPriceMax]);

    const paginatedSpacesForList = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE_LIST;
        return filteredSpaces.slice(startIndex, startIndex + ITEMS_PER_PAGE_LIST);
    }, [filteredSpaces, currentPage]);

    const totalPagesForList = Math.ceil(filteredSpaces.length / ITEMS_PER_PAGE_LIST);

    useEffect(() => {
        const loadSpaces = async () => {
            setLoadingSpaces(true);
            setFetchError(null);
            try {
                const data = await getAllMockSpaces(); // SỬ DỤNG HÀM MOCK
                setMockSpaces(data || []); // Cập nhật state mockSpaces của component
            } catch (error) {
                console.error("Error fetching mock spaces:", error);
                setFetchError(error.message || "Failed to load spaces.");
                setMockSpaces([]);
            } finally {
                setLoadingSpaces(false);
            }
        };
        loadSpaces();
    }, []); // Chạy 1 lần khi mount






    useEffect(() => {
        if (currentPage > totalPagesForList && totalPagesForList > 0) {
            setCurrentPage(totalPagesForList);
        } else if (totalPagesForList === 0 && filteredSpaces.length > 0) {
            setCurrentPage(1);
        } else if (totalPagesForList === 1 && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPagesForList, filteredSpaces.length]);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const handleAddSpace = () => console.log('Open Add New Space form/modal');
    const handleViewDetails = (spaceId) => console.log(`View details for ${spaceId}`);
    const handleEditSpace = (spaceId) => console.log(`Edit space ${spaceId}`);
    const handleSetMaintenance = (spaceId) => console.log(`Set maintenance for ${spaceId}`);
    const handleToggleActive = (spaceId, currentStatus) => console.log(`Toggle active for ${spaceId}, current: ${currentStatus}`);
    const handleViewCalendar = (spaceId, spaceName) => console.log(`View calendar for space ${spaceName} (ID: ${spaceId})`);




    if (loadingSpaces) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                <p className="mt-3">Loading spaces...</p>
            </Container>
        );
    }

    if (fetchError) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <Alert.Heading>Error Loading Spaces</Alert.Heading>
                    <p>{fetchError}</p>
                </Alert>
            </Container>
        );
    }


    const getStatusBadge = (status, showIcon = true) => {
        let icon = null, text = '', variant = 'light', textColorClass = 'text-dark';
        switch (status) {
            case 'available': icon = showIcon ? <FaRegCheckCircle className="me-1" /> : null; text = 'Available'; variant = 'success'; textColorClass = 'text-white'; break;
            case 'booked': icon = showIcon ? <FaRegClock className="me-1" /> : null; text = 'Booked'; variant = 'warning'; textColorClass = 'text-dark'; break;
            case 'maintenance': icon = showIcon ? <FaExclamationTriangle className="me-1" /> : null; text = 'Maintenance'; variant = 'danger'; textColorClass = 'text-white'; break;
            case 'inactive': icon = showIcon ? <FaBan className="me-1" /> : null; text = 'Inactive'; variant = 'secondary'; textColorClass = 'text-white'; break;
            default: text = status; break;
        }
        return <Badge bg={variant} className={textColorClass}>{icon}{text}</Badge>;
    };

    const renderTooltip = (props, space) => (
        <Tooltip id={`tooltip-${space.id}`} {...props}>
            <strong>{space.name}</strong> ({space.type})<br />
            Status: {getStatusBadge(space.status, true)}<br />
            Capacity: {space.capacity} people<br />
            Price: {space.priceHour.toLocaleString()} VND/hour
        </Tooltip>
    );

    return (
        <Container fluid className="space-management-page p-3 p-md-4">
            <Row className="page-header align-items-center mb-3">
                <Col><h1><FaBuilding className="me-2" />Space Management</h1></Col>
                <Col xs="auto">
                    <Button as={Link} to="/space-management/add" variant="primary">
                        <FaPlus className="me-2" /> Add New Space
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4 g-3">
                <Col lg={3} md={6}><Card className="stat-card bg-primary text-white h-100"><Card.Body><Card.Title><FaClipboardList /> Total Spaces</Card.Title><Card.Text className="fs-2 fw-bold">{stats.total}</Card.Text></Card.Body></Card></Col>
                <Col lg={2} md={6}><Card className="stat-card status-available-card h-100"><Card.Body><Card.Title><FaRegCheckCircle /> Available</Card.Title><Card.Text className="fs-3 fw-bold">{stats.available}</Card.Text></Card.Body></Card></Col>
                <Col lg={2} md={6}><Card className="stat-card status-booked-card h-100"><Card.Body><Card.Title><FaRegClock /> Booked</Card.Title><Card.Text className="fs-3 fw-bold">{stats.booked}</Card.Text></Card.Body></Card></Col>
                <Col lg={2} md={6}><Card className="stat-card status-maintenance-card h-100"><Card.Body><Card.Title><FaExclamationTriangle /> Maintenance</Card.Title><Card.Text className="fs-3 fw-bold">{stats.maintenance}</Card.Text></Card.Body></Card></Col>
                <Col lg={3} md={6}><Card className="stat-card status-inactive-card h-100"><Card.Body><Card.Title><FaBan /> Inactive</Card.Title><Card.Text className="fs-3 fw-bold">{stats.inactive}</Card.Text></Card.Body></Card></Col>
            </Row>

            <Card className="mb-4 filter-controls-card">
                <Card.Header as="h5">Filters & Options</Card.Header>
                <Card.Body>
                    <Row className="align-items-end gy-3 mb-3">
                        <Col md={6} lg={3}><Form.Group controlId="searchTerm"><Form.Label>Search by Name</Form.Label><InputGroup><Form.Control type="text" placeholder="Enter name..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} /><InputGroup.Text><FaSearch /></InputGroup.Text></InputGroup></Form.Group></Col>
                        <Col md={6} lg={2}><Form.Group controlId="filterStatus"><Form.Label>Status</Form.Label><Form.Select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}><option value="">All</option><option value="available">Available</option><option value="booked">Booked</option><option value="maintenance">Maintenance</option><option value="inactive">Inactive</option></Form.Select></Form.Group></Col>
                        <Col md={6} lg={2}><Form.Group controlId="filterType"><Form.Label>Space Type</Form.Label><Form.Select value={filterType} onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}><option value="">All Types</option>{spaceTypes.map(type => (<option key={type} value={type}>{type}</option>))}</Form.Select></Form.Group></Col>
                        <Col md={6} lg={2}><Form.Group controlId="filterCapacity"><Form.Label>Min. Capacity</Form.Label><Form.Control type="number" placeholder="e.g., 5" min="1" value={filterCapacity} onChange={(e) => { setFilterCapacity(e.target.value); setCurrentPage(1); }} /></Form.Group></Col>
                        <Col md={12} lg={3} className="text-lg-end mt-3 mt-lg-0">
                            <div className="d-flex flex-column flex-sm-row justify-content-lg-end align-items-stretch gap-2">
                                <Button variant="outline-secondary" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="flex-grow-1 flex-sm-grow-0">
                                    <FaFilter className="me-1" />{showAdvancedFilters ? 'Hide Advanced' : 'Advanced Filters'}
                                </Button>
                                <ButtonGroup className="flex-grow-1 flex-sm-grow-0">
                                    <Button variant={viewMode === 'list' ? 'primary' : 'outline-primary'} onClick={() => setViewMode('list')} title="List View"><FaThList /></Button>
                                    <Button variant={viewMode === 'grid' ? 'primary' : 'outline-primary'} onClick={() => setViewMode('grid')} title="Grid View"><FaThLarge /></Button>
                                </ButtonGroup>
                            </div>
                        </Col>
                    </Row>
                    {showAdvancedFilters && (
                        <Row className="align-items-end gy-3 border-top pt-3 mt-2">
                            <Col md={6} lg={3}><Form.Group controlId="filterPriceMin"><Form.Label>Min. Price (VND/hour)</Form.Label><Form.Control type="number" placeholder="e.g., 10000" min="0" value={filterPriceMin} onChange={(e) => { setFilterPriceMin(e.target.value); setCurrentPage(1); }} /></Form.Group></Col>
                            <Col md={6} lg={3}><Form.Group controlId="filterPriceMax"><Form.Label>Max. Price (VND/hour)</Form.Label><Form.Control type="number" placeholder="e.g., 100000" min="0" value={filterPriceMax} onChange={(e) => { setFilterPriceMax(e.target.value); setCurrentPage(1); }} /></Form.Group></Col>
                        </Row>
                    )}
                </Card.Body>
            </Card>

            {viewMode === 'list' && (
                <>
                    <div className="table-responsive">
                        <Table striped bordered hover className="spaces-table shadow-sm">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th><th>Space Name</th><th>Type</th><th><FaUsers className="me-1" />Capacity</th><th>Price (VND/hour)</th><th><FaTags className="me-1" />Status</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedSpacesForList.length > 0 ? paginatedSpacesForList.map(space => (
                                    <tr key={space.id}>
                                        <td>{space.id}</td>
                                        <td>{space.name}</td>
                                        <td>{space.type}</td>
                                        <td className="text-center">{space.capacity}</td>
                                        <td>{space.priceHour.toLocaleString()}</td>
                                        <td>{getStatusBadge(space.status)}</td>
                                        <td>
                                            <ButtonGroup size="sm">
                                                <OverlayTrigger placement="top" overlay={<Tooltip>View Details</Tooltip>}><Button as={Link} to={`/space-management/view/${space.id}`} variant="outline-info" className="d-inline-flex align-items-center">
                                                    <FaEye /><span className="d-none d-lg-inline ms-1">View</span>
                                                </Button></OverlayTrigger>
                                                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}><Button variant="outline-primary" onClick={() => handleEditSpace(space.id)} className="d-inline-flex align-items-center"><FaEdit /><span className="d-none d-lg-inline ms-1">Edit</span></Button></OverlayTrigger>
                                                <OverlayTrigger placement="top" overlay={<Tooltip>Maintenance</Tooltip>}><Button variant="outline-warning" onClick={() => handleSetMaintenance(space.id)}><FaTools /></Button></OverlayTrigger>
                                                <OverlayTrigger placement="top" overlay={space.status === 'inactive' ? <Tooltip>Activate</Tooltip> : <Tooltip>Deactivate</Tooltip>}><Button variant={space.status === 'inactive' ? "outline-success" : "outline-secondary"} onClick={() => handleToggleActive(space.id, space.status)}>{space.status === 'inactive' ? <FaToggleOn /> : <FaToggleOff />}</Button></OverlayTrigger>
                                                <OverlayTrigger placement="top" overlay={<Tooltip>View Calendar</Tooltip>}><Button variant="outline-dark" onClick={() => handleViewCalendar(space.id, space.name)}><FaCalendarAlt /></Button></OverlayTrigger>
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="7" className="text-center fst-italic py-3">No matching spaces found.</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                    {totalPagesForList > 1 && (
                        <div className="d-flex justify-content-center mt-3">
                            <Pagination>
                                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                {[...Array(totalPagesForList).keys()].map(num => {
                                    const pageNumber = num + 1;
                                    if (pageNumber === 1 || pageNumber === totalPagesForList || (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)) {
                                        return (<Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => handlePageChange(pageNumber)}>{pageNumber}</Pagination.Item>);
                                    } else if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
                                        return <Pagination.Ellipsis key={pageNumber} />;
                                    }
                                    return null;
                                })}
                                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPagesForList} />
                                <Pagination.Last onClick={() => handlePageChange(totalPagesForList)} disabled={currentPage === totalPagesForList} />
                            </Pagination>
                        </div>
                    )}
                </>
            )}

            {viewMode === 'grid' && (
                <div className="visual-overview-grid">
                    {filteredSpaces.length > 0 ? filteredSpaces.map(space => (
                        <Card key={space.id} className={`space-card status-border-${space.status} shadow-sm h-100`}>
                            <OverlayTrigger placement="bottom" delay={{ show: 300, hide: 150 }} overlay={(props) => renderTooltip(props, space)}>
                                <div className="space-card-clickable-content" onClick={() => handleViewDetails(space.id)}>
                                    <Card.Img variant="top" src={space.imageUrl || 'https://via.placeholder.com/300x200/cccccc/969696?text=No+Image'} alt={space.name} className="space-card-image" />
                                    <Card.Body className="d-flex flex-column p-3">
                                        <Card.Title className="space-card-name mb-1">{space.name}</Card.Title>
                                        <small className="text-muted space-card-type mb-2">{space.type}</small>
                                        <div className="d-flex justify-content-between align-items-center text-muted mb-2 mt-auto pt-2 border-top">
                                            <small className="d-flex align-items-center"><FaUserFriends className="me-1" /> {space.capacity}</small>
                                            <small className="fw-bold">{space.priceHour.toLocaleString()}VND/hour</small>
                                        </div>
                                        <div className="mt-1">{getStatusBadge(space.status, false)}</div>
                                    </Card.Body>
                                </div>
                            </OverlayTrigger>
                            <Card.Footer className="space-card-actions-footer p-2">
                                <ButtonGroup size="sm" className="w-100">
                                    <OverlayTrigger placement="top" overlay={<Tooltip>View Details</Tooltip>}><Button as={Link} to={`/space-management/view/${space.id}`} variant="outline-info" className="flex-fill">
                                        <FaEye />
                                    </Button></OverlayTrigger>
                                    <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}><Button variant="outline-primary" onClick={() => handleEditSpace(space.id)} className="flex-fill"><FaEdit /></Button></OverlayTrigger>
                                    <OverlayTrigger placement="top" overlay={<Tooltip>Maintenance</Tooltip>}><Button variant="outline-warning" onClick={() => handleSetMaintenance(space.id)} className="flex-fill"><FaTools /></Button></OverlayTrigger>
                                    <OverlayTrigger placement="top" overlay={<Tooltip>View Calendar</Tooltip>}><Button variant="outline-dark" onClick={() => handleViewCalendar(space.id, space.name)} className="flex-fill"><FaCalendarAlt /></Button></OverlayTrigger>
                                </ButtonGroup>
                            </Card.Footer>
                        </Card>
                    )) : (
                        <Col xs={12}><p className="text-center fst-italic py-5">No matching spaces found for the selected filters.</p></Col>
                    )}
                </div>
            )}
        </Container>
    );
};

export default SpaceManagementPage;