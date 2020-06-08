"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const constants_1 = require("@shared/constants");
const DBRef_1 = require("./DBRef");
const db = DBRef_1.getDbRef();
class DroneDao {
    constructor() {
        this.collectionRef = db.collection(constants_1.droneCollection);
    }
    getOne(droneId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.doc(droneId).get();
        });
    }
    getAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.get();
        });
    }
    getAvailable() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.where('status', '==', 'online').get();
        });
    }
    add(newDrone) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.add(newDrone);
        });
    }
    update(updatedDrone) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.doc(updatedDrone.id).set(updatedDrone, { merge: true });
        });
    }
    delete(droneId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.doc(droneId).delete();
        });
    }
}
exports.default = DroneDao;
//# sourceMappingURL=Drone.js.map