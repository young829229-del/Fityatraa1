import React, { useState } from "react";
import { X, Plus, Minus, Trash2, Ticket, MapPin, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Check } from "lucide-react";
import { CartItem, Product } from "../types";
import { NEPAL_REGIONS } from "../data";

interface CartDrawerProps {
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onTrackNewOrder: (orderId: string) => void;
}

export default function CartDrawer({
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onTrackNewOrder,
}: CartDrawerProps) {
  const [shippingRegion, setShippingRegion] = useState("ktm");
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState("");
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [formError, setFormError] = useState("");

  // Calculate prices helper
  const itemsSubtotal = cart.reduce((sub, item) => sub + (item.product.price * item.quantity), 0);
  
  // Direct regional shipping costs
  const activeRegion = NEPAL_REGIONS.find((r) => r.id === shippingRegion) || NEPAL_REGIONS[0];
  
  // Free KTM shipping for orders > 3000
  const shippingCost = (shippingRegion === "ktm" && itemsSubtotal >= 3000) ? 0 : activeRegion.fee;
  
  const grandTotal = itemsSubtotal + shippingCost;

  // Submit Simulated checkout Order
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!checkoutName.trim()) {
      setFormError("Full Name is required.");
      return;
    }
    if (!checkoutPhone.trim()) {
      setFormError("Contact Phone Number is required.");
      return;
    }
    if (checkoutPhone.trim().length < 8) {
      setFormError("Please enter a valid Nepalese phone number.");
      return;
    }

    // Generate unique regional Nepalese order format ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `FY-${shippingRegion.toUpperCase()}-${randomNum}`;
    setActiveOrderId(newId);

    // Save and register into fityatra_orders localStorage
    const newOrder = {
      id: newId,
      name: checkoutName,
      phone: checkoutPhone,
      region: shippingRegion,
      total: grandTotal,
      items: cart.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
      })),
      status: "placed",
      createdAt: new Date().toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      shippingPartner: shippingRegion === "ktm" ? "Upaya CityCargo Partner" : "Nepal Can Move (NCM)",
      notes: "Newly placed supplementation stack! Preparing authenticity verification scratch code.",
    };

    try {
      const existing = localStorage.getItem("fityatra_orders");
      const orderList = existing ? JSON.parse(existing) : [];
      orderList.unshift(newOrder); // Add to beginning of history
      localStorage.setItem("fityatra_orders", JSON.stringify(orderList));
    } catch (err) {
      console.error("Local storage order registration error", err);
    }

    // Success state
    setShowCheckoutSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer panel */}
        <div className="w-screen max-w-md bg-white shadow-editorial flex flex-col justify-between h-full relative border-l border-[#1A1A1A]/20">
          
          {/* Header Panel */}
          <div className="p-5 sm:p-6 border-b border-[#1A1A1A]/10 flex items-center justify-between bg-[#FAFAFA]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[black]" />
              <h2 className="text-base font-serif italic font-black text-[#1a1a1a]">My Shopping Bag</h2>
              <span className="bg-[black] text-white text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider">
                {cart.reduce((ct, item) => ct + item.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer p-1.5 hover:bg-[#1A1A1A]/5 rounded-none text-gray-500 hover:text-[#1A1A1A] transition-colors border border-transparent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body List of items */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-4/5 flex flex-col items-center justify-center text-center px-4 space-y-4">
                <div className="w-16 h-16 rounded-none bg-[#FAFAFA] flex items-center justify-center text-gray-400 border border-[#1A1A1A]/10">
                  <ShoppingBag className="w-6 h-6 text-[black]" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-black text-[#1A1A1A] uppercase tracking-wide">Your bag is empty</h3>
                  <p className="text-xs text-gray-500 mt-1.5 max-w-xs leading-relaxed">
                    Explore our top loved products and supplements to kickstart your physical progress today!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="cursor-pointer px-6 py-2.5 bg-[#1A1A1A] hover:bg-[black] text-white rounded-none text-xs font-mono uppercase tracking-widest transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3.5 p-3 rounded-none border border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30 transition-colors bg-white relative"
                  >
                    {/* Clear Product Image */}
                    <div 
                      id={`cart-item-img-container-${item.product.id}`}
                      className="w-16 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-[#1A1A1A]/10 p-1 overflow-hidden"
                    >
                      {item.product.image && item.product.image.startsWith("http") ? (
                        <img 
                          id={`cart-item-img-${item.product.id}`}
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-12 bg-[#1A1A1A] border border-zinc-800 rounded shadow-xs relative flex flex-col justify-between p-0.5">
                          <span className="text-[5px] text-[#FFCD00] text-center leading-none mt-1 font-bold uppercase">SUPP</span>
                        </div>
                      )}
                    </div>

                    {/* Meta info & Quantifier */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-1.5">
                        <h4 className="text-xs font-serif font-bold text-[#1A1A1A] truncate pr-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="cursor-pointer text-gray-300 hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                        Rs. {item.product.price.toLocaleString()} each
                      </p>

                      {/* Quantity Display */}
                      <div className="flex justify-between items-center mt-3 bg-neutral-50 px-2.5 py-1.5 border border-dashed border-neutral-200">
                        <span className="text-[10px] uppercase font-mono font-bold text-emerald-600 block">
                          Quantity: 1 (Client Quota)
                        </span>
                        <span className="text-xs font-sans font-extrabold text-[#1A1A1A]">
                          Rs. {item.product.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Calculations and promo cards */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#FAFAFA] border-t border-[#1A1A1A]/10 space-y-4">
              
              {/* Local Nepal Shipping Region selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[black]" /> Choose Nepal Delivery Zone
                </label>
                <select
                  value={shippingRegion}
                  onChange={(e) => setShippingRegion(e.target.value)}
                  className="w-full p-2 bg-white border border-[#1A1A1A]/20 rounded-none text-xs text-gray-800 focus:outline-none focus:border-[black]"
                >
                  {NEPAL_REGIONS.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name} (+Rs. {region.fee})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 font-mono italic">
                  EST. DELIVERY TIME: {activeRegion.estimate.toUpperCase()}
                </p>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 text-xs text-gray-650 pt-3.5 border-t border-[#1A1A1A]/10 font-sans">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">Rs. {itemsSubtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Regional Courier Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-[black] font-mono text-[9px] uppercase tracking-wider bg-white border border-[black]/20 px-2 py-0.5 rounded-none">
                      KTM FREE SHIPPING COUPON
                    </span>
                  ) : (
                    <span className="font-mono">Rs. {shippingCost}</span>
                  )}
                </div>
                
                {/* GRAND TOTAL */}
                <div className="flex justify-between text-sm font-black text-gray-900 border-t border-[#1A1A1A]/10 pt-3">
                  <span className="font-serif italic font-bold">Grand Total</span>
                  <span className="text-base text-[#1A1A1A] font-serif font-black">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Form & Button */}
              <div className="pt-2">
                <form onSubmit={handleCheckoutSubmit} className="space-y-2 mb-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="My Full Name"
                      value={checkoutName}
                      onChange={(e) => setCheckoutName(e.target.value)}
                      className="p-2.5 bg-white border border-[#1A1A1A]/20 rounded-none text-xs focus:outline-none focus:border-[black]"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="e.g. 98510..."
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      className="p-2.5 bg-white border border-[#1A1A1A]/20 rounded-none text-xs focus:outline-none focus:border-[black]"
                      required
                    />
                  </div>
                  {formError && (
                    <p className="text-[10px] font-mono text-xs font-semibold text-red-650 m-0">{formError}</p>
                  )}
                </form>

                <button
                  type="button"
                  onClick={handleCheckoutSubmit}
                  className="cursor-pointer w-full py-3.5 bg-[black] hover:bg-[#1A1A1A] text-white font-mono uppercase tracking-widest text-xs rounded-none flex items-center justify-center gap-1.5 shadow-xs transition-colors duration-200"
                >
                  <span>Lock & Dispatch My Order</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="text-center pt-1 border-t border-[#1A1A1A]/5">
                <span className="text-[9px] text-gray-400 font-mono uppercase tracking-wider flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[black]" />
                  Every FitYatra supplement includes custom authentication codes.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Success simulated Modal */}
      {showCheckoutSuccess && (
        <div className="fixed inset-0 z-55 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-none max-w-sm w-full p-6 text-center shadow-editorial relative border border-[#1A1A1A]/20 animate-scale-up">
            <div className="w-14 h-14 rounded-none bg-[#FAFAFA] border border-[#1A1A1A]/10 flex items-center justify-center mx-auto mb-4 text-[black]">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-black text-gray-900 uppercase tracking-tight">Order Lock success!</h3>
            <p className="text-xs text-gray-550 mt-2 font-sans leading-relaxed">
              Namaste <span className="font-bold text-[#1A1A1A]">{checkoutName}</span>, your supplementation order has been registered securely.
            </p>

            <div className="bg-[#FAFAFA] rounded-none p-4 my-4 text-left text-xs border border-[#1A1A1A]/10 font-mono space-y-1.5 text-gray-650">
              <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-1.5 mb-1.5 font-bold">
                <span className="text-[#1a1a1a]">FITYATRA INVOICE</span>
                <span className="font-sans text-[black] font-black">{activeOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Destination Area</span>
                <span className="text-[#1A1A1A] capitalize truncate max-w-[160px]">{activeRegion.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount Due</span>
                <span className="font-sans text-[black] font-black">Rs. {grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode</span>
                <span className="bg-[#1A1A1A] text-[#FAFAFA] px-1.5 py-0.5 text-[8px] font-mono tracking-widest uppercase font-bold">CASH ON DELIVERY (COD)</span>
              </div>
            </div>

            <div className="text-[10px] text-gray-700 font-mono uppercase tracking-wider bg-[#FAFAFA] p-2.5 rounded-none border border-[#1A1A1A]/10 mb-5 leading-relaxed">
              📞 Our dispatch crew will call/SMS you shortly on <span className="underline font-bold text-[black]">{checkoutPhone}</span> to confirm your exact door location details.
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onTrackNewOrder(activeOrderId);
                  onClearCart();
                  onClose();
                }}
                className="cursor-pointer w-full py-3 bg-[black] hover:bg-neutral-800 text-white rounded-none text-xs font-mono uppercase tracking-widest transition-colors duration-200 flex items-center justify-center gap-1.5"
              >
                <span>Track This Order Live 🚚</span>
              </button>
              <button
                onClick={() => {
                  setShowCheckoutSuccess(false);
                  onClearCart();
                  onClose();
                }}
                className="cursor-pointer w-full py-2 bg-white text-gray-550 hover:text-black border border-gray-300 rounded-none text-[10px] font-mono uppercase tracking-widest transition-colors duration-200"
              >
                Continue Fitness Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
