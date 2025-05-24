import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Container, Row, Col, Card, Image, Button, Navbar,
    Spinner, Alert, Breadcrumb, Tabs, Tab, ProgressBar, Form, ListGroup, Nav
} from 'react-bootstrap';
import {
    FaArrowLeft, FaMapMarkerAlt, FaWifi, FaPrint, FaCoffee, FaSnowflake, FaSun, FaCouch, FaUtensils, FaKey, FaUserTie,
    FaStar, FaRegStar, FaStarHalfAlt, FaEdit, FaDollarSign, FaUsers, FaRegCalendarCheck, FaQuoteLeft, FaCheckCircle,
    FaInfoCircle, FaListUl, FaMoneyBillWave, FaComments, FaStreetView,
} from 'react-icons/fa';
import { BsChatSquareQuoteFill, BsGraphUp, BsPeopleFill, BsShieldCheck } from 'react-icons/bs';

import { getMockSpaceDetailsById } from '../services/mockApi'; // Đảm bảo mockApi.js có dữ liệu images
import './SpaceDetailPage.css';

// THAY THẾ BẰNG API KEY CỦA BẠN (TỐT NHẤT LÀ QUA BIẾN MÔI TRƯỜNG)
// LƯU Ý: API KEY BẠN CUNG CẤP SẼ ĐƯỢC SỬ DỤNG Ở ĐÂY. HÃY BẢO VỆ NÓ!
const GOOGLE_MAPS_API_KEY = "abc";

// Helper Components
const TopBar = ({ locationHierarchy = [], name }) => {
    const navigate = useNavigate();
    return (
        <Row className="top-navigation-bar align-items-center py-2 mb-3">
            <Col xs="auto">
                <Button variant="link" onClick={() => navigate(-1)} className="back-link p-0 text-decoration-none text-muted">
                    <FaArrowLeft className="me-2" /> Back to Search
                </Button>
            </Col>
            <Col className="text-end">
                <Breadcrumb listProps={{ className: "mb-0 justify-content-end small" }}>
                    {locationHierarchy.map((item, index) => (
                        <Breadcrumb.Item key={index} linkAs={Link} linkProps={{ to: `/spaces?location=${encodeURIComponent(item)}` }}>
                            {item}
                        </Breadcrumb.Item>
                    ))}
                    <Breadcrumb.Item active>{name}</Breadcrumb.Item>
                </Breadcrumb>
            </Col>
        </Row>
    );
};

const MainSpaceHeader = ({ name }) => (
    <Row className="main-space-header-section mb-4">
        <Col><h1 className="space-main-title display-5 fw-bold">{name}</h1></Col>
    </Row>
);

// SỬA LẠI IMAGE GALLERY
const ImageGallery = ({ images = [], currentMainImage, onThumbnailClick }) => {
    if (!images || images.length === 0) {
        // Hiển thị ảnh placeholder nếu không có ảnh nào
        return (
            <Row className="image-gallery-section g-2 mb-4">
                <Col xs={12} className="large-image-col">
                    <Image src="https://via.placeholder.com/800x500/e0e0e0/6c757d?text=No+Image+Available" alt="No image available" fluid rounded className="gallery-main-image shadow-sm" />
                </Col>
            </Row>
        );
    }

    // Ảnh chính sẽ là currentMainImage được truyền vào, hoặc ảnh đầu tiên trong mảng images
    const mainDisplayUrl = currentMainImage || images[0].url;

    return (
        <Row className="image-gallery-section g-2 mb-4">
            <Col md={8} className="large-image-col mb-2 mb-md-0">
                <Image src={mainDisplayUrl} alt="Main space view" fluid rounded className="gallery-main-image shadow-sm" />
            </Col>
            {images.length > 1 && ( // Chỉ hiển thị thumbnail nếu có nhiều hơn 1 ảnh
                <Col md={4} className="thumbnail-grid-col">
                    <Row xs={2} className="g-2">
                        {images.map((img, idx) => (
                            // Không hiển thị thumbnail của ảnh đang là ảnh chính (tùy chọn)
                            // Hoặc luôn hiển thị và đánh dấu active
                            // Hiện tại: luôn hiển thị
                            <Col key={img.id || `thumb-${idx}`}>
                                <Image
                                    src={img.url}
                                    alt={`View ${idx + 1}`}
                                    fluid
                                    rounded
                                    className={`gallery-thumbnail shadow-sm ${img.url === mainDisplayUrl ? 'active' : ''}`}
                                    onClick={() => onThumbnailClick(img.url)}
                                />
                            </Col>
                        ))}
                    </Row>
                </Col>
            )}
        </Row>
    );
};


