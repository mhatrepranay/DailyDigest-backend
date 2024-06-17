
import express from 'express';
import { getArticleAnalytics, getUserAnalytics } from '../controller/analyticsController.js';

const AnalyticsRouter = express.Router();

// Add this line to include the analytics route
AnalyticsRouter.get('/analytics/users', getUserAnalytics);
AnalyticsRouter.get('/analytics/article', getArticleAnalytics);

export default AnalyticsRouter;
