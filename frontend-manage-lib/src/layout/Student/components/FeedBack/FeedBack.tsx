import LoaderItem from 'components/LoaderItem/LoaderItem'
import { Leader_Core } from 'constant/Table'
import React, { useEffect, useState } from 'react'
import styles from './styles/feedback.module.scss'
const FeedBack = () => {

    let [page ,setPage]=useState<number>(1)
    let [openSidebarUpdate,setOpenSidebarUpdate]=useState<Boolean>(false)
    let [detailTopic,setDetailTopic]=useState<any>(null)
    let [assemblyList,setGroupList]=useState([])
    let [excel,setExcel]=useState([])
  
    
    useEffect(()=>{
        // GroupList().then((result:Response|undefined)=>{
        //     let excelCustom:any = []
        //     let i=0
        //     for(const item of result?.data){
        //         let itemAdd :any=[]
        //         i++
        //         itemAdd.push(i) // stt
        //         itemAdd.push(item?.assembly_id?.topic_id?.name_topic) // tên đề tài
        //         itemAdd.push(item?.assembly_id?.group_student?.name_group) //tên nhóm 
        //         itemAdd.push(item?.student_work) 
        //         itemAdd.push(item?.task) 
        //         itemAdd.push(item?.feedback) 
        //         itemAdd.push(Math.floor((item?.feedback + item?.task + item?.student_work)/3)) 
        //         excelCustom.push(itemAdd)
        //     }
        //     setExcel(excelCustom)
        //     setGroupList(result?.data)
        // })
    },[])
  return (
    <div className={styles.feedback}>
        <div className={styles.titleLeader}>
            <h3>Y Kiên , Dong góp</h3>
        </div>
        <div className={styles.mainFeedBack}>
        {
                    assemblyList.length > 0 ? 
                    <>
                        <div className={styles.table}>
                            <table className={styles.tableFill}>
                                <thead>
                                <tr>
                                    {
                                        Leader_Core.flatMap((value:string,index:number)=>{
                                            return <th className="text-left" key={`Leader_Core${index}`}>{value}</th>
                                        })
                                    }
                                </tr>
                                </thead>
                                <tbody className="table-hover">
                                {
                                    assemblyList.length > 0 ?   assemblyList?.flatMap((value:any,index:number)=>{
                                        return (
                                            <tr key={`${index} table`}>
                                                <td className="text-left">{index+1}</td>
                                                <td className="text-left">
                                                        {value?.assembly_id?.topic_id?.name_topic}
                                                </td>
                                                <td className="text-left">
                                                        {value?.assembly_id?.topic_id?.des_topic}
                                                </td>
                                                <td className="text-left">
                                                    {value?.assembly_id?.group_student?.name_group}
                                                </td>
                                                <td className="text-left">
                                                    <button className={styles.acceptTopic}
                                                    onClick={()=>
                                                        {
                                                            setOpenSidebarUpdate(true)
                                                            setDetailTopic(value)
                                                        }
                                                        }
                                                    ><i className="fa-solid fa-pen-to-square"/> </button>
                                                </td>
                                            </tr>
                                        )
                                    }):<></>
                                }
                                </tbody>
                            </table>
                        </div>
                        {
                            assemblyList?.length > 10 ?   <div className={styles.buttonPage}>
                                <div className={styles.flex}>
                                    <button className ={styles.btn} onClick={()=>{if(page === 1){setPage(1)} else{setPage((prevState:any)=>prevState-1)}
                                        }}> {`<`} </button>
                                    <button>{page}</button>
                                    <button className ={styles.btn} onClick={()=>{setPage((prevState:any)=>prevState+1)}}> &gt; </button>
                                </div>
                            </div>:<></>
                        } 
                    </>
                    :<div className={`${styles.mainLoader} item-center`}>
                        <LoaderItem/>
                    </div>  
                }
        </div>
    </div>
  )
}

export default FeedBack