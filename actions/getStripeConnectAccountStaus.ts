"use server"
import { stripe } from "@/lib/stripe"

export type AccountStatus = {
    isActive: boolean;
    requiresInformation: boolean;
    requirements: {
        currently_due: string[];
        eventually_due: string[];
        past_due: string[];
    };
    chargesEnabled: boolean;
    payoutEnabled: boolean;
};



export async function getStriptConnectAccountStatus(
    stripeAccountId:string
): Promise<AccountStatus>{
    if(!stripeAccountId){
        throw new Error("No Stripe Account ID Provided")
    }
    try{
        const account = await stripe.accounts.retrieve(stripeAccountId)
        return {
            isActive:account.details_submitted && 
            !account.requirements?.currently_due?.length,
            requiresInformation:!!(
                account.requirements?.currently_due?.length ||
                account.requirements?.eventually_due?.length ||
                account.requirements?.past_due?.length
            ),
            requirements:{
                currently_due:account.requirements?.currently_due || [],
                eventually_due:account.requirements?.eventually_due || [],
                past_due:account.requirements?.past_due || []
            },
            chargesEnabled:account.charges_enabled,
            payoutEnabled:account.payouts_enabled,
        };
    }
    catch(error){
        console.error("Error fetching stript connect account status",error);
        throw new Error("Failed to fatch Stripe Connect Account status")
    }
}