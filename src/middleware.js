import { getSession } from './lib/session.js';
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

  if (url.pathname.startsWith('/projects')) {
    const sessionId = cookies.get('sessionId')?.value;
    const session = await getSession(sessionId);

    if (!session) {
      return redirect('/login');
    }
  }

  return next();
});