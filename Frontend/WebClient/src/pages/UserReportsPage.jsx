import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import './UserReportsPage.css'; // Your custom CSS

// Mock data for reports
const initialMockReports = [
    {
        id: 'R001',
        title: 'Sự cố không thể đăng nhập vào hệ thống',
        senderName: 'Nguyễn Văn A',
        sentTime: new Date(Date.now() - 3600 * 1000 * 1).toISOString(), // 1 hour ago
        type: 'Báo cáo sự cố',
        status: 'Mới',
        priority: 'Cao',
        spaceName: 'Không gian Alpha',
        content: 'Tôi đã cố gắng đăng nhập nhiều lần nhưng hệ thống báo lỗi "Sai thông tin đăng nhập" mặc dù tôi chắc chắn mật khẩu đúng. Vui lòng kiểm tra giúp.',
        senderEmail: 'vana@example.com',
        senderPhone: '0901234567',
        internalNotes: '',
        read: false,
    },
    {
        id: 'R002',
        title: 'Góp ý về giao diện người dùng',
        senderName: 'Trần Thị B',
        sentTime: new Date(Date.now() - 3600 * 1000 * 5).toISOString(), // 5 hours ago
        type: 'Góp ý',
        status: 'Đang xử lý',
        priority: 'Trung bình',
        spaceName: 'Không gian Beta',
        content: 'Giao diện phần quản lý task hơi khó nhìn, màu sắc nên được cải thiện để dễ phân biệt hơn. Cảm ơn team!',
        senderEmail: 'thib@example.com',
        senderPhone: '0907654321',
        internalNotes: 'Đã chuyển cho team UI/UX xem xét.',
        read: true,
    },
    {
        id: 'R003',
        title: 'Đánh giá 5 sao cho dịch vụ',
        senderName: 'Lê Văn C',
        sentTime: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(), // 2 days ago
        type: 'Đánh giá',
        status: 'Đã giải quyết',
        priority: 'Thấp',
        spaceName: 'Không gian Gamma',
        content: 'Dịch vụ rất tốt, hỗ trợ nhanh chóng. Tôi rất hài lòng!',
        senderEmail: 'vanc@example.com',
        senderPhone: '0912345678',
        internalNotes: 'Đã cảm ơn khách hàng.',
        read: true,
    },
    {
        id: 'R004',
        title: 'Yêu cầu tính năng mới: Xuất báo cáo PDF',
        senderName: 'Phạm Thị D',
        sentTime: new Date(Date.now() - 3600 * 1000 * 24 * 5).toISOString(), // 5 days ago
        type: 'Góp ý',
        status: 'Đã đóng',
        priority: 'Trung bình',
        spaceName: 'Không gian Alpha',
        content: 'Tôi muốn có thể xuất các báo cáo công việc hàng tháng ra file PDF để lưu trữ. Tính năng này sẽ rất hữu ích.',
        senderEmail: 'thid@example.com',
        senderPhone: '0987654321',
        internalNotes: 'Tính năng đã được ghi nhận cho bản cập nhật sau.',
        read: true,
    },
];

// Helper function to format date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} giây trước`;
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
};

// Helper function to get badge class based on status/priority
const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'Mới': return 'bg-danger text-white';
        case 'Đang xử lý': return 'bg-warning text-dark';
        case 'Đã giải quyết': return 'bg-success text-white';
        case 'Đã đóng': return 'bg-secondary text-white';
        default: return 'bg-light text-dark';
    }
};

const getPriorityBadgeClass = (priority) => {
    switch (priority) {
        case 'Cao': return 'bg-danger text-white';
        case 'Trung bình': return 'bg-warning text-dark';
        case 'Thấp': return 'bg-info text-white';
        default: return 'bg-light text-dark';
    }
};

