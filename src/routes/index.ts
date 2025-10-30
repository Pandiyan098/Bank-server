import { Router } from 'express';
import { customerRoutes } from './customer';

const router = Router();

// Mount customer routes
router.use('/customers', customerRoutes);

export default router;