import { body } from "express-validator";

export class AddressValidators {
    static addAddress() {
        return [
            body('title','Title is required').isString(),
            body('landmark','Landmark is required').isString(),
            body('address','Address is required').isString(),
            body('house','house number is required').isString(),
            body('lat','Latitude is required').isString(),
            body('lng','Longitude is required').isString(),
        ]
    }
    static editAddress() {
        return [
            body('title','Title is required').isString(),
            body('landmark','Landmark is required').isString(),
            body('address','Address is required').isString(),
            body('house','house number is required').isString(),
            body('lat','Latitude is required').isString(),
            body('lng','Longitude is required').isString(),
        ]
    }
}