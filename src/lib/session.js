import { getStore } from '@netlify/blobs';

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession(userId) {
  const sessionId = crypto.randomUUID();
  const session = {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION
  };

  const store = getStore('sessions');
  await store.set(sessionId, JSON.stringify(session));

  return sessionId;
}

export async function getSession(sessionId) {
  if (!sessionId) return null;

  try {
    const store = getStore('sessions');
    const sessionData = await store.get(sessionId);

    if (!sessionData) return null;

    const session = JSON.parse(sessionData);

    if (Date.now() > session.expiresAt) {
      await store.delete(sessionId);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function deleteSession(sessionId) {
  if (!sessionId) return;

  try {
    const store = getStore('sessions');
    await store.delete(sessionId);
  } catch (error) {
    console.error('Error deleting session:', error);
  }
}