import mongoose, { Schema, Document } from 'mongoose';

export interface IPlace extends Document {
  name: string;
  description?: string;
  images: string[];
  region?: mongoose.Types.ObjectId | IPlace;
  createdAt: Date;
  updatedAt: Date;
}

const PlaceSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Place name is required'],
    trim: true,
    maxlength: [100, 'Place name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: [String],
  region: {
    type: Schema.Types.ObjectId,
    ref: 'Place',
    required: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
PlaceSchema.index({ name: 1 });
PlaceSchema.index({ region: 1 });

export const Place = mongoose.model<IPlace>('Place', PlaceSchema);
