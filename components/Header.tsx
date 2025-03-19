"use client"

import type React from "react"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { Search, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SearchBarProps {
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const router = useRouter()

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <form onSubmit={handleSearch} className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-400" />
      </div>
      <input
        type="search"
        className="w-full p-2.5 pl-10 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-primary focus:border-primary focus:outline-none transition-all"
        placeholder="Search for events, concerts, games..."
        aria-label="Search"
        value={searchQuery}
        onChange={handleInputChange}
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary transition-colors"
        aria-label="Submit search"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  )
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
  onClick?: () => void
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => {
  return (
    <li>
      <Link href={href} className="text-gray-700 hover:text-primary transition-colors font-medium" onClick={onClick}>
        {children}
      </Link>
    </li>
  )
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 flex-shrink-0"
          >
            TixMart
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-6">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/events">Events</NavLink>
            <NavLink href="/tickets">My Tickets</NavLink>
            <Link
              href="/seller"
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              Sell Tickets
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Always visible below header */}
        <div className="md:hidden py-3 border-t border-gray-100">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-64 border-t border-gray-100" : "max-h-0"
        }`}
      >
        <nav className="px-4 pt-2 pb-4 space-y-3">
          <NavLink href="/events" onClick={closeMenu}>
            Events
          </NavLink>
          <NavLink href="/tickets" onClick={closeMenu}>
            My Tickets
          </NavLink>
          <div className="pt-2">
            <Link
              href="/seller"
              className="block w-full text-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors font-medium"
              onClick={closeMenu}
            >
              Sell Tickets
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header

