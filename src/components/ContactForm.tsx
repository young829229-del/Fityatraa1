import React, { useState } from "react";
import { Send, CheckCircle, HelpCircle, Mail, Phone, Smile } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!comment.trim()) {
      setErrorMsg("Your query comment is empty. Please enter some text.");
      return;
    }

    // Success state
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setComment("");
    setIsSubmitted(false);
  };

  return (
    <section id="contact-section" className="bg-[#FAFAFA] py-12 sm:py-16 border-t border-[#1A1A1A]/10">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        
        {/* Contact Heading */}
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-serif italic font-black text-[#1A1A1A] tracking-tight text-center">
            Got a Question or Distribution Query?
          </h2>
          <p className="text-xs text-gray-550 mt-1 max-w-sm mx-auto font-sans leading-relaxed">
            Authenticity guarantees, product origins, or customized distributor inquiry tickets resolved within 2 hours.
          </p>
        </div>

        {/* Unified Card Body container panel */}
        <div className="bg-white p-6 sm:p-8 rounded-none border border-[#1A1A1A]/10 shadow-editorial">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Field 1: Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rupesh Tamang"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#1A1A1A]/20 rounded-none text-xs text-gray-850 focus:outline-none focus:border-[black]"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. user@fityatra.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#1A1A1A]/20 rounded-none text-xs text-gray-850 focus:outline-none focus:border-[black]"
                    required
                  />
                </div>
              </div>

              {/* Field 2: Phone number */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                  Phone number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 98510XXXXX (Optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#1A1A1A]/20 rounded-none text-xs text-gray-850 focus:outline-none focus:border-[black]"
                />
              </div>

              {/* Field 3: Comment text */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                  Comment
                </label>
                <textarea
                  placeholder="How can we help optimize your gym stack?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 bg-white border border-[#1A1A1A]/20 rounded-none text-xs text-gray-850 focus:outline-none focus:border-[black] resize-none"
                  required
                />
              </div>

              {errorMsg && (
                <p className="text-xs font-mono text-red-650 font-bold">{errorMsg}</p>
              )}

              {/* Submit trigger button */}
              <button
                type="submit"
                className="cursor-pointer w-full py-3 bg-[#1A1A1A] hover:bg-[black] text-white font-mono uppercase tracking-widest text-xs rounded-none transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Enquiry</span>
              </button>

            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-[#FAFAFA] border border-[#1A1A1A]/10 text-[black] rounded-none flex items-center justify-center mx-auto">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-black text-gray-900 uppercase">Inquiry Registered!</h3>
                <p className="text-xs text-gray-550 mt-2 leading-relaxed font-sans">
                  Thanks for reaching out, <span className="font-bold text-[#1A1A1A]">{name}</span>. Our distribution center has logged ticket <span className="font-mono text-[black] font-bold bg-[#FAFAFA] px-1.5 py-0.5 border border-[#1A1A1A]/10">#FY-TK{Math.floor(Math.random() * 8000 + 1000)}</span>.
                </p>
                <p className="text-[10px] text-gray-450 mt-3 font-mono">
                  WE HAVE SENT AN ACKNOWLEDGEMENT NOTE TO {email.toUpperCase()}
                </p>
              </div>

              <button
                onClick={handleReset}
                className="cursor-pointer w-full py-2.5 bg-[#FAFAFA] hover:bg-[#1A1A1A]/10 text-[#1a1a1a] rounded-none transition-colors uppercase font-mono text-[10px] border border-[#1A1A1A]/20"
              >
                Submit New Query
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
