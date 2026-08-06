const ANALYSIS_SESSION_KEY =
  "techmind-related-contents-session";

function getDefaultSession() {
  return {
    relatedContents: [],
  };
}

export function getAnalysisSession() {
  try {
    const storedSession = sessionStorage.getItem(
      ANALYSIS_SESSION_KEY,
    );

    if (!storedSession) {
      return getDefaultSession();
    }

    const parsedSession = JSON.parse(storedSession);

    if (
      !parsedSession ||
      typeof parsedSession !== "object" ||
      !Array.isArray(parsedSession.relatedContents)
    ) {
      return getDefaultSession();
    }

    return {
      relatedContents:
        parsedSession.relatedContents,
    };
  } catch {
    return getDefaultSession();
  }
}

export function saveAnalysisSession(
  relatedContents = [],
) {
  const sessionData = {
    relatedContents: Array.isArray(
      relatedContents,
    )
      ? relatedContents
      : [],
  };

  try {
    sessionStorage.setItem(
      ANALYSIS_SESSION_KEY,
      JSON.stringify(sessionData),
    );
  } catch {
    // A aplicação continua funcionando mesmo se a sessão não puder ser salva.
  }

  return sessionData;
}

export function clearAnalysisSession() {
  try {
    sessionStorage.removeItem(
      ANALYSIS_SESSION_KEY,
    );
  } catch {
    // Não interrompe a aplicação se o armazenamento estiver indisponível.
  }
}