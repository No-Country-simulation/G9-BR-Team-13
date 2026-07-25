import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Database,
  Search,
  Tag,
} from "lucide-react";
import { getHistory } from "../../services/history";

function getContentTitle(item) {
  return (
    item?.title ||
    item?.input?.title ||
    item?.contentTitle ||
    "Conteúdo sem título"
  );
}

function getContentCategory(item) {
  return (
    item?.category ||
    item?.result?.category ||
    item?.analysis?.category ||
    "Sem categoria"
  );
}

function getContentKeywords(item) {
  const keywords =
    item?.keywords ||
    item?.result?.keywords ||
    item?.analysis?.keywords ||
    [];

  if (Array.isArray(keywords)) {
    return keywords;
  }

  if (typeof keywords === "string") {
    return keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }

  return [];
}

function getContentText(item) {
  return (
    item?.text ||
    item?.content ||
    item?.input?.text ||
    item?.description ||
    ""
  );
}

function getContentDate(item) {
  return item?.createdAt || item?.date || item?.timestamp || null;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Data não informada";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Data não informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const history = getHistory();

  const categories = useMemo(() => {
    const availableCategories = history.map(getContentCategory);

    return ["Todas", ...new Set(availableCategories)];
  }, [history]);

  const filteredContents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return [...history]
      .filter((item) => {
        const title = getContentTitle(item).toLowerCase();
        const category = getContentCategory(item).toLowerCase();
        const keywords = getContentKeywords(item)
          .join(" ")
          .toLowerCase();
        const text = getContentText(item).toLowerCase();

        const matchesSearch =
          normalizedSearch.length === 0 ||
          title.includes(normalizedSearch) ||
          category.includes(normalizedSearch) ||
          keywords.includes(normalizedSearch) ||
          text.includes(normalizedSearch);

        const matchesCategory =
          selectedCategory === "Todas" ||
          getContentCategory(item) === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((firstItem, secondItem) => {
        const firstDate = new Date(getContentDate(firstItem) || 0).getTime();
        const secondDate = new Date(getContentDate(secondItem) || 0).getTime();

        return secondDate - firstDate;
      });
  }, [history, searchTerm, selectedCategory]);

  return (
    <section>
      <div className="mb-5 sm:mb-6">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Base de Conhecimento
        </h2>

        <p className="mt-1.5 text-sm text-slate-400 sm:mt-2">
          Pesquise e organize conteúdos técnicos classificados pela plataforma.
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
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Pesquisar conteúdo, categoria ou palavra-chave..."
              className="w-full rounded-2xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 sm:pl-12"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 sm:text-sm">
          <Database size={16} className="text-cyan-300" />

          <span>
            {filteredContents.length}{" "}
            {filteredContents.length === 1
              ? "conteúdo encontrado"
              : "conteúdos encontrados"}
          </span>
        </div>

        {filteredContents.length === 0 ? (
          <div className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-6 text-center sm:mt-6 sm:min-h-64 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 sm:h-14 sm:w-14">
              <BookOpen size={22} />
            </div>

            <h3 className="mt-4 text-base font-bold text-white sm:text-lg">
              {history.length === 0
                ? "Nenhum conteúdo disponível"
                : "Nenhum conteúdo encontrado"}
            </h3>

            <p className="mt-2 max-w-md text-xs text-slate-400 sm:text-sm">
              {history.length === 0
                ? "Os conteúdos analisados pela plataforma serão exibidos nesta área."
                : "Tente alterar o termo pesquisado ou selecionar outra categoria."}
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:mt-6 lg:grid-cols-2">
            {filteredContents.map((item, index) => {
              const title = getContentTitle(item);
              const category = getContentCategory(item);
              const keywords = getContentKeywords(item);
              const text = getContentText(item);
              const date = getContentDate(item);

              return (
                <article
                  key={item?.id || `${date || "content"}-${index}`}
                  className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-400/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                        <BookOpen size={19} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-white">
                          {title}
                        </h3>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                          <CalendarDays size={14} />

                          <span>{formatDate(date)}</span>
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                      {category}
                    </span>
                  </div>

                  {text && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                      {text}
                    </p>
                  )}

                  {keywords.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {keywords.slice(0, 5).map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                        >
                          <Tag size={12} />

                          {keyword}
                        </span>
                      ))}

                      {keywords.length > 5 && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                          +{keywords.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Library;