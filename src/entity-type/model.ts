import mongoose, { Schema, Document } from 'mongoose';

export interface IEntityType extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EntityTypeSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Entity type name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Entity type name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
EntityTypeSchema.index({ name: 1 });

export const EntityType = mongoose.model<IEntityType>('EntityType', EntityTypeSchema);
