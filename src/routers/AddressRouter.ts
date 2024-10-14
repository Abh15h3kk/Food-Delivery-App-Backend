import { Router } from "express";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { BannerController } from "../controllers/BannerController";
import { BannerValidators } from "../validators/BannerValidators";
import { Utils } from "../utils/Utils";
import { AddressController } from "../controllers/AddressController";
import { AddressValidators } from "../validators/AddressValidators";

class AddressRouter {
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
        //Id is passed by auth. So no need to put in postman as it'll take the Id from the access token.
        this.router.get('/getUserAddresses',GlobalMiddleware.auth,AddressController.getAddress)
        //To fetch single address
        this.router.get('/:id',GlobalMiddleware.auth,AddressController.getAddressById)
    }
    postRoutes() {
        this.router.post('/create',GlobalMiddleware.auth,AddressValidators.addAddress(),GlobalMiddleware.checkError,AddressController.addAddress)
    }
    patchRoutes() {
        
    }
    putRoutes() {
        this.router.put('/edit/:id',GlobalMiddleware.auth,AddressValidators.editAddress(),GlobalMiddleware.checkError,AddressController.editAddress)
    }
    deleteRoutes() {
        this.router.delete('/delete/:id',GlobalMiddleware.auth,AddressController.deleteAddress)
    }
}

export default new AddressRouter().router