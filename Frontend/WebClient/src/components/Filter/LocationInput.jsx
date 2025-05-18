// src/components/Filter/LocationInput.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setLocationFilter,

    filterSpaces, selectBookSpaceFilters
} from '../../features/bookSpace/bookSpaceSlice';

// Hàm debounce
function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

function LocationInput({ onLocationSelected }) {
    const filters = useSelector(selectBookSpaceFilters);

    const [localInputValue, setLocalInputValue] = useState(filters.location || '');
    const [suggestions, setSuggestions] = useState([]);
    const dispatch = useDispatch();
    const inputRef = useRef(null);

    // OpenCage Geocoder
    // const fetchSuggestions = useCallback(async (query) => {
    //     const apiKey = '5c3ad43fe7c3400d8d26c03de42c0163'; // Thay YOUR_OPENCAGE_API_KEY bằng API key của bạn
    //     try {
    //         const response = await fetch(
    //             `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${apiKey}&limit=5&language=vi` // Thêm &language=vi nếu muốn kết quả tiếng Việt (nếu có)
    //         );
    //         const data = await response.json();
    //         if (data.results) {
    //             setSuggestions(data.results.map(result => result.formatted));
    //         }
    //     } catch (error) {
    //         console.error('Lỗi khi tải gợi ý từ Nominatim:', error);
    //         setSuggestions([]);
    //     }
    // }, []);

    // Nominatim
    // const fetchSuggestions = useCallback(async (query) => {
    //     try {
    //         const response = await fetch(
    //             `/nominatim/search?q=${query}&format=json&limit=5` // Sử dụng proxy nếu cần
    //         );
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         const data = await response.json();
    //         setSuggestions(data.map(item => item.display_name));
    //     } catch (error) {
    //         console.error('Lỗi khi tải gợi ý:', error);
    //         setSuggestions([]);
    //     }
    // }, []);

    // Sử dụng debounce cho hàm fetchSuggestions
    const debouncedFetchSuggestions = useCallback(
        debounce(async (query) => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`,
                    {
                        headers: {
                            'User-Agent': 'BookSpace/v0 (contact: huu3675@gmail.com)',
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSuggestions(data.map(item => item.display_name));
            } catch (error) {
                console.error('Lỗi khi tải gợi ý:', error);
                setSuggestions([]);
            }
        }, 300), // Chờ 300ms sau khi người dùng ngừng nhập
        []
    );

    const handleInputChange = (event) => {
        const value = event.target.value;
        setLocalInputValue(value);
        dispatch(setLocationFilter(value));
        dispatch(filterSpaces());

        if (value.length >= 2) {
            debouncedFetchSuggestions(value); // Gọi hàm debounced
        } else {
            setSuggestions([]);
        }

    };

    const handleSuggestionClick = (suggestion) => {
        setLocalInputValue(suggestion);
        setSuggestions([]);
        dispatch(setLocationFilter(suggestion));
        dispatch(filterSpaces());
        if (onLocationSelected) {
            onLocationSelected(suggestion); // Gọi callback khi chọn gợi ý
        }
    };

    useEffect(() => {
        setLocalInputValue(filters.location || '');
    }, [filters.location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputRef]);

    return (
        <div className="location-input" ref={inputRef}>
            <input
                type="text"
                placeholder="Nhập vị trí"
                value={localInputValue}
                onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
                <ul className="suggestions-dropdown">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
            <div className="attribution"> {/* Thêm container cho attribution */}
                Dữ liệu bản đồ © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors
            </div>
        </div>
    );
}

export default LocationInput;

// Cần CSS cho .suggestions-dropdown và .attribution