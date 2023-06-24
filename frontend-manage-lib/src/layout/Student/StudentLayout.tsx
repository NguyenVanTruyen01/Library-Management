import styles from './styles/student.module.scss'
import SideBar from "components/Sidebar/SideBar"
import Navbar from "components/Navbar/Navbar"
import Content from "./components/Content/Content"
import SideBarDB from "asset/database/Database"
import path from "../../router/constant/RouterConstant"
const StudentLayout=()=>{

    return(
        <>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <SideBar path={ path.student} data={SideBarDB.DataSidebarStudent}/>
                </div>
                <div className={styles.main}>
                    <div className={styles.nav}>
                        <Navbar/>
                    </div>
                    <div className={styles.content}>
                        <Content/>
                    </div>
                </div>

            </div>
        </>
    )
}
export default  StudentLayout