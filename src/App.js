import React, { useState } from "react";
import ApiResponse from "./components/ApiResponse";
import TempGraph from "./components/TempGraph";
import SignUp from "./components/SignUp";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [wholeData, setWholeData] = useState(null);
  const [loading, setLoading] = useState(false);

  // State for modal visibility
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost/backend/api/api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ city }),
      });

      const data = await response.json();
      if (data.success) {
        setWeatherData(data.data);
        setWholeData(data.data.whole_data);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-6xl w-full">
        {/* Form */}
        <div className="md:col-span-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold">Search City</h2>
            <p className="text-sm text-gray-400">
              Entering a country will display the temperature in the capital.
            </p>
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg"
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Weather Info */}
        <div className="md:col-span-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
          <ApiResponse weather={weatherData} />
        </div>

        {/* Temperature Graph */}
        <div className="md:col-span-2 bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
          <TempGraph wholeData={wholeData} city={city} />
        </div>
      </div>

      {/* Modal */}
      {isSignUpModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Sign Up</h2>
              <button
                onClick={() => setIsSignUpModalOpen(false)}
                className="text-gray-400 hover:text-white text-lg"
              >
                &times;
              </button>
            </div>
            <SignUp />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
