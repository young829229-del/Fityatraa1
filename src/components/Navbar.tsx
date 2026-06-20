import React from "react";
import { Search, ShoppingBag, Truck } from "lucide-react";
import { CartItem } from "../types";

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenAdvisor: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({
  cart,
  onOpenCart,
  onOpenAdvisor,
  activeSection,
  onNavigate,
  searchQuery,
  onSearchChange,
}: NavbarProps) {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-black/10">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Side: Circular Logo at first, followed by navigation links */}
        <div className="flex items-center space-x-6 shrink-0">
          {/* Circular Logo Place first */}
          <div 
            className="flex items-center space-x-2 cursor-pointer select-none" 
            onClick={() => onNavigate("home")}
          >
            <img 
              src="https://i.ibb.co/wNJpkjyN/IMG-20260617-WA0012.jpg" 
              alt="FitYatra Logo" 
              className="w-10 h-10 rounded-full object-cover border border-neutral-200 shadow-sm" 
            />
            <span className="hidden sm:inline font-mono font-black text-xs uppercase tracking-widest text-black">
              FitYatra
            </span>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-5">
            <button
              id="nav-btn-home"
              onClick={() => onNavigate("home")}
              className={`cursor-pointer text-[10px] font-sans font-bold uppercase tracking-widest transition-colors ${
                activeSection === "home" ? "text-black" : "text-neutral-400 hover:text-black"
              }`}
            >
              Home
            </button>
            <button
              id="nav-btn-shop"
              onClick={() => onNavigate("shop")}
              className={`cursor-pointer text-[10px] font-sans font-bold uppercase tracking-widest transition-colors ${
                activeSection === "shop" ? "text-black" : "text-neutral-400 hover:text-black"
              }`}
            >
              Shop
            </button>
            <button
              id="nav-btn-track"
              onClick={() => onNavigate("track")}
              className={`cursor-pointer text-[10px] font-sans font-bold uppercase tracking-widest transition-colors ${
                activeSection === "track" ? "text-black" : "text-neutral-400 hover:text-black"
              }`}
            >
              Track Order
            </button>
          </nav>
        </div>

        {/* Center: Search Bar replacing the Dumbbell button - beautiful pill styling */}
        <div className="flex-1 max-w-xs md:max-w-md relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder="Search supplements..."
            value={searchQuery}
            aria-label="Search Catalog"
            onChange={(e) => {
              onSearchChange(e.target.value);
              // Auto-navigate user to shop if they start typing so they see the immediate filtered results!
              if (activeSection !== "shop" && e.target.value) {
                onNavigate("shop");
              }
            }}
            className="w-full pl-9 pr-3 py-2 bg-neutral-100 hover:bg-neutral-155 focus:bg-white text-xs border border-transparent focus:border-black/20 focus:outline-none transition-all font-mono placeholder:text-gray-400 rounded-full"
          />
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
          <button
            onClick={() => onNavigate("track")}
            className={`p-2 cursor-pointer transition-colors block md:hidden ${
              activeSection === "track" ? "text-black" : "text-gray-400 hover:text-black"
            }`}
            title="Track Order"
          >
            <Truck className="w-5 h-5" />
          </button>

          <button
            id="nav-advisor-trigger"
            onClick={onOpenAdvisor}
            className="cursor-pointer text-xs font-sans font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors hidden sm:block"
          >
            AI Coach
          </button>

          <button
            id="nav-cart-btn"
            onClick={onOpenCart}
            className="cursor-pointer relative text-neutral-400 hover:text-black transition-colors"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white rounded-full text-[8px] w-4 h-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
