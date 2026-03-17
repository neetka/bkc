import mongoose, { Schema } from 'mongoose';

export interface IAdmin {
  _id: string;
  username: string;
  passwordHash: string;
}

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
