import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import UserDao from '@daos/User';
import { paramMissingError, noUsers, pwdSaltRounds, mailSenderError, updateSuccessfull, updateFailed, deleteFailed, deleteSuccess, addUserSuccess, hashError, userNotFound, getFailed } from '@shared/constants';
import { userMW, adminMW } from './middleware';
import { UserRoles, User } from '@entities/User';
import bcrypt from 'bcrypt';
import ApiResponse from '@entities/ApiResponse';
import { parseFirestoreUserDocToIUser, sendPasswordToMail } from '@shared/functions';

import generatePassword = require('password-generator');
import logger from '@shared/Logger';


// Init shared
const router = Router().use(userMW);
const userDao = new UserDao();


/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', adminMW, async (req: Request, res: Response) => {
    await userDao.getAll().then((docData) => {
        if (docData.empty) {
            return res.status(OK).json({ message: noUsers });
        } else {
            const users: User[] = [];

            docData.forEach((doc: any) => {
                const user = parseFirestoreUserDocToIUser(doc.id, doc.data());
                user.pwdHash = '';
                users.push(user);
            });

            const apiResponse: ApiResponse<User[]> = {
                status: OK,
                message: users
            };

            return res.status(OK).json(apiResponse).end();
        }
    });
});



/******************************************************************************
 *                      Get One User - "GET /api/users/get/:id"
 ******************************************************************************/
router.get('/get/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    return await userDao.getOne(id).then((result: any) => {
        if (!result.exists) {
            const apiResponse: ApiResponse<string> = {
                status: OK,
                message: userNotFound
            };
            return res.status(OK).json(apiResponse).end();
        } else {
            const apiResponse: ApiResponse<User> = {
                status: OK,
                message: parseFirestoreUserDocToIUser(result.id, result.data())
            };
            return res.status(OK).json(apiResponse).end();
        }
    }).catch((err: any) => {
        logger.error(err);
        const apiResponse: ApiResponse<string> = {
            status: INTERNAL_SERVER_ERROR,
            message: getFailed
        };
        return res.status(INTERNAL_SERVER_ERROR).json(apiResponse).end();
    });
});




/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post('/add', adminMW, async (req: Request, res: Response) => {
    // Check parameters
    const { user } = req.body;
    if (!user) {
        const apiResponse: ApiResponse<string> = {
            status: BAD_REQUEST,
            message: paramMissingError
        };

        return res.status(BAD_REQUEST).json(apiResponse).end();
    }
    // Add new user
    user.role = UserRoles.Standard;
    const pass = generatePassword(10, false);
    return bcrypt.hash(pass, pwdSaltRounds, async (err, hash) => {
        if (err) {
            logger.error(hashError);
            logger.error(err);
            return res.status(INTERNAL_SERVER_ERROR).end();
        } else {
            // Set pass for user obj
            user.pwdHash = hash;
            // Trigger mailer
            return sendPasswordToMail(user.email, pass).then(async (isMailSent: any) => {
                logger.info(isMailSent);
                if (!isMailSent) {
                    logger.info(mailSenderError);
                    return res.status(INTERNAL_SERVER_ERROR).end();
                } else {
                    await userDao.add(user);
                    const responseObject: ApiResponse<string> = {
                        status: CREATED,
                        message: addUserSuccess
                    };
                    return res.status(CREATED).json(responseObject).end();
                }
            }, (error: any) => {
                logger.error(error);
                return res.status(INTERNAL_SERVER_ERROR).end();
            }).catch((error: any) => {
                logger.error(error);
                return res.status(INTERNAL_SERVER_ERROR).end();
            });
        }
    });
});


/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    // Check Parameters
    const { user } = req.body;
    if (!user) {
        const apiResponse: ApiResponse<string> = {
            status: BAD_REQUEST,
            message: paramMissingError
        };
        return res.status(BAD_REQUEST).json(apiResponse).end();
    }
    return bcrypt.hash(user.password, pwdSaltRounds, async (err, hash) => {
        user.pwdHash = hash;
        // Update user
        return await userDao.update(user).then((result: any) => {
            const apiResponse: ApiResponse<string> = {
                status: OK,
                message: updateSuccessfull
            };
            return res.status(OK).json(apiResponse).end();
        }).catch((error: any) => {
            logger.error(error);
            const apiResponse: ApiResponse<string> = {
                status: INTERNAL_SERVER_ERROR,
                message: updateFailed
            };
            return res.status(INTERNAL_SERVER_ERROR).json(apiResponse).end();
        });
    });

});


/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', adminMW, async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    return await userDao.delete(id).then((result: any) => {
        const apiResponse: ApiResponse<string> = {
            status: OK,
            message: deleteSuccess
        };
        return res.status(OK).json(apiResponse).end();
    }).catch((err: any) => {
        logger.error(err);
        const apiResponse: ApiResponse<string> = {
            status: INTERNAL_SERVER_ERROR,
            message: deleteFailed
        };
        return res.status(INTERNAL_SERVER_ERROR).json(apiResponse).end();
    });
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
