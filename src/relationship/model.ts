import mongoose, { Schema, Document } from 'mongoose';

export interface IRelationship extends Document {
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  fromModel: 'Person' | 'Entity';
  toModel: 'Person' | 'Entity';
  relationship: mongoose.Types.ObjectId;
  reverseRelationship: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RelationshipSchema: Schema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    required: [true, 'From field is required'],
    refPath: 'fromModel'
  },
  to: {
    type: Schema.Types.ObjectId,
    required: [true, 'To field is required'],
    refPath: 'toModel'
  },
  fromModel: {
    type: String,
    required: true,
    enum: ['Person', 'Entity']
  },
  toModel: {
    type: String,
    required: true,
    enum: ['Person', 'Entity']
  },
  relationship: {
    type: Schema.Types.ObjectId,
    ref: 'RelationshipType',
    required: [true, 'Relationship type is required']
  },
  reverseRelationship: {
    type: Schema.Types.ObjectId,
    ref: 'RelationshipType',
    required: [true, 'Reverse relationship type is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
RelationshipSchema.index({ from: 1, to: 1 });
RelationshipSchema.index({ from: 1, relationship: 1 });
RelationshipSchema.index({ to: 1, reverseRelationship: 1 });

// Prevent duplicate relationships
RelationshipSchema.index({ from: 1, to: 1, relationship: 1 }, { unique: true });

export const Relationship = mongoose.model<IRelationship>('Relationship', RelationshipSchema);
