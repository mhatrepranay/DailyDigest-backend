import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    user: {
        type: Object,

    },
    content: {
        type: String,

    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    user: {
        type: Object,

    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    comments: [CommentSchema]
}, { timestamps: true });

const ArticleModel1 = mongoose.model("Article", ArticleSchema);

export default ArticleModel1;
