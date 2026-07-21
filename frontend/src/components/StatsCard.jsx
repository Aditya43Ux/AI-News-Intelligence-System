import { motion } from 'framer-motion';

const StatsCard = ({ title, value, description, icon: Icon, accent }) => (
    <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-glow backdrop-blur"
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-slate-400">{title}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: `${accent}22`, color: accent }}>
                <Icon size={22} />
            </div>
        </div>
        <p className="mt-4 text-sm text-slate-400">{description}</p>
    </motion.div>
);

export default StatsCard;
