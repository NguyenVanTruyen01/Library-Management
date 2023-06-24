import styles from './styles/sidebar-register.module.scss'
import { useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from 'react-toastify'
import { useAppDispatch } from 'redux/store'
import { IRegister } from '@type/AuthInterface'
import { RegisterAction } from 'redux/action/Auth/Auth'


const SideBarRegister = (props: any) => {

    const dispatch = useAppDispatch()

    const notify = (content: string) => toast(`${content}`!)

    const { register, handleSubmit, formState: { errors } } = useForm<IRegister>()

    useEffect(() => {

        if (errors?.email || errors?.password) {
            notify(" Validate Form Fail !!!")
        }

    }, [errors])
    const onSubmit: SubmitHandler<IRegister> = async (data: any, e: any) => {
        try {
            console.log("Auth", data)
            await dispatch(RegisterAction(data))

            // setTimeout(() => {
            //     props?.handleClose()
            //     window.location.reload()
            // }, 2000)
        } catch (e) {
            notify("Register Fail")
        }
    };

    return (

        <div className={styles.sidebarEdit}>
            <div className={styles.containerEdit}>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className={styles.headerEdit}>
                        <div className={styles.close} onClick={props.handleClose}>
                            <i className="fa-sharp fa-solid fa-xmark" />
                        </div>
                    </div>
                    <div className={styles.loginForm}>
                        <div className={styles.loginFormTitle}>
                            <h2>Thêm tài khoản</h2>
                        </div>

                        <div className={styles.loginFormLine}>
                            <span className={styles.line} /> <span className={styles.or}>OR</span><span className={styles.line} />
                        </div>
                        <div className={styles.loginFormBody}>
                            <div>

                                <div className={styles.loginFormBodyItem}>
                                    <input type={"text"}
                                        {...register("email", { required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ })}
                                    />
                                    <span className={styles.labelInput}>Email</span>
                                    <span>{errors?.email && "Email is validate *"} </span>
                                </div>

                                <div className={styles.loginFormBodyItem}>
                                    <input type={"password"}
                                        {...register("password", { required: true, minLength: 6 })}
                                    />
                                    <span className={styles.labelInput}>Mật khẩu</span>
                                    <span>{errors?.password && "Password is validate *"} </span>
                                </div>


                                <div className={styles.loginFormBodyItem}>
                                    <input type={"text"}
                                        {...register("name", { required: true })}
                                    />
                                    <span className={styles.labelInput}>Họ và tên</span>
                                    <span>{errors?.name && "Name is validate *"} </span>
                                </div>

                                <div className={styles.loginFormBodyItem}>
                                    <input type={"text"}
                                        {...register("cmnd", { required: true, minLength: 8, maxLength: 8 })}
                                    />
                                    <span className={styles.labelInput}>CCCD</span>
                                    <span>{errors?.cmnd && "CMND is validate *"} </span>
                                </div>


                                <div className={styles.loginFormBodyItem}>
                                    <select {...register("role")}>
                                        <option >Chức danh</option>
                                        {/* <option value={"teacher"}>Teacher</option> */}
                                        <option value={"student"}>Student</option>
                                        <option value={"leader"}>Admin</option>
                                    </select>
                                    <span className={styles.labelInput}>Loại tài khoản</span>
                                </div>
                            </div>

                            <div>

                                <div className={styles.loginFormBodyItem}>
                                    <input type={"text"}
                                        {...register("mssv", { required: true, minLength: 8})}
                                    />
                                    <span className={styles.labelInput}>MSSV</span>
                                    <span>{errors?.mssv && "Mssv is validate *"} </span>
                                </div>
                                <div className={styles.loginFormBodyItem}>
                                    <input type={"password"} />
                                    <span className={styles.labelInput}>Nhập lại mật khẩu</span>
                                    <span>{errors?.password && "Password is validate *"} </span>
                                </div>

                                <div className={styles.loginFormBodyItem}>
                                    <input type={"number"}
                                        {...register("phone", { required: true, minLength: 10, maxLength: 11 })}
                                    />
                                    <span className={styles.labelInput}>Số điện thoại</span>
                                    <span>{errors?.phone && "Phone is validate *"} </span>
                                </div>

                                <div className={styles.loginFormBodyItem}>
                                    <input type={"text"}
                                        {...register("age")}
                                    />
                                    <span className={styles.labelInput}>Tuổi</span>
                                    <span>{errors?.age && "Age is validate *"} </span>
                                </div>


                            </div>
                        </div>

                        <div className={styles.loginFormBottom}>
                            <div className={styles.loginFormBottomAction}>
                                <button type='submit' >Thêm tài khoản</button>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SideBarRegister