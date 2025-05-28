import React from "react";
import LeagueTrendPanel from "../components/analysis/LeagueTrendPanel";

function AnalysisPage(){
    return (
        <div style={{padding: "20px"}}>
            <h1>📊 분석 대시보드</h1>
            <LeagueTrendPanel leagueId="KBO" />
        </div>
    );

}
export default AnalysisPage;