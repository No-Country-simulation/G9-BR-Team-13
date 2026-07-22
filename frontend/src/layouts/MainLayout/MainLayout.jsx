import { Outlet } from "react-router-dom";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

/**
 * Layout Estrutural Principal (MainLayout).
 * 
 * Envolve a Sidebar lateral e o Header superior, utilizando o componente <Outlet />
 * do React Router para renderizar dinamicamente o conteúdo da página ativa.
 */
function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {/* Menu de navegação lateral em telas maiores */}
        <Sidebar />

        {/* Área de conteúdo principal onde as páginas são renderizadas */}
        <main className="flex-1 p-6 lg:p-8">
          <Header />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;