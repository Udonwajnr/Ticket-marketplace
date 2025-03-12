"use server";
import { auth } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { stripe } from "@/lib/stripe";
if(!process.env.NEXT_PUBLIC_CONVEX_URL){
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not set")
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function createStriptConnectCustomer(){
    const {userId} = await auth();

    if(!userId){
        throw new Error("Not Authenticated")
    }

    const existingStripeConnectId = await convex.query(
        api.users.getUserStriptConnectId,{
            userId,
        }
    );

    if(existingStripeConnectId){
        return {account:existingStripeConnectId}
    }

    const account = await stripe.account.create({
        type:"express",
        capabilities:{
            card_payment:{requested:true},
            transfers:{requested:true}
        }
    })

    await convex.mutation(api.users.updateOrCreateUserStripeConnectId,{
        userId,
        stripeConnectId:account.id
    })

    return {account:account.id}
}

