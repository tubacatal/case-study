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
  const user = await User.findOne({
    where: { id },
    attributes: ["id", "name"],
    include: [
      {
        model: BookHistory,
        required: false,
        where: {
          status: ["returned", "borrowed"],
        },
        attributes: ["status"],
        include: [
          {
            model: Book,
            required: true,
            attributes: ["name"],
            include: [
              {
                model: Rating,
                required: false,
                where: {
                  user_id: id,
                },
                attributes: ["score"],
              },
            ],
          },
        ],
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
