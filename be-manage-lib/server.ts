import server from "./src/index"
const http = require('http')
const server1 = server


const PORT = process.env.PORT || 5000

server1.listen(PORT, () => {

    console.log(`server running on port ${PORT}`)

}) 