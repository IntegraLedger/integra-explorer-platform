import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../router';
import type { Env } from '@shared/types';

export const onRequest: PagesFunction<Env> = async (context) => {
  return fetchRequestHandler({
    endpoint: '/api',
    req: context.request,
    router: appRouter,
    createContext: () => ({
      env: context.env
    })
  });
};