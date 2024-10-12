import { Router } from "express";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { Utils } from "../utils/Utils";
import { restaurantValidators } from "../validators/RestaurantValidators";
import { RestaurantController } from "../controllers/RestaurantController";

class RestaurantRouter {
    public router: Router

    constructor(){
        this.router = Router()
        this.getRoutes()
        this.postRoutes()
        this.patchRoutes()
        this.putRoutes()
        this.deleteRoutes()
    }
    
    getRoutes() {
        this.router.get('/all/restaurants', GlobalMiddleware.auth, RestaurantController.getRestaurants)
    }
    postRoutes() {
        this.router.post('/create',GlobalMiddleware.auth, GlobalMiddleware.adminRole, new Utils().multer.single('cover'), restaurantValidators.addRestaurant(),GlobalMiddleware.checkError,RestaurantController.addRestaurant)
    }
    patchRoutes() {
        
    }
    putRoutes() {
        
    }
    deleteRoutes() {
        
    }
}

export default new RestaurantRouter().router