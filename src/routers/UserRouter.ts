import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { query, validationResult } from 'express-validator';
import { UserValidators } from "../validators/UserValidators";

class UserRouter {
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
        this.router.post('/signup',UserValidators.signup(),UserController.signup)
    }
    postRoutes() {}
    patchRoutes() {}
    putRoutes() {}
    deleteRoutes() {}
}

export default new UserRouter().router