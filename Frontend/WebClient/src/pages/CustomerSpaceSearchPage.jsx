import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Pagination, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaMapMarkerAlt, FaUsers, FaDollarSign, FaFilter, FaBuilding, FaTag, FaInfoCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate để điều hướng khi click card
import { getAllMockSpaces } from '../services/mockApi'; // Import mock data/API
import './CustomerSpaceSearchPage.css'; // File CSS riêng cho trang này

const ITEMS_PER_PAGE = 6; // Số lượng card không gian mỗi trang

const CustomerSpaceSearchPage = () => {
    const navigate = useNavigate();
    const [allSpaces, setAllSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState(''); // Tên hoặc địa chỉ
    const [filterType, setFilterType] = useState('');
    const [filterCapacityMin, setFilterCapacityMin] = useState('');
    const [filterPriceMax, setFilterPriceMax] = useState(''); // Lọc theo giá tối đa/giờ

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const loadSpaces = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllMockSpaces();
                setAllSpaces(data || []);
            } catch (err) {
                console.error("Error fetching spaces for customer:", err);
                setError(err.message || "Failed to load available spaces.");
                setAllSpaces([]);
            } finally {
                setLoading(false);
            }
        };
        loadSpaces();
    }, []);

    const spaceTypes = useMemo(() => {
        if (!allSpaces) return [];
        return [...new Set(allSpaces.map(s => s.type))].sort();
    }, [allSpaces]);

    const filteredSpaces = useMemo(() => {
        if (!allSpaces) return [];
        return allSpaces
            .filter(space => space.status === 'available') // Chỉ hiển thị các space 'available'
            .filter(space =>
            (space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (space.address && space.address.toLowerCase().includes(searchTerm.toLowerCase())))
            )
            .filter(space => filterType ? space.type === filterType : true)
            .filter(space => filterCapacityMin ? space.capacity >= parseInt(filterCapacityMin, 10) : true)
            .filter(space => filterPriceMax ? space.priceHour <= parseFloat(filterPriceMax) : true);
    }, [allSpaces, searchTerm, filterType, filterCapacityMin, filterPriceMax]);

    // Pagination logic
    const totalPages = Math.ceil(filteredSpaces.length / ITEMS_PER_PAGE);
    const paginatedSpaces = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredSpaces.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredSpaces, currentPage]);

    useEffect(() => { // Reset page khi filter thay đổi
        setCurrentPage(1);
    }, [searchTerm, filterType, filterCapacityMin, filterPriceMax]);


    const handleCardClick = (spaceId) => {
        // Điều hướng đến trang chi tiết không gian.
        // Route này cần được định nghĩa và có thể giống với trang chi tiết mà Owner xem,
        // hoặc một phiên bản riêng cho Customer.
        navigate(`/spaces/${spaceId}`); // Ví dụ route: /spaces/:spaceId
    };

    const getStatusBadge = (status) => { // Đơn giản hóa cho customer view
        if (status === 'available') return <Badge bg="success">Available</Badge>;
        // Các trạng thái khác có thể không cần hiển thị cho customer search
        return null;
    };


    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                <p className="mt-3">Loading available spaces...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <Alert.Heading>Error Loading Spaces</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="primary" onClick={() => window.location.reload()}>Try Again</Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="customer-space-search-page py-4">
            <Row className="mb-4 justify-content-center">
                <Col md={10} lg={8}>
                    <h1 className="text-center page-title mb-3">Find Your Perfect Workspace</h1>
                    <InputGroup className="mb-3 shadow-sm">
                        <Form.Control
                            type="text"
                            placeholder="Search by name or address (e.g., 'Alpha Meeting', 'District 1')"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search spaces"
                        />
                        <Button variant="primary" id="button-search"><FaSearch /></Button>
                    </InputGroup>
                </Col>
            </Row>

            <Row>
                {/* Filters Sidebar/Column */}
                <Col lg={3} md={4} className="mb-4 mb-md-0">
                    <Card className="filter-sidebar shadow-sm">
                        <Card.Header as="h5" className="bg-light">
                            <FaFilter className="me-2" />Filters
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="filterSpaceType">
                                    <Form.Label><FaBuilding className="me-1" /> Space Type</Form.Label>
                                    <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                        <option value="">All Types</option>
                                        {spaceTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="filterCapacityMin">
                                    <Form.Label><FaUsers className="me-1" /> Min. Capacity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="e.g., 5"
                                        min="1"
                                        value={filterCapacityMin}
                                        onChange={(e) => setFilterCapacityMin(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="filterPriceMax">
                                    <Form.Label><FaDollarSign className="me-1" /> Max. Price per Hour (VND)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="e.g., 100000"
                                        min="0"
                                        value={filterPriceMax}
                                        onChange={(e) => setFilterPriceMax(e.target.value)}
                                    />
                                </Form.Group>
                                {/* Có thể thêm các bộ lọc khác: Amenities, Rating,... */}
                                <Button variant="outline-secondary" className="w-100 mt-2" onClick={() => {
                                    setSearchTerm('');
                                    setFilterType('');
                                    setFilterCapacityMin('');
                                    setFilterPriceMax('');
                                }}>
                                    Clear All Filters
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Spaces Listing */}
                <Col lg={9} md={8}>
                    {filteredSpaces.length > 0 ? (
                        <>
                            <Row xs={1} md={2} xl={3} className="g-4">
                                {paginatedSpaces.map(space => (
                                    <Col key={space.id}>
                                        <Card className="h-100 space-result-card shadow-hover" onClick={() => handleCardClick(space.id)}>
                                            <Card.Img
                                                variant="top"
                                                src={space.imageUrl || 'https://via.placeholder.com/350x200/007bff/ffffff?text=Workspace'}
                                                alt={space.name}
                                                className="space-result-card-img"
                                            />
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title className="h5 mb-1 space-name-link">{space.name}</Card.Title>
                                                <small className="text-muted mb-2 d-flex align-items-center">
                                                    <FaTag className="me-1" /> {space.type}
                                                </small>
                                                {space.address && (
                                                    <small className="text-muted mb-2 d-flex align-items-center">
                                                        <FaMapMarkerAlt className="me-1" /> {space.address.length > 30 ? `${space.address.substring(0, 27)}...` : space.address}
                                                    </small>
                                                )}
                                                <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                                                    <span className="fw-bold price-tag">
                                                        <FaDollarSign /> {space.priceHour?.toLocaleString('en-US')} /hour
                                                    </span>
                                                    <Badge bg="success" pill>Available</Badge> {/* Chỉ hiển thị available */}
                                                </div>
                                                <Button variant="primary" size="sm" className="mt-2 w-100 stretched-link-button" onClick={(e) => { e.stopPropagation(); handleCardClick(space.id); }}>
                                                    View Details
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination>
                                        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                                        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} />
                                        {[...Array(totalPages).keys()].map(num => {
                                            const pageNumber = num + 1;
                                            if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)) {
                                                return (<Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => setCurrentPage(pageNumber)}>{pageNumber}</Pagination.Item>);
                                            } else if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
                                                return <Pagination.Ellipsis key={`ellipsis-${pageNumber}`} disabled />;
                                            }
                                            return null;
                                        })}
                                        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} />
                                        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                                    </Pagination>
                                </div>
                            )}
                        </>
                    ) : (
                        <Card className="text-center p-5 shadow-sm">
                            <Card.Body>
                                <FaInfoCircle size={40} className="text-muted mb-3" />
                                <h4>No Spaces Found</h4>
                                <p className="text-muted">Try adjusting your search criteria or filters.</p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default CustomerSpaceSearchPage;