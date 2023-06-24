import React from 'react'
import styles from './styles/footer.module.scss'
const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.footerLogo}>
                <h2>Resolves</h2>
            </div>
            <div className={styles.footerContent}>
                <div className={styles.footerContentTitle}>
                    <ul>
                        <li>About Us</li>
                        <li>Application</li>
                        <li>RESOLVER</li>
                        <li>CONTACT</li>
                    </ul>
                </div>
                <div className={styles.footerContentContent}>
                    <ul>
                        <li><p/></li>
                        <li>ỨNG DỤNG</li>
                        <li>GOOD RESOLVER</li>
                        <li>CONTACT</li>
                    </ul>
                </div>
            </div>
            <div className={styles.footerContact}>

            </div>
        </div>
    )
}

export default Footer;