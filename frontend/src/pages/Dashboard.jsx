import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiBriefcase, FiTrendingUp, FiGlobe, FiCpu } from 'react-icons/fi';
import StatsCard from '../components/StatsCard';
import CategoryPieChart from '../components/CategoryPieChart';
import SentimentChart from '../components/SentimentChart';
import { getDashboard } from '../services/api';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getDashboard();
                setDashboardData(response.data);
            } catch (err) {
                setError('Unable to fetch dashboard metrics from the API.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const dashboardStats = useMemo(() => {
        if (!dashboardData) {
            return [
                { title: 'Total Articles', value: '—', description: 'Loading metrics', icon: FiBarChart2, accent: '#2563eb' },
                { title: 'Business', value: '—', description: 'Loading metrics', icon: FiBriefcase, accent: '#06b6d4' },
                { title: 'Technology', value: '—', description: 'Loading metrics', icon: FiCpu, accent: '#38bdf8' },
                { title: 'World', value: '—', description: 'Loading metrics', icon: FiGlobe, accent: '#0ea5e9' },
            ];
        }

        const categories = dashboardData.categories || {};
        return [
            { title: 'Total Articles', value: dashboardData.articles?.toLocaleString() || '0', description: 'All processed articles', icon: FiBarChart2, accent: '#2563eb' },
            { title: 'Business', value: `${categories.Business ?? 0}%`, description: 'Business coverage share', icon: FiBriefcase, accent: '#06b6d4' },
            { title: 'Technology', value: `${categories.Technology ?? 0}%`, description: 'Technology coverage share', icon: FiCpu, accent: '#38bdf8' },
            { title: 'World', value: `${categories.World ?? 0}%`, description: 'World coverage share', icon: FiGlobe, accent: '#0ea5e9' },
        ];
    }, [dashboardData]);

    const categoryValues = useMemo(() => {
        if (!dashboardData?.categories) return [35, 22, 18, 25];
        return [dashboardData.categories.Business ?? 0, dashboardData.categories.Sports ?? 0, dashboardData.categories.Technology ?? 0, dashboardData.categories.World ?? 0];
    }, [dashboardData]);

    const sentimentValues = useMemo(() => [dashboardData?.positive ?? 0, dashboardData?.negative ?? 0, dashboardData?.neutral ?? 0], [dashboardData]);

    return (
        <div className="space-y-6">
            {loading && <p className="text-sm text-slate-400">Loading dashboard metrics…</p>}
            {error && <p className="text-sm text-rose-400">{error}</p>}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} />
                ))}
            </motion.div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Forecast Accuracy</p>
                            <h3 className="text-xl font-semibold text-white">{dashboardData ? `${dashboardData.accuracy ?? 0}%` : '—'}</h3>
                        </div>
                        <div className="rounded-full bg-cyan-400/15 p-3 text-cyan-300">
                            <FiTrendingUp size={20} />
                        </div>
                    </div>
                    <div className="mt-6 h-64 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                        <CategoryPieChart data={categoryValues} />
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
                    <p className="text-sm text-slate-400">Sentiment Distribution</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Balanced coverage</h3>
                    <div className="mt-6 h-64 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                        <SentimentChart data={sentimentValues} />
                    </div>
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-400">Recent Predictions</p>
                        <h3 className="text-xl font-semibold text-white">Model output table</h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-slate-300">
                        <thead className="border-b border-white/10 text-slate-400">
                            <tr>
                                <th className="py-3">Headline</th>
                                <th className="py-3">Category</th>
                                <th className="py-3">Sentiment</th>
                                <th className="py-3">Confidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(dashboardData?.recent_predictions || []).map((item) => (
                                <tr key={item.headline} className="border-b border-white/10 last:border-none">
                                    <td className="py-3">{item.headline}</td>
                                    <td className="py-3">{item.category}</td>
                                    <td className="py-3">{item.sentiment}</td>
                                    <td className="py-3">{item.confidence}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
