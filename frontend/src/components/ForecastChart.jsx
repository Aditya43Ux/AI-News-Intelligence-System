import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const ForecastChart = ({ data }) => {
    const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    const safeData = Array.isArray(data) && data.length ? data : Array(7).fill(0);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Predicted',
                data: safeData,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                tension: 0.35,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: '#e2e8f0' },
            },
        },
        scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.15)' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.15)' } },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default ForecastChart;
