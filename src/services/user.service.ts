import UserModel from "../model/user.model";

export const create = async (data: User) => {
  try {
    const createUser = await UserModel.create(data);
    return createUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const findAll = async () => {
  try {
    const users = await UserModel.find();
    return users;
  } catch (error) {
    console.error("Error finding users:", error);
    throw error;
  }
};

export const findOne = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId);
    return user || null;
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
};

export const findOneByEmail = async (email: string) => {
    try {
      const user = await UserModel.findOne({email: email});
      return user || null;
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  };

export const updateUser = async (userId: string, data: Partial<User>) => {
  try {
    const updateUser = await UserModel.findByIdAndUpdate(userId, data, { new: true });
    return updateUser || null;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const removeUser = async (userId: string) => {
  try {
    const removedUser = await UserModel.findByIdAndDelete(userId);
    return removedUser || null;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
