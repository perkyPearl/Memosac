const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
    {
        albumName: {
            type: String,
            required: [true, "Please enter a title for your album"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "No description added",
        },
        coverImage: {
            type: Buffer,
            ref: "Gallery",
        },
        images: [
            {
                //arr of images
                type: Buffer,
                ref: "Gallery",
            },
        ],
        tags: [
            {
                //arr of tags
                type: String,
                trim: true,
                maxlength: 30,
            },
        ],
        isPublic: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        sharedWith: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: [],
            },
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                text: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        activityLog: [
            {
                action: {
                    type: String,
                    enum: [
                        "created",
                        "updated",
                        "deleted",
                        "shared",
                        "commented",
                    ],
                },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const albumModel = mongoose.model("Album", albumSchema);

module.exports = albumModel;
