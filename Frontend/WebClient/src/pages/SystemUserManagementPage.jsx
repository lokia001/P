import React, { useState, useEffect, useMemo } from 'react';
import {
    Container, Row, Col, Form, Button, Table, Modal, Dropdown, Badge, Pagination, InputGroup, Tooltip, OverlayTrigger
} from 'react-bootstrap';
// Giả sử file CSS này vẫn tồn tại và được import ở đâu đó trong App.jsx hoặc main.jsx
// Hoặc bạn có thể import trực tiếp ở đây nếu muốn:
// import './SystemUserManagement.css';

const MOCK_USERS_DATA = [
    { id: 'SA001', username: 'superadmin', displayName: 'Super Administrator', email: 'superadmin@system.com', role: 'Super Admin', status: 'Hoạt động', createdAt: '2023-01-01', lastLogin: '2024-07-28T10:00:00Z' },
    { id: 'ADM001', username: 'admin_jane', displayName: 'Jane Doe (Admin)', email: 'jane.doe@system.com', role: 'Admin', status: 'Hoạt động', createdAt: '2023-02-15', lastLogin: '2024-07-27T15:30:00Z' },
    { id: 'ADM002', username: 'admin_john', displayName: 'John Smith (Admin)', email: 'john.smith@system.com', role: 'Admin', status: 'Bị khóa', createdAt: '2023-03-10', lastLogin: '2024-05-01T08:20:00Z' },
    { id: 'TECH001', username: 'tech_support_01', displayName: 'Tech Support Level 1', email: 'tech01@system.com', role: 'Support', status: 'Hoạt động', createdAt: '2023-04-05', lastLogin: '2024-07-28T09:00:00Z' },
    { id: 'ADM003', username: 'new_admin_user', displayName: 'New Admin User', email: 'newadmin@system.com', role: 'Admin', status: 'Hoạt động', createdAt: '2024-07-20', lastLogin: null },
    { id: 'SA002', username: 'secondary_sa', displayName: 'Secondary Super Admin', email: 'secondary_sa@system.com', role: 'Super Admin', status: 'Bị khóa', createdAt: '2023-05-01', lastLogin: '2024-06-15T11:00:00Z' },
    { id: 'ADM004', username: 'another_admin', displayName: 'Another Admin', email: 'another@system.com', role: 'Admin', status: 'Hoạt động', createdAt: '2024-01-10', lastLogin: '2024-07-25T14:12:00Z' },
];

const ROLES_OPTIONS = ['Super Admin', 'Admin', 'Support']; // Các vai trò có thể có
const STATUS_OPTIONS = ['Hoạt động', 'Bị khóa'];

// --- QUAN TRỌNG: THAY ĐỔI ĐỂ TEST QUYỀN ---
// const CURRENT_USER_LOGGED_IN = { id: 'SA001', username: 'superadmin', role: 'Super Admin' };
const CURRENT_USER_LOGGED_IN = { id: 'ADM001', username: 'admin_jane', role: 'Admin' };
// const CURRENT_USER_LOGGED_IN = { id: 'TECH001', username: 'tech_support_01', role: 'Support' }; // Support không có quyền quản lý người dùng


const USERS_PER_PAGE = 5;

