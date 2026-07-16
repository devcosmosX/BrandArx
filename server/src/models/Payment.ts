// server/src/models/Payment.ts
import { Schema, model, Document } from 'mongoose'

export type PaymentStatus = 'PENDING' | 'ACTIVE' | 'PAID' | 'EXPIRED' | 'CANCELLED' | 'FAILED'

export interface IPayment extends Document {
  orderId: string           // Our unique order ID (cf_order_id prefix)
  cfOrderId: string         // Cashfree's order ID
  userId?: string           // Optional: linked user
  planName: string
  planPrice: number
  currency: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: PaymentStatus
  paymentSessionId?: string // Cashfree payment session token
  cfPaymentId?: string      // Cashfree payment ID after success
  paymentMethod?: string
  webhookVerified: boolean
  failureReason?: string
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId:          { type: String, required: true, unique: true },
    cfOrderId:        { type: String },
    userId:           { type: String },
    planName:         { type: String, required: true },
    planPrice:        { type: Number, required: true },
    currency:         { type: String, default: 'INR' },
    customerName:     { type: String, required: true },
    customerEmail:    { type: String, required: true },
    customerPhone:    { type: String, required: true },
    status:           { type: String, enum: ['PENDING','ACTIVE','PAID','EXPIRED','CANCELLED','FAILED'], default: 'PENDING' },
    paymentSessionId: { type: String },
    cfPaymentId:      { type: String },
    paymentMethod:    { type: String },
    webhookVerified:  { type: Boolean, default: false },
    failureReason:    { type: String },
  },
  { timestamps: true }
)

export const Payment = model<IPayment>('Payment', PaymentSchema)
