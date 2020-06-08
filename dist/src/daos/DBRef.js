"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const admin = tslib_1.__importStar(require("firebase-admin"));
let db;
function getDbRef() {
    if (db) {
        return db;
    }
    else {
        const serviceAccount = require('../../env/drone-backend-firebase-adminsdk-lk4zp-67f135290c.json');
        const fire = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
        return db;
    }
}
exports.getDbRef = getDbRef;
//# sourceMappingURL=DBRef.js.map