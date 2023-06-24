const Error={
    validate:{
        empty:(string)=>{
            return `Truong ${string} khong co`
        },
        email_pattern: "Email khong dung dinh dang",
        phone_pattern:"So dien thoai khong dung",
        password_pattern:"Password phai tu 6 ki tu tro len",
        email_exist:"Email đã tồn tại",
        phone_exist:"Phone đã tồn tại",
    },
    header:{
        app_key:"App Key không đúng",
        app_id:"App ID không đúng"
    }
}
export default Error