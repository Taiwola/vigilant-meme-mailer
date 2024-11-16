import { Request, Response } from "express";
import { generalAnalyticData } from "../services/analytics.services";
import Subscriber from "../model/subscriber.model";


export const getSubscriberAnalytics = async (req: Request, res: Response) => {
    try {
        const newsletterOwnerId = req.user?.id; // Assuming `req.user` has the logged-in user's details

        // Check if the user exists and has the right permissions
        if (!newsletterOwnerId) {
            return res.status(400).json({ message: "Invalid user or user not authenticated" });
        }

        // Call the service function to get analytics data
        const { last7months } = await generalAnalyticData(Subscriber, newsletterOwnerId);

        return res.status(200).json({
            message: "Subscriber analytics fetched successfully",
            data: { last7months }
        });
    } catch (error) {
        console.error("Error fetching subscriber analytics:", error);
        return res.status(500).json({ message: "Failed to retrieve subscriber analytics"});
    }
};
