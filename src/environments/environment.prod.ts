import { Environment } from "./environment";

export const ProdEnvironment : Environment =  {
    db_uri: 'mongodb+srv://abh1sh3kverma:123456789aA@cluster0.of9w9.mongodb.net/FoodDeliveryApp?retryWrites=true&w=majority&appName=Cluster0',
    jwt_secret_key : 'secretkeyproduction',
    sendgrid_api_key: `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`
}