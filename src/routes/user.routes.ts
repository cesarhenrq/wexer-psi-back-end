import { Router } from "express";

const userRouter = Router();

import upload from "../configs/storage-config";

import UserModule from "../app/users/user.module";

const userController = UserModule.build().controller;

userRouter.post(
  "/",
  upload.single("image"),
  userController.create.bind(userController)
);

export default userRouter;
