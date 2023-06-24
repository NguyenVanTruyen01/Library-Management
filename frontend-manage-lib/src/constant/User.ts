import Storage from "congfig/storage/Storage"


const User = {
    id : JSON.parse(Storage.GetLocalStorage("info-user")||"")._id,
    token:Storage.GetLocalStorage("user"),
    info_user : JSON.parse(Storage.GetLocalStorage("info-user")||"")
}



export default User