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

const mockReviewsData = {
    's001': [ // Reviews for spaceId 's001'
        { id: 'r001', spaceId: 's001', userId: 'user123', userName: 'Alice Wonderland', rating: 5, comment: 'Excellent meeting room! Very spacious and well-equipped. Projector worked perfectly.', createdAt: '2024-05-20T10:00:00Z', avatarUrl: 'https://i.pravatar.cc/40?u=alice' },
        { id: 'r002', spaceId: 's001', userId: 'user456', userName: 'Bob The Builder', rating: 4, comment: 'Good room, clean and quiet. WiFi was a bit slow at times but overall a positive experience.', createdAt: '2024-05-18T14:30:00Z', avatarUrl: 'https://i.pravatar.cc/40?u=bob' },
    ],
    's002': [ // Reviews for spaceId 's002'
        { id: 'r003', spaceId: 's002', userId: 'user789', userName: 'Charlie Brown', rating: 4.5, comment: 'Nice desk with a great view as advertised. Perfect for focused work.', createdAt: '2024-05-22T09:15:00Z', avatarUrl: 'https://i.pravatar.cc/40?u=charlie' },
    ],
    's003': [
        { id: 'r004', spaceId: 's003', userId: 'user101', userName: 'Diana Prince', rating: 3.5, comment: 'Office was okay, but the AC was a bit noisy during my call. Maintenance status is understandable though.', createdAt: '2024-05-15T11:00:00Z', avatarUrl: 'https://i.pravatar.cc/40?u=diana' }
    ]
    // Thêm reviews cho các space khác nếu cần
};
// --- Hàm Giả Lập API ---

// src/services/mockApi.js

// ... (mockSpacesData, simulateDelay, generateId đã có) ...

// Dữ liệu mẫu cho Customers (đã dịch và cập nhật)
export const mockCustomersData = [
    {
        id: 'CUST001', // Changed ID format for clarity
        name: 'Anthony Nguyen', // Matches booking BK001
        email: 'anthony.nguyen@example.com',
        phone: '0901234567',
        bookings: 3, // Example
        lastBookingDate: '2024-03-15', // Matches BK001 startTime
        totalSpending: 1250000, // Example
        customerType: 'Individual',
        frequentSpace: 'Alpha Meeting Room', // Matches BK001 spaceName
    },
    {
        id: 'CUST002',
        name: 'Bella Tran', // Matches booking BK002
        email: 'bella.tran@example.com',
        phone: '0912345678',
        bookings: 2,
        lastBookingDate: '2024-03-16', // Matches BK002 startTime
        totalSpending: 450000,
        customerType: 'Individual',
        frequentSpace: 'Creative Corner Desk B01',
    },
    {
        id: 'CUST003',
        name: 'Chris Le', // Matches booking BK003
        email: 'chris.le@example.com',
        phone: '0987654321',
        bookings: 5,
        lastBookingDate: '2024-03-17',
        totalSpending: 980000,
        customerType: 'Individual',
        frequentSpace: 'Gamma Private Office',
    },
    {
        id: 'CUST004',
        name: 'Diana Pham', // Matches booking BK004
        email: 'diana.pham@example.com',
        phone: '0900000001',
        bookings: 1,
        lastBookingDate: '2024-03-18', // Matches BK004 startTime (though it was cancelled)
        totalSpending: 700000, // Example, could be 0 if cancellation means no charge
        customerType: 'Individual',
        frequentSpace: 'Beta Quiet Room',
    },
    {
        id: 'CUST005',
        name: 'XYZ Corp', // A corporate client
        email: 'contact@xyzcorp.com',
        phone: '02834567890',
        bookings: 15, // Example
        lastBookingDate: '2024-07-18', // A more recent booking
        totalSpending: 25000000,
        customerType: 'Corporate',
        frequentSpace: 'Gamma Private Office',
    },
    {
        id: 'CUST006',
        name: 'Ethan Hoang', // Matches booking BK005
        email: 'ethan.hoang@example.com',
        phone: '0900000002',
        bookings: 4,
        lastBookingDate: '2024-03-19',
        totalSpending: 1200000,
        customerType: 'Individual',
        frequentSpace: 'Window Desk C01',
    },
    {
        id: 'CUST007',
        name: 'Fiona Vu', // Matches booking BK006
        email: 'fiona.vu@example.com',
        phone: '0900000003',
        bookings: 6,
        lastBookingDate: '2024-03-20',
        totalSpending: 1800000,
        customerType: 'Individual',
        frequentSpace: 'Kappa Small Meeting',
    },
    {
        id: 'CUST008',
        name: 'George Dang', // Matches booking BK007
        email: 'george.dang@example.com',
        phone: '0900000004',
        bookings: 2,
        lastBookingDate: '2024-03-21',
        totalSpending: 420000,
        customerType: 'Individual',
        frequentSpace: 'Theta Streaming Pod',
    }
];

