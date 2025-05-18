import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo Bootstrap đã được import
import './SupportTicketsPage.css'; // File CSS tùy chỉnh của chúng ta

// Dữ liệu mẫu (sẽ thay thế bằng API call sau này)
const initialTickets = [
    {
        id: 'TKT001',
        title: 'Lỗi không đăng nhập được vào workspace XYZ',
        sender: 'user_alpha@example.com',
        status: 'Mới',
        priority: 'Cao',
        createdAt: '2023-10-26 10:00',
        updatedAt: '2023-10-26 10:00',
        content: 'Tôi cố gắng đăng nhập vào workspace XYZ nhưng hệ thống báo lỗi "Sai thông tin đăng nhập" dù tôi chắc chắn mật khẩu đúng. Tôi đã thử reset mật khẩu nhưng không nhận được email.',
        history: [
            { user: 'user_alpha@example.com', message: 'Tôi cố gắng đăng nhập vào workspace XYZ nhưng hệ thống báo lỗi "Sai thông tin đăng nhập" dù tôi chắc chắn mật khẩu đúng. Tôi đã thử reset mật khẩu nhưng không nhận được email.', timestamp: '2023-10-26 10:00' }
        ]
    },
    {
        id: 'TKT002',
        title: 'Yêu cầu nâng cấp dung lượng lưu trữ',
        sender: 'owner_beta@example.com',
        status: 'Đang xử lý',
        priority: 'Trung bình',
        createdAt: '2023-10-25 14:30',
        updatedAt: '2023-10-26 11:00',
        content: 'Workspace của tôi sắp hết dung lượng. Tôi muốn yêu cầu nâng cấp thêm 50GB dung lượng lưu trữ.',
        history: [
            { user: 'owner_beta@example.com', message: 'Workspace của tôi sắp hết dung lượng. Tôi muốn yêu cầu nâng cấp thêm 50GB dung lượng lưu trữ.', timestamp: '2023-10-25 14:30' },
            { user: 'admin_support@example.com', message: 'Đã tiếp nhận yêu cầu, chúng tôi sẽ kiểm tra và phản hồi sớm.', timestamp: '2023-10-26 11:00' }
        ]
    },
    {
        id: 'TKT003',
        title: 'Không thể mời thành viên mới vào workspace',
        sender: 'user_gamma@example.com',
        status: 'Đã giải quyết',
        priority: 'Cao',
        createdAt: '2023-10-24 09:15',
        updatedAt: '2023-10-24 17:00',
        content: 'Khi tôi cố gắng mời thành viên mới bằng email, hệ thống báo "Có lỗi xảy ra, vui lòng thử lại sau".',
        history: [
            { user: 'user_gamma@example.com', message: 'Khi tôi cố gắng mời thành viên mới bằng email, hệ thống báo "Có lỗi xảy ra, vui lòng thử lại sau".', timestamp: '2023-10-24 09:15' },
            { user: 'admin_support@example.com', message: 'Chúng tôi đã kiểm tra và khắc phục sự cố. Bạn vui lòng thử lại.', timestamp: '2023-10-24 16:30' },
            { user: 'user_gamma@example.com', message: 'Đã mời được rồi, cảm ơn team support!', timestamp: '2023-10-24 17:00' }
        ],
        solution: 'Lỗi do cấu hình mail server tạm thời. Đã restart dịch vụ.'
    },
    {
        id: 'TKT004',
        title: 'Góp ý về giao diện trang quản lý workspace',
        sender: 'owner_delta@example.com',
        status: 'Đã đóng',
        priority: 'Thấp',
        createdAt: '2023-10-20 11:00',
        updatedAt: '2023-10-22 10:00',
        content: 'Tôi thấy phần menu bên trái hơi khó sử dụng trên màn hình nhỏ. Có thể cải thiện được không?',
        history: [
            { user: 'owner_delta@example.com', message: 'Tôi thấy phần menu bên trái hơi khó sử dụng trên màn hình nhỏ. Có thể cải thiện được không?', timestamp: '2023-10-20 11:00' },
            { user: 'admin_support@example.com', message: 'Cảm ơn góp ý của bạn. Chúng tôi đã ghi nhận và sẽ xem xét cho các bản cập nhật tiếp theo.', timestamp: '2023-10-22 10:00' }
        ],
        solution: 'Ghi nhận góp ý, chuyển cho đội ngũ phát triển sản phẩm.'
    },
];

// Dữ liệu mẫu cho dropdown người gửi
const sampleUsers = [
    'user_alpha@example.com',
    'owner_beta@example.com',
    'user_gamma@example.com',
    'owner_delta@example.com',
    'new_user@example.com'
];

