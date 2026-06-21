import React, { useState, useEffect } from "react";
import { Dumbbell, Sparkles, SlidersHorizontal, Search, ArrowRight, ShieldCheck, Heart, Star, Navigation, MapPin, CheckCircle, TrendingUp, Truck } from "lucide-react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import FitnessAdvisor from "./components/FitnessAdvisor";
import ReviewsSlider from "./components/ReviewsSlider";
import FAQSection from "./components/FAQSection";
import ContactForm from "./components/ContactForm";
import OrderTracker from "./components/OrderTracker";

import { PRODUCTS } from "./data";
import { Product, CartItem } from "./types";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const persisted = localStorage.getItem("fityatra_active_cart");
      return persisted ? JSON.parse(persisted) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("fityatra_active_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  // Wishlist persistent storage state engine
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const persisted = localStorage.getItem("fityatra_saved_wishlist");
      return persisted ? JSON.parse(persisted) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("fityatra_saved_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist]);

  const [activeTab, setActiveTab] = useState<string>("home");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [catalogSearchQuery, setCatalogSearchQuery] = useState<string>("");
  const [directSearchId, setDirectSearchId] = useState<string>("");
  
  // Toggles draw models
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  // Success Notification banner
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Trigger Toast Notification
  const triggerToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  // Wishlist Action Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        triggerToast(`Removed ${product.brand} from saved wishlist`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (!product.isSoldOut) {
          triggerToast(`Wishlist saving is only available for out-of-stock products!`);
          return prev;
        }
        triggerToast(`Saved ${product.brand} to wishlist!`);
        return [...prev, product];
      }
    });
  };

  const handleRemoveFromWishlist = (product: Product) => {
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
    triggerToast(`Removed ${product.brand} from saved wishlist`);
  };

  // Add Supplement to Shopping Cart
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        triggerToast(`${product.brand} is already in your bag! (Limit 1 per supplement)`);
        return prevCart;
      }
      triggerToast(`Added ${product.brand} to your shopping bag!`);
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  // Alter Multiplier quantity inside cart drawer
  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove completely from cart drawer
  const handleRemoveCartItem = (productId: string) => {
    const itemToRemove = cart.find(i => i.product.id === productId);
    if (itemToRemove) {
      triggerToast(`Removed ${itemToRemove.product.brand} from bag`);
    }
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleLoadSavedCart = (items: CartItem[]) => {
    setCart(items);
    triggerToast("Successfully restored your saved cart!");
  };

  // Custom Navigation scrolling layout helper
  const handleSectionNavigation = (section: string) => {
    setActiveTab(section);
    if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (section === "shop") {
      const el = document.getElementById("catalog-showcase-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (section === "contact") {
      const el = document.getElementById("contact-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (section === "track") {
      const el = document.getElementById("order-tracking-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Filter products based on search or Category Tab
  const filteredProductsByFilters = PRODUCTS.filter((p) => {
    const matchCategory =
      activeCategoryFilter === "All" || p.category === activeCategoryFilter;
    const matchSearch =
      p.name.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(catalogSearchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes("@")) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      triggerToast("Signed up to FitYatra Fitness Bulletins!");
    }
  };

  return (
    <div className="bg-white text-black font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-black selection:text-white">
      
      {/* Sticky Top Header Navigation bar */}
      <Navbar
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        activeSection={activeTab}
        onNavigate={handleSectionNavigation}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Dynamic Slide Toast Notification Popup */}
      {successToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-black text-white border border-black font-mono text-[10px] font-bold px-5 py-3 rounded-none shadow-editorial flex items-center gap-2 animate-bounce uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-white animate-spin-slow" />
          <span>{successToast}</span>
        </div>
      )}

      {/* PRIMARY VIEWS LAYOUT CONTAINER */}
      <main className="flex-grow">
        
        {/* STUNNING HERO PORTRAIT BANNER (1080 x 1920 aspect ratio) */}
        <section className="relative w-full bg-zinc-950 flex flex-col justify-center overflow-hidden aspect-[9/16] sm:aspect-auto sm:h-[80vh] md:h-[90vh]">
          {/* Background image covering full bleed */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://i.ibb.co/DFnZ5Fy/Phone-Version-4-1-1-1.jpg"
              alt="FitYatra Background"
              className="w-full h-full object-cover object-top filter brightness-[0.85] contrast-[1.05]"
            />
            {/* Soft sophisticated dark fade at bottom and top to blend nicely */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
          </div>
        </section>



        {/* MOST LOVED PRODUCTS SECTIONS LAYOUT */}
        <section id="catalog-showcase-section" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section heading text */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-mono font-bold tracking-widest text-black uppercase block bg-white border border-[#1A1A1A]/10 px-3 py-1 rounded-none w-fit mx-auto mb-2">
              Authentic Supplement Range
            </span>
            <h2 className="text-2xl sm:text-3xl font-geometric font-semibold text-neutral-900 tracking-tight mb-2">
              Our Most Loved Products
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-geometric tracking-normal leading-relaxed max-w-sm sm:max-w-md mx-auto">
              Know what healthy people are consuming daily.
            </p>
          </div>



          {/* CATALOG GRID CARDS */}
          {filteredProductsByFilters.length === 0 ? (
            <div className="text-center py-16 p-8 bg-[#FAFAFA] border border-[#1A1A1A]/10 rounded-none max-w-md mx-auto">
              <Dumbbell className="w-10 h-10 text-gray-300 mx-auto mb-3 animate-pulse" />
              <h3 className="text-sm font-bold text-gray-750 font-display text-gray-900 tracking-tight">No supplements match your criteria</h3>
              <p className="text-xs text-gray-550 mt-1 max-w-sm mb-4 font-sans leading-relaxed">
                We're currently importing more premium protein isolates, creatine options, and workout boosters. Try searching other criteria or reset filters!
              </p>
              <button
                onClick={() => {
                  setActiveCategoryFilter("All");
                  setCatalogSearchQuery("");
                }}
                className="cursor-pointer px-4.5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white font-mono uppercase tracking-widest text-[10px] rounded-none transition-colors"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {filteredProductsByFilters.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={handleAddToCart}
                  onViewDetails={(p) => setSelectedProductDetails(p)}
                  isWishlisted={wishlist.some((w) => w.id === prod.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          )}

        </section>

        {/* PROMO BANNERS BELOW PRODUCTS */}
        <section className="bg-white border-y border-zinc-100 py-12 flex flex-col items-center justify-center w-full space-y-6">
          <div className="max-w-7xl mx-auto px-4 w-full flex flex-col items-center gap-6">
            <img
              src="https://i.ibb.co/VY559qC6/Fit-Yatra-2.png"
              alt="Fit Yatra Assurances"
              className="w-full h-auto object-contain max-w-5xl"
            />
            <img
              src="https://i.ibb.co/KcBDpGYD/MV2-1-1-1.jpg"
              alt="Additional Promo"
              className="w-full h-auto object-contain max-w-5xl"
            />
          </div>
        </section>

        {/* ORDER TRACKING DISPATCH STATION */}
        <OrderTracker
          directSearchId={directSearchId}
          onClearDirectSearch={() => setDirectSearchId("")}
        />

        {/* REVIEWS TESTIMONIALS SLIDER SECTION */}
        <ReviewsSlider />

        {/* ACCORDIONS FAQ SECTION CONTAINER */}
        <FAQSection />

        {/* CONTACT US FORM TICKET MODULE */}
        <ContactForm />

      </main>

      {/* FOOTER AREA LAYOUT */}
      <footer className="bg-black text-gray-400 pt-16 pb-8 border-t border-white/20 font-sans text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            
            {/* Box 1: Need Help links */}
            <div className="md:col-span-3 space-y-4">
              <h3 className="text-white font-bold uppercase tracking-widest text-[10px] mb-2 font-mono">
                Need Help?
              </h3>
              <ul className="space-y-2 text-gray-400 font-sans">
                <li>
                  <button
                    onClick={() => handleSectionNavigation("home")}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Home Index
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionNavigation("shop")}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Shop Supplement Packs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionNavigation("track")}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Track Nepal Order Status
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionNavigation("contact")}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Contact distributor Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsAdvisorOpen(true)}
                    className="hover:text-white transition-colors font-semibold text-gray-300 flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> AI Coach Advice
                  </button>
                </li>
              </ul>
            </div>

            {/* Box 2: Policies checklist */}
            <div className="md:col-span-3 space-y-4">
              <h3 className="text-white font-bold uppercase tracking-widest text-[10px] mb-2 font-mono">
                Policies & Terms
              </h3>
              <ul className="space-y-2 text-gray-400 font-sans">
                <li className="hover:text-white cursor-pointer select-none transition-colors">Nepal Shipping Policy</li>
                <li className="hover:text-white cursor-pointer select-none transition-colors">Refund & Return Protocol</li>
                <li className="hover:text-white cursor-pointer select-none transition-colors">Licensed Authenticity guarantee</li>
                <li className="hover:text-white cursor-pointer select-none transition-colors">Terms & Conditions</li>
                <li className="hover:text-white cursor-pointer select-none transition-colors">Privacy protection Policy</li>
              </ul>
            </div>

            {/* Box 3: Stay ahead newsletter subscription block */}
            <div className="md:col-span-6 space-y-4">
              <h3 className="text-white font-black uppercase tracking-widest text-[10px] block font-mono">
                Stay Ahead. Stay Strong.
              </h3>
              <p className="text-gray-400 max-w-sm leading-relaxed font-sans">
                Stop missing out. Join our exclusive gym email list for free access to limited custom import discount codes, bulk savings, and expert workout nutrition checklists.
              </p>

              {newsletterSubscribed ? (
                <div className="p-3 bg-white border border-gray-200 text-black font-bold rounded-none text-center max-w-sm flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest">
                  <CheckCircle className="w-3.5 h-3.5" /> Thank you! Signed up for FitYatra Fitness news.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2 max-w-sm">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-gray-500 block">We only send real updates, never spam.</span>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="My Email, e.g. hiker@gmail.com"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-700 p-2.5 rounded-none outline-none text-white text-xs focus:border-white font-sans"
                      required
                    />
                    <button
                      type="submit"
                      className="cursor-pointer bg-white hover:bg-gray-200 text-black font-mono border border-white hover:border-gray-200 uppercase tracking-widest px-5 text-[10px] py-2.5 rounded-none transition-colors duration-200"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

          <div className="h-px bg-[#1A1A1A] w-full mb-8 opacity-20" />

          {/* Simulated standard Nepal/international checkout visual cards */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Visual cards logo rows */}
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {/* Custom mock credit badges resembling global and Nepali payment models */}
              {["Visa", "MasterCard", "PayPal", "ApplePay", "GooglePay", "ShopPay", "eSewa", "Khalti", "COD"].map((pay) => (
                <span
                  key={pay}
                  className="bg-zinc-800 border border-zinc-700 font-mono text-[9px] text-white px-2 py-1 tracking-widest font-bold uppercase rounded-none"
                >
                  {pay}
                </span>
              ))}
            </div>

            {/* Copyright notes */}
            <div className="text-center md:text-right text-gray-500 text-[10px] font-sans leading-relaxed">
              <p>© 2026, FitYatra Nepal. Proudly Powered by Shrine. Direct import licensing verified.</p>
              <p className="mt-0.5">All manufacturer scratch validation barcodes are verified upon dispatch.</p>
            </div>

          </div>

        </div>
      </footer>

      {/* OVERLAY MODAL: Product Details Quick view Popup */}
      {selectedProductDetails && (
        <ProductDetailModal
          product={selectedProductDetails}
          onClose={() => setSelectedProductDetails(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={(prod, qty) => {
            handleAddToCart(prod, qty);
            setIsCartOpen(true);
          }}
          isWishlisted={wishlist.some((w) => w.id === selectedProductDetails.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* OVERLAY DRAWER: Shopping cart sidebar */}
      {isCartOpen && (
        <CartDrawer
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          onTrackNewOrder={(id) => {
            setDirectSearchId(id);
            handleSectionNavigation("track");
          }}
        />
      )}

      {/* OVERLAY DRAWER: Saved Wishlist sidebar */}
      {isWishlistOpen && (
        <WishlistDrawer
          onClose={() => setIsWishlistOpen(false)}
          wishlist={wishlist}
          onRemoveFromWishlist={handleRemoveFromWishlist}
          onAddToCart={handleAddToCart}
          onViewProductDetails={(p) => setSelectedProductDetails(p)}
        />
      )}

      {/* OVERLAY MODAL: Smart AI Advisor Questionnaire list */}
      {isAdvisorOpen && (
        <FitnessAdvisor
          onClose={() => setIsAdvisorOpen(false)}
          onAddProductToCart={(prod) => {
            handleAddToCart(prod);
          }}
        />
      )}

    </div>
  );
}
