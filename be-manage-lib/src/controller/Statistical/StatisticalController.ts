import { Response, Request, NextFunction } from "express"
import CategoryModels from "../../model/Category/Category";
import BookModels from "../../model/Book/Book";
const { ObjectId } = require('mongodb');
import AuthModels from "../../model/Auth/Auth";
import CallCardModels from "../..//model/CallCard/CallCard";

export const StatisticalCtr = {
    getStatistical: async (req: Request, res: Response) => {
        try {

            const countAuths = await AuthModels.find().lean().count();
            const countCategories = await CategoryModels.find().lean().count();
            const countBooks = await BookModels.find().lean().count();
            const countCallCards = await CallCardModels.aggregate([
                {
                    // group theo giá trị trường active
                    $group: {
                        _id: "$active",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        active: "$_id", // đổi tên trường _id thành active
                        count: 1,
                        _id: 0
                    }
                }
            ])

            const objCallCard = await countCallCards.reduce((obj, { active, count }) => ({
                ...obj,
                [active]: count
            }), {});

            return res.status(200).json(
                {
                    msg: "get statistical success !!",
                    data: {
                        countAuths,
                        countCategories,
                        countBooks,
                        countCallCards: objCallCard
                    }
                }
            )

        } catch (err) {
            return res.status(500).json({ msg: "Server Error", error: err.message })
        }
    },
}