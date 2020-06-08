"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DroneStatus;
(function (DroneStatus) {
    DroneStatus[DroneStatus["online"] = 0] = "online";
    DroneStatus[DroneStatus["standby"] = 1] = "standby";
    DroneStatus[DroneStatus["offline"] = 2] = "offline";
    DroneStatus[DroneStatus["engaged"] = 3] = "engaged";
})(DroneStatus || (DroneStatus = {}));
class Drone {
    constructor(id, name, currentLocation, status, currentRouteAssigned, lastRouteAssigned) {
        this.id = id;
        this.name = name;
        this.status = status || DroneStatus.online;
        this.currentLocation = currentLocation;
        this.currentRouteAssigned = currentRouteAssigned;
        this.lastRouteAssigned = lastRouteAssigned;
    }
}
exports.Drone = Drone;
//# sourceMappingURL=Drone.js.map