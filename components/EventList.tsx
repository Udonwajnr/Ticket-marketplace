'use client'

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Spinner from "./Spinner"
import { CalendarDays, Ticket } from "lucide-react"
import EventCard from "./EventCard"

function EventList(){
    const events = useQuery(api.events.get)
    // console.log(events)
    if(!events){
        return(
            <div className="min-h-[400px] flex items-center justify-center">
                <Spinner/>
            </div>
        )
    }

    const convertToTimestamp = (yyyymmdd: number): number => {
        const year = Math.floor(yyyymmdd / 10000);
        const month = Math.floor((yyyymmdd % 10000) / 100) - 1; // Months are 0-based in JS
        const day = yyyymmdd % 100;
    
        // Ensure the date is set at midnight UTC (00:00:00)
        const date = new Date(Date.UTC(year, month, day));
    
        return date.getTime(); // Convert to milliseconds since Unix Epoch
    };
    
    // Convert event dates to timestamps
    const upcomingEvents = events
        .filter((event) => event.eventDate > Date.now())
        .sort((a, b) => a.eventDate - b.eventDate);
    
    const pastEvent = events
        .filter((event) => event.eventDate <= Date.now())
        .sort((a, b) => b.eventDate - a.eventDate);
    
    return(
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">Upcoming Events</h1>
                    <p className="mt-2 text-gray-600">
                        Discover & ticket for amazing events
                    </p>
                </div>

                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                        <CalendarDays className="w-5 h-5"/>
                        <span className="font-medium">
                            {upcomingEvents.length} Upcoming Events
                        </span>
                    </div>
                </div>
            </div>

            {/* upcoming Event Grid */}
            {upcomingEvents.length > 0 ?(
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {upcomingEvents.map((event)=>{
                        return(
                            <EventCard key={event._id} eventId={event._id}/>
                        )
                    })}
                </div>
            ):(
                <div className="bg-gray-50 rounded-lg p-12 text-center mb-12">
                    <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
                    <h3 className="text-lg font-medium text-gray-900">
                        no upcoming events
                        <p className="text-gray-600">Check back later for new Events</p>
                    </h3>
                </div>
            )
        }

        {pastEvent.length > 0 && (
            <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvent.map((event)=>{

                    return(
                            <EventCard key={event._id} eventId={event._id}/>
                        )
                    })}
                </div>
            </>
        )}
         </div>
    )
}

export default EventList