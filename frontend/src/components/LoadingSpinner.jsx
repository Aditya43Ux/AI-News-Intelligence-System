import { motion } from 'framer-motion';

const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-10 w-10 rounded-full border-4 border-cyan-400/30 border-t-cyan-400"
        />
    </div>
);

export default LoadingSpinner;
