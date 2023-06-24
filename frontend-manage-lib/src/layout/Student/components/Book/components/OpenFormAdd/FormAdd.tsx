import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles/form-add.module.scss'
import { useForm, SubmitHandler } from "react-hook-form"
// import { convertDate } from 'utility/ConvertDate'
import Select from 'react-select'
import User from 'constant/User'
import { CurrentDate } from 'utility/ConvertDate'
import BookService from 'api/book.api'
import OderService from 'api/order.api'
import { toast ,ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
type Inputs = {
    borrower: string
    issueDate:string
    dueDate: string
    books:any[]
    fee:Number
}

const FormAdd = (props:any) => {
    const [books,setBooks] =useState<any>([])
    const [booksPrice,setBooksPrice] =useState<any>([])
    const [priceOder,setPriceOder] =useState<Number>(0)
    const [listBook,setListBook] = useState<any>([])
    const { register, handleSubmit,formState: { errors }} = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> =async data =>
    {
        let bookBody = []
        for (let index = 0; index < listBook.length; index++) {
            let item = {
                idBook:listBook[index].value,
                quantity:1
            }
            bookBody.push(item)
        }
        let callCard = {
            borrower : User.id,// ngừi mượn
            issueDate: new Date(data.issueDate),
            dueDate:new Date(data.dueDate),
            books:bookBody,
            fee:priceOder,
            waitingOrder:false
        }
        // console.log(listBook)
        // console.log(data)
        try {
           
            await OderService.onCreateOder(callCard).then((result:any)=>{
                if(result.data){
                    toast("Đăng kí mượn thành công",{autoClose:1500})
                }
                console.log(result)
            })
        }catch (err:any){
            console.log("errr")
        }
    }
    const handleChange = (selectedOption:any) => {
        setListBook(selectedOption)
        let price = 0 
        for (let index = 0; index < selectedOption.length; index++) {
            let itemFIlter = booksPrice.filter((item:any)=> selectedOption[index].value === item._id)
            price  =price + itemFIlter[0].price
        }
        setPriceOder(price)
      };
    const DBBooks=useCallback(async ()=>{
        return await BookService.getAllBook(1)
    },[])

    useEffect( ()=>{
        DBBooks().then((result)=>{
            setBooksPrice(result?.data)
            let optionsBooks:{ value:string;label:string }[]=[]
            for(const x of result?.data){
                optionsBooks=[...optionsBooks,{
                    value:x?._id,
                    label:x?.title
                }]
            }
            setBooks(optionsBooks)
        })
    },[])
  return (
   
    <div className={styles.sidebarEdit}>
    <div className={styles.containerEdit}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.headerEdit}>
                <div className={styles.close} 
                onClick={props.handleClose}
                >
                    <i className="fa-sharp fa-solid fa-xmark"/>
                </div>
            </div>
            <div className={styles.bodyEdit}>
                <div className={styles.title}>
                    <p>Phiếu mượn sách</p>
                </div>
                <div className={styles.formField}>
                    <div className={`${styles.layout}  item-btw`}>
                        <div className={styles.item1}>
                            <p>Người mượn</p>
                            <input type={"text"}
                                //    {...register("name_topic")}
                                defaultValue={User?.info_user?.name }
                            />
                        </div>
                        <div className={styles.item1}>
                            <p>Ngày mượn</p>
                            <input type={"text"}
                                   {...register("issueDate")}
                                defaultValue={CurrentDate()}
                            />
                            <span><i className="fa-solid fa-calendar-days"/> </span>
                        </div>
                    </div>
                    <div className={styles.layout}>
                        <div className={styles.item}>
                            <p>Sách muốn mượn</p>
                            <Select
                                // value={selectedOption}
                                onChange={handleChange}
                                options={books.length> 0 ? books :[]}
                                isMulti
                            />
                        </div>
                        <div className={styles.item}>
                            <p>Ngày trả sách</p>
                            <input type={'date'}
                                   {...register("dueDate",{ required: true})}
                                // defaultValue={CurrentDate()}
                            />
                            <span>{errors?.dueDate&& "Due Date is not empty *"} </span>
                        </div>
                        <div className={styles.item1}>
                            <p>Đơn giá</p>
                            <p>{`Thành tiền: ${priceOder}`}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.bottomEdit}>
                    <button type={'submit'}>
                        Đăng kí mượn
                    </button>
            </div>
        </form>
    </div>
    <ToastContainer/>
</div>
  )
}

export default FormAdd