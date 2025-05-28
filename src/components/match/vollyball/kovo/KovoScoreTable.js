import React from "react";
import "./KovoScoreTable.css";

const KovoScoreTable = ({ data }) => {
  const home = data.find(team => team.ha === 'h');
  const away = data.find(team => team.ha === 'a');

  if (!home || !away) {
    return <div className="no-data">팀 점수 데이터가 없습니다.</div>;
  }

  const renderRow = (team, label) => (
    <tr className={team.ha === 'h' ? 'home' : 'away'}>
      <td>{label}</td>
      <td>{team.set1 ?? "-"}</td>
      <td>{team.set2 ?? "-"}</td>
      <td>{team.set3 ?? "-"}</td>
      <td>{team.set4 ?? "-"}</td>
      <td>{team.set5 ?? "-"}</td>
      <td>{team.total}</td>
    </tr>
  );

  return (
    <table className="kovo-score-table">
      <thead>
        <tr>
          <th>팀</th>
          <th>1세트</th>
          <th>2세트</th>
          <th>3세트</th>
          <th>4세트</th>
          <th>5세트</th>
          <th>합계</th>
        </tr>
      </thead>
      <tbody>
        {renderRow(home, home.teamName)}
        {renderRow(away, away.teamName)}
      </tbody>
    </table>
  );
};

export default KovoScoreTable;
