import * as mongoose from 'mongoose'
import { Schema, model, Document } from 'mongoose';

interface Category extends Document {
    name: string;
    user_id: Schema.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
    //cuisine: Schema.Types.ObjectId[];
  }

  const categorySchema = new Schema<Category>({
    name: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
    created_at: { type: Date, required: true, default: new Date() },
    updated_at: { type: Date, required: true, default: new Date() },
    //cuisine: [{ type: Schema.Types.ObjectId, ref: 'cuisines' }]
  });
  
  export default model<Category>('categories', categorySchema);