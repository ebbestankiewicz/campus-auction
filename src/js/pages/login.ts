import "../../css/main.css";
import { loginUser } from "../api/auth";
import { renderNavbar } from "../ui/navbar";
import { saveAccessToken, saveUser } from "../utils/storage";

function showMessage(message: string, isError = true): void {
  const messageElement = document.querySelector<HTMLElement>("#loginMessage");

  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.className = isError
    ? "text-red-600 text-sm"
    : "text-green-600 text-sm";
}

function setupLoginForm(): void {
  const form = document.querySelector<HTMLFormElement>("#loginForm");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailInput = document.querySelector<HTMLInputElement>("#email");
    const passwordInput = document.querySelector<HTMLInputElement>("#password");

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      showMessage("Email and password are required.");
      return;
    }

    try {
      const user = await loginUser({ email, password });

      saveAccessToken(user.accessToken);
      saveUser(user);

      showMessage("Login successful. Redirecting...", false);

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      showMessage(message);
    }
  });
}

function initLoginPage(): void {
  renderNavbar();
  setupLoginForm();
}

initLoginPage();
