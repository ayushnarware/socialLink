"use server"

import { getProductById } from "@/lib/products"
import { getCurrentUser } from "@/lib/auth"

// Razorpay server-side integration
// Note: Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET env vars

export async function createRazorpayOrder(productId: string) {
  const product = getProductById(productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  const user = await getCurrentUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  if (!product.priceInINR) {
    throw new Error("INR pricing not available for this product")
  }

  const Razorpay = (await import("razorpay")).default

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })

  const order = await razorpay.orders.create({
    amount: product.priceInINR * 100, // Razorpay expects amount in paise
    currency: "INR",
    receipt: `order_${Date.now()}`,
    notes: {
      userId: user._id!.toString(),
      planId: productId,
      email: user.email,
    },
  })

  return {
    orderId: order.id,
    amount: product.priceInINR * 100,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID,
    name: "Ayush",
    description: product.description,
    prefill: {
      name: user.name,
      email: user.email,
    },
  }
}

export async function verifyRazorpayPayment(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const crypto = await import("crypto")
  
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex")

  if (expectedSignature !== signature) {
    throw new Error("Invalid payment signature")
  }

  return { success: true, paymentId }
}
