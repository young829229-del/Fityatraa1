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
  if (isSubscribed) return;
  isSubscribed = true;

  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    onSnapshot(
      productsRef,
      (snapshot) => {
        if (snapshot.empty) {
          // If Firestore is empty, seed initial products
          seedInitialProducts();
          return;
        }

        const productsFromFS: Product[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Product;
          productsFromFS.push(data);
        });

        inMemoryProducts = productsFromFS;
        try {
          localStorage.setItem(PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(productsFromFS));
        } catch (e) {
          console.warn("localStorage quota exceeded for products cache", e);
        }
        window.dispatchEvent(new Event("fityatra_products_updated"));
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
  try {
    const data = localStorage.getItem(PRODUCTS_LOCAL_STORAGE_KEY);
    if (data) {
      const parsed: Product[] = JSON.parse(data);
      if (parsed && parsed.length > 0) {
        inMemoryProducts = parsed;
        return inMemoryProducts;
      }
    }
  } catch (e) {
    console.error("Failed to parse cached products", e);
  }

  inMemoryProducts = INITIAL_PRODUCTS as Product[];
  return inMemoryProducts;
}

export async function saveAllProducts(products: Product[]) {
  inMemoryProducts = products;
  try {
    localStorage.setItem(PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn("Failed to save products to localStorage", e);
  }

  window.dispatchEvent(new Event("fityatra_products_updated"));

  // Sync each product to Firestore directly for instant real-time synchronization
  try {
    for (const prod of products) {
      const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      await setDoc(docRef, prod, { merge: true });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, PRODUCTS_COLLECTION);
  }

  // Backup sync to server REST endpoint
  fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(products),
  }).catch((err) => console.error("Failed to sync products to server endpoint", err));
}

export function saveProductsFromServer(products: Product[]): Product[] {
  if (!products || products.length === 0) return loadAllProducts();
  inMemoryProducts = products;
  try {
    localStorage.setItem(PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn("Failed to save products from server to localStorage", e);
  }
  window.dispatchEvent(new Event("fityatra_products_updated"));
  return products;
}

export async function addProduct(product: Product): Promise<Product> {
  const all = loadAllProducts();
  const existingIdx = all.findIndex((p) => p.id === product.id);
  if (existingIdx !== -1) {
    all[existingIdx] = product;
  } else {
    all.push(product);
  }

  inMemoryProducts = all;
  try {
    localStorage.setItem(PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.warn("localStorage write failed", e);
  }
  window.dispatchEvent(new Event("fityatra_products_updated"));

  // Write directly to Firestore
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, product);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${PRODUCTS_COLLECTION}/${product.id}`);
  }

  // Server backup
  fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(all),
  }).catch((err) => console.error("Failed server backup sync", err));

  return product;
}

export async function updateProduct(id: string, updatedFields: Partial<Product>): Promise<Product | null> {
  const all = loadAllProducts();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const updatedProduct = {
    ...all[idx],
    ...updatedFields,
  };

  all[idx] = updatedProduct;
  inMemoryProducts = all;
  try {
    localStorage.setItem(PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.warn("localStorage write failed", e);
  }
  window.dispatchEvent(new Event("fityatra_products_updated"));

  // Write directly to Firestore
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await setDoc(docRef, updatedProduct, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${PRODUCTS_COLLECTION}/${id}`);
  }

  // Server backup
  fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(all),
  }).catch((err) => console.error("Failed server backup sync", err));

  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const all = loadAllProducts();
  const initialLen = all.length;
  const filtered = all.filter((p) => p.id !== id);

  inMemoryProducts = filtered;
  try {
    localStorage.setItem(PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn("localStorage write failed", e);
  }
  window.dispatchEvent(new Event("fityatra_products_updated"));

  // Delete from Firestore
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${id}`);
  }

  // Server backup
  fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filtered),
  }).catch((err) => console.error("Failed server backup sync", err));

  return filtered.length < initialLen;
}
