import dns from 'dns';
import axios from 'axios';
import neverbounce from "neverbounce";

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isDomainValid = async (email: string): Promise<boolean> => {
    const domain = email.split('@')[1];
    try {
        const records = await dns.promises.resolveMx(domain);
        return records && records.length > 0;
    } catch {
        return false;
    }
};

// Define the expected structure of the response from NeverBounce API
interface NeverBounceResponse {
    result: string; // The result field can have values like "valid", "invalid", etc.
    address: string;
    status: string;
    is_disposable: boolean;
    is_role_account: boolean;
    // Add more fields as per the actual response structure if needed
}

const validateEmailWithAPI = async (email: string): Promise<boolean> => {
    const API_KEY = process.env.NEVER_BOUNCE as string;
    const client = new neverbounce({ apiKey: API_KEY });

    try {
        // Await the result of the email validation check
        const result = await client.single.check(email) as NeverBounceResponse;

        // Check if the result is valid by inspecting the response structure
        if (result && result.result === 'valid') {
            return true; // Email is valid
        } else {
            return false; // Email is not valid or has some other status
        }
    } catch (error) {
        console.error('Error validating email:', error);
        return false; // Return false in case of any errors
    }
};



// Function to validate an email using ZeroBounce API
const zeroBounceValidator = async (email: string): Promise<boolean> => {
    const baseUrl = "https://api.zerobounce.net/v2";
    const uri = `${baseUrl}/validate?api_key=${process.env.ZERO_BOUNCE}&email=${email}`;

    try {
        // Send GET request to ZeroBounce API
        const response = await axios.get(uri);

        // Check if the response contains the required fields
        if (response.data && response.data.status === 'valid') {
            return true; // Email is valid
        } else {
            console.log('Invalid email:', response.data);
            return false; // Email is invalid or something went wrong
        }
    } catch (error) {
        console.error('Error validating email:', error);
        return false; // Return false if there was an error with the API call
    }
};


export const validateEmail = async (email: string): Promise<boolean> => {
    if (!isValidEmail(email)) return false;
   // if (!(await isDomainValid(email))) return false;
    //if (!(await validateEmailWithAPI(email))) return false;
    return true;
};
