export function renderNavbar(): void {
  const container = document.querySelector<HTMLElement>("#navbar");

  if (!container) {
    return;
  }

  container.innerHTML = `
    <nav class="flex items-center justify-between p-4 shadow-2xl">
      <a href="/index.html">Home</a>
      <div>
        <a href="/login.html">Login</a>
        <a href="/register.html">Register</a>
      </div>
    </nav>
  `;
}
