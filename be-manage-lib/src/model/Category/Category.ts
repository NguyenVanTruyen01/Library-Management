import mongoose from "mongoose"

const { ObjectId } = mongoose.Schema.Types;

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be empty'],
        trim: true,
        unique: true
    }, // tên thể loại sách

    description: {
        type: String,
        required: true,
        trim: true
    }, // mô tả
    books: [{
        type: ObjectId,
    }]// sách có trong mỗi thể loại

}, { timestamps: true }
)
const CategoryModels = mongoose.model('category', CategorySchema)
export default CategoryModels

