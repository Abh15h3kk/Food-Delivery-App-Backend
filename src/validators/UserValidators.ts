import { body, query, validationResult } from 'express-validator';
export class UserValidators{
    static signup(){
        return [
            body('name','Name is required').isString(),
            body('phone','phone number is required').isString(),
            body('email','Email is required').isEmail(),
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

    static verifyUserEmail() {
        return[
            body('verification token','Email verification token is required is required').isString(),
            body('email','Email is required').isEmail(),
        ]   
    }
}