
class ApiCustom{
    queryString:any
    queryData:any

    constructor(string:any,data:any) {
        this.queryString=string
        this.queryData=data
    }

    find(){
        this.queryString.find(this.queryData)
        return this
    }

    filter(){
        this.queryString.find(this.queryData)
        return this
    }

    sorting(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.queryString = this.queryString.skip(skip).limit(limit)
        return this
    }



}
export default ApiCustom