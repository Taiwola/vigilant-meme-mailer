import {Request, Response} from "express";
import { getOneNewsletter, findAllSubscribers, findOne } from "../services";
import { sendEmail } from "../libs/mailer";


export const sendMail = async (req: Request, res: Response) => {

    const { Id } = req.params;
    const userId = req.user?.id;

    const [newsletter, user] = await Promise.all([
        getOneNewsletter(Id),
        findOne(userId as string)
    ]);

    if (!newsletter) {
        return res.status(404).json({ message: "Email does not exist, save mail as draft before sending" });
    }

    if (!user) {
        return res.status(404).json({ message: "User does not exist" });
    }

    try {
        const getAllSubscribers = await findAllSubscribers(user._id.toString());

        const emailPromises = getAllSubscribers.map(async (sub) => {
            const { error, errorMessage } = await sendEmail(sub.email, newsletter.content, newsletter.title);
            if (error) throw new Error(errorMessage);
        });

        await Promise.all(emailPromises);

        return res.status(200).json({ message: "Email sent successfully" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ 
            message: process.env.NODE_ENV === 'production' ? "Internal server error" : error.message 
        });
    }
};
