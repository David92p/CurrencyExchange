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

const Chart = ({
  period,
  values,
  trend,
  leftCurrency,
  rightCurrency,
  getData,
  dataTime,
}) => {
  if (window.innerWidth <= 768 && period.length > 5 && period.length <= 19) {
    period = [
      period[0],
      period[3],
      period[5],
      period[7],
      period[10],
      period[13],
      period[15],
      period[18],
    ];
    // ];
  } else if (
    window.innerWidth <= 768 &&
    period.length > 19 &&
    period.length <= 61
  ) {
    period = [
      period[0],
      period[3],
      period[6],
      period[11],
      period[15],
      period[19],
      period[25],
      period[29],
      period[36],
      period[40],
      period[43],
      period[47],
      period[51],
      period[57],
      period[60],
    ];
  }

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
          <button
            className="btn-chart"
            onClick={() => getData(dataTime("Weekly"))}
          >
            Weekly
          </button>
          <button
            className="btn-chart"
            onClick={() => getData(dataTime("Monthly"))}
          >
            Monthly{" "}
          </button>
          <button
            className="btn-chart"
            onClick={() => getData(dataTime("Quarterly"))}
          >
            Quarterly
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chart;
