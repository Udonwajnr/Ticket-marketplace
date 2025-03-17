"use client"

import { useState } from "react"
import Link from "next/link"
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { Menu, X, Search, Ticket, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Main header row */}
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
          >
            TixMart
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <SignedIn>
              <Link
                href="/tickets"
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Ticket className="w-4 h-4" />
                <span>My Tickets</span>
              </Link>
              <Link href="/seller">
                <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                  Sell Ticket
                </button>
              </Link>
              <div className="ml-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </nav>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <button
              onClick={toggleMenu}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search - Conditional */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isSearchOpen ? "max-h-16 py-3" : "max-h-0 py-0",
          )}
        >
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu - Slide Down */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100",
          isMenuOpen ? "max-h-64" : "max-h-0",
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-3">
          <SignedIn>
            <Link
              href="/tickets"
              className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Ticket className="w-5 h-5 text-primary" />
              <span className="font-medium">My Tickets</span>
            </Link>

            <Link
              href="/seller"
              className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span className="font-medium">Sell Ticket</span>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full flex justify-center bg-primary text-white p-3 rounded-md hover:bg-primary/90 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

const SearchBar = () => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-400" />
      </div>
      <input
        type="search"
        className="w-full p-2.5 pl-10 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-primary focus:border-primary focus:outline-none"
        placeholder="Search for events, concerts, games..."
        aria-label="Search"
      />
    </div>
  )
}

export default Header

