import { Utils } from "../utils/Utils";
import { Environment } from "./environment";

Utils.dotenvConfigs()

export const DevEnvironment: Environment =  {
    db_uri: process.env.DEV_DB_URI,
    jwt_secret_key : process.env.DEV_JWT_SECRET_KEY,
    sendgrid_api_key: process.env.DEV_SENDGRIP_API_KEY ,
}