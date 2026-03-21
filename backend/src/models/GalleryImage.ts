import mongoose, { Schema } from 'mongoose';

export interface IGalleryImage {
  _id: string;
  src: string;
  alt?: string;
  caption?: string;
  publicId: string;
  order: number;
}

const GalleryImageSchema = new Schema({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  caption: { type: String, default: '' },
  publicId: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.GalleryImage || mongoose.model('GalleryImage', GalleryImageSchema);
