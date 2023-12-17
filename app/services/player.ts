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
  return playerStats[playerName]
}

type QuestionAnswer = { questionId: string; selectedAnswer: string; }

const setAnswer = (playerName: string, { questionId, selectedAnswer }: QuestionAnswer) => {
  const player = playerStats[playerName]
  if (!player) {
    throw new Error('No user found with given player name')
  }
  
  player.answers[questionId] = selectedAnswer

  return player 
}

const getPlayerAnswers = (playerName: string) => {
  const player = playerStats[playerName]
  if (!player) {
    throw new Error('No user found with given player name')
  }

  return player.answers
}

export default { addPlayer, setAnswer, getPlayerAnswers }