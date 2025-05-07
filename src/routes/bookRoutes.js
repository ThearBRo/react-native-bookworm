import express from "express";
import { protectRoutes } from "../middleware/auth.middleware.js";
import {
  postBooks,
  allBooks,
  deleteBooks,
  userBooks,
} from "../controller/userControl.js";

const router = express.Router();

router
  .get("/user", protectRoutes, userBooks)
  .post("/", protectRoutes, postBooks)
  .get("/", protectRoutes, allBooks)
  .delete("/:id", protectRoutes, deleteBooks);

export default router;
