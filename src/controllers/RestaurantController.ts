import Banner from "../models/Banner";
import Category from "../models/Category";
import Restaurant from "../models/Restaurant"
import User from "../models/User";
import { Utils } from "../utils/Utils"

export class RestaurantController {

    static async addRestaurant(req, res, next) {
        const restaurant = req.body;
        const verification_token = Utils.generateVerificationToken();
        const path = req.file?.path; // Optional chaining to handle cases without a file
        let user; // Declare user variable outside try block for scope
        let categoryIds = []; // Store category IDs for deletion

        try {
            // Prepare user data
            const hash = await Utils.encryptPassword(restaurant.password);
            const data = {
                name: restaurant.name,
                email: restaurant.email,
                verification_token: verification_token,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                phone: restaurant.phone,
                password: hash,
                type: 'restaurant',
                status: 'active',
            };

            // Attempt to create restaurant user
            user = await new User(data).save();

            // Prepare categories data
            const categoriesData = JSON.parse(restaurant.categories).map(x => ({
                name: x,
                user_id: user._id
            }));

            // Create categories
            const categories = await Category.insertMany(categoriesData);
            categoryIds = categories.map(category => category._id); // Store category IDs

            // Prepare restaurant data
            let restaurant_data: any = {
                name: restaurant.res_name,
                shortname: restaurant.short_name,
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

            if (restaurant.description) {
                restaurant_data = { ...restaurant_data, description: restaurant.description };
            }

            // Create restaurant
            const restaurantDoc = await new Restaurant(restaurant_data).save();
            res.send(restaurantDoc);

        } catch (e) {
            // If there's an error, delete the user and categories if they were created
            if (user) {
                await User.findByIdAndDelete(user._id);
            }
            if (categoryIds.length > 0) {
                await Category.deleteMany({ _id: { $in: categoryIds } });
            }
            next(e);
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
}