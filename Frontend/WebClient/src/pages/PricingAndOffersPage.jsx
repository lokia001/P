import React, { useState } from 'react';
import { Tabs, Tab, Button, Table, Modal, Form, InputGroup, Dropdown, FormCheck } from 'react-bootstrap';
import './PricingAndOffersPage.css'; // File CSS tùy chỉnh

// Dữ liệu mẫu (thay thế bằng API call sau này)
const initialSpaceTypes = [
    { id: 1, name: 'Không gian làm việc chung', priceHour: 50000, priceDay: 300000, priceWeek: 1500000, priceMonth: 5000000 },
    { id: 2, name: 'Văn phòng riêng (2 người)', priceHour: 100000, priceDay: 700000, priceWeek: 3000000, priceMonth: 10000000 },
    { id: 3, name: 'Phòng họp (10 người)', priceHour: 200000, priceDay: 1200000, priceWeek: null, priceMonth: null },
    { id: 4, name: 'Chỗ ngồi cố định', priceHour: null, priceDay: 350000, priceWeek: 1800000, priceMonth: 6000000 },
];

const initialOffers = [
    { id: 1, name: 'Chào hè rực rỡ', code: 'SUMMER23', type: 'Giảm giá phần trăm', value: '15%', startDate: '2023-06-01', endDate: '2023-08-31', appliesTo: 'Không gian làm việc chung, Chỗ ngồi cố định', status: 'Hoạt động', isActive: true },
    { id: 2, name: 'Giảm giá khai trương', code: 'GRANDOPEN', type: 'Giảm giá tiền mặt', value: '100,000 VND', startDate: '2023-05-01', endDate: '2023-05-31', appliesTo: 'Tất cả', status: 'Hết hạn', isActive: false },
    { id: 3, name: 'Miễn phí ngày đầu', code: 'FIRSTFREE', type: 'Miễn phí giờ', value: '8 giờ', startDate: '2023-01-01', endDate: '2023-12-31', appliesTo: 'Văn phòng riêng', status: 'Tạm dừng', isActive: false },
];

const spaceCategoriesForOffer = [
    'Không gian làm việc chung',
    'Văn phòng riêng (2 người)',
    'Phòng họp (10 người)',
    'Chỗ ngồi cố định',
    'Dịch vụ A',
    'Dịch vụ B'
];

