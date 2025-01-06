function ApiResponse({ weather }) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">
        {weather ? `${weather.city}` : "Enter a city"}
      </h1>
      <p className="text-text">{weather?.last_updated}</p>
      <h4 className="text-xl font-semibold text-gray-100">
        Current Temp:{" "}
        <span className="font-bold">{weather?.current_temp || "-"}</span>°C
      </h4>
      <h4 className="text-xl font-semibold text-gray-100">
        Feels Like:{" "}
        <span className="font-bold">{weather?.feels_like || "-"}</span>°C
      </h4>
      <h4 className="text-xl font-semibold text-gray-100">
        Humidity: <span className="font-bold">{weather?.humidity || "-"}</span>%
      </h4>
      <h4 className="text-xl font-semibold text-gray-100">
        Condition:{" "}
        <span className="font-bold">{weather?.condition || "-"}</span>
      </h4>
    </>
  );
}

export default ApiResponse;
