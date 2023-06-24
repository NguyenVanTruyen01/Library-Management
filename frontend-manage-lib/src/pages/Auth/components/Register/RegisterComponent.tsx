import { useEffect } from "react"
import styles from "./styles/register.module.scss"
import { SubmitHandler, useForm } from "react-hook-form"
import { IRegister } from "@type/AuthInterface"
import { useAppDispatch } from "redux/store"
import { RegisterAction } from "redux/action/Auth/Auth"
import { toast, ToastContainer } from "react-toastify"

const RegisterComponent = (props: any) => {

    const dispatch = useAppDispatch();

    const notify = (content: string) => toast(`${content}`!);

    const { register, handleSubmit, formState: { errors } } = useForm<IRegister>();

    useEffect(() => {

        if (errors?.email || errors?.password) {
            notify(" Validate Form Fail !!!");
        }

    }, [errors])
    const onSubmit: SubmitHandler<IRegister> = async (data: any, e: any) => {
        try {
            await dispatch(RegisterAction(data))
            notify("Register Success")
            setTimeout(() => {
                props.setIsLogin(true)
                window.location.reload()
            }, 2000)
        } catch (e) {
            notify("Register Fail")
        }
    };
    return (

        <div className={styles.login}>
            <form onSubmit={handleSubmit(onSubmit)} >
                <div className={styles.loginForm}>
                    <div className={styles.loginFormTitle}>
                        <h2>Register</h2>
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
                        <div>
                            <div className={styles.loginFormBodyItem}>
                                <input type={"text"} placeholder='Enter your name'
                                    {...register("name", { required: true })}
                                />
                                <span>{errors?.name && "Name is validate *"} </span>
                            </div>
                            <div className={styles.loginFormBodyItem}>
                                <input type={"password"} placeholder='Enter your password'
                                    {...register("password", { required: true, minLength: 6 })}
                                />
                                <span>{errors?.password && "Password is validate *"} </span>
                            </div>
                            <div className={styles.loginFormBodyItem}>
                                <input type={"text"} placeholder='Enter your phone'
                                    {...register("phone", { required: true, minLength: 10, maxLength: 11 })}
                                />
                                <span>{errors?.phone && "Phone is validate *"} </span>
                            </div>
                        </div>
                        <div>
                            <div className={styles.loginFormBodyItem}>
                                <input type={"text"} placeholder='Enter your email'
                                    {...register("email", { required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ })}
                                />
                                <span>{errors?.email && "Email is validate *"} </span>
                            </div>
                            <div className={styles.loginFormBodyItem}>
                                <input type={"text"} placeholder='Enter your MSSV'
                                    {...register("mssv", { required: true, minLength: 8, maxLength: 8 })}
                                />
                                <span>{errors?.mssv && "Mssv is validate *"} </span>
                            </div>
                            <div className={styles.loginFormBodyItem}>
                                <input type={"password"} placeholder='Enter confirm password' />
                                <span>{errors?.password && "Password is validate *"} </span>
                            </div>
                            <div className={styles.loginFormBodyItem}>
                                <select {...register("role")}>
                                    <option >Bạn là ?</option>
                                    <option value={"teacher"}>Teacher</option>
                                    <option value={"student"}>Student</option>
                                    <option value={"leader"}>Leader</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={styles.loginFormBottom}>
                        <div className={styles.loginFormBottomAction}>
                            <button > Register</button>
                        </div>
                        <div className={styles.loginFormBottomRegisterOrLogin}>
                            <p>Don't must have account ?  <span onClick={props.RegisterToLogin}>Click to Login</span></p>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    )
}

export default RegisterComponent;