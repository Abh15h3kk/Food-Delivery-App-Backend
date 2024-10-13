import * as express from 'express';
import * as mongoose from 'mongoose';
import { getEnvironmentVariables } from './environments/environment';
import UserRouter from './routers/UserRouter';
import * as bodyParser from "body-parser";
import * as cors from "cors";
import BannerRouter from './routers/BannerRouter';
import * as dotenv from 'dotenv'
import * as path from 'path'
import { Utils } from './utils/Utils';
import CityRouter from './routers/CityRouter';
import RestuarantRouter from './routers/RestaurantRouter';
import CategoryRouter from './routers/CategoryRouter';
import ItemRouter from './routers/ItemRouter';


export class Server {

public app: express.Application = express()

    constructor() {
        this.setConfigs();
        this.setRoutes();
        this.error404Handler();
        this.handleErrors();

    }

    setConfigs() {
        this.dotenvConfigs()
        this.connectMongoDB()
        this.allowCors()
        this.configureBodyParser()
        this.jsonParser
    }

    dotenvConfigs() {
        //dotenv.config({path: path.resolve(__dirname, '../.env')})
        Utils.dotenvConfigs()
    }

    connectMongoDB() {
        mongoose.connect(getEnvironmentVariables().db_uri)
        .then(() => {
        console.log('connected to mongodb')
        }) 
    }

    configureBodyParser(){
        this.app.use(bodyParser.urlencoded({
            extended: true
        }
        ))
    }

    allowCors(){
        this.app.use(cors())
    }

    jsonParser(){
        this.app.use(express.json());
    }

    setRoutes() {
        //Making the upload folder static, otherwise it won't allow to upload
        this.app.use('/src/uploads', express.static('src/uploads'))
        this.app.use('/api/user',UserRouter)
        this.app.use('/api/banner',BannerRouter)
        this.app.use('/api/city',CityRouter)
        this.app.use('/api/restaurant',RestuarantRouter)
        this.app.use('/api/category',CategoryRouter)
        this.app.use('/api/item',ItemRouter)
    }

    error404Handler() {
        this.app.use((req,res)=>{
            res.status(404).json({
                message: 'Not found',
                status_code: 404
            }) 
        })
    }

    handleErrors(){
        this.app.use((error,req,res,next) => {
            // This line sets the HTTP status code based on the error object's "errorStatus" property.
            const errorStatus = req.errorStatus || 500
            res.status(errorStatus).json({
                // The response includes a JSON object with a "message" property.
                // If the error has a "message" property, that will be used. Otherwise, it defaults to 'Something went wrong'.
                message: error.message || 'Something went wrong',
                status_code: errorStatus
            })
        })  
    }
}