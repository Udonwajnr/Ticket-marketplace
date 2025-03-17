"use client"
import React from 'react'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { useSearchParams } from 'next/navigation'
import EventCard from '@/components/EventCard'
import { Search as SearchIcon } from 'lucide-react'
import Spinner from '@/components/Spinner'

const Search = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const searchResults = useQuery(api.events.search, { searchTerm: query });

    if (!searchResults) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    const upcomingEvents = searchResults
        .filter((event) => event.eventDate > Date.now())
        .sort((a, b) => a.eventDate - b.eventDate);

    const pastEvents = searchResults
        .filter((event) => event.eventDate <= Date.now())
        .sort((a, b) => b.eventDate - a.eventDate);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                {/* Search Result Header */}
                <div className="flex items-center gap-3 mb-8">
                    <SearchIcon className="w-6 h-6 text-gray-500" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Search Results for <span className="text-blue-600">&quot;{query}&quot;</span>
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Found <span className="font-semibold text-gray-800">{searchResults.length}</span> events
                        </p>
                    </div>
                </div>

                {/* No Results State */}
                {searchResults.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-md border">
                        <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            No events found
                        </h3>
                        <p className="text-gray-600 mt-1">
                            Try adjusting your search terms or browse all events.
                        </p>
                    </div>
                )}

                {/* Upcoming Events Section */}
                {upcomingEvents.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">
                            Upcoming Events
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.map((event) => (
                                <EventCard key={event._id} eventId={event._id} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Past Events Section */}
                {pastEvents.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">
                            Past Events
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastEvents.map((event) => (
                                <EventCard key={event._id} eventId={event._id} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;
