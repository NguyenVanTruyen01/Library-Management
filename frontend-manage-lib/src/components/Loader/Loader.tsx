
import styles from './styles/loader.module.scss'

const Loader=()=>{
    return(
        <div className={styles.container}>
            <div className={styles.lds_facebook}>
                <div/>
                <div/>
                <div/>
            </div>
        </div>

    )
}
export default Loader