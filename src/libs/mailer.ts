import { verifyTransporter, sendMail } from "../config/mailer.config";


export const sendEmail = async (
    email: string,
    content: string,
    title: string
) => {
    let verify: boolean;
    try {
      verify = await verifyTransporter();
    } catch (error: unknown) {
      console.log(error);
      return { error: true, errorMessage: (error as Error).message };
    }
  
    if (!verify) return { error: true, errorMessage: "" };
  
    let mailOptions;

    try {
    
        mailOptions = {
          from: {
            name: "Seun newsletter",
            address: process.env.MAIL_USERNAME as string,
          },
          to: email,
          subject: title,
          html: content,
        };
        await sendMail(mailOptions);
        return { error: false, errorMessage: "" };
      } catch (error) {
        return { error: true, errorMessage: (error as Error).message };
      }
}