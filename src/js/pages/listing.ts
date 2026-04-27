import "../../css/main.css";
import { getListingById, placeBid } from "../api/listings";
import { createListingDetails } from "../ui/listingDetails";
import { renderNavbar } from "../ui/navbar";

let currentListingId: string | null = null;

function showBidMessage(message: string, type: "success" | "error"): void {
  const messageElement = document.querySelector<HTMLElement>("#bidMessage");

  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.classList.remove(
    "hidden",
    "bg-red-950",
    "text-red-300",
    "border-red-800",
    "bg-green-950",
    "text-green-300",
    "border-green-800",
  );

  if (type === "success") {
    messageElement.classList.add(
      "bg-green-950",
      "text-green-300",
      "border",
      "border-green-800",
    );
  } else {
    messageElement.classList.add(
      "bg-red-950",
      "text-red-300",
      "border",
      "border-red-800",
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
    listingContainer.innerHTML = `<p class="text-white">Listing ID is missing.</p>`;
    return;
  }

  try {
    const listing = await getListingById(id);
    listingContainer.innerHTML = createListingDetails(listing);
    setupBidForm();
  } catch (error) {
    console.error(error);
    listingContainer.innerHTML = `<p class="text-white">Failed to load listing.</p>`;
  }
}

function setupBidForm(): void {
  const form = document.querySelector<HTMLFormElement>("#bidForm");

  if (!form || !currentListingId) return;

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
      await placeBid(currentListingId, amount);
      showBidMessage("Bid placed successfully.", "success");

      setTimeout(() => {
        loadListing();
      }, 700);
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error ? error.message : "Failed to place bid.";

      showBidMessage(message, "error");
    }
  });
}

function initListingPage(): void {
  renderNavbar();
  loadListing();
}

initListingPage();