// ... (mockAmenitiesData, mockServicesData) ...

// --- Hàm Giả Lập API (tiếp tục) ---

// ... (getAllMockSpaces, getMockSpaceById, ...) ...
// ... (getAllMockAmenities, getAllMockServices, ...) ...

// THÊM HÀM NÀY ĐỂ LẤY CHI TIẾT CUSTOMER
export const getMockCustomerById = async (customerId) => {
    await simulateDelay(200); // Giả lập độ trễ nhỏ
    console.log(`[MOCK API] getMockCustomerById called with id: ${customerId}`);
    const customer = mockCustomersData.find(c => c.id === customerId);
    // Trong ứng dụng thực, bạn có thể muốn trả về lỗi nếu không tìm thấy
    return customer ? { ...customer } : null;
};

// Nếu bạn muốn tìm customer theo tên (như trong ví dụ trước của BookingManagementPage)
// thì hàm này không cần thiết nếu booking object đã có customerId.
// Nhưng nếu booking object chỉ có customerName, bạn có thể cần hàm này.
export const findMockCustomerByName = async (customerName) => {
    await simulateDelay(200);
    console.log(`[MOCK API] findMockCustomerByName called with name: ${customerName}`);
    const customer = mockCustomersData.find(c => c.name.toLowerCase() === customerName.toLowerCase());
    return customer ? { ...customer } : null;
}

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

// src/services/mockApi.js
// ... (mockSpacesData, mockReviewsData, etc.) ...

// Giả sử mockSpacesData mỗi object có thêm trường images:
// { id: 's001', ..., imageUrl: 'link_anh_chinh', images: [{id: 'img1', url: 'link_anh_chinh'}, {id: 'img2', url: 'link_thumbnail1'}, {id: 'img3', url: 'link_thumbnail2'}] }

export const getMockSpaceDetailsById = async (spaceId) => {
    await simulateDelay();
    console.log(`[MOCK API] getMockSpaceDetailsById called with id: ${spaceId}`);
    const space = mockSpacesData.find(s => s.id === spaceId);
    if (!space) return null;

    const reviews = mockReviewsData[spaceId] || [];
    const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

    // Giả lập thêm nhiều ảnh cho gallery
    const moreImages = [
        { id: `${spaceId}-thumb1`, url: 'https://www.google.com/imgres?q=coworking.co&imgurl=https%3A%2F%2Fgovi.vn%2Fwp-content%2Fuploads%2F2021%2F11%2Fvan-phong-co-working-space-1.jpg&imgrefurl=https%3A%2F%2Fgovi.vn%2Fdia-chi-cho-thue-van-phong-coworking-space-ha-noi%2F&docid=edaNmKyVlRXMzM&tbnid=y4-NgAuGbX0h9M&vet=12ahUKEwiblbuY47uNAxXvrVYBHaB4Dm8QM3oECBYQAA..i&w=640&h=429&hcb=2&ved=2ahUKEwiblbuY47uNAxXvrVYBHaB4Dm8QM3oECBYQAA' },
        { id: `${spaceId}-thumb2`, url: 'https://via.placeholder.com/150/28a745/ffffff?text=View+2' },
        { id: `${spaceId}-thumb3`, url: 'https://via.placeholder.com/150/ffc107/000000?text=View+3' },
        { id: `${spaceId}-thumb4`, url: 'https://via.placeholder.com/150/dc3545/ffffff?text=View+4' },
    ];

    return {
        ...space,
        // Đảm bảo space.images là một mảng, nếu không thì tạo mảng từ imageUrl chính
        images: space.images && space.images.length > 0 ? space.images : [{ id: `${spaceId}-main`, url: space.imageUrl || 'https://via.placeholder.com/600x400/cccccc/969696?text=Space+Image' }, ...moreImages.slice(0, 3)], // Ảnh chính + 3 thumbnail
        amenitiesDetails: space.amenities || [],
        servicesDetails: space.services || [],
        reviews: reviews,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: reviews.length,
        // Thêm các trường pricing khác nếu cần cho tab Pricing
        pricingTiers: { // Dữ liệu mẫu cho tab Pricing
            coworking: [
                { id: 'cw_daily', name: 'Daily Hot Desk', price: space.priceHour ? space.priceHour * 8 : 150000, unit: '/day', features: ['Access to common areas', 'High-speed WiFi'] },
                { id: 'cw_monthly', name: 'Monthly Hot Desk', price: space.priceHour ? space.priceHour * 160 : 2500000, unit: '/month', features: ['24/7 Access', 'Mail handling', 'Meeting room credits'] },
            ],
            private: space.type === 'Private Office' || space.type === 'Meeting Room' ? [
                { id: 'po_monthly', name: 'Your Private Office', price: space.priceHour ? space.priceHour * 180 : 10000000, unit: '/month', features: ['Fully furnished', 'Lockable', 'Cleaning service'] }
            ] : [],
            virtual: [
                { id: 'vt_basic', name: 'Virtual Office Basic', price: 500000, unit: '/month', features: ['Business Address', 'Mail Forwarding'] },
            ]
        },
        // Thêm thông tin cho tab Overview
        overviewDetails: space.description || "This is a fantastic workspace offering a great environment for productivity and collaboration. Located centrally with easy access to public transport and local amenities.",
        locationAddress: space.address || "123 Innovation Drive, Tech City, Country",
    };
};


