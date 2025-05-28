import React from "react";
import "./NpbScoreTable.css";

const NpbScoreTable = ({data})=>{
    if(!data||data.length===0) return <p>이닝 정보가 없습니다.</p>;
    const maxInnings = Math.max(...data.map(team=> team.scores?.split(',').length || 0));
    return (
        <table className="npb-score-table">
            <thead>
                <tr>
                    <th>팀</th>
                    {Array.from({length: maxInnings}, (_,i)=>(
                        <th key={i+1}>{i+1}</th>
                    ))}
                    <th>R</th>
                </tr>
            </thead>
            <tbody>
                {data.map((team,idx)=>{
                    const inningScores =team.scores?.split(',')||[];
                    return (
                        <tr key={idx} className={team.ha==='h' ? 'home':'away'}>
                            <td>team.teamName</td>
                            {Array.from({length: maxInnings},(_,i)=>(
                                <td key={i}>{inningScores[i] ?? ''}</td>
                            ))}
                            <td>{team.r}</td>
                        </tr>
                        
                    );
                })}
            </tbody>
        </table>
    );
};

export default NpbScoreTable;