import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout/MainLayout";
import Analysis from "./pages/Analysis/Analysis";
import Dashboard from "./pages/Dashboard/Dashboard";
import History from "./pages/History/History";
import Library from "./pages/Library/Library";
import Settings from "./pages/Settings/Settings";

/**
 * Componente Raiz da Aplicação.
 * 
 * Configura o roteamento utilizando React Router DOM com suporte a layout aninhado (MainLayout).
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pai usando MainLayout com Sidebar e Header fixos */}
        <Route element={<MainLayout />}>
          {/* Redirecionamento padrão da raiz para o Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analisar" element={<Analysis />} />
          <Route path="/base-conhecimento" element={<Library />} />
          <Route path="/historico" element={<History />} />
          <Route path="/configuracoes" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;