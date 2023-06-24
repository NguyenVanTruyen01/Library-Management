import React from "react"
import { useNavigate } from "react-router-dom"
import './styles/reset.css'
import './styles/style.css'
const Home=()=>{

    const navigate= useNavigate()

    return (
        <>
            <div className="page-wrapper">
      {/* <!-- Header --> */}
      <header id="header">
        <ul className="header-list">
          <li className="list-item">
            <a href="https://www.monocubed.com/blog/best-ruby-frameworks/" className="dropdown-mega-toggle">
              <span className="mega-dropdown-icon-holder">
                <i className="far fa-caret-square-down"></i>
              </span>
              <span className="mega-dropdown-name"
                >Hướng dẫn (dành cho Giảng viên)</span
              >
            </a>
          </li>
          <li className="list-item">
            <span className="social-icon">
              <a
                href="https://fhq.hcmute.edu.vn/"
                title="https://fhq.hcmute.edu.vn/"
                // target="_blank"
              >
                <i className="fab fa-edge"></i>
              </a>
              <a
                href="https://www.facebook.com/clcspkt/"
                title="https://www.facebook.com/clcspkt/"
                // target="_blank"
                // alt="https://www.facebook.com/clcspkt/"
              >
                <i className="fab fa-facebook-square"></i
              ></a>
            </span>
          </li>
        </ul>
        <ul className="header-list">
          <li className="list-item">
            <span>Bạn chưa đăng nhập. </span>
            <button className="login" onClick={()=>{
                navigate("/login",{replace:true}) 
                window.location.reload()}}>Đăng nhập</button>
          </li>
        </ul>
      </header>
      {/* <!-- End header -->

      <!-- Brand --> */}
      <div className="branding">
        <div className="branding-inner">
          <a href="https://fhqx.hcmute.edu.vn/" className="site-name has-logo">
            <div className="site-logo"/>
          </a>
        </div>
        <div className="brainding-main-nav">
          <a href="https://hcmute.edu.vn/" className="branding-nav-link"
            >Đại học Thành Đô</a>
        </div>
      </div>
      {/* <!-- End brand -->

      <!-- Slider  --> */}
      <div id="slider">
        <div className="text-content">
          <h2 className="uni-name">
            HCM UNIVERSITY OF TECHNNOLOGY AND EDUCATION <br />Faculty For High
            Quality Training
          </h2>
        </div>
      </div>

      {/* <!-- End slider  -->

      <!-- Footer --> */}
      <footer id="footer">
        <div className="footer-item">
          <i className="footer-icon fas fa-laptop-code"></i>
          <h3 className="benefits">First benefit</h3>
          <span className="benefit-content"
            >Support anytime, anywhere, shortening the distance</span
          >
        </div>
        <div className="footer-item">
          <i className="footer-icon fas fa-user-shield"></i>
          <h3 className="benefits">Second benefit</h3>
          <span className="benefit-content">Save time and money</span>
        </div>
        <div className="footer-item">
          <i className="footer-icon fas fa-infinity"></i>
          <h3 className="benefits">Third benefit</h3>
          <span className="benefit-content">High efficiency</span>
        </div>
      </footer>
     
    </div>
        </>
    )
}
export default  Home