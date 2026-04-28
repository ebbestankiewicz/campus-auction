import "../../css/main.css";
import { getProfile } from "../api/profiles";
import { renderNavbar } from "../ui/navbar";
import { createProfileDetails } from "../ui/profileDetails";
import { requireAuth } from "../utils/authGuard";
import { getUser } from "../utils/storage";
import { createLoadingSpinner } from "../ui/loading";

async function loadProfile(): Promise<void> {
  const container = document.querySelector<HTMLElement>("#profile");

  if (!container) return;

  const user = getUser();

  if (!user?.name) {
    container.innerHTML = `<p class="text-muted">Could not find logged-in user.</p>`;
    return;
  }

  container.innerHTML = createLoadingSpinner("Loading profile...");

  try {
    const profile = await getProfile(user.name);
    container.innerHTML = createProfileDetails(profile);
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p class="text-muted">Failed to load profile.</p>`;
  }
}

function initProfilePage(): void {
  requireAuth();
  renderNavbar();
  loadProfile();
}

initProfilePage();
