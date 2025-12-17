import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/auth.controller.js';

const router = Router();

router.post(
  '/register',
  [
    body('username').isString().isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  register
);

router.post(
  '/login',
  [
    body('identifier').isString().notEmpty().withMessage('Email or username is required'),
    body('password').isString().notEmpty()
  ],
  login
);

export default router;


