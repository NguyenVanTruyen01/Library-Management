import React from 'react'
import styles from './styles/navbar.module.scss'
import {LogoutAction} from "redux/action/Auth/Auth"
import {useAppDispatch} from "redux/store"
import {NavLink, useNavigate} from "react-router-dom"
import  {io} from "socket.io-client"
import ItemNotification from './component/ItemNotification/ItemNotification'
// import NotificationAPI from 'api/notification.api'
import Storage from 'congfig/storage/Storage'
import Image from 'components/Image/Image'
import User from 'constant/User'
import LogoLib  from 'asset/images/logo_lib.png'
const Navbar=()=>{
    const [socket, setSocket] = React.useState<any>(null);
    const [showNotification, setShowNotification] = React.useState<Boolean>(false);
    // const [socketConnected, setSocketConnected] = React.useState<any>(false);

    const [allNotification,setAllNotification] = React.useState([])

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const handleLogout=()=>{
        dispatch(LogoutAction())
        navigate('/')
    }

      // subscribe to socket date event
    const subscribeToDateEvent = (interval = 1000) => {
        socket.emit('subscribeToDateEvent', interval);
    }
    return (
        <div className={`${styles.navbar} item-btw`}>
            <div className={`${styles.search} item-center`}>
                <Image contain={"contain"} image={LogoLib}/>
                <div className={styles.line}>QUẢN LÍ THƯ VIỆN</div>
                 {/* <input placeholder={"Tìm kiếm ở đây"}/>
                <button><i className="fa-solid fa-magnifying-glass"/></button> */}
            </div>
            <div className={styles.action}>
                {/* <div className={styles.item}>
                    Language
                </div>
                <div className={styles.item}>
                    Setting
                </div>*/}           
                <div className={`${styles.item} `}>
                    {/* <i className="fa-solid fa-bell" onClick={()=> setShowNotification(!showNotification)}/> */}
                    <div className={styles.listNotification} style={!showNotification  ? {visibility:"hidden"} :{visibility:"visible"}}>
                           {
                             allNotification?.length > 0 ? allNotification.flatMap((value:any,index:number)=>{
                                return  (<div key={`notification ${index}`}>
                                 <ItemNotification data ={value} />
                                </div>)
                             }):<></>
                           }
                    </div>
                </div> 
                <div className={`${styles.item} ${styles.account} item-center `}>
                    Tài Khoản
                    <div className={styles.option}>
                    <NavLink to={`/${User?.info_user?.role}?Page=Profile`} replace={true}>
                    <div className={styles.select}>
                            Profile
                        </div>
                    </NavLink>  
                    <div className={styles.select} onClick={handleLogout}>
                        Logout
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Navbar