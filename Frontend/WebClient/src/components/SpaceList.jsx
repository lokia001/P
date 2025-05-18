import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchSpaces,
    selectSpaces,
    selectLoading,
    selectError,
} from '../bookSpace/bookSpaceSlice';

function SpaceList() {
    const dispatch = useDispatch();
    const spaces = useSelector(selectBookSpaceSpaces);
    const loading = useSelector(selectBookSpaceLoading);
    const error = useSelector(selectBookSpaceError);

    useEffect(() => {
        dispatch(fetchSpaces());
    }, [dispatch]);

    if (loading === 'pending') {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div>
            <h2>Danh sách các không gian:</h2>
            <ul>
                {spaces.map(space => (
                    <li key={space.id}>
                        {space.name} - {space.address}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SpaceList;