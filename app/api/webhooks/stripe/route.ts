import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update user with subscription info
        if (session.subscription && session.customer) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          
          // Get period end - fallback to 30 days from now if not available
          const periodEnd = subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          await prisma.user.update({
            where: { stripeCustomerId: session.customer as string },
            data: {
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: periodEnd,
              isPremium: true,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get period end from subscription or from items
        let periodEndTimestamp = subscription.current_period_end;
        if (!periodEndTimestamp && subscription.items?.data?.[0]) {
          periodEndTimestamp = (subscription.items.data[0] as any).current_period_end;
        }
        
        const periodEnd = periodEndTimestamp 
          ? new Date(periodEndTimestamp * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await prisma.user.update({
          where: { stripeCustomerId: subscription.customer as string },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: periodEnd,
            isPremium: subscription.status === "active",
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        await prisma.user.update({
          where: { stripeCustomerId: subscription.customer as string },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            isPremium: false,
          },
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}