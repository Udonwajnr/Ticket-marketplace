"use client"

import type React from "react"

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react"
import Link from "next/link"
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { Menu, X, Search, Ticket, ShoppingBag, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect for better header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-200/70"
          : "bg-white shadow-sm border-b border-gray-100",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main header row */}
        <div className="h-16 md:h-18 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span>TixMart</span>
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
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
              >
                <Ticket className="w-4 h-4" />
                <span>My Tickets</span>
              </Link>
              <Link href="/seller">
                <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm hover:shadow">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Sell Tickets</span>
                </button>
              </Link>
              <div className="ml-3 border-l pl-3 border-gray-200">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
                    },
                  }}
                />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors font-medium">
                  Sign In
                </button>
              </SignInButton>
              <Link href="/sign-up">
                <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors ml-2 font-medium shadow-sm">
                  Sign Up
                </button>
              </Link>
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
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

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
          <SearchBar onSearch={() => setIsSearchOpen(false)} />
        </div>
      </div>

      {/* Mobile Menu - Slide Down */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100",
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-3">
          <SignedIn>
            <Link
              href="/tickets"
              className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-50 transition-colors"
              onClick={closeMenu}
            >
              <Ticket className="w-5 h-5 text-primary" />
              <span className="font-medium">My Tickets</span>
            </Link>

            <Link
              href="/seller"
              className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-50 transition-colors"
              onClick={closeMenu}
            >
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span className="font-medium">Sell Tickets</span>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button
                className="w-full flex justify-center items-center gap-2 bg-primary text-white p-3 rounded-md hover:bg-primary/90 transition-colors"
                onClick={closeMenu}
              >
                Sign In
              </button>
            </SignInButton>

            <Link href="/sign-up" className="block mt-2" onClick={closeMenu}>
              <button className="w-full flex justify-center items-center gap-2 bg-white border border-gray-200 text-gray-800 p-3 rounded-md hover:bg-gray-50 transition-colors">
                Create Account
              </button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

interface SearchBarProps {
  className?: string
  onSearch?: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ className, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const router = useRouter()

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      if (onSearch) onSearch()
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClear = () => {
    setSearchQuery("")
  }

  return (
    <form onSubmit={handleSearch} className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-400" />
      </div>
      <input
        type="text" // Using text instead of search to avoid browser's clear button
        className="w-full p-2.5 pl-10 pr-12 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-200 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-sm hover:border-gray-300"
        placeholder="Search for events, concerts, games..."
        aria-label="Search"
        value={searchQuery}
        onChange={handleInputChange}
      />
      {searchQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-10 flex items-center pr-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary transition-colors"
        aria-label="Submit search"
      >
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  )
}

export default Header

