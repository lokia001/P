import React, { useState, useEffect } from 'react';
import './ProfilePage.css'; // File CSS tùy chỉnh (giữ nguyên từ trước)

// Giả định các icon được import hoặc có sẵn qua CDN
const PencilIcon = () => <i className="bi bi-pencil-fill"></i>;
const UploadIcon = () => <i className="bi bi-upload"></i>;
const LockIcon = () => <i className="bi bi-lock-fill"></i>;
const ManageIcon = () => <i className="bi bi-gear-fill"></i>; // Icon cho nút Quản lý

// Helper function để che một phần số tài khoản
const maskAccountNumber = (number) => {
    if (!number || number.length < 4) return number;
    return `**** **** **** ${number.slice(-4)}`;
};

const ProfilePage = () => {
    // Dữ liệu người dùng ban đầu (mock) - mở rộng với thông tin owner
    const [userData, setUserData] = useState({
        // Thông tin cá nhân
        avatarUrl: 'https://via.placeholder.com/150/007bff/FFFFFF?Text=Avatar',
        fullName: 'Nguyễn Văn Example',
        role: 'Chủ sở hữu', // Quan trọng để có thể hiển thị các section của Owner
        email: 'nguyenvan.example@email.com',
        phoneNumber: '0987654321',
        username: 'nguyenvan_example',

        // Thông tin Working Space (cho Owner)
        workingSpaceInfo: {
            name: 'The Cozy Corner Coworking',
            address: '123 Đường ABC, Quận 1, TP. HCM',
            contactNumber: '02838123456',
            contactEmail: 'contact@cozycorner.vn',
        },

        // Cài đặt thanh toán (cho Owner)
        paymentSettings: {
            paymentMethods: [
                { id: 'bank_transfer', name: 'Chuyển khoản ngân hàng', details: 'VCB - STK: ...1234' },
                { id: 'momo', name: 'Ví MoMo', details: 'Đã liên kết - 098xxxx321' },
            ],
            bankAccount: {
                accountName: 'THE COZY CORNER COWORKING',
                accountNumber: '0011009876543',
                bankName: 'Vietcombank',
                branch: 'Chi nhánh TP. HCM',
            },
        },

        // Cài đặt thông báo chung (cho Owner)
        notificationSettings: {
            newBooking: true,
            bookingCancellation: true,
            paymentSuccess: false,
            lowSupplyAlert: true, // Ví dụ thêm
        },
    });

    // State để lưu trữ dữ liệu đang được chỉnh sửa
    const [editableData, setEditableData] = useState({ ...userData });

    // States cho việc bật/tắt chế độ chỉnh sửa cho từng trường
    const [isEditingFullName, setIsEditingFullName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPhoneNumber, setIsEditingPhoneNumber] = useState(false);

    // States cho chỉnh sửa thông tin Working Space
    const [isEditingWsName, setIsEditingWsName] = useState(false);
    const [isEditingWsAddress, setIsEditingWsAddress] = useState(false);
    const [isEditingWsContactNumber, setIsEditingWsContactNumber] = useState(false);
    const [isEditingWsContactEmail, setIsEditingWsContactEmail] = useState(false);

    // States cho chỉnh sửa thông tin tài khoản ngân hàng
    const [isEditingBankAccount, setIsEditingBankAccount] = useState(false);


    // State cho form đổi mật khẩu
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    // State cho việc chọn và xem trước ảnh đại diện
    const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(userData.avatarUrl);

    // Cập nhật editableData và avatarPreview khi userData thay đổi
    useEffect(() => {
        setEditableData(JSON.parse(JSON.stringify(userData))); // Deep copy
        setAvatarPreview(userData.avatarUrl);
    }, [userData]);

    // Xử lý thay đổi input chung
    const handleInputChange = (e, section = null) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        if (section) {
            setEditableData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [name]: val,
                },
            }));
        } else {
            setEditableData(prev => ({ ...prev, [name]: val }));
        }
    };

    // Xử lý thay đổi input cho form mật khẩu
    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý khi người dùng chọn ảnh đại diện mới
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Xử lý submit form thông tin chung và các section khác
    const handleSubmitAllChanges = (e) => {
        e.preventDefault();
        console.log('Đang lưu tất cả thông tin:', editableData);
        if (selectedAvatarFile) {
            console.log('Ảnh đại diện mới được chọn:', selectedAvatarFile.name);
            // Logic tải ảnh lên server...
        }

        // Cập nhật lại userData (giả lập dữ liệu từ backend đã được cập nhật)
        setUserData(prev => ({
            ...prev,
            // Thông tin cá nhân
            fullName: editableData.fullName,
            email: editableData.email,
            phoneNumber: editableData.phoneNumber,
            avatarUrl: selectedAvatarFile ? avatarPreview : prev.avatarUrl,
            // Thông tin Working Space
            workingSpaceInfo: { ...editableData.workingSpaceInfo },
            // Cài đặt thanh toán (chỉ bankAccount có thể sửa trực tiếp ở đây)
            paymentSettings: {
                ...prev.paymentSettings, // Giữ nguyên paymentMethods
                bankAccount: { ...editableData.paymentSettings.bankAccount }
            },
            // Cài đặt thông báo
            notificationSettings: { ...editableData.notificationSettings }
        }));

        // Reset trạng thái chỉnh sửa
        setIsEditingFullName(false);
        setIsEditingEmail(false);
        setIsEditingPhoneNumber(false);
        setIsEditingWsName(false);
        setIsEditingWsAddress(false);
        setIsEditingWsContactNumber(false);
        setIsEditingWsContactEmail(false);
        setIsEditingBankAccount(false);

        alert('Thông tin đã được cập nhật!');
    };

    // Xử lý submit form đổi mật khẩu
    const handleSubmitPasswordChange = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }
        console.log('Đang đổi mật khẩu với dữ liệu:', passwordData);
        alert('Mật khẩu đã được thay đổi thành công!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setShowChangePasswordForm(false);
    };

    const handleManagePaymentMethods = () => {
        // Đây là nơi để mở Modal hoặc điều hướng đến trang quản lý chi tiết
        console.log("Mở giao diện quản lý phương thức thanh toán...");
        alert("Chức năng quản lý phương thức thanh toán sẽ được phát triển sau.");
    };

    // Chỉ hiển thị các section của Owner nếu vai trò là "Chủ sở hữu"
    const isOwner = userData.role === 'Chủ sở hữu';

    return (
        <div className="container mt-4 mb-5 profile-page">
            <h2 className="mb-4 text-primary">Hồ Sơ Cá Nhân</h2>

            {/* Form chung cho các thông tin có thể chỉnh sửa */}
            <form onSubmit={handleSubmitAllChanges}>
                {/* Section: Thông Tin Chung */}
                <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">Thông Tin Chung</h5>
                    </div>
                    <div className="card-body">
                        {/* Ảnh đại diện */}
                        <div className="mb-4 row align-items-center">
                            <label className="col-sm-3 col-form-label fw-medium">Ảnh đại diện:</label>
                            <div className="col-sm-9">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar"
                                        className="avatar-preview me-3 img-thumbnail"
                                    />
                                    <input
                                        type="file"
                                        id="avatarUpload"
                                        className="d-none"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                    <label htmlFor="avatarUpload" className="btn btn-sm btn-outline-primary">
                                        <UploadIcon /> Đổi ảnh
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Tên đầy đủ */}
                        <div className="mb-3 row">
                            <label htmlFor="fullName" className="col-sm-3 col-form-label fw-medium">Tên đầy đủ:</label>
                            <div className="col-sm-9 d-flex align-items-center">
                                {isEditingFullName ? (
                                    <input
                                        type="text"
                                        className="form-control form-control-sm me-2 flex-grow-1"
                                        id="fullName"
                                        name="fullName"
                                        value={editableData.fullName}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <span className="form-control-plaintext me-2 flex-grow-1">{editableData.fullName}</span>
                                )}
                                <button
                                    type="button"
                                    className={`btn btn-sm ${isEditingFullName ? 'btn-outline-success' : 'btn-outline-secondary'}`}
                                    onClick={() => setIsEditingFullName(!isEditingFullName)}
                                >
                                    {isEditingFullName ? 'Xong' : <PencilIcon />}
                                </button>
                            </div>
                        </div>

                        {/* Vai trò */}
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label fw-medium">Vai trò:</label>
                            <div className="col-sm-9">
                                <p className="form-control-plaintext">{userData.role}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Thông Tin Liên Hệ */}
                <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">Thông Tin Liên Hệ</h5>
                    </div>
                    <div className="card-body">
                        {/* Email */}
                        <div className="mb-3 row">
                            <label htmlFor="email" className="col-sm-3 col-form-label fw-medium">Email:</label>
                            <div className="col-sm-9 d-flex align-items-center">
                                {isEditingEmail ? (
                                    <input
                                        type="email"
                                        className="form-control form-control-sm me-2 flex-grow-1"
                                        id="email"
                                        name="email"
                                        value={editableData.email}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <span className="form-control-plaintext me-2 flex-grow-1">{editableData.email}</span>
                                )}
                                <button
                                    type="button"
                                    className={`btn btn-sm ${isEditingEmail ? 'btn-outline-success' : 'btn-outline-secondary'}`}
                                    onClick={() => setIsEditingEmail(!isEditingEmail)}
                                >
                                    {isEditingEmail ? 'Xong' : <PencilIcon />}
                                </button>
                            </div>
                        </div>

                        {/* Số điện thoại */}
                        <div className="mb-3 row">
                            <label htmlFor="phoneNumber" className="col-sm-3 col-form-label fw-medium">Số điện thoại:</label>
                            <div className="col-sm-9 d-flex align-items-center">
                                {isEditingPhoneNumber ? (
                                    <input
                                        type="tel"
                                        className="form-control form-control-sm me-2 flex-grow-1"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={editableData.phoneNumber}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <span className="form-control-plaintext me-2 flex-grow-1">{editableData.phoneNumber || 'Chưa cập nhật'}</span>
                                )}
                                <button
                                    type="button"
                                    className={`btn btn-sm ${isEditingPhoneNumber ? 'btn-outline-success' : 'btn-outline-secondary'}`}
                                    onClick={() => setIsEditingPhoneNumber(!isEditingPhoneNumber)}
                                >
                                    {isEditingPhoneNumber ? 'Xong' : <PencilIcon />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Thông Tin Tài Khoản */}
                <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">Thông Tin Tài Khoản</h5>
                    </div>
                    <div className="card-body">
                        {/* Tên đăng nhập */}
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label fw-medium">Tên đăng nhập:</label>
                            <div className="col-sm-9">
                                <p className="form-control-plaintext">{userData.username}</p>
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label fw-medium">Mật khẩu:</label>
                            <div className="col-sm-9 d-flex align-items-center">
                                <span className="form-control-plaintext me-2 flex-grow-1">**********</span>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
                                >
                                    <LockIcon /> Đổi mật khẩu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= SECTIONS CHO OWNER ================= */}
                {isOwner && (
                    <>
                        {/* Section: Thông Tin Working Space */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="mb-0">Thông Tin Working Space</h5>
                            </div>
                            <div className="card-body">
                                {/* Tên Working Space */}
                                <div className="mb-3 row">
                                    <label htmlFor="wsName" className="col-sm-3 col-form-label fw-medium">Tên Working Space:</label>
                                    <div className="col-sm-9 d-flex align-items-center">
                                        {isEditingWsName ? (
                                            <input type="text" className="form-control form-control-sm me-2 flex-grow-1" id="wsName" name="name" value={editableData.workingSpaceInfo.name} onChange={(e) => handleInputChange(e, 'workingSpaceInfo')} />
                                        ) : (<span className="form-control-plaintext me-2 flex-grow-1">{editableData.workingSpaceInfo.name}</span>)}
                                        <button type="button" className={`btn btn-sm ${isEditingWsName ? 'btn-outline-success' : 'btn-outline-secondary'}`} onClick={() => setIsEditingWsName(!isEditingWsName)}>
                                            {isEditingWsName ? 'Xong' : <PencilIcon />}
                                        </button>
                                    </div>
                                </div>
                                {/* Địa chỉ */}
                                <div className="mb-3 row">
                                    <label htmlFor="wsAddress" className="col-sm-3 col-form-label fw-medium">Địa chỉ:</label>
                                    <div className="col-sm-9 d-flex align-items-center">
                                        {isEditingWsAddress ? (
                                            <input type="text" className="form-control form-control-sm me-2 flex-grow-1" id="wsAddress" name="address" value={editableData.workingSpaceInfo.address} onChange={(e) => handleInputChange(e, 'workingSpaceInfo')} />
                                        ) : (<span className="form-control-plaintext me-2 flex-grow-1">{editableData.workingSpaceInfo.address}</span>)}
                                        <button type="button" className={`btn btn-sm ${isEditingWsAddress ? 'btn-outline-success' : 'btn-outline-secondary'}`} onClick={() => setIsEditingWsAddress(!isEditingWsAddress)}>
                                            {isEditingWsAddress ? 'Xong' : <PencilIcon />}
                                        </button>
                                    </div>
                                </div>
                                {/* Số điện thoại Working Space */}
                                <div className="mb-3 row">
                                    <label htmlFor="wsContactNumber" className="col-sm-3 col-form-label fw-medium">SĐT Working Space:</label>
                                    <div className="col-sm-9 d-flex align-items-center">
                                        {isEditingWsContactNumber ? (
                                            <input type="tel" className="form-control form-control-sm me-2 flex-grow-1" id="wsContactNumber" name="contactNumber" value={editableData.workingSpaceInfo.contactNumber} onChange={(e) => handleInputChange(e, 'workingSpaceInfo')} />
                                        ) : (<span className="form-control-plaintext me-2 flex-grow-1">{editableData.workingSpaceInfo.contactNumber}</span>)}
                                        <button type="button" className={`btn btn-sm ${isEditingWsContactNumber ? 'btn-outline-success' : 'btn-outline-secondary'}`} onClick={() => setIsEditingWsContactNumber(!isEditingWsContactNumber)}>
                                            {isEditingWsContactNumber ? 'Xong' : <PencilIcon />}
                                        </button>
                                    </div>
                                </div>
                                {/* Email Working Space */}
                                <div className="mb-3 row">
                                    <label htmlFor="wsContactEmail" className="col-sm-3 col-form-label fw-medium">Email Working Space:</label>
                                    <div className="col-sm-9 d-flex align-items-center">
                                        {isEditingWsContactEmail ? (
                                            <input type="email" className="form-control form-control-sm me-2 flex-grow-1" id="wsContactEmail" name="contactEmail" value={editableData.workingSpaceInfo.contactEmail} onChange={(e) => handleInputChange(e, 'workingSpaceInfo')} />
                                        ) : (<span className="form-control-plaintext me-2 flex-grow-1">{editableData.workingSpaceInfo.contactEmail}</span>)}
                                        <button type="button" className={`btn btn-sm ${isEditingWsContactEmail ? 'btn-outline-success' : 'btn-outline-secondary'}`} onClick={() => setIsEditingWsContactEmail(!isEditingWsContactEmail)}>
                                            {isEditingWsContactEmail ? 'Xong' : <PencilIcon />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Cài Đặt Thanh Toán */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="mb-0">Cài Đặt Thanh Toán</h5>
                            </div>
                            <div className="card-body">
                                {/* Phương thức thanh toán */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="fw-medium">Phương thức thanh toán được chấp nhận:</h6>
                                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleManagePaymentMethods}>
                                            <ManageIcon /> Quản lý
                                        </button>
                                    </div>
                                    {editableData.paymentSettings.paymentMethods.length > 0 ? (
                                        <ul className="list-group list-group-flush">
                                            {editableData.paymentSettings.paymentMethods.map(method => (
                                                <li key={method.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                                    <span>{method.name}</span>
                                                    <small className="text-muted">{method.details}</small>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted">Chưa có phương thức thanh toán nào được cấu hình.</p>
                                    )}
                                </div>
                                <hr />
                                {/* Thông tin tài khoản ngân hàng */}
                                <h6 className="fw-medium mb-3">Thông tin tài khoản ngân hàng nhận thanh toán:</h6>
                                {isEditingBankAccount ? (
                                    <>
                                        <div className="mb-3 row">
                                            <label htmlFor="bankAccountName" className="col-sm-4 col-form-label">Tên tài khoản:</label>
                                            <div className="col-sm-8">
                                                <input type="text" className="form-control form-control-sm" id="bankAccountName" name="accountName" value={editableData.paymentSettings.bankAccount.accountName} onChange={(e) => handleInputChange(e, 'paymentSettings.bankAccount')} />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label htmlFor="bankAccountNumber" className="col-sm-4 col-form-label">Số tài khoản:</label>
                                            <div className="col-sm-8">
                                                <input type="text" className="form-control form-control-sm" id="bankAccountNumber" name="accountNumber" value={editableData.paymentSettings.bankAccount.accountNumber} onChange={(e) => handleInputChange(e, 'paymentSettings.bankAccount')} />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label htmlFor="bankName" className="col-sm-4 col-form-label">Tên ngân hàng:</label>
                                            <div className="col-sm-8">
                                                <input type="text" className="form-control form-control-sm" id="bankName" name="bankName" value={editableData.paymentSettings.bankAccount.bankName} onChange={(e) => handleInputChange(e, 'paymentSettings.bankAccount')} />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label htmlFor="bankBranch" className="col-sm-4 col-form-label">Chi nhánh:</label>
                                            <div className="col-sm-8">
                                                <input type="text" className="form-control form-control-sm" id="bankBranch" name="branch" value={editableData.paymentSettings.bankAccount.branch} onChange={(e) => handleInputChange(e, 'paymentSettings.bankAccount')} />
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <button type="button" className="btn btn-sm btn-outline-success" onClick={() => setIsEditingBankAccount(false)}>
                                                Xong
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-2 row">
                                            <span className="col-sm-4 fw-normal">Tên tài khoản:</span>
                                            <span className="col-sm-8 text-muted">{editableData.paymentSettings.bankAccount.accountName}</span>
                                        </div>
                                        <div className="mb-2 row">
                                            <span className="col-sm-4 fw-normal">Số tài khoản:</span>
                                            <span className="col-sm-8 text-muted">{maskAccountNumber(editableData.paymentSettings.bankAccount.accountNumber)}</span>
                                        </div>
                                        <div className="mb-2 row">
                                            <span className="col-sm-4 fw-normal">Tên ngân hàng:</span>
                                            <span className="col-sm-8 text-muted">{editableData.paymentSettings.bankAccount.bankName}</span>
                                        </div>
                                        <div className="mb-2 row">
                                            <span className="col-sm-4 fw-normal">Chi nhánh:</span>
                                            <span className="col-sm-8 text-muted">{editableData.paymentSettings.bankAccount.branch}</span>
                                        </div>
                                        <div className="text-end">
                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setIsEditingBankAccount(true)}>
                                                <PencilIcon /> Sửa
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Section: Cài Đặt Thông Báo Chung */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="mb-0">Cài Đặt Thông Báo Chung</h5>
                            </div>
                            <div className="card-body">
                                <div className="form-check form-switch mb-2">
                                    <input className="form-check-input" type="checkbox" role="switch" id="notifyNewBooking" name="newBooking" checked={editableData.notificationSettings.newBooking} onChange={(e) => handleInputChange(e, 'notificationSettings')} />
                                    <label className="form-check-label" htmlFor="notifyNewBooking">Thông báo khi có đặt chỗ mới</label>
                                </div>
                                <div className="form-check form-switch mb-2">
                                    <input className="form-check-input" type="checkbox" role="switch" id="notifyBookingCancellation" name="bookingCancellation" checked={editableData.notificationSettings.bookingCancellation} onChange={(e) => handleInputChange(e, 'notificationSettings')} />
                                    <label className="form-check-label" htmlFor="notifyBookingCancellation">Thông báo khi hủy đặt chỗ</label>
                                </div>
                                <div className="form-check form-switch mb-2">
                                    <input className="form-check-input" type="checkbox" role="switch" id="notifyPaymentSuccess" name="paymentSuccess" checked={editableData.notificationSettings.paymentSuccess} onChange={(e) => handleInputChange(e, 'notificationSettings')} />
                                    <label className="form-check-label" htmlFor="notifyPaymentSuccess">Thông báo khi thanh toán thành công</label>
                                </div>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id="notifyLowSupply" name="lowSupplyAlert" checked={editableData.notificationSettings.lowSupplyAlert} onChange={(e) => handleInputChange(e, 'notificationSettings')} />
                                    <label className="form-check-label" htmlFor="notifyLowSupply">Cảnh báo khi vật tư sắp hết (cho quản lý)</label>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {/* ================= END SECTIONS CHO OWNER ================= */}

                {/* Nút Lưu Thay Đổi chung */}
                <div className="text-end mb-4">
                    <button type="submit" className="btn btn-primary btn-lg">
                        Lưu Tất Cả Thay Đổi
                    </button>
                </div>
            </form>

            {/* Section: Đổi Mật Khẩu (ẩn/hiện) - Không nằm trong form chung */}
            {showChangePasswordForm && (
                <div className="card mb-4 shadow-sm" id="changePasswordSection">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">Đổi Mật Khẩu</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmitPasswordChange}>
                            <div className="mb-3">
                                <label htmlFor="currentPassword" className="form-label fw-medium">Mật khẩu hiện tại:</label>
                                <input type="password" className="form-control" id="currentPassword" name="currentPassword" placeholder="Nhập mật khẩu hiện tại" value={passwordData.currentPassword} onChange={handlePasswordInputChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label fw-medium">Mật khẩu mới:</label>
                                <input type="password" className="form-control" id="newPassword" name="newPassword" placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)" value={passwordData.newPassword} onChange={handlePasswordInputChange} required minLength="6" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmNewPassword" className="form-label fw-medium">Xác nhận mật khẩu mới:</label>
                                <input type="password" className="form-control" id="confirmNewPassword" name="confirmNewPassword" placeholder="Xác nhận mật khẩu mới" value={passwordData.confirmNewPassword} onChange={handlePasswordInputChange} required />
                            </div>
                            <div className="d-flex justify-content-end">
                                <button type="button" className="btn btn-secondary me-2" onClick={() => { setShowChangePasswordForm(false); setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); }}>
                                    Hủy
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Lưu Mật Khẩu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Section: Cài Đặt Khác (tùy chọn) */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-light">
                    <h5 className="mb-0">Cài Đặt Chung</h5>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="languageSelect" className="form-label fw-medium">Ngôn ngữ:</label>
                        <select className="form-select form-select-sm" id="languageSelect" defaultValue="vi">
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="emailNotificationsUser" defaultChecked />
                        <label className="form-check-label" htmlFor="emailNotificationsUser">Nhận thông báo cá nhân qua email</label>
                    </div>
                    <div className="form-check form-switch mt-2">
                        <input className="form-check-input" type="checkbox" role="switch" id="darkMode" />
                        <label className="form-check-label" htmlFor="darkMode">Chế độ tối (Dark mode)</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;