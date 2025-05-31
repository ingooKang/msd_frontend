import React, { useEffect, useState } from "react";
import CONFIG from "config";
import TeamContextChart from "./TeamContextChart";

function AnalysisPanel({ game }) {

  const { lname, htname, atname, matchday } = game;
  const [rnkData, setRnkData] = useState([]);

  useEffect(() => {
    fetch(`${CONFIG.API_BASE}/api/toto/analysis/team-rank-history?lname=${lname}&htname=${htname}&atname=${atname}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 순위 히스토리:", data);
        setRnkData(data);
      })
      .catch((err) => {
        console.error("순위 데이터 로드 실패", err);
        setRnkData([]);
      });
  }, [lname, htname, atname, matchday]);

  return (
    <div style={{
      background: "#f8f9fa",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      {/* ✅ [추가] 설명 박스 - 그래프 해석 가이드 */}
      <div style={{
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "15px",
        marginBottom: "20px",
        fontSize: "0.95rem",
        lineHeight: "1.6"
      }}>
        <h4 style={{ marginBottom: "10px" }}>📘 그래프 해석 가이드</h4>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li><strong>home/away:</strong> 홈/원정 기준</li>
          <li><strong>topdog/underdog:</strong> 경기 전 상대 대비 순위가 높은/낮은 팀</li>
          <li><strong>Win / Draw / Lose:</strong> 해당 조건에서의 경기 결과 누적</li>
          <li>예: <code>home_underdog - Win = 5</code> → 홈팀이 언더독일 때 5승</li>
          <li>※ 추후 차트 클릭 시 해당 경기 목록도 확인 가능하게 확장 예정입니다.</li>
        </ul>
      </div>

      <h3 style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px", marginBottom: "16px" }}>
        📊 {lname} 리그 순위 추이: <strong>{htname}</strong> vs <strong>{atname}</strong>
      </h3>

      <div style={{ display: "flex", gap: "40px" }}>
        <div style={{ flex: 1 }}>
          <h4>🏠 홈팀: {htname}</h4>
          <TeamContextChart
            teamName={htname} leagueName={lname} rnkData={rnkData}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h4>🚗 원정팀: {atname}</h4>
          <TeamContextChart teamName={atname} leagueName={lname} rnkData={rnkData} />
        </div>
      </div>
    </div>
  );
}

export default AnalysisPanel;
