import { db } from "./firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "./firebaseError";

export interface PaymentSettings {
  esewaQrUrl: string;
  esewaAccountName: string;
  esewaAccountNumber: string;
  khaltiQrUrl: string;
  khaltiAccountName: string;
  khaltiAccountNumber: string;
  codInstructions: string;
  isEsewaEnabled: boolean;
  isKhaltiEnabled: boolean;
  isCodEnabled: boolean;
}

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  esewaQrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=9744493393",
  esewaAccountName: "Aashish Bohara",
  esewaAccountNumber: "9744493393",
  khaltiQrUrl: "",
  khaltiAccountName: "FitYatra Supplements",
  khaltiAccountNumber: "98012****9",
  codInstructions: "White/Black Theme Cash on Delivery (COD) - standard. Use Cash or FonePay QR scan at doorstep.",
  isEsewaEnabled: true,
  isKhaltiEnabled: true,
  isCodEnabled: true
};

const PAYMENT_SETTINGS_KEY = "fityatra_payment_settings";
const SETTINGS_COLLECTION = "settings";
const PAYMENT_DOC_ID = "payment";

let inMemorySettings: PaymentSettings | null = null;
let isSubscribed = false;

function subscribeToPaymentSettings() {
  if (isSubscribed) return;
  isSubscribed = true;

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, PAYMENT_DOC_ID);
    onSnapshot(
      docRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          // Seed default settings if missing
          seedDefaultSettings();
          return;
        }

        const data = docSnap.data() as PaymentSettings;
        inMemorySettings = {
          ...DEFAULT_PAYMENT_SETTINGS,
          ...data
        };

        try {
          localStorage.setItem(PAYMENT_SETTINGS_KEY, JSON.stringify(inMemorySettings));
        } catch (e) {
          console.warn("Failed to update payment settings cache", e);
        }
        window.dispatchEvent(new Event("fityatra_payment_settings_updated"));
      },
      (error) => {
        console.error("Firestore payment settings listener error:", error);
      }
    );
  } catch (err) {
    console.error("Failed to set up Firestore payment settings listener:", err);
  }
}

async function seedDefaultSettings() {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, PAYMENT_DOC_ID);
    await setDoc(docRef, DEFAULT_PAYMENT_SETTINGS);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SETTINGS_COLLECTION}/${PAYMENT_DOC_ID}`);
  }
}

subscribeToPaymentSettings();

export function loadPaymentSettings(): PaymentSettings {
  if (inMemorySettings) {
    return inMemorySettings;
  }
  try {
    const data = localStorage.getItem(PAYMENT_SETTINGS_KEY);
    if (data) {
      inMemorySettings = {
        ...DEFAULT_PAYMENT_SETTINGS,
        ...JSON.parse(data)
      };
      return inMemorySettings;
    }
  } catch (e) {
    console.error("Failed to load payment settings from localStorage", e);
  }

  inMemorySettings = DEFAULT_PAYMENT_SETTINGS;
  return inMemorySettings;
}

export async function savePaymentSettings(settings: PaymentSettings) {
  inMemorySettings = settings;
  try {
    localStorage.setItem(PAYMENT_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn("Failed to write payment settings to localStorage", e);
  }
  window.dispatchEvent(new Event("fityatra_payment_settings_updated"));

  // Save directly to Firestore for real-time live synchronization
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, PAYMENT_DOC_ID);
    await setDoc(docRef, settings, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SETTINGS_COLLECTION}/${PAYMENT_DOC_ID}`);
  }

  // Backup sync to server REST endpoint
  fetch("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  }).catch((err) => console.error("Failed to sync payment settings to server endpoint", err));
}
