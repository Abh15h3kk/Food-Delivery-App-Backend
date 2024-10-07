import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { query, validationResult } from 'express-validator';
import { UserValidators } from "../validators/UserValidators";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";

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
        this.router.get('/send/verification/email',GlobalMiddleware.auth,UserController.resendVerificationEmail)
        this.router.get('/login',UserValidators.login(),GlobalMiddleware.checkError,UserController.login)
    }
    postRoutes() {
        this.router.post('/signup',UserValidators.signup(),GlobalMiddleware.checkError,UserController.signup)
    }
    patchRoutes() {
        this.router.patch('/verify',UserValidators.verifyUser(),GlobalMiddleware.checkError,GlobalMiddleware.auth,UserController.verify)
    }
    putRoutes() {

    }
    deleteRoutes() {
        
    }
}

export default new UserRouter().router