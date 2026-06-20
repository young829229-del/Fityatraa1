import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle, Sparkles, Quote } from "lucide-react";
import { TESTIMONIALS } from "../data";

export default function ReviewsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const activeReview = TESTIMONIALS[activeIndex];

  // Visual dynamic progress pictures from Unsplash for our transformation grid
  const TRANSFORMATION_PHOTOS = [
    { url: "https://i.ibb.co/qw5FZw1/uy-NBmf-CIDi-mid.jpg", alt: "Review 1" },
    { url: "https://i.ibb.co/fdGvD3RT/Hvp7i-Ea-KZK-mid.jpg", alt: "Review 2" },
    { url: "https://i.ibb.co/cBJttkW/v-Xhcyrn-t-mid.jpg", alt: "Review 3" },
    { url: "https://i.ibb.co/Nhd3x42/Uo-Wj-N3l8w-T-mid.jpg", alt: "Review 4" },
    { url: "https://i.ibb.co/JRrXwzFQ/Xgaq-G2-Kisw-mid.jpg", alt: "Review 5" },
    { url: "https://i.ibb.co/VcfsNbjv/H17n-An-Xqr-mid.jpg", alt: "Review 6" },
    { url: "https://i.ibb.co/6RzBr2gh/iknqick-Uc-mid.jpg", alt: "Review 7" }
  ];

  return (
    <section className="bg-white py-16 sm:py-20 border-t border-[#1A1A1A]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title center */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-[10px] font-mono font-bold text-[black] tracking-widest uppercase block mb-2">
            PHYSICAL TRUTH & AUDITS
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1A1A] tracking-tight">
            Nepal Progress Audits
          </h2>
          <p className="text-xs sm:text-sm text-gray-550 italic font-serif mt-2">
            Real customer progress reports, verified directly via brand authenticity scratch logs.
          </p>
        </div>

        {/* Combined Layout view */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive detailed sliding Review Bubble */}
          <div className="lg:col-span-4 bg-[#FAFAFA] border border-[#1A1A1A]/10 rounded-none p-6 sm:p-8 relative flex flex-col justify-between min-h-[300px]">
            {/* Quote Icon decorative backdrop */}
            <Quote className="w-14 h-14 text-[black]/10 absolute top-4 left-4" />

            <div>
              {/* Rating stars */}
              <div className="flex gap-1 mb-4 relative z-10">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-[black] text-[black]" />
                ))}
              </div>

              {/* Comment text */}
              <p className="text-[13.5px] font-serif tracking-tight text-[#1A1A1A] italic leading-relaxed min-h-[105px] relative z-10">
                "{activeReview.comment}"
              </p>
            </div>

            {/* Author Profile section */}
            <div className="flex items-center justify-between border-t border-[#1A1A1A]/10 pt-5 mt-4">
              <div className="flex items-center gap-3">
                {activeReview.imgUrl && (
                  <img
                    src={activeReview.imgUrl}
                    alt={activeReview.name}
                    className="w-10 h-10 rounded-none border border-[#1A1A1A]/10 pointer-events-none object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <h4 className="text-xs font-serif font-bold text-[#1A1A1A] flex items-center gap-1">
                    {activeReview.name}
                    <CheckCircle className="w-3.5 h-3.5 text-[black]" />
                  </h4>
                  <p className="text-[9px] font-mono text-gray-400 uppercase">{activeReview.date}</p>
                </div>
              </div>

              {/* Sliders navigation controls buttons */}
              <div className="flex gap-1.5">
                <button
                  onClick={prevSlide}
                  className="cursor-pointer p-1.5 bg-[#1A1A1A] hover:bg-[black] text-white border border-[#1A1A1A] rounded-none transition-colors"
                  title="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="cursor-pointer p-1.5 bg-[#1A1A1A] hover:bg-[black] text-white border border-[#1A1A1A] rounded-none transition-colors"
                  title="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dots identifier - Typewriter line marks */}
            <div className="flex justify-center gap-1 mt-4 absolute bottom-6 right-8">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-[2px] transition-all duration-200 ${
                    idx === activeIndex ? "w-4 bg-[black]" : "w-1.5 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: High Quality Transformation Visual Grid */}
          <div className="lg:col-span-8 flex overflow-x-auto gap-3.5 pb-2 snap-x snap-mandatory">
            {TRANSFORMATION_PHOTOS.map((ph, index) => (
              <div
                key={index}
                className="group shrink-0 w-48 sm:w-56 relative overflow-hidden rounded-none aspect-[3/4] border border-[#1A1A1A]/10 transition-transform duration-300 snap-start"
              >
                <img
                  src={ph.url}
                  alt={ph.alt}
                  className="w-full h-full object-cover transition-transform duration-500 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                {/* Visual amber gradient cover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                  <span className="text-[9px] font-mono text-white tracking-widest flex items-center gap-1.5 leading-none">
                    <Sparkles className="w-3 h-3 text-[white] animate-pulse" /> VERIFIED BATCH
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
