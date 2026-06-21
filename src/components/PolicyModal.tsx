import React from "react";
import { X, Truck, RotateCcw, ShieldCheck, FileText, Lock } from "lucide-react";

interface PolicyModalProps {
  policyType: "shipping" | "refund" | "authenticity" | "terms" | "privacy" | null;
  onClose: () => void;
}

export default function PolicyModal({ policyType, onClose }: PolicyModalProps) {
  if (!policyType) return null;

  const renderContent = () => {
    switch (policyType) {
      case "shipping":
        return (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center text-black">
                <Truck className="w-5 h-5 text-[#FFCD00]" />
              </div>
              <div>
                <h3 className="font-montserrat font-extrabold uppercase tracking-widest text-[#111111] text-xs">
                  Nepal Shipping Policy
                </h3>
                <p className="text-[10px] text-gray-500 font-mono">
                  FitYatra Supercharged Deliveries across all provinces
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-650 leading-relaxed font-sans">
              At FitYatra, we're dedicated to providing <strong className="text-black font-semibold">100% authentic supplements</strong> right to your doorstep with promptness and care.
            </p>

            <div className="space-y-4">
              {/* Delivery Time */}
              <div className="p-4 border border-neutral-100 bg-neutral-50/50 space-y-2">
                <h4 className="text-2xs uppercase tracking-wider font-mono font-bold text-black flex items-center gap-1.5">
                  <span>📦</span> Delivery Time
                </h4>
                <ul className="space-y-1.5 pl-6 text-xs text-gray-600 list-disc leading-relaxed font-sans">
                  <li>
                    <strong className="text-black">Inside Kathmandu Valley:</strong> Very next day
                  </li>
                  <li>
                    <strong className="text-black">Outside Valley (All Provinces):</strong> 12–48 Hours
                  </li>
                </ul>
                <div className="bg-[#FFCD00]/10 border-l-2 border-[#FFCD00] p-2 text-[10px] font-mono text-neutral-800">
                  Tip: Place your order before 12 PM for the fastest delivery
                </div>
              </div>

              {/* Shipping Cost */}
              <div className="p-4 border border-neutral-100 bg-neutral-50/50 space-y-2">
                <h4 className="text-2xs uppercase tracking-wider font-mono font-bold text-black flex items-center gap-1.5">
                  <span>💸</span> Shipping Cost
                </h4>
                <ul className="space-y-1.5 pl-6 text-xs text-gray-600 list-disc leading-relaxed font-sans">
                  <li>
                    <strong className="text-black">Inside Kathmandu Valley:</strong> Rs. 120
                  </li>
                  <li>
                    <strong className="text-black">Outside Kathmandu Valley:</strong> Rs. 180
                  </li>
                </ul>
                <p className="text-[11px] text-gray-500 font-sans leading-relaxed pt-1 border-t border-neutral-100">
                  <strong className="text-black font-semibold">Free Shipping:</strong> Complimentary shipping across the nation for orders over Rs. 4,499 or when purchasing multiple items – No hidden fees.
                </p>
              </div>

              {/* Tracking */}
              <div className="p-4 border border-neutral-100 bg-neutral-50/50 space-y-1.5">
                <h4 className="text-2xs uppercase tracking-wider font-mono font-bold text-black flex items-center gap-1.5">
                  <span>📬</span> Tracking
                </h4>
                <p className="text-xs text-gray-600 font-sans leading-relaxed">
                  Customers who provide their email address during the checkout process will receive tracking numbers.
                </p>
              </div>

              {/* Delivery Days */}
              <div className="p-4 border border-neutral-100 bg-neutral-50/50 space-y-1.5">
                <h4 className="text-2xs uppercase tracking-wider font-mono font-bold text-black flex items-center gap-1.5">
                  <span>📅</span> Delivery Days
                </h4>
                <p className="text-xs text-gray-600 font-sans leading-relaxed">
                  We are available 24/7 except during major festivals.
                </p>
              </div>
            </div>
          </div>
        );

      case "refund":
        return (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center text-black">
                <RotateCcw className="w-5 h-5 text-[#FFCD00]" />
              </div>
              <div>
                <h3 className="font-montserrat font-extrabold uppercase tracking-widest text-[#111111] text-xs">
                  Refund & Return Protocol
                </h3>
                <p className="text-[10px] text-gray-500 font-mono">
                  100% money-back and buyer satisfaction guarantees
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-650 leading-relaxed font-sans">
              We stand solid behind every imported batch. If you are not completely satisfied with your supplement purchase, we support returns under the following protocol.
            </p>

            <div className="space-y-4">
              <div className="p-4 border border-neutral-100 bg-neutral-50/50 space-y-1.5">
                <h4 className="text-2xs uppercase tracking-wider font-mono font-bold text-black">
                  🛡️ 7-Day Hassle-Free Window
                </h4>
                <p className="text-xs text-gray-650 font-sans leading-relaxed">
                  Unopened products with original double inner/outer heat seals intact can be returned within 7 days of doorstep courier delivery. No questions asked.
                </p>
              </div>

              <div className="p-4 border border-neutral-100 bg-neutral-50/50 space-y-1.5">
                <h4 className="text-2xs uppercase tracking-wider font-mono font-bold text-black">
                  💊 Authentic Scratch-Code Inspection
                </h4>
                <p className="text-xs text-gray-650 font-sans leading-relaxed">
                  Before peeling or scratching security labels, ensure the product is what you need. If any verification displays pre-used tokens, contact our distributor command instantly for replacement.
                </p>
              </div>

              <div className="p-4 border border-neutral-100 bg-neutral-50/50 space-y-1.5">
                <h4 className="text-2xs uppercase tracking-wider font-mono font-bold text-black">
                  📦 Return Courier Charges
                </h4>
                <p className="text-xs text-gray-650 font-sans leading-relaxed">
                  For sizing mistakes or product preference changes, customers cover the replacement courier fee (Rs. 120 Inside Valley, Rs. 180 Outside Valley). If an incorrect item was dispatched, shipment is completely free!
                </p>
              </div>
            </div>
          </div>
        );

      case "authenticity":
        return (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center text-black">
                <ShieldCheck className="w-5 h-5 text-[#FFCD00]" />
              </div>
              <div>
                <h3 className="font-montserrat font-extrabold uppercase tracking-widest text-[#111111] text-xs">
                  Licensed Authenticity Guarantee
                </h3>
                <p className="text-[10px] text-gray-500 font-mono">
                  Double check scratch-codes on every supplement
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-650 leading-relaxed font-sans">
              Fake supplements compromise health and performance. Under the FitYatra guarantee, we fight fakes fiercely so you can consume with absolute reassurance.
            </p>

            <div className="space-y-4">
              <div className="p-4 border border-neutral-200 bg-[#FFCD00]/5 space-y-1.5">
                <h4 className="text-2xs uppercase tracking-wider font-mono font-bold text-[#E2B600]">
                  🎯 Double Money-Back pledge
                </h4>
                <p className="text-xs text-gray-650 font-sans leading-relaxed">
                  We verify each batch with official laboratory certificates. If any supplement bought from us is analyzed and proven counterfeit, we will return <strong className="text-black">double your purchase amount</strong> instantly.
                </p>
              </div>

              <div className="p-4 border border-neutral-100 bg-neutral-50/50 space-y-1.5">
                <h4 className="text-2xs uppercase tracking-wider font-mono font-bold text-black">
                  📲 Brand SMS Scratch Codes
                </h4>
                <p className="text-xs text-gray-655 font-sans leading-relaxed">
                  Every product is complete with manufacturer hologram scratch tags. Scratch to reveal the unique voucher code, then SMS or enter online to confirm authenticity on official partner domains.
                </p>
              </div>

              <div className="p-4 border border-neutral-100 bg-neutral-50/50 space-y-1.5">
                <h4 className="text-2xs uppercase tracking-wider font-mono font-bold text-black">
                  🚢 Certified Importer Batches
                </h4>
                <p className="text-xs text-[#555555] font-sans leading-relaxed">
                  We deal exclusively with authorized national supplement importers (e.g., Muscle House, Bright Commodities, etc.) meaning everything is customs cleared, legal, and safely stored in climate-secure warehouses.
                </p>
              </div>
            </div>
          </div>
        );

      case "terms":
        return (
          <div className="space-y-5">
            <div className="pb-4 border-b border-neutral-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center text-black">
                <FileText className="w-5 h-5 text-[#FFCD00]" />
              </div>
              <div>
                <h3 className="font-montserrat font-extrabold uppercase tracking-widest text-[#111111] text-xs">
                  Terms & Conditions
                </h3>
                <p className="text-[10px] text-gray-500 font-mono">
                  Usage terms, fitness liabilities, and purchasing agreements
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-650 leading-relaxed font-sans">
              Welcome to the FitYatra Storefront. By accessing our portal, you are agreeing to the following terms of trade:
            </p>

            <div className="space-y-3.5 text-xs text-gray-600 font-sans leading-relaxed">
              <p>
                <strong className="text-black block text-2xs uppercase tracking-wider font-mono">1. Dosage & Health Liability</strong>
                Supplements are intended as nutritional support. We recommend talking to your sports coach or doctor before starting high-stimulant pre-workouts or heavy creatine regimens, especially if pre-existing health conditions exist.
              </p>
              <p>
                <strong className="text-black block text-2xs uppercase tracking-wider font-mono">2. Correct Delivery Details</strong>
                Ensure that your address information is precise. When checkout maps are set incorrectly, dispatch delays will occur. FitYatra is not responsible for failed handoffs resulting from false mobile numbers.
              </p>
              <p>
                <strong className="text-black block text-2xs uppercase tracking-wider font-mono">3. Storefront Price Fluctuations</strong>
                NPR pricing fluctuates based on global customs rates, container shipping logistics, and importer pricing. We guarantee that checkout totals at purchase time will stay strictly unmodified.
              </p>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-5">
            <div className="pb-4 border-b border-neutral-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center text-black">
                <Lock className="w-5 h-5 text-[#FFCD00]" />
              </div>
              <div>
                <h3 className="font-montserrat font-extrabold uppercase tracking-widest text-[#111111] text-xs">
                  Privacy Protection Policy
                </h3>
                <p className="text-[10px] text-gray-500 font-mono">
                  Your delivery coordinates and contacts are always safe
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-650 leading-relaxed font-sans">
              We respect your security. We do not track you, nor do we compromise your private information for commercial purposes.
            </p>

            <div className="space-y-4 text-xs text-gray-600 font-sans leading-relaxed">
              <div className="p-4 border border-neutral-100 bg-neutral-50/50 space-y-1.5">
                <h4 className="text-2xs uppercase tracking-wider font-mono font-bold text-black font-semibold">
                  📞 Minimal Information Handling
                </h4>
                <p className="text-xs text-gray-650">
                  We request only your delivery location, telephone number, and payment ID. This data is transmitted securely to our delivery service dispatchers and nothing else.
                </p>
              </div>
              <div className="p-4 border border-neutral-100 bg-neutral-50/50 space-y-1.5">
                <h4 className="text-2xs uppercase tracking-wider font-mono font-bold text-black font-semibold">
                  🍪 No Commercial Tracking
                </h4>
                <p className="text-xs text-gray-650">
                  Cookies are used temporarily on your device solely to persist your local wishlist, checkout cart collection, and navigation steps. No advertisement retargeters reside within our code.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white border border-neutral-300 w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-none hover:bg-neutral-100 text-gray-400 hover:text-black transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {renderContent()}

        {/* Footnotes */}
        <div className="mt-6 pt-4 border-t border-dashed border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer py-1.5 px-4 bg-black hover:bg-neutral-900 text-white font-mono uppercase font-bold text-[10px] tracking-wider transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
