"use client"
import type { Doc } from "@/convex/_generated/dataModel"
import type { Metrics } from "@/convex/events"
import { useStorageUrl } from "@/lib/utils"
import Image from "next/image"
import { Edit, Ticket, Ban, Banknote, InfoIcon, CalendarDays, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import CancelEventButton from "./CancelEventButton"

function SellerEventCard({ event }: { event: Doc<"events"> & { metrics: Metrics } }) {
  const imageUrl = useStorageUrl(event.imageStorageId)
  const isPastEvent = event.eventDate < Date.now()

  return (
    <div
      className={`bg-white rounded-xl shadow-md border ${event.is_cancelled ? "border-red-200 bg-red-50/30" : "border-gray-200"} 
            overflow-hidden transition-all duration-300 hover:shadow-lg`}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Event Image with Status Badge */}
          {imageUrl && (
            <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden group">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={event.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Status Badge */}
              <div
                className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-medium 
                                ${
                                  event.is_cancelled
                                    ? "bg-red-500 text-white"
                                    : isPastEvent
                                      ? "bg-gray-700 text-white"
                                      : "bg-green-500 text-white"
                                }`}
              >
                {event.is_cancelled ? "Cancelled" : isPastEvent ? "Ended" : "Active"}
              </div>
            </div>
          )}

          {/* Event Details */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {event.name}
                </h1>

                {/* Date and Location */}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      {new Date(event.eventDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{event.location || "No location specified"}</span>
                  </div>
                </div>

                <p className="mt-2 text-gray-600 line-clamp-2">{event.description}</p>

                {event.is_cancelled && (
                  <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    <Ban className="w-4 h-4" />
                    <span className="text-sm font-medium">Event Cancelled & Refunded</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                {!isPastEvent && !event.is_cancelled && (
                  <>
                    <Link
                      href={`/seller/events/${event._id}/edit`}
                      className="shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <CancelEventButton eventId={event._id} />
                  </>
                )}
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">
                    {event.is_cancelled ? "Tickets Refunded" : "Tickets Sold"}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {event.is_cancelled ? (
                    <>
                      {event.metrics.refundedTickets}
                      <span className="text-sm text-gray-500 font-normal"> refunded</span>
                    </>
                  ) : (
                    <>
                      {event.metrics.soldTickets}
                      <span className="text-sm text-gray-500 font-normal">/{event.totalTickets}</span>
                    </>
                  )}
                </p>
                {!event.is_cancelled && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${(event.metrics.soldTickets / event.totalTickets) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-100 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{event.is_cancelled ? "Amount Refunded" : "Revenue"}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {event.is_cancelled
                    ? (event.metrics.refundedTickets * event.price).toFixed(2)
                    : event.metrics.revenue.toFixed(2)}
                </p>
                {!event.is_cancelled && event.metrics.soldTickets > 0 && (
                  <p className="text-sm text-green-600 mt-1">${event.price.toFixed(2)} per ticket</p>
                )}
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-100 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-2 text-purple-700 mb-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Event Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(event.eventDate).toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(event.eventDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-100 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-2 text-amber-700 mb-2">
                  <div className="p-1.5 bg-amber-100 rounded-lg">
                    <InfoIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Status Details</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      event.is_cancelled ? "bg-red-500" : isPastEvent ? "bg-gray-500" : "bg-green-500"
                    }`}
                  ></span>
                  <p className="text-lg font-semibold text-gray-900">
                    {event.is_cancelled ? "Cancelled" : isPastEvent ? "Ended" : "Active"}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {event.is_cancelled
                    ? "All tickets refunded"
                    : isPastEvent
                      ? "Event has concluded"
                      : "Event is upcoming"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerEventCard
