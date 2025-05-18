// src/components/AmenityForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAmenityAsync, fetchAmenities } from '../features/amenities/amenitySlice'; // Adjust the path
import './AmenityForm.css'; // Create this file if you want to style
function AmenityForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {

        if (!name) {
            setError('Vui lòng nhập tên tiện nghi.');
            return;
        }

        const newAmenity = {
            Name: name,
            Description: description,
        };

        try {
            await dispatch(createAmenityAsync(newAmenity));
            // onClose(); // Close the modal after successful creation
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const handleCancel = () => {
        // onClose(); // Gọi onClose để đóng modal
    };

    return (
        <div className="amenity-form">
            <h2>Thêm Tiện Nghi Mới</h2>
            {error && <div className="error">{error}</div>}
            <div>
                <label htmlFor="name">Tên:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Mô tả:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button type="submit" onClick={() => handleSubmit()}>Lưu</button>
            <button type="button" onClick={handleCancel}>Huủy</button> {/* Gọi handleCancel */}
        </div>
    );
}
export default AmenityForm;
