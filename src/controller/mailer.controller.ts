import {Request, Response} from "express";
import { getOneNewsletter, findAllSubscribers, findOne } from "../services";
import { sendEmail } from "../libs/mailer";


export const sendMail = async (req: Request, res: Response) => {

    const { Id } = req.params;
    const userId = req.user?.id;
    const {content} = req.body;

    const [newsletter, user] = await Promise.all([
        getOneNewsletter(Id),
        findOne(userId as string)
    ]);

    if (!newsletter) {
        res.status(404).json({ message: "Email does not exist, save mail as draft before sending" });
        return
    }

    if (!user) {
        res.status(404).json({ message: "User does not exist" });
        return;
    }

    try {
        const getAllSubscribers = await findAllSubscribers(user._id.toString());
        const mailContent = content || newsletter.content;
        if (!mailContent) {
            res.status(400).json({ message: "Email content is missing" });
            return
        }
        const convertToHtml = jsonToHtml(mailContent);
        const emailPromises = getAllSubscribers.map(async (sub) => {
            const { error, errorMessage } = await sendEmail(sub.email, convertToHtml, newsletter.title, user.name);
            if (error) throw new Error(errorMessage);
        });

        await Promise.all(emailPromises);

        res.status(200).json({ message: "Email sent successfully" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ 
            message: process.env.NODE_ENV === 'production' ? "Internal server error" : error.message 
        });
    }
};


export const jsonToHtml = (jsonContent: string): string => {
    try {
        const template = JSON.parse(jsonContent); // Parse the JSON content
        const body = template.body;

        if (!body || !body.rows) {
            throw new Error("Invalid template format.");
        }

        // Helper function to generate content
        const renderContent = (content: any): string => {
            if (content.type === "text") {
                const style = `
                    font-size: ${content.values.fontSize || "16px"};
                    text-align: ${content.values.textAlign || "left"};
                    line-height: ${content.values.lineHeight || "1.5"};
                    color: ${content.values.textColor || "#000"};
                    padding: ${content.values.containerPadding || "0px"};
                `;
                return `<div style="${style}">${content.values.text}</div>`;
            }
        
            if (content.type === "html") {
                // This handles embedded HTML content directly
                return content.values.html;
            }
        
            if (content.type === "image") {
                const style = `
                    width: ${content.values.width || "auto"};
                    height: ${content.values.height || "auto"};
                    max-width: ${content.values.maxWidth || "100%"};
                    padding: ${content.values.containerPadding || "0px"};
                `;
                return `
                    <div style="${style}">
                        <img src="${content.values.url}" alt="${content.values.alt || "Image"}" style="display: block; width: 100%; height: auto;" />
                    </div>
                `;
            }
        
            // Add support for other content types if needed
            return "";
        };

        // Helper function to render columns
        const renderColumn = (column: any): string => {
            const columnContents = column.contents.map(renderContent).join("");
            return `<div>${columnContents}</div>`;
        };

        // Helper function to render rows
        const renderRow = (row: any): string => {
            const rowColumns = row.columns.map(renderColumn).join("");
            return `<div style="padding: ${row.values.padding || "0px"};">${rowColumns}</div>`;
        };

        // Generate HTML by traversing rows
        const htmlBody = body.rows.map(renderRow).join("");

        // Wrap in basic HTML structure
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Template</title>
            </head>
            <body style="font-family: ${body.values.fontFamily.value || "Arial, sans-serif"}; background-color: ${body.values.backgroundColor || "#FFFFFF"};">
                ${htmlBody}
            </body>
            </html>
        `;

        return fullHtml;
    } catch (error) {
        console.error("Error converting JSON to HTML:", error);
        throw new Error("Failed to convert JSON to HTML.");
    }
};

