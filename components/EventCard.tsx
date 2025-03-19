"use client"
import type { Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { useStorageUrl } from "@/lib/utils"
import Image from "next/image"
import {
  CalendarDays,
  Check,
  CircleArrowRight,
  LoaderCircle,
  MapPin,
  PencilIcon,
  StarIcon,
  Ticket,
  XCircle,
} from "lucide-react"
import PurchaseTicket from "./PurchaseTicket"

const EventCard = ({ eventId }: { eventId: Id<"events"> }) => {
  const { user } = useUser()
  const router = useRouter()
  const event = useQuery(api.events.getById, { eventId })
  const availability = useQuery(api.events.getEventAvailability, { eventId })

  const userTicket = useQuery(api.tickets.getUserTicketForEvent, { eventId, userId: user?.id ?? "" })

  const queuePositon = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  })

  const imageUrl = useStorageUrl(event?.imageStorageId)
  if (!event || !availability) {
    return null
  }

  // Check if the event date is a timestamp or YYYYMMDD format
  const isTimestamp = event.eventDate > 100000000000 // Timestamps are typically large numbers

  // Get the event timestamp based on the format
  const eventTimestamp = isTimestamp
    ? event.eventDate
    : (() => {
        // Parse YYYYMMDD format
        const dateStr = event.eventDate.toString()
        const year = Number.parseInt(dateStr.substring(0, 4))
        const month = Number.parseInt(dateStr.substring(4, 6)) - 1 // JS months are 0-based
        const day = Number.parseInt(dateStr.substring(6, 8))
        return new Date(year, month, day).getTime()
      })()

  const isPastEvent = eventTimestamp < Date.now()
  const isEventOwner = user?.id === event?.userId

  // Format date for display
  const formatEventDate = () => {
    const date = new Date(eventTimestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderQueuePosition = () => {
    if (!queuePositon || queuePositon.status !== "waiting") return null
    if (availability.purchaseCount >= availability.totalTickets) {
      return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all">
          <div className="flex items-center">
            <Ticket className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
            <span className="text-gray-600">Event is Sold Out</span>
          </div>
        </div>
      )
    }
    if (queuePositon.position === 2) {
      return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100 transition-all">
          <div className="flex items-center mb-2 sm:mb-0">
            <CircleArrowRight className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
            <span className="text-amber-700 font-medium">
              You&apos;re next in line! (Queue position:{""}
              {queuePositon.position})
            </span>
          </div>
          <div className="flex items-center">
            <LoaderCircle className="w-4 h-4 animate-spin text-amber-500 mr-1 flex-shrink-0" />
            <span className="text-amber-600 text-sm">Waiting for Tickets</span>
          </div>
        </div>
      )
    }
  }

  const renderTicketStatus = () => {
    if (!user) return null
    if (isEventOwner) {
      return (
        <div className="mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/seller/events/${eventId}/edit`)
            }}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <PencilIcon className="w-4 h-4" />
            Edit Event
          </button>
        </div>
      )
    }

    if (userTicket) {
      return (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100 transition-all">
          <div className="flex items-center mb-2 sm:mb-0">
            <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
            <span className="text-green-700 font-medium">You have a ticket!</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/tickets/${userTicket._id}`)
            }}
            className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full font-medium shadow-sm transition-all duration-200 flex items-center gap-1 hover:scale-[1.02] active:scale-[0.98]"
          >
            View Your ticket
          </button>
        </div>
      )
    }

    if (queuePositon) {
      return (
        <div className="mt-4">
          {queuePositon.status === "offered" && <PurchaseTicket eventId={eventId} />}
          {renderQueuePosition()}
          {queuePositon.status === "expired" && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-100 transition-all">
              <span className="text-red-700 font-medium flex items-center">
                <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                Offer expired
              </span>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div
      onClick={() => router.push(`/events/${eventId}`)}
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden relative group ${isPastEvent ? "opacity-80 hover:opacity-100" : ""}`}
    >
      {/* Event Image */}
      {imageUrl && (
        <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className={`p-5 sm:p-6 ${imageUrl ? "relative" : ""}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          {/* Event name and badge */}
          <div className="flex-1">
            <div className="flex flex-col items-start gap-2">
              {isEventOwner && (
                <span className="inline-flex items-center gap-1 bg-blue-600/90 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                  <StarIcon className="w-3 h-3" />
                  Your Event
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 line-clamp-2 capitalize">{event.name}</h2>
            </div>
            {isPastEvent && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mt-2">
                Past Event
              </span>
            )}
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2">
            <span
              className={`px-4 py-1.5 font-semibold rounded-full text-sm ${isPastEvent ? "bg-gray-50 text-gray-500" : "bg-green-50 text-green-700"}`}
            >
              ${event.price.toFixed(2)}
            </span>
            {availability.purchaseCount >= availability.totalTickets && (
              <span className="px-4 py-1.5 bg-red-50 text-red-700 font-semibold rounded-full text-sm">Sold Out</span>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-gray-500" />
            <span className="text-sm sm:text-base capitalize">{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <CalendarDays className="w-4 h-4 mr-2 flex-shrink-0 text-gray-500" />
            <span className="text-sm sm:text-base">
              {formatEventDate()} {isPastEvent && "(Ended)"}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Ticket className="w-4 h-4 mr-2 flex-shrink-0 text-gray-500" />
            <span className="text-sm sm:text-base">
              {availability.totalTickets - availability.purchaseCount}/{""}
              {availability.totalTickets} available
              {!isPastEvent && availability.activeOffers > 0 && (
                <span className="text-amber-600 text-sm ml-2">
                  ({availability.activeOffers} {availability.activeOffers === 1 ? "person" : "people"} trying to buy )
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Event Description */}
        <p className="mt-4 text-gray-600 text-sm line-clamp-2">{event.description}</p>

        {/* Event Actions */}
        <div onClick={(e) => e.stopPropagation()}>{!isPastEvent && renderTicketStatus()}</div>
      </div>
    </div>
  )
}

export default EventCard

