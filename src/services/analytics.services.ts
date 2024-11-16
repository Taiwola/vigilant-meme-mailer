import { Model, Document } from "mongoose";
import moment from "moment";

interface monthData {
    month: string;
    count: number;
}

// General function to get the last 7 months of analytics
export const generalAnalyticData = async <T extends Document>(
    model: Model<T>, // This allows any model extending Document
    newsletterOwnerId: string
): Promise<{ last7months: monthData[] }> => {
    try {
        // Get the last 7 months
        const months = Array.from({ length: 7 }, (_, i) => {
            const date = moment().subtract(i, 'months');
            return {
                month: date.format("MMMM"), // e.g., "January"
                yearMonth: date.format("YYYY-MM") // e.g., "2024-01" for precise querying
            };
        }).reverse(); // Order from oldest to most recent month

        // Aggregate data to count documents created in each of the last 7 months
        const aggregationResult = await model.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(months[0].yearMonth + "-01") }, // Assuming documents have a `createdAt` field
                    newsletterOwnerId: newsletterOwnerId, // Filter by the newsletter owner ID
                }
            },
            {
                $group: {
                    _id: { $substr: ["$createdAt", 0, 7] }, // Group by "YYYY-MM" format
                    count: { $sum: 1 }
                }
            }
        ]);

        // Map the aggregation results to the last 7 months data format
        const last7months:monthData[] = months.map(({ month, yearMonth }) => {
            const found = aggregationResult.find((entry: any) => entry._id === yearMonth);
            return {
                month,
                count: found ? found.count : 0
            };
        });

        return { last7months };
    } catch (error) {
        console.error("Error fetching general analytic data:", error);
        throw new Error("Unable to retrieve general analytic data.");
    }
};


export const generalAnalyticDataV2 = async <T extends Document>(model: Model<T>): Promise<{ last7months: monthData[] }> => {
    const last7months: monthData[] = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    for (let i = 6; i >= 0; i--) {
        const endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - i * 28
        );
        const startDate = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate() - 28
        );

        const monthYear = endDate.toLocaleDateString('default', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        const count = await model.countDocuments({
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            }
        });
        last7months.push({month: monthYear, count});
    }

    return {last7months};
}