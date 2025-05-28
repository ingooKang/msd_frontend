import React from "react";
import './SoccerTeamStats.css';

const SoccerTeamStats = ({ data }) => {
    if (!data || !data.home || !data.away) return <p>팀 기록을 불러오는 중...</p>
    const rows = [
        { label: "슈팅", key: "shooting" },
        { label: "유효 슈팅", key: "effective_shooting" },
        { label: "점유율", key: "possession", suffix: "%" },
        { label: "패스 횟수", key: "pass_cnt" },
        { label: "패스 성공률", key: "pass_succ_rate", suffix: "%" },
        { label: "파울", key: "paul_cnt" },
        { label: "옐로우 카드", key: "yellow_card" },
        { label: "레드 카드", key: "red_card" },
        { label: "오프사이드", key: "off_side" },
        { label: "코너킥", key: "cornor_kick" }
    ];
    return (
        <div className="soccer-team-stats">
            <table>
                <thead>
                    <th>{data.home.teamName}</th>
                    <th>{data.away.teamName}</th>
                </thead>
                <tbody>
                    {rows.map((row, idx)=>(
                        <tr key={idx}>
                            <td>{data.home[row.key] ?? "-"}{row.suffix || ""}</td>
                            <td>{data.away[row.key]?? "-"}{row.suffix || ""}</td>
                        </tr>
                    ))}
                    
                </tbody>
            </table>

        </div>
    );
};
export default SoccerTeamStats;