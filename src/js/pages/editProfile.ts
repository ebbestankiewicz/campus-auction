import "../../css/main.css";
import { getProfile, updateProfile } from "../api/profiles";
import { renderNavbar } from "../ui/navbar";
import { requireAuth } from "../utils/authGuard";
import { getUser } from "../utils/storage";

function showMessage(message: string, type: "success" | "error"): void {
  const messageElement = document.querySelector<HTMLElement>("#formMessage");

  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.className = "rounded-xl border p-3 text-sm";

  if (type === "success") {
    messageElement.classList.add(
      "bg-success-soft",
      "text-success-muted",
      "border-success",
    );
  } else {
    messageElement.classList.add(
      "bg-danger-soft",
      "text-danger-muted",
      "border-danger",
    );
  }
}

async function loadCurrentProfile(): Promise<void> {
  const user = getUser();

  if (!user?.name) {
    showMessage("Could not find logged-in user.", "error");
    return;
  }

  const avatarInput = document.querySelector<HTMLInputElement>("#avatarUrl");
  const bannerInput = document.querySelector<HTMLInputElement>("#bannerUrl");
  const bioInput = document.querySelector<HTMLTextAreaElement>("#bio");

  if (!avatarInput || !bannerInput || !bioInput) return;

  try {
    const profile = await getProfile(user.name);

    avatarInput.value = profile.avatar?.url || "";
    bannerInput.value = profile.banner?.url || "";
    bioInput.value = profile.bio || "";
  } catch (error) {
    console.error(error);
    showMessage("Failed to load profile details.", "error");
  }
}

function setupEditProfileForm(): void {
  const form = document.querySelector<HTMLFormElement>("#editProfileForm");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = getUser();

    if (!user?.name) {
      showMessage("Could not find logged-in user.", "error");
      return;
    }

    const avatarInput = document.querySelector<HTMLInputElement>("#avatarUrl");
    const bannerInput = document.querySelector<HTMLInputElement>("#bannerUrl");
    const bioInput = document.querySelector<HTMLTextAreaElement>("#bio");

    if (!avatarInput || !bannerInput || !bioInput) return;

    const avatarUrl = avatarInput.value.trim();
    const bannerUrl = bannerInput.value.trim();
    const bio = bioInput.value.trim();

    try {
      await updateProfile(user.name, {
        bio,
        avatar: avatarUrl
          ? {
              url: avatarUrl,
              alt: `${user.name}'s avatar`,
            }
          : undefined,
        banner: bannerUrl
          ? {
              url: bannerUrl,
              alt: `${user.name}'s banner`,
            }
          : undefined,
      });

      showMessage("Profile updated successfully.", "success");

      setTimeout(() => {
        window.location.href = "/profile.html";
      }, 800);
    } catch (error) {
      console.error(error);
      showMessage(
        "Failed to update profile. Please check your URLs and try again.",
        "error",
      );
    }
  });
}

function initEditProfilePage(): void {
  requireAuth();
  renderNavbar();
  loadCurrentProfile();
  setupEditProfileForm();
}

initEditProfilePage();
