function GameListTable({ games, title }) {
    const thStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center", backgroundColor: "#f0f0f0" };
    const tdStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };
    console.log("📦 GameListTable - games prop:", games);

    return (
        <div style={{ marginTop: "30px" }}>
            <h4>{title}</h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>날짜</th>
                        <th style={thStyle}>홈팀</th>
                        <th style={thStyle}>원정팀</th>
                        <th style={thStyle}>점수</th>
                        <th style={thStyle}>결과</th>
                        <th style={thStyle}>홈 순위</th>
                        <th style={thStyle}>원정 순위</th>
                    </tr>
                </thead>
                <tbody>
                    {games?.map((game, idx) => (
                        <tr
                            key={game.gameId || idx}
                            style={{ cursor: "pointer" }}
                           
                        >
                            <td style={tdStyle}>{game.gameId ?? '-'}</td>
                            <td style={tdStyle}>{game.matchday}</td>
                            <td style={tdStyle}>{game.homeTeam}</td>
                            <td style={tdStyle}>{game.awayTeam}</td>
                            <td style={tdStyle}>{game.hscore} : {game.ascore}</td>
                            <td style={tdStyle}>{game.result}</td>
                            <td style={tdStyle}>{game.homeRnk ?? '-'}</td>
                            <td style={tdStyle}>{game.awayRnk ?? '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default GameListTable;