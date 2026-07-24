import { db } from "./firebase";
import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "./firebaseError";

export interface OrderItem {
  name: string;
  quantity: number;
}

export type OrderStatus = "placed" | "processing" | "dispatched" | "transit" | "out_for_delivery" | "delivered";

export interface Order {
  id: string;
  name: string;
  phone: string;
  address?: string;
  coordinates?: any;
  region: string;
  total: number;
  paymentMode?: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  shippingPartner?: string;
  notes?: string;
  screenshot?: string;
}

const ORDERS_LOCAL_STORAGE_KEY = "fityatra_orders";
const ORDERS_COLLECTION = "orders";

let inMemoryOrders: Order[] | null = null;
let isSubscribed = false;

export function subscribeToOrders(callback?: (orders: Order[]) => void) {
  if (isSubscribed) return;
  isSubscribed = true;

  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    onSnapshot(
      ordersRef,
      (snapshot) => {
        const ordersFromFS: Order[] = [];
        snapshot.forEach((docSnap) => {
          ordersFromFS.push(docSnap.data() as Order);
        });

        inMemoryOrders = ordersFromFS;
        try {
          localStorage.setItem(ORDERS_LOCAL_STORAGE_KEY, JSON.stringify(ordersFromFS));
        } catch (e) {
          console.warn("localStorage quota exceeded for orders cache", e);
        }

        window.dispatchEvent(new Event("fityatra_orders_updated"));
        if (callback) callback(ordersFromFS);
      },
      (error) => {
        console.error("Firestore orders snapshot error:", error);
      }
    );
  } catch (err) {
    console.error("Failed to set up Firestore orders listener:", err);
  }
}

subscribeToOrders();

export function loadAllOrders(): Order[] {
  if (inMemoryOrders) {
    return inMemoryOrders;
  }
  try {
    const data = localStorage.getItem(ORDERS_LOCAL_STORAGE_KEY);
    if (data) {
      inMemoryOrders = JSON.parse(data);
      return inMemoryOrders!;
    }
  } catch (e) {
    console.error("Failed to parse cached orders", e);
  }
  return [];
}

export async function addOrder(order: Order): Promise<Order> {
  const all = loadAllOrders();
  all.unshift(order);
  inMemoryOrders = all;

  try {
    localStorage.setItem(ORDERS_LOCAL_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.warn("Failed to write order to localStorage", e);
  }
  window.dispatchEvent(new Event("fityatra_orders_updated"));

  try {
    const docRef = doc(db, ORDERS_COLLECTION, order.id);
    await setDoc(docRef, order);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${ORDERS_COLLECTION}/${order.id}`);
  }

  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, notes?: string): Promise<boolean> {
  const all = loadAllOrders();
  const idx = all.findIndex((o) => o.id === orderId);
  if (idx === -1) return false;

  all[idx] = {
    ...all[idx],
    status,
    ...(notes ? { notes } : {})
  };
  inMemoryOrders = all;

  try {
    localStorage.setItem(ORDERS_LOCAL_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.warn("Failed to write updated order to localStorage", e);
  }
  window.dispatchEvent(new Event("fityatra_orders_updated"));

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await setDoc(docRef, { status, ...(notes ? { notes } : {}) }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderId}`);
  }

  return true;
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  const all = loadAllOrders();
  const filtered = all.filter((o) => o.id !== orderId);
  inMemoryOrders = filtered;

  try {
    localStorage.setItem(ORDERS_LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn("Failed to update orders in localStorage", e);
  }
  window.dispatchEvent(new Event("fityatra_orders_updated"));

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${ORDERS_COLLECTION}/${orderId}`);
  }

  return true;
}
