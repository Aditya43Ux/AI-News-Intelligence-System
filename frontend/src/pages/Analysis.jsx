import { useState } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import PredictionCard from '../components/PredictionCard';
import { predictNews } from '../services/api';

const Analysis = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setError('');
        try {
            const response = await predictNews({ text });
            setPrediction(response.data);
        } catch (err) {
            setError('Unable to get a prediction from the API.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
                <p className="text-sm text-slate-400">Analysis Page</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Paste a news article to analyze</h2>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste a news article here..."
                    className="mt-6 min-h-[220px] w-full rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-slate-200 outline-none ring-0"
                />
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-slate-400">The frontend now calls the FastAPI prediction endpoint.</p>
                    <button onClick={handleAnalyze} className="rounded-full bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-500">
                        Analyze
                    </button>
                </div>
            </motion.div>

            {loading && <LoadingSpinner />}
            {error && <p className="text-sm text-rose-400">{error}</p>}
            {!loading && prediction && <PredictionCard prediction={prediction} />}
        </div>
    );
};

export default Analysis;
