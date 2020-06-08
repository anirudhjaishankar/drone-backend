"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramMissingError = 'One or more of the required parameters was missing.';
exports.loginFailedErr = 'Login failed';
exports.loginSuccess = 'Login Success';
exports.mailSenderError = 'Failed to send mail';
exports.userCollection = 'users';
exports.droneRoutesCollection = 'drone_routes';
exports.droneCollection = 'drones';
exports.scheduleCollection = 'schedules';
exports.getFailed = 'Cannot get data from DB';
exports.updateSuccessfull = 'Update successful';
exports.updateFailed = 'Update failed';
exports.deleteSuccess = 'Delete successful';
exports.deleteFailed = 'Delete failed';
exports.logoutMessage = 'User logged out';
exports.dataNotFound = 'Data does not exist';
exports.hashError = 'Error occured during hasing';
exports.pwdSaltRounds = 10;
exports.cookieProps = Object.freeze({
    key: 'drone-backend',
    secret: process.env.COOKIE_SECRET,
    options: {
        httpOnly: true,
        signed: true,
        path: (process.env.COOKIE_PATH),
        maxAge: Number(process.env.COOKIE_EXP),
        domain: (process.env.COOKIE_DOMAIN),
        secure: (process.env.SECURE_COOKIE === 'true'),
    },
});
exports.noUsers = 'No Users Found';
exports.addUserSuccess = 'User added successfully';
exports.addUserFail = 'User failed to add';
exports.userNotFound = 'User not found';
exports.noRoutesAvailable = 'No Routes Present';
exports.droneRouteAddSuccess = 'Drone Route added successfully';
exports.noDronesAvailable = 'No Drones Present';
exports.droneAddSuccess = 'Drone added successfully';
exports.noSchedulesAvailable = 'No Schedules Present';
exports.scheduleAddSuccess = 'Schedule added successfully';
//# sourceMappingURL=constants.js.map