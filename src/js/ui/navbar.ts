import { isLoggedIn, getUser, clearAuth } from "../utils/storage";

function createVisitorNavbar(): string {
  return `
    <nav class="flex items-center justify-between p-4 shadow-2xl">
      <a href="/index.html">Home</a>

      <div class="flex gap-4">
        <a href="/login.html">Login</a>
        <a href="/register.html">Register</a>
      </div>
    </nav>
  `;
}

function createLoggedInNavbar(): string {
  const user = getUser();

  const name = user?.name || "Profile";
  const credits = user?.credits ?? 0;
  const avatar = user?.avatar?.url || "";

  return `
    <nav class="flex items-center justify-between p-4 shadow-2xl">
      <a href="/index.html">Home</a>

      <div class="flex items-center gap-4">
        <span>Credits: ${credits}</span>

        <a href="/profile.html">
          ${
            avatar
              ? `<img src="${avatar}" alt="${name}" class="w-8 h-8 rounded-full" />`
              : name
          }
        </a>

        <button id="logoutBtn">Logout</button>
      </div>
    </nav>
  `;
}

export function renderNavbar(): void {
  const container = document.querySelector<HTMLElement>("#navbar");

  if (!container) return;

  // decide which navbar to show
  container.innerHTML = isLoggedIn()
    ? createLoggedInNavbar()
    : createVisitorNavbar();

  // attach logout logic if button exists
  const logoutBtn = document.querySelector<HTMLButtonElement>("#logoutBtn");

  logoutBtn?.addEventListener("click", () => {
    clearAuth();
    window.location.href = "/index.html";
  });
}
