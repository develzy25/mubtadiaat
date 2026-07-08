import { offlineDb } from './offlineDb';

export const fetchWithSync = async (url: string | URL | Request, options?: RequestInit) => {
  const method = options?.method?.toUpperCase() || 'GET';
  const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

  if (!navigator.onLine && isMutation) {
    // Save to offline queue
    await offlineDb.syncQueue.add({
      url: url.toString(),
      method,
      body: options?.body as string || '',
      headers: options?.headers ? JSON.stringify(options.headers) : undefined,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      retryCount: 0
    });
    
    // Return a fake success response so the UI optimistically updates
    return new Response(JSON.stringify({ success: true, offline: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // If online, just fetch normally. 
  // If fetch fails due to network error and it's a mutation, catch it and queue it.
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    if (isMutation) {
      await offlineDb.syncQueue.add({
        url: url.toString(),
        method,
        body: options?.body as string || '',
        headers: options?.headers ? JSON.stringify(options.headers) : undefined,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        retryCount: 0
      });
      return new Response(JSON.stringify({ success: true, offline: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    throw error;
  }
};
