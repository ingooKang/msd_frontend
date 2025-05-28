import React, {useEffect, useState} from "react";
import TeamTrendChart from "./TeamTrendChart";
import {fetchLeagueRankHistory} from "../../apianalysys";

function LeagueTrendPanel({leagueId}){
    const[rankData, setRankData] = useState([]);

    useEffect(()=>{
        fetchLeagueRankHistory(leagueId).then(setRankData);
    },[leagueId]);
    return (
        <div>
            <h2>📈 {leagueId} 리그 순위 추이</h2>
            <TeamTrendChart data={rankData}/>
        </div>
    )
}

export default LeagueTrendPamel;