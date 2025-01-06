import React, { useRef, useState } from "react";
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

// Register ChartJS components
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
  const [email, setEmail] = useState(""); // Track email input
  const chartRef = useRef(null); // Reference for chart
  const tempInfo = wholeData?.[0]?.hour || []; // Extract hourly data

  // Format time to display only the hour
  const formatTime = (timeString) => {
    const timeParts = timeString.split(" ")[1].split(":");
    return `${timeParts[0]}:00`;
  };

  // Export chart to image
  const exportToImage = () => {
    if (chartRef.current) {
      const chartInstance = chartRef.current;
      const base64Image = chartInstance.toBase64Image();
      const link = document.createElement("a");
      link.href = base64Image;
      link.download = `${city}_temperature_chart.png`;
      link.click();
    }
  };

  // Send chart image to backend for email
  const sendChartImage = async (event) => {
    event.preventDefault(); // Prevent page reload on form submit

    if (chartRef.current) {
      // Export chart to Base64 image
      const base64Image = chartRef.current.toBase64Image();

      // Convert Base64 to Blob
      const res = await fetch(base64Image);
      const blob = await res.blob();

      // Prepare FormData to send to backend
      const formData = new FormData();
      formData.append("image", blob, "chart.png");
      formData.append("email", email); // Send the email entered by the user

      try {
        const response = await fetch(
          "http://localhost/backend/mailing/mail.php",
          {
            method: "POST",
            body: formData,
            mode: "no-cors",
          }
        );

        const result = await response.json();
        if (result.success) {
          alert("Email with chart has been sent!");
        } else {
          alert("Failed to send email.");
        }
      } catch (error) {
        console.error("Error sending image:", error);
      }
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
                color: "rgb(200, 200, 200)",
              },
            },
            tooltip: {
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              backgroundColor: "rgba(50, 50, 50, 0.8)",
            },
          },
          scales: {
            x: {
              ticks: {
                color: "rgb(200, 200, 200)",
              },
              grid: {
                color: "rgba(75, 75, 75, 0.5)",
              },
            },
            y: {
              ticks: {
                color: "rgb(200, 200, 200)",
              },
              grid: {
                color: "rgba(75, 75, 75, 0.5)",
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
        <form onSubmit={sendChartImage}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            required
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Send Chart as Email
          </button>
        </form>
      </div>
    </div>
  );
}

export default TempGraph;
