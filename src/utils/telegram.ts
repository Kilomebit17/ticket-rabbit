import type { WebApp } from 'telegram-web-app';

/**
 * Utility functions for Telegram WebApp integration
 */

/**
 * Checks if the app is running inside Telegram WebApp
 * @returns true if running in Telegram WebApp, false otherwise
 */
export const isTelegramWebApp = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    typeof (window as any).Telegram !== 'undefined' &&
    typeof (window as any).Telegram?.WebApp !== 'undefined'
  );
};

/**
 * Gets the Telegram WebApp instance
 * @returns Telegram WebApp instance or null if not available
 */
export const getTelegramWebApp = (): WebApp | null => {
  if (!isTelegramWebApp()) {
    return null;
  }

  const webApp = (window as any).Telegram?.WebApp;
  return webApp || null;
};

/**
 * Expands the Telegram WebApp to full height
 * Should be called on app initialization
 */
export const expandTelegramWebApp = (): void => {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.expand();
  }
};

/**
 * Initializes Telegram WebApp settings
 * Expands the app and configures default settings
 */
export const initializeTelegramWebApp = (): void => {
  const webApp = getTelegramWebApp();
  if (!webApp) {
    return;
  }

  // Expand the app to full height
  webApp.expand();

  // Enable closing confirmation (optional)
  // webApp.enableClosingConfirmation();

  // Set theme colors (optional - can be customized)
  // webApp.setHeaderColor('#ffffff');
  // webApp.setBackgroundColor('#ffffff');
};

