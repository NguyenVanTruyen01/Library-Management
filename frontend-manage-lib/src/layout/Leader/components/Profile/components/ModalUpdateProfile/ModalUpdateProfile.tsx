
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import styles from './styles/modal-update-profile.module.scss'
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import User from 'constant/User'
import AuthServices from 'api/auth.api'
import { Response } from '@type/ListResponse'
import Storage from 'congfig/storage/Storage'
type Inputs = {
    _id?: string,
    name?: string,
    mssv?: string,
    phone?: string,
    cmnd: string,
    addressCurrent?: string,
    addressHouse?: string,
};
const ModalUpdateProfile = (props: any) => {
    console.log("GHÁDHASGDJGASHDG", props?.data)
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {

            data._id = props?.data?._id

            await AuthServices.updateInfoAccount({ ...data, id: User.id })
                .then((result: Response | undefined) => {
                    toast.success("Cập nhật profile thành công !", { autoClose: 1000 });
                    // props?.handleOpenLoading()
                    Storage.SetLocalStorage("info-user", JSON.stringify(result?.data))

                    setTimeout(() => {
                        window.location.reload()
                        // props?.handleCloseLoading()
                    }, 1500);
                    console.log("Result In4", result?.data)
                })
        } catch (error) {
            toast.success("Server error !", { autoClose: 1000 });
        }
    }
    return (
        <>
            <div className={`${styles.registerModal} item-center`}>



                <div className={styles.main}>

                    <div className={`${styles.header} item-btw`}>
                        <div className={styles.title}>Thông tin cơ bản</div>
                        <div className={styles.close} onClick={props?.handleClose}><i className="fa-sharp fa-solid fa-xmark" /></div>
                    </div>

                    <div className={styles.body}>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className={`${styles.containerField} item-btw`}>

                                <div className={styles.loginFormBodyItem}>
                                    <input type={"text"}
                                        {...register("name", { required: true })}
                                        defaultValue={props?.data?.name}
                                    />
                                    <span>Họ và tên</span>
                                </div>


                                <div className={styles.loginFormBodyItem}>
                                    <input type={"text"}
                                        {...register("mssv", { required: true })}
                                        defaultValue={props?.data?.mssv}
                                    />

                                    <span>MSSV</span>
                                </div>

                            </div>

                            <div className={`${styles.containerField} item-btw`}>

                                <div className={styles.loginFormBodyItem}>
                                    <input type={"text"}
                                        {...register("phone", { required: true })}
                                        defaultValue={props?.data?.phone}
                                    />

                                    <span>Số điện thoại</span>
                                </div>

                                <div className={styles.loginFormBodyItem}>
                                    <input type={"text"}
                                        {...register("cmnd", { required: true })}
                                        defaultValue={props?.data?.cmnd ? props?.data?.cmnd : "Bổ sung"}
                                    />

                                    <span>CCCD/CMND</span>
                                </div>

                            </div>

                            <div className={`${styles.containerField} item-btw`}>
                                <div className={styles.loginFormBodyItem}>
                                    <input type={"text"}
                                        {...register("addressCurrent", { required: true })}
                                        defaultValue={props?.data?.addressCurrent ? props?.data?.addressCurrent : "Bổ sung"}
                                    />

                                    <span>Chỗ ở hiện tại</span>
                                </div>
                            </div>


                            <div className={`${styles.containerField} item-btw`}>
                                <div className={styles.loginFormBodyItem}>
                                    <input type={"text"}
                                        {...register("addressHouse", { required: true })}
                                        defaultValue={props?.data?.addressHouse ? props?.data?.addressHouse : "Bổ sung"}
                                    />

                                    <span>Địa chỉ thường trú</span>
                                </div>
                            </div>




                            <div className={styles.bottom}>
                                <button type={'submit'}>Cập nhật</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ModalUpdateProfile