const ActionPanel = ({ priceHour, dailyPrice, monthlyPrice, spaceName, capacity }) => (
    <Card className="action-panel shadow-sm sticky-lg-top">
        <Card.Body className="p-3 p-lg-4">
            <div className="pricing-summary mb-3">
                {priceHour != null && ( // Kiểm tra null hoặc undefined
                    <h4 className="mb-0">
                        <FaDollarSign /> {priceHour.toLocaleString('en-US')}
                        <small className="text-muted fw-normal"> VND/hour</small>
                    </h4>
                )}
                {dailyPrice != null && (
                    <p className="mb-0 text-muted small">
                        Or from {dailyPrice.toLocaleString('en-US')} VND/day
                    </p>
                )}
                {monthlyPrice != null && (
                    <p className="mb-0 text-muted small">
                        Monthly plans available
                    </p>
                )}
                {(priceHour == null && dailyPrice == null && monthlyPrice == null) && (
                    <p className="text-muted">Contact for pricing</p>
                )}
            </div>
            <Button variant="primary" size="lg" className="w-100 mb-2 fw-bold book-now-btn" onClick={() => alert(`Proceed to book ${spaceName}`)}>
                <FaRegCalendarCheck className="me-2" /> Book Now
            </Button>
            <div className="text-center text-muted small mt-2">
                <FaUsers className="me-1" /> Up to {capacity} people
            </div>
        </Card.Body>
    </Card>
);

const renderStars = (rating, size = "1em") => {
    if (typeof rating !== 'number' || isNaN(rating)) return <span className="text-muted small">Not rated</span>;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.4 && rating % 1 <= 0.9;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <span style={{ fontSize: size, color: '#ffc107' }} title={`${rating.toFixed(1)} out of 5 stars`}>
            {[...Array(fullStars)].map((_, i) => <FaStar key={`fs-${i}`} />)}
            {halfStar && <FaStarHalfAlt key="hs" />}
            {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`es-${i}`} />)}
        </span>
    );
};

const amenityIconMap = {
    'Air Conditioning': <FaSnowflake />, 'WiFi': <FaWifi />, 'High-Speed WiFi': <FaWifi />, 'Outdoor Terrace': <FaSun />,
    'Printing': <FaPrint />, 'Lounge Area': <FaCouch />, 'Kitchen': <FaUtensils />, '24/7 Access': <FaKey />,
    'Reception': <FaUserTie />, 'Projector': <BsShieldCheck />, 'Whiteboard': <BsPeopleFill />,
    'Power Outlet': <BsGraphUp />, 'Ergonomic Chairs': <FaCouch />, 'Soundproofing': <BsChatSquareQuoteFill />,
    default: <FaCheckCircle />
};

