import { Request, Response } from "express";
import Rating from "../models/ratingModel";
import {
  borrowBookService,
  getBookByIdService,
  isBookAvailableService,
  isBookReturnableService,
  returnBookService,
} from "../services/bookService";
import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  getUserByIdWithHistoryService,
  updateUserService,
} from "../services/userService";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const newUser = await createUserService(user);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await getUserByIdWithHistoryService(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const presentHistory = (user as any)?.BookHistories.filter(
      (history: { status: string }) => history.status === "borrowed"
    ).map((history: { status: string }) => {
      return {
        name: (history as any)?.Book.name,
      };
    });

    const pastHistory = (user as any)?.BookHistories.filter(
      (history: { status: string }) => history.status === "returned"
    ).map((history: { status: string }) => {
      return {
        name: (history as any)?.Book.name,
        userScore:
          (history as any)?.Book?.Ratings?.map(
            (rating: Rating) => rating?.score
          ).reduce(
            (acc: number, currentValue: number) => acc + currentValue,
            0
          ) / (history as any)?.Book?.Ratings.length,
      };
    });

    return res.status(200).json({
      id: user.id,
      name: user.name,
      books: {
        past: [
          ...new Map(
            pastHistory.map((history: any) => [history.name, history])
          ).values(),
        ],
        present: presentHistory,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = req.body;
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const updatedUser = await updateUserService(userId, user);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await getUserByIdService(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await deleteUserService(userId);

    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const userBorrowBook = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = Number(req.params.userId);
    const bookId = Number(req.params.bookId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await getUserByIdService(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isNaN(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await getBookByIdService(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const isBookAvailable = await isBookAvailableService(bookId);

    if (isBookAvailable) {
      const borrowedBook = await borrowBookService(userId, bookId);
      // console.log(borrowedBook);
      res.sendStatus(204);
    } else {
      return res.status(400).json({ message: "Book is not available" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const userReturnBook = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = Number(req.params.userId);
    const bookId = Number(req.params.bookId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await getUserByIdService(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isNaN(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await getBookByIdService(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const isBookReturnable = await isBookReturnableService(userId, bookId);

    if (isBookReturnable) {
      const score = Number(req.body.score);
      if (isNaN(score)) {
        return res.status(400).json({ message: "Invalid score" });
      } else {
        const returnedBook = await returnBookService(userId, bookId, score);
        // console.log(returnedBook);
        res.sendStatus(204);
      }
    } else {
      return res.status(400).json({ message: "Book cannot be returned" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
