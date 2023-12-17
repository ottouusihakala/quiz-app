type PlayerStats = {
  playerName: string
  answers: Record<string, unknown>
}

type PlayersStats = Record<string, PlayerStats>

const playerStats: PlayersStats = {}

const addPlayer = (playerName: string) => {
  if (!playerStats[playerName]) {
    playerStats[playerName] = { playerName, answers: {} }
  }
}

export default { addPlayer }