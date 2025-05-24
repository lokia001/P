let mockSpacesData = [
    { id: 's001', name: 'Alpha Meeting Room', type: 'Meeting Room', capacity: 10, priceHour: 50000, status: 'available', address: '123 Main St, District 1', description: 'Bright and airy meeting room with projector.', amenities: [{ id: 'a001', name: 'Projector' }, { id: 'a002', name: 'Whiteboard' }], services: [{ serviceId: 'srv001', name: 'Catering - Basic', price: 200000 }], imageUrl: 'https://shorturl.at/pkEzm', openTime: "08:00", closeTime: "22:00", cleaningDurationMinutes: 30, bufferMinutes: 15, minBookingDurationMinutes: 60, maxBookingDurationMinutes: 480, cancellationNoticeHours: 24, ownerProfileId: 'owner001', createdByUserId: 'userAbc' },
    { id: 's002', name: 'Creative Corner Desk B01', type: 'Individual Desk', capacity: 1, priceHour: 15000, status: 'booked', address: '123 Main St, District 1', description: 'Quiet desk with a view.', amenities: [{ id: 'a003', name: 'Power Outlet' }, { id: 'a004', name: 'High-Speed WiFi' }], services: [], imageUrl: 'https://shorturl.at/rgStB', openTime: "09:00", closeTime: "18:00", cleaningDurationMinutes: 10, bufferMinutes: 5, minBookingDurationMinutes: 120, maxBookingDurationMinutes: 1440, cancellationNoticeHours: 48, ownerProfileId: 'owner001', createdByUserId: 'userAbc' },
    { id: 's003', name: 'Gamma Private Office', type: 'Private Office', capacity: 4, priceHour: 80000, status: 'maintenance', address: '456 Side St, District 3', description: 'Fully furnished private office.', amenities: [{ id: 'a005', name: 'Air Conditioning' }, { id: 'a006', name: 'Ergonomic Chairs' }], services: [{ serviceId: 'srv002', name: 'Daily Cleaning', price: 50000 }], imageUrl: 'https://shorturl.at/02rCP', openTime: "00:00", closeTime: "23:59", cleaningDurationMinutes: 60, bufferMinutes: 30, minBookingDurationMinutes: 1440, maxBookingDurationMinutes: 43200, cancellationNoticeHours: 72, ownerProfileId: 'owner002', createdByUserId: 'userXyz' },
    { id: 's004', name: 'Beta Quiet Room', type: 'Meeting Room', capacity: 6, priceHour: 40000, status: 'inactive', address: '789 Back St, District 1', description: 'Soundproof room for focused work.', amenities: [{ id: 'a001', name: 'Projector' }, { id: 'a007', name: 'Soundproofing' }], services: [], imageUrl: 'https://shorturl.at/yTsVm', openTime: "10:00", closeTime: "17:00", cleaningDurationMinutes: 20, bufferMinutes: 10, minBookingDurationMinutes: 30, maxBookingDurationMinutes: 300, cancellationNoticeHours: 12, ownerProfileId: 'owner001', createdByUserId: 'userAbc' },
    { id: 's005', name: 'Window Desk C01', type: 'Individual Desk', capacity: 1, priceHour: 20000, status: 'available', address: '123 Main St, District 1', description: 'Desk with a great window view.', amenities: [{ id: 'a003', name: 'Power Outlet' }, { id: 'a004', name: 'High-Speed WiFi' }, { id: 'a008', name: 'Window View' }], services: [], imageUrl: 'https://shorturl.at/rgStB', openTime: "08:30", closeTime: "20:00", cleaningDurationMinutes: 10, bufferMinutes: 5, minBookingDurationMinutes: 60, maxBookingDurationMinutes: 1440, cancellationNoticeHours: 24, ownerProfileId: 'owner002', createdByUserId: 'userXyz' },
    { id: 's006', name: 'Theta Streaming Pod', type: 'Specialized Room', capacity: 1, priceHour: 70000, status: 'available', address: 'Tech Hub, District 7', description: 'Room equipped for streaming.', amenities: [{ id: 'a009', name: 'High-End PC' }, { id: 'a010', name: 'Green Screen' }, { id: 'a011', name: 'Professional Mic' }], services: [], imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F3.bp.blogspot.com%2F-M36O_xULKNI%2FUqBjNUejMlI%2FAAAAAAAABQk%2FUAiSKJ91kHQ%2Fs1600%2FIMG_2147.JPG&f=1&nofb=1&ipt=d3f5a470d8e13e10a2fc16fdbbb96e343a97090190ff01626a1ba17fdea30ece', openTime: "10:00", closeTime: "23:00", cleaningDurationMinutes: 15, bufferMinutes: 10, minBookingDurationMinutes: 120, maxBookingDurationMinutes: 720, cancellationNoticeHours: 6, ownerProfileId: 'owner001', createdByUserId: 'userAbc' },
    { id: 's007', name: 'Kappa Small Meeting', type: 'Meeting Room', capacity: 4, priceHour: 30000, status: 'booked', address: 'Co-work Central, District 1', description: 'Small, budget-friendly meeting room.', amenities: [{ id: 'a002', name: 'Whiteboard' }], services: [], imageUrl: 'https://shorturl.at/pkEzm', openTime: "09:00", closeTime: "19:00", cleaningDurationMinutes: 15, bufferMinutes: 5, minBookingDurationMinutes: 30, maxBookingDurationMinutes: 240, cancellationNoticeHours: 24, ownerProfileId: 'owner002', createdByUserId: 'userXyz' },
];

let mockAmenitiesData = [
    { id: 'a001', name: 'Projector', description: 'High-definition projector for presentations.' },
    { id: 'a002', name: 'Whiteboard', description: 'Large whiteboard with markers and eraser.' },
    { id: 'a003', name: 'Power Outlet', description: 'Accessible power outlets for charging devices.' },
    { id: 'a004', name: 'High-Speed WiFi', description: 'Reliable and fast internet connection.' },
    { id: 'a005', name: 'Air Conditioning', description: 'Adjustable air conditioning.' },
    { id: 'a006', name: 'Ergonomic Chairs', description: 'Comfortable chairs for long working hours.' },
    { id: 'a007', name: 'Soundproofing', description: 'Room with soundproofing for quiet work or meetings.' },
    { id: 'a008', name: 'Window View', description: 'Space with a pleasant window view.' },
    { id: 'a009', name: 'High-End PC', description: 'Powerful computer for demanding tasks.' },
    { id: 'a010', name: 'Green Screen', description: 'Professional green screen for video recording.' },
    { id: 'a011', name: 'Professional Mic', description: 'High-quality microphone for recording or calls.' },
];

let mockServicesData = [
    { id: 'srv001', name: 'Catering - Basic', description: 'Basic catering package (coffee, tea, water, biscuits).', basePrice: 200000, unit: 'PerBooking', isAvailableAdHoc: true, isPricedPerBooking: true },
    { id: 'srv002', name: 'Daily Cleaning', description: 'Daily cleaning service for private offices.', basePrice: 50000, unit: 'Fixed', isAvailableAdHoc: false, isPricedPerBooking: false }, // Giả sử giá này là /ngày hoặc /tháng, cần làm rõ
    { id: 'srv003', name: 'Equipment Rental - Laptop', description: 'Laptop rental per day.', basePrice: 150000, unit: 'PerItem', isAvailableAdHoc: true, isPricedPerBooking: false },
    { id: 'srv004', name: 'Printing Service', description: 'Price per page for printing.', basePrice: 1000, unit: 'PerItem', isAvailableAdHoc: true, isPricedPerBooking: false },
];

// --- Hàm Giả Lập API ---

// Helper function to simulate API delay
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate new ID (simple version)
const generateId = (prefix = 'new') => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

// --- Spaces API ---
export const getAllMockSpaces = async () => {
    await simulateDelay();
    console.log("[MOCK API] getAllMockSpaces called");
    return [...mockSpacesData]; // Trả về bản sao để tránh thay đổi trực tiếp
};

export const getMockSpaceById = async (spaceId) => {
    await simulateDelay();
    console.log(`[MOCK API] getMockSpaceById called with id: ${spaceId}`);
    const space = mockSpacesData.find(s => s.id === spaceId);
    return space ? { ...space } : null;
};

export const createMockSpace = async (spaceData) => {
    await simulateDelay(1000); // Giả lập thời gian tạo lâu hơn
    console.log("[MOCK API] createMockSpace called with data:", spaceData);

    // Validate basic required fields (ví dụ)
    if (!spaceData.name || !spaceData.type || !spaceData.capacity || !spaceData.basePrice) {
        console.error("[MOCK API] Create space failed: Missing required fields.");
        throw new Error("Creation failed: Missing required fields (name, type, capacity, basePrice).");
    }

    const newSpace = {
        ...spaceData,
        id: generateId('s'), // Tạo ID mới
        status: 'available', // Mặc định khi tạo
        createdAt: new Date().toISOString(),
        updatedAt: null,
        // Giả sử ownerId và createdByUserId được lấy từ context user đã đăng nhập
        ownerProfileId: 'mockOwner123',
        createdByUserId: 'mockUserAbc',
        // Xử lý amenities và services (chỉ lưu ID hoặc thông tin cơ bản)
        amenities: spaceData.amenityIds
            ? spaceData.amenityIds.map(id => mockAmenitiesData.find(a => a.id === id)).filter(a => a) // Lấy object amenity đầy đủ
            : [],
        services: spaceData.services
            ? spaceData.services.map(sDto => {
                const serviceInfo = mockServicesData.find(s => s.id === sDto.serviceId);
                return serviceInfo ? { ...serviceInfo, price: sDto.price } : null; // Lưu cả thông tin service và giá tùy chỉnh
            }).filter(s => s)
            : [],
        imageUrl: spaceData.imageUrl || 'https://via.placeholder.com/300x200/007bff/ffffff?text=New+Space' // Ảnh mặc định
    };
    mockSpacesData.push(newSpace);
    console.log("[MOCK API] New space added:", newSpace);
    return { ...newSpace }; // Trả về bản sao của space mới
};

export const updateMockSpace = async (spaceId, updateData) => {
    await simulateDelay();
    console.log(`[MOCK API] updateMockSpace called for id: ${spaceId} with data:`, updateData);
    const index = mockSpacesData.findIndex(s => s.id === spaceId);
    if (index === -1) {
        console.error(`[MOCK API] Update space failed: Space with id ${spaceId} not found.`);
        throw new Error(`Space with id ${spaceId} not found.`);
    }
    // Chỉ cập nhật các trường được cung cấp trong updateData
    mockSpacesData[index] = { ...mockSpacesData[index], ...updateData, updatedAt: new Date().toISOString() };
    console.log("[MOCK API] Space updated:", mockSpacesData[index]);
    return { ...mockSpacesData[index] };
};

export const deleteMockSpace = async (spaceId) => {
    await simulateDelay();
    console.log(`[MOCK API] deleteMockSpace called for id: ${spaceId}`);
    const initialLength = mockSpacesData.length;
    mockSpacesData = mockSpacesData.filter(s => s.id !== spaceId);
    if (mockSpacesData.length < initialLength) {
        console.log(`[MOCK API] Space with id ${spaceId} deleted.`);
        return true;
    }
    console.warn(`[MOCK API] Delete space failed: Space with id ${spaceId} not found.`);
    return false;
};


// --- Amenities API ---
export const getAllMockAmenities = async () => {
    await simulateDelay();
    console.log("[MOCK API] getAllMockAmenities called");
    return [...mockAmenitiesData];
};

// Thêm các hàm mock cho create, update, delete Amenity nếu cần

// --- Services API ---
export const getAllMockServices = async () => {
    await simulateDelay();
    console.log("[MOCK API] getAllMockServices called");
    return [...mockServicesData];
};