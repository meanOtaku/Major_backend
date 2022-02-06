import express from 'express';
import itemController from '../controllers/itemController.js';

const router = express.Router();

router.get('/:id',itemController.items_info);
router.get('/create',);
router.post('/create/addItem',);
router.delete('/create/deleteItem',);

export default router;