import { Op } from "sequelize";
import BookHistory from "../models/bookHistoryModel";
import Book from "../models/bookModel";
import Rating from "../models/ratingModel";
import User from "../models/userModel";

export const createUserService = async (user: Omit<User, "id">) => {
  const { id, name, ...rest } = await User.create(user);
  return { id, name };
};

export const getAllUsersService = async () => {
  const users = await User.findAll({
    attributes: ["id", "name"],
  });
  return users;
};

export const getUserByIdService = async (id: number) => {
  const user = await User.findByPk(id);
  return user;
};

export const getUserByIdWithHistoryService = async (id: number) => {
  const user = (await User.findOne({
    where: { id },
    attributes: ["id", "name"],
    include: [
      {
        model: BookHistory,
        where: {
          status: ["returned", "borrowed"],
        },
        attributes: ["book_id", "status"],
        include: [
          {
            model: Book,
            attributes: ["name"],
          },
        ],
      },
    ],
  })) as any;

  console.log("USERRRRRRR---->", user);

  /* const present = user.BookHistory.filter(
    (history: { status: string; }) => history.status === "borrowed"
  );
  const past = user.BookHistory.filter(
    (history: { status: string; }) => history.status === "returned"
  ); */

  /* console.log(present);
  console.log(past); */

  const pastBooksWithRatings = await BookHistory.findAll({
    where: {
      user_id: id,
      status: "returned",
    },
    include: [
      {
        model: Book,
        attributes: ["name"],
      },
      {
        model: Rating,
        where: {
          book_id: { [Op.col]: "BookHistory.book_id" },
        },
        attributes: ["score"],
      },
    ],
  });

  return user;
};

export const updateUserService = async (id: number, user: Omit<User, "id">) => {
  const existingUser = await User.findByPk(id);
  await existingUser.update(user);
  return { ...existingUser };
};

export const deleteUserService = async (id: number) => {
  const user = await User.findByPk(id);
  await user.destroy();
};
