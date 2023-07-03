import { Router } from "express";

import reqInfoMiddleware from "../common/middlewares/req-info.middleware";

const routes = Router();

routes.use(reqInfoMiddleware);

export default routes;
