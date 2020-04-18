import { Request, Response, Router } from 'express';
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, CREATED } from 'http-status-codes';
import logger from '@shared/Logger';
import DroneRouteDao from '@daos/DroneRoutes';
import ApiResponse from '@entities/ApiResponse';
import { noRoutesAvailable, dataNotFound, getFailed, paramMissingError, droneRouteAddSuccess, updateFailed, updateSuccessfull, deleteSuccess, deleteFailed } from '@shared/constants';
import { DroneRoute } from '@entities/DroneRoute';
import { ParamsDictionary } from 'express-serve-static-core';
import { userMW } from './middleware';


const router = Router().use(userMW);
const droneRouteDao = new DroneRouteDao();


/******************************************************************************
 *                      Get All Drone Routes - "GET /api/droneroutes/all"
 ******************************************************************************/


router.get('/all', async (req: Request, res: Response) => {
    await droneRouteDao.getAll().then((docData) => {
        if (docData.empty) {
            const apiResponse: ApiResponse<string> = {
                status: OK,
                message: noRoutesAvailable
            }
            return res.status(OK).json(apiResponse).end();
        } else {
            const droneRoutes: DroneRoute[] = [];

            docData.forEach((doc: any) => {
                logger.info(JSON.stringify(doc.data()));
                const droneRoute: DroneRoute = doc.data();
                droneRoute.id = doc.id;
                droneRoutes.push(droneRoute);
            });

            const apiResponse: ApiResponse<DroneRoute[]> = {
                status: OK,
                message: droneRoutes
            };

            return res.status(OK).json(apiResponse).end();
        }
    });
});

/******************************************************************************
 *                      Get One Drone Route - "GET /api/droneroutes/get/:id"
 ******************************************************************************/

router.get('/get/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    return await droneRouteDao.getOne(id).then((result: any) => {
        if (!result.exists) {
            const apiResponse: ApiResponse<string> = {
                status: OK,
                message: dataNotFound
            };
            return res.status(OK).json(apiResponse).end();
        } else {
            const droneRoute: DroneRoute = result.data();
            droneRoute.id = result.id;

            const apiResponse: ApiResponse<DroneRoute> = {
                status: OK,
                message: droneRoute
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
 *                      Add Drone Route - "POST /api/droneroutes/add"
 ******************************************************************************/


router.post('/add', async (req: Request, res: Response) => {

    // logger.info(JSON.stringify(req.body));
    const { droneRoute } = req.body;

    if (!droneRoute) {
        const apiResponse: ApiResponse<string> = {
            status: BAD_REQUEST,
            message: paramMissingError
        };
        return res.status(BAD_REQUEST).json(apiResponse).end();
    }

    return await droneRouteDao.add(droneRoute).then((result) => {

        const apiResponse: ApiResponse<string> = {
            status: CREATED,
            message: droneRouteAddSuccess
        };

        return res.status(CREATED).json(apiResponse).end();
    }).catch((rej: any) => {
        logger.error(JSON.stringify(rej));
        return res.status(INTERNAL_SERVER_ERROR).end();
    });
});

/******************************************************************************
 *                      Update Drone Route - "PUT /api/droneroutes/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    const { droneRoute } = req.body;
    if (!droneRoute) {
        const apiResponse: ApiResponse<string> = {
            status: BAD_REQUEST,
            message: paramMissingError
        };
        return res.status(BAD_REQUEST).json(apiResponse).end();
    }

    return await droneRouteDao.update(droneRoute).then((result: any) => {
        const apiResponse: ApiResponse<string> = {
            status: OK,
            message: updateSuccessfull
        }
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


/******************************************************************************
 *                      Delete Drone Route - "DELETE /api/droneroutes/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    return await droneRouteDao.delete(id).then((result: any) => {
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


export default router;