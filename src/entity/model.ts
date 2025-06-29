import mongoose, { Schema, Document } from 'mongoose';

export interface IEntity extends Document {
  type: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  websites: string[];
  images: string[];
  place?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EntitySchema: Schema = new Schema({
  type: {
    type: Schema.Types.ObjectId,
    ref: 'EntityType',
    required: [true, 'Entity type is required']
  },
  name: {
    type: String,
    required: [true, 'Entity name is required'],
    trim: true,
    maxlength: [100, 'Entity name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  websites: [{
    type: String,
    validate: {
      validator: function(url: string) {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid URL format'
    }
  }],
  images: [String],
  place: {
    type: Schema.Types.ObjectId,
    ref: 'Place'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
EntitySchema.index({ name: 1 });
EntitySchema.index({ type: 1 });
EntitySchema.index({ place: 1 });

export const Entity = mongoose.model<IEntity>('Entity', EntitySchema);
