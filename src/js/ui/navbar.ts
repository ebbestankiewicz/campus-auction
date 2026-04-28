import { getProfile } from "../api/profiles";
import { clearAuth, getUser, isLoggedIn } from "../utils/storage";

function createVisitorNavbar(): string {
  return `
    <nav class="flex items-center justify-between px-6 py-4 text-white">
      <a href="/index.html" class="text-lg font-bold">Campus Auction</a>

      <div class="flex gap-3">
        <a href="/login.html" class="rounded-xl border border-purple-500 px-4 py-2 text-sm font-semibold text-purple-300 hover:bg-purple-500 hover:text-white">
          Login
        </a>
        <a href="/register.html" class="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700">
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
    <nav class="flex items-center justify-between px-6 py-4 text-white">
      <a href="/index.html" class="text-lg font-bold">Campus Auction</a>

      <div class="flex items-center gap-4">
        <span class="rounded-full border border-purple-500 bg-purple-950 px-4 py-2 text-sm font-semibold text-purple-300">
          Credits: ${credits}
        </span>

        <a href="/create-listing.html" class="hidden rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 sm:inline-flex">
          Create listing
        </a>

        <a href="/profile.html" class="flex items-center gap-2">
          ${
            avatar
              ? `<img src="${avatar}" alt="${name}" class="h-9 w-9 rounded-full object-cover" />`
              : `<span class="rounded-full border border-slate-700 px-3 py-2 text-sm">${name}</span>`
          }
        </a>

        <button id="logoutBtn" type="button" class="text-sm text-slate-300 hover:text-white">
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
