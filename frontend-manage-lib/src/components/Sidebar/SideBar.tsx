import React, { useState } from "react"
import styles from './styles/sidebar.module.scss'
import { NavLink } from "react-router-dom"
import Storage from 'congfig/storage/Storage'
import User from "constant/User"
import Image from "components/Image/Image"
const user = User.info_user
const SideBar = (props: any) => {
    let value = user

    const [colorActive,setColorActive] = useState("activeColor0")

    // const handleActiveColor = ()=>{
    //     setColorActive("active")
    // }

    return (
        <>
            <div className={styles.sidebar}>
                <div className={`${styles.header} item-center `}>
                    <div className={styles.mainheader}>
                        <div className={styles.image}>
                            <Image  contain='cover' image={value.avatar.url ? value.avatar.url : "https://res.cloudinary.com/dehtpa6ba/image/upload/v1677038569/manage_lib/avatar_wgaep7.webp"} />
                            {/* <Image contain="contain" image={"https://media.istockphoto.com/id/1143510987/vector/male-avatar-icon-or-portrait-handsome-young-man-face-businessman-in-suit-and-necktie-vector.jpg?s=612x612&w=0&k=20&c=8sHmGWKFaseE2uONuFZRtd1mdJXQyZBhaHysw_9rPRc="}/> */}
                        </div>
                        <div className={styles.name}>{value.name}</div>
                    </div>

                    {/* <span>Admin <i className="fa-solid fa-gear"/></span> */}
                </div>
                <div className={styles.menu}>
                    {
                        props?.data.flatMap((value: any, index: number) => {
                            return <NavLink to={`/${props?.path}?Page=${value.path}`} replace={true} key={`sidebar`+index}>
                            <div className={colorActive === `activeColor${index}`? `${styles.item}  activeColor${index}`: `${styles.item}`} onClick={()=>setColorActive(`activeColor${index}`)} key={`${index} menu`} >
                               <div className={styles.mainItem}>
                               <NavLink to={`/${props?.path}?Page=${value.path}`} replace={true}>
                                    <span className={styles.icon1}>
                                        <i className="fa-solid fa-book-open-reader"></i>
                                    </span>
                                    <span className={styles.name1}>
                                        {value.title}
                                    </span>
                                </NavLink>
                               </div>
                            </div>
                            </NavLink>
                        })
                    }
                </div>
            </div>
        </>
    )
}
export default SideBar