// --- Amenities API (tiếp tục) ---
export const createMockAmenity = async (amenityData) => {
    await simulateDelay();
    const newAmenity = { id: generateId('a'), ...amenityData, type: amenityData.type || 'Unclassified', status: amenityData.status || 'Active' };
    mockAmenitiesData.push(newAmenity);
    console.log("[MOCK API] createMockAmenity called, new amenity:", newAmenity);
    return { ...newAmenity };
};

export const updateMockAmenity = async (amenityId, updateData) => {
    await simulateDelay();
    const index = mockAmenitiesData.findIndex(a => a.id === amenityId);
    if (index === -1) throw new Error(`Amenity with id ${amenityId} not found.`);
    mockAmenitiesData[index] = { ...mockAmenitiesData[index], ...updateData };
    console.log("[MOCK API] updateMockAmenity called, updated amenity:", mockAmenitiesData[index]);
    return { ...mockAmenitiesData[index] };
};

export const deleteMockAmenity = async (amenityId) => {
    await simulateDelay();
    const initialLength = mockAmenitiesData.length;
    mockAmenitiesData = mockAmenitiesData.filter(a => a.id !== amenityId);
    console.log(`[MOCK API] deleteMockAmenity called for id: ${amenityId}`);
    if (mockAmenitiesData.length < initialLength) return true;
    console.warn(`[MOCK API] Delete amenity failed: Amenity with id ${amenityId} not found.`);
    return false;
};

// --- Services API (tiếp tục) ---
export const createMockService = async (serviceData) => {
    await simulateDelay();
    const newService = {
        id: generateId('srv'),
        ...serviceData,
        // Giả sử serviceData có isAvailableAdHoc, nếu không thì đặt mặc định
        isAvailableAdHoc: typeof serviceData.isAvailableAdHoc === 'boolean' ? serviceData.isAvailableAdHoc : true,
        createdAt: new Date().toISOString()
    };
    mockServicesData.push(newService);
    console.log("[MOCK API] createMockService called, new service:", newService);
    return { ...newService };
};

export const updateMockService = async (serviceId, updateData) => {
    await simulateDelay();
    const index = mockServicesData.findIndex(s => s.id === serviceId);
    if (index === -1) throw new Error(`Service with id ${serviceId} not found.`);
    mockServicesData[index] = { ...mockServicesData[index], ...updateData, updatedAt: new Date().toISOString() };
    console.log("[MOCK API] updateMockService called, updated service:", mockServicesData[index]);
    return { ...mockServicesData[index] };
};

export const deleteMockService = async (serviceId) => {
    await simulateDelay();
    const initialLength = mockServicesData.length;
    mockServicesData = mockServicesData.filter(s => s.id !== serviceId);
    console.log(`[MOCK API] deleteMockService called for id: ${serviceId}`);
    if (mockServicesData.length < initialLength) return true;
    console.warn(`[MOCK API] Delete service failed: Service with id ${serviceId} not found.`);
    return false;
};