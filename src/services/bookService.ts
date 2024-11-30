import BookHistory from "../models/bookHistoryModel";
import Book from "../models/bookModel";

export const createBookService = async (book: Omit<Book, "id">) => {
  const { id, name, ...rest } = await Book.create(book);
  return { id, name };
};

export const borrowBookService = async (userId: number, bookId: number) => {
  const borrowedBookRecord = await BookHistory.create({
    user_id: userId,
    book_id: bookId,
    borrow_date: Date.now(),
    status: "borrowed",
  });
  return borrowedBookRecord;
};

export const returnBookService = async (userId: number, bookId: number) => {
  const bookHistoryRecord = await BookHistory.findOne({
    where: {
      user_id: userId,
      book_id: bookId,
      return_date: null,
      status: "borrowed",
    },
  });
  await bookHistoryRecord.update({
    return_date: Date.now(),
    status: "returned",
  });
  return bookHistoryRecord;
};

export const getAllBooksService = async () => {
  const books = await Book.findAll({ attributes: ["id", "name"] });
  return books;
};

export const getBookByIdService = async (id: number) => {
  const book = await Book.findByPk(id);
  return book;
};

export const isBookAvailableService = async (bookId: number) => {
  const borrowedBook = await BookHistory.findAll({
    where: {
      book_id: bookId,
      return_date: null,
      status: "borrowed",
    },
  });

  return borrowedBook.length < 1 ? true : false;
};

export const isBookReturnableService = async (
  userId: number,
  bookId: number
) => {
  const borrowedBook = await BookHistory.findAll({
    where: {
      user_id: userId,
      book_id: bookId,
      return_date: null,
      status: "borrowed",
    },
  });

  return borrowedBook.length === 1 ? true : false;
};

export const updateBookService = async (id: number, user: Omit<Book, "id">) => {
  const existingBook = await Book.findByPk(id);
  await existingBook.update(user);
  return { ...existingBook };
};

export const deleteBookService = async (id: number) => {
  const book = await Book.findByPk(id);
  await book.destroy();
};
