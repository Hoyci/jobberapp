import { health } from '@auth/controllers/health';
import express, { Router } from 'express';

const router: Router = express.Router();

export function healthRoutes(): Router {
  router.post('/auth-health', health);

  return router;
}
