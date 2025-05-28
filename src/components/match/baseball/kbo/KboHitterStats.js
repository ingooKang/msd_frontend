import React from "react";
import "./KboHitterStats.css";

const KboHitterStats = ({ hitters = [] }) => {
  if (!Array.isArray(hitters) || hitters.length === 0) {
    return <div className="no-data">타자 기록이 없습니다.</div>;
  }

  return (
    <table className="kbo-hitter-stats-table">
      <thead>
        <tr>
          <th>선수</th>
          <th>소속</th>
          <th>포지션</th>
          <th>타수</th>
          <th>득점</th>
          <th>안타</th>
          <th>볼넷</th>
          <th>타점</th>
          <th>홈런</th>
          <th>홈/원정</th>
        </tr>
      </thead>
      <tbody>
        {hitters.map((h, index) => (
          <tr key={index} className={h.ha === "h" ? "home" : "away"}>
            <td>{h.name}</td>
            <td>{h.teamName}</td>
            <td>{h.pos}</td>
            <td>{h.ab}</td>
            <td>{h.r}</td>
            <td>{h.h}</td>
            <td>{h.bb}</td>
            <td>{h.rbi}</td>
            <td>{h.hr}</td>
            <td>{h.ha === "h" ? "홈" : "원정"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default KboHitterStats;
