import React from 'react'
import styles from './styles/item-notification.module.scss'
const ItemNotification = (props:any) => {
  return (
    <div className={styles.notification}>
          <div className={styles.title}>
              <p><span><i className="fa-solid fa-message"/></span>Thông báo từ trưởng ngành <span className={styles.name}> {props?.data?.sender?.name} </span> </p>
          </div>
          <div className={styles.content}>
              <p>{props?.data?.content}</p>
          </div>
    </div>
  )
}

export default ItemNotification