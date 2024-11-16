import membershipModel from "../model/membership.model";


export const createMembership = async (data: Partial<Membership>) => {
    const membership = await membershipModel.create({
        ...data
    });

    return membership;
}

export const findMembership = async (user:string) => {
    const membership = await membershipModel.findOne({
        user: user
    });
    return membership;
}

export const updateMembership = async (user: string, data: Partial<Membership>) => {
    const membership = await membershipModel.findOneAndUpdate({user: user}, {
        ...data
    }, {new: true});

    return membership
}