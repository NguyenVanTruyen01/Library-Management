import styles from './styles/header.module.scss'
import {NavLink} from "react-router-dom"

const Header = () => {

    const handleLogout=async ()=>{
          localStorage.removeItem("user")
          window.location.reload();
    }
    return (
        <div className={styles.header}>
            <header>

                <div className={`${styles.headerSearch} item-center`}>
                    <input placeholder={"Search tại đây"}/>
                </div>
                <div className={styles.headerOption}>
                    <ul>
                        <li><NavLink to={'/home'}>Home</NavLink></li>
                        <li> <NavLink to={'/about-us'}>About Us</NavLink></li>
                        <li><NavLink to={'/search'}>Search</NavLink></li>
                        <li> <NavLink to={'/contact'}>Contact</NavLink></li>
                        <li> <NavLink to={'/blog'}>Blog</NavLink></li>
                        <li> <NavLink to={'/profile'}><i className="fa-solid fa-user-large"/></NavLink></li>
                        <li className={styles.logout}  onClick={handleLogout}> <span>LogOut</span>&emsp;<i className="fa-solid fa-arrow-right-from-bracket"/> </li>
                    </ul>
                </div>
            </header>
        </div>
    )
}

export default Header