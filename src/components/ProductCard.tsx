import React from "react";
import { Star, ShoppingCart, Eye, Sparkles, Heart } from "lucide-react";
import { Product } from "../types";
import { getProductStats } from "../lib/reviews";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
  isWishlisted = false,
  onToggleWishlist,
}: ProductCardProps) {
  // Fetch dynamic rating stats
  const { rating, reviewCount } = getProductStats(product);

  // Custom CSS renderers for the products to create stunning high-fidelity supplement tins
  const renderProductBottle = () => {
    if (product.image.startsWith("http")) {
      return (
        <div className="w-full aspect-square bg-[#FDFDFD] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-all duration-300 select-none">
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain transition-all duration-300 transform group-hover:scale-105 active:scale-95 duration-550"
          />
        </div>
      );
    }
    
    switch (product.image) {
      case "creatine":
        return (
          <div className="w-full aspect-square bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center p-4 rounded-xl relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
            {/* The actual styled tub */}
            <div className="w-28 h-36 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col justify-between p-2 relative">
              <div className="w-28 h-4 bg-gray-300 absolute -top-1 left-0 rounded-t-sm border-b border-gray-400"></div>
              <div className="text-center mt-3 z-10">
                <span className="text-[7px] font-bold text-blue-600 block leading-none">WELLCORE</span>
                <span className="text-[10px] font-extrabold text-[#0a1424] block mt-1 leading-snug">CREATINE</span>
                <span className="text-[6px] font-mono text-gray-400 block tracking-tight">MICRONISED</span>
              </div>
              <div className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 py-1 text-center rounded-xs z-10 shadow-xs">
                <span className="text-[7px] font-bold text-white tracking-widest block font-display">83 SERVINGS</span>
              </div>
              <div className="flex justify-between items-end z-10 px-1">
                <span className="text-[6px] text-gray-500">250g</span>
                <span className="text-[6px] bg-green-100 text-green-700 px-1 rounded-xs font-semibold leading-none">ORIGINAL</span>
              </div>
              {/* Grid abstract background */}
              <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:8px_8px] opacity-10"></div>
            </div>
            {/* Subtle shadow beneath */}
            <div className="absolute bottom-6 w-24 h-2 bg-black/10 rounded-full blur-sm"></div>
          </div>
        );
      case "peanutbutter":
        return (
          <div className="w-full aspect-square bg-gradient-to-b from-[#fdfbf7] to-[#f5f0e6] flex items-center justify-center p-4 rounded-xl relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
            {/* styled peanut butter jar */}
            <div className="w-26 h-34 bg-white border border-amber-200 rounded-lg shadow-md flex flex-col justify-between p-2 relative">
              <div className="w-26 h-5 bg-[#38bdf8] absolute -top-1 left-0 rounded-t-sm flex items-center justify-center">
                <span className="text-[6px] font-bold text-white tracking-wider">MYFITNESS</span>
              </div>
              <div className="text-center mt-6 z-10 px-0.5">
                <span className="text-[8px] font-bold text-orange-800 block leading-none">PEANUT BUTTER</span>
                <span className="text-[10px] bg-orange-100 text-orange-900 font-extrabold px-1 rounded-xs inline-block mt-1 leading-none">CRUNCHY</span>
              </div>
              {/* Peanut Splash decoration */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-10 bg-amber-500/10 rounded-full blur-xs pointer-events-none"></div>
              <div className="flex justify-between items-end z-10 px-1">
                <span className="text-[6px] font-bold text-blue-500">25% PRO</span>
                <span className="text-[6px] text-gray-500">1.25Kg</span>
              </div>
            </div>
            <div className="absolute bottom-6 w-20 h-2 bg-black/10 rounded-full blur-sm"></div>
          </div>
        );
      case "fishoil":
        return (
          <div className="w-full aspect-square bg-gradient-to-b from-gray-900 to-[#121c2c] flex items-center justify-center p-4 rounded-xl relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
            {/* Styled Gold/Black fish oil container */}
            <div className="w-26 h-36 bg-gray-950 border border-amber-500 rounded-lg shadow-lg flex flex-col justify-between p-2 relative">
              <div className="w-26 h-4 bg-black absolute -top-1 left-0 rounded-t-sm border-b border-amber-500/50 flex justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1"></div>
              </div>
              <div className="text-center mt-4 z-10">
                <span className="text-[6px] font-bold text-amber-400 block leading-none font-display">MUSCLEBLAZE</span>
                <span className="text-[9px] font-extrabold text-white block mt-1 tracking-tight">FISH OIL GOLD</span>
                <span className="text-[7px] text-amber-500 font-extrabold block uppercase leading-none font-mono">TRIPLE STRENGTH</span>
              </div>
              <div className="w-full bg-[#fca311] py-0.5 text-center rounded-xs z-10">
                <span className="text-[6px] font-bold text-black tracking-wide block">100% PURIFIED</span>
              </div>
              <div className="flex justify-between items-end z-10 px-1">
                <span className="text-[6px] text-gray-400 font-mono">60 Softgels</span>
                <span className="text-[6px] font-bold text-amber-400">EPA+DHA</span>
              </div>
              {/* Golden circular glow background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-amber-500/10 rounded-full blur-md"></div>
            </div>
            <div className="absolute bottom-6 w-22 h-2 bg-black/40 rounded-full blur-xs"></div>
          </div>
        );
      case "collagen":
        return (
          <div className="w-full aspect-square bg-gradient-to-b from-[#fff5f5] to-[#fbe7e7] flex items-center justify-center p-4 rounded-xl relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
            {/* Styled cosmetics/marine collagen bottle */}
            <div className="w-28 h-34 bg-white border border-pink-200 rounded-lg shadow-md flex flex-col justify-between p-2 relative">
              <div className="w-28 h-4 bg-pink-100 absolute -top-1 left-0 rounded-t-sm border-b border-pink-200 flex items-center justify-center">
                <span className="text-[6px] font-semibold text-pink-700 font-display">HK VITALS SKIN</span>
              </div>
              <div className="text-center mt-5 z-10 px-1">
                <span className="text-[9px] font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent block tracking-wide">COLLAGEN</span>
                <span className="text-[6px] font-semibold text-gray-500 block mt-0.5 font-sans">RADIANCE FORMULA</span>
              </div>
              <div className="w-full bg-gradient-to-r from-pink-400 to-orange-300 py-0.5 text-center rounded-xs z-10">
                <span className="text-[6px] font-bold text-white block">PE Peach Blast</span>
              </div>
              <div className="flex justify-between items-end z-10 px-1">
                <span className="text-[5px] text-pink-500 font-bold uppercase tracking-tight">Hyaluronic</span>
                <span className="text-[6px] text-gray-500">25 Servings</span>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-12 bg-pink-200/20 rounded-full filter blur-md"></div>
            </div>
            <div className="absolute bottom-6 w-22 h-2 bg-black/10 rounded-full blur-sm"></div>
          </div>
        );
      case "whey":
        return (
          <div className="w-full aspect-square bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center p-4 rounded-xl relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
            {/* Massive gold protein tub */}
            <div className="w-30 h-40 bg-zinc-950 border-2 border-zinc-900 rounded-lg shadow-xl flex flex-col justify-between p-2.5 relative">
              <div className="w-full h-5 bg-zinc-900 absolute -top-1 left-0 rounded-t-xs border-b border-zinc-800 flex items-center justify-center">
                <span className="text-[6px] font-bold text-yellow-500 tracking-wider font-mono">SEALED FOR SECURITY</span>
              </div>
              <div className="text-center mt-6 z-10">
                <span className="text-[6px] font-black text-amber-500 block tracking-widest leading-none font-display">WELLCORE PREMIUM</span>
                <span className="text-[11px] font-black text-white block mt-1 tracking-tight font-display">ISO-WHEY</span>
                <span className="text-[7px] text-zinc-400 block -mt-0.5 font-mono">ISOLATE PROTEIN</span>
              </div>
              <div className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 py-1 text-center rounded-xs z-10">
                <span className="text-[7.5px] font-extrabold text-black block tracking-wide font-display">27G HIGH PROTEIN</span>
              </div>
              <div className="flex justify-between items-end z-10 px-1">
                <span className="text-[6px] font-bold text-amber-400">CHOCOLATE</span>
                <span className="text-[6px] text-zinc-500">30 Servings</span>
              </div>
            </div>
            <div className="absolute bottom-4 w-24 h-2 bg-zinc-950/20 rounded-full blur-xs"></div>
          </div>
        );
      case "preworkout":
        return (
          <div className="w-full aspect-square bg-gradient-to-b from-red-50 to-red-100/50 flex items-center justify-center p-4 rounded-xl relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
            {/* Red alert pre-workout tub */}
            <div className="w-28 h-36 bg-neutral-900 border border-red-500 rounded-lg shadow-lg flex flex-col justify-between p-2 relative">
              <div className="w-28 h-4 bg-red-600 absolute -top-1 left-0 rounded-t-sm flex items-center justify-center">
                <span className="text-[6px] font-extrabold text-white tracking-widest">STRENGTH TRIGGER</span>
              </div>
              <div className="text-center mt-5 z-10">
                <span className="text-[6px] font-bold text-red-500 block leading-none">MUSCLEBLAZE</span>
                <span className="text-[10px] font-extrabold text-white block mt-0.5 leading-none font-display">WRATHX</span>
                <span className="text-[6px] text-gray-400 block mt-0.5">HIGH-STIM EXPLOSIVE</span>
              </div>
              <div className="w-full bg-red-600/20 border border-red-500/50 py-0.5 text-center rounded-xs z-10">
                <span className="text-[6px] font-mono font-bold text-red-400">300mg CAFFEINE</span>
              </div>
              <div className="flex justify-between items-end z-10 px-1">
                <span className="text-[6px] text-gray-500">30 Servings</span>
                <span className="text-[6px] text-red-500 font-extrabold font-mono">PUMP</span>
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-red-500/5 rounded-full blur-lg"></div>
            </div>
            <div className="absolute bottom-6 w-20 h-2 bg-black/10 rounded-full blur-sm"></div>
          </div>
        );
      default:
        return (
          <div className="w-full aspect-square bg-gray-50 flex items-center justify-center rounded-xl">
            <span className="text-sm font-semibold text-gray-400">Fitness Tub</span>
          </div>
        );
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-none border border-[#1A1A1A]/10 hover:border-black transition-all duration-300 flex flex-col h-full bg-white relative hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] scale-[1.00] hover:scale-[1.01]"
    >
      {/* Ribbon Banner - Editorial Flat rectangular badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
        {product.isSoldOut ? (
          <span className="bg-neutral-900 text-white text-[9px] font-mono tracking-widest uppercase font-bold px-2.5 py-1">
            Sold out
          </span>
        ) : (
          <>
            <span className="bg-black text-white text-[9px] font-montserrat font-bold tracking-wider uppercase px-2.5 py-1">
              SAVE {product.discountPercentage}%
            </span>
            {(product.id === "wellcore-creatine" || product.id === "myfitness-pb") && (
              <span className="bg-[#22C55E] text-white text-[9px] font-montserrat font-bold tracking-wider uppercase px-2 px-0.5">
                🔥 BESTSELLER
              </span>
            )}
          </>
        )}
      </div>

      {/* Wishlist & Quick View Floating Buttons */}
      <div className="absolute top-3 right-3 z-10 flex gap-1.5 sm:gap-2">
        {product.isSoldOut && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleWishlist) {
                onToggleWishlist(product);
              }
            }}
            className={`cursor-pointer p-2 border transition-all duration-200 outline-none rounded-none shadow-sm flex items-center justify-center ${
              isWishlisted
                ? "bg-[#FFEBEB] text-red-600 border-red-300 scale-105"
                : "bg-white/95 hover:bg-black hover:text-white text-black border-[#1A1A1A]/10"
            }`}
            title={isWishlisted ? "Remove from Saved" : "Save for later"}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-600 text-red-600" : ""}`} />
          </button>
        )}
        <button
          onClick={() => onViewDetails(product)}
          className="cursor-pointer p-2 bg-white/95 hover:bg-black hover:text-white border border-[#1A1A1A]/10 shadow-sm transition-all duration-200 hidden sm:block md:opacity-0 md:group-hover:opacity-100"
          title="Quick View Details"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Styled Physical Bottle representation container */}
      <div 
        className="relative overflow-hidden cursor-pointer h-56 sm:h-64 flex items-center justify-center p-4 bg-[#FFFFFF]" 
        onClick={() => onViewDetails(product)}
        title="View Product Details"
      >
        {renderProductBottle()}
      </div>

      {/* Product Information details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white border-t border-[#1A1A1A]/5">
        <div>
          {/* Brand & Stars */}
          <div className="flex items-center justify-between gap-1 mb-1 border-b border-gray-100 pb-1.5">
            <span className="text-[10px] font-montserrat tracking-widest font-bold text-neutral-400 uppercase truncate max-w-[120px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-mono text-gray-800 font-bold">{rating}</span>
              <span className="text-[9px] text-gray-400 font-mono">({reviewCount})</span>
            </div>
          </div>

          {/* Product Title - Full display of name without line clamping to obey full catalog search */}
          <h3
            onClick={() => onViewDetails(product)}
            className="text-xs sm:text-sm font-montserrat font-bold text-[#111111] hover:text-neutral-600 transition-colors cursor-pointer leading-snug mb-1 mt-1 block"
          >
            {product.name}
          </h3>

          {/* Stock Indicator alerts */}
          <div className="my-1.5 flex items-center">
            {product.isSoldOut ? (
              <span className="inline-flex items-center text-[9px] font-mono font-medium text-red-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                Out of Stock
              </span>
            ) : (product.id === "wellcore-creatine" || product.id === "myfitness-pb") ? (
              <span className="inline-flex items-center text-[9px] font-mono font-semibold text-amber-600 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                Selling Fast (Only 3 left!)
              </span>
            ) : (
              <span className="inline-flex items-center text-[9px] font-mono font-semibold text-[#22C55E] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mr-1.5"></span>
                In Stock & Verified
              </span>
            )}
          </div>

          {/* Serving / Nutrition Mini Badges - Clean Flat label style */}
          <div className="flex flex-wrap gap-1 mb-2.5 text-left">
            {product.servings && (
              <span className="text-[8px] sm:text-[9px] font-mono tracking-wider bg-neutral-100 text-neutral-600 px-2 py-0.5 border border-neutral-200">
                {product.servings}
              </span>
            )}
            {product.servingSize && (
              <span className="text-[8px] sm:text-[9px] font-mono tracking-wider bg-neutral-50 text-neutral-500 px-2 py-0.5 border border-neutral-200">
                Size: {product.servingSize}
              </span>
            )}
            <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-wider bg-[#FFFDF3] text-amber-700 px-2 py-0.5 border border-amber-200/50 rounded-xs">
              ⚡ Multi-Pack Savings
            </span>
          </div>
        </div>

        {/* Action Bottom (Price and Add/View buttons) */}
        <div className="mt-auto">
          <div className="border-t border-[#1A1A1A]/5 pt-2.5 mb-2.5">
            <div className="flex items-baseline flex-wrap gap-1.5">
              <span className="text-sm sm:text-base font-montserrat font-bold text-[#111111]">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-[10px] sm:text-xs text-neutral-400 line-through font-montserrat">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                  <div className="w-full text-[9px] font-montserrat font-semibold text-[#22C55E] mt-0.5">
                    👉 You Save Rs. {(product.originalPrice - product.price).toLocaleString()}
                  </div>
                </>
              )}
            </div>
          </div>

          {product.isSoldOut ? (
            <button
              disabled
              className="w-full py-2 px-2 bg-neutral-100 text-neutral-400 border border-neutral-200 text-[10px] font-montserrat font-bold uppercase tracking-widest cursor-not-allowed"
            >
              Sold out (Save to Wishlist)
            </button>
          ) : (
            <div className="grid grid-cols-5 gap-1.5">
              <button
                onClick={() => onAddToCart(product)}
                className="cursor-pointer col-span-3 py-2 px-2 bg-black hover:bg-neutral-800 text-white text-[9px] sm:text-[10px] font-montserrat font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-3 h-3" />
                <span>BAG +</span>
              </button>
              <button
                onClick={() => onViewDetails(product)}
                className="cursor-pointer col-span-2 py-2 px-1 bg-white border border-[#1A1A1A]/20 hover:border-black text-[#111111] text-[9px] sm:text-[10px] font-montserrat font-bold uppercase tracking-wider transition-all text-center"
                title="View specs & details"
              >
                Specs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
