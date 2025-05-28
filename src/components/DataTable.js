import React, { useState } from "react";
import "../styles/TableStyle.css";
import CONFIG from "config";

import MlbDetailPanel from "./match/baseball/mlb/MlbDetailPanel";
import NpbDetailPanel from "./match/baseball/npb/NpbDetailPanel";
import KboDetailPanel from "./match/baseball/kbo/KboDetailPanel";
import SoccerDetailPanel from "./match/soccer/SoccerDetailPanel";
import NbaDetailPanel from "./match/basketball/nba/NbaDetailPanel";
import KblDetailPanel from "./match/basketball/kbl/KblDetailPanel";
import KovoDetailPanel from "./match/vollyball/kovo/KovoDetailPanel";

const normalize = (value) => {
    if (value == null) console.warn("normalize(): null 값 발생", value);
    return String(value || "").trim();
};

const getDetailComponent = (row) => {
    if (row.dtlResult !== 'Y') return null;

    const sporttype = row.sporttype?.trim();
    const lname = row.lname?.trim().toUpperCase();
    if (sporttype === '축구') {
        return <SoccerDetailPanel gameId={row.game_id} />
    } else if (sporttype === '농구') {
        if (lname === 'NBA') {
                return <NbaDetailPanel gameId={row.game_id} />;
            } else if (lname === 'KBL' || lname === 'WKBL') {
                return <KblDetailPanel gameId={row.game_id} />;   
        }
    }else if(sporttype==='배구'){
        if(lname==='KOVO남'||lname==='KOVO여'){
            return <KovoDetailPanel gameId={row.game_id}/>;
        }
    }

    switch (lname) {
        case "MLB":
            return <MlbDetailPanel gameId={row.game_id} />;
        case "NPB":
            return <NpbDetailPanel gameId={row.game_id} />;
        case "KBO":
            return <KboDetailPanel gameId={row.game_id} />;
        default:
            return null;
    }
};

// 스포츠 배지 색상
const getSportIconCode = (sporttype) => {
    console.log(sporttype);
    switch (sporttype) {
        case "축구": return "sc";
        case "야구": return "bs";
        case "농구": return "bk";
        case "배구": return "vl";
        default: return "default";
    }
};



