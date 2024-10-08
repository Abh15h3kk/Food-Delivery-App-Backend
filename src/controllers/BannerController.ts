import Banner from "../models/Banner"
import User from "../models/User"

export class BannerController {
    static async  addBanner(req,res,next) {
        //res.send(req.file)
        const path = req.file.path
        try{
            const data = {
                banner: path
            }
            let banner = await new Banner(data).save()
            res.send(banner)
        } catch(e){

        }
    }

    static async getBanners(req,res,next) {
        try{
            const banners = await Banner.find({})
            res.send(banners)
        } catch(e) {
            next(e)
        }
    }
}