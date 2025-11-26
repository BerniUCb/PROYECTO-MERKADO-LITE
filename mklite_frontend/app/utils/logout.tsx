"use client";

export function logout() {
  // Borrar localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Borrar cookie del token
  document.cookie = "token=; Max-Age=0; path=/;";
}
