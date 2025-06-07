import React, { useState, useMemo } from "react";


function LeftNav() {
  const [buyableGames, setBuyableGames] = useState([]);
  const [rawLeagues, setRawLeagues] = useState([]);

  const [openSportTypes, setOpenSportTypes] = useState([]);
  const [openGameTypes, setOpenGameTypes] = useState([]);
  const [openLeagues, setOpenLeagues] = useState([]);

  

  // 게임 목록: sporttype → gametype → gameList
  const groupedBySport = useMemo(() => {
    const map = {};
    buyableGames.forEach((game) => {
      if (!map[game.sporttype]) map[game.sporttype] = [];
      map[game.sporttype].push(game);
    });
    return map;
  }, [buyableGames]);

  // 리그 정보: league → team Set
  const groupedLeagues = useMemo(() => {
    const map = {};
    rawLeagues.forEach(({ lname, teamName }) => {
      if (!map[lname]) map[lname] = new Set();
      map[lname].add(teamName);
    });
    return map;
  }, [rawLeagues]);

  return (
    <nav
      style={{
        width: "240px",
        padding: "12px",
        background: "#f7f7f7",
        borderRight: "1px solid #ddd",
        fontSize: "14px",
        overflowY: "auto",
        height: "100vh",
      }}
    >
      <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>🎮 발매중 게임</h3>

      {Object.entries(groupedBySport).map(([sport, games]) => {
        const isSportOpen = openSportTypes.includes(sport);
        const groupedByGameType = games.reduce((acc, g) => {
          if (!acc[g.gametype]) acc[g.gametype] = [];
          acc[g.gametype].push(g);
          return acc;
        }, {});

        return (
          <div key={sport} style={{ marginBottom: "8px" }}>
            <div
              onClick={() =>
                setOpenSportTypes((prev) =>
                  prev.includes(sport)
                    ? prev.filter((s) => s !== sport)
                    : [...prev, sport]
                )
              }
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                padding: "6px",
                borderRadius: "4px",
                backgroundColor: "#0073c6",
                color: "#fff",
              }}
            >
              {isSportOpen ? "▼" : "▶"} {sport}
            </div>

            {isSportOpen &&
              Object.entries(groupedByGameType).map(([gametype, gameList]) => {
                const key = `${sport}_${gametype}`;
                const isGameTypeOpen = openGameTypes.includes(key);

                return (
                  <div key={key} style={{ marginLeft: "16px", marginTop: "4px" }}>
                    <div
                      onClick={() =>
                        setOpenGameTypes((prev) =>
                          prev.includes(key)
                            ? prev.filter((k) => k !== key)
                            : [...prev, key]
                        )
                      }
                      style={{
                        cursor: "pointer",
                        color: "#0073c6",
                        fontWeight: "500",
                      }}
                    >
                      {isGameTypeOpen ? "▾" : "▸"} {gametype}
                    </div>

                    {isGameTypeOpen &&
                      gameList.map((game) => (
                        <div
                          key={game.id}
                          style={{
                            marginLeft: "16px",
                            fontSize: "13px",
                            padding: "2px 0",
                          }}
                        >
                          • {game.sporttype} {game.gametype} {game.sec}회차
                        </div>
                      ))}
                  </div>
                );
              })}
          </div>
        );
      })}

      <h3 style={{ fontSize: "16px", marginTop: "24px" }}>📊 리그 정보</h3>

      {Object.entries(groupedLeagues).map(([league, teamSet]) => {
        const isOpen = openLeagues.includes(league);
        const teams = Array.from(teamSet);

        return (
          <div key={league} style={{ marginBottom: "8px" }}>
            <div
              onClick={() =>
                setOpenLeagues((prev) =>
                  prev.includes(league)
                    ? prev.filter((l) => l !== league)
                    : [...prev, league]
                )
              }
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                padding: "6px",
                borderRadius: "4px",
                backgroundColor: "#666",
                color: "#fff",
              }}
            >
              {isOpen ? "▼" : "▶"} {league}
            </div>

            {isOpen &&
              teams.map((team) => (
                <div
                  key={team}
                  style={{
                    marginLeft: "16px",
                    fontSize: "13px",
                    padding: "2px 0",
                  }}
                >
                  • {team}
                </div>
              ))}
          </div>
        );
      })}
    </nav>
  );
}

export default LeftNav;
