import { DroneRoute } from './../entities/DroneRoute';
import { droneRoutesCollection } from '@shared/constants';
import { getDbRef } from './DBRef';

const db = getDbRef();


export interface IDroneRoutes {
    getOne: (routeId: string) => Promise<any>;
    getAll: () => Promise<any>;
    add: (newDroneRoute: DroneRoute) => Promise<any>;
    update: (editedDroneRoute: DroneRoute) => Promise<any>;
    delete: (routeId: string) => Promise<any>;
}

class DroneRouteDao implements IDroneRoutes {

    collectionRef = db.collection(droneRoutesCollection);


    public async getOne(routeId: string): Promise<any> {
        return this.collectionRef.doc(routeId).get();
    }


    public async getAll(): Promise<any> {
        return this.collectionRef.get();
    }


    public async add(newDroneRoute: DroneRoute): Promise<any> {
        return this.collectionRef.add(newDroneRoute);
    }


    public async update(updatedDroneRoute: DroneRoute): Promise<any> {
        return this.collectionRef.doc(updatedDroneRoute.id).set(updatedDroneRoute, { merge: true });
    }


    public async delete(routeId: string): Promise<any> {
        return this.collectionRef.doc(routeId).delete();
    }

}

export default DroneRouteDao;