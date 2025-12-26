import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import MainRoutes from "./routes/MainRoutes";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navbar fixed at top with shadow for clarity */}
      
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 mt-10 md:px-10 lg:px-16 py-6 md:py-10">
        <div className="max-w-6xl mx-auto w-full">
          <MainRoutes />
        </div>
      </main>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
};

export default App;
