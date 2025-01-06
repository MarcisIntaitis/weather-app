import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Have to register everything or the graph will just break
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TempGraph({ wholeData, city }) {
  const chartRef = useRef(null);
  const tempInfo = wholeData?.[0]?.hour || [];

  const formatTime = (timeString) => {
    const timeParts = timeString.split(" ")[1].split(":");
    return `${timeParts[0]}:00`; // Format to only show the hour
  };

  const exportToImage = () => {
    if (chartRef.current) {
      const chartInstance = chartRef.current;
      const base64Image = chartInstance.toBase64Image();
      const link = document.createElement("a");
      link.href = base64Image;
      link.download = city + "_temperature_chart.png";
      link.click();
    }
  };

  return (
    <div className="px-10">
      <Line
        data={{
          labels: tempInfo.map((data) => formatTime(data.time)),
          datasets: [
            {
              label: "Actual (°C)",
              data: tempInfo.map((data) => data.temp_c),
              borderColor: "rgb(34, 228, 242)",
              tension: 0.5,
            },
            {
              label: "Feels Like (°C)",
              data: tempInfo.map((data) => data.feelslike_c),
              borderColor: "rgb(242, 34, 124)",
              tension: 0.5,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: "rgb(200, 200, 200)", // Legend text color
              },
            },
            tooltip: {
              titleColor: "#ffffff", // Tooltip title color
              bodyColor: "#ffffff", // Tooltip body text color
              backgroundColor: "rgba(50, 50, 50, 0.8)", // Tooltip background
            },
          },
          scales: {
            x: {
              ticks: {
                color: "rgb(200, 200, 200)", // X-axis labels color
              },
              grid: {
                color: "rgba(75, 75, 75, 0.5)", // X-axis gridline color
              },
            },
            y: {
              ticks: {
                color: "rgb(200, 200, 200)", // Y-axis labels color
              },
              grid: {
                color: "rgba(75, 75, 75, 0.5)", // Y-axis gridline color
              },
            },
          },
        }}
        ref={chartRef}
      />
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={exportToImage}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Export Chart as Image
        </button>
      </div>
    </div>
  );
}

export default TempGraph;
