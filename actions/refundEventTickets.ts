"use server"
import { stripe } from "@/lib/stripe"
import { getConvexClient } from "@/lib/convex"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"


export async function refundEventTickets(eventId:Id<"events">){
    const convex = getConvexClient()

    const event = await convex.query(api.events.getById,{eventId})
    if(!event) throw new Error("Error not found");

    // get event owner's Stripe Connect ID
    const stripeConnectId = await convex.query(
        api.users.getUserStriptConnectId,{
        userId:event.userId
    });

    if(!stripeConnectId){
        throw new Error("Stripe Connect ID not found")
    }

    // get All valid ticket for this event
    const tickets = await convex.query(api.tickets.getValidTicketsForEvent,{
        eventId
    })

    const results = await Promise.allSettled(
        tickets.map(async(ticket)=>{
            console.log(ticket)
            try{
                if(!ticket.paymentIntentId){
                    throw new Error("Payment Information not found")
                }

                await stripe.refunds.create({
                    payment_intent:ticket.paymentIntentId,
                    reason:"requested_by_customer"
                },{
                    stripeAccount:stripeConnectId
                });

                await convex.mutation(api.tickets.updateTicketStatus,{
                    ticketId:ticket._id,
                    status:"refunded"
                })
                return{
                    success:true,ticketId:ticket._id
                }
            }catch(err){
               return {
                    success:false,ticketId:ticket._id,err
                }
            }
        })
    )

    const allSuccesful = results.every(
        (result)=>result.status === "fulfilled" && result.value.success
    )

    if(!allSuccesful){
        throw new Error(
            "Some refunds failed. Please check the logs and try again"
        )
    }

    await convex.mutation(api.events.cancelEvent,{eventId});

    return {success:true}
}