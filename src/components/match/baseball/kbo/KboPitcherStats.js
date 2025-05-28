import React from "react";
import "./KboPitcherStats.css";

const KboPitcherStats = ({ pitchers = [] }) => {
  if (!Array.isArray(pitchers) || pitchers.length === 0) {
    return <div className="no-data">투수 기록이 없습니다.</div>;
  }

  return (
    <table className="kbo-pitcher-stats-table">
      <thead>
        <tr>
          <th>선수</th>
          <th>소속</th>
          <th>투구 이닝</th>
          <th>피안타</th>
          <th>실책</th>
          <th>삼진</th>
          <th>볼넷</th>
          <th>홈/원정</th>
        </tr>
      </thead>
      <tbody>
        {pitchers.map((p, index) => (
          <tr key={index} className={p.ha === "h" ? "home" : "away"}>
            <td>{p.name}</td>
            <td>{p.teamName}</td>
            <td>{p.ip}</td>
            <td>{p.hitted}</td>
            <td>{p.error}</td>
            <td>{p.so}</td>
            <td>{p.fourball}</td>
            <td>{p.ha === "h" ? "홈" : "원정"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default KboPitcherStats;
