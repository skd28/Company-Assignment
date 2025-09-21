import { useState } from "react";
import BarChart from "./component/BarChart";
import rawDataJson from "./data/fuelData.json";

interface FuelData {
  Country: string;
  Year: string;
  Month: string;
  "Calendar Day": string;
  Products: string;
  "Metro Cities": string;
  "Retail Selling Price (Rsp) Of Petrol And Diesel (UOM:INR/L(IndianRupeesperLitre)), Scaling Factor:1": number;
}

// Cast JSON data to typed array
const rawData: FuelData[] = rawDataJson as FuelData[];

const App = () => {
  // Default filters: Delhi Petrol
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [selectedFuel, setSelectedFuel] = useState("Petrol");

  // Extract unique years
  const years = Array.from(new Set(rawData.map((item) => item.Year)));

  // Default year: first available year
  const [selectedYear, setSelectedYear] = useState(years[0]);

  // Fixed list of months
  const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Filter data for selected city, fuel, and year
  const filteredData = rawData.filter(
    (item) =>
      item.Products === selectedFuel &&
      item["Metro Cities"] === selectedCity &&
      item.Year === selectedYear
  );

  // Step 1: Collect all prices grouped by month
  const monthPriceAccumulator: Record<string, { sum: number; count: number }> = {};

  filteredData.forEach((item) => {
    const monthName = item.Month.split(",")[0]; // get month name only
    const price =
      item[
        "Retail Selling Price (Rsp) Of Petrol And Diesel (UOM:INR/L(IndianRupeesperLitre)), Scaling Factor:1"
      ];

    if (!monthPriceAccumulator[monthName]) {
      monthPriceAccumulator[monthName] = { sum: 0, count: 0 };
    }

    monthPriceAccumulator[monthName].sum += price;
    monthPriceAccumulator[monthName].count += 1;
  });

  // Step 2: Compute average for each month
  const monthPriceMap: Record<string, number> = {};
  for (const month in monthPriceAccumulator) {
    const { sum, count } = monthPriceAccumulator[month];
    monthPriceMap[month] = sum / count;
  }

  // Prepare chart data: ensure all 12 months are included
  const chartData = allMonths.map((month) => ({
    month,
    price: monthPriceMap[month] ?? 0, // 0 for missing months
  }));

  console.log("Chart Data:", chartData);

  return (
    <div style={{ padding: "20px" }}>
      <h1>
        {selectedFuel} Prices in {selectedCity} (
        {selectedYear.match(/\d{4}/)?.[0]})
      </h1>

      {/* City selector */}
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        {Array.from(new Set(rawData.map((item) => item["Metro Cities"]))).map(
          (city) => (
            <option key={city} value={city}>
              {city}
            </option>
          )
        )}
      </select>

      {/* Fuel type selector */}
      <select
        value={selectedFuel}
        onChange={(e) => setSelectedFuel(e.target.value)}
      >
        {Array.from(new Set(rawData.map((item) => item.Products))).map((fuel) => (
          <option key={fuel} value={fuel}>
            {fuel}
          </option>
        ))}
      </select>

      {/* Year selector (show only year number) */}
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {years.map((yearStr) => {
          const yearNum = yearStr.match(/\d{4}/)?.[0] || yearStr;
          return (
            <option key={yearStr} value={yearStr}>
              {yearNum}
            </option>
          );
        })}
      </select>

      <BarChart data={chartData} />
    </div>
  );
};

export default App;
