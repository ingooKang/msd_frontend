import React from "react";
import "./KboScoreTable.css";

const KboScoreTable = ({data=[]}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="no-data">이닝 정보가 없습니다.</div>;
  }

  // 이닝 최대 갯수 계산
  const maxInnings = Math.max(
    ...data.map(team => (team.scores ? team.scores.split(",").length : 0))
  );

  return (
    <table className="kbo-score-table">
      <thead>
        <tr>
          <th>팀명</th>
          {[...Array(maxInnings)].map((_, i) => (
            <th key={i}>{i + 1}회</th>
          ))}
          <th>합계</th>
        </tr>
      </thead>
      <tbody>
        {data.map((team, index) => {
          const scores = team.scores ? team.scores.split(",") : [];
          const isHome = team.ha === "h";

          return (
            <tr key={index} className={isHome ? "home" : "away"}>
              <td>{team.teamName}</td>
              {[...Array(maxInnings)].map((_, i) => (
                <td key={i}>{scores[i] ?? ""}</td>
              ))}
              <td>{team.sum}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default KboScoreTable;
