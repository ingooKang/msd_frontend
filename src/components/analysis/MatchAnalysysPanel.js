const { default: TeamTrendChart } = require("./TeamTrendChart");

function MatchAnalysysPanel({gameId}){
    useEffect(()=>{
        fetch(`/api/analysys/game-detail?gameId=${gameId}`)
        .then(res=>res.json())
        .then(data=>{
            setHomeTrend(data.homeTrend);
            setAwayTrend(data.awayTrend);
            setRecentStats(data.stats);
        });
    },[gameId]);
    return (
        <>
            <h3>경기 분석</h3>
            <TeamTrendChart data={homeTrend}/>
            <TeamTrendChart data={awayTrend}/>
            <SummaryStatsTable stats={recentStats}/>
        </>
    )
}
