import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchSpaces,
    selectManageSpaces,
    selectManageSpaceLoading,
    selectManageSpaceError,
    deleteSpaceAsync
} from '../manageSpaceSlice';
import {
    fetchAmenities,
    selectAmenities
} from '../../amenities/amenitySlice';
import DeleteConfirmationModal from './DeleteConfirmationModal';

function SpaceDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const spaces = useSelector(selectManageSpaces);
    const loading = useSelector(selectManageSpaceLoading);
    const error = useSelector(selectManageSpaceError);
    const amenities = useSelector(selectAmenities);

    const [space, setSpace] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (loading === 'idle' && spaces.length === 0) {
            dispatch(fetchSpaces());
        }
        dispatch(fetchAmenities());
    }, [dispatch]);

    useEffect(() => {
        const found = spaces.find(s => s.id === id);
        setSpace(found);
    }, [spaces, id]);

    const handleDeleteClick = () => setShowDeleteModal(true);

    const confirmDelete = async () => {
        await dispatch(deleteSpaceAsync(space.id));
        setShowDeleteModal(false);
        navigate('/manage-space');
    };

    const cancelDelete = () => setShowDeleteModal(false);

    const getAmenityNames = (ids) => {
        return ids
            ?.map(id => amenities.find(a => a.id === id)?.name)
            .filter(Boolean)
            .join(', ') || 'Không có tiện ích';
    };

    if (loading === 'pending') return <div>Đang tải dữ liệu...</div>;
    if (error) return <div>Lỗi: {error}</div>;
    if (!space) return <div>Không tìm thấy không gian.</div>;

    return (
        <div>
            <h2>Chi tiết không gian: {space.name}</h2>

            <p><strong>Địa chỉ:</strong> {space.address}</p>
            <p><strong>Vĩ độ / Kinh độ:</strong> {space.latitude}, {space.longitude}</p>
            <p><strong>Miêu tả:</strong> {space.description || '(Không có mô tả)'}</p>
            <p><strong>Loại:</strong> {space.type}</p>
            <p><strong>Sức chứa:</strong> {space.capacity} người</p>
            <p><strong>Giá cơ bản:</strong> {space.basePrice?.toLocaleString()}₫</p>
            <p><strong>Trạng thái:</strong> {space.status}</p>
            <p><strong>Thời gian dọn dẹp:</strong> {space.cleaningDurationMinutes} phút</p>
            <p><strong>Giờ hoạt động:</strong> {space.openTime} - {space.closeTime}</p>
            <p><strong>Thời gian đặt tối thiểu:</strong> {space.minBookingDurationMinutes} phút</p>
            <p><strong>Thời gian đặt tối đa:</strong> {space.maxBookingDurationMinutes} phút</p>
            <p><strong>Báo hủy trước:</strong> {space.cancellationNoticeHours} giờ</p>
            <p><strong>Hướng dẫn vào chỗ:</strong> {space.accessInstructions || '(Không có)'}</p>
            <p><strong>Nội quy:</strong> {space.houseRules || '(Không có)'}</p>
            <p><strong>Phương thức thanh toán:</strong> {space.paymentMethodsSupported || '(Không có)'}</p>
            <p><strong>Tiện ích:</strong> {getAmenityNames(space.amenities)}</p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                {space.imageUrls?.length > 0 ? space.imageUrls.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={`Ảnh ${index + 1}`}
                        style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                )) : <p>Không có ảnh hiển thị.</p>}
            </div>

            <br />
            <button onClick={() => navigate(`/space/edit/${space.id}`)}>Sửa</button>
            <button onClick={handleDeleteClick}>Xóa</button>

            {showDeleteModal && (
                <DeleteConfirmationModal
                    space={space}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
}

export default SpaceDetails;
