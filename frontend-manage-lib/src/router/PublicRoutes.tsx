import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import routes from './RouterPublicConfig'

const PublicRoutes = () => {
    return(
        <Routes>
            {
                routes.map(( value,index)=>{
                    let CustomTag=value.component
                    return <Route
                        key={index}
                        path={value.path}
                        element={
                            <Suspense fallback={""}>
                                <CustomTag />
                            </Suspense>
                        }
                    />
                })
            }
        </Routes>
    )

};

export default PublicRoutes;
