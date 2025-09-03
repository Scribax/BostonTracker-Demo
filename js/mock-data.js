// Mock data for Boston Tracker Demo
const BOSTON_CENTER = [42.3601, -71.0589];

const mockDeliveries = [
    {
        id: 'DEL001',
        restaurant: 'North End Pizza',
        restaurantAddress: '123 Hanover St, Boston, MA',
        customer: 'María García',
        customerAddress: '456 Beacon St, Boston, MA',
        driver: 'Carlos Mendoza',
        status: 'en_camino',
        orderTime: new Date(Date.now() - 1800000).toLocaleTimeString(), // 30 min ago
        estimatedDelivery: new Date(Date.now() + 900000).toLocaleTimeString(), // 15 min from now
        coordinates: [42.3656, -71.0540],
        route: [
            [42.3656, -71.0540], // Restaurant (North End)
            [42.3610, -71.0570],
            [42.3590, -71.0580],
            [42.3578, -71.0601]  // Customer (Beacon Hill)
        ],
        totalAmount: 28.50,
        phone: '+1 (555) 123-4567'
    },
    {
        id: 'DEL002',
        restaurant: 'Back Bay Bistro',
        restaurantAddress: '789 Boylston St, Boston, MA',
        customer: 'John Smith',
        customerAddress: '321 Commonwealth Ave, Boston, MA',
        driver: 'Ana Rodriguez',
        status: 'pendiente',
        orderTime: new Date(Date.now() - 600000).toLocaleTimeString(), // 10 min ago
        estimatedDelivery: new Date(Date.now() + 2100000).toLocaleTimeString(), // 35 min from now
        coordinates: [42.3505, -71.0753],
        route: [
            [42.3505, -71.0753], // Restaurant (Back Bay)
            [42.3520, -71.0740],
            [42.3540, -71.0720],
            [42.3555, -71.0705]  // Customer
        ],
        totalAmount: 42.75,
        phone: '+1 (555) 987-6543'
    },
    {
        id: 'DEL003',
        restaurant: 'Fenway Grill',
        restaurantAddress: '111 Yawkey Way, Boston, MA',
        customer: 'Lisa Chen',
        customerAddress: '555 Huntington Ave, Boston, MA',
        driver: 'Miguel Santos',
        status: 'entregado',
        orderTime: new Date(Date.now() - 3600000).toLocaleTimeString(), // 1 hour ago
        deliveryTime: new Date(Date.now() - 600000).toLocaleTimeString(), // 10 min ago
        coordinates: [42.3467, -71.0972],
        route: [],
        totalAmount: 35.20,
        phone: '+1 (555) 456-7890'
    },
    {
        id: 'DEL004',
        restaurant: 'South End Cafe',
        restaurantAddress: '222 Washington St, Boston, MA',
        customer: 'David Johnson',
        customerAddress: '888 Tremont St, Boston, MA',
        driver: 'Sofia Ramirez',
        status: 'en_camino',
        orderTime: new Date(Date.now() - 2400000).toLocaleTimeString(), // 40 min ago
        estimatedDelivery: new Date(Date.now() + 600000).toLocaleTimeString(), // 10 min from now
        coordinates: [42.3370, -71.0778],
        route: [
            [42.3370, -71.0778], // Restaurant
            [42.3385, -71.0785],
            [42.3400, -71.0792],
            [42.3415, -71.0800]  // Customer
        ],
        totalAmount: 31.90,
        phone: '+1 (555) 654-3210'
    },
    {
        id: 'DEL005',
        restaurant: 'Cambridge Corner',
        restaurantAddress: '333 Massachusetts Ave, Cambridge, MA',
        customer: 'Emma Wilson',
        customerAddress: '777 Broadway, Cambridge, MA',
        driver: 'Roberto Martinez',
        status: 'pendiente',
        orderTime: new Date(Date.now() - 300000).toLocaleTimeString(), // 5 min ago
        estimatedDelivery: new Date(Date.now() + 2700000).toLocaleTimeString(), // 45 min from now
        coordinates: [42.3736, -71.1097],
        route: [],
        totalAmount: 24.60,
        phone: '+1 (555) 321-0987'
    }
];

const mockUsers = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@bostontracker.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-09-03 02:15:00',
        createdAt: '2024-01-15'
    },
    {
        id: 2,
        username: 'carlos.mendoza',
        email: 'carlos@bostontracker.com',
        role: 'delivery',
        status: 'active',
        lastLogin: '2024-09-03 01:45:00',
        createdAt: '2024-02-20'
    },
    {
        id: 3,
        username: 'ana.rodriguez',
        email: 'ana@bostontracker.com',
        role: 'delivery',
        status: 'active',
        lastLogin: '2024-09-03 02:30:00',
        createdAt: '2024-03-10'
    },
    {
        id: 4,
        username: 'miguel.santos',
        email: 'miguel@bostontracker.com',
        role: 'delivery',
        status: 'inactive',
        lastLogin: '2024-09-02 18:20:00',
        createdAt: '2024-02-28'
    },
    {
        id: 5,
        username: 'sofia.ramirez',
        email: 'sofia@bostontracker.com',
        role: 'delivery',
        status: 'active',
        lastLogin: '2024-09-03 01:30:00',
        createdAt: '2024-04-05'
    },
    {
        id: 6,
        username: 'manager',
        email: 'manager@bostontracker.com',
        role: 'manager',
        status: 'active',
        lastLogin: '2024-09-03 00:45:00',
        createdAt: '2024-01-20'
    },
    {
        id: 7,
        username: 'roberto.martinez',
        email: 'roberto@bostontracker.com',
        role: 'delivery',
        status: 'active',
        lastLogin: '2024-09-03 02:00:00',
        createdAt: '2024-03-22'
    }
];

