import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './ReportPage.css'; // Import custom CSS

// Helper component cho KPI
const KpiCard = ({ title, value, comparison, isPositive = true }) => (
    <div className="col-md-6 col-lg-3 mb-3">
        <div className="card kpi-card shadow-sm">
            <div className="card-body">
                <h5 className="card-subtitle mb-2 text-muted">{title}</h5>
                <h3 className="card-title">{value}</h3>
                {comparison && (
                    <p className={`comparison ${isPositive ? 'text-success' : 'text-danger'}`}>
                        {comparison}
                    </p>
                )}
            </div>
        </div>
    </div>
);

// Placeholder cho biểu đồ
const ChartPlaceholder = ({ title, height = '300px' }) => (
    <div className="chart-placeholder mb-4" style={{ height }}>
        <p>Biểu đồ: {title}</p>
    </div>
);

// Các thành phần báo cáo chi tiết
const RevenueReport = ({ timeSuffix }) => (
    <div>
        <h3 className="mb-4">Báo Cáo Doanh Thu <small className="text-muted">{timeSuffix}</small></h3>
        <div className="row kpi-container">
            <KpiCard title="Tổng Doanh Thu" value="150.000.000 VNĐ" comparison="+15% so với kỳ trước" isPositive={true} />
            <KpiCard title="Doanh Thu Trung Bình / Đặt Chỗ" value="500.000 VNĐ" comparison="-2% so với kỳ trước" isPositive={false} />
            <KpiCard title="Giao Dịch Thành Công" value="300" comparison="+20 giao dịch" />
            <KpiCard title="Doanh Thu Từ Dịch Vụ Phụ" value="20.000.000 VNĐ" />
        </div>
        <ChartPlaceholder title="Xu hướng doanh thu theo thời gian" />
        <ChartPlaceholder title="Doanh thu theo loại không gian" />
        <h4 className="mt-5 mb-3">Bảng Số Liệu Chi Tiết Doanh Thu</h4>
        <div className="table-responsive">
            <table className="table table-striped table-hover report-table">
                <thead>
                    <tr>
                        <th>Thời gian</th>
                        <th>Loại Không Gian</th>
                        <th>Mã Đặt Chỗ</th>
                        <th>Khách Hàng</th>
                        <th>Doanh Thu (VNĐ)</th>
                        <th>Phương Thức TT</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>01/07/2024 10:00</td>
                        <td>Phòng họp lớn</td>
                        <td>DH00123</td>
                        <td>Công ty ABC</td>
                        <td>1.500.000</td>
                        <td>Chuyển khoản</td>
                    </tr>
                    <tr>
                        <td>01/07/2024 14:00</td>
                        <td>Chỗ ngồi cố định</td>
                        <td>DH00124</td>
                        <td>Nguyễn Văn A</td>
                        <td>200.000</td>
                        <td>Tiền mặt</td>
                    </tr>
                    {/* Add more rows as needed */}
                </tbody>
            </table>
        </div>
    </div>
);

const BookingReport = ({ timeSuffix }) => (
    <div>
        <h3 className="mb-4">Báo Cáo Đặt Chỗ <small className="text-muted">{timeSuffix}</small></h3>
        <div className="row kpi-container">
            <KpiCard title="Tổng Số Đặt Chỗ" value="350" comparison="+10% so với kỳ trước" />
            <KpiCard title="Tỷ Lệ Lấp Đầy TB" value="75%" comparison="+5%" />
            <KpiCard title="Đặt Chỗ Bị Hủy" value="15" comparison="-3 so với kỳ trước" isPositive={false} />
            <KpiCard title="Thời Gian Đặt TB" value="3 giờ" />
        </div>
        <ChartPlaceholder title="Số lượng đặt chỗ theo thời gian" />
        <ChartPlaceholder title="Số lượng đặt chỗ theo loại không gian" />
        <ChartPlaceholder title="Tỷ lệ lấp đầy theo loại không gian (Biểu đồ tròn)" />
        <h4 className="mt-5 mb-3">Bảng Số Liệu Chi Tiết Đặt Chỗ</h4>
        <div className="table-responsive">
            <table className="table table-striped table-hover report-table">
                <thead>
                    <tr>
                        <th>Mã Đặt Chỗ</th>
                        <th>Khách Hàng</th>
                        <th>Loại Không Gian</th>
                        <th>Thời Gian Bắt Đầu</th>
                        <th>Thời Gian Kết Thúc</th>
                        <th>Trạng Thái</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>DH00123</td>
                        <td>Công ty ABC</td>
                        <td>Phòng họp lớn</td>
                        <td>01/07/2024 10:00</td>
                        <td>01/07/2024 12:00</td>
                        <td>Đã hoàn thành</td>
                    </tr>
                    <tr>
                        <td>DH00125</td>
                        <td>Trần Thị B</td>
                        <td>Chỗ ngồi linh hoạt</td>
                        <td>02/07/2024 09:00</td>
                        <td>02/07/2024 17:00</td>
                        <td>Đang sử dụng</td>
                    </tr>
                    {/* Add more rows as needed */}
                </tbody>
            </table>
        </div>
    </div>
);

