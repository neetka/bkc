import mongoose, { Schema } from 'mongoose';

export interface IGalleryImage {
  _id: string;
  src: string;
  alt: string;
  caption: string;
  publicId: string;
  order: number;
}

const GalleryImageSchema = new Schema({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  caption: { type: String, required: true },
  publicId: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.GalleryImage || mongoose.model('GalleryImage', GalleryImageSchema);
