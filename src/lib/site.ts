import { closeMenu, openMenu } from "./animations";

const THEME_KEY = "theme";

let keyboardBound = false;
let menuOpen = false;

/** Applies the persisted theme, defaults to the system preference. */
export function getPreferredTheme(): "light" | "dark" {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: "light" | "dark"): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_KEY, theme);
  document
    .querySelector('meta[name="color-scheme"]')
    ?.setAttribute("content", theme);
}

function toggleTheme(): void {
  applyTheme(
    document.documentElement.classList.contains("dark") ? "light" : "dark",
  );
}

/** Wires every `[data-action]` control in the page. Runs on each navigation. */
export function initSite(): void {
  document.body.classList.remove("overflow-hidden");
  document.body.style.overflow = "";
  document.querySelector<HTMLElement>(".loading")?.classList.add("hidden");

  menuOpen = false;

  document.querySelectorAll<HTMLElement>("[data-action]").forEach((control) => {
    control.addEventListener("click", (event) => {
      const action = control.dataset.action;

      switch (action) {
        case "theme":
          event.preventDefault();
          toggleTheme();
          break;
        case "home":
          event.preventDefault();
          window.location.href = "/";
          break;
        case "menu":
          event.preventDefault();
          openMenu();
          menuOpen = true;
          break;
        case "close-menu":
          event.preventDefault();
          closeMenu();
          menuOpen = false;
          break;
      }
    });
  });

  if (keyboardBound) return;
  keyboardBound = true;

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOpen) {
      closeMenu();
      menuOpen = false;
    }
  });
}
