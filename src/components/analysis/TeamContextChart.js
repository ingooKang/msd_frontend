import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import CONFIG from "config";

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartDataLabels, PointElement, LineElement);

const TeamContextChart = ({ teamName, leagueName, rnkData, isHome, isTopdog, gameId, sportType }) => {
    const [contextStats, setContextStats] = useState(null);
    const [contextStatsByOdds, setContextStatsByOdds] = useState(null);
    const [oddsEvaluation, setOddsEvaluation] = useState(null);
    const [gameCount, setGameCount] = useState(10);
    const [useOddsData, setUseOddsData] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!teamName || !leagueName || !sportType) return;

        const url = `${CONFIG.API_BASE}/api/stats/team-context?teamName=${teamName}&leagueName=${leagueName}&gameId=${gameId}&sportType=${sportType}`;

        fetch(url)
            .then(res => res.text())
            .then(text => {
                try {
                    if (!text) return;

                    const data = JSON.parse(text);
                    setContextStats(data.rankBasedContextStats);
                    setContextStatsByOdds(data.oddsBasedContextStats);
                    setOddsEvaluation(data.oddsEvaluation);
                } catch (err) {
                    console.error("🚨 JSON 파싱 에러:", err);
                } finally {
                    setLoading(false);  // ✅ 무조건 해제
                }
            })
            .catch(err => {
                console.error("🚨 fetch 실패:", err);
                setLoading(false);  // ✅ 실패 시에도 해제
            });
    }, [teamName, leagueName, gameId, sportType]);


    // ✅ 이 위치에 넣기
    if (loading) return <div>📊 데이터 로딩 중...</div>;
    const summarizeRankData = (data, teamName) => {
        const teamData = data.filter(d => d.teamName === teamName);
        const ranks = teamData.map(d => d.rank);
        if (ranks.length === 0) return null;
        const latest = ranks[ranks.length - 1];
        const first = ranks[0];
        const highest = Math.min(...ranks);
        const lowest = Math.max(...ranks);
        let changeIcon = "➖";
        if (latest < first) changeIcon = "🔼";
        else if (latest > first) changeIcon = "🔽";
        return { current: latest, highest, lowest, changeIcon };
    };

    if (!contextStats || !contextStatsByOdds || Object.keys(contextStats).length === 0)
        return <div>📊 데이터 로딩 중...</div>;


    const summary = rnkData ? summarizeRankData(rnkData, teamName) : null;

    const activeStats = useOddsData ? contextStatsByOdds : contextStats;
    const labels = Object.keys(activeStats);
    const winData = labels.map(key => activeStats[key]?.winCount ?? 0);
    const drawData = labels.map(key => activeStats[key]?.drawCount ?? 0);
    const loseData = labels.map(key => activeStats[key]?.loseCount ?? 0);

    const data = {
        labels,
        datasets: [
            { label: 'Win', data: winData, backgroundColor: 'rgba(75, 192, 192, 0.6)' },
            { label: 'Draw', data: drawData, backgroundColor: 'rgba(201, 203, 207, 0.6)' },
            { label: 'Lose', data: loseData, backgroundColor: 'rgba(255, 99, 132, 0.6)' },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: useOddsData
                    ? '📊 배당 기준 팀 컨텍스트별 경기 결과'
                    : '📊 순위 기준 팀 컨텍스트별 경기 결과'
            },
            datalabels: {
                color: '#333',
                anchor: 'end',
                align: 'top',
                font: { weight: 'bold', size: 12 },
                formatter: (value, context) => {
                    const total = context.chart.data.datasets.reduce((sum, ds) => sum + (ds.data[context.dataIndex] || 0), 0);
                    return total === 0 ? '0%' : `${((value / total) * 100).toFixed(1)}%`;
                }
            }
        },
        scales: { y: { beginAtZero: true } }
    };
    const thStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center", fontWeight: "bold" };
    const tdStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };

    const slicedRankData = (rnkData?.filter(d => d.teamName === teamName) || []).slice(-10);
    const rankChartData = {
        labels: slicedRankData.map(d => d.checkday),
        datasets: [{
            label: `${teamName} 순위 추이`,
            data: slicedRankData.map(d => d.rank),
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: false,
            tension: 0.1,
            pointRadius: 4,
            pointHoverRadius: 6,
        }]
    };

    const rankChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `${teamName} 순위 추이` }
        },
        scales: {
            y: {
                reverse: true,
                min: 1,
                max: 6,
                ticks: { stepSize: 1 }
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
                    <h4>📊 {teamName} 순위 요약</h4>
                    <p>현재 순위: {summary.current}위 {summary.changeIcon}</p>
                    <p>최고 순위: {summary.highest}위</p>
                    <p>최저 순위: {summary.lowest}위</p>
                </div>
            )}
            {/* 👉 기준 전환 버튼 */}
            <button onClick={() => setUseOddsData(!useOddsData)} style={{ marginBottom: '10px' }}>
                {useOddsData ? "순위 기준 보기" : "배당 기준 보기"}
            </button>
            <Bar data={data} options={options} />

            <div style={{ marginTop: "30px" }}>
                <h4>📈 최근 순위 변화</h4>
                <Line data={rankChartData} options={rankChartOptions} />
            </div>

            <div style={{ marginTop: "30px" }}>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="gameCountSelect">표시할 경기 수: </label>
                    <select id="gameCountSelect" value={gameCount} onChange={(e) => setGameCount(Number(e.target.value))}>
                        <option value={10}>최근 10경기</option>
                        <option value={20}>최근 20경기</option>
                    </select>
                </div>
                <h4>📊 최근 {gameCount}경기 기록 요약</h4>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f0f0f0" }}>
                            <th style={thStyle}>구분</th>
                            <th style={thStyle}>값</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td style={tdStyle}>배당적정성</td><td style={tdStyle}>-</td></tr>
                        <tr><td style={tdStyle}>득점 / 실점</td><td style={tdStyle}>-</td></tr>
                        <tr><td style={tdStyle}>점수 합계</td><td style={tdStyle}>-</td></tr>
                        <tr><td style={tdStyle}>득실차</td><td style={tdStyle}>-</td></tr>
                        <tr><td style={tdStyle}>평균득점합산</td><td style={tdStyle}>-</td></tr>
                    </tbody>
                </table>
            </div>

            {oddsEvaluation && (
                <div style={{ marginTop: "30px", border: "1px solid #ddd", padding: "10px", borderRadius: "6px" }}>
                    <h4>🎯 배당 분석 결과</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead><tr><th>항목</th><th>내용</th></tr></thead>
                        <tbody>
                            <tr><td style={tdStyle}>승무패</td><td style={tdStyle}>{JSON.stringify(oddsEvaluation.outcomeDetail)}</td></tr>
                            <tr><td style={tdStyle}>핸디캡</td><td style={tdStyle}>{JSON.stringify(oddsEvaluation.handicapResult)}</td></tr>
                            <tr><td style={tdStyle}>언더/오버</td><td style={tdStyle}>{JSON.stringify(oddsEvaluation.overUnderResult)}</td></tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TeamContextChart;
