import React, { useState, useMemo, useEffect } from 'react';
import './StaffManagement.css'; // Giữ lại CSS tùy chỉnh nếu có
// Đảm bảo 'bootstrap-icons/font/bootstrap-icons.css' đã được import ở main.jsx hoặc App.jsx

// Mock data - trong ứng dụng thực tế, dữ liệu này sẽ từ API
const initialStaffList = [
    {
        id: 'NV001',
        staffName: 'Nguyễn Văn A',
        email: 'vana@example.com',
        phoneNumber: '0901234567',
        role: 'Quản lý',
        status: 'Đang làm việc',
        startDate: '2022-08-15',
        department: 'Ban Giám Đốc' // (Tùy chọn) Thêm thông tin bộ phận
    },
    {
        id: 'NV002',
        staffName: 'Trần Thị B',
        email: 'thib@example.com',
        phoneNumber: '0902345678',
        role: 'Lễ tân',
        status: 'Đang làm việc',
        startDate: '2023-01-20',
        department: 'Hành chính'
    },
    {
        id: 'NV003',
        staffName: 'Lê Văn C',
        email: 'vanc@example.com',
        phoneNumber: '0903456789',
        role: 'Kỹ thuật',
        status: 'Nghỉ phép',
        startDate: '2022-05-10',
        department: 'IT'
    },
    {
        id: 'NV004',
        staffName: 'Phạm Thị D',
        email: 'thid@example.com',
        phoneNumber: '0904567890',
        role: 'Marketing',
        status: 'Đã nghỉ',
        startDate: '2021-11-01',
        department: 'Marketing'
    },
    {
        id: 'NV005',
        staffName: 'Hoàng Văn E',
        email: 'vane@example.com',
        phoneNumber: '0905678901',
        role: 'Lễ tân',
        status: 'Đang làm việc',
        startDate: '2023-03-01',
        department: 'Hành chính'
    },
];

const ITEMS_PER_PAGE = 5;

