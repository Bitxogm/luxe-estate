"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

type CheckoutResult = { url: string } | { error: string };

export async function createFeaturedCheckoutAction(propertyId: string): Promise<CheckoutResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { userId: true, title: true },
  });

  if (!property) return { error: "Property not found" };
  if (property.userId !== session.user.id) return { error: "Unauthorized" };

  const payment = await prisma.payment.create({
    data: { userId: session.user.id, propertyId, type: "featured", amount: 999 },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: `Featured Listing — ${property.title}` },
          unit_amount: 999,
        },
        quantity: 1,
      },
    ],
    success_url: `${BASE_URL}/dashboard?featured=success`,
    cancel_url: `${BASE_URL}/dashboard`,
    metadata: { paymentId: payment.id, type: "featured", propertyId },
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  return { url: checkoutSession.url! };
}

export async function createVisitDepositCheckoutAction(visitId: string): Promise<CheckoutResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const visit = await prisma.visit.findUnique({
    where: { id: visitId },
    select: { userId: true, propertyId: true },
  });

  if (!visit) return { error: "Visit not found" };
  if (visit.userId !== session.user.id) return { error: "Unauthorized" };

  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      propertyId: visit.propertyId,
      type: "visit_deposit",
      amount: 5000,
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: "Visit Deposit" },
          unit_amount: 5000,
        },
        quantity: 1,
      },
    ],
    success_url: `${BASE_URL}/profile?tab=visits&deposit=success`,
    cancel_url: `${BASE_URL}/profile?tab=visits`,
    metadata: { paymentId: payment.id, type: "visit_deposit", visitId },
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  return { url: checkoutSession.url! };
}

export async function createSubscriptionCheckoutAction(): Promise<CheckoutResult> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  const payment = await prisma.payment.create({
    data: { userId: session.user.id, type: "subscription", amount: 2999 },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: "Luxe Estate Pro" },
          unit_amount: 2999,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    success_url: `${BASE_URL}/dashboard?pro=success`,
    cancel_url: `${BASE_URL}/dashboard`,
    metadata: { paymentId: payment.id, type: "subscription" },
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  return { url: checkoutSession.url! };
}
