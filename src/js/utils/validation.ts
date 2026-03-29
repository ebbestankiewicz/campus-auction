export function isValidStudEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith("@stud.noroff.no");
}

export function isValidPassword(password: string): boolean {
  return password.trim().length >= 8;
}

export function isValidName(name: string): boolean {
  return /^[A-Za-z0-9_]+$/.test(name.trim());
}
