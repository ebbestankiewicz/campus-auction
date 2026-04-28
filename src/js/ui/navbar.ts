import { getProfile } from "../api/profiles";
import { clearAuth, getUser, isLoggedIn } from "../utils/storage";

function createVisitorNavbar(): string {
  return `
    <nav class="flex items-center justify-between border-b border-border bg-bg px-6 py-4 text-text">
      <a href="/index.html" class="text-lg font-bold">Campus Auction</a>

      <div class="flex gap-3">
        <a href="/login.html" class="rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary-muted transition hover:bg-primary hover:text-text">
          Login
        </a>
        <a href="/register.html" class="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-text transition hover:bg-primary-hover">
          Register
        </a>
      </div>
    </nav>
  `;
}

function createLoggedInNavbar(credits: number, avatarUrl?: string): string {
  const user = getUser();
  const name = user?.name || "Profile";
  const avatar = avatarUrl || user?.avatar?.url || "";

  return `
    <nav class="flex items-center justify-between border-b border-border bg-bg px-6 py-4 text-text">
      <a href="/index.html" class="text-lg font-semibold">Campus Auction</a>

      <div class="flex items-center gap-4">
        <span class="rounded-xl border border-muted-soft px-4 py-2 text-sm font-semibold text-text">
          $ ${credits}
        </span>

        <a href="/profile.html" class="flex items-center gap-2">
          ${
            avatar
              ? `<img src="${avatar}" alt="${name}" class="h-9 w-9 rounded-full border border-border object-cover" />`
              : `<span class="rounded-full border border-border px-3 py-2 text-sm text-muted">${name}</span>`
          }
        </a>

        <button id="logoutBtn" type="button" class="text-sm text-muted transition hover:text-text">
          Logout
        </button>
      </div>
    </nav>
  `;
}

export async function renderNavbar(): Promise<void> {
  const container = document.querySelector<HTMLElement>("#navbar");

  if (!container) return;

  if (!isLoggedIn()) {
    container.innerHTML = createVisitorNavbar();
    return;
  }

  const user = getUser();

  if (!user?.name) {
    container.innerHTML = createVisitorNavbar();
    return;
  }

  container.innerHTML = createLoggedInNavbar(0, user.avatar?.url);

  try {
    const profile = await getProfile(user.name);

    container.innerHTML = createLoggedInNavbar(
      profile.credits,
      profile.avatar?.url,
    );
  } catch (error) {
    console.error(error);
  }

  const logoutBtn = document.querySelector<HTMLButtonElement>("#logoutBtn");

  logoutBtn?.addEventListener("click", () => {
    clearAuth();
    window.location.href = "/index.html";
  });
}
