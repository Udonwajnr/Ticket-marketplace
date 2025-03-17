import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft,Plus } from "lucide-react";
import SellerEventList from "@/components/SellerEventList";


export default async function SellerEvevntsPage(){
    const {userId} = await auth()
    if(!userId) redirect("/")

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-12 px-3 sm:px-6 lg:px-8">
                {/* header */}
                <div className="bg-white rounded-cl shadow border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link
                             href={"/seller"}
                             className="text-gray-500 hover:text-gray-700 transition-colors"
                             >
                                <ArrowLeft className="w-5 h-5"/>
                            </Link>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
                                <p className="mt-1 text-gray-500">
                                    Manage your events Listing and track sales
                                </p>
                            </div>
                        </div>
                        <Link href={"/seller/new-event"}
                                className="flex items-center justify-center gap-2 bg-blur-600 text-white px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5"/>
                            Create Event
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">  
                    <SellerEventList/>
                </div>
            </div>
        </div>
    )
}