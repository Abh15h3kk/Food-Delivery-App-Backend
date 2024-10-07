import User from "../models/User";
import { body, query, validationResult } from 'express-validator';
import { Utils } from "../utils/Utils";
import { NodeMailer } from "../utils/NodeMailer";
import { getEnvironmentVariables } from "../environments/environment";
import { Jwt } from "../utils/Jwt";

export class UserController {

    static async signup(req,res,next) {

        const name = req.body.name;
        const phone = req.body.phone;
        const email = req.body.email;
        const password = req.body.password;
        const type = req.body.type;
        const status = req.body.status;
        const verification_token = Utils.generateVerificationToken();
        

        try{
        const hash = await Utils.encryptPassword(req.body.password)
        const data = {
            name:name,
            email: email,
            verification_token:verification_token,
            verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
            password: hash,
            type: type,
            status: status,
            phone:phone
        };
        let user = await new User(data).save()
        const payload = {
            user_id: user._id,
            email: user.email
        }
        const token = Jwt.jwtSign(payload)
        res.json({
            token: token,
            user: user
        })
        //send email to user for verification when created
        await NodeMailer.SendMail({
            to: [email],
            subject: 'test',
            html: `<h1>Your OTP is ${verification_token} </h1>`
            })
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
        const email = req.user.email;
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

    static async resendVerificationEmail(req,res,next){
        //res.send(req.decoded)
        const verification_token = Utils.generateVerificationToken()
        const email = req.user.email
        try{
            const user: any = await User.findOneAndUpdate(
                {email:email},
                {
                    verification_token: verification_token,
                    verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
                }
            );
            if(user) {
                await NodeMailer.SendMail({
                    to: [email],
                    subject: 'Resend email verification',
                    html:`<h1>Your OTP is ${verification_token} </h1>`

                });
                res.json({success: true});
            } else {
                throw new Error('User doesn\'t exist')
            }
        }

        catch(e){
            next(e);
        }
    }

    static async login(req,res,next){
        const user = req.user
        const password = req.query.password
        const encrypt_password = user.password
        const data = {
            password: password,
            encrypt_password: encrypt_password
        }
        try {
            await Utils.comparePassword(data)
            const payload = {
                user_id: user._id,
                email: user.email
            }
            const token = Jwt.jwtSign(payload)
            res.json({
                token: token,
                user: user
            })
        } catch(e){
            next(e)
        }
    }
}