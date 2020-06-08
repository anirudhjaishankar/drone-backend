"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const User_1 = tslib_1.__importDefault(require("@daos/User"));
const constants_1 = require("@shared/constants");
const middleware_1 = require("./middleware");
const User_2 = require("@entities/User");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const functions_1 = require("@shared/functions");
const generatePassword = require("password-generator");
const Logger_1 = tslib_1.__importDefault(require("@shared/Logger"));
const router = express_1.Router().use(middleware_1.adminMW);
const userDao = new User_1.default();
router.get('/all', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield userDao.getAll().then((docData) => {
        if (docData.empty) {
            return res.status(http_status_codes_1.OK).json({ message: constants_1.noUsers });
        }
        else {
            const users = [];
            docData.forEach((doc) => {
                const user = functions_1.parseFirestoreUserDocToIUser(doc.id, doc.data());
                users.push(user);
            });
            const apiResponse = {
                status: http_status_codes_1.OK,
                message: users
            };
            return res.status(http_status_codes_1.OK).json(apiResponse).end();
        }
    });
}));
router.get('/get/:id', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    return yield userDao.getOne(id).then((result) => {
        if (!result.exists) {
            const apiResponse = {
                status: http_status_codes_1.OK,
                message: constants_1.userNotFound
            };
            return res.status(http_status_codes_1.OK).json(apiResponse).end();
        }
        else {
            const apiResponse = {
                status: http_status_codes_1.OK,
                message: functions_1.parseFirestoreUserDocToIUser(result.id, result.data())
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
    const { user } = req.body;
    if (!user) {
        const apiResponse = {
            status: http_status_codes_1.BAD_REQUEST,
            message: constants_1.paramMissingError
        };
        return res.status(http_status_codes_1.BAD_REQUEST).json(apiResponse).end();
    }
    user.role = User_2.UserRoles.Standard;
    const pass = generatePassword(10, false);
    return bcrypt_1.default.hash(pass, constants_1.pwdSaltRounds, (err, hash) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            Logger_1.default.error(constants_1.hashError);
            Logger_1.default.error(err);
            return res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).end();
        }
        else {
            user.pwdHash = hash;
            return functions_1.sendPasswordToMail(user.email, pass).then((isMailSent) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                Logger_1.default.info(isMailSent);
                if (!isMailSent) {
                    Logger_1.default.info(constants_1.mailSenderError);
                    return res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).end();
                }
                else {
                    yield userDao.add(user);
                    const responseObject = {
                        status: http_status_codes_1.CREATED,
                        message: constants_1.addUserSuccess
                    };
                    return res.status(http_status_codes_1.CREATED).json(responseObject).end();
                }
            }), (error) => {
                Logger_1.default.error(error);
                return res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).end();
            }).catch((error) => {
                Logger_1.default.error(error);
                return res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).end();
            });
        }
    }));
}));
router.put('/update', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.body;
    if (!user) {
        const apiResponse = {
            status: http_status_codes_1.BAD_REQUEST,
            message: constants_1.paramMissingError
        };
        return res.status(http_status_codes_1.BAD_REQUEST).json(apiResponse).end();
    }
    return bcrypt_1.default.hash(user.password, constants_1.pwdSaltRounds, (err, hash) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        user.pwdHash = hash;
        return yield userDao.update(user).then((result) => {
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
}));
router.delete('/delete/:id', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    return yield userDao.delete(id).then((result) => {
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
//# sourceMappingURL=Users.js.map