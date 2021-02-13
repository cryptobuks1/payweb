"use strict";

import {getDashboardStatus, postDashboardStatus, patchDashboardStatus, finishActivation} from '../controller/dashboardStatus';
import { isTokenValid } from './interceptor'

router.patch('/service/status',isTokenValid, patchDashboardStatus);
router.post('/service/statusInsert',isTokenValid, postDashboardStatus);
router.get('/service/status',isTokenValid, getDashboardStatus);
router.get('/service/activate', isTokenValid, finishActivation);

module.exports = router;