import { Product } from "../types";
import { db } from "./firebase";
import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "./firebaseError";

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
export const INITIAL_REVIEWS: UserReview[] = [
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
    id: "rev-fo-3",
    productId: "muscleblaze-fishoil",
    name: "Srijana K. (Teacher)",
    rating: 5,
    comment: "don't go gym but bought this for brain health. I'm teacher, work ma focus chahincha. 20 days use garepaxi noticed concentration ramro bhayo. Students le pani 'madam you seem more energetic' bhancha. Brain fog kam bhayo. Very happy!",
    images: [],
    date: "20 days ago",
    verified: true
  },
  {
    id: "rev-fo-4",
    productId: "muscleblaze-fishoil",
    name: "Subash Shrestha",
    rating: 4,
    comment: "Office work ma whole day computer herdai baschu. Eye strain ekdum hunthyo. 2 hapta dekhi lirachu yo fish oil. Eyes ali better feel gareko chu. Too early to say full result but positive feel cha.",
    images: [],
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

const REVIEWS_LOCAL_STORAGE_KEY = "fityatra_product_reviews";
const REVIEWS_COLLECTION = "reviews";

let inMemoryReviews: UserReview[] | null = null;
let isSubscribed = false;

function subscribeToReviews() {
  if (isSubscribed || typeof window === "undefined") return;
  isSubscribed = true;

  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    onSnapshot(
      reviewsRef,
      (snapshot) => {
        if (snapshot.empty) {
          seedInitialReviews();
          return;
        }

        const reviewsFromFS: UserReview[] = [];
        snapshot.forEach((docSnap) => {
          reviewsFromFS.push(docSnap.data() as UserReview);
        });

        inMemoryReviews = reviewsFromFS;
        if (typeof localStorage !== "undefined") {
          try {
            localStorage.setItem(REVIEWS_LOCAL_STORAGE_KEY, JSON.stringify(reviewsFromFS));
          } catch (e) {
            console.warn("Failed to write reviews to localStorage", e);
          }
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("fityatra_reviews_updated"));
        }
      },
      (error) => {
        console.error("Firestore reviews subscription error:", error);
      }
    );
  } catch (err) {
    console.error("Failed to set up reviews listener:", err);
  }
}

async function seedInitialReviews() {
  try {
    for (const rev of INITIAL_REVIEWS) {
      const docRef = doc(db, REVIEWS_COLLECTION, rev.id);
      await setDoc(docRef, rev);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, REVIEWS_COLLECTION);
  }
}

subscribeToReviews();

export function loadAllReviews(): UserReview[] {
  if (inMemoryReviews && inMemoryReviews.length > 0) {
    return inMemoryReviews;
  }
  inMemoryReviews = INITIAL_REVIEWS;
  return inMemoryReviews;
}

export async function saveAllReviews(reviews: UserReview[]) {
  inMemoryReviews = reviews;
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(REVIEWS_LOCAL_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.warn("Failed to save reviews to localStorage", e);
    }
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("fityatra_reviews_updated"));
  }

  try {
    for (const rev of reviews) {
      const docRef = doc(db, REVIEWS_COLLECTION, rev.id);
      await setDoc(docRef, rev, { merge: true });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, REVIEWS_COLLECTION);
  }

  if (typeof window !== "undefined") {
    fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviews),
    }).catch((err) => console.error("Failed to sync reviews to server endpoint", err));
  }
}

export function getProductReviews(productId: string): UserReview[] {
  const all = loadAllReviews();
  return all.filter((r) => r.productId === productId);
}

export async function addProductReview(productId: string, review: Omit<UserReview, "id" | "productId" | "date">): Promise<UserReview> {
  const all = loadAllReviews();
  const newReview: UserReview = {
    ...review,
    id: `rev-user-${Date.now()}`,
    productId,
    date: "Just now",
  };
  all.unshift(newReview);

  inMemoryReviews = all;
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(REVIEWS_LOCAL_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn("localStorage write failed", e);
    }
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("fityatra_reviews_updated"));
  }

  try {
    const docRef = doc(db, REVIEWS_COLLECTION, newReview.id);
    await setDoc(docRef, newReview);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${REVIEWS_COLLECTION}/${newReview.id}`);
  }

  if (typeof window !== "undefined") {
    fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(all),
    }).catch((err) => console.error("Failed server backup sync for review", err));
  }

  return newReview;
}

export async function updateProductReview(reviewId: string, updatedFields: Partial<Omit<UserReview, "id" | "productId">>): Promise<UserReview | null> {
  const all = loadAllReviews();
  const idx = all.findIndex((r) => r.id === reviewId);
  if (idx === -1) return null;

  const updatedReview = {
    ...all[idx],
    ...updatedFields,
  };
  all[idx] = updatedReview;

  inMemoryReviews = all;
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(REVIEWS_LOCAL_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn("localStorage write failed", e);
    }
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("fityatra_reviews_updated"));
  }

  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await setDoc(docRef, updatedReview, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${REVIEWS_COLLECTION}/${reviewId}`);
  }

  if (typeof window !== "undefined") {
    fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(all),
    }).catch((err) => console.error("Failed server backup sync for review update", err));
  }

  return updatedReview;
}

export async function deleteProductReview(reviewId: string): Promise<boolean> {
  const all = loadAllReviews();
  const initialLen = all.length;
  const filtered = all.filter((r) => r.id !== reviewId);

  inMemoryReviews = filtered;
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(REVIEWS_LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn("localStorage write failed", e);
    }
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("fityatra_reviews_updated"));
  }

  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${REVIEWS_COLLECTION}/${reviewId}`);
  }

  if (typeof window !== "undefined") {
    fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtered),
    }).catch((err) => console.error("Failed server backup sync for review delete", err));
  }

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
