import React from 'react';
import './NpbPitcherStats.css';

const NpbPitcherStats=({data})=>{
    if(!data|| data.length===0) return <p>투수 기록이 없습니다.</p>
    return (
        <table className="npb-pitcher-stats">
            <thead>
                <th>팀</th>
                <th>선수</th>
                <th>투수기록</th>
                <th>투구이닝</th>
                <th>투구수</th>
                <th>피안타</th>
                <th>포볼</th>
                <th>데드볼</th>
                <th>스트럭아웃</th>
                <th>실점</th>
                <th>홈/원정</th>
            </thead>
            <tbody>
                {data.map((pitcher, idx)=>(
                    <tr key={idx} className={pitcher.ha==='h' ? 'home' : 'away'}>
                        <td>{pitcher.teamName}</td>
                        <td>{pitcher.name}</td>
                        <td>{pitcher.hist}</td>
                        <td>{pitcher.ip}</td>
                        <td>{pitcher.bf}</td>
                        <td>{pitcher.h}</td>
                        <td>{pitcher.bb}</td>
                        <td>{pitcher.so}</td>
                        <td>{pitcher.er}</td>
                        <td>{pitcher.ha}</td>
                    </tr>
                ))};
            </tbody>
        </table>
    );
};

export default NpbPitcherStats;
