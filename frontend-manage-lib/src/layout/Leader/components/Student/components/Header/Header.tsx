import React, { useEffect } from 'react'
import styles from './styles/header.module.scss'
import TotalService from 'api/total.api'

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
                countAuths: total.countAuths,
                countCategories: total.countCategories,
                countBooks: total.countBooks,
                countCallCards: {
                    true: total.countCallCards.true,
                    false: total.countCallCards.false,
                },
            }
        })
    }

    useEffect(() => {
        getStatistical();
    }, [])

    return (
        <div className={`${styles.listOverview} item-btw`}>
            <div className={`${styles.overviewItem} item-btw`}>
                <div className={styles.overviewItemIC}>
                    <span><i className="far fa-id-card"></i></span>
                </div>
                <div className={styles.overviewItemContent}>
                    <p className={styles.titleItem}>Phiếu mượn sách</p>
                    <p className={styles.count}>{statistical.countCallCards.true + statistical.countCallCards.false}</p>
                </div>
            </div>
            <div className={`${styles.overviewItem} item-btw`}>
                <div className={styles.overviewItemIC}>
                    <span><i className="fa-sharp fa-solid fa-layer-group" /></span>
                </div>
                <div className={styles.overviewItemContent}>
                    <p className={styles.titleItem}>Số sách </p>
                    <p className={styles.count}>{statistical.countBooks}</p>
                </div>

            </div>
            <div className={`${styles.overviewItem} item-btw`}>
                <div className={styles.overviewItemIC}>
                    <span><i className="fas fa-book"></i></span>
                </div>
                <div className={styles.overviewItemContent}>
                    <p className={styles.titleItem}>Thể loại sách</p>
                    <p className={styles.count}>{statistical.countCategories}</p>
                </div>
            </div>
            <div className={`${styles.overviewItem} item-btw`}>
                <div className={styles.overviewItemIC}>
                    <span><i className="fas fa-users"></i></span>
                </div>
                <div className={styles.overviewItemContent}>
                    <p className={styles.titleItem}>Đọc giả</p>
                    <p className={styles.count}>{statistical.countAuths}</p>
                </div>
            </div>
        </div>
    )
}

export default Header