import { Router } from "express";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { BannerController } from "../controllers/BannerController";
import { BannerValidators } from "../validators/BannerValidators";
import { CategoryController } from "../controllers/CategoryController";

class CategoryRouter {
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
        this.router.get('/getCategories/:restaurantId',GlobalMiddleware.auth,CategoryController.getCategoriesByRestaurants)
    }
    postRoutes() {
        
    }
    patchRoutes() {
        
    }
    putRoutes() {
        
    }
    deleteRoutes() {
        
    }
}

export default new CategoryRouter().router