const DataTable = ({ data, onGameAnalysis }) => {

    const [protoList, setProtoList] = useState([]);

    const handleMatchSelect = (e, matchKey, item) => {
        setProtoList((prev) => {
            const filtered = prev.filter(p => p.matchKey !== matchKey);
            if (e.target.checked) {
                return [...filtered, { matchKey, item }];
            } else {
                return filtered;
            }
        });
    };

    const [leagueFilter, setLeagueFilter] = useState("ALL");

    const LeagueList = Array.from(new Set(data.map(row => row.lname).filter(Boolean)));
    const filteredData = leagueFilter === "ALL" ? data : data.filter(row => row.lname === leagueFilter);

    const handleRemove = (item) => {
        setProtoList(prev => prev.filter(i => i.protono !== item.protono));
    }
    const [openRowId, setOpenRowId] = useState(null);
    const toggleRow = (id) => {
        setOpenRowId(prev => (prev === id ? null : id));
    }
    const grouped = new Map();

    // 경기 단위로 그룹핑
    data.forEach((row) => {
        const key = row.game_id;
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(row);
    });
    const getRankChangeIcon = (change) => {
        if (change > 0) return "🔽"; // 순위 하락
        if (change < 0) return "🔼"; // 순위 상승
        return "➖"; // 순위 유지
    }

    let lastGameId = null;
    let isOdd = false;
    return (
        <div>
            <div style={{ margin: "10px 0" }}>
                <label>리그 선택: </label>
                <select value={leagueFilter} onChange={(e) => setLeagueFilter(e.target.value)}>
                    <option value="ALL">전체</option>
                    {LeagueList.map((league, idx) => (
                        <option key={idx} value={league}>{league}</option>
                    ))}
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>선택</th>

                        <th>연도</th>
                        <th>회차</th>

                        <th>리그명</th>
                        <th>번호</th>
                        <th>게임유형</th>
                        <th>단통여부</th>
                        <th>단통내용</th>
                        <th>홈팀순위</th>
                        <th>홈팀 vs 원정팀</th>
                        <th>원정팀순위</th>
                        <th>핸디</th>
                        <th>승</th>
                        <th>무</th>
                        <th>패</th>
                        <th>경기일</th>
                        <th>경기장</th>
                        <th>결과</th>
                        <th>결과분석</th>
                        <th>경기분석</th>
                    </tr>
                </thead>


                <tbody>
                    {filteredData.map((row, index) => {
                        if (row.game_id !== lastGameId) {
                            isOdd = !isOdd;
                            lastGameId = row.game_id;
                        }

                        const rowStyle = {
                            backgroundColor: isOdd ? "#f9f9f9" : "#ffffff",
                        };

                        return (
                            <React.Fragment key={`${row.game_id}_${row.protono}`}>
                                <tr style={rowStyle}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={protoList.some(p => p.matchKey === row.game_id && p.item.protono === row.protono)}
                                            onChange={(e) => handleMatchSelect(e, row.game_id, row)}
                                        />
                                    </td>

                                    <td>{row.year}</td>
                                    <td>{row.sec}</td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <img
                                                src={`${CONFIG.ICON_PATH}/icn_${getSportIconCode(row.sporttype)}.png`}
                                                alt={row.sporttype}
                                                style={{ width: 20, height: 20 }}
                                            />
                                            <span>{row.lname}</span>
                                        </div>
                                    </td>
                                    <td>{row.protono}</td>
                                    <td>{row.type}</td>
                                    <td>{row.type_Bat}</td>
                                    <td>{row.type_Batname}</td>
                                    <td>
                                        <span title={row.home_toolTip}>
                                            {row.abbr} {row.home_rnk} {getRankChangeIcon(row.home_rnk_change)}
                                        </span>
                                    </td>
                                    <td>{row.htname} {row.hscore} - {row.ascore} {row.atname}</td>
                                    <td>
                                        <span title={row.away_toolTip}>
                                            {row.away_div} {row.away_rnk} {getRankChangeIcon(row.away_rnk_change)}
                                        </span>
                                    </td>
                                    <td>{row.handy || row.sum || row.underover || ""}</td>
                                    <td>{row.winbat}</td>
                                    <td>{row.tiebat}</td>
                                    <td>{row.losebat}</td>
                                    <td>{row.matchday}</td>
                                    <td>{row.matchplace}</td>
                                    <td>{row.result}</td>
                                    <td>
                                        <button
                                            onClick={() => toggleRow(row.protono)}
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                backgroundImage: "url('/assets/icons/status_220303.png')",
                                                backgroundPosition: openRowId === row.protono ? "-38px -544px" : "-2px -544px",
                                                backgroundRepeat: "no-repeat",
                                                backgroundColor: "transparent",
                                                border: "none",
                                                cursor: "pointer",
                                                filter: "brightness(1.5) contrast(1.2)",
                                            }}
                                            className={`strite-button ${openRowId === row.protono ? "minus" : "plus"}`}
                                            aria-label={openRowId === row.protono ? "결과 닫기" : "결과 보기"}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => onGameAnalysis(row)}>분석 보기</button>
                                    </td>
                                </tr>
                                {openRowId === row.protono && (
                                    <tr>
                                        <td colSpan={18}>
                                            {getDetailComponent(row)}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
            {protoList.length > 0 && (
                <div className="proto-preview">
                    <h3>선택된 프로토</h3>
                    <ul>
                        {protoList.map(item => (
                            <li key={item.protono}>
                                {item.htname} vs {item.atname} ({item.matchday})
                                <button onClick={() => handleRemove(item)}>선택 해제</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setProtoList([])}>전체 선택 해제</button>
                </div>
            )}
        </div>
    );

};


export default DataTable;
