import React from 'react'
import ComponentPage from "components/ComponentPage/ComponentPages"
import styles from './styles/auth.module.scss'
import LoginComponent from "pages/Auth/components/Login/LoginComponent"
import RegisterComponent from "pages/Auth/components/Register/RegisterComponent"
import ForgotPassword from "pages/Auth/components/ForgotPassword/ForgotPassword"
import LogoSPKT from 'asset/images/logo-graduation.jpg'
import Image from "components/Image/Image"
const Auth=()=>{

    const [isLogin,setIsLogin]=React.useState("login")

    function HandleChangLoginRegister(){
        setIsLogin("register")
    }
    function HandleChangRegisterToLogin(){
        setIsLogin("login")
    }
    function HandleChangLoginForgot(){
        setIsLogin("forgot")
    }

    return(
        <ComponentPage isHiddenHeader={false} isHiddenFooter={false}>
            <div className={`${styles.loginContainer} item-center`}>
                <div className={`${styles.loginMain}`}>
                    <div className={styles.img}>
                        <div className={styles.logo}>
                            <Image image={LogoSPKT}/>
                        </div>
                    </div>
                    <div className={styles.content}>
                        {isLogin==="login" && <LoginComponent ChangLoginToRegister={HandleChangLoginRegister}  HandleChangLoginForgot={HandleChangLoginForgot}v  />}
                        {isLogin==="register" && <RegisterComponent RegisterToLogin={HandleChangRegisterToLogin} setIsLogin={setIsLogin}/>}
                        {isLogin==="forgot" && <ForgotPassword  setIsLogin={setIsLogin}/>}
                    </div>
                </div>
            </div>
        </ComponentPage>
    )
}
export default  Auth