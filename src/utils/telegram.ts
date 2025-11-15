import type { WebApp } from 'telegram-web-app';

/**
 * Utility functions for Telegram WebApp integration
 */

/**
 * Checks if the app is running inside Telegram WebApp
 * Verifies that Telegram WebApp is actually initialized (not just the object exists)
 * @returns true if running in Telegram WebApp, false otherwise
 */
export const isTelegramWebApp = (): boolean => {
  const telegram = (window as any).Telegram;
  const webApp = telegram?.WebApp;

  // Check if Telegram WebApp object exists
  if (!webApp) {
    return false;
  }

  // Verify it's actually a Telegram environment by checking for properties
  // that are only present when running in real Telegram WebApp
  // initData or platform are reliable indicators of a real Telegram environment
  return webApp.initData
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

