import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Forecast from './pages/Forecast';
import Analysis from './pages/Analysis';
import About from './pages/About';

function App() {
    return (
        <div className="min-h-screen text-slate-100">
            <Navbar />
            <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <Sidebar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/forecast" element={<Forecast />} />
                        <Route path="/analysis" element={<Analysis />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                    <Footer />
                </main>
            </div>
        </div>
    );
}

export default App;
