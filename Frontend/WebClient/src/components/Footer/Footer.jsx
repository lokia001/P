import React from 'react';
import './Footer.css'; // Import CSS cho Footer

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <h3>ORDER.VN</h3>
                    <ul>
                        <li><a href="#">Về Chúng Tôi</a></li>
                        <li><a href="#">Order Là Gì</a></li>
                        <li><a href="#">Sản Phẩm</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Hỗ Trợ</h3>
                    <ul>
                        <li>Tư Vấn Dịch Vụ: 1232323</li>
                        <li>Hỗ Trợ Sử Dụng: 1232323</li>
                        <li>EMAIL: hotro@email.com (thay thế email thật)</li>
                        <li>Thời gian: Từ 7h00 - 22h00 các ngày</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Hợp Tác</h3>
                    <ul>
                        <li><a href="#">Liên Hệ Hợp Tác</a></li>
                        <li><a href="#">Liên Hệ Đầu Tư</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Liên Hệ</h3>
                    <ul>
                        <li><a href="#">FB</a></li>
                        <li><a href="#">EMAIL</a></li>
                        <li>ORDER VN</li>
                        <li>Trụ sở tại Z115, Quyết Thắng, TP. Thái Nguyên</li>
                    </ul>
                </div>
            </div>
            <div className="footer-copyright">
                COPYRIGHT © 2025 GITH
            </div>
        </footer>
    );
}

export default Footer;