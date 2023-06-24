import { IUser} from "@type/AuthInterface"
import * as actionTypes from '../../constant/Total/Total'

let initialStateLogin:any={
    total1:0,
    total2:0,
    total3:0,
    // total4:0,
}

export const TotalReducer=(state=initialStateLogin,action:any)=>{
    switch(action.type){
        case actionTypes.GET_TOTAL_SUCCESS:
            console.log("action.payload"+action.payload)
            return {
                ...state,
                total1:3,
                total2:3,
                total3:6,
                // total4:action.payload.access_token,
            }
        case actionTypes.GET_TOTAL_FAIL:
            return action.payload.data;
    }
    return state
}


