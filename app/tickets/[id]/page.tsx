"use client"
import React, { useEffect } from 'react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import Ticket from '@/components/Tickets';
import Link from 'next/link';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { useParams, redirect } from 'next/navigation';

const MyTicket = () => {
    const params = useParams();
    const { user } = useUser();
    const ticket = useQuery(api.tickets.getTicketWithDetails, {
        ticketId: params.id as Id<'Tickets'>,
    });

    useEffect(() => {
        if (!user) {
            redirect("/");
        }
        if (!ticket || ticket.userId !== user.id) {
            redirect("/tickets");
        }
        if (!ticket.event) {
            redirect("/tickets");
        }
    }, [user, ticket]);

    if (!ticket || !ticket.event) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-8 lg:px-10">
            <div className="max-w-3xl mx-auto space-y-10">
                {/* Navigation and actions */}
                <div className="flex items-center justify-between">
                    <Link href="/tickets" className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                        <ArrowLeft className='w-5 h-5 mr-2' />
                        Back to My Tickets
                    </Link>
                    <div className="flex items-center gap-3">
                        <button className='flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors rounded-lg bg-gray-100 hover:bg-gray-200'>
                            <Download className='w-5 h-5' />
                            <span className='text-sm font-medium'>Save</span>
                        </button>
                        <button className='flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors rounded-lg bg-gray-100 hover:bg-gray-200'>
                            <Share2 className='w-5 h-5' />
                            <span className='text-sm font-medium'>Share</span>
                        </button>
                    </div>
                </div>

                {/* Event Info Summary */}
                <div className={`bg-white p-6 rounded-lg shadow-sm border ${ticket.event.is_cancelled ? "border-red-200" : "border-gray-200"}`}>
                    <h1 className='text-2xl font-bold text-gray-900'>{ticket.event.name}</h1>
                    <p className='mt-1 text-gray-600'>
                        {new Date(ticket.event.eventDate).toLocaleDateString()} at {ticket.event.location}
                    </p>
                    <div className='mt-4 flex items-center gap-4'>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${ticket.event.is_cancelled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            {ticket.event.is_cancelled ? "Cancelled" : "Valid Ticket"}
                        </span>
                        <span className='text-sm text-gray-500'>
                            Purchased on {new Date(ticket.purchasedAt).toLocaleString()}
                        </span>
                    </div>
                    {ticket.event.is_cancelled && (
                        <p className='mt-4 text-sm text-red-600'>
                            This event has been cancelled. A refund will be processed if it hasn't been already.
                        </p>
                    )}
                </div>

                <Ticket ticketId={ticket._id} />

                <div className={`mt-8 rounded-lg p-5 ${ticket.event.is_cancelled ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"} border`}>   
                    <h3 className={`text-sm font-medium ${ticket.event.is_cancelled ? "text-red-900" : "text-blue-900"}`}>
                        Need help?
                    </h3>
                    <p className={`mt-1 text-sm ${ticket.event.is_cancelled ? "text-red-700" : "text-blue-700"}`}>
                        {ticket.event.is_cancelled 
                            ? "For questions about refunds or cancellations, please contact our support team at umohu67@gmail.com."
                            : "If you have any issues with your ticket, please contact our support team at udonwajnr10@gmail.com."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MyTicket;