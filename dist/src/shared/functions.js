"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Logger_1 = tslib_1.__importDefault(require("./Logger"));
const User_1 = require("@entities/User");
const development_1 = require("../../env/development");
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: development_1.gmailAccountUsername,
        pass: development_1.gmailAccountPassword
    }
});
exports.pErr = (err) => {
    if (err) {
        Logger_1.default.error(err);
    }
};
exports.getRandomInt = () => {
    return Math.floor(Math.random() * 1000000000000);
};
exports.parseFirestoreUserDocToIUser = (docId, docData) => {
    const user = new User_1.User();
    user.email = docData.email;
    user.id = docId;
    user.name = docData.name;
    if (docData.is_admin === '1') {
        user.role = User_1.UserRoles.Admin;
    }
    else {
        user.role = User_1.UserRoles.Standard;
    }
    user.pwdHash = docData.pass_hash;
    return user;
};
exports.parseIUserToFirestoreUser = (user) => {
    const fireUser = {
        email: user.email,
        is_admin: user.role === User_1.UserRoles.Admin ? 1 : 0,
        name: user.name,
        pass_hash: user.pwdHash,
    };
    return fireUser;
};
exports.sendPasswordToMail = (email, password) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: development_1.gmailAccountUsername,
        to: email,
        subject: 'Auto generated password for DroneBlaze',
        text: 'Your auto generated password is ' + password + '. Kindly dont share it.'
    };
    const info = yield transporter.sendMail(mailOptions);
    return new Promise((resolve, reject) => {
        if (info) {
            resolve(true);
        }
        else {
            reject(false);
        }
    });
});
//# sourceMappingURL=functions.js.map