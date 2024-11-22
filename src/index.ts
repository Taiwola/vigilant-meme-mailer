import dotenv from "dotenv"
import express, {Request, Response} from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import mongoose from "mongoose";
import path from "path";
import {AuthRouter} from "./routes/auth.routes"
import { NewsletterRouter } from "./routes/newsletter.routes";


declare global {
  namespace Express {
      interface Request {
          user?: {
              id: string; // or any type you need for user
              email: string
          };
      }
  }
}

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from environment or default to 3000

// Middleware
app.use(helmet()); // Adds security headers
app.use(compression()); // Compresses responses
app.use(express.json()); // Parses JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded requests

// Static files
app.use(express.static(path.join(__dirname, "public"))); // Serves static files from the "public" directory
app.use(
  cors({
    origin: "*",
  })
);// Enables CORS


// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Express server!");
});

app.use('/api/auth',AuthRouter);
app.use('/api/newsletter', NewsletterRouter);

// Database connection
try {
  const url = process.env.MONGO_URI || "mongodb://localhost:27017/newsletter_db";
  mongoose.set("strictQuery", true);
  mongoose.connect(url);
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Failed to connect to MongoDB", error);
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
