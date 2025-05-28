import React from 'react';
import './SoccerMatchHeader.css';

const SoccerMatchHeader = ({data})=>{
    if(!data) return null;

    const {league, status, home, away}=data;

    return (
        <div className='soccer-match-header'>
            <div className="match-info">
                <span className="league">{league}</span>
                <span className="status">{status}</span>
            </div>

            <div className='scoreboard'>
                <div className="team">
                    <img src={home.logo} alt={home.name}/>
                    <span>{home.name}</span>
                </div>
                <div className='score'>
                    <span>{home.score}</span>
                    <span> - </span>
                    <span> {away.score}</span>
                </div>
                <div className="scorers">
                    <div className="home-scorers">
                        {home.scorers.map((s,i)=>(
                            <div key={i}>⚽ {s}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SoccerMatchHeader;