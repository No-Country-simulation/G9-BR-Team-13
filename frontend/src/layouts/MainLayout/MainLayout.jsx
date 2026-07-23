import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar
          isMobileOpen={mobileMenuOpen}
          onClose={closeMobileMenu}
        />

        <main className="flex min-w-0 flex-1 flex-col p-4 pb-[calc(1rem+var(--sab))] sm:p-6 sm:pb-[calc(1.5rem+var(--sab))] lg:p-8 lg:pb-[calc(2rem+var(--sab))]">
          <Header onToggleMenu={openMobileMenu} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
