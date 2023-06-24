import {Dispatch} from "redux"
import * as actionTypes from '../../constant/Total/Total'
import * as notifyTypes from '../../constant/Notify/Notify'
import TotalService from "api/total.api"

export const TotalAction=()=> async (dispatch:Dispatch)=>{
    try {
        dispatch({
            type:notifyTypes.LOADING
        })
        return await TotalService.getAllTotal()
            .then(
                (result:any)=>{
                    console.log(result)
                    dispatch({
                        type:actionTypes.GET_TOTAL_SUCCESS,
                        payload:result.data
                    })
                    dispatch({
                        type:notifyTypes.NOT_LOADING
                    })
                    return Promise.resolve();
                }
            )
            .catch((err:any)=>{
                dispatch({
                    type:actionTypes.GET_TOTAL_FAIL,
                    payload:err
                })
                dispatch({
                    type:notifyTypes.NOT_LOADING
                })
                return Promise.reject();
            })

    }catch (err:any){
        dispatch({
            type:notifyTypes.NOT_LOADING
        })
        dispatch({
            type:actionTypes.GET_TOTAL_FAIL,
            payload:err
        })
        return err.message
    }
}



