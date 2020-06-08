import { IUser } from '@entities/User';
import { userCollection } from '@shared/constants';
import { parseIUserToFirestoreUser } from '@shared/functions';
import { getDbRef } from './DBRef';

export interface IUserDao {
    getOne: (email: string) => Promise<any>;
    getAll: () => Promise<any>;
    add: (user: IUser) => Promise<any>;
    update: (user: IUser) => Promise<any>;
    delete: (id: string) => Promise<any>;
}

const db = getDbRef();

class UserDao implements IUserDao {


    /**
     * @param userId
     */
    public async getOne(userId: string): Promise<any> {
        return db.collection(userCollection).doc(userId).get();
    }


    public async getByEmail(email: string): Promise<any> {
        return db.collection(userCollection).where('email', '==', email).get();
    }


    /**
     *
     */
    public async getAll(): Promise<any> {
        return db.collection(userCollection).get();
    }


    /**
     *
     * @param user
     */
    public async add(user: IUser): Promise<any> {
        const fireUser = parseIUserToFirestoreUser(user);
        return db.collection(userCollection).add(fireUser);
    }


    /**
     *
     * @param user
     */
    public async update(user: IUser): Promise<any> {
        const fireUser = parseIUserToFirestoreUser(user);
        return db.collection(userCollection).doc(user.id.toString()).set(fireUser, { merge: true });
    }


    /**
     *
     * @param id
     */
    public async delete(id: string): Promise<any> {
        return db.collection('users').doc(id).delete();
    }
}

export default UserDao;
