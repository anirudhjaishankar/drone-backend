import { GeoPoint } from './GeoPoint';
import { DroneRoute } from './DroneRoute';

enum DroneStatus {
    online,
    standby,
    offline,
    engaged
}


export interface IDrone {
    id: string,
    name: string,
    status: DroneStatus,
    currentLocation: GeoPoint,
    currentRouteAssigned: DroneRoute | undefined,
    LastRouteAssigned: DroneRoute | undefined,
}

export class Drone implements IDrone {

    id: string;
    name: string;
    status: DroneStatus;
    currentLocation: GeoPoint;
    currentRouteAssigned: DroneRoute | undefined;
    LastRouteAssigned: DroneRoute | undefined;


    constructor(
        id: string,
        name: string,
        currentLocation: GeoPoint,
        status?: DroneStatus,
        currentRouteAssigned?: DroneRoute,
        LastRouteAssigned?: DroneRoute
    ) {
        this.id = id;
        this.name = name;
        this.status = status || DroneStatus.online;
        this.currentLocation = currentLocation;
        this.currentRouteAssigned = currentRouteAssigned;
        this.LastRouteAssigned = LastRouteAssigned;
    }

}