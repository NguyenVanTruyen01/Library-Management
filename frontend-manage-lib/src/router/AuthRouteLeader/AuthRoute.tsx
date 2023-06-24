import { Navigate } from 'react-router-dom'
import React from 'react'
import Storage from "congfig/storage/Storage"
function AuthenticatedGuard({children,...rest}:any) {
    let isLogin = Storage.GetLocalStorage("user")

    let isRole = JSON.parse(Storage.GetLocalStorage("info-user" )|| "") || {}
    let role:string = isRole?.role

    return (
        <>
            { isLogin && role === "leader"  ? children: <Navigate to="/" replace /> }
        </>
    )
}

export default AuthenticatedGuard;