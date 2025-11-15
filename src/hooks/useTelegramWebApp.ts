import { useEffect, useMemo, useCallback } from 'react';
import type { PopupParams } from 'telegram-web-app';
import { isTelegramWebApp, getTelegramWebApp } from '@/utils/telegram';

/**
 * Hook for accessing Telegram WebApp API methods
 * 
 * @returns Object containing Telegram WebApp instance and helper methods
 * 
 * @example
 * ```tsx
 * const { webApp, isReady, ready, expand, close, showAlert, showConfirm } = useTelegramWebApp();
 * 
 * useEffect(() => {
 *   if (isReady) {
 *     ready();
 *   }
 * }, [isReady, ready]);
 * ```
 */
export const useTelegramWebApp = () => {
  const webApp = useMemo(() => getTelegramWebApp(), []);
  const isReady = useMemo(() => isTelegramWebApp(), []);

  /**
   * Call this method to inform the Telegram app that the Mini App is ready to be displayed
   */
  const ready = useCallback((): void => {
    if (webApp) {
      webApp.ready();
    }
  }, [webApp]);

  /**
   * Expands the Mini App to the maximum available height
   */
  const expand = useCallback((): void => {
    if (webApp) {
      webApp.expand();
    }
  }, [webApp]);

  /**
   * Closes the Mini App
   */
  const close = useCallback((): void => {
    if (webApp) {
      webApp.close();
    }
  }, [webApp]);

  /**
   * Shows a native popup with text message
   */
  const showAlert = useCallback((message: string, callback?: () => void): void => {
    if (webApp) {
      webApp.showAlert(message, callback);
    } else {
      // Fallback for non-Telegram environment
      window.alert(message);
      callback?.();
    }
  }, [webApp]);

  /**
   * Shows a native popup with text message and two buttons
   */
  const showConfirm = useCallback(
    (message: string, callback?: (confirmed: boolean) => void): void => {
      if (webApp) {
        webApp.showConfirm(message, callback);
      } else {
        // Fallback for non-Telegram environment
        const confirmed = window.confirm(message);
        callback?.(confirmed);
      }
    },
    [webApp]
  );

  /**
   * Shows a native popup for scanning a QR code
   */
  const showScanQrPopup = useCallback(
    (
      params: { text?: string },
      callback?: (text: string) => void | boolean
    ): void => {
      if (webApp) {
        webApp.showScanQrPopup(params, callback);
      }
    },
    [webApp]
  );

  /**
   * Closes the native popup for scanning a QR code
   */
  const closeScanQrPopup = useCallback((): void => {
    if (webApp) {
      webApp.closeScanQrPopup();
    }
  }, [webApp]);

  /**
   * Shows a native popup requesting permission for the bot to send messages to the user
   */
  const requestWriteAccess = useCallback(
    (callback?: (granted: boolean) => void): void => {
      if (webApp) {
        webApp.requestWriteAccess(callback);
      }
    },
    [webApp]
  );

  /**
   * Shows a native popup requesting permission for the bot to send messages to the user
   */
  const requestContact = useCallback(
    (callback?: (granted: boolean) => void): void => {
      if (webApp) {
        webApp.requestContact(callback);
      }
    },
    [webApp]
  );

  /**
   * Opens a link in an external browser
   */
  const openLink = useCallback((url: string, options?: { try_instant_view?: boolean }): void => {
    if (webApp) {
      webApp.openLink(url, options);
    } else {
      // Fallback for non-Telegram environment
      window.open(url, '_blank');
    }
  }, [webApp]);

  /**
   * Opens a Telegram link
   */
  const openTelegramLink = useCallback((url: string): void => {
    if (webApp) {
      webApp.openTelegramLink(url);
    }
  }, [webApp]);

  /**
   * Opens an invoice using the link url
   */
  const openInvoice = useCallback(
    (url: string, callback: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void): void => {
      if (webApp) {
        webApp.openInvoice(url, callback);
      }
    },
    [webApp]
  );

  /**
   * Shows a native popup
   */
  const showPopup = useCallback(
    (params: PopupParams, callback?: (button_id: string) => void): void => {
      if (webApp) {
        webApp.showPopup(params, callback);
      }
    },
    [webApp]
  );

  /**
   * Shares a message to story
   */
  const shareToStory = useCallback(
    (mediaUrl: string, params?: { text?: string; sticker_id?: string }): void => {
      if (webApp) {
        webApp.shareToStory(mediaUrl, params);
      }
    },
    [webApp]
  );

  /**
   * Shares a message provided by the bot
   */
  const shareMessage = useCallback(
    (msgId: number, callback?: (success: boolean) => void): void => {
      if (webApp) {
        webApp.shareMessage(msgId, callback);
      }
    },
    [webApp]
  );

  /**
   * Sends data to the bot
   */
  const sendData = useCallback((data: string): void => {
    if (webApp) {
      webApp.sendData(data);
    }
  }, [webApp]);


  /**
   * Sets the app header color
   */
  const setHeaderColor = useCallback((color: string): void => {
    if (webApp) {
      webApp.setHeaderColor(color);
    }
  }, [webApp]);

  /**
   * Sets the app background color
   */
  const setBackgroundColor = useCallback((color: string): void => {
    if (webApp) {
      webApp.setBackgroundColor(color);
    }
  }, [webApp]);

  /**
   * Enables the closing confirmation
   */
  const enableClosingConfirmation = useCallback((): void => {
    if (webApp) {
      webApp.enableClosingConfirmation();
    }
  }, [webApp]);

  /**
   * Disables the closing confirmation
   */
  const disableClosingConfirmation = useCallback((): void => {
    if (webApp) {
      webApp.disableClosingConfirmation();
    }
  }, [webApp]);

  /**
   * Sets the app theme
   */
  const setMainButton = useCallback(
    (params: {
      text?: string;
      color?: string;
      textColor?: string;
      isVisible?: boolean;
      isActive?: boolean;
      isProgressVisible?: boolean;
    }): void => {
      if (webApp) {
        webApp.MainButton.setText(params.text || '');
        if (params.color) {
          webApp.MainButton.color = params.color;
        }
        if (params.textColor) {
          webApp.MainButton.textColor = params.textColor;
        }
        if (params.isVisible !== undefined) {
          webApp.MainButton.isVisible = params.isVisible;
        }
        if (params.isActive !== undefined) {
          webApp.MainButton.isActive = params.isActive;
        }
        if (params.isProgressVisible !== undefined) {
          webApp.MainButton.showProgress(params.isProgressVisible);
        }
      }
    },
    [webApp]
  );

  /**
   * Sets the main button click handler
   */
  const onMainButtonClick = useCallback(
    (callback: () => void): (() => void) => {
      if (webApp) {
        webApp.MainButton.onClick(callback);
        return () => {
          webApp.MainButton.offClick(callback);
        };
      }
      return () => {};
    },
    [webApp]
  );

  /**
   * Sets the back button click handler
   */
  const onBackButtonClick = useCallback(
    (callback: () => void): (() => void) => {
      if (webApp) {
        webApp.BackButton.onClick(callback);
        return () => {
          webApp.BackButton.offClick(callback);
        };
      }
      return () => {};
    },
    [webApp]
  );

  /**
   * Shows the back button
   */
  const showBackButton = useCallback((): void => {
    if (webApp) {
      webApp.BackButton.show();
    }
  }, [webApp]);

  /**
   * Hides the back button
   */
  const hideBackButton = useCallback((): void => {
    if (webApp) {
      webApp.BackButton.hide();
    }
  }, [webApp]);

  /**
   * Shows the settings button
   */
  const showSettingsButton = useCallback((): void => {
    if (webApp) {
      webApp.SettingsButton.show();
    }
  }, [webApp]);

  /**
   * Hides the settings button
   */
  const hideSettingsButton = useCallback((): void => {
    if (webApp) {
      webApp.SettingsButton.hide();
    }
  }, [webApp]);

  /**
   * Shows the haptic feedback
   */
  const hapticFeedback = useCallback(
    (
      type: 'impact' | 'notification' | 'selectionChange',
      style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'error' | 'success' | 'warning',
      impactStyle?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
    ): void => {
      if (webApp) {
        if (type === 'impact' && impactStyle) {
          webApp.HapticFeedback.impactOccurred(impactStyle);
        } else if (type === 'notification' && (style === 'error' || style === 'success' || style === 'warning')) {
          webApp.HapticFeedback.notificationOccurred(style);
        } else if (type === 'notification') {
          webApp.HapticFeedback.notificationOccurred('success');
        } else if (type === 'selectionChange') {
          webApp.HapticFeedback.selectionChanged();
        }
      }
    },
    [webApp]
  );

  // Auto-expand on mount
  useEffect(() => {
    if (webApp) {
      webApp.expand();
      webApp.ready();
    }
  }, [webApp]);

  return {
    // WebApp instance
    webApp,
    isReady,

    // Core methods
    ready,
    expand,
    close,

    // Alerts and popups
    showAlert,
    showConfirm,
    showPopup,
    showScanQrPopup,
    closeScanQrPopup,

    // Permissions
    requestWriteAccess,
    requestContact,

    // Links
    openLink,
    openTelegramLink,
    openInvoice,

    // Sharing
    shareToStory,
    shareMessage,

    // Data
    sendData,

    // Styling
    setHeaderColor,
    setBackgroundColor,
    enableClosingConfirmation,
    disableClosingConfirmation,

    // Main button
    setMainButton,
    onMainButtonClick,

    // Back button
    onBackButtonClick,
    showBackButton,
    hideBackButton,

    // Settings button
    showSettingsButton,
    hideSettingsButton,

    // Haptic feedback
    hapticFeedback,
  };
};

