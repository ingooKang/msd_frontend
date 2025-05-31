// Main.js
import React, { useState, useEffect } from "react";
import FilterBar from "./FilterBar";
import DataTable from "./DataTable";
import AnalysisPanel from "./analysis/AnalysisPanel";

import CONFIG from "config";
import "../styles/Loader.css";


function Main() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(String(currentYear));
  const [round, setRound] = useState("");
  const [roundList, setRoundList] = useState([]);
  const [data, setData] = useState([]);
  const [roundInfo, setRoundInfo] = useState("");
  // 🔴 추가
  const [roundLoaded, setRoundLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const handleGameAnalysis = (row) => {
    setSelectedGame(row);
  };

  const handleLogin = () => {
    fetch(`${CONFIG.API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId, password }),
    }).then((res) => {
      if (!res.ok) throw new Error("로그인 실패");
      return res.json();
    })
      .then((data) => {
        console.log("✅ 로그인 성공:", data);
        alert(`환영합니다, ${loginId}님!`);
      })
      .catch((err) => {
        alert("❌ 로그인 실패: " + err.message);
      });
  };

  useEffect(() => {
  const fetchInitialData = async () => {
    try {
      // 1. 현재 회차 가져오기
      const res = await fetch(`${CONFIG.API_BASE}/api/toto/current-round`);
      const { year: currentYear, round: currentRound } = await res.json();

      if (!currentYear || !currentRound) return;

      setYear(currentYear);
      setLoading(true); // 로딩 시작

      // 2. 연도에 해당하는 전체 회차 리스트 가져오기
      const roundsRes = await fetch(`${CONFIG.API_BASE}/api/toto/rounds?year=${currentYear}`);
      const roundsList = await roundsRes.json();
      setRoundList(roundsList);

      // 3. 현재 회차 설정
      setRound(currentRound);
    } catch (err) {
      console.error("🚨 초기 데이터 로딩 실패:", err);
    }
  };

  fetchInitialData();
}, []);


  // 연도, 회차 → 경기 데이터 로드
  useEffect(() => {
    if (year && round) {
      setLoading(true); // 🔴 로딩 시작

      fetch(`${CONFIG.API_BASE}/api/toto/search?year=${year}&round=${round}`)
        .then((res) => res.json())
        .then((result) => {
          console.log("경기 데이터 확인:", result);
          if (Array.isArray(result)) {
            setData(result);

            // 예시용 요약 정보 설정
            const matchCount = result.length;
            const startDate = result[0]?.matchday ?? "시작일 미정";
            const endDate = result[result.length - 1]?.matchday ?? "종료일 미정";
            setRoundInfo(`${startDate} ~ ${endDate} / 총 ${matchCount}경기`);

          } else {
            setData([]);
            setRoundInfo("");
          }
          setLoading(false); // ✅ 로딩 종료
        })
        .catch((err) => {
          console.error("데이터 로딩 실패", err);
          setData([]);
          setRoundInfo("");
          setLoading(false); // ✅ 에러 시에도 로딩 종료
        });
    }
  }, [year, round]);

  useEffect(() => {
    if (selectedGame) {
      const el = document.getElementById("analysis-section");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedGame])

  return (

    <main style={{ flex: 1, padding: "10px" }}>
      {/* ✅ 로그인 박스 상단 우측 */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "12px" }}>
        <input
          placeholder="ID"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          style={{ padding: "4px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "4px" }}
        />
        <button onClick={handleLogin} style={{ padding: "4px 12px" }}>
          Login
        </button>
      </div>

      <div style={{ marginBottom: "12px" }}>

      </div>
      <FilterBar
        year={year}
        setYear={setYear}
        round={round}
        setRound={setRound}
        roundList={roundList}
        roundInfo={roundInfo}
      />
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div className="loader"></div>
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      ) : (
        <DataTable data={data} onGameAnalysis={handleGameAnalysis} />
      )}
      {
        selectedGame && (
          <div id="analysis-section" style={{ marginTop: "24px", padding: "16px", borderTop: "2px solid #ccc" }}>
            <AnalysisPanel game={selectedGame} />
          </div>

        )
      }
    </main>
  );
}

export default Main;
