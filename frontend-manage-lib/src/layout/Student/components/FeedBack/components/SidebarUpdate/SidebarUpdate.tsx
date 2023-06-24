import styles from './styles/sidebar-update.module.scss'
import { useForm, SubmitHandler } from "react-hook-form"
import {convertDate} from "utility/ConvertDate"
// import CoreAPI from 'api/core.api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCallback, useEffect, useState } from 'react'
import { Response } from '@type/ListResponse'
import Image from 'components/Image/Image'
import Logo from 'asset/images/logo_lib.png'
import LoaderItem from 'components/LoaderItem/LoaderItem'
// import CoreModel from 'model/Core'


// interface CoreRequest extends CoreModel{
//     student_id:String
//     assembly_id:String
// }

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
            // let coreRequest: CoreRequest = {
            //     infact:1,// thực tiễn đề tài 
            //     completed:1, // khả năng hoàn thiện của đề tài
            //     quality_present:1,// chất lượng thuyết trình
            //     research:1,// điểm nghiên cứu
            //     content_synthesis:1,// điểm tổng hợp nội dung luận văn
            //     quality_thesis:1,// chất lượng của luận văn
            //     reply_question:1,// điểm trả lời câu hỏi
            //     student_id:"String",
            //     assembly_id:"String"
            // }
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
                            </div>
                            <div className={styles.item1}>
                                <p>Ngày trả </p>
                                <input type={"text"}
                                    defaultValue={props?.data?.dueDate ? convertDate(props?.data?.dueDate) :""}
                                />
                            </div>
                        </div>
                        <div className={styles.layout}>
                            {
                                props?.data?.books?.length > 0 ?  props?.data?.books.map((value:any,index:number)=>{
                                    return  <div className={`${styles.item} item-btw w-100`} key={`item_book`+index}>
                                    <div className={styles.infoBook}>
                                        <div>1. {value?.idBook?.title}</div>
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