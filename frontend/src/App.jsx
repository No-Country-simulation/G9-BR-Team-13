/**
 * Componente principal de Roteamento da Aplicação (App).
 * Configura o React Router para navegação entre as diferentes páginas do sistema,
 * utilizando um layout padrão (MainLayout) para manter o cabeçalho e barra lateral consistentes.
 */

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout/MainLayout";
import Analysis from "./pages/Analysis/Analysis";
import Dashboard from "./pages/Dashboard/Dashboard";
import History from "./pages/History/History";
import Library from "./pages/Library/Library";
import Settings from "./pages/Settings/Settings";

function App() {
  return (
    // Habilita o roteamento baseado em histórico do navegador (HTML5 History API)
    <BrowserRouter>
      {/* Define o conjunto de rotas da aplicação */}
      <Routes>
        {/* Rota pai com layout padrão que engloba as subrotas filhas */}
        <Route element={<MainLayout />}>
          {/* Redireciona a rota raiz '/' para '/dashboard' */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Páginas acessíveis da aplicação */}
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