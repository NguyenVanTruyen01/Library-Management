const HttpCode ={
    //> 4000
    NOT_FOUND:4004,
    EXIST_DB:4001,
    // > 2000 Success

    // > 3000 Lỗi invalid
    VALID_TOKEN:3001,
    VALID_EMAIL:3002,
    VALID_PHONE:3003,


    // >5000 Lỗi DB
    ERR_DB:5000

}
const ResponseNoData=(msg,code)=>{
    return {
        msg,
        statusCode:code
    }
}
const ResponseData=(msg,code,data)=>{
    return {
        msg,
        statusCode:code,
        data
    }
}
const ConfigResponse = {HttpCode,ResponseData,ResponseNoData}
export default  ConfigResponse