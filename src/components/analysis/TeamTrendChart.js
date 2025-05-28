import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

// 🟦 Chart.js 필수 요소 등록
Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

function TeamTrendChart({ data }) {
  if (!Array.isArray(data)) {
    console.warn("data is not an array:", data);
    return <p>데이터 형식이 잘못되었습니다.</p>;
  }

  const labels = [...new Set(data.map(item => item.checkday))];
  const teams = [...new Set(data.map(d => d.teamName))];

  const datasets = teams.map(team => {
    const teamData = data.filter(d => d.teamName === team);

    return {
      label: team,
      data: labels.map(label => {
        const entry = teamData.find(d => d.checkday === label);
        return entry?.rank ?? null;
      }),
      fill: false,
      borderColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
      tension: 0.3,
    };
  });

  return (
    <div>
      <Line
        data={{ labels, datasets }}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
          },
        }}
      />
    </div>
  );
}

export default TeamTrendChart;
