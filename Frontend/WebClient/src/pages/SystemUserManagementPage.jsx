import React, { useState, useEffect, useMemo } from 'react';
import {
    Container, Row, Col, Form, Button, Table, Modal, Dropdown, Badge, Pagination, InputGroup, Tooltip, OverlayTrigger, Spinner, Alert
} from 'react-bootstrap';
import { useSelector } from 'react-redux';

// Import RTK Query hooks
import {
    useGetAdminUsersQuery,
    useAddAdminUserMutation,
    useUpdateAdminUserMutation,
    useDeleteAdminUserMutation,
    useUpdateAdminUserStatusMutation,
    useResetAdminUserPasswordMutation,
    useUpdateAdminUserRoleMutation,
} from '../store/api/adminUserApi'; // Đảm bảo đường dẫn đúng
import { selectUser, selectUserRole } from '../store/reducers/authSlice'; // Hoặc từ authSelectors.js

// import './SystemUserManagement.css'; // Đã được import ở cấp cao hơn hoặc ở đây

// Vai trò có thể lấy từ backend hoặc định nghĩa ở đây để filter/dropdown
// Cần đảm bảo các giá trị này khớp với những gì backend trả về/chấp nhận
const ROLES_FOR_DISPLAY_AND_FILTER = ['SysAdmin', 'Admin', 'Owner', 'Customer', 'User'];
const STATUS_OPTIONS_DISPLAY = ['Hoạt động', 'Bị khóa'];
const USERS_PER_PAGE = 10;

function SystemUserManagementPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilterForDisplay, setStatusFilterForDisplay] = useState(''); // Dùng cho UI dropdown

    const loggedInUser = useSelector(selectUser);
    const currentUserRole = useSelector(selectUserRole); // 'SysAdmin', 'Admin', 'User', etc.

    // Map status hiển thị sang giá trị backend nếu cần (ví dụ: isLockedOut: true/false)
    // Hiện tại, giả định backend cũng dùng string 'Hoạt động'/'Bị khóa' hoặc được xử lý trong transformResponse
    const queryParams = {
        page: currentPage,
        itemsPerPage: USERS_PER_PAGE, // Hoặc 'limit' tùy backend
        search: searchTerm || undefined,
        role: roleFilter || undefined,
        // status: backendStatusFilter, // Nếu cần map
    };
    const { data: usersFromApi = [], isLoading, isError, error, refetch } = useGetAdminUsersQuery(queryParams);

    // Nếu API trả về object với totalCount cho pagination server-side
    // const users = apiResponse?.data || [];
    // const totalUsersCount = apiResponse?.totalCount || 0;
    // const totalPages = Math.ceil(totalUsersCount / USERS_PER_PAGE);
    // Hiện tại, usersFromApi được giả định là mảng users trực tiếp sau transformResponse

    // Client-side filtering nếu API không hỗ trợ filter status
    const filteredUsersByStatus = useMemo(() => {
        if (!statusFilterForDisplay) return usersFromApi;
        return usersFromApi.filter(user => user.status === statusFilterForDisplay);
    }, [usersFromApi, statusFilterForDisplay]);

    // Client-side pagination (nếu API chưa hỗ trợ pagination hoặc bạn muốn làm ở client)
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * USERS_PER_PAGE;
        return filteredUsersByStatus.slice(startIndex, startIndex + USERS_PER_PAGE);
    }, [filteredUsersByStatus, currentPage]);
    const totalPages = Math.ceil(filteredUsersByStatus.length / USERS_PER_PAGE);


    const [addAdminUser, { isLoading: isAddingUser }] = useAddAdminUserMutation();
    const [updateAdminUser, { isLoading: isUpdatingUser }] = useUpdateAdminUserMutation();
    const [deleteAdminUser, { isLoading: isDeletingUser }] = useDeleteAdminUserMutation();
    const [updateAdminUserStatus, { isLoading: isUpdatingStatus }] = useUpdateAdminUserStatusMutation();
    const [resetAdminUserPassword, { isLoading: isResettingPassword }] = useResetAdminUserPasswordMutation();
    const [updateAdminUserRole, { isLoading: isUpdatingRole }] = useUpdateAdminUserRoleMutation();

    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [modalMode, setModalMode] = useState('add');
    const [userFormData, setUserFormData] = useState({
        fullName: '', email: '', username: '', password: '', confirmPassword: '', role: 'User' // Mặc định
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

    useEffect(() => {
        setCurrentPage(1);
        // Nếu filter (searchTerm, roleFilter) được xử lý bởi server, RTK Query sẽ tự refetch khi queryParams thay đổi.
        // Nếu statusFilterForDisplay là client-side, không cần refetch ở đây.
    }, [searchTerm, roleFilter, statusFilterForDisplay]);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleShowAddModal = () => {
        setModalMode('add');
        setEditingUser(null);
        // Chọn vai trò mặc định phù hợp, ví dụ 'User' hoặc 'Customer'
        const defaultRole = ROLES_FOR_DISPLAY_AND_FILTER.includes('User') ? 'User' : ROLES_FOR_DISPLAY_AND_FILTER[0];
        setUserFormData({ fullName: '', email: '', username: '', password: '', confirmPassword: '', role: defaultRole });
        setFormValidated(false);
        setShowAddEditModal(true);
    };

    const handleShowEditModal = (userFromApi) => {
        setModalMode('edit');
        setEditingUser(userFromApi);
        setUserFormData({
            fullName: userFromApi.fullName || '',
            email: userFromApi.email || '',
            username: userFromApi.username || '', // Username thường không cho sửa
            password: '', confirmPassword: '',
            role: userFromApi.role || 'User',
            // Thêm các trường khác từ API nếu có: phoneNumber, bio,...
            phoneNumber: userFromApi.phoneNumber || '',
            // bio: userFromApi.bio || '',
        });
        setFormValidated(false);
        setShowAddEditModal(true);
    };
    const handleCloseAddEditModal = () => setShowAddEditModal(false);

    const handleUserFormChange = (e) => {
        const { name, value } = e.target;
        setUserFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveUser = async (event) => {
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

        // Payload gửi lên backend, đảm bảo khớp với những gì backend mong đợi
        const payload = {
            fullName: userFormData.fullName,
            email: userFormData.email,
            username: userFormData.username, // Backend sẽ validate unique username
            role: userFormData.role,
            // Thêm các trường khác nếu có: phoneNumber, bio
            // phoneNumber: userFormData.phoneNumber,
            // bio: userFormData.bio,
        };
        if (userFormData.password) { // Chỉ gửi password nếu được nhập
            payload.password = userFormData.password;
        }

        try {
            if (modalMode === 'add') {
                await addAdminUser(payload).unwrap();
                alert("Thêm người dùng thành công!");
            } else {
                await updateAdminUser({ id: editingUser.id, ...payload }).unwrap();
                alert("Cập nhật người dùng thành công!");
            }
            handleCloseAddEditModal();
            // RTK Query sẽ tự động refetch list nếu tags được cấu hình đúng
        } catch (err) {
            console.error("Lỗi khi lưu người dùng:", err);
            const errorMsg = err.data?.message || err.data?.title || err.message || 'Không thể lưu người dùng.';
            alert(`Lỗi: ${errorMsg}`);
        }
    };

    const handleShowViewDetailsModal = (userFromApi) => { setDetailedUser(userFromApi); setShowViewDetailsModal(true); };
    const handleCloseViewDetailsModal = () => setShowViewDetailsModal(false);

    const handleChangeStatus = async (userToUpdate, newDisplayStatus) => {
        // newDisplayStatus là "Hoạt động" hoặc "Bị khóa"
        // Cần payload mà backend mong muốn, ví dụ: { isLockedOut: true/false }
        // Hoặc một endpoint riêng như /lock, /unlock
        // Ví dụ payload cho endpoint /status (giả định):
        const backendStatusPayload = {
            // Ví dụ: nếu backend dùng isLockedOut
            isLockedOut: newDisplayStatus === 'Bị khóa',
            // Hoặc nếu backend dùng một trường status dạng string
            // status: newDisplayStatus === 'Hoạt động' ? 'Active' : 'Locked',
        };
        // CẦN ĐIỀU CHỈNH PAYLOAD NÀY CHO ĐÚNG VỚI BACKEND CỦA BẠN
        // và endpoint trong adminUserApi.js (updateAdminUserStatus)

        if (Object.keys(backendStatusPayload).length === 0) {
            alert("Chưa định nghĩa payload thay đổi trạng thái cho backend.");
            return;
        }

        try {
            await updateAdminUserStatus({ id: userToUpdate.id, statusPayload: backendStatusPayload }).unwrap();
            alert(`Thay đổi trạng thái người dùng ${userToUpdate.username} thành công.`);
        } catch (err) {
            console.error("Lỗi khi thay đổi trạng thái:", err);
            const errorMsg = err.data?.message || err.message || 'Không thể thay đổi trạng thái.';
            alert(`Lỗi: ${errorMsg}`);
        }
    };

    const handleShowResetPasswordModal = (userFromApi) => {
        setUserForResetPassword(userFromApi);
        setNewPassword(''); setConfirmNewPassword(''); setResetPasswordValidated(false);
        setShowResetPasswordModal(true);
    };
    const handleCloseResetPasswordModal = () => setShowResetPasswordModal(false);

    const handleConfirmResetPassword = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false || newPassword !== confirmNewPassword || newPassword.length < 6) {
            event.stopPropagation();
            setResetPasswordValidated(true);
            return;
        }
        try {
            // Payload backend mong muốn, ví dụ: { newPassword: "..." }
            await resetAdminUserPassword({ id: userForResetPassword.id, passwordData: { newPassword } }).unwrap();
            alert(`Đặt lại mật khẩu cho ${userForResetPassword.username} thành công.`);
            handleCloseResetPasswordModal();
        } catch (err) {
            console.error("Lỗi khi đặt lại mật khẩu:", err);
            const errorMsg = err.data?.message || err.message || 'Không thể đặt lại mật khẩu.';
            alert(`Lỗi: ${errorMsg}`);
        }
    };

    const handleChangeRole = async (userToUpdate, newRole) => {
        try {
            // Payload backend mong muốn, ví dụ: { newRole: "Admin" } hoặc chỉ là { role: "Admin" }
            await updateAdminUserRole({ id: userToUpdate.id, rolePayload: { role: newRole } }).unwrap();
            alert(`Thay đổi vai trò người dùng ${userToUpdate.username} thành công.`);
        } catch (err) {
            console.error("Lỗi khi thay đổi vai trò:", err);
            const errorMsg = err.data?.message || err.message || 'Không thể thay đổi vai trò.';
            alert(`Lỗi: ${errorMsg}`);
        }
    };

    const handleShowDeleteConfirmModal = (userFromApi) => { setUserToDelete(userFromApi); setShowDeleteConfirmModal(true); };
    const handleCloseDeleteConfirmModal = () => setShowDeleteConfirmModal(false);

    const handleConfirmDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await deleteAdminUser(userToDelete.id).unwrap();
            alert(`Xóa người dùng: ${userToDelete.username} thành công.`);
            handleCloseDeleteConfirmModal();
        } catch (err) {
            console.error("Lỗi khi xóa người dùng:", err);
            const errorMsg = err.data?.message || err.message || 'Không thể xóa người dùng.';
            alert(`Lỗi: ${errorMsg}`);
        }
    };

    const renderUserActions = (userFromApi) => {
        const targetUser = userFromApi;
        const isSelf = loggedInUser && loggedInUser.id === targetUser.id;

        let canViewDetails = true;
        let canEdit = false;
        let canChangeStatus = false;
        let canResetPassword = false;
        let canChangeRole = false;
        let canDelete = false;

        // Logic phân quyền (cần điều chỉnh cho chính xác)
        // currentUserRole là vai trò của người đang đăng nhập (SysAdmin, Admin, User,...)
        // targetUser.role là vai trò của người dùng trong hàng
        if (currentUserRole === 'SysAdmin') {
            canEdit = true;
            if (!isSelf) { // SysAdmin không tự thực hiện các hành động này trên chính mình qua UI này
                canResetPassword = true;
                canDelete = true; // Cân nhắc logic không cho xóa SysAdmin cuối cùng
                canChangeRole = true; // SysAdmin có thể đổi vai trò
                canChangeStatus = true;
            }
        } else if (currentUserRole === 'Admin') {
            // Admin có thể tác động lên User, Customer, Owner, Admin khác (không phải SysAdmin)
            if (targetUser.role !== 'SysAdmin') {
                canEdit = true;
                if (!isSelf) {
                    canChangeStatus = true;
                    canResetPassword = true;
                    // Admin có thể không được đổi vai trò của người khác
                }
            }
        }
        // Các vai trò khác như 'User', 'Customer', 'Owner' không có quyền quản lý ở đây

        if (!['SysAdmin', 'Admin'].includes(currentUserRole)) {
            return <span className="text-muted fst-italic">Không có hành động</span>;
        }

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
                    <OverlayTrigger placement="top" overlay={<Tooltip>Sửa</Tooltip>}>
                        <Button variant="link" className="action-icon text-primary p-1 mx-1" onClick={() => handleShowEditModal(targetUser)}>
                            <i className="bi bi-pencil-fill"></i>
                        </Button>
                    </OverlayTrigger>
                )}
                {canChangeStatus && (
                    <OverlayTrigger placement="top" overlay={<Tooltip>{targetUser.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}</Tooltip>}>
                        <Button
                            variant="link"
                            className={`action-icon p-1 mx-1 ${targetUser.status === 'Hoạt động' ? 'text-danger' : 'text-success'}`}
                            onClick={() => handleChangeStatus(targetUser, targetUser.status === 'Hoạt động' ? 'Bị khóa' : 'Hoạt động')}
                            disabled={isUpdatingStatus}
                        >
                            <i className={`bi ${targetUser.status === 'Hoạt động' ? 'bi-lock-fill' : 'bi-unlock-fill'}`}></i>
                        </Button>
                    </OverlayTrigger>
                )}
                {canResetPassword && (
                    <OverlayTrigger placement="top" overlay={<Tooltip>Đặt lại mật khẩu</Tooltip>}>
                        <Button variant="link" className="action-icon text-warning p-1 mx-1" onClick={() => handleShowResetPasswordModal(targetUser)} disabled={isResettingPassword}>
                            <i className="bi bi-key-fill"></i>
                        </Button>
                    </OverlayTrigger>
                )}
                {canChangeRole && currentUserRole === 'SysAdmin' && !isSelf && ( // Chỉ SysAdmin và không phải chính mình
                    <Dropdown as="span" className="mx-1">
                        <OverlayTrigger placement="top" overlay={<Tooltip>Thay đổi vai trò</Tooltip>}>
                            <Dropdown.Toggle variant="link" className="action-icon text-secondary p-1" id={`role-dd-${targetUser.id}`} disabled={isUpdatingRole}>
                                <i className="bi bi-person-fill-gear"></i>
                            </Dropdown.Toggle>
                        </OverlayTrigger>
                        <Dropdown.Menu>
                            {ROLES_FOR_DISPLAY_AND_FILTER.map(roleOption => (
                                <Dropdown.Item
                                    key={roleOption}
                                    onClick={() => handleChangeRole(targetUser, roleOption)}
                                    active={targetUser.role === roleOption}
                                // Thêm logic disabled nếu cần, ví dụ không cho hạ cấp SysAdmin duy nhất
                                >
                                    {roleOption}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                )}
                {canDelete && currentUserRole === 'SysAdmin' && !isSelf && ( // Chỉ SysAdmin và không phải chính mình
                    <OverlayTrigger placement="top" overlay={<Tooltip>Xóa tài khoản</Tooltip>}>
                        <Button variant="link" className="action-icon text-danger p-1 mx-1" onClick={() => handleShowDeleteConfirmModal(targetUser)} disabled={isDeletingUser}>
                            <i className="bi bi-trash-fill"></i>
                        </Button>
                    </OverlayTrigger>
                )}
            </div>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            // Format theo dd/MM/yyyy HH:mm
            return new Date(dateString).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return dateString;
        }
    };

    if (isLoading) {
        return <Container className="text-center mt-5"><Spinner animation="border" /> <p>Đang tải...</p></Container>;
    }

    if (isError) {
        return <Container className="mt-5"><Alert variant="danger">Lỗi tải dữ liệu: {error?.data?.message || error?.status || 'Lỗi không xác định'}</Alert></Container>;
    }

    return (
        <Container fluid className="p-3 system-user-management-page">
            <h2 className="mb-4">Quản Lý Người Dùng Hệ Thống</h2>
            <Row className="mb-3 filter-bar align-items-center gx-2 p-3 bg-light border rounded">
                <Col lg={4} md={12} className="mb-2 mb-lg-0">
                    <InputGroup>
                        <Form.Control type="text" placeholder="Tìm theo họ tên, email, username..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <Button variant="outline-secondary" onClick={() => setSearchTerm('')} disabled={!searchTerm}><i className="bi bi-x-lg"></i></Button>
                    </InputGroup>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12} className="mb-2 mb-lg-0">
                    <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                        <option value="">Tất cả vai trò</option>
                        {ROLES_FOR_DISPLAY_AND_FILTER.map(role => <option key={role} value={role}>{role}</option>)}
                    </Form.Select>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12} className="mb-2 mb-lg-0">
                    <Form.Select value={statusFilterForDisplay} onChange={(e) => setStatusFilterForDisplay(e.target.value)}>
                        <option value="">Tất cả trạng thái</option>
                        {STATUS_OPTIONS_DISPLAY.map(status => <option key={status} value={status}>{status}</option>)}
                    </Form.Select>
                </Col>
                {(currentUserRole === 'SysAdmin' || currentUserRole === 'Admin') && (
                    <Col lg={2} md={12} className="text-lg-end">
                        <Button variant="primary" onClick={handleShowAddModal} className="w-100 w-lg-auto" disabled={isAddingUser}>
                            {isAddingUser ? <Spinner as="span" animation="border" size="sm" /> : <i className="bi bi-plus-lg me-2"></i>}
                            Thêm Mới
                        </Button>
                    </Col>
                )}
            </Row>

            <div className="user-table-container table-responsive">
                <Table striped bordered hover>
                    <thead className="table-light">
                        <tr>
                            <th>Họ và Tên</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Tên người dùng</th>
                            <th>Thời gian tạo</th>
                            <th>Trạng thái</th>
                            <th className="text-center" style={{ minWidth: '200px' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.length > 0 ? paginatedUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.fullName || '(Chưa có)'}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Badge pill bg={
                                        user.role === 'SysAdmin' ? 'danger' :
                                            user.role === 'Admin' ? 'primary' :
                                                user.role === 'Owner' ? 'warning text-dark' :
                                                    user.role === 'Customer' ? 'info text-dark' :
                                                        user.role === 'User' ? 'success' : 'secondary' // Thêm màu cho "User"
                                    }>{user.role}</Badge>
                                </td>
                                <td>{user.username || '(trống)'}</td>
                                <td>{formatDate(user.createdAt)}</td>
                                <td>
                                    <Badge pill bg={user.status === 'Hoạt động' ? 'success' : 'danger'}>
                                        {user.status}
                                    </Badge>
                                </td>
                                <td className="text-center">{renderUserActions(user)}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" className="text-center fst-italic py-4">Không tìm thấy người dùng nào.</td></tr>
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
                        <Modal.Title>{modalMode === 'add' ? 'Thêm Người Dùng Mới' : `Sửa Thông Tin: ${editingUser?.fullName}`}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formFullNameModal">
                                    <Form.Label>Họ và Tên <span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" name="fullName" value={userFormData.fullName} onChange={handleUserFormChange} required />
                                    <Form.Control.Feedback type="invalid">Họ và tên không được để trống.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formUsernameModal">
                                    <Form.Label>Tên đăng nhập <span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" name="username" value={userFormData.username} onChange={handleUserFormChange} required minLength={3} disabled={modalMode === 'edit'} />
                                    <Form.Control.Feedback type="invalid">Tên đăng nhập ít nhất 3 ký tự.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="formEmailModal">
                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="email" name="email" value={userFormData.email} onChange={handleUserFormChange} required />
                            <Form.Control.Feedback type="invalid">Vui lòng nhập email hợp lệ.</Form.Control.Feedback>
                        </Form.Group>
                        {modalMode === 'add' && ( // Chỉ hiển thị mật khẩu khi thêm mới
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formPasswordModal">
                                        <Form.Label>Mật khẩu <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="password" name="password" value={userFormData.password} onChange={handleUserFormChange} required minLength={6} />
                                        <Form.Control.Feedback type="invalid">Mật khẩu ít nhất 6 ký tự.</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formConfirmPasswordModal">
                                        <Form.Label>Xác nhận mật khẩu <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="password" name="confirmPassword" value={userFormData.confirmPassword} onChange={handleUserFormChange} required isInvalid={formValidated && userFormData.password !== userFormData.confirmPassword} />
                                        <Form.Control.Feedback type="invalid">{(userFormData.password !== userFormData.confirmPassword) ? 'Mật khẩu không khớp.' : 'Vui lòng xác nhận.'}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}
                        <Form.Group className="mb-3" controlId="formRoleModal">
                            <Form.Label>Vai trò <span className="text-danger">*</span></Form.Label>
                            <Form.Select name="role" value={userFormData.role} onChange={handleUserFormChange} required
                                disabled={currentUserRole !== 'SysAdmin' && modalMode === 'edit'} // Chỉ SysAdmin được đổi role khi edit
                            >
                                {ROLES_FOR_DISPLAY_AND_FILTER.map(roleOpt => (
                                    <option key={roleOpt} value={roleOpt}
                                        disabled={currentUserRole !== 'SysAdmin' && roleOpt === 'SysAdmin'} // Non-SysAdmin không thể gán SysAdmin
                                    >
                                        {roleOpt}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Vui lòng chọn vai trò.</Form.Control.Feedback>
                        </Form.Group>
                        {/* Thêm các trường khác nếu cần: bio, phoneNumber, ... */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAddEditModal} disabled={isAddingUser || isUpdatingUser}>Hủy</Button>
                        <Button variant="primary" type="submit" disabled={isAddingUser || isUpdatingUser}>
                            {(isAddingUser || isUpdatingUser) && <Spinner as="span" animation="border" size="sm" className="me-1" />}
                            Lưu
                        </Button>
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
                            <p><strong>Họ và Tên:</strong> {detailedUser.fullName || '(Chưa có)'}</p>
                            <p><strong>Email:</strong> {detailedUser.email}</p>
                            <p><strong>Tên đăng nhập:</strong> {detailedUser.username || '(trống)'}</p>
                            <p><strong>Vai trò:</strong> {detailedUser.role}</p>
                            <p><strong>Trạng thái:</strong> {detailedUser.status}</p>
                            <p><strong>Ngày tạo:</strong> {formatDate(detailedUser.createdAt)}</p>
                            <p><strong>Cập nhật lần cuối:</strong> {formatDate(detailedUser.updatedAt)}</p>
                            <p><strong>SĐT:</strong> {detailedUser.phoneNumber || '(Chưa có)'}</p>
                            <p><strong>Ngày sinh:</strong> {detailedUser.dateOfBirth ? formatDate(detailedUser.dateOfBirth) : '(Chưa có)'}</p>
                            <p><strong>Giới tính:</strong> {detailedUser.gender || '(Chưa có)'}</p>
                            <p><strong>Địa chỉ:</strong> {detailedUser.address || '(Chưa có)'}</p>
                            <p><strong>Bio:</strong> {detailedUser.bio || '(Chưa có)'}</p>
                            {detailedUser.avatarUrl && <p><strong>Ảnh đại diện:</strong> <img src={detailedUser.avatarUrl} alt="avatar" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} /></p>}
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
                        <Form.Group className="mb-3" controlId="newPasswordModal"><Form.Label>Mật khẩu mới <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
                            <Form.Control.Feedback type="invalid">Mật khẩu mới phải có ít nhất 6 ký tự.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="confirmNewPasswordModal"><Form.Label>Xác nhận mật khẩu mới <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required isInvalid={resetPasswordValidated && newPassword !== confirmNewPassword} />
                            <Form.Control.Feedback type="invalid">{newPassword !== confirmNewPassword ? 'Mật khẩu không khớp.' : 'Vui lòng xác nhận.'}</Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseResetPasswordModal} disabled={isResettingPassword}>Hủy</Button>
                        <Button variant="primary" type="submit" disabled={isResettingPassword}>
                            {isResettingPassword && <Spinner as="span" animation="border" size="sm" className="me-1" />}
                            Đặt Lại
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmModal} onHide={handleCloseDeleteConfirmModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton><Modal.Title>Xác Nhận Xóa Người Dùng</Modal.Title></Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete?.fullName || userToDelete?.username}</strong>? Hành động này không thể hoàn tác.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteConfirmModal} disabled={isDeletingUser}>Hủy</Button>
                    <Button variant="danger" onClick={handleConfirmDeleteUser} disabled={isDeletingUser}>
                        {isDeletingUser && <Spinner as="span" animation="border" size="sm" className="me-1" />}
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
}

export default SystemUserManagementPage;