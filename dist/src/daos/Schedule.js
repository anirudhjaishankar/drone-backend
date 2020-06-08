"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const DBRef_1 = require("./DBRef");
const constants_1 = require("@shared/constants");
const db = DBRef_1.getDbRef();
class ScheduleDao {
    constructor() {
        this.collectionRef = db.collection(constants_1.scheduleCollection);
    }
    getOne(scheduleId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.doc(scheduleId).get();
        });
    }
    getAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.get();
        });
    }
    add(newSchedule) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.add(newSchedule);
        });
    }
    update(editedSchedule) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.doc(editedSchedule.id).set(editedSchedule, { merge: true });
        });
    }
    delete(scheduleId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.collectionRef.doc(scheduleId).delete();
        });
    }
}
exports.ScheduleDao = ScheduleDao;
//# sourceMappingURL=Schedule.js.map