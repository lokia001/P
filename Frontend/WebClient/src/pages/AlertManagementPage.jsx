import React, { useState } from 'react';
import './AlertManagementPage.css';

// Mock Data - Thay thế bằng API call khi có backend
const mockAlertRules = [
    { id: 1, name: 'CPU Usage High', description: 'Cảnh báo khi CPU vượt quá 80% trong 5 phút', condition: 'CPU > 80% for 5m', severity: 'Cao', status: true },
    { id: 2, name: 'Memory Leak Detected', description: 'Cảnh báo khi bộ nhớ sử dụng tăng bất thường', condition: 'Memory Usage Pattern', severity: 'Rất Cao', status: true },
    { id: 3, name: 'Disk Space Low', description: 'Cảnh báo khi dung lượng ổ đĩa còn dưới 10%', condition: 'Disk < 10%', severity: 'Trung Bình', status: false },
];

const mockAlertHistory = [
    { id: 1, timestamp: '2023-10-26 10:00:00', ruleName: 'CPU Usage High', description: 'CPU server app-01 đạt 85%', severity: 'Cao', status: 'Chưa xử lý', assignee: 'Admin A' },
    { id: 2, timestamp: '2023-10-26 09:30:00', ruleName: 'Memory Leak Detected', description: 'Service X có dấu hiệu rò rỉ bộ nhớ', severity: 'Rất Cao', status: 'Đang xử lý', assignee: 'SystemAdmin B' },
    { id: 3, timestamp: '2023-10-25 15:00:00', ruleName: 'Disk Space Low', description: 'Ổ đĩa /var đầy 92%', severity: 'Trung Bình', status: 'Đã giải quyết', assignee: 'Admin A' },
    { id: 4, timestamp: '2023-10-24 11:00:00', ruleName: 'CPU Usage High', description: 'CPU server db-01 đạt 90%', severity: 'Cao', status: 'Đã đóng', assignee: 'SystemAdmin B' },
];

const mockNotificationChannels = [
    { id: 1, name: 'Email Admins', type: 'Email', config: 'admins@example.com, ...', status: true },
    { id: 2, name: 'SMS OnCall', type: 'SMS', config: '+1234567890', status: true },
    { id: 3, name: 'Slack #alerts', type: 'Slack', config: 'Webhook URL', status: false },
];

const severityMap = {
    'Rất Cao': { class: 'severity-critical', icon: 'bi-exclamation-octagon-fill', label: 'Rất Cao' },
    'Cao': { class: 'severity-high', icon: 'bi-exclamation-triangle-fill', label: 'Cao' },
    'Trung Bình': { class: 'severity-medium', icon: 'bi-exclamation-circle-fill', label: 'Trung Bình' },
    'Thấp': { class: 'severity-low', icon: 'bi-info-circle-fill', label: 'Thấp' },
};

const statusProcessingMap = {
    'Chưa xử lý': { class: 'status-pending', label: 'Chưa xử lý' },
    'Đang xử lý': { class: 'status-in-progress', label: 'Đang xử lý' },
    'Đã giải quyết': { class: 'status-resolved', label: 'Đã giải quyết' },
    'Đã đóng': { class: 'status-closed', label: 'Đã đóng' },
};


