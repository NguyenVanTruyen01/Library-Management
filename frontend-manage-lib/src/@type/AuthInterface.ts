export interface ILogin {
  email: string
  password: string,
}
export interface ILogin {
  email: string
  password: string,
}
export interface IUser extends ILogin {
  username: string,
  phone: string,
  // addressUser: string,
  addressCurrent:string,
  addressHouse:string,
  access_token: string
  role: string
  id: string
  postHeart: string[]
}
export interface IRegister extends ILogin {
  name: string
  phone: string
  role: string
  mssv: string
  cmnd?: string
  age?: number
}
