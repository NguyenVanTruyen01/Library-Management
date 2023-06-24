import {NextFunction, Request, Response} from "express"
import constantError from "../constant/ConstantError/ConstantError"

const validator = async (req:Request,res:Response, next:NextFunction) => {
        try {
            const app_key = req.header("app_key")
            const app_id = req.header("app_id")
            if(!app_key && !app_id ){
                return res.status(400).json({
                    msg:constantError.validate.empty("app_key or app_id")
                })
            }
            console.log(app_key)
            console.log(app_id)
            console.log(process.env.APP_ID)
            console.log(process.env.PORT)
            if(app_key !== `${process.env["APP_KEY"]}`){
                return res.status(400).json({
                    msg:constantError.header.app_key
                })
            }
            if(app_id !== `${process.env["APP_ID"]}`){
                return res.status(400).json({
                    msg:constantError.header.app_id
                })
            }
            next()
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }


export default validator