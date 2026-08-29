import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILinkDocument extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  url: string;
  description?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const LinkSchema = new Schema<ILinkDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Link name is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      enum: ['Coding', 'Projects', 'Career', 'Education', 'Social', 'Learning', 'Others'],
      default: 'Others',
    },
  },
  {
    timestamps: true,
  }
);

const Link: Model<ILinkDocument> =
  mongoose.models.Link || mongoose.model<ILinkDocument>('Link', LinkSchema);

export default Link;
