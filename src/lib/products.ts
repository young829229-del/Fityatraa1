import { Product } from "../types";
import { PRODUCTS as INITIAL_PRODUCTS } from "../data";
import { db } from "./firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "./firebaseError";

const PRODUCTS_LOCAL_STORAGE_KEY = "fityatra_dynamic_products";
const PRODUCTS_COLLECTION = "products";

let inMemoryProducts: Product[] | null = null;
let isSubscribed = false;

// Initialize real-time listener for products
function subscribeToProducts() {
  if (isSubscribed || typeof window === "undefined") return;
  isSubscribed = true;

  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    onSnapshot(
      productsRef,
      (snapshot) => {
        if (snapshot.empty) {
          // If Firestore is empty, seed initial products
          seedInitialProducts();
          inMemoryProducts = INITIAL_PRODUCTS as Product[];
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("fityatra_products_updated"));
          }
          return;
        }

        const productsFromFS: Product[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Product;
          productsFromFS.push(data);
        });

        inMemoryProducts = productsFromFS;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("fityatra_products_updated"));
        }
      },
      (error) => {
        console.error("Firestore products snapshot error:", error);
      }
    );
  } catch (err) {
    console.error("Failed to set up Firestore products listener:", err);
  }
}

async function seedInitialProducts() {
  try {
    for (const prod of INITIAL_PRODUCTS) {
      const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      await setDoc(docRef, prod);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, PRODUCTS_COLLECTION);
  }
}

// Ensure subscription starts
subscribeToProducts();

export function loadAllProducts(): Product[] {
  if (inMemoryProducts && inMemoryProducts.length > 0) {
    return inMemoryProducts;
  }
  inMemoryProducts = INITIAL_PRODUCTS as Product[];
  return inMemoryProducts;
}

export async function saveAllProducts(products: Product[]) {
  const productsWithTS = products.map((p) => ({
    ...p,
    updatedAt: p.updatedAt || Date.now(),
  }));
  inMemoryProducts = productsWithTS;

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("fityatra_products_updated"));
  }

  // Sync each product to Firestore directly for instant real-time synchronization
  try {
    for (const prod of productsWithTS) {
      const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      await setDoc(docRef, prod, { merge: true });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, PRODUCTS_COLLECTION);
  }

  // Backup sync to server REST endpoint
  if (typeof window !== "undefined") {
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productsWithTS),
    }).catch((err) => console.error("Failed to sync products to server endpoint", err));
  }
}

export function saveProductsFromServer(products: Product[]): Product[] {
  if (!products || products.length === 0) return loadAllProducts();
  inMemoryProducts = products;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("fityatra_products_updated"));
  }
  return products;
}

export async function addProduct(product: Product): Promise<Product> {
  const prodWithTS = { ...product, updatedAt: Date.now() };
  const all = loadAllProducts();
  const existingIdx = all.findIndex((p) => p.id === prodWithTS.id);
  if (existingIdx !== -1) {
    all[existingIdx] = prodWithTS;
  } else {
    all.push(prodWithTS);
  }

  inMemoryProducts = all;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("fityatra_products_updated"));
  }

  // Write directly to Firestore
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, prodWithTS.id);
    await setDoc(docRef, prodWithTS);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${PRODUCTS_COLLECTION}/${prodWithTS.id}`);
  }

  // Server backup
  if (typeof window !== "undefined") {
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(all),
    }).catch((err) => console.error("Failed server backup sync", err));
  }

  return prodWithTS;
}

export async function updateProduct(id: string, updatedFields: Partial<Product>): Promise<Product | null> {
  const all = loadAllProducts();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const updatedProduct = {
    ...all[idx],
    ...updatedFields,
    updatedAt: Date.now(),
  };

  all[idx] = updatedProduct;
  inMemoryProducts = all;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("fityatra_products_updated"));
  }

  // Write directly to Firestore
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await setDoc(docRef, updatedProduct, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${PRODUCTS_COLLECTION}/${id}`);
  }

  // Server backup
  if (typeof window !== "undefined") {
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(all),
    }).catch((err) => console.error("Failed server backup sync", err));
  }

  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const all = loadAllProducts();
  const initialLen = all.length;
  const filtered = all.filter((p) => p.id !== id);

  inMemoryProducts = filtered;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("fityatra_products_updated"));
  }

  // Delete from Firestore
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${id}`);
  }

  // Server backup
  if (typeof window !== "undefined") {
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtered),
    }).catch((err) => console.error("Failed server backup sync", err));
  }

  return filtered.length < initialLen;
}
