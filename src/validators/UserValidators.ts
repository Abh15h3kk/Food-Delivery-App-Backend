import { body, query, validationResult } from 'express-validator';
import User from '../models/User';
export class UserValidators{
    static signup(){
        return [
            body('name','Name is required').isString(),
            body('phone','phone number is required').isString(),
            body('email','Email is required').isEmail()
            .custom((email,{req}) => {
                return User.findOne({
                    email:email,
                    //type: 'user'
                }).then(user => {
                    if(user) {
                        throw new Error('User Already Exists');
                    } else {
                        return true
                    }
                }).catch(e => {
                    throw new Error(e)
                })
            }),
            body('password','Password is required').isAlphanumeric()
                .isLength({min:8, max:20})
                .withMessage("Password must be between 8-20 characters"),
            body('type','User type is required').isString(),
            body('status','User Status is required').isString(),
            // .custom((value,{req}) => {
            //     if(req.body.email) return true;
            //     else{
            //         throw new Error('Email is not available for validation');
            //     }
            // }),
        ]
    }

    static verifyUserEmailToken() {
        return[
            body('verification_token','Email verification token is required is required').isString(),
        ]   
    }

    static login(){
        return [
            query('email','Email is required').isEmail()
            .custom((email,{req}) => {
                return User.findOne({
                    email:email,
                    //type: 'user'
                }).then(user => {
                    if(user) {
                        //changed the request
                        req.user = user
                        return true
                    } else {
                        throw('User doesn\'t exist')
                    }
                }).catch(e => {
                    throw new Error(e)
                })
            }),
            query('password','Password is required').isAlphanumeric()
    
            // .custom((value,{req}) => {
            //     if(req.body.email) return true;
            //     else{
            //         throw new Error('Email is not available for validation');
            //     }
            // }),
        ]
    }

    static checkResetPasswordEmail() {
        return [
            query('email','Email is required').isEmail()
            .custom((email,{req}) => {
                return User.findOne({
                    email:email,
                    //type: 'user'
                }).then(user => {
                    if(user) {
                        //changed the request
                        return true
                    } else {
                        throw('User doesn\'t exist which such Email')
                    }
                }).catch(e => {
                    throw new Error(e)
                })
            })
        ]
    }

    static verifyResetPasswordToken(){
        return [
            query('email','Email is required').isEmail(),
            query('reset_password_token','Reset Password verification token is required').isString()
            .custom((reset_password_token,{req}) => {
                return User.findOne({
                    email: req.query.email,
                    reset_password_token: reset_password_token,
                    reset_password_token_time: {$gt: Date.now()}
                    //type: 'user'
                }).then(user => {
                    if(user) {
                        //changed the request
                        return true
                    } else {
                        throw('Reset password token doesn\'t exist. Please regenerate')
                    }
                }).catch(e => {
                    throw new Error(e)
                })
            })
        ]
    }

    static resetPassword() {
        return [
            body('email','Email is required').isEmail()
            .custom((email,{req}) => {
                return User.findOne({
                    email: email
                    //type: 'user'
                }).then(user => {
                    if(user) {
                        //changed the request
                        req.user = user
                        return true
                    } else {
                        throw('No user registered with such Email')
                    }
                }).catch(e => {
                    throw new Error(e)
                })
            }),
            body('new_password','New password is required').isAlphanumeric(),
            body('reset_password_token','Reset Password verification token is required').isString()
            .custom((reset_password_token, {req}) => {
                if(req.user.reset_password_token == reset_password_token){
                    return true
                } else {
                    req.errorStatus = 422
                    throw('Reset Password token is invalid. Please try again')
                }
            })
        ]
        
    }

    static verifyPhoneNumber() {
        return [
            body('phone','phone is required').isString()
            .custom((phone,{req}) => {
                return User.findOne({
                    phone: phone
                    //type: 'user'
                }).then(user => {
                    if(user) {
                        //changed the request
                        req.user = user
                        return true
                    } else {
                        throw('No user registered with such phone number')
                    }
                }).catch(e => {
                    throw new Error(e)
                })
            }),
        ]
    }
    //To check if a user with that email already exists
    static verifyUserProfile() {
        return [
        body('phone','phone is required').isString(),
        body('email','email is required').isEmail()
        .custom((email,{req}) => {
            if (req.user.email == email) {
                throw("Use different email")
            }
            return User.findOne({
                email: email
                //type: 'user'
            }).then(user => {
                if(user) {
                    throw('User with this email already exists')
                } else {
                    //req.user = user
                    return true
                }
            }).catch(e => {
                throw new Error(e)
            })
        }),
        body('password','password is required').isAlphanumeric()
    ]
    }
}