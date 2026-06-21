import { Product } from "../types";

export interface UserReview {
  id: string;
  productId: string;
  name: string;
  rating: number;
  comment: string;
  images: string[]; // Base64 or URL strings
  videos?: string[]; // Base64 or URL strings for mp4 videos
  date: string;
  verified: boolean;
  isUserAdded?: boolean;
}

// Initial high quality realistic reviews to seed the application
const INITIAL_REVIEWS: UserReview[] = [
  {
    id: "rev-wc-1",
    productId: "wellcore-creatine",
    name: "Rupesh T.",
    rating: 5,
    comment: "Authentic micronized particle size. Mixes beautifully with milk or juice. Saw power boosts on squats in 7 days.",
    images: ["https://i.ibb.co/qw5FZw1/uy-NBmf-CIDi-mid.jpg"],
    date: "2 weeks ago",
    verified: true
  },
  {
    id: "rev-wc-2",
    productId: "wellcore-creatine",
    name: "Binay D.",
    rating: 5,
    comment: "I scratched the code and SMS'd to verification portal, instantly verified! 100% genuine product of Wellcore in Nepal.",
    images: ["https://i.ibb.co/fdGvD3RT/Hvp7i-Ea-KZK-mid.jpg"],
    date: "1 month ago",
    verified: true
  },
  {
    id: "rev-wc-3",
    productId: "wellcore-creatine",
    name: "Prabin Shrestha",
    rating: 5,
    comment: "Wellcore creatine is literally zero grit. Dissolves within 10 seconds of stirring! Got authentic scratch code which verified perfectly on the brand portal.",
    images: ["https://i.ibb.co/gZPhq73C/ELI-2-Unflavoured-33servings-Creatine-Revamp-Listing-Wellcore-773x773-45ca3e1e-d980-41ad-918.jpg"],
    date: "1 month ago",
    verified: true
  },
  {
    id: "rev-pb-1",
    productId: "myfitness-pb",
    name: "Kushal R.",
    rating: 5,
    comment: "Literally the clean breakfast gold. Extreme crunchiness and very minimal sugar content. Essential for my bulky shake stacks.",
    images: ["https://i.ibb.co/CTrN2Bq/02-JPG-1.jpg", "https://i.ibb.co/1YXhgntt/Original-Crunchy-835ee98e-227d-4164-98aa-b5953d97b2ba.jpg"],
    date: "3 weeks ago",
    verified: true
  },
  {
    id: "rev-pb-2",
    productId: "myfitness-pb",
    name: "Suresh P.",
    rating: 4,
    comment: "Sold out too fast but product quality is pristine. Perfect source of monounsaturated fats. Spread is very smooth.",
    images: ["https://i.ibb.co/vC50fKP2/Spread-that.jpg"],
    date: "1 month ago",
    verified: true
  },
  {
    id: "rev-fo-1",
    productId: "muscleblaze-fishoil",
    name: "Ashish Malla",
    rating: 5,
    comment: "No fishy burps or reflux at all. 540mg of active EPA is extremely crucial for heavy squatters. Joints feel highly lubricated.",
    images: ["https://i.ibb.co/Nhd3x42/Uo-Wj-N3l8w-T-mid.jpg"],
    date: "5 days ago",
    verified: true
  },
  {
    id: "rev-fo-2",
    productId: "muscleblaze-fishoil",
    name: "Mira K.",
    rating: 5,
    comment: "High quality soft gels. Great packaging from FitYatra. Highly recommended to physical lifters in Nepal.",
    images: ["https://i.ibb.co/gbyKH4Db/Main-IMAGE.jpg"],
    date: "2 weeks ago",
    verified: true
  },
  {
    id: "rev-hc-1",
    productId: "hkvitals-collagen",
    name: "Sujita B.",
    rating: 5,
    comment: "Peach Orange taste is extremely refreshing! My skin feels hydrated and is showing perfect clarity. Shipping was so fast to Pokhara.",
    images: ["https://i.ibb.co/cBJttkW/v-Xhcyrn-t-mid.jpg"],
    date: "3 weeks ago",
    verified: true
  },
  {
    id: "rev-hc-2",
    productId: "hkvitals-collagen",
    name: "Pratima S.",
    rating: 4,
    comment: "Good collagen peptides. Gluten free formula fits with my dietary needs perfectly.",
    images: ["https://i.ibb.co/M5kKtDRy/Prodcut-galery-2.png"],
    date: "1 month ago",
    verified: true
  },
  {
    id: "rev-lc-1",
    productId: "muscleblaze-lcarnitine",
    name: "Dipesh R.",
    rating: 5,
    comment: "Tastes like citric heaven. Really triggers clean sweat and fat conversion during fat depletion blocks. Extremely fast delivery inside Valley.",
    images: ["https://i.ibb.co/cSgpP79g/Orange-x2-824459d1-3442-46cc-bf0e-df457bb1c82d.jpg"],
    date: "10 days ago",
    verified: true
  }
];

const LOCAL_STORAGE_KEY = "fityatra_product_reviews";

export function loadAllReviews(): UserReview[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load reviews", e);
    return INITIAL_REVIEWS;
  }
}

export function saveAllReviews(reviews: UserReview[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error("Failed to save reviews", e);
  }
}

export function getProductReviews(productId: string): UserReview[] {
  const all = loadAllReviews();
  return all.filter((r) => r.productId === productId);
}

export function addProductReview(productId: string, review: Omit<UserReview, "id" | "productId" | "date">): UserReview {
  const all = loadAllReviews();
  const newReview: UserReview = {
    ...review,
    id: `rev-user-${Date.now()}`,
    productId,
    date: "Just now",
  };
  all.unshift(newReview);
  saveAllReviews(all);
  return newReview;
}

export function updateProductReview(reviewId: string, updatedFields: Partial<Omit<UserReview, "id" | "productId">>): UserReview | null {
  const all = loadAllReviews();
  const idx = all.findIndex((r) => r.id === reviewId);
  if (idx === -1) return null;
  const updatedReview = {
    ...all[idx],
    ...updatedFields,
  };
  all[idx] = updatedReview;
  saveAllReviews(all);
  return updatedReview;
}

export function deleteProductReview(reviewId: string): boolean {
  const all = loadAllReviews();
  const initialLen = all.length;
  const filtered = all.filter((r) => r.id !== reviewId);
  saveAllReviews(filtered);
  return filtered.length < initialLen;
}

export function getProductStats(product: Product) {
  const reviews = getProductReviews(product.id);
  if (reviews.length === 0) {
    return { rating: product.rating, reviewCount: product.reviewCount };
  }
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return {
    rating: parseFloat(avg.toFixed(1)),
    reviewCount: reviews.length
  };
}
