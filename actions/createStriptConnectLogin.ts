"use server"
import { stripe } from "@/lib/stripe"

export async function createStriptConnectLoginLink(stripeAccountId:string){
if(!stripeAccountId){
    throw new Error("No Stripe Id provided")
}
    try{
        const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
        return loginLink.url;
    }
    catch(error){
        console.error("Error creating StriptCOnnect login link:",error)
        throw new Error("failed to create Stript Connect login Link")
    }

}