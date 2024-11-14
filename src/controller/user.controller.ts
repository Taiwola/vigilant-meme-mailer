import {Request, Response} from "express";
import { findAll, findOne, removeUser, updateUser } from "../services";
import bcrypt from "bcryptjs";

export const findAllUsers = async (req: Request, res: Response) => {
    const users = await findAll();
    res.status(200).json({
        message: "Request successfull",
        users
    });
}

export const findOneUser = async (req: Request, res: Response) => {
    const {Id} = req.params;
    try {
        const user = await findOne(Id);
        if (user === null) {
            res.status(404).json({
                message: "User not found"
                });
        }

        return res.status(200).json({
            message: "Request successfull",
            user
        })
    } catch (error) {
        console.error("Error in getting user: ", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const update = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const { id } = req.params;
  
    try {
      const user = await findOne(id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      const data: Partial<User> = {
        name,
        email,
      };
  
      // Hash password if it is being updated
      if (password) {
        data.password = await bcrypt.hash(password, 10);
      }
  
      await updateUser(user._id.toString(), data);
  
      return res.status(200).json({
        message: "User updated successfully",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

export const remove = async (req: Request, res: Response) => {
    const { Id } = req.params;
    try {
        const user = await findOne(Id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
            }
            await removeUser(user._id.toString());
            return res.status(200).json({message: "User deleted successfully"});
            } catch (error) {
                console.error("Error deleting user:", error);
                return res.status(500).json({message: "Internal server error"});
            }
}