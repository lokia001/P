// router/routes.js
const routesConfig = [
    {
        path: '/',
        component: 'HomePage',
        layout: 'main',
        exact: true,
        roles: ['guest', 'user', 'owner'],
    },
    // {
    //     path: '/book-space',
    //     component: 'DatKhongGianPage.jsx',
    //     layout: 'main',
    //     roles: ['guest', 'user', 'owner'],
    // },
    // {
    //     path: '/about-us',
    //     component: 'VeChungToiPage.jsx', // Thay tên component phù hợp
    //     layout: 'main',
    //     roles: ['guest', 'user', 'owner'],
    // },
    // {
    //     path: '/orders',
    //     component: 'DonDatPage.jsx', // Thay tên component phù hợp
    //     layout: 'main',
    //     roles: ['user', 'owner'],
    // },
    // {
    //     path: '/admin',
    //     component: 'AdminPage',
    //     layout: 'main',
    //     roles: ['owner'],
    // },
    // {
    //     path: '/profile',
    //     component: 'Profile', // Thay tên component phù hợp
    //     layout: 'main',
    //     roles: ['user', 'owner'],
    // },
    {
        path: '/login',
        component: 'LoginPage',
        layout: 'auth',
        roles: ['guest'],
        redirectTo: '/',
    },
    // ...
];

export default routesConfig;