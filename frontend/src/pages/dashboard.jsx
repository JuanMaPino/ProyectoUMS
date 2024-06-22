import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title);

const lineChartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Sales',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderWidth: 1,
      pointRadius: 5,
    },
  ],
};

const barChartData = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: 'Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Sales Dashboard</h2>
      
      <div className="chart-container">
        <div className="chart-item">
          <Line data={lineChartData} />
        </div>
        <div className="chart-item">
          <Bar data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
