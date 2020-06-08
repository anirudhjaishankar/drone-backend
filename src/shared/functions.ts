import logger from './Logger';
import { User, UserRoles } from '@entities/User';
import { gmailAccountUsername, gmailAccountPassword } from '../../env/development';

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailAccountUsername,
        pass: gmailAccountPassword
    }
});


export const pErr = (err: Error) => {
    if (err) {
        logger.error(err);
    }
};


export const getRandomInt = () => {
    return Math.floor(Math.random() * 1_000_000_000_000);
};


export const parseFirestoreUserDocToIUser = (docId: number, docData: any): User => {
    const user: User = new User();
    user.email = docData.email;
    user.id = docId;
    user.name = docData.name;
    if (docData.is_admin === 1) {
        user.role = UserRoles.Admin;
    } else {
        user.role = UserRoles.Standard;
    }

    user.pwdHash = docData.pass_hash;

    return user;
}

export const parseIUserToFirestoreUser = (user: User): any => {
    const fireUser = {
        email: user.email,
        is_admin: user.role === UserRoles.Admin ? 1 : 0,
        name: user.name,
        pass_hash: user.pwdHash,
    };
    return fireUser;
}


export const sendPasswordToMail = async (email: string, password: string): Promise<boolean> => {
    const mailOptions = {
        from: gmailAccountUsername,
        to: email,
        subject: 'Auto generated password for DroneBlaze',
        text: 'Your auto generated password is ' + password + '. Kindly dont share it.'
    };

    const info = await transporter.sendMail(mailOptions);
    return new Promise<boolean>((resolve, reject) => {
        if (info) {
            resolve(true);
        } else {
            reject(false);
        }
    });
}
