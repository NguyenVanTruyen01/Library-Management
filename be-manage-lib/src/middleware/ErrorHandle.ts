import {Request,Response,NextFunction} from "express";

const ErrorHandle=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    if(err.statusCode === 11000 ){

    }

    err.message="Lỗi server"
}
export default ErrorHandle