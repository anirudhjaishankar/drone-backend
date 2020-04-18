import { Router } from 'express';
import UserRouter from './Users';
import AuthRouter from './Auth';
import DroneRouteRouter from './DroneRoutes';
import DroneRouter from './Drone';
// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/auth', AuthRouter);
router.use('/droneroutes', DroneRouteRouter);
router.use('/drone', DroneRouter);

// Export the base-router
export default router;
