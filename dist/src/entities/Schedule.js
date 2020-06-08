"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScheduleStatus;
(function (ScheduleStatus) {
    ScheduleStatus[ScheduleStatus["scheduled"] = 0] = "scheduled";
    ScheduleStatus[ScheduleStatus["ongoing"] = 1] = "ongoing";
    ScheduleStatus[ScheduleStatus["completed"] = 2] = "completed";
})(ScheduleStatus || (ScheduleStatus = {}));
;
class Schedule {
    constructor(id, name, status, dateTime, route, drone) {
        this.id = id;
        this.name = name;
        this.status = status,
            this.dateTime = dateTime,
            this.route = route,
            this.drone = drone;
    }
}
exports.Schedule = Schedule;
//# sourceMappingURL=Schedule.js.map