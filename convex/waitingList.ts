import { internalMutation,mutation,query } from "./_generated/server";
import {v} from "convex/values"
import { DURATIONS, TICKET_STATUS, WAITING_LIST_STATUS } from "./constants";
import { internal } from "./_generated/api";

export const getQueuePosition = query({
  args:{
    eventId:v.id("events"),
    userId:v.string(),
  },

  handler:async (ctx,{eventId,userId})=>{
     const entry = await ctx.db
     .query("waitingList")
     .withIndex("by_user_event",(q)=>q.eq("userId",userId).eq("eventId",eventId)
    )
    .filter((q)=>
        q.neq(q.field("status"),WAITING_LIST_STATUS.EXPIRED)) 
    .first();
    
    if(!entry) return null
    
    // get total number of people ahead in line 
    const peopelAhead = await ctx.db.query("waitingList")
    .withIndex("by_event_status", (q)=>q.eq("eventId",eventId))
    .filter((q)=>
        q.and(q.lt(q.field("_creationTime"),entry._creationTime),q.or(q.eq(q.field("status"),WAITING_LIST_STATUS.WAITING),q.eq(q.field("status"),WAITING_LIST_STATUS.OFFERED)
            )
        )
    )
    .collect()
    .then((entries)=>entries.length);
    return{
        ...entry,
        position:peopelAhead + 1
    }
}
})

export const releaseTicket = mutation({
    args:{
        eventId:v.id("events"),
        waitingListId:v.id("waitingList")
    },
    handler:async(ctx,{eventId,waitingListId})=>{
        const entry = await ctx.db.get(waitingListId);

        if(!entry || entry.status !== WAITING_LIST_STATUS.OFFERED){
            throw new Error("No valid ticket offer found")
        }
        //Mark the entry as expired
        await ctx.db.patch(waitingListId,{
            status:WAITING_LIST_STATUS.EXPIRED
        })
        //TODO: Process queue to offer ticket to next person
        await processQueue(ctx,{eventId})
    }
    
})

export const expireOffer = internalMutation({
  args:{
    waitingListId:v.id("waitingList"),
    eventId:v.id("events")
  },
  handler:async(ctx,{waitingListId,eventId}) =>{
    const offer = await ctx.db.get(waitingListId);
    // if offer is not found or is not in offered_status do nothing

    if(!offer || offer.status !== WAITING_LIST_STATUS.OFFERED) return;

    await ctx.db.patch(waitingListId,{
        status:WAITING_LIST_STATUS.EXPIRED
    })

    await processQueue(ctx,{eventId})
  }
})


export const processQueue = mutation({
    args:{
        eventId:v.id("events"),
    },
    handler:async(ctx,{eventId})=>{
        const event = await ctx.db.get(eventId);
        if(!event) throw new Error("Event not found")
       
        const {availableSpots} = await ctx.db
        .query("events")
        .filter((q)=>q.eq(q.field("_id"),eventId))
        .first()
        .then(async(event)=>{
            if(!event) throw new Error("Event not Found")
        
         const purchasedCount = await ctx.db
        .query("Tickets")
        .withIndex("by_event",(q)=>q.eq("eventId", eventId))
        .collect()
        .then(
            (tickets)=>tickets.filter((t)=>t.status === TICKET_STATUS.VALIID ||
        t.status === TICKET_STATUS.USED).length
        )
        const now = Date.now()
        const activeOffers = await ctx.db
            .query("waitingList")
            .withIndex("by_event_status",(q)=>q.eq("eventId",eventId).eq("status",WAITING_LIST_STATUS.OFFERED))
            .collect()
            .then(
                (entries)=>entries.filter((e)=>(e.offerExpiresAt ?? 0) > now).length
            )
        return {
            availableSpots:event.totalTickets - (purchasedCount + activeOffers),
        }
    });
    if(availableSpots <= 0) return;
        const waitinngUsers = await ctx.db
        .query("waitingList")
        .withIndex("by_event_status",(q)=>q.eq("eventId",eventId).eq("status",WAITING_LIST_STATUS.WAITING)
    )
    .order("asc")
    .take(availableSpots);
    const now = Date.now();
    for(const user of waitinngUsers){
        await ctx.db.patch(user._id,{
            status:WAITING_LIST_STATUS.OFFERED,
            offerExpiresAt:now + DURATIONS.TICKET_OFFER 
        });
        await ctx.scheduler.runAfter(
            DURATIONS.TICKET_OFFER,
            internal.waitingList.expireOffer,{waitingListId:user._id,eventId


            }
        )
    }
}
});

