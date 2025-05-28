import React, { useEffect, useState } from "react";
import KboScoreTable from "./KboScoreTable";
import KboHitterStats from "./KboHitterStats";
import KboPitcherStats from "./KboPitcherStats";
import CONFIG from "config";

const KboDetailPanel = ({ gameId }) => {
  const [inningData, setInningData] = useState([]);
  const [hitterStats, setHitterStats] = useState([]);
  const [pitcherStats, setPitcherStats] = useState([]);

  useEffect(() => {
    debugger;
    fetch(`${CONFIG.API_BASE}/api/toto/baseball/kbo/detail?gameId=${gameId}`)
      .then((res) => res.json())
      .then((data) => {
        setInningData(data.innings);
        setHitterStats(data.hitters);
        setPitcherStats(data.pitchers);
      });
  }, [gameId]);

  return (
    <div className="kbo-detail-panel">
      <KboScoreTable data={inningData} />
      <KboHitterStats data={hitterStats} />
      <KboPitcherStats data={pitcherStats} />
    </div>
  );
};

export default KboDetailPanel;
