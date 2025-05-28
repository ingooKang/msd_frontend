import React from "react";
import './SoccerPlayerStats.css';

const SoccerPlayerStats = ({ data }) => {
    if (!data || data.length == 0) return <p>선수 기록이 없습니다.</p>;

    const homePlayer = data.filter(p => p.ha === 'h');
    const awayPlayer = data.filter(p => p.ha === 'a');

    const renderTable = (players, title) => (
        <div className="player-block">
            <h4>{title}</h4>
            <table>
                <thead>
                    <tr>
                        <th>팀</th>
                        <th>선수</th>
                        <th>득점</th>
                        <th>어시스트</th>
                        <th>경고</th>
                        <th>퇴장</th>
                        <th>시간</th>
                        <th>홈/원정</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((p, i) => (
                        <tr key={i}>
                            <td>{p.teamName}</td>
                            <td>{p.name}</td>
                            <td>{p.goals > 0 ? `⚽ ${p.goals}` : "-"}</td>
                            <td>{p.assistStr || "-"}</td>
                            <td>{p.yellow_card > 0 ? "🟨" : "-"}</td>
                            <td>{p.redcard > 0 ? "🟥" : "-"}</td>
                            <td>{p.runtime}</td>
                            <td>{p.ha}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    return (
        <div className="soccer-player-stats">
            {renderTable(homePlayer, "홈팀 선수 기록")}
            {renderTable(awayPlayer, "원정팀 선수 기록")}
        </div>
    );
};

export default SoccerPlayerStats;