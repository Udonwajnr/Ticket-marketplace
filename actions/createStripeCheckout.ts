"use server"
import { stripe } from "@/lib/stripe"
import {getConvexClient} from "@/lib/convex"
import { api } from "@/convex/_generated/api"
import baseUrl from "@/lib/baseUrl";
import { auth } from "@clerk/nextjs/server";
import { DURATIONS } from "@/convex/constants";
import { Id } from "@/convex/_generated/dataModel";
import { Currency } from "lucide-react";
import { time } from "console";

export type StriptCheckoutMetaData = {
    eventId:Id<"events">;
    userId:string;
    waitingListId:Id<"waitingList">;
};

export async function createStripeCheckoutSession({
    eventId
}:{eventId:Id<"events">;}){

const {userId} = await auth()
if(!userId) throw new Error("Not authenticated");

const convex = getConvexClient();

// Get Event details
const event = await convex.query(api.events.getById,{eventId});

    if(!event) throw new Error("Event not found");

    const queuePosition = await convex.query(api.waitingList.getQueuePosition,{
        eventId,userId
    })

    if(!queuePosition || queuePosition.status !== "offered"){
        throw new Error("No valid ticket offer found")
    }

    const stripeConnectedId = await convex.query(
        api.users.getUserStriptConnectId,
        {
            userId:event.userId
        }
    );
    if(!stripeConnectedId){
        throw new Error("Stript connect ID not Found for owner to the event")
    }

    if(!queuePosition.offerExpiresAt){
        return new Error("Ticket offer has not expiration Date")
    }
 
    const metadata:StriptCheckoutMetaData ={
        eventId,
        userId,
        waitingListId:queuePosition._id,

    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:[
            {
                price_date:{
                    currency:"usd",
                    product_data:{
                        name:event.name,
                        description:event.description
                    },
                    unit_amount:Math.round(event.price * 100)
                },
                quantity:1
            },
        ],
        // currcial part our part
        payment_intent_data:{
            application_fee_amount:Math.round(event.price * 100 * 0.01),//fee
        },
        expires_at:Math.floor(Date.now()/1000) + DURATIONS.TICKET_OFFER/1000,
        // (stripe checkout minimum expiration time)
        node:"payment",
        success_url:`${baseUrl}/tickets/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/event/${eventId}`,
        metadata,
    },
    {
        stripeAccount:stripeConnectedId //Stripe Connect Id fo thre event owner(Seller)
    }
)

    return {sessionId:session.id,sessionUrl:session.url}
}