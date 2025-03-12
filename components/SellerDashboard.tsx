"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { getStriptConnectAccountStatus } from '@/actions/getStripeConnectAccountStaus';
import { createStriptConnectAccountLink } from '@/actions/createStripeAccountLink';
import {AccountStatus} from "../actions/getStripeConnectAccountStaus.js"
import { createStriptConnectLoginLink } from '@/actions/createStriptConnectLogin';
import { useUser } from '@clerk/nextjs';
import Spinner from './Spinner.jsx';


const SellerDashboard = () => {
  const [accountCreateProduct,SetAccountPending]= useState(false);
  const [accountLinkCreatePending,setAccountlinkCreatePending] = useState(false)
  const [error,setError] = useState(false);
  const [accountStatus,setAccountStatus] = useState<AccountStatus|null>(null);
  const router = useRouter()
  const {user} = useUser()
  const stripeConnectId = useQuery(api.users.getUserStriptConnectId,{
    userId:user?.id || ""
  })
  const isReadyToAcceptPayment = accountStatus?.isActive && accountStatus?.payoutEnabled;
  
  const fetchAccountStatus=async()=>{
    if(stripeConnectId){
      try{
        const status = await getStriptConnectAccountStatus(stripeConnectId)
      }catch(error){
        console.error("Error fetching account status",error)
      }
    }
  }
  const handlemanageAccount = async ()=>{
    try{
      if(stripeConnectId && accountStatus?.isActive){
        const loginUrl = await createStriptConnectLoginLink(stripeConnectId);
        window.location.href = loginUrl
      }
    }
    catch(error){
      console.log("Error accessing Stript Connect portals:",error);
      setError(true)
    }
  }

  useEffect(()=>{
    if(stripeConnectId){
      fetchAccountStatus();
    }
  },[stripeConnectId])
 
  if(stripeConnectId === undefined){
    return <Spinner/>
  }

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* header section */}
        <h2 className='text-2xl font-bold'>Seller Dashboard</h2>
        <p className="text-blue-100 mt-2">
          Manage Your Seller profile and payment Settings
        </p>
      </div>
    </div>
  )
}

export default SellerDashboard
