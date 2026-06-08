import { useCallback, useState } from "react";

interface ToastState {
  message: string;
  type: "success" | "error";
  id: number;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = Date.now();
      setToast({ message, type, id });
      setTimeout(() => setToast(null), 3000);
    },
    [],
  );

  return { toast, showToast };
};
