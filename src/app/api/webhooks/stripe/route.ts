import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { paymentId, type, propertyId, visitId } = (session.metadata ?? {}) as Record<
      string,
      string
    >;

    if (!paymentId) return NextResponse.json({ received: true });

    const stripePaymentId =
      typeof session.subscription === "string"
        ? session.subscription
        : typeof session.payment_intent === "string"
          ? session.payment_intent
          : null;

    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "paid", stripePaymentId: stripePaymentId ?? undefined },
    });

    if (type === "featured" && propertyId) {
      await prisma.property.update({
        where: { id: propertyId },
        data: { isFeatured: true },
      });
    }

    if (type === "subscription") {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        select: { userId: true },
      });
      if (payment) {
        await prisma.user.update({
          where: { id: payment.userId },
          data: { isPro: true },
        });
      }
    }

    if (type === "visit_deposit" && visitId) {
      await prisma.visit.update({
        where: { id: visitId },
        data: { status: "confirmed" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
