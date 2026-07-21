import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ data }) => {
    const chartData = {
        labels: ['Business', 'Sports', 'Technology', 'World'],
        datasets: [
            {
                data,
                backgroundColor: ['#2563eb', '#06b6d4', '#38bdf8', '#0f172a'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="h-64">
            <Pie data={chartData} options={{ responsive: true, plugins: { legend: { labels: { color: '#e2e8f0' } } } }} />
        </div>
    );
};

export default CategoryPieChart;
