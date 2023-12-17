import type { LoaderFunctionArgs} from "@remix-run/node";
import { json } from "@remix-run/node"
import { getSession } from "~/sessions";
import playerService from '~/services/player'
import questionService from '~/services/questions'
import { useLoaderData } from "@remix-run/react";

type QuestionAndAnswer = {
  questionId: string
  question: string
  answerId: string
  answerLabel: string
  correctAnswerId: string
  correctAnswerLabel: string
}

const combineQuestionsAndPlayerAnswers = (userId: string): QuestionAndAnswer[] => {
  const playerAnswers = playerService.getPlayerAnswers(userId)
  const questions = questionService.getQuestionsWithAnswers()

  return Object.entries(playerAnswers).map(([questionId, answer]) => {
    const question = questions.find((q) => q.id === questionId)
    const questionLabel = question?.question || 'Missing question label'
    const answerLabel = question?.answers[answer as string] || 'Missing answer label'
    const correctAnswerLabel = question?.answers[question.correctAnswer] || 'Missing correct answer label'
    return { questionId, question: questionLabel, answerId: answer as string, answerLabel, correctAnswerId: question?.correctAnswer || 'Missing correct answer ID', correctAnswerLabel }
  })
}

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  )
  
  if (!session.has('userId')) {
    throw new Error('No userId found in session')
  }

  const questionsAndAnswers = combineQuestionsAndPlayerAnswers(session.get('userId') as string)

  return json(questionsAndAnswers);  
}

export default function Component() {
  const questionsAndAnswers = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Results</h1>
      <table>
        <thead>
          <tr>
            <th>Question ID</th>
            <th>Question</th>
            <th>Your Answer</th>
            <th>Correct Answer</th>
          </tr>
        </thead>
        <tbody>
          {questionsAndAnswers.map(({questionId, question, answerId, answerLabel, correctAnswerId, correctAnswerLabel}) => (
            <tr key={questionId}>
              <td>{questionId}</td>
              <td>{question}</td>
              <td>{answerId}) {answerLabel}</td>
              <td>{correctAnswerId}) {correctAnswerLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}