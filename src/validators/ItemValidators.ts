import { body, param } from "express-validator";
import Restaurant from "../models/Restaurant";
import Category from "../models/Category";

export class ItemValidators {
    static addItem() {
        return [
            body('itemImages','itemImage is required')
            .custom((cover,{req}) => {
                if(req.file) {
                    return true
                } else {
                    throw new Error('Item Image not uploaded')
                }
            }),
            body('name',' Item name is required').isString(),
            body('restaurant_id','Restaurant Id is required').isString()
            .custom((restaurant_id,{req}) => {
                return Restaurant.findById(restaurant_id).then(restaurant => {
                    if(restaurant) {
                        return true
                    } else {
                        throw new Error('No such restaurant exists');
                    }
                }).catch(e => {
                    throw new Error(e)
                })
            }),
            body('category_id','Category Id is required').isString()
            .custom((category_id,{req}) => {
                return Category.findOne({_id:category_id, restaurant_id : req.body.restaurant_id}).then(category => {
                    if(category) {
                        return true
                    } else {
                        throw new Error('No such category exists');
                    }
                }).catch(e => {
                    throw new Error(e)
                })
            }),
            body('status',' status name is required').isString(),
            body('price',' price is required').isString(),
            body('veg','Item is veg or not is required').isString(),

        ]
    }

    static getMenuItems() {
        return [
            param('restaurantId','Restaurant Id is required').isString()
            .custom((restaurant_id,{req}) => {
                return Restaurant.findById(restaurant_id).then(restaurant => {
                    if(restaurant) {
                        req.restaurant = restaurant
                        return true
                    } else {
                        throw new Error('No such restaurant exists');
                    }
                }).catch(e => {
                    throw new Error(e)
                })
            }),
        ]
    }
}