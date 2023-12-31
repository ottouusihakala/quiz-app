import { createCookieSessionStorage, createCookie } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      // a Cookie from `createCookie` or the CookieOptions to create one
      cookie: createCookie('__quizAppSession', {
        sameSite: 'strict',
        secrets: ['secret'],
        httpOnly: true,
        secure: true,
        path: '/',
        expires: new Date(Date.now() + 60_000)
      }),
      // cookie: {
      //   name: "__session",

      //   // all of these are optional
      //   domain: "remix.run",
      //   // Expires can also be set (although maxAge overrides it when used in combination).
      //   // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
      //   //
      //   // expires: new Date(Date.now() + 60_000),
      //   httpOnly: true,
      //   maxAge: 60,
      //   path: "/",
      //   sameSite: "lax",
      //   secrets: ["s3cret1"],
      //   secure: true,
      // },
    }
  );

export { getSession, commitSession, destroySession };