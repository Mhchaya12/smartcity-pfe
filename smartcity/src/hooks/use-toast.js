import { useState, useCallback } from 'react';

let toastFn;
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default' }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, title, description, variant };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return { toast, toasts };
} 

export const toast = (props) => {
  if (toastFn) {
    toastFn(props);
  } else {
    console.warn('Toast function called before hook initialization');
  }
};