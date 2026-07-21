import { motion } from 'framer-motion';
import { FiCpu, FiLayers, FiTrendingUp, FiBookOpen } from 'react-icons/fi';

const highlights = [
    { title: 'CNN', description: 'Text classification for category prediction', icon: FiCpu },
    { title: 'LSTM', description: 'Time-series forecasting for future article volume', icon: FiTrendingUp },
    { title: 'Sentiment Analysis', description: 'Determines positive, negative, or neutral tone', icon: FiBookOpen },
    { title: 'Workflow', description: 'Notebook → FastAPI → React dashboard', icon: FiLayers },
];

const About = () => (
    <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
            <p className="text-sm text-slate-400">About Project</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Project Overview</h2>
            <p className="mt-4 text-slate-300 leading-7">
                This system combines NLP preprocessing, CNN-based classification, sentiment analysis, and LSTM forecasting into a polished analytics dashboard. The notebook handles the ML pipeline while the frontend focuses on presenting predictions through a modern SaaS-style experience.
            </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
            {highlights.map((item) => {
                const Icon = item.icon;
                return (
                    <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                                <Icon size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                    </motion.div>
                );
            })}
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
            <p className="text-sm text-slate-400">Workflow</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="rounded-full bg-slate-800 px-3 py-2">Notebook</span>
                <span className="text-cyan-300">↓</span>
                <span className="rounded-full bg-slate-800 px-3 py-2">FastAPI</span>
                <span className="text-cyan-300">↓</span>
                <span className="rounded-full bg-slate-800 px-3 py-2">React</span>
            </div>
        </motion.div>
    </div>
);

export default About;
