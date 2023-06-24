import OderService from 'api/order.api'
import  { useCallback, useEffect, useState } from 'react'
import { convertDate } from 'utility/ConvertDate'
import SidebarUpdate from './components/SidebarUpdate/SidebarUpdate'
import styles from './styles/oder.module.scss'
import User from 'constant/User'
import LoadingPage from 'components/LoadingPage/LoadingPage'
const Oder = () => {

    let [data,setData] = useState<any[]>([])
    const [isLoading,setIsLoading] = useState<Boolean>(false)
    let [openDetail,setOpenDetail] = useState<Boolean>(false)
    let [detailBook,setDetailBook] = useState<any>()
    let db = useCallback(async () => {
        return await OderService.getOderByUserID(User.id)
    }, [])
    useEffect(() => {
        db().then((result: any) => {

                setIsLoading(true)
                setTimeout(() => {
                    setData(result?.data)
                    setIsLoading(false)
                }, 800);
        })
    }, [])
    return (
        <div className={styles.oder}>
            <div className={styles.titleLeader}>
                <h3>Hóa đơn cá nhân</h3>
            </div>
            <div className={styles.listOder}>
                {data?.length> 0 ? data.map((value:any,index:number)=>{
                    return <div key={"oder"+index} className={styles.bookOder}>
                        <div className={styles.titleOder}>
                            <p><span><i className="fa-sharp fa-solid fa-scroll"/>&emsp;&emsp;</span>Hóa đơn {index+1}</p>
                            <p><button><i className="fa-solid fa-calendar-days"/> Ngày mượn</button> {convertDate(value?.createdAt)} </p>
                            <p><button><i className="fa-solid fa-calendar-days"/> Ngày trả</button> {convertDate(value?.dueDate)} </p>
                            <p> <button onClick={()=>{
                                setDetailBook(value)
                                setOpenDetail(true)
                            }} >Chi tiết hóa đơn <i className="fa-solid fa-caret-right"/></button></p>
                        </div>  
                            {/* {value?.active ? "Chưa trả" :"Đã trả"} */}
                    </div>
                }):<div className={styles.empty}>Hiện tại chưa có hóa đơn nào .</div>}
            </div>
            {
                openDetail ? <SidebarUpdate data = {detailBook} handleClose={()=>setOpenDetail(false)}/> :<></>
            }
              {isLoading && <LoadingPage/> }
            
        </div>
    )
}

export default Oder