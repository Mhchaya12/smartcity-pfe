import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { energyData, energyOptions, trafficData, trafficOptions } from '../../../data/adminData'; // Import from adminData.js
import './Charts.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Charts = () => {
  return (
    <div className="charts">
      <div className="chart-card">
        <Line data={energyData} options={energyOptions} />
      </div>
      <div className="chart-card">
        <Bar data={trafficData} options={trafficOptions} />
      </div>
    </div>
  );
};

export default Charts;