// Main.js
import React, { useState, useEffect } from "react";
import FilterBar from "./FilterBar";
import DataTable from "./DataTable";
import AnalysisPanel from "./analysis/AnalysisPanel";
import CONFIG from "config";
import "../styles/Loader.css";

function Main({ currentRound, roundList }) {
  const [year, setYear] = useState("");
  const [round, setRound] = useState("");
  const [data, setData] = useState([]);
  const [roundInfo, setRoundInfo] = useState("");
  const [roundLoaded, setRoundLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    if (currentRound && !roundLoaded) {
      const { year: currentYear, round: currentRoundValue } = currentRound;
      setYear(currentYear);
      setRound(currentRoundValue);
      setRoundLoaded(true);
    }
  }, [currentRound, roundLoaded]);

  useEffect(() => {
    if (year && round) {
      setLoading(true);
      fetch(`${CONFIG.API_BASE}/api/toto/search?year=${year}&round=${round}`)
        .then((res) => res.json())
        .then((result) => {
          if (Array.isArray(result)) {
            setData(result);
            const matchCount = result.length;
            const startDate = result[0]?.matchday ?? "시작일 미정";
            const endDate = result[result.length - 1]?.matchday ?? "종료일 미정";
            setRoundInfo(`${startDate} ~ ${endDate} / 총 ${matchCount}경기`);
          } else {
            setData([]);
            setRoundInfo("");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("데이터 로딩 실패", err);
          setData([]);
          setRoundInfo("");
          setLoading(false);
        });
    }
  }, [year, round]);

  useEffect(() => {
    if (selectedGame) {
      const el = document.getElementById("analysis-section");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedGame]);

  const handleLogin = () => {
    fetch(`${CONFIG.API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("로그인 실패");
        return res.json();
      })
      .then((data) => {
        alert(`환영합니다, ${loginId}님!`);
      })
      .catch((err) => {
        alert("❌ 로그인 실패: " + err.message);
      });
  };

  const handleGameAnalysis = (row) => setSelectedGame(row);

  return (
    <main style={{ flex: 1, padding: "10px" }}>
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

      {selectedGame && (
        <div id="analysis-section" style={{ marginTop: "24px", padding: "16px", borderTop: "2px solid #ccc" }}>
          <AnalysisPanel game={selectedGame} />
        </div>
      )}
    </main>
  );
}

export default Main;
