import React from "react";
import "../styles/TableStyle.css";
import CONFIG from "config";

const normalize = (str)=>str.trim().toLowerCase();
const getMatchKey = (row) =>
    `${normalize(row.htname)}_${normalize(row.atname)}_${normalize(row.matchplace)}_${normalize(row.matchday)}`;
const getTeamClass = (teamName, row) => {
    if (row.result === "승" && row.htscore > row.atscore && teamName === row.htname) return "team-win";
    if (row.result === "승" && row.atscore > row.htscore && teamName === row.atname) return "team-win";
    return "";
};
const getSportClass = (sporttype) => {
    switch (sporttype) {
        case "축구": return "sport-soccer";
        case "야구": return "sport-baseball";
        case "농구": return "sport-basketball";
        case "배구": return "sport-vollyball";
        default: return "sport-default";
    }
}
// 스포츠 배지 색상
const getSportIconCode = (sporttype) => {
    switch (sporttype) {
        case "축구": return "sc";
        case "야구": return "bs";
        case "농구": return "bk";
        case "배구": return "vl";
        default: return "default";
    }
};

// 경기 결과 뱃지 스타일
const getResultClass = (result) => {
    switch (result) {
        case "승": return "result-win";
        case "패": return "result-lose";
        case "무": return "result-draw";
        default: return "result-etc";
    }
};

const DataTable = ({ data }) => {
    const grouped = new Map();

    // 경기 단위로 그룹핑
    data.forEach((row) => {
        const key = getMatchKey(row);
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(row);
    });

    let isOdd = false;

    return (
        <table>
            <thead>
                <tr>
                    <th>연도</th>
                    <th>회차</th>
                  
                    <th>리그명</th>
                    <th>번호</th>
                    <th>게임유형</th>
                    <th>단통여부</th>
                    <th>단통내용</th>
                    <th>홈팀 vs 원정팀</th>
                    <th>핸디</th>
                    <th>승</th>
                    <th>무</th>
                    <th>패</th>
                    <th>경기일</th>
                    <th>경기장</th>
                    <th>결과</th>
                </tr>
            </thead>
            <tbody>
                {[...grouped.entries()].map(([matchKey, rows], matchIdx) => {
                    isOdd = !isOdd;
                    const rowspan = rows.length;

                    return rows.map((row, rowIdx) => (
                        <tr
                            key={`${matchKey}_${rowIdx}`}
                            style={{ backgroundColor: isOdd ? "#f0f0f0" : "#ffffff" }}
                        >
                            {rowIdx === 0 && <td rowSpan={rowspan}>{row.year}</td>}
                            {rowIdx === 0 && <td rowSpan={rowspan}>{row.sec}</td>}
                            {rowIdx === 0 && (
                                <td rowSpan={rowspan}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <img
                                            src={`${CONFIG.ICON_PATH}/icn_${getSportIconCode(row.sporttype)}.png`}
                                            alt={row.sporttype}
                                            style={{ width: 20, height: 20 }}
                                        />
                                        <span>{row.lname}</span> {/* 예: NPB */}
                                    </div>
                                </td>
                            )}
                          

                            <td className="cell">{row.protono}</td>
                            <td className="cell">{row.type}</td>
                            <td className="cell">{row.type_bat}</td>
                            <td className="cell">{row.type_batName}</td>

                            <td>
                                <span
                                    className={
                                        row.result === "승" && row.hscore > row.ascore
                                            ? "team-win"
                                            : row.result === "패" && row.hscore < row.ascore
                                                ? "team-win"
                                                : ""
                                    }
                                >
                                    {row.htname}
                                </span>
                                &nbsp;
                                <span
                                    className={
                                        row.result === "승" && row.hscore > row.ascore
                                            ? "team-win"
                                            : row.result === "패" && row.hscore < row.ascore
                                                ? "team-win"
                                                : ""
                                    }
                                >
                                    {row.hscore}
                                </span>
                                -
                                <span
                                    className={
                                        row.result === "승" && row.hscore < row.ascore
                                            ? "team-win"
                                            : row.result === "패" && row.hscore > row.ascore
                                                ? "team-win"
                                                : ""
                                    }
                                >
                                    {row.ascore}
                                </span>
                                &nbsp;
                                <span
                                    className={
                                        row.result === "승" && row.hscore < row.ascore
                                            ? "team-win"
                                            : row.result === "패" && row.hscore > row.ascore
                                                ? "team-win"
                                                : ""
                                    }
                                >
                                    {row.atname}
                                </span>
                            </td>


                            <td className="cell">
                                {{
                                    핸디캡: row.handy,
                                    sum: row.sum,
                                    언더오버: row.underover,
                                }[row.type] || ""}
                            </td>
                            <td className="cell">{row.winbat}</td>
                            <td className="cell">{row.tiebat}</td>
                            <td className="cell">{row.losebat}</td>
                            <td className="cell">{row.matchday}</td>
                            <td className="cell">{row.matchplace}</td>
                            <td className="cell">{row.result}</td>

                        </tr>
                    ));
                })}
            </tbody>
        </table>
    );
};


export default DataTable;
