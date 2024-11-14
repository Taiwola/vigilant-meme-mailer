import jwt from "jsonwebtoken";
import {create, findOneByEmail} from "../services";
import {Request, Response} from "express";
import bcrypt from "bcryptjs";


export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExist = await findOneByEmail(email);
    if (userExist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash the password
    const hashPwd = await bcrypt.hash(password, 10);

    // Prepare user data
    const data: User = {
      name,
      email,
      password: hashPwd,
    };

    // Create new user
    const createUser = await create(data);

    // Generate JWT token
    const token = jwt.sign(
      { id: createUser._id, email: createUser.email },
      process.env.SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    // Respond with the created user and token
    return res.status(201).json({
      message: "User created successfully",
      user: createUser,
      token,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await findOneByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    // Respond with user info and token
    return res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
