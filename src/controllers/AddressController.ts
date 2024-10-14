import Address from "../models/Address"

export class AddressController {
    static async  addAddress(req,res,next) {
        const data = req.body
        //Getting userId from auth middleware (aud)
        const user_id = req.user.aud
        try{
            const addressData = {
                user_id: user_id,
                title: data.title,
                address: data.address,
                landmark: data.landmark,
                house: data.house,
                lat: data.lat,
                lng: data.lng,
            }
            const address = await new Address(addressData).save()
            res.send(address)
        } catch(e){
            next(e)
        }
    }

    static async getAddress(req,res,next) {
        //From auth middleware we're getting decoded value for user
        const user_id = req.user.aud
        try{
            const addresses = await Address.find({user_id})
            res.send(addresses)
        } catch(e) {
            next(e)
        }
    }

    static async deleteAddress(req,res,next) {
        //From auth middleware we're getting decoded value for user
        const user_id = req.user.aud
        const id = req.params.id
        try{
            const addresses = await Address.findOneAndDelete(
                {
                    user_id: user_id,
                    _id: id
                })
            res.json({success:true})
        } catch(e) {
            next(e)
        }
    }

    static async getAddressById(req,res,next) {
        //From auth middleware we're getting decoded value for user
        const user_id = req.user.aud
        const id = req.params.id
        try{
            const address = await Address.findOne(
                {
                    user_id: user_id,
                    _id: id
                })
            res.send(address) 
        } catch(e) {
            next(e)
        }
    }

    static async editAddress(req,res,next) {
         //From auth middleware we're getting decoded value for user
         const user_id = req.user.aud
         const id = req.params.id
         const data = req.body
         try{
            const address = await Address.findOneAndUpdate(
                {
                    user_id: user_id,
                    _id: id
                },
                {
                    title: data.title,
                    address: data.address,
                    landmark: data.landmark,
                    house: data.house,
                    lat: data.lat,
                    lng: data.lng,
                    updated_at: new Date()
                },
                {new: true}
            )
            if(address) {
                res.send(address) 
            } else {
                throw new Error('Address doesn\'t exist')
            }
        } catch(e) {
             next(e)
        }
    }
}