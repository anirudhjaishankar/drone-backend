"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const constants_1 = require("@shared/constants");
const DBRef_1 = require("./DBRef");
const db = DBRef_1.getDbRef();
class DroneRouteDao {
    constructor() {
        this.collectionRef = db.collection(constants_1.droneRoutesCollection);
    }
    getOne(routeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.doc(routeId).get();
        });
    }
    getAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.get();
        });
    }
    add(newDroneRoute) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.add(newDroneRoute);
        });
    }
    update(updatedDroneRoute) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.doc(updatedDroneRoute.id).set(updatedDroneRoute, { merge: true });
        });
    }
    delete(routeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.doc(routeId).delete();
        });
    }
}
exports.default = DroneRouteDao;
//# sourceMappingURL=DroneRoutes.js.map