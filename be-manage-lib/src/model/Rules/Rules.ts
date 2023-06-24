import mongoose from "mongoose"

const RulesSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true,
        unique: true
    }, // tiêu đề nội quy

    description: {
        type: String,
        required: true,
        trim: true
    }, // mô tả
}, { timestamps: true }
)
const RulesModels = mongoose.model('rule', RulesSchema)
export default RulesModels

