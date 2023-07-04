import { Router } from "express";

const userRouter = Router();

import upload from "../configs/storage-config";
import AuthMiddleware from "../common/middlewares/auth.middleware";

import UserModule from "../app/users/user.module";

const userController = UserModule.build().controller;

userRouter.post(
  "/",
  upload.single("image"),
  userController.create.bind(userController)
);

userRouter.use(AuthMiddleware.execute.bind(AuthMiddleware));

userRouter.patch(
  "/:id",
  upload.single("image"),
  userController.update.bind(userController)
);

userRouter.delete("/:id", userController.delete.bind(userController));

export default userRouter;
