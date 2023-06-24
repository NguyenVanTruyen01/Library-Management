import dotenv from 'dotenv'
import express, { urlencoded } from 'express'
import morgan from 'morgan'
import bodyParser from "body-parser"
import cors from 'cors'
import { ExpressPeerServer } from 'peer'
import compression from 'compression'
import helmet from "helmet"
import { GridFsStorage } from "multer-gridfs-storage"
import { ConnectDB } from "./config/ConnectDB"
import ErrorHandle from "./middleware/ErrorHandle"
import indexRoutes from './router/indexRoutes'
import multer from "multer"
import BookRouters from './router/BookRouters'
import CallCardRouters from './router/CallCardRouters'
import CategoryRouters from './router/CategoryRouters'



dotenv.config()
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

const http = require('http')

let server = http.createServer(app)
const io = require('socket.io')(server,
    {
        cors: {
            origin: "http://localhost:3000",
            method: ["POST", "GET", "PUT", "PATCH"]
        }
    })
ExpressPeerServer(server, { path: "/" })

const corsOptions = {
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    "origin": "*",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
};

//middleware
app.use(cors(corsOptions));
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded())
app.use(compression({
    level: 6,
    threshold: 100 * 1000
}))
app.use(helmet())

//routes
app.use('/api/v1/', indexRoutes)


app.all("*")
app.use(ErrorHandle)

ConnectDB().then(() => {
    console.log("")
})



export default server
