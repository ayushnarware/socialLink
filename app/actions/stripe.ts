"use server"

import { stripe } from "@/lib/stripe"
import { getProductById } from "@/lib/products"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"

export async function startCheckoutSession(productId: string) {
  const product = getProductById(productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  const user = await getCurrentUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  // Create subscription checkout session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: {
            interval: product.interval,
          },
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
    metadata: {
      userId: user._id!.toString(),
      planId: productId,
    },
  })

  return session.client_secret
}

export async function cancelSubscription(subscriptionId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  await stripe.subscriptions.cancel(subscriptionId)
  
  const db = await getDatabase()
  await db.collection("users").updateOne(
    { _id: user._id },
    { 
      $set: { 
        plan: "free",
        planExpiry: null,
        updatedAt: new Date()
      } 
    }
  )

  return { success: true }
}
