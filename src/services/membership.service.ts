import membershipModel from "../model/membership.model";


export const createMembership = async (data: Partial<Membership>) => {
    const membership = await membershipModel.create({
        ...data
    });

    return membership;
}