function StaffManagement() {
    const [staffList, setStaffList] = useState(initialStaffList);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tất cả');
    const [roleFilter, setRoleFilter] = useState('Tất cả');
    const [departmentFilter, setDepartmentFilter] = useState('Tất cả'); // (Tùy chọn)

    const [sortConfig, setSortConfig] = useState({ key: 'staffName', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);

    // Khởi tạo tooltips của Bootstrap
    useEffect(() => {
        // Cần có window.bootstrap từ import 'bootstrap/dist/js/bootstrap.bundle.min.js';
        if (window.bootstrap && typeof window.bootstrap.Tooltip === 'function') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new window.bootstrap.Tooltip(tooltipTriggerEl);
            });
            // Cleanup function để dispose tooltips khi component unmount hoặc re-render
            return () => {
                tooltipList.forEach(tooltip => tooltip.dispose());
            };
        }
    }, [staffList, currentPage, searchTerm, statusFilter, roleFilter]); // Re-run khi dữ liệu thay đổi để tooltips mới được tạo

    const uniqueRoles = useMemo(() => {
        const roles = new Set(initialStaffList.map(staff => staff.role));
        return ['Tất cả', ...Array.from(roles)];
    }, []);

    const uniqueDepartments = useMemo(() => { // (Tùy chọn)
        const departments = new Set(initialStaffList.map(staff => staff.department).filter(Boolean));
        return ['Tất cả', ...Array.from(departments)];
    }, []);


    const filteredStaff = useMemo(() => {
        let filtered = [...staffList];
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(staff =>
                staff.staffName.toLowerCase().includes(lowerSearchTerm) ||
                staff.email.toLowerCase().includes(lowerSearchTerm) ||
                staff.phoneNumber.includes(lowerSearchTerm) ||
                staff.role.toLowerCase().includes(lowerSearchTerm) ||
                (staff.department && staff.department.toLowerCase().includes(lowerSearchTerm))
            );
        }
        if (statusFilter !== 'Tất cả') {
            filtered = filtered.filter(staff => staff.status === statusFilter);
        }
        if (roleFilter !== 'Tất cả') {
            filtered = filtered.filter(staff => staff.role === roleFilter);
        }
        if (departmentFilter !== 'Tất cả' && departmentFilter) { // (Tùy chọn)
            filtered = filtered.filter(staff => staff.department === departmentFilter);
        }
        return filtered;
    }, [staffList, searchTerm, statusFilter, roleFilter, departmentFilter]);

    const sortedStaff = useMemo(() => {
        let sortableItems = [...filteredStaff];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key] || ''; // Handle undefined for sorting
                const valB = b[sortConfig.key] || '';
                if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredStaff, sortConfig]);

    const paginatedStaff = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedStaff.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedStaff, currentPage]);

    const totalPages = Math.ceil(sortedStaff.length / ITEMS_PER_PAGE);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? <i className="bi bi-sort-up"></i> : <i className="bi bi-sort-down"></i>;
        }
        return <i className="bi bi-filter"></i>; // Hoặc một icon trung tính hơn như bi-arrow-down-up
    };

    // Hàm để lấy chi tiết trạng thái (màu sắc, icon)
    const getStatusDetails = (status) => {
        switch (status) {
            case 'Đang làm việc':
                return { badgeClass: 'bg-success', iconClass: 'bi-person-check-fill', text: 'Đang làm việc' };
            case 'Nghỉ phép':
                return { badgeClass: 'bg-warning text-dark', iconClass: 'bi-calendar-event-fill', text: 'Nghỉ phép' };
            case 'Đã nghỉ':
                return { badgeClass: 'bg-secondary', iconClass: 'bi-person-x-fill', text: 'Đã nghỉ' };
            default:
                return { badgeClass: 'bg-light text-dark', iconClass: 'bi-question-circle-fill', text: status };
        }
    };

    const handleAddNewStaff = () => console.log("Mở form thêm nhân viên mới");
    const handleViewDetails = (staffId) => console.log("Xem chi tiết nhân viên:", staffId);
    const handleEditInfo = (staffId) => console.log("Sửa thông tin nhân viên:", staffId);
    const handleManagePermissions = (staffId) => console.log("Quản lý quyền hạn cho:", staffId);

    const handleChangeStatus = (staffId, currentStatus) => {
        // Logic thay đổi trạng thái thực tế (ví dụ: mở modal chọn trạng thái)
        // Tạm thời, chúng ta sẽ chuyển đổi giữa "Đang làm việc" và "Nghỉ phép"
        let newStatus = currentStatus;
        if (currentStatus === 'Đang làm việc') newStatus = 'Nghỉ phép';
        else if (currentStatus === 'Nghỉ phép') newStatus = 'Đang làm việc';
        // Không cho thay đổi nếu đã nghỉ, trừ khi có logic đặc biệt
        if (currentStatus === 'Đã nghỉ') {
            console.log("Không thể thay đổi trạng thái cho nhân viên đã nghỉ từ UI này.");
            return;
        }

        console.log("Thay đổi trạng thái nhân viên:", staffId, "từ", currentStatus, "thành", newStatus);
        setStaffList(prevList =>
            prevList.map(staff =>
                staff.id === staffId ? { ...staff, status: newStatus } : staff
            )
        );
    };

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);
        else if (currentPage === 0 && totalPages > 0) setCurrentPage(1);
    }, [currentPage, totalPages]);

    return (
        <div className="container-fluid staff-management-page p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3 mb-0 text-gray-800">Quản Lý Nhân Viên</h1>
                <button className="btn btn-primary" onClick={handleAddNewStaff}>
                    <i className="bi bi-plus-circle-fill me-2"></i>Thêm Nhân Viên
                </button>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-lg-4 col-md-12 mb-2 mb-lg-0">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm theo tên, email, SĐT, vai trò..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <div className="col-lg-2 col-md-4 mb-2 mb-md-0">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="Tất cả">Tất cả trạng thái</option>
                                <option value="Đang làm việc">Đang làm việc</option>
                                <option value="Nghỉ phép">Nghỉ phép</option>
                                <option value="Đã nghỉ">Đã nghỉ</option>
                            </select>
                        </div>
                        <div className="col-lg-2 col-md-4 mb-2 mb-md-0">
                            <select
                                className="form-select"
                                value={roleFilter}
                                onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                            >
                                {uniqueRoles.map(role => (
                                    <option key={role} value={role}>{role === 'Tất cả' ? 'Tất cả vai trò' : role}</option>
                                ))}
                            </select>
                        </div>
                        {/* (Tùy chọn) Bộ lọc bộ phận */}
                        <div className="col-lg-2 col-md-4">
                            <select
                                className="form-select"
                                value={departmentFilter}
                                onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
                            >
                                {uniqueDepartments.map(dept => (
                                    <option key={dept} value={dept}>{dept === 'Tất cả' ? 'Tất cả bộ phận' : dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Danh sách nhân viên</h6>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0"> {/* align-middle cho nội dung cell */}
                            <thead className="table-light">
                                <tr>
                                    {[
                                        { key: 'id', label: 'ID' },
                                        { key: 'staffName', label: 'Tên Nhân Viên' },
                                        { key: 'email', label: 'Email' },
                                        { key: 'phoneNumber', label: 'Số Điện Thoại', sortable: false },
                                        { key: 'role', label: 'Vai Trò' },
                                        { key: 'department', label: 'Bộ Phận' }, // (Tùy chọn)
                                        { key: 'status', label: 'Trạng Thái' },
                                        { key: 'startDate', label: 'Ngày Bắt Đầu' },
                                        { key: 'actions', label: 'Hành Động', sortable: false },
                                    ].map(col => (
                                        <th
                                            key={col.key}
                                            onClick={() => col.sortable !== false && requestSort(col.key)}
                                            className={col.sortable !== false ? 'sortable' : ''}
                                            scope="col"
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>{col.label}</span>
                                                {col.sortable !== false && <span className="sort-indicator ms-1">{getSortIndicator(col.key)}</span>}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedStaff.length > 0 ? (
                                    paginatedStaff.map((staff) => {
                                        const statusDetails = getStatusDetails(staff.status);
                                        return (
                                            <tr key={staff.id}>
                                                <td>{staff.id}</td>
                                                <td>{staff.staffName}</td>
                                                <td>{staff.email}</td>
                                                <td>{staff.phoneNumber}</td>
                                                <td>{staff.role}</td>
                                                <td>{staff.department || 'N/A'}</td> {/* (Tùy chọn) */}
                                                <td>
                                                    <span className={`badge ${statusDetails.badgeClass} d-inline-flex align-items-center px-2 py-1`}>
                                                        <i className={`bi ${statusDetails.iconClass} me-1`}></i>
                                                        {statusDetails.text}
                                                    </span>
                                                </td>
                                                <td>{staff.startDate}</td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary p-1"
                                                            onClick={() => handleViewDetails(staff.id)}
                                                            data-bs-toggle="tooltip" data-bs-placement="top" title="Xem chi tiết"
                                                        >
                                                            <i className="bi bi-eye-fill"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-secondary p-1"
                                                            onClick={() => handleEditInfo(staff.id)}
                                                            data-bs-toggle="tooltip" data-bs-placement="top" title="Sửa thông tin"
                                                        >
                                                            <i className="bi bi-pencil-fill"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-info p-1"
                                                            onClick={() => handleManagePermissions(staff.id)}
                                                            data-bs-toggle="tooltip" data-bs-placement="top" title="Quản lý quyền hạn"
                                                        >
                                                            <i className="bi bi-key-fill"></i>
                                                        </button>
                                                        <button
                                                            className={`btn btn-sm p-1 ${staff.status === 'Đã nghỉ' ? 'btn-outline-danger disabled' : 'btn-outline-warning'}`}
                                                            onClick={() => handleChangeStatus(staff.id, staff.status)}
                                                            data-bs-toggle="tooltip" data-bs-placement="top"
                                                            title={
                                                                staff.status === 'Đã nghỉ' ? 'Đã nghỉ' :
                                                                    staff.status === 'Đang làm việc' ? 'Chuyển sang Nghỉ phép' : 'Chuyển sang Đang làm việc'
                                                            }
                                                            disabled={staff.status === 'Đã nghỉ'}
                                                        >
                                                            <i className="bi bi-arrow-repeat"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center p-3"> {/* Cập nhật colSpan */}
                                            Không tìm thấy nhân viên nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {totalPages > 1 && (
                <nav aria-label="Page navigation" className="mt-4 d-flex justify-content-center">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Trước</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Sau</button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}

export default StaffManagement;