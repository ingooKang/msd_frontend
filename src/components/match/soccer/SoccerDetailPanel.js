
import React, { useEffect, useState } from 'react';
import SoccerMatchHeader from './SoccerMatchHeader';
import SoccerTeamStats from './SoccerTeamStats';
import SoccerPlayerStats from './SoccerPlayerStats';
import CONFIG from 'config';


const SoccerDetailPanel = ({ gameId }) => {
    const [matchInfo, setMatchInfo] = useState(null);
    const [teamStats, setTeamStats] = useState(null);
    const [playerStats, setPlayerStats] = useState([]);
    useEffect(() => {
        
        fetch(`${CONFIG.API_BASE}/api/toto/soccer/detail?gameId=${gameId}`)
            .then(res => res.json())
            .then(data => {
                setMatchInfo(data.matchInfo);
                setTeamStats(data.teamStats);
                setPlayerStats(data.playerStats);
            })
            .catch(error => {
                console.error("경기정보 불러오기 실패:", error);
                setMatchInfo(null);
            });
    }, [gameId]);

    if (!matchInfo) return <div>⚽ 경기 정보를 불러오는 중...</div>

    return (

        <div className="soccer-detail-panel">
            <SoccerMatchHeader data={matchInfo} />
            <SoccerTeamStats data={teamStats} />
            <SoccerPlayerStats data={playerStats} />
        </div>
    );
};
export default SoccerDetailPanel;