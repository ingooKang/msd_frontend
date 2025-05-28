import React from 'react';
import './NbaTeamStats.css';

const NbaTeamStats = ({ data }) => {
    if (!data || !data.home || !data.away) return <p>팀 기록을 불러오는 중...</p>;

    const rows = [
        { label: "필드골 성공률", key: "fieldGoalPct", suffix: "%" },
        { label: "3점슛 성공률", key: "pointShoot3pct", suffix: "%" },
        { label: "자유투 성공률", key: "freeThrowPct", suffix: "%" },
        { label: "전체 리바운드", key: "totRbd" },
        { label: "공격 리바운드", key: "appRbd" },
        { label: "수비 리바운드", key: "defRbd" },
        { label: "어시스트", key: "assist" },
        { label: "스틸", key: "steal" },
        { label: "블록", key: "block" },
        { label: "턴오버", key: "turnOver" },
        { label: "페인트존 득점", key: "paintZoneScore" }
    ];

    return (
        <div className="nba-team-stats">
            <table>
                <thead>
                    <tr>
                        <th>{data.home.teamName}</th>
                        <th>{data.away.teamName}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx}>
                            <td>{data.home[row.key] ?? "-" }{row.suffix || ""}</td>
                            <td>{data.away[row.key] ?? "-" }{row.suffix || ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NbaTeamStats;
