import { BrowserRouter } from "react-router-dom"
import PublicRoutes from './PublicRoutes'
// import ProtectedRoutesAdmin from "./AuthRouteAdmin/ProtectedRouteAdmin"
import ProtectedRoutesStudent from "./AuthRouteStudent/ProtectedRouteStudent"
import ProtectedRoutesLeader from "./AuthRouteLeader/ProtectedRouteLeader"
// import ProtectedRoutesTeacher from './AuthRouteTeacher/ProtectedRouteTeacher'
export default function Routers() {
    return (
        <BrowserRouter>
            <PublicRoutes/>
            {/* <ProtectedRoutesAdmin/> */}
            <ProtectedRoutesStudent/>
            <ProtectedRoutesLeader/>
            {/* <ProtectedRoutesTeacher/> */}
        </BrowserRouter>
    )
}