const CustomerReport = ({ timeSuffix }) => (
    <div>
        <h3 className="mb-4">Báo Cáo Khách Hàng <small className="text-muted">{timeSuffix}</small></h3>
        <div className="row kpi-container">
            <KpiCard title="Tổng Số Khách Hàng" value="500" />
            <KpiCard title="Khách Hàng Mới" value="50" comparison="+5 so với kỳ trước" />
            <KpiCard title="Khách Hàng Quay Lại" value="200" />
            <KpiCard title="Tỷ Lệ Duy Trì KH" value="40%" />
        </div>
        <ChartPlaceholder title="Khách hàng mới và quay lại theo thời gian" />
        <h4 className="mt-5 mb-3">Bảng Số Liệu Chi Tiết Khách Hàng</h4>
        <div className="table-responsive">
            <table className="table table-striped table-hover report-table">
                <thead>
                    <tr>
                        <th>Mã Khách Hàng</th>
                        <th>Tên Khách Hàng</th>
                        <th>Email</th>
                        <th>Số Lần Đặt</th>
                        <th>Tổng Chi Tiêu (VNĐ)</th>
                        <th>Lần Đặt Cuối</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>KH001</td>
                        <td>Nguyễn Văn A</td>
                        <td>a.nguyen@email.com</td>
                        <td>15</td>
                        <td>10.500.000</td>
                        <td>01/07/2024</td>
                    </tr>
                    <tr>
                        <td>KH002</td>
                        <td>Công ty TNHH XYZ</td>
                        <td>contact@xyz.com</td>
                        <td>5</td>
                        <td>25.000.000</td>
                        <td>28/06/2024</td>
                    </tr>
                    {/* Add more rows as needed */}
                </tbody>
            </table>
        </div>
    </div>
);

const SpaceUsageReport = ({ timeSuffix }) => (
    <div>
        <h3 className="mb-4">Báo Cáo Sử Dụng Không Gian <small className="text-muted">{timeSuffix}</small></h3>
        <div className="row kpi-container">
            <KpiCard title="Không Gian Được Sử Dụng Nhiều Nhất" value="Phòng Họp A" />
            <KpiCard title="Giờ Cao Điểm" value="9:00 - 11:00" />
            <KpiCard title="Tổng Giờ Sử Dụng" value="1200 giờ" />
            <KpiCard title="Tỷ Lệ Sử Dụng Trung Bình" value="65%" />
        </div>
        <ChartPlaceholder title="Tần suất sử dụng theo không gian (Số giờ)" />
        <ChartPlaceholder title="Tỷ lệ sử dụng theo giờ trong ngày" />
        <h4 className="mt-5 mb-3">Bảng Số Liệu Chi Tiết Sử Dụng Không Gian</h4>
        <div className="table-responsive">
            <table className="table table-striped table-hover report-table">
                <thead>
                    <tr>
                        <th>Tên Không Gian</th>
                        <th>Loại</th>
                        <th>Số Lượt Sử Dụng</th>
                        <th>Tổng Giờ Sử Dụng</th>
                        <th>Doanh Thu Mang Lại (VNĐ)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Phòng Họp A</td>
                        <td>Phòng họp</td>
                        <td>50</td>
                        <td>150</td>
                        <td>30.000.000</td>
                    </tr>
                    <tr>
                        <td>Chỗ ngồi C12</td>
                        <td>Cố định</td>
                        <td>25</td>
                        <td>200 (theo tháng)</td>
                        <td>5.000.000</td>
                    </tr>
                    {/* Add more rows as needed */}
                </tbody>
            </table>
        </div>
    </div>
);


