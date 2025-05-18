import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectBookSpaceFilters,
    selectBookSpaceFilterData,
    selectBookSpaceSpaces,
    selectBookSpaceLoading,
    fetchBookSpaceFilters,
    setLocationFilter,
    toggleSpaceTypeFilter,
    setPriceRangeFilter,
    toggleAmenityFilter,
    setRentalTypeFilter,
    clearAllFilters,
    filterSpaces,
    setSortOption,
    selectSortOption,
} from '../features/bookSpace/bookSpaceSlice';
import FilterSidebar from '../components/Filter/FilterSidebar';
import ResultsAreaWithCount from '../components/Results/ResultsAreaWithCount';
import "./bookSpacePage.css";
import LocationInput from '../components/Filter/LocationInput';
import Map from '../components/Map';
import FilterItem from '../components/Filter/FilterItem';

function BookSpacePage() {
    const filters = useSelector(selectBookSpaceFilters);
    const filterData = useSelector(selectBookSpaceFilterData);
    const spaces = useSelector(selectBookSpaceSpaces);
    const loading = useSelector(selectBookSpaceLoading);
    const sortOption = useSelector(selectSortOption);
    const dispatch = useDispatch();
    const [selectedLocation, setSelectedLocation] = useState(filters.location || '');

    const handleLocationSelected = (location) => {
        dispatch(setLocationFilter(location));
        dispatch(filterSpaces());
        setSelectedLocation(location);
    };

    const handleSortChange = (event) => {
        dispatch(setSortOption(event.target.value));
        dispatch(filterSpaces());
    };

    const handleRemoveFilter = (filterKey, filterValue) => {
        if (filterKey === 'location') {
            dispatch(setLocationFilter(''));
            setSelectedLocation('');
        } else if (filterKey === 'spaceType') {
            dispatch(toggleSpaceTypeFilter(filterValue));
        } else if (filterKey === 'priceRange') {
            dispatch(setPriceRangeFilter([0, Infinity]));
        } else if (filterKey === 'amenities') {
            dispatch(toggleAmenityFilter(filterValue));
        } else if (filterKey === 'rentalType') {
            dispatch(setRentalTypeFilter('NGÀY'));
        }
        dispatch(filterSpaces());
    };

    const handleClearAllFilters = () => {
        dispatch(clearAllFilters());
        setSelectedLocation('');
        dispatch(filterSpaces());
    };

    useEffect(() => {
        dispatch(fetchBookSpaceFilters());
        dispatch(filterSpaces());
    }, [dispatch]);

    const activeFilters = Object.keys(filters)
        .filter(key => {
            if (key === 'location' && filters[key]) return true;
            if (key === 'spaceType' && filters[key].length > 0) return true;
            if (key === 'priceRange' && (filters[key][0] !== 0 || filters[key][1] !== Infinity)) return true;
            if (key === 'amenities' && filters[key].length > 0) return true;
            if (key === 'rentalType' && filters[key] !== 'NGÀY') return true;
            return false;
        })
        .reduce((acc, key) => {
            if (key === 'location') acc.push({ key, value: filters[key] });
            if (key === 'spaceType') filters[key].forEach(value => acc.push({ key, value }));
            if (key === 'priceRange' && (filters[key][0] !== 0 || filters[key][1] !== Infinity)) acc.push({ key, value: filters[key] });
            if (key === 'amenities') filters[key].forEach(value => acc.push({ key, value }));
            if (key === 'rentalType' && filters[key] !== 'NGÀY') acc.push({ key, value: filters[key] });
            return acc;
        }, []);

    return (
        <div className="book-space-page">
            <FilterSidebar
                filters={filters}
                filterData={filterData}
                onSpaceTypeToggle={(type) => { dispatch(toggleSpaceTypeFilter(type)); dispatch(filterSpaces()); }}
                onPriceRangeChange={(range) => { dispatch(setPriceRangeFilter(range)); dispatch(filterSpaces()); }}
                onAmenityToggle={(amenity) => { dispatch(toggleAmenityFilter(amenity)); dispatch(filterSpaces()); }}
                onRentalTypeChange={(e) => { dispatch(setRentalTypeFilter(e.target.value)); dispatch(filterSpaces()); }}
                onClearFilters={handleClearAllFilters}
            />
            <div className="main-content">
                <div className="location-sort-container">
                    <div className="location-search-container">
                        <label htmlFor="location">Nhập vị trí</label>
                        <LocationInput onLocationSelected={handleLocationSelected} />
                    </div>
                    <div className="sort-options">
                        <label htmlFor="sort">Sắp xếp theo:</label>
                        <select id="sort" value={sortOption} onChange={handleSortChange}>
                            <option value="name">Tên</option>
                            <option value="price_asc">Giá: Thấp đến Cao</option>
                            <option value="price_desc">Giá: Cao đến Thấp</option>
                            {/* Thêm các option sắp xếp khác nếu cần */}
                        </select>
                    </div>
                </div>

                <div className="active-filters-container">
                    {activeFilters.map((filter, index) => (
                        <FilterItem
                            key={index}
                            filterKey={filter.key}
                            filterValue={filter.value}
                            onRemove={handleRemoveFilter}
                        />
                    ))}
                    {activeFilters.length > 0 && (
                        <button className="clear-all-filters-button" onClick={handleClearAllFilters}>
                            Xóa tất cả ({activeFilters.length})
                        </button>
                    )}
                </div>

                <div className="map-results-container">
                    <div className="results-area-container">
                        <ResultsAreaWithCount spaces={spaces} loading={loading} /> {/* Sử dụng component hiển thị số lượng */}
                    </div>
                    <div className="map-container-wrapper">
                        <Map location={selectedLocation} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookSpacePage;
//////////////////////
