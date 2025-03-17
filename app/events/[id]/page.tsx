"use client"
import Spinner from "@/components/Spinner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useStorageUrl } from "@/lib/utils"
import { SignInButton, useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { CalendarDays, MapPin, Ticket, User, Clock } from "lucide-react"
import EventCard from "@/components/EventCard"
import { Button } from "@/components/ui/button"
import JoinQueue from "@/components/JoinQueue"

function EventPage() {
  const { user } = useUser()
  const params = useParams()
  const event = useQuery(api.events.getById, {
    eventId: params.id as Id<"events">,
  })
  const availability = useQuery(api.events.getEventAvailability, { eventId: params.id as Id<"events"> })
  const imageUrl = useStorageUrl(event?.imageStorageId)

  if (!event || !availability) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          {/* Event Hero Image */}
          <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px]">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={event.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 sm:p-10">
              <div className="inline-block px-3 py-1 bg-blue-600/90 text-white text-sm font-medium rounded-full mb-4 backdrop-blur-sm">
                Featured Event
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-md">
                {event.name}
              </h1>
              <div className="flex flex-wrap items-center text-white/90 space-x-4 space-y-2 sm:space-y-0">
                <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <CalendarDays className="w-4 h-4 mr-2 text-blue-300" />
                  <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4 mr-2 text-blue-300" />
                  <span>
                    {new Date(event.eventDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <MapPin className="w-4 h-4 mr-2 text-blue-300" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-10">
            {/* Left Column - Event Details (spans 2 columns on large screens) */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-10 h-1 bg-blue-600 rounded-full mr-3"></span>
                  About This Event
                </h2>
                <p className="text-lg leading-relaxed text-gray-700">{event.description}</p>
              </div>

              {/* Event Details Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-100 hover:bg-blue-50/30">
                  <div className="flex items-center text-gray-700 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <CalendarDays className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Date & Time</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {new Date(event.eventDate).toLocaleDateString()} at{" "}
                    {new Date(event.eventDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-100 hover:bg-blue-50/30">
                  <div className="flex items-center text-gray-700 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-gray-900 font-medium">{event.location}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-100 hover:bg-blue-50/30">
                  <div className="flex items-center text-gray-700 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Ticket className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Price</span>
                  </div>
                  <p className="text-gray-900 font-medium text-lg">${event.price.toFixed(2)}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-100 hover:bg-blue-50/30">
                  <div className="flex items-center text-gray-700 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Availability</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    <span className="font-bold text-lg">{availability.totalTickets - availability.purchaseCount}</span>{" "}
                    of <span>{availability.totalTickets}</span> tickets left
                  </p>
                  {availability.totalTickets - availability.purchaseCount < 10 && (
                    <p className="text-red-500 text-sm mt-1 font-medium">Selling fast! Don't miss out</p>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-7 shadow-sm">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Important Information
                </h3>
                <ul className="space-y-3 text-blue-700">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-200 rounded-full text-blue-700 mr-3 flex-shrink-0">
                      •
                    </span>
                    <span>Please arrive 30 minutes before the event starts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-200 rounded-full text-blue-700 mr-3 flex-shrink-0">
                      •
                    </span>
                    <span>Tickets are non-refundable</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-200 rounded-full text-blue-700 mr-3 flex-shrink-0">
                      •
                    </span>
                    <span>Age restriction: 10+</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Purchase Ticket */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6 bg-white p-7 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b border-gray-100">
                  Get Your Tickets
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Price per ticket</span>
                    <span className="font-semibold text-lg">${event.price.toFixed(2)}</span>
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
                  <div className="mt-2 transform transition-transform duration-200 hover:scale-[1.02]">
                    <JoinQueue eventId={params.id as Id<"events">} userId={user.id} />
                  </div>
                ) : (
                  <SignInButton>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]">
                      Sign in to buy tickets
                    </Button>
                  </SignInButton>
                )}

                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    By purchasing tickets, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventPage

