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
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [backendStatus, setBackendStatus] =
    useState("checking");

  const openMobileMenu = useCallback(
    () => setMobileMenuOpen(true),
    [],
  );

  const closeMobileMenu = useCallback(
    () => setMobileMenuOpen(false),
    [],
  );

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
        <Sidebar
          isMobileOpen={mobileMenuOpen}
          onClose={closeMobileMenu}
          backendStatus={backendStatus}
        />

        <main className="flex min-w-0 flex-1 flex-col p-4 pb-[calc(1rem+var(--sab))] sm:p-6 sm:pb-[calc(1.5rem+var(--sab))] lg:p-8 lg:pb-[calc(2rem+var(--sab))]">
          <Header
            onToggleMenu={openMobileMenu}
          />

          <div className="flex flex-1 flex-col">
            <Outlet
              context={{ backendStatus }}
            />
          </div>

          <footer className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-slate-500">
            © 2026 TechMind • Desenvolvido pela equipe G9-BR Team 13
          </footer>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;