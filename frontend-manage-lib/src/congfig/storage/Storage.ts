const GetLocalStorage=(key:string)=>{
    return localStorage.getItem(key);
}
const SetLocalStorage=(key:string,value:any)=>{
    return localStorage.setItem(key,value);
}
const RemoveLocalStorage=(key:string)=>{
    return localStorage.removeItem(key);
}
const Storage={GetLocalStorage,RemoveLocalStorage,SetLocalStorage}
export default  Storage