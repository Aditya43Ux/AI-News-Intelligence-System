import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ForecastChart from '../components/ForecastChart';
import { getForecast } from '../services/api';

const trendMap = ['Stable', 'Cooling', 'Declining', 'Lower', 'Steady', 'Rising', 'Recovering'];

const Forecast = () => {
    const [forecastData, setForecastData] = useState([]);
    const [selectedDay, setSelectedDay] = useState(3);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                const response = await getForecast();
                setForecastData(Array.isArray(response.data) ? response.data : response.data.forecast || []);
            } catch (err) {
                setError('Unable to fetch forecast data from the API.');
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, []);

    return (
        <div className="space-y-6">
            {loading && <p className="text-sm text-slate-400">Loading forecast data…</p>}
            {error && <p className="text-sm text-rose-400">{error}</p>}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm text-slate-400">Forecast Page</p>
                        <h2 className="text-2xl font-semibold text-white">Business News Volume Forecast</h2>
                    </div>
                    <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">
                        Historical + Predicted 7 Days
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <ForecastChart data={forecastData} />
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-400">Forecast Table</p>
                        <h3 className="text-xl font-semibold text-white">7-day outlook</h3>
                    </div>
                    <div className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">Day {selectedDay}</div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-slate-300">
                        <thead className="border-b border-white/10 text-slate-400">
                            <tr>
                                <th className="py-3">Day</th>
                                <th className="py-3">Prediction</th>
                                <th className="py-3">Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {forecastData.map((value, index) => (
                                <tr key={`${value}-${index}`} className="cursor-pointer border-b border-white/10 last:border-none" onClick={() => setSelectedDay(index + 1)}>
                                    <td className="py-3">Day {index + 1}</td>
                                    <td className="py-3">{value}</td>
                                    <td className="py-3">{trendMap[index]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Forecast;
