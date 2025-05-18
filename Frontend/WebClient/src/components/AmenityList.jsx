import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAmenities, selectAmenities, selectAmenitiesLoading, selectAmenitiesError } from "../features/amenities/amenitySlice";

function AmenityList() {
    const dispatch = useDispatch();
    const amenities = useSelector(selectAmenities) || [];
    const loading = useSelector(selectAmenitiesLoading);
    const error = useSelector(selectAmenitiesError);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchAmenities());
    }, [dispatch]);

    const filteredAmenities = amenities.filter(a =>
        a?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading === 'pending') {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div>
            <h2>Danh sách tiện ích:</h2>
            <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mô tả"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Mô tả</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAmenities.map((amenity) => (
                        <tr key={amenity.id}>
                            <td>{amenity.name}</td>
                            <td>{amenity.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AmenityList;
