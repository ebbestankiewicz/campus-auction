import "../../css/main.css";
import { renderNavbar } from "../ui/navbar";
import { registerUser } from "../api/auth";
import {
  isValidName,
  isValidPassword,
  isValidStudEmail,
} from "../utils/validation";

function showMessage(message: string, isError = true): void {
  const messageElement =
    document.querySelector<HTMLElement>("#registerMessage");

  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.className = isError
    ? "text-red-600 text-sm"
    : "text-green-600 text-sm";
}

function setupRegisterForm(): void {
  const form = document.querySelector<HTMLFormElement>("#registerForm");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nameInput = document.querySelector<HTMLInputElement>("#name");
    const emailInput = document.querySelector<HTMLInputElement>("#email");
    const passwordInput = document.querySelector<HTMLInputElement>("#password");

    if (!nameInput || !emailInput || !passwordInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !email || !password) {
      showMessage("All fields are required.");
      return;
    }

    if (!isValidName(name)) {
      showMessage("Name can only contain letters, numbers, and underscore.");
      return;
    }

    if (!isValidStudEmail(email)) {
      showMessage("You must use a @stud.noroff.no email address.");
      return;
    }

    if (!isValidPassword(password)) {
      showMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      await registerUser({ name, email, password });

      showMessage("Registration successful. Redirecting to login...", false);

      setTimeout(() => {
        window.location.href = "/login.html";
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      showMessage(message);
    }
  });
}

function initRegisterPage(): void {
  renderNavbar();
  setupRegisterForm();
}

initRegisterPage();
