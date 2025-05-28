import React from "react";
import "./KblScoreTable.css";

const KblScoreTable = ({ data }) => {
  const home = data.find(d => d.ha === 'h');
  const away = data.find(d => d.ha === 'a');

  if (!home || !away) return <div className="no-data">홈/원정 팀 데이터가 부족합니다.</div>;

  return (
    <table className="kbl-score-table">
      <thead>
        <tr>
          <th>팀명</th>
          <th>1Q</th>
          <th>2Q</th>
          <th>3Q</th>
          <th>4Q</th>
          <th>합계</th>
        </tr>
      </thead>
      <tbody>
        <tr className="home">
          <td>{home.teamName}</td>
          <td>{home.q1}</td>
          <td>{home.q2}</td>
          <td>{home.q3}</td>
          <td>{home.q4}</td>
          <td>{home.eq}</td>
        </tr>
        <tr className="away">
          <td>{away.teamName}</td>
          <td>{away.q1}</td>
          <td>{away.q2}</td>
          <td>{away.q3}</td>
          <td>{away.q4}</td>
          <td>{away.eq}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default KblScoreTable;
