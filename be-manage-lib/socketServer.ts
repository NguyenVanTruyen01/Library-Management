import {Server } from 'socket.io'


const io = new Server({
    cors:{
        origin:"http://localhost:3000"
    }
})
io.on("connect",(socket:any)=>{


    socket.on("disconnect",()=>{
        console.log("ngắt ket noi")
    })
    io.emit("notification",()=>{
        return " hello"
    })

})
io.listen(4000)