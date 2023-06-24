import mongoose, { model } from "mongoose"
const { ObjectId } = mongoose.Schema.Types

const AuthSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Minlength least 6 character.."]
    },
    role: {
        type: String,
        required: true,
        enum: ["leader", "student", "teacher"],
        default: "student"
    },
    phone: {
        type: String, required: true,
        minlength: [10, "Minlength least 10 character.."],
        maxLength: [11, "Maxleng Phone 11 character"],
        unique: true
    },
    mssv: {
        type: String,
        minlength: [8, "Minlength least 8 character.."],
        maxLength: [8, "Maxleng Phone 8 character"],
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    cmnd: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },// chứng minh nhân dân
    addressCurrent: {
        type: String,
        default: null
    }, // địa chỉ hiện tại
    addressHouse: {
        type: String,
        default: null
    },
    listCallCard: [{
        type: ObjectId
    }], // Danh sách phiếu mượn
    list_notification: [{
        type: String,
        default: []
    }],
    avatar: {
        type: Object,
        default: {
            url: 'https://res.cloudinary.com/dehtpa6ba/image/upload/v1677038569/manage_lib/avatar_wgaep7.webp',
            public_id: null
        }
        // properties: {
        //     url: {
        //         type: String,
        //         default: 'https://res.cloudinary.com/dehtpa6ba/image/upload/v1677038569/manage_lib/avatar_wgaep7.webp'
        //     },
        //     public_id: {
        //         type: String
        //     }
        // }
    }
}, { timestamps: true }
)
const AuthModels = mongoose.model('auth', AuthSchema)
export default AuthModels
module.exports = AuthModels

