export class GeoPoint {
    public id?: string;
    public name: string;
    public latitude: number;
    public longitude: number;


    constructor(
        id: string,
        name: string,
        latitude: number,
        longitude: number
    ) {
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}