import { useMemo, type ReactNode } from 'react';
import toast, { Toaster, type ToastOptions } from 'react-hot-toast';
import { CustomToast } from '@/components/Toast';
import { ToastContext, useToast } from './context';

interface IToastProviderProps {
  children: ReactNode;
}

/**
 * Toast provider that wraps the app with toast notification functionality
 */
export const ToastProvider = ({ children }: IToastProviderProps): JSX.Element => {
  const toastContext = useMemo(
    () => ({
      toastSuccess: (message: string, options?: ToastOptions) => {
        return toast.custom(
          (t) => <CustomToast toast={t} message={message} type="success" />,
          {
            duration: 3000,
            ...options,
          }
        );
      },
      toastError: (message: string, options?: ToastOptions) => {
        return toast.custom(
          (t) => <CustomToast toast={t} message={message} type="error" />,
          {
            duration: 4000,
            ...options,
          }
        );
      },
      toastInfo: (message: string, options?: ToastOptions) => {
        return toast.custom(
          (t) => <CustomToast toast={t} message={message} type="info" />,
          {
            duration: 3000,
            ...options,
          }
        );
      },
      toastLoading: (message: string, options?: ToastOptions) => {
        return toast.custom(
          (t) => <CustomToast toast={t} message={message} type="loading" />,
          {
            duration: Infinity,
            ...options,
          }
        );
      },
      toastDismiss: (toastId?: string) => {
        toast.dismiss(toastId);
      },
    }),
    []
  );

  return (
    <ToastContext.Provider value={toastContext}>
      {children}
      <Toaster
        position="top-center"
        containerStyle={{
          top: 20,
        }}
        gutter={12}
      />
    </ToastContext.Provider>
  );
};

export { useToast };

