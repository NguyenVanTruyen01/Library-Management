import LoaderItem from 'components/LoaderItem/LoaderItem'
import React from 'react'
import styles from './styles/header.module.scss'
const Header = ({totals}:any) => {

    console.log(totals)

  return (
    <div className={`${styles.listOverview} item-btw`}>
    <div className={`${styles.overviewItem} item-btw`}>
        <div className={styles.overviewItemIC}>
            <span><i className="fa-solid fa-group-arrows-rotate"/></span>
        </div>
        <div className={styles.overviewItemContent}>
            <p className={styles.titleItem}>Số lượng sách</p>
            <p className={styles.count}>{totals?.countBooks}</p>
        </div>
    </div>
    <div className={`${styles.overviewItem} item-btw`}>
        <div className={styles.overviewItemIC}>
            <span><i className="fa-sharp fa-solid fa-layer-group"/></span>
        </div>
        <div className={styles.overviewItemContent}>
            <p className={styles.titleItem}>Số lượng mượn</p>
            <p className={styles.count}>{totals?.topic? totals?.topic : <LoaderItem/>}</p>
        </div>

    </div>
    <div className={`${styles.overviewItem} item-btw`}>
        <div className={styles.overviewItemIC}>
            <span><i className="fa-solid fa-arrows-to-dot"/></span>
        </div>
        <div className={styles.overviewItemContent}>
            <p className={styles.titleItem}>Số lượng kho</p>
            <p className={styles.count}>{totals?.assembly ? totals?.assembly : <LoaderItem/>}</p>
        </div>
    </div>
    <div className={`${styles.overviewItem} item-btw`}>
        <div className={styles.overviewItemIC}>
            <span><i className="fa-solid fa-user-group"/></span>
        </div>
        <div className={styles.overviewItemContent}>
            <p className={styles.titleItem}>Số lượng </p>
            <p className={styles.count}>{ totals?.group ? totals?.group : <LoaderItem/>}</p>
        </div>
    </div>
</div>
  )
}

export default Header