import "./MainLayout.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Home from "../../pages/Home/Home";

function MainLayout() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Header />

        <main className="main-content">
          <Home />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;