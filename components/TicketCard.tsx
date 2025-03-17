"use client"
import React from 'react';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { CalendarDays, MapPin, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Spinner from './Spinner';
import { Id } from '@/convex/_generated/dataModel';
import clsx from 'clsx';

export default function TicketCard({ ticketId }: { ticketId: Id<"Tickets"> }) {
  const ticket = useQuery(api.tickets.getTicketWithDetails, { ticketId });
  if (!ticket || !ticket.event) return <Spinner />;

  const isPastEvent = ticket.event.eventDate < Date.now();
  
  const statusColors = {
    valid: isPastEvent ? "bg-gray-100 text-gray-500 border-gray-300" : "bg-green-100 text-green-700 border-green-200",
    used: "bg-gray-200 text-gray-600 border-gray-300",
    refunded: "bg-red-100 text-red-700 border-red-300",
    cancelled: "bg-red-100 text-red-700 border-red-300"
  };

  const statusText = {
    valid: isPastEvent ? "Ended" : "Valid",
    used: "Used",
    refunded: "Refunded",
    cancelled: "Cancelled"
  };

  return (
    <Link 
      href={`/tickets/${ticketId}`}
      className={clsx(
        "block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border overflow-hidden",
        { "border-red-300": ticket.event.is_cancelled, "border-gray-200": !ticket.event.is_cancelled },
        isPastEvent && "opacity-80 hover:opacity-100"
      )}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {ticket.event.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Purchased on {new Date(ticket.purchasedAt).toLocaleString()}
            </p>
            {ticket.event.is_cancelled && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Event Cancelled
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={clsx(
              "px-3 py-1 rounded-full text-sm font-medium border",
              ticket.event.is_cancelled ? "bg-red-100 text-red-700 border-red-300" : statusColors[ticket.status]
            )}>
              {ticket.event.is_cancelled ? "Cancelled" : statusText[ticket.status]}
            </span>
            {isPastEvent && !ticket.event.is_cancelled && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" /> Past Event
              </span>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center text-gray-700">
            <CalendarDays className={clsx("w-5 h-5 mr-2", ticket.event.is_cancelled && "text-red-600")} />
            <span className="text-sm">
              {new Date(ticket.event.eventDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <MapPin className={clsx("w-5 h-5 mr-2", ticket.event.is_cancelled && "text-red-600")} />
            <span className="text-sm">{ticket.event.location}</span>
          </div>
        </div>
        <div className="flex mt-6 items-center justify-between text-sm">
          <span className={clsx(
            "font-medium",
            ticket.event.is_cancelled ? "text-red-600" : isPastEvent ? "text-gray-600" : "text-blue-600"
          )}>
            ${ticket.event.price.toFixed(2)}
          </span>
          <span className="text-blue-600 flex items-center hover:underline">
            View ticket <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}