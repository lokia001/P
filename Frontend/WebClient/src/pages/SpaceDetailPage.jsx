import React, { useState, useMemo } from 'react';
// QUAN TRỌNG: Đảm bảo dòng import này đầy đủ các component bạn dùng
import {
    Container,
    Row,
    Col,
    Button,
    ButtonGroup,
    Table,
    Card,
    Form,
    InputGroup,
    Pagination,
    Badge,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap'; // <--- KIỂM TRA KỸ DÒNG NÀY
import {
    FaThList, FaThLarge, FaPlus, FaSearch, FaEdit, FaEye, FaTools, FaToggleOn, FaToggleOff,
    FaRegCheckCircle, FaRegClock, FaExclamationTriangle, FaBan, FaCalendarAlt
    , FaUserFriends // Icon cho sức chứa
    , FaFilter
    ,
} from 'react-icons/fa';
// import './SpaceManagementPage.css'; // File CSS cục bộ cho trang này

// Dữ liệu mẫu (giữ nguyên như trước)
const mockSpaces = [
    { id: 'S001', name: 'Phòng Họp Alpha', type: 'Phòng họp', capacity: 10, priceHour: 50000, status: 'available', amenities: ['Máy chiếu', 'Bảng trắng'], floor: 1, position: { x: 1, y: 1 } },
    { id: 'S002', name: 'Bàn làm việc B01', type: 'Bàn đơn', capacity: 1, priceHour: 15000, status: 'booked', amenities: ['Ổ cắm', 'Wifi'], floor: 1, position: { x: 2, y: 1 } },
    { id: 'S003', name: 'Văn phòng riêng Gamma', type: 'Văn phòng riêng', capacity: 4, priceHour: 80000, status: 'maintenance', amenities: ['Máy lạnh', 'Bàn ghế'], floor: 1, position: { x: 1, y: 2 } },
    { id: 'S004', name: 'Khu vực sự kiện Delta', type: 'Khu vực chung', capacity: 50, priceHour: 200000, status: 'available', amenities: ['Âm thanh', 'Sân khấu nhỏ'], floor: 2, position: { x: 1, y: 1 } },
    { id: 'S005', name: 'Phòng Họp Beta', type: 'Phòng họp', capacity: 6, priceHour: 40000, status: 'inactive', amenities: ['Máy chiếu'], floor: 2, position: { x: 2, y: 1 } },
    { id: 'S006', name: 'Bàn làm việc B02', type: 'Bàn đơn', capacity: 1, priceHour: 15000, status: 'available', amenities: ['Ổ cắm', 'Wifi'], floor: 1, position: { x: 3, y: 1 } },
    { id: 'S007', name: 'Phòng Họp Zeta', type: 'Phòng họp', capacity: 12, priceHour: 60000, status: 'booked', amenities: ['Máy chiếu', 'Bảng trắng', 'Video Call'], floor: 2, position: { x: 1, y: 2 } },
    { id: 'S008', name: 'Văn phòng riêng Epsilon', type: 'Văn phòng riêng', capacity: 2, priceHour: 65000, status: 'available', amenities: ['Máy lạnh', 'Bàn ghế công thái học'], floor: 1, position: { x: 2, y: 2 } },
    { id: 'S009', name: 'Bàn làm việc C01 (Cửa sổ)', type: 'Bàn đơn', capacity: 1, priceHour: 20000, status: 'maintenance', amenities: ['Ổ cắm', 'Wifi', 'View đẹp'], floor: 2, position: { x: 3, y: 2 } },
    { id: 'S010', name: 'Phòng stream Theta', type: 'Phòng chuyên dụng', capacity: 1, priceHour: 70000, status: 'available', amenities: ['PC cấu hình cao', 'Green screen', 'Mic'], floor: 1, position: { x: 3, y: 2 } },
    { id: 'S011', name: 'Phòng stream Theta', type: 'Phòng chuyên dụng', capacity: 1, priceHour: 70000, status: 'available', amenities: ['PC cấu hình cao', 'Green screen', 'Mic'], floor: 1, position: { x: 3, y: 2 } },
    { id: 'S010', name: 'Phòng stream Theta', type: 'Phòng chuyên dụng', capacity: 1, priceHour: 70000, status: 'available', amenities: ['PC cấu hình cao', 'Green screen', 'Mic'], floor: 1, position: { x: 3, y: 2 } },
    { id: 'S010', name: 'Phòng stream Theta', type: 'Phòng chuyên dụng', capacity: 1, priceHour: 70000, status: 'available', amenities: ['PC cấu hình cao', 'Green screen', 'Mic'], floor: 1, position: { x: 3, y: 2 } },
    { id: 'S010', name: 'Phòng stream Theta', type: 'Phòng chuyên dụng', capacity: 1, priceHour: 70000, status: 'available', amenities: ['PC cấu hình cao', 'Green screen', 'Mic'], floor: 1, position: { x: 3, y: 2 } },
    { id: 'S010', name: 'Phòng stream Theta', type: 'Phòng chuyên dụng', capacity: 1, priceHour: 70000, status: 'available', amenities: ['PC cấu hình cao', 'Green screen', 'Mic'], floor: 1, position: { x: 3, y: 2 } },
    { id: 'S010', name: 'Phòng stream Theta', type: 'Phòng chuyên dụng', capacity: 1, priceHour: 70000, status: 'available', amenities: ['PC cấu hình cao', 'Green screen', 'Mic'], floor: 1, position: { x: 3, y: 2 } },

];

const ITEMS_PER_PAGE = 5;

const SpaceDetailPage = () => {
    alert("SpaceManagementPage IS BEING CALLED - TOP OF FUNCTION");
    const [spaces, setSpaces] = useState(mockSpaces);
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    // START: THÊM STATE CHO BỘ LỌC SỨC CHỨA
    const [filterCapacity, setFilterCapacity] = useState(''); // Lưu trữ giá trị nhập vào
    // END: THÊM STATE CHO BỘ LỌC SỨC CHỨA

    // START: THÊM STATE CHO BỘ LỌC NÂNG CAO (GIÁ)
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [filterPriceMin, setFilterPriceMin] = useState('');
    const [filterPriceMax, setFilterPriceMax] = useState('');
    // END: THÊM STATE CHO BỘ LỌC NÂNG CAO (GIÁ)

    // // START: TÍNH TOÁN DỮ LIỆU THỐNG KÊ
    // const stats = useMemo(() => {
    //     const total = mockSpaces.length; // Sử dụng mockSpaces gốc để có tổng số không thay đổi bởi filter
    //     const available = mockSpaces.filter(s => s.status === 'available').length;
    //     const booked = mockSpaces.filter(s => s.status === 'booked').length;
    //     const maintenance = mockSpaces.filter(s => s.status === 'maintenance').length;
    //     const inactive = mockSpaces.filter(s => s.status === 'inactive').length;
    //     return { total, available, booked, maintenance, inactive };
    // }, [mockSpaces]); // Phụ thuộc vào mockSpaces nếu nó có thể thay đổi từ bên ngoài
    // // END: TÍNH TOÁN DỮ LIỆU THỐNG KÊ

    // START: CẬP NHẬT getStatusBadge ĐỂ THÊM ICON
    const getStatusBadge = (status, showIcon = true) => {
        let icon = null;
        let text = '';
        let variant = 'light';
        let textColor = 'dark';

        switch (status) {
            case 'available':
                icon = showIcon ? <FaRegCheckCircle className="me-1" /> : null;
                text = 'Còn trống';
                variant = 'success';
                textColor = 'white'; // Đổi màu chữ cho dễ đọc trên nền đậm
                break;
            case 'booked':
                icon = showIcon ? <FaRegClock className="me-1" /> : null;
                text = 'Đã đặt';
                variant = 'warning';
                textColor = 'dark';
                break;
            case 'maintenance':
                icon = showIcon ? <FaExclamationTriangle className="me-1" /> : null;
                text = 'Bảo trì';
                variant = 'danger';
                textColor = 'white';
                break;
            case 'inactive':
                icon = showIcon ? <FaBan className="me-1" /> : null;
                text = 'Không hoạt động';
                variant = 'secondary';
                textColor = 'white';
                break;
            default:
                text = status;
                break;
        }
        // return <Badge bg={variant} text={textColor}>{icon}{text}</Badge>; // Cũ
        // Để Badge có màu chữ tùy chỉnh, Bootstrap 5.1+ hỗ trợ textColor trực tiếp
        // Nếu dùng Bootstrap cũ hơn, có thể cần class CSS tùy chỉnh cho màu chữ
        return <Badge bg={variant} className={textColor === 'white' ? 'text-white' : 'text-dark'}>{icon}{text}</Badge>;
    };
    // END: CẬP NHẬT getStatusBadge ĐỂ THÊM ICON

    // START: THÊM HÀM CHO NÚT XEM LỊCH (YÊU CẦU 7 - CHUẨN BỊ)
    const handleViewCalendar = (spaceId, spaceName) => {
        console.log(`View calendar for space ${spaceName} (ID: ${spaceId})`);
        // Logic mở modal lịch hoặc chuyển trang sẽ ở đây
    };
    // END: THÊM HÀM CHO NÚT XEM LỊCH

    // const spaceTypes = useMemo(() => [...new Set(mockSpaces.map(s => s.type))], []);

    // const filteredSpaces = useMemo(() => {
    //     return spaces
    //         .filter(space =>
    //             space.name.toLowerCase().includes(searchTerm.toLowerCase())
    //         )
    //         .filter(space =>
    //             filterStatus ? space.status === filterStatus : true
    //         )
    //         .filter(space =>
    //             filterType ? space.type === filterType : true
    //         )
    //         // START: THÊM LOGIC LỌC THEO SỨC CHỨA
    //         .filter(space =>
    //             filterCapacity ? space.capacity >= parseInt(filterCapacity, 10) : true
    //         )

    //         // END: THÊM LOGIC LỌC THEO SỨC CHỨA
    //         // START: THÊM LOGIC LỌC THEO KHOẢNG GIÁ
    //         .filter(space =>
    //             filterPriceMin ? space.priceHour >= parseFloat(filterPriceMin) : true
    //         )
    //         .filter(space =>
    //             filterPriceMax ? space.priceHour <= parseFloat(filterPriceMax) : true
    //         );
    //     // END: THÊM LOGIC LỌC THEO KHOẢNG GIÁ

    // }, [spaces, searchTerm, filterStatus, filterType, filterCapacity, filterPriceMin, filterPriceMax]);

    // const paginatedSpaces = useMemo(() => {
    //     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    //     return filteredSpaces.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    // }, [filteredSpaces, currentPage]);

    // const totalPages = Math.ceil(filteredSpaces.length / ITEMS_PER_PAGE);

    // const handlePageChange = (pageNumber) => {
    //     setCurrentPage(pageNumber);
    // };


    // Hàm renderTooltip (đảm bảo nó vẫn tồn tại và phù hợp)
    // const renderTooltip = (props, space) => (
    //     <Tooltip id={`tooltip-${space.id}`} {...props}>
    //         <strong>{space.name}</strong> ({space.type})<br />
    //         Trạng thái: {getStatusBadge(space.status, true)} {/* Hiển thị cả icon trong tooltip */}
    //         <br />
    //         Sức chứa: {space.capacity} người<br />
    //         Giá: {space.priceHour.toLocaleString()} VNĐ/giờ
    //     </Tooltip>
    // );

    // const handleViewDetails = (spaceId) => console.log(`View details for ${spaceId}`);
    // const handleEditSpace = (spaceId) => console.log(`Edit space ${spaceId}`);
    // const handleSetMaintenance = (spaceId) => console.log(`Set maintenance for ${spaceId}`);
    // const handleToggleActive = (spaceId, currentStatus) => console.log(`Toggle active for ${spaceId}, current: ${currentStatus}`);
    // const handleAddSpace = () => console.log('Open Add New Space form/modal');
    // const handleVisualSpaceClick = (spaceId) => console.log(`Clicked on visual space ${spaceId}`);


    // THÊM CONSOLE LOGS Ở ĐÂY
    console.log("=> ITEMS_PER_PAGE:", ITEMS_PER_PAGE);
    console.log("=> filteredSpaces length:", filteredSpaces.length);
    console.log("=> totalPages calculated:", totalPages);
    console.log("=> Current Page (for list view):", currentPage);
    console.log("=> paginatedSpaces length (for list view):", paginatedSpaces.length);
    console.log("=> SpaceManagementPage is rendering. Current viewMode:", viewMode, "Show advanced filters:", showAdvancedFilters);

    return (
        // Nếu Container không được import, dòng này sẽ gây lỗi
        // <Container fluid className="space-management-page">
        //     {/* Tương tự cho Row, Col,... */}

        //     <Row className="page-header align-items-center mb-3">
        //         <Col>
        //             <h1>Space Management</h1>
        //         </Col>
        //         <Col xs="auto">
        //             <Button variant="primary" onClick={handleAddSpace}>
        //                 <FaPlus className="me-2" /> Thêm Không Gian Mới
        //             </Button>
        //         </Col>
        //     </Row>

        //     {/* START: THÊM KHU VỰC THỐNG KÊ */}
        //     <Row className="mb-3 g-3">
        //         <Col md={3} sm={6}>
        //             <Card className="stat-card bg-primary text-white">
        //                 <Card.Body>
        //                     <Card.Title>Tổng Số Không Gian</Card.Title>
        //                     <Card.Text className="fs-2 fw-bold">{stats.total}</Card.Text>
        //                 </Card.Body>
        //             </Card>
        //         </Col>
        //         <Col md={2} sm={6}>
        //             <Card className="stat-card status-available-card">
        //                 <Card.Body>
        //                     <Card.Title><FaRegCheckCircle /> Còn Trống</Card.Title>
        //                     <Card.Text className="fs-3 fw-bold">{stats.available}</Card.Text>
        //                 </Card.Body>
        //             </Card>
        //         </Col>
        //         <Col md={2} sm={6}>
        //             <Card className="stat-card status-booked-card">
        //                 <Card.Body>
        //                     <Card.Title><FaRegClock /> Đã Đặt</Card.Title>
        //                     <Card.Text className="fs-3 fw-bold">{stats.booked}</Card.Text>
        //                 </Card.Body>
        //             </Card>
        //         </Col>
        //         <Col md={2} sm={6}>
        //             <Card className="stat-card status-maintenance-card">
        //                 <Card.Body>
        //                     <Card.Title><FaExclamationTriangle /> Bảo Trì</Card.Title>
        //                     <Card.Text className="fs-3 fw-bold">{stats.maintenance}</Card.Text>
        //                 </Card.Body>
        //             </Card>
        //         </Col>
        //         <Col md={3} sm={6}> {/* Điều chỉnh md để vừa hàng */}
        //             <Card className="stat-card status-inactive-card">
        //                 <Card.Body>
        //                     <Card.Title><FaBan /> Không Hoạt Động</Card.Title>
        //                     <Card.Text className="fs-3 fw-bold">{stats.inactive}</Card.Text>
        //                 </Card.Body>
        //             </Card>
        //         </Col>
        //     </Row>
        //     {/* END: THÊM KHU VỰC THỐNG KÊ */}

        //     <Card className="mb-3 filter-controls-card">
        //         <Card.Body>
        //             <Row className="align-items-end gy-3 mb-3">
        //                 <Col md={3}>
        //                     <Form.Group controlId="searchTerm">
        //                         <Form.Label>Tìm kiếm theo tên</Form.Label>
        //                         <InputGroup controlId="searchTerm">
        //                             <Form.Control
        //                                 type="text"
        //                                 placeholder="Nhập tên không gian..."
        //                                 value={searchTerm}
        //                                 onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        //                             />
        //                             <InputGroup.Text><FaSearch /></InputGroup.Text>
        //                         </InputGroup>
        //                     </Form.Group>
        //                 </Col>
        //                 <Col md={2}>
        //                     <Form.Group controlId="filterStatus">
        //                         <Form.Label>Trạng thái</Form.Label>
        //                         <Form.Select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
        //                             <option value="">Tất cả trạng thái</option>
        //                             <option value="available">Còn trống</option>
        //                             <option value="booked">Đã đặt</option>
        //                             <option value="maintenance">Bảo trì</option>
        //                             <option value="inactive">Không hoạt động</option>
        //                         </Form.Select>
        //                     </Form.Group>
        //                 </Col>
        //                 <Col md={2}>
        //                     <Form.Group controlId="filterType">
        //                         <Form.Label>Loại không gian</Form.Label>
        //                         <Form.Select value={filterType} onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}>
        //                             <option value="">Tất cả các loại</option>
        //                             {spaceTypes.map(type => (
        //                                 <option key={type} value={type}>{type}</option>
        //                             ))}
        //                         </Form.Select>
        //                     </Form.Group>
        //                 </Col>
        //                 {/* START: THÊM FORM.GROUP CHO BỘ LỌC SỨC CHỨA */}
        //                 <Col md={2}> {/* Điều chỉnh Col sizing */}
        //                     <Form.Group controlId="filterCapacity">
        //                         <Form.Label>Sức chứa tối thiểu</Form.Label>
        //                         <Form.Control
        //                             type="number"
        //                             placeholder="VD: 5"
        //                             min="1"
        //                             value={filterCapacity}
        //                             onChange={(e) => { setFilterCapacity(e.target.value); setCurrentPage(1); }}
        //                         />
        //                     </Form.Group>
        //                 </Col>
        //                 {/* END: THÊM FORM.GROUP CHO BỘ LỌC SỨC CHỨA */}

        //                 <Col md={3} className="text-md-end d-flex flex-column justify-content-end">
        //                     {/* Nút bộ lọc nâng cao sẽ nằm cùng hàng với ButtonGroup chuyển view */}
        //                     <div className="d-flex justify-content-end align-items-center">
        //                         <Button
        //                             variant="outline-secondary"
        //                             onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        //                             className="me-2"
        //                             size="sm" // Đồng bộ kích thước với ButtonGroup
        //                         >
        //                             <FaFilter className="me-1" />
        //                             {showAdvancedFilters ? 'Ẩn nâng cao' : 'Lọc nâng cao'}
        //                         </Button>
        //                         <ButtonGroup size="sm"> {/* Đặt size="sm" cho ButtonGroup */}
        //                             <Button variant={viewMode === 'list' ? 'primary' : 'outline-primary'} onClick={() => setViewMode('list')}>
        //                                 <FaThList />
        //                             </Button>
        //                             <Button variant={viewMode === 'visual' ? 'primary' : 'outline-primary'} onClick={() => setViewMode('visual')}>
        //                                 <FaThLarge />
        //                             </Button>
        //                         </ButtonGroup>
        //                     </div>
        //                 </Col>
        //             </Row>

        //             {/* START: KHU VỰC BỘ LỌC NÂNG CAO (HIỂN THỊ CÓ ĐIỀU KIỆN) */}
        //             {showAdvancedFilters && (
        //                 <Row className="align-items-end gy-3 border-top pt-3 mt-2">
        //                     <Col md={3}>
        //                         <Form.Group controlId="filterPriceMin">
        //                             <Form.Label>Giá tối thiểu (giờ)</Form.Label>
        //                             <Form.Control
        //                                 type="number"
        //                                 placeholder="VD: 10000"
        //                                 min="0"
        //                                 value={filterPriceMin}
        //                                 onChange={(e) => { setFilterPriceMin(e.target.value); setCurrentPage(1); }}
        //                             />
        //                         </Form.Group>
        //                     </Col>
        //                     <Col md={3}>
        //                         <Form.Group controlId="filterPriceMax">
        //                             <Form.Label>Giá tối đa (giờ)</Form.Label>
        //                             <Form.Control
        //                                 type="number"
        //                                 placeholder="VD: 100000"
        //                                 min="0"
        //                                 value={filterPriceMax}
        //                                 onChange={(e) => { setFilterPriceMax(e.target.value); setCurrentPage(1); }}
        //                             />
        //                         </Form.Group>
        //                     </Col>
        //                     {/* Thêm các bộ lọc nâng cao khác ở đây (ví dụ: tiện nghi) */}
        //                 </Row>
        //             )}
        //             {/* END: KHU VỰC BỘ LỌC NÂNG CAO */}

        //         </Card.Body>
        //     </Card>

        //     {viewMode === 'list' && (
        //         <>
        //             <Table striped bordered hover responsive className="spaces-table">
        //                 <thead>
        //                     <tr>
        //                         <th>ID</th>
        //                         <th>Tên Không Gian</th>
        //                         <th>Loại</th>
        //                         <th>Sức chứa</th>
        //                         <th>Giá (giờ)</th>
        //                         <th>Trạng thái</th>
        //                         <th>Hành động</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     {paginatedSpaces.length > 1 ? paginatedSpaces.map(space => (
        //                         <tr key={space.id} className={`status-row-${space.status}`}>
        //                             <td>{space.id}</td>
        //                             <td>{space.name}</td>
        //                             <td>{space.type}</td>
        //                             <td className="text-center">{space.capacity}</td>
        //                             <td>{space.priceHour.toLocaleString()} VNĐ</td>
        //                             <td>{getStatusBadge(space.status)}</td>
        //                             <td>
        //                                 <ButtonGroup size="sm">
        //                                     <OverlayTrigger placement="top" overlay={<Tooltip>Xem chi tiết</Tooltip>}>
        //                                         <Button variant="outline-info" onClick={() => handleViewDetails(space.id)}><FaEye /></Button>
        //                                     </OverlayTrigger>
        //                                     <OverlayTrigger placement="top" overlay={<Tooltip>Chỉnh sửa</Tooltip>}>
        //                                         <Button variant="outline-primary" onClick={() => handleEditSpace(space.id)}><FaEdit /></Button>
        //                                     </OverlayTrigger>
        //                                     <OverlayTrigger placement="top" overlay={<Tooltip>Bảo trì</Tooltip>}>
        //                                         <Button variant="outline-warning" onClick={() => handleSetMaintenance(space.id)}><FaTools /></Button>
        //                                     </OverlayTrigger>
        //                                     <OverlayTrigger placement="top" overlay={space.status === 'inactive' ? <Tooltip>Kích hoạt</Tooltip> : <Tooltip>Vô hiệu hóa</Tooltip>}>
        //                                         <Button
        //                                             variant={space.status === 'inactive' ? "outline-success" : "outline-secondary"}
        //                                             onClick={() => handleToggleActive(space.id, space.status)}
        //                                         >
        //                                             {space.status === 'inactive' ? <FaToggleOn /> : <FaToggleOff />}
        //                                         </Button>
        //                                     </OverlayTrigger>
        //                                     {/* START: THÊM NÚT XEM LỊCH CHO LIST VIEW (YÊU CẦU 7) */}
        //                                     <OverlayTrigger placement="top" overlay={<Tooltip>Xem lịch</Tooltip>}>
        //                                         <Button variant="outline-secondary" onClick={() => handleViewCalendar(space.id, space.name)}><FaCalendarAlt /></Button>
        //                                     </OverlayTrigger>
        //                                     {/* END: THÊM NÚT XEM LỊCH CHO LIST VIEW */}
        //                                 </ButtonGroup>
        //                             </td>
        //                         </tr>
        //                     )) : (
        //                         <tr>
        //                             <td colSpan="7" className="text-center">Không tìm thấy không gian nào.</td>
        //                         </tr>
        //                     )}
        //                 </tbody>
        //             </Table>
        //             {totalPages > 1 && (
        //                 <Pagination className="justify-content-center">
        //                     <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        //                     {[...Array(totalPages).keys()].map(num => (
        //                         <Pagination.Item
        //                             key={num + 1}
        //                             active={num + 1 === currentPage}
        //                             onClick={() => handlePageChange(num + 1)}
        //                         >
        //                             {num + 1}
        //                         </Pagination.Item>
        //                     ))}
        //                     <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        //                 </Pagination>
        //             )}
        //         </>
        //     )}

        //     {viewMode === 'visual' && (
        //         <div className="visual-overview-grid">
        //             {filteredSpaces.length > 0 ? filteredSpaces.map(space => (
        //                 // REPLACE THE ENTIRE <Card> COMPONENT FOR VISUAL VIEW WITH THIS NEW VERSION:
        //                 <Card
        //                     key={space.id}
        //                     className={`space-card status-border-${space.status}`} // Thay đổi class để chỉ áp dụng border, không phải background trực tiếp
        //                 >
        //                     <OverlayTrigger
        //                         placement="top"
        //                         delay={{ show: 350, hide: 200 }} // Điều chỉnh delay
        //                         overlay={(props) => renderTooltip(props, space)}
        //                     >
        //                         {/* Phần này để click, có thể dùng để mở modal chi tiết nhanh */}
        //                         <div className="space-card-clickable-content" onClick={() => handleViewDetails(space.id)}>
        //                             <Card.Header className={`space-card-header status-bg-${space.status}`}>
        //                                 <Card.Title className="space-card-name mb-0">{space.name}</Card.Title>
        //                             </Card.Header>
        //                             <Card.Body className="d-flex flex-column">
        //                                 <div className="mb-1">
        //                                     <small className="text-muted">{space.type}</small>
        //                                 </div>
        //                                 {/* START: ĐẢM BẢO ĐOẠN CODE NÀY TỒN TẠI VÀ ĐÚNG */}
        //                                 <div className="d-flex align-items-center mb-2">
        //                                     <FaUserFriends className="me-1 text-muted" title="Sức chứa" /> {/* Thêm title cho icon */}
        //                                     <span className="fw-bold me-3">{space.capacity}</span>
        //                                     <small className="text-muted ms-auto">Giá: <strong>{space.priceHour.toLocaleString()}</strong></small>
        //                                 </div>
        //                                 {/* END: ĐẢM BẢO ĐOẠN CODE NÀY TỒN TẠI VÀ ĐÚNG */}
        //                                 <div className="mt-auto">
        //                                     {getStatusBadge(space.status, false)} {/* false: không hiển thị icon trong badge trên card */}
        //                                 </div>
        //                             </Card.Body>
        //                         </div>
        //                     </OverlayTrigger>
        //                     <Card.Footer className="space-card-actions-footer">
        //                         <ButtonGroup size="sm" className="w-100">
        //                             <OverlayTrigger placement="top" overlay={<Tooltip>Xem chi tiết</Tooltip>}>
        //                                 <Button variant="outline-info" onClick={() => handleViewDetails(space.id)} className="flex-fill"><FaEye /></Button>
        //                             </OverlayTrigger>
        //                             <OverlayTrigger placement="top" overlay={<Tooltip>Chỉnh sửa</Tooltip>}>
        //                                 <Button variant="outline-primary" onClick={() => handleEditSpace(space.id)} className="flex-fill"><FaEdit /></Button>
        //                             </OverlayTrigger>
        //                             <OverlayTrigger placement="top" overlay={<Tooltip>Bảo trì</Tooltip>}>
        //                                 <Button variant="outline-warning" onClick={() => handleSetMaintenance(space.id)} className="flex-fill"><FaTools /></Button>
        //                             </OverlayTrigger>
        //                             <OverlayTrigger placement="top" overlay={space.status === 'inactive' ? <Tooltip>Kích hoạt</Tooltip> : <Tooltip>Vô hiệu hóa</Tooltip>}>
        //                                 <Button
        //                                     variant={space.status === 'inactive' ? "outline-success" : "outline-secondary"}
        //                                     onClick={() => handleToggleActive(space.id, space.status)}
        //                                     className="flex-fill"
        //                                 >
        //                                     {space.status === 'inactive' ? <FaToggleOn /> : <FaToggleOff />}
        //                                 </Button>
        //                             </OverlayTrigger>
        //                             <OverlayTrigger placement="top" overlay={<Tooltip>Xem lịch</Tooltip>}>
        //                                 <Button variant="outline-dark" onClick={() => handleViewCalendar(space.id, space.name)} className="flex-fill"><FaCalendarAlt /></Button>
        //                             </OverlayTrigger>
        //                         </ButtonGroup>
        //                     </Card.Footer>
        //                 </Card>
        //                 // END OF REPLACEMENT FOR <Card> COMPONENT
        //             )) : (
        //                 <p className="text-center w-100">Không tìm thấy không gian nào phù hợp với bộ lọc.</p>
        //             )}
        //         </div>
        //     )}
        // </Container>

        <Container fluid className="space-management-page">
            <h1>Minimal Render Test</h1>
            <p>If this shows, the problem is in the commented out logic.</p>
        </Container>
    );
};

export default SpaceDetailPage;