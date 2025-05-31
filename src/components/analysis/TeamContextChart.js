import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import CONFIG from "config";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';
import { PointElement, LineElement } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartDataLabels, PointElement, LineElement);

const TeamContextChart = ({ teamName, leagueName, rnkData, isHome, isTopdog }) => {
    const [stats, setStats] = useState(null);

    const summarizeRankData = (data, teamName) => {
        const teamData = data.filter(d => d.teamName === teamName);
        const ranks = teamData.map(d => d.rank);
        const latest = ranks[ranks.length - 1];
        const highest = Math.min(...ranks);
        const lowest = Math.max(...ranks);
        const first = ranks[0];

        let changeIcon = "➖";
        if (latest < first) changeIcon = "🔼";
        else if (latest > first) changeIcon = "🔽";

        return { current: latest, highest, lowest, changeIcon };
    };

    useEffect(() => {
        debugger;

        if (!teamName || !leagueName) return;

        const url = `${CONFIG.API_BASE}/api/stats/team-context?teamName=${teamName}&leagueName=${leagueName}`;
        console.log("📡 fetch url:", url);

        fetch(url)
            .then((res) => {
                console.log("🔁 status:", res.status);
                if (!res.ok) {
                    console.error("❌ 서버 오류 응답:", res.statusText);
                    return null;
                }
                return res.text(); // 👈 JSON 대신 text로 먼저 받기
            })
            .then((text) => {
                if (!text) {
                    console.warn("⚠️ 응답 내용이 비어 있음");
                    return;
                }
                try {
                    const data = JSON.parse(text);
                    console.log("✅ JSON 파싱 성공:", data);
                    setStats(data);
                } catch (e) {
                    console.error("🚫 JSON 파싱 실패:", e, "\n본문:", text);
                }
            })
            .catch((err) => {
                console.error("🚨 fetch 실패:", err);
            });
    }, [teamName, leagueName]);

    if (!stats) return <div>Loading chart data...</div>;

    const summary = rnkData ? summarizeRankData(rnkData, teamName) : null;

    const labels = Object.keys(stats); // home_topdog, away_underdog 등
    const winData = labels.map(key => stats[key]?.winCount ?? 0);
    const drawData = labels.map(key => stats[key]?.drawCount ?? 0);
    const loseData = labels.map(key => stats[key]?.loseCount ?? 0);
    const maxBars = 10;
    // 기존 데이터에서 앞에서 10개만 추출
    const limitedLabels = labels.slice(0, maxBars);
    const limitedWinData = winData.slice(0, maxBars);
    const limitedDrawData = drawData.slice(0, maxBars);
    const limitedLoseData = loseData.slice(0, maxBars);

    const data = {
        labels: limitedLabels,
        datasets: [
            {
                label: 'Win',
                data: limitedWinData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                barPercentage: 0.6,
                categoryPercentage: 0.6,
            },
            {
                label: 'Draw',
                data: limitedDrawData,
                backgroundColor: 'rgba(201, 203, 207, 0.6)',
                barPercentage: 0.6,
                categoryPercentage: 0.6,
            },
            {
                label: 'Lose',
                data: limitedLoseData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                barPercentage: 0.6,
                categoryPercentage: 0.6,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: '팀 컨텍스트별 경기 결과' },
            datalabels: {
                color: '#333',
                anchor: 'end',
                align: 'top',
                font: {
                    weight: 'bold',
                    size: 12
                },
                formatter: (value, context) => {
                    // 같은 막대 index에서 각 dataset 값 합산
                    const dataIndex = context.dataIndex;
                    const datasets = context.chart.data.datasets;
                    const total = datasets.reduce((sum, ds) => sum + (ds.data[dataIndex] || 0), 0);
                    if (total === 0) return '0%';
                    const pct = (value / total) * 100;
                    return `${pct.toFixed(1)}%`;
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
    if (!summary) {
        return (
            <div>
                <p>❗ 순위 정보가 없습니다: {teamName}</p>
                <Bar data={data} options={options} />
            </div>
        );
    }
    const rankData = rnkData?.filter(d => d.teamName === teamName);
    const rankChartData = {
        labels: rankData.map(d => d.checkday),
        datasets: [
            {
                label: `${teamName} 순위 추이`,
                data: rankData.map(d => d.rank),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: false,
                tension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    };

    const rankChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: `${teamName} 순위 추이`
            }
        },
        scales: {
            y: {
                reverse: true,
                min: 1,
                max: 10,  // 필요에 따라 더 낮춰줘
                ticks: {
                    stepSize: 1
                }
            }
        }
    };
    return (
        <div>
            {summary && (
                <div style={{
                    marginBottom: "20px",
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "6px",
                    backgroundColor: "#f8f9fa"
                }}>
                    <h4>📊 {stats.teamName} 순위 요약</h4>
                    <p>현재 순위: {summary.current}위 {summary.changeIcon}</p>
                    <p>최고 순위: {summary.highest}위</p>
                    <p>최저 순위: {summary.lowest}위</p>
                </div>
            )}

            <Bar data={data} options={options} />
            {/* 👇 여기에 순위 추이 그래프 추가 */}
            <div style={{ marginTop: "30px" }}>
                <h4>📈 최근 순위 변화</h4>
                <Line data={rankChartData} options={rankChartOptions} />
            </div>
        </div>
    );
};
export default TeamContextChart;
