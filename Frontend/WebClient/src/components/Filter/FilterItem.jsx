// src/components/Filter/FilterItem.jsx
import React from 'react';
import './FilterItem.css'; // Import CSS cho FilterItem

function FilterItem({ filterKey, filterValue, onRemove }) {
    const handleRemove = () => {
        onRemove(filterKey, filterValue);
    };

    let displayText = '';
    if (filterKey === 'location') {
        displayText = `${filterValue}`;
    } else if (filterKey === 'spaceType') {
        displayText = `${filterValue}`;
    } else if (filterKey === 'priceRange') {
        displayText = `${filterValue.join(' - ')}$`;
    } else if (filterKey === 'amenities') {
        displayText = `${filterValue}`;
    } else if (filterKey === 'rentalType') {
        displayText = `${filterValue}`;
    }
    // Thêm các trường hợp khác cho các bộ lọc khác

    return (
        <div className="filter-item">
            <span>{displayText}</span>
            <button className="remove-filter" onClick={handleRemove}>
                x
            </button>
        </div>
    );
}

export default FilterItem;