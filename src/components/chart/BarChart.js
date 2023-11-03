// BarChart.js
import React from "react";
import Chart from "react-apexcharts";

const BarChart = ({ chartData, chartOptions }) => {
    const { name, data } = chartData;

    return (
        <div>
            <h2>New Tickets By Week</h2>
            <Chart
                options={chartOptions}
                series={[{ name , data }]}
                type="bar"
            />
        </div>
    );
};

export default BarChart;
