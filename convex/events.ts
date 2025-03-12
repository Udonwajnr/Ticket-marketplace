import {query ,mutation, internalMutation} from "./_generated/server"
import { ConvexError,v } from "convex/values"
import { DURATIONS, WAITING_LIST_STATUS } from "./constants";
import { TICKET_STATUS } from "./constants";
import { internal } from "./_generated/api";

export const get = query({
    args:{},
    handler:async(ctx)=>{
        return await ctx.db.query("events").filter((q)=>q.eq(q.field("is_cancelled"),undefined))
        .collect();
    }

})

export const getById = query({
    args:{eventId:v.id("events")},
    handler:async(ctx,{eventId})=>{
        return await ctx.db.get(eventId)
    },
})

export const getEventAvailability = query({
    args:{eventId:v.id("events")},
    handler:async(ctx,{eventId})=>{
        const event = await ctx.db.get(eventId);
        if(!event) throw new Error("Event No Found")

        // Count total Purchased tickets
        
        const purchaseCount = await ctx.db
        .query("Tickets")
        .withIndex("by_event", (q)=>q.eq("eventId",eventId))
        .collect()
        .then(
            (tickets)=>tickets.filter((t)=>t.status === TICKET_STATUS.VALID|| t.status=== TICKET_STATUS.USED).length
        )

        const now  = Date.now()
        const activeOffers = await ctx.db
        .query("waitingList")
        .withIndex("by_event_status",(q)=>q.eq("eventId",eventId).eq("status",WAITING_LIST_STATUS.OFFERED))
        .collect()
        .then(
            (entries)=>entries.filter((e)=>(e.offerExpiresAt??0)>now).length
        )

        const totalReserved = purchaseCount + activeOffers;
        return {
            isSoldOut:totalReserved >= event.totalTickets,
            totalTickets:event.totalTickets,
            purchaseCount,
            activeOffers,
            remianingTickets:Math.max(0,event.totalTickets - totalReserved)
        }
    }
    // Cunt current valid offers
})

export const checkAvailablility = query({
    args:{eventId:v.id("events")},
    handler:async (ctx,{eventId})=>{
        const event = await  ctx.db.get(eventId)
        if(!event) throw new Error("Event now Found");

        //Count total purchased tckets
        const purchasedCount = await ctx.db
        .query("Tickets")
        .withIndex("by_event",(q)=>q.eq("eventId",eventId))
        .collect()
        .then((tickets)=>tickets.filter((t)=>t.status === TICKET_STATUS.VALID ||t.status === TICKET_STATUS.USED).length)
        
        const now = Date.now();
        const activeOffers = await ctx.db.query("waitingList")
        .withIndex("by_event_status",(q)=>q.eq("eventId",eventId).eq("status",WAITING_LIST_STATUS.OFFERED))
        .collect()
        .then((entries)=> entries.filter((e)=>(e.offerExpiresAt ?? 0)>now).length)

        const availableSpots = event.totalTickets - (purchasedCount + activeOffers);

        return {
            availabe:availableSpots > 0,
            availableSpots,
            totalTickets:event.totalTickets,
            purchasedCount,
            activeOffers
        }
    }
})



export const joinWaitingList=mutation({
    args:{eventId:v.id("events"), userId:v.string()},
    handler:async(ctx, {eventId,userId}) =>{
        // const status = await rateLimiter.limit(ctx,"queueJoin",{key:userId})
        // if(!status.ok){
        //     throw new ConvexError(
        //         `You've joined the waiting List too many times. Please wiat ${Math.ceil(
        //             status.retryAfter / (60*1000)
        //         )} minutes before trying again`
        //     )
        // }
        const existingEnty = await ctx.db
        .query("waitingList")
        .withIndex("by_user_event",(q)=>q.eq("userId", userId).eq("eventId",eventId)
    ).filter((q)=>q.neq(q.field("status"),WAITING_LIST_STATUS.EXPIRED))
     .first();
    
     if(existingEnty){
        throw new Error("Already in waiting list for this event")
     }

     const event = await ctx.db.get(eventId);
     if(!event) throw new Error("Event not found")

    const {availabe} = await checkAvailablility(ctx,{eventId});
    const now = Date.now()

    if(availabe){
        // if tickets are available, create an offer entry
        const waitingListId = await ctx.db.insert("waitingList",{
            eventId,
            userId,
            status:WAITING_LIST_STATUS.OFFERED,
            offerExpiresAt:now + DURATIONS.TICKET_OFFER
        });

        await ctx.scheduler.runAfter(
            DURATIONS.TICKET_OFFER,
            internal.waitingList.expireOffer,
            {
                waitingListId,eventId
            }

        )
    }else{
        await ctx.db.insert("waitingList",{
            eventId,
            userId,
            status:WAITING_LIST_STATUS.WAITING
        })
    }
    return{
        success:true,
        status:availabe?WAITING_LIST_STATUS.OFFERED:WAITING_LIST_STATUS.WAITING,
        message:availabe?`Ticket Offered - you ${DURATIONS.TICKET_OFFER} minutes to purchase`
        :"Added to waiting List - you'll be notified when a tciket becomes available",
    }
    }
})

