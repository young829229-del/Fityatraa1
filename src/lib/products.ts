import { Product } from "../types";
import { PRODUCTS as INITIAL_PRODUCTS } from "../data";

const PRODUCTS_LOCAL_STORAGE_KEY = "fityatra_dynamic_products";

let inMemoryProducts: Product[] | null = null;

export function loadAllProducts(): Product[] {
  if (inMemoryProducts) {
    const fishoil = inMemoryProducts.find(p => p.id === "muscleblaze-fishoil");
    const lcarnitine = inMemoryProducts.find(p => p.id === "muscleblaze-lcarnitine");
    if (!fishoil || fishoil.category === "Creatine" || !lcarnitine || lcarnitine.category === "Creatine") {
      inMemoryProducts = null;
    } else {
      return inMemoryProducts;
    }
  }
  try {
    const data = localStorage.getItem(PRODUCTS_LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      inMemoryProducts = INITIAL_PRODUCTS as Product[];
      return inMemoryProducts;
    }
    let parsed: Product[] = JSON.parse(data);
    
    // Auto-heal default products client-side cache to match INITIAL_PRODUCTS
    let changed = false;
    parsed = parsed.map(p => {
      const dp = INITIAL_PRODUCTS.find(d => d.id === p.id);
      if (dp) {
        let fieldChanged = false;
        for (const key of Object.keys(dp)) {
          if (JSON.stringify((p as any)[key]) !== JSON.stringify((dp as any)[key])) {
            (p as any)[key] = (dp as any)[key];
            fieldChanged = true;
          }
        }
        if (fieldChanged) changed = true;
      }
      return p;
    });

    if (changed) {
      localStorage.setItem(PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }

    inMemoryProducts = parsed;
    return inMemoryProducts!;
  } catch (e) {
    console.error("Failed to load products dynamically", e);
    return INITIAL_PRODUCTS as Product[];
  }
}

export function saveAllProducts(products: Product[]) {
  inMemoryProducts = products;
  try {
    localStorage.setItem(PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn("Failed to save products to localStorage (possibly exceeded quota)", e);
  }

  try {
    // Trigger custom event so other components know products changed
    window.dispatchEvent(new Event("fityatra_products_updated"));

    // Async server synchronization
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(products),
    }).catch((err) => console.error("Failed to sync products to server", err));
  } catch (e) {
    console.error("Failed to sync or dispatch products dynamically", e);
  }
}

export function saveProductsFromServer(products: Product[]): Product[] {
  inMemoryProducts = products;
  try {
    localStorage.setItem(PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn("Failed to save products from server to localStorage (possibly exceeded quota)", e);
  }
  window.dispatchEvent(new Event("fityatra_products_updated"));
  return products;
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
