const RELATED_CONTENT_LIMIT_KEY =
  "techmind-related-content-limit";

const AVAILABLE_LIMITS = [3, 5, 10];

export function getRelatedContentLimit() {
  try {
    const storedLimit = Number(
      localStorage.getItem(
        RELATED_CONTENT_LIMIT_KEY,
      ),
    );

    return AVAILABLE_LIMITS.includes(storedLimit)
      ? storedLimit
      : 3;
  } catch {
    return 3;
  }
}

export function saveRelatedContentLimit(limit) {
  const numericLimit = Number(limit);

  const selectedLimit =
    AVAILABLE_LIMITS.includes(numericLimit)
      ? numericLimit
      : 3;

  try {
    localStorage.setItem(
      RELATED_CONTENT_LIMIT_KEY,
      String(selectedLimit),
    );
  } catch {
    // A preferência continua funcionando durante a sessão.
  }

  return selectedLimit;
}