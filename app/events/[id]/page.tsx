"use client"
import Spinner from "@/components/Spinner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrl } from "@/lib/utils";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React from "react";
import Image from "next/image";
import { Calendar, CalendarDays, MapPin, Ticket, User } from "lucide-react";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import JoinQueue from "@/components/JoinQueue"

function EventPage(){
    const {user} = useUser();
    const params = useParams();
    const event = useQuery(api.events.getById,{
        eventId:params.id as Id<"events">,
    });
    const availability = useQuery(api.events.getEventAvailability,{eventId:params.id as Id<"events">})
    const imageUrl = useStorageUrl(event?.imageStorageId);

    if(!event || !availability){
        return(
            <div className="min-h-screen flex items-center justify-center">
                <Spinner/>
            </div>
        )
    }

    
    return( 
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Event Hero Image */}
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
              <Image src={imageUrl || "/placeholder.svg"} alt={event.name} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">{event.name}</h1>
                <div className="flex items-center text-white/90 space-x-4">
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-8">
              {/* Left Column - Event Details (spans 2 columns on large screens) */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Event</h2>
                  <p className="text-lg text-gray-600">{event.description}</p>
                </div>
  
                {/* Event Details Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-2">
                      <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Date & Time</span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {new Date(event.eventDate).toLocaleDateString()} at{" "}
                      {new Date(event.eventDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
  
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="text-gray-900 font-medium">{event.location}</p>
                  </div>
  
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-2">
                      <Ticket className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Price</span>
                    </div>
                    <p className="text-gray-900 font-medium">${event.price.toFixed(2)}</p>
                  </div>
  
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-2">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Availability</span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      <span className="font-bold">{availability.totalTickets - availability.purchaseCount}</span> of{" "}
                      <span>{availability.totalTickets}</span> tickets left
                    </p>
                  </div>
                </div>
  
                {/* Additional Information */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Important Information</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Please arrive 30 minutes before the event starts
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Tickets are non-refundable
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Age restriction: 10+
                    </li>
                  </ul>
                </div>
              </div>
  
              {/* Right Column - Purchase Ticket */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Your Tickets</h3>
  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <span className="text-gray-600">Price per ticket</span>
                      <span className="font-semibold">${event.price.toFixed(2)}</span>
                    </div>
  
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <span className="text-gray-600">Availability</span>
                      <span className="font-semibold text-green-600">
                        {availability.totalTickets - availability.purchaseCount} left
                      </span>
                    </div>
                  </div>
  
                  <EventCard eventId={params.id as Id<"events">} />
  
                  {user ? (
                    <JoinQueue
                     eventId={params.id as Id<"events">}
                     userId={user.id}
                     />
                  ) : (
                    <SignInButton>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                        Sign in to buy tickets
                      </Button>
                    </SignInButton>
                  )}
  
                  <p className="text-xs text-gray-500 text-center mt-4">
                    By purchasing tickets, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default EventPage