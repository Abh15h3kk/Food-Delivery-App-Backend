import User from "../models/User";
import { body, query, validationResult } from 'express-validator';
import { Utils } from "../utils/Utils";
import { NodeMailer } from "../utils/NodeMailer";

export class UserController {
    
    static async signup(req,res,next) {

        const name = req.body.name;
        const phone = req.body.phone;
        const email = req.body.email;
        const password = req.body.password;
        const type = req.body.type;
        const status = req.body.status;
        const verification_token = Utils.generateVerificationToken();
        
        const data = {
            name:name,
            email: email,
            verification_token:verification_token,
            verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
            password: password,
            type: type,
            status: status,
            phone:phone
        };

        try{
            let user = await new User(data).save()
            //send email to user for verification when created
            await NodeMailer.SendMail({
                to: [email],
                subject: 'test',
                html: `<h1>Your OTP is ${verification_token} </h1>`
            })

            res.send(user);
        }
        catch(e){
            next(e)
        }

        //Promise
        //let user = new User(data);
        // user.save().then((user) => {
        //     res.send(user)
        // }).catch((e) => {
        //     next(e)
        // })
    }

    static async verify(req,res,next) {
        const verification_token = req.body.verification_token;
        const email = req.body.email;
        try{
            const user = await User.findOneAndUpdate(
            {
                email: email,
                verification_token: verification_token,
                verification_token_time: {$gt: Date.now()}
            },
            {
                //Updating email_verification to true if we find user with same email, verification token and token time > current time
                email_verification: true
            },
            {
                //This will give object after update is applied
                new: true
            }
        )
            if(user) {
                res.send(user);
            }
            else{
                throw new Error('Email verification token is expired')
            }
        }
        catch(e){
            next(e) 
        }
        }
        
    }
