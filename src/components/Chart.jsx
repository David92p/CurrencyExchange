import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const Chart = ({ period, values, trend, leftCurrency, rightCurrency }) => {
  const options = {
    elements: {
      point: {
        radius: 4,
        pointStyle: "circle",
        backgroundColor: "white",
        borderColor: "rgba(23, 177, 105, 1)",
      },
      line: {
        backgroundColor: "white",
        borderWidth: 3,
      },
    },
  };

  const data = {
    labels: period, // date temporali su asse X
    datasets: [
      {
        fill: true,
        label: "Market trend",
        data: values, // valori di cambio su asse Y
        borderColor: "rgba(23, 177, 105, 1)",
        backgroundColor: "rgba(23, 177, 105, 0.1)",
      },
    ],
  };

  /////////////////////////////////////////////////////////////////////////////
  return (
    <div className="container-chart">
      <div className="header-chart">
        <div>Change {trend}</div>
        <div>
          {leftCurrency} / {rightCurrency}
        </div>
      </div>
      <div className="main-chart">
        <Line data={data} options={options} />
        <div className="main-btn">
          <button className="btn-chart">Week</button>
          <button className="btn-chart">Month </button>
          <button className="btn-chart">3 Months</button>
        </div>
      </div>
    </div>
  );
};

export default Chart;
