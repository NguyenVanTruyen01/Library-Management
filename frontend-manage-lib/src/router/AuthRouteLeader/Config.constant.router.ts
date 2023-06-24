import { lazy } from 'react'
const Leader=lazy(() => import("layout/Leader/LeaderLayout"))
const routes = [
    {
        path: '/leader',
        component: Leader,
        exact: true
    },

];

export default routes;