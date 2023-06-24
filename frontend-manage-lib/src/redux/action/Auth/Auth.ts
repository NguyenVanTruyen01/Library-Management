import { ILogin, IRegister } from "@type/AuthInterface"
import { Dispatch } from "redux"
import AuthServices from "api/auth.api"
import * as actionTypes from '../../constant/Auth/Auth'
import * as notifyTypes from '../../constant/Notify/Notify'
import { toast } from 'react-toastify'

export const LoginAction = (user: ILogin) => async (dispatch: Dispatch) => {
    try {
        dispatch({
            type: notifyTypes.LOADING
        })
        return await AuthServices.postUserLogin(user)
            .then(
                (result: any) => {
                    dispatch({
                        type: actionTypes.AUTH_LOGIN_SUCCESS,
                        payload: result.data
                    })
                    localStorage.setItem("user", result.data.access_token)
                    localStorage.setItem("info-user", JSON.stringify(result.data.user))
                    console.log("result"+ JSON.stringify(result.data))
                    // toast("success")
                  
                    dispatch({
                        type: notifyTypes.NOT_LOADING
                    })
                    return Promise.resolve();
                }
            )
            .catch((err) => {
                dispatch({
                    type: actionTypes.AUTH_LOGIN_FAIL,
                    payload: err
                })
                dispatch({
                    type: notifyTypes.NOT_LOADING
                })
                return Promise.reject();
            })

    } catch (err: any) {
        dispatch({
            type: notifyTypes.NOT_LOADING
        })
        dispatch({
            type: actionTypes.AUTH_LOGIN_FAIL,
            payload: err
        })
        return err.message
    }
}



export const UupdateProfileAction = (userRegister: any) => async (dispatch: Dispatch) => {
    // console.log(userRegister)
    try {
        dispatch({
            type: notifyTypes.LOADING
        })
        return await AuthServices.updateInfoAccount(userRegister)
            .then(
                (result:any) => {

                    if (!result?.data?.statusCode || result?.data?.statusCode !== 2000) {
                        dispatch({
                            type: actionTypes.AUTH_REGISTER_SUCCESS,
                            payload: result.data
                        })
                        dispatch({
                            type: notifyTypes.NOT_LOADING
                        })
                        // toast.success("Thêm tài khoản thành công", { autoClose: 1400 })
                    }
                    else {
                        toast.error(result?.data?.msg)
                    }

                    return Promise.resolve();
                }
            )
            .catch((err) => {
                dispatch({
                    type: actionTypes.AUTH_REGISTER_FAIL,
                    payload: err
                })
                dispatch({
                    type: notifyTypes.NOT_LOADING
                })
                return Promise.reject();
            })

    } catch (err: any) {
        dispatch({
            type: actionTypes.AUTH_REGISTER_FAIL,
            payload: err
        })
        dispatch({
            type: notifyTypes.NOT_LOADING
        })
        return err.message
    }
}



export const RegisterAction = (userRegister: IRegister) => async (dispatch: Dispatch) => {
    console.log(userRegister)
    try {
        dispatch({
            type: notifyTypes.LOADING
        })
        return await AuthServices.postUserRegister(userRegister)
            .then(
                (result) => {

                    if (!result?.data?.statusCode || result?.data?.statusCode !== 2000) {
                        dispatch({
                            type: actionTypes.AUTH_REGISTER_SUCCESS,
                            payload: result.data
                        })
                        dispatch({
                            type: notifyTypes.NOT_LOADING
                        })
                        toast.success("Thêm tài khoản thành công", { autoClose: 1400 })
                    }
                    else {
                        toast.error(result?.data?.msg)
                    }

                    return Promise.resolve();
                }
            )
            .catch((err) => {
                dispatch({
                    type: actionTypes.AUTH_REGISTER_FAIL,
                    payload: err
                })
                dispatch({
                    type: notifyTypes.NOT_LOADING
                })
                return Promise.reject();
            })

    } catch (err: any) {
        dispatch({
            type: actionTypes.AUTH_REGISTER_FAIL,
            payload: err
        })
        dispatch({
            type: notifyTypes.NOT_LOADING
        })
        return err.message
    }
}

export const LogoutAction = () => async () => {
    await localStorage.removeItem("user")
    await AuthServices.logout()
}

