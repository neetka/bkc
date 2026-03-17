import mongoose, { Schema } from 'mongoose';

export interface ISubmission {
  _id: string;
  type: 'enquiry' | 'join';
  name: string;
  email: string;
  phone: string;
  message: string;
  joinType: string;
  preferredRole: string;
  createdAt: Date;
}

const SubmissionSchema = new Schema({
  type: { type: String, enum: ['enquiry', 'join'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, default: '' },
  joinType: { type: String, default: '' },
  preferredRole: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
