import React, { useState, useEffect, useRef } from "react";
import { Star, Check, Plus, X, Upload, Award } from "lucide-react";
import { TESTIMONIALS } from "../data";

export default function ReviewsSlider() {
  const [testimonials, setTestimonials] = useState(TESTIMONIALS);
  const [activeIndex, setActiveIndex] = useState(0);

  // Modal open & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const activeReview = testimonials[activeIndex];
  const prevIdx = activeIndex === 0 ? testimonials.length - 1 : activeIndex - 1;
  const nextIdx = activeIndex === testimonials.length - 1 ? 0 : activeIndex + 1;

  // Auto-play interval - change every 7 seconds, paused when modal is open
  useEffect(() => {
    if (isModalOpen) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [isModalOpen, testimonials.length]);

  // Swipe events
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Process selected file
  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setImagePreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Form submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    // Build the newly crafted testimonial item
    const newTestimonial = {
      id: `custom-rev-${Date.now()}`,
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: "Just now",
      statusVerified: true,
      imgUrl: imagePreview || "https://i.ibb.co/qw5FZw1/uy-NBmf-CIDi-mid.jpg", // default mock if empty
    };

    // Prepend the new testimonial to the list
    const updated = [newTestimonial, ...testimonials];
    setTestimonials(updated);
    
    // Focus the carousel immediately onto the user's gorgeous live review!
    setActiveIndex(0);

    // Show beautiful success message inside the modal
    setSubmittedMessage("Thank you! Your verified review is now live in the active review circle.");
    setTimeout(() => {
      setIsModalOpen(false);
      // Reset form states
      setName("");
      setRating(5);
      setComment("");
      setImagePreview(null);
      setSubmittedMessage("");
    }, 2500);
  };

  return (
    <section 
      id="reviews-slider-interactive" 
      className="bg-[#FAF9F6] py-16 border-t border-[#1A1A1A]/10 select-none overflow-hidden"
    >
      <div className="max-w-md sm:max-w-xl mx-auto px-4 flex flex-col items-center">
        
        {/* Dynamic Image Overlay Slider (Verified customer images holding supplements) */}
         <div 
          id="reviews-photo-carousel"
          className="w-full flex items-center justify-center gap-4 sm:gap-6 overflow-visible py-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left / Prev holding photo card */}
          <div 
            id={`review-photo-prev-${prevIdx}`}
            onClick={prevSlide}
            className="w-[95px] sm:w-[130px] aspect-[3/4] opacity-40 scale-90 translate-x-3 transition-all duration-500 rounded-[2rem] shrink-0 overflow-hidden cursor-pointer border border-[#1A1A1A]/10 shadow-sm relative group bg-neutral-100"
          >
            <img 
              src={testimonials[prevIdx].imgUrl} 
              alt="Previous customer report" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Center Active holding photo card */}
          <div 
            id={`review-photo-active-${activeIndex}`}
            className="w-[160px] sm:w-[210px] aspect-[3/4] opacity-100 scale-100 transition-all duration-500 rounded-[2.2rem] shrink-0 overflow-hidden shadow-lg border-2 border-white relative z-10 bg-white"
          >
            <img 
              src={activeReview.imgUrl} 
              alt="Active customer report" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right / Next holding photo card */}
          <div 
            id={`review-photo-next-${nextIdx}`}
            onClick={nextSlide}
            className="w-[95px] sm:w-[130px] aspect-[3/4] opacity-40 scale-90 -translate-x-3 transition-all duration-500 rounded-[2rem] shrink-0 overflow-hidden cursor-pointer border border-[#1A1A1A]/10 shadow-sm relative group bg-neutral-100"
          >
            <img 
              src={testimonials[nextIdx].imgUrl} 
              alt="Next customer report" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Elegant Testimonial Dialogue Box (Matches screenshot) */}
        <div 
          id="review-comment-card"
          className="w-full mt-6 bg-[#FAF2EC] rounded-[2.5rem] p-8 sm:p-10 border border-[#FAF2EC]/50 shadow-sm relative transition-all duration-500 hover:shadow-md"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Rating stars */}
          <div className="flex gap-1 justify-center mb-4">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star 
                key={s} 
                className={`w-5 h-5 ${
                  s < activeReview.rating 
                    ? "fill-[#E2B600] text-[#E2B600]" 
                    : "text-neutral-300"
                }`} 
              />
            ))}
          </div>

          {/* Opinionated real comment text */}
          <p className="text-center text-base sm:text-[17px] font-sans font-normal text-neutral-800 leading-relaxed tracking-tight max-w-sm mx-auto px-2">
            "{activeReview.comment}"
          </p>

          {/* Verified buyer name */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            <span className="w-4 h-4 rounded-full bg-neutral-600 flex items-center justify-center text-white shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[4.5]" />
            </span>
            <span className="text-sm font-semibold text-neutral-850 font-sans tracking-tight">
              {activeReview.name}
            </span>
          </div>
        </div>

        {/* Quotes element directly under the card */}
        <div id="review-decor-quote" className="flex justify-center mt-5">
          <svg className="w-10 h-10 text-[#8B6E51] opacity-40 rotate-180" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Carousel indicator dots */}
        <div id="reviews-slider-indicators" className="flex justify-center items-center gap-2 mt-4">
          {testimonials.map((_, idx) => (
            <button
              id={`review-indicator-dot-${idx}`}
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === activeIndex 
                  ? "w-8 h-1.5 bg-[#8B6E51]" 
                  : "w-1.5 h-1.5 bg-[#D1C7BD] hover:bg-[#A89A8C]"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* "Add Review" button below the indicators */}
        <div id="add-review-action-container" className="mt-8">
          <button
            id="add-review-trigger-btn"
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer bg-neutral-900 hover:bg-neutral-800 text-white font-sans text-xs font-bold tracking-wider px-6 py-3 rounded-full transition-all flex items-center gap-2 shadow-sm uppercase active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add a Review</span>
          </button>
        </div>

        {/* "Redefine Yourself" Bottom tagline */}
        <div id="reviews-tagline" className="mt-8 mb-4">
          <h4 className="text-[17px] font-sans font-black uppercase tracking-[0.1em] text-neutral-900 text-center select-none">
            Redefine Yourself
          </h4>
        </div>

      </div>

      {/* RATING FORM DIALOG OVERLAY (MODAL) */}
      {isModalOpen && (
        <div 
          id="add-review-modal-backdrop" 
          className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            id="add-review-modal-content"
            className="bg-[#FAF9F6] w-full max-w-md rounded-3xl border border-[#1A1A1A]/10 p-6 sm:p-8 shadow-xl relative animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              id="close-review-modal-btn"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedMessage ? (
              <div id="review-success-panel" className="py-12 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-14 h-14 bg-emerald-55/10 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-500/30">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-neutral-900 tracking-tight">Review Submitted Successfully!</h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-sans max-w-xs">{submittedMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div className="text-center">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8B6E51] font-bold block mb-1">
                    Authentic Supplement Logs
                  </span>
                  <h3 className="text-xl font-serif font-black text-[#1A1A1A] tracking-tight">
                    Share Your Journey
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                    Upload a physical update and tell the community how FitYatra has supported your daily workout goals.
                  </p>
                </div>

                {/* Rating selection */}
                <div className="space-y-1.5 flex flex-col items-center">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-widest font-sans">
                    Product Experience
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Star 
                          className={`w-7 h-7 transition-all ${
                            star <= rating 
                              ? "fill-[#E2B600] text-[#E2B600]" 
                              : "text-neutral-300"
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="reviewer-name" className="text-xs font-bold text-neutral-700 block uppercase tracking-wide">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="reviewer-name"
                    required
                    maxLength={35}
                    placeholder="e.g. Prashant M."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                {/* Comment */}
                <div className="space-y-1">
                  <label htmlFor="reviewer-comment" className="text-xs font-bold text-neutral-700 block uppercase tracking-wide">
                    Your Review
                  </label>
                  <textarea
                    id="reviewer-comment"
                    required
                    rows={3}
                    maxLength={200}
                    placeholder="Tell us about taste, recovery changes, or physical transformations..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900 transition-colors resize-none"
                  ></textarea>
                </div>

                {/* Drag-and-drop / select File Upload Area */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 block uppercase tracking-wide">
                    Journey Photo (Optional)
                  </label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 bg-white flex flex-col items-center justify-center gap-2 ${
                      dragActive 
                        ? "border-[#8B6E51] bg-[#FAF2EC]" 
                        : "border-neutral-300 hover:border-neutral-500"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {imagePreview ? (
                      <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-neutral-200">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                          }}
                          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 shadow-md hover:bg-red-700 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" />
                        <p className="text-xs font-sans text-neutral-600">
                          <span className="font-bold underline text-neutral-900">Click to upload</span> or drag and drop image here
                        </p>
                        <span className="text-[10px] text-neutral-400">PNG, JPG up to 5MB</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  className="cursor-pointer w-full bg-neutral-950 hover:bg-neutral-900 text-white font-sans text-xs font-black tracking-widest uppercase py-3 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Publish Verified Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
