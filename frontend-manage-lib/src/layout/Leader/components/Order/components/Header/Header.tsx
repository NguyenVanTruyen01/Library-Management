import React, { useEffect } from 'react'
import styles from './styles/header.module.scss'
import TotalService from 'api/total.api'
import { NavLink } from 'react-router-dom'
import User from 'constant/User'
interface Totals {
    countAuths: number,
    countCategories: number
    countBooks: number
    countCallCards: {
        true: number,
        false: number
    }
}

let statistical: Totals = {
    countAuths: 0,
    countCategories: 0,
    countBooks: 0,
    countCallCards: {
        true: 0,
        false: 0
    },
}

const Header = ({ props }: any) => {

    const getStatistical = async () => {

        await TotalService.getAllTotal().then((res: any) => {
            const total = res.data;
            console.log(total)
            statistical = {
                countAuths: total?.countAuths  ?  total.countAuths : 0,
                countCategories: total.countCategories  ?  total.countCategories : 0,
                countBooks: total.countBooks  ?  total.countBooks : 0,
                countCallCards: {
                    true:total.countCallCards.true  ?   total.countCallCards.true :0,
                    false: total.countCallCards.false  ?   total.countCallCards.false :0,
                },
            }
        })
    }

    useEffect(() => {
        getStatistical();
    }, [])

    return (

        <div className={`${styles.listOverview} item-btw`}>

               <NavLink to={`/${User?.info_user?.role}?Page=Order`} replace={true}>
                <div className={`${styles.overviewItem} item-btw`}>
                <div className={styles.overviewItemIC}>
                        <span><i className="far fa-id-card"></i></span>
                    </div>
                    <div className={styles.overviewItemContent}>
                        <p className={styles.titleItem}>Phiếu mượn sách</p>
                        <p className={styles.count}>{statistical.countCallCards.true + statistical.countCallCards.false}</p>
                    </div>  
              
                  
                </div>
                </NavLink>

                <NavLink to={`/${User?.info_user?.role}?Page=OverView`} replace={true}>
                    <div className={`${styles.overviewItem} item-btw`}>
                        <div className={styles.overviewItemIC}>
                            <span><i className="fa-sharp fa-solid fa-layer-group" /></span>
                        </div>
                        <div className={styles.overviewItemContent}>
                            <p className={styles.titleItem}>Số sách </p>
                            <p className={styles.count}>{statistical.countBooks}</p>
                        </div>

                    </div>
                </NavLink>

                <NavLink to={`/${User?.info_user?.role}?Page=Category`} replace={true}>
                        <div className={`${styles.overviewItem} item-btw`}>
                            <div className={styles.overviewItemIC}>
                                <span><i className="fas fa-book"></i></span>
                            </div>
                            <div className={styles.overviewItemContent}>
                                <p className={styles.titleItem}>Thể loại sách</p>
                                <p className={styles.count}>{statistical.countCategories}</p>
                            </div>
                        </div>
                </NavLink>

                <NavLink to={`/${User?.info_user?.role}?Page=Account`} replace={true}>
                        <div className={`${styles.overviewItem} item-btw`}>
                            <div className={styles.overviewItemIC}>
                                <span><i className="fas fa-users"></i></span>
                            </div>
                            <div className={styles.overviewItemContent}>
                                <p className={styles.titleItem}>Đọc giả</p>
                                <p className={styles.count}>{statistical.countAuths}</p>
                            </div>
                        </div>
                </NavLink>
        </div>
    )
}

export default Header