// controllers/analyticsController.js

import CatchAsyncError from "../error/catchAsyncErrors.js";
import ErrorHandler from "../error/errorHandler.js";
import ArticleModel1 from "../models/Newsmodel.js";
import UserModel1 from "../models/User1.js";


const generateLast12MonthData = async (model) => {
    const now = new Date();
    const data = [];

    for (let i = 11; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const start = new Date(month.getFullYear(), month.getMonth(), 1);
        const end = new Date(month.getFullYear(), month.getMonth() + 1, 1);

        const count = await model.countDocuments({
            createdAt: { $gte: start, $lt: end }
        });

        data.push({
            month: month.toLocaleString('default', { month: 'short' }),
            year: month.getFullYear(),
            count
        });
    }

    return data;
};

export const getUserAnalytics = CatchAsyncError(async (req, res, next) => {
    try {
        const users = await generateLast12MonthData(UserModel1);

        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
export const getArticleAnalytics = CatchAsyncError(async (req, res, next) => {
    try {
        const users = await generateLast12MonthData(ArticleModel1);

        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
