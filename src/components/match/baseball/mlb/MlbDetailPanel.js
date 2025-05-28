import { useEffect, useState } from "react";
import MlbScoreTable from "./MlbScoreTable";
import MlbPitcherStats from "./MlbPitcherStats";
import MlbHitterStats from "./MlbHitterStats";

import CONFIG from "config";

const MlbDetailPanel = ({ gameId }) => {
    
    const [data, setData] = useState({
        innings: [],
        hitters: [],
        pitchers: [],
    });
    const [match, setMatch] = useState(null);

    useEffect(() => {
        
        fetch(`${CONFIG.API_BASE}/api/toto/baseball/mlb/detail?gameId=${gameId}`)
            .then(res => res.json())
            .then(data => {
                console.log("🔥 받아온 데이터:", data);
                const homeRow = data.innings.find(r => r.ha === 'h');
                const awayRow = data.innings.find(r => r.ha === 'a');
                const parseScores = (row) => {
                    const parts = row?.scores?.split(",") || [];
                    return {
                        name: parts[0] || '',
                        score: parts.slice(1).map(v => (v === 'x' ? null : Number(v)))
                    };
                };
                const home = parseScores(homeRow);
                const away = parseScores(awayRow);
                setMatch({
                    htname: home.name,
                    atname: away.name,
                    hscore: home.score,
                    ascore: away.score
                });
                setData({
                    innings: data.innings,
                    hitters: data.hitters,
                    pitchers: data.pitchers
                })
            });

    }, [gameId]);

    if (!match) return <div>📊 경기 데이터를 불러오는 중...</div>;

    return (
        <div>
            <h3>⚾ MLB 이닝별 점수표</h3>
            <MlbScoreTable
                htname={match.htname}
                atname={match.atname}
                hscore={match.hscore}
                ascore={match.ascore}
            />
              <h3>👤 타자 기록</h3>
              <MlbHitterStats hitters={data.hitters}/>

              <h3>🎯 투수 기록</h3>
            <MlbPitcherStats pitchers={data.pitchers} />
        </div>
        
    )
}

export default MlbDetailPanel;