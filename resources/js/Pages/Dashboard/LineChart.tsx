import React from 'react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = () => {
    const generateRandomData = (length: number, max: number) =>
        Array.from({ length }, () => Math.floor(Math.random() * max));

    const data = [
        {
            id: 1,
            label: 'Sales',
            data: generateRandomData(12, 100),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
    ];

    const labels = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div>
            <Line
                datasetIdKey="id"
                data={{
                    labels: labels,
                    datasets: data,
                }}
            />
        </div>
    )
}

export default LineChart