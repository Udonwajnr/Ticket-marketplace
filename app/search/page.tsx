"use client"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { useSearchParams, useRouter } from "next/navigation"
import EventCard from "@/components/EventCard"
import { SearchIcon, Calendar, Clock, ArrowLeft, Filter } from "lucide-react"
import Spinner from "@/components/Spinner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, type FormEvent } from "react"

interface SearchEvent {
  _id: string
  eventDate: number
  name: string
  description: string
  location: string
  price: number
  [key: string]: any
}

const Search = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchInput, setSearchInput] = useState(query)
  const searchResults = useQuery(api.events.search, { searchTerm: query })

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  if (!searchResults) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <div className="relative w-16 h-16 mb-4">
          <Spinner />
          <SearchIcon className="absolute inset-0 m-auto w-6 h-6 text-primary opacity-30" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Searching...</h2>
        <p className="text-gray-600">Looking for events matching "{query}"</p>
      </div>
    )
  }

  const upcomingEvents = searchResults
    .filter((event: SearchEvent) => event.eventDate > Date.now())
    .sort((a: SearchEvent, b: SearchEvent) => a.eventDate - b.eventDate)

  const pastEvents = searchResults
    .filter((event: SearchEvent) => event.eventDate <= Date.now())
    .sort((a: SearchEvent, b: SearchEvent) => b.eventDate - a.eventDate)

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button and search form */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Home</span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
              <Input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Refine your search..."
                className="w-full pl-10 pr-16 py-2 border-gray-300 focus:border-primary focus:ring-primary"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-0 inset-y-0 px-3 text-primary hover:text-primary/80 hover:bg-transparent"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Search Result Header */}
        <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="p-2 bg-primary/10 rounded-full">
            <SearchIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Results for <span className="text-primary">&quot;{query}&quot;</span>
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Found <span className="font-semibold text-gray-800">{searchResults.length}</span> events
            </p>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>

        {/* No Results State */}
        {searchResults.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              We couldn't find any events matching "{query}". Try adjusting your search terms or browse all events.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={() => setSearchInput("")}>
                Clear Search
              </Button>
              <Link href="/">
                <Button>Browse All Events</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            </div>
            <div className="h-1 w-20 bg-primary mb-6 rounded-full"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} eventId={event._id} />
              ))}
            </div>
          </div>
        )}

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-900">Past Events</h2>
            </div>
            <div className="h-1 w-20 bg-gray-300 mb-6 rounded-full"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event._id} eventId={event._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search

