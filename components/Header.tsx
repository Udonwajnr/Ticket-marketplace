import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
import SearchBar from "../components/SearchBar"

const Header = () => {
  return (
    // logo
    <>
        <Link href={"/"}>
            <h2>TixMart</h2>
        </Link>

        <div className='lg:hidden'>
            <SignedIn>
                <UserButton/>
            </SignedIn>

            <SignedOut>
                <SignInButton>
                    <button className='bg-gray-100 text-gray-800 p-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition bordr border-gray-300'>
                        Sign in
                    </button>
                </SignInButton>
            </SignedOut>
        </div>

        {/* search Bar - full width on mobie */}
        <div className='w-full lg:max-w-2xl'>
            <SearchBar/>
        </div>

        {/*desktop action button */}
        <div className='hidden lg:block ml-auto'>
            <SignedIn>
                <div className="flex items-center gap-3">
                    <Link href={'/seller'} className='flex-1'>
                        <button className='w-full bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition'>
                            Sell Ticket
                        </button>
                    </Link>

                    <Link href={"/tickets"} className='flex-1'>
                        <button className='w-full bg-gray-100 text-gray-800 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition border border-gray-300'>
                            My Ticket
                        </button>
                    </Link>
                    <UserButton/>
                </div>
            </SignedIn>

            <SignedOut>
                <SignInButton mode='modal'>
                    <button className='bg-gray-100 text-gray-800 px-3 text-sm rounded-lg hover:bg-gray-200 transition bordr border-gray-300'>
                        Sign In
                    </button>
                </SignInButton>
            </SignedOut>

        </div>

        {/* Mobile Action Buttons */}
        <div className='lg:hidden w-full flex justify-center gap-3'>
            <SignedIn>
                <Link href={"/seller"} className='flex-1'>
                    <button className='w-full bg-blue-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition'>
                        Sell Ticket
                    </button>
                </Link>

                <Link href={"/seller"} className='flex-1'>
                    <button className='w-full bg-blue-100 text-gray-800 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition border border-gray-300'>
                        My Tickets
                    </button>
                </Link>
            </SignedIn>
        </div>
    </>
  )
}

export default Header