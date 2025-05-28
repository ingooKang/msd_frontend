import React, { useEffect, useState } from "react";
import KovoScoreTable from "./KovoScoreTable.js";
import KovoPlayerStats from "./KovoPlayerStats";
import "./KovoDetailPanel.css";
import CONFIG from "config.js";

const KovoDetailPanel = ({ gameId }) => {
  const [matchInfo, setMatchInfo] = useState(null);
  const [scores, setScores] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch(`${CONFIG.API_BASE}/api/toto/vollyball/kovo/detail?gameId=${gameId}`)
      .then(res => res.json())
      .then(data => {
        setMatchInfo(data.matchInfo);
        setScores(data.scores);
        setPlayers(data.players);
      });
  }, [gameId]);

  if (!matchInfo) return <div>로딩 중...</div>;

  return (
    <div className="kovo-detail-panel">
      <h3>{matchInfo.matchday} - {matchInfo.gameHtname} vs {matchInfo.gameAtname}</h3>
      <p>{matchInfo.matchplace}</p>

      <KovoScoreTable data={scores} />
      <KovoPlayerStats data={players} />
    </div>
  );
};

export default KovoDetailPanel;
