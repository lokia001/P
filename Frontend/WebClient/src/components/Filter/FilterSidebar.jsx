// src/components/Filter/FilterSidebar.jsx
import React from 'react';

function FilterSidebar({ filters, filterData, onSpaceTypeToggle, onPriceRangeChange, onAmenityToggle, onRentalTypeChange, onClearFilters }) {
    // filterData sẽ chứa dữ liệu bộ lọc từ backend
    // Ví dụ:
    // filterData = {
    //   spaceTypes: ['Không gian làm việc', 'Phòng riêng', ...],
    //   amenities: ['WIFI', 'Máy in', ...],
    //   priceRanges: [{ label: '...', value: [...] }, ...],
    //   rentalOptions: ['Ngày', 'Tuần', ...],
    // }

    return (
        <div className="filter-sidebar">
            {/* <h2>Bộ lọc không gian</h2>
            <LocationInput /> */}

            {filterData && (
                <>
                    <div>
                        <h3>Loại không gian</h3>
                        {filterData.spaceTypes && filterData.spaceTypes.map(type => (
                            <label key={type}>
                                <input
                                    type="checkbox"
                                    checked={filters.spaceType.includes(type)}
                                    onChange={() => onSpaceTypeToggle(type)}
                                />
                                {type}
                            </label>
                        ))}
                    </div>

                    <div>
                        <h3>Giá cả</h3>
                        {filterData.priceRanges && filterData.priceRanges.map(range => (
                            <label key={range.label}>
                                <input
                                    type="radio"
                                    name="priceRange"
                                    value={range.value.join('-')}
                                    onChange={() => onPriceRangeChange(range.value)}
                                />
                                {range.label}
                            </label>
                        ))}
                        {/* Thêm input range tùy chỉnh nếu cần */}
                    </div>

                    <div>
                        <h3>Tiện ích</h3>
                        {filterData.amenities && filterData.amenities.map(amenity => (
                            <label key={amenity}>
                                <input
                                    type="checkbox"
                                    checked={filters.amenities.includes(amenity)}
                                    onChange={() => onAmenityToggle(amenity)}
                                />
                                {amenity}
                            </label>
                        ))}
                    </div>

                    <div>
                        <h3>Thời gian thuê</h3>
                        {filterData.rentalOptions && (
                            <select value={filters.rentalType} onChange={onRentalTypeChange}>
                                {filterData.rentalOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </>
            )}

            <button onClick={onClearFilters}>Xóa bộ lọc</button>
        </div>
    );
}

export default FilterSidebar;