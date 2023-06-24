import React, { useEffect } from 'react'
import styles from './styles/login.module.scss'
import { useForm, SubmitHandler } from "react-hook-form"
import { LoginAction } from "redux/action/Auth/Auth"
import { ILogin } from "@type/AuthInterface"
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from "redux/store"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Storage from "../../../../congfig/storage/Storage"
const LoginComponent = (props: any) => {

    const navigate = useNavigate()

    const access_token = Storage.GetLocalStorage("user")

    const role = JSON.parse(Storage.GetLocalStorage("info-user") || "{}") || {}

    const notify = (content: string) => toast(`${content}`!)

    const dispatch = useAppDispatch()

    const { register, handleSubmit, formState: { errors } } = useForm<ILogin>()

    useEffect(() => {
        if (access_token && access_token.length > 0) {
            if (role?.role === "teacher") { navigate('/teacher') }
            else if (role?.role === "leader") { navigate('/leader') }
            else if (role?.role === "admin") { navigate('/admin') }
            else if (role?.role === "student") { navigate('/student') }
        }
    }, [access_token])

    const onSubmit: SubmitHandler<ILogin> = async (data: any, e: any) => {
        e.preventDefault()
        try {
            await dispatch(LoginAction(data))
            notify("Login success")
            // if(role?.role === "teacher") {navigate('/teacher')}
            // else if( role?.role === "leader") {navigate('/leader')}
            // else if( role?.role === "admin") {navigate('/admin')}
            // else if( role?.role === "student") {navigate('/student')}
            // if(access_token) navigate('/home')
        } catch (e) {
            notify("Login Error")
        }
    };

    useEffect(() => {
        if (errors?.email || errors?.password) {
            notify(" Validate Form Fail !!!")
        }
    }, [errors])

    return (
        <div className={styles.login}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className={styles.loginForm}>
                    <div className={styles.loginFormTitle}>
                        <h2>Thư Viện Online </h2>
                        <p>Enter your details below</p>
                    </div>
                    <div className={styles.loginFormSocial}>
                        <span className={styles.color}><i className="fa-brands fa-instagram" /></span>
                        <span><i className="fa-brands fa-facebook" /></span>
                        <span><i className="fa-brands fa-google" /></span>
                    </div>
                    <div className={styles.loginFormLine}>
                        <span className={styles.line} /> <span className={styles.or}>OR</span><span className={styles.line} />
                    </div>
                    <div className={styles.loginFormBody}>
                        <div className={styles.loginFormBodyItem}>
                            <input
                                type={"text"}
                                placeholder='Email Address'
                                {...register("email", { required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ })}
                            />
                            <span>{errors?.email && "Email is validate *"} </span>
                        </div>
                        <div className={styles.loginFormBodyItem}>
                            <input
                                type={"password"}
                                placeholder='Password'
                                autoComplete="off"
                                {...register("password", { required: true, minLength: 6 })}
                            />
                            <span>{errors?.password && "Password is validate *"} </span>
                        </div>
                    </div>
                    <div className={styles.loginFormBottom}>
                        <div className={`${styles.loginFormBottomAction} item-center`}>
                            <button type={"submit"}><i className="fa-solid fa-arrow-right-to-arc" />Login</button>
                        </div>
                        <div className={styles.loginFormBottomRegisterOrLogin}>
                            <p>Don't must have account ? <span onClick={props.ChangLoginToRegister}>Click to register</span></p>
                            <p ><span onClick={props.HandleChangLoginForgot}>Forgot password</span></p>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    )
}

export default LoginComponent



