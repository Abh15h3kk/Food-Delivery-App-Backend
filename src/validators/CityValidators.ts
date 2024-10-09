import { body } from "express-validator";

export class CityValidators {
    static addCity() {
        return [
            body('name',' city name is required').isString(),
            body('lat',' lat name is required').isNumeric(),
            body('lng',' lng name is required').isNumeric(),
            body('status',' status name is required').isString(),
        ]
    }
}