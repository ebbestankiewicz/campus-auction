type ToastType = "success" | "error" | "info";

export function showToast(message: string, type: ToastType = "info"): void {
  let container = document.querySelector<HTMLElement>("#toastContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className =
      "fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");

  const styles = {
    success: "border-success bg-success-soft text-success-muted",
    error: "border-danger bg-danger-soft text-danger-muted",
    info: "border-primary bg-primary-soft text-primary-muted",
  };

  toast.className = `rounded-xl border p-4 text-sm shadow-xl ${styles[type]}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}
