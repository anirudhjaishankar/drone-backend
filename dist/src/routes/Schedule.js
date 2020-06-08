"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const Logger_1 = tslib_1.__importDefault(require("@shared/Logger"));
const constants_1 = require("@shared/constants");
const middleware_1 = require("./middleware");
const Schedule_1 = require("@daos/Schedule");
const job = require('node-schedule');
const router = express_1.Router().use(middleware_1.userMW);
const scheduleDao = new Schedule_1.ScheduleDao();
router.get('/all', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield scheduleDao.getAll().then((docData) => {
        if (docData.empty) {
            const apiResponse = {
                status: http_status_codes_1.OK,
                message: constants_1.noSchedulesAvailable
            };
            return res.status(http_status_codes_1.OK).json(apiResponse).end();
        }
        else {
            const schedules = [];
            docData.forEach((doc) => {
                Logger_1.default.info(JSON.stringify(doc.data()));
                const schedule = doc.data();
                schedule.id = doc.id;
                schedules.push(schedule);
            });
            const apiResponse = {
                status: http_status_codes_1.OK,
                message: schedules
            };
            return res.status(http_status_codes_1.OK).json(apiResponse).end();
        }
    });
}));
router.get('/get/:id', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    return yield scheduleDao.getOne(id).then((result) => {
        if (!result.exists) {
            const apiResponse = {
                status: http_status_codes_1.OK,
                message: constants_1.dataNotFound
            };
            return res.status(http_status_codes_1.OK).json(apiResponse).end();
        }
        else {
            const schedule = result.data();
            schedule.id = result.id;
            const apiResponse = {
                status: http_status_codes_1.OK,
                message: schedule
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
    const schedule = req.body;
    Logger_1.default.info(JSON.stringify(schedule));
    if (!schedule) {
        const apiResponse = {
            status: http_status_codes_1.BAD_REQUEST,
            message: constants_1.paramMissingError
        };
        return res.status(http_status_codes_1.BAD_REQUEST).json(apiResponse).end();
    }
    return yield scheduleDao.add(schedule).then((result) => {
        const apiResponse = {
            status: http_status_codes_1.CREATED,
            message: constants_1.scheduleAddSuccess
        };
        const scheduleDate = new Date(schedule.dateTime);
        job.scheduleJob(scheduleDate, () => {
            Logger_1.default.info(JSON.stringify(schedule));
            Logger_1.default.info('Triggered');
        });
        return res.status(http_status_codes_1.CREATED).json(apiResponse).end();
    }).catch((rej) => {
        Logger_1.default.error(JSON.stringify(rej));
        return res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).end();
    });
}));
router.put('/update', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { schedule } = req.body;
    if (!schedule) {
        const apiResponse = {
            status: http_status_codes_1.BAD_REQUEST,
            message: constants_1.paramMissingError
        };
        return res.status(http_status_codes_1.BAD_REQUEST).json(apiResponse).end();
    }
    return yield scheduleDao.update(schedule).then((result) => {
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
    return yield scheduleDao.delete(id).then((result) => {
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
exports.default = router;
//# sourceMappingURL=Schedule.js.map