const ReportPage = () => {
    const [selectedTimePreset, setSelectedTimePreset] = useState('Tháng này');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [compareWithPrevious, setCompareWithPrevious] = useState(false);
    const [activeReportType, setActiveReportType] = useState('Doanh Thu');

    const timePresets = ["Hôm nay", "Tuần này", "Tháng này", "Quý này", "Năm nay"];
    const reportTypes = ["Doanh Thu", "Đặt Chỗ", "Khách Hàng", "Sử Dụng Không Gian"];

    const handleTimePresetChange = (preset) => {
        setSelectedTimePreset(preset);
        // Logic to auto-fill dates or clear custom dates if needed
        if (preset !== "Tùy chỉnh") {
            setCustomStartDate('');
            setCustomEndDate('');
        }
    };

    const getCurrentTimeSuffix = () => {
        if (selectedTimePreset === "Tùy chỉnh" && customStartDate && customEndDate) {
            return `(từ ${customStartDate} đến ${customEndDate})`;
        }
        return `(${selectedTimePreset})`;
    };

    const renderReportContent = () => {
        const timeSuffix = getCurrentTimeSuffix();
        switch (activeReportType) {
            case 'Doanh Thu':
                return <RevenueReport timeSuffix={timeSuffix} />;
            case 'Đặt Chỗ':
                return <BookingReport timeSuffix={timeSuffix} />;
            case 'Khách Hàng':
                return <CustomerReport timeSuffix={timeSuffix} />;
            case 'Sử Dụng Không Gian':
                return <SpaceUsageReport timeSuffix={timeSuffix} />;
            default:
                return <p className="text-center">Vui lòng chọn loại báo cáo.</p>;
        }
    };

    return (
        <div className="container-fluid report-page p-4">
            <header className="report-header d-flex justify-content-between align-items-center p-3 mb-4 bg-light shadow-sm">
                <h1 className="h3 mb-0">Báo Cáo Hoạt Động</h1>
                <div className="dropdown">
                    <button
                        className="btn btn-primary dropdown-toggle"
                        type="button"
                        id="exportDropdown"
                        data-bs-toggle="dropdown" // Bootstrap 5 JS needed for this
                        aria-expanded="false"
                    >
                        Xuất Báo Cáo
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="exportDropdown">
                        <li><a className="dropdown-item" href="#">Dưới dạng CSV</a></li>
                        <li><a className="dropdown-item" href="#">Dưới dạng Excel</a></li>
                        <li><a className="dropdown-item" href="#">Dưới dạng PDF</a></li>
                    </ul>
                </div>
            </header>

            {/* Bộ lọc thời gian */}
            <section className="time-filter-section card mb-4 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title mb-3">Chọn Khoảng Thời Gian</h5>
                    <div className="row align-items-end">
                        <div className="col-md-auto mb-3 time-options">
                            <div className="btn-group" role="group" aria-label="Thời gian cài sẵn">
                                {timePresets.map(preset => (
                                    <button
                                        key={preset}
                                        type="button"
                                        className={`btn ${selectedTimePreset === preset ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => handleTimePresetChange(preset)}
                                    >
                                        {preset}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    className={`btn ${selectedTimePreset === 'Tùy chỉnh' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handleTimePresetChange('Tùy chỉnh')}
                                >
                                    Tùy chỉnh
                                </button>
                            </div>
                        </div>

                        {selectedTimePreset === 'Tùy chỉnh' && (
                            <div className="col-md-6 mb-3 custom-range-picker">
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor="startDate" className="form-label">Từ ngày</label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            className="form-control"
                                            value={customStartDate}
                                            onChange={(e) => setCustomStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="endDate" className="form-label">Đến ngày</label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            className="form-control"
                                            value={customEndDate}
                                            onChange={(e) => setCustomEndDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={`col-md-auto mb-3 ${selectedTimePreset === 'Tùy chỉnh' ? 'align-self-end' : 'ms-md-auto'}`}>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="comparePrevious"
                                    checked={compareWithPrevious}
                                    onChange={(e) => setCompareWithPrevious(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="comparePrevious">
                                    So sánh với kỳ trước
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lựa chọn loại báo cáo */}
            <section className="report-type-selector-section mb-4">
                <ul className="nav nav-tabs report-tabs">
                    {reportTypes.map(type => (
                        <li className="nav-item" key={type}>
                            <a
                                className={`nav-link ${activeReportType === type ? 'active' : ''}`}
                                onClick={() => setActiveReportType(type)}
                                href="#"
                            >
                                {type}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Khu vực hiển thị báo cáo */}
            <section className="report-display-area card shadow-sm">
                <div className="card-body">
                    {renderReportContent()}
                </div>
            </section>

        </div>
    );
};

export default ReportPage;