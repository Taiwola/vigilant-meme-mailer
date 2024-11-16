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