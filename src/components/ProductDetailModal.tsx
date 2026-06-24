import React, { useState } from "react";
import { 
  X, Star, ShoppingCart, CheckCircle, Info, ShieldCheck, Truck, 
  Share2, RotateCcw, Award, Check, Plus, Minus, ChevronLeft, ChevronRight, Heart,
  ChevronDown, HelpCircle
} from "lucide-react";
import { Product, ProductVariant } from "../types";
import { 
  getProductReviews, 
  addProductReview, 
  updateProductReview, 
  deleteProductReview, 
  getProductStats,
  UserReview
} from "../lib/reviews";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onBuyNow?: (product: Product, quantity?: number) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted = false,
  onToggleWishlist,
}: ProductDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"description" | "nutrition" | "reviews">("description");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [newReviewVideos, setNewReviewVideos] = useState<string[]>([]);
  const [shareConfig, setShareConfig] = useState({ showToast: false, text: "" });

  // Custom reviews states
  const [reviewsList, setReviewsList] = useState<UserReview[]>(() => getProductReviews(product.id));
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewImages, setNewReviewImages] = useState<string[]>([]);
  
  // Inline review editing states
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState("");
  const [editingRating, setEditingRating] = useState(5);

  // Review Gallery Lightbox photo preview
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Touch Swipe states for image sliding
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const album = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  // Dynamic customized weights and flavors based on product categories
  const getVariants = () => {
    const cat = product.category.toLowerCase();
    const name = product.name.toLowerCase();
    if (name.includes("protein") || cat.includes("protein") || name.includes("whey")) {
      return {
        weights: ["2Kg", "1Kg", "4Kg"],
        flavors: ["Rich Chocolate", "French Vanilla Creme", "Blue Tokai Coffee", "Chocolate Peanut Butter"]
      };
    } else if (name.includes("creatine") || cat.includes("creatine")) {
      return {
        weights: ["300 gram"],
        flavors: ["Unflavoured"]
      };
    } else if (name.includes("peanut") || name.includes("butter")) {
      return {
        weights: ["1.25kg"],
        flavors: ["Crunchy"]
      };
    } else if (name.includes("oil") || name.includes("omega") || name.includes("fish")) {
      return {
        weights: ["60 Capsules"],
        flavors: ["Premium Omega-3"]
      };
    } else {
      return {
        weights: ["Standard Size", "Bulk Saver Pack"],
        flavors: ["Natural Standard"]
      };
    }
  };

  // Get active variants (user custom or auto-generated default quantity options)
  const getProductVariants = (p: Product): ProductVariant[] => {
    if (p.variants && p.variants.length > 0) {
      return p.variants;
    }
    
    // Auto-generate default packs
    const p1 = p.price;
    const op1 = p.originalPrice || Math.round(p.price * 1.35);
    const servingsVal = p.servings || "";
    const sizeVal = p.servingSize || "";
    
    const p2 = Math.round(p1 * 2 * 0.90);
    const op2 = op1 * 2;
    
    const p3 = Math.round(p1 * 3 * 0.85);
    const op3 = op1 * 3;
    
    const doubleServings = servingsVal ? `2 x ${servingsVal}` : "";
    const tripleServings = servingsVal ? `3 x ${servingsVal}` : "";
    
    return [
      {
        name: "1 Pack (Standard)",
        price: p1,
        originalPrice: op1,
        servings: servingsVal,
        servingSize: sizeVal,
        isSoldOut: p.isSoldOut
      },
      {
        name: "2 Pack (Save Extra 10%)",
        price: p2,
        originalPrice: op2,
        servings: doubleServings,
        servingSize: sizeVal,
        isSoldOut: p.isSoldOut
      },
      {
        name: "3 Pack (Best Value - Save 15%)",
        price: p3,
        originalPrice: op3,
        servings: tripleServings,
        servingSize: sizeVal,
        isSoldOut: p.isSoldOut
      }
    ];
  };

  const productVariants = getProductVariants(product);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(productVariants[0]);
  const { flavors } = getVariants();
  const [selectedFlavor, setSelectedFlavor] = useState(flavors[0]);

  const getActiveVariantProduct = () => {
    const variantName = selectedVariant ? selectedVariant.name : "Standard";
    return {
      ...product,
      id: `${product.id}-${variantName.replace(/\s+/g, '-').toLowerCase()}-${selectedFlavor.replace(/\s+/g, '-').toLowerCase()}`,
      name: `${product.name} (${variantName} - ${selectedFlavor})`,
      price: selectedVariant ? selectedVariant.price : product.price,
      originalPrice: selectedVariant ? selectedVariant.originalPrice : product.originalPrice,
      servings: selectedVariant ? selectedVariant.servings : product.servings,
      servingSize: selectedVariant ? selectedVariant.servingSize : product.servingSize,
      isSoldOut: selectedVariant ? (selectedVariant.isSoldOut ?? product.isSoldOut) : product.isSoldOut
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setActiveImageIndex((prev) => (prev + 1) % album.length);
    } else if (isRightSwipe) {
      setActiveImageIndex((prev) => (prev - 1 + album.length) % album.length);
    }
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setShareConfig({ showToast: true, text: "Link copied to clipboard!" });
    } catch (err) {
      setShareConfig({ showToast: true, text: "Sharing is ready!" });
    }
    setTimeout(() => {
      setShareConfig({ showToast: false, text: "" });
    }, 2500);
  };

  // Convert uploaded review photos into base64 URLs
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const val = reader.result;
        if (typeof val === "string") {
          setNewReviewImages((prev) => [...prev, val]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const val = reader.result;
        if (typeof val === "string") {
          setNewReviewVideos((prev) => [...prev, val]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveSelectedImage = (idx: number) => {
    setNewReviewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveSelectedVideo = (idx: number) => {
    setNewReviewVideos((prev) => prev.filter((_, i) => i !== idx));
  };

  // Create review submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim()) {
      setShareConfig({ showToast: true, text: "Please enter a nickname/name" });
      setTimeout(() => setShareConfig({ showToast: false, text: "" }), 3000);
      return;
    }
    if (!newReviewComment.trim()) {
      setShareConfig({ showToast: true, text: "Please enter some feedback" });
      setTimeout(() => setShareConfig({ showToast: false, text: "" }), 3000);
      return;
    }

    const payload = {
      name: newReviewName.trim(),
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      images: newReviewImages,
      videos: newReviewVideos,
      verified: true,
      isUserAdded: true,
    };

    addProductReview(product.id, payload);
    
    // Refresh reviews
    const updated = getProductReviews(product.id);
    setReviewsList(updated);

    // Reset Form
    setNewReviewName("");
    setNewReviewRating(5);
    setNewReviewComment("");
    setNewReviewImages([]);
    setNewReviewVideos([]);
    
    setShareConfig({ showToast: true, text: "Feedback added successfully!" });
    setTimeout(() => setShareConfig({ showToast: false, text: "" }), 3000);
  };

  // Delete review
  const handleDeleteReview = (id: string) => {
    deleteProductReview(id);
    const updated = getProductReviews(product.id);
    setReviewsList(updated);
  };

  // Save inline edit review
  const handleSaveEdit = (id: string) => {
    if (!editingComment.trim()) {
      setShareConfig({ showToast: true, text: "Comment cannot be empty" });
      setTimeout(() => setShareConfig({ showToast: false, text: "" }), 3000);
      return;
    }
    updateProductReview(id, {
      comment: editingComment.trim(),
      rating: editingRating,
    });
    setEditingReviewId(null);
    const updated = getProductReviews(product.id);
    setReviewsList(updated);
    
    setShareConfig({ showToast: true, text: "Feedback saved successfully!" });
    setTimeout(() => setShareConfig({ showToast: false, text: "" }), 3000);
  };

  // Calculations for reviews stats and discounts
  const numReviews = reviewsList.length;
  const averageRating = numReviews > 0
    ? parseFloat((reviewsList.reduce((sum, r) => sum + r.rating, 0) / numReviews).toFixed(1))
    : product.rating;

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOriginalPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice;
  const calculatedDiscount = currentOriginalPrice && currentPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : product.discountPercentage || 23;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center bg-black/75 backdrop-blur-md overflow-y-auto p-0 md:p-6 animate-fade-in font-sans">
      <div className="bg-[#FAF9F6] w-full min-h-screen md:min-h-0 md:max-w-4xl md:h-[90vh] md:rounded-2xl overflow-y-auto shadow-2xl border-0 md:border border-neutral-250 flex flex-col md:flex-row relative">
        
        {/* Floating Share Toast Notification */}
        {shareConfig.showToast && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] bg-[#1A1A1A] text-white text-xs py-2 px-4 rounded-full shadow-lg font-mono tracking-wider animate-bounce">
            {shareConfig.text}
          </div>
        )}

        {/* Close Button - prominent, modern round icon */}
        <button
          onClick={onClose}
          aria-label="Close Product Details"
          className="cursor-pointer absolute top-4 right-4 z-50 p-2.5 rounded-full text-black hover:text-white bg-white/90 hover:bg-black border border-black/10 hover:border-black shadow-md transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: Clean White Product Image Stage */}
        <div className="w-full md:w-[48%] bg-white p-6 sm:p-10 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-neutral-150 shrink-0 select-none">
          {/* Brand header */}
          <div className="w-full flex justify-end items-center text-neutral-400 mb-2">
            <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] bg-yellow-101 hover:bg-yellow-201 text-[#8B6E02] px-3 py-1 rounded-none">
              {product.brand}
            </span>
          </div>

          <div className="w-full flex-1 flex flex-col justify-center items-center relative">
            {/* Swipable Canvas Area */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full relative flex justify-center items-center aspect-square max-h-[300px] md:max-h-[350px] p-2 overflow-hidden bg-white cursor-default"
              title="Swipe left/right on mobile"
            >
              <img 
                src={album[activeImageIndex] && album[activeImageIndex].startsWith("http") ? album[activeImageIndex] : product.image} 
                alt={`${product.brand} ${product.name}`} 
                className="max-w-full max-h-full object-contain" 
              />
              
              {/* Manual image slider navigators */}
              {album.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + album.length) % album.length)}
                    className="absolute left-1 top-1/2 -translate-y-1/2 cursor-pointer p-1.5 rounded-full bg-white/85 hover:bg-black hover:text-white border border-neutral-200 shadow-sm transition-all text-neutral-800"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % album.length)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer p-1.5 rounded-full bg-white/85 hover:bg-black hover:text-white border border-neutral-200 shadow-sm transition-all text-neutral-800"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>

            {/* Slider Dots indicators */}
            {album.length > 1 && (
              <div className="flex gap-1.5 justify-center py-4">
                {album.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeImageIndex === idx 
                        ? 'w-4 bg-[#FFCD00]' 
                        : 'w-1.5 bg-neutral-250 hover:bg-neutral-400'
                    }`}
                    title={`Slide to image ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Micro Gallery thumbnails */}
            {album.length > 1 && (
              <div className="flex gap-2 justify-center flex-wrap w-full max-w-[280px]">
                {album.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`cursor-pointer border w-10 h-10 bg-white overflow-hidden aspect-square flex items-center justify-center rounded-lg transition-all ${
                      activeImageIndex === idx 
                        ? 'border-[#FFCD00] ring-2 ring-[#FFCD00]/20 scale-105 shadow-sm' 
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail view" className="w-full h-full object-contain p-0.5" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Genuine Seal Badges */}
          <div className="w-full border-t border-neutral-100 pt-6 mt-4 flex flex-col gap-2 bg-neutral-50 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-[#FFCD00]" />
              <span className="text-[10px] font-sans font-bold text-neutral-800 uppercase tracking-widest">Guaranteed Originality</span>
            </div>
            <p className="text-[9px] text-neutral-500 text-left">Every supplement has scratch-verification seal linking to authentic verification portal.</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Elegant MuscleBlaze Premium Details Area */}
        <div className="w-full md:w-[52%] p-6 sm:p-8 flex flex-col md:overflow-y-auto md:max-h-[90vh] bg-white relative">
          <div className="flex-1 flex flex-col text-left space-y-5">
            
            {/* Header Title with Share action */}
            <div className="w-full flex justify-between items-start gap-4">
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-neutral-400 block">{product.category} Supplement</span>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-neutral-900 leading-tight tracking-tight">
                  {product.brand} {product.name}
                </h2>
              </div>
              <button 
                onClick={handleShare}
                className="cursor-pointer p-2.5 rounded-full border border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-700 shadow-xs flex-shrink-0 transition-all active:scale-95"
                title="Share this product"
              >
                <Share2 className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Verified rating and reviews count on top near title */}
            <div className="flex items-center gap-2 py-0.5 border-b border-gray-150 pb-2">
              <div className="flex gap-0.5 text-[#FFCD00]">
                {[1, 2, 3, 4, 5].map((starNum) => {
                  const filled = starNum <= Math.round(averageRating);
                  return (
                    <Star key={starNum} className={`w-4 h-4 ${filled ? "fill-[#FFCD00] text-[#FFCD00]" : "text-neutral-350"}`} />
                  );
                })}
              </div>
              <span className="text-xs font-semibold text-neutral-700">
                {averageRating} / 5 ({numReviews} Verified Reviews)
              </span>
            </div>

            {/* Premium Price Bracket */}
            <div className="space-y-1 bg-neutral-50/50 p-4.5 rounded-xl border border-neutral-100">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-neutral-950 tracking-tight font-geometric">
                  Rs {currentPrice.toLocaleString()}
                </span>
              </div>
              
              {currentOriginalPrice && (
                <div className="flex items-center gap-2.5 text-xs text-neutral-500">
                  <span className="font-geometric">Marked Price Rs {currentOriginalPrice.toLocaleString()}</span>
                  <span className="text-emerald-600 font-bold ml-1.5 text-sm">
                    {calculatedDiscount}% OFF
                  </span>
                </div>
              )}

              {/* Shipping & Tax labels */}
              <div className="flex flex-wrap gap-2 pt-2.5">
                <span className="text-[10px] font-medium border border-neutral-200 text-neutral-500 px-3 py-1 bg-white rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#FFCD00] rounded-full inline-block"></span>
                  Free KTM Delivery
                </span>
                <span className="text-[10px] font-medium border border-neutral-200 text-neutral-500 px-3 py-1 bg-white rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full inline-block"></span>
                  Inclusive of all taxes.
                </span>
              </div>
            </div>

            {/* Quantity Packs / Package Choices */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-neutral-900 block font-sans tracking-wide flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5 text-neutral-500" /> Choose Quantity & Price Package
              </span>
              <div className="grid grid-cols-1 gap-2">
                {productVariants.map((variant) => {
                  const isSelected = selectedVariant?.name === variant.name;
                  const discount = variant.originalPrice && variant.price
                    ? Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100)
                    : 0;
                  return (
                    <button
                      key={variant.name}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-full text-left cursor-pointer p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                        isSelected 
                          ? "bg-[#FFFDF3] border-[#FFCD00] ring-1 ring-[#FFCD00]/30 shadow-sm scale-[1.01]" 
                          : "bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-[#FFCD00] bg-[#FFCD00]" : "border-neutral-350"
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                        </div>
                        <div>
                          <span className="text-xs font-bold font-sans block text-neutral-900">
                            {variant.name}
                          </span>
                          {variant.servings && (
                            <span className="text-[10px] text-neutral-500 block">
                              {variant.servings} {variant.servingSize ? `• Size: ${variant.servingSize}` : ""}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black font-geometric text-neutral-950 block">
                          Rs. {variant.price.toLocaleString()}
                        </span>
                        {variant.originalPrice > variant.price && (
                          <div className="flex items-center justify-end gap-1.5 text-[10px]">
                            <span className="text-neutral-400 line-through font-geometric">Rs. {variant.originalPrice.toLocaleString()}</span>
                            <span className="text-emerald-600 font-bold font-sans">-{discount}%</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flavoured Choices */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-neutral-900 block font-sans tracking-wide">Flavour Options</span>
              <div className="flex gap-2 flex-wrap">
                {flavors.map((flv) => {
                  const isSelected = selectedFlavor === flv;
                  return (
                    <button
                      key={flv}
                      type="button"
                      onClick={() => setSelectedFlavor(flv)}
                      className={`cursor-pointer px-4 py-2 text-xs font-semibold font-sans rounded-lg border transition-all ${
                        isSelected 
                          ? "bg-[#FFCD00] border-amber-300 text-black font-bold shadow-xs scale-[1.02]" 
                          : "bg-[#FFFDF3] hover:bg-[#FFFBF0] border-amber-100 hover:border-amber-200 text-neutral-700"
                      }`}
                    >
                      {flv}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STAGED QUANTITY DISPLAY (SECURE CLIENT QUOTA) */}
            <div className="space-y-4 bg-white p-4 border border-neutral-200 rounded-none">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-montserrat font-bold text-neutral-900 block uppercase tracking-wider">Select Order Quantity</span>
                  <span className="text-[10px] text-[#22C55E] block font-semibold">Genuine Batch Verified</span>
                </div>
                {/* Plus Minus controls */}
                <div className="flex items-center border border-black select-none">
                  <button 
                    type="button"
                    onClick={() => setDetailQuantity(prev => Math.max(1, prev - 1))}
                    className="cursor-pointer px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-black font-extrabold text-sm border-r border-black"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-montserrat font-bold text-xs text-black min-w-[32px] text-center">
                    {detailQuantity}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setDetailQuantity(prev => Math.min(10, prev + 1))}
                    className="cursor-pointer px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-black font-extrabold text-sm border-l border-black"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Subtotal Real-Time Calculation breakdown block */}
              <div className="border-t border-[#1A1A1A]/5 pt-3 flex flex-col gap-1.5 text-xs">
                {product.originalPrice > product.price && (
                  <div className="flex justify-between items-center text-[#22C55E] font-semibold text-[11px]">
                    <span>Discounted Savings</span>
                    <span className="font-montserrat font-bold">
                      - Rs. {((product.originalPrice - product.price) * detailQuantity).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-neutral-900 font-bold border-t border-dashed border-[#1A1A1A]/10 pt-2 text-sm mt-1">
                  <span className="font-montserrat uppercase tracking-wider text-xs">Actual Net Total</span>
                  <div className="text-right">
                    <span className="font-montserrat font-extrabold text-[#111111] text-base">
                      Rs. {(product.price * detailQuantity).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-500 block font-mono">excluding delivery/courier fee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Action Add To Cart button row */}
            <div className="hidden sm:block pt-2">
              {product.isSoldOut ? (
                <div className="flex flex-col gap-2">
                  <button
                    disabled
                    className="w-full py-4 bg-neutral-200 text-neutral-450 font-bold rounded-lg text-sm uppercase tracking-widest cursor-not-allowed"
                  >
                    SOLD OUT
                  </button>
                  {onToggleWishlist && (
                    <button
                      onClick={() => onToggleWishlist(product)}
                      className={`w-full py-3 hover:scale-[1.01] font-bold rounded-lg text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border ${
                        isWishlisted
                          ? "bg-[#FFEBEB] text-red-600 border-red-300 shadow-xs"
                          : "bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-300 shadow-xs"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-600" : ""}`} />
                      <span>{isWishlisted ? "Saved in wish list" : "Save to my wishlist"}</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    onAddToCart(getActiveVariantProduct(), detailQuantity);
                    onClose();
                  }}
                  className="w-full py-4 bg-[#FFCD00] hover:bg-[#E2B600] text-black font-extrabold rounded-lg text-sm uppercase tracking-widest transition-all active:scale-[0.98] shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5 text-black" strokeWidth={2.5} /> ADD TO CART
                </button>
              )}
            </div>

            {/* Core Trust Indicators from muscleblaze screenshot */}
            <div className="grid grid-cols-3 gap-2 border-t border-b border-neutral-150 py-5 my-1 bg-neutral-50/50 rounded-xl px-2">
              <div className="flex flex-col items-center justify-start text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-black">
                  <Truck className="w-5 h-5 text-neutral-850" strokeWidth={2} />
                </div>
                <span className="text-[10px] font-bold text-neutral-800 leading-tight">Free Kathmandu Shipping</span>
              </div>
              
              <div className="flex flex-col items-center justify-start text-center gap-2 border-l border-r border-neutral-200">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-black">
                  <RotateCcw className="w-5 h-5 text-neutral-850" strokeWidth={2} />
                </div>
                <span className="text-[10px] font-bold text-neutral-800 leading-tight">Authentic Sealed Returns</span>
              </div>

              <div className="flex flex-col items-center justify-start text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-black">
                  <Award className="w-5 h-5 text-neutral-850" strokeWidth={2} />
                </div>
                <span className="text-[10px] font-bold text-neutral-800 leading-tight">Barcode Verified</span>
              </div>
            </div>

            {/* TAB CONTAINER: Product details tabs down below */}
            <div className="pt-2">
              <div className="flex border-b border-gray-250">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`flex-1 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 cursor-pointer ${
                    activeTab === "description" ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-900"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("nutrition")}
                  className={`flex-1 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 cursor-pointer ${
                    activeTab === "nutrition" ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-900"
                  }`}
                >
                  Specs
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex-1 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 cursor-pointer ${
                    activeTab === "reviews" ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-900"
                  }`}
                >
                  Reviews ({numReviews})
                </button>
              </div>

              {/* Dynamic tab contents */}
              <div className="py-4 text-xs text-gray-600 leading-relaxed font-sans min-h-[140px]">
                {activeTab === "description" && (
                  <div className="space-y-6">
                    <div className="space-y-2.5">
                      <p className="font-semibold text-neutral-800 text-xs">Aesthetic, High-Fidelity Supplement Formula</p>
                      <p>{product.description}</p>
                      {product.goals && product.goals.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {product.goals.map((g) => (
                            <span key={g} className="bg-amber-55/10 text-[#8B6E02] font-semibold text-[9px] uppercase tracking-wide px-2 py-0.5 rounded border border-amber-200/50">
                              Goal: {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Rich infographics & scientific info-banners flow */}
                    {(() => {
                      const displayImages = [...(product.infoImages || [])];
                      if (displayImages.length <= 1) {
                        const galleryItems = product.gallery || [];
                        galleryItems.forEach(img => {
                          if (!displayImages.includes(img)) {
                            displayImages.push(img);
                          }
                        });
                      }

                      return displayImages.length > 0 && (
                        <div className="border-t border-neutral-150 pt-5 mt-4 space-y-3">
                          <div className="flex flex-col gap-3">
                            {displayImages.map((imgUrl, i) => (
                              <div key={i} className="info-banner-wrapper overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-xs hover:border-neutral-350 transition-colors">
                                <img
                                  src={imgUrl}
                                  alt={`${product.brand} - details banner ${i + 1}`}
                                  className="w-full object-contain rounded-lg animate-fade-in"
                                  referrerPolicy="no-referrer"
                                  loading="lazy"
                                  onError={(e) => {
                                    const p = (e.target as HTMLElement).closest('.info-banner-wrapper');
                                    if (p) {
                                      (p as HTMLElement).style.display = 'none';
                                    }
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Got Questions? We've Got Answers! section */}
                    <div className="border-t border-neutral-150 pt-6 mt-6 space-y-4">
                      <div className="text-center space-y-1">
                        <h4 className="font-bold text-neutral-900 text-sm tracking-tight">Got Questions? We've Got Answers!</h4>
                        <p className="text-[10px] text-neutral-500 font-sans">Everything you need to know about our products and services</p>
                      </div>

                      {/* Accordions */}
                      <div className="space-y-2">
                        {/* Q1: Delivery */}
                        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => setOpenFaqId(openFaqId === "q_delivery" ? null : "q_delivery")}
                            className="w-full flex items-center justify-between p-3 text-left font-semibold text-neutral-800 text-[11px] hover:bg-neutral-50 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <HelpCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              How long does delivery take?
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${openFaqId === "q_delivery" ? "rotate-180" : ""}`} />
                          </button>
                          {openFaqId === "q_delivery" && (
                            <div className="p-3 bg-neutral-50 text-[10px] text-neutral-600 border-t border-neutral-100 leading-relaxed">
                              Delivering health & peak performance safely is our main focus. Shipping takes <strong className="text-neutral-900">12-48 Hours Nation-Wide</strong>. Kathmandu valley orders typically deliver within 24 hours. Under rare cases of delayed transit or remote locations, it may take 3-5 days.
                            </div>
                          )}
                        </div>

                        {/* Q2: Results */}
                        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => setOpenFaqId(openFaqId === "q_results" ? null : "q_results")}
                            className="w-full flex items-center justify-between p-3 text-left font-semibold text-neutral-800 text-[11px] hover:bg-neutral-50 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <HelpCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              What Results will I see?
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${openFaqId === "q_results" ? "rotate-180" : ""}`} />
                          </button>
                          {openFaqId === "q_results" && (
                            <div className="p-3 bg-neutral-50 text-[10px] text-neutral-600 border-t border-neutral-100 leading-relaxed space-y-1">
                              <span>Our formulations prioritize maximum bioavailability and systemic support:</span>
                              <div className="text-neutral-800 font-medium italic mt-1 space-y-1">
                                {product.id === "wellcore-creatine" && <p>✓ Accelerated physical strength, muscle tissue fluid volume expansion, and fast high-intensity ATP output.</p>}
                                {product.id === "muscleblaze-lcarnitine" && <p>✓ Accelerated calorie and thermal fatty acid burn. Sustains muscle power and speeds body fat breakdown.</p>}
                                {product.id === "myfitness-pb" && <p>✓ Steady macro release. 25% protein ensures perfect high-density muscle building blocks and steady fuel.</p>}
                                {product.id === "muscleblaze-fishoil" && <p>✓ Supports structural cartilage integrity, locks in memory/brain cell vitality, and keeps blood lipids healthy.</p>}
                                {(!["wellcore-creatine", "muscleblaze-lcarnitine", "myfitness-pb", "muscleblaze-fishoil"].includes(product.id)) && <p>✓ High-caliber cell rehydration, metabolic enzyme support, and accelerated muscle tissue conditioning.</p>}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Q3: Speed */}
                        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => setOpenFaqId(openFaqId === "q_speed" ? null : "q_speed")}
                            className="w-full flex items-center justify-between p-3 text-left font-semibold text-neutral-800 text-[11px] hover:bg-neutral-50 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <HelpCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              How quickly does it work?
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${openFaqId === "q_speed" ? "rotate-180" : ""}`} />
                          </button>
                          {openFaqId === "q_speed" && (
                            <div className="p-3 bg-neutral-50 text-[10px] text-neutral-600 border-t border-neutral-100 leading-relaxed">
                              {product.id === "wellcore-creatine" && "Wellcore Micronised Creatine achieves full cellular saturation within 5-7 days of immediate loading or 14 days of sustained daily consumption."}
                              {product.id === "muscleblaze-lcarnitine" && "Liquid form absorbs rapidly. Take Citrus Splash 25-30 mins prior to physical activity or cardio to initiate energetic fatty acid mobilization."}
                              {product.id === "myfitness-pb" && "Works immediate as a dense whole-food workout fuel, delivering immediate dietary strength without digestive heaviness."}
                              {product.id === "muscleblaze-fishoil" && "Omega-3 softgels integrate into joint hydration membranes and brain synapses steadily over 10 to 14 days of constant daily intake."}
                              {(!["wellcore-creatine", "muscleblaze-lcarnitine", "myfitness-pb", "muscleblaze-fishoil"].includes(product.id)) && "Varies by systemic absorption. High-quality compounds typically initiate muscular and cellular support within 3 to 10 days."}
                            </div>
                          )}
                        </div>

                        {/* Q4: Real */}
                        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => setOpenFaqId(openFaqId === "q_real" ? null : "q_real")}
                            className="w-full flex items-center justify-between p-3 text-left font-semibold text-neutral-800 text-[11px] hover:bg-neutral-50 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <HelpCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              Is this product real?
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${openFaqId === "q_real" ? "rotate-180" : ""}`} />
                          </button>
                          {openFaqId === "q_real" && (
                            <div className="p-3 bg-neutral-50 text-[10px] text-neutral-600 border-t border-neutral-100 leading-relaxed">
                              <strong className="text-neutral-900">100% Genuine Certified.</strong> Product safety is our cornerstone. We source directly from top-tier global brand representatives or authorized national distributors. Every tub features a proprietary secure scratch authenticity coupon code that you can verify instantly yourself on official brand verification websites or via brand verification SMS lines!
                            </div>
                          )}
                        </div>

                        {/* Product-specific dynamic questions */}
                        {(() => {
                          const productFaqs: { q: string; a: string }[] = [];
                          if (product.id === "wellcore-creatine") {
                            productFaqs.push(
                              {
                                q: "Should I do a loading phase with Wellcore Creatine?",
                                a: "A loading phase (20g/day split into 4 servings for 5-7 days) saturates muscle tissue fluid and stores super fast. However, a simple 3-5g daily dose is equally effective, achieving optimal saturation in 3-4 weeks. Consistency is key!"
                              },
                              {
                                q: "When is the best time to consume Wellcore Creatine?",
                                a: "Post-workout is ideal, stacking it with carbohydrate-rich protein shakes to trigger insulin-driven cellular uptake. On rest days, consume it in the morning with a glass of water or breakfast."
                              },
                              {
                                q: "Is it necessary to cycle off Creatine?",
                                a: "No, cycling is not necessary. Wellcore Micronised Creatine is safe and thoroughly tested for long-term daily consumption to maintain peak muscle hydration, cellular energy, and strength."
                              }
                            );
                          } else if (product.id === "muscleblaze-lcarnitine") {
                            productFaqs.push(
                              {
                                q: "How does Liquid L-Carnitine accelerate fat burn?",
                                a: "It acts as an active shuttle, transporting long-chain fatty acids into your cell's mitochondria where they are oxidation-burned for direct thermal energy. This aids body fat reduction while preserving lean athletic physical structures."
                              },
                              {
                                q: "Should I take L-Carnitine PRO on an empty stomach?",
                                a: "Yes! Consuming L-Carnitine PRO roughly 25-30 minutes empty-stomach before aerobic activity, weight-training, or cardio maximizes blood metabolic absorption and thermal conditioning."
                              }
                            );
                          } else if (product.id === "myfitness-pb") {
                            productFaqs.push(
                              {
                                q: "Why is MyFitness Peanut Butter excellent for natural muscle gains?",
                                a: "Packed with 25% protein and loaded with essential heart-healthy monounsaturated fats, it delivers sustained caloric strength and high-quality macro fuels necessary for hormonal recovery and lean weight build."
                              },
                              {
                                q: "Is there any hydrogenated oil in this peanut butter?",
                                a: "No! MyFitness uses slow-roasted superior peanuts and contains zero trans-fats, hydrogenated oils, or bad artery-blocking fillers."
                              }
                            );
                          } else if (product.id === "muscleblaze-fishoil") {
                            productFaqs.push(
                              {
                                q: "Will these Omega-3 softgels result in fishy reflux or burps?",
                                a: "No. MuscleBlaze Fish Oil Gold softgels feature advanced stomach-acids-resistant Enteric Coating. This delays capsule breakdown until it bypasses the stomach, preventing all fishy burps and reflux."
                              },
                              {
                                q: "Is this fish oil verified heavy metal & mercury free?",
                                a: "Absolutely. Our oil undergoes thorough Molecular Distillation to screen out heavy metals, lead, arsenic, and mercury, ensuring exceptional medical-grade purity and safety."
                              }
                            );
                          }

                          return productFaqs.map((faq, idx) => {
                            const faqKey = `custom_faq_${idx}`;
                            const isFaqOpen = openFaqId === faqKey;
                            return (
                              <div key={faqKey} className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
                                <button
                                  type="button"
                                  onClick={() => setOpenFaqId(isFaqOpen ? null : faqKey)}
                                  className="w-full flex items-center justify-between p-3 text-left font-semibold text-neutral-800 text-[11px] hover:bg-neutral-50 transition-colors"
                                >
                                  <span className="flex items-center gap-2">
                                    <HelpCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                    {faq.q}
                                  </span>
                                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${isFaqOpen ? "rotate-180" : ""}`} />
                                </button>
                                {isFaqOpen && (
                                  <div className="p-3 bg-neutral-50 text-[10px] text-neutral-600 border-t border-neutral-100 leading-relaxed">
                                    {faq.a}
                                  </div>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Aesthetic comparison table matching Image 1 layout exactly */}
                    <div className="border-t border-neutral-150 pt-5 mt-5 space-y-3.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-neutral-400 block">
                        🛡️ FitYatra Premium Standard vs Typical Shops
                      </span>
                      
                      <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white text-[10px] font-sans">
                        {/* Section 1: Delivery Time */}
                        <div className="grid grid-cols-12 border-b border-neutral-150">
                          {/* Col 1: Metric */}
                          <div className="col-span-4 bg-white p-3 font-semibold text-neutral-800 flex items-center justify-center text-center border-r border-[#EFEFEF]">
                            Delivery execution
                          </div>
                          {/* Col 2: FitYatra */}
                          <div className="col-span-4 bg-[#FFFDF6] p-3 text-center flex flex-col items-center justify-center border-r border-[#EFEFEF]">
                            <span className="text-blue-500 font-bold text-xs mb-1">✓</span>
                            <span className="font-bold text-neutral-900 text-[10px] leading-tight text-center">12-48 Hours Nation-Wide</span>
                          </div>
                          {/* Col 3: Competitor */}
                          <div className="col-span-4 bg-white p-3 text-center flex flex-col items-center justify-center text-neutral-500">
                            <span className="text-red-500 font-bold text-xs mb-1">✕</span>
                            <span className="text-[10px] leading-tight text-center">3-5 Days, delayed orders.</span>
                          </div>
                        </div>

                        {/* Section 2 Banner Header: 3. PRODUCT AUTHENTICITY */}
                        <div className="bg-[#F6F6F6] border-b border-neutral-150 px-3 py-2 flex items-center gap-2 font-bold font-mono tracking-wider text-[9px] uppercase text-neutral-800">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>3. PRODUCT AUTHENTICITY</span>
                        </div>

                        {/* Section 2 Row Under it */}
                        <div className="grid grid-cols-12 border-b border-neutral-150">
                          {/* Col 1 */}
                          <div className="col-span-4 bg-white p-3 font-semibold text-neutral-800 flex items-center justify-center text-center border-r border-[#EFEFEF]">
                            Genuine guarantee
                          </div>
                          {/* Col 2 */}
                          <div className="col-span-4 bg-[#FFFDF6] p-3 text-center flex flex-col items-center justify-center border-r border-[#EFEFEF]">
                            <span className="text-blue-500 font-bold text-xs mb-1">✓</span>
                            <span className="font-bold text-neutral-900 text-[10px] leading-tight text-center">You Verify the Product Yourself! + Guarantee</span>
                          </div>
                          {/* Col 3 */}
                          <div className="col-span-4 bg-white p-3 text-center flex flex-col items-center justify-center text-neutral-500">
                            <span className="text-red-500 font-bold text-xs mb-1">✕</span>
                            <span className="text-[10px] leading-tight text-center">Unknown sourcing, constant doubt.</span>
                          </div>
                        </div>

                        {/* Section 3 Banner Header: 4. CUSTOMER SUPPORT */}
                        <div className="bg-[#F6F6F6] border-b border-neutral-150 px-3 py-2 flex items-center gap-2 font-bold font-mono tracking-wider text-[9px] uppercase text-neutral-800">
                          <HelpCircle className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>4. CUSTOMER SUPPORT</span>
                        </div>

                        {/* Section 3 Row Under it */}
                        <div className="grid grid-cols-12 border-b border-neutral-150">
                          {/* Col 1 */}
                          <div className="col-span-4 bg-white p-3 font-semibold text-neutral-800 flex items-center justify-center text-center border-r border-[#EFEFEF]">
                            Support availability
                          </div>
                          {/* Col 2 */}
                          <div className="col-span-4 bg-[#FFFDF6] p-3 text-center flex flex-col items-center justify-center border-r border-[#EFEFEF]">
                            <span className="text-blue-500 font-bold text-xs mb-1">✓</span>
                            <span className="font-bold text-neutral-900 text-[10px] leading-tight text-center">Immediate, Human Support. Especially After Delivery</span>
                          </div>
                          {/* Col 3 */}
                          <div className="col-span-4 bg-white p-3 text-center flex flex-col items-center justify-center text-neutral-500">
                            <span className="text-red-500 font-bold text-xs mb-1">✕</span>
                            <span className="text-[10px] leading-tight text-center">Automated replies, no real help.</span>
                          </div>
                        </div>

                        {/* Section 4 Banner Header: 5. RETURN POLICY */}
                        <div className="bg-[#F6F6F6] border-b border-neutral-150 px-3 py-2 flex items-center gap-2 font-bold font-mono tracking-wider text-[9px] uppercase text-neutral-800">
                          <RotateCcw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>5. RETURN POLICY</span>
                        </div>

                        {/* Section 4 Row Under it */}
                        <div className="grid grid-cols-12">
                          {/* Col 1 */}
                          <div className="col-span-4 bg-white p-3 font-semibold text-neutral-800 flex items-center justify-center text-center border-r border-[#EFEFEF]">
                            Return window
                          </div>
                          {/* Col 2 */}
                          <div className="col-span-4 bg-[#FFFDF6] p-3 text-center flex flex-col items-center justify-center border-r border-[#EFEFEF]">
                            <span className="text-blue-500 font-bold text-xs mb-1">✓</span>
                            <span className="font-bold text-neutral-900 text-[10px] leading-tight text-center">Simple, clear, Easy Returns</span>
                          </div>
                          {/* Col 3 */}
                          <div className="col-span-4 bg-white p-3 text-center flex flex-col items-center justify-center text-neutral-500">
                            <span className="text-red-500 font-bold text-xs mb-1">✕</span>
                            <span className="text-[10px] leading-tight text-center font-medium">Confusing rules, high risk policy.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "nutrition" && (() => {
                  const currentServings = selectedVariant?.servings || product.servings;
                  const currentServingSize = selectedVariant?.servingSize || product.servingSize;
                  return (
                    <div className="space-y-3">
                      {/* Serving Specs */}
                      {(currentServings || currentServingSize) && (
                        <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 font-semibold mb-2">
                          {currentServings && (
                            <div>
                              <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-mono">Pack Servings</span>
                              <span className="text-xs text-neutral-800">{currentServings}</span>
                            </div>
                          )}
                          {currentServingSize && (
                            <div>
                              <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-mono">Serving Scope</span>
                              <span className="text-xs text-neutral-800">{currentServingSize}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {product.specs ? (
                        <div className="border border-neutral-150 rounded-lg overflow-hidden divide-y divide-neutral-100">
                          {Object.entries(product.specs).map(([key, value]) => (
                            <div key={key} className="flex justify-between p-2 text-xs bg-white">
                              <span className="font-semibold text-gray-500 capitalize">{key.replace(/_/g, " ")}</span>
                              <span className="text-gray-900 font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="italic text-gray-400">Nutritional analyses and profile certified by independent third-party laboratories.</p>
                      )}
                    </div>
                  );
                })()}

                {activeTab === "reviews" && (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Summary Ratings Grid card */}
                    <div className="bg-neutral-50/50 p-4.5 rounded-xl border border-neutral-200 flex flex-col sm:flex-row gap-6 items-center">
                      <div className="text-center sm:border-r sm:border-neutral-200 sm:pr-8 shrink-0">
                        <span className="text-4xl font-extrabold text-neutral-900 block font-sans">{averageRating}</span>
                        <div className="flex gap-0.5 text-[#FFCD00] justify-center my-1.5">
                          {[1, 2, 3, 4, 5].map((sn) => (
                            <Star key={sn} className={`w-3.5 h-3.5 ${sn <= Math.round(averageRating) ? "fill-current" : "text-neutral-300"}`} />
                          ))}
                        </div>
                        <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-neutral-500">
                          {numReviews} customer reviews
                        </span>
                      </div>

                      {/* Bar star breakdown */}
                      <div className="flex-1 w-full space-y-1.5">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const count = reviewsList.filter((r) => r.rating === stars).length;
                          const pct = numReviews > 0 ? (count / numReviews) * 100 : 0;
                          return (
                            <div key={stars} className="flex items-center gap-3 text-xs">
                              <span className="font-semibold text-neutral-600 w-8 font-mono">{stars} ★</span>
                              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                                <div className="h-full bg-[#FFCD00]" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-[10px] text-neutral-500 font-mono w-6 text-right">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Customer Review Photos Gallery layout */}
                    {reviewsList.some((r) => r.images && r.images.length > 0) && (
                      <div className="space-y-2 border-b border-gray-100 pb-4">
                        <span className="text-xs font-bold text-neutral-900 block font-sans tracking-wide uppercase">
                          Customer Review Photo Gallery
                        </span>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {reviewsList.flatMap((r) => (r.images || []).map((img, idx) => ({ img, reviewAuthor: r.name, key: `${r.id}-${idx}` }))).map((item) => (
                            <div 
                              key={item.key} 
                              onClick={() => setPreviewImageUrl(item.img)}
                              className="aspect-square bg-neutral-100 rounded-lg overflow-hidden border border-neutral-250 cursor-pointer hover:scale-[1.03] hover:opacity-90 transition-all relative group"
                              title={`Uploaded by ${item.reviewAuthor}`}
                            >
                              <img src={item.img} alt="review snap" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-mono text-[9px] font-bold">
                                ZOOM
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interactive Form to Submit review */}
                    <div className="bg-white p-4.5 rounded-xl border border-neutral-250 space-y-4 text-left shadow-xs">
                      <span className="text-xs font-bold text-neutral-900 block font-sans tracking-wide border-b border-neutral-200 pb-2 uppercase text-xs">
                        Write a Customer Product Review
                      </span>

                      <form onSubmit={handleSubmitReview} className="space-y-3.5">
                        {/* Rating select stars decoration */}
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">Give rating star (1-5 stars) *</label>
                          <div className="flex gap-1.5 text-neutral-300">
                            {[1, 2, 3, 4, 5].map((starNum) => (
                              <button
                                key={starNum}
                                type="button"
                                onClick={() => setNewReviewRating(starNum)}
                                className="cursor-pointer transition-transform hover:scale-110"
                                title={`Give ${starNum} Stars`}
                              >
                                <Star className={`w-6 h-6 ${starNum <= newReviewRating ? "fill-[#FFCD00] text-[#FFCD00]" : "text-neutral-300"}`} />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Nickname input */}
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono font-bold text-text-gray-500 block">Your Name / Nickname *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Sujan M." 
                            value={newReviewName}
                            onChange={(e) => setNewReviewName(e.target.value)}
                            className="bg-[#FAFAFA] w-full p-2.5 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-black font-sans text-neutral-900"
                          />
                        </div>

                        {/* Comment text area */}
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono font-bold text-text-gray-500 block">Written supplement feedback *</label>
                          <textarea 
                            rows={3} 
                            required
                            placeholder="Mix mixes beautifully, fast verification results, workouts enhancement, no fishy reflux etc." 
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            className="bg-[#FAFAFA] w-full p-2.5 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-black font-sans text-neutral-900"
                          />
                        </div>

                        {/* Image & Video file select uploaders */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 pt-1">
                          {/* Image file select uploader */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">Supplement Snapshots</label>
                            <div 
                              className="border-2 border-dashed border-neutral-300 hover:border-black bg-[#FAFAFA] hover:bg-neutral-50 p-4 rounded-lg text-center cursor-pointer transition-colors h-24 flex flex-col justify-center"
                              onClick={() => document.getElementById("review-photo-uploads")?.click()}
                            >
                              <span className="text-[11px] text-neutral-500 block font-medium leading-tight">
                                <span className="text-black font-bold underline">Add photos</span>
                              </span>
                              <span className="text-[9px] text-gray-400 font-mono block mt-1">PNG, JPG formats</span>
                              <input 
                                id="review-photo-uploads"
                                type="file" 
                                multiple 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleFileChange}
                              />
                            </div>

                            {/* Preview selected review images waiting to upload */}
                            {newReviewImages.length > 0 && (
                              <div className="flex gap-1.5 flex-wrap pt-2">
                                {newReviewImages.map((b64, idx) => (
                                  <div key={idx} className="w-10 h-10 rounded-lg border border-neutral-250 overflow-hidden relative group aspect-square">
                                    <img src={b64} alt="upload preview" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSelectedImage(idx)}
                                      className="absolute inset-0 bg-red-600/90 text-white text-[8px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Video file select uploader */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">Supplement Videos</label>
                            <div 
                              className="border-2 border-dashed border-neutral-300 hover:border-black bg-[#FAFAFA] hover:bg-neutral-50 p-4 rounded-lg text-center cursor-pointer transition-colors h-24 flex flex-col justify-center"
                              onClick={() => document.getElementById("review-video-uploads")?.click()}
                            >
                              <span className="text-[11px] text-neutral-500 block font-medium leading-tight">
                                <span className="text-black font-bold underline">Add videos</span>
                              </span>
                              <span className="text-[9px] text-gray-400 font-mono block mt-1">MP4, MOV formats</span>
                              <input 
                                id="review-video-uploads"
                                type="file" 
                                multiple 
                                accept="video/*" 
                                className="hidden" 
                                onChange={handleVideoFileChange}
                              />
                            </div>

                            {/* Preview selected review videos waiting to upload */}
                            {newReviewVideos.length > 0 && (
                              <div className="flex gap-1.5 flex-wrap pt-2">
                                {newReviewVideos.map((b64, idx) => (
                                  <div key={idx} className="w-10 h-10 rounded-lg border border-neutral-250 overflow-hidden relative group aspect-square flex items-center justify-center bg-black">
                                    <video src={b64} className="w-full h-full object-cover pointer-events-none" />
                                    <div className="absolute inset-0 flex items-center justify-center text-white text-[8px] font-bold bg-black/40">🎬</div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSelectedVideo(idx)}
                                      className="absolute inset-0 bg-red-650/90 text-white text-[8px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Submit button */}
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white font-bold uppercase font-mono text-[10px] tracking-wider transition-colors shadow-sm rounded-lg"
                        >
                          Submit Supplemental Review
                        </button>
                      </form>
                    </div>

                    {/* Customer reviews listing */}
                    <div className="space-y-3.5">
                      <span className="text-xs font-bold text-neutral-900 block font-sans tracking-wide uppercase border-b border-neutral-250 pb-2">
                        Customer Opinions ({numReviews})
                      </span>

                      {reviewsList.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic">No reviews yet. Write a review to build this batch's metrics!</p>
                      ) : (
                        <div className="space-y-4">
                          {reviewsList.map((rev) => {
                            const isEditing = editingReviewId === rev.id;

                            return (
                              <div key={rev.id} className="bg-neutral-50/50 p-4 rounded-xl border border-neutral-200 space-y-2 flex flex-col justify-between shadow-xs">
                                <div>
                                  <div className="flex justify-between items-start gap-3">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-semibold text-gray-900 text-xs font-sans">
                                        {rev.name}
                                      </span>
                                      {rev.verified && (
                                        <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                                          Verified Purchase
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* Action buttons (inline editing or deleting reviews) */}
                                    <div className="flex items-center gap-2">
                                      {isEditing ? (
                                        <div className="flex gap-2">
                                          <button 
                                            type="button"
                                            onClick={() => handleSaveEdit(rev.id)}
                                            className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-emerald-600 hover:underline cursor-pointer"
                                          >
                                            Save
                                          </button>
                                          <button 
                                            type="button"
                                            onClick={() => setEditingReviewId(null)}
                                            className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-red-600 hover:underline cursor-pointer"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex gap-2.5">
                                          <button 
                                            type="button"
                                            onClick={() => {
                                              setEditingReviewId(rev.id);
                                              setEditingComment(rev.comment);
                                              setEditingRating(rev.rating);
                                            }}
                                            className="text-[10px] font-bold font-sans tracking-wide text-neutral-450 hover:text-black cursor-pointer"
                                          >
                                            Edit
                                          </button>
                                          <button 
                                            type="button"
                                            onClick={() => handleDeleteReview(rev.id)}
                                            className="text-[10px] font-bold font-sans tracking-wide text-neutral-450 hover:text-red-600 cursor-pointer"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Star row display */}
                                  {isEditing ? (
                                    <div className="flex gap-1 py-1">
                                      {[1, 2, 3, 4, 5].map((sn) => (
                                        <button 
                                          key={sn} 
                                          onClick={() => setEditingRating(sn)}
                                          type="button" 
                                          className="text-neutral-350 hover:scale-105 transition-transform"
                                        >
                                          <Star className={`w-4.5 h-4.5 ${sn <= editingRating ? "fill-[#FFCD00] text-[#FFCD00]" : "text-neutral-300"}`} />
                                        </button>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="flex text-[#FFCD00] py-0.5">
                                      {[...Array(5)].map((_, sIdx) => {
                                        const filled = sIdx < rev.rating;
                                        return (
                                          <Star key={sIdx} className={`w-3.5 h-3.5 ${filled ? "fill-current" : "text-neutral-300"}`} />
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Comment rendering */}
                                  {isEditing ? (
                                    <textarea 
                                      value={editingComment}
                                      onChange={(e) => setEditingComment(e.target.value)}
                                      rows={2}
                                      required
                                      className="w-full text-xs font-sans p-2 border border-neutral-300 bg-white rounded-lg mt-1 focus:outline-none focus:border-black text-neutral-900"
                                    />
                                  ) : (
                                    <p className="text-neutral-700 text-xs mt-1 font-sans italic">
                                      "{rev.comment}"
                                    </p>
                                  )}
                                </div>

                                {/* Review attachments gallery (images & videos) */}
                                {!isEditing && (
                                  <div className="flex gap-2 flex-wrap pt-1.5">
                                    {/* Images */}
                                    {rev.images && rev.images.map((snap, idx) => (
                                      <div key={`img-${idx}`} className="relative w-12 h-12 rounded-lg border border-neutral-150 overflow-hidden cursor-pointer hover:opacity-85 transition-opacity" onClick={() => setPreviewImageUrl(snap)}>
                                        <img 
                                          src={snap} 
                                          alt="review snap" 
                                          className="w-full h-full object-cover" 
                                          referrerPolicy="no-referrer"
                                        />
                                      </div>
                                    ))}
                                    {/* Videos */}
                                    {rev.videos && rev.videos.map((vid, idx) => (
                                      <div key={`vid-${idx}`} className="relative w-12 h-12 rounded-lg border border-neutral-150 overflow-hidden bg-black cursor-pointer hover:opacity-85 transition-opacity flex items-center justify-center" onClick={() => setPreviewImageUrl(vid)}>
                                        <video src={vid} className="w-full h-full object-cover pointer-events-none" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white font-bold text-[10px]">▶</div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <span className="text-[9px] font-mono font-bold text-neutral-400 self-end block mt-1 text-right">
                                  {rev.date}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Spacer for sticky bottom mobile bar layout context so no overlay overlapping */}
            <div className="h-20 sm:hidden w-full" />

          </div>
        </div>
        
      </div>      {/* STICKY "ADD TO CART" & "BUY NOW" BOTTOM CONTROLS ON MOBILE SCREENS ONLY */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md p-3 px-4 border-t border-neutral-200 flex items-center justify-between gap-4 shadow-[0_-5px_15px_rgba(0,0,0,0.06)] animate-slide-up select-none">
        <div className="flex flex-col text-left">
          <span className="text-[9px] text-neutral-400 uppercase font-mono tracking-wider">Net Amount</span>
          <span className="text-sm font-black text-[#111111] font-montserrat">
            Rs. {(product.price * detailQuantity).toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[8px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-1 py-0.5 rounded-none font-bold uppercase block w-fit mt-0.5">
              Save Rs. {((product.originalPrice - product.price) * detailQuantity).toLocaleString()}
            </span>
          )}
        </div>
        
        <div className="flex gap-2 flex-grow max-w-[240px]">
          {product.isSoldOut ? (
            <div className="flex gap-2 w-full">
              <button
                disabled
                className="flex-grow py-2.5 px-3 bg-neutral-200 text-neutral-400 font-bold rounded-lg text-xs uppercase tracking-wider text-center cursor-not-allowed"
              >
                Sold out
              </button>
              {onToggleWishlist && (
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className={`p-2.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                    isWishlisted
                      ? "bg-[#FFEBEB] text-red-600 border-red-300"
                      : "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50"
                  }`}
                  title={isWishlisted ? "Remove from Saved" : "Save for later"}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-600" : ""}`} />
                </button>
              )}
            </div>
          ) : (
            <button 
              type="button"
              onClick={() => {
                onAddToCart(getActiveVariantProduct(), detailQuantity);
                onClose();
              }}
              className="flex-1 bg-[#FFCD00] hover:bg-[#E2B600] text-black transition-colors py-3 px-3 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-black" strokeWidth={2.5} />
              <span>Add To Cart</span>
            </button>
          )}
        </div>
      </div>

      {/* Lightbox / Zoom-In Photo/Video overlay layer */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-fade-in">
          <button 
            type="button"
            onClick={() => setPreviewImageUrl(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
            title="Close attachment"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-4xl max-h-[85vh] flex items-center justify-center">
            {previewImageUrl.startsWith("data:video/") || previewImageUrl.endsWith(".mp4") || previewImageUrl.endsWith(".mov") ? (
              <video 
                src={previewImageUrl} 
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" 
                controls 
                autoPlay 
              />
            ) : (
              <img 
                src={previewImageUrl} 
                alt="enlarged review snap" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-none" 
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
}
