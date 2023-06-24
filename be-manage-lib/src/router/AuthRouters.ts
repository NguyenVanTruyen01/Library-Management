import express from 'express'
import { AuthMiddleware } from "../middleware/Auth"
import { AuthCtrl } from "../controller/Auth/AuthCtrl"

const routerAuth = express.Router()

routerAuth.put('/auth/update-avatar/:id', AuthCtrl.updateAvatar)
routerAuth.get('/auth/search', AuthCtrl.searchAuthByMSSV)

routerAuth.get('/auth/student', AuthCtrl.findAllAuthStudent)
routerAuth.get('/auth/total', AuthCtrl.getTotalAccount)
routerAuth.get('/auth/account', AuthCtrl.findAllAccount)
routerAuth.get('/auth/student/no-group', AuthCtrl.findAllAuthStudentNogroup)
routerAuth.get('/auth/teacher', AuthCtrl.findAllAuthTeacher)
routerAuth.post("/auth/data", AuthCtrl.getDataChartAuth)
routerAuth.post('/auth/forgot-password', AuthCtrl.forgotPassword)
routerAuth.post('/auth/reset-password', AuthCtrl.resetPassword)
routerAuth.post('/auth/login', [AuthMiddleware.login], AuthCtrl.login)
routerAuth.post('/auth/register', [AuthMiddleware.register], AuthCtrl.register)
routerAuth.put('/auth/resetPassword', AuthCtrl.resetPassword)
routerAuth.get('/refresh_token', AuthCtrl.generateAccessToken)
routerAuth.post('/auth/logout', AuthCtrl.logout)
routerAuth.post('/auth/update-profile', AuthCtrl.updateProfile)

routerAuth.delete('/auth/delete/:id', [AuthMiddleware.auth], AuthCtrl.deleteOneAccountById)

export default routerAuth

