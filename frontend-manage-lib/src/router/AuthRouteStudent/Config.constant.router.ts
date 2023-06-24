import { lazy } from 'react'
const Student=lazy(() => import("layout/Student/StudentLayout"))
const routes = [
    {
        path: '/student',
        component: Student,
        exact: true
    }
];

export default routes;