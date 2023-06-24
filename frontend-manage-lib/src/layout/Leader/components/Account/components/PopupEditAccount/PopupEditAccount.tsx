import React from 'react'
import styles from './styles/popup-edit-account.module.scss'
import { Button } from '@mui/material'
import AuthService from 'api/auth.api'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useForm } from "react-hook-form";
import PopupListCallCard from 'components/PopupListCallCard/PopupListCallCard';



const PopupEditAccount = (props: any) => {

    // Hứng detailAccount
    const { detailAccount, handleClose } = props;

    const { register, handleSubmit } = useForm(
        {
            defaultValues: {
                email: detailAccount?.email,
                name: detailAccount?.name,
                mssv: detailAccount?.mssv,
                cmnd: detailAccount?.cmnd,
                phone: detailAccount?.phone,
                age: detailAccount?.age,
                addressCurrent: detailAccount?.addressCurrent,
                addressHouse: detailAccount?.addressHouse
            }
        }
    );

    // Thực hiện cập nhật thông tin sách
    const onSubmit = async (data: any, e: any) => {

        data._id = detailAccount._id;
        console.log(data);
        await AuthService.updateInfoAccount(data)
            .then((result: any) => {
                console.log("result", result);
                toast.success("Cập nhật thông tin sách thành công!")
                handleClose();
            })
            .catch((error: any) => {
                console.log("error", error)
                toast.error(error.response.data.msg)
            })

    }

    const onError = (errors: any, e: any) => console.log(errors, e);

    return (
        <div className={styles.detailScan}>

            <div className={styles.mainPopup}>
                <div className={`${styles.headerPopup} w-90 item-btw`}>
                    <div className={styles.title}>
                        CHI TIẾT TÀI KHOẢN
                    </div>
                    <div className={styles.close} onClick={props?.handleClose}>
                        <i className="fa-sharp fa-solid fa-xmark" />
                    </div>
                </div>

                <div className={`${styles.bodyPopup} w-90`}>
                    <div className={`${styles.imgBook} w-45`}>
                        <div>


                            <img src={detailAccount?.avatar?.url}
                                alt="" />

                            <div>
                                <h4 className={styles.role}>
                                    {detailAccount.role === "leader" ? "Admin" : "Student"}
                                </h4>

                                <input type="checkbox" id="popup" className={styles.checkedpopup} />

                                <div className={styles.popupCallCards}>
                                    <div className={styles.mainPopupCallCards}>
                                        <div className={`${styles.headerPopup} w-90`}>
                                            <div className={styles.title}>
                                                DANH SÁCH PHIẾU MƯỢN
                                            </div>

                                            <label htmlFor="popup">
                                                <div className={styles.close} >
                                                    <i className="fa-solid fa-left-long"></i>
                                                </div>
                                            </label>

                                        </div>

                                        <div className={`${styles.bodyPopup} w-90`}>
                                            <PopupListCallCard idUser={detailAccount._id} />
                                        </div>

                                    </div >

                                </div>

                                <label htmlFor="popup">
                                    <h4 className={styles.callcard}>
                                        Đơn mượn sách
                                    </h4>
                                </label>

                            </div>

                        </div>

                    </div>

                    <div className={`${styles.result} w-45`}>
                        <div className={styles.titleResult} >Thông tin tài khoản</div>
                        <form onSubmit={handleSubmit(onSubmit, onError)}>
                            <div className={styles.main}>

                                <div>
                                    <div className={styles.flexItems}>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"text"}
                                                disabled
                                                {...register("email")}
                                            />
                                            <span>Email</span>
                                        </div>
                                        <div className={styles.loginFormBodyItem}>
                                            <input
                                                type={"text"}
                                                {...register("name")}
                                            />
                                            <span>Name</span>
                                        </div>
                                    </div>

                                    <div className={styles.flexItems}>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"text"}
                                                {...register("mssv")}
                                            />
                                            <span>MSSV</span>
                                        </div>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"text"}
                                                {...register("cmnd")}
                                            />
                                            <span>CCCD or CMND</span>
                                        </div>
                                    </div>

                                    <div className={styles.flexItems}>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"text"}
                                                min={0}
                                                step={100}
                                                {...register("phone")}
                                            />
                                            <span>Số điện thoại</span>
                                        </div>

                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"number"}
                                                min={0}
                                                step={1}
                                                {...register("age")}
                                            />
                                            <span>Tuổi</span>
                                        </div>

                                    </div>

                                    <div className={styles.flexItems}>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"text"}
                                                placeholder="Chưa cập nhật"
                                                {...register("addressCurrent")}

                                                defaultValue={detailAccount?.quantity}
                                            />
                                            <span>Chỗ ở hiện tại</span>
                                        </div>

                                    </div>

                                    <div className={styles.flexItems}>
                                        <div className={styles.loginFormBodyItem}>
                                            <input type={"text"}
                                                placeholder="Chưa cập nhật"
                                                {...register("addressHouse")}
                                            />
                                            <span>Địa chỉ thường trú</span>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className={styles.groupBtn}>

                                <Button
                                    variant='contained'
                                    color='warning'
                                    onClick={props?.handleClose}
                                >Hủy</Button>
                                {/* 
                                <Button
                                    variant='contained'
                                    color="success"
                                    type='submit'
                                >Reset mật khẩu</Button> */}

                                <Button
                                    variant='contained'
                                    color='primary'
                                    type='submit'
                                >Cập nhật</Button>
                            </div>

                        </form>

                    </div>
                </div>

            </div >

        </div >
    )
}

export default PopupEditAccount