const UserReportsPage = () => {
    const [reports, setReports] = useState(initialMockReports);
    const [filteredReports, setFilteredReports] = useState(initialMockReports);
    const [selectedReport, setSelectedReport] = useState(null);
    const [filters, setFilters] = useState({
        type: 'Tất cả',
        status: 'Tất cả',
        startDate: '',
        endDate: '',
        space: 'Tất cả',
        priority: 'Tất cả',
    });
    const [internalNote, setInternalNote] = useState('');

    // Unique values for dropdowns
    const reportTypes = ['Tất cả', ...new Set(initialMockReports.map(r => r.type))];
    const reportStatuses = ['Tất cả', 'Mới', 'Đang xử lý', 'Đã giải quyết', 'Đã đóng'];
    const reportSpaces = ['Tất cả', ...new Set(initialMockReports.map(r => r.spaceName).filter(Boolean))];
    const reportPriorities = ['Tất cả', 'Cao', 'Trung bình', 'Thấp'];

    useEffect(() => {
        let currentReports = [...reports];

        if (filters.type !== 'Tất cả') {
            currentReports = currentReports.filter(r => r.type === filters.type);
        }
        if (filters.status !== 'Tất cả') {
            currentReports = currentReports.filter(r => r.status === filters.status);
        }
        if (filters.priority !== 'Tất cả') {
            currentReports = currentReports.filter(r => r.priority === filters.priority);
        }
        if (filters.space !== 'Tất cả') {
            currentReports = currentReports.filter(r => r.spaceName === filters.space);
        }
        if (filters.startDate) {
            currentReports = currentReports.filter(r => new Date(r.sentTime) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            // Add 1 day to endDate to include the whole day
            const endDate = new Date(filters.endDate);
            endDate.setDate(endDate.getDate() + 1);
            currentReports = currentReports.filter(r => new Date(r.sentTime) < endDate);
        }
        setFilteredReports(currentReports);
        // If the selected report is no longer in the filtered list, deselect it
        if (selectedReport && !currentReports.find(r => r.id === selectedReport.id)) {
            setSelectedReport(null);
        }

    }, [filters, reports, selectedReport]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleReportSelect = (report) => {
        setSelectedReport(report);
        setInternalNote(report.internalNotes || '');
        // Mark as read when selected (optional, can be explicit button)
        if (!report.read) {
            const updatedReports = reports.map(r =>
                r.id === report.id ? { ...r, read: true } : r
            );
            setReports(updatedReports);
        }
    };

    const handleStatusChange = (newStatus) => {
        if (selectedReport) {
            const updatedReport = { ...selectedReport, status: newStatus };
            setSelectedReport(updatedReport);
            setReports(reports.map(r => r.id === selectedReport.id ? updatedReport : r));
        }
    };

    const handlePriorityChange = (newPriority) => {
        if (selectedReport) {
            const updatedReport = { ...selectedReport, priority: newPriority };
            setSelectedReport(updatedReport);
            setReports(reports.map(r => r.id === selectedReport.id ? updatedReport : r));
        }
    };

    const handleSaveInternalNote = () => {
        if (selectedReport) {
            const updatedReport = { ...selectedReport, internalNotes: internalNote };
            setSelectedReport(updatedReport);
            setReports(reports.map(r => r.id === selectedReport.id ? updatedReport : r));
            alert('Ghi chú nội bộ đã được lưu!');
        }
    };

    const toggleReadStatus = () => {
        if (selectedReport) {
            const updatedReport = { ...selectedReport, read: !selectedReport.read };
            setSelectedReport(updatedReport);
            setReports(reports.map(r => r.id === selectedReport.id ? updatedReport : r));
        }
    };

    return (
        <div className="container-fluid user-reports-page p-3">
            <h2 className="mb-4">Báo Cáo Từ Người Dùng</h2>

            {/* Filters Section */}
            <div className="filters-section card p-3 mb-4">
                <div className="row g-3">
                    <div className="col-md-3 col-sm-6">
                        <label htmlFor="typeFilter" className="form-label">Loại</label>
                        <select id="typeFilter" name="type" className="form-select" value={filters.type} onChange={handleFilterChange}>
                            {reportTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <label htmlFor="statusFilter" className="form-label">Trạng thái</label>
                        <select id="statusFilter" name="status" className="form-select" value={filters.status} onChange={handleFilterChange}>
                            {reportStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <label htmlFor="priorityFilter" className="form-label">Mức độ ưu tiên</label>
                        <select id="priorityFilter" name="priority" className="form-select" value={filters.priority} onChange={handleFilterChange}>
                            {reportPriorities.map(priority => <option key={priority} value={priority}>{priority}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <label htmlFor="spaceFilter" className="form-label">Không gian</label>
                        <select id="spaceFilter" name="space" className="form-select" value={filters.space} onChange={handleFilterChange}>
                            {reportSpaces.map(space => <option key={space} value={space}>{space}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <label htmlFor="startDateFilter" className="form-label">Từ ngày</label>
                        <input type="date" id="startDateFilter" name="startDate" className="form-control" value={filters.startDate} onChange={handleFilterChange} />
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <label htmlFor="endDateFilter" className="form-label">Đến ngày</label>
                        <input type="date" id="endDateFilter" name="endDate" className="form-control" value={filters.endDate} onChange={handleFilterChange} />
                    </div>
                </div>
            </div>

            {/* Main Content: List and Detail */}
            <div className="row">
                {/* Report List Section */}
                <div className={`report-list-section ${selectedReport ? 'col-md-5' : 'col-md-12'}`}>
                    <div className="list-group">
                        {filteredReports.length > 0 ? (
                            filteredReports.map(report => (
                                <button
                                    key={report.id}
                                    type="button"
                                    className={`list-group-item list-group-item-action ${selectedReport?.id === report.id ? 'active' : ''} ${!report.read ? 'list-item-unread' : ''}`}
                                    onClick={() => handleReportSelect(report)}
                                >
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1 report-title">{report.title}</h5>
                                        <small className="text-muted">{getTimeAgo(report.sentTime)}</small>
                                    </div>
                                    <p className="mb-1 small">Người gửi: {report.senderName}</p>
                                    {report.spaceName && <p className="mb-1 small text-muted">Không gian: {report.spaceName}</p>}
                                    <div>
                                        <span className={`badge me-2 ${getStatusBadgeClass(report.status)}`}>{report.status}</span>
                                        <span className="badge bg-info me-2 text-dark">{report.type}</span>
                                        {report.priority && <span className={`badge ${getPriorityBadgeClass(report.priority)}`}>{report.priority}</span>}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <p className="text-center p-3">Không có báo cáo nào phù hợp.</p>
                        )}
                    </div>
                </div>

                {/* Report Detail Section */}
                {selectedReport && (
                    <div className="report-detail-section col-md-7">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Chi Tiết Báo Cáo</h4>
                                <button className="btn btn-sm btn-close" onClick={() => setSelectedReport(null)} aria-label="Close"></button>
                            </div>
                            <div className="card-body">
                                <h5>{selectedReport.title}</h5>
                                <hr />
                                <p><strong>Người gửi:</strong> {selectedReport.senderName}</p>
                                {selectedReport.senderEmail && <p><strong>Email:</strong> <a href={`mailto:${selectedReport.senderEmail}`}>{selectedReport.senderEmail}</a></p>}
                                {selectedReport.senderPhone && <p><strong>Điện thoại:</strong> {selectedReport.senderPhone}</p>}
                                <p><strong>Thời gian gửi:</strong> {formatDate(selectedReport.sentTime)}</p>
                                <p><strong>Loại:</strong> {selectedReport.type}</p>
                                {selectedReport.spaceName && <p><strong>Không gian:</strong> {selectedReport.spaceName}</p>}

                                <div className="mb-3">
                                    <label htmlFor="reportStatus" className="form-label"><strong>Trạng thái:</strong></label>
                                    <select
                                        id="reportStatus"
                                        className="form-select form-select-sm w-auto d-inline-block ms-2"
                                        value={selectedReport.status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                    >
                                        {reportStatuses.filter(s => s !== 'Tất cả').map(status => <option key={status} value={status}>{status}</option>)}
                                    </select>
                                </div>

                                {selectedReport.type === 'Báo cáo sự cố' && (
                                    <div className="mb-3">
                                        <label htmlFor="reportPriority" className="form-label"><strong>Mức độ ưu tiên:</strong></label>
                                        <select
                                            id="reportPriority"
                                            className="form-select form-select-sm w-auto d-inline-block ms-2"
                                            value={selectedReport.priority}
                                            onChange={(e) => handlePriorityChange(e.target.value)}
                                        >
                                            {reportPriorities.filter(p => p !== 'Tất cả').map(priority => <option key={priority} value={priority}>{priority}</option>)}
                                        </select>
                                    </div>
                                )}

                                <p><strong>Nội dung:</strong></p>
                                <div className="report-content bg-light p-3 rounded mb-3">
                                    {selectedReport.content.split('\n').map((line, index) => (
                                        <span key={index}>{line}<br /></span>
                                    ))}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="internalNote" className="form-label"><strong>Phản hồi/Ghi chú nội bộ:</strong></label>
                                    <textarea
                                        id="internalNote"
                                        className="form-control"
                                        rows="3"
                                        placeholder="Nhập phản hồi hoặc ghi chú..."
                                        value={internalNote}
                                        onChange={(e) => setInternalNote(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="d-flex flex-wrap gap-2">
                                    <button className="btn btn-primary" onClick={handleSaveInternalNote}>
                                        Lưu Ghi Chú
                                    </button>
                                    <button className="btn btn-outline-secondary" onClick={toggleReadStatus}>
                                        {selectedReport.read ? 'Đánh dấu là chưa đọc' : 'Đánh dấu là đã đọc'}
                                    </button>
                                    <button className="btn btn-success" onClick={() => alert('Chức năng "Gửi phản hồi cho người dùng" chưa được cài đặt.')}>
                                        Gửi phản hồi cho người dùng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserReportsPage;