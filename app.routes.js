import { Router } from 'express';
import AuthRouter from './src/module/auth/auth.routes.js';
import UserRouter from './src/module/user/user.routes.js';

const mainRouter = Router();

mainRouter.use('/auth', AuthRouter);
mainRouter.use('/user', UserRouter)

export default mainRouter;
