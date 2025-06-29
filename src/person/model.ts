import mongoose, { Schema, Document } from 'mongoose';

export interface IPerson extends Document {
  firstName: string;
  lastName?: string;
  description?: string;
  dateOfBirth?: Date;
  websites: string[];
  images: string[];
  place?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PersonSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return value <= new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
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
PersonSchema.index({ firstName: 1, lastName: 1 });
PersonSchema.index({ place: 1 });

export const Person = mongoose.model<IPerson>('Person', PersonSchema);
