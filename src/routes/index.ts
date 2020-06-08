import { Router } from 'express';
import UserRouter from './Users';
import AuthRouter from './Auth';
import DroneRouteRouter from './DroneRoutes';
import DroneRouter from './Drone';
import ScheduleRouter from './Schedule';
// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/auth', AuthRouter);
router.use('/droneroutes', DroneRouteRouter);
router.use('/drone', DroneRouter);
router.use('/schedules', ScheduleRouter);
// Export the base-router
export default router;
