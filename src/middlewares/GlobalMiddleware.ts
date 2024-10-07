import { validationResult } from "express-validator";
import { Jwt } from "../utils/Jwt";

export class GlobalMiddleware{
    static checkError(req,res,next) {
        //This block ensures that if the incoming request data does not meet the validation requirements,
        //the signup process is halted, and an error is passed to the error-handling middleware. 
        //This prevents the code from attempting to save invalid data to the database
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new Error(errors.array()[0].msg));
        } else {
            next()
        }

    }

    static async auth(req,res,next) {
       const header_auth = req.headers.authorization
       const token = header_auth ? header_auth.slice(7, header_auth.length) : null
       try {
           req.errorStatus = 401;
           const decoded = await Jwt.jwtVerify(token)
           //modifying request
           req.user = decoded
           next()
       } catch(e){
            next(e)
       }
    }
}