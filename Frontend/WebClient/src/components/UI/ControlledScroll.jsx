import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectBookSpaceSpaces,
    selectBookSpaceLoading,
    filterSpaces, // Giả sử filterSpaces đã được điều chỉnh để xử lý việc tải thêm
} from '../features/bookSpace/bookSpaceSlice';
import ResultItem from '../components/Results/ResultItem';
import './ControlledInfiniteScroll.css'; // Tạo file CSS cho component này

function ControlledInfiniteScroll() {
    const spaces = useSelector(selectBookSpaceSpaces);
    const loading = useSelector(selectBookSpaceLoading);
    const dispatch = useDispatch();
    const [visibleSpaces, setVisibleSpaces] = useState([]);
    const [loadMoreCount] = useState(10); // Số lượng item tải thêm mỗi lần
    const listInnerRef = useRef();
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        setVisibleSpaces(spaces.slice(0, loadMoreCount)); // Hiển thị số lượng ban đầu
    }, [spaces, loadMoreCount]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetching && visibleSpaces.length < spaces.length) {
                    setIsFetching(true);
                }
            },
            {
                root: null, // Sử dụng viewport làm root
                rootMargin: '0px',
                threshold: 0.8, // Kích hoạt khi 80% của phần tử cuối cùng hiển thị
            }
        );

        if (listInnerRef.current && visibleSpaces.length < spaces.length && !loading) {
            observer.observe(listInnerRef.current.lastChild);
        }

        return () => {
            if (listInnerRef.current && observer) {
                observer.unobserve(listInnerRef.current.lastChild);
            }
        };
    }, [visibleSpaces, spaces, loading]);

    useEffect(() => {
        if (isFetching) {
            // Mô phỏng tải thêm dữ liệu (trong thực tế sẽ gọi API)
            setTimeout(() => {
                const nextSpaces = spaces.slice(visibleSpaces.length, visibleSpaces.length + loadMoreCount);
                setVisibleSpaces((prevVisibleSpaces) => [...prevVisibleSpaces, ...nextSpaces]);
                setIsFetching(false);
            }, 500); // Thời gian mô phỏng tải
        }
    }, [isFetching, loadMoreCount, spaces]);

    if (loading === 'pending' && visibleSpaces.length === 0) {
        return <div>Đang tải kết quả...</div>;
    }

    return (
        <div className="controlled-infinite-scroll-container">
            <h2>Kết quả tìm kiếm</h2>
            {visibleSpaces.map((space, index) => (
                <div key={space.id} ref={index === visibleSpaces.length - 1 ? listInnerRef : null}>
                    <ResultItem space={space} />
                </div>
            ))}
            {loading === 'pending' && visibleSpaces.length > 0 && <div>Đang tải thêm...</div>}
            {visibleSpaces.length < spaces.length && loading !== 'pending' && (
                <div className="load-more-trigger" ref={listInnerRef}>
                    {/* Phần tử này sẽ kích hoạt tải thêm khi nó hiển thị */}
                </div>
            )}
            {visibleSpaces.length === spaces.length && spaces.length > 0 && (
                <div>Đã hiển thị tất cả kết quả.</div>
            )}
            {spaces.length === 0 && loading !== 'pending' && <div>Không có kết quả tìm kiếm.</div>}
        </div>
    );
}

export default ControlledInfiniteScroll;