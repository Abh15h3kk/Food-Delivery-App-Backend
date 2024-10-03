import { Server } from "./server"
import * as express from "express"
import * as mongoose from "mongoose"
import { getEnvironmentVariables } from "./environments/environment"

let server = new Server().app
let port = 3000

server.listen(port,() => {
    console.log(`server is running at port ${port}`) 
})

