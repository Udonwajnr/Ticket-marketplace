"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { getStriptConnectAccountStatus } from "@/actions/getStripeConnectAccountStaus"
import { createStriptConnectAccountLink } from "@/actions/createStripeAccountLink"
import type { AccountStatus } from "../actions/getStripeConnectAccountStaus.js"
import { createStriptConnectLoginLink } from "@/actions/createStriptConnectLogin"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import Spinner from "./Spinner"
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Cog,
  CreditCard,
  ExternalLink,
  Plus,
  RefreshCw,
  ShieldAlert,
  Wallet,
} from "lucide-react"
import { createStriptConnectCustomer } from "@/actions/createStripeConnectCustomer"

const SellerDashboard = () => {
  const [accountCreateProduct, setAccountPending] = useState(false)
  const [accountLinkCreatePending, setAccountlinkCreatePending] = useState(false)
  const [error, setError] = useState(false)
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null)
  const [accountCreatingPending, setAccountCreatingPending] = useState(false)
  const router = useRouter()
  const { user } = useUser()
  const stripeConnectId = useQuery(api.users.getUserStriptConnectId, {
    userId: user?.id || "",
  })
  const isReadyToAcceptPayment = accountStatus?.isActive && accountStatus?.payoutEnabled

  const fetchAccountStatus = async () => {
    if (stripeConnectId) {
      try {
        const status = await getStriptConnectAccountStatus(stripeConnectId)
        setAccountStatus(status)
      } catch (error) {
        console.error("Error fetching account status", error)
      }
    }
  }

  const handleManageAccount = async () => {
    try {
      if (stripeConnectId && accountStatus?.isActive) {
        const loginUrl = await createStriptConnectLoginLink(stripeConnectId)
        window.location.href = loginUrl
      }
    } catch (error) {
      console.log("Error accessing Stripe Connect portal:", error)
      setError(true)
    }
  }

  useEffect(() => {
    if (stripeConnectId) {
      fetchAccountStatus()
    }
  }, [stripeConnectId])

  if (stripeConnectId === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-500">Loading your seller dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {/* Using div with background pattern instead of SVG */}
            <div
              className="w-full h-full"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "10px 10px",
              }}
            ></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Seller Dashboard</h2>
            <p className="text-blue-100 text-lg max-w-2xl">
              Manage your seller profile, payment settings, and event listings all in one place
            </p>

            {isReadyToAcceptPayment && (
              <div className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-100 px-3 py-1.5 rounded-full text-sm font-medium mt-4">
                <Check className="w-4 h-4" />
                Your account is ready to accept payments
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="p-6 sm:p-8">
          {/* Ready to accept payments section */}
          {isReadyToAcceptPayment && (
            <div className="mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Start Selling Tickets</h2>
                <p className="text-gray-600 mb-6 max-w-2xl">
                  Your account is fully set up! Create events, list tickets for sale, and manage your listings.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    href="/seller/new-event"
                    className="flex items-center justify-between bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/30 rounded-lg">
                        <Plus className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">Create Event</div>
                        <div className="text-sm text-blue-100">List a new event for sale</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/seller/events"
                    className="flex items-center justify-between bg-white px-6 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CalendarDays className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg text-gray-800">View My Events</div>
                        <div className="text-sm text-gray-500">Manage your existing events</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Account Creation Section */}
          {!stripeConnectId && !accountCreatingPending && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Start Accepting Payments</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Create your seller account to start receiving payments securely through Stripe. This only takes a few
                minutes to set up.
              </p>
              <button
                onClick={async () => {
                  setAccountCreatingPending(true)
                  setError(false)
                  try {
                    await createStriptConnectCustomer()
                    setAccountCreatingPending(false)
                  } catch (error) {
                    console.log("Error creating Stripe Connect Customer", error)
                    setError(true)
                    setAccountCreatingPending(false)
                  }
                }}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
              >
                <CreditCard className="w-5 h-5" />
                Create Seller Account
              </button>
            </div>
          )}

          {/* Account Status Section */}
          {stripeConnectId && accountStatus && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Status Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-blue-600" />
                    Account Status
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div
                        className={`w-4 h-4 rounded-full mr-3 ${accountStatus.isActive ? "bg-green-500" : "bg-yellow-500"}`}
                      />
                      <div>
                        <span className="text-lg font-semibold text-gray-800">
                          {accountStatus.isActive ? "Active" : "Pending Setup"}
                        </span>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {accountStatus.isActive
                            ? "Your account is active and ready"
                            : "Complete the required steps to activate your account"}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Payment Capabilities</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${accountStatus.chargesEnabled ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"}`}
                          >
                            {accountStatus.chargesEnabled ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <AlertCircle className="w-3 h-3" />
                            )}
                          </div>
                          <span className={`${accountStatus.chargesEnabled ? "text-gray-800" : "text-gray-500"}`}>
                            {accountStatus.chargesEnabled ? "Can accept payments" : "Cannot accept payments yet"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${accountStatus.payoutEnabled ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"}`}
                          >
                            {accountStatus.payoutEnabled ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <AlertCircle className="w-3 h-3" />
                            )}
                          </div>
                          <span className={`${accountStatus.payoutEnabled ? "text-gray-800" : "text-gray-500"}`}>
                            {accountStatus.payoutEnabled ? "Can receive payouts" : "Cannot receive payouts yet"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements Section */}
                {accountStatus.requiresInformation && (
                  <div className="bg-white rounded-xl p-6 border border-yellow-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      Required Information
                    </h3>

                    <div className="space-y-4">
                      {accountStatus.requirements.currently_due.length > 0 && (
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            Action Required
                          </p>
                          <ul className="space-y-2 text-yellow-700 text-sm">
                            {accountStatus.requirements.currently_due.map((req) => (
                              <li key={req} className="flex items-start">
                                <ArrowRight className="w-3 h-3 mt-1 mr-2 flex-shrink-0" />
                                <span>{req.replace(/_/g, " ")}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {accountStatus.requirements.eventually_due.length > 0 && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-2">Eventually Needed</p>
                          <ul className="space-y-2 text-gray-600 text-sm">
                            {accountStatus.requirements.eventually_due.map((req) => (
                              <li key={req} className="flex items-start">
                                <ArrowRight className="w-3 h-3 mt-1 mr-2 flex-shrink-0" />
                                <span>{req.replace(/_/g, " ")}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {!accountLinkCreatePending ? (
                        <button
                          onClick={async () => {
                            setAccountlinkCreatePending(true)
                            setError(false)
                            try {
                              const { url } = await createStriptConnectAccountLink(stripeConnectId)
                              router.push(url)
                            } catch (error) {
                              console.log("Error Creating Stripe Connect Account link:", error)
                              setError(true)
                            }
                            setAccountlinkCreatePending(false)
                          }}
                          className="bg-yellow-600 text-white px-5 py-2.5 rounded-lg hover:bg-yellow-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Complete Requirements
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-yellow-400 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 opacity-70 cursor-not-allowed"
                        >
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-6">
                {accountStatus.isActive && (
                  <button
                    onClick={handleManageAccount}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <Cog className="w-4 h-4" />
                    Stripe Dashboard
                  </button>
                )}

                <button
                  onClick={fetchAccountStatus}
                  className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Status
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Unable to access Stripe Dashboard</p>
                    <p className="text-sm mt-1">
                      Please complete all requirements first before accessing your dashboard.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading States */}
          {accountCreatingPending && (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Creating your seller account...</p>
              <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
            </div>
          )}

          {accountLinkCreatePending && (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Preparing account setup...</p>
              <p className="text-gray-500 text-sm mt-2">You'll be redirected to Stripe shortly</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard

