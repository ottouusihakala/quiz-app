# Quiz App

Motivation for this was people commenting that my powerpoint quiz would be easier if it was interactive. Most interactive quiz tools however don't support the kind of visual effects I wish to incorporate into my quizzes. Hence, I decided to make my own tool, as a web app.

Uses Remix. No database, you provide a JSON file that contains the questions.

## Development

Start the Remix development asset server and the Express server by running:

```sh
npm run dev
```

This starts your app in development mode, which will purge the server require cache when Remix rebuilds assets so you don't need a process manager restarting the express server.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying express applications you should be right at home just make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

## Features

### For MVP

* Multiple questions
  * Cannot move to next question without answering current question
  * 4 options in each question
  * Tell correct answers at the end

### Additional features, possibly in the future

* Different types of questions, with different types of answering mechanisms
  * Answer combinations (connect 2 concepts)
  * Text inputs?

#### Nice-to-have

* Multiple players?
* Leaderboards?

