import { createNewsletter, findOne, getAllNewsletter, getOneNewsletter, updateNewletter, removeNewsletter } from "../services";
import {Request, Response} from "express";

export const saveNewletter = async (req: Request, res: Response) => {
    const {title, content} = req.body;
    const userId = req.user?.id;


    const userExist = await findOne(userId as string);

    if (!userExist) {
        res.status(404).json({message: "User does not exist or user is not logged in"})
        return
    };


    try {
        const data: Newsletter = {
            title,
            content,
            newsletterOwnerId: userId as string
        };

        const newsletter = await createNewsletter(data);
         res.status(201).json({
            message: "Email saved",
            email: newsletter
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const findAllNewsletter = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    try {
        const newsletters = await getAllNewsletter(userId as string);
         res.status(200).json({
            message: "Request successful",
            email: newsletters || [],
        });
    } catch (error) {
        console.error(error);
         res.status(500).json({ message: "Internal server error" });
         return;
    }
};


export const findOneNewsletter = async (req: Request, res: Response) => {
    const { Id } = req.params;
    const newsletter = await getOneNewsletter(Id);
    if (!newsletter) {
        res.status(404).json({message:"Email does not exist"});
        return;
    };

    res.status(200).json({
        message: "Request successfull",
        email: newsletter
    })
}


export const updateNewsletter = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { Id } = req.params;
    const { title, content } = req.body;

    if (!userId) {
        res.status(401).json({ message: "User is not authenticated" });
        return
    }

    try {
        const [userExist, newsletter] = await Promise.all([
            findOne(userId as string),
            getOneNewsletter(Id)
        ]);

        if (!userExist || !newsletter) {
            res.status(404).json({ message: "Newsletter or user does not exist" });
            return
        }

        if (userExist._id.toString() !== newsletter.newsletterOwnerId.toString()) {
            res.status(403).json({ message: "You can only update your own newsletter" });
            return
        }

        const data: Partial<Newsletter> = {
            title: title || newsletter.title,
            content: content || newsletter.content,
        }

        const updatedNewsletter = await updateNewletter(Id, data);

        res.status(200).json({
            message: "Newsletter updated successfully",
            email: updatedNewsletter,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteNewsletter = async (req:Request, res: Response) => {
    const newsletterId = req.params.Id;
    const userId = req.user?.id;
    try {
        const [userExist, newsletter] = await Promise.all([
            findOne(userId as string),
            getOneNewsletter(newsletterId)
        ]);

        if (!userExist || !newsletter) {
            res.status(404).json({ message: "Newsletter or user does not exist" });
            return
        }

        if (userExist._id.toString() !== newsletter.newsletterOwnerId.toString()) {
             res.status(403).json({ message: "You can only delete your own newsletter" });
             return
        }

        const remove = await removeNewsletter(newsletterId);
        res.status(200).json({
            message: "Newsletter deleted successfully",
            email: remove,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}