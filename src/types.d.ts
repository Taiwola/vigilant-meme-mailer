type User = {
    name: string,
    email: string,
    password: string,
}

type Newsletter = {
    newsletterOwnerId: string;
    title: string;
    content: string
}

type Subscriber = {
    newsletterOwnerId: string;
    email: string;
    source: string;
    status: string;
}

type Membership = {
    user: mongoose.Schema.Types.ObjectId; // reference to User model
    reference: string;
    plan?: string; // Optional field
    status: "pending" | "successful" | "failed"; // Enum field for status
  }


  type PaystackEvent = {
    event: string;
    data: {
        customer_id?: number;
        customer_code?: string;
        email?: string;
        name: string;
        identification?: {
            country?: string;
            type?: string;
            bvn?: string;
            account_number?: string;
            bank_code?: string;
            reference: string
        };
        reason?: string;
    };
  }