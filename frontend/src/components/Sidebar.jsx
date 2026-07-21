import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/analysis', label: 'Analysis' },
    { to: '/forecast', label: 'Forecast' },
    { to: '/about', label: 'About' },
];

const Sidebar = () => (
    <aside className="hidden w-64 rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur lg:block">
        <h2 className="text-lg font-semibold text-white">Navigation</h2>
        <div className="mt-6 space-y-2">
            {navItems.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                        `block rounded-xl px-4 py-3 text-sm transition ${isActive ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
                    }
                >
                    {item.label}
                </NavLink>
            ))}
        </div>
    </aside>
);

export default Sidebar;
