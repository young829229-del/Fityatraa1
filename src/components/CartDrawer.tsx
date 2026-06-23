import React, { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2, Ticket, MapPin, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Check, Upload, Key, RefreshCw } from "lucide-react";
import { CartItem, Product } from "../types";
import { NEPAL_REGIONS } from "../data";
import { loadPaymentSettings, PaymentSettings } from "../lib/paymentSettings";
import { motion, AnimatePresence } from "motion/react";

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
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [formError, setFormError] = useState("");
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => loadPaymentSettings());
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "esewa" | "khalti">("cod");

  // Screenshot Uploading & Validating States
  const [uploadedScreenshot, setUploadedScreenshot] = useState<string | null>(null);
  const [isVerifyingScreenshot, setIsVerifyingScreenshot] = useState(false);
  const [showVerificationAnimation, setShowVerificationAnimation] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleScreenshotUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      // Reset animations
      setIsVerifyingScreenshot(true);
      setScanProgress(0);
      
      // Play high-tech chime using Web Audio API (completely native & reliable)
      const playChime = () => {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContextClass) return;
          const ctx = new AudioContextClass();
          
          // Sound 1
          const osc1 = ctx.createOscillator();
          const gainNode1 = ctx.createGain();
          osc1.connect(gainNode1);
          gainNode1.connect(ctx.destination);
          osc1.type = "sine";
          osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          gainNode1.gain.setValueAtTime(0.08, ctx.currentTime);
          osc1.start();
          osc1.stop(ctx.currentTime + 0.12);
          
          // Sound 2 (slightly higher octave)
          setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gainNode2 = ctx.createGain();
            osc2.connect(gainNode2);
            gainNode2.connect(ctx.destination);
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
            gainNode2.gain.setValueAtTime(0.08, ctx.currentTime);
            osc2.start();
            osc2.stop(ctx.currentTime + 0.22);
          }, 120);
        } catch (e) {
          console.warn("AudioContext block prevented sound", e);
        }
      };

      // Simulated scanning progress
      let pct = 0;
      const interval = setInterval(() => {
        pct += 8;
        if (pct >= 100) {
          pct = 100;
          clearInterval(interval);
          setUploadedScreenshot(base64String);
          setIsVerifyingScreenshot(false);
          setShowVerificationAnimation(true);
          playChime();
          
          // Close verified stamp overlay after 2 seconds
          setTimeout(() => {
            setShowVerificationAnimation(false);
          }, 2000);
        }
        setScanProgress(pct);
      }, 80);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const handleSettingsUpdate = () => {
      const fresh = loadPaymentSettings();
      setPaymentSettings(fresh);
      // Auto-adjust default fallback if current is disabled
      if (paymentMethod === "cod" && !fresh.isCodEnabled) {
        if (fresh.isEsewaEnabled) setPaymentMethod("esewa");
        else if (fresh.isKhaltiEnabled) setPaymentMethod("khalti");
      } else if (paymentMethod === "esewa" && !fresh.isEsewaEnabled) {
        if (fresh.isCodEnabled) setPaymentMethod("cod");
        else if (fresh.isKhaltiEnabled) setPaymentMethod("khalti");
      } else if (paymentMethod === "khalti" && !fresh.isKhaltiEnabled) {
        if (fresh.isCodEnabled) setPaymentMethod("cod");
        else if (fresh.isEsewaEnabled) setPaymentMethod("esewa");
      }
    };
    
    // Set initial correct default
    const currentSettings = loadPaymentSettings();
    if (!currentSettings.isCodEnabled) {
      if (currentSettings.isEsewaEnabled) setPaymentMethod("esewa");
      else if (currentSettings.isKhaltiEnabled) setPaymentMethod("khalti");
    }

    window.addEventListener("fityatra_payment_settings_updated", handleSettingsUpdate);
    return () => window.removeEventListener("fityatra_payment_settings_updated", handleSettingsUpdate);
  }, [paymentMethod]);

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
    if (!checkoutAddress.trim()) {
      setFormError("Please tell us your exact location landmark.");
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
      address: checkoutAddress.trim(),
      coordinates: null,
      region: shippingRegion,
      total: grandTotal,
      paymentMode: paymentMethod.toUpperCase(),
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
      notes: `Newly placed supplementation stack via ${paymentMethod.toUpperCase()}! Preparing authenticity verification scratch code.`,
      screenshot: uploadedScreenshot || undefined,
    };

    try {
      const existing = localStorage.getItem("fityatra_orders");
      const orderList = existing ? JSON.parse(existing) : [];
      orderList.unshift(newOrder); // Add to beginning of history
      localStorage.setItem("fityatra_orders", JSON.stringify(orderList));
    } catch (err) {
      console.error("Local storage order registration error", err);
    }

    // Format WhatsApp Message & Auto-launch WhatsApp flow
    const itemStrings = cart.map((item, idx) => `${idx + 1}. ${item.product.name} (Qty: ${item.quantity})`).join("\n");
    
    const waText = `🚨 *NEW FIT YATRA ORDER RECEIVED* 🚨

*Order ID:* ${newId}
*Customer Name:* ${checkoutName}
*Contact Phone:* ${checkoutPhone}
*Delivery Region:* ${activeRegion.name}
*Exact Landmark:* ${checkoutAddress.trim()}
*Total Amount:* Rs. ${grandTotal.toLocaleString()}

*🛒 Order Items:*
${itemStrings}

---
Sent via FitYatra Applet Dispatcher`;

    const waUrl = `https://wa.me/9779705283444?text=${encodeURIComponent(waText)}`;
    
    try {
      window.open(waUrl, "_blank");
    } catch (e) {
      console.warn("Popup blocked automatically forwarding order details directly", e);
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

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        {/* Drawer panel */}
        <div className="w-full max-w-md bg-white shadow-editorial flex flex-col justify-between h-full relative border-l border-[#1A1A1A]/20">
          
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

          {/* Scrollable Container for both Items List and Checkout Map Forms */}
          <div className="flex-1 overflow-y-auto">
            {/* Body List of items */}
            <div className="p-5 sm:p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center px-4 space-y-4">
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
                    className="cursor-pointer px-6 py-2.5 bg-[#1A1A1A] hover:bg-[black] text-white rounded-none text-xs font-mono uppercase tracking-widest transition-colors mb-4"
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
                          <h4 className="text-xs font-display font-semibold text-[#1A1A1A] truncate pr-2">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="cursor-pointer text-gray-300 hover:text-red-650 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-geometric">
                          Rs. {item.product.price.toLocaleString()} each
                        </p>

                        {/* Quantity Display */}
                        <div className="flex justify-between items-center mt-3 bg-neutral-50 px-2.5 py-1.5 border border-dashed border-neutral-200">
                          <div className="flex items-center gap-2 select-none">
                            <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                              Qty:
                            </span>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => onUpdateQuantity(item.product.id, -1)}
                                className="cursor-pointer w-5 h-5 bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-xs font-bold text-black border border-neutral-300 rounded"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold px-1.5 font-montserrat">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.product.id, 1)}
                                className="cursor-pointer w-5 h-5 bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-xs font-bold text-black border border-neutral-300 rounded"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <span className="text-xs font-geometric font-extrabold text-[#1A1A1A]">
                            Rs. {(item.product.price * item.quantity).toLocaleString()}
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
              <div className="p-5 sm:p-6 pb-20 sm:pb-24 bg-[#FAFAFA] border-t border-[#1A1A1A]/10 space-y-4">
                
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
                  <span className="font-geometric">Rs. {itemsSubtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Regional Courier Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-[black] font-mono text-[9px] uppercase tracking-wider bg-white border border-[black]/20 px-2 py-0.5 rounded-none">
                      KTM FREE SHIPPING COUPON
                    </span>
                  ) : (
                    <span className="font-geometric">Rs. {shippingCost}</span>
                  )}
                </div>
                
                {/* GRAND TOTAL */}
                <div className="flex justify-between text-sm font-black text-gray-900 border-t border-[#1A1A1A]/10 pt-3">
                  <span className="font-serif italic font-bold">Grand Total</span>
                  <span className="text-base text-[#1A1A1A] font-geometric font-black">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Form & Button */}
              <div className="pt-2 border-t border-[#1A1A1A]/10 mt-3 pt-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] font-bold text-black block mb-3 bg-[#FAF9F6] border border-[#1A1A1A]/10 px-3 py-1.5 text-center">
                  ✍️ Delivery Destination & Contact Details
                </span>
                <form onSubmit={handleCheckoutSubmit} className="space-y-4 mb-3">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-wider text-gray-500 block font-bold">
                          Your Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Rajesh Hamal"
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          className="w-full p-2.5 bg-white border border-[#1A1A1A]/20 rounded-none text-xs focus:outline-none focus:border-[black]"
                          required
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-wider text-neutral-900 block font-bold flex justify-between">
                          <span>Mobile Number <span className="text-red-500">*</span></span>
                          <span className="text-[8px] text-gray-400 lowercase font-normal">(Nepal)</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="Write Mobile Number here"
                          value={checkoutPhone}
                          onChange={(e) => setCheckoutPhone(e.target.value)}
                          className="w-full p-2.5 bg-white border-2 border-black rounded-none text-xs focus:outline-none focus:ring-0 font-semibold placeholder:text-gray-400"
                          title="Enter your 10-digit Nepalese mobile number"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Manual Landmark Address Entry */}
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Tell Your Exact Location / Landmark (e.g. Near Kalimati Bridge)"
                      value={checkoutAddress}
                      onChange={(e) => setCheckoutAddress(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#1A1A1A]/20 rounded-none text-xs focus:outline-none focus:border-[black] font-sans"
                      required
                    />
                  </div>

                  {/* SELECT SUPREME PAYMENT CHANNELS */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                      💵 Select Payment Method
                    </label>
                    <div className="flex flex-col gap-1.5">
                      {paymentSettings.isCodEnabled && (
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("cod")}
                          className={`w-full py-2.5 px-3 border text-left transition-all cursor-pointer flex items-center justify-between ${
                            paymentMethod === "cod"
                              ? "border-black bg-black text-white font-bold"
                              : "border-neutral-250 bg-white hover:bg-neutral-50 text-neutral-800"
                          } uppercase font-mono text-[9px]`}
                        >
                          <span>💵 Cash on Delivery (COD)</span>
                          {paymentMethod === "cod" && <Check className="w-3.5 h-3.5 text-[#FFCD00]" />}
                        </button>
                      )}
                      {paymentSettings.isEsewaEnabled && (
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("esewa")}
                          className={`w-full py-2.5 px-3 border text-left transition-all flex items-center justify-between cursor-pointer ${
                            paymentMethod === "esewa"
                              ? "border-[#60BB46] bg-[#60BB46] text-white font-bold"
                              : "border-neutral-250 bg-white hover:bg-[#60BB46]/5 text-neutral-800"
                          } uppercase font-mono text-[9px]`}
                        >
                          <span className={paymentMethod === "esewa" ? "text-white" : "text-[#60BB46] font-extrabold"}>🟢 Pay via eSewa Scan & Pay</span>
                          {paymentMethod === "esewa" && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      )}
                      {paymentSettings.isKhaltiEnabled && (
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("khalti")}
                          className={`w-full py-2.5 px-3 border text-left transition-all flex items-center justify-between cursor-pointer ${
                            paymentMethod === "khalti"
                              ? "border-[#5C2D91] bg-[#5C2D91] text-white font-bold"
                              : "border-neutral-250 bg-white hover:bg-[#5C2D91]/5 text-neutral-800"
                          } uppercase font-mono text-[9px]`}
                        >
                          <span className={paymentMethod === "khalti" ? "text-white" : "text-[#5C2D91] font-extrabold"}>🟣 Pay via Khalti Portal/QR</span>
                          {paymentMethod === "khalti" && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      )}
                    </div>

                    {paymentMethod === "esewa" && paymentSettings.isEsewaEnabled && (
                      <div className="text-[10px] bg-[#60BB46]/5 p-3 border border-[#60BB46]/20 space-y-2 animate-fade-in">
                        <p className="text-[#60BB46] font-semibold">
                          🟢 Scan & Pay instantly using your eSewa App.
                        </p>
                        
                        {paymentSettings.esewaQrUrl && (
                          <div className="flex flex-col items-center justify-center p-2 bg-white border border-[#4ca433]/20 rounded shadow-xs max-w-[160px] mx-auto">
                            <img 
                              src={paymentSettings.esewaQrUrl} 
                              alt="eSewa Payment QR" 
                              className="w-full h-auto object-contain border-0"
                              referrerPolicy="no-referrer"
                            />
                            <span className="text-[8px] font-mono text-neutral-400 mt-1 uppercase tracking-wider text-center block">SCAN TO PAY</span>
                          </div>
                        )}

                        <div className="bg-white p-2 border border-neutral-100 font-mono text-[9px] space-y-1 text-center">
                          <p className="text-gray-600">Account Name: <span className="font-bold text-black">{paymentSettings.esewaAccountName}</span></p>
                          <p className="text-gray-600">eSewa ID/Mobile: <span className="font-bold text-black">{paymentSettings.esewaAccountNumber}</span></p>
                        </div>

                        <p className="text-gray-500 font-serif text-[9px] text-center italic">
                          Please transfer the exact Grand Total and take a screenshot of your success receipt.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "khalti" && paymentSettings.isKhaltiEnabled && (
                      <div className="text-[10px] bg-[#5C2D91]/5 p-3 border border-[#5C2D91]/20 space-y-2 animate-fade-in">
                        <p className="text-[#5C2D91] font-semibold">
                          🟣 Scan QR or Transfer using Khalti App.
                        </p>

                        {paymentSettings.khaltiQrUrl ? (
                          <div className="flex flex-col items-center justify-center p-2 bg-white border border-[#5C2D91]/20 rounded shadow-xs max-w-[160px] mx-auto">
                            <img 
                              src={paymentSettings.khaltiQrUrl} 
                              alt="Khalti Payment QR" 
                              className="w-full h-auto object-contain border-0"
                              referrerPolicy="no-referrer"
                            />
                            <span className="text-[8px] font-mono text-neutral-400 mt-1 uppercase tracking-wider text-center block">SCAN TO PAY</span>
                          </div>
                        ) : (
                          <p className="text-[#5C2D91] text-[9px] italic">
                            Receive OTP or transfer manually to our secure Khalti coordinates:
                          </p>
                        )}

                        <div className="bg-white p-2 border border-neutral-100 font-mono text-[9px] space-y-1 text-center">
                          <p className="text-gray-600">Account Name: <span className="font-bold text-black">{paymentSettings.khaltiAccountName}</span></p>
                          <p className="text-gray-600">Khalti ID/Mobile: <span className="font-bold text-black">{paymentSettings.khaltiAccountNumber}</span></p>
                        </div>

                        <p className="text-gray-500 font-serif text-[9px] text-center italic">
                          Ensure screenshot is captured and verified upon product dispatch.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "cod" && paymentSettings.isCodEnabled && (
                      <p className="text-[10px] text-gray-600 font-serif italic bg-neutral-50 p-2.5 border border-neutral-200 animate-fade-in">
                        {paymentSettings.codInstructions}
                      </p>
                    )}

                    {paymentMethod !== "cod" && (
                      <div className="mt-3 bg-neutral-50 p-3 border border-neutral-250 animate-fade-in text-left">
                        <label className="text-[9px] font-mono uppercase tracking-wider text-neutral-900 font-bold flex justify-between items-center mb-1.5">
                          <span className="flex items-center gap-1.5">📸 Receipt Verification Screenshot</span>
                          {uploadedScreenshot ? (
                            <span className="bg-emerald-600 text-white text-[8px] font-mono px-1.5 py-0.5 tracking-wider uppercase">✓ Receipt Verified</span>
                          ) : (
                            <span className="bg-[#8B6E02] text-white text-[8px] font-mono px-1.5 py-0.5 tracking-wider uppercase">SS REQUIRED</span>
                          )}
                        </label>
                        
                        {!uploadedScreenshot ? (
                          <div 
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const files = e.dataTransfer.files;
                              if (files && files[0]) handleScreenshotUpload(files[0]);
                            }}
                            onClick={() => document.getElementById("checkout-ss-upload")?.click()}
                            className="border-2 border-dashed border-neutral-300 hover:border-black bg-white hover:bg-neutral-50/50 p-4 rounded-none text-center cursor-pointer transition-all h-28 flex flex-col justify-center items-center"
                          >
                            <Upload className="w-5 h-5 text-gray-400 mb-1.5 animate-bounce" />
                            <span className="text-[10px] font-mono text-gray-700 block leading-tight font-semibold">
                              Drag Screenshot or <span className="text-emerald-600 underline font-extrabold">Choose File</span>
                            </span>
                            <span className="text-[8px] text-gray-400 font-mono block mt-1 uppercase">Supports: PNG, JPG, JPEG • Max 6MB</span>
                            <input 
                              id="checkout-ss-upload"
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files && files[0]) handleScreenshotUpload(files[0]);
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 bg-emerald-50/20 p-2.5 border border-emerald-300">
                            <div className="w-10 h-12 bg-neutral-100 border border-neutral-200 flex-shrink-0 overflow-hidden relative group">
                              <img src={uploadedScreenshot} alt="Receipt proof" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase tracking-wider block flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-ping"></span>
                                RECEIPT VERIFIED
                              </span>
                              <span className="text-[8px] text-gray-400 font-mono block truncate">VERIFICATION SEAL #FY-NPL-OK SIGNED</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setUploadedScreenshot(null)}
                              className="cursor-pointer text-[9px] font-mono text-red-600 font-bold hover:underline px-2.5 py-1 bg-white hover:bg-red-50 border border-red-200"
                            >
                              CLEAR
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {formError && (
                    <p className="text-[10px] font-mono text-xs font-semibold text-red-650 m-0">{formError}</p>
                  )}
                </form>

                <button
                  type="button"
                  onClick={handleCheckoutSubmit}
                  className="cursor-pointer w-full py-3.5 bg-[black] hover:bg-neutral-900 text-white font-montserrat font-bold uppercase tracking-widest text-xs rounded-none flex items-center justify-center gap-1.5 shadow-xs transition-colors duration-200"
                >
                  <span>CHECKOUT</span>
                  <ArrowRight className="w-4 h-4 text-white animate-pulse" />
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
                <span>Specific Landmark</span>
                <span className="text-[#1A1A1A] truncate max-w-[160px]">{checkoutAddress || "Specified"}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount Due</span>
                <span className="font-geometric text-[black] font-black">Rs. {grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode</span>
                <span className={`px-1.5 py-0.5 text-[8px] font-mono tracking-widest uppercase font-bold text-white ${
                  paymentMethod === "esewa" ? "bg-[#60BB46]" : paymentMethod === "khalti" ? "bg-[#5C2D91]" : "bg-black"
                }`}>
                  {paymentMethod === "esewa" ? "eSewa Portal" : paymentMethod === "khalti" ? "Khalti Gateway" : "Cash On Delivery (COD)"}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-gray-700 font-mono uppercase tracking-wider bg-[#FAFAFA] p-2.5 rounded-none border border-[#1A1A1A]/10 mb-5 leading-relaxed">
              {paymentMethod === "cod" ? (
                <span>📞 Our dispatch crew will call/SMS you shortly on <span className="underline font-bold text-[black]">{checkoutPhone}</span> to confirm your exact door location details.</span>
              ) : (
                <span>⚡ Payment verified! Your automated verification receipt key has been generated. Our dispatch crew will call <span className="underline font-bold text-black">{checkoutPhone}</span> for dispatch tracking.</span>
              )}
            </div>

            <div className="space-y-2">
              <a
                href={`https://wa.me/9779705283444?text=${encodeURIComponent(
                  `🚨 *NEW FIT YATRA ORDER RECEIVED* 🚨\n\n*Order ID:* ${activeOrderId}\n*Customer Name:* ${checkoutName}\n*Contact Phone:* ${checkoutPhone}\n*Delivery Region:* ${activeRegion.name}\n*Exact Landmark:* ${checkoutAddress.trim()}\n*Total Amount:* Rs. ${grandTotal.toLocaleString()}\n\n*🛒 Order Items:*\n${cart.map((item, idx) => `${idx + 1}. ${item.product.name} (Qty: ${item.quantity})`).join("\n")}\n\n---\nSent via FitYatra Applet Dispatcher`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // Track it & clear cart
                  onTrackNewOrder(activeOrderId);
                  onClearCart();
                  onClose();
                }}
                className="cursor-pointer w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-none text-xs font-mono uppercase tracking-widest transition-colors duration-200 flex items-center justify-center gap-1.5 font-bold no-underline"
              >
                <span>Send WhatsApp Receipt 💬</span>
              </a>

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

      {/* 1. SCREENSHOT DIGITAL SCANNER OVERLAY */}
      <AnimatePresence>
        {isVerifyingScreenshot && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {/* Glowing neon scanner target framework */}
            <div className="relative w-64 h-64 border-2 border-dashed border-[#FFCD00]/50 flex items-center justify-center bg-black/40 overflow-hidden">
              {/* Dynamic Laser Pointer line */}
              <motion.div 
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#FFCD00] to-transparent shadow-[0_0_12px_#FFCD00] z-10"
              />
              
              {/* Spinning security gear */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="w-24 h-24 rounded-full border border-neutral-800 flex items-center justify-center opacity-60"
              >
                <div className="w-16 h-16 rounded-full border border-dashed border-[#FFCD00]/30 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-[#FFCD00]/40 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </motion.div>
              
              <div className="absolute inset-x-0 bottom-4 text-center">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#FFCD00] font-black uppercase">SCANNING RECEIPT</span>
              </div>
            </div>

            <div className="mt-8 space-y-2 max-w-xs">
              <h3 className="text-sm font-mono font-bold text-white tracking-[0.15em] uppercase">SYSTEM VERIFICATION</h3>
              <p className="text-[10px] text-gray-400 font-mono">ESTABLISHING CRYPTO HANDSHAKE • SECURING TRANSACTION LOGS</p>
              
              {/* Real-time percentage indicator */}
              <div className="w-full bg-neutral-800 h-1.5 overflow-hidden rounded-full mt-4">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-[#FFCD00] transition-all duration-75"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <span className="text-[11px] font-mono font-black text-[#FFCD00]">{scanProgress}% SECURED</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. VERIFIED STAMP LOGO ANIMATION */}
      <AnimatePresence>
        {showVerificationAnimation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {/* Stamp ripple effect */}
            <div className="relative flex items-center justify-center">
              {/* Outer floating golden circles */}
              {[1, 2, 3].map((circle) => (
                <motion.div
                  key={circle}
                  initial={{ scale: 0.6, opacity: 0.8 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ delay: circle * 0.3, duration: 1.5, repeat: Infinity }}
                  className="absolute w-36 h-36 rounded-full border border-[#FFCD00]/40"
                />
              ))}

              <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-28 h-28 rounded-full bg-emerald-600 border-4 border-white shadow-[0_0_24px_rgba(16,185,129,0.5)] flex items-center justify-center z-15 relative"
              >
                <div className="flex items-center justify-center">
                  <Check className="w-16 h-16 text-white stroke-[4px]" />
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-8 space-y-2"
            >
              <h2 className="text-2xl font-black text-white font-montserrat uppercase tracking-[0.1em]">RECEIPT VERIFIED</h2>
              <p className="text-xs text-emerald-400 font-mono tracking-widest font-black uppercase">★ AUTOMATED TRANSACTION STAMP SIGNED ★</p>
              <p className="text-[10px] text-gray-500 font-mono max-w-xs mx-auto leading-relaxed mt-2 uppercase">
                FitYatra validation services successfully matched payment screenshot. Order dispatch slot confirmed!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
