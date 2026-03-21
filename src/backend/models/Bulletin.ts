import mongoose, { Schema } from 'mongoose';

export interface IBulletin {
  _id: string;
  title: string;
  description: string;
  date: string;
  isNew: boolean;
  order: number;
}

const BulletinSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  isNew: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true, suppressReservedKeysWarning: true });

export default mongoose.models.Bulletin || mongoose.model('Bulletin', BulletinSchema);