const SupportTicketsPage = () => {
    const [tickets, setTickets] = useState(initialTickets);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Tất cả');
    const [filterPriority, setFilterPriority] = useState('Tất cả');
    const [filterSender, setFilterSender] = useState('Tất cả');
    const [filterDate, setFilterDate] = useState('');

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [solutionText, setSolutionText] = useState('');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTicketData, setNewTicketData] = useState({
        sender: sampleUsers[0] || '',
        title: '',
        priority: 'Trung bình',
        content: ''
    });

    // Hàm xử lý hiển thị modal chi tiết
    const handleViewDetails = (ticket) => {
        setSelectedTicket(ticket);
        setSolutionText(ticket.solution || '');
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedTicket(null);
        setReplyMessage('');
        setSolutionText('');
    };

    // Hàm xử lý hiển thị modal tạo mới
    const handleShowCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewTicketData({ // Reset form
            sender: sampleUsers[0] || '',
            title: '',
            priority: 'Trung bình',
            content: ''
        });
    };

    const handleNewTicketChange = (e) => {
        const { name, value } = e.target;
        setNewTicketData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateTicket = (e) => {
        e.preventDefault();
        const newId = `TKT${String(tickets.length + 1).padStart(3, '0')}`;
        const now = new Date().toLocaleString('vi-VN');
        const newTicketEntry = {
            id: newId,
            title: newTicketData.title,
            sender: newTicketData.sender,
            status: 'Mới', // Mặc định là mới
            priority: newTicketData.priority,
            createdAt: now,
            updatedAt: now,
            content: newTicketData.content,
            history: [{ user: newTicketData.sender, message: newTicketData.content, timestamp: now }]
        };
        setTickets(prevTickets => [newTicketEntry, ...prevTickets]); // Thêm vào đầu danh sách
        handleCloseCreateModal();
    };


    const handleStatusChangeInModal = (e) => {
        if (selectedTicket) {
            const updatedTicket = { ...selectedTicket, status: e.target.value, updatedAt: new Date().toLocaleString('vi-VN') };
            setSelectedTicket(updatedTicket);
            // Cập nhật cả trong danh sách chính
            setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
        }
    };

    const handlePriorityChangeInModal = (e) => {
        if (selectedTicket) {
            const updatedTicket = { ...selectedTicket, priority: e.target.value, updatedAt: new Date().toLocaleString('vi-VN') };
            setSelectedTicket(updatedTicket);
            setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
        }
    };

    const handleSendReply = () => {
        if (!replyMessage.trim() || !selectedTicket) return;
        const now = new Date().toLocaleString('vi-VN');
        const newHistoryEntry = {
            user: 'admin_support@example.com', // Giả sử admin gửi
            message: replyMessage,
            timestamp: now
        };
        const updatedTicket = {
            ...selectedTicket,
            history: [...selectedTicket.history, newHistoryEntry],
            updatedAt: now,
            // Nếu admin phản hồi, có thể chuyển trạng thái thành "Đã phản hồi" nếu đang là "Mới"
            status: selectedTicket.status === 'Mới' ? 'Đã phản hồi' : selectedTicket.status
        };
        setSelectedTicket(updatedTicket);
        setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
        setReplyMessage('');
    };

    const handleSaveSolution = () => {
        if (!selectedTicket) return;
        const updatedTicket = {
            ...selectedTicket,
            solution: solutionText,
            updatedAt: new Date().toLocaleString('vi-VN')
        };
        setSelectedTicket(updatedTicket);
        setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
        // Có thể đóng modal hoặc thông báo thành công ở đây
    };

    const handleCloseTicket = () => {
        if (!selectedTicket) return;
        const updatedTicket = {
            ...selectedTicket,
            status: 'Đã đóng',
            updatedAt: new Date().toLocaleString('vi-VN')
        };
        setSelectedTicket(updatedTicket);
        setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
        handleCloseDetailModal(); // Đóng modal sau khi đóng ticket
    };


    // Lọc ticket (ví dụ đơn giản)
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearchTerm = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'Tất cả' || ticket.status === filterStatus;
        const matchesPriority = filterPriority === 'Tất cả' || ticket.priority === filterPriority;
        const matchesSender = filterSender === 'Tất cả' || ticket.sender === filterSender;
        const matchesDate = filterDate === '' || new Date(ticket.createdAt.split(' ')[0]).toDateString() === new Date(filterDate).toDateString();

        return matchesSearchTerm && matchesStatus && matchesPriority && matchesSender && matchesDate;
    });

    // Phân trang (logic cơ bản, cần hoàn thiện thêm nếu nhiều dữ liệu)
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 10;
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Mới': return 'status-moi';
            case 'Đang xử lý': return 'status-dang-xu-ly';
            case 'Đã phản hồi': return 'status-da-phan-hoi';
            case 'Đã giải quyết': return 'status-da-giai-quyet';
            case 'Đã đóng': return 'status-da-dong';
            default: return '';
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'Cao': return 'priority-cao';
            case 'Trung bình': return 'priority-trung-binh';
            case 'Thấp': return 'priority-thap';
            default: return '';
        }
    }

    return (
        <div className="container-fluid mt-3 support-tickets-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Hỗ Trợ Kỹ Thuật</h2>
                <button className="btn btn-success" onClick={handleShowCreateModal}>
                    <i className="bi bi-plus-circle me-2"></i>Tạo Ticket Mới
                </button>
            </div>

            {/* Thanh Tìm Kiếm và Bộ Lọc */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-4 col-lg-3">
                            <label htmlFor="searchTerm" className="form-label">Tìm kiếm</label>
                            <input
                                type="text"
                                className="form-control"
                                id="searchTerm"
                                placeholder="Tìm theo ID, tiêu đề"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4 col-lg-2">
                            <label htmlFor="filterStatus" className="form-label">Trạng thái</label>
                            <select
                                id="filterStatus"
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="Tất cả">Tất cả</option>
                                <option value="Mới">Mới</option>
                                <option value="Đang xử lý">Đang xử lý</option>
                                <option value="Đã phản hồi">Đã phản hồi</option>
                                <option value="Đã giải quyết">Đã giải quyết</option>
                                <option value="Đã đóng">Đã đóng</option>
                            </select>
                        </div>
                        <div className="col-md-4 col-lg-2">
                            <label htmlFor="filterPriority" className="form-label">Mức độ ưu tiên</label>
                            <select
                                id="filterPriority"
                                className="form-select"
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                            >
                                <option value="Tất cả">Tất cả</option>
                                <option value="Cao">Cao</option>
                                <option value="Trung bình">Trung bình</option>
                                <option value="Thấp">Thấp</option>
                            </select>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <label htmlFor="filterSender" className="form-label">Người gửi</label>
                            <select
                                id="filterSender"
                                className="form-select"
                                value={filterSender}
                                onChange={(e) => setFilterSender(e.target.value)}
                            >
                                <option value="Tất cả">Tất cả</option>
                                {sampleUsers.map(user => <option key={user} value={user}>{user}</option>)}
                            </select>
                        </div>
                        <div className="col-md-6 col-lg-2">
                            <label htmlFor="filterDate" className="form-label">Thời gian tạo</label>
                            <input
                                type="date"
                                className="form-control"
                                id="filterDate"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh Sách Ticket Hỗ Trợ */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID Ticket</th>
                                    <th>Tiêu Đề</th>
                                    <th>Người Gửi</th>
                                    <th>Trạng Thái</th>
                                    <th>Mức Độ Ưu Tiên</th>
                                    <th>Ngày Tạo</th>
                                    <th>Ngày Cập Nhật</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTickets.length > 0 ? currentTickets.map(ticket => (
                                    <tr key={ticket.id}>
                                        <td>{ticket.id}</td>
                                        <td>{ticket.title}</td>
                                        <td>{ticket.sender}</td>
                                        <td>
                                            <span className={`badge ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${getPriorityClass(ticket.priority)}`}>{ticket.priority}</span>
                                        </td>
                                        <td>{ticket.createdAt}</td>
                                        <td>{ticket.updatedAt}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => handleViewDetails(ticket)}
                                            >
                                                <i className="bi bi-eye me-1"></i>Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">Không có ticket nào phù hợp.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <nav aria-label="Page navigation" className="mt-4 d-flex justify-content-center">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>Trước</button>
                        </li>
                        {[...Array(totalPages).keys()].map(number => (
                            <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                <button onClick={() => paginate(number + 1)} className="page-link">
                                    {number + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>Sau</button>
                        </li>
                    </ul>
                </nav>
            )}


            {/* Modal Chi Tiết Ticket */}
            {selectedTicket && (
                <div className={`modal fade ${showDetailModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showDetailModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi Tiết Ticket #{selectedTicket.id} - {selectedTicket.title}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseDetailModal}></button>
                            </div>
                            <div className="modal-body">
                                <section className="mb-3">
                                    <h6>Thông tin ticket</h6>
                                    <div className="row">
                                        <div className="col-md-6 mb-2">
                                            <strong>Người gửi:</strong> {selectedTicket.sender}
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <strong>Ngày tạo:</strong> {selectedTicket.createdAt}
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <strong>Ngày cập nhật:</strong> {selectedTicket.updatedAt}
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <label htmlFor="ticketStatusModal" className="form-label fw-bold">Trạng thái:</label>
                                            <select
                                                id="ticketStatusModal"
                                                className="form-select form-select-sm"
                                                value={selectedTicket.status}
                                                onChange={handleStatusChangeInModal}
                                            >
                                                <option value="Mới">Mới</option>
                                                <option value="Đang xử lý">Đang xử lý</option>
                                                <option value="Đã phản hồi">Đã phản hồi</option>
                                                <option value="Đã giải quyết">Đã giải quyết</option>
                                                <option value="Đã đóng">Đã đóng</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <label htmlFor="ticketPriorityModal" className="form-label fw-bold">Mức độ ưu tiên:</label>
                                            <select
                                                id="ticketPriorityModal"
                                                className="form-select form-select-sm"
                                                value={selectedTicket.priority}
                                                onChange={handlePriorityChangeInModal}
                                            >
                                                <option value="Cao">Cao</option>
                                                <option value="Trung bình">Trung bình</option>
                                                <option value="Thấp">Thấp</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>
                                <hr />
                                <section className="mb-3">
                                    <h6>Nội dung yêu cầu</h6>
                                    <p style={{ whiteSpace: "pre-wrap" }}>{selectedTicket.content}</p>
                                </section>
                                <hr />
                                <section className="mb-3">
                                    <h6>Lịch sử trao đổi</h6>
                                    <div className="chat-history">
                                        {selectedTicket.history.map((entry, index) => (
                                            <div key={index} className={`chat-message mb-2 ${entry.user.includes('admin') ? 'admin-message' : 'user-message'}`}>
                                                <div className="message-bubble">
                                                    <small className="fw-bold">{entry.user}</small>
                                                    <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>{entry.message}</p>
                                                    <small className="text-muted">{entry.timestamp}</small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                                <hr />
                                <section className="mb-3">
                                    <h6>Thêm phản hồi</h6>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Nhập phản hồi của bạn..."
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                    ></textarea>
                                    <button className="btn btn-primary mt-2" onClick={handleSendReply}>
                                        <i className="bi bi-send me-2"></i>Gửi phản hồi
                                    </button>
                                </section>
                                <hr />
                                <section className="mb-3">
                                    <h6>Giải pháp (tùy chọn)</h6>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Mô tả giải pháp đã thực hiện..."
                                        value={solutionText}
                                        onChange={(e) => setSolutionText(e.target.value)}
                                    ></textarea>
                                    <button className="btn btn-info mt-2" onClick={handleSaveSolution}>
                                        <i className="bi bi-save me-2"></i>Lưu giải pháp
                                    </button>
                                </section>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDetailModal}>Hủy</button>
                                <button type="button" className="btn btn-danger" onClick={handleCloseTicket}>
                                    <i className="bi bi-x-octagon me-2"></i>Đóng Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Tạo Ticket Mới */}
            <div className={`modal fade ${showCreateModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showCreateModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form onSubmit={handleCreateTicket}>
                            <div className="modal-header">
                                <h5 className="modal-title">Tạo Ticket Hỗ Trợ Mới</h5>
                                <button type="button" className="btn-close" onClick={handleCloseCreateModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="newTicketSender" className="form-label">Người gửi</label>
                                    <select
                                        id="newTicketSender"
                                        name="sender"
                                        className="form-select"
                                        value={newTicketData.sender}
                                        onChange={handleNewTicketChange}
                                        required
                                    >
                                        {sampleUsers.map(user => <option key={user} value={user}>{user}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newTicketTitle" className="form-label">Tiêu đề</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="newTicketTitle"
                                        name="title"
                                        value={newTicketData.title}
                                        onChange={handleNewTicketChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newTicketPriority" className="form-label">Mức độ ưu tiên</label>
                                    <select
                                        id="newTicketPriority"
                                        name="priority"
                                        className="form-select"
                                        value={newTicketData.priority}
                                        onChange={handleNewTicketChange}
                                        required
                                    >
                                        <option value="Cao">Cao</option>
                                        <option value="Trung bình">Trung bình</option>
                                        <option value="Thấp">Thấp</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newTicketContent" className="form-label">Nội dung</label>
                                    <textarea
                                        className="form-control"
                                        id="newTicketContent"
                                        name="content"
                                        rows="5"
                                        value={newTicketData.content}
                                        onChange={handleNewTicketChange}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseCreateModal}>Hủy</button>
                                <button type="submit" className="btn btn-primary">
                                    <i className="bi bi-plus-circle me-2"></i>Tạo Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SupportTicketsPage;