import React, { useEffect, useState } from "react";
import CONFIG from "config";
import TeamContextChart from "./TeamContextChart";

function AnalysisPanel({ game }) {
  const { lname, htname, atname, matchday, game_id, sportType } = game;
  const [homeContext, setHomeContext] = useState(null);
  const [awayContext, setAwayContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameCount, setGameCount] = useState(10);  // ✅ 꼭 추가!
  useEffect(() => {
    setLoading(true);
    fetch(
      `${CONFIG.API_BASE}/api/toto/analysis/dual-context?leagueName=${lname}&htname=${htname}&atname=${atname}&game_id=${game_id}&sportType=${sportType}&gameCount=${gameCount}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 Dual Team Context:", data); // 여기에 homeRecentGames, awayRecentGames가 포함됨

        // ✅ 변수 선언 필요
        const { homeTeamContext, awayTeamContext, homeRecentGames, awayRecentGames, headToHeadGames } = data;

        setHomeContext({
          ...homeTeamContext,
          recentGames: homeRecentGames,
          headToHeadGames,
        });

        setAwayContext({
          ...awayTeamContext,
          recentGames: awayRecentGames,
          headToHeadGames,
        });

        setLoading(false);
      })

      .catch((err) => {
        console.error("Dual context 데이터 로드 실패", err);
        setHomeContext(null);
        setAwayContext(null);
        setLoading(false);
      });
  }, [lname, htname, atname, matchday, game_id, sportType, gameCount]);

  if (loading) return <div>🔄 분석 데이터를 불러오는 중입니다...</div>;

  if (!homeContext || !awayContext)
    return <div>❌ 분석 데이터를 불러오지 못했습니다.</div>;

  return (
    <div
      style={{
        background: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* 📘 설명 박스 */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "15px",
          marginBottom: "20px",
          fontSize: "0.95rem",
          lineHeight: "1.6",
        }}
      >
        <h4 style={{ marginBottom: "10px" }}>📘 그래프 해석 가이드</h4>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li>
            <strong>home/away:</strong> 홈/원정 기준
          </li>
          <li>
            <strong>topdog/underdog:</strong> 경기 전 상대 대비 순위가 높은/낮은 팀
          </li>
          <li>
            <strong>Win / Draw / Lose:</strong> 해당 조건에서의 경기 결과 누적
          </li>
          <li>
            예: <code>home_underdog - Win = 5</code> → 홈팀이 언더독일 때 5승
          </li>
          <li>
            ※ 추후 차트 클릭 시 해당 경기 목록도 확인 가능하게 확장 예정입니다.
          </li>
        </ul>
      </div>

      <h3
        style={{
          borderBottom: "1px solid #ddd",
          paddingBottom: "8px",
          marginBottom: "16px",
        }}
      >
        📊 {lname} 리그 순위 추이: <strong>{htname}</strong> vs{" "}
        <strong>{atname}</strong>
      </h3>

      <div style={{ display: "flex", gap: "40px" }}>
        <div style={{ flex: 1 }}>
          <h4>🏠 홈팀: {htname}</h4>
          <TeamContextChart
            teamName={htname}
            rnkData={homeContext?.rankHistory}  // ✅ homeContext의 rankHistory 직접 전달
            contextStats={homeContext?.rankBasedContextStats}
            contextStatsByOdds={homeContext?.oddsBasedContextStats}
            oddsEvaluation={homeContext?.oddsEvaluation}
            recentStats={homeContext.recentStats}
            gameCount={gameCount}
            onChangeGameCount={setGameCount}
            headToHeadGames={homeContext?.headToHeadGames} // 또는 awayContext 기준
            recentGames={homeContext.recentGames}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h4>🚗 원정팀: {atname}</h4>
          <TeamContextChart
            teamName={atname}
            rnkData={awayContext?.rankHistory}  // ✅ awayContext의 rankHistory 직접 전달
            contextStats={awayContext?.rankBasedContextStats}
            contextStatsByOdds={awayContext?.oddsBasedContextStats}
            oddsEvaluation={awayContext.oddsEvaluation}
            recentStats={awayContext.recentStats}
            gameCount={gameCount}
            onChangeGameCount={setGameCount}
           
            recentGames={awayContext.recentGames}
          />
        </div>
      </div>
    </div>
  );
}

export default AnalysisPanel;
