import express from 'express';
import UserRouter from './UserRouter.js'
import AuthRouter from './AuthRouter.js';
import PathRouter from './PathRouter.js';
import RouteRouter from './RouteRouter.js';

const router = express.Router();

router.use('/user', UserRouter);
router.use('/auth', AuthRouter);
router.use('/path', PathRouter);
router.use('/route', RouteRouter);

export default router;