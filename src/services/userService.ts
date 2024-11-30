import User from "../models/userModel";

export const createUserService = async (user: Omit<User, "id">) => {
  const newUser = await User.create(user);
  return { ...newUser };
};

export const getAllUsersService = async () => {
  const users = await User.findAll();
  return users;
};

export const getUserByIdService = async (id: number) => {
  const user = await User.findByPk(id);
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
