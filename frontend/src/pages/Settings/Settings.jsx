import { Database, Server, Settings as SettingsIcon } from "lucide-react";

function Settings() {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Configurações</h2>

        <p className="mt-2 text-slate-400">
          Informações e preferências da plataforma.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <Server size={22} />
            </div>

            <div>
              <h3 className="font-bold text-white">Configuração da API</h3>
              <p className="text-sm text-slate-500">
                Endereço utilizado pelo frontend
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950 p-4">
            <p className="text-xs text-slate-500">URL padrão</p>
            <p className="mt-1 break-all text-sm text-slate-300">
              http://localhost:8080
            </p>
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300">
              <Database size={22} />
            </div>

            <div>
              <h3 className="font-bold text-white">Armazenamento</h3>
              <p className="text-sm text-slate-500">
                Integração com banco e OCI
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950 p-4">
            <p className="text-sm text-slate-400">
              As configurações de armazenamento serão disponibilizadas
              futuramente.
            </p>
          </div>
        </article>
      </div>

      <article className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <SettingsIcon size={22} className="text-amber-300" />

          <div>
            <h3 className="font-bold text-white">InfoHub AI</h3>
            <p className="text-sm text-slate-500">
              Versão inicial da plataforma — 1.0.0
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}

export default Settings;