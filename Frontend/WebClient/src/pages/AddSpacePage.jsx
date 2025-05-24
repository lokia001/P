import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Breadcrumb, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaBuilding, FaMapMarkerAlt, FaDollarSign, FaUsers, FaInfoCircle, FaClock, FaClipboardList, FaCheckSquare, FaConciergeBell, FaPlus } from 'react-icons/fa';
import { getAllMockAmenities, getAllMockServices, createMockSpace } from '../services/mockApi'; // Điều chỉnh đường dẫn

// IMPORT CÁC HÀM TỪ API.JS CỦA BẠN
import {
    getAllAmenities, getAllServices

    , createSpace
} from '../services/api'; // Điều chỉnh đường dẫn nếu cần

const AddSpacePage = () => {
    const navigate = useNavigate();

    // States cho form data
    const [spaceName, setSpaceName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [spaceType, setSpaceType] = useState('Individual');
    const [capacity, setCapacity] = useState(1);
    const [basePrice, setBasePrice] = useState(''); // Để trống cho placeholder
    const [hourlyPrice, setHourlyPrice] = useState('');
    const [dailyPrice, setDailyPrice] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [closeTime, setCloseTime] = useState('');
    // Thêm các state khác nếu cần cho các trường booking rules, cleaning, buffer...

    const [selectedAmenities, setSelectedAmenities] = useState(new Set());
    const [selectedServices, setSelectedServices] = useState([]); // Mảng các object { serviceId: Guid, price: number, name: string }

    // States để lưu danh sách amenities và services từ API
    const [amenities, setAmenities] = useState([]);
    const [services, setServices] = useState([]);

    // States cho trạng thái loading và lỗi
    const [loadingData, setLoadingData] = useState(true); // Một state chung cho cả amenities và services
    const [fetchError, setFetchError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const [cleaningDurationMinutes, setCleaningDurationMinutes] = useState('');
    const [bufferMinutes, setBufferMinutes] = useState('');
    const [minBookingDurationMinutes, setMinBookingDurationMinutes] = useState('');
    const [maxBookingDurationMinutes, setMaxBookingDurationMinutes] = useState('');
    const [cancellationNoticeHours, setCancellationNoticeHours] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            setLoadingData(true);
            setFetchError(null);
            try {
                // Sử dụng Promise.all để fetch song song
                const [amenitiesData, servicesData] = await Promise.all([
                    getAllMockAmenities(),
                    getAllMockServices()
                ]);
                setAmenities(amenitiesData || []);
                setServices(servicesData || []);
            } catch (error) {
                console.error("Error fetching initial data:", error);
                setFetchError(error.message || "Failed to load initial data. Please ensure you are logged in and try again.");
                setAmenities([]);
                setServices([]);
            } finally {
                setLoadingData(false);
            }
        };

        loadInitialData();
    }, []);

    const handleAmenityChange = (amenityId) => {
        setSelectedAmenities(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(amenityId)) {
                newSelected.delete(amenityId);
            } else {
                newSelected.add(amenityId);
            }
            return newSelected;
        });
    };

    const handleServiceSelectionChange = (serviceId, isSelected) => {
        if (isSelected) {
            const serviceDetails = services.find(s => s.id === serviceId);
            if (serviceDetails && !selectedServices.some(s => s.serviceId === serviceId)) {
                setSelectedServices(prev => [
                    ...prev,
                    {
                        serviceId: serviceId,
                        name: serviceDetails.name, // Lưu tên để hiển thị
                        price: serviceDetails.basePrice, // Giá mặc định
                        unit: serviceDetails.unit // Lưu unit để hiển thị
                    }
                ]);
            }
        } else {
            setSelectedServices(prev => prev.filter(s => s.serviceId !== serviceId));
        }
    };

    const handleServicePriceChange = (serviceId, newPrice) => {
        setSelectedServices(prev => prev.map(s =>
            s.serviceId === serviceId ? { ...s, price: parseFloat(newPrice) || 0 } : s
        ));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setFetchError(null);

        // Chuyển đổi giá trị từ form sang kiểu dữ liệu backend mong đợi
        const spacePayload = {
            name: spaceName,
            description: description || null, // Gửi null nếu rỗng
            address: address || null,
            // Đảm bảo parse sang số, backend mong muốn decimal/int
            latitude: parseFloat(latitude) || 0, // Hoặc validate chặt chẽ hơn
            longitude: parseFloat(longitude) || 0,

            // Đối với Enum 'type', backend mong muốn số (0, 1, 2, 3).
            // Cần một hàm hoặc logic để chuyển đổi giá trị string từ Form.Select sang số.
            type: (() => {
                switch (spaceType) {
                    case 'Individual': return 0;
                    case 'Group': return 1;
                    case 'MeetingRoom': return 2;
                    case 'EntireOffice': return 3;
                    default: return 0; // Hoặc throw lỗi nếu giá trị không hợp lệ
                }
            })(),

            capacity: parseInt(capacity) || 1,
            basePrice: parseFloat(basePrice) || 0,
            hourlyPrice: hourlyPrice ? parseFloat(hourlyPrice) : null,
            dailyPrice: dailyPrice ? parseFloat(dailyPrice) : null,

            // TimeSpan: Backend C# thường nhận TimeSpan dưới dạng string "HH:mm:ss" hoặc "HH:mm"
            // Input type="time" trả về "HH:mm"
            openTime: openTime || null, // Nếu rỗng, gửi null
            closeTime: closeTime || null,

            cleaningDurationMinutes: cleaningDurationMinutes ? parseInt(cleaningDurationMinutes) : null,
            bufferMinutes: bufferMinutes ? parseInt(bufferMinutes) : null,
            minBookingDurationMinutes: minBookingDurationMinutes ? parseInt(minBookingDurationMinutes) : null,
            maxBookingDurationMinutes: maxBookingDurationMinutes ? parseInt(maxBookingDurationMinutes) : null,
            cancellationNoticeHours: cancellationNoticeHours ? parseInt(cancellationNoticeHours) : null,

            amenityIds: Array.from(selectedAmenities),
            services: selectedServices.map(s => ({
                serviceId: s.serviceId,
                price: parseFloat(s.price) || 0 // Đảm bảo price là số
            }))
        };

        console.log('Submitting Space Data (Payload):', spacePayload);

        try {
            const createdSpace = await createMockSpace(spacePayload); // SỬ DỤNG HÀM MOCK
            console.log('Mock space created successfully:', createdSpace);
            alert('Space created successfully (Mock Data)!');
            navigate('/space-management');
        } catch (error) {
            console.error("Error creating mock space:", error);
            setFetchError(error.message || "Failed to create space with mock data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingData) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                <p className="mt-3">Loading initial data...</p>
            </Container>
        );
    }

    // Nếu có lỗi fetch ban đầu, hiển thị lỗi và không render form
    // if (fetchError && (amenities.length === 0 || services.length === 0)) {
    //     return (
    //         <Container className="mt-5">
    //             <Alert variant="danger">
    //                 <Alert.Heading>Error Loading Page Data</Alert.Heading>
    //                 <p>{fetchError}</p>
    //                 <p>Please try refreshing the page. If the problem persists, contact support.</p>
    //             </Alert>
    //         </Container>
    //     );
    // }


    return (
        <Container fluid className="add-space-page p-3 p-md-4">
            <Breadcrumb className="mb-3">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/space-management" }}>Space Management</Breadcrumb.Item>
                <Breadcrumb.Item active>Add New Space</Breadcrumb.Item>
            </Breadcrumb>

            <Row className="justify-content-center">
                <Col lg={10} xl={8}>
                    <Card className="shadow-sm">
                        <Card.Header as="h4" className="bg-primary text-white">
                            <FaPlus className="me-2" /> Add New Workspace
                        </Card.Header>
                        <Card.Body className="p-4">
                            {fetchError && <Alert variant="danger" onClose={() => setFetchError(null)} dismissible>{fetchError}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <h5 className="mb-3 section-title"><FaBuilding className="me-2 text-primary" />Basic Information</h5>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-3" controlId="spaceName">
                                            <Form.Label>Space Name <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" placeholder="Enter space name (e.g., Alpha Meeting Room)" value={spaceName} onChange={(e) => setSpaceName(e.target.value)} required />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3" controlId="spaceDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={3} placeholder="Provide a detailed description of the space..." value={description} onChange={(e) => setDescription(e.target.value)} />
                                </Form.Group>

                                <h5 className="mb-3 mt-4 section-title"><FaMapMarkerAlt className="me-2 text-primary" />Location</h5>
                                <Form.Group className="mb-3" controlId="spaceAddress">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" placeholder="Enter full address" value={address} onChange={(e) => setAddress(e.target.value)} />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="spaceLatitude">
                                            <Form.Label>Latitude <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="e.g., 10.7769"
                                                step="any" // Cho phép số thập phân
                                                value={latitude}
                                                onChange={(e) => setLatitude(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="spaceLongitude">
                                            <Form.Label>Longitude <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="e.g., 106.7009"
                                                step="any"
                                                value={longitude}
                                                onChange={(e) => setLongitude(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>


                                <h5 className="mb-3 mt-4 section-title"><FaInfoCircle className="me-2 text-primary" />Details & Capacity</h5>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="spaceType">
                                            <Form.Label>Space Type <span className="text-danger">*</span></Form.Label>
                                            <Form.Select value={spaceType} onChange={(e) => setSpaceType(e.target.value)} required >
                                                <option value="" disabled>Select type...</option>
                                                <option value="Individual">Individual Desk</option>
                                                <option value="Group">Group Area</option>
                                                <option value="MeetingRoom">Meeting Room</option>
                                                <option value="EntireOffice">Entire Office</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="spaceCapacity">
                                            <Form.Label>Capacity <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="number" placeholder="Number of people" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value) || 1)} min="1" required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <h5 className="mb-3 mt-4 section-title"><FaDollarSign className="me-2 text-primary" />Pricing</h5>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="basePrice">
                                            <Form.Label>Base Price (VND) <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="number" placeholder="e.g., 50000" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} min="0" required />
                                            <Form.Text className="text-muted">Base price per booking or smallest unit.</Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}><Form.Group className="mb-3" controlId="hourlyPrice"><Form.Label>Hourly Price (VND)</Form.Label><Form.Control type="number" placeholder="Optional" value={hourlyPrice} onChange={e => setHourlyPrice(e.target.value)} min="0" /></Form.Group></Col>
                                    <Col md={4}><Form.Group className="mb-3" controlId="dailyPrice"><Form.Label>Daily Price (VND)</Form.Label><Form.Control type="number" placeholder="Optional" value={dailyPrice} onChange={e => setDailyPrice(e.target.value)} min="0" /></Form.Group></Col>
                                </Row>

                                <h5 className="mb-3 mt-4 section-title"><FaClock className="me-2 text-primary" />Operating Hours</h5>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3" controlId="openTime"><Form.Label>Open Time</Form.Label><Form.Control type="time" value={openTime} onChange={e => setOpenTime(e.target.value)} /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3" controlId="closeTime"><Form.Label>Close Time</Form.Label><Form.Control type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)} /></Form.Group></Col>
                                </Row>
                                {/* Add other booking rule fields here */}
                                <h5 className="mb-3 mt-4 section-title"><FaClock className="me-2 text-primary" />Booking Rules & Preparation</h5>
                                <Row>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="cleaningDurationMinutes">
                                            <Form.Label>Cleaning Duration (minutes)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="e.g., 30"
                                                min="0"
                                                value={cleaningDurationMinutes}
                                                onChange={(e) => setCleaningDurationMinutes(e.target.value)}
                                            />
                                            <Form.Text className="text-muted">Time for cleaning after booking.</Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="bufferMinutes">
                                            <Form.Label>Buffer Time (minutes)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="e.g., 15"
                                                min="0"
                                                value={bufferMinutes}
                                                onChange={(e) => setBufferMinutes(e.target.value)}
                                            />
                                            <Form.Text className="text-muted">Buffer after cleaning before next booking.</Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="minBookingDurationMinutes">
                                            <Form.Label>Min. Booking (minutes)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="e.g., 60"
                                                min="1"
                                                value={minBookingDurationMinutes}
                                                onChange={(e) => setMinBookingDurationMinutes(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="maxBookingDurationMinutes">
                                            <Form.Label>Max. Booking (minutes)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="e.g., 240"
                                                min="1"
                                                value={maxBookingDurationMinutes}
                                                onChange={(e) => setMaxBookingDurationMinutes(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="cancellationNoticeHours">
                                            <Form.Label>Cancellation Notice (hours)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="e.g., 24"
                                                min="0"
                                                value={cancellationNoticeHours}
                                                onChange={(e) => setCancellationNoticeHours(e.target.value)}
                                            />
                                            <Form.Text className="text-muted">Hours before booking to cancel freely.</Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>


                                <h5 className="mb-3 mt-4 section-title"><FaClipboardList className="me-2 text-primary" />Features</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label><FaCheckSquare className="me-2 text-success" />Available Amenities</Form.Label>
                                    {fetchError && amenities.length === 0 && <Alert variant="warning">Could not load amenities. You can still create the space and add them later.</Alert>}
                                    {!fetchError && amenities.length === 0 && !loadingData && <Alert variant="info">No amenities available to select. You can add them from the Amenity Management page.</Alert>}
                                    {amenities.length > 0 && (
                                        <div className="amenities-checkbox-group p-3 border rounded"> <Row>
                                            {amenities.map(amenity => (
                                                <Col md={4} sm={6} key={amenity.id}>
                                                    <Form.Check type="checkbox" id={`amenity-${amenity.id}`} label={amenity.name} checked={selectedAmenities.has(amenity.id)} onChange={() => handleAmenityChange(amenity.id)} className="mb-2" />
                                                </Col>
                                            ))} </Row>
                                        </div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label><FaConciergeBell className="me-2 text-info" />Offered Services</Form.Label>
                                    {fetchError && services.length === 0 && <Alert variant="warning">Could not load services. You can still create the space and add them later.</Alert>}
                                    {!fetchError && services.length === 0 && !loadingData && <Alert variant="info">No services available to select. You can add them from the Service Management page.</Alert>}
                                    {services.length > 0 && (
                                        <div className="services-list-group p-3 border rounded">
                                            {services.map(service => (
                                                <Card key={service.id} className="mb-2 service-selection-card">
                                                    <Card.Body className="p-2">
                                                        <Form.Check
                                                            type="checkbox"
                                                            id={`service-check-${service.id}`}
                                                            label={`${service.name} (Default: ${service.basePrice?.toLocaleString()} VND/${service.unit})`}
                                                            checked={selectedServices.some(s => s.serviceId === service.id)}
                                                            onChange={(e) => handleServiceSelectionChange(service.id, e.target.checked)}
                                                        />
                                                        {selectedServices.some(s => s.serviceId === service.id) && (
                                                            <Form.Group controlId={`service-price-${service.id}`} size="sm" className="mt-1 ms-4">
                                                                <Form.Label className="small">Custom Price for this Space (VND)</Form.Label>
                                                                <InputGroup>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Enter custom price"
                                                                        value={selectedServices.find(s => s.serviceId === service.id)?.price}
                                                                        onChange={(e) => handleServicePriceChange(service.id, e.target.value)}
                                                                        min="0"
                                                                    />
                                                                </InputGroup>
                                                            </Form.Group>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </Form.Group>

                                <h5 className="mb-3 mt-4 section-title">Images</h5>
                                <Form.Group controlId="formFileMultiple" className="mb-3">
                                    <Form.Label>Upload Space Images</Form.Label>
                                    <Form.Control type="file" multiple />
                                    <Form.Text className="text-muted">
                                        You can upload multiple images. The first one will be the main image by default.
                                    </Form.Text>
                                </Form.Group>

                                <div className="mt-4 d-flex justify-content-end">
                                    <Button variant="outline-secondary" type="button" className="me-2" onClick={() => navigate('/space-management')} disabled={isSubmitting}>
                                        <FaTimes className="me-1" /> Cancel
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" /> Saving...</> : <><FaSave className="me-1" /> Save Space</>}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddSpacePage;