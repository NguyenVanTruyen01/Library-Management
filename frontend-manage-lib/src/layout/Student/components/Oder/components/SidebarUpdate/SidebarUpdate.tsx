import styles from './styles/sidebar-update.module.scss'
import { useForm, SubmitHandler } from "react-hook-form"
import {convertDate} from "utility/ConvertDate"
// import CoreAPI from 'api/core.api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCallback, useEffect, useState } from 'react'
import { Response } from '@type/ListResponse'
import Image from 'components/Image/Image'

import LoaderItem from 'components/LoaderItem/LoaderItem'


const SidebarUpdate = (props:any) => {
 
    console.log(props?.data)

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
                        <p>Hóa đơn</p>
                    </div>
                    <div className={styles.formField}>
                        <div className={`${styles.layout}  item-btw`}>
                            <div className={`${styles.item1} `}>
                                <p>Ngày mượn</p>
                                <input type={"text"}
                                    defaultValue={props?.data?.createdAt ?convertDate(props?.data?.createdAt) :""}
                                />
                                 <span><i className="fa-solid fa-calendar-days"/> </span>
                            </div>
                            <div className={styles.item1}>
                                <p>Ngày trả </p>
                                <input type={"text"}
                                    defaultValue={props?.data?.dueDate ? convertDate(props?.data?.dueDate) :""}
                                />
                                <span><i className="fa-solid fa-calendar-days"/> </span>
                            </div>
                        </div>
                        <div className={styles.layout}>
                            {
                                props?.data?.books?.length > 0 ?  props?.data?.books.map((value:any,index:number)=>{
                                    return  <div className={`${styles.item} item-btw w-100`} key={`item_book`+index}>
                                                <div className={styles.infoBook}>
                                                    <div>{index+1}. {value?.idBook?.title}</div>
                                                    <p className={styles.title}><i className="fa-solid fa-book"/> &emsp;{value?.idBook?.title} </p>
                                                    <p className={styles.quantity}><i className="fa-solid fa-bookmark"/> &emsp;{value?.quantity} </p>
                                                    <p className={styles.price}><i className="fa-solid fa-money-bill"/>&emsp;{value?.idBook?.price} VND </p>
                                                </div>
                                                <div className={styles.imageBook}>
                                                    <Image image={value?.idBook?.bookCover?.url} contain={"contain"}/>
                                                </div>
                                            </div>
                                            }):<LoaderItem/>
                            }
                           
                        </div>
                        <div className={styles.qrCode}>
                            <p>Mã QR hóa đơn </p>
                            <div className={`${styles.imageQr} background-image w-60`}>
                                <Image image={props?.data?.QRCode} contain='contain'/>
                            </div>
                        </div>
                        <div className={styles.status}>
                            
                            Tình Trạng:&emsp;<span>{!props?.data?.waitingOrder  ? "Đang chờ xét duyệt":"Đã mượn"}</span>
                            {/* "Đang chờ xét duyệt" */}
                        </div>
                    </div>
                </div>
                {/* <div className={styles.bottomEdit}>
                        <button type={'submit'}>
                            Thêm điểm
                        </button>
                </div> */}
            </form>
        </div>
        <ToastContainer/>
    </div>
  )
}

export default SidebarUpdate