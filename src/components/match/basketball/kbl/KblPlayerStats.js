import React from "react";
import "./KblPlayerStats.css";

const KblPlayerStats = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="no-data">선수 기록이 없습니다.</div>;
  }

  return (
    <table className="kbl-player-stats">
      <thead>
        <tr>
          <th title="선수명">선수명</th>
          <th title="팀">팀</th>
          <th title="출전시간">시간</th>

          <th title="득점">pts</th>
          <th title="2점슛 성공">pm2</th>
          <th title="2점슛 시도"> pa2</th>
          
          <th title="2점슛 성공률">p2pct</th>

          <th title="3점슛 성공">pm3</th>
          <th title="3점슛 시도">pa3</th>
          <th title="3점슛 성공률">p3pct</th>
          
          <th title="자유투 성공">fgm</th>
          <th title="자유투 시도">fga</th>
          <th title="야투 성공률"> fgpct</th>

          <th title="자유투 성공">ftm</th>
          <th title="자유투시도"> fta</th>
          <th title="자유투성공률(%)">ftpct</th>
          
          <th title="공격리바운드">oreb</th>
          <th title="수비리바운드">dreb</th>
          <th title="총리바운드">reb</th>

        
          <td title="어시스트">ast</td>
          <td title="스틸">stl</td>
          <td title="블록">blk</td>
          <th title="득실차">gd</th>
          <th title="">dk</th>
          <th title="덩크시도수">dka</th>
          <th title="턴오버">to</th>
          <th title="">pf</th>
          <th title="">pp</th>
          <th title="">ppa</th>
          <th title="">pppct</th>

        </tr>
      </thead>
      <tbody>
        {data.map((player, idx) => (
          <tr key={idx} className={player.ha === 'h' ? 'home' : 'away'}>
            <td>{player.name}</td>
            <td>{player.teamName}</td>
            <td>{player.min}분</td>
            <td>{player.pts}</td>
            <td>{player.pm2}</td>
            <td>{player.pa2}</td>
            <td>{player.p2pct}</td>
            <td>{player.pm3}</td>
            <td>{player.pa3}</td>
            <td>{player.p3pct}</td>
            <td>{player.fgm}</td>
            <td>{player.fga}</td>
            <td>{player.fgpct}</td>
            <td>{player.ftm}</td>
            <td>{player.fta}</td>
            <td>{player.ftpct}</td>
            <td>{player.oreb}</td>
            <td>{player.dreb}</td>
            <td>{player.reb}</td>
            <td>{player.ast}</td>
            <td>{player.stl}</td>
            <td>{player.blk}</td>
            <td>{player.gd}</td>
            <td>{player.dk}</td>
            <td>{player.dka}</td>
            <td>{player.to}</td>
            <td>{player.pf}</td>
            <td>{player.pp}</td>
            <td>{player.ppa}</td>
            <td>{player.pppct}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default KblPlayerStats;
