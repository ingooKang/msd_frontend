import React from "react";
import "./MlbHitterStats.css"

const MlbHitterStats = ({ hitters = [] }) => {
    if (!Array.isArray(hitters) || hitters.length === 0) {
        return <div className="no-data">타자 기록이 없습니다.</div>;
    }
    return (
        <table className="hitter-stats-table">
            <thead>
                <tr>
                    <th>선수</th>
                    <th>소속</th>
                    <th>포지션</th>
                    <th>타수</th>
                    <th>득점</th>
                    <th>안타</th>
                    <th>볼넷</th>
                    <th>타점</th>
                    <th>홈런</th>
                    <th>홈/원정</th>
                </tr>
            </thead>
            <tbody>
                {hitters.map((hitter, index) => {
                    const rowClass = hitter.ha === "h" ? "hitter-row-home" : "hitter-row-away";
                    return (
                        <tr key={index} className={rowClass}>
                            <td>{hitter.name}</td>
                            <td>{hitter.team}</td>
                            <td>{hitter.pos}</td>
                            <td>{hitter.ab}</td>
                            <td>{hitter.r}</td>
                            <td>{hitter.h}</td>
                            <td>{hitter.bb}</td>
                            <td>{hitter.rbi}</td>
                            <td>{hitter.hr}</td>
                            <td>{hitter.ha}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
export default MlbHitterStats;