import axios from 'axios';
import { createMembership } from './membership.service';

export const verifyPaystackTransaction = async (event: any) => {
  const transactionRef = event.data.identification?.reference;
  
  if (!transactionRef) {
    throw new Error('Transaction reference not found in the event data');
  }

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${transactionRef}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}` // Make sure to replace with your live or test key
      }
    });

    // Return the response data (this will include status and other transaction details)
    return response.data;

  } catch (error: any) {
    // Log and throw an error if something goes wrong
    console.error("Error verifying Paystack transaction:", error);
    throw new Error(error.message || 'Error verifying Paystack transaction');
  }
};


// paystack webhook handler
export const handlePaystackWebhook = async (event: PaystackEvent) => {
  // Validate reference from webhook
  const transactionRef = event.data.identification?.reference;
  
  if (!transactionRef) {
    console.log("Invalid or missing transaction reference");
    return;
  }

  try {
    // Verify the transaction with Paystack
    const verify = await verifyPaystackTransaction(event);
    
    if (!verify.data) {
      console.log("No data received from Paystack verification");
      return;
    }

    // If the payment is successful, create the membership
    if (verify.data.status === 'successful') {
      const membership = await createMembership({
        user: event.data.email,  // Assuming email is the user identifier
        reference: verify.data.transactionRef,
        plan: verify.data.payment_type,  // You can map this to the actual plan name if needed
        status: verify.data.status,     // Assuming status comes from Paystack verification
      });

      console.log("Membership created successfully:", membership);
    }

    // If the transaction wasn't successful, log it (optional)
    if (verify.data.status !== 'successful') {
      console.log("Payment was not successful:", verify.data.status);
    }


  } catch (error) {
    console.log(error);
  }
};
