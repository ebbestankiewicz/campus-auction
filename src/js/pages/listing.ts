import "../../css/main.css";
import { getListingById, placeBid, deleteListing } from "../api/listings";
import { createListingDetails } from "../ui/listingDetails";
import { renderNavbar } from "../ui/navbar";

let currentListingId: string | null = null;

function showBidMessage(message: string, type: "success" | "error"): void {
  const messageElement = document.querySelector<HTMLElement>("#bidMessage");

  if (!messageElement) return;

  messageElement.textContent = message;

  messageElement.className = "mt-3 rounded-xl border p-3 text-sm";

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

async function loadListing(): Promise<void> {
  const listingContainer = document.querySelector<HTMLElement>("#listing");

  if (!listingContainer) {
    throw new Error("Could not find #listing in the DOM");
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  currentListingId = id;

  if (!id) {
    listingContainer.innerHTML = `<p class="text-muted">Listing ID is missing.</p>`;
    return;
  }

  try {
    const listing = await getListingById(id);

    // Render HTML first
    listingContainer.innerHTML = createListingDetails(listing);

    // THEN attach events
    setupBidForm();
    setupDelete();
  } catch (error) {
    console.error(error);
    listingContainer.innerHTML = `<p class="text-muted">Failed to load listing.</p>`;
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
        loadListing(); // refresh listing after bid
      }, 700);
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error ? error.message : "Failed to place bid.";

      showBidMessage(message, "error");
    }
  });
}

function setupDelete(): void {
  const btn = document.querySelector<HTMLButtonElement>("#deleteListingBtn");

  if (!btn || !currentListingId) return;

  btn.addEventListener("click", async () => {
    const confirmed = confirm("Are you sure you want to delete this listing?");

    if (!confirmed) return;

    try {
      await deleteListing(currentListingId);
      window.location.href = "/index.html";
    } catch (error) {
      console.error(error);
      alert("Failed to delete listing.");
    }
  });
}

function initListingPage(): void {
  renderNavbar();
  loadListing();
}

initListingPage();
