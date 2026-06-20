import React from "react";
import { Star, ShoppingCart, Eye, Sparkles } from "lucide-react";
import { Product } from "../types";
import { getProductStats } from "../lib/reviews";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
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
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1 animate-pulse"></div>
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
      className="group bg-white rounded-none border border-[#1A1A1A]/10 hover:border-black/40 hover:shadow-editorial transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* Ribbon Banner - Editorial Flat rectangular badge */}
      {product.isSoldOut ? (
        <span className="absolute top-3 left-3 bg-zinc-900 border border-zinc-800 text-white text-[9px] uppercase font-mono tracking-widest px-2.5 py-1 z-10">
          Sold out
        </span>
      ) : (
        <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 z-10">
          SAVE {product.discountPercentage}%
        </span>
      )}

      {/* Quick View Floating Button */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex gap-2">
        <button
          onClick={() => onViewDetails(product)}
          className="cursor-pointer p-2 bg-white hover:bg-black hover:text-white border border-[#1A1A1A]/20 transition-all duration-200"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Styled Physical Bottle representation */}
      <div 
        className="relative overflow-hidden cursor-pointer" 
        onClick={() => onViewDetails(product)}
        title="View Product Details"
      >
        {renderProductBottle()}
      </div>

      {/* Product Information details */}
      <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Brand & Stars */}
          <div className="flex items-center justify-between gap-1 mb-1 border-b border-gray-100 pb-1">
            <span className="text-[8px] sm:text-[9px] font-mono tracking-widest font-bold text-black uppercase truncate max-w-[80px] sm:max-w-full">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3 h-3 fill-black text-black" />
              <span className="text-[9px] sm:text-[10px] font-mono text-gray-800 font-bold">{rating}</span>
              <span className="text-[8px] text-gray-400 font-mono">({reviewCount})</span>
            </div>
          </div>

          {/* Product Title - Space Grotesk modern sans-serif style */}
          <h3
            onClick={() => onViewDetails(product)}
            className="text-xs sm:text-sm font-display font-bold text-[#1A1A1A] hover:text-gray-600 transition-colors cursor-pointer line-clamp-2 min-h-[2rem] leading-tight mb-1 sm:mb-2"
          >
            {product.name}
          </h3>

          {/* Serving / Nutrition Mini Badges - Clean Flat label style */}
          <div className="flex flex-wrap gap-1 mb-1.5 sm:mb-2 text-left">
            {product.servings && (
              <span className="text-[7px] sm:text-[8px] font-mono bg-gray-50 text-gray-600 px-1.5 sm:px-2 py-0.5 border border-gray-200">
                {product.servings}
              </span>
            )}
          </div>
        </div>

        {/* Action Bottom (Price and Add/View buttons) */}
        <div>
          <div className="flex items-baseline flex-wrap gap-1 mb-2 sm:mb-2.5 border-t border-gray-100 pt-2">
            <span className="text-sm sm:text-base font-geometric font-black text-black">
              Rs. {product.price.toLocaleString()}
            </span>
            <span className="text-[9px] sm:text-[10px] text-gray-400 line-through font-geometric ml-1 font-semibold">
              Rs. {product.originalPrice.toLocaleString()}
            </span>
          </div>

          {product.isSoldOut ? (
            <button
              disabled
              className="w-full py-1.5 sm:py-2 px-2 bg-zinc-100 text-zinc-400 border border-zinc-200 text-[8px] sm:text-[9px] font-mono uppercase tracking-widest cursor-not-allowed"
            >
              Sold out
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-1.5">
              <button
                onClick={() => onAddToCart(product)}
                className="cursor-pointer flex-1 py-1.5 sm:py-2 px-2 bg-[#1A1A1A] hover:bg-gray-800 text-white text-[8px] sm:text-[9px] font-mono uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-2.5 h-2.5 sm:w-3 sm:h-3 hidden sm:block" />
                <span>Add</span>
              </button>
              <button
                onClick={() => onViewDetails(product)}
                className="cursor-pointer py-1.5 sm:py-2 px-2 sm:px-3 bg-white border border-[#1A1A1A]/20 hover:border-[#1A1A1A] hover:bg-gray-50 text-[#1A1A1A] text-[8px] sm:text-[9px] font-mono uppercase tracking-wide transition-all text-center"
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
