import { Router } from 'express';

import {
    obtenerPlanNegocio} from '../Controladores/PlanCtrl.js';

import { verificarToken } from '../middlewares/auth.js';

const router = Router();


router.get(
    '/',
    verificarToken,
    obtenerPlanes
);



export default router;