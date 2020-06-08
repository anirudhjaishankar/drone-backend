import { Request, Response, Router } from 'express';
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, CREATED } from 'http-status-codes';
import logger from '@shared/Logger';
import ApiResponse from '@entities/ApiResponse';
import { dataNotFound, getFailed, paramMissingError, droneRouteAddSuccess, updateFailed, updateSuccessfull, deleteSuccess, deleteFailed, noSchedulesAvailable, scheduleAddSuccess } from '@shared/constants';
import { ParamsDictionary } from 'express-serve-static-core';
import { userMW } from './middleware';
import { ScheduleDao } from '@daos/Schedule';
import { Schedule, ScheduleStatus } from '@entities/Schedule';

const job = require('node-schedule');
const multer = require('multer');
const router = Router().use(userMW);
const scheduleDao = new ScheduleDao();


const upload = multer({
    dest: '../storage/',
});
/******************************************************************************
 *                      Get All Schedules - "GET /api/feeds/all"
 ******************************************************************************/


router.get('/all', async (req: Request, res: Response) => {
    await scheduleDao.getAll().then((docData) => {
        if (docData.empty) {
            const apiResponse: ApiResponse<any> = {
                status: OK,
                message: []
            }
            return res.status(OK).json(apiResponse).end();
        } else {
            const schedules: Schedule[] = [];

            docData.forEach((doc: any) => {
                logger.info(JSON.stringify(doc.data()));
                const schedule: Schedule = doc.data();
                schedule.id = doc.id;
                schedules.push(schedule);
            });

            const apiResponse: ApiResponse<Schedule[]> = {
                status: OK,
                message: schedules
            };

            return res.status(OK).json(apiResponse).end();
        }
    });
});

/******************************************************************************
 *                      Get One Schedule - "GET /api/feeds/get/:id"
 ******************************************************************************/

router.get('/get/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    return await scheduleDao.getOne(id).then((result: any) => {
        if (!result.exists) {
            const apiResponse: ApiResponse<string> = {
                status: OK,
                message: dataNotFound
            };
            return res.status(OK).json(apiResponse).end();
        } else {
            const schedule: Schedule = result.data();
            schedule.id = result.id;

            const apiResponse: ApiResponse<Schedule> = {
                status: OK,
                message: schedule
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
 *                      Upload video - "POST /api/feeds/upload:id"
 ******************************************************************************/


router.post('/upload:id', upload.single('droneVideo'), async (req: any, res: any) => {
    const { id } = req.params as ParamsDictionary;

    logger.info(JSON.stringify(req.body), JSON.stringify(req.file.filename));
    return res.status(OK).end();


    // return await scheduleDao.add(schedule).then((result) => {

    //     const apiResponse: ApiResponse<string> = {
    //         status: CREATED,
    //         message: scheduleAddSuccess
    //     };

    //     const scheduleDate: Date = new Date(schedule.dateTime);
    //     job.scheduleJob(scheduleDate, () => {
    //         logger.info(JSON.stringify(schedule));
    //         logger.info('Triggered');
    //     });

    //     return res.status(CREATED).json(apiResponse).end();
    // }).catch((rej: any) => {
    //     logger.error(JSON.stringify(rej));
    //     return res.status(INTERNAL_SERVER_ERROR).end();
    // });
});


/******************************************************************************
 *                      Add Schedule - "POST /api/feeds/add"
 ******************************************************************************/


router.post('/add', async (req: any, res: Response) => {

    // logger.info(JSON.stringify(req.body));
    const schedule: Schedule = req.body.schedule;
    let video: any;
    if (schedule.isVideo) {
        logger.info(JSON.stringify(req.files))
        // video = req.files.droneVideo;
    }
    logger.info(JSON.stringify(schedule));

    if (!schedule) {
        const apiResponse: ApiResponse<string> = {
            status: BAD_REQUEST,
            message: paramMissingError
        };
        return res.status(BAD_REQUEST).json(apiResponse).end();
    }

    if (schedule.isVideo) {
        schedule.status = ScheduleStatus.uploaded;
    } else {
        schedule.status = ScheduleStatus.scheduled;
    }
    logger.info(JSON.stringify(schedule));

    return await scheduleDao.add(schedule).then((result) => {

        const apiResponse: ApiResponse<string> = {
            status: CREATED,
            message: result.id
        };
        if (video != null) {
            video.mv('../storage/' + result.id + '.mp4', () => {
                return res.status(OK).end();
            });
        }
        if (!schedule.isVideo) {
            const scheduleDate: Date = new Date(schedule.dateTime);
            job.scheduleJob(scheduleDate, () => {
                logger.info(JSON.stringify(schedule));
                logger.info('Triggered');
            });
        }

        return res.status(CREATED).json(apiResponse).end();
    }).catch((rej: any) => {
        logger.error(JSON.stringify(rej));
        return res.status(INTERNAL_SERVER_ERROR).end();
    });
});

/******************************************************************************
 *                      Update Schedule - "PUT /api/feeds/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    const { schedule } = req.body;
    if (!schedule) {
        const apiResponse: ApiResponse<string> = {
            status: BAD_REQUEST,
            message: paramMissingError
        };
        return res.status(BAD_REQUEST).json(apiResponse).end();
    }

    return await scheduleDao.update(schedule).then((result: any) => {
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
 *                      Delete Schedule - "DELETE /api/feeds/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    return await scheduleDao.delete(id).then((result: any) => {
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