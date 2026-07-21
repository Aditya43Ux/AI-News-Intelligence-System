import { motion } from 'framer-motion';
import { FiBarChart2, FiBookOpen, FiTrendingUp, FiMessageSquare } from 'react-icons/fi';
import Hero from '../components/Hero';
import StatsCard from '../components/StatsCard';

const stats = [
    { title: 'Total Articles', value: '12.5k+', description: 'News items analyzed', icon: FiBarChart2, accent: '#2563eb' },
    { title: 'Positive News', value: '63%', description: 'Positive sentiment share', icon: FiMessageSquare, accent: '#22c55e' },
    { title: 'Negative News', value: '17%', description: 'Negative sentiment share', icon: FiBookOpen, accent: '#ef4444' },
    { title: 'Forecast Days', value: '7', description: 'Predictive horizon', icon: FiTrendingUp, accent: '#06b6d4' },
];

const Home = () => (
    <div className="space-y-8">
        <Hero />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
                <StatsCard key={stat.title} {...stat} />
            ))}
        </motion.div>
    </div>
);

export default Home;
