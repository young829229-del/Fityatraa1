import { Product } from "../types";
import { PRODUCTS as INITIAL_PRODUCTS } from "../data";

const PRODUCTS_LOCAL_STORAGE_KEY = "fityatra_dynamic_products";

export function loadAllProducts(): Product[] {
  try {
    const data = localStorage.getItem(PRODUCTS_LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS as Product[];
    }
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load products dynamically", e);
    return INITIAL_PRODUCTS as Product[];
  }
}

export function saveAllProducts(products: Product[]) {
  try {
    localStorage.setItem(PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(products));
    // Trigger custom event so other components know products changed
    window.dispatchEvent(new Event("fityatra_products_updated"));

    // Async server synchronization
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(products),
    }).catch((err) => console.error("Failed to sync products to server", err));
  } catch (e) {
    console.error("Failed to save products dynamically", e);
  }
}

export function addProduct(product: Product): Product {
  const all = loadAllProducts();
  all.push(product);
  saveAllProducts(all);
  return product;
}

export function updateProduct(id: string, updatedFields: Partial<Product>): Product | null {
  const all = loadAllProducts();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  
  const updatedProduct = {
    ...all[idx],
    ...updatedFields,
  };
  
  all[idx] = updatedProduct;
  saveAllProducts(all);
  return updatedProduct;
}

export function deleteProduct(id: string): boolean {
  const all = loadAllProducts();
  const initialLen = all.length;
  const filtered = all.filter((p) => p.id !== id);
  saveAllProducts(filtered);
  return filtered.length < initialLen;
}
