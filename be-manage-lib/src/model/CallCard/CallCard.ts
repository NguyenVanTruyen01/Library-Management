import mongoose from "mongoose"

const { ObjectId } = mongoose.Schema.Types

const CallCardSchema = new mongoose.Schema({
    borrower: {
        type: ObjectId,
        required: true,
        ref: "auth"
    }, // người mượn sách
    libraryClerk: {
        type: ObjectId,
        //required: true,
        ref: "auth"
    }, // nhân viên thư viện cho mượn sách
    issueDate: {
        type: Date,
        // required: true,
        default: Date.now,
    },// ngày mượn sách

    dueDate: {
        type: Date,
        required: true,
    }, // ngày trả sách
    books: [{
        idBook: { type: ObjectId, required: true, ref: 'book' },
        quantity: { type: Number, default: 1 }
    }],// sách muốn mượn
    fee: {
        type: Number,
        default: 0,
    },// phí mượn sách

    active: {
        type: Boolean,
        default: true,
    },// trạng thái thẻ mượn (true: chưa trả)
    QRCode: {
        type: String
    },
    waitingOrder: {
        type: Boolean,
        default: true,
    } // Trang thái phiếu mượn đang chờ để được duyệt

},
    { timestamps: true }
)
const CallCardModels = mongoose.model('callcard', CallCardSchema)
export default CallCardModels

