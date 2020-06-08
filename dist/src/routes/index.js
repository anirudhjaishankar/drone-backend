"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const Users_1 = tslib_1.__importDefault(require("./Users"));
const Auth_1 = tslib_1.__importDefault(require("./Auth"));
const DroneRoutes_1 = tslib_1.__importDefault(require("./DroneRoutes"));
const Drone_1 = tslib_1.__importDefault(require("./Drone"));
const Schedule_1 = tslib_1.__importDefault(require("./Schedule"));
const router = express_1.Router();
router.use('/users', Users_1.default);
router.use('/auth', Auth_1.default);
router.use('/droneroutes', DroneRoutes_1.default);
router.use('/drone', Drone_1.default);
router.use('/schedules', Schedule_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map