import "../../css/main.css";
import { getListingById, updateListing } from "../api/listings";
import { renderNavbar } from "../ui/navbar";
import { requireAuth } from "../utils/authGuard";

let listingId: string | null = null;

async function loadListing(): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  listingId = params.get("id");

  if (!listingId) return;

  const listing = await getListingById(listingId);

  (document.querySelector("#title") as HTMLInputElement).value = listing.title;
  (document.querySelector("#description") as HTMLTextAreaElement).value =
    listing.description || "";
  (document.querySelector("#mediaUrl") as HTMLInputElement).value =
    listing.media?.[0]?.url || "";
  (document.querySelector("#tags") as HTMLInputElement).value =
    listing.tags?.join(", ") || "";
  (document.querySelector("#endsAt") as HTMLInputElement).value =
    listing.endsAt.slice(0, 16);
}

function setupForm(): void {
  const form = document.querySelector("#editListingForm") as HTMLFormElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!listingId) return;

    const title = (document.querySelector("#title") as HTMLInputElement).value;
    const description = (
      document.querySelector("#description") as HTMLTextAreaElement
    ).value;
    const mediaUrl = (document.querySelector("#mediaUrl") as HTMLInputElement)
      .value;
    const tags = (document.querySelector("#tags") as HTMLInputElement).value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const endsAt = new Date(
      (document.querySelector("#endsAt") as HTMLInputElement).value,
    ).toISOString();

    try {
      await updateListing(listingId, {
        title,
        description,
        tags,
        media: mediaUrl ? [{ url: mediaUrl }] : [],
        endsAt,
      });

      window.location.href = `/listing.html?id=${listingId}`;
    } catch (error) {
      console.error(error);
      alert("Failed to update listing.");
    }
  });
}

function init(): void {
  requireAuth();
  renderNavbar();
  loadListing();
  setupForm();
}

init();
