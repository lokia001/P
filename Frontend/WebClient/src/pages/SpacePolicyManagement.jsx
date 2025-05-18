import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SpacePolicyManagement.css'; // File CSS tùy chỉnh

// Dữ liệu mẫu (thay thế bằng API call khi có backend)
const initialSpaceTypesData = [
    {
        id: 'st1',
        name: 'Bàn làm việc cá nhân',
        supportsDailyPrice: true,
        supportsMonthlyPrice: true,
        policies: {
            generalRules: 'Không gây ồn, giữ gìn vệ sinh chung. Sử dụng tai nghe khi nghe nhạc/họp.',
            minBookingTime: 60, // phút
            maxBookingTime: 480, // phút
            minCancellationTime: 2,
            cancellationUnit: 'Giờ', // 'Giờ' hoặc 'Ngày'
            bookingTimeStep: 30, // phút
            hourlyPrice: 50000,
            dailyPrice: 350000,
            monthlyPrice: 5000000,
            surcharges: [
                { id: 'sur1', name: 'In ấn (trang A4)', price: 1000 },
            ],
            refundPolicy: 'Hoàn tiền 100% nếu hủy trước 24 giờ. Hoàn 50% nếu hủy trước 12 giờ. Không hoàn tiền nếu hủy sau 12 giờ.',
            amenities: [
                { id: 'am1', name: 'Wi-Fi tốc độ cao', checked: true, rule: 'Mỗi người 1 tài khoản' },
                { id: 'am2', name: 'Ổ cắm điện', checked: true, rule: '' },
                { id: 'am3', name: 'Nước lọc', checked: false, rule: '' },
                { id: 'am4', name: 'Máy chiếu (chung)', checked: false, rule: 'Đăng ký trước' },
            ],
            services: [
                { id: 'sv1', name: 'Dọn dẹp hàng ngày', checked: true, rule: '' },
                { id: 'sv2', name: 'Hỗ trợ IT', checked: false, rule: 'Trong giờ hành chính' },
            ],
            otherRules: 'Không mang đồ ăn có mùi vào khu vực chung. Vui lòng tắt đèn, thiết bị khi rời đi.',
        },
    },
    {
        id: 'st2',
        name: 'Phòng họp nhỏ (4-6 người)',
        supportsDailyPrice: true,
        supportsMonthlyPrice: false,
        policies: {
            generalRules: 'Yêu cầu đặt trước. Giữ gìn trang thiết bị trong phòng.',
            minBookingTime: 30,
            maxBookingTime: 240,
            minCancellationTime: 1,
            cancellationUnit: 'Ngày',
            bookingTimeStep: 15,
            hourlyPrice: 200000,
            dailyPrice: 1500000,
            monthlyPrice: 0,
            surcharges: [],
            refundPolicy: 'Hoàn tiền 100% nếu hủy trước 2 ngày.',
            amenities: [
                { id: 'am1', name: 'Wi-Fi tốc độ cao', checked: true, rule: '' },
                { id: 'am2', name: 'Bảng trắng & bút', checked: true, rule: '' },
                { id: 'am3', name: 'Máy chiếu', checked: true, rule: '' },
            ],
            services: [],
            otherRules: 'Không hút thuốc trong phòng.',
        },
    },
    {
        id: 'st3',
        name: 'Văn phòng riêng',
        supportsDailyPrice: false,
        supportsMonthlyPrice: true,
        policies: {
            generalRules: 'Tuân thủ hợp đồng thuê.',
            minBookingTime: 0, // Không áp dụng
            maxBookingTime: 0, // Không áp dụng
            minCancellationTime: 30,
            cancellationUnit: 'Ngày',
            bookingTimeStep: 0, // Không áp dụng
            hourlyPrice: 0,
            dailyPrice: 0,
            monthlyPrice: 15000000,
            surcharges: [
                { id: 'sur1', name: 'Phí quản lý', price: 500000 },
            ],
            refundPolicy: 'Theo điều khoản hợp đồng.',
            amenities: [
                { id: 'am1', name: 'Internet cáp quang', checked: true, rule: '' },
                { id: 'am2', name: 'Điều hòa riêng', checked: true, rule: '' },
            ],
            services: [
                { id: 'sv1', name: 'Dọn dẹp 2 lần/tuần', checked: true, rule: '' },
            ],
            otherRules: 'Có thể decor theo ý muốn (cần thông báo).',
        },
    },
];

