import Banner from "../models/Banner";
import Category from "../models/Category";
import Restaurant from "../models/Restaurant"
import User from "../models/User";
import { Utils } from "../utils/Utils"

export class RestaurantController {

    static async addRestaurant(req, res, next) {
        const restaurant = req.body;
        const path = req.file.path;
        const verification_token = Utils.generateVerificationToken();
        
        // Declare variables to store the user and restaurant documents
        let user;
        let restaurantDoc;
    
        try {
            // Encrypt password and create restaurant user
            const hash = await Utils.encryptPassword(restaurant.password);
            const data = {
                email: restaurant.email,
                verification_token,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                phone: restaurant.phone,
                password: hash,
                name: restaurant.name,
                type: 'restaurant',
                status: 'active'
            };
            user = await new User(data).save();
    
            // Create restaurant
            let restaurant_data: any = {
                name: restaurant.res_name,
                location: JSON.parse(restaurant.location),
                address: restaurant.address,
                openTime: restaurant.openTime,
                closeTime: restaurant.closeTime,
                status: restaurant.status,
                cuisines: JSON.parse(restaurant.cuisines),
                price: parseInt(restaurant.price),
                delivery_time: parseInt(restaurant.delivery_time),
                city_id: restaurant.city_id,
                user_id: user._id,
                cover: path
            };
            if (restaurant.description) restaurant_data = { ...restaurant_data, description: restaurant.description };
    
            const restaurantDoc = await new Restaurant(restaurant_data).save();
    
            // Create categories
            const categoriesData = JSON.parse(restaurant.categories).map(x => {
                return { name: x, restaurant_id: restaurantDoc._id };
            });
            await Category.insertMany(categoriesData);
    
            // Send response with the created restaurant document
            res.send(restaurantDoc);
    
            // Send verification email (commented out but available for future use)
            // await NodeMailer.sendMail({
            //     to: [user.email],
            //     subject: 'Email Verification',
            //     html: `<h1>Your Otp is ${verification_token}</h1>`
            // });
    
        } catch (e) {
            // If an error occurs, delete the created user and restaurant
            if (restaurantDoc) {
                await Restaurant.findByIdAndDelete(restaurantDoc._id);
            }
            if (user) {
                await User.findByIdAndDelete(user._id);
            }
    
            next(e); // Pass the error to the next middleware for handling
        }
    }
    

    static async getNearbyRestaurants(req,res,next) {
        const data = req.query
        //const METERS_PER_KM = 1000

        try{
            const restaurants = await Restaurant.find(
                {
                    status:'active',
                    location: {
                        // $nearSphere:{
                        //     $geometry: 
                        //     {
                        //         ype: "Point",
                        //         coordinates: [parseFloat(data.lng), parseFloat(data.lat) ] 
                        //     },
                        //     $maxDistance: data.radius * METERS_PER_KM } 
                        $geoWithin:{
                            $centerSphere: [ 
                                [ parseFloat(data.lng), parseFloat(data.lat) ],
                                 parseFloat(data.radius)/6378.1
                            ] 
                        } 
                    
                    } 
                }

            )
            res.send(restaurants)
        } catch(e) {
            next(e)
        }
    }

    static async searchNearbyRestaurants(req,res,next) {
        const data = req.query
        //const METERS_PER_KM = 1000

        try{
            const restaurants = await Restaurant.find(
                {
                    status:'active',
                    name: {$regex: data.name, $options: 'i'},
                    location: {
                        // $nearSphere:{
                        //     $geometry: 
                        //     {
                        //         ype: "Point",
                        //         coordinates: [parseFloat(data.lng), parseFloat(data.lat) ] 
                        //     },
                        //     $maxDistance: data.radius * METERS_PER_KM } 
                        $geoWithin:{
                            $centerSphere: [ 
                                [ parseFloat(data.lng), parseFloat(data.lat) ],
                                 parseFloat(data.radius)/6378.1
                            ] 
                        } 
                    
                    } 
                }

            )
            res.send(restaurants)
        } catch(e) {
            next(e)
        }
    }

    static async getRestaurants(req,res,next) {
        try{
            const restaurants = await Restaurant.find(
                {
                    status: 'active'
                }
            )
            res.send(restaurants)
        } catch(e) {
            next(e)
        }
    }
}