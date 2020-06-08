import { getDbRef } from './DBRef';
import { Schedule } from '@entities/Schedule';
import { scheduleCollection } from '@shared/constants';


const db = getDbRef();

export interface ISchedule {
    getOne: (scheduleId: string) => Promise<any>;
    getAll: () => Promise<any>;
    add: (newSchedule: Schedule) => Promise<any>;
    update: (editedSchedule: Schedule) => Promise<any>;
    delete: (scheduleId: string) => Promise<any>;
}


export class ScheduleDao implements ISchedule {
    collectionRef = db.collection(scheduleCollection);


    public async getOne(scheduleId: string): Promise<any> {
        return this.collectionRef.doc(scheduleId).get();
    }


    public async getAll(): Promise<any> {
        return this.collectionRef.get();
    }


    public async add(newSchedule: Schedule): Promise<any> {
        return this.collectionRef.add(newSchedule);
    }


    public async update(editedSchedule: Schedule): Promise<any> {
        return this.collectionRef.doc(editedSchedule.id).set(editedSchedule, { merge: true });
    }


    public async delete(scheduleId: string): Promise<any> {
        return this.collectionRef.doc(scheduleId).delete();
    }
}
