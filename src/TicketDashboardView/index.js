import React from 'react';
import BarChart from "../components/chart/BarChart";
import { barChartOptionsCharts1 } from "../components/chart/chartData";
import TicketMenu from "../TicketMenu";
import Chart from "react-google-charts";

const TicketDashboard = () => {
    const chartData = {
        name: "Opened Tickets",
        data: [20, 30, 40, 20, 45, 30]
    };

    const data = [
        ["Severity", "Number"],
        ["Low", 11],
        ["Medium", 2],
        ["High", 2],
        ["Severe", 2],
    ];

    const options = {
        title: "Open Tickets By Severity",
    };

    return (
        <div className="bg-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-10">
                <TicketMenu/>
            <div className="flex h-screen">
                <div style={{ width: '800px', height: '300px' }}>
                    <BarChart
                        chartData={chartData}
                        chartOptions={barChartOptionsCharts1}
                    />
                </div>
                <div>
                    <div className="w-full">
                        <div className="bg-white shadow-md rounded my-6">
                            <table className="min-w-max w-full table-auto">
                                <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">ID</th>
                                    <th className="py-3 px-6 text-left">Name</th>
                                    <th className="py-3 px-6 text-center">Email</th>
                                    <th className="py-3 px-6 text-center">Role</th>
                                    <th className="py-3 px-6 text-center">Num of Open Tickets</th>
                                </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm font-light">
                                <tr className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">1</td>
                                    <td className="py-3 px-6 text-left">John Doe</td>
                                    <td className="py-3 px-6 text-center">john@example.com</td>
                                    <td className="py-3 px-6 text-center">Admin</td>
                                    <td className="py-3 px-6 text-center">
                                        <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button">Edit</button>
                                        <button className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button">Delete</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <Chart
                                chartType="PieChart"
                                data={data}
                                options={options}
                                width={"100%"}
                                height={"400px"}
                                className="circle-animation"
                            />

                        </div>
                    </div>

                </div>
            </div>
            </div>
        </div>
    );
};




export default TicketDashboard;
