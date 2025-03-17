"use client"
import { useState } from "react"
import { useQuery } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { api } from "@/convex/_generated/api"
import SellerEventCard from "./SellerEventCard"
import { CalendarDays, Clock, ArrowUpDown, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const SellerEventList = () => {
  const { user } = useUser()
  const events = useQuery(api.events.getSellerEvents, { userId: user?.id ?? "" })
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Loading state with skeleton
  if (!events) {
    return (
      <div className="mx-auto space-y-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Events</h1>
          <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Sort events by date
  const sortEvents = (events) => {
    return [...events].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.eventDate - b.eventDate
      } else {
        return b.eventDate - a.eventDate
      }
    })
  }

  const upcomingEvents = sortEvents(events.filter((e) => e.eventDate > Date.now() && !e.is_cancelled))
  const cancelledEvents = events.filter((e) => e.is_cancelled)
  const pastEvents = sortEvents(events.filter((e) => e.eventDate <= Date.now() && !e.is_cancelled))

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div className="mx-auto space-y-12 max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Create Event Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Events</h1>
          <p className="text-gray-500 mt-1">Manage and track all your events in one place</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={toggleSortOrder} className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Sort by Date {sortOrder === "asc" ? "(Oldest first)" : "(Newest first)"}
          </Button>
          <Link href="/seller/events/create">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalendarDays className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Past Events</p>
              <p className="text-2xl font-bold text-gray-900">{pastEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <div className="w-6 h-6 flex items-center justify-center text-green-600 font-bold">$</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${events.reduce((sum, event) => sum + event.metrics.revenue, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <div className="w-6 h-6 flex items-center justify-center text-purple-600 font-bold">#</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tickets Sold</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.reduce((sum, event) => sum + event.metrics.soldTickets, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {upcomingEvents.map((event) => (
              <SellerEventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
            <p className="text-gray-500 mb-6">Create your first event to get started</p>
            <Link href="/seller/events/create">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Create Event
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Cancelled Events Section */}
      {cancelledEvents.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Cancelled Events</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {cancelledEvents.map((event) => (
              <SellerEventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-6 bg-gray-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Past Events</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {pastEvents.map((event) => (
              <SellerEventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* No Events State */}
      {events.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">You haven't created any events yet</h3>
          <p className="text-gray-500 mb-6">Start by creating your first event</p>
          <Link href="/seller/events/create">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Create Your First Event
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default SellerEventList

