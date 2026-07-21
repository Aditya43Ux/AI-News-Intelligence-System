import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SentimentChart = ({ data }) => {
    const chartData = {
        labels: ['Positive', 'Negative', 'Neutral'],
        datasets: [
            {
                label: 'Articles',
                data,
                backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
                borderRadius: 10,
            },
        ],
    };

    return (
        <div className="h-64">
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' } } } }} />
        </div>
    );
};

export default SentimentChart;
