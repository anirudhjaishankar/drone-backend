import { GeoPoint } from './GeoPoint';

export interface IDroneRoute {
    id: string,
    pathName: string,
    numberOfCheckPoints: number,
    checkpoints: GeoPoint[],
    createdBy: string
}

export class DroneRoute implements IDroneRoute {
    id: string;
    pathName: string;
    numberOfCheckPoints: number;
    checkpoints: GeoPoint[];
    createdBy: string;


    constructor(
        id: string,
        pathName: string,
        numberOfCheckPoints: number,
        checkPoints: GeoPoint[],
        createBy: string
    ) {
        this.id = id;
        this.pathName = pathName;
        this.numberOfCheckPoints = numberOfCheckPoints;
        this.checkpoints = checkPoints;
        this.createdBy = createBy;
    }

}