import { Router } from 'express';
import { listUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', listUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
