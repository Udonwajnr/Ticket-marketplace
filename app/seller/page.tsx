import React from "react"
import SellerDashboard from "../../components/SellerDashboard"
import { auth } from "@clerk/nextjs/server"
import {redirect} from "next/navigation"

export default async function  Seller(){
    const {userId} = await auth()
    if(!userId) redirect("/")
    return(
        <div className="min-h-screen bg-gray-50">
            <SellerDashboard/>
        </div>
    )
}