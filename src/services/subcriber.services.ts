import Subscriber from "../model/subscriber.model";

export const createSubscription = async (data: Partial<Subscriber>) => {
    try {
        const subscription = await Subscriber.create({
            ...data,
        });
        return subscription;
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw new Error("Unable to create subscription");
    }
};

export const findOneEmailSubscriber = async (email: string) => {
    const subcriber = await Subscriber.findOne({email: email});
    return subcriber;
}

export const findAllSubscribers = async (newsletterOwnerId?: string) => {
    try {
        const query = newsletterOwnerId ? { newsletterOwnerId } : {};
        const subscribers = await Subscriber.find(query);
        return subscribers;
    } catch (error) {
        console.error("Error finding subscribers:", error);
        throw new Error("Unable to find subscribers");
    }
};

export const findOneSubscriber = async (id: string) => {
    try {
        const subscriber = await Subscriber.findOne({ _id: id });
        return subscriber;
    } catch (error) {
        console.error("Error finding subscriber:", error);
        throw new Error("Unable to find subscriber");
    }
};

export const removeSubscriber = async (id: string) => {
    try {
        const subscription = await Subscriber.findOneAndDelete({ _id: id });
        return subscription;
    } catch (error) {
        console.error("Error removing subscriber:", error);
        throw new Error("Unable to remove subscriber");
    }
};
