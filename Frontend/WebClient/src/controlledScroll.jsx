import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectBookSpaceSpaces,
    selectBookSpaceLoading,
    filterSpaces, // Giả định bạn có thunk này để lấy dữ liệu
} from '../../features/bookSpace/bookSpaceSlice';
import ResultItem from '../Results/ResultItem'; // Giả định component hiển thị mỗi kết quả
import './ControlledScroll.css'; // CSS cho component này

function ControlledScroll() {
    const dispatch = useDispatch();
    const spaces = useSelector(selectBookSpaceSpaces);
    const loading = useSelector(selectBookSpaceLoading);
    const [visibleSpaces, setVisibleSpaces] = useState([]);
    const [loadMore, setLoadMore] = useState(true);
    const containerRef = useRef(null);
    const loadMoreThreshold = 200; // Khoảng cách (px) từ cuối container để kích hoạt tải thêm
    const itemsPerPage = 10; // Số lượng item tải mỗi lần

    const handleScroll = useCallback(() => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const scrollBottom = scrollTop + clientHeight;
            const threshold = scrollHeight - loadMoreThreshold;

            if (scrollBottom > threshold && loadMore && loading === 'idle' && visibleSpaces.length < spaces.length) {
                loadMoreItems();
            }
        }
    }, [visibleSpaces.length, spaces.length, loadMore, loading]);

    const loadMoreItems = useCallback(() => {
        if (visibleSpaces.length < spaces.length) {
            const nextItems = spaces.slice(visibleSpaces.length, visibleSpaces.length + itemsPerPage);
            setVisibleSpaces((prevSpaces) => [...prevSpaces, ...nextItems]);
        }
        if (visibleSpaces.length >= spaces.length) {
            setLoadMore(false);
        }
    }, [visibleSpaces.length, spaces, itemsPerPage]);

    useEffect(() => {
        // Lấy dữ liệu ban đầu khi component mount
        dispatch(filterSpaces()); // Giả định filterSpaces sẽ cập nhật state 'spaces'
        setVisibleSpaces(spaces.slice(0, itemsPerPage)); // Hiển thị số lượng item ban đầu
        if (spaces.length <= itemsPerPage) {
            setLoadMore(false);
        }
    }, [dispatch, spaces.length, itemsPerPage]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [handleScroll]);

    return (
        <div className="controlled-scroll-container" ref={containerRef} style={{ overflowY: 'auto', maxHeight: '500px' }}>
            {visibleSpaces.map((space) => (
                <ResultItem key={space.id} space={space} />
            ))}
            {loading === 'pending' && loadMore && <div>Đang tải thêm kết quả...</div>}
            {!loadMore && visibleSpaces.length > 0 && <div>Đã hiển thị tất cả kết quả.</div>}
            {visibleSpaces.length === 0 && loading === 'idle' && <div>Không có kết quả.</div>}
            {visibleSpaces.length === 0 && loading === 'pending' && <div>Đang tải kết quả...</div>}
        </div>
    );
}

export default ControlledScroll;