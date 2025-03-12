"use server"

import { api } from "@/convex/_generated/api"
import { auth } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"

if(!process.env.NEXT_PUBLIC_CONVEX_URL){
    throw new Error("NEXT_PUBLIC_CONVEX is not set");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function getUserStriptConnectAccount(){
    const {userId} = await auth()

    if(!userId){
        throw new Error("Nor Authenticated")
    }

    const stripeConnectedId = await convex
    .query(
        api.users.getUserStriptConnectId,
        {
            userId
        }
    )

    return {
        stripeConnectedId:stripeConnectedId || null,
        
    }
}