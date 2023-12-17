import questions from './data/questions.json'

type QuestionType = 'MULTI_ANSWER' | 'PAIRS'

export interface Question {
  id: string
  question: string
  questionType: QuestionType
  answers: Record<string, string>
  correctAnswer: string
  nextQuestion?: string
}

export type QuestionWithoutAnswer = Omit<Question, 'correctAnswer'> 

// interface MultiAnswerQuestion extends Question {
//   questionType: 'MULTI_ANSWER'
//   answers: Record<string, string>
// }

const stripAnswer = (question: Question) => {
  const {id, question: questionLabel, questionType, answers, nextQuestion} = question
  return { id, question: questionLabel, questionType: questionType as QuestionType, answers, nextQuestion }
}

const getQuestions = (): QuestionWithoutAnswer[] => {
  return (questions as Question[]).map(stripAnswer)
}

const getQuestion = (questionId: string) => {
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