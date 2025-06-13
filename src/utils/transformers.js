export function transformRecentGamesToStandard(games, baseTeamName) {
  if (!Array.isArray(games)) return [];

  const seen = new Set();
  const result = [];

  games.forEach((game, index) => {
    if (seen.has(game.gameId)) return; // ✅ 중복 제거
    seen.add(game.gameId);

    const isHome = game.teamName === baseTeamName ? game.isHome : !game.isHome;
    const isMyTeamHome = isHome;

    const transformed = {
      gameId: game.gameId ?? null,
      matchday: game.matchday ?? '-',
      homeTeam: isMyTeamHome ? game.teamName : game.opponentTeam,
      awayTeam: isMyTeamHome ? game.opponentTeam : game.teamName,
      hscore: game.hscore ?? '-',
      ascore: game.ascore ?? '-',
      result: game.result || '-',
      homeRnk: game.homeRnk ?? '-',
      awayRnk: game.awayRnk ?? '-',
    };

    result.push(transformed);
  });

  return result;
}
