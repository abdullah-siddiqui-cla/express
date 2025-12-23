// User Routes - defines API endpoints for user operations
import express from 'express';
import { signIn } from '../controllers/userController.js';

const router = express.Router();

// POST /users/signin - Sign in user
router.post('/signin', signIn);

export default router;
