/**
 * Componente de Layout Principal (MainLayout).
 * Define a estrutura padrão das páginas do sistema, contendo o Menu Lateral (Sidebar),
 * Cabeçalho (Header), área para renderização da rota filha (<Outlet />) e o Rodapé (Footer).
 * Também gerencia o monitoramento periódico da conexão com o backend.
 */

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Outlet } from "react-router-dom";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { checkBackendStatus } from "../../services/api";

function MainLayout() {
  // Estado para controlar a abertura/fechamento do menu em telas menores (mobile)
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  // Estado para armazenar a situação do backend: "checking", "online" ou "offline"
  const [backendStatus, setBackendStatus] =
    useState("checking");

  // Funções memoizadas para abrir e fechar o menu mobile
  const openMobileMenu = useCallback(
    () => setMobileMenuOpen(true),
    [],
  );

  const closeMobileMenu = useCallback(
    () => setMobileMenuOpen(false),
    [],
  );

  // Efeito que desabilita a rolagem do corpo da página (body) quando o menu mobile está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Efeito para verificar a conexão com o backend na inicialização e periodicamente a cada 30 segundos
  useEffect(() => {
    let isMounted = true;

    async function updateBackendStatus() {
      const isOnline =
        await checkBackendStatus();

      if (isMounted) {
        setBackendStatus(
          isOnline ? "online" : "offline",
        );
      }
    }

    void updateBackendStatus();

    // Polling a cada 30 segundos
    const intervalId = window.setInterval(() => {
      void updateBackendStatus();
    }, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {/* Menu Lateral */}
        <Sidebar
          isMobileOpen={mobileMenuOpen}
          onClose={closeMobileMenu}
          backendStatus={backendStatus}
        />

        {/* Área de conteúdo principal */}
        <main className="flex min-w-0 flex-1 flex-col p-4 pb-[calc(1rem+var(--sab))] sm:p-6 sm:pb-[calc(1.5rem+var(--sab))] lg:p-8 lg:pb-[calc(2rem+var(--sab))]">
          {/* Cabeçalho */}
          <Header
            onToggleMenu={openMobileMenu}
            backendStatus={backendStatus}
          />

          {/* O Outlet renderiza o componente da rota atual (ex: Dashboard, Analysis, etc) */}
          <div className="flex flex-1 flex-col">
            <Outlet
              context={{ backendStatus }}
            />
          </div>

          {/* Rodapé da aplicação */}
          <footer className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-slate-500">
            © 2026 TechMind • Desenvolvido pela equipe G9-BR Team 13
          </footer>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;