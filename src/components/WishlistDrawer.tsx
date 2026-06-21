import React from "react";
import { X, Heart, ShoppingCart, Trash2, Sparkles, AlertCircle } from "lucide-react";
import { Product } from "../types";

interface WishlistDrawerProps {
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewProductDetails: (product: Product) => void;
}

export default function WishlistDrawer({
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onViewProductDetails,
}: WishlistDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        {/* Drawer Panel Container */}
        <div className="w-screen max-w-md bg-white shadow-editorial flex flex-col justify-between h-full relative border-l border-[#1A1A1A]/20 transform transition-transform duration-300">
          
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-[#1A1A1A]/10 flex items-center justify-between bg-[#FAFAFA]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="text-base font-geometric font-extrabold text-[#1a1a1a] uppercase tracking-wider">
                My Saved Wishlist
              </h2>
              <span className="bg-black text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-none uppercase tracking-wider">
                {wishlist.length} Items
              </span>
            </div>
            <button
              id="wishlist-close-btn"
              onClick={onClose}
              className="cursor-pointer p-1.5 hover:bg-[#1A1A1A]/5 rounded-none text-gray-500 hover:text-[#1A1A1A] transition-colors border border-transparent"
              title="Close Wishlist"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
                <Heart className="w-12 h-12 text-zinc-300 mb-4 animate-pulse" />
                <h3 className="text-sm font-bold text-gray-800 font-geometric uppercase tracking-wider">
                  Wishlist is Empty
                </h3>
                <p className="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">
                  Explore Fiji & Nepal's finest supplementation range and click the heart icon on your favorite items to save them here!
                </p>
                <button
                  onClick={onClose}
                  className="cursor-pointer mt-6 px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-mono text-[10px] uppercase tracking-widest transition-colors shadow-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {wishlist.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex gap-4 py-4 first:pt-0 last:pb-0 group transition-all"
                  >
                    {/* Compact Image representation */}
                    <div
                      onClick={() => {
                        onViewProductDetails(prod);
                        onClose();
                      }}
                      className="w-20 h-20 bg-neutral-50 rounded-none border border-neutral-100 flex items-center justify-center p-2 shrink-0 cursor-pointer overflow-hidden relative"
                    >
                      {prod.image.startsWith("http") ? (
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-[9px] font-mono text-gray-400 capitalize">
                          {prod.image}
                        </span>
                      )}
                      
                      {prod.isSoldOut && (
                        <span className="absolute inset-x-0 bottom-0 bg-neutral-900/80 text-white text-[7px] text-center uppercase tracking-widest py-0.5 leading-none">
                          Sold out
                        </span>
                      )}
                    </div>

                    {/* Meta info & Action Column */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        {/* Brand & Price */}
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-[9px] font-mono tracking-wider font-bold text-gray-400 uppercase truncate">
                            {prod.brand}
                          </span>
                          <span className="text-xs font-geometric font-extrabold text-neutral-950">
                            Rs. {prod.price.toLocaleString()}
                          </span>
                        </div>

                        {/* Product Title */}
                        <h4
                          onClick={() => {
                            onViewProductDetails(prod);
                            onClose();
                          }}
                          className="text-xs font-bold text-[#1A1A1A] hover:text-gray-600 transition-colors cursor-pointer line-clamp-2 leading-snug mt-0.5"
                        >
                          {prod.name}
                        </h4>
                      </div>

                      {/* Interactive Drawer Action controls footer */}
                      <div className="flex items-center justify-between gap-2 mt-2 pt-1">
                        {/* Remove from saved */}
                        <button
                          onClick={() => onRemoveFromWishlist(prod)}
                          className="cursor-pointer text-[10px] text-gray-400 hover:text-red-500 font-mono flex items-center gap-1 transition-colors group/trash"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>

                        {/* Add to shopping bag */}
                        {!prod.isSoldOut ? (
                          <button
                            onClick={() => {
                              onAddToCart(prod);
                              onClose();
                            }}
                            className="cursor-pointer px-3 py-1.5 bg-[#FFCD00] hover:bg-[#E2B600] text-black text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs transition-all active:scale-95"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>Add to Bag</span>
                          </button>
                        ) : (
                          <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase py-1 px-2 bg-neutral-100">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer footer summary action */}
          {wishlist.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-[#1A1A1A]/10 bg-[#FAFAFA]">
              <p className="text-[10px] text-gray-400 font-mono text-center tracking-wide leading-relaxed">
                ✨ Stored securely in your Nepalese local storage. Log back in anytime to fetch your saved stacks!
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