const mockTripHistory = [
    {
        id: 'TRIP001',
        driver: 'Carlos Mendoza',
        restaurant: 'North End Pizza',
        customer: 'Cliente Ejemplo 1',
        date: '2024-09-02',
        startTime: '14:30:00',
        endTime: '14:52:00',
        duration: '22 min',
        status: 'entregado',
        distance: '3.2 km',
        earnings: '$12.50'
    },
    {
        id: 'TRIP002',
        driver: 'Ana Rodriguez',
        restaurant: 'Back Bay Bistro',
        customer: 'Cliente Ejemplo 2',
        date: '2024-09-02',
        startTime: '18:15:00',
        endTime: '18:41:00',
        duration: '26 min',
        status: 'entregado',
        distance: '4.1 km',
        earnings: '$15.25'
    },
    {
        id: 'TRIP003',
        driver: 'Miguel Santos',
        restaurant: 'Fenway Grill',
        customer: 'Cliente Ejemplo 3',
        date: '2024-09-02',
        startTime: '19:45:00',
        endTime: '20:12:00',
        duration: '27 min',
        status: 'entregado',
        distance: '2.8 km',
        earnings: '$11.75'
    },
    {
        id: 'TRIP004',
        driver: 'Sofia Ramirez',
        restaurant: 'South End Cafe',
        customer: 'Cliente Ejemplo 4',
        date: '2024-09-01',
        startTime: '12:20:00',
        endTime: '12:38:00',
        duration: '18 min',
        status: 'entregado',
        distance: '1.9 km',
        earnings: '$9.50'
    },
    {
        id: 'TRIP005',
        driver: 'Roberto Martinez',
        restaurant: 'Cambridge Corner',
        customer: 'Cliente Ejemplo 5',
        date: '2024-09-01',
        startTime: '16:30:00',
        endTime: '17:05:00',
        duration: '35 min',
        status: 'entregado',
        distance: '5.7 km',
        earnings: '$18.00'
    },
    {
        id: 'TRIP006',
        driver: 'Carlos Mendoza',
        restaurant: 'North End Pizza',
        customer: 'Cliente Ejemplo 6',
        date: '2024-08-31',
        startTime: '20:15:00',
        endTime: '20:33:00',
        duration: '18 min',
        status: 'cancelado',
        distance: '0 km',
        earnings: '$0.00'
    }
];

const mockAPKVersions = [
    {
        version: 'v2.1.3',
        date: '2024-08-15',
        size: '8.2 MB',
        downloads: 247,
        status: 'active',
        changelog: 'Mejoras en la geolocalización y corrección de bugs menores'
    },
    {
        version: 'v2.1.2',
        date: '2024-07-28',
        size: '8.0 MB',
        downloads: 198,
        status: 'deprecated',
        changelog: 'Optimización de batería y nuevas notificaciones'
    },
    {
        version: 'v2.1.1',
        date: '2024-07-10',
        size: '7.8 MB',
        downloads: 156,
        status: 'deprecated',
        changelog: 'Interfaz mejorada y soporte para Android 14'
    },
    {
        version: 'v2.1.0',
        date: '2024-06-22',
        size: '7.5 MB',
        downloads: 89,
        status: 'deprecated',
        changelog: 'Nueva funcionalidad de chat y tracking en tiempo real'
    }
];

// Utility functions for mock data
const getStatusText = (status) => {
    const statusMap = {
        'en_camino': 'En Camino',
        'pendiente': 'Pendiente',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado',
        'active': 'Activo',
        'inactive': 'Inactivo',
        'deprecated': 'Obsoleta'
    };
    return statusMap[status] || status;
};

const getStatusClass = (status) => {
    const classMap = {
        'en_camino': 'status-en-camino',
        'pendiente': 'status-pendiente',
        'entregado': 'status-entregado',
        'cancelado': 'status-cancelado',
        'active': 'bg-success',
        'inactive': 'bg-secondary',
        'deprecated': 'bg-warning'
    };
    return classMap[status] || 'bg-secondary';
};

const getRoleClass = (role) => {
    const classMap = {
        'admin': 'role-admin',
        'delivery': 'role-delivery',
        'manager': 'role-manager'
    };
    return classMap[role] || 'bg-secondary';
};

const getRoleText = (role) => {
    const roleMap = {
        'admin': 'Administrador',
        'delivery': 'Repartidor',
        'manager': 'Gerente'
    };
    return roleMap[role] || role;
};

const formatTime = (timeString) => {
    return new Date(`2024-01-01 ${timeString}`).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Generate random coordinates around Boston
const generateRandomCoordinate = (center, radius = 0.01) => {
    const [lat, lng] = center;
    const randomLat = lat + (Math.random() - 0.5) * radius;
    const randomLng = lng + (Math.random() - 0.5) * radius;
    return [randomLat, randomLng];
};

// Export for use in other scripts
window.mockData = {
    deliveries: mockDeliveries,
    users: mockUsers,
    tripHistory: mockTripHistory,
    apkVersions: mockAPKVersions,
    bostonCenter: BOSTON_CENTER,
    utils: {
        getStatusText,
        getStatusClass,
        getRoleClass,
        getRoleText,
        formatTime,
        formatDate,
        generateRandomCoordinate
    }
};
