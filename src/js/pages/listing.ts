import "../../css/main.css";
import { getListingById, placeBid, deleteListing } from "../api/listings";
import { createListingDetails } from "../ui/listingDetails";
import { renderNavbar } from "../ui/navbar";
import { createLoadingSpinner } from "../ui/loading";
import { showToast } from "../ui/toast";

let currentListingId: string | null = null;

function showBidMessage(message: string, type: "success" | "error"): void {
  const messageElement = document.querySelector<HTMLElement>("#bidMessage");

  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.classList.remove(
    "hidden",
    "bg-danger-soft",
    "text-danger-muted",
    "border-danger",
    "bg-success-soft",
    "text-success-muted",
    "border-success",
  );

  if (type === "success") {
    messageElement.classList.add(
      "bg-success-soft",
      "text-success-muted",
      "border",
      "border-success",
    );
  } else {
    messageElement.classList.add(
      "bg-danger-soft",
      "text-danger-muted",
      "border",
      "border-danger",
    );
  }
}

async function loadListing(): Promise<void> {
  const listingContainer = document.querySelector<HTMLElement>("#listing");

  if (!listingContainer) {
    throw new Error("Could not find #listing in the DOM");
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  currentListingId = id;

  if (!id) {
    listingContainer.innerHTML = `
      <p class="text-muted">Listing ID is missing.</p>
    `;
    return;
  }

  listingContainer.innerHTML = createLoadingSpinner("Loading listing...");

  try {
    const listing = await getListingById(id);

    listingContainer.innerHTML = createListingDetails(listing);

    setupBidForm();
    setupDelete();
  } catch (error) {
    console.error(error);

    listingContainer.innerHTML = `
      <p class="text-muted">Failed to load listing.</p>
    `;
  }
}

function setupBidForm(): void {
  const form = document.querySelector<HTMLFormElement>("#bidForm");

  const listingId = currentListingId;

  if (!form || !listingId) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const amountInput = document.querySelector<HTMLInputElement>("#bidAmount");

    if (!amountInput) return;

    const amount = Number(amountInput.value);

    if (!Number.isFinite(amount) || amount <= 0) {
      showBidMessage("Please enter a valid bid amount.", "error");
      return;
    }

    try {
      await placeBid(listingId, amount);

      showBidMessage("Bid placed successfully.", "success");

      showToast("Bid placed successfully.", "success");

      setTimeout(() => {
        loadListing();
      }, 700);
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error ? error.message : "Failed to place bid.";

      showBidMessage(message, "error");

      showToast(message, "error");
    }
  });
}

function setupDelete(): void {
  const btn = document.querySelector<HTMLButtonElement>("#deleteListingBtn");

  const listingId = currentListingId;

  if (!btn || !listingId) return;

  btn.addEventListener("click", async () => {
    const confirmed = confirm("Are you sure you want to delete this listing?");

    if (!confirmed) return;

    try {
      await deleteListing(listingId);

      showToast("Listing deleted successfully.", "success");

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 500);
    } catch (error) {
      console.error(error);

      showToast("Failed to delete listing.", "error");
    }
  });
}

function initListingPage(): void {
  renderNavbar();
  loadListing();
}

initListingPage();
