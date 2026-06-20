import { Product, Testimonial, FAQ } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "wellcore-creatine",
    name: "Wellcore - Micronised Creatine Monohydrate",
    brand: "Wellcore",
    category: "Creatine",
    price: 2199,
    originalPrice: 3199,
    discountPercentage: 31,
    rating: 4.9,
    reviewCount: 38,
    isSoldOut: false,
    image: "https://i.ibb.co/KcyPJb32/Front-83-Serv-Tropical-Tango-CREATINE-LISTING-WELLCORE-WELLVERSED-773x837-2ada30a4-7831-46d.jpg",
    gallery: [
      "https://i.ibb.co/KcyPJb32/Front-83-Serv-Tropical-Tango-CREATINE-LISTING-WELLCORE-WELLVERSED-773x837-2ada30a4-7831-46d.jpg",
      "https://i.ibb.co/yF1D6ZbL/embossing-logo-box-ELI-3-UF-83servings-Creatine-Listing-Wellcore-773x773-ccab179f-c6f0-42f4.jpg",
      "https://i.ibb.co/gZPhq73C/ELI-2-Unflavoured-33servings-Creatine-Revamp-Listing-Wellcore-773x773-45ca3e1e-d980-41ad-918.jpg",
      "https://i.ibb.co/5hmjvT7V/ELI-1-Unflavoured-83servings-Creatine-Revamp-Listing-Wellcore-773x773-51ac500f-777f-49f3-acd.png",
      "https://i.ibb.co/KpsswZSR/ELI-4-Unflavoured-33servings-Creatine-Revamp-Listing-Wellcore-773x773-ad172c87-b55e-42e0-9a2.jpg",
      "https://i.ibb.co/1Y8g5Gxj/Chat-GPT-Image-Dec-21-2025-06-45-02-PM.png",
      "https://i.ibb.co/yF9z3S1N/wellcore-back-cover.jpg"
    ],
    description: "Unprecedented purity. Wellcore Micronised Creatine Monohydrate fuels muscle protein synthesis, enhances cellular ATP production, and amplifies raw power output during physical training. It dissolves instantly in water and is 100% unflavoured to easily stack with your favorite whey or pre-workouts.",
    servings: "83 Servings",
    servingSize: "3g",
    goals: ["Muscle Volume", "Physical Strength", "Accelerated Recovery"],
    specs: {
      "Purity": "100% Pure Creatine",
      "Type": "HPLC Verified Micronized",
      "Flavour": "Unflavoured",
      "Added sugars": "0g"
    },
    nutritionFacts: {
      "Creatine Monohydrate": "3000 mg",
      "Calories": "0 kcal",
      "Protein": "0 g",
      "Fats": "0 g",
      "Carbohydrates": "0 g"
    }
  },
  {
    id: "muscleblaze-lcarnitine",
    name: "Liquid L-Carnitine PRO",
    brand: "MuscleBlaze",
    category: "Nutrition",
    price: 1299,
    originalPrice: 1899,
    discountPercentage: 32,
    rating: 4.8,
    reviewCount: 22,
    isSoldOut: false,
    image: "https://i.ibb.co/cSgpP79g/Orange-x2-824459d1-3442-46cc-bf0e-df457bb1c82d.jpg",
    gallery: [
      "https://i.ibb.co/cSgpP79g/Orange-x2-824459d1-3442-46cc-bf0e-df457bb1c82d.jpg",
      "https://i.ibb.co/zTYrydfw/What-LCdoes.jpg",
      "https://i.ibb.co/RkF0PPGw/Benefits.jpg",
      "https://i.ibb.co/m5cJ3Qg1/Why-Liquid.jpg",
      "https://i.ibb.co/4nnntKBv/Back.jpg",
      "https://i.ibb.co/WN0Lc4nZ/Back-Side.jpg"
    ],
    description: "Convert fat to fuel with Liquid L-Carnitine. Formulated for maximum nutrient absorption to accelerate metabolism, improve athletic performance, and support weight management.",
    servings: "30 Servings",
    servingSize: "15ml",
    goals: ["Fat Burn", "Energy Boost", "Metabolism"],
    specs: {
      "Purity": "Pharmaceutical Grade",
      "Type": "Liquid Formula",
      "Flavour": "Citrus Splash"
    },
    nutritionFacts: {
      "L-Carnitine": "3000 mg",
      "Calories": "0 kcal",
      "Sugar": "0 g"
    }
  },
  {
    id: "myfitness-pb",
    name: "Original Crunchy Peanut Butter (25% Protein)",
    brand: "MyFitness",
    category: "Nutrition",
    price: 599,
    originalPrice: 899,
    discountPercentage: 33,
    rating: 4.8,
    reviewCount: 124,
    isSoldOut: false,
    image: "https://i.ibb.co/CTrN2Bq/02-JPG-1.jpg",
    gallery: [
      "https://i.ibb.co/CTrN2Bq/02-JPG-1.jpg",
      "https://i.ibb.co/1YXhgntt/Original-Crunchy-835ee98e-227d-4164-98aa-b5953d97b2ba.jpg",
      "https://i.ibb.co/N69Z7g52/3-3e03d014-61b8-45da-99c8-6f2f71b9abf0-1.jpg",
      "https://i.ibb.co/mCWKjsQL/Hrithik-roshan.jpg",
      "https://i.ibb.co/HLJmrb77/Original-Crunchy-fc59a214-3e4d-41d4-8275-6d6df6692117.jpg",
      "https://i.ibb.co/vC50fKP2/Spread-that.jpg",
      "https://i.ibb.co/1GxBC20J/Usage.jpg",
      "https://i.ibb.co/V0cDK8n9/6-jpg-1-71cb4eff-7593-4a43-8ad9-3d929c4f82a0.jpg",
      "https://i.ibb.co/b526ggsQ/Originalcrunchylifestyle.jpg",
      "https://i.ibb.co/1fNz1HpY/Original-PBcruchy1250-G-amazon-listingcopy-b10c1b5e-6f7e-4d53-8566-19d8a237869e-1.jpg"
    ],
    description: "MyFitness Original Crunchy Peanut Butter is packed with 25% clean protein from slow-roasted premium peanuts. High in healthy monounsaturated fats, and minimal added brown sugar, this delivers a delectable crunch that is the perfect clean fuel for pre-workout carbs or bulk shake recipes.",
    servings: "39 Servings",
    servingSize: "32g (2 Tbsp)",
    goals: ["Healthy Fats", "Calorie Bulking", "Energy Boost"],
    specs: {
      "Protein Ratio": "25% High-Protein",
      "Texture": "Ultra-crunchy & Creamy",
      "Roast Type": "Slow-Roasted",
      "Fiber Support": "3g per serving"
    },
    nutritionFacts: {
      "Calories": "202 kcal",
      "Protein": "8 g",
      "Healthy Fats": "16 g",
      "Dietary Fiber": "3 g",
      "Added Sugar": "1.5 g"
    }
  },
  {
    id: "muscleblaze-fishoil",
    name: "Omega 3 Fish Oil Gold 3x Triple Strength",
    brand: "MuscleBlaze",
    category: "Wellness",
    price: 2299,
    originalPrice: 3199,
    discountPercentage: 28,
    rating: 4.7,
    reviewCount: 4,
    isSoldOut: false,
    image: "https://i.ibb.co/gbyKH4Db/Main-IMAGE.jpg",
    gallery: [
      "https://i.ibb.co/gbyKH4Db/Main-IMAGE.jpg",
      "https://i.ibb.co/tPWjh4gx/2.jpg",
      "https://i.ibb.co/LDgMjPky/7.jpg",
      "https://i.ibb.co/32D5Ls3/6.jpg",
      "https://i.ibb.co/cSF14TTV/5.jpg"
    ],
    description: "Triple potency Omega-3 fatty acids. MuscleBlaze Fish Oil Gold provides 1250mg of molecularly distilled premium fish oil, supplying 540mg of EPA and 360mg of DHA. It supports cartilage hydration, joint fluid dynamics, brain function, and skin tone. Features advanced enteric coating to prevent digestive reflux and fishy aftertaste.",
    servings: "60 Softgels",
    servingSize: "1 Softgel",
    goals: ["Joint Mobility", "Cardiovascular Support", "Cognitive Health"],
    specs: {
      "Total Omega-3": "900 mg",
      "EPA Active": "540 mg",
      "DHA Active": "360 mg",
      "Shell Type": "Enteric Coated (Odorless)"
    },
    nutritionFacts: {
      "Premium Fish Oil": "1250 mg",
      "EPA": "540 mg",
      "DHA": "360 mg",
      "Calories": "12 kcal",
      "Cholesterol": "0 mg"
    }
  },
  {
    id: "hkvitals-collagen",
    name: "Skin Radiance Collagen - Glow Formula",
    brand: "HK Vitals",
    category: "Wellness",
    price: 1499,
    originalPrice: 1999,
    discountPercentage: 25,
    rating: 4.6,
    reviewCount: 18,
    isSoldOut: false,
    image: "https://i.ibb.co/kVqXx1fR/Colalgen.png",
    gallery: [
      "https://i.ibb.co/kVqXx1fR/Colalgen.png",
      "https://i.ibb.co/nsfc2CVj/Prodcut-gallery-1.png",
      "https://i.ibb.co/5DD18v2/Prodcut-Gallery-3.png",
      "https://i.ibb.co/M5kKtDRy/Prodcut-galery-2.png"
    ],
    description: "HK Vitals Skin Radiance Collagen is an advanced beauty blend featuring marine collagen peptides, hyaluronic acid, vitamin C, vitamin E, and Biotin. It helps stimulate natural skin repair, combat fine lines, locks in dermal moisture, and strengthens hair and nail keratin structures.",
    servings: "25 Servings",
    servingSize: "8g",
    goals: ["Skin Elasticity", "Nail & Hair Strength", "Dermal Hydration"],
    specs: {
      "Source": "Hydrolyzed Marine Collagen",
      "Flavour": "Orange Peach Burst",
      "Gluten": "100% Gluten-Free",
      "Sugar Added": "0g"
    },
    nutritionFacts: {
      "Collagen Peptides": "5000 mg",
      "Hyaluronic Acid": "100 mg",
      "Vitamin C": "40 mg",
      "Biotin": "30 mcg",
      "Calories": "28 kcal"
    }
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "rev-1",
    name: "Prashant M.",
    rating: 5,
    comment: "I am using this product since week ago and I have noticed good changes in my stamina and strength.",
    date: "1 week ago",
    statusVerified: true,
    imgUrl: "https://i.ibb.co/qw5FZw1/uy-NBmf-CIDi-mid.jpg"
  },
  {
    id: "rev-2",
    name: "Rajesh B.",
    rating: 5,
    comment: "I have been using Wellcore Micronized Creatine Monohydrate for the past month and the results are exceptional.",
    date: "2 weeks ago",
    statusVerified: true,
    imgUrl: "https://i.ibb.co/fdGvD3RT/Hvp7i-Ea-KZK-mid.jpg"
  },
  {
    id: "rev-3",
    name: "Sujita B.",
    rating: 5,
    comment: "Bought the HK Vitals skin radiance on recommending. My skin feels heavily hydrated and clean. Fast shipping to Pokhara, arrived within 2 days!",
    date: "3 weeks ago",
    statusVerified: true,
    imgUrl: "https://i.ibb.co/cBJttkW/v-Xhcyrn-t-mid.jpg"
  },
  {
    id: "rev-4",
    name: "Ashish Malla",
    rating: 5,
    comment: "Triple strength fish oil is genuinely odourless. No annoying burps. Love the custom advising system on this shop, helps with my bodybuilding stacks.",
    date: "5 days ago",
    statusVerified: true,
    imgUrl: "https://i.ibb.co/Nhd3x42/Uo-Wj-N3l8w-T-mid.jpg"
  },
  {
    id: "rev-5",
    name: "Bishal K.",
    rating: 5,
    comment: "Original quality always.",
    date: "2 days ago",
    statusVerified: true,
    imgUrl: "https://i.ibb.co/JRrXwzFQ/Xgaq-G2-Kisw-mid.jpg"
  },
  {
    id: "rev-6",
    name: "Nitesh",
    rating: 5,
    comment: "Delivery inside Kathmandu is very fast and I verified the product to be authetic.",
    date: "1 week ago",
    statusVerified: true,
    imgUrl: "https://i.ibb.co/VcfsNbjv/H17n-An-Xqr-mid.jpg"
  },
  {
    id: "rev-7",
    name: "Nikhil",
    rating: 5,
    comment: "Works as described, the packaging was intact and neat.",
    date: "1 month ago",
    statusVerified: true,
    imgUrl: "https://i.ibb.co/6RzBr2gh/iknqick-Uc-mid.jpg"
  }
];

