import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Home from "../../pages/Home/Home";

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8">
          <Header />
          <Home />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;