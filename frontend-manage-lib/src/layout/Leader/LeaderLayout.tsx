import styles from './styles/leader-layout.module.scss'
import SideBar from "components/Sidebar/SideBar"
import Navbar from "components/Navbar/Navbar"
import Content from "../Leader/components/Content/Content"
import SideBarDB from "asset/database/Database"
import path from 'router/constant/RouterConstant'
const LeaderLayout = () => {

    return (
        <>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <SideBar path={path.leader} data={SideBarDB.DataSidebarLeader} />
                </div>
                <div className={styles.main}>
                    <div className={styles.nav}>
                        <Navbar />
                    </div>
                    <div className={styles.content}>
                        <Content />
                    </div>
                </div>
            </div>
        </>
    )
}
export default LeaderLayout