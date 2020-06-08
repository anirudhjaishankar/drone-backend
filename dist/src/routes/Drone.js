"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const Logger_1 = tslib_1.__importDefault(require("@shared/Logger"));
const Drone_1 = tslib_1.__importDefault(require("@daos/Drone"));
const constants_1 = require("@shared/constants");
const middleware_1 = require("./middleware");
const router = express_1.Router().use(middleware_1.userMW);
const droneDao = new Drone_1.default();
router.get('/all', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return yield droneDao.getAll().then((result) => {
        if (!result.exists) {
            const apiResponse = {
                status: http_status_codes_1.OK,
                message: constants_1.dataNotFound
            };
            return res.status(http_status_codes_1.OK).json(apiResponse).end();
        }
        else {
            const drones = [];
            result.forEach((doc) => {
                Logger_1.default.info(JSON.stringify(doc.data()));
                const drone = doc.data();
                drone.id = doc.id;
                drones.push(drone);
            });
            const apiResponse = {
                status: http_status_codes_1.OK,
                message: drones
            };
            return res.status(http_status_codes_1.OK).json(apiResponse).end();
        }
    }).catch((err) => {
        Logger_1.default.error(err);
        const apiResponse = {
            status: http_status_codes_1.INTERNAL_SERVER_ERROR,
            message: constants_1.getFailed
        };
        return res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).json(apiResponse).end();
    });
}));
router.get('/get/:id', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    return yield droneDao.getOne(id).then((result) => {
        if (!result.exists) {
            const apiResponse = {
                status: http_status_codes_1.OK,
                message: constants_1.dataNotFound
            };
            return res.status(http_status_codes_1.OK).json(apiResponse).end();
        }
        else {
            const drone = result.data();
            drone.id = result.id;
            const apiResponse = {
                status: http_status_codes_1.OK,
                message: drone
            };
            return res.status(http_status_codes_1.OK).json(apiResponse).end();
        }
    }).catch((err) => {
        Logger_1.default.error(err);
        const apiResponse = {
            status: http_status_codes_1.INTERNAL_SERVER_ERROR,
            message: constants_1.getFailed
        };
        return res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).json(apiResponse).end();
    });
}));
router.post('/add', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { drone } = req.body;
    if (!drone) {
        const apiResponse = {
            status: http_status_codes_1.BAD_REQUEST,
            message: constants_1.paramMissingError
        };
        return res.status(http_status_codes_1.BAD_REQUEST).json(apiResponse).end();
    }
    return yield droneDao.add(drone).then((result) => {
        const apiResponse = {
            status: http_status_codes_1.CREATED,
            message: constants_1.droneAddSuccess
        };
        return res.status(http_status_codes_1.CREATED).json(apiResponse).end();
    }).catch((rej) => {
        Logger_1.default.error(JSON.stringify(rej));
        return res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).end();
    });
}));
router.put('/update', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { drone } = req.body;
    if (!drone) {
        const apiResponse = {
            status: http_status_codes_1.BAD_REQUEST,
            message: constants_1.paramMissingError
        };
        return res.status(http_status_codes_1.BAD_REQUEST).json(apiResponse).end();
    }
    return yield droneDao.update(drone).then((result) => {
        const apiResponse = {
            status: http_status_codes_1.OK,
            message: constants_1.updateSuccessfull
        };
        return res.status(http_status_codes_1.OK).json(apiResponse).end();
    }).catch((error) => {
        Logger_1.default.error(error);
        const apiResponse = {
            status: http_status_codes_1.INTERNAL_SERVER_ERROR,
            message: constants_1.updateFailed
        };
        return res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).json(apiResponse).end();
    });
}));
router.delete('/delete/:id', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    return yield droneDao.delete(id).then((result) => {
        const apiResponse = {
            status: http_status_codes_1.OK,
            message: constants_1.deleteSuccess
        };
        return res.status(http_status_codes_1.OK).json(apiResponse).end();
    }).catch((err) => {
        Logger_1.default.error(err);
        const apiResponse = {
            status: http_status_codes_1.INTERNAL_SERVER_ERROR,
            message: constants_1.deleteFailed
        };
        return res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).json(apiResponse).end();
    });
}));
router.get('/available', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return yield droneDao.getAvailable().then((result) => {
        if (!result.exists) {
            const apiResponse = {
                status: http_status_codes_1.OK,
                message: constants_1.dataNotFound
            };
            return res.status(http_status_codes_1.OK).json(apiResponse).end();
        }
        else {
            const drones = [];
            result.forEach((doc) => {
                Logger_1.default.info(JSON.stringify(doc.data()));
                const drone = doc.data();
                drone.id = doc.id;
                drones.push(drone);
            });
            const apiResponse = {
                status: http_status_codes_1.OK,
                message: drones
            };
            return res.status(http_status_codes_1.OK).json(apiResponse).end();
        }
    }).catch((err) => {
        Logger_1.default.error(err);
        const apiResponse = {
            status: http_status_codes_1.INTERNAL_SERVER_ERROR,
            message: constants_1.getFailed
        };
        return res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).json(apiResponse).end();
    });
}));
exports.default = router;
//# sourceMappingURL=Drone.js.map