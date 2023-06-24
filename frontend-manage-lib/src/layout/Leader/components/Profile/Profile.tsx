import styles from './styles/profile.module.scss'
import './styles/profile.module.scss'
import Image from 'components/Image/Image'
import User from 'constant/User'
import IcAvatar from 'asset/images/avatar.webp'
import { useEffect, useState } from 'react'
import ModalUpdateProfile from './components/ModalUpdateProfile/ModalUpdateProfile'
import ModalUpdateAvatar from './components/ModalUpdateAvatar/ModalUpdateAvatar'
import LoadingPage from 'components/LoadingPage/LoadingPage'
const Profile = () => {

    let value = User.info_user
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    let [detailProfile, setDetailProfile] = useState<Boolean>(false);
    let [openUpdateAvatar, setOpenUpdateAvatar] = useState<Boolean>(false)

    useEffect(() => {

    }, [isLoading])

    return (
        <>

            <div className={styles.profile}>
                <div className={styles.img}>
                    <div className={styles.styleImg}>
                        <div className={styles.avatar}>
                            <Image contain='cover' image={value.avatar.url ? value.avatar.url : IcAvatar} />
                        </div>
                        <div className={styles.editAvatar}
                            onClick={() => setOpenUpdateAvatar(true)}
                        >
                            <label >
                                <i className="fa fa-camera"></i>
                            </label>

                        </div>
                    </div>
                    <div className={styles.role}>{value.role === "leader" ? "Admin" : "Student"}</div>
                </div>
                <div className={styles.mainContent}>
                    <div className={`${styles.headerTitle} item-btw`}>
                        <div className={styles.title}>
                            Thông tin cơ bản
                        </div>
                        <div className={`${styles.icon} background-image`} onClick={() => setDetailProfile(true)}>
                            <button>
                                <i className="fa-solid fa-user-pen"></i>
                            </button>

                        </div>
                    </div>

                    <div className={`${styles.fieldGroup} item-btw`}>

                        <div className={styles.loginFormBodyItem}>
                            <input type={"text"}
                                defaultValue={value?.email}
                                disabled
                            />
                            <span>Email</span>
                        </div>

                        <div className={styles.loginFormBodyItem}>
                            <input type={"text"}
                                defaultValue={value?.name}
                                disabled
                            />
                            <span>Họ và tên</span>
                        </div>


                        {/* <div className={styles.filed}>
                            <p>User Name</p>
                            <input type={"text"} defaultValue={value.name} disabled />
                        </div> */}
                        {/* <div className={styles.filed}>
                            <p>CMND</p>
                            <input type={"text"} defaultValue={value.mssv ? value.mssv : "Chưa cập nhật"} disabled />
                        </div> */}
                    </div>

                    <div className={`${styles.fieldGroup} item-btw`}>
                        <div className={styles.loginFormBodyItem}>
                            <input type={"text"}
                                defaultValue={value?.phone}
                                disabled
                            />
                            <span>Số điện thoại</span>
                        </div>

                        <div className={styles.loginFormBodyItem}>
                            <input type={"text"}
                                defaultValue={value?.cmnd}
                                disabled
                            />
                            <span>CCCD or CMND</span>
                        </div>
                    </div>

                    <div className={styles.loginFormBodyItem}>
                        <input type={"text"}
                            defaultValue={value.addressCurrent ? value.addressCurrent : "Chưa cập nhật"}
                            disabled
                        />
                        <span>Chỗ ở hiện tại</span>
                    </div>

                    <div className={styles.loginFormBodyItem}>
                        <input type={"text"}

                            defaultValue={value.addressHouse ? value.addressHouse : "Chưa cập nhật"}
                            disabled
                        />
                        <span>Địa chỉ thường trú</span>
                    </div>



                </div>
                {isLoading && <LoadingPage />}
                {
                    detailProfile ? <ModalUpdateProfile data={value} handleClose={() => { setDetailProfile(false) }} /> : <></>
                }
                {
                    openUpdateAvatar ? <ModalUpdateAvatar data={value} handleClose={() => { setOpenUpdateAvatar(false) }}
                        handleOpenLoading={() => setIsLoading(true)}
                        handleCloseLoading={() => setIsLoading(false)}
                    /> : <></>
                }
            </div>

        </>
    )
}

export default Profile