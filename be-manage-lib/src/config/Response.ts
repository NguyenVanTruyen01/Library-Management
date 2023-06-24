
class ResponseConfig{
    statusCode:number
    data:any
    msg:string
    constructor(status:number,data:any,message:string) {
        this.statusCode=status
        this.msg=message
        this.data=data ? data : null
    }
    ResponseSuccess=(req,res)=>{
        return res.status(200).json(this);
    }
}
export default  ResponseConfig