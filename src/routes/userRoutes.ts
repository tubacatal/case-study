import { Router } from "express";
import { check } from "express-validator";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/userController";
import { validationMiddleware } from "../middlewares/validationMiddleware";

const router = Router();

router.post(
  "/",
  [
    check("name")
      .isString()
      .withMessage("Name must be a string")
      .notEmpty()
      .withMessage("Name is required"),
  ],
  validationMiddleware,
  createUser
);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
