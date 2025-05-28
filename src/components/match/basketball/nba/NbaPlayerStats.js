import React from 'react';
import './NbaPlayerStats.css';

const NbaPlayerStats = ({ data }) => {
    if (!data || data.length === 0) return <p>선수 기록이 없습니다.</p>;

    const homePlayers = data.filter(p => p.ha?.toLowerCase() === 'h');
    const awayPlayers = data.filter(p => p.ha?.toLowerCase() === 'a');

    const renderTable = (players, title) => (
        <div className="player-block">
            <h4>{title}</h4>
            <table>
                <thead>
                    <tr>
                        <th>팀</th>
                        <th>선수</th>
                        <th>포지션</th>
                        <th>시간</th>
                        <th>리바운드</th>
                        <th>어시스트</th>
                        <th>득점</th>
                    
                    </tr>
                </thead>
                <tbody>
                    {players.map((p, i) => (
                        <tr key={i}>
                            <td>{p.teamName}</td>
                            <td>{p.name}</td>
                            <td>{p.pos}</td>
                            <td>{p.mins}</td>
                            <td>{p.rebounds}</td>
                            <td>{p.assist}</td>
                            <td>{p.scores}</td>
                           
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="nba-player-stats">
            {renderTable(homePlayers, "홈팀 선수 기록")}
            {renderTable(awayPlayers, "원정팀 선수 기록")}
        </div>
    );
};

export default NbaPlayerStats;
