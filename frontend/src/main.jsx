/**
 * Ponto de entrada principal da aplicação React.
 * Este arquivo é responsável por inicializar a árvore de componentes do React
 * e renderizar o componente principal <App /> dentro do elemento HTML com id 'root'.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Cria a raiz do React no elemento DOM 'root' e renderiza a aplicação
createRoot(document.getElementById('root')).render(
  // O StrictMode ativa verificações e avisos adicionais durante o desenvolvimento
  <StrictMode>
    <App />
  </StrictMode>,
)

