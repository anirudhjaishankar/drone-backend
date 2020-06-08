import { DroneRoute } from './DroneRoute';
import { Drone } from './Drone';
import { GeoPoint } from './GeoPoint';

export enum ScheduleStatus {
    scheduled,
    ongoing,
    completed,
    uploaded
};

export interface ISchedule {
    id: string,
    name: string,
    isVideo: boolean,
    status: ScheduleStatus,
    dateTime: Date,
    route: DroneRoute,
    drone: Drone,
    identifiedCitizenList: GeoPoint[];
}

export class Schedule implements ISchedule {
    id: string;
    name: string;
    isVideo: boolean;
    status: ScheduleStatus;
    dateTime: Date;
    route: DroneRoute;
    drone: Drone;
    identifiedCitizenList: GeoPoint[];


    constructor(
        id: string,
        name: string,
        isVideo: boolean,
        status: ScheduleStatus,
        route: DroneRoute,
        drone: Drone,
        identifiedCitizenList: GeoPoint[],
        dateTime: Date,
    ) {
        this.id = id;
        this.name = name;
        this.isVideo = isVideo;
        this.status = status;
        this.dateTime = dateTime ;
        this.route = route;
        this.drone = drone;
        this.identifiedCitizenList = identifiedCitizenList;
    }
}