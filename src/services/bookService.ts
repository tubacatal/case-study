import BookHistory from "../models/bookHistoryModel";
import Book from "../models/bookModel";
import Rating from "../models/ratingModel";

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

export const returnBookService = async (
  userId: number,
  bookId: number,
  score: number
) => {
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
  await Rating.create({ user_id: userId, book_id: bookId, score });
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

export const getBookByIdWithRatingsService = async (
  bookId: number,
  userId?: number
) => {
  let whereCondition: any = { book_id: bookId };
  userId ? whereCondition.user_id = userId : null;

  console.log(whereCondition);

  const book = await Book.findOne({
    where: { id: bookId },
    include: [
      {
        model: Rating,
        where: whereCondition,
        attributes: ["score"],
      },
    ],
  });

  console.log(book);

  return book;
};

export const isBookAvailableService = async (bookId: number) => {
  const borrowedBook = await BookHistory.findAll({
    where: {
      book_id: bookId,
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
