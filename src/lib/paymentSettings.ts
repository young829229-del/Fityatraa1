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
  esewaQrUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsAQMAAABDs9czAAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlMAAHaTzTgAAAGRSURBVGjNY2AYBaNgFAwfMGfO9A+KHzNm/gWpP5gYGRgqgGofRkwbY+pDGAqOglEwCoZfGHB6P/bIpxcMvzAgnSgYBoNRE8BYqOAwFp/DWCQORgExDqNgmIZRMPzCwD8Nf29fGBgY/v+/AOMwFIpGAb7A6AnYFwZgVn7mF76gY6HCwxgpDkYBMZ6gYJiGUTD8woDPqGf7p86uGv6TMyXFMCBGIEY6i4JRMAqGVRiwnB77p9avGTUeCwwMDL8e9B8FRgG+8MDB0SgYBaNgWIXBnzfXFpY3GP49fP39uFswFEpGAb5wwcHRKBgFo2BYhUGM05kYf70G0vj9Z8M0CExiMArwhQdHowKjYBgCo2D4hYGAOfP9Z8f/f94A6gP/X38/PhYKhZJRAMFpdHAUjIJRMAzCwPvLz5f9Z8bX6v9//gKqD4wCfAGDo1EwCkbBsAqDoBqnv++fXgNpfA8OgsWkFAajAF944OBoFIyCUTD8wuD/4ffr/jPjB3mU7+HRKMD3YgODKxgZGAAMV+kQ6BfV6QAAAABJRU5ErkJoggling==",
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

    // Sync setting asynchronously to the fullstack server
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    }).catch((err) => console.error("Failed to sync payment settings to server", err));
  } catch (e) {
    console.error("Failed to save payment settings", e);
  }
}
