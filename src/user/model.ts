import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  googleId?: string;
  profilePicture?: string;
  isActive: boolean;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values but maintains uniqueness for non-null values
  },
  profilePicture: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  lastLoginAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(_doc, ret) {
      ret['id'] = ret['_id'];
      delete ret['_id'];
      delete ret['__v'];
      delete ret['googleId']; // Don't expose googleId in JSON responses
      return ret;
    },
  },
});

// Index for efficient queries
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ googleId: 1 }, { sparse: true });

export const User = mongoose.model<IUser>('User', userSchema);
