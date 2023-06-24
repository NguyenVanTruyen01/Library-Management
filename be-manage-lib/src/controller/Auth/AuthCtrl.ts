import { Response, Request, NextFunction } from "express"
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken')
import nodemailer from 'nodemailer'
import ResponseConfig from "../../config/Response"
const AuthModels = require("../../model/Auth/Auth")

let secretKeyHash = `${process.env.PASSWORD_HASH_SECRET_KEY}` || "abc"

export const AuthCtrl = {


    searchAuthByMSSV: async (req: Request, res: Response) => {
        try {
            const { mssv } = req.query;
            const users = await AuthModels.find({
                mssv: { $regex: mssv, $options: 'i' },
            });

            return res.status(200).json({
                msg: "Find all User success !!",
                data: users
            })
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    findAllAuthStudentNogroup: async (req: Request, res: Response) => {
        try {
            const allUserResponse = await AuthModels.find({
                $and: [
                    {
                        "role": "student",
                    },
                    {
                        "isRegister": null
                    }
                ]

            }).sort({ createdAt: -1 })
            return res.status(200).json({
                msg: "Find all User success !!",
                data: allUserResponse
            })
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },
    getTotalAccount: async (req: Request, res: Response) => {
        try {
            const allUserResponse = await AuthModels.find({})
            return new ResponseConfig(1000, allUserResponse.length, "Find all User success !!").ResponseSuccess(req, res)
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },
    findAllAuthStudent: async (req: Request, res: Response) => {
        try {
            const allUserResponse = await AuthModels.find({
                role: "student"
            })
            return res.status(200).json({
                msg: "Find all User success !!",
                data: allUserResponse
            })
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },
    findAllAccount: async (req: Request, res: Response) => {
        try {
            const { page } = req.query // 1 
            const pageHandle = (Number(page) > 0 ? Number(page) : 1) * 1 || 1 // 1
            const limit = 10 // lấy 9 topic 
            const skip = (pageHandle - 1) * limit  // 1:
            const allUserResponse = await AuthModels.find({}).skip(skip).limit(limit).sort({ createdAt: -1 })
            return res.status(200).json({
                msg: "Find all User success !!",
                data: allUserResponse
            })
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },
    findAllAuthTeacher: async (req: Request, res: Response) => {
        try {
            const allUserResponse = await AuthModels.find({
                role: "teacher"
            })
            return res.status(200).json({
                msg: "Find all User success !!",
                data: allUserResponse
            })
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },
    
    deleteOneAccountById: async (req: Request, res: Response) => {
        try {
            const allUserResponse = await AuthModels.deleteOne({ _id: req.params.id });
            return res.status(200).json({
                msg: "delete User success !!",
            })
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

    login: async (req: Request, res: Response) => {
        try {

            const { email, password } = req.body

            const user = await AuthModels.findOne({ email: email })

            if (!user) {
                return res.status(500).json({ msg: "User is not in DB" })
            }

            let bytes = CryptoJS.AES.decrypt(user.password, secretKeyHash)

            let originalText = bytes.toString(CryptoJS.enc.Utf8)

            if (password !== originalText) {

                return res.status(500).json({ msg: "Bạn đã sai password" })
            }
            const access_token = createAccessToken({ id: user._id })
            const refresh_token = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/v1/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
            })

            return res.status(200).json({
                msg: 'Login Success!',
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            })

        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },
    register: async (req: Request, res: Response) => {
        try {
            const { email, password, name, addressUser, role, phone, mssv, cmnd, age } = req.body

            const user = await AuthModels.findOne({ email: email })
            console.log("trc em,ail")
            if (user) {
                return res.status(500).json({
                    statusCode: 2000,
                    msg: "User đã tồn tại vui lòng sử dụng email khác !!!"
                })
            }
            console.log("email")

            const MSSV = await AuthModels.findOne({ mssv })
            if (MSSV) {
                return res.status(200).json({
                    statusCode: 2000,
                    msg: "MSSV đã tồn tại vui lòng sử dụng sdt khác !!!"
                })
            }

            console.log("mssv")

            const checkExistPhone = await AuthModels.findOne({ phone })

            if (checkExistPhone) {
                return res.status(200).json({
                    statusCode: 2000,
                    msg: "Phone đã tồn tại vui lòng sử dụng phone khác !!!"
                })
            }


            const CCCD = await AuthModels.findOne({ cmnd })
            if (CCCD) {
                return res.status(200).json({
                    statusCode: 2000,
                    msg: "CCCD đã được đăng ký !!!"
                })
            }

            console.log("mssv")



            let passwordHash = CryptoJS.AES.encrypt(password, secretKeyHash).toString()

            let userNew = new AuthModels({ email, password: passwordHash, name, addressUser, role, phone, mssv, cmnd, age })

            const access_token = createAccessToken({ id: userNew._id })
            const refresh_token = createRefreshToken({ id: userNew._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/v1/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
            })

            await userNew.save();

            return res.status(200).json({
                msg: 'Register Success!',
                access_token,
                user: {
                    ...userNew._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },
    forgotPassword: async (req: Request, res: Response) => {
        const { email } = req.body
        const user = await AuthModels.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                err: ["Tài khoản chưa được đăng kí vui lòng kiểm tra lại !!!"]
            })
        }
        let mailOptions = {
            from: 'hongduc7754@gmail.com',
            to: `${email}`,
            subject: 'Sending Email using Node.js',
            html: '<h1>Welcome</h1><p>That was easy!</p>'
        }
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hongduc7754@gmail.com',
                pass: '056240556'
            }
        });
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    },
    resetPassword: async (req: Request, res: Response) => {
        try {
            const { password, oldPassword, email } = req.body;
            const userUpdate = await AuthModels.findOne({ email: email });
            let bytes = CryptoJS.AES.decrypt(userUpdate.password, secretKeyHash);
            let originalText = bytes.toString(CryptoJS.enc.Utf8);
            if (oldPassword !== originalText) {
                return res.status(500).json({ msg: "Password hien tai ban da nhap sai" });
            }
            let passwordHash = CryptoJS.AES.encrypt(password, secretKeyHash).toString();
            await AuthModels.findOneAndUpdate({ email: email }, { password: passwordHash }, { new: true })
            return res.status(200).json({
                msg: "Find add User success !!",
                data: "allUserResponse"
            })

        } catch (err: any) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },
    logout: async (req: Request, res: Response) => {
        try {
            res.clearCookie('refreshtoken', { path: '/api/v1/refresh_token' })
            return res.json({ msg: "Logged out!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    generateAccessToken: async (req: Request, res: Response) => {
        try {

            const rf_token = req.cookies.refreshtoken

            if (!rf_token) return res.status(400).json({ msg: "Please login now." })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err: any, result: any) => {
                if (err) return res.status(400).json({ msg: "Please login now." })

                const user = await AuthModels.findById(result.id)

                if (!user) return res.status(400).json({ msg: "This does not exist." })

                const access_token = createAccessToken({ id: result.id })

                res.status(200).json({
                    access_token,
                    user
                })
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateProfile: async (req: Request, res: Response) => {
        try {
            const { name, phone, cmnd, mssv, age, addressCurrent, addressHouse, _id } = req.body
            console.log(req.body)
            const data = await AuthModels.findByIdAndUpdate({ _id: _id }, {
                name,
                phone,
                cmnd,
                mssv,
                age,
                addressCurrent,
                addressHouse
            }, { new: true });

            return res.status(200).json({
                msg: "Update profile successfully",
                data: data
            });
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },
    updateAvatar: async (req: Request, res: Response) => {
        try {

            const id = req.params.id;
            const avatar = req.body;
            const data = await AuthModels.findOneAndUpdate({ _id: id },
                {
                    avatar: {
                        url: avatar.url,
                        public_id: avatar.public_id
                    }
                },
                { new: true });

            return res.status(200).json({
                msg: "Update avatar successfully",
                data
            });
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },
    getDataChartAuth: async (req: Request, res: Response) => {
        try {
            const { month } = req.body
            const allAuthResponse = await AuthModels.aggregate([ // User is the model of userSchema
                {
                    $group: {
                        _id: { $month: "$createdAt" }, // group by the month *number*, mongodb doesn't have a way to format date as month names
                        numberofdocuments: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: false, // remove _id
                        month: { // set the field month as the month name representing the month number
                            $arrayElemAt: [
                                [
                                    "", // month number starts at 1, so the 0th element can be anything
                                    "january",
                                    "february",
                                    "march",
                                    "april",
                                    "may",
                                    "june",
                                    "july",
                                    "august",
                                    "september",
                                    "october",
                                    "november",
                                    "december"
                                ],
                                "$_id"
                            ]
                        },
                        numberofdocuments: true // keep the count
                    }
                }
            ])
            return new ResponseConfig(1000, allAuthResponse, "Count document by month!!").ResponseSuccess(req, res)
        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },

}
const createAccessToken = (payload) => {
    return jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: '1d' })
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: '30d' })
}

