const PricingAndOffersPage = () => {
    const [activeTab, setActiveTab] = useState('pricing');
    const [pricingData, setPricingData] = useState(initialSpaceTypes);
    const [offersData, setOffersData] = useState(initialOffers);

    const [showAddOfferModal, setShowAddOfferModal] = useState(false);
    const [showAdvancedPricingModal, setShowAdvancedPricingModal] = useState(false);

    // State cho form thêm ưu đãi mới
    const [newOffer, setNewOffer] = useState({
        name: '',
        code: '',
        type: 'Giảm giá phần trăm',
        value: '',
        startDate: '',
        endDate: '',
        appliesTo: [],
        initialStatus: 'Hoạt động'
    });

    const handlePriceChange = (id, field, value) => {
        setPricingData(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, [field]: value === '' ? null : parseFloat(value) } : item
            )
        );
    };

    const handleSavePriceRow = (id) => {
        const rowData = pricingData.find(item => item.id === id);
        console.log('Lưu giá cho:', rowData);
        // TODO: API call để lưu dữ liệu
        alert(`Đã lưu giá cho ${rowData.name}`);
    };

    const handleNewOfferChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "appliesTo") {
            setNewOffer(prev => ({
                ...prev,
                appliesTo: checked ? [...prev.appliesTo, value] : prev.appliesTo.filter(item => item !== value)
            }));
        } else {
            setNewOffer(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddOffer = () => {
        console.log('Thêm ưu đãi mới:', newOffer);
        // TODO: API call để thêm ưu đãi
        // Thêm vào list tạm thời để demo
        const newOfferData = {
            id: offersData.length + 1,
            ...newOffer,
            status: newOffer.initialStatus,
            isActive: newOffer.initialStatus === 'Hoạt động',
            startDate: newOffer.startDate,
            endDate: newOffer.endDate,
            appliesTo: newOffer.appliesTo.join(', ') // Chuyển array thành string để hiển thị
        };
        setOffersData(prev => [...prev, newOfferData]);
        setShowAddOfferModal(false);
        // Reset form
        setNewOffer({
            name: '', code: '', type: 'Giảm giá phần trăm', value: '',
            startDate: '', endDate: '', appliesTo: [], initialStatus: 'Hoạt động'
        });
    };

    const toggleOfferStatus = (offerId) => {
        setOffersData(prevOffers => prevOffers.map(offer => {
            if (offer.id === offerId) {
                const newIsActive = !offer.isActive;
                return {
                    ...offer,
                    isActive: newIsActive,
                    status: newIsActive ? 'Hoạt động' : (new Date(offer.endDate) < new Date() ? 'Hết hạn' : 'Tạm dừng') // Cập nhật status logic
                };
            }
            return offer;
        }));
        console.log(`Thay đổi trạng thái ưu đãi ID: ${offerId}`);
        // TODO: API call
    };

    const deleteOffer = (offerId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa ưu đãi này?')) {
            setOffersData(prevOffers => prevOffers.filter(offer => offer.id !== offerId));
            console.log(`Xóa ưu đãi ID: ${offerId}`);
            // TODO: API call
        }
    };

    const getStatusClass = (status) => {
        if (status === 'Hoạt động') return 'status-active';
        if (status === 'Hết hạn') return 'status-expired';
        if (status === 'Tạm dừng') return 'status-paused';
        return '';
    };

    return (
        <div className="container mt-4 pricing-offers-page">
            <h1 className="mb-4 page-title">Quản Lý Giá và Ưu Đãi</h1>

            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} id="pricing-offers-tabs" className="mb-3">
                <Tab eventKey="pricing" title="Quản Lý Giá">
                    <div className="tab-content-wrapper">
                        <h2 className="tab-section-title">Bảng Giá</h2>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Loại Không Gian</th>
                                    <th>Giá theo giờ (VND)</th>
                                    <th>Giá theo ngày (VND)</th>
                                    <th>Giá theo tuần (VND)</th>
                                    <th>Giá theo tháng (VND)</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pricingData.map(space => (
                                    <tr key={space.id}>
                                        <td>{space.name}</td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={space.priceHour === null ? '' : space.priceHour}
                                                onChange={(e) => handlePriceChange(space.id, 'priceHour', e.target.value)}
                                                placeholder="N/A"
                                                className="price-input"
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={space.priceDay === null ? '' : space.priceDay}
                                                onChange={(e) => handlePriceChange(space.id, 'priceDay', e.target.value)}
                                                placeholder="N/A"
                                                className="price-input"
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={space.priceWeek === null ? '' : space.priceWeek}
                                                onChange={(e) => handlePriceChange(space.id, 'priceWeek', e.target.value)}
                                                placeholder="N/A"
                                                className="price-input"
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={space.priceMonth === null ? '' : space.priceMonth}
                                                onChange={(e) => handlePriceChange(space.id, 'priceMonth', e.target.value)}
                                                placeholder="N/A"
                                                className="price-input"
                                            />
                                        </td>
                                        <td>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleSavePriceRow(space.id)}>
                                                <i className="bi bi-save"></i> Lưu
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Button variant="secondary" onClick={() => setShowAdvancedPricingModal(true)} className="mt-3">
                            <i className="bi bi-gear"></i> Cài Đặt Giá Nâng Cao (Demo)
                        </Button>
                    </div>
                </Tab>

                <Tab eventKey="offers" title="Quản Lý Ưu Đãi">
                    <div className="tab-content-wrapper">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="tab-section-title mb-0">Danh Sách Ưu Đãi</h2>
                            <Button variant="primary" onClick={() => setShowAddOfferModal(true)}>
                                <i className="bi bi-plus-lg"></i> Thêm Ưu Đãi Mới
                            </Button>
                        </div>

                        {/* Thanh tìm kiếm và bộ lọc (UI mẫu, chưa có logic) */}
                        <Form className="mb-3 p-3 border rounded bg-light">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <InputGroup>
                                        <Form.Control placeholder="Tìm kiếm theo tên hoặc mã ưu đãi" />
                                        <Button variant="outline-secondary"><i className="bi bi-search"></i></Button>
                                    </InputGroup>
                                </div>
                                <div className="col-md-3">
                                    <Form.Select aria-label="Lọc theo trạng thái">
                                        <option>Trạng thái: Tất cả</option>
                                        <option value="active">Hoạt động</option>
                                        <option value="expired">Hết hạn</option>
                                        <option value="paused">Tạm dừng</option>
                                    </Form.Select>
                                </div>
                                <div className="col-md-3">
                                    <Form.Select aria-label="Lọc theo loại ưu đãi">
                                        <option>Loại ưu đãi: Tất cả</option>
                                        <option value="percentage">Giảm giá phần trăm</option>
                                        <option value="fixed">Giảm giá tiền mặt</option>
                                        <option value="free_hours">Miễn phí giờ</option>
                                    </Form.Select>
                                </div>
                                <div className="col-md-2">
                                    <Button variant="outline-secondary" className="w-100">Lọc</Button>
                                </div>
                            </div>
                        </Form>


                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Tên Ưu Đãi</th>
                                    <th>Mã Ưu Đãi</th>
                                    <th>Loại Ưu Đãi</th>
                                    <th>Giá trị</th>
                                    <th>Thời gian áp dụng</th>
                                    <th>Áp dụng cho</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offersData.map(offer => (
                                    <tr key={offer.id}>
                                        <td>{offer.name}</td>
                                        <td>{offer.code}</td>
                                        <td>{offer.type}</td>
                                        <td>{offer.value}</td>
                                        <td>{offer.startDate} - {offer.endDate}</td>
                                        <td>{offer.appliesTo}</td>
                                        <td><span className={`status-badge ${getStatusClass(offer.status)}`}>{offer.status}</span></td>
                                        <td className="actions-cell">
                                            <Button variant="outline-secondary" size="sm" className="me-1 action-icon" title="Sửa">
                                                <i className="bi bi-pencil-fill"></i>
                                            </Button>
                                            <Form.Check
                                                type="switch"
                                                id={`offer-switch-${offer.id}`}
                                                checked={offer.isActive}
                                                onChange={() => toggleOfferStatus(offer.id)}
                                                title={offer.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                                                className="d-inline-block me-1 align-middle"
                                            />
                                            <Button variant="outline-danger" size="sm" className="action-icon" title="Xóa" onClick={() => deleteOffer(offer.id)}>
                                                <i className="bi bi-trash-fill"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Tab>
            </Tabs>

            {/* Modal Thêm Ưu Đãi Mới */}
            <Modal show={showAddOfferModal} onHide={() => setShowAddOfferModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Ưu Đãi Mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="offerName">
                            <Form.Label>Tên Ưu Đãi <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text" name="name" value={newOffer.name} onChange={handleNewOfferChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="offerCode">
                            <Form.Label>Mã Ưu Đãi</Form.Label>
                            <Form.Control type="text" name="code" value={newOffer.code} onChange={handleNewOfferChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="offerType">
                            <Form.Label>Loại Ưu Đãi <span className="text-danger">*</span></Form.Label>
                            <Form.Select name="type" value={newOffer.type} onChange={handleNewOfferChange} required>
                                <option value="Giảm giá phần trăm">Giảm giá phần trăm</option>
                                <option value="Giảm giá tiền mặt">Giảm giá tiền mặt</option>
                                <option value="Miễn phí giờ">Miễn phí giờ</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="offerValue">
                            <Form.Label>Giá trị ưu đãi <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text" name="value" value={newOffer.value} onChange={handleNewOfferChange} placeholder="VD: 15% hoặc 100,000 VND hoặc 2 giờ" required />
                        </Form.Group>
                        <div className="row">
                            <Form.Group as={Form.Col} md="6" className="mb-3" controlId="offerStartDate">
                                <Form.Label>Thời gian bắt đầu <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="date" name="startDate" value={newOffer.startDate} onChange={handleNewOfferChange} required />
                            </Form.Group>
                            <Form.Group as={Form.Col} md="6" className="mb-3" controlId="offerEndDate">
                                <Form.Label>Thời gian kết thúc <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="date" name="endDate" value={newOffer.endDate} onChange={handleNewOfferChange} required />
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-3" controlId="offerAppliesTo">
                            <Form.Label>Áp dụng cho <span className="text-danger">*</span></Form.Label>
                            <div className="checkbox-group">
                                {spaceCategoriesForOffer.map(category => (
                                    <Form.Check
                                        key={category}
                                        type="checkbox"
                                        id={`apply-${category.replace(/\s+/g, '-')}`} // Tạo ID hợp lệ
                                        label={category}
                                        name="appliesTo"
                                        value={category}
                                        checked={newOffer.appliesTo.includes(category)}
                                        onChange={handleNewOfferChange}
                                        className="mb-1"
                                    />
                                ))}
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="offerInitialStatus">
                            <Form.Label>Trạng thái ban đầu</Form.Label>
                            <Form.Select name="initialStatus" value={newOffer.initialStatus} onChange={handleNewOfferChange}>
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Tạm dừng">Tạm dừng</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddOfferModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleAddOffer}>
                        Lưu Ưu Đãi
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Cài Đặt Giá Nâng Cao (Placeholder) */}
            <Modal show={showAdvancedPricingModal} onHide={() => setShowAdvancedPricingModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cài Đặt Giá Nâng Cao</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Các tùy chọn cài đặt giá nâng cao sẽ được hiển thị ở đây, ví dụ:</p>
                    <ul>
                        <li>Giá theo thời điểm (giờ cao điểm, cuối tuần)</li>
                        <li>Giá theo số lượng người</li>
                        <li>Phụ phí dịch vụ</li>
                    </ul>
                    <p>Chức năng này đang được phát triển.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAdvancedPricingModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default PricingAndOffersPage;