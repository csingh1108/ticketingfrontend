// Calculate the date for the current day
const today = new Date();

// Create an array to store the date labels for the past 8 weeks with "MM/DD" format
const dateLabels = [];
for (let i = 7; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i * 7); // Subtracting weeks
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (0-11) and format it with leading zero
    const day = String(date.getDate()).padStart(2, '0'); // Get the day of the month and format it with leading zero
    dateLabels.push(`${month}/${day}`);
}


export const barChartOptionsCharts1 = {
    chart: {
        toolbar: {
            show: false
        }
    },
    tooltip: {
        style: {
            fontSize: "12px",
            fontFamily: undefined
        },
        onDatasetHover: {
            style: {
                fontSize: "12px",
                fontFamily: undefined
            }
        },
        theme: ""
    },
    xaxis: {
        categories: dateLabels,
        show: true,
        labels: {
            show: true,
            style: {
                colors: "#A3AED0",
                fontSize: "12px",
                fontWeight: "500"
            }
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    yaxis: {
        show: true,
        color: "black",
        labels: {
            show: true,
            style: {
                colors: "#CBD5E0",
                fontSize: "16px"
            }
        }
    },
    grid: {
        strokeDashArray: 5,
        yaxis: {
            lines: {
                show: true
            }
        },
        xaxis: {
            lines: {
                show: false
            }
        }
    },
    fill: {
        type: "gradient",
        gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.5,
            gradientToColors: ["#5E37FF"],
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
        }
    },
    dataLabels: {
        enabled: false
    },
    plotOptions: {
        bar: {
            borderRadius: 8,
            columnWidth: "40px"
        }
    }
};
