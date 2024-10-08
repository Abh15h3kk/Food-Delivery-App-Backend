import { Router } from "express";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { BannerController } from "../controllers/BannerController";
import { BannerValidators } from "../validators/BannerValidators";
import { Utils } from "../utils/Utils";

class BannerRouter {
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
        this.router.get('/banners',GlobalMiddleware.auth,BannerController.getBanners)
    }
    postRoutes() {
        this.router.post('/create/banner',GlobalMiddleware.auth,GlobalMiddleware.adminRole,new Utils().multer.single('banner'),BannerValidators.addBanner(),GlobalMiddleware.checkError,BannerController.addBanner)
    }
    patchRoutes() {
        
    }
    putRoutes() {
        
    }
    deleteRoutes() {
        
    }
}

export default new BannerRouter().router