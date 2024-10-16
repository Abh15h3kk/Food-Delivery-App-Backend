import Category from "../models/Category"

export class CategoryController {
    static async getCategoriesByRestaurants(req,res,next) {
        try{
            const restaurant_id = req.params.restaurantId
            const categories = await Category.find({ restaurant_id: restaurant_id}, {__v: 0})
            //.populate('restaurant_id')
            res.send(categories)
        } catch(e){
            next(e)
        }
    }
}