"use client"

import { CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Return() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Success Header */}
        <div className="p-8 text-center border-b border-gray-100">
          <div className="mb-4 flex justify-center">
            <div className="bg-green-50 p-3 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Account Connected</h2>
          <p className="text-gray-600">Your Stripe account has been successfully connected</p>
        </div>

        {/* What Happens Next */}
        <div className="p-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="font-medium text-green-800 mb-3 text-lg">What happens next</h3>
            <ul className="text-sm text-green-700 space-y-2 mb-6 pl-5">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <span>You can now create and sell tickets for events</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Payments will be processed through your Stripe account</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Funds will be transferred automatically</span>
              </li>
            </ul>

            <Link
              href="/seller"
              className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Go to Seller Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

