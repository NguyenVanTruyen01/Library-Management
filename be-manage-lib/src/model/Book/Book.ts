import mongoose from "mongoose"

const { ObjectId } = mongoose.Schema.Types

const BookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
    }, //tên sách
    author: {
        type: String,
        required: true,
        trim: true,
    }, //tác giả
    publisher: {
        type: String,
        required: true,
        trim: true,
    },// nhà xuất bản
    category: {
        type: ObjectId,
        required: true,
        ref: "category"
    }, //thể loại
    price: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }, // giá tiền
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }, //số lượng
    borrowCount: {
        type: Number,
        min: 0,
        default: 0
    },
    description: {
        type: String,
        trim: true,
    },// mô tả sách
    bookCover: {
        type: Object,
        default: null,
    }, // ảnh bìa sách
    images: [{ type: String }],// ảnh chi tiết
    discount: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }, // giảm giá %
    rating: [{ type: Number }],
    QRCode: { type: String }


}, { timestamps: true }
)

const BookModels = mongoose.model('book', BookSchema)
export default BookModels

