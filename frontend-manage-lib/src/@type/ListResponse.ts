export interface Post {
    content:string;
    authorId:string;
    placeId:string
}
export interface ListResponse<T> {
    data:T[],
    pagination:{
        _limit:string;
        _page:string;
    }
}
export interface Response{
    data?:any
    msg?:string
    statusCode?:number
}