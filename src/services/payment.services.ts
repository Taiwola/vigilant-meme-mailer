import axios from 'axios';
import { createMembership, findMembership, updateMembership } from './membership.service';

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
  
      // If the payment is successful
      if (verify.data.status === 'successful') {
          // Check if membership already exists
          const membershipExist = await findMembership(event.data.email as string);
  
          if (!membershipExist) {
              // Create a new membership if it doesn't exist
              const membership = await createMembership({
                  user: event.data.email,
                  reference: verify.data.transactionRef,
                  plan: verify.data.payment_type,
                  status: verify.data.status,
              });
  
              console.log("Membership created successfully:", membership);
          } else {
              // Update the existing membership if necessary
              const updatedMembership = await updateMembership(event.data.email as string, {
                  status: verify.data.status,
                  reference: verify.data.transactionRef,
                  plan: verify.data.payment_type,
              });
  
              console.log("Membership updated successfully:", updatedMembership);
          }
      } else {
        console.log("Payment was not successful:", verify.data.status);
      }
    } catch (error) {
      console.error("Error handling Paystack webhook:", error);
    }
  };
  