function AlertRulesTab() {
    const [rules, setRules] = useState(mockAlertRules);

    const handleToggleStatus = (id) => {
        setRules(rules.map(rule => rule.id === id ? { ...rule, status: !rule.status } : rule));
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Danh Sách Quy Tắc Cảnh Báo</h2>
                <button className="btn btn-primary">
                    <i className="bi bi-plus-circle-fill me-2"></i>Thêm Quy Tắc Mới
                </button>
            </div>
            <table className="table table-hover align-middle">
                <thead>
                    <tr>
                        <th>Tên Quy Tắc</th>
                        <th>Mô Tả</th>
                        <th>Điều Kiện Kích Hoạt</th>
                        <th>Mức Độ Nghiêm Trọng</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {rules.map(rule => (
                        <tr key={rule.id}>
                            <td>{rule.name}</td>
                            <td>{rule.description}</td>
                            <td><code>{rule.condition}</code></td>
                            <td>
                                <span className={`badge ${severityMap[rule.severity]?.class || 'bg-secondary'}`}>
                                    <i className={`bi ${severityMap[rule.severity]?.icon || 'bi-question-circle'} me-1`}></i>
                                    {severityMap[rule.severity]?.label || rule.severity}
                                </span>
                            </td>
                            <td>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id={`rule-status-${rule.id}`}
                                        checked={rule.status}
                                        onChange={() => handleToggleStatus(rule.id)}
                                    />
                                    <label className="form-check-label" htmlFor={`rule-status-${rule.id}`}>
                                        {rule.status ? 'Bật' : 'Tắt'}
                                    </label>
                                </div>
                            </td>
                            <td>
                                <button className="btn btn-sm btn-outline-primary me-2" title="Sửa">
                                    <i className="bi bi-pencil-fill"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-danger" title="Xóa">
                                    <i className="bi bi-trash-fill"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function AlertHistoryTab() {
    const [history, setHistory] = useState(mockAlertHistory);

    const handleStatusChange = (id, newStatus) => {
        setHistory(history.map(item => item.id === id ? { ...item, status: newStatus } : item));
    };

    return (
        <div>
            <h2 className="mb-3">Lịch Sử Cảnh Báo</h2>
            <div className="filters-bar card mb-3">
                <div className="card-body">
                    <h5 className="card-title">Bộ lọc</h5>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label htmlFor="filter-time" className="form-label">Thời gian</label>
                            <input type="text" className="form-control" id="filter-time" placeholder="DD/MM/YYYY - DD/MM/YYYY" />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="filter-severity" className="form-label">Mức độ nghiêm trọng</label>
                            <select id="filter-severity" className="form-select">
                                <option value="">Tất cả</option>
                                {Object.keys(severityMap).map(sev => (
                                    <option key={sev} value={sev}>{severityMap[sev].label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="filter-status" className="form-label">Trạng thái xử lý</label>
                            <select id="filter-status" className="form-select">
                                <option value="">Tất cả</option>
                                {Object.keys(statusProcessingMap).map(statusKey => (
                                    <option key={statusKey} value={statusKey}>{statusProcessingMap[statusKey].label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="filter-rule" className="form-label">Quy tắc cảnh báo</label>
                            <select id="filter-rule" className="form-select">
                                <option value="">Tất cả</option>
                                {mockAlertRules.map(rule => <option key={rule.id} value={rule.name}>{rule.name}</option>)}
                            </select>
                        </div>
                        <div className="col-12 text-end">
                            <button className="btn btn-primary">Áp dụng</button>
                        </div>
                    </div>
                </div>
            </div>

            <table className="table table-hover align-middle">
                <thead>
                    <tr>
                        <th>Thời Gian Xảy Ra</th>
                        <th>Tên Quy Tắc</th>
                        <th>Mô Tả</th>
                        <th>Mức Độ Nghiêm Trọng</th>
                        <th>Trạng Thái Xử Lý</th>
                        <th>Người Xử Lý</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map(item => (
                        <tr key={item.id}>
                            <td>{item.timestamp}</td>
                            <td>{item.ruleName}</td>
                            <td>{item.description}</td>
                            <td>
                                <span className={`badge ${severityMap[item.severity]?.class || 'bg-secondary'}`}>
                                    <i className={`bi ${severityMap[item.severity]?.icon || 'bi-question-circle'} me-1`}></i>
                                    {severityMap[item.severity]?.label || item.severity}
                                </span>
                            </td>
                            <td>
                                <select
                                    className={`form-select form-select-sm ${statusProcessingMap[item.status]?.class}-select`}
                                    value={item.status}
                                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                >
                                    {Object.keys(statusProcessingMap).map(statusKey => (
                                        <option key={statusKey} value={statusKey}>
                                            {statusProcessingMap[statusKey].label}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>{item.assignee || 'N/A'}</td>
                            <td>
                                <button className="btn btn-sm btn-outline-info" title="Xem chi tiết">
                                    <i className="bi bi-eye-fill"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function NotificationChannelsTab() {
    const [channels, setChannels] = useState(mockNotificationChannels);

    const handleToggleStatus = (id) => {
        setChannels(channels.map(channel => channel.id === id ? { ...channel, status: !channel.status } : channel));
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Danh Sách Kênh Thông Báo</h2>
                <button className="btn btn-primary">
                    <i className="bi bi-plus-circle-fill me-2"></i>Thêm Kênh Mới
                </button>
            </div>
            <table className="table table-hover align-middle">
                <thead>
                    <tr>
                        <th>Tên Kênh</th>
                        <th>Loại Kênh</th>
                        <th>Cấu Hình (Tóm tắt)</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {channels.map(channel => (
                        <tr key={channel.id}>
                            <td>{channel.name}</td>
                            <td><span className="badge bg-info">{channel.type}</span></td>
                            <td>{channel.config}</td>
                            <td>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id={`channel-status-${channel.id}`}
                                        checked={channel.status}
                                        onChange={() => handleToggleStatus(channel.id)}
                                    />
                                    <label className="form-check-label" htmlFor={`channel-status-${channel.id}`}>
                                        {channel.status ? 'Hoạt động' : 'Tạm dừng'}
                                    </label>
                                </div>
                            </td>
                            <td>
                                <button className="btn btn-sm btn-outline-primary me-2" title="Sửa">
                                    <i className="bi bi-pencil-fill"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-danger me-2" title="Xóa">
                                    <i className="bi bi-trash-fill"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-success" title="Kiểm tra">
                                    <i className="bi bi-check-circle-fill"></i> Test
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


function AlertManagementPage() {
    const [activeTab, setActiveTab] = useState('rules'); // 'rules', 'history', 'channels'

    const renderTabContent = () => {
        switch (activeTab) {
            case 'rules':
                return <AlertRulesTab />;
            case 'history':
                return <AlertHistoryTab />;
            case 'channels':
                return <NotificationChannelsTab />;
            default:
                return <AlertRulesTab />;
        }
    };

    return (
        <div className="container-fluid alert-management-page mt-4">
            <h1 className="mb-4 page-title">Quản Lý Cảnh Báo</h1>

            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'rules' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rules')}
                    >
                        Quy Tắc Cảnh Báo
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Lịch Sử Cảnh Báo
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'channels' ? 'active' : ''}`}
                        onClick={() => setActiveTab('channels')}
                    >
                        Cấu Hình Kênh Thông Báo
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>
    );
}

export default AlertManagementPage;