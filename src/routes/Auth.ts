import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';

import UserDao from '@daos/User';
import { JwtService } from '@shared/JwtService';
import { paramMissingError, loginFailedErr, cookieProps, loginSuccess, logoutMessage } from '@shared/constants';
import { User } from '@entities/User';
import { parseFirestoreUserDocToIUser } from '@shared/functions';


const router = Router();
const userDao = new UserDao();
const jwtService = new JwtService();


/******************************************************************************
 *                      Login User - "POST /api/auth/login"
 ******************************************************************************/

router.post('/login', async (req: Request, res: Response) => {
    // Check email and password present
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    // Fetch user
    return userDao.getOne(email).then( async docData => {
        if (docData.empty) {
            return res.status(UNAUTHORIZED).json({
                error: loginFailedErr,
            });
        }

        const doc: any = docData.docs[0];
        const user: User = parseFirestoreUserDocToIUser(doc.id, doc.data());
        // Check password
        const pwdPassed = await bcrypt.compare(password, user.pwdHash);
        if (!pwdPassed) {
            return res.status(UNAUTHORIZED).json({
                error: loginFailedErr,
            });
        }

        // Setup Admin Cookie
        const jwt = await jwtService.getJwt({
            id: user.id,
            role: user.role,
        });
        const { key, options } = cookieProps;
        res.cookie(key, jwt, options);
        // Return
        return res.status(OK).json({success: loginSuccess}).end();
    });
});


/******************************************************************************
 *                      Logout - "GET /api/auth/logout"
 ******************************************************************************/

router.get('/logout', async (req: Request, res: Response) => {
    const { key, options } = cookieProps;
    res.clearCookie(key, options);
    return res.status(OK).json({message: logoutMessage}).end();
});


/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
