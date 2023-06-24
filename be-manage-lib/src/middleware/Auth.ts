import { Request, Response, NextFunction } from "express"
const jwt = require('jsonwebtoken')
const AuthModels = require('../model/Auth/Auth')

const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
}
const validatePassword = (password: string) => {
    if (password.length < 6)
        return "Password minlength 6 character"
    return ""
}
const validatePhone = (phone: string) => {
    if (phone.length < 10)
        return "Password minlength 10 character"
    if (phone.length > 11)
        return "Password maxlength 11 character"
    return ""
}

export const AuthMiddleware = {
    register: (req: Request, res: Response, next: NextFunction) => {
        const { email, password, phone }: any = req.body

        let errValidate: string[] = []

        if (validateEmail(email) === null) {
            errValidate.push("Email is not validator")
        }

        let isValidatePassword = validatePassword(password)

        let isValidatePhone = validatePhone(phone)

        isValidatePassword.length > 0 && errValidate.push(isValidatePassword)

        isValidatePhone.length > 0 && errValidate.push(isValidatePhone)

        if (errValidate.length > 0) return res.status(500).json({
            msg: "validate Error",
            err: errValidate
        })
        next();
    },
    login: (req, res, next) => {
        const { email, password } = req.body

        let errValidate: string[] = []

        if (validateEmail(email) === null) {
            errValidate.push("Email is not validator")
        }

        let isValidatePassword = validatePassword(password)

        isValidatePassword.length > 0 && errValidate.push(isValidatePassword)

        if (errValidate.length > 0) return res.status(500).json({
            msg: "validate Error",
            err: errValidate
        })
        console.log("validate success")
        next();

    },

    auth: async (req, res, next) => {
        try {
            const token = req.header("Authorization")

            if (!token) return res.status(400).json({ msg: "Invalid Authentication." })

            const decoded = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)

            if (!decoded) return res.status(400).json({ msg: "Invalid Authentication." })

            const user = await AuthModels.findOne({ _id: decoded.id })

            req.user = user

            next()
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

}
