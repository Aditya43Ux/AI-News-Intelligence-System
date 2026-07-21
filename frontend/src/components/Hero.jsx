import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Hero = () => (
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-900/70 px-6 py-16 shadow-glow backdrop-blur md:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.28),_transparent_35%)]" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <p className="mb-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">
                    AI-powered news intelligence
                </p>
                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                    AI News Intelligence System
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-slate-300">
                    AI powered news classification, sentiment analysis, and future trend forecasting for modern media intelligence.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500">
                        Launch Dashboard <FiArrowRight />
                    </Link>
                    <Link to="/about" className="rounded-full border border-white/10 px-5 py-3 font-medium text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-300">
                        Learn More
                    </Link>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl">
                    <div className="space-y-4">
                        {[
                            ['Category Classification', '96%'],
                            ['Sentiment Analysis', '94%'],
                            ['Forecasting', '7 Days'],
                        ].map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                                <span className="text-sm text-slate-300">{label}</span>
                                <span className="font-semibold text-cyan-300">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);

export default Hero;
