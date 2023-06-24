import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema({
    title:{type:String, required:true},// tiêu đề gửi
    content:{type:String, required:true}, // nội dung gửi
    sender:{type:String, required:true,ref:"auth"},// người gửi
    isReading:{type:Boolean,default:false},
    group_send:{type:String, required:true,ref:"group_send_notification"} // nhóm người nhận thông báo
},{timestamps:true})

const NotificationModels = mongoose.model("notification",NotificationSchema)

export default NotificationModels