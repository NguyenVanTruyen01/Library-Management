import mongoose from "mongoose"

const GroupSendSchema = new mongoose.Schema({
    users_receive:[{type:String, required:true,ref:"auth"}],
},{timestamps:true})

const GroupSendModels = mongoose.model("group_send_notification",GroupSendSchema)

export default GroupSendModels