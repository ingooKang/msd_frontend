import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import GameListTable from "../common/GameListTable";
import { transformRecentGamesToStandard } from 'utils/transformers';

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartDataLabels, PointElement, LineElement);

const TeamContextChart = ({
    teamName,
    rnkData,
    contextStats,
    contextStatsByOdds,
    oddsEvaluation,
    recentStats,
    gameCount, // ✅ 추가
    onChangeGameCount, // ✅ 이벤트 핸들러 추가
    headToHeadGames, // ✅ 여기에 props 선언
    recentGames,
}) => {
    const [useOddsData, setUseOddsData] = useState(false);

    if (!contextStats || !contextStatsByOdds) return <div>📊 데이터 로딩 중...</div>;

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
                    : '📊 순위 기준 팀 컨텍스트별 경기 결과',
            },
            datalabels: {
                color: '#333',
                anchor: 'end',
                align: 'top',
                font: { weight: 'bold', size: 12 },
                formatter: (value, context) => {
                    const total = context.chart.data.datasets.reduce((sum, ds) => sum + (ds.data[context.dataIndex] || 0), 0);
                    return total === 0 ? '0%' : `${((value / total) * 100).toFixed(1)}%`;
                },
            },
        },
        scales: { y: { beginAtZero: true } },
    };

    const thStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center", fontWeight: "bold" };
    const tdStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };

    const summarizeRankData = (data) => {
        if (!Array.isArray(data)) return null;
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

    const summary = rnkData ? summarizeRankData(rnkData) : null;

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
    const transformedGames = transformRecentGamesToStandard(recentGames, teamName);
    const transformedHeadToHead = transformRecentGamesToStandard(headToHeadGames || [], teamName);

    console.log("📦 props.teamName:", teamName);
    console.log("📦 headToHeadGames:", headToHeadGames);
    console.log("📦 transformedHeadToHead:", transformedHeadToHead);

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
                    <select id="gameCountSelect" value={gameCount} onChange={(e) => onChangeGameCount(Number(e.target.value))}>
                        <option value={5}>최근 5경기</option>
                        <option value={10}>최근 10경기</option>
                        <option value={15}>최근 15경기</option>
                        <option value={20}>최근 20경기</option>
                        <option value={25}>최근 25경기</option>
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
                        <tr>
                            <td style={tdStyle}>배당적정성</td>
                            <td style={tdStyle}>
                                {oddsEvaluation?.message ?? '-'}
                            </td>
                        </tr>
                        <tr>
                            <td style={tdStyle}>득점 / 실점</td>
                            <td style={tdStyle}>
                                {recentStats ? `${recentStats.goalFor} / ${recentStats.goalAgainst}` : '-'}
                            </td>
                        </tr>
                        <tr>
                            <td style={tdStyle}>점수 합계</td>
                            <td style={tdStyle}>{recentStats?.totalScore ?? '-'}</td>
                        </tr>
                        <tr>
                            <td style={tdStyle}>득실차</td>
                            <td style={tdStyle}>{recentStats?.goalDiff ?? '-'}</td>
                        </tr>
                        <tr>
                            <td style={tdStyle}>평균득점합산</td>
                            <td style={tdStyle}>{recentStats?.avgScore ?? '-'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {oddsEvaluation && oddsEvaluation.hasData && (
                <div style={{ marginTop: "30px", border: "1px solid #ddd", padding: "10px", borderRadius: "6px" }}>
                    <h4>🎯 배당 분석 결과</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f0f0f0" }}>
                                <th style={tdStyle}>항목</th>
                                <th style={tdStyle}>내용</th>
                            </tr>
                        </thead>
                        <tbody>
                            {oddsEvaluation.win && (
                                <tr>
                                    <td style={tdStyle}>승 (Win)</td>
                                    <td style={tdStyle}>
                                        예상 확률 {oddsEvaluation.win.expectedProbability?.toFixed(1)}% /
                                        배당 확률 {oddsEvaluation.win.impliedProbability?.toFixed(1)}% /
                                        <span style={{
                                            color:
                                                oddsEvaluation.win.gap > 10 ? 'green' :
                                                    oddsEvaluation.win.gap > 5 ? 'orange' : 'gray',
                                            fontWeight: 'bold'
                                        }}>
                                            차이 {oddsEvaluation.win.gap > 0 ? '+' : ''}{oddsEvaluation.win.gap?.toFixed(1)}%
                                        </span> /
                                        배당 {oddsEvaluation.win.odds ?? '-'} →
                                        <strong> {oddsEvaluation.win.valueLevel ?? '-'}</strong>
                                    </td>
                                </tr>
                            )}
                            {oddsEvaluation.draw && (
                                <tr>
                                    <td style={tdStyle}>무 (Draw)</td>
                                    <td style={tdStyle}>
                                        예상 확률 {oddsEvaluation.draw.expectedProbability?.toFixed(1)}% /
                                        배당 확률 {oddsEvaluation.draw.impliedProbability?.toFixed(1)}% /
                                        <span style={{
                                            color:
                                                oddsEvaluation.draw.gap > 10 ? 'green' :
                                                    oddsEvaluation.draw.gap > 5 ? 'orange' : 'gray',
                                            fontWeight: 'bold'
                                        }}>
                                            차이 {oddsEvaluation.draw.gap > 0 ? '+' : ''}{oddsEvaluation.draw.gap?.toFixed(1)}%
                                        </span> /
                                        배당 {oddsEvaluation.draw.odds ?? '-'} →
                                        <strong> {oddsEvaluation.draw.valueLevel ?? '-'}</strong>
                                    </td>
                                </tr>
                            )}
                            {oddsEvaluation.lose && (
                                <tr>
                                    <td style={tdStyle}>패 (Lose)</td>
                                    <td style={tdStyle}>
                                        예상 확률 {oddsEvaluation.lose.expectedProbability?.toFixed(1)}% /
                                        배당 확률 {oddsEvaluation.lose.impliedProbability?.toFixed(1)}% /
                                        <span style={{
                                            color:
                                                oddsEvaluation.lose.gap > 10 ? 'green' :
                                                    oddsEvaluation.lose.gap > 5 ? 'orange' : 'gray',
                                            fontWeight: 'bold'
                                        }}>
                                            차이 {oddsEvaluation.lose.gap > 0 ? '+' : ''}{oddsEvaluation.lose.gap?.toFixed(1)}%
                                        </span> /
                                        배당 {oddsEvaluation.lose.odds ?? '-'} →
                                        <strong> {oddsEvaluation.lose.valueLevel ?? '-'}</strong>
                                    </td>
                                </tr>
                            )}
                            {oddsEvaluation.handicap && (
                                <tr>
                                    <td style={tdStyle}>핸디캡</td>
                                    <td style={{
                                        ...tdStyle,
                                        color:
                                            oddsEvaluation.handicap.result === '적중' ? 'green' :
                                                oddsEvaluation.handicap.result === '실패' ? 'red' : 'gray',
                                        fontWeight: 'bold'
                                    }}>
                                        기준 {oddsEvaluation.handicap.line ?? '-'} /
                                        점수차 {oddsEvaluation.handicap.scoreGap ?? '-'} →
                                        {oddsEvaluation.handicap.result ?? '-'}
                                    </td>
                                </tr>
                            )}

                            {oddsEvaluation.overUnder && (
                                <tr>
                                    <td style={tdStyle}>언더오버</td>
                                    <td style={{
                                        ...tdStyle,
                                        color:
                                            oddsEvaluation.overUnder.result === '오버' ? 'blue' :
                                                oddsEvaluation.overUnder.result === '언더' ? 'purple' : 'gray',
                                        fontWeight: 'bold'
                                    }}>
                                        기준 {oddsEvaluation.overUnder.line ?? '-'} /
                                        합계점수 {oddsEvaluation.overUnder.totalScore ?? '-'} →
                                        {oddsEvaluation.overUnder.result ?? '-'}
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>
                </div>
            )}

            <GameListTable
                title={`📅 ${teamName} 최근 ${gameCount}경기`}
                games={transformedGames}
            />
            {Array.isArray(transformedHeadToHead) && transformedHeadToHead.length > 0 ? (
                <GameListTable
                    title="🤝 맞대결"
                    games={transformedHeadToHead}
                />
            ) : (
                <div style={{ marginTop: "20px", color: "#888" }}>
                    🤷 맞대결 데이터가 없습니다.
                </div>
            )}
        </div>
    );
};

export default TeamContextChart;
