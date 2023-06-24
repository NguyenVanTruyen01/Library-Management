import Repository from "../congfig/repository/RepositoryConfig"
const url='http://localhost:5000/api/v1/topic'

const TopicService ={
    getAllTopic:async (page:number)=>{
        return await Repository("GET",url+`/?page=${page}`,{params:{},payload:{}})
    },
    getAllTopicNoPagination:async ()=>{
        return await Repository("GET",url+`/no-pagination`,{params:{},payload:{}})
    },
    getAllTopicAccept:async ()=>{
        return await Repository("GET",url+`/leader`,{params:{},payload:{}})
    },
    teacherAddTopic:async (data:any)=>{
        console.log(data)
        return await Repository("POST",url+"/create",{params:{},body:data})
    },
    deleteTopic:async (id:string)=>{
        return await Repository("DELETE",url+`/delete/${id}`,{params:{id},body:{}})
    },
    editTopic:async (id:string,data:any,role:string)=>{
        console.log(data)
        console.log(id)
        return await Repository("PUT",url+`/update`,{params:{id},body:{id,payload:data,role}})
    },
    leaderAcceptTopic:async (id:string)=>{
        return await Repository("PUT",url+`/accept?id_topic=${id}&type=leader`,{params:{id},body:{}})
    },
    getTotalTopic:async ()=>{
        return await Repository("GET",url+"/total",{params:{},payload:{}})
    },
    getTopicByTeacherID:async (data:any)=>{
        return await Repository("POST",url+"/topic-teacher",{params:{},body:data})
    },
    getTopicAcceptByTeacherID:async (data:any)=>{
        return await Repository("POST",url+"/topic-teacher/accept",{params:{},body:data})
    },
}
export default TopicService