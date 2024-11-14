import Newletter from "../model/newletter.model";

export const createNewsletter = async (data: Partial<Newsletter>) => {
    const newsletter =await Newletter.create({
        ...data
    });

    return newsletter
}


export const getAllNewsletter = async (userId: string) => {
    let newsletter;
    if (userId) {
        newsletter = await Newletter.find({
            newsletterOwnerId: userId
        });
    }  else {
        newsletter = await Newletter.find();
    }
    return newsletter;
}

export const getOneNewsletter = async (id: string) => {
    const newsLetter = await Newletter.findOne({_id: id})
    return newsLetter;
}

export const updateNewletter = async (id: string, data: Partial<Newsletter>) => {
    const newsletter = await Newletter.findOneAndUpdate({_id: id}, {...data}, {new: true});
    return newsletter;
}


export const removeNewsletter = async (id: string) => {
    const newsletter = await Newletter.findOneAndDelete({_id: id});
    return newsletter
}