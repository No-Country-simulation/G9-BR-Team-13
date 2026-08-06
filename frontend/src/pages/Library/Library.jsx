import {
  AlertCircle,
  BookOpen,
  Database,
  LoaderCircle,
  RefreshCw,
  Search,
  Tag,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { searchContents } from "../../services/api";

function normalizeText(value, fallback = "") {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : fallback;
}

function getContentCategory(item) {
  return normalizeText(
    item?.categoria,
    "Não informada",
  );
}

function getAdditionalInformation(item) {
  const additionalInformation =
    item?.informacoesAdicionais ??
    item?.informacoes_adicionais;

  if (!Array.isArray(additionalInformation)) {
    return [];
  }

  return additionalInformation
    .map((information) => {
      if (typeof information === "string") {
        return information.trim();
      }

      if (
        information &&
        typeof information === "object"
      ) {
        return normalizeText(
          information.titulo ??
            information.nome ??
            information.descricao ??
            information.valor,
        );
      }

      return "";
    })
    .filter(Boolean);
}

function formatConfidence(probability) {
  const numericProbability = Number(probability);

  if (Number.isNaN(numericProbability)) {
    return "Não informada";
  }

  const percentage =
    numericProbability <= 1
      ? numericProbability * 100
      : numericProbability;

  return `${percentage.toFixed(1)}%`;
}

function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("Todas");

  const [contents, setContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContents = useCallback(
    async (term = "") => {
      setIsLoading(true);
      setError("");

      try {
        const data = await searchContents(term);

        setContents(Array.isArray(data) ? data : []);
      } catch (requestError) {
        console.error(requestError);

        setContents([]);

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível carregar a base de conhecimento.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadContents(searchTerm);
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadContents, searchTerm]);

  const categories = useMemo(() => {
    const availableCategories = contents
      .map(getContentCategory)
      .filter(Boolean);

    return [
      "Todas",
      ...new Set(availableCategories),
    ];
  }, [contents]);

const activeCategory = categories.includes(
  selectedCategory,
)
  ? selectedCategory
  : "Todas";

const filteredContents = useMemo(() => {
  if (activeCategory === "Todas") {
    return contents;
  }

  return contents.filter(
    (item) =>
      getContentCategory(item) === activeCategory,
  );
}, [activeCategory, contents]);

  return (
    <section>
      <div className="mb-5 sm:mb-6">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Base de Conhecimento
        </h2>

        <p className="mt-1.5 text-sm text-slate-400 sm:mt-2">
          Pesquise conteúdos técnicos armazenados na
          plataforma.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900 p-4 sm:p-6">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Pesquisar por palavra-chave..."
              aria-label="Pesquisar conteúdos"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 sm:pl-12"
            />

            {isLoading && (
              <LoaderCircle
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-cyan-300"
                aria-label="Carregando conteúdos"
              />
            )}
          </div>

          <select
            value={activeCategory}
            onChange={(event) =>
              setSelectedCategory(
                event.target.value,
              )
            }
            disabled={isLoading || contents.length === 0}
            aria-label="Filtrar por categoria"
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 sm:text-sm">
          <div className="flex items-center gap-2">
            <Database
              size={16}
              className="text-cyan-300"
            />

            <span>
              {isLoading
                ? "Consultando base de conhecimento..."
                : `${filteredContents.length} ${
                    filteredContents.length === 1
                      ? "conteúdo encontrado"
                      : "conteúdos encontrados"
                  }`}
            </span>
          </div>

          {searchTerm.trim() && !isLoading && (
            <span className="text-slate-500">
              Busca: “{searchTerm.trim()}”
            </span>
          )}
        </div>

        {error && !isLoading && (
          <div
            role="alert"
            className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-3xl border border-red-400/20 bg-red-400/5 p-6 text-center sm:mt-6 sm:min-h-64 sm:p-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-400/10 text-red-300 sm:h-14 sm:w-14">
              <AlertCircle size={22} />
            </div>

            <h3 className="mt-4 text-base font-bold text-white sm:text-lg">
              Não foi possível carregar os conteúdos
            </h3>

            <p className="mt-2 max-w-md text-xs text-slate-400 sm:text-sm">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadContents(searchTerm)
              }
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              <RefreshCw size={16} />
              Tentar novamente
            </button>
          </div>
        )}

        {isLoading && (
          <div className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-6 text-center sm:mt-6 sm:min-h-64 sm:p-8">
            <LoaderCircle
              size={30}
              className="animate-spin text-cyan-300"
            />

            <h3 className="mt-4 text-base font-bold text-white sm:text-lg">
              Carregando conteúdos
            </h3>

            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              Consultando a base de conhecimento do
              backend.
            </p>
          </div>
        )}

        {!isLoading &&
          !error &&
          filteredContents.length === 0 && (
            <div className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-6 text-center sm:mt-6 sm:min-h-64 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 sm:h-14 sm:w-14">
                <BookOpen size={22} />
              </div>

              <h3 className="mt-4 text-base font-bold text-white sm:text-lg">
                {searchTerm.trim()
                  ? "Nenhum conteúdo encontrado"
                  : "Nenhum conteúdo disponível"}
              </h3>

              <p className="mt-2 max-w-md text-xs text-slate-400 sm:text-sm">
                {searchTerm.trim()
                  ? "Tente pesquisar outra palavra-chave ou selecionar outra categoria."
                  : "Os conteúdos armazenados no banco serão exibidos nesta área."}
              </p>
            </div>
          )}

        {!isLoading &&
          !error &&
          filteredContents.length > 0 && (
            <div className="mt-5 grid gap-4 sm:mt-6 lg:grid-cols-2">
              {filteredContents.map(
                (item, index) => {
                  const category =
                    getContentCategory(item);

                  const additionalInformation =
                    getAdditionalInformation(item);

                  const confidence =
                    formatConfidence(
                      item?.probabilidade,
                    );

                  const itemKey =
                    item?.id ??
                    `${category}-${confidence}-${index}`;

                  return (
                    <article
                      key={itemKey}
                      className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-400/40"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                            <BookOpen size={19} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="break-words text-base font-bold text-white">
                              Conteúdo classificado
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                              Confiança da classificação:{" "}
                              <span className="font-semibold text-cyan-300">
                                {confidence}
                              </span>
                            </p>
                          </div>
                        </div>

                        <span className="shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                          {category}
                        </span>
                      </div>

                      <div className="mt-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                          <Tag size={15} />
                          Palavras-chave
                        </div>

                        {additionalInformation.length >
                        0 ? (
                          <div className="flex flex-wrap gap-2">
                            {additionalInformation.map(
                              (
                                information,
                                informationIndex,
                              ) => (
                                <span
                                  key={`${information}-${informationIndex}`}
                                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                                >
                                  <Tag size={12} />
                                  {information}
                                </span>
                              ),
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 sm:text-sm">
                            Nenhuma palavra-chave
                            encontrada.
                          </p>
                        )}
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          )}
      </div>
    </section>
  );
}

export default Library;