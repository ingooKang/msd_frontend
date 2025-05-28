import React from "react";
import "./KovoPlayerStats.css";

const KovoPlayerStats = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="no-data">선수 기록이 없습니다.</div>;
  }

  return (
    <table className="kovo-player-stats">
      <thead>
        <tr>
          <th>선수명</th>
          <th>팀명</th>
          <th>포지션</th>
          <th>1세트</th>
          <th>2세트</th>
          <th>3세트</th>
          <th>4세트</th>
          <th>5세트</th>
          <th>득점</th>
          <th>시도</th>
          <th>성공</th>
          <th>블로킹</th>
          <th>범실</th>
          <th>성공률 (%)</th>
          <th>점유율 (%)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((player, idx) => (
          <tr key={idx} className={player.ha === 'h' ? 'home' : 'away'}>
            <td>{player.name}</td>
            <td>{player.teamName}</td>
            <td>{player.pos}</td>
            <td>{player.set1}</td>
            <td>{player.set2}</td>
            <td>{player.set3}</td>
            <td>{player.set4}</td>
            <td>{player.set5}</td>
            <td>{player.score}</td>
            <td>{player.attempt}</td>
            <td>{player.success}</td>
            <td>{player.block}</td>
            <td>{player.error}</td>
            <td>{player.success_rate}</td>
            <td>{player.share_rate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default KovoPlayerStats;
