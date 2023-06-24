import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import routes from "./Config.constant.router"
import Loader from 'components/Loader/Loader'
import AuthenticatedGuard from './AuthRoute'
const ProtectedRoutesStudent = () => {
    return(
        <Suspense  fallback={<Loader/>}>
            <Routes>
                {
                    routes.map((route,index:number)=>{
                        return   <Route key={index}
                                        path= {route.path}
                                        element={
                                            <AuthenticatedGuard>
                                                <route.component />
                                            </AuthenticatedGuard>
                                        }
                        />
                    })
                }
            </Routes>
        </Suspense>
    )
};
export default ProtectedRoutesStudent