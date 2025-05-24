import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageFacilitiesServices.css';

// SỬ DỤNG MOCK API
import {
    getAllMockAmenities,
    deleteMockAmenity, // Sử dụng hàm mock delete
    // updateMockAmenity, // Bạn sẽ cần hàm này cho update status
    // createMockAmenity, // Cho nút "Thêm mới"
    getAllMockServices,
    deleteMockService, // Sử dụng hàm mock delete
    // updateMockService,
    // createMockService,
} from '../services/mockApi'; // Đảm bảo đường dẫn này đúng


const ManageFacilitiesServices = () => {
    const [activeTab, setActiveTab] = useState('amenities');

    // --- State cho Tiện nghi (Amenity) ---
    const [amenities, setAmenities] = useState([]);
    const [loadingAmenities, setLoadingAmenities] = useState(false);
    const [errorAmenities, setErrorAmenities] = useState(null);
    // State cho form thêm/sửa tiện nghi (ví dụ)
    // const [showAmenityModal, setShowAmenityModal] = useState(false);
    // const [currentAmenity, setCurrentAmenity] = useState(null); // null for new, object for edit

    // --- State cho Dịch vụ (Service) ---
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [errorServices, setErrorServices] = useState(null);
    // State cho form thêm/sửa dịch vụ
    // const [showServiceModal, setShowServiceModal] = useState(false);
    // const [currentService, setCurrentService] = useState(null);


    // --- Hàm fetch cho Tiện nghi ---
    const fetchAmenities = useCallback(async () => {
        setLoadingAmenities(true);
        setErrorAmenities(null);
        try {
            const data = await getAllMockAmenities(); // SỬ DỤNG MOCK API
            // Mock data đã có 'type' và 'status' (hoặc bạn có thể thêm vào mockApi.js)
            // Nếu mock data chưa có, bạn có thể thêm giá trị mặc định ở đây:
            const amenitiesWithDefaults = data.map(item => ({
                ...item,
                type: item.type || 'Unclassified', // 'Chưa phân loại' -> 'Unclassified'
                status: item.status || 'Active'     // 'Hoạt động' -> 'Active'
            }));
            setAmenities(amenitiesWithDefaults);
        } catch (error) {
            console.error("Error loading amenities:", error);
            setErrorAmenities("Could not load amenities. Please try again.");
        } finally {
            setLoadingAmenities(false);
        }
    }, []);

    // --- Hàm fetch cho Dịch vụ ---
    const fetchServices = useCallback(async () => {
        setLoadingServices(true);
        setErrorServices(null);
        try {
            const data = await getAllMockServices(); // SỬ DỤNG MOCK API
            // Dữ liệu từ mockServicesData đã có basePrice, unit, isAvailableAdHoc
            const servicesFormatted = data.map(service => {
                let priceString = `${service.basePrice?.toLocaleString('en-US')} VND`; // Mặc định USD
                // Chuyển đổi PriceUnit enum (nếu có trong mock data) thành string
                let unitString = '';
                if (service.unit) { // Giả sử service.unit là string từ enum đã được định nghĩa trong mock data
                    switch (service.unit.toLowerCase()) {
                        case 'perhour': unitString = '/hour'; break;
                        case 'peritem': unitString = '/item'; break;
                        case 'perperson': unitString = '/person'; break;
                        case 'fixed': unitString = ' (Fixed)'; break;
                        case 'perbooking': unitString = '/booking'; break;
                        default: unitString = `/${service.unit}`;
                    }
                }
                priceString += unitString;

                return {
                    id: service.id,
                    name: service.name,
                    type: service.serviceType || 'Unclassified', // Giả sử có serviceType
                    description: service.description,
                    price: priceString,
                    status: service.isAvailableAdHoc ? 'Active' : 'Inactive',
                    raw: service // Giữ lại dữ liệu gốc để thao tác
                };
            });
            setServices(servicesFormatted);
        } catch (error) {
            console.error("Error loading services:", error);
            setErrorServices("Could not load services. Please try again.");
        } finally {
            setLoadingServices(false);
        }
    }, []);


    useEffect(() => {
        if (activeTab === 'amenities') {
            fetchAmenities();
        } else if (activeTab === 'services') {
            fetchServices();
        }
    }, [activeTab, fetchAmenities, fetchServices]);


    const handleEdit = (itemType, itemId) => {
        alert(`Edit ${itemType} with ID: ${itemId}. This feature will be developed later.`);
        // if (itemType === 'amenity') {
        //     const amenityToEdit = amenities.find(a => a.id === itemId);
        //     setCurrentAmenity(amenityToEdit);
        //     setShowAmenityModal(true);
        // } else if (itemType === 'service') {
        //     const serviceToEdit = services.find(s => s.raw.id === itemId); // Dùng raw.id
        //     setCurrentService(serviceToEdit.raw); // Truyền dữ liệu gốc vào modal
        //     setShowServiceModal(true);
        // }
    };

    const handleDelete = async (itemType, itemId) => {
        if (window.confirm(`Are you sure you want to delete this ${itemType}?`)) {
            if (itemType === 'amenity') {
                try {
                    setLoadingAmenities(true); // Optional: show loading during delete
                    await deleteMockAmenity(itemId); // SỬ DỤNG MOCK API
                    alert(`Amenity with ID: ${itemId} has been deleted (mock).`);
                    fetchAmenities(); // Tải lại danh sách
                } catch (error) {
                    console.error(`Error deleting amenity ${itemId}:`, error);
                    alert(`Failed to delete amenity: ${error.message || 'Unknown error'}`);
                    setErrorAmenities(error.message || "Failed to delete amenity.");
                } finally {
                    setLoadingAmenities(false);
                }
            } else if (itemType === 'service') {
                try {
                    setLoadingServices(true);
                    await deleteMockService(itemId); // SỬ DỤNG MOCK API
                    alert(`Service with ID: ${itemId} has been deleted (mock).`);
                    fetchServices(); // Tải lại danh sách
                } catch (error) {
                    console.error(`Error deleting service ${itemId}:`, error);
                    alert(`Failed to delete service: ${error.message || 'Unknown error'}`);
                    setErrorServices(error.message || "Failed to delete service.");
                } finally {
                    setLoadingServices(false);
                }
            }
        }
    };

    const handleChangeStatus = async (itemType, itemId, newStatusValue) => {
        // newStatusValue sẽ là 'Active', 'Maintenance', 'Inactive'
        if (itemType === 'amenity') {
            const amenityToUpdate = amenities.find(a => a.id === itemId);
            if (!amenityToUpdate) return;

            const updatedAmenityData = { ...amenityToUpdate, status: newStatusValue };
            // try {
            //     setLoadingAmenities(true);
            //     await updateMockAmenity(itemId, { status: newStatusValue }); // Giả sử updateMockAmenity chỉ nhận phần thay đổi
            //     alert(`Amenity ${itemId} status changed to ${newStatusValue} (mock).`);
            //     fetchAmenities();
            // } catch (error) {
            //     console.error("Error updating amenity status:", error);
            //     alert("Failed to update amenity status.");
            // } finally {
            //     setLoadingAmenities(false);
            // }
            // Tạm thời chỉ cập nhật UI
            setAmenities(prev => prev.map(item => item.id === itemId ? updatedAmenityData : item));
            alert(`Amenity ${itemId} status (client-side) changed to ${newStatusValue}. API update will be integrated later.`);

        } else if (itemType === 'service') {
            const serviceToUpdate = services.find(s => s.id === itemId);
            if (!serviceToUpdate) return;

            const newApiStatusForService = newStatusValue === 'Active'; // true if 'Active', false otherwise
            // try {
            //     setLoadingServices(true);
            //     await updateMockService(itemId, { isAvailableAdHoc: newApiStatusForService });
            //     alert(`Service ${itemId} status changed to ${newStatusValue} (mock).`);
            //     fetchServices(); // Tải lại để thấy giá trị đã map đúng
            // } catch (error) {
            //     console.error("Error updating service status:", error);
            //     alert("Failed to update service status.");
            // } finally {
            //     setLoadingServices(false);
            // }
            // Tạm thời chỉ cập nhật UI
            setServices(prev =>
                prev.map(item =>
                    item.id === itemId ? { ...item, status: newStatusValue, raw: { ...item.raw, isAvailableAdHoc: newApiStatusForService } } : item
                )
            );
            alert(`Service ${itemId} status (client-side) changed to ${newStatusValue}. API update will be integrated later.`);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Active': return 'status-active';
            case 'Maintenance': return 'status-maintenance';
            case 'Inactive': return 'status-inactive';
            default: return 'status-unknown';
        }
    };

    const renderAmenitiesTab = () => {
        if (loadingAmenities) return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
        if (errorAmenities) return <div className="alert alert-danger" role="alert">{errorAmenities} <button onClick={fetchAmenities} className="btn btn-sm btn-outline-danger ms-2">Try Again</button></div>;

        return (
            <div>
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                    <div className="filters d-flex flex-wrap gap-2 mb-2 mb-md-0">
                        <input type="text" className="form-control" placeholder="Search by amenity name" style={{ maxWidth: '250px' }} />
                        <select className="form-select" style={{ maxWidth: '200px' }}>
                            <option value="">All Amenity Types</option>
                            <option value="basic">Basic</option>
                            <option value="office">Office</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="Unclassified">Unclassified</option>
                        </select>
                        <select className="form-select" style={{ maxWidth: '200px' }}>
                            <option value="">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={() => alert('Add New Amenity feature will be developed later.')}>
                        + Add New Amenity
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Amenity ID</th><th>Amenity Name</th><th>Type</th><th>Description</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {amenities.length === 0 && !loadingAmenities ? (
                                <tr><td colSpan="6" className="text-center">No amenities found.</td></tr>
                            ) : (
                                amenities.map(amenity => (
                                    <tr key={amenity.id}>
                                        <td>{amenity.id.substring(0, 8)}...</td>
                                        <td>{amenity.name}</td>
                                        <td>{amenity.type}</td>
                                        <td title={amenity.description} className="description-truncate">{amenity.description}</td>
                                        <td><span className={`badge ${getStatusClass(amenity.status)}`}>{amenity.status}</span></td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-secondary me-1" title="Edit" onClick={() => handleEdit('amenity', amenity.id)}>✏️</button>
                                            <select
                                                className="form-select form-select-sm d-inline-block me-1"
                                                style={{ width: 'auto' }}
                                                value={amenity.status}
                                                onChange={(e) => handleChangeStatus('amenity', amenity.id, e.target.value)}
                                                title="Change Status"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Maintenance">Maintenance</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                            <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => handleDelete('amenity', amenity.id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderServicesTab = () => {
        if (loadingServices) return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
        if (errorServices) return <div className="alert alert-danger" role="alert">{errorServices} <button onClick={fetchServices} className="btn btn-sm btn-outline-danger ms-2">Try Again</button></div>;

        return (
            <div>
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                    <div className="filters d-flex flex-wrap gap-2 mb-2 mb-md-0">
                        <input type="text" className="form-control" placeholder="Search by service name" style={{ maxWidth: '250px' }} />
                        <select className="form-select" style={{ maxWidth: '200px' }}>
                            <option value="">All Service Types</option>
                            <option value="printing">Printing</option>
                            <option value="equipment_rental">Equipment Rental</option>
                            <option value="office_service">Office Service</option>
                            <option value="Unclassified">Unclassified</option>
                        </select>
                        <select className="form-select" style={{ maxWidth: '200px' }}>
                            <option value="">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={() => alert('Add New Service feature will be developed later.')}>
                        + Add New Service
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Service ID</th><th>Service Name</th><th>Type</th><th>Description</th><th>Price</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.length === 0 && !loadingServices ? (
                                <tr><td colSpan="7" className="text-center">No services found.</td></tr>
                            ) : (
                                services.map(service => (
                                    <tr key={service.id}>
                                        <td>{service.id.substring(0, 8)}...</td>
                                        <td>{service.name}</td>
                                        <td>{service.type}</td>
                                        <td title={service.description} className="description-truncate">{service.description}</td>
                                        <td>{service.price}</td>
                                        <td><span className={`badge ${getStatusClass(service.status)}`}>{service.status}</span></td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-secondary me-1" title="Edit" onClick={() => handleEdit('service', service.id)}>✏️</button>
                                            <select
                                                className="form-select form-select-sm d-inline-block me-1"
                                                style={{ width: 'auto' }}
                                                value={service.status}
                                                onChange={(e) => handleChangeStatus('service', service.id, e.target.value)}
                                                title="Change Status"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                            <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => handleDelete('service', service.id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="container mt-4 manage-facilities-page">
            <h2 className="mb-4 page-title">Manage Facilities & Services</h2>

            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'amenities' ? 'active' : ''}`}
                        onClick={() => setActiveTab('amenities')}
                    >
                        Amenities
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
                        onClick={() => setActiveTab('services')}
                    >
                        Services
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                {activeTab === 'amenities' && renderAmenitiesTab()}
                {activeTab === 'services' && renderServicesTab()}
            </div>

            {/* Ví dụ Modal cho Thêm/Sửa Tiện nghi (bạn sẽ cần phát triển thêm) */}
            {/* {showAmenityModal && (
                <div className="modal fade show d-block" tabIndex="-1"> <div className="modal-dialog modal-dialog-centered"> <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{currentAmenity ? 'Edit Amenity' : 'Add New Amenity'}</h5>
                        <button type="button" className="btn-close" onClick={() => setShowAmenityModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <p>Form to {currentAmenity ? 'edit' : 'add'} amenity (ID: {currentAmenity?.id}) goes here.</p>
                        <input type="text" className="form-control mb-2" placeholder="Amenity Name" defaultValue={currentAmenity?.name || ''} />
                        <textarea className="form-control" placeholder="Description" defaultValue={currentAmenity?.description || ''}></textarea>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowAmenityModal(false)}>Close</button>
                        <button type="button" className="btn btn-primary">Save Changes</button>
                    </div>
                </div></div></div>
            )} */}
        </div>
    );
};

export default ManageFacilitiesServices;