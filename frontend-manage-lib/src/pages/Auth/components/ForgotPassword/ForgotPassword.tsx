import { useState, ChangeEvent } from 'react'
import styles from './styles/forgot-password.module.scss'
import { useAppDispatch } from "redux/store"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const ForgotPassword = (props: any) => {

    const [email, setEmail] = useState("")

    const notify = (content: string) => toast(`${content}`!)

    const handleReturnPassword = async () => {
        try {
            notify("Bạn vui lòng kiểm tra Email")
        } catch (e) {
            notify("Lấy lại password fail")
        }
    }
    return (
        <div className={styles.forgotPassword}>
            <div className={styles.title}>
                <h2>Forgot Password</h2>
            </div>
            <div className={styles.body}>
                <p className={styles.label}>Nhập mail của bạn</p>
                <input type={"text"} placeholder={'Nhập mail của bạn '} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                <span className={styles.validate}>Vui lòng kiểm tra email </span>
            </div>
            <div className={styles.bottom}>
                <button onClick={handleReturnPassword} type={"submit"}> Submit </button>
            </div>

        </div>
    )
}
export default ForgotPassword