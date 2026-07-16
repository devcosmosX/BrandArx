// server/src/models/User.ts
import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  fullName: string
  email: string
  password?: string
  profileImage?: string
  provider: 'email' | 'google'
  emailVerified: boolean
  emailVerificationToken?: string
  emailVerificationTokenExpires?: Date
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  twoFactorTempSecret?: string // for initial 2FA setup
  recoveryCodes: string[]
  refreshToken?: string
  refreshTokenExpires?: Date
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String },
    profileImage: { type: String },
    provider: { type: String, enum: ['email', 'google'], default: 'email' },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationTokenExpires: { type: Date },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    twoFactorTempSecret: { type: String },
    recoveryCodes: { type: [String], default: [] },
    refreshToken: { type: String },
    refreshTokenExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
)

export const User = model<IUser>('User', UserSchema)
