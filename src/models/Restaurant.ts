import * as mongoose from 'mongoose';
import { Schema, model, Document } from 'mongoose';

interface Restaurant extends Document {
  city_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  name: string;
  short_name: string;
  description: string;
  cover: string;
  location: object;
  cuisines: Schema.Types.ObjectId[];
  openTime: string;
  closeTime: string;
  price: number;
  address: string;
  delivery_time: number;
  isClose: boolean;
  status: string;
  rating: number;
  totalRating: number;
  created_at: Date;
  updated_at: Date;
}

const restaurantSchema = new Schema<Restaurant>({
  city_id: { type: Schema.Types.ObjectId, required: true },
  user_id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  short_name: { type: String, required: true },
  description: { type: String, required: false },
  cover: { type: String, required: true },
  location: { type: Object, required: true },
  cuisines: [{ type: Schema.Types.ObjectId, ref: 'cuisines', required: true }],
  openTime: { type: String, required: true },
  closeTime: { type: String, required: true },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  delivery_time: { type: Number, required: true },
  isClose: { type: Boolean, required: true },
  status: { type: String, required: true },
  rating: { type: Number, required: true },
  totalRating: { type: Number, required: true },
  created_at: { type: Date, required: true, default: () => new Date() },
  updated_at: { type: Date, required: true, default: () => new Date() },
  // cuisine: [{ type: Schema.Types.ObjectId, ref: 'cuisines' }]
});

export default model<Restaurant>('restaurants', restaurantSchema);
