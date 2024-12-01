import { Router } from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "../controllers/bookController";
import { check } from "express-validator";
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
  createBook
);
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