export const FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "Do you ship all over Nepal?",
    answer: "Yes, absolutely! We ship to every corner of Nepal because we make sure no one is left behind. Delivery inside Kathmandu Valley of Nepal is lightning fast!"
  },
  {
    id: "faq-2",
    question: "How long does shipping take?",
    answer: "Our deliveries are dispatch-optimized. Standard shipping inside the Kathmandu valley takes 1-2 business days. Delivery to major cities outside Valley (like Pokhara, Biratnagar, Narayangarh) takes 2-4 business days. Remote districts are delivered within 4-7 business days."
  },
  {
    id: "faq-3",
    question: "Will I get a tracking number after making an order?",
    answer: "Yes! The moment our logistics partner dispatches your products, we will auto-generate and text/email you a live tracking link so you can monitor your order in real-time."
  },
  {
    id: "faq-4",
    question: "What's your guarantee?",
    answer: "We offer a strict 7-Day Authenticity & Satisfaction Guarantee. If your seal arrives broken, or if you suspect any material defect, we will arrange a zero-cost return collection and issue a full cash refund or replacement."
  },
  {
    id: "faq-5",
    question: "Is all product 100% Original?",
    answer: "Absolutely. All our supplements are sourced directly from global brand representatives or authorized national distributors. Every tub includes a proprietary scratch authenticity coupon code that you can verify via SMS or brand verification portals."
  }
];

export const NEPAL_REGIONS = [
  { id: "ktm", name: "Kathmandu Valley (KTM, Lalitpur, Bhaktapur)", fee: 100, estimate: "1-2 Business Days" },
  { id: "pokhara", name: "Pokhara / Lekhnath Hub", fee: 150, estimate: "2-3 Business Days" },
  { id: "chitwan", name: "Chitwan / Narayangarh Region", fee: 150, estimate: "2-3 Business Days" },
  { id: "tarai", name: "Major Tarai Cities (Biratnagar, Butwal, Birgunj)", fee: 200, estimate: "3-4 Business Days" },
  { id: "remote", name: "Hilly & Remote Towns (Custom Courier)", fee: 300, estimate: "4-7 Business Days" }
];
