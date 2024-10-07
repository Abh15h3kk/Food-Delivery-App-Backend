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

    static verifyUser() {
        return[
            body('verification token','Email verification token is required is required').isString(),
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
}