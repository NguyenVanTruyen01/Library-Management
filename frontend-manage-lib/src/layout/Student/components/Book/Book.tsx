import  { useState,useCallback,useEffect } from 'react'
import styles from './styles/book.module.scss'
import { useForm, SubmitHandler } from "react-hook-form"
import BookService from 'api/book.api'
import LoaderItem from 'components/LoaderItem/LoaderItem'
import Image from 'components/Image/Image'
import SidebarUpdateBook from './components/SidebarUpdate/SidebarUpdate'
import DefaultBook from 'asset/images/default-book.png'
import FormAdd from './components/OpenFormAdd/FormAdd'
import CategoryService from 'api/category.api'
import LoadingPage from 'components/LoadingPage/LoadingPage'
interface IBookSearch {
    title:string,
    author:string,
    publisher:string,
    category:string,
}

const Book = () => {

    const [isLoading,setIsLoading] = useState<Boolean>(false)
    const { register, handleSubmit,formState: { errors }} = useForm<IBookSearch>()
    const [listBook, setListBook] = useState<any[]>([])
    const [categorys, setCategorys] = useState<any>([])
    let [openDetail,setOpenDetail] = useState<Boolean>(false)
    let [openWaitOder,setOpenWaitOder] = useState<Boolean>(false)
    let [detailBook,setDetailBook] = useState<any>()
    const onSubmit: SubmitHandler<IBookSearch> =async  ( data:any,e:any) => {
        // setListBook((preveState)=>[...preveState,data])
        console.log(data)
        e.preventDefault()
        try {
            await BookService.searchBookByOption(data).then((result:any)=>{
                console.log(data)
                setIsLoading(true)
                setTimeout(() => {
                    setListBook(result?.data)
                    setIsLoading(false)
                }, 800);
                // console.log(result?.data)
            })
        }catch (e) {
         
        }
    };
    const DBBook=useCallback(async ()=>{
        return await BookService.getAllBook(1)
    },[])
    let db = useCallback(async () => {
        return await CategoryService.getAllCategory()
      }, [])
    useEffect( ()=>{
        DBBook().then((result:any)=>{
            setIsLoading(true)
            setTimeout(() => {
                setListBook(result?.data)
                setIsLoading(false)
            }, 800);
            console.log(result)
            // setListBook(result?.data)
        })
        db().then((result: any) => {
            console.log("category" + result?.data)
            setCategorys(result?.data)
          })
    },[])
  return (
    <div className={styles.book}>
    <div className={styles.mainBook}>
        <div className={styles.search}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.item}>
                        <p>Tên sách</p>
                        <input type={"text"}  {...register("title")} placeholder={"Tên sách"}></input>
                </div>
                <div className={styles.item}>
                        <p>Thể loại</p>
                        <select id="typebook"  {...register("category")}>
                            {
                                categorys?.length > 0  ? categorys.map((value:any,index:number)=>{
                                    return     <option value={value?._id} key={`category`+index}>{value?.name}</option>
                                }) :<></>
                            }
                        </select>
                </div>
                <div className={styles.item}>
                        <p>Tác giả</p>
                        <input type={"text"}  {...register("author")} placeholder={"Tác giả"}></input>
                </div>
                <div className={styles.item}>
                        <p>Nhà xuất bản</p>
                        <input type={"text"}  {...register("publisher")} placeholder={"Nhà xuất bản"}></input>
                </div>
                <div className={styles.item}>
                      <button type='submit'>Tìm kiếm</button>
                </div>
            </form>
        </div>
        <div className={styles.listBook}>
                <div className={`${styles.headerList} item-btw`}>
                    <h3><i className="fa-sharp fa-solid fa-book"/> &nbsp;Sách tham khảo</h3>
                    <button onClick={()=>setOpenWaitOder(true)}> Đăng kí mượn &nbsp; <i className="fa-solid fa-plus"/></button>
                </div>
                {/* <h3><i className="fa-sharp fa-solid fa-book"/> &nbsp;Sách tham khảo</h3> */}
                <div className={styles.viewBook}>
                    {
                        listBook?.length >0 ? listBook.map((value:any,index:number)=>{
                            return <div key={`book`+index} className={styles.bookcard} onClick={()=>
                                    {
                                        setOpenDetail(true)
                                        setDetailBook(value)
                                    }
                                    }>
                                        <div className={styles.image}>
                                            <Image image={value?.bookCover?.url ?value?.bookCover?.url : DefaultBook } contain="contain"/>
                                        </div>
                                        <div className={styles.contain}>
                                            <p><span><i className="fa-sharp fa-solid fa-book"/> &nbsp;  &nbsp;  </span><span className={styles.content}>{value?.title}</span></p> 
                                            <p><span><i className="fa-solid fa-user"/>  &nbsp;  &nbsp;  </span><span className={styles.content}>{value?.author}</span></p>
                                        </div>  
                                    </div>
                        }):<LoaderItem/>
                    }
                </div>
        </div>
    </div>
    {openDetail ? <SidebarUpdateBook handleClose={()=>setOpenDetail(false)} data={detailBook}/> :<></>  }
    {openWaitOder ? <FormAdd handleClose={()=>setOpenWaitOder(false)}/> :<></>  }
    {isLoading && <LoadingPage/> }
</div>
   
  )
}

export default Book