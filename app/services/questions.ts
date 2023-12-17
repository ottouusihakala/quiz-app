import questions from '~/data/questions.json'

type QuestionType = 'MULTI_ANSWER' | 'PAIRS'

export interface Question {
  id: string
  question: string
  questionType: QuestionType
  answers: Record<string, string>
  correctAnswer: string
  nextQuestion?: string
  backgroundImage?: string
  questionPosition?: string
}

export type QuestionWithoutAnswer = Omit<Question, 'correctAnswer'>

const stripAnswer = (question: Question) => {
  const {id, question: questionLabel, questionType, answers, nextQuestion, backgroundImage, questionPosition} = question
  return { id, question: questionLabel, questionType: questionType as QuestionType, answers, nextQuestion, backgroundImage, questionPosition }
}

const getQuestions = (): QuestionWithoutAnswer[] => {
  return (questions as Question[]).map(stripAnswer)
}

const getQuestion = (questionId: string): QuestionWithoutAnswer | undefined => {
  const question = (questions as Question[]).find((q) => q.id === questionId)
  return question ? stripAnswer(question) : undefined
}

const getQuestionsWithAnswers = (): Question[] => {
  return questions as Question[]
}

export default {
  getQuestions,
  getQuestionsWithAnswers,
  getQuestion,
}