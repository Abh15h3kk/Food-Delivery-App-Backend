import { body, query } from "express-validator";
import User from "../models/User";

export class restaurantValidators {
    static addRestaurant() {
        return [
            body('name','name is required').isString(),
            body('res_name',' Restaurant name is required').isString(),
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
            body('restaurant','Cover image is required')
            .custom((cover,{req}) => {
                if(req.file) {
                    return true
                } else {
                    throw new Error('File not uploaded')
                }
            }),
            body('password','Password is required').isAlphanumeric()
                .isLength({min:8, max:20})
                .withMessage("Password must be between 8-20 characters"),
            body('short_name',' Restaurant short name is required').isString(),
            body('openTime',' Open Time is required').isString(),
            body('closeTime',' Close Time is required').isString(),
            body('price',' Price is required').isString(),
            body('delivery_time',' Delivery time is required').isString(),
            body('status',' status is required').isString(),
            body('address',' address is required').isString(),
            body('location',' location is required').isString(),
            body('cuisines',' Cuisines is required').isString(),
            body('city_id',' city is required').isString(),
        ] 
    }

    static getNearbyRestaurant() {
        return [
            query('lat','Latitude is required').isNumeric(),
            query('lng','Longitude is required').isNumeric(),
            query('radius','Radius is requires').isNumeric(),
        ]
    }

    static searchNearbyRestaurant() {
        return [
            query('lat','Latitude is required').isNumeric(),
            query('lng','Longitude is required').isNumeric(),
            query('radius','Radius is requires').isNumeric(),
            query('name','search query is requires').isString(),
        ]
    }
}