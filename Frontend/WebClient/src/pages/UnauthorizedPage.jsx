import React from 'react';

function UnauthorizedPage() {
    return (
        <div>
            <h1>Không có quyền truy cập</h1>
            <p>Bạn không được phép xem trang này.</p>
            <Link to="/">Quay về trang chủ</Link>
        </div>
    );
}

export default UnauthorizedPage;