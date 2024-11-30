import { Request, Response } from "express";
import {
  createBookService,
  getAllBooksService,
  getBookByIdService,
  updateBookService,
  deleteBookService,
} from "../services/bookService";

export const createBook = async (req: Request, res: Response) => {
  try {
    const book = req.body;
    const newBook = await createBookService(book);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await getAllBooksService();
    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getBookById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const bookId = Number(req.params.id);

    if (isNaN(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await getBookByIdService(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateBook = async (req: Request, res: Response): Promise<any> => {
  try {
    const book = req.body;
    const bookId = Number(req.params.id);

    if (isNaN(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const updatedBook = await updateBookService(bookId, book);
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<any> => {
  try {
    const bookId = Number(req.params.id);

    if (isNaN(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await getBookByIdService(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await deleteBookService(bookId);

    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
