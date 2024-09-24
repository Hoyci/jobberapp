import express, { Router } from 'express';

const router: Router = express.Router();

export function refreshTokenRoutes(): Router {
  router.get('/currentUser', read);

  return router;
}
