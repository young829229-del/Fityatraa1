import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, CheckSquare, Sparkles, AlertCircle } from "lucide-react";
import { FAQS } from "../data";

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1"); // defaulted open first

  // Toggle expanded
  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Filter FAQs based on keyword search query
  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq-section" className="bg-[#FAFAFA] py-16 sm:py-20 border-t border-[#1A1A1A]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[black] uppercase block mb-1">
            VERIFIABLE POLICIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1A1A] tracking-tight text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-gray-550 mt-2 font-serif italic">
            Answers regarding our Nepal courier delivery, scratch barcode checklists, and product import origins.
          </p>
        </div>

        {/* Live Search accordion filter */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="w-4 h-4 text-gray-405 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs (e.g. shipping, original, Pokhara)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#1A1A1A]/20 rounded-none text-xs text-[#1A1A1A] focus:outline-none focus:border-[black] placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-450 hover:text-[black] text-[10px] font-mono uppercase font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Accordions Container */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 p-6 bg-white border border-[#1A1A1A]/10 rounded-none">
              <AlertCircle className="w-8 h-8 text-[black] mx-auto mb-2" />
              <p className="text-xs text-[#1A1A1A] font-bold">No answers match "{searchQuery}"</p>
              <p className="text-[10.5px] text-gray-400 mt-1">Please try searching words like 'Nepal', 'shipping', or 'scratch'.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border rounded-none border-[#1A1A1A]/10 overflow-hidden transition-all"
                >
                  {/* Trigger Header */}
                  <button
                    onClick={() => handleToggle(faq.id)}
                    className="cursor-pointer w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 text-[#1A1A1A] hover:bg-[#FAFAFA]/30"
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox square indicator matches screenshot */}
                      <CheckSquare className="w-4 h-4 text-[black] flex-shrink-0" />
                      <span className="text-sm font-serif text-[#1A1A1A] leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-450 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-450 flex-shrink-0" />
                    )}
                  </button>

                  {/* Panel Content sliding animation wrapper */}
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-gray-700 leading-relaxed border-t border-gray-100 bg-[#FAFAFA]/50">
                      <div className="p-4 bg-white border border-[#1A1A1A]/5 rounded-none font-sans text-gray-600">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}
