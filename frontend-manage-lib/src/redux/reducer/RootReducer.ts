
import { combineReducers } from 'redux'
import {LoginReducer} from "./Auth/AuthReducer"
import {TotalReducer} from './Total/TotalReducer'
export default combineReducers({
    LoginReducer,
    TotalReducer
})
