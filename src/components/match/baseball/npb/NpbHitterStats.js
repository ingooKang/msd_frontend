import React from 'react';
import './NpbHitterStats.css';

const NpbHitterStats = ({ data }) => {
  if (!data || data.length === 0) return <p>타자 기록이 없습니다.</p>;

  return (
    <table className="npb-hitter-stats">
      <thead>
        <tr>
          <th>팀</th>
          <th>선수</th>
          <th>포지션</th>
          <th>이닝</th>
          <th>안아</th>
          <th>타점</th>
          <th>포볼</th>
          <th>데드볼</th>
          <th>스트럭아웃</th>
          <th>홈/원정</th>
        </tr>
      </thead>
      <tbody>
        {data.map((player, idx) => (
          <tr key={idx} className={player.ha === 'h' ? 'home' : 'away'}>
            <td>{player.teamName}</td>
            <td>{player.name}</td>
            <td>{player.pos}</td>
            <td>{player.ab}</td>
            <td>{player.h}</td>
            <td>{player.rbi}</td>
            <td>{player.bb}</td>
            <td>{player.hp}</td>
            <td>{player.so}</td>
            <td>{player.ha}</td>
            <td>{player.ha === 'h' ? '홈' : '원정'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NpbHitterStats;
