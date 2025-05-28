import React from 'react';
import './NbaScoreTable.css';

const NbaScoreTable = ({ data }) => {
    if (!data) return <p>점수 정보를 불러오는 중...</p>;

    const quarters = data.quarters || []; // 예: [1Q, 2Q, 3Q, 4Q, OT]
    const homeScores = data.homeScores || [];
    const awayScores = data.awayScores || [];

    return (
        <div className="nba-score-table">
            <table>
                <thead>
                    <tr>
                        <th>쿼터</th>
                        {quarters.map((q, idx) => (
                            <th key={idx}>{q}</th>
                        ))}
                        <th>합계</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{data.homeTeam}</td>
                        {homeScores.map((score, idx) => (
                            <td key={idx}>{score}</td>
                        ))}
                        <td>{homeScores.reduce((a, b) => a + b, 0)}</td>
                    </tr>
                    <tr>
                        <td>{data.awayTeam}</td>
                        {awayScores.map((score, idx) => (
                            <td key={idx}>{score}</td>
                        ))}
                        <td>{awayScores.reduce((a, b) => a + b, 0)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default NbaScoreTable;
