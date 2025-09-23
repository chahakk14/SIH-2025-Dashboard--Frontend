import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import Header from "../components/Header";

const Home = ({ handleLogout }) => {

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans">
              <Header />
              <div className="flex pt-20">
                <Sidebar handleLogout={handleLogout} />
                <main className="flex-1 p-6 ml-64">
                  <Dashboard />
                </main>
              </div>
            </div>
    );
}

export default Home;