import { Router } from 'express';
import { createHouse, listHouses, updateHouse, deleteHouse } from '../controllers/houseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', listHouses);
router.post('/', createHouse);
router.put('/:id', updateHouse);
router.delete('/:id', deleteHouse);

export default router;
