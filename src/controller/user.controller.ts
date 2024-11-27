import {Request, Response} from "express";
import { findAll, findOne, removeUser, updateUser } from "../services";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const ENCRYPTION_KEY = crypto.randomBytes(32);
const IV_LENGTH = 16; // AES block size

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
                return;
        }

        res.status(200).json({
            message: "Request successfull",
            user
        })
    } catch (error) {
        console.error("Error in getting user: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const update = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const { id } = req.params;
  
    try {
      const user = await findOne(id);
      if (!user) {
        res.status(404).json({
          message: "User not found",
        });
        return
      }
  
      const data: Partial<User> = {
        name: name || user.name,
        email: email || user.email,
      };
  
      // Hash password if it is being updated
      if (password) {
        data.password = await bcrypt.hash(password, 10);
      }
  
      const updatedUser = await updateUser(user._id.toString(), data);
  
      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };





// Helper function to encrypt the API key
const encryptApiKey = (data: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
};

// Helper function to decrypt the API key
const decryptApiKey = (encryptedKey: string): string => {
  const [iv, authTag, encryptedData] = encryptedKey.split(":");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    ENCRYPTION_KEY,
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

// Controller to generate API key
export const generateApiKey = async (req: Request, res: Response) => {
  const Id = req.user?.id

  if (!Id) {
    res.status(401).json({ message: "Unauthorized" });
    return
  }
  try {


    const user = await findOne(Id as string);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return
    }

    // Combine user ID and email for the API key payload
    const apiKeyPayload = `${user?._id}`;
    const encryptedApiKey = encryptApiKey(apiKeyPayload);

    res.status(200).json({ apiKey: encryptedApiKey });
  } catch (error) {
    console.error("Error generating API key:", error);
    res.status(500).json({ message: "Failed to generate API key." });
  }
};

// Example endpoint to decrypt API key
export const decryptApiKeyEndpoint = async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ message: "API key is required." });
    }

    const decryptedData = decryptApiKey(apiKey);

    res.status(200).json({ decryptedData });
  } catch (error) {
    console.error("Error decrypting API key:", error);
    res.status(500).json({ message: "Failed to decrypt API key." });
  }
};


export const remove = async (req: Request, res: Response) => {
    const { Id } = req.params;
    try {
        const user = await findOne(Id);
        if (!user) {
            res.status(404).json({message: "User not found"});
            return
            }
            await removeUser(user._id.toString());
            res.status(200).json({message: "User deleted successfully"});
            } catch (error) {
                console.error("Error deleting user:", error);
                res.status(500).json({message: "Internal server error"});
            }
}