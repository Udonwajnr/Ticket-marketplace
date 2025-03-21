"use server"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"

export async function createStriptConnectAccountLink(account:string){
    try{
        const headerList = await headers()
        const origin = headerList.get("origin") || ""

        const accountLink = await stripe.accountLinks.create({
            account,
            refresh_url:`${origin}/connect/refresh/${account}`,
            return_url:`${origin}/connect/return/${account}`,
            type:"account_onboarding"
        });
        return {url:accountLink.url}
    }
    catch(error){
        console.error(
            "An error occured when calling the Stripe API to create an account link",error
        );
        if(error instanceof Error){
            throw new Error(error.message)
        }
        throw new Error("An unknown error occured")
    }
}