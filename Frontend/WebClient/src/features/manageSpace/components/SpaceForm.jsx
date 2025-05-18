import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageUpload from './ImageUpload';
import { createSpaceAsync, updateSpaceAsync } from '../manageSpaceSlice';
import { fetchAmenities, selectAmenities } from '../../amenities/amenitySlice';

function SpaceForm({ initialData = {}, onSubmit }) {
    const dispatch = useDispatch();
    const amenities = useSelector(selectAmenities);
    const loading = useSelector(state => state.amenities.loading);
    const error = useSelector(state => state.amenities.error);

    const [name, setName] = useState(initialData.name || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [address, setAddress] = useState(initialData.address || '');
    const [latitude, setLatitude] = useState(initialData.latitude || '');
    const [longitude, setLongitude] = useState(initialData.longitude || '');
    const [type, setType] = useState(initialData.type || 'Individual');
    const [capacity, setCapacity] = useState(initialData.capacity || '');
    const [price, setPrice] = useState(initialData.basePrice || '');
    const [status, setStatus] = useState(initialData.status || 'Available');
    const [cleaningDuration, setCleaningDuration] = useState(initialData.cleaningDurationMinutes || 0);
    const [openTime, setOpenTime] = useState(initialData.openTime || '');
    const [closeTime, setCloseTime] = useState(initialData.closeTime || '');
    const [minBooking, setMinBooking] = useState(initialData.minBookingDurationMinutes || '');
    const [maxBooking, setMaxBooking] = useState(initialData.maxBookingDurationMinutes || '');
    const [cancellationNotice, setCancellationNotice] = useState(initialData.cancellationNoticeHours || '');
    const [accessInstructions, setAccessInstructions] = useState(initialData.accessInstructions || '');
    const [houseRules, setHouseRules] = useState(initialData.houseRules || '');
    const [paymentMethods, setPaymentMethods] = useState(initialData.paymentMethodsSupported || '');
    const [selectedAmenities, setSelectedAmenities] = useState(initialData.amenities || []);
    const [imageUrls, setImageUrls] = useState(initialData.imageUrls || []);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        dispatch(fetchAmenities());
    }, [dispatch]);

    const handleImagesChange = (newImages) => {
        setImageUrls(newImages.map(image => image.url));
    };

    const handleAmenityChange = (amenityId) => {
        setSelectedAmenities(prev =>
            prev.includes(amenityId)
                ? prev.filter(id => id !== amenityId)
                : [...prev, amenityId]
        );
    };

    const handleSubmit = async () => {
        const newSpace = {
            id: initialData.id,
            Name: name,
            Description: description,
            Address: address,
            Latitude: parseFloat(latitude),
            Longitude: parseFloat(longitude),
            Type: type,
            Capacity: parseInt(capacity),
            BasePrice: parseFloat(price),
            Status: status,
            CleaningDurationMinutes: parseInt(cleaningDuration),
            OpenTime: openTime,
            CloseTime: closeTime,
            MinBookingDurationMinutes: parseInt(minBooking),
            MaxBookingDurationMinutes: parseInt(maxBooking),
            CancellationNoticeHours: parseInt(cancellationNotice),
            AccessInstructions: accessInstructions,
            HouseRules: houseRules,
            PaymentMethodsSupported: paymentMethods,
            Amenities: selectedAmenities,
            ImageUrls: imageUrls,
        };

        try {
            if (initialData.id) {
                await dispatch(updateSpaceAsync(newSpace));
            } else {
                await dispatch(createSpaceAsync(newSpace));
            }
            if (onSubmit) onSubmit();
        } catch (err) {
            setFormError('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div>
            {formError && <div className="error">{formError}</div>}

            <label>Tên:</label>
            <input value={name} onChange={e => setName(e.target.value)} required />

            <label>Mô tả:</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} />

            <label>Địa chỉ:</label>
            <input value={address} onChange={e => setAddress(e.target.value)} required />

            <label>Vĩ độ (latitude):</label>
            <input type="number" value={latitude} onChange={e => setLatitude(e.target.value)} />

            <label>Kinh độ (longitude):</label>
            <input type="number" value={longitude} onChange={e => setLongitude(e.target.value)} />

            <label>Loại không gian:</label>
            <select value={type} onChange={e => setType(e.target.value)}>
                <option value="Individual">Cá nhân</option>
                <option value="Group">Nhóm</option>
                <option value="MeetingRoom">Phòng họp</option>
                <option value="EntireOffice">Văn phòng riêng</option>
            </select>

            <label>Sức chứa:</label>
            <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} />

            <label>Giá cơ bản:</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} />

            <label>Trạng thái:</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Available">Sẵn sàng</option>
                <option value="Booked">Đã đặt</option>
                <option value="Maintenance">Bảo trì</option>
            </select>

            <label>Thời gian dọn dẹp (phút):</label>
            <input type="number" value={cleaningDuration} onChange={e => setCleaningDuration(e.target.value)} />

            <label>Giờ mở cửa:</label>
            <input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)} />

            <label>Giờ đóng cửa:</label>
            <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)} />

            <label>Thời gian đặt tối thiểu (phút):</label>
            <input type="number" value={minBooking} onChange={e => setMinBooking(e.target.value)} />

            <label>Thời gian đặt tối đa (phút):</label>
            <input type="number" value={maxBooking} onChange={e => setMaxBooking(e.target.value)} />

            <label>Thời gian báo hủy tối thiểu (giờ):</label>
            <input type="number" value={cancellationNotice} onChange={e => setCancellationNotice(e.target.value)} />

            <label>Hướng dẫn vào chỗ:</label>
            <textarea value={accessInstructions} onChange={e => setAccessInstructions(e.target.value)} />

            <label>Nội quy:</label>
            <textarea value={houseRules} onChange={e => setHouseRules(e.target.value)} />

            <label>Phương thức thanh toán:</label>
            <input value={paymentMethods} onChange={e => setPaymentMethods(e.target.value)} />

            <label>Tiện nghi:</label>
            {loading === 'pending' ? (
                <div>Đang tải tiện nghi...</div>
            ) : error ? (
                <div className="error">Lỗi: {error}</div>
            ) : amenities && amenities.map(amenity => (
                <label key={amenity.id}>
                    <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity.id)}
                        onChange={() => handleAmenityChange(amenity.id)}
                    />
                    {amenity.name}
                </label>
            ))}

            <ImageUpload onImagesChange={handleImagesChange} initialImages={imageUrls} />

            <button type="submit" onClick={handleSubmit}>Lưu</button>
        </div>
    );
}

export default SpaceForm;
