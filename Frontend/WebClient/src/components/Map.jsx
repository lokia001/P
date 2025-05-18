import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "./Map.css";
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

function Map({ location }) {
    const [coordinates, setCoordinates] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location) {
            setLoading(true);
            setError(null);
            fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`, {
                headers: {
                    'User-Agent': 'BookSpace/v0 (contact: huu3675@gmail.com)',
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setLoading(false);
                    if (data && data.length > 0) {
                        setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                    } else {
                        setCoordinates(null);
                        setError(`Không tìm thấy vị trí: ${location}`);
                        console.log(`Không tìm thấy vị trí: ${location}`);
                    }
                })
                .catch(error => {
                    setLoading(false);
                    setError(`Lỗi tải bản đồ: ${error.message}`);
                    console.error('Lỗi tải bản đồ:', error);
                    setCoordinates(null);
                });
        } else {
            setCoordinates(null);
            setError(null);
            setLoading(false);
        }
    }, [location]);

    return (
        <div className="map-container">
            {loading ? (
                <div className="map-message">Đang tải bản đồ...</div>
            ) : error ? (
                <div className="map-message error">{error}</div>
            ) : coordinates ? (
                <MapContainer center={coordinates} zoom={13} style={{ height: '300px', width: '100%', borderRadius: '5px' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={coordinates}>
                        <Popup>
                            Vị trí: {location}
                        </Popup>
                    </Marker>
                </MapContainer>
            ) : (
                <div className="map-message">Nhập vị trí để xem bản đồ</div>
            )}
        </div>
    );
}

export default Map;