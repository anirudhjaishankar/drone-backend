import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED } from 'http-status-codes';

import { UserRoles } from '@entities/User';
import { cookieProps } from '@shared/constants';
import { JwtService } from '@shared/JwtService';
import logger from '@shared/Logger';
import { createLogger } from 'winston';



const jwtService = new JwtService();


// Middleware to verify if user is an admin
export const adminMW = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get json-web-token
        const jwt = req.signedCookies[cookieProps.key];
        if (!jwt) {
            throw Error('JWT not present in signed cookie.');
        }
        // Make sure user role is an admin
        const clientData = await jwtService.decodeJwt(jwt);
        if (clientData.role === UserRoles.Admin) {
            res.locals.userId = clientData.id;
            next();
        } else {
            throw Error('JWT doesnt belong to admin account.');
        }
    } catch (err) {
        logger.error(err);
        return res.status(UNAUTHORIZED).json({
            error: err.message,
        });
    }
};

export const userMW = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwt = req.signedCookies[cookieProps.key];
        if (!jwt) {
            throw Error('JWT not present in signed cookie.');
        }
        const clientData = await jwtService.decodeJwt(jwt);
        if (typeof clientData === 'string') {
            throw Error(clientData);
        } else {
            res.locals.userId = clientData.id;
            next();
        }
    } catch (err) {
        logger.error(err);
        return res.status(UNAUTHORIZED).json({
            error: err.message,
        });
    }
}
