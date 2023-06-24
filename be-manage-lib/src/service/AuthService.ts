import apiCustom from "../util/ApiCustom";
import {Request,Response,NextFunction} from "express";
import AuthModels from "../model/Auth/Auth";
const AuthService={
    findAllAuth:async (req:Request,res:Response,next:NextFunction)=>{
        try {
            let api =new apiCustom(AuthModels.find({}),{});

            const db = await api.queryString;
            console.log(db)

        }catch (err){

        }
    }
}
export default AuthService