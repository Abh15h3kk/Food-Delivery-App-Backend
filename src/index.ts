import { Server } from "./server"
import * as express from "express"
import * as mongoose from "mongoose"
import { getEnvironmentVariables } from "./environments/environment"

let server = new Server().app
let port = process.env.PORT

server.listen(port,() => {
    console.log(`server is running at port ${port}`) 
})

