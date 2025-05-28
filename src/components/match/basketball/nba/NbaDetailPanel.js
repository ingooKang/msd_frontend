import React, { useEffect, useState } from 'react';
import NbaMatchHeader from './NbaMatchHeader';
import NbaTeamStats from './NbaTeamStats';
import NbaPlayerStats from './NbaPlayerStats';
import NbaScoreTable from './NbaScoreTable';

import CONFIG from 'config';

const NbaDetailPanel = ({ gameId }) => {
    const [matchInfo, setMatchInfo] = useState(null);
    const [teamStats, setTeamStats] = useState(null);
    const [playerStats, setPlayerStats] = useState(null);
    const [scoreTable, setScoreTable]=useState(null);
    useEffect(() => {
        fetch(`${CONFIG.API_BASE}/api/toto/basketball/nba/detail?gameId=${gameId}`)
            .then(res => res.json())
            .then(data => {
                setMatchInfo(data.matchInfo);
                setTeamStats(data.teamStats);
                setPlayerStats(data.playerStats);
                setScoreTable(data.scoreTable);
            })
            .catch(err => {
                console.error("NBA 데이터 로드 실패:", err);
            });
    }, [gameId]);

     if (!matchInfo) return <div>🏀 NBA 경기 정보를 불러오는 중...</div>;
     return (
        <div className="nba-detail-panel">
            <NbaMatchHeader data={matchInfo}/>
            <NbaScoreTable data={scoreTable}/>
            <NbaTeamStats data={teamStats} />
            <NbaPlayerStats data={playerStats} />
        </div>
    );

}
export default NbaDetailPanel;