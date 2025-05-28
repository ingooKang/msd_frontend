import React from "react";
import "./MlbScoreTable.css";

const MlbScoreTable = ({ htname, atname, hscore, ascore }) => {
    const safeH = Array.isArray(hscore) ? hscore: [];
    const safeA = Array.isArray(ascore) ? ascore: [];
    const maxInnings = Math.max(safeH.length, safeA.length);
    return (
        <table className="score-table">
            <thead>
                <tr>
                    <th>팀</th>
                    {[...Array(maxInnings)].map((_, i) => <th key={i}>{i + 1} 회</th>)}
                    <th>합계</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{atname}</td>
                    {ascore.map((v, i) => <td key={i}>{v ?? "-"}</td>)}
                    {[...Array(maxInnings - ascore.length)].map((_, i) => <td key={`ap-${i}`}>-</td>)}
                    <td>{ascore.reduce((sum, v) => sum + (v ?? 0), 0)}</td>
                </tr>
                 <tr>
                    <td>{htname}</td>
                    {hscore.map((v, i) => <td key={i}>{v ?? "-"}</td>)}
                    {[...Array(maxInnings - hscore.length)].map((_, i) => <td key={`ap-${i}`}>-</td>)}
                    <td>{hscore.reduce((sum, v) => sum + (v ?? 0), 0)}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default MlbScoreTable;