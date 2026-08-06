const THEME_STORAGE_KEY = "techmind-theme";

const AVAILABLE_THEMES = ["dark", "light"];

export function getStoredTheme() {
  try {
    const storedTheme = localStorage.getItem(
      THEME_STORAGE_KEY,
    );

    return AVAILABLE_THEMES.includes(storedTheme)
      ? storedTheme
      : "dark";
  } catch {
    return "dark";
  }
}

export function applyTheme(theme) {
  const selectedTheme = AVAILABLE_THEMES.includes(theme)
    ? theme
    : "dark";

  document.documentElement.dataset.theme = selectedTheme;
  document.documentElement.style.colorScheme =
    selectedTheme;
}

export function saveTheme(theme) {
  const selectedTheme = AVAILABLE_THEMES.includes(theme)
    ? theme
    : "dark";

  try {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      selectedTheme,
    );
  } catch {
    // O tema ainda será aplicado mesmo se o armazenamento falhar.
  }

  applyTheme(selectedTheme);

  return selectedTheme;
}

export function initializeTheme() {
  const initialTheme = getStoredTheme();

  applyTheme(initialTheme);

  return initialTheme;
}