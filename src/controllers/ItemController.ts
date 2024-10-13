import Item from "../models/Item";

export class ItemController {

    static async  addItem(req,res,next) {

        const itemData = req.body
        const path = req.file.path
        try{
            let item_data: any = {
                name: itemData.name,
                veg: itemData.veg,
                status: itemData.status,
                price: parseInt(itemData.price),
                category_id: itemData.category_id,
                restaurant_id: itemData.restaurant_id,
                cover: path
            };
            if (itemData.description) item_data = { ...item_data, description: itemData.description };
    
            const itemDoc = await new Item(item_data).save();
            res.send(itemDoc)
        } catch(e){

        }
    }

    static async getItems(req,res,next) {
        try{
            
        } catch(e) {
            next(e)
        }
    }
}