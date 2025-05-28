import React from 'react';
import './NbaMatchHeader.css';

const NbaMatchHeader = ({ data }) => {
    if (!data || !data.home || !data.away) return null;

    const { league, status, home, away } = data;

    return (
        <div className="nba-match-header">
            <div className="match-info">
                <span className="league">{league}</span>
                <span className="status">{status}</span>
            </div>
            <div className="scoreboard">
                <div className="team">
                    <span className="team-name">{home.name}</span>
                </div>
                <div className="score">
                    <span className="home-score">{home.score}</span>
                    <span className="dash"> - </span>
                    <span className="away-score">{away.score}</span>
                </div>
                <div className="team">
                    <span className="team-name">{away.name}</span>
                </div>
            </div>
        </div>
    );
};

export default NbaMatchHeader;
