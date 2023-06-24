import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import styles from './styles/modal-update-avatar.module.scss'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import User from 'constant/User'
import AuthServices from 'api/auth.api'
import { Response } from '@type/ListResponse'
import { imageUpload } from '../../../../../../utility/ImagesUpload'
import Storage from 'congfig/storage/Storage';

const ModalUpdateAvatar = (props: any) => {
    console.log(props?.data)


    //Lưu avatar khi thay đổi
    const [imagesAvatar, setImagesAvatar] = useState<File[]>([]);

    const [imageDefault, setImageDefault] = useState("https://res.cloudinary.com/dehtpa6ba/image/upload/v1677038569/manage_lib/avatar_wgaep7.webp");
    const [onChangeAvatar, setOnChangeAvatar] = useState<Boolean>(false)

    const handleOnChangeAvatar = (e: any) => {
        e.preventDefault()
        const files = [...e.target.files]

        let err = "";

        if (!files[0]) return err = "File does not exist"
        if (files[0].type !== "image/jpeg" && files[0].type !== "image/png" && files[0].type !== "image/jpg")
            return err = "Image format is incorrect"

        if (err) {
            console.log(err)
        }
        else {
            setImagesAvatar(files);
            setOnChangeAvatar(true)
        }
        e.target.value = null;

    }

    const handleSummitAvatar = async () => {

        try {

            let media: any = []
            if (imagesAvatar.length > 0) {
                media = await imageUpload(imagesAvatar);
            }
            else {
                toast.warning("Bạn vui lòng chọn hình để thay đổi.")
                return;
            }
            await AuthServices.updateAvatarAccount({ data: media[0], id: User.id }).then((result: Response | undefined) => {
                toast.success("Cập nhật thông tin sách thành công!")

                Storage.SetLocalStorage("info-user", JSON.stringify(result?.data))
                setImageDefault(result?.data?.avatar?.url)
                window.location.reload()
                console.log(result)
                setOnChangeAvatar(false)
            })

            // setImagesAvatar([])
        } catch (error) {
            console.log(error)
        }

    }


    return (
        <>
            <div className={`${styles.updateAvaterModal} item-center`}>

                <div className={styles.main}>
                    <div className={`${styles.header} item-btw`}>
                        <div className={styles.title}>Cập nhật ảnh đại diện</div>
                        <div className={styles.close} onClick={props?.handleClose}><i className="fa-sharp fa-solid fa-xmark" /></div>
                    </div>
                    <div className={styles.changeAvatar}>
                        <div className={styles.authorChangeAvatar}>
                            <div className={styles.profileAuthorChange}>
                                <img className={styles.avatar} alt="author"
                                    style={{ background: "#ffffff" }}
                                    src={onChangeAvatar ? URL.createObjectURL(imagesAvatar[0]) :
                                        imageDefault
                                    } />
                                <div className={styles.edit_dp}
                                >
                                    <label className={styles.fileContainer}>
                                        <i className="fa fa-camera"></i>
                                        <input type="file"
                                            onChange={handleOnChangeAvatar} />
                                    </label>
                                </div>

                            </div>
                        </div>

                        <div className={styles.groupAction}>
                            <div className={styles.groupBtn}>
                                <button type="button"
                                    className={styles.cancel}
                                    onClick={() => {
                                        setOnChangeAvatar(false)
                                        props?.handleClose()
                                    }}
                                >Hủy</button>
                                <button type="button"
                                    className={styles.save}
                                    onClick={() => handleSummitAvatar()}
                                >Lưu thay đổi</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ModalUpdateAvatar