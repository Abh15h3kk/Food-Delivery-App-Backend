import * as mongoose from 'mongoose'
import { Schema, model, Document } from 'mongoose';

  const itemSchema = new Schema({
    name: { type: String, required: true },
    restaurant_id: { type: Schema.Types.ObjectId, ref: 'restaurants', required: true },
    category_id: { type: Schema.Types.ObjectId, ref: 'categories', required: true },
    description: {type: String, required: false},
    cover: {type: String, required: true},
    price: {type: Number, required: true},
    veg: {type: Boolean, required: true},
    status: {type: String, required: true},
    created_at: {type: Date, required: true, default: new Date()},
    updated_at: {type: Date, required: true, default: new Date()},

  });
  
  export default model('items', itemSchema);