import { useEffect, useState } from "react";
import KblScoreTable from "./KblScoreTable";
import KblPlayerStats from "./KblPlayerStats";

import CONFIG from 'config';

const KblDetailPanel = ({ gameId }) => {
  const [scoreData, setScoreData] = useState(null);
  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    fetch(`${CONFIG.API_BASE}/api/toto/basketball/kbl/detail?gameId=${gameId}`)
      .then((res) => res.json())
      .then((data) => {
        setScoreData(data.scores);
        setPlayerStats(data.players);
      });
  }, [gameId]);

  return (
    <div>
      {scoreData && <KblScoreTable data={scoreData} />}
      <KblPlayerStats data={playerStats} />
    </div>
  );
};

export default KblDetailPanel;
