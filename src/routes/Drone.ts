import { Request, Response, Router } from 'express';
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, CREATED } from 'http-status-codes';
import logger from '@shared/Logger';
import DroneDao from '@daos/Drone';
import ApiResponse from '@entities/ApiResponse';
import { dataNotFound, getFailed, paramMissingError, droneAddSuccess, updateFailed, updateSuccessfull, deleteSuccess, deleteFailed, noDronesAvailable } from '@shared/constants';
import { Drone } from '@entities/Drone';
import { ParamsDictionary } from 'express-serve-static-core';
import { userMW } from './middleware';


const router = Router().use(userMW);
const droneDao = new DroneDao();


/******************************************************************************
 *                      Get All Drones - "GET /api/drone/all"
 ******************************************************************************/


router.get('/all', async (req: Request, res: Response) => {
    await droneDao.getAll().then((docData) => {
        if (docData.empty) {
            const apiResponse: ApiResponse<string> = {
                status: OK,
                message: noDronesAvailable
            }
            return res.status(OK).json(apiResponse).end();
        } else {
            const drones: Drone[] = [];

            docData.forEach((doc: any) => {
                logger.info(JSON.stringify(doc.data()));
                const drone: Drone = doc.data();
                drone.id = doc.id;
                drones.push(drone);
            });

            const apiResponse: ApiResponse<Drone[]> = {
                status: OK,
                message: drones
            };

            return res.status(OK).json(apiResponse).end();
        }
    });
});

/******************************************************************************
 *                      Get One Drone  - "GET /api/drone/get/:id"
 ******************************************************************************/

router.get('/get/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    return await droneDao.getOne(id).then((result: any) => {
        if (!result.exists) {
            const apiResponse: ApiResponse<string> = {
                status: OK,
                message: dataNotFound
            };
            return res.status(OK).json(apiResponse).end();
        } else {
            const drone: Drone = result.data();
            drone.id = result.id;

            const apiResponse: ApiResponse<Drone> = {
                status: OK,
                message: drone
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
 *                      Add Drone  - "POST /api/drone/add"
 ******************************************************************************/


router.post('/add', async (req: Request, res: Response) => {

    // logger.info(JSON.stringify(req.body));
    const { drone } = req.body;

    if (!drone) {
        const apiResponse: ApiResponse<string> = {
            status: BAD_REQUEST,
            message: paramMissingError
        };
        return res.status(BAD_REQUEST).json(apiResponse).end();
    }

    return await droneDao.add(drone).then((result) => {
        const apiResponse: ApiResponse<string> = {
            status: CREATED,
            message: droneAddSuccess
        };

        return res.status(CREATED).json(apiResponse).end();
    }).catch((rej: any) => {
        logger.error(JSON.stringify(rej));
        return res.status(INTERNAL_SERVER_ERROR).end();
    });
});

/******************************************************************************
 *                      Update Drone - "PUT /api/drone/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    const { drone } = req.body;
    if (!drone) {
        const apiResponse: ApiResponse<string> = {
            status: BAD_REQUEST,
            message: paramMissingError
        };
        return res.status(BAD_REQUEST).json(apiResponse).end();
    }

    return await droneDao.update(drone).then((result: any) => {
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
    return await droneDao.delete(id).then((result: any) => {
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