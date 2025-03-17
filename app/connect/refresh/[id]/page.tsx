'use client'

import { useEffect,useState } from "react"
import { useParams } from "next/navigation"
import { createStriptConnectAccountLink } from "@/actions/createStripeAccountLink"
import { Loader2,AlertCircle } from "lucide-react"

export default function Refresh(){
 const params = useParams();
 const connectedAccountId = params.id as string;
 const [accountLinkCreatePending,setAccountCreatePending] = useState(false)
 const [error,setError] = useState(false)

 useEffect(()=>{
    const createAccountLink = async()=>{
        if(connectedAccountId){
            setAccountCreatePending(true)
            setError(false)
            try{
                const {url} =await createStriptConnectAccountLink(connectedAccountId);
                window.location.href = url
            }
            catch(error){
                console.error("Error creating account Link",error);
                setError(true)
            }
            setAccountCreatePending(false)
        }
    }
    createAccountLink()
 },[connectedAccountId])
 return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-600 p-6 text-white">
                    <h2 className="2xl font-bold mb-2">
                        Account Setup
                    </h2>
                    <p className="text-blue-100">
                        Complete your account to start selling tickets
                    </p>
                </div>
                <p className="p-6">
                    {
                        error?(
                            <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 text-red-600 mt-0.5"/>
                                <div>
                                    <h3 className="bg-red-50 bordr border-red-100 rounded-lg p-4 flex items-start gap-3">
                                        Something went Wrong
                                    </h3>
                                    <p className="text-sm text-red-700">
                                        We could &apos;t rfresh your account link.Please try again or contact support if the problem persit
                                    </p>
                                </div>
                            </div>
                        ):
                        (
                            <div className="text-center py-8">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4"/>
                                <p className="text-gray-600">
                                    {accountLinkCreatePending ?"Creating your Account link...":"Redirecting to stripe"}
                                </p>

                                {connectedAccountId && (
                                    <p className="text-sx text-gray-500 mt-4">
                                        Account ID:{connectedAccountId}
                                    </p>
                                )}
                            </div>
                        )
                    }
                </p>
            </div>
        </div>
    </div>
 )
}