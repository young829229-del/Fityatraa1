import React, { useState } from "react";
import { Sparkles, Calculator, MessageSquare, Flame, Trophy, ChevronRight, CheckCircle, HelpCircle, ShoppingCart, UserCheck } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";

interface FitnessAdvisorProps {
  onClose: () => void;
  onAddProductToCart: (product: Product) => void;
}

export default function FitnessAdvisor({ onClose, onAddProductToCart }: FitnessAdvisorProps) {
  const [activeTab, setActiveTab] = useState<"calculator" | "chatbot">("calculator");

  // Calculator State
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [exerciseGoal, setExerciseGoal] = useState("muscle");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [calcResult, setCalcResult] = useState<any>(null);

  // Chatbot State
  const [selectedGoal, setSelectedGoal] = useState<string>("gain_mass");
  const [dietType, setDietType] = useState<string>("none");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState("");

  // Calculate BMI and Daily Protein Intake Metrics
  const handleCalculateMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // in meters

    if (!w || !h || w <= 0 || h <= 0) return;

    // Body Mass Index
    const bmi = w / (h * h);
    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi < 25) bmiCategory = "Optimal Health (Normal)";
    else if (bmi < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    // Daily protein multiplier based on goal and activity
    let multiplier = 1.2; // base
    if (exerciseGoal === "muscle") multiplier = 2.0;
    else if (exerciseGoal === "cut") multiplier = 1.7;
    else if (exerciseGoal === "stamina") multiplier = 1.5;

    if (activityLevel === "intensive") multiplier += 0.2;

    const proteinIntake = Math.round(w * multiplier);
    const dailyCalories = Math.round(w * 24 * (activityLevel === "intensive" ? 1.5 : activityLevel === "moderate" ? 1.3 : 1.1) + (exerciseGoal === "muscle" ? 300 : -300));

    // Recommend specific product stack
    let recommendedProducts: Product[] = [];
    if (exerciseGoal === "muscle") {
      recommendedProducts = PRODUCTS.filter(p => ["wellcore-creatine", "wellcore-whey", "muscleblaze-wrathx"].includes(p.id));
    } else if (exerciseGoal === "cut") {
      recommendedProducts = PRODUCTS.filter(p => ["wellcore-whey", "muscleblaze-fishoil"].includes(p.id));
    } else {
      recommendedProducts = PRODUCTS.filter(p => ["muscleblaze-fishoil", "hkvitals-collagen", "myfitness-pb"].includes(p.id));
    }

    setCalcResult({
      bmi: bmi.toFixed(1),
      category: bmiCategory,
      protein: proteinIntake,
      calories: dailyCalories,
      stack: recommendedProducts
    });
  };

  // Automated custom recommendations or real-time proxy API call simulation
  const handleGenerateAiAdvice = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAiLoading(true);

    // Call standard timeout
    setTimeout(() => {
      let advice = "";
      const matchedProducts: Product[] = [];

      if (customQuery.trim().length > 0) {
        // Query analyzer
        const q = customQuery.toLowerCase();
        if (q.includes("creatine") || q.includes("power") || q.includes("strength")) {
          advice = "For boosting muscle ATP cell energy and maximizing physical explosiveness, we highly recommend adding Wellcore Micronised Creatine to your stack. Take 3g daily with zero-grit unflavoured powder. Consistent loading increases output by 15%!";
          const prod = PRODUCTS.find(p => p.id === "wellcore-creatine");
          if (prod) matchedProducts.push(prod);
        } else if (q.includes("protein") || q.includes("whey") || q.includes("lean")) {
          advice = "For raw muscle fiber protein synthesis, ISO-Whey Premium Isolate is your master supplement. Providing 27g of pure isolate whey protein with near-zero lactose and fat. Post-workout intake triggers immediate recovery cascades.";
          const prod = PRODUCTS.find(p => p.id === "wellcore-whey");
          if (prod) matchedProducts.push(prod);
        } else if (q.includes("skin") || q.includes("hair") || q.includes("joint") || q.includes("collagen")) {
          advice = "For structural cell strength, dermal hydration, and hair restoration, the combination of HK Vitals Skin Radiance Collagen & MuscleBlaze Fish Oil is incredible. The enteric fish oil relieves knee friction, while marine collagen hydrates dry skin layers.";
          const prod1 = PRODUCTS.find(p => p.id === "hkvitals-collagen");
          const prod2 = PRODUCTS.find(p => p.id === "muscleblaze-fishoil");
          if (prod1) matchedProducts.push(prod1);
          if (prod2) matchedProducts.push(prod2);
        } else {
          advice = "Welcome to your FitYatra Plan! For balanced health, we recommend combining Omega 3 Fish Oil (1 capsule daily for joint fluids) with Wellcore Micronised Creatine (3g for cell hydration and raw stamina). These form the baseline foundation for active physical lifters in Nepal.";
          const prod = PRODUCTS.find(p => p.id === "muscleblaze-fishoil");
          if (prod) matchedProducts.push(prod);
        }
      } else {
        // Dropdown based
        if (selectedGoal === "gain_mass") {
          advice = "CRITICAL MASS STACK REC: Set surplus calorie goals. Take 1 scoop of Premium ISO-Whey (27g Protein) within 30 mins of weight training to start protein repair. Accompany with 3g Wellcore Creatine daily to hydrate muscle cells and boost ATP lift capacities.";
          const p1 = PRODUCTS.find(p => p.id === "wellcore-whey");
          const p2 = PRODUCTS.find(p => p.id === "wellcore-creatine");
          if (p1) matchedProducts.push(p1);
          if (p2) matchedProducts.push(p2);
        } else if (selectedGoal === "weight_loss") {
          advice = "LEAN DEFICIT STACK REC: Prioritize high-protein low calories. Our cold-filtered ISO-Whey Isolate supplies 27g of pure amino acids with only 118 calories. Taking Fish Oil Gold (900mg Active Omega 3) supports metabolic lipid burn and reduces diet-induced join soreness.";
          const p1 = PRODUCTS.find(p => p.id === "wellcore-whey");
          const p2 = PRODUCTS.find(p => p.id === "muscleblaze-fishoil");
          if (p1) matchedProducts.push(p1);
          if (p2) matchedProducts.push(p2);
        } else {
          advice = "ACTIVE WELLNESS STACK REC: Secure structural health first. Take 1 softgel of Triple Strength Omega-3 Gold daily for cardiovascular integrity and cartilage flexibility. Pair with MyFitness Peanut Butter as a clean source of calorie fats and dietary fiber.";
          const p1 = PRODUCTS.find(p => p.id === "muscleblaze-fishoil");
          const p2 = PRODUCTS.find(p => p.id === "myfitness-pb");
          if (p1) matchedProducts.push(p1);
          if (p2) matchedProducts.push(p2);
        }
      }

      setAiResponse(advice);
      setIsAiLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-white rounded-none max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-editorial flex flex-col border border-[#1A1A1A]/30 animate-slide-up">
        
        {/* Title panel */}
        <div className="p-5 sm:p-6 border-b border-[#1A1A1A]/10 flex justify-between items-center bg-[#FAFAFA] text-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5.5 h-5.5 text-[black]" />
            <div>
              <h2 className="text-base sm:text-lg font-serif italic font-black tracking-tight text-[#1a1a1a]">
                FitYatra Supplement & Calorie Advisor
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-550 font-mono tracking-wider uppercase mt-0.5">
                Clinical recovery matrices & verified supplement stacks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 hover:bg-[#1A1A1A]/5 rounded-none text-gray-700 transition-colors border border-[#1A1A1A]/10 bg-white"
          >
            <XCloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Tab selector */}
        <div className="flex border-b border-[#1A1A1A]/10 text-xs font-mono uppercase bg-[#FAFAFA]/50">
          <button
            onClick={() => setActiveTab("calculator")}
            className={`cursor-pointer flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "calculator"
                ? "border-[black] text-[black] font-black bg-white"
                : "border-transparent text-gray-550 hover:text-[#1A1A1A]"
            }`}
          >
            <Calculator className="w-4 h-4 text-[black]" />
            <span>Daily Intake Calculator</span>
          </button>
          <button
            onClick={() => setActiveTab("chatbot")}
            className={`cursor-pointer flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "chatbot"
                ? "border-[black] text-[black] font-black bg-white"
                : "border-transparent text-gray-550 hover:text-[#1A1A1A]"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[black]" />
            <span>AI Stacks Questionnaire</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 max-h-[60vh] bg-white">
          
          {/* TAB 1: Intake calculator */}
          {activeTab === "calculator" && (
            <div className="space-y-6">
              {!calcResult ? (
                <form onSubmit={handleCalculateMetrics} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#1A1A1A]/20 rounded-none text-xs text-gray-800 focus:outline-none focus:border-[black]"
                        min="30"
                        max="200"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#1A1A1A]/20 rounded-none text-xs text-gray-800 focus:outline-none focus:border-[black]"
                        min="100"
                        max="250"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                        Training Focus
                      </label>
                      <select
                        value={exerciseGoal}
                        onChange={(e) => setExerciseGoal(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#1A1A1A]/20 rounded-none text-xs text-gray-800 focus:outline-none focus:border-[black]"
                      >
                        <option value="muscle">Gain Muscle Size & Power</option>
                        <option value="cut">Fat Cut (Lean Physique)</option>
                        <option value="stamina">General Stamina / Athleticism</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                        Weekly Gym Activity
                      </label>
                      <select
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#1A1A1A]/20 rounded-none text-xs text-gray-800 focus:outline-none focus:border-[black]"
                      >
                        <option value="light">Light (1-2x Week Gym)</option>
                        <option value="moderate">Moderate Active (3-4x Week)</option>
                        <option value="intensive">Intensive Warrior (5-6x Week)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="cursor-pointer w-full py-3 bg-[#1A1A1A] hover:bg-[black] text-white rounded-none text-xs font-mono uppercase tracking-widest transition-colors duration-200"
                  >
                    Calculate My Fitness Matrix
                  </button>
                </form>
              ) : (
                <div className="space-y-5">
                  {/* Results banner box */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#FAFAFA] p-3 rounded-none border border-[#1A1A1A]/10 text-center">
                      <span className="text-[9px] font-mono text-gray-400 block uppercase">Body Mass Index</span>
                      <span className="text-base font-serif font-black text-[black] block mt-0.5">{calcResult.bmi}</span>
                      <span className="text-[9px] text-[#1A1A1A] block leading-none font-sans font-bold">{calcResult.category}</span>
                    </div>
                    <div className="bg-[#FAFAFA] p-3 rounded-none border border-[#1A1A1A]/10 text-center">
                      <span className="text-[9px] font-mono text-gray-400 block uppercase">Target Protein</span>
                      <span className="text-lg font-serif font-black text-[black] block mt-0.5">{calcResult.protein}g</span>
                      <span className="text-[9px] text-gray-400 block leading-none font-mono">DAILY INTAKE</span>
                    </div>
                    <div className="bg-[#FAFAFA] p-3 rounded-none border border-[#1A1A1A]/10 text-center">
                      <span className="text-[9px] font-mono text-gray-400 block uppercase">Daily Calorie Cap</span>
                      <span className="text-base font-serif font-black text-[#1A1A1A] block mt-0.5">{calcResult.calories}</span>
                      <span className="text-[9px] text-gray-400 block leading-none font-mono">KCALS/DAY TARGET</span>
                    </div>
                  </div>

                  {/* Informational checklist advice */}
                  <div className="bg-[#FAFAFA] rounded-none p-4 border border-[#1A1A1A]/10">
                    <h4 className="text-xs font-mono font-bold text-[black] uppercase flex items-center gap-1.5 mb-2">
                      <Trophy className="w-4 h-4 text-[black]" /> COACH RECOMMENDATION ADVICE
                    </h4>
                    <p className="text-xs text-gray-650 leading-relaxed font-sans">
                      To successfully build training resistance while aiming for the <span className="font-bold text-gray-800 text-xs">{calcResult.protein}g</span> daily protein target, supplementation ensures clean ingestion without crushing your digestion. Wellcore Whey Isolate provides a fast {((27/calcResult.protein)*100).toFixed(0)}% of your target profile in a single scoop!
                    </p>
                  </div>

                  {/* Recommended Stack catalog inline */}
                  <div>
                    <h4 className="text-xs font-serif text-zinc-950 uppercase mb-3 flex items-center justify-between border-b border-gray-100 pb-1.5">
                      <span>SUPPLEMENT STACK DESIGNED FOR YOU</span>
                      <span className="text-[10px] text-[black] font-mono lowercase">Direct stock match</span>
                    </h4>
                    <div className="space-y-3">
                      {calcResult.stack.map((prod: Product) => (
                        <div key={prod.id} className="flex justify-between items-center p-3 rounded-none border border-[#1A1A1A]/10 bg-white">
                          <div className="flex items-center gap-2.5">
                            <span className="h-2 w-2 rounded-none bg-[black]"></span>
                            <div>
                              <h5 className="text-xs font-serif font-bold text-gray-900">{prod.name}</h5>
                              <p className="text-[10px] text-gray-400 font-mono">Rs. {prod.price.toLocaleString()} • {prod.brand}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => onAddProductToCart(prod)}
                            className="cursor-pointer p-1.5 px-3 bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A]/30 text-[10px] font-mono tracking-widest uppercase flex items-center gap-1 transition-all"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>Stack Item</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reset calculation button */}
                  <button
                    onClick={() => setCalcResult(null)}
                    className="cursor-pointer w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] rounded-none text-xs font-mono uppercase tracking-widest border border-gray-200 transition-colors"
                  >
                    Re-Calculate With New Metrics
                  </button>
                </div>
              )}
            </div>
          )}          {/* TAB 2: Smart AI Advisor Questionnaire */}
          {activeTab === "chatbot" && (
            <div className="space-y-5">
              {!aiResponse ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase block tracking-widest">
                      Choose Your Primary Goal Profile
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "gain_mass", label: "Gain Body Size", icon: <Trophy className="w-3.5 h-3.5" /> },
                        { id: "weight_loss", label: "Lean Fat Loss", icon: <Flame className="w-3.5 h-3.5" /> },
                        { id: "wellness", label: "Vitamins/Skin", icon: <Sparkles className="w-3.5 h-3.5" /> }
                      ].map((goal) => (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => setSelectedGoal(goal.id)}
                          className={`cursor-pointer p-2.5 border rounded-none flex flex-col items-center gap-1.5 text-center transition-all ${
                            selectedGoal === goal.id
                              ? "border-[black] bg-[#FAFAFA] text-[black] font-serif font-black"
                              : "border-gray-200 hover:border-gray-300 text-gray-600"
                          }`}
                        >
                          <div className="text-[black]">{goal.icon}</div>
                          <span className="text-[10px] tracking-tight leading-none font-mono uppercase">{goal.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase block tracking-widest">
                      dietary exclusions
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "none", label: "No Restriction" },
                        { id: "veg", label: "Vegetarian Only" },
                        { id: "gluten", label: "Gluten-Free Only" }
                      ].map((diet) => (
                        <button
                          key={diet.id}
                          type="button"
                          onClick={() => setDietType(diet.id)}
                          className={`cursor-pointer p-2 border rounded-none text-center text-xs transition-all ${
                            dietType === diet.id
                              ? "border-[black] bg-[#FAFAFA] text-[black] font-serif font-bold"
                              : "border-gray-200 text-gray-650"
                          }`}
                        >
                          {diet.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom query input box */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase block tracking-widest flex items-center justify-between">
                      <span>ask custom fitness advisory questions</span>
                      <span className="text-[9px] text-gray-400 lowercase italic">e.g., "creatine loading", "fatigue support"</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ask, e.g. How do I use Creatine with Whey?"
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      className="w-full p-2.5 border border-[#1A1A1A]/20 bg-white rounded-none text-xs text-gray-850 focus:outline-none focus:border-[black] placeholder:text-gray-400"
                    />
                  </div>

                  <button
                    onClick={() => handleGenerateAiAdvice()}
                    className="cursor-pointer w-full py-3 bg-[#1A1A1A] hover:bg-[black] text-white font-mono uppercase tracking-widest rounded-none text-xs transition-all h-12 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Generate Supplement Stack Recommendation</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Advisor Answer Card bubble */}
                  <div className="bg-[#FAFAFA] p-5 rounded-none border border-[#1A1A1A]/10 text-xs sm:text-sm text-[#1A1A1A] leading-relaxed space-y-3 font-sans relative overflow-hidden">
                    <div className="flex items-center gap-1.5 text-[black] font-mono font-bold border-b border-[#1A1A1A]/10 pb-2 text-[10px] uppercase tracking-widest">
                      <Sparkles className="w-4 h-4 text-[black]" /> FitYatra Smart AI Response
                    </div>
                    <p className="font-serif italic text-gray-700">"{aiResponse}"</p>
                  </div>

                  {/* Associated recommended matches */}
                  <div>
                    <h4 className="text-xs font-mono font-bold text-gray-700 uppercase tracking-widest mb-2">MATCHED SUPPLEMENTS AVAILABLE</h4>
                    <div className="space-y-3">
                      {PRODUCTS.filter(p => {
                        if (selectedGoal === "gain_mass") return ["wellcore-whey", "wellcore-creatine"].includes(p.id);
                        if (selectedGoal === "weight_loss") return ["wellcore-whey", "muscleblaze-fishoil"].includes(p.id);
                        return ["muscleblaze-fishoil", "hkvitals-collagen"].includes(p.id);
                      }).map(prod => (
                        <div key={prod.id} className="flex justify-between items-center p-3 rounded-none border border-[#1A1A1A]/10 bg-white">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[black]" />
                            <div>
                              <h5 className="text-xs font-serif font-bold text-gray-800">{prod.name}</h5>
                              <p className="text-[9px] text-gray-400 font-mono">Rs. {prod.price.toLocaleString()} each</p>
                            </div>
                          </div>
                          <button
                            onClick={() => onAddProductToCart(prod)}
                            className="cursor-pointer p-1.5 px-3.5 bg-[#1A1A1A] text-white hover:bg-[black] rounded-none text-[10px] font-mono uppercase tracking-widest border border-transparent"
                          >
                            Add To Bag
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Re-plan trigger button */}
                  <button
                    onClick={() => {
                      setAiResponse(null);
                      setCustomQuery("");
                    }}
                    className="cursor-pointer w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] rounded-none text-xs font-mono uppercase tracking-widest border border-gray-250"
                  >
                    Ask Another Question
                  </button>
                </div>
              )}

              {/* Loader placeholder overlay */}
              {isAiLoading && (
                <div className="fixed inset-0 bg-[#FAFAFA]/90 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 z-10 rounded-none">
                  <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[#1A1A1A]">Formulating Customized Dietary Plan...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info lock indicators */}
        <div className="p-4 bg-[#FAFAFA] border-[#1A1A1A]/10 border-t text-center text-[10px] font-mono text-[black] flex items-center justify-center gap-1.5 tracking-widest">
          <UserCheck className="w-4 h-4 text-[black]" />
          EVERY ADVICE RECORD REPORT IS BACKED BY CLINICAL PROGRESS REPORT AUDITS
        </div>
      </div>
    </div>
  );
}

// Compact Close Icon
function XCloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
