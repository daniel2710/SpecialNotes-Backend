import mongoose from "mongoose";

const WorkSpaceSchema = new mongoose.Schema({
    name: { type: String, default: 'My workspace', required: true },
    description: { type: String, default: 'My workspace' },
    theme: { type: String, default: 'light', enum: ["dark", "light"] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

export const WorkSpaceModel = mongoose.model("WorkSpace", WorkSpaceSchema);


