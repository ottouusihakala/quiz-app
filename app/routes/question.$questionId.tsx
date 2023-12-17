import { useRef, useEffect } from 'react'
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {json, redirect} from '@remix-run/node'
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import type { QuestionWithoutAnswer } from '../services/questions';
import questionService from '~/services/questions'
import playerService from '~/services/player'
import {useForm} from 'react-hook-form'
import type { LinksFunction } from '@remix-run/react/dist/routeModules';
import { commitSession, getSession } from '~/sessions';

import styles from '~/styles/question.css'

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = ({matches}) => {
  const question = matches.at(1)?.data as QuestionWithoutAnswer | undefined
  const questionTitle = question?.question
  const titlePostfix = questionTitle ? ` - ${questionTitle}` : ''
  return [
    { title: `Quiz App${titlePostfix}` },
  ];
};

const setSessionUserIdIfNotExist = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"))
  if (!session.has('userId')) {
    const userId = 'player'
    const {playerName} = playerService.addPlayer(userId)
    session.set('userId', playerName)
  }

  return session
} 

export async function loader({
  params,
  request,
}: LoaderFunctionArgs) {
  const { questionId } = params
  if (!questionId) {
    throw new Error('questionId missing!')
  }
  const question = questionService.getQuestion(questionId)
  if (!question) {
    throw new Error(`No question found with questionId ${questionId}!`)
  }

  const sessionWithUserId = await setSessionUserIdIfNotExist(request)
  const setSessionHeaderValue = await commitSession(sessionWithUserId)

  return json(question, {
    headers: {
      'Set-Cookie': setSessionHeaderValue
    }
  });  
}

interface Fields {
  selectedAnswer?: string
}

interface SubmitRequest {
  selectedAnswer: string
  nextQuestion: string | null
}

export function usePrevious<T>(value: T) {
  const currentRef = useRef<T>(value)
  const previousRef = useRef<T>()
  if (currentRef.current !== value) {
      previousRef.current = currentRef.current
      currentRef.current = value
  }
  return previousRef.current
}

const QuestionForm = ({ question, isPrevious = false }: { question: QuestionWithoutAnswer, isPrevious?: boolean }) => {
  const { id, question: questionLabel, answers, nextQuestion} = question
  const submit = useSubmit()
  const prevNextQuestion = usePrevious(nextQuestion)

  const formMethods = useForm<Fields>({ mode: 'onSubmit' })
  const { handleSubmit, register, reset } = formMethods

  useEffect(() => {
    if (prevNextQuestion !== nextQuestion) {
      reset()
    }
  }, [nextQuestion, prevNextQuestion, reset])

  const onSubmit = ({ selectedAnswer }: Fields) => {
    if (selectedAnswer) {
      submit({ selectedAnswer, nextQuestion: nextQuestion || null }, { method: 'POST', encType: 'application/json' })
    }
  }


  return (
    <Form className={`question-${id}`} onSubmit={handleSubmit(onSubmit)}>
      <fieldset key={questionLabel}>
        <legend>{questionLabel}</legend>
        {Object.entries(answers).map(([key, label]) => (
          <div key={key}>
            <input {...register('selectedAnswer', { required: true })} type="radio" value={key} required />
            {key.toUpperCase()}) {label}
          </div>
        ))}
      </fieldset>
      <button type="submit">Answer</button>
    </Form>
  )
}

export default function Component() {
  const question = useLoaderData<typeof loader>();

  return (
    <QuestionForm question={question} />
  )
}

export async function action({
  params,
  request,
}: ActionFunctionArgs) {
  const { selectedAnswer, nextQuestion }: SubmitRequest = await request.json();
  const { questionId } = params
  console.log('selectedAnswer', selectedAnswer)

  if (!questionId) {
    throw new Error('questionId missing from params')
  }

  const session = await getSession(
    request.headers.get("Cookie")
  )
  
  if (!session.has('userId')) {
    throw new Error('No userId found in session')
  }

  playerService.setAnswer(session.get('userId') as string, { questionId, selectedAnswer })

  if (nextQuestion) {
    return redirect(`/question/${nextQuestion}`)
  }

  return redirect('/results')
}