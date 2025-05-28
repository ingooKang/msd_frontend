import React from "react";
import {Line} from "react-chartjs-2";

function TeamTrendChart({data}){
    const labels=[...new Set(data.map(item=>item.checkday))];
    const datasets=[...new Set(data.map(d=>d.team_name))].map(team=>({
        label: team,
        data: labels.map(data=>{
            const record = data.find(d=>d.checkday === date && d.team_name===team);
            return record?.rank ||null;
        }),
        fill:false,
        borderColor:`#${Mapth.floor(Math.random()*1677215).toString(16)}`,
    }));
    return (
        <Line data={{labels, datasets}}/>
    );
}

export default TeamTrendChart;