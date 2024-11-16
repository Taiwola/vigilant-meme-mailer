import {Request, Response} from "express";
import crypto from "crypto";
import { findOneByEmail } from "../services";
import { handlePaystackWebhook } from "../services/payment.services";

export const paystackWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
        const event: PaystackEvent = req.body;
  
        // Validate event using signature
        const hash = crypto.createHmac('sha512', process.env.PAYSTACK_TEST_KEY as string)
            .update(JSON.stringify(req.body)).digest('hex');
  
        if (hash !== req.headers['x-paystack-signature']) {
            console.log("Invalid event received");
            return
        }
  
        // Retrieve user by email
        const user = await findOneByEmail(event.data.email as string);
  
        if (!user) {
            console.log("User not found:", event.data.email);
            return
        }
  
  
        // Event is validated and processed
        handlePaystackWebhook(event);
  
        // Acknowledge the event
        res.sendStatus(200);
    } catch (error) {
        console.error("Error handling webhook:", error);
        res.sendStatus(500); // Internal server error
    }
  };