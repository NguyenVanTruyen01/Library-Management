import axios from 'axios'
import { ILogin, IRegister } from '@type/AuthInterface'
import Repository from 'congfig/repository/RepositoryConfig'
const url = 'http://localhost:5000/api/v1/auth'

const AuthServices = {
  postUserLogin: async (user: ILogin) => {
    return await axios.post(`${url}/login`, user, {
      headers: { "Access-Control-Allow-Origin": "*" }
    })
  },
  postUserRegister: async (user: IRegister) => {
    return await axios.post(`${url}/register`, user, {
      headers: { "Access-Control-Allow-Origin": "*" }
    })
  },
  ResetPassword: async (password: string, oldPassword: string, email: string, token: string) => {
    return await axios.post(`${url}/reset-password`, { password, oldPassword, email }, {
      headers: { Authorization: token }
    })
  },
  ForgotPassword: async (email: string) => {
    return await axios.post(`${url}/forgot-password`, { email })
  },
  logout: async () => {
    return await axios.post(`${url}/logout`)
  },
  getAllStudent: async () => {
    return await axios.get(`${url}/student`)
  },
  getAllAccount: async (page: number) => {
    return await axios.get(`${url}/account?page=${page}`)
  },
  getAllStudentNoGroup: async () => {
    return await axios.get(`${url}/student/no-group`)
  },
  getAllTeacher: async () => {
    return await axios.get(`${url}/teacher`)
  },
  getTotalAccount: async () => {
    return await Repository("GET", url + "/total", { params: {}, payload: {} })
  },
  updateInfoAccount: async (data: any) => {
    return await Repository("POST", url + "/update-profile", { params: {}, body: data })
  },

  updateAvatarAccount: async ({ data, id }: any) => {
    return await Repository("PUT", url + `/update-avatar/${id}`, { params: {}, body: data })
  },

  getBorrowerByMSSV: async (mssv: string) => {
    return await Repository("GET", url + `/search?mssv=${mssv}`, { params: {}, body: {} })
  },


  deleteAccountById: async (id: any) => {
    return await Repository("DELETE", url + `/delete/${id}`, { params: {}, body: {} })
  },
}
export default AuthServices