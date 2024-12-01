import { Router } from "express";
import { check } from "express-validator";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  userBorrowBook,
  userReturnBook,
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
router.post("/:userId/borrow/:bookId", userBorrowBook);
router.post("/:userId/return/:bookId", [
  check("score")
    .isInt()
    .withMessage("Score must be an integer")
    .notEmpty()
    .withMessage("Score is required"),
],
validationMiddleware,userReturnBook);

export default router;
