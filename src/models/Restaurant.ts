import * as mongoose from 'mongoose';
import { Schema, model, Document } from 'mongoose';

interface Restaurant extends Document {
  city_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  name: string;
  short_name?: string;
  description?: string;
  cover: string;
  location: object;
  cuisines: string[]; // Array of strings
  openTime: string;
  closeTime: string;
  price: number;
  address: string;
  delivery_time: number;
  isClose?: boolean;
  status: string;
  rating?: number;
  totalRating?: number;
  created_at: Date;
  updated_at: Date;
}

const restaurantSchema = new Schema<Restaurant>({
  city_id: { type: Schema.Types.ObjectId, required: true },
  user_id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  short_name: { type: String, required: false },
  description: { type: String, required: false },
  cover: { type: String, required: true },
  location: { type: Object, required: true },
  cuisines: { type: [String], required: true }, // Array of strings
  openTime: { type: String, required: true },
  closeTime: { type: String, required: true },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  delivery_time: { type: Number, required: true },
  isClose: { type: Boolean, required: false },
  status: { type: String, required: true },
  rating: { type: Number, required: false },
  totalRating: { type: Number, required: false },
  created_at: { type: Date, required: true, default: () => new Date() },
  updated_at: { type: Date, required: true, default: () => new Date() },
});

// Export the model
export default model<Restaurant>('restaurants', restaurantSchema);
