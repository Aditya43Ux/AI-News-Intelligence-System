import { Link, NavLink } from 'react-router-dom';
import { FiGithub, FiMoon, FiSun } from 'react-icons/fi';
import { useState } from 'react';

const navItems = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/analysis', label: 'Analysis' },
    { to: '/forecast', label: 'Forecast' },
    { to: '/about', label: 'About' },
];

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(true);

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link to="/" className="text-xl font-semibold tracking-tight text-white">
                    AI News Intelligence
                </Link>

                <div className="hidden items-center gap-6 md:flex">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `text-sm transition ${isActive ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setDarkMode((prev) => !prev)}
                        className="rounded-full border border-white/10 bg-slate-900/70 p-2 text-slate-200"
                    >
                        {darkMode ? <FiMoon /> : <FiSun />}
                    </button>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/10 bg-slate-900/70 p-2 text-slate-200"
                    >
                        <FiGithub />
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