const SpaceDetailPage = () => {
    const { spaceId } = useParams();
    const navigate = useNavigate();
    const [spaceDetails, setSpaceDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImageUrl, setMainImageUrl] = useState(''); // State cho ảnh chính đang hiển thị

    const [isStickyNavVisible, setIsStickyNavVisible] = useState(false);
    const mainContentStartRef = useRef(null);

    const sectionRefs = {
        overview: useRef(null), amenities: useRef(null), pricing: useRef(null),
        map: useRef(null), reviews: useRef(null), nearby: useRef(null),
    };

    const scrollToSection = (sectionId) => {
        sectionRefs[sectionId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true); setError(null);
            try {
                const data = await getMockSpaceDetailsById(spaceId); // Hàm mock API
                if (data) {
                    setSpaceDetails(data);
                    // Thiết lập ảnh chính ban đầu từ mảng images (nếu có) hoặc imageUrl
                    if (data.images && data.images.length > 0) {
                        setMainImageUrl(data.images[0].url);
                    } else if (data.imageUrl) {
                        setMainImageUrl(data.imageUrl);
                    } else {
                        setMainImageUrl('https://via.placeholder.com/800x500/e0e0e0/6c757d?text=No+Image+Available');
                    }
                } else { setError(`Space with ID ${spaceId} not found.`); }
            } catch (err) { setError(err.message || "Failed to load space details."); }
            finally { setLoading(false); }
        };
        if (spaceId) fetchDetails();
    }, [spaceId]);

    useEffect(() => {
        const handleScroll = () => {
            if (mainContentStartRef.current) {
                const rect = mainContentStartRef.current.getBoundingClientRect();
                setIsStickyNavVisible(rect.top <= 70); // 70 là offset ví dụ
            } else {
                setIsStickyNavVisible(false); // Nếu ref chưa có thì ẩn nav
            }
        };
        window.addEventListener('scroll', handleScroll);
        // Gọi handleScroll một lần khi component mount để kiểm tra vị trí ban đầu
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]); // Re-run khi loading thay đổi để đảm bảo ref đã tồn tại

    const handleThumbnailClick = (url) => {
        setMainImageUrl(url);
    };

    if (loading) return <Container className="text-center mt-5 vh-100 d-flex justify-content-center align-items-center"><Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} /><p className="ms-3 fs-5">Loading Space Details...</p></Container>;
    if (error) return <Container className="mt-5"><Alert variant="danger"><Alert.Heading>Error</Alert.Heading><p>{error}</p><Button as={Link} to="/spaces" variant="outline-primary">Back to Search</Button></Alert></Container>;
    if (!spaceDetails) return <Container className="mt-5"><Alert variant="warning">Space details not available.</Alert></Container>;

    const {
        name, locationHierarchy, images, pricingInfo, amenitiesDetails, locationAddress,
        overviewDetails, pricingTiers, reviews, averageRating, totalReviews, ratingBreakdown,
        type, priceHour, capacity, latitude, longitude
    } = spaceDetails;

    const dailyPriceInfo = pricingTiers?.coworking?.find(p => p.id === 'cw_daily');
    const monthlyPriceInfo = pricingTiers?.coworking?.find(p => p.id === 'cw_monthly');

    const navItems = [
        { key: 'overview', label: 'Overview', icon: <FaInfoCircle /> },
        { key: 'amenities', label: 'Amenities', icon: <FaListUl /> },
        { key: 'pricing', label: 'Pricing', icon: <FaMoneyBillWave /> },
        { key: 'map', label: 'Map', icon: <FaMapMarkerAlt /> },
        { key: 'reviews', label: 'Reviews', icon: <FaComments /> },
        { key: 'nearby', label: 'Nearby', icon: <FaStreetView /> },
    ];

    const getStaticMapUrl = () => {
        if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
            return "https://via.placeholder.com/800x400/e0e0e0/6c757d?text=Map+API+Key+Missing+or+Invalid";
        }
        let markerLocation;
        if (latitude != null && longitude != null) { // Kiểm tra null/undefined
            markerLocation = `${latitude},${longitude}`;
        } else if (locationAddress) {
            markerLocation = encodeURIComponent(locationAddress);
        } else {
            return "https://via.placeholder.com/800x400/e0e0e0/6c757d?text=Location+Not+Available";
        }
        const params = new URLSearchParams({
            center: markerLocation, zoom: '16', size: '800x400', maptype: 'roadmap',
            markers: `color:orange|label:S|${markerLocation}`, key: GOOGLE_MAPS_API_KEY
        });
        return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
    };

    return (
        <div className="space-detail-page-wrapper">
            {isStickyNavVisible && (
                <Navbar bg="light" variant="light" fixed="top" className="sticky-section-nav shadow-sm">
                    <Container fluid="lg">
                        <Nav className="flex-row flex-nowrap overflow-auto">
                            {navItems.map(item => (
                                <Nav.Link key={item.key} onClick={() => scrollToSection(item.key)} className="px-3 text-nowrap">
                                    {item.icon && React.cloneElement(item.icon, { className: "me-2" })}
                                    {item.label}
                                </Nav.Link>
                            ))}
                        </Nav>
                    </Container>
                </Navbar>
            )}

            <Container fluid="lg" className="space-detail-page-customer py-3 px-md-4">
                <TopBar locationHierarchy={locationHierarchy} name={name} />
                <MainSpaceHeader name={name} />

                <Row className="main-layout-row">
                    <Col lg={8} className="main-content-col">
                        {/* Truyền mainImageUrl và images (toàn bộ mảng) vào ImageGallery */}
                        <ImageGallery images={images || []} currentMainImage={mainImageUrl} onThumbnailClick={handleThumbnailClick} />
                        <div ref={mainContentStartRef}></div>

                        <section id="overview-section" ref={sectionRefs.overview} className="space-section card shadow-sm mb-4">
                            <Card.Body className="p-4"><h3 className="section-title"><FaInfoCircle className="me-2 text-primary" />Overview</h3><p className="overview-text" style={{ whiteSpace: 'pre-line' }}>{overviewDetails}</p></Card.Body>
                        </section>

                        <section id="amenities-section" ref={sectionRefs.amenities} className="space-section card shadow-sm mb-4">
                            <Card.Body className="p-4"><h3 className="section-title"><FaListUl className="me-2 text-primary" />Amenities</h3>
                                {amenitiesDetails && amenitiesDetails.length > 0 ? (
                                    <Row xs={1} sm={2} md={3} className="g-3 amenities-grid">
                                        {amenitiesDetails.map((amenity, idx) => (
                                            <Col key={amenity.id || idx}><div className="amenity-item d-flex align-items-center p-2">
                                                <span className="amenity-icon me-2 text-muted">{React.cloneElement(amenityIconMap[amenity.name] || amenityIconMap.default, { size: "1.3em" })}</span>
                                                {amenity.name}
                                            </div></Col>
                                        ))}
                                    </Row>
                                ) : <p className="text-muted">No specific amenities listed.</p>}
                            </Card.Body>
                        </section>

                        <section id="pricing-section" ref={sectionRefs.pricing} className="space-section card shadow-sm mb-4">
                            <Card.Body className="p-4"><h3 className="section-title"><FaMoneyBillWave className="me-2 text-primary" />Pricing Plans</h3>
                                <Tabs defaultActiveKey="coworking_pricing" id="pricing-sub-tabs" className="mb-3 pricing-sub-nav-tabs">
                                    {pricingTiers?.coworking?.length > 0 && <Tab eventKey="coworking_pricing" title="Coworking">
                                        <Row xs={1} md={2} lg={3} className="g-3 mt-1">
                                            {pricingTiers.coworking.map(plan => (
                                                <Col key={plan.id} className="d-flex"><Card className={`pricing-option-card ${plan.popular ? 'popular' : ''}`}>
                                                    {plan.popular && <div className="popular-badge">Most Popular</div>}
                                                    <Card.Body className="text-center d-flex flex-column">
                                                        <div className="pricing-icon mb-2">{React.cloneElement(amenityIconMap[plan.icon] || <FaUsers />, { size: "2em", className: "text-primary" })}</div>
                                                        <Card.Subtitle className="mb-2 text-muted">{plan.name}</Card.Subtitle>
                                                        <Card.Title className="h3 my-2 price-value">{plan.price.toLocaleString('en-US')}</Card.Title>
                                                        <p className="text-muted small price-unit">VND {plan.unitText}</p>
                                                        <ListGroup variant="flush" className="text-start small mt-auto">
                                                            {plan.features?.map((feat, i) => <ListGroup.Item key={i} className="px-0 border-0"><FaCheckCircle className="text-success me-1" /> {feat}</ListGroup.Item>)}
                                                        </ListGroup>
                                                    </Card.Body>
                                                </Card></Col>
                                            ))}
                                        </Row>
                                    </Tab>}
                                    {pricingTiers?.privateOffice?.length > 0 && <Tab eventKey="private_pricing" title="Private Office">
                                        <Row xs={1} md={2} lg={3} className="g-3 mt-1">
                                            {pricingTiers.privateOffice.map(plan => (
                                                <Col key={plan.id} className="d-flex"><Card className={`pricing-option-card ${plan.popular ? 'popular' : ''}`}>
                                                    {plan.popular && <div className="popular-badge">Most Popular</div>}
                                                    <Card.Body className="text-center d-flex flex-column">
                                                        <div className="pricing-icon mb-2">{React.cloneElement(amenityIconMap[plan.icon] || <FaBuilding />, { size: "2em", className: "text-primary" })}</div>
                                                        <Card.Subtitle className="mb-2 text-muted">{plan.name}</Card.Subtitle>
                                                        <Card.Title className="h3 my-2 price-value">{plan.price.toLocaleString('en-US')}</Card.Title>
                                                        <p className="text-muted small price-unit">VND {plan.unitText}</p>
                                                        <ListGroup variant="flush" className="text-start small mt-auto">
                                                            {plan.features?.map((feat, i) => <ListGroup.Item key={i} className="px-0 border-0"><FaCheckCircle className="text-success me-1" /> {feat}</ListGroup.Item>)}
                                                        </ListGroup>
                                                    </Card.Body>
                                                </Card></Col>
                                            ))}
                                        </Row>
                                    </Tab>}
                                    {pricingTiers?.virtualOffice?.length > 0 && <Tab eventKey="virtual_pricing" title="Virtual Office">
                                        <Row xs={1} md={2} lg={3} className="g-3 mt-1">
                                            {pricingTiers.virtualOffice.map(plan => (
                                                <Col key={plan.id} className="d-flex"><Card className={`pricing-option-card ${plan.popular ? 'popular' : ''}`}>
                                                    {plan.popular && <div className="popular-badge">Most Popular</div>}
                                                    <Card.Body className="text-center d-flex flex-column">
                                                        <div className="pricing-icon mb-2">{React.cloneElement(amenityIconMap[plan.icon] || <FaUsers />, { size: "2em", className: "text-primary" })}</div>
                                                        <Card.Subtitle className="mb-2 text-muted">{plan.name}</Card.Subtitle>
                                                        <Card.Title className="h3 my-2 price-value">{plan.price.toLocaleString('en-US')}</Card.Title>
                                                        <p className="text-muted small price-unit">VND {plan.unitText}</p>
                                                        <ListGroup variant="flush" className="text-start small mt-auto">
                                                            {plan.features?.map((feat, i) => <ListGroup.Item key={i} className="px-0 border-0"><FaCheckCircle className="text-success me-1" /> {feat}</ListGroup.Item>)}
                                                        </ListGroup>
                                                    </Card.Body>
                                                </Card></Col>
                                            ))}
                                        </Row>
                                    </Tab>}
                                </Tabs>
                            </Card.Body>
                        </section>

                        <section id="map-section" ref={sectionRefs.map} className="space-section card shadow-sm mb-4">
                            <Card.Body className="p-4"><h3 className="section-title"><FaMapMarkerAlt className="me-2 text-primary" />Location & Map</h3>
                                {locationAddress && <p className="lead mb-3">{locationAddress}</p>}
                                <div className="interactive-map-container my-3">
                                    <Image src={getStaticMapUrl()} fluid rounded alt={`Map of ${name}`} className="location-static-map" />
                                    {(GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE" || !GOOGLE_MAPS_API_KEY) &&
                                        <small className="d-block text-center text-danger mt-1">Google Maps API Key is missing or invalid. Please configure it.</small>
                                    }
                                </div>
                                {overviewDetails && <> <h5 className="mt-4">About the Neighborhood</h5>
                                    <p className="overview-text-block" style={{ whiteSpace: 'pre-line' }}>{overviewDetails.substring(0, Math.min(250, overviewDetails.length))}{overviewDetails.length > 250 ? "..." : ""}</p></>}
                            </Card.Body>
                        </section>

                        <section id="reviews-section" ref={sectionRefs.reviews} className="space-section card shadow-sm mb-4">
                            <Card.Body className="p-4"><h3 className="section-title"><FaComments className="me-2 text-primary" />Reviews ({totalReviews || 0})</h3>
                                <Row>
                                    <Col md={5} lg={4} className="mb-4 mb-md-0 review-summary-col">
                                        <div className="text-center bg-light p-3 rounded mb-3">
                                            <div className="display-2 fw-bolder text-primary">{averageRating.toFixed(1)}</div>
                                            <div>{renderStars(averageRating, "1.8em")}</div>
                                            <small className="text-muted">Based on {totalReviews} reviews</small>
                                        </div>
                                        <hr className="my-4" />
                                        <h5>Rating Breakdown</h5>
                                        {ratingBreakdown && ratingBreakdown.map(cat => (
                                            <div key={cat.category} className="mb-2">
                                                <div className="d-flex justify-content-between small">
                                                    <span>{cat.category}</span>
                                                    <span className="fw-medium">{cat.rating.toFixed(1)}</span>
                                                </div>
                                                <ProgressBar now={cat.percentage} style={{ height: '10px' }} />
                                            </div>
                                        ))}
                                    </Col>
                                    <Col md={7} lg={8} className="recent-reviews-col">
                                        <h4>Recent Reviews</h4>
                                        {reviews && reviews.length > 0 ? (
                                            reviews.map(review => (
                                                <Card key={review.id} className="mb-3 review-item-card">
                                                    <Card.Body className="p-3"><div className="d-flex">
                                                        <Image src={review.avatarUrl || 'https://i.pravatar.cc/50'} roundedCircle width={50} height={50} className="me-3 flex-shrink-0" />
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                                <strong className="review-user-name">{review.userName}</strong>
                                                                <small className="text-muted review-date">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</small>
                                                            </div>
                                                            <div className="mb-1 review-stars">{renderStars(review.rating)}</div>
                                                            <p className="mb-0 review-text">{review.comment}</p>
                                                        </div>
                                                    </div></Card.Body>
                                                </Card>
                                            ))
                                        ) : <p className="text-muted fst-italic">No reviews yet for this space.</p>}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </section>

                        <section id="nearby-section" ref={sectionRefs.nearby} className="space-section card shadow-sm mb-4">
                            <Card.Body className="p-4"><h3 className="section-title"><FaStreetView className="me-2 text-primary" />Nearby Spaces</h3>
                                <p className="text-muted">This section will show other available spaces in the vicinity. (Functionality to be implemented)</p>
                            </Card.Body>
                        </section>
                    </Col>

                    <Col lg={4} className="action-panel-col">
                        <ActionPanel
                            priceHour={priceHour}
                            dailyPrice={dailyPriceInfo?.price}
                            monthlyPrice={monthlyPriceInfo?.price}
                            spaceName={name}
                            capacity={capacity}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SpaceDetailPage;