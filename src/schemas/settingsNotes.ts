import mongoose from "mongoose";

export const settingsNotesSchema = new mongoose.Schema({
    archived: { type: Boolean, required: false, default: false },
    pinned: { type: Boolean, required: false, default: false },
    backgroundColor: { type: String, default: 'default', enum: ["default", "black", "white", "red"] },
})

export const settingsNotesModel = mongoose.model("settingsNotes", settingsNotesSchema)

