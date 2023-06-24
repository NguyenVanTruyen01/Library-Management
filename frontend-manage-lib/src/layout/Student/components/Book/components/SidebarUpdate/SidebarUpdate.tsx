import styles from './styles/sidebar-update.module.scss'
import { useForm, SubmitHandler } from "react-hook-form"
import {convertDate} from "utility/ConvertDate"
// import CoreAPI from 'api/core.api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCallback, useEffect, useState } from 'react'
import { Response } from '@type/ListResponse'
import Image from 'components/Image/Image'
import DefaultBook from 'asset/images/default-book.png'
// import CoreModel from 'model/Core'


// interface CoreRequest extends CoreModel{
//     student_id:String
//     assembly_id:String
// }

const SidebarUpdateBook = (props:any) => {
 
    console.log(props?.data)

    const [tabActive,setTabActive] = useState<Boolean>(false)

    const { register, handleSubmit} = useForm<any>()

    const onSubmit: SubmitHandler<any> =async data =>
    {
        try {
            // data.assembly_id = props?.data?._id || ""
            console.log(data)
            console.log(props?.data)
            let student_id = ""
          
        }catch (err:any){
            console.log("errr")
        }
    }
    useEffect(()=>{

    },[])
      return (
        <div className={styles.sidebarEdit}>
        <div className={styles.containerEdit}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.headerEdit}>
                    <div className={styles.close} onClick={props.handleClose}>
                        <i className="fa-sharp fa-solid fa-xmark"/>
                    </div>
                </div>
                <div className={styles.bodyEdit}>
                    <div className={styles.title}>
                        <p>Chi tiết sách</p>
                    </div>
                    <div className={styles.formField}>
                        <div className={`${styles.layout}  item-btw`}>
                            <div className={styles.item1}>
                                <p>Tên sách</p>
                                <input type={"text"}
                                    defaultValue={props?.data?.title ? props?.data?.title:""}
                                />
                            </div>
                            <div className={styles.item1}>
                                <p>Tác giả </p>
                                <input type={"text"}
                                    defaultValue={props?.data?.author? props?.data?.author :""}
                                />
                            </div>
                        </div>
                        <div className={styles.imageBook}>
                                <p>Anh bìa sách</p>
                                <div className={styles.image}>
                                    <div className={`background-image ${props?.contain && props?.contain } ${styles.img}`} style={{backgroundImage:`url("${props?.data?.bookCover?.url ? props?.data?.bookCover?.url : DefaultBook}")`}}/>
                                </div>
                        </div>
                        <div className={`${styles.layout}  item-btw`}>
                            <div className={styles.item1}>
                                <p>Gía mượn</p>
                                <input type={"text"}
                                    defaultValue={props?.data?.price ? props?.data?.price:""}
                                />
                            </div>
                            <div className={styles.item1}>
                                <p>Nhà Xuất Bản </p>
                                <input type={"text"}
                                    defaultValue={props?.data?.publisher? props?.data?.publisher :""}
                                />
                            </div>
                        </div>
                        <div className={styles.layout}>
                            <div className={styles.item}>
                                <p>Thể Loại</p>
                                <input type={"text"}
                                    defaultValue={props?.data?.category?.name ? props?.data?.category?.name :""}
                                />
                            </div> 
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <ToastContainer/>
    </div>
  )
}

export default SidebarUpdateBook