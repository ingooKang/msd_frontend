import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import LeftNav from "./components/LeftNav";
import Main from "./components/Main";
import Footer from "./components/Footer";
import CONFIG from "./config";

function App() {
  const [totoData, setTotoData] = useState({
    ongoing: [],
    result: [],
    schedule: [],
  });
  const [currentRound, setCurrentRound] = useState(null);
  const [roundList, setRoundList] = useState([]);
  const [leftNavInfo, setLeftNavInfo] = useState({ buyableGames: [], leagues: [] });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // ✅ 1. current-round
        const res = await fetch(`${CONFIG.API_BASE}/api/toto/current-round`);
        const current = await res.json();
        setCurrentRound(current);

        // ✅ 2. rounds 리스트
        const roundsRes = await fetch(`${CONFIG.API_BASE}/api/toto/rounds?year=${current.year}`);
        const rounds = await roundsRes.json();
        setRoundList(rounds);

        // ✅ 3. left-nav-info
        const navRes = await fetch(`${CONFIG.API_BASE}/api/toto/left-nav-info`);
        const navData = await navRes.json();
        setLeftNavInfo(navData);
      } catch (err) {
        console.error("초기 데이터 로딩 실패", err);
      }
    };

    fetchAll();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <LeftNav
          ongoing={totoData.ongoing}
          navInfo={leftNavInfo}
        />
        <Main
          result={totoData.result}
          schedule={totoData.schedule}
          currentRound={currentRound}
          roundList={roundList}
        />
      </div>
      <Footer />
    </div>
  );
}
export default App;
