export function createLoadingSpinner(message = "Loading..."): string {
  return `
    <div class="flex min-h-60 flex-col items-center justify-center gap-4 text-muted">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary"></div>
      <p class="text-sm">${message}</p>
    </div>
  `;
}
