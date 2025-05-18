import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo Bootstrap đã được import
import './SystemLogs.css'; // File CSS tùy chỉnh của chúng ta

// Giả lập dữ liệu nhật ký
const mockLogsData = [
    {
        id: 1,
        timestamp: '2023-10-27 10:00:00',
        severity: 'Lỗi',
        source: 'Web Server',
        message: 'Critical error on checkout process - payment gateway timeout. User ID: 123, Order ID: 456. Stack trace: ...',
    },
    {
        id: 2,
        timestamp: '2023-10-27 10:05:00',
        severity: 'Cảnh báo',
        source: 'Database',
        message: 'High query latency detected for users_table. Query: SELECT * FROM users WHERE last_login < ...',
    },
    {
        id: 3,
        timestamp: '2023-10-27 10:10:00',
        severity: 'Thông tin',
        source: 'Hệ thống',
        message: 'User admin_01 logged in successfully from IP 192.168.1.100.',
    },
    {
        id: 4,
        timestamp: '2023-10-27 10:15:00',
        severity: 'Gỡ lỗi',
        source: 'API Gateway',
        message: 'Request received: /api/v1/workspaces, params: {page: 1, limit: 10}, User-Agent: PostmanRuntime/7.29.0',
    },
    {
        id: 5,
        timestamp: '2023-10-27 09:55:00',
        severity: 'Lỗi',
        source: 'Hệ thống',
        message: 'Failed to start background job: EmailNotificationService. Reason: Connection refused.',
    },
    {
        id: 6,
        timestamp: '2023-10-27 11:20:00',
        severity: 'Thông tin',
        source: 'Authentication',
        message: 'User "user_test@example.com" changed password.',
    },
    {
        id: 7,
        timestamp: '2023-10-27 11:25:00',
        severity: 'Cảnh báo',
        source: 'Web Server',
        message: 'Disk space on /var/log is nearing 85% capacity.',
    },
];

const SystemLogs = () => {
    // State cho các bộ lọc (ví dụ, có thể mở rộng sau)
    const [searchTerm, setSearchTerm] = useState('');
    const [timeRange, setTimeRange] = useState('Hôm nay');
    const [severity, setSeverity] = useState('Tất cả');
    const [source, setSource] = useState('Tất cả');
    const [autoRefresh, setAutoRefresh] = useState(false);

    // Hàm xử lý khi thay đổi mức độ nghiêm trọng để áp dụng màu
    const getSeverityClass = (logSeverity) => {
        switch (logSeverity) {
            case 'Lỗi':
                return 'severity-error';
            case 'Cảnh báo':
                return 'severity-warning';
            case 'Thông tin':
                return 'severity-info';
            case 'Gỡ lỗi':
                return 'severity-debug';
            default:
                return '';
        }
    };

    return (
        <div className="container-fluid system-logs-page p-3">
            <h2 className="mb-4">Nhật Ký Hệ Thống</h2>

            {/* Thanh Tìm Kiếm và Bộ Lọc */}
            <div className="filters-bar card p-3 mb-4">
                <div className="row g-3 align-items-end">
                    {/* Tìm kiếm */}
                    <div className="col-md-4 col-lg-3">
                        <label htmlFor="searchInput" className="form-label">
                            Tìm kiếm trong nhật ký
                        </label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                id="searchInput"
                                placeholder="Nhập từ khóa"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn btn-primary" type="button">
                                {/* Sử dụng text nếu không có icon, hoặc bạn có thể dùng Bootstrap Icons */}
                                {/* <i className="bi bi-search"></i>  */}
                                Tìm
                            </button>
                        </div>
                    </div>

                    {/* Thời gian */}
                    <div className="col-md-4 col-lg-2">
                        <label htmlFor="timeRangeFilter" className="form-label">
                            Thời gian
                        </label>
                        <select
                            className="form-select"
                            id="timeRangeFilter"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="Hôm nay">Hôm nay</option>
                            <option value="Hôm qua">Hôm qua</option>
                            <option value="Tuần này">Tuần này</option>
                            <option value="Tháng này">Tháng này</option>
                            <option value="Tùy chỉnh">Tùy chỉnh</option>
                        </select>
                    </div>
                    {/* Nếu chọn "Tùy chỉnh", bạn có thể hiện các input date range ở đây */}

                    {/* Mức độ nghiêm trọng */}
                    <div className="col-md-4 col-lg-2">
                        <label htmlFor="severityFilter" className="form-label">
                            Mức độ
                        </label>
                        <select
                            className="form-select"
                            id="severityFilter"
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value)}
                        >
                            <option value="Tất cả">Tất cả</option>
                            <option value="Lỗi">Lỗi</option>
                            <option value="Cảnh báo">Cảnh báo</option>
                            <option value="Thông tin">Thông tin</option>
                            <option value="Gỡ lỗi">Gỡ lỗi</option>
                        </select>
                    </div>

                    {/* Nguồn */}
                    <div className="col-md-4 col-lg-2">
                        <label htmlFor="sourceFilter" className="form-label">
                            Nguồn
                        </label>
                        <select
                            className="form-select"
                            id="sourceFilter"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                        >
                            <option value="Tất cả">Tất cả</option>
                            <option value="Hệ thống">Hệ thống</option>
                            <option value="Web Server">Web Server</option>
                            <option value="Database">Database</option>
                            <option value="API Gateway">API Gateway</option>
                            <option value="Authentication">Authentication</option>
                        </select>
                    </div>

                    {/* Tự động làm mới (Tùy chọn) */}
                    <div className="col-md-4 col-lg-3 d-flex align-items-end">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoRefreshCheck"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="autoRefreshCheck">
                                Tự động làm mới
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh Sách Nhật Ký */}
            <div className="logs-table-container card">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th scope="col" className="col-time">Thời Gian ⇅</th>
                                <th scope="col" className="col-severity">Mức Độ</th>
                                <th scope="col" className="col-source">Nguồn</th>
                                <th scope="col" className="col-message">Nội Dung</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockLogsData.map((log) => (
                                <tr key={log.id}>
                                    <td className="text-nowrap">{log.timestamp}</td>
                                    <td>
                                        <span className={`badge ${getSeverityClass(log.severity)}`}>
                                            {log.severity}
                                        </span>
                                    </td>
                                    <td className="text-nowrap">{log.source}</td>
                                    <td className="log-message-content">{log.message}</td>
                                </tr>
                            ))}
                            {mockLogsData.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center p-5">Không có nhật ký nào để hiển thị.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Phân trang */}
            {mockLogsData.length > 0 && (
                <div className="pagination-controls mt-4 d-flex justify-content-between align-items-center">
                    <div>
                        <span>Trang 1 / 10</span> {/* Giả lập */}
                    </div>
                    <nav aria-label="Page navigation">
                        <ul className="pagination mb-0">
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="First">
                                    « Đầu
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Previous">
                                    {"<"}
                                </a>
                            </li>
                            <li className="page-item active">
                                <a className="page-link" href="#">
                                    1
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    2
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    3
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Next">
                                    {">"}
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Last">
                                    Cuối »
                                </a>
                            </li>
                        </ul>
                    </nav>
                    {/* (Tùy chọn) Trường nhập liệu để chuyển đến trang cụ thể */}
                    <div className="go-to-page ms-3" style={{ width: '150px' }}>
                        <div className="input-group input-group-sm">
                            <input type="number" className="form-control" placeholder="Đến trang..." min="1" />
                            <button className="btn btn-outline-secondary" type="button">Đi</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemLogs;