import React from 'react'
import styles from './styles/loading-page.module.scss'
const LoadingPage = () => {
  return (
    <div className={styles.mainLoaing}>
        <div className={styles.loader}>
            <i className={styles.loader_el}></i>
            <i className={styles.loader_el}></i>
        </div>
    </div>
   
  )
}

export default LoadingPage