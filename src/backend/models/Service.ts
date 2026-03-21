import mongoose, { Schema } from 'mongoose';

export interface IService {
  _id: string;
  title: string;
  description: string;
  icon: string;
  category: 'government' | 'other';
  order: number;
}

const ServiceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  category: { type: String, enum: ['government', 'other'], default: 'government' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
