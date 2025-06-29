import mongoose, { Schema, Document } from 'mongoose';

export interface IRelationshipType extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const RelationshipTypeSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Relationship type name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Relationship type name cannot exceed 50 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
RelationshipTypeSchema.index({ name: 1 });

export const RelationshipType = mongoose.model<IRelationshipType>('RelationshipType', RelationshipTypeSchema);