function SystemUserManagementPage() {
    const [users, setUsers] = useState(MOCK_USERS_DATA);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [modalMode, setModalMode] = useState('add');
    const [userFormData, setUserFormData] = useState({
        username: '', displayName: '', email: '', password: '', confirmPassword: '', role: ROLES_OPTIONS[1]
    });
    const [formValidated, setFormValidated] = useState(false);

    const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
    const [detailedUser, setDetailedUser] = useState(null);

    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [userForResetPassword, setUserForResetPassword] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [resetPasswordValidated, setResetPasswordValidated] = useState(false);

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = (
                user.id.toLowerCase().includes(searchLower) ||
                user.username.toLowerCase().includes(searchLower) ||
                user.displayName.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower)
            );
            const matchesRole = roleFilter ? user.role === roleFilter : true;
            const matchesStatus = statusFilter ? user.status === statusFilter : true;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * USERS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, roleFilter, statusFilter]);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleShowAddModal = () => {
        setModalMode('add');
        setEditingUser(null);
        setUserFormData({ username: '', displayName: '', email: '', password: '', confirmPassword: '', role: ROLES_OPTIONS[1] });
        setFormValidated(false);
        setShowAddEditModal(true);
    };

    const handleShowEditModal = (user) => {
        setModalMode('edit');
        setEditingUser(user);
        setUserFormData({
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            password: '', // Để trống, chỉ cập nhật nếu người dùng nhập
            confirmPassword: '',
            role: user.role,
        });
        setFormValidated(false);
        setShowAddEditModal(true);
    };
    const handleCloseAddEditModal = () => setShowAddEditModal(false);

    const handleUserFormChange = (e) => {
        const { name, value } = e.target;
        setUserFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveUser = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        let passwordConstraintMet = true;
        if (modalMode === 'add' || (modalMode === 'edit' && userFormData.password)) {
            passwordConstraintMet = userFormData.password.length >= 6 && userFormData.password === userFormData.confirmPassword;
        }

        if (form.checkValidity() === false || !passwordConstraintMet) {
            event.stopPropagation();
            setFormValidated(true);
            return;
        }

        if (modalMode === 'add') {
            const newUser = {
                id: `U${Date.now().toString().slice(-5)}`,
                username: userFormData.username,
                displayName: userFormData.displayName,
                email: userFormData.email,
                role: userFormData.role,
                status: 'Hoạt động',
                createdAt: new Date().toISOString().split('T')[0],
                lastLogin: null,
            };
            setUsers(prev => [newUser, ...prev].sort((a, b) => a.id.localeCompare(b.id))); // Sắp xếp lại nếu cần
            console.log("Thêm người dùng:", newUser, "Mật khẩu (demo):", userFormData.password);
        } else {
            setUsers(prevUsers => prevUsers.map(u =>
                u.id === editingUser.id
                    ? {
                        ...u,
                        displayName: userFormData.displayName,
                        email: userFormData.email,
                        role: userFormData.role, // Vai trò được cập nhật ở đây
                        // Mật khẩu sẽ được xử lý riêng nếu có API
                    }
                    : u
            ));
            console.log("Cập nhật người dùng:", editingUser.id, "Dữ liệu mới:", userFormData);
            if (userFormData.password) console.log("Mật khẩu mới được đặt (demo):", userFormData.password);
        }
        handleCloseAddEditModal();
    };

    const handleShowViewDetailsModal = (user) => { setDetailedUser(user); setShowViewDetailsModal(true); };
    const handleCloseViewDetailsModal = () => setShowViewDetailsModal(false);

    const handleChangeStatus = (userToUpdate, newStatus) => {
        setUsers(prevUsers => prevUsers.map(u =>
            u.id === userToUpdate.id ? { ...u, status: newStatus } : u
        ));
        console.log(`Thay đổi trạng thái người dùng ${userToUpdate.username} thành ${newStatus}`);
    };

    const handleShowResetPasswordModal = (user) => {
        setUserForResetPassword(user);
        setNewPassword(''); setConfirmNewPassword(''); setResetPasswordValidated(false);
        setShowResetPasswordModal(true);
    };
    const handleCloseResetPasswordModal = () => setShowResetPasswordModal(false);

    const handleConfirmResetPassword = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false || newPassword !== confirmNewPassword || newPassword.length < 6) {
            event.stopPropagation();
            setResetPasswordValidated(true);
            return;
        }
        console.log(`Đặt lại mật khẩu cho ${userForResetPassword.username}. Mật khẩu mới (demo): ${newPassword}`);
        // API call to reset password here
        handleCloseResetPasswordModal();
    };

    const handleChangeRole = (userToUpdate, newRole) => {
        setUsers(prevUsers => prevUsers.map(u =>
            u.id === userToUpdate.id ? { ...u, role: newRole } : u
        ));
        console.log(`Thay đổi vai trò người dùng ${userToUpdate.username} thành ${newRole}`);
    };

    const handleShowDeleteConfirmModal = (user) => { setUserToDelete(user); setShowDeleteConfirmModal(true); };
    const handleCloseDeleteConfirmModal = () => setShowDeleteConfirmModal(false);

    const handleConfirmDeleteUser = () => {
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
        console.log(`Xóa người dùng: ${userToDelete.username}`);
        handleCloseDeleteConfirmModal();
    };

    const renderUserActions = (user) => {
        const loggedInUser = CURRENT_USER_LOGGED_IN;
        const targetUser = user;
        const isSelf = loggedInUser.id === targetUser.id;

        let canViewDetails = true;
        let canEdit = false;
        let canChangeStatus = false;
        let canResetPassword = false;
        let canChangeRole = false;
        let canDelete = false;

        const activeSuperAdminsCount = users.filter(u => u.role === 'Super Admin' && u.status === 'Hoạt động').length;
        const totalSuperAdminsCount = users.filter(u => u.role === 'Super Admin').length;

        const isTargetLastActiveSuperAdmin = targetUser.role === 'Super Admin' && targetUser.status === 'Hoạt động' && activeSuperAdminsCount === 1;
        const isTargetLastSuperAdmin = targetUser.role === 'Super Admin' && totalSuperAdminsCount === 1;


        if (loggedInUser.role === 'Super Admin') {
            canEdit = true; // SA có thể sửa bất kỳ ai, kể cả chính mình (form sẽ hạn chế một số trường)
            if (!isSelf) { // SA không tự reset mật khẩu/xóa mình qua đây
                canResetPassword = true;
                canDelete = !isTargetLastSuperAdmin; // Không thể xóa SA cuối cùng
            }
            // SA có thể thay đổi trạng thái của bất kỳ ai, trừ khi đó là SA hoạt động cuối cùng và họ đang cố khóa chính mình
            canChangeStatus = !(isSelf && isTargetLastActiveSuperAdmin && targetUser.status === 'Hoạt động');
            // SA có thể thay đổi vai trò của bất kỳ ai, trừ khi đó là SA cuối cùng và họ đang cố hạ vai trò của chính mình
            canChangeRole = !(isSelf && isTargetLastSuperAdmin);

        } else if (loggedInUser.role === 'Admin') {
            if (targetUser.role !== 'Super Admin') { // Admin không thể tác động lên Super Admin
                canEdit = true; // Admin có thể sửa Admin khác hoặc Support, kể cả chính mình (form hạn chế)
                if (!isSelf) {
                    canChangeStatus = true;
                    canResetPassword = true;
                }
            } else if (isSelf) { // Admin có thể sửa thông tin cơ bản của chính mình
                canEdit = true;
            }
        }
        // Người dùng 'Support' hoặc vai trò thấp hơn không có hành động quản lý nào ở đây

        if (loggedInUser.role === 'Support') return <span className="text-muted fst-italic">Không có hành động</span>;

        return (
            <div className="d-flex justify-content-center align-items-center flex-wrap">
                {canViewDetails && (
                    <OverlayTrigger placement="top" overlay={<Tooltip>Xem chi tiết</Tooltip>}>
                        <Button variant="link" className="action-icon text-info p-1 mx-1" onClick={() => handleShowViewDetailsModal(targetUser)}>
                            <i className="bi bi-eye-fill"></i>
                        </Button>
                    </OverlayTrigger>
                )}

                {canEdit && (
                    <OverlayTrigger placement="top" overlay={<Tooltip>Sửa thông tin</Tooltip>}>
                        <Button variant="link" className="action-icon text-primary p-1 mx-1" onClick={() => handleShowEditModal(targetUser)}>
                            <i className="bi bi-pencil-fill"></i>
                        </Button>
                    </OverlayTrigger>
                )}

                {canChangeStatus && (
                    <Dropdown as="span" className="mx-1">
                        <OverlayTrigger placement="top" overlay={<Tooltip>Thay đổi trạng thái</Tooltip>}>
                            <Dropdown.Toggle variant="link" className="action-icon p-1" id={`status-dd-${targetUser.id}`}>
                                <i className={`bi ${targetUser.status === 'Hoạt động' ? "bi-toggle-on text-success" : "bi-toggle-off text-danger"}`} style={{ fontSize: '1.4rem' }}></i>
                            </Dropdown.Toggle>
                        </OverlayTrigger>
                        <Dropdown.Menu>
                            {STATUS_OPTIONS.map(status => (
                                <Dropdown.Item key={status} onClick={() => handleChangeStatus(targetUser, status)} active={targetUser.status === status}
                                    disabled={isSelf && targetUser.role === 'Super Admin' && isTargetLastActiveSuperAdmin && status === 'Bị khóa'} // SA không tự khóa mình nếu là SA hoạt động cuối
                                >
                                    {status}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                )}

                {canResetPassword && (
                    <OverlayTrigger placement="top" overlay={<Tooltip>Đặt lại mật khẩu</Tooltip>}>
                        <Button variant="link" className="action-icon text-warning p-1 mx-1" onClick={() => handleShowResetPasswordModal(targetUser)}>
                            <i className="bi bi-key-fill"></i>
                        </Button>
                    </OverlayTrigger>
                )}

                {canChangeRole && loggedInUser.role === 'Super Admin' && ( // Chỉ Super Admin mới có thể thay đổi vai trò
                    <Dropdown as="span" className="mx-1">
                        <OverlayTrigger placement="top" overlay={<Tooltip>Thay đổi vai trò</Tooltip>}>
                            <Dropdown.Toggle variant="link" className="action-icon text-secondary p-1" id={`role-dd-${targetUser.id}`}>
                                <i className="bi bi-person-fill-gear"></i>
                            </Dropdown.Toggle>
                        </OverlayTrigger>
                        <Dropdown.Menu>
                            {ROLES_OPTIONS.map(role => (
                                <Dropdown.Item key={role} onClick={() => handleChangeRole(targetUser, role)} active={targetUser.role === role}
                                    disabled={isSelf && isTargetLastSuperAdmin && role !== 'Super Admin'} // SA không thể tự hạ vai trò của mình nếu là SA cuối
                                >
                                    {role}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                )}

                {canDelete && loggedInUser.role === 'Super Admin' && ( // Chỉ Super Admin mới có thể xóa
                    <OverlayTrigger placement="top" overlay={<Tooltip>Xóa tài khoản</Tooltip>}>
                        <Button variant="link" className="action-icon text-danger p-1 mx-1" onClick={() => handleShowDeleteConfirmModal(targetUser)}>
                            <i className="bi bi-trash-fill"></i>
                        </Button>
                    </OverlayTrigger>
                )}
            </div>
        );
    };

    const formatLastLogin = (dateString) => {
        if (!dateString) return <span className="text-muted">Chưa đăng nhập</span>;
        const date = new Date(dateString);
        return (
            <OverlayTrigger placement="top" overlay={<Tooltip>{date.toLocaleString()}</Tooltip>}>
                <span>{date.toLocaleDateString()}</span>
            </OverlayTrigger>
        );
    };


    return (
        <Container fluid className="p-3 system-user-management-page">
            <h2 className="mb-4">Quản Lý Người Dùng Hệ Thống</h2>
            <Row className="mb-3 filter-bar align-items-center gx-2 p-3 bg-light border rounded">
                <Col lg={4} md={12} className="mb-2 mb-lg-0">
                    <InputGroup>
                        <Form.Control
                            type="text" placeholder="Tìm theo tên, email, ID"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary" onClick={() => setSearchTerm('')} disabled={!searchTerm}><i className="bi bi-x-lg"></i></Button>
                    </InputGroup>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12} className="mb-2 mb-lg-0">
                    <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                        <option value="">Tất cả vai trò</option>
                        {ROLES_OPTIONS.map(role => <option key={role} value={role}>{role}</option>)}
                    </Form.Select>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12} className="mb-2 mb-lg-0">
                    <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">Tất cả trạng thái</option>
                        {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                    </Form.Select>
                </Col>
                {CURRENT_USER_LOGGED_IN.role !== 'Support' && ( // Chỉ Admin và Super Admin mới thấy nút này
                    <Col lg={2} md={12} className="text-lg-end">
                        <Button variant="primary" onClick={handleShowAddModal} className="w-100 w-lg-auto">
                            <i className="bi bi-plus-lg me-2"></i>Thêm Mới
                        </Button>
                    </Col>
                )}
            </Row>

            <div className="user-table-container table-responsive">
                <Table striped bordered hover /*responsive="lg" -> removed for better control with table-responsive class */ >
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Tên Đăng Nhập</th>
                            <th>Tên Hiển Thị</th>
                            <th>Email</th>
                            <th>Vai Trò</th>
                            <th>Trạng Thái</th>
                            <th>Ngày Tạo</th>
                            <th>Đăng nhập gần nhất</th>
                            <th className="text-center" style={{ minWidth: '220px' }}>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.length > 0 ? paginatedUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.displayName}</td>
                                <td>{user.email}</td>
                                <td><Badge pill bg={user.role === 'Super Admin' ? 'danger' : (user.role === 'Admin' ? 'primary' : 'info')}>{user.role}</Badge></td>
                                <td>
                                    <Badge pill bg={user.status === 'Hoạt động' ? 'success' : 'danger'} /* text={user.status === 'Bị khóa' ? 'dark' : 'light'} */>
                                        {user.status}
                                    </Badge>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>{formatLastLogin(user.lastLogin)}</td>
                                <td className="text-center">{renderUserActions(user)}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="9" className="text-center fst-italic py-4">Không tìm thấy người dùng nào.</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                    <Pagination>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {[...Array(totalPages).keys()].map(num => {
                            const pageNum = num + 1;
                            if (totalPages <= 7 || (pageNum === currentPage) || (pageNum <= 2) || (pageNum >= totalPages - 1) || (Math.abs(pageNum - currentPage) <= 1) || (totalPages > 7 && currentPage <= 4 && pageNum <= 5) || (totalPages > 7 && currentPage >= totalPages - 3 && pageNum >= totalPages - 4)) {
                                return (<Pagination.Item key={pageNum} active={pageNum === currentPage} onClick={() => handlePageChange(pageNum)}>{pageNum}</Pagination.Item>);
                            } else if ((currentPage > 4 && pageNum === 3) || (currentPage < totalPages - 3 && pageNum === totalPages - 2)) {
                                return <Pagination.Ellipsis key={`ellipsis-${pageNum}`} />;
                            } return null;
                        })}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            )}

            {/* Add/Edit User Modal */}
            <Modal show={showAddEditModal} onHide={handleCloseAddEditModal} backdrop="static" keyboard={false} size="lg">
                <Form noValidate validated={formValidated} onSubmit={handleSaveUser}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalMode === 'add' ? 'Thêm Người Dùng Hệ Thống Mới' : `Sửa Thông Tin: ${editingUser?.displayName}`}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="username">
                                    <Form.Label>Tên đăng nhập <span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" name="username" value={userFormData.username} onChange={handleUserFormChange} required minLength={3} disabled={modalMode === 'edit'} />
                                    <Form.Control.Feedback type="invalid">Tên đăng nhập ít nhất 3 ký tự, không chứa khoảng trắng và là duy nhất.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="displayName">
                                    <Form.Label>Tên hiển thị <span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" name="displayName" value={userFormData.displayName} onChange={handleUserFormChange} required />
                                    <Form.Control.Feedback type="invalid">Tên hiển thị không được để trống.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="email" name="email" value={userFormData.email} onChange={handleUserFormChange} required />
                            <Form.Control.Feedback type="invalid">Vui lòng nhập email hợp lệ.</Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Mật khẩu {modalMode === 'add' ? <span className="text-danger">*</span> : '(Để trống nếu không thay đổi)'}</Form.Label>
                                    <Form.Control type="password" name="password" value={userFormData.password} onChange={handleUserFormChange} required={modalMode === 'add'} minLength={modalMode === 'add' || userFormData.password ? 6 : 0} />
                                    <Form.Control.Feedback type="invalid">Mật khẩu ít nhất 6 ký tự.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="confirmPassword">
                                    <Form.Label>Xác nhận mật khẩu {modalMode === 'add' || userFormData.password ? <span className="text-danger">*</span> : ''}</Form.Label>
                                    <Form.Control type="password" name="confirmPassword" value={userFormData.confirmPassword} onChange={handleUserFormChange} required={modalMode === 'add' || userFormData.password} isInvalid={formValidated && userFormData.password !== userFormData.confirmPassword && (modalMode === 'add' || userFormData.password)} />
                                    <Form.Control.Feedback type="invalid">
                                        {(userFormData.password !== userFormData.confirmPassword) ? 'Mật khẩu không khớp.' : 'Vui lòng xác nhận mật khẩu.'}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="role">
                            <Form.Label>Vai trò <span className="text-danger">*</span></Form.Label>
                            <Form.Select name="role" value={userFormData.role} onChange={handleUserFormChange} required
                                disabled={CURRENT_USER_LOGGED_IN.role !== 'Super Admin' && modalMode === 'edit' && editingUser?.role === userFormData.role} // Admin không thể đổi vai trò khi sửa
                            >
                                {ROLES_OPTIONS.map(role => (
                                    <option key={role} value={role}
                                        disabled={
                                            (CURRENT_USER_LOGGED_IN.role !== 'Super Admin' && role === 'Super Admin') || // Non-SA không thể gán vai trò SA
                                            (modalMode === 'edit' && CURRENT_USER_LOGGED_IN.role !== 'Super Admin' && editingUser?.id !== CURRENT_USER_LOGGED_IN.id) // Admin không thể đổi vai trò người khác
                                        }
                                    >
                                        {role}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Vui lòng chọn vai trò.</Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAddEditModal}>Hủy</Button>
                        <Button variant="primary" type="submit">Lưu</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* View Details Modal */}
            <Modal show={showViewDetailsModal} onHide={handleCloseViewDetailsModal}>
                <Modal.Header closeButton><Modal.Title>Chi Tiết Người Dùng</Modal.Title></Modal.Header>
                <Modal.Body>
                    {detailedUser && (
                        <>
                            <p><strong>ID:</strong> {detailedUser.id}</p>
                            <p><strong>Tên đăng nhập:</strong> {detailedUser.username}</p>
                            <p><strong>Tên hiển thị:</strong> {detailedUser.displayName}</p>
                            <p><strong>Email:</strong> {detailedUser.email}</p>
                            <p><strong>Vai trò:</strong> <Badge pill bg={detailedUser.role === 'Super Admin' ? 'danger' : (detailedUser.role === 'Admin' ? 'primary' : 'info')}>{detailedUser.role}</Badge></p>
                            <p><strong>Trạng thái:</strong> <Badge pill bg={detailedUser.status === 'Hoạt động' ? 'success' : 'danger'}>{detailedUser.status}</Badge></p>
                            <p><strong>Ngày tạo:</strong> {new Date(detailedUser.createdAt).toLocaleDateString()}</p>
                            <p><strong>Đăng nhập gần nhất:</strong> {detailedUser.lastLogin ? new Date(detailedUser.lastLogin).toLocaleString() : 'Chưa đăng nhập'}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={handleCloseViewDetailsModal}>Đóng</Button></Modal.Footer>
            </Modal>

            {/* Reset Password Modal */}
            <Modal show={showResetPasswordModal} onHide={handleCloseResetPasswordModal} backdrop="static" keyboard={false}>
                <Form noValidate validated={resetPasswordValidated} onSubmit={handleConfirmResetPassword}>
                    <Modal.Header closeButton><Modal.Title>Đặt Lại Mật Khẩu cho {userForResetPassword?.username}</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="newPassword"><Form.Label>Mật khẩu mới <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
                            <Form.Control.Feedback type="invalid">Mật khẩu mới phải có ít nhất 6 ký tự.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="confirmNewPassword"><Form.Label>Xác nhận mật khẩu mới <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required isInvalid={resetPasswordValidated && newPassword !== confirmNewPassword} />
                            <Form.Control.Feedback type="invalid">{newPassword !== confirmNewPassword ? 'Mật khẩu không khớp.' : 'Vui lòng xác nhận mật khẩu mới.'}</Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseResetPasswordModal}>Hủy</Button>
                        <Button variant="primary" type="submit">Đặt Lại</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmModal} onHide={handleCloseDeleteConfirmModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton><Modal.Title>Xác Nhận Xóa Người Dùng</Modal.Title></Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete?.displayName} ({userToDelete?.username})</strong>? Hành động này không thể hoàn tác.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteConfirmModal}>Hủy</Button>
                    <Button variant="danger" onClick={handleConfirmDeleteUser}>Xóa</Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
}

export default SystemUserManagementPage;