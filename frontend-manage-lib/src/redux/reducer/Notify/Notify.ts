import * as actionTypes from '../../constant/Notify/Notify'
let initState={
    loading:false
}
export const NotifyReducer=(state=initState,action:any)=>{
    switch(action.type){
        case actionTypes.LOADING:
            return {
                ...state,
               loading: true
            }
        case actionTypes.NOT_LOADING:
            return {
                ...state,
                loading: false
            }
    }
    return state
}