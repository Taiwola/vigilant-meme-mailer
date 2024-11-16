import {Request, Response} from "express";
import { createSubscription, findAllSubscribers, findOneSubscriber, removeSubscriber, findOne, findOneEmailSubscriber } from "../services"


// Create a new subscription
export const createSubscriber = async (req: Request, res: Response) => {
    const { email, newsletterOwnerId } = req.body;
    try {
        const emailExist = await findOneEmailSubscriber(email);
        if (emailExist) return res.status(400).json({message: 'Email already exist'});
        const subscription = await createSubscription({ email, newsletterOwnerId });
        return res.status(201).json({
            message: "Subscription created successfully",
            subscription,
        });
    } catch (error) {
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