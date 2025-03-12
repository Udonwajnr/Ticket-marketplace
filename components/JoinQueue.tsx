"use client"
import React from 'react'
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { getUserTicketForEvent } from '@/convex/tickets';
import { ConvexError } from 'convex/values';
import Spinner from './Spinner';
import { WAITING_LIST_STATUS } from '@/convex/constants';
import { Clock, OctagonXIcon } from 'lucide-react';

const JoinQueue = ({eventId,userId}:{eventId:Id<"events">;userId:string}) => {
  const joinWaitingList = useMutation(api.events.joinWaitingList);
  const queuePositon = useQuery(api.waitingList.getQueuePosition,{
    eventId,userId
  });
  const userTicket = useQuery(api.tickets.getUserTicketForEvent,{
    eventId,userId
  });

  const availability = useQuery(api.events.getEventAvailability,{eventId});
  const event = useQuery(api.events.getById,{eventId})

  const isEventOwner = userId === event?.userId

  const handleJoinQueue = async () =>{
    try{
      const result = await joinWaitingList({eventId,userId});
      if(result.success){
        console.log("Successfully Joined waiting List")
      }
    }catch(error){
      if(error instanceof ConvexError && error.message.includes("joined the waiting list to many times")){
        toast('Slow down there')
      }
      else{
        console.error("Error joing waiting list:",error)
        toast("Uh oh! Something went wrong")
      }
    }
  }

  if(queuePositon === undefined || availability === undefined || !event){
    return <Spinner/>;
  }

  if(userTicket){
    return null
  }

  const parseYYYYMMDDToTimestamp = (yyyymmdd: number): number => {
    const year = Math.floor(yyyymmdd / 10000);
    const month = Math.floor((yyyymmdd % 10000) / 100) - 1; // JavaScript months are 0-based
    const day = yyyymmdd % 100;
    
    return new Date(year, month, day).getTime(); // Convert to timestamp in milliseconds
};

// Correctly parse event date
const eventTimestamp = parseYYYYMMDDToTimestamp(event.eventDate);
const isPastEvent = eventTimestamp < Date.now();
  return (
    <div>
      {(
          !queuePositon || queuePositon.status === WAITING_LIST_STATUS.EXPIRED || 
          (queuePositon.status === WAITING_LIST_STATUS.OFFERED 
            &&
          queuePositon.offerExpiresAt &&
          queuePositon.offerExpiresAt  <= Date.now())) && (
            <>
              {
                isEventOwner
                ?
                <div className='flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg'>
                  <OctagonXIcon className='h-5 w-5'/>
                  <span>You cannot buy a ticket for your own event</span>
                </div>
                :
                  isPastEvent ? (
                    <div className="flex flex-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
                        <Clock className='w-5 h-5'/>
                        <span>Event has Ended</span>
                    </div>
                  )
                  :
                  availability.purchaseCount >= availability?.totalTickets ?(
                    <div className="text-center p-4">
                      <div className="text-lg font-semibold text-red-600">
                        Sorry,this event is sold out
                      </div>
                    </div>
                ):
                <button onClick={handleJoinQueue}
                  disabled={isPastEvent || isEventOwner} 
                  className='w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed'               
                >

                Buy Ticket
                </button>
              }
            </>
          )
      }
    </div>
  )
}

export default JoinQueue