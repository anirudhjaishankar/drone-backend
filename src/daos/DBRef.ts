import * as admin from 'firebase-admin';

let db: any;

// frebase admin SDK setup
export function getDbRef(): any {
    if (db) {
        return db;
    } else {
        const serviceAccount = require('../../env/drone-backend-firebase-adminsdk-lk4zp-67f135290c.json');

        const fire = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
        return db;
    }
}