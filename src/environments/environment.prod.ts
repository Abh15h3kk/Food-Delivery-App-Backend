import { Environment } from "./environment";
import { Utils } from "../utils/Utils";

Utils.dotenvConfigs()

export const ProdEnvironment : Environment =  {
    db_uri: process.env.PROD_DB_URI ,
    jwt_secret_key : process.env.JWT_SECRET_KEY,
    sendgrid_api_key: process.env.PROD_SENDGRIP_API_KEY
}