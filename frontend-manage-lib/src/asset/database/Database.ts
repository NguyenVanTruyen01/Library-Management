import React, { ReactHTML } from "react"
interface ISideBar {
    path: String
    title: String
   
}
// let icon = ()=><i class="fa-regular fa-book"/> 
const DataSidebarAdmin: ISideBar[] = [
    {
        path: "Home",
        title: "Home",
        // icon:<i class="fa-regular fa-book"/>
    },
    {
        path: "Teacher",
        title: "Teacher",
        // icon:<i class="fa-regular fa-book"/>
    },
    {
        path: "Student",
        title: "Teacher",
        // icon:<i class="fa-regular fa-book"/>
    },
    {
        path: "Account",
        title: "Account",
        // icon:<i class="fa-regular fa-book"/>
    },
]
const DataSidebarTeacher: ISideBar[] = [
    {
        path: "Topic",
        title: "Đề tài",
        // icon:<i class="fa-regular fa-book"/>
    },
    {
        path: "GroupStudent",
        title: "Sinh viên",
        // icon:<i class="fa-regular fa-book"/>
    },
    {
        path: "ViewReport",
        title: "Báo cáo",
        // icon:<i class="fa-regular fa-book"/>
    },
    {
        path: "Core",
        title: "Điểm số",
        // icon:<i class="fa-regular fa-book"/>
    },
    {
        path: "Profile",
        title: "Cá nhân",
        // icon:<i class="fa-regular fa-book"/>
    }
]
const DataSidebarLeader: ISideBar[] = [
    {
        path: "Account",
        title: "Tài khoản",
        // icon:<i class="fa-regular fa-book"/>
    },
    {
        path: "Order",
        title: "Phiếu mượn",
        // icon:<i class="fa-regular fa-book"/>
    },
    {
        path: "Category",
        title: "Danh mục",
        // icon:<i class="fa-regular fa-book"/>
    },
    {
        path: "OverView",
        title: "Sách",
        // icon:<i class="fa-regular fa-book"/>
    },
    {
        path: "Profile",
        title: "Cá nhân",
        // icon:<i class="fa-regular fa-book"/>
    },

]
const DataSidebarStudent: ISideBar[] = [

    {
        path: "Book",
        title: "Sách",
        // icon: ()=>React.createElement(<i class="fa-regular fa-book"/>)
    },
    {
        path: "Oder",
        title: "Đơn Mượn",
        // icon:<i class="fa-regular fa-book"/>
    },
    {
        path: "Profile",
        title: "Cá nhân",
        // icon:<i class="fa-regular fa-book"/>
    },
    {
        path: "Policy",
        title: "Chính sách",
        // icon:<i class="fa-regular fa-book"/>
    },
    // {
    //     path: "FeedBack",
    //     title: "Y Kiến",
    //     // icon:<i class="fa-regular fa-book"/>
    // },
]

const SideBarDB = {
    DataSidebarAdmin,
    DataSidebarLeader,
    DataSidebarStudent,
    DataSidebarTeacher
}
export default SideBarDB
