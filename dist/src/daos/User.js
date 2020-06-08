"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const constants_1 = require("@shared/constants");
const functions_1 = require("@shared/functions");
const DBRef_1 = require("./DBRef");
const db = DBRef_1.getDbRef();
class UserDao {
    getOne(email) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return db.collection(constants_1.userCollection).where('email', '==', email).get();
        });
    }
    getAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return db.collection(constants_1.userCollection).get();
        });
    }
    add(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fireUser = functions_1.parseIUserToFirestoreUser(user);
            return db.collection(constants_1.userCollection).add(fireUser);
        });
    }
    update(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fireUser = functions_1.parseIUserToFirestoreUser(user);
            return db.collection(constants_1.userCollection).doc(user.id.toString()).set(fireUser, { merge: true });
        });
    }
    delete(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return db.collection('users').doc(id).delete();
        });
    }
}
exports.default = UserDao;
//# sourceMappingURL=User.js.map