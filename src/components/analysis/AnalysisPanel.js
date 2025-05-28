import React, { useEffect, useState } from "react";
import TeamTrendChart from "./TeamTrendChart";  // 🟦 순위 차트 컴포넌트 import 예정
import CONFIG from "config";
// 🟦 AnalysisPanel.js - 분석 패널 컴포넌트
function AnalysisPanel({ game }) {
    const {lname, htname, atname, matchday}=game;
    const [rankData, setRankData] = useState([]);
    useEffect(() => {
  fetch(`${CONFIG.API_BASE}/api/toto/analysis/team-rank-history?lname=${lname}&htname=${htname}&atname=${atname}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("📊 순위 히스토리:", data);
      setRankData(data);
    })
    .catch((err) => {
      console.error("순위 데이터 로드 실패", err);
      setRankData([]);
    });
}, [lname, htname, atname, matchday]);
    return (
        <div>
            <h3>📊 {lname} 리그 순위 추이</h3>
            {/* 🟨 차트 컴포넌트로 전달 */}
            <TeamTrendChart data={rankData} />
        </div>
    )
}
export default AnalysisPanel;