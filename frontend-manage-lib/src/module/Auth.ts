import Storage from "../congfig/storage/Storage"

class Auth {

    user_token:string;

    constructor() {
        this.user_token=JSON.parse(Storage.GetLocalStorage("user")||"")
    }

    getToken=()=>{
        return this.user_token;
    }
    getUserId=()=>{
        const user = JSON.parse(Storage.GetLocalStorage('info-user')||"")
        return "user._id.toString()";
    }

}
export default Auth