const SpacePolicyManagement = () => {
    const [spaceTypes, setSpaceTypes] = useState(initialSpaceTypesData);
    const [selectedSpaceTypeId, setSelectedSpaceTypeId] = useState(initialSpaceTypesData[0]?.id || null);
    const [currentPolicies, setCurrentPolicies] = useState({});
    const [originalPolicies, setOriginalPolicies] = useState({});
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        if (selectedSpaceTypeId) {
            const selectedSpace = spaceTypes.find(st => st.id === selectedSpaceTypeId);
            if (selectedSpace) {
                // Deep copy để tránh thay đổi state gốc khi chỉnh sửa
                const policiesCopy = JSON.parse(JSON.stringify(selectedSpace.policies));
                setCurrentPolicies(policiesCopy);
                setOriginalPolicies(JSON.parse(JSON.stringify(selectedSpace.policies))); // Lưu bản gốc để hoàn tác
            }
        } else {
            setCurrentPolicies({});
            setOriginalPolicies({});
        }
    }, [selectedSpaceTypeId, spaceTypes]);

    const handleSelectSpaceType = (id) => {
        setSelectedSpaceTypeId(id);
        setActiveTab('general'); // Reset về tab đầu tiên khi đổi loại không gian
    };

    const handleChange = (e, section, field, index = null, subField = null) => {
        const { value, type, checked } = e.target;
        setCurrentPolicies(prev => {
            const newPolicies = { ...prev };
            if (section === 'surcharges') {
                newPolicies.surcharges[index][field] = type === 'number' ? parseFloat(value) : value;
            } else if (section === 'amenities' || section === 'services') {
                if (subField === 'checked') {
                    newPolicies[section][index].checked = checked;
                } else if (subField === 'rule') {
                    newPolicies[section][index].rule = value;
                } else { // For name, if editable in future
                    newPolicies[section][index][field] = value;
                }
            } else {
                newPolicies[field] = type === 'number' ? parseFloat(value) : (type === 'checkbox' ? checked : value);
            }
            return newPolicies;
        });
    };

    const handleAddSurcharge = () => {
        setCurrentPolicies(prev => ({
            ...prev,
            surcharges: [...(prev.surcharges || []), { id: `newSur${Date.now()}`, name: '', price: 0 }]
        }));
    };

    const handleRemoveSurcharge = (index) => {
        setCurrentPolicies(prev => ({
            ...prev,
            surcharges: prev.surcharges.filter((_, i) => i !== index)
        }));
    };

    // Hàm thêm tiện nghi/dịch vụ (ví dụ)
    // const handleAddAmenity = () => {
    //     setCurrentPolicies(prev => ({
    //         ...prev,
    //         amenities: [...(prev.amenities || []), { id: `newAm${Date.now()}`, name: 'Tiện nghi mới', checked: false, rule: '' }]
    //     }));
    // };

    const handleSaveChanges = () => {
        // TODO: Gửi currentPolicies lên backend
        console.log("Đang lưu:", currentPolicies);
        // Cập nhật lại spaceTypes state (giả lập lưu thành công)
        setSpaceTypes(prevSpaceTypes =>
            prevSpaceTypes.map(st =>
                st.id === selectedSpaceTypeId ? { ...st, policies: JSON.parse(JSON.stringify(currentPolicies)) } : st
            )
        );
        setOriginalPolicies(JSON.parse(JSON.stringify(currentPolicies))); // Cập nhật bản gốc sau khi lưu
        alert('Đã lưu thay đổi!');
    };

    const handleUndoChanges = () => {
        setCurrentPolicies(JSON.parse(JSON.stringify(originalPolicies)));
        alert('Đã hoàn tác các thay đổi chưa lưu!');
    };

    // const handleAddSpaceType = () => {
    //     const newName = prompt("Nhập tên loại không gian mới:");
    //     if (newName) {
    //         const newSpaceType = {
    //             id: `st${Date.now()}`,
    //             name: newName,
    //             supportsDailyPrice: false,
    //             supportsMonthlyPrice: false,
    //             policies: { // Chính sách mặc định cho loại không gian mới
    //                 generalRules: '',
    //                 minBookingTime: 60, maxBookingTime: 240, minCancellationTime: 1, cancellationUnit: 'Giờ', bookingTimeStep: 30,
    //                 hourlyPrice: 0, dailyPrice: 0, monthlyPrice: 0,
    //                 surcharges: [], refundPolicy: '',
    //                 amenities: [], services: [], otherRules: ''
    //             }
    //         };
    //         setSpaceTypes(prev => [...prev, newSpaceType]);
    //         setSelectedSpaceTypeId(newSpaceType.id);
    //     }
    // };


    const selectedSpace = spaceTypes.find(st => st.id === selectedSpaceTypeId);

    if (!selectedSpace) {
        return <div className="container mt-3">Đang tải hoặc không có loại không gian nào...</div>;
    }

    return (
        <div className="container-fluid mt-3 space-policy-manager">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 sidebar">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Các Loại Không Gian</h5>
                        {/* <button className="btn btn-sm btn-outline-primary" onClick={handleAddSpaceType}>+</button> */}
                    </div>
                    <ul className="list-group">
                        {spaceTypes.map(st => (
                            <li
                                key={st.id}
                                className={`list-group-item list-group-item-action ${selectedSpaceTypeId === st.id ? 'active' : ''}`}
                                onClick={() => handleSelectSpaceType(st.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {st.name}
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-primary w-100 mt-3">Thêm Loại Không Gian</button>
                </div>

                {/* Content Area */}
                <div className="col-md-9 content-area">
                    <h4>Chỉnh sửa Policy cho: <span className="text-primary">{selectedSpace.name}</span></h4>
                    <hr />

                    <ul className="nav nav-tabs mb-3">
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>Quy Tắc Chung</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'booking' ? 'active' : ''}`} onClick={() => setActiveTab('booking')}>Thời Gian & Đặt Chỗ</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'pricing' ? 'active' : ''}`} onClick={() => setActiveTab('pricing')}>Giá & Thanh Toán</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'amenities' ? 'active' : ''}`} onClick={() => setActiveTab('amenities')}>Tiện Nghi & Dịch Vụ</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'other' ? 'active' : ''}`} onClick={() => setActiveTab('other')}>Quy Định Khác</button>
                        </li>
                    </ul>

                    <div className="tab-content">
                        {/* Tab Quy Tắc Chung */}
                        {activeTab === 'general' && (
                            <div className="tab-pane fade show active">
                                <div className="mb-3">
                                    <label htmlFor="generalRules" className="form-label">Mô tả Quy Tắc Chung</label>
                                    <textarea
                                        className="form-control"
                                        id="generalRules"
                                        rows="5"
                                        value={currentPolicies.generalRules || ''}
                                        onChange={(e) => handleChange(e, null, 'generalRules')}
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* Tab Thời Gian và Đặt Chỗ */}
                        {activeTab === 'booking' && (
                            <div className="tab-pane fade show active">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="minBookingTime" className="form-label">Thời gian đặt tối thiểu (phút)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="minBookingTime"
                                            value={currentPolicies.minBookingTime || ''}
                                            onChange={(e) => handleChange(e, null, 'minBookingTime')}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="maxBookingTime" className="form-label">Thời gian đặt tối đa (phút)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="maxBookingTime"
                                            value={currentPolicies.maxBookingTime || ''}
                                            onChange={(e) => handleChange(e, null, 'maxBookingTime')}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="minCancellationTime" className="form-label">Thời gian hủy đặt trước tối thiểu</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="minCancellationTime"
                                                value={currentPolicies.minCancellationTime || ''}
                                                onChange={(e) => handleChange(e, null, 'minCancellationTime')}
                                            />
                                            <select
                                                className="form-select"
                                                value={currentPolicies.cancellationUnit || 'Giờ'}
                                                onChange={(e) => handleChange(e, null, 'cancellationUnit')}
                                            >
                                                <option value="Giờ">Giờ</option>
                                                <option value="Ngày">Ngày</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="bookingTimeStep" className="form-label">Bước thời gian đặt</label>
                                        <select
                                            className="form-select"
                                            id="bookingTimeStep"
                                            value={currentPolicies.bookingTimeStep || 30}
                                            onChange={(e) => handleChange(e, null, 'bookingTimeStep')}
                                        >
                                            <option value="15">15 phút</option>
                                            <option value="30">30 phút</option>
                                            <option value="60">60 phút</option>
                                            <option value="120">120 phút</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Giá và Thanh Toán */}
                        {activeTab === 'pricing' && (
                            <div className="tab-pane fade show active">
                                <div className="row g-3 mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor="hourlyPrice" className="form-label">Giá theo giờ (VND)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="hourlyPrice"
                                            value={currentPolicies.hourlyPrice || ''}
                                            onChange={(e) => handleChange(e, null, 'hourlyPrice')}
                                        />
                                    </div>
                                    {selectedSpace.supportsDailyPrice && (
                                        <div className="col-md-4">
                                            <label htmlFor="dailyPrice" className="form-label">Giá theo ngày (VND)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="dailyPrice"
                                                value={currentPolicies.dailyPrice || ''}
                                                onChange={(e) => handleChange(e, null, 'dailyPrice')}
                                            />
                                        </div>
                                    )}
                                    {selectedSpace.supportsMonthlyPrice && (
                                        <div className="col-md-4">
                                            <label htmlFor="monthlyPrice" className="form-label">Giá theo tháng (VND)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="monthlyPrice"
                                                value={currentPolicies.monthlyPrice || ''}
                                                onChange={(e) => handleChange(e, null, 'monthlyPrice')}
                                            />
                                        </div>
                                    )}
                                </div>

                                <h5 className="mt-4">Phụ phí</h5>
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Tên Phụ Phí</th>
                                            <th>Giá (VND)</th>
                                            <th style={{ width: "10%" }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(currentPolicies.surcharges || []).map((surcharge, index) => (
                                            <tr key={surcharge.id || index}>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={surcharge.name}
                                                        onChange={(e) => handleChange(e, 'surcharges', 'name', index)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        value={surcharge.price}
                                                        onChange={(e) => handleChange(e, 'surcharges', 'price', index)}
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleRemoveSurcharge(index)}
                                                    >Xóa</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button className="btn btn-sm btn-outline-success mb-3" onClick={handleAddSurcharge}>Thêm Phụ Phí</button>

                                <div className="mb-3">
                                    <label htmlFor="refundPolicy" className="form-label">Chính sách hoàn tiền</label>
                                    <textarea
                                        className="form-control"
                                        id="refundPolicy"
                                        rows="3"
                                        value={currentPolicies.refundPolicy || ''}
                                        onChange={(e) => handleChange(e, null, 'refundPolicy')}
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* Tab Tiện Nghi và Dịch Vụ */}
                        {activeTab === 'amenities' && (
                            <div className="tab-pane fade show active">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h5>Tiện Nghi Có Sẵn</h5>
                                        {/* <button className="btn btn-sm btn-outline-primary mb-2" onClick={handleAddAmenity}>Thêm tiện nghi</button> */}
                                        {(currentPolicies.amenities || []).map((amenity, index) => (
                                            <div key={amenity.id || index} className="mb-2 p-2 border rounded">
                                                <div className="form-check mb-1">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`amenity-${amenity.id}`}
                                                        checked={amenity.checked}
                                                        onChange={(e) => handleChange(e, 'amenities', null, index, 'checked')}
                                                    />
                                                    <label className="form-check-label" htmlFor={`amenity-${amenity.id}`}>
                                                        {amenity.name}
                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Quy định sử dụng (nếu có)"
                                                    value={amenity.rule || ''}
                                                    onChange={(e) => handleChange(e, 'amenities', null, index, 'rule')}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-md-6">
                                        <h5>Dịch Vụ Có Sẵn</h5>
                                        {/* <button className="btn btn-sm btn-outline-primary mb-2">Thêm dịch vụ</button> */}
                                        {(currentPolicies.services || []).map((service, index) => (
                                            <div key={service.id || index} className="mb-2 p-2 border rounded">
                                                <div className="form-check mb-1">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`service-${service.id}`}
                                                        checked={service.checked}
                                                        onChange={(e) => handleChange(e, 'services', null, index, 'checked')}
                                                    />
                                                    <label className="form-check-label" htmlFor={`service-${service.id}`}>
                                                        {service.name}
                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Quy định sử dụng (nếu có)"
                                                    value={service.rule || ''}
                                                    onChange={(e) => handleChange(e, 'services', null, index, 'rule')}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Quy Định Khác */}
                        {activeTab === 'other' && (
                            <div className="tab-pane fade show active">
                                <div className="mb-3">
                                    <label htmlFor="otherRules" className="form-label">Các Quy Định Đặc Biệt Khác</label>
                                    <textarea
                                        className="form-control"
                                        id="otherRules"
                                        rows="5"
                                        value={currentPolicies.otherRules || ''}
                                        onChange={(e) => handleChange(e, null, 'otherRules')}
                                    ></textarea>
                                </div>
                            </div>
                        )}
                    </div>

                    <hr />
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-secondary me-2" onClick={handleUndoChanges}>Hoàn Tác</button>
                        <button className="btn btn-primary" onClick={handleSaveChanges}>Lưu Thay Đổi</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpacePolicyManagement;