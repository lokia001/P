import React from 'react';
import './SystemDashboard.css';

// Mock data - trong thực tế, dữ liệu này sẽ đến từ API
const mockData = {
    systemOverview: {
        status: 'Operational', // 'Operational', 'Warning', 'Critical'
        statusColor: 'text-success', // 'text-success', 'text-warning', 'text-danger'
        statusIcon: '✅', // Placeholder icon
        uptime: '15 ngày 3 giờ 25 phút',
        osVersion: 'Ubuntu 22.04.1 LTS',
        appVersion: 'v2.5.1',
    },
    cpuUsage: {
        current: 35, // percentage
        history: [30, 32, 35, 33, 34], // last 5 minutes
    },
    ramUsage: {
        current: 60, // percentage
        used: '18.6 GB',
        total: '31.2 GB',
        history: [55, 58, 60, 61, 59],
    },
    diskUsage: [
        { name: '/', used: 68, total: 250, unit: 'GB' },
        { name: '/var', used: 85, total: 100, unit: 'GB' },
        { name: '/data', used: 40, total: 500, unit: 'GB' },
    ],
    networkTraffic: {
        upload: '1.2 Mbps',
        download: '15.5 Mbps',
        // history data for chart
    },
    serviceStatus: [
        { id: 1, name: 'Web Server (Nginx)', status: 'running' }, // 'running', 'stopped', 'warning'
        { id: 2, name: 'Database (PostgreSQL)', status: 'running' },
        { id: 3, name: 'Caching Service (Redis)', status: 'warning' },
        { id: 4, name: 'Message Queue (RabbitMQ)', status: 'stopped' },
        { id: 5, name: 'API Gateway', status: 'running' },
    ],
    recentAlerts: [
        { id: 1, severity: 'High', message: 'CPU usage exceeded 90% on server-01', time: '5 phút trước', color: 'danger' },
        { id: 2, severity: 'Medium', message: 'Disk space on /var is at 85%', time: '30 phút trước', color: 'warning' },
        { id: 3, severity: 'Low', message: 'New user registration spike', time: '1 giờ trước', color: 'info' },
        { id: 4, severity: 'High', message: 'Database connection lost', time: '2 giờ trước', color: 'danger' },
    ],
    recentSystemLogs: [
        { id: 1, level: 'ERROR', message: 'Failed to process payment: Transaction ID 12345', time: '2 phút trước' },
        { id: 2, level: 'WARN', message: 'Unusual login attempt from IP 123.45.67.89', time: '10 phút trước' },
        { id: 3, level: 'INFO', message: 'System backup completed successfully.', time: '1 giờ trước' },
        { id: 4, level: 'ERROR', message: 'Service "EmailSender" failed to start.', time: '3 giờ trước' },
    ],
    scheduledTasks: [
        { id: 1, name: 'Daily Backup', lastRun: 'Hôm nay, 02:00 AM', status: 'Thành công', nextRun: 'Ngày mai, 02:00 AM' },
        { id: 2, name: 'Weekly Report Generation', lastRun: '3 ngày trước', status: 'Thành công', nextRun: '4 ngày nữa' },
        { id: 3, name: 'System Cleanup', lastRun: '1 giờ trước', status: 'Đang chạy', nextRun: 'Hàng giờ' },
        { id: 4, name: 'Security Scan', lastRun: 'Hôm qua, 10:00 PM', status: 'Thất bại', nextRun: 'Tối nay, 10:00 PM' },
    ]
};

const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
        case 'running':
        case 'thành công':
            return 'text-success';
        case 'stopped':
        case 'thất bại':
            return 'text-danger';
        case 'warning':
        case 'đang chạy':
            return 'text-warning';
        default:
            return 'text-muted';
    }
};

const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
        case 'running':
        case 'thành công':
            return <span className="status-icon status-icon-success">⬤</span>; // Green circle
        case 'stopped':
        case 'thất bại':
            return <span className="status-icon status-icon-danger">⬤</span>; // Red circle
        case 'warning':
        case 'đang chạy':
            return <span className="status-icon status-icon-warning">⬤</span>; // Yellow circle
        default:
            return <span className="status-icon status-icon-muted">⬤</span>; // Grey circle
    }
};


const SystemOverviewWidget = ({ data }) => (
    <div className="card system-widget">
        <div className="card-body">
            <h5 className="card-title">Tổng Quan Trạng Thái</h5>
            <div className={`d-flex align-items-center justify-content-center my-3 status-highlight ${data.statusColor}`}>
                <span className="status-icon-large me-2">{data.statusIcon}</span>
                <span className="fw-bold fs-4">{data.status}</span>
            </div>
            <p className="card-text"><strong>Thời gian hoạt động:</strong> {data.uptime}</p>
            <p className="card-text"><strong>Phiên bản hệ điều hành:</strong> {data.osVersion}</p>
            <p className="card-text"><strong>Phiên bản ứng dụng:</strong> {data.appVersion}</p>
        </div>
    </div>
);

const CpuMonitorWidget = ({ data }) => (
    <div className="card system-widget">
        <div className="card-body">
            <h5 className="card-title">Sử Dụng CPU</h5>
            <div className="chart-placeholder my-3">
                <div className="chart-percentage">{data.current}%</div>
                <p className="text-muted small text-center">Biểu đồ đường/tròn (lịch sử 5 phút)</p>
            </div>
            <p className="card-text text-center"><strong>Hiện tại:</strong> {data.current}%</p>
        </div>
    </div>
);

const RamMonitorWidget = ({ data }) => (
    <div className="card system-widget">
        <div className="card-body">
            <h5 className="card-title">Sử Dụng RAM</h5>
            <div className="chart-placeholder my-3">
                <div className="chart-percentage">{data.current}%</div>
                <p className="text-muted small text-center">Biểu đồ đường/tròn (lịch sử 5 phút)</p>
            </div>
            <p className="card-text text-center">
                <strong>Hiện tại:</strong> {data.current}% ({data.used} / {data.total})
            </p>
        </div>
    </div>
);

const DiskUsageWidget = ({ data }) => (
    <div className="card system-widget">
        <div className="card-body">
            <h5 className="card-title">Sử Dụng Đĩa</h5>
            {data.map((disk, index) => (
                <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between">
                        <span>{disk.name}</span>
                        <span>{disk.used}{disk.unit} / {disk.total}{disk.unit} ({Math.round((disk.used / disk.total) * 100)}%)</span>
                    </div>
                    <div className="progress" style={{ height: '20px' }}>
                        <div
                            className={`progress-bar ${disk.used / disk.total > 0.8 ? 'bg-danger' : disk.used / disk.total > 0.6 ? 'bg-warning' : 'bg-success'}`}
                            role="progressbar"
                            style={{ width: `${(disk.used / disk.total) * 100}%` }}
                            aria-valuenow={(disk.used / disk.total) * 100}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            {Math.round((disk.used / disk.total) * 100)}%
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const NetworkTrafficWidget = ({ data }) => (
    <div className="card system-widget">
        <div className="card-body">
            <h5 className="card-title">Lưu Lượng Mạng</h5>
            <div className="chart-placeholder my-3">
                <p className="text-muted small text-center">Biểu đồ đường (Tải lên/Tải xuống)</p>
            </div>
            <p className="card-text"><strong>Tải lên:</strong> {data.upload}</p>
            <p className="card-text"><strong>Tải xuống:</strong> {data.download}</p>
        </div>
    </div>
);

const ServiceStatusWidget = ({ data }) => (
    <div className="card system-widget">
        <div className="card-body">
            <h5 className="card-title">Trạng Thái Dịch Vụ</h5>
            <ul className="list-group list-group-flush">
                {data.map(service => (
                    <li key={service.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {service.name}
                        <span>
                            {getStatusIcon(service.status)}
                            <span className={`ms-2 ${getStatusClass(service.status)}`}>{service.status.charAt(0).toUpperCase() + service.status.slice(1)}</span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const RecentAlertsWidget = ({ data }) => (
    <div className="card system-widget">
        <div className="card-body">
            <h5 className="card-title">Cảnh Báo Gần Đây</h5>
            <ul className="list-group list-group-flush">
                {data.slice(0, 5).map(alert => (
                    <li key={alert.id} className="list-group-item">
                        <div className="d-flex w-100 justify-content-between">
                            <small className={`text-${alert.color} fw-bold`}>
                                {alert.severity === 'High' && '🔴 '}
                                {alert.severity === 'Medium' && '🟡 '}
                                {alert.severity === 'Low' && '🔵 '}
                                {alert.severity}
                            </small>
                            <small className="text-muted">{alert.time}</small>
                        </div>
                        <p className="mb-1 small">{alert.message}</p>
                    </li>
                ))}
            </ul>
            {data.length > 5 && (
                <div className="text-center mt-3">
                    <button className="btn btn-outline-primary btn-sm">Xem tất cả cảnh báo</button>
                </div>
            )}
            {data.length === 0 && <p className="text-muted text-center mt-3">Không có cảnh báo nào.</p>}
        </div>
    </div>
);

const RecentSystemLogsWidget = ({ data }) => (
    <div className="card system-widget">
        <div className="card-body">
            <h5 className="card-title">Nhật Ký Hệ Thống Gần Đây</h5>
            <ul className="list-group list-group-flush">
                {data.slice(0, 5).map(log => (
                    <li key={log.id} className="list-group-item">
                        <div className="d-flex w-100 justify-content-between">
                            <small className={`fw-bold ${log.level === 'ERROR' ? 'text-danger' : log.level === 'WARN' ? 'text-warning' : 'text-info'}`}>
                                [{log.level}]
                            </small>
                            <small className="text-muted">{log.time}</small>
                        </div>
                        <p className="mb-1 small log-message">{log.message}</p>
                    </li>
                ))}
            </ul>
            {data.length > 5 && (
                <div className="text-center mt-3">
                    <button className="btn btn-outline-secondary btn-sm">Xem nhật ký chi tiết</button>
                </div>
            )}
            {data.length === 0 && <p className="text-muted text-center mt-3">Không có nhật ký nào.</p>}
        </div>
    </div>
);

const ScheduledTasksWidget = ({ data }) => (
    <div className="card system-widget">
        <div className="card-body">
            <h5 className="card-title">Tác Vụ Đã Lên Lịch Gần Đây</h5>
            <ul className="list-group list-group-flush">
                {data.slice(0, 4).map(task => (
                    <li key={task.id} className="list-group-item">
                        <div className="d-flex justify-content-between">
                            <strong>{task.name}</strong>
                            <span className={getStatusClass(task.status)}>{task.status}</span>
                        </div>
                        <small className="text-muted">
                            Lần chạy cuối: {task.lastRun} <br />
                            Chạy tiếp theo: {task.nextRun}
                        </small>
                    </li>
                ))}
            </ul>
            {data.length === 0 && <p className="text-muted text-center mt-3">Không có tác vụ nào.</p>}
        </div>
    </div>
);


const SystemDashboard = () => {
    return (
        <div className="container-fluid p-3 system-dashboard-page">
            <h1 className="mb-4">Dashboard Hệ Thống</h1>
            <div className="row">
                {/* Row 1 */}
                <div className="col-xl-4 col-lg-6 col-md-12 mb-4">
                    <SystemOverviewWidget data={mockData.systemOverview} />
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6 mb-4">
                    <CpuMonitorWidget data={mockData.cpuUsage} />
                </div>
                <div className="col-xl-4 col-lg-12 col-md-6 mb-4">
                    <RamMonitorWidget data={mockData.ramUsage} />
                </div>

                {/* Row 2 */}
                <div className="col-lg-6 col-md-12 mb-4">
                    <DiskUsageWidget data={mockData.diskUsage} />
                </div>
                <div className="col-lg-6 col-md-12 mb-4">
                    <NetworkTrafficWidget data={mockData.networkTraffic} />
                </div>

                {/* Row 3 */}
                <div className="col-lg-7 col-md-12 mb-4">
                    <ServiceStatusWidget data={mockData.serviceStatus} />
                </div>
                <div className="col-lg-5 col-md-12 mb-4">
                    <ScheduledTasksWidget data={mockData.scheduledTasks} />
                </div>

                {/* Row 4 */}
                <div className="col-lg-6 col-md-12 mb-4">
                    <RecentAlertsWidget data={mockData.recentAlerts} />
                </div>
                <div className="col-lg-6 col-md-12 mb-4">
                    <RecentSystemLogsWidget data={mockData.recentSystemLogs} />
                </div>
            </div>
        </div>
    );
};

export default SystemDashboard;