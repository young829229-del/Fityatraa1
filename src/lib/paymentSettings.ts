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

const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  esewaQrUrl: "https://i.ibb.co/rKx0ZpM3/IMG-20260617-WA0012.jpg",
  esewaAccountName: "FitYatra Supplements",
  esewaAccountNumber: "98510****2",
  khaltiQrUrl: "",
  khaltiAccountName: "FitYatra Supplements",
  khaltiAccountNumber: "98012****9",
  codInstructions: "White/Black Theme Cash on Delivery (COD) - standard. Use Cash or FonePay QR scan at doorstep.",
  isEsewaEnabled: true,
  isKhaltiEnabled: true,
  isCodEnabled: true
};

const PAYMENT_SETTINGS_KEY = "fityatra_payment_settings";

export function loadPaymentSettings(): PaymentSettings {
  try {
    const data = localStorage.getItem(PAYMENT_SETTINGS_KEY);
    if (!data) {
      localStorage.setItem(PAYMENT_SETTINGS_KEY, JSON.stringify(DEFAULT_PAYMENT_SETTINGS));
      return DEFAULT_PAYMENT_SETTINGS;
    }
    return {
      ...DEFAULT_PAYMENT_SETTINGS,
      ...JSON.parse(data)
    };
  } catch (e) {
    console.error("Failed to load payment settings", e);
    return DEFAULT_PAYMENT_SETTINGS;
  }
}

export function savePaymentSettings(settings: PaymentSettings) {
  try {
    localStorage.setItem(PAYMENT_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event("fityatra_payment_settings_updated"));
  } catch (e) {
    console.error("Failed to save payment settings", e);
  }
}
