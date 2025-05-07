// Main.js
import React, { useState, useEffect } from "react";
import FilterBar from "./FilterBar";
import DataTable from "./DataTable";
import CONFIG from "config";



function Main() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(String(currentYear));
  const [round, setRound] = useState("");
  const [roundList, setRoundList] = useState([]);
  const [data, setData] = useState([]);
  const [roundInfo, setRoundInfo] = useState("");

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState([]);

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

  // 최초 로딩 시 현재 회차 자동 세팅
  useEffect(() => {
    fetch(`${CONFIG.API_BASE}/api/toto/current-round`)
      .then((res) => res.json())
      .then((data) => {

        console.log("✅ 현재 회차:", data);
        if (data.year && data.round) {
          setYear(data.year);
          setRound(data.round);
        }
      })
      .catch((err) => console.error("현재 회차 불러오기 실패", err));
  }, []);
  // 연도 변경 → 회차 리스트 로드
  useEffect(() => {
    fetch(`${CONFIG.API_BASE}/api/toto/rounds?year=${year}`)
      .then((res) => res.json())
      .then((list) => {
        setRoundList(list);
        if (!round && list.length > 0) {
          setRound(list[0]);
        }

      })
      .catch((err) => console.error("회차 불러오기 오류: ", err));
  }, [year]);

  // 연도, 회차 → 경기 데이터 로드
  useEffect(() => {
    if (year && round) {
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
        })
        .catch((err) => {
          console.error("데이터 로딩 실패", err);
          setData([]);
          setRoundInfo("");
        });
    }
  }, [year, round]);

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

      <FilterBar
        year={year}
        setYear={setYear}
        round={round}
        setRound={setRound}
        roundList={roundList}
        roundInfo={roundInfo}
      />
      <DataTable data={data} />
    </main>
  );
}

export default Main;
