import { createContext, useContext } from "react";
import { type ToastOptions } from "react-hot-toast";

interface IToastContext {
  toastSuccess: (message: string, options?: ToastOptions) => string;
  toastError: (message: string, options?: ToastOptions) => string;
  toastInfo: (message: string, options?: ToastOptions) => string;
  toastLoading: (message: string, options?: ToastOptions) => string;
  toastDismiss: (toastId?: string) => void;
}

const ToastContext = createContext<IToastContext | undefined>(undefined);

export const useToast = (): IToastContext => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export { ToastContext };
export type { IToastContext };
