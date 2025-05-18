import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo bạn đã cài đặt bootstrap
import './ManageFacilitiesServices.css'; // File CSS tùy chỉnh

// Giả sử bạn có các icon (có thể dùng react-icons hoặc SVG)
// Ví dụ: import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
// Để đơn giản, tôi sẽ dùng ký tự Unicode hoặc text

const ManageFacilitiesServices = () => {
    const [activeTab, setActiveTab] = useState('amenities'); // 'amenities' hoặc 'services'

    // Dữ liệu mẫu
    const [amenities, setAmenities] = useState([
        { id: 'AMN001', name: 'Bàn làm việc cá nhân', type: 'Cơ bản', description: 'Bàn làm việc tiêu chuẩn cho 1 người', status: 'Hoạt động' },
        { id: 'AMN002', name: 'Máy chiếu phòng họp', type: 'Văn phòng', description: 'Máy chiếu full HD, kết nối HDMI', status: 'Bảo trì' },
        { id: 'AMN003', name: 'Khu vực pantry', type: 'Giải trí', description: 'Có trà, cà phê, nước lọc miễn phí', status: 'Hoạt động' },
        { id: 'AMN004', name: 'Ghế công thái học', type: 'Cơ bản', description: 'Ghế hỗ trợ cột sống', status: 'Không hoạt động' },
    ]);

    const [services, setServices] = useState([
        { id: 'SRV001', name: 'In ấn màu A4', type: 'In ấn', description: 'In màu chất lượng cao trên giấy A4', price: '2.000 VND/trang', status: 'Hoạt động' },
        { id: 'SRV002', name: 'Thuê màn hình LCD 24"', type: 'Thuê thiết bị', description: 'Màn hình LCD Dell 24 inch', price: '50.000 VND/ngày', status: 'Hoạt động' },
        { id: 'SRV003', name: 'Dịch vụ lễ tân', type: 'Dịch vụ văn phòng', description: 'Hỗ trợ tiếp khách, nhận thư từ', price: 'Thỏa thuận', status: 'Không hoạt động' },
    ]);

    const handleEdit = (itemType, itemId) => {
        alert(`Chỉnh sửa ${itemType} có ID: ${itemId}`);
        // Logic chỉnh sửa sẽ được thêm ở đây
    };

    const handleDelete = (itemType, itemId) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa ${itemType} này không?`)) {
            alert(`Xóa ${itemType} có ID: ${itemId}`);
            // Logic xóa sẽ được thêm ở đây
            if (itemType === 'tiện nghi') {
                setAmenities(prev => prev.filter(item => item.id !== itemId));
            } else if (itemType === 'dịch vụ') {
                setServices(prev => prev.filter(item => item.id !== itemId));
            }
        }
    };

    const handleChangeStatus = (itemType, itemId, currentStatus) => {
        // Ví dụ đơn giản về thay đổi trạng thái
        let newStatus = '';
        if (itemType === 'tiện nghi') {
            const amenity = amenities.find(a => a.id === itemId);
            if (amenity) {
                // Logic thay đổi trạng thái phức tạp hơn có thể cần modal hoặc danh sách chọn
                // Ví dụ đơn giản: chuyển đổi giữa Hoạt động và Không hoạt động
                newStatus = amenity.status === 'Hoạt động' ? 'Không hoạt động' : (amenity.status === 'Không hoạt động' ? 'Bảo trì' : 'Hoạt động');
                setAmenities(prev => prev.map(item => item.id === itemId ? { ...item, status: newStatus } : item));
                alert(`Đã thay đổi trạng thái của tiện nghi ${itemId} thành ${newStatus}`);
            }
        } else if (itemType === 'dịch vụ') {
            const service = services.find(s => s.id === itemId);
            if (service) {
                newStatus = service.status === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động';
                setServices(prev => prev.map(item => item.id === itemId ? { ...item, status: newStatus } : item));
                alert(`Đã thay đổi trạng thái của dịch vụ ${itemId} thành ${newStatus}`);
            }
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Hoạt động': return 'status-active';
            case 'Bảo trì': return 'status-maintenance';
            case 'Không hoạt động': return 'status-inactive';
            default: return '';
        }
    };

    const renderAmenitiesTab = () => (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <div className="filters d-flex flex-wrap gap-2 mb-2 mb-md-0">
                    <input type="text" className="form-control" placeholder="Tìm kiếm theo tên tiện nghi" style={{ maxWidth: '250px' }} />
                    <select className="form-select" style={{ maxWidth: '200px' }}>
                        <option value="">Tất cả loại tiện nghi</option>
                        <option value="basic">Cơ bản</option>
                        <option value="office">Văn phòng</option>
                        <option value="entertainment">Giải trí</option>
                    </select>
                    <select className="form-select" style={{ maxWidth: '200px' }}>
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="maintenance">Bảo trì</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                </div>
                <button className="btn btn-primary">
                    {/* <FaPlus />  */}
                    + Thêm Tiện Nghi Mới
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID Tiện Nghi</th>
                            <th>Tên Tiện Nghi</th>
                            <th>Loại</th>
                            <th>Mô tả</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {amenities.map(amenity => (
                            <tr key={amenity.id}>
                                <td>{amenity.id}</td>
                                <td>{amenity.name}</td>
                                <td>{amenity.type}</td>
                                <td title={amenity.description} className="description-truncate">{amenity.description}</td>
                                <td><span className={`badge ${getStatusClass(amenity.status)}`}>{amenity.status}</span></td>
                                <td>
                                    <button className="btn btn-sm btn-outline-secondary me-1" title="Sửa" onClick={() => handleEdit('tiện nghi', amenity.id)}>
                                        {/* <FaEdit /> */}
                                        ✏️
                                    </button>
                                    <select
                                        className="form-select form-select-sm d-inline-block me-1"
                                        style={{ width: 'auto' }}
                                        value={amenity.status}
                                        onChange={(e) => handleChangeStatus('tiện nghi', amenity.id, e.target.value)}
                                        title="Thay đổi trạng thái"
                                    >
                                        <option value="Hoạt động">Hoạt động</option>
                                        <option value="Bảo trì">Bảo trì</option>
                                        <option value="Không hoạt động">Không hoạt động</option>
                                    </select>
                                    <button className="btn btn-sm btn-outline-danger" title="Xóa" onClick={() => handleDelete('tiện nghi', amenity.id)}>
                                        {/* <FaTrash /> */}
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderServicesTab = () => (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <div className="filters d-flex flex-wrap gap-2 mb-2 mb-md-0">
                    <input type="text" className="form-control" placeholder="Tìm kiếm theo tên dịch vụ" style={{ maxWidth: '250px' }} />
                    <select className="form-select" style={{ maxWidth: '200px' }}>
                        <option value="">Tất cả loại dịch vụ</option>
                        <option value="printing">In ấn</option>
                        <option value="equipment_rental">Thuê thiết bị</option>
                        <option value="office_service">Dịch vụ văn phòng</option>
                    </select>
                    <select className="form-select" style={{ maxWidth: '200px' }}>
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                </div>
                <button className="btn btn-primary">
                    {/* <FaPlus /> */}
                    + Thêm Dịch Vụ Mới
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID Dịch Vụ</th>
                            <th>Tên Dịch Vụ</th>
                            <th>Loại</th>
                            <th>Mô tả</th>
                            <th>Giá</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => (
                            <tr key={service.id}>
                                <td>{service.id}</td>
                                <td>{service.name}</td>
                                <td>{service.type}</td>
                                <td title={service.description} className="description-truncate">{service.description}</td>
                                <td>{service.price}</td>
                                <td><span className={`badge ${getStatusClass(service.status)}`}>{service.status}</span></td>
                                <td>
                                    <button className="btn btn-sm btn-outline-secondary me-1" title="Sửa" onClick={() => handleEdit('dịch vụ', service.id)}>
                                        {/* <FaEdit /> */}
                                        ✏️
                                    </button>
                                    <select
                                        className="form-select form-select-sm d-inline-block me-1"
                                        style={{ width: 'auto' }}
                                        value={service.status}
                                        onChange={(e) => handleChangeStatus('dịch vụ', service.id, e.target.value)}
                                        title="Thay đổi trạng thái"
                                    >
                                        <option value="Hoạt động">Hoạt động</option>
                                        <option value="Không hoạt động">Không hoạt động</option>
                                    </select>
                                    <button className="btn btn-sm btn-outline-danger" title="Xóa" onClick={() => handleDelete('dịch vụ', service.id)}>
                                        {/* <FaTrash /> */}
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Quản Lý Tiện Nghi & Dịch Vụ</h2>

            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'amenities' ? 'active' : ''}`}
                        onClick={() => setActiveTab('amenities')}
                    >
                        Tiện Nghi
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
                        onClick={() => setActiveTab('services')}
                    >
                        Dịch Vụ
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                {activeTab === 'amenities' && renderAmenitiesTab()}
                {activeTab === 'services' && renderServicesTab()}
            </div>
        </div>
    );
};

export default ManageFacilitiesServices;