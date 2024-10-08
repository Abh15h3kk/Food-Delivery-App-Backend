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
            //user._id = user._id
            aud: user._id,
            email: user.email,
            type: user.type
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

    static async verifyUserEmailToken(req,res,next) {
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
                email_verified: true,
                updated_at: new Date(),
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
                    updated_at : new Date(),
                    verification_token: verification_token,
                    verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
                }
            );
            if(user) {
                res.json({success: true});
                await NodeMailer.SendMail({
                    to: [email],
                    subject: 'Resend email verification',
                    html:`<h1>Your OTP is ${verification_token} </h1>`

                });
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
                aud: user._id,
                email: user.email,
                type: user.type
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

    static async sendResetPasswordOTP(req,res,next) {
        const reset_password_token = Utils.generateVerificationToken()
        const email = req.query.email
        try{
            const user: any = await User.findOneAndUpdate(
                {email:email},
                {
                    updated_at : new Date(),
                    reset_password_token: reset_password_token,
                    reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
                }
            );
            //If user exists then send mail
            if(user) {
                res.json({success: true});
                await NodeMailer.SendMail({
                    to: [email],
                    subject: 'Resend email verification',
                    html:`<h1>Reset Password OTP is ${reset_password_token} </h1>`

                });
            } else {
                throw new Error('User doesn\'t exist')
            }
        }

        catch(e){
            next(e);
        }
    }

    static async verifyResetPasswordToken(req,res,next) {
        try{
            res.json({success:true})
        } catch(e){
            next(e)
        }
    }

    static async resetPassword(req,res,next) {
        const user = req.user
        const new_password = req.body.new_password
        try{
            const encryptedPassword = await Utils.encryptPassword(new_password)
            const updatedUser = await User.findOneAndUpdate(
                {_id: user._id},
                {
                    updated_at : new Date(),
                    password: encryptedPassword,
                },
                {new:true}
            );
            //If user exists then send mail
            if(updatedUser) {
                res.send(updatedUser)
            } else {
                throw new Error('User doesn\'t exist')
            }
        }

        catch(e){
            next(e);
        } 
    }

    static async profile(req,res,next) {
        const user = req.user
        try{
            const profile = await User.findById(user.aud)
            if(profile) {
                res.send(profile)
            } else {
                throw new Error('User doesn\'t exist')
            }
        }

        catch(e){
            next(e);
        } 
    }

    static async updatePhoneNumber(req,res,next) {
        //In global middleware we are setting the user in our request
        const user = req.user
        const phone = req.body.phone
        try{
            const userData = await User.findByIdAndUpdate(
                user.aud,
                { 
                    phone: phone,
                    updated_at: new Date()
                },
                { new: true }
            )
            res.send(userData)
        } catch(e) {
            next(e)
        }
    }

    static async updateUserProfile(req,res,next) {
        const user = req.user
        const phone = req.body.phone
        const new_email = req.body.email
        const plain_password = req.body.password
        const verification_token = Utils.generateVerificationToken()

        try
        {
            const userData = await User.findById(user.aud)
            if(!userData) throw new Error('User doesn\'t exist')
            await Utils.comparePassword({
                password: plain_password,
                encrypt_password: userData.password
            })

            const updatedUser = await User.findByIdAndUpdate(
                user.aud,
                {
                    phone:phone,
                    email: new_email,
                    email_verified: false,
                    verification_token,
                    verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                    updated_at: new Date()
                },
                {new: true}
            )
            const payload = {
                //user._id = user._id
                aud: user.aud,
                email: updatedUser.email,
                type: updatedUser.type
            }
            const token = Jwt.jwtSign(payload)
            res.json({
            token: token,
            user: updatedUser
        })
        //send email to user for updated mail verification
            await NodeMailer.SendMail({
                to: [updatedUser.email],
                subject: 'Email Verification',
                html: `<h1>Your OTP is ${verification_token} </h1>`
                })
                res.send(userData)
        } catch(e) {
            next(e)
        }
    }

    
}