// src/services/payment.ts
import { api } from './api'

export interface CreateOrderPayload {
  planName: string
  planPrice: number
  currency?: string
  customerName: string
  customerEmail: string
  customerPhone: string
}

export interface OrderResponse {
  orderId: string
  cfOrderId: string
  paymentSessionId: string
}

export interface PaymentStatusResponse {
  status: 'PENDING' | 'ACTIVE' | 'PAID' | 'FAILED' | 'CANCELLED' | 'EXPIRED'
  payment: {
    orderId: string
    planName: string
    planPrice: number
    currency: string
    customerName: string
    customerEmail: string
    failureReason?: string
    createdAt: string
  }
}

/** Create a Cashfree order — returns paymentSessionId for JS SDK */
export const createPaymentOrder = async (payload: CreateOrderPayload): Promise<OrderResponse> => {
  const res = await api.post<OrderResponse>('/payments/create-order', payload)
  return res.data
}

/** Poll payment status from our backend */
export const fetchPaymentStatus = async (orderId: string): Promise<PaymentStatusResponse> => {
  const res = await api.get<PaymentStatusResponse>(`/payments/status/${orderId}`)
  return res.data
}
