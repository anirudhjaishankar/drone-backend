import { Drone } from './../entities/Drone';
import { droneCollection } from '@shared/constants';
import { getDbRef } from './DBRef';

const db = getDbRef();


export interface IDrones {
    getOne: (droneId: string) => Promise<any>;
    getAll: () => Promise<any>;
    add: (newDrone: Drone) => Promise<any>;
    update: (editedDrone: Drone) => Promise<any>;
    delete: (droneId: string) => Promise<any>;
}

class DroneDao implements IDrones {

    collectionRef = db.collection(droneCollection);


    public async getOne(droneId: string): Promise<any> {
        return this.collectionRef.doc(droneId).get();
    }


    public async getAll(): Promise<any> {
        return this.collectionRef.get();
    }


    public async add(newDrone: Drone): Promise<any> {
        return this.collectionRef.add(newDrone);
    }


    public async update(updatedDrone: Drone): Promise<any> {
        return this.collectionRef.doc(updatedDrone.id).set(updatedDrone, { merge: true });
    }


    public async delete(droneId: string): Promise<any> {
        return this.collectionRef.doc(droneId).delete();
    }

}

export default DroneDao;