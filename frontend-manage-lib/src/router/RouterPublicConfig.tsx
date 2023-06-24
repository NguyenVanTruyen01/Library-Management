import { lazy } from 'react'
const Auth=lazy(() => import("pages/Auth/Auth"))
const Home = lazy(() => import("pages/Home/Home"))
const routes = [
    {
        path: '',
        component: Home,
        exact: true
    },
    {
        path: '/login',
        component: Auth,
        exact: true
    },
   
];

export default routes;
