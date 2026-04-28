import "../../css/main.css";
import { createListing } from "../api/listings";
import { renderNavbar } from "../ui/navbar";
import { showToast } from "../ui/toast";
import { requireAuth } from "../utils/authGuard";

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

function setupCreateListingForm(): void {
  const form = document.querySelector<HTMLFormElement>("#createListingForm");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titleInput = document.querySelector<HTMLInputElement>("#title");
    const descriptionInput =
      document.querySelector<HTMLTextAreaElement>("#description");
    const mediaInput = document.querySelector<HTMLInputElement>("#mediaUrl");
    const tagsInput = document.querySelector<HTMLInputElement>("#tags");
    const endsAtInput = document.querySelector<HTMLInputElement>("#endsAt");

    if (
      !titleInput ||
      !descriptionInput ||
      !mediaInput ||
      !tagsInput ||
      !endsAtInput
    ) {
      return;
    }

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const mediaUrl = mediaInput.value.trim();
    const tags = tagsInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const endsAt = new Date(endsAtInput.value).toISOString();

    if (!title) {
      showMessage("Title is required.", "error");
      return;
    }

    if (new Date(endsAt) <= new Date()) {
      showMessage("Deadline must be in the future.", "error");
      return;
    }

    try {
      const listing = await createListing({
        title,
        description,
        tags,
        media: mediaUrl ? [{ url: mediaUrl, alt: title }] : [],
        endsAt,
      });

      showToast("Listing created successfully.", "success");

      setTimeout(() => {
        window.location.href = `/listing.html?id=${listing.id}`;
      }, 800);
    } catch (error) {
      console.error(error);
      showToast("Failed to create listing. Please check your inputs.", "error");
    }
  });
}

function initCreateListingPage(): void {
  requireAuth();
  renderNavbar();
  setupCreateListingForm();
}

initCreateListingPage();
