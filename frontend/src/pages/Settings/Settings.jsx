import {
  Check,
  Info,
  Moon,
  Palette,
  Sun,
} from "lucide-react";
import { useState } from "react";

import {
  getStoredTheme,
  saveTheme,
} from "../../services/theme";

const themeOptions = [
  {
    value: "dark",
    title: "Tema escuro",
    description:
      "Interface atual do TechMind, com fundos escuros e destaques em azul.",
    icon: Moon,
    previewClass: "bg-slate-950",
  },
  {
    value: "light",
    title: "Tema claro",
    description:
      "Visual claro e profissional, inspirado em interfaces corporativas.",
    icon: Sun,
    previewClass: "bg-slate-100",
  },
];

function Settings() {
  const [theme, setTheme] = useState(() =>
    getStoredTheme(),
  );

  function handleThemeChange(selectedTheme) {
    const savedTheme = saveTheme(selectedTheme);

    setTheme(savedTheme);
  }

  return (
    <section>
      <div className="mb-5 sm:mb-6">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Configurações
        </h2>

        <p className="mt-1.5 text-sm text-slate-400 sm:mt-2">
          Personalize a aparência e as preferências da
          plataforma.
        </p>
      </div>

      <article className="rounded-3xl border border-white/10 bg-slate-900 p-4 sm:p-6">
        <div className="mb-5 flex items-start gap-3 sm:mb-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <Palette size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-white sm:text-xl">
              Aparência
            </h3>

            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Escolha como o TechMind será exibido neste
              navegador.
            </p>
          </div>
        </div>

        <div
          className="grid gap-3 sm:grid-cols-2 sm:gap-4"
          role="radiogroup"
          aria-label="Tema da plataforma"
        >
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected =
              theme === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() =>
                  handleThemeChange(option.value)
                }
                className={`relative rounded-3xl border p-4 text-left transition sm:p-5 ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-white/10 bg-slate-950/40 hover:border-cyan-400/40"
                }`}
              >
                {isSelected && (
                  <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 text-slate-950">
                    <Check size={16} />
                  </span>
                )}

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 ${option.previewClass}`}
                >
                  <Icon
                    size={22}
                    className={
                      option.value === "dark"
                        ? "text-cyan-300"
                        : "text-amber-500"
                    }
                  />
                </div>

                <h4 className="mt-4 pr-8 text-base font-bold text-white">
                  {option.title}
                </h4>

                <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        <p
          className="mt-4 text-xs text-slate-500 sm:text-sm"
          aria-live="polite"
        >
          Tema selecionado:{" "}
          <strong className="text-cyan-300">
            {theme === "dark"
              ? "Escuro"
              : "Claro"}
          </strong>
          . A preferência fica salva automaticamente.
        </p>
      </article>

      <article className="mt-5 rounded-3xl border border-white/10 bg-slate-900 p-4 sm:mt-6 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
            <Info size={19} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold">
              <span className="text-cyan-400">
                Tech
              </span>

              <span className="text-white">
                Mind
              </span>
            </h3>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Plataforma de organização inteligente de
              conteúdo técnico — versão 1.0.0.
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}

export default Settings;