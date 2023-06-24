import { IUser} from "@type/AuthInterface"
import * as actionTypes from '../../constant/Auth/Auth'

let initialStateLogin:IUser={
    email:"",
    password:"",
    username:"",
    phone:"",
    addressCurrent:"",
    addressHouse:"",
    access_token:"",
    role:"",
    id:"",
    postHeart:[]
}

export const LoginReducer=(state=initialStateLogin,action:any)=>{
    switch(action.type){
        case actionTypes.AUTH_LOGIN_SUCCESS:
            return {
                ...state,
                email:action.payload.user.email,
                username:action.payload.user.name,
                access_token:action.payload.access_token,
                password:"",
                role:action.payload.user.role,
                id:action.payload.user._id,
                phone:action.payload.user.phone,
                addressCurrent:action.payload.user.addressCurrent,
                addressHouse:action.payload.user.addressHouse,
                // postHeart:action.payload.user.listPostHeart
            }
        case actionTypes.AUTH_LOGIN_FAIL:
            return action.payload.data;
    }
    return state
}


