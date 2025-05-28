import React from "react";

const InningScoreTable= ({inningData})=>{
    if(!inningData || inningData !=2) return null;

    const away = inningData.find(t=>t.ha=='a');
    const home= inningData.find(t=>t.ha=='h');
    const parseScores = (team)=>team.scores ?.split(",")||[];
    const innings = Array.from({length : Math.max(parseScores(away).length, parseScores(home).length)}, (_,i)=> i+1);
    return (
        <table className="innings-score-table">
            <thead>
                <tr>
                    <th>팀</th>
                    {innings.map(i=><th key={`i=${i}`}>{i}</th>)}
                    <th>R</th>
                    <th>H</th>
                    <th>E</th>
                </tr>
            </thead>
            <tbody>
                {[away,home].map(team=>{
                    <tr key={team.teamName}>
                        <td>{team.teamName}</td>
                        {parseScores(team).map((s,idx)=>(
                            <td key={idx}>{s}</td>
                        ))}
                        <td>{team.innr}</td>
                        <td>{team.innh}</td>
                        <td>{team.inne}</td>
                    </tr>
                })}
            </tbody>
        </table>
    )
}
export default InningScoreTable;