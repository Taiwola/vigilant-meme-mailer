import {Request, Response} from "express";
import { createSubscription, findAllSubscribers, findOneSubscriber, removeSubscriber, findOne, findOneEmailSubscriber, findOneByEmail } from "../services"
import { validateEmail } from "../util/email.validator";


// Create a new subscription
export const createSubscriber = async (req: Request, res: Response) => {
    const { email, newsletterOwnerEmail } = req.body;

    // Validate input
    if (!email || !newsletterOwnerEmail) {
        return res.status(400).json({ message: "Email and newsletterOwnerEmail are required" });
    }

    try {
        const [isMailValid, user, emailExist] = await Promise.all([
            validateEmail(email), // Check if the email is valid
            findOneByEmail(newsletterOwnerEmail), // Find the newsletter owner
            findOneEmailSubscriber(email) // Check if the email already exists in the subscribers list
        ]);

        // If email is invalid, return error response
        if (!isMailValid) {
            return res.status(400).json({ message: "Input a valid email" });
        }

        // Check if the newsletter owner exists
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Check if the email already exists in the subscribers list
        if (emailExist) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create the subscription
        const subscription = await createSubscription({ email, newsletterOwnerId: user._id.toString() });

        // Respond with sanitized subscription
        return res.status(201).json({
            message: "Subscription created successfully",
            subscription, // Ensure no sensitive fields are exposed
        });
    } catch (error: any) {
        // Log the error in non-production environments
        if (process.env.NODE_ENV !== "production") {
            console.error("Error creating subscription:", error);
        }
        console.error("Error creating subscription:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export const getAllSubcriber = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    try {
        const userExist = await findOne(userId as string);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
            }
            const subscribers = await findAllSubscribers(userId as string);
            return res.status(200).json({
                message: "Subscribers found",
                subscriber: subscribers || [],
            })
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const getSubscriberById = async (req: Request, res: Response) => {
    const { Id } = req.params;

    try {
        const subscriber = await findOneSubscriber(Id);
        if (!subscriber) {
            return res.status(404).json({ message: "Subscriber not found" });
        }
        return res.status(200).json({
            message: "Subscriber retrieved successfully",
            subscriber,
        });
    } catch (error) {
        console.error("Error retrieving subscriber:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteSubscriber = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const subscription = await removeSubscriber(id);
        if (!subscription) {
            return res.status(404).json({ message: "Subscriber not found" });
        }
        return res.status(200).json({
            message: "Subscriber removed successfully",
            subscription,
        });
    } catch (error) {
        console.error("Error